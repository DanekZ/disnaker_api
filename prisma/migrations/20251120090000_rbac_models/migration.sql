CREATE TABLE `app_roles` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `description` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `app_roles_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `app_permissions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(100) NOT NULL,
  `label` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `app_permissions_code_key` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `role_permissions` (
  `role_id` INT NOT NULL,
  `permission_id` INT NOT NULL,
  PRIMARY KEY (`role_id`, `permission_id`),
  CONSTRAINT `role_permissions_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `app_roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `role_permissions_permission_id_fkey` FOREIGN KEY (`permission_id`) REFERENCES `app_permissions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `users`
  ADD COLUMN `role_ref_id` INT NULL,
  ADD CONSTRAINT `users_role_ref_id_fkey` FOREIGN KEY (`role_ref_id`) REFERENCES `app_roles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

INSERT INTO `app_permissions` (`code`, `label`) VALUES
  ('lowongan.create', 'Buat lowongan'),
  ('lowongan.read', 'Lihat lowongan'),
  ('lowongan.update', 'Ubah lowongan'),
  ('lowongan.delete', 'Hapus lowongan'),
  ('perusahaan.read', 'Lihat perusahaan'),
  ('perusahaan.verify', 'Verifikasi perusahaan'),
  ('pencaker.read', 'Lihat pencari kerja'),
  ('pencaker.verify', 'Verifikasi AK1');