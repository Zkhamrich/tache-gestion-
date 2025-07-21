export type UserRole = 'governor' | 'secretary_general' | 'personal_secretary' | 'admin' | 'division_head';

export interface User {
  id: number;
  username: string;
  role: UserRole;
  divisionId?: number;
  divisionName?: string;
  superiorId?: number; // For personal secretaries - ID of their superior (governor or secretary_general)
  permissions?: UserPermission[];
}

export interface UserPermission {
  resource: string;
  actions: string[]; // ['create', 'read', 'update', 'delete', 'manage']
}

export interface Task {
  id: number;
  name: string;
  description: string;
  dueDate: string;
  finDate?: string;
  status: TaskStatus;
  divisionId: number;
  divisionName: string;
  createdBy: number;
  assignedToDivisionHeadId?: number;
  isForSgFollowup: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'En attente' | 'En cours' | 'Terminé' | 'Annulé';

export interface TaskStatusHistory {
  id: number;
  status: TaskStatus;
  dateChanged: string;
  taskId: number;
  changedByUserId: number;
  changedByUsername?: string;
}

export interface TaskHistory {
  id: number;
  description: string;
  changeDate: string;
  taskId: number;
  changedByUserId: number;
  changedByUsername?: string;
}

export interface Document {
  id: number;
  documentPath: string;
  taskId?: number;
  historyId?: number;
  originalName?: string;
  description?: string;
  fileSize?: number;
  uploadedAt?: string;
}

export interface Division {
  id: number;
  name: string;
  responsible: string;
  taskCount: number;
  completedTasks: number;
}

export interface StatCard {
  title: string;
  value: number;
  icon: string;
  trend: number;
  color: string;
}

export type EventType = 'rendez-vous' | 'reunion' | 'conference' | 'evenement-public' | 'autre';

export interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  eventType: EventType;
  startDateTime: string;
  endDateTime: string;
  location?: string;
  governorId: number;
  createdBy: number;
  notes?: EventNote[];
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface EventNote {
  id: number;
  eventId: number;
  content: string;
  createdAt: string;
  createdBy: number;
}

export interface EventTypeOption {
  value: EventType;
  label: string;
  color: string;
}

// New interfaces for the database schema
export interface PersonalSecretary {
  id: number;
  username: string;
  role: 'governor' | 'secretary_general';
  superiorId: number;
}

export interface Governor {
  id: number;
  username: string;
  personalSecretaryId?: number;
}

export interface SecretaryGeneral {
  id: number;
  username: string;
  personalSecretaryId?: number;
}

export interface Admin {
  id: number;
  username: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Role hierarchy and permissions configuration
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
      { resource: 'calendar', actions: ['read', 'update'] },
      { resource: 'statistics', actions: ['read'] },
      { resource: 'divisions', actions: ['read'] },
      { resource: 'reports', actions: ['read'] }
    ],
    dashboardPath: '/governor/dashboard'
  },
  secretary_general: {
    role: 'secretary_general',
    permissions: [
      { resource: 'tasks', actions: ['read', 'update'] },
      { resource: 'followup', actions: ['read', 'update'] },
      { resource: 'division_tasks', actions: ['read', 'manage'] },
      { resource: 'reports', actions: ['read', 'create'] }
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
      { resource: 'division_tasks', actions: ['read', 'update'] },
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
      { resource: 'statistics', actions: ['read'] }
    ],
    canManageRoles: ['division_head', 'personal_secretary'],
    dashboardPath: '/admin/dashboard'
  }
};
