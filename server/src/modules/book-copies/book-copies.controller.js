const bookCopiesUsecase = require("./book-copies.usecase");

async function getAll(req, res) {
  try {
    const copies = await bookCopiesUsecase.getAllBookCopies(req.query);
    res.json(copies);
  } catch (error) {
    console.error("Error getting book copies:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function getById(req, res) {
  try {
    const copy = await bookCopiesUsecase.getBookCopyById(req.params.id);

    if (!copy) {
      return res.status(404).json({ message: "Ejemplar no encontrado" });
    }

    res.json(copy);
  } catch (error) {
    console.error("Error getting book copy:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function create(req, res) {
  try {
    const { bookId, condition } = req.body;

    if (!bookId) {
      return res.status(400).json({ message: "El bookId es requerido" });
    }

    const result = await bookCopiesUsecase.registerBookCopy({ bookId, condition });

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating book copy:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function update(req, res) {
  try {
    const copy = await bookCopiesUsecase.updateBookCopy(req.params.id, req.body);

    if (!copy) {
      return res.status(404).json({ message: "Ejemplar no encontrado" });
    }

    res.json(copy);
  } catch (error) {
    console.error("Error updating book copy:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function remove(req, res) {
  try {
    const result = await bookCopiesUsecase.deleteBookCopy(req.params.id);

    if (!result) {
      return res.status(404).json({ message: "Ejemplar no encontrado" });
    }

    if (result.error) {
      return res.status(409).json({ message: result.error });
    }

    res.json({ message: "Ejemplar eliminado correctamente" });
  } catch (error) {
    console.error("Error deleting book copy:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

module.exports = { getAll, getById, create, update, remove };
