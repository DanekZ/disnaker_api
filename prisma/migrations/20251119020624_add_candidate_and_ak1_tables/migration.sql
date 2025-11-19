/*
  Warnings:

  - You are about to drop the column `createdAt` on the `disnaker_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `disnaker_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `company_profile` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updated_at` to the `disnaker_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.
  - The required column `user_id` was added to the `users` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE `company_profile` DROP FOREIGN KEY `company_profile_disnaker_id_fkey`;

-- DropForeignKey
ALTER TABLE `company_profile` DROP FOREIGN KEY `company_profile_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `disnaker_profiles` DROP FOREIGN KEY `disnaker_profiles_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `divisions` DROP FOREIGN KEY `divisions_company_id_fkey`;

-- DropForeignKey
ALTER TABLE `employees` DROP FOREIGN KEY `employees_id_perusahaan_fkey`;

-- DropForeignKey
ALTER TABLE `positions` DROP FOREIGN KEY `positions_company_id_fkey`;

-- DropIndex
DROP INDEX `divisions_company_id_fkey` ON `divisions`;

-- DropIndex
DROP INDEX `employees_id_perusahaan_fkey` ON `employees`;

-- DropIndex
DROP INDEX `positions_company_id_fkey` ON `positions`;

-- DropIndex
DROP INDEX `users_id_key` ON `users`;

-- AlterTable
ALTER TABLE `disnaker_profiles` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- DropIndex


-- AlterTable
ALTER TABLE `users` DROP COLUMN `createdAt`,
    DROP COLUMN `id`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    ADD COLUMN `user_id` VARCHAR(255) NOT NULL,
    ADD PRIMARY KEY (`user_id`);

-- DropTable
DROP TABLE `company_profile`;

-- CreateTable
CREATE TABLE `company_profiles` (
    `id` VARCHAR(255) NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    `company_name` VARCHAR(255) NOT NULL,
    `company_logo` VARCHAR(255) NULL,
    `no_handphone` VARCHAR(20) NOT NULL,
    `province` VARCHAR(255) NOT NULL,
    `city` VARCHAR(255) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `website` VARCHAR(255) NULL,
    `about_company` VARCHAR(255) NOT NULL,
    `status` ENUM('approved by disnaker', 'pending', 'rejected') NOT NULL DEFAULT 'pending',
    `disnaker_id` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `company_profiles_id_key`(`id`),
    UNIQUE INDEX `company_profiles_user_id_key`(`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `candidate_profiles` (
    `candidate_id` VARCHAR(255) NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(255) NOT NULL,
    `birthdate` DATE NOT NULL,
    `place_of_birth` VARCHAR(255) NOT NULL,
    `nik` VARCHAR(191) NOT NULL,
    `province` VARCHAR(255) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `postal_code` VARCHAR(20) NOT NULL,
    `gender` VARCHAR(20) NOT NULL,
    `no_handphone` VARCHAR(20) NOT NULL,
    `photo_profile` VARCHAR(255) NULL,
    `last_education` VARCHAR(255) NOT NULL,
    `graduation_year` INTEGER NOT NULL,
    `status_perkawinan` VARCHAR(50) NOT NULL,
    `cv_file` VARCHAR(255) NULL,
    `ak1_file` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `candidate_profiles_user_id_key`(`user_id`),
    UNIQUE INDEX `candidate_profiles_nik_key`(`nik`),
    PRIMARY KEY (`candidate_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `candidate_ak1_documents` (
    `ak1_document_id` VARCHAR(255) NOT NULL,
    `candidate_id` VARCHAR(255) NOT NULL,
    `ktp` VARCHAR(255) NOT NULL,
    `ijazah` VARCHAR(255) NOT NULL,
    `pas_photo` VARCHAR(255) NOT NULL,
    `certificate` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`ak1_document_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `candidate_ak1_cards` (
    `ak1_card_id` VARCHAR(255) NOT NULL,
    `ak1_document_id` VARCHAR(255) NOT NULL,
    `disnaker_id` VARCHAR(255) NOT NULL,
    `status` ENUM('approved', 'rejected') NOT NULL,
    `file` VARCHAR(255) NOT NULL,
    `note` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `candidate_ak1_cards_ak1_document_id_key`(`ak1_document_id`),
    PRIMARY KEY (`ak1_card_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `employees` ADD CONSTRAINT `employees_id_perusahaan_fkey` FOREIGN KEY (`id_perusahaan`) REFERENCES `company_profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `positions` ADD CONSTRAINT `positions_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `company_profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `divisions` ADD CONSTRAINT `divisions_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `company_profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `company_profiles` ADD CONSTRAINT `company_profiles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `company_profiles` ADD CONSTRAINT `company_profiles_disnaker_id_fkey` FOREIGN KEY (`disnaker_id`) REFERENCES `disnaker_profiles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `disnaker_profiles` ADD CONSTRAINT `disnaker_profiles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `candidate_profiles` ADD CONSTRAINT `candidate_profiles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `candidate_ak1_documents` ADD CONSTRAINT `candidate_ak1_documents_candidate_id_fkey` FOREIGN KEY (`candidate_id`) REFERENCES `candidate_profiles`(`candidate_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `candidate_ak1_cards` ADD CONSTRAINT `candidate_ak1_cards_ak1_document_id_fkey` FOREIGN KEY (`ak1_document_id`) REFERENCES `candidate_ak1_documents`(`ak1_document_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `candidate_ak1_cards` ADD CONSTRAINT `candidate_ak1_cards_disnaker_id_fkey` FOREIGN KEY (`disnaker_id`) REFERENCES `disnaker_profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
