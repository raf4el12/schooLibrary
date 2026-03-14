-- AlterTable: Add dni column with temporary default, then make it required
ALTER TABLE "borrowers" ADD COLUMN "dni" TEXT;

-- Set existing rows with a placeholder based on their code
UPDATE "borrowers" SET "dni" = "code" WHERE "dni" IS NULL;

-- Make column required
ALTER TABLE "borrowers" ALTER COLUMN "dni" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "borrowers_dni_key" ON "borrowers"("dni");
