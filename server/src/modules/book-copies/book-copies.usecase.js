const prisma = require("../../lib/prisma");

async function getAllBookCopies(query = {}) {
  const { search, bookId, isAvailable } = query;

  const where = {};

  if (search) {
    where.OR = [
      { inventoryCode: { contains: search, mode: "insensitive" } },
      { book: { title: { contains: search, mode: "insensitive" } } },
    ];
  }

  if (bookId) where.bookId = bookId;
  if (isAvailable !== undefined) where.isAvailable = isAvailable === "true";

  return prisma.bookCopy.findMany({
    where,
    include: {
      book: {
        include: { authors: true, categories: true },
      },
    },
    orderBy: { inventoryCode: "asc" },
  });
}

async function getBookCopyById(id) {
  return prisma.bookCopy.findUnique({
    where: { id },
    include: {
      book: {
        include: { authors: true, categories: true },
      },
      loans: {
        where: { status: { in: ["ACTIVE", "OVERDUE"] } },
        include: { borrower: true },
      },
    },
  });
}

async function generateInventoryCode(bookId) {
  const book = await prisma.book.findUnique({
    where: { id: bookId },
    include: { categories: { take: 1 } },
  });

  if (!book) return null;

  const prefix = book.categories.length > 0 ? book.categories[0].prefix : "GEN";

  const lastCopy = await prisma.bookCopy.findFirst({
    where: { inventoryCode: { startsWith: prefix } },
    orderBy: { inventoryCode: "desc" },
  });

  let nextNumber = 1;
  if (lastCopy) {
    const parts = lastCopy.inventoryCode.split("-");
    const lastNum = parseInt(parts[1], 10);
    if (!isNaN(lastNum)) nextNumber = lastNum + 1;
  }

  return `${prefix}-${String(nextNumber).padStart(3, "0")}`;
}

async function registerBookCopy(data) {
  const { bookId, condition } = data;

  const book = await prisma.book.findUnique({ where: { id: bookId } });
  if (!book) {
    return { error: "Libro no encontrado" };
  }

  const MAX_RETRIES = 3;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const inventoryCode = await generateInventoryCode(bookId);
    if (!inventoryCode) {
      return { error: "No se pudo generar el código de inventario" };
    }

    try {
      const copy = await prisma.bookCopy.create({
        data: {
          bookId,
          inventoryCode,
          condition: condition || "GOOD",
        },
        include: {
          book: {
            include: { authors: true, categories: true },
          },
        },
      });
      return copy;
    } catch (error) {
      if (error.code === "P2002" && attempt < MAX_RETRIES - 1) {
        continue;
      }
      throw error;
    }
  }
}

async function updateBookCopy(id, data) {
  const existing = await prisma.bookCopy.findUnique({ where: { id } });
  if (!existing) return null;

  const updateData = {};
  if (data.condition !== undefined) updateData.condition = data.condition;

  return prisma.bookCopy.update({
    where: { id },
    data: updateData,
    include: {
      book: {
        include: { authors: true, categories: true },
      },
    },
  });
}

async function deleteBookCopy(id) {
  const existing = await prisma.bookCopy.findUnique({
    where: { id },
    include: {
      loans: {
        where: { status: { in: ["ACTIVE", "OVERDUE"] } },
      },
    },
  });
  if (!existing) return null;

  if (existing.loans.length > 0) {
    return { error: "No se puede eliminar un ejemplar con préstamos activos" };
  }

  await prisma.bookCopy.delete({ where: { id } });
  return true;
}

module.exports = { getAllBookCopies, getBookCopyById, registerBookCopy, updateBookCopy, deleteBookCopy };
