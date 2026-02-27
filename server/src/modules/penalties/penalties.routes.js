const { Router } = require("express");
const {
  getAll,
  getById,
  resolve,
} = require("./penalties.controller");

const router = Router();

router.get("/", getAll);
router.get("/:id", getById);
router.patch("/:id/resolve", resolve);

module.exports = router;
