-- CreateTable
CREATE TABLE `employees` (
    `id_karyawan` VARCHAR(191) NOT NULL,
    `NIK` VARCHAR(191) NOT NULL,
    `kode_jabatan` INTEGER NOT NULL,
    `kode_divisi` INTEGER NOT NULL,
    `id_perusahaan` VARCHAR(255) NOT NULL,
    `nama` VARCHAR(255) NOT NULL,
    `status` ENUM('baru', 'PKWT 1', 'PKWT 2', 'permanent') NOT NULL DEFAULT 'baru',

    UNIQUE INDEX `employees_NIK_key`(`NIK`),
    PRIMARY KEY (`id_karyawan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `positions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(255) NOT NULL,
    `company_id` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(255) NOT NULL,
    `username` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('candidate', 'company', 'disnaker') NOT NULL DEFAULT 'candidate',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `divisions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `company_id` VARCHAR(255) NOT NULL,
    `nama` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `company_profile` (
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
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `company_profile_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `disnaker_profiles` (
    `id` VARCHAR(255) NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    `divisi` ENUM('superadmin', 'adminlayanan', 'adminpelatihan', 'adminpkwt') NOT NULL DEFAULT 'adminlayanan',
    `full_name` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `disnaker_profiles_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contracts` (
    `id` VARCHAR(255) NOT NULL,
    `id_karyawan` VARCHAR(100) NOT NULL,
    `tgl_mulai` DATETIME(3) NOT NULL,
    `masa_kontrak` INTEGER NOT NULL,
    `kontrak_file` VARCHAR(255) NULL,
    `status_kontrak` ENUM('disetujui', 'ditolak', 'pending') NOT NULL DEFAULT 'pending',
    `pesan` VARCHAR(255) NULL,
    `id_disnaker` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `employees` ADD CONSTRAINT `employees_id_perusahaan_fkey` FOREIGN KEY (`id_perusahaan`) REFERENCES `company_profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employees` ADD CONSTRAINT `employees_kode_jabatan_fkey` FOREIGN KEY (`kode_jabatan`) REFERENCES `positions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employees` ADD CONSTRAINT `employees_kode_divisi_fkey` FOREIGN KEY (`kode_divisi`) REFERENCES `divisions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `positions` ADD CONSTRAINT `positions_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `company_profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `divisions` ADD CONSTRAINT `divisions_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `company_profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `company_profile` ADD CONSTRAINT `company_profile_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `company_profile` ADD CONSTRAINT `company_profile_disnaker_id_fkey` FOREIGN KEY (`disnaker_id`) REFERENCES `disnaker_profiles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `disnaker_profiles` ADD CONSTRAINT `disnaker_profiles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contracts` ADD CONSTRAINT `contracts_id_karyawan_fkey` FOREIGN KEY (`id_karyawan`) REFERENCES `employees`(`id_karyawan`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contracts` ADD CONSTRAINT `contracts_id_disnaker_fkey` FOREIGN KEY (`id_disnaker`) REFERENCES `disnaker_profiles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
