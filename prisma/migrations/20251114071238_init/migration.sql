-- CreateTable
CREATE TABLE `employees` (
    `id_karyawan` VARCHAR(191) NOT NULL,
    `NIK` VARCHAR(191) NOT NULL,
    `kode_jabatan` INTEGER NOT NULL,
    `kode_divisi` INTEGER NOT NULL,
    `id_perusahaan` INTEGER NOT NULL,
    `nama` VARCHAR(255) NOT NULL,
    `status` ENUM('baru', 'PKWT_1', 'PKWT_2', 'permanent') NOT NULL DEFAULT 'baru',
    `id_admin` INTEGER NOT NULL,

    UNIQUE INDEX `employees_NIK_key`(`NIK`),
    PRIMARY KEY (`id_karyawan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `positions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `divisions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `companies` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(255) NOT NULL,
    `izin` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admins` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `id_perusahaan` INTEGER NOT NULL,
    `role` ENUM('perusahaan', 'disnaker') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contracts` (
    `id_kontrak` VARCHAR(191) NOT NULL,
    `id_karyawan` VARCHAR(191) NOT NULL,
    `tgl_mulai` DATETIME(3) NOT NULL,
    `masa_kontrak` INTEGER NOT NULL,
    `kontrak_file` VARCHAR(255) NOT NULL,
    `status` ENUM('disetujui', 'ditolak') NOT NULL,
    `pesan` VARCHAR(255) NOT NULL,
    `id_admin` INTEGER NOT NULL,

    PRIMARY KEY (`id_kontrak`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `employees` ADD CONSTRAINT `employees_kode_jabatan_fkey` FOREIGN KEY (`kode_jabatan`) REFERENCES `positions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employees` ADD CONSTRAINT `employees_kode_divisi_fkey` FOREIGN KEY (`kode_divisi`) REFERENCES `divisions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employees` ADD CONSTRAINT `employees_id_perusahaan_fkey` FOREIGN KEY (`id_perusahaan`) REFERENCES `companies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employees` ADD CONSTRAINT `employees_id_admin_fkey` FOREIGN KEY (`id_admin`) REFERENCES `admins`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `admins` ADD CONSTRAINT `admins_id_perusahaan_fkey` FOREIGN KEY (`id_perusahaan`) REFERENCES `companies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contracts` ADD CONSTRAINT `contracts_id_karyawan_fkey` FOREIGN KEY (`id_karyawan`) REFERENCES `employees`(`id_karyawan`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contracts` ADD CONSTRAINT `contracts_id_admin_fkey` FOREIGN KEY (`id_admin`) REFERENCES `admins`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
