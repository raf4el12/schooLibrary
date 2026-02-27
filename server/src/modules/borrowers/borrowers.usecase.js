const prisma = require("../../lib/prisma");

async function generateBorrowerCode(type) {
  const prefix = type === "TEACHER" ? "DOC" : "EST";

  const lastBorrower = await prisma.borrower.findFirst({
    where: { code: { startsWith: prefix } },
    orderBy: { code: "desc" },
  });

  let nextNumber = 1;
  if (lastBorrower) {
    const parts = lastBorrower.code.split("-");
    const lastNum = parseInt(parts[1], 10);
    if (!isNaN(lastNum)) nextNumber = lastNum + 1;
  }

  return `${prefix}-${String(nextNumber).padStart(3, "0")}`;
}

async function getAllBorrowers(query = {}) {
  const { search, type, isActive } = query;

  const where = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { code: { contains: search, mode: "insensitive" } },
      { grade: { contains: search, mode: "insensitive" } },
    ];
  }

  if (type) where.type = type;
  if (isActive !== undefined) where.isActive = isActive === "true";

  return prisma.borrower.findMany({
    where,
    include: {
      _count: { select: { loans: true, penalties: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

async function getBorrowerById(id) {
  return prisma.borrower.findUnique({
    where: { id },
    include: {
      penalties: {
        orderBy: { createdAt: "desc" },
      },
      loans: {
        include: {
          bookCopy: {
            include: { book: true },
          },
        },
        orderBy: { borrowedAt: "desc" },
      },
    },
  });
}

async function createBorrower(data) {
  const type = data.type || "STUDENT";
  const code = await generateBorrowerCode(type);

  return prisma.borrower.create({
    data: {
      code,
      name: data.name,
      email: data.email || null,
      grade: data.grade || null,
      type,
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
  if (data.isActive !== undefined) updateData.isActive = data.isActive;

  return prisma.borrower.update({ where: { id }, data: updateData });
}

async function deleteBorrower(id) {
  const existing = await prisma.borrower.findUnique({ where: { id } });
  if (!existing) return null;

  await prisma.borrower.delete({ where: { id } });
  return true;
}

module.exports = { getAllBorrowers, getBorrowerById, createBorrower, updateBorrower, deleteBorrower };
