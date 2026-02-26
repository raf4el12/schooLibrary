const prisma = require("../../lib/prisma");

async function getAllBorrowers(query = {}) {
  const { search, type } = query;

  const where = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { grade: { contains: search, mode: "insensitive" } },
    ];
  }

  if (type) {
    where.type = type;
  }

  return prisma.borrower.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
}

async function getBorrowerById(id) {
  return prisma.borrower.findUnique({
    where: { id },
    include: {
      loans: {
        include: { book: true },
        orderBy: { borrowedAt: "desc" },
      },
    },
  });
}

async function createBorrower(data) {
  return prisma.borrower.create({
    data: {
      name: data.name,
      email: data.email || null,
      grade: data.grade || null,
      type: data.type || "STUDENT",
    },
  });
}

async function updateBorrower(id, data) {
  const existing = await prisma.borrower.findUnique({ where: { id } });
  if (!existing) return null;

  const updateData = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.email !== undefined) updateData.email = data.email || null;
  if (data.grade !== undefined) updateData.grade = data.grade || null;
  if (data.type !== undefined) updateData.type = data.type;

  return prisma.borrower.update({ where: { id }, data: updateData });
}

async function deleteBorrower(id) {
  const existing = await prisma.borrower.findUnique({ where: { id } });
  if (!existing) return null;

  await prisma.borrower.delete({ where: { id } });
  return true;
}

module.exports = { getAllBorrowers, getBorrowerById, createBorrower, updateBorrower, deleteBorrower };
