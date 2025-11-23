-- Ensure lowongan.verify is only granted to super_admin
DELETE rp FROM `role_permissions` rp
JOIN `app_permissions` p ON rp.permission_id = p.id
JOIN `app_roles` r ON rp.role_id = r.id
WHERE p.code = 'lowongan.verify' AND r.name <> 'super_admin';