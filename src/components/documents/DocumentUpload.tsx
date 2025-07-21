
import React, { useState } from 'react';
import { Upload, File, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { documentService } from '@/services/documentService';
import { Document } from '@/types/user';

interface DocumentUploadProps {
  taskId?: number;
  historyId?: number;
  onUploadSuccess?: (document: Document) => void;
  onUploadError?: (error: string) => void;
}

export function DocumentUpload({ taskId, historyId, onUploadSuccess, onUploadError }: DocumentUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setError(null);
      
      // Validate file type
      if (!documentService.isFileTypeAllowed(file.name)) {
        setError('Type de fichier non autorisé. Formats acceptés : PDF, DOC, DOCX, TXT, JPG, PNG');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Le fichier est trop volumineux. Taille maximale : 10MB');
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);

    try {
      const response = await documentService.uploadDocument(selectedFile, {
        taskId,
        historyId,
        description: description.trim() || undefined
      });

      if (response.success && response.data) {
        onUploadSuccess?.(response.data);
        setSelectedFile(null);
        setDescription('');
      } else {
        throw new Error(response.message || 'Erreur lors du téléchargement');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du téléchargement';
      setError(errorMessage);
      onUploadError?.(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError(null);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file-upload">Sélectionner un fichier</Label>
            <div className="flex items-center gap-4">
              <Input
                id="file-upload"
                type="file"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                disabled={uploading}
              />
              {selectedFile && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={removeFile}
                  disabled={uploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {selectedFile && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
              <File className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {documentService.formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description (optionnelle)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez le contenu du document..."
              disabled={uploading}
              rows={3}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Téléchargement...' : 'Télécharger le document'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
