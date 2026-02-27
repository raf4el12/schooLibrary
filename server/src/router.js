const { Router } = require("express");
const { verifyToken } = require("./middlewares/auth.middleware");

const healthRoutes = require("./modules/health/health.routes");
const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/users/users.routes");
const authorRoutes = require("./modules/authors/authors.routes");
const categoryRoutes = require("./modules/categories/categories.routes");
const bookRoutes = require("./modules/books/books.routes");
const bookCopyRoutes = require("./modules/book-copies/book-copies.routes");
const borrowerRoutes = require("./modules/borrowers/borrowers.routes");
const loanRoutes = require("./modules/loans/loans.routes");
const penaltyRoutes = require("./modules/penalties/penalties.routes");

const router = Router();

// Rutas públicas
router.use("/health", healthRoutes);
router.use("/auth", authRoutes);

// Rutas protegidas
router.use("/users", verifyToken, userRoutes);
router.use("/authors", verifyToken, authorRoutes);
router.use("/categories", verifyToken, categoryRoutes);
router.use("/books", verifyToken, bookRoutes);
router.use("/book-copies", verifyToken, bookCopyRoutes);
router.use("/borrowers", verifyToken, borrowerRoutes);
router.use("/loans", verifyToken, loanRoutes);
router.use("/penalties", verifyToken, penaltyRoutes);

module.exports = router;
