const prisma = require("../../lib/prisma");

async function getAllBooks(query = {}) {
  const { search } = query;

  const where = search
    ? {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { author: { contains: search, mode: "insensitive" } },
          { isbn: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};

  return prisma.book.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
}

async function getBookById(id) {
  return prisma.book.findUnique({
    where: { id },
    include: {
      loans: {
        where: { status: "ACTIVE" },
        include: { borrower: true },
      },
    },
  });
}

async function createBook(data) {
  const copies = data.totalCopies ? parseInt(data.totalCopies) : 1;

  return prisma.book.create({
    data: {
      title: data.title,
      author: data.author,
      isbn: data.isbn || null,
      totalCopies: copies,
      availableCopies: copies,
    },
  });
}

async function updateBook(id, data) {
  const existing = await prisma.book.findUnique({ where: { id } });
  if (!existing) return null;

  const updateData = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.author !== undefined) updateData.author = data.author;
  if (data.isbn !== undefined) updateData.isbn = data.isbn || null;
  if (data.totalCopies !== undefined) {
    const newTotal = parseInt(data.totalCopies);
    const diff = newTotal - existing.totalCopies;
    updateData.totalCopies = newTotal;
    updateData.availableCopies = existing.availableCopies + diff;
  }

  return prisma.book.update({ where: { id }, data: updateData });
}

async function deleteBook(id) {
  const existing = await prisma.book.findUnique({ where: { id } });
  if (!existing) return null;

  await prisma.book.delete({ where: { id } });
  return true;
}

module.exports = { getAllBooks, getBookById, createBook, updateBook, deleteBook };
