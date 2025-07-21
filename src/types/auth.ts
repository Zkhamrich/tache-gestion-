
export type UserRole = 'governor' | 'secretary_general' | 'personal_secretary' | 'admin' | 'division_head';

export interface BaseUser {
  id: number;
  username: string;
  role: UserRole;
}

export interface Governor extends BaseUser {
  role: 'governor';
  personalSecretaryId?: number;
}

export interface SecretaryGeneral extends BaseUser {
  role: 'secretary_general';
  personalSecretaryId?: number;
}

export interface PersonalSecretary extends BaseUser {
  role: 'personal_secretary';
  superiorRole: 'governor' | 'secretary_general';
  superiorId: number; // References governor_id or sg_id
  divisionId?: number;
  divisionName?: string;
}

export interface DivisionHead extends BaseUser {
  role: 'division_head';
  divisionId: number;
  divisionName: string;
}

export interface Admin extends BaseUser {
  role: 'admin';
}

export type User = Governor | SecretaryGeneral | PersonalSecretary | DivisionHead | Admin;

export interface UserPermission {
  resource: string;
  actions: string[]; // ['create', 'read', 'update', 'delete', 'manage']
}
