
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, FileText, Clock, CheckCircle, AlertTriangle, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTask } from '@/contexts/TaskContext';
import { useUser } from '@/contexts/UserContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function PersonalSecretaryDashboard() {
  const navigate = useNavigate();
  const { getTasksForSecretary, getTaskStats } = useTask();
  const { user } = useUser();

  // Get tasks created by this personal secretary
  const myTasks = user ? getTasksForSecretary(user.id) : [];
  const stats = getTaskStats();

  const recentTasks = myTasks.slice(0, 4);

  const dashboardStats = [
    { 
      title: 'Tâches Créées', 
      value: myTasks.length, 
      icon: '📝', 
      trend: 12, 
      color: 'bg-blue-500' 
    },
    { 
      title: 'En Attente', 
      value: myTasks.filter(t => t.status === 'En attente').length, 
      icon: '⏳', 
      trend: 5, 
      color: 'bg-orange-500' 
    },
    { 
      title: 'En Cours', 
      value: myTasks.filter(t => t.status === 'En cours').length, 
      icon: '🔄', 
      trend: -2, 
      color: 'bg-yellow-500' 
    },
    { 
      title: 'Terminées', 
      value: myTasks.filter(t => t.status === 'Terminé').length, 
      icon: '✅', 
      trend: 8, 
      color: 'bg-green-500' 
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Terminé': return 'bg-green-100 text-green-800 border-green-200';
      case 'En cours': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'En attente': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Annulé': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <AppLayout>
      <PageHeader 
        title="Tableau de Bord Secrétaire Personnel"
        description="Gestion des tâches et suivi des activités"
        action={{
          label: "Nouvelle Tâche",
          onClick: () => navigate('/personal-secretary/new-task'),
          icon: PlusCircle
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardStats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
            <CardDescription>
              Créer et gérer des tâches et événements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <Button 
                variant="outline" 
                className="p-4 h-auto justify-start"
                onClick={() => navigate('/personal-secretary/new-task')}
              >
                <PlusCircle className="h-6 w-6 mr-3 text-primary" />
                <div className="text-left">
                  <div className="font-medium">Créer Nouvelle Tâche</div>
                  <div className="text-sm text-muted-foreground">Ajouter une tâche pour une division</div>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="p-4 h-auto justify-start"
                onClick={() => navigate('/personal-secretary/tasks')}
              >
                <FileText className="h-6 w-6 mr-3 text-primary" />
                <div className="text-left">
                  <div className="font-medium">Mes Tâches</div>
                  <div className="text-sm text-muted-foreground">Voir toutes mes tâches créées</div>
                </div>
              </Button>
              {user?.role === 'personal_secretary' && (
                <Button 
                  variant="outline" 
                  className="p-4 h-auto justify-start"
                  onClick={() => navigate('/personal-secretary/calendar')}
                >
                  <Calendar className="h-6 w-6 mr-3 text-primary" />
                  <div className="text-left">
                    <div className="font-medium">Gestion Calendrier</div>
                    <div className="text-sm text-muted-foreground">Gérer le calendrier du Gouverneur</div>
                  </div>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tâches Récentes</CardTitle>
            <CardDescription>
              Dernières tâches créées
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentTasks.length > 0 ? (
              <div className="space-y-4">
                {recentTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/personal-secretary/tasks/${task.id}/edit`)}
                  >
                    <div className="flex-1">
                      <p className="font-medium">{task.name}</p>
                      <p className="text-sm text-muted-foreground">{task.divisionName}</p>
                      <p className="text-xs text-muted-foreground">
                        Échéance: {format(new Date(task.dueDate), 'dd/MM/yyyy', { locale: fr })}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="outline" 
                        className={getStatusColor(task.status)}
                      >
                        {task.status}
                      </Badge>
                      {task.isForSgFollowup && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full" title="Suivi SG" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">Aucune tâche créée</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => navigate('/personal-secretary/new-task')}
                >
                  Créer votre première tâche
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
