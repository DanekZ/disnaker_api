-- AlterTable
ALTER TABLE `employees` MODIFY `id_perusahaan` VARCHAR(255) NOT NULL;

-- AddForeignKey
ALTER TABLE `employees` ADD CONSTRAINT `employees_id_perusahaan_fkey` FOREIGN KEY (`id_perusahaan`) REFERENCES `company_profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
