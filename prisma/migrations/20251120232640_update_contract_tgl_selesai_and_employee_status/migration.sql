/*
  Warnings:

  - You are about to alter the column `tgl_mulai` on the `contracts` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - The values [PKWT 1,PKWT 2] on the enum `contracts_status_kontrak` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `tgl_selesai` on the `contracts` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `contracts` MODIFY `tgl_mulai` DATETIME NOT NULL,
    MODIFY `status_kontrak` ENUM('baru', 'PKWT_1', 'PKWT_2', 'permanent') NOT NULL DEFAULT 'baru',
    MODIFY `tgl_selesai` DATETIME NULL;
