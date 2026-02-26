const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);

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

  console.log("Seed completed. Admin user created:", admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
