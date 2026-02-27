const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@schoolibrary.com" },
    update: {},
    create: {
      email: "admin@schoolibrary.com",
      name: "Administrador",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin user:", admin.email);

  // Categories
  const categoriesData = [
    { name: "Literatura", prefix: "LIT" },
    { name: "Ciencias", prefix: "CIE" },
    { name: "Matemáticas", prefix: "MAT" },
    { name: "Historia", prefix: "HIS" },
    { name: "Tecnología", prefix: "TEC" },
  ];

  const categories = [];
  for (const cat of categoriesData) {
    const category = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
    categories.push(category);
  }

  console.log(`${categories.length} categorías creadas`);

  // Authors
  const authorsData = [
    "Gabriel García Márquez",
    "Mario Vargas Llosa",
    "Isaac Asimov",
    "Carl Sagan",
    "Stephen Hawking",
  ];

  const authors = [];
  for (const name of authorsData) {
    const existing = await prisma.author.findFirst({ where: { name } });
    if (existing) {
      authors.push(existing);
    } else {
      const author = await prisma.author.create({ data: { name } });
      authors.push(author);
    }
  }

  console.log(`${authors.length} autores creados`);

  // Books with relations
  const booksData = [
    {
      title: "Cien años de soledad",
      isbn: "978-0307474728",
      publishedYear: 1967,
      authorIndices: [0],
      categoryIndices: [0],
    },
    {
      title: "La ciudad y los perros",
      isbn: "978-8420471839",
      publishedYear: 1963,
      authorIndices: [1],
      categoryIndices: [0],
    },
    {
      title: "Fundación",
      isbn: "978-0553293357",
      publishedYear: 1951,
      authorIndices: [2],
      categoryIndices: [1, 4],
    },
    {
      title: "Cosmos",
      isbn: "978-0345539434",
      publishedYear: 1980,
      authorIndices: [3],
      categoryIndices: [1],
    },
    {
      title: "Breve historia del tiempo",
      isbn: "978-0553380163",
      publishedYear: 1988,
      authorIndices: [4],
      categoryIndices: [1, 2],
    },
  ];

  const books = [];
  for (const bookData of booksData) {
    const existing = bookData.isbn
      ? await prisma.book.findUnique({ where: { isbn: bookData.isbn } })
      : null;

    if (existing) {
      books.push(existing);
    } else {
      const book = await prisma.book.create({
        data: {
          title: bookData.title,
          isbn: bookData.isbn,
          publishedYear: bookData.publishedYear,
          authors: {
            connect: bookData.authorIndices.map((i) => ({ id: authors[i].id })),
          },
          categories: {
            connect: bookData.categoryIndices.map((i) => ({ id: categories[i].id })),
          },
        },
      });
      books.push(book);
    }
  }

  console.log(`${books.length} libros creados`);

  // Book Copies
  let copiesCreated = 0;
  for (let i = 0; i < books.length; i++) {
    const book = books[i];
    const prefix = categoriesData[booksData[i].categoryIndices[0]].prefix;

    const existingCopies = await prisma.bookCopy.count({ where: { bookId: book.id } });
    if (existingCopies > 0) continue;

    const copiesToCreate = 2;
    for (let j = 0; j < copiesToCreate; j++) {
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

      const inventoryCode = `${prefix}-${String(nextNumber).padStart(3, "0")}`;

      await prisma.bookCopy.create({
        data: {
          bookId: book.id,
          inventoryCode,
          condition: "GOOD",
        },
      });
      copiesCreated++;
    }
  }

  console.log(`${copiesCreated} ejemplares creados`);

  // Borrowers
  const borrowersData = [
    { name: "Juan Pérez", email: "juan@school.edu", grade: "4to Secundaria", type: "STUDENT" },
    { name: "María López", email: "maria@school.edu", grade: "5to Secundaria", type: "STUDENT" },
    { name: "Carlos García", email: "carlos@school.edu", grade: "3ro Secundaria", type: "STUDENT" },
    { name: "Prof. Ana Torres", email: "ana.torres@school.edu", type: "TEACHER" },
  ];

  let borrowersCreated = 0;
  for (const data of borrowersData) {
    const existing = data.email
      ? await prisma.borrower.findFirst({ where: { email: data.email } })
      : null;

    if (existing) continue;

    const prefix = data.type === "TEACHER" ? "DOC" : "EST";
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

    const code = `${prefix}-${String(nextNumber).padStart(3, "0")}`;

    await prisma.borrower.create({
      data: {
        code,
        name: data.name,
        email: data.email || null,
        grade: data.grade || null,
        type: data.type,
      },
    });
    borrowersCreated++;
  }

  console.log(`${borrowersCreated} prestatarios creados`);

  console.log("Seed completado exitosamente");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
