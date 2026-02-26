const loansUsecase = require("./loans.usecase");

async function getAll(req, res) {
  try {
    const loans = await loansUsecase.getAllLoans(req.query);
    res.json(loans);
  } catch (error) {
    console.error("Error getting loans:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function getById(req, res) {
  try {
    const loan = await loansUsecase.getLoanById(req.params.id);

    if (!loan) {
      return res.status(404).json({ message: "Préstamo no encontrado" });
    }

    res.json(loan);
  } catch (error) {
    console.error("Error getting loan:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function create(req, res) {
  try {
    const { borrowerId, bookId, dueDate } = req.body;

    if (!borrowerId || !bookId || !dueDate) {
      return res.status(400).json({
        message: "borrowerId, bookId y dueDate son requeridos",
      });
    }

    const result = await loansUsecase.createLoan({ borrowerId, bookId, dueDate });

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating loan:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function returnLoan(req, res) {
  try {
    const result = await loansUsecase.returnLoan(req.params.id);

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    res.json(result);
  } catch (error) {
    console.error("Error returning loan:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function remove(req, res) {
  try {
    const deleted = await loansUsecase.deleteLoan(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Préstamo no encontrado" });
    }

    res.json({ message: "Préstamo eliminado correctamente" });
  } catch (error) {
    console.error("Error deleting loan:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

module.exports = { getAll, getById, create, returnLoan, remove };
