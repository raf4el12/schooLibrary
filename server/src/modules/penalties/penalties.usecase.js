const prisma = require("../../lib/prisma");

async function getAllPenalties(query = {}) {
  const { borrowerId, resolved } = query;

  const where = {};
  if (borrowerId) where.borrowerId = borrowerId;
  if (resolved !== undefined) where.resolved = resolved === "true";

  return prisma.penalty.findMany({
    where,
    include: {
      borrower: true,
      loan: {
        include: {
          bookCopy: {
            include: { book: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

async function getPenaltyById(id) {
  return prisma.penalty.findUnique({
    where: { id },
    include: {
      borrower: true,
      loan: {
        include: {
          bookCopy: {
            include: { book: true },
          },
        },
      },
    },
  });
}

async function resolvePenalty(id) {
  const penalty = await prisma.penalty.findUnique({ where: { id } });

  if (!penalty) {
    return { error: "Penalidad no encontrada", status: 404 };
  }

  if (penalty.resolved) {
    return { error: "Esta penalidad ya fue resuelta" };
  }

  // Contar otras penalties no resueltas del mismo borrower (excluyendo esta)
  const otherPending = await prisma.penalty.count({
    where: {
      borrowerId: penalty.borrowerId,
      id: { not: id },
      resolved: false,
    },
  });

  const operations = [
    prisma.penalty.update({
      where: { id },
      data: {
        resolved: true,
        resolvedAt: new Date(),
      },
      include: {
        borrower: true,
        loan: {
          include: {
            bookCopy: {
              include: { book: true },
            },
          },
        },
      },
    }),
  ];

  // Solo reactivar borrower si no tiene otras penalties pendientes
  if (otherPending === 0) {
    operations.push(
      prisma.borrower.update({
        where: { id: penalty.borrowerId },
        data: { isActive: true },
      })
    );
  }

  const [updatedPenalty] = await prisma.$transaction(operations);

  return updatedPenalty;
}

module.exports = { getAllPenalties, getPenaltyById, resolvePenalty };
