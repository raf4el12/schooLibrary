const cron = require("node-cron");
const prisma = require("../lib/prisma");

function startOverdueChecker() {
  // Ejecutar diariamente a medianoche
  cron.schedule("0 0 * * *", async () => {
    try {
      const now = new Date();

      // Buscar préstamos activos vencidos
      const overdueLoans = await prisma.loan.findMany({
        where: {
          status: "ACTIVE",
          dueDate: { lt: now },
        },
        select: {
          id: true,
          borrowerId: true,
        },
      });

      if (overdueLoans.length === 0) return;

      // IDs únicos de prestatarios con préstamos vencidos
      const borrowerIds = [...new Set(overdueLoans.map((l) => l.borrowerId))];
      const loanIds = overdueLoans.map((l) => l.id);

      // Transacción: marcar préstamos como OVERDUE + suspender prestatarios
      await prisma.$transaction([
        prisma.loan.updateMany({
          where: { id: { in: loanIds } },
          data: { status: "OVERDUE" },
        }),
        prisma.borrower.updateMany({
          where: { id: { in: borrowerIds } },
          data: { isActive: false },
        }),
      ]);

      console.log(
        `[Overdue Checker] ${overdueLoans.length} préstamo(s) marcado(s) como vencido(s), ${borrowerIds.length} prestatario(s) suspendido(s)`
      );
    } catch (error) {
      console.error("[Overdue Checker] Error:", error.message);
    }
  });

  console.log("[Overdue Checker] Cron job iniciado (diario a medianoche)");
}

module.exports = { startOverdueChecker };
