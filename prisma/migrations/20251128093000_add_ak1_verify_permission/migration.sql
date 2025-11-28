-- Add AK1 verify permission
INSERT IGNORE INTO `app_permissions` (`code`, `label`) VALUES
  ('ak1.verify', 'Verifikasi AK1 dan generate kartu');

-- Assign to super_admin role
INSERT IGNORE INTO `role_permissions` (`role_id`, `permission_id`)
  SELECT r.id, p.id FROM `app_roles` r JOIN `app_permissions` p ON p.code IN ('ak1.verify') WHERE r.name = 'super_admin';

