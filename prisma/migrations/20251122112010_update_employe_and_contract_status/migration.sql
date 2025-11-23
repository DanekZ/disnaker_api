/*
  Warnings:

  - You are about to drop the column `status_kontrak` on the `contracts` table. All the data in the column will be lost.
  - You are about to alter the column `tgl_mulai` on the `contracts` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `tgl_selesai` on the `contracts` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `contracts` DROP COLUMN `status_kontrak`,
    MODIFY `tgl_mulai` DATETIME NOT NULL,
    MODIFY `tgl_selesai` DATETIME NULL;

-- AlterTable
ALTER TABLE `employees` ADD COLUMN `status` VARCHAR(100) NULL;
