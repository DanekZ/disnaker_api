/*
  Warnings:

  - The primary key for the `contracts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_admin` on the `contracts` table. All the data in the column will be lost.
  - You are about to drop the column `id_kontrak` on the `contracts` table. All the data in the column will be lost.
  - You are about to alter the column `id_karyawan` on the `contracts` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to drop the `admins` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `companies` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id]` on the table `contracts` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `contracts` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `id_disnaker` to the `contracts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_id` to the `divisions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_id` to the `positions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `admins` DROP FOREIGN KEY `admins_id_perusahaan_fkey`;

-- DropForeignKey
ALTER TABLE `contracts` DROP FOREIGN KEY `contracts_id_admin_fkey`;

-- DropForeignKey
ALTER TABLE `contracts` DROP FOREIGN KEY `contracts_id_karyawan_fkey`;

-- DropForeignKey
ALTER TABLE `employees` DROP FOREIGN KEY `employees_id_admin_fkey`;

-- DropForeignKey
ALTER TABLE `employees` DROP FOREIGN KEY `employees_id_perusahaan_fkey`;

-- DropIndex
DROP INDEX `contracts_id_admin_fkey` ON `contracts`;

-- DropIndex
DROP INDEX `contracts_id_karyawan_fkey` ON `contracts`;

-- DropIndex
DROP INDEX `employees_id_admin_fkey` ON `employees`;

-- DropIndex
DROP INDEX `employees_id_perusahaan_fkey` ON `employees`;

-- AlterTable
ALTER TABLE `contracts` DROP PRIMARY KEY,
    DROP COLUMN `id_admin`,
    DROP COLUMN `id_kontrak`,
    ADD COLUMN `id` VARCHAR(255) NOT NULL,
    ADD COLUMN `id_disnaker` VARCHAR(255) NOT NULL,
    MODIFY `id_karyawan` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `divisions` ADD COLUMN `company_id` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `positions` ADD COLUMN `company_id` VARCHAR(255) NOT NULL;

-- DropTable
DROP TABLE `admins`;

-- DropTable
DROP TABLE `companies`;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(255) NOT NULL,
    `username` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('candidate', 'company', 'disnaker') NOT NULL DEFAULT 'candidate',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_id_key`(`id`),
    UNIQUE INDEX `users_username_key`(`username`),
    UNIQUE INDEX `users_email_key`(`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `company_profile` (
    `id` VARCHAR(255) NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    `company_name` VARCHAR(255) NOT NULL,
    `company_logo` VARCHAR(255) NOT NULL,
    `no_handphone` VARCHAR(20) NOT NULL,
    `province` VARCHAR(255) NOT NULL,
    `city` VARCHAR(255) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `website` VARCHAR(255) NOT NULL,
    `about_company` VARCHAR(255) NOT NULL,
    `status` ENUM('approved by disnaker', 'pending', 'rejected') NOT NULL DEFAULT 'pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `company_profile_id_key`(`id`),
    UNIQUE INDEX `company_profile_user_id_key`(`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `disnaker_profiles` (
    `id` VARCHAR(255) NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    `divisi` ENUM('superadmin', 'adminlayanan', 'adminpelatihan', 'adminpkwt') NOT NULL DEFAULT 'adminlayanan',
    `full_name` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `disnaker_profiles_id_key`(`id`),
    UNIQUE INDEX `disnaker_profiles_user_id_key`(`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `contracts_id_key` ON `contracts`(`id`);

-- AddForeignKey
ALTER TABLE `positions` ADD CONSTRAINT `positions_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `company_profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `divisions` ADD CONSTRAINT `divisions_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `company_profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `company_profile` ADD CONSTRAINT `company_profile_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `disnaker_profiles` ADD CONSTRAINT `disnaker_profiles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contracts` ADD CONSTRAINT `contracts_id_karyawan_fkey` FOREIGN KEY (`id_karyawan`) REFERENCES `employees`(`id_karyawan`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contracts` ADD CONSTRAINT `contracts_id_disnaker_fkey` FOREIGN KEY (`id_disnaker`) REFERENCES `disnaker_profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
