-- Add CRUD permissions for candidate and company profiles
INSERT IGNORE INTO `app_permissions` (`code`, `label`) VALUES
  ('pencaker.create', 'Buat profil pencaker'),
  ('pencaker.read', 'Lihat profil pencaker'),
  ('pencaker.update', 'Ubah profil pencaker'),
  ('pencaker.delete', 'Hapus profil pencaker'),
  ('perusahaan.create', 'Buat profil perusahaan'),
  ('perusahaan.read', 'Lihat profil perusahaan'),
  ('perusahaan.update', 'Ubah profil perusahaan'),
  ('perusahaan.delete', 'Hapus profil perusahaan');

-- Assign to super_admin role
INSERT IGNORE INTO `role_permissions` (`role_id`, `permission_id`)
  SELECT r.id, p.id FROM `app_roles` r JOIN `app_permissions` p ON p.code IN (
    'pencaker.create','pencaker.read','pencaker.update','pencaker.delete',
    'perusahaan.create','perusahaan.read','perusahaan.update','perusahaan.delete'
  ) WHERE r.name = 'super_admin';