/*
  Warnings:

  - You are about to drop the column `deadline` on the `LabWork` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `LabWork` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `LabWork` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LabWork" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "disciplineId" INTEGER NOT NULL,
    CONSTRAINT "LabWork_disciplineId_fkey" FOREIGN KEY ("disciplineId") REFERENCES "Discipline" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_LabWork" ("disciplineId", "id", "title") SELECT "disciplineId", "id", "title" FROM "LabWork";
DROP TABLE "LabWork";
ALTER TABLE "new_LabWork" RENAME TO "LabWork";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
