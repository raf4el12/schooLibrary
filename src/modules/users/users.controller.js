const usersUsecase = require("./users.usecase");

async function getAll(req, res) {
  try {
    const users = await usersUsecase.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Error getting users:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function getById(req, res) {
  try {
    const user = await usersUsecase.getUserById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error getting user:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function create(req, res) {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        message: "Email, contraseña y nombre son requeridos",
      });
    }

    const user = await usersUsecase.createUser({ email, password, name, role });
    res.status(201).json(user);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Ya existe un usuario con ese email" });
    }
    console.error("Error creating user:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function update(req, res) {
  try {
    const user = await usersUsecase.updateUser(req.params.id, req.body);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Ya existe un usuario con ese email" });
    }
    console.error("Error updating user:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function remove(req, res) {
  try {
    const deleted = await usersUsecase.deleteUser(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

module.exports = { getAll, getById, create, update, remove };
