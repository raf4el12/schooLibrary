const bcrypt = require("bcryptjs");
const prisma = require("../../lib/prisma");

const userSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

async function getAllUsers() {
  return prisma.user.findMany({
    select: userSelect,
    orderBy: { createdAt: "desc" },
  });
}

async function getUserById(id) {
  return prisma.user.findUnique({
    where: { id },
    select: userSelect,
  });
}

async function createUser(data) {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  return prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
      role: data.role || "LIBRARIAN",
    },
    select: userSelect,
  });
}

async function updateUser(id, data) {
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) return null;

  const updateData = {};
  if (data.email !== undefined) updateData.email = data.email;
  if (data.name !== undefined) updateData.name = data.name;
  if (data.role !== undefined) updateData.role = data.role;
  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }

  return prisma.user.update({
    where: { id },
    data: updateData,
    select: userSelect,
  });
}

async function deleteUser(id) {
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) return null;

  await prisma.user.delete({ where: { id } });
  return true;
}

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };
