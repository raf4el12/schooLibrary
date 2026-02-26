const { Router } = require("express");
const { verifyToken } = require("./middlewares/auth.middleware");

const healthRoutes = require("./modules/health/health.routes");
const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/users/users.routes");
const bookRoutes = require("./modules/books/books.routes");
const borrowerRoutes = require("./modules/borrowers/borrowers.routes");
const loanRoutes = require("./modules/loans/loans.routes");

const router = Router();

// Rutas públicas
router.use("/health", healthRoutes);
router.use("/auth", authRoutes);

// Rutas protegidas
router.use("/users", verifyToken, userRoutes);
router.use("/books", verifyToken, bookRoutes);
router.use("/borrowers", verifyToken, borrowerRoutes);
router.use("/loans", verifyToken, loanRoutes);

module.exports = router;
