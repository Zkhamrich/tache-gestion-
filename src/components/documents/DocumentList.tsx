
import React, { useState, useEffect } from 'react';
import { Download, FileText, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { documentService } from '@/services/documentService';
import { Document } from '@/types/user';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DocumentListProps {
  taskId?: number;
  historyId?: number;
  documents?: Document[];
  onDocumentDelete?: (documentId: number) => void;
  showActions?: boolean;
}

export function DocumentList({ 
  taskId, 
  historyId, 
  documents: externalDocuments, 
  onDocumentDelete,
  showActions = true 
}: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (externalDocuments) {
      setDocuments(externalDocuments);
    } else if (taskId || historyId) {
      loadDocuments();
    }
  }, [taskId, historyId, externalDocuments]);

  const loadDocuments = async () => {
    if (!taskId && !historyId) return;

    setLoading(true);
    setError(null);

    try {
      const docs = taskId 
        ? await documentService.getTaskDocuments(taskId)
        : historyId 
        ? await documentService.getHistoryDocuments(historyId)
        : [];
      
      setDocuments(docs);
    } catch (err) {
      setError('Erreur lors du chargement des documents');
      console.error('Error loading documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (document: Document) => {
    try {
      const blob = await documentService.downloadDocument(document.id);
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = document.originalName || `document-${document.id}`;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading document:', err);
    }
  };

  const handleDelete = async (document: Document) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      return;
    }

    try {
      await documentService.deleteDocument(document.id);
      setDocuments(prev => prev.filter(d => d.id !== document.id));
      onDocumentDelete?.(document.id);
    } catch (err) {
      console.error('Error deleting document:', err);
    }
  };

  const getFileIcon = (filename: string) => {
    const extension = documentService.getFileExtension(filename);
    return <FileText className="h-5 w-5 text-muted-foreground" />;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Chargement des documents...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (documents.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Aucun document attaché</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Documents ({documents.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0">
          {documents.map((document, index) => (
            <div
              key={document.id}
              className={`flex items-center justify-between p-4 ${
                index !== documents.length - 1 ? 'border-b' : ''
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                {getFileIcon(document.originalName || '')}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {document.originalName || `Document ${document.id}`}
                  </p>
                  {document.description && (
                    <p className="text-sm text-muted-foreground truncate">
                      {document.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    {document.fileSize && (
                      <Badge variant="secondary" className="text-xs">
                        {documentService.formatFileSize(document.fileSize)}
                      </Badge>
                    )}
                    {document.uploadedAt && (
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(document.uploadedAt), 'dd MMM yyyy', { locale: fr })}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {showActions && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(document)}
                    title="Télécharger"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(document)}
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
