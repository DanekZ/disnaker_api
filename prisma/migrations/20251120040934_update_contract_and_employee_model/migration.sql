/*
  Warnings:

  - You are about to alter the column `status_kontrak` on the `contracts` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(2))` to `Enum(EnumId(4))`.
  - You are about to drop the column `status` on the `employees` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `contracts` ADD COLUMN `status_persetujuan` ENUM('disetujui', 'ditolak', 'pending') NOT NULL DEFAULT 'pending',
    MODIFY `status_kontrak` ENUM('baru', 'PKWT 1', 'PKWT 2', 'permanent') NOT NULL DEFAULT 'baru';

-- AlterTable
ALTER TABLE `employees` DROP COLUMN `status`;
