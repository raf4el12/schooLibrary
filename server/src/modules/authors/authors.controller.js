const authorsUsecase = require("./authors.usecase");

async function getAll(req, res) {
  try {
    const authors = await authorsUsecase.getAllAuthors(req.query);
    res.json(authors);
  } catch (error) {
    console.error("Error getting authors:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function getById(req, res) {
  try {
    const author = await authorsUsecase.getAuthorById(req.params.id);

    if (!author) {
      return res.status(404).json({ message: "Autor no encontrado" });
    }

    res.json(author);
  } catch (error) {
    console.error("Error getting author:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function create(req, res) {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "El nombre es requerido" });
    }

    const author = await authorsUsecase.createAuthor({ name });
    res.status(201).json(author);
  } catch (error) {
    console.error("Error creating author:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function update(req, res) {
  try {
    const author = await authorsUsecase.updateAuthor(req.params.id, req.body);

    if (!author) {
      return res.status(404).json({ message: "Autor no encontrado" });
    }

    res.json(author);
  } catch (error) {
    console.error("Error updating author:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function remove(req, res) {
  try {
    const deleted = await authorsUsecase.deleteAuthor(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Autor no encontrado" });
    }

    res.json({ message: "Autor eliminado correctamente" });
  } catch (error) {
    if (error.code === "P2003") {
      return res.status(409).json({ message: "No se puede eliminar un autor que tiene libros asociados" });
    }
    console.error("Error deleting author:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

module.exports = { getAll, getById, create, update, remove };
