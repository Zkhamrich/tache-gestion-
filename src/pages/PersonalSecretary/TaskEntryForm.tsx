
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { ArrowLeft, Save, FileText } from 'lucide-react';
import { useTask } from '@/contexts/TaskContext';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { Task } from '@/types/user';

const taskSchema = z.object({
  name: z.string().min(1, 'Le nom de la tâche est requis'),
  description: z.string().min(1, 'La description est requise'),
  dueDate: z.string().min(1, 'La date d\'échéance est requise'),
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

export default function TaskEntryForm() {
  const navigate = useNavigate();
  const { createTask } = useTask();
  const { user } = useUser();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [createdTask, setCreatedTask] = useState<Task | null>(null);

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: '',
      description: '',
      dueDate: '',
      divisionId: 1,
      isForSgFollowup: false,
    },
  });

  const onSubmit = async (data: TaskFormData) => {
    if (!user) return;

    setLoading(true);
    try {
      const newTask = await createTask({
        name: data.name,
        description: data.description,
        dueDate: data.dueDate,
        divisionId: data.divisionId,
        isForSgFollowup: data.isForSgFollowup,
        status: 'En attente',
        divisionName: divisions.find(d => d.id === data.divisionId)?.name || '',
        createdBy: user.id,
      });

      setCreatedTask(newTask);

      toast({
        title: 'Succès',
        description: 'Tâche créée avec succès',
      });

      // Reset form for new task
      form.reset();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la création de la tâche',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFinishAndReturn = () => {
    navigate('/personal-secretary/tasks');
  };

  return (
    <AppLayout>
      <PageHeader
        title="Nouvelle tâche"
        description="Créez une nouvelle tâche et gérez ses documents"
        action={{
          label: 'Retour',
          onClick: () => navigate('/personal-secretary/dashboard'),
          icon: ArrowLeft,
          variant: 'outline'
        }}
      />

      <div className="space-y-6">
        <Tabs defaultValue="details" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Détails de la tâche</TabsTrigger>
            <TabsTrigger value="documents" disabled={!createdTask}>
              Documents {!createdTask && '(créez d\'abord la tâche)'}
            </TabsTrigger>
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
                              <Input {...field} placeholder="Ex: Rapport mensuel..." />
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
                        name="divisionId"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Division responsable</FormLabel>
                            <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value.toString()}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionnez une division" />
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
                          <FormLabel>Description détaillée</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              rows={4} 
                              placeholder="Décrivez la tâche en détail, les objectifs, les livrables attendus..."
                            />
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
                              Marquez cette option si la tâche nécessite un suivi particulier du Secrétaire Général
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-between">
                      {createdTask && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleFinishAndReturn}
                        >
                          Terminer et retourner à la liste
                        </Button>
                      )}

                      <Button type="submit" disabled={loading} className="ml-auto">
                        <Save className="h-4 w-4 mr-2" />
                        {loading ? 'Création...' : 'Créer la tâche'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            {createdTask ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Documents pour : {createdTask.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Vous pouvez maintenant ajouter des documents à cette tâche.
                    </p>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <DocumentUpload
                    taskId={createdTask.id}
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
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Documents attachés</h3>
                    {/* La liste des documents sera affichée automatiquement */}
                  </div>
                </div>

                <div className="flex justify-center pt-6">
                  <Button onClick={handleFinishAndReturn}>
                    Terminer et retourner à la liste des tâches
                  </Button>
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">
                    Créez d'abord la tâche pour pouvoir ajouter des documents.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
