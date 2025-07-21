
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
