-- Seed app_roles (idempotent)
INSERT IGNORE INTO `app_roles` (`name`, `description`) VALUES
  ('super_admin', 'Super Admin'),
  ('candidate', 'Candidate'),
  ('company', 'Company');

-- Map existing enum roles to relational role_ref_id
UPDATE `users` SET `role_ref_id` = (SELECT `id` FROM `app_roles` WHERE `name` = 'candidate') WHERE `role` = 'CANDIDATE' AND `role_ref_id` IS NULL;
UPDATE `users` SET `role_ref_id` = (SELECT `id` FROM `app_roles` WHERE `name` = 'company') WHERE `role` = 'COMPANY' AND `role_ref_id` IS NULL;
UPDATE `users` SET `role_ref_id` = (SELECT `id` FROM `app_roles` WHERE `name` = 'super_admin') WHERE `role` = 'DISNAKER' AND `role_ref_id` IS NULL;