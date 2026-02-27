const cron = require("node-cron");
const prisma = require("../lib/prisma");

function startOverdueChecker() {
  // Ejecutar diariamente a medianoche
  cron.schedule("0 0 * * *", async () => {
    try {
      const now = new Date();

      const result = await prisma.loan.updateMany({
        where: {
          status: "ACTIVE",
          dueDate: { lt: now },
        },
        data: {
          status: "OVERDUE",
        },
      });

      if (result.count > 0) {
        console.log(`[Overdue Checker] ${result.count} préstamo(s) marcado(s) como vencido(s)`);
      }
    } catch (error) {
      console.error("[Overdue Checker] Error:", error.message);
    }
  });

  console.log("[Overdue Checker] Cron job iniciado (diario a medianoche)");
}

module.exports = { startOverdueChecker };
