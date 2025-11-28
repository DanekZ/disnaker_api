-- Add AK1 permissions
INSERT IGNORE INTO `app_permissions` (`code`, `label`) VALUES
  ('ak1.read', 'Lihat AK1 kandidat'),
  ('ak1.submit', 'Ajukan dokumen AK1');

-- Assign to super_admin
INSERT IGNORE INTO `role_permissions` (`role_id`, `permission_id`)
  SELECT r.id, p.id FROM `app_roles` r JOIN `app_permissions` p ON p.code IN ('ak1.read','ak1.submit') WHERE r.name = 'super_admin';

-- Assign to candidate
INSERT IGNORE INTO `role_permissions` (`role_id`, `permission_id`)
  SELECT r.id, p.id FROM `app_roles` r JOIN `app_permissions` p ON p.code IN ('ak1.read','ak1.submit') WHERE r.name = 'candidate';

