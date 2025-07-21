
import { UserRole, UserPermission } from './auth';

export interface RoleConfig {
  role: UserRole;
  permissions: UserPermission[];
  canManageRoles?: UserRole[];
  dashboardPath: string;
}

export const ROLE_PERMISSIONS: Record<UserRole, RoleConfig> = {
  governor: {
    role: 'governor',
    permissions: [
      { resource: 'tasks', actions: ['read'] },
      { resource: 'calendar', actions: ['read'] },
      { resource: 'statistics', actions: ['read'] },
      { resource: 'divisions', actions: ['read'] },
      { resource: 'reports', actions: ['read'] }
    ],
    dashboardPath: '/governor/dashboard'
  },
  secretary_general: {
    role: 'secretary_general',
    permissions: [
      { resource: 'tasks', actions: ['read'] },
      { resource: 'followup', actions: ['read'] },
      { resource: 'division_tasks', actions: ['read'] },
      { resource: 'reports', actions: ['read'] }
    ],
    dashboardPath: '/secretary-general/dashboard'
  },
  personal_secretary: {
    role: 'personal_secretary',
    permissions: [
      { resource: 'tasks', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'calendar', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'documents', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'own_division_tasks', actions: ['manage'] }
    ],
    dashboardPath: '/personal-secretary/dashboard'
  },
  division_head: {
    role: 'division_head',
    permissions: [
      { resource: 'division_tasks', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'division_reports', actions: ['read', 'create'] },
      { resource: 'division_members', actions: ['read'] }
    ],
    dashboardPath: '/division-head/dashboard'
  },
  admin: {
    role: 'admin',
    permissions: [
      { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'divisions', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'system', actions: ['read', 'manage'] },
      { resource: 'statistics', actions: ['read'] },
      { resource: 'tasks', actions: ['create', 'read', 'update', 'delete'] }
    ],
    canManageRoles: ['division_head', 'personal_secretary'],
    dashboardPath: '/admin/dashboard'
  }
};
