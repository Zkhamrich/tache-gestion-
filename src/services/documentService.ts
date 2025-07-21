
import { apiService } from './api';
import { Document, ApiResponse } from '@/types/user';

export class DocumentService {
  private readonly basePath = '/documents';

  // Upload document
  async uploadDocument(
    file: File, 
    options: {
      taskId?: number;
      historyId?: number;
      description?: string;
    }
  ): Promise<ApiResponse<Document>> {
    const additionalData = {
      task_id: options.taskId,
      hist_id: options.historyId,
      description: options.description
    };

    return apiService.uploadFile<ApiResponse<Document>>(
      `${this.basePath}/upload`,
      file,
      additionalData
    );
  }

  // Get documents for a task
  async getTaskDocuments(taskId: number): Promise<Document[]> {
    return apiService.get<Document[]>(`/tasks/${taskId}/documents`);
  }

  // Get documents for a history entry
  async getHistoryDocuments(historyId: number): Promise<Document[]> {
    return apiService.get<Document[]>(`/history/${historyId}/documents`);
  }

  // Download document
  async downloadDocument(documentId: number): Promise<Blob> {
    return apiService.downloadFile(`${this.basePath}/${documentId}/download`);
  }

  // Delete document
  async deleteDocument(documentId: number): Promise<ApiResponse<void>> {
    return apiService.delete<ApiResponse<void>>(`${this.basePath}/${documentId}`);
  }

  // Get document info
  async getDocument(documentId: number): Promise<Document> {
    return apiService.get<Document>(`${this.basePath}/${documentId}`);
  }

  // Get all documents (admin only)
  async getAllDocuments(params?: {
    task_id?: number;
    hist_id?: number;
    page?: number;
    limit?: number;
  }): Promise<{
    data: Document[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return apiService.get(this.basePath, params);
  }

  // Utility method to get file extension
  getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  // Utility method to check if file type is allowed
  isFileTypeAllowed(filename: string, allowedTypes: string[] = ['pdf', 'doc', 'docx', 'txt', 'jpg', 'png']): boolean {
    const extension = this.getFileExtension(filename);
    return allowedTypes.includes(extension);
  }

  // Format file size
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Export singleton instance
export const documentService = new DocumentService();
export default documentService;
