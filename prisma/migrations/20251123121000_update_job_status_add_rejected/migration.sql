ALTER TABLE `jobs`
    MODIFY `status` ENUM('pending','approved','rejected','closed') NOT NULL DEFAULT 'pending';
  INSERT IGNORE INTO `app_permissions` (`code`, `label`)
  VALUES ('lowongan.verify', 'Verifikasi status lowongan');
  INSERT IGNORE INTO `role_permissions` (`role_id`, `permission_id`)
  SELECT r.id, p.id FROM `app_roles` r JOIN `app_permissions` p ON p.code = 'lowongan.verify' WHERE r.name = 'super_admin';