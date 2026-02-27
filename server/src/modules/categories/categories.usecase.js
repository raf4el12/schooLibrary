const prisma = require("../../lib/prisma");

async function getAllCategories(query = {}) {
  const { search } = query;

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { prefix: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};

  return prisma.category.findMany({
    where,
    include: { _count: { select: { books: true } } },
    orderBy: { createdAt: "desc" },
  });
}

async function getCategoryById(id) {
  return prisma.category.findUnique({
    where: { id },
    include: {
      books: {
        include: { _count: { select: { copies: true } } },
      },
    },
  });
}

async function createCategory(data) {
  const prefix = normalizePrefix(data.prefix);
  if (!prefix) {
    return { error: "El prefijo debe tener exactamente 3 caracteres" };
  }

  return prisma.category.create({
    data: {
      name: data.name,
      prefix,
    },
  });
}

async function updateCategory(id, data) {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) return null;

  const updateData = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.prefix !== undefined) {
    const prefix = normalizePrefix(data.prefix);
    if (!prefix) {
      return { error: "El prefijo debe tener exactamente 3 caracteres" };
    }
    updateData.prefix = prefix;
  }

  return prisma.category.update({ where: { id }, data: updateData });
}

async function deleteCategory(id) {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) return null;

  await prisma.category.delete({ where: { id } });
  return true;
}

function normalizePrefix(prefix) {
  if (!prefix || typeof prefix !== "string") return null;
  const normalized = prefix.trim().toUpperCase();
  if (normalized.length !== 3) return null;
  return normalized;
}

module.exports = { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
