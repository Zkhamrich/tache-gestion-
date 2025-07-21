
import { apiService } from './api';
import { TaskHistory, TaskStatusHistory, ApiResponse } from '@/types/user';

export class HistoryService {
  // Task history operations
  async getTaskHistory(taskId: number): Promise<TaskHistory[]> {
    return apiService.get<TaskHistory[]>(`/tasks/${taskId}/history`);
  }

  async addTaskHistory(taskId: number, description: string): Promise<ApiResponse<TaskHistory>> {
    return apiService.post<ApiResponse<TaskHistory>>(`/tasks/${taskId}/history`, {
      description
    });
  }

  async updateTaskHistory(historyId: number, description: string): Promise<ApiResponse<TaskHistory>> {
    return apiService.put<ApiResponse<TaskHistory>>(`/history/${historyId}`, {
      description
    });
  }

  async deleteTaskHistory(historyId: number): Promise<ApiResponse<void>> {
    return apiService.delete<ApiResponse<void>>(`/history/${historyId}`);
  }

  // Task status history operations
  async getTaskStatusHistory(taskId: number): Promise<TaskStatusHistory[]> {
    return apiService.get<TaskStatusHistory[]>(`/tasks/${taskId}/status-history`);
  }

  // Get complete history for a task (both status changes and general history)
  async getCompleteTaskHistory(taskId: number): Promise<{
    statusHistory: TaskStatusHistory[];
    taskHistory: TaskHistory[];
  }> {
    const [statusHistory, taskHistory] = await Promise.all([
      this.getTaskStatusHistory(taskId),
      this.getTaskHistory(taskId)
    ]);

    return { statusHistory, taskHistory };
  }

  // Get history entries with documents
  async getHistoryWithDocuments(taskId: number): Promise<Array<TaskHistory & {
    documents?: Array<{
      id: number;
      documentPath: string;
      originalName?: string;
    }>;
  }>> {
    return apiService.get<Array<TaskHistory & {
      documents?: Array<{
        id: number;
        documentPath: string;
        originalName?: string;
      }>;
    }>>(`/tasks/${taskId}/history-with-documents`);
  }

  // Bulk operations for admin
  async getSystemHistory(params?: {
    user_id?: number;
    task_id?: number;
    date_from?: string;
    date_to?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    data: TaskHistory[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return apiService.get('/admin/system-history', params);
  }

  // Export history data
  async exportTaskHistory(taskId: number, format: 'pdf' | 'excel' = 'pdf'): Promise<Blob> {
    return apiService.downloadFile(`/tasks/${taskId}/history/export?format=${format}`);
  }

  // Utility method to format history entries for display
  formatHistoryEntry(entry: TaskHistory | TaskStatusHistory): {
    type: 'status' | 'general';
    title: string;
    description: string;
    date: string;
    user: string;
  } {
    if ('status' in entry) {
      // TaskStatusHistory
      return {
        type: 'status',
        title: 'Changement de statut',
        description: `Statut changé vers: ${entry.status}`,
        date: entry.dateChanged,
        user: entry.changedByUsername || `Utilisateur ${entry.changedByUserId}`
      };
    } else {
      // TaskHistory
      return {
        type: 'general',
        title: 'Mise à jour',
        description: entry.description,
        date: entry.changeDate,
        user: entry.changedByUsername || `Utilisateur ${entry.changedByUserId}`
      };
    }
  }

  // Combine and sort all history entries
  combineAndSortHistory(
    statusHistory: TaskStatusHistory[], 
    taskHistory: TaskHistory[]
  ): Array<{
    type: 'status' | 'general';
    title: string;
    description: string;
    date: string;
    user: string;
    originalEntry: TaskHistory | TaskStatusHistory;
  }> {
    const combined = [
      ...statusHistory.map(entry => ({
        ...this.formatHistoryEntry(entry),
        originalEntry: entry
      })),
      ...taskHistory.map(entry => ({
        ...this.formatHistoryEntry(entry),
        originalEntry: entry
      }))
    ];

    // Sort by date, most recent first
    return combined.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }
}

// Export singleton instance
export const historyService = new HistoryService();
export default historyService;
