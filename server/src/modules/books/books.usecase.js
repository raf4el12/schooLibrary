const prisma = require("../../lib/prisma");

const bookIncludes = {
  authors: true,
  categories: true,
  _count: { select: { copies: true } },
};

async function getAllBooks(query = {}) {
  const { search } = query;

  const where = search
    ? {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { isbn: { contains: search, mode: "insensitive" } },
          { authors: { some: { name: { contains: search, mode: "insensitive" } } } },
        ],
      }
    : {};

  return prisma.book.findMany({
    where,
    include: bookIncludes,
    orderBy: { createdAt: "desc" },
  });
}

async function getBookById(id) {
  return prisma.book.findUnique({
    where: { id },
    include: {
      ...bookIncludes,
      copies: {
        orderBy: { inventoryCode: "asc" },
      },
    },
  });
}

async function createBook(data) {
  const { title, isbn, publishedYear, authorIds, categoryIds } = data;

  return prisma.book.create({
    data: {
      title,
      isbn: isbn || null,
      publishedYear: publishedYear ? parseInt(publishedYear) : null,
      authors: authorIds?.length
        ? { connect: authorIds.map((id) => ({ id })) }
        : undefined,
      categories: categoryIds?.length
        ? { connect: categoryIds.map((id) => ({ id })) }
        : undefined,
    },
    include: bookIncludes,
  });
}

async function updateBook(id, data) {
  const existing = await prisma.book.findUnique({ where: { id } });
  if (!existing) return null;

  const updateData = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.isbn !== undefined) updateData.isbn = data.isbn || null;
  if (data.publishedYear !== undefined) {
    updateData.publishedYear = data.publishedYear ? parseInt(data.publishedYear) : null;
  }
  if (data.authorIds !== undefined) {
    updateData.authors = { set: data.authorIds.map((id) => ({ id })) };
  }
  if (data.categoryIds !== undefined) {
    updateData.categories = { set: data.categoryIds.map((id) => ({ id })) };
  }

  return prisma.book.update({
    where: { id },
    data: updateData,
    include: bookIncludes,
  });
}

async function deleteBook(id) {
  const existing = await prisma.book.findUnique({
    where: { id },
    include: { _count: { select: { copies: true } } },
  });
  if (!existing) return null;

  if (existing._count.copies > 0) {
    return { error: "No se puede eliminar un libro que tiene ejemplares registrados" };
  }

  await prisma.book.delete({ where: { id } });
  return true;
}

module.exports = { getAllBooks, getBookById, createBook, updateBook, deleteBook };
