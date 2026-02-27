const prisma = require("../../lib/prisma");

const loanIncludes = {
  borrower: true,
  bookCopy: {
    include: { book: true },
  },
  processedBy: {
    select: { id: true, name: true, email: true },
  },
  penalty: true,
};

async function getAllLoans(query = {}) {
  const { status, borrowerId, bookCopyId, search } = query;

  const where = {};
  if (status) where.status = status;
  if (borrowerId) where.borrowerId = borrowerId;
  if (bookCopyId) where.bookCopyId = bookCopyId;

  if (search) {
    where.OR = [
      { borrower: { name: { contains: search, mode: "insensitive" } } },
      { borrower: { code: { contains: search, mode: "insensitive" } } },
      { bookCopy: { inventoryCode: { contains: search, mode: "insensitive" } } },
      { bookCopy: { book: { title: { contains: search, mode: "insensitive" } } } },
    ];
  }

  return prisma.loan.findMany({
    where,
    include: loanIncludes,
    orderBy: { createdAt: "desc" },
  });
}

async function getLoanById(id) {
  return prisma.loan.findUnique({
    where: { id },
    include: loanIncludes,
  });
}

async function borrowBook({ borrowerIdentifier, inventoryCode, userId }) {
  // Buscar borrower por id o code
  const borrower = await prisma.borrower.findFirst({
    where: {
      OR: [
        { id: borrowerIdentifier },
        { code: borrowerIdentifier },
      ],
    },
  });

  if (!borrower) {
    return { error: "Prestatario no encontrado" };
  }

  if (!borrower.isActive) {
    return { error: "Prestatario suspendido" };
  }

  // Buscar bookCopy por inventoryCode
  const bookCopy = await prisma.bookCopy.findUnique({
    where: { inventoryCode },
  });

  if (!bookCopy) {
    return { error: "Ejemplar no encontrado" };
  }

  if (!bookCopy.isAvailable) {
    return { error: "Ejemplar no disponible" };
  }

  // Calcular dueDate según tipo de prestatario
  const daysToAdd = borrower.type === "TEACHER" ? 15 : 7;
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + daysToAdd);

  // Transaction: crear loan + marcar copia como no disponible
  const [loan] = await prisma.$transaction([
    prisma.loan.create({
      data: {
        borrowerId: borrower.id,
        bookCopyId: bookCopy.id,
        loanedBy: userId,
        dueDate,
      },
      include: loanIncludes,
    }),
    prisma.bookCopy.update({
      where: { id: bookCopy.id },
      data: { isAvailable: false },
    }),
  ]);

  return loan;
}

async function returnBook({ inventoryCode, condition }) {
  // Buscar bookCopy por inventoryCode
  const bookCopy = await prisma.bookCopy.findUnique({
    where: { inventoryCode },
  });

  if (!bookCopy) {
    return { error: "Ejemplar no encontrado" };
  }

  // Buscar loan activo o vencido para esta copia
  const loan = await prisma.loan.findFirst({
    where: {
      bookCopyId: bookCopy.id,
      status: { in: ["ACTIVE", "OVERDUE"] },
    },
    include: { borrower: true },
  });

  if (!loan) {
    return { error: "No se encontró un préstamo activo para este ejemplar" };
  }

  const now = new Date();
  const isOverdue = now > loan.dueDate;

  const operations = [
    // Actualizar loan
    prisma.loan.update({
      where: { id: loan.id },
      data: {
        status: "RETURNED",
        returnedAt: now,
      },
      include: loanIncludes,
    }),
    // Restaurar disponibilidad de la copia
    prisma.bookCopy.update({
      where: { id: bookCopy.id },
      data: {
        isAvailable: true,
        ...(condition ? { condition } : {}),
      },
    }),
  ];

  if (isOverdue) {
    const diffTime = Math.abs(now - loan.dueDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    operations.push(
      prisma.penalty.create({
        data: {
          borrowerId: loan.borrowerId,
          loanId: loan.id,
          reason: `Devolución con ${diffDays} día(s) de retraso`,
        },
      })
    );

    operations.push(
      prisma.borrower.update({
        where: { id: loan.borrowerId },
        data: { isActive: false },
      })
    );
  }

  const [updatedLoan] = await prisma.$transaction(operations);

  return updatedLoan;
}

async function deleteLoan(id) {
  const existing = await prisma.loan.findUnique({ where: { id } });
  if (!existing) return null;

  if (existing.status === "ACTIVE" || existing.status === "OVERDUE") {
    await prisma.$transaction([
      prisma.loan.delete({ where: { id } }),
      prisma.bookCopy.update({
        where: { id: existing.bookCopyId },
        data: { isAvailable: true },
      }),
    ]);
  } else {
    await prisma.loan.delete({ where: { id } });
  }

  return true;
}

module.exports = { getAllLoans, getLoanById, borrowBook, returnBook, deleteLoan };
