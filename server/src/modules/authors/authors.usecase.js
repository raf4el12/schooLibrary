const prisma = require("../../lib/prisma");

async function getAllAuthors(query = {}) {
  const { search } = query;

  const where = search
    ? { name: { contains: search, mode: "insensitive" } }
    : {};

  return prisma.author.findMany({
    where,
    include: { _count: { select: { books: true } } },
    orderBy: { createdAt: "desc" },
  });
}

async function getAuthorById(id) {
  return prisma.author.findUnique({
    where: { id },
    include: {
      books: {
        include: { _count: { select: { copies: true } } },
      },
    },
  });
}

async function createAuthor(data) {
  return prisma.author.create({
    data: { name: data.name },
  });
}

async function updateAuthor(id, data) {
  const existing = await prisma.author.findUnique({ where: { id } });
  if (!existing) return null;

  return prisma.author.update({
    where: { id },
    data: { name: data.name },
  });
}

async function deleteAuthor(id) {
  const existing = await prisma.author.findUnique({ where: { id } });
  if (!existing) return null;

  await prisma.author.delete({ where: { id } });
  return true;
}

module.exports = { getAllAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor };
