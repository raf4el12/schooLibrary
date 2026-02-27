const penaltiesUsecase = require("./penalties.usecase");

async function getAll(req, res) {
  try {
    const penalties = await penaltiesUsecase.getAllPenalties(req.query);
    res.json(penalties);
  } catch (error) {
    console.error("Error getting penalties:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function getById(req, res) {
  try {
    const penalty = await penaltiesUsecase.getPenaltyById(req.params.id);

    if (!penalty) {
      return res.status(404).json({ message: "Penalidad no encontrada" });
    }

    res.json(penalty);
  } catch (error) {
    console.error("Error getting penalty:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function resolve(req, res) {
  try {
    const result = await penaltiesUsecase.resolvePenalty(req.params.id);

    if (result.error) {
      const status = result.status || 400;
      return res.status(status).json({ message: result.error });
    }

    res.json(result);
  } catch (error) {
    console.error("Error resolving penalty:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

module.exports = { getAll, getById, resolve };
