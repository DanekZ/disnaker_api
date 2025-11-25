-- Add CRUD permissions for users management
INSERT IGNORE INTO `app_permissions` (`code`, `label`) VALUES
  ('users.create', 'Buat pengguna'),
  ('users.read', 'Lihat pengguna'),
  ('users.update', 'Ubah pengguna'),
  ('users.delete', 'Hapus pengguna');

-- Assign to super_admin role by default
INSERT IGNORE INTO `role_permissions` (`role_id`, `permission_id`)
  SELECT r.id, p.id FROM `app_roles` r JOIN `app_permissions` p ON p.code IN (
    'users.create','users.read','users.update','users.delete'
  ) WHERE r.name = 'super_admin';