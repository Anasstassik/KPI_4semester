/*
  Warnings:

  - Added the required column `deadline` to the `LabWork` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LabWork" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "deadline" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'До виконання',
    "disciplineId" INTEGER NOT NULL,
    CONSTRAINT "LabWork_disciplineId_fkey" FOREIGN KEY ("disciplineId") REFERENCES "Discipline" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_LabWork" ("disciplineId", "id", "title") SELECT "disciplineId", "id", "title" FROM "LabWork";
DROP TABLE "LabWork";
ALTER TABLE "new_LabWork" RENAME TO "LabWork";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
