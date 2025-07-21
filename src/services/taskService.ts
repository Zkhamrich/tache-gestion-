
import { apiService } from './api';
import { Task, TaskStatus, TaskHistory, TaskStatusHistory, ApiResponse, PaginatedResponse } from '@/types/user';

export class TaskService {
  private readonly basePath = '/tasks';

  // CRUD operations
  async getAllTasks(params?: {
    division_id?: number;
    status?: TaskStatus;
    is_for_sg_followup?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Task>> {
    return apiService.get<PaginatedResponse<Task>>(this.basePath, params);
  }

  async getTask(id: number): Promise<Task> {
    return apiService.get<Task>(`${this.basePath}/${id}`);
  }

  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Task>> {
    return apiService.post<ApiResponse<Task>>(this.basePath, task);
  }

  async updateTask(id: number, updates: Partial<Task>): Promise<ApiResponse<Task>> {
    return apiService.put<ApiResponse<Task>>(`${this.basePath}/${id}`, updates);
  }

  async deleteTask(id: number): Promise<ApiResponse<void>> {
    return apiService.delete<ApiResponse<void>>(`${this.basePath}/${id}`);
  }

  // Status management
  async updateTaskStatus(taskId: number, status: TaskStatus, note?: string): Promise<ApiResponse<void>> {
    return apiService.post<ApiResponse<void>>(`${this.basePath}/${taskId}/status`, {
      status,
      note
    });
  }

  async getTaskStatusHistory(taskId: number): Promise<TaskStatusHistory[]> {
    return apiService.get<TaskStatusHistory[]>(`${this.basePath}/${taskId}/status-history`);
  }

  // History management
  async getTaskHistory(taskId: number): Promise<TaskHistory[]> {
    return apiService.get<TaskHistory[]>(`${this.basePath}/${taskId}/history`);
  }

  async addTaskHistory(taskId: number, description: string): Promise<ApiResponse<TaskHistory>> {
    return apiService.post<ApiResponse<TaskHistory>>(`${this.basePath}/${taskId}/history`, {
      description
    });
  }

  // Statistics
  async getTaskStatistics(params?: {
    division_id?: number;
    date_from?: string;
    date_to?: string;
  }): Promise<{
    total: number;
    pending: number;
    in_progress: number;
    completed: number;
    cancelled: number;
    by_division: Array<{
      division_id: number;
      division_name: string;
      total: number;
      completed: number;
    }>;
  }> {
    return apiService.get('/statistics/tasks', params);
  }

  // Specialized queries
  async getTasksByDivision(divisionId: number): Promise<Task[]> {
    const response = await this.getAllTasks({ division_id: divisionId });
    return response.data;
  }

  async getTasksForFollowup(): Promise<Task[]> {
    const response = await this.getAllTasks({ is_for_sg_followup: true });
    return response.data;
  }

  async getTasksCreatedBy(secretaryId: number): Promise<Task[]> {
    return apiService.get<Task[]>(`/personal-secretary/${secretaryId}/tasks`);
  }

  // Search functionality
  async searchTasks(query: string, filters?: {
    division_id?: number;
    status?: TaskStatus;
  }): Promise<Task[]> {
    const response = await this.getAllTasks({
      search: query,
      ...filters
    });
    return response.data;
  }
}

// Export singleton instance
export const taskService = new TaskService();
export default taskService;
