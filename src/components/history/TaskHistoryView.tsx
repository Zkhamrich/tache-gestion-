
import React, { useState, useEffect } from 'react';
import { Clock, User, MessageCircle, FileText, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { historyService } from '@/services/historyService';
import { DocumentList } from '@/components/documents/DocumentList';
import { DocumentUpload } from '@/components/documents/DocumentUpload';
import { TaskHistory, TaskStatusHistory } from '@/types/user';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TaskHistoryViewProps {
  taskId: number;
  canAddHistory?: boolean;
  onHistoryAdded?: () => void;
}

export function TaskHistoryView({ taskId, canAddHistory = false, onHistoryAdded }: TaskHistoryViewProps) {
  const [history, setHistory] = useState<Array<{
    type: 'status' | 'general';
    title: string;
    description: string;
    date: string;
    user: string;
    originalEntry: TaskHistory | TaskStatusHistory;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDescription, setNewDescription] = useState('');
  const [adding, setAdding] = useState(false);
  const [selectedHistoryId, setSelectedHistoryId] = useState<number | null>(null);

  useEffect(() => {
    loadHistory();
  }, [taskId]);

  const loadHistory = async () => {
    setLoading(true);
    setError(null);

    try {
      const { statusHistory, taskHistory } = await historyService.getCompleteTaskHistory(taskId);
      const combinedHistory = historyService.combineAndSortHistory(statusHistory, taskHistory);
      setHistory(combinedHistory);
    } catch (err) {
      setError('Erreur lors du chargement de l\'historique');
      console.error('Error loading history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHistory = async () => {
    if (!newDescription.trim()) return;

    setAdding(true);
    try {
      await historyService.addTaskHistory(taskId, newDescription.trim());
      setNewDescription('');
      setShowAddForm(false);
      await loadHistory();
      onHistoryAdded?.();
    } catch (err) {
      console.error('Error adding history:', err);
    } finally {
      setAdding(false);
    }
  };

  const getStatusBadgeVariant = (type: string) => {
    return type === 'status' ? 'default' : 'secondary';
  };

  const getTimelineIcon = (type: string) => {
    return type === 'status' ? (
      <Clock className="h-4 w-4" />
    ) : (
      <MessageCircle className="h-4 w-4" />
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Chargement de l'historique...</p>
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Historique de la tâche
            </CardTitle>
            {canAddHistory && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddForm(!showAddForm)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une note
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {showAddForm && (
            <div className="mb-6 p-4 border rounded-lg bg-muted/50">
              <div className="space-y-3">
                <Textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Ajouter une note à l'historique..."
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddHistory}
                    disabled={!newDescription.trim() || adding}
                    size="sm"
                  >
                    {adding ? 'Ajout...' : 'Ajouter'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewDescription('');
                    }}
                    size="sm"
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            </div>
          )}

          {history.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Aucun historique disponible
            </p>
          ) : (
            <div className="space-y-4">
              {history.map((entry, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                      {getTimelineIcon(entry.type)}
                    </div>
                    {index !== history.length - 1 && (
                      <div className="w-px h-6 bg-border mt-2" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusBadgeVariant(entry.type)}>
                            {entry.title}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(entry.date), 'dd MMM yyyy à HH:mm', { locale: fr })}
                          </span>
                        </div>
                        <p className="text-sm font-medium flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {entry.user}
                        </p>
                      </div>
                      {'id' in entry.originalEntry && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedHistoryId(
                            selectedHistoryId === entry.originalEntry.id 
                              ? null 
                              : entry.originalEntry.id
                          )}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {entry.description}
                    </p>

                    {selectedHistoryId === entry.originalEntry.id && 'id' in entry.originalEntry && (
                      <div className="mt-4 pl-4 border-l-2 border-muted">
                        <DocumentList
                          historyId={entry.originalEntry.id}
                          showActions={canAddHistory}
                        />
                      </div>
                    )}

                    {index !== history.length - 1 && <Separator className="mt-4" />}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
