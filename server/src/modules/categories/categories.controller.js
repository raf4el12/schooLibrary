const categoriesUsecase = require("./categories.usecase");

async function getAll(req, res) {
  try {
    const categories = await categoriesUsecase.getAllCategories(req.query);
    res.json(categories);
  } catch (error) {
    console.error("Error getting categories:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function getById(req, res) {
  try {
    const category = await categoriesUsecase.getCategoryById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    res.json(category);
  } catch (error) {
    console.error("Error getting category:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function create(req, res) {
  try {
    const { name, prefix } = req.body;

    if (!name || !prefix) {
      return res.status(400).json({ message: "Nombre y prefijo son requeridos" });
    }

    const result = await categoriesUsecase.createCategory({ name, prefix });

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    res.status(201).json(result);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Ya existe una categoría con ese nombre o prefijo" });
    }
    console.error("Error creating category:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function update(req, res) {
  try {
    const result = await categoriesUsecase.updateCategory(req.params.id, req.body);

    if (!result) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    res.json(result);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Ya existe una categoría con ese nombre o prefijo" });
    }
    console.error("Error updating category:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function remove(req, res) {
  try {
    const deleted = await categoriesUsecase.deleteCategory(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    res.json({ message: "Categoría eliminada correctamente" });
  } catch (error) {
    if (error.code === "P2003") {
      return res.status(409).json({ message: "No se puede eliminar una categoría que tiene libros asociados" });
    }
    console.error("Error deleting category:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

module.exports = { getAll, getById, create, update, remove };
