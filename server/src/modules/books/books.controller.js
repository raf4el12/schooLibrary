const booksUsecase = require("./books.usecase");

async function getAll(req, res) {
  try {
    const books = await booksUsecase.getAllBooks(req.query);
    res.json(books);
  } catch (error) {
    console.error("Error getting books:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function getById(req, res) {
  try {
    const book = await booksUsecase.getBookById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }

    res.json(book);
  } catch (error) {
    console.error("Error getting book:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function create(req, res) {
  try {
    const { title, author, isbn, totalCopies } = req.body;

    if (!title || !author) {
      return res.status(400).json({ message: "Título y autor son requeridos" });
    }

    const book = await booksUsecase.createBook({ title, author, isbn, totalCopies });
    res.status(201).json(book);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Ya existe un libro con ese ISBN" });
    }
    console.error("Error creating book:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function update(req, res) {
  try {
    const book = await booksUsecase.updateBook(req.params.id, req.body);

    if (!book) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }

    res.json(book);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Ya existe un libro con ese ISBN" });
    }
    console.error("Error updating book:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function remove(req, res) {
  try {
    const deleted = await booksUsecase.deleteBook(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }

    res.json({ message: "Libro eliminado correctamente" });
  } catch (error) {
    console.error("Error deleting book:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

module.exports = { getAll, getById, create, update, remove };
