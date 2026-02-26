const borrowersUsecase = require("./borrowers.usecase");

async function getAll(req, res) {
  try {
    const borrowers = await borrowersUsecase.getAllBorrowers(req.query);
    res.json(borrowers);
  } catch (error) {
    console.error("Error getting borrowers:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function getById(req, res) {
  try {
    const borrower = await borrowersUsecase.getBorrowerById(req.params.id);

    if (!borrower) {
      return res.status(404).json({ message: "Prestatario no encontrado" });
    }

    res.json(borrower);
  } catch (error) {
    console.error("Error getting borrower:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function create(req, res) {
  try {
    const { name, email, grade, type } = req.body;

    if (!name) {
      return res.status(400).json({ message: "El nombre es requerido" });
    }

    const borrower = await borrowersUsecase.createBorrower({ name, email, grade, type });
    res.status(201).json(borrower);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Ya existe un prestatario con ese email" });
    }
    console.error("Error creating borrower:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function update(req, res) {
  try {
    const borrower = await borrowersUsecase.updateBorrower(req.params.id, req.body);

    if (!borrower) {
      return res.status(404).json({ message: "Prestatario no encontrado" });
    }

    res.json(borrower);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Ya existe un prestatario con ese email" });
    }
    console.error("Error updating borrower:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function remove(req, res) {
  try {
    const deleted = await borrowersUsecase.deleteBorrower(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Prestatario no encontrado" });
    }

    res.json({ message: "Prestatario eliminado correctamente" });
  } catch (error) {
    console.error("Error deleting borrower:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

module.exports = { getAll, getById, create, update, remove };
