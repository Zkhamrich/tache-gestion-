
import { UserRole } from './auth';

export type TaskStatus = 'En attente' | 'En cours' | 'Terminé' | 'Annulé';
export type TaskPriority = 'Haute' | 'Moyenne' | 'Basse';

export interface Task {
  id: number;
  name: string;
  description: string;
  dueDate: string;
  finDate?: string;
  status: TaskStatus;
  priority?: TaskPriority;
  divisionId: number;
  divisionName: string;
  createdBy: number; // personal_secretary.secretary_id
  assignedToDivisionHeadId?: number;
  assignedTo?: string; // nom de la personne assignée
  isForSgFollowup: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TaskStatusHistory {
  id: number;
  status: TaskStatus;
  dateChanged: string;
  taskId: number;
  changedByUserId: number;
  changedByUsername?: string;
  changedByRole?: UserRole;
}

export interface TaskHistory {
  id: number;
  description: string;
  changeDate: string;
  taskId: number;
  changedByUserId: number;
  changedByUsername?: string;
  changedByRole?: UserRole;
}

export interface Division {
  id: number;
  name: string;
  responsible: string;
  taskCount: number;
  completedTasks: number;
}
