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

-- CreateTable
CREATE TABLE `jobs` (
    `jobs_id` VARCHAR(255) NOT NULL,
    `company_id` VARCHAR(255) NOT NULL,
    `job_title` VARCHAR(255) NOT NULL,
    `job_type` ENUM('full-time', 'part-time', 'internship', 'contract', 'freelance') NOT NULL,
    `job_description` VARCHAR(2000) NOT NULL,
    `category` VARCHAR(255) NOT NULL,
    `min_salary` INTEGER NOT NULL,
    `max_salary` INTEGER NOT NULL,
    `experience_required` VARCHAR(255) NOT NULL,
    `education_required` VARCHAR(255) NOT NULL,
    `skills_required` VARCHAR(255) NOT NULL,
    `work_setup` VARCHAR(255) NOT NULL,
    `application_deadline` DATETIME(3) NOT NULL,
    `disnaker_id` VARCHAR(255) NULL,
    `status` ENUM('pending', 'approved', 'closed') NOT NULL DEFAULT 'pending',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`jobs_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jobs_applications` (
    `application_id` VARCHAR(255) NOT NULL,
    `candidate_id` VARCHAR(255) NOT NULL,
    `company_id` VARCHAR(255) NOT NULL,
    `job_id` VARCHAR(255) NOT NULL,
    `application_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('pending', 'test', 'interview', 'approve', 'rejected') NOT NULL DEFAULT 'pending',
    `schedule_start` DATETIME(3) NULL,
    `schedule_end` DATETIME(3) NULL,
    `note` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`application_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `app_roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_permission_id_fkey` FOREIGN KEY (`permission_id`) REFERENCES `app_permissions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jobs` ADD CONSTRAINT `jobs_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `company_profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jobs` ADD CONSTRAINT `jobs_disnaker_id_fkey` FOREIGN KEY (`disnaker_id`) REFERENCES `disnaker_profiles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jobs_applications` ADD CONSTRAINT `jobs_applications_candidate_id_fkey` FOREIGN KEY (`candidate_id`) REFERENCES `candidate_profiles`(`candidate_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jobs_applications` ADD CONSTRAINT `jobs_applications_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `company_profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jobs_applications` ADD CONSTRAINT `jobs_applications_job_id_fkey` FOREIGN KEY (`job_id`) REFERENCES `jobs`(`jobs_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
