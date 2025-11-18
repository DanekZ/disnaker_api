-- DropForeignKey
ALTER TABLE `company_profile` DROP FOREIGN KEY `company_profile_disnaker_id_fkey`;

-- DropIndex
DROP INDEX `company_profile_disnaker_id_fkey` ON `company_profile`;

-- AlterTable
ALTER TABLE `company_profile` MODIFY `company_logo` VARCHAR(255) NULL,
    MODIFY `website` VARCHAR(255) NULL,
    MODIFY `disnaker_id` VARCHAR(255) NULL;

-- AddForeignKey
ALTER TABLE `company_profile` ADD CONSTRAINT `company_profile_disnaker_id_fkey` FOREIGN KEY (`disnaker_id`) REFERENCES `disnaker_profiles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
