/*
  Warnings:

  - Added the required column `updatedAt` to the `contracts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `contracts` DROP FOREIGN KEY `contracts_id_disnaker_fkey`;

-- DropIndex
DROP INDEX `contracts_id_disnaker_fkey` ON `contracts`;

-- AlterTable
ALTER TABLE `contracts` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AddForeignKey
ALTER TABLE `contracts` ADD CONSTRAINT `contracts_id_disnaker_fkey` FOREIGN KEY (`id_disnaker`) REFERENCES `disnaker_profiles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
