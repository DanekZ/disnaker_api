/*
  Warnings:

  - Added the required column `disnaker_id` to the `company_profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `company_profile` ADD COLUMN `disnaker_id` VARCHAR(255) NOT NULL;

-- AddForeignKey
ALTER TABLE `company_profile` ADD CONSTRAINT `company_profile_disnaker_id_fkey` FOREIGN KEY (`disnaker_id`) REFERENCES `disnaker_profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
