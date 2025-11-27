-- DropForeignKey
ALTER TABLE `role_permissions` DROP FOREIGN KEY `role_permissions_permission_id_fkey`;

-- DropForeignKey
ALTER TABLE `role_permissions` DROP FOREIGN KEY `role_permissions_role_id_fkey`;

-- DropIndex
DROP INDEX `role_permissions_permission_id_fkey` ON `role_permissions`;

-- CreateTable
CREATE TABLE `admins` (
    `username` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('perusahaan', 'disnaker') NOT NULL,
    `id_perusahaan` INTEGER NOT NULL,
    `token` VARCHAR(255) NULL,

    PRIMARY KEY (`username`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `app_roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_permission_id_fkey` FOREIGN KEY (`permission_id`) REFERENCES `app_permissions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
