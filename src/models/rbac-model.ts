export interface CreateRoleRequest {
  name: string;
  description?: string;
}

export interface UpdateRoleRequest {
  id: number;
  name?: string;
  description?: string;
}

export interface CreatePermissionRequest {
  code: string;
  label: string;
}

export interface AssignRolePermissionsRequest {
  role_id: number;
  permissions: string[];
}

export interface AssignUserRoleRequest {
  id: string;
  role_id: number;
}