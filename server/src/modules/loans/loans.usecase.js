const prisma = require("../../lib/prisma");

async function getAllLoans(query = {}) {
  const { status, borrowerId, bookId } = query;

  const where = {};
  if (status) where.status = status;
  if (borrowerId) where.borrowerId = borrowerId;
  if (bookId) where.bookId = bookId;

  return prisma.loan.findMany({
    where,
    include: {
      borrower: true,
      book: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

async function getLoanById(id) {
  return prisma.loan.findUnique({
    where: { id },
    include: {
      borrower: true,
      book: true,
    },
  });
}

async function createLoan({ borrowerId, bookId, dueDate }) {
  const book = await prisma.book.findUnique({ where: { id: bookId } });

  if (!book) {
    return { error: "Libro no encontrado" };
  }

  if (book.availableCopies <= 0) {
    return { error: "No hay copias disponibles de este libro" };
  }

  const borrower = await prisma.borrower.findUnique({ where: { id: borrowerId } });

  if (!borrower) {
    return { error: "Prestatario no encontrado" };
  }

  const [loan] = await prisma.$transaction([
    prisma.loan.create({
      data: {
        borrowerId,
        bookId,
        dueDate: new Date(dueDate),
      },
      include: {
        borrower: true,
        book: true,
      },
    }),
    prisma.book.update({
      where: { id: bookId },
      data: { availableCopies: { decrement: 1 } },
    }),
  ]);

  return loan;
}

async function returnLoan(id) {
  const loan = await prisma.loan.findUnique({ where: { id } });

  if (!loan) {
    return { error: "Préstamo no encontrado" };
  }

  if (loan.status === "RETURNED") {
    return { error: "Este préstamo ya fue devuelto" };
  }

  const [updatedLoan] = await prisma.$transaction([
    prisma.loan.update({
      where: { id },
      data: {
        status: "RETURNED",
        returnedAt: new Date(),
      },
      include: {
        borrower: true,
        book: true,
      },
    }),
    prisma.book.update({
      where: { id: loan.bookId },
      data: { availableCopies: { increment: 1 } },
    }),
  ]);

  return updatedLoan;
}

async function deleteLoan(id) {
  const existing = await prisma.loan.findUnique({ where: { id } });
  if (!existing) return null;

  // If loan is active, restore the book's available copies
  if (existing.status === "ACTIVE") {
    await prisma.$transaction([
      prisma.loan.delete({ where: { id } }),
      prisma.book.update({
        where: { id: existing.bookId },
        data: { availableCopies: { increment: 1 } },
      }),
    ]);
  } else {
    await prisma.loan.delete({ where: { id } });
  }

  return true;
}

module.exports = { getAllLoans, getLoanById, createLoan, returnLoan, deleteLoan };
