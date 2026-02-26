const { Router } = require("express");
const {
  getAll,
  getById,
  create,
  returnLoan,
  remove,
} = require("./loans.controller");

const router = Router();

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", create);
router.patch("/:id/return", returnLoan);
router.delete("/:id", remove);

module.exports = router;
