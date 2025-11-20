/*
  Warnings:

  - You are about to alter the column `tgl_mulai` on the `contracts` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime`.
  - Added the required column `tgl_selesai` to the `contracts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `contracts` ADD COLUMN `tgl_selesai` DATETIME NOT NULL,
    MODIFY `tgl_mulai` DATETIME NOT NULL;
