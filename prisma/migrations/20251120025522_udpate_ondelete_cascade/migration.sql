-- DropForeignKey
ALTER TABLE `company_profile` DROP FOREIGN KEY `company_profile_disnaker_id_fkey`;

-- DropForeignKey
ALTER TABLE `company_profile` DROP FOREIGN KEY `company_profile_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `contracts` DROP FOREIGN KEY `contracts_id_disnaker_fkey`;

-- DropForeignKey
ALTER TABLE `contracts` DROP FOREIGN KEY `contracts_id_karyawan_fkey`;

-- DropForeignKey
ALTER TABLE `disnaker_profiles` DROP FOREIGN KEY `disnaker_profiles_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `divisions` DROP FOREIGN KEY `divisions_company_id_fkey`;

-- DropForeignKey
ALTER TABLE `employees` DROP FOREIGN KEY `employees_id_perusahaan_fkey`;

-- DropForeignKey
ALTER TABLE `employees` DROP FOREIGN KEY `employees_kode_divisi_fkey`;

-- DropForeignKey
ALTER TABLE `employees` DROP FOREIGN KEY `employees_kode_jabatan_fkey`;

-- DropForeignKey
ALTER TABLE `positions` DROP FOREIGN KEY `positions_company_id_fkey`;

-- DropIndex
DROP INDEX `company_profile_disnaker_id_fkey` ON `company_profile`;

-- DropIndex
DROP INDEX `contracts_id_disnaker_fkey` ON `contracts`;

-- DropIndex
DROP INDEX `contracts_id_karyawan_fkey` ON `contracts`;

-- DropIndex
DROP INDEX `divisions_company_id_fkey` ON `divisions`;

-- DropIndex
DROP INDEX `employees_id_perusahaan_fkey` ON `employees`;

-- DropIndex
DROP INDEX `employees_kode_divisi_fkey` ON `employees`;

-- DropIndex
DROP INDEX `employees_kode_jabatan_fkey` ON `employees`;

-- DropIndex
DROP INDEX `positions_company_id_fkey` ON `positions`;

-- AddForeignKey
ALTER TABLE `employees` ADD CONSTRAINT `employees_id_perusahaan_fkey` FOREIGN KEY (`id_perusahaan`) REFERENCES `company_profile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employees` ADD CONSTRAINT `employees_kode_jabatan_fkey` FOREIGN KEY (`kode_jabatan`) REFERENCES `positions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employees` ADD CONSTRAINT `employees_kode_divisi_fkey` FOREIGN KEY (`kode_divisi`) REFERENCES `divisions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `positions` ADD CONSTRAINT `positions_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `company_profile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `divisions` ADD CONSTRAINT `divisions_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `company_profile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `company_profile` ADD CONSTRAINT `company_profile_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `company_profile` ADD CONSTRAINT `company_profile_disnaker_id_fkey` FOREIGN KEY (`disnaker_id`) REFERENCES `disnaker_profiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `disnaker_profiles` ADD CONSTRAINT `disnaker_profiles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contracts` ADD CONSTRAINT `contracts_id_karyawan_fkey` FOREIGN KEY (`id_karyawan`) REFERENCES `employees`(`id_karyawan`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contracts` ADD CONSTRAINT `contracts_id_disnaker_fkey` FOREIGN KEY (`id_disnaker`) REFERENCES `disnaker_profiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
