/*
  Warnings:

  - A unique constraint covering the columns `[employeeId]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "employeeId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Users_employeeId_key" ON "Users"("employeeId");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
