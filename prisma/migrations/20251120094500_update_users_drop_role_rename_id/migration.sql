-- Drop FKs referencing users(user_id)
ALTER TABLE `company_profiles` DROP FOREIGN KEY `company_profiles_user_id_fkey`;
ALTER TABLE `disnaker_profiles` DROP FOREIGN KEY `disnaker_profiles_user_id_fkey`;
ALTER TABLE `candidate_profiles` DROP FOREIGN KEY `candidate_profiles_user_id_fkey`;

-- Rename column user_id -> id on users
ALTER TABLE `users` CHANGE COLUMN `user_id` `id` VARCHAR(255) NOT NULL;

-- Drop legacy enum role column
ALTER TABLE `users` DROP COLUMN `role`;

-- Keep role_ref_id nullable to respect FK ON DELETE SET NULL

-- Recreate FKs to users(id)
ALTER TABLE `company_profiles` ADD CONSTRAINT `company_profiles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `disnaker_profiles` ADD CONSTRAINT `disnaker_profiles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `candidate_profiles` ADD CONSTRAINT `candidate_profiles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;