
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DocumentUpload } from '@/components/documents/DocumentUpload';
import { DocumentList } from '@/components/documents/DocumentList';
import { TaskHistoryView } from '@/components/history/TaskHistoryView';
import { ArrowLeft, Save, Trash2, FileText, Clock } from 'lucide-react';
import { useTask } from '@/contexts/TaskContext';
import { useToast } from '@/hooks/use-toast';
import { Task, TaskStatus } from '@/types/user';

const taskSchema = z.object({
  name: z.string().min(1, 'Le nom de la tâche est requis'),
  description: z.string().min(1, 'La description est requise'),
  dueDate: z.string().min(1, 'La date d\'échéance est requise'),
  status: z.enum(['En attente', 'En cours', 'Terminé', 'Annulé'] as const),
  divisionId: z.number().min(1, 'La division est requise'),
  isForSgFollowup: z.boolean(),
});

type TaskFormData = z.infer<typeof taskSchema>;

// Mock divisions data - à remplacer par les vraies données
const divisions = [
  { id: 1, name: 'Administration Générale' },
  { id: 2, name: 'Finance' },
  { id: 3, name: 'Ressources Humaines' },
  { id: 4, name: 'Technique' },
];

export default function TaskEditForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTask, updateTask, deleteTask } = useTask();
  const { toast } = useToast();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: '',
      description: '',
      dueDate: '',
      status: 'En attente',
      divisionId: 1,
      isForSgFollowup: false,
    },
  });

  useEffect(() => {
    if (id) {
      const foundTask = getTask(Number(id));
      if (foundTask) {
        setTask(foundTask);
        form.reset({
          name: foundTask.name,
          description: foundTask.description,
          dueDate: foundTask.dueDate,
          status: foundTask.status,
          divisionId: foundTask.divisionId,
          isForSgFollowup: foundTask.isForSgFollowup,
        });
      } else {
        toast({
          title: 'Erreur',
          description: 'Tâche non trouvée',
          variant: 'destructive',
        });
        navigate('/personal-secretary/tasks');
      }
    }
  }, [id, getTask, form, navigate, toast]);

  const onSubmit = async (data: TaskFormData) => {
    if (!task) return;

    setLoading(true);
    try {
      await updateTask(task.id, {
        ...data,
        divisionName: divisions.find(d => d.id === data.divisionId)?.name || '',
      });

      toast({
        title: 'Succès',
        description: 'Tâche mise à jour avec succès',
      });

      navigate('/personal-secretary/tasks');
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la mise à jour de la tâche',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!task) return;

    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      return;
    }

    setDeleting(true);
    try {
      await deleteTask(task.id);
      toast({
        title: 'Succès',
        description: 'Tâche supprimée avec succès',
      });
      navigate('/personal-secretary/tasks');
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la suppression de la tâche',
        variant: 'destructive',
      });
    } finally {
      setDeleting(false);
    }
  };

  if (!task) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader
        title="Modifier la tâche"
        description="Modifiez les détails de la tâche, gérez les documents et consultez l'historique"
        action={{
          label: 'Retour',
          onClick: () => navigate('/personal-secretary/tasks'),
          icon: ArrowLeft,
          variant: 'outline'
        }}
      />

      <div className="space-y-6">
        <Tabs defaultValue="details" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations de la tâche</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom de la tâche</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date d'échéance</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Statut</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="En attente">En attente</SelectItem>
                                <SelectItem value="En cours">En cours</SelectItem>
                                <SelectItem value="Terminé">Terminé</SelectItem>
                                <SelectItem value="Annulé">Annulé</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="divisionId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Division</FormLabel>
                            <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value.toString()}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {divisions.map((division) => (
                                  <SelectItem key={division.id} value={division.id.toString()}>
                                    {division.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={4} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isForSgFollowup"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Suivi par le Secrétaire Général</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Cette tâche nécessite un suivi particulier du Secrétaire Général
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-between">
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={deleting}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {deleting ? 'Suppression...' : 'Supprimer'}
                      </Button>

                      <Button type="submit" disabled={loading}>
                        <Save className="h-4 w-4 mr-2" />
                        {loading ? 'Sauvegarde...' : 'Sauvegarder'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DocumentUpload
                taskId={task.id}
                onUploadSuccess={() => {
                  toast({
                    title: 'Succès',
                    description: 'Document téléchargé avec succès',
                  });
                }}
                onUploadError={(error) => {
                  toast({
                    title: 'Erreur',
                    description: error,
                    variant: 'destructive',
                  });
                }}
              />
              <DocumentList taskId={task.id} />
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <TaskHistoryView 
              taskId={task.id} 
              canAddHistory={true}
              onHistoryAdded={() => {
                toast({
                  title: 'Succès',
                  description: 'Note ajoutée à l\'historique',
                });
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
