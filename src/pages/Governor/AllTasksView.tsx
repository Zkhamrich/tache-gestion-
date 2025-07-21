
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar, Building2 } from 'lucide-react';
import { Task } from '@/types/user';

export default function AllTasksView() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const mockTasks: Task[] = [
    {
      id: 1,
      name: 'Rapport Mensuel',
      description: 'Préparation du rapport mensuel des activités',
      dueDate: '2024-01-15',
      finDate: '2024-01-20',
      status: 'Terminé',
      divisionId: 1,
      divisionName: 'Administration Générale',
      createdBy: 1,
      isForSgFollowup: false,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-20'
    },
    {
      id: 2,
      name: 'Audit Budgétaire',
      description: 'Vérification des dépenses du trimestre',
      dueDate: '2024-01-25',
      finDate: '2024-01-30',
      status: 'En cours',
      divisionId: 2,
      divisionName: 'Finance',
      createdBy: 1,
      isForSgFollowup: true,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-22'
    },
    {
      id: 3,
      name: 'Recrutement IT',
      description: 'Processus de recrutement pour le département IT',
      dueDate: '2024-02-01',
      finDate: '2024-02-15',
      status: 'En attente',
      divisionId: 3,
      divisionName: 'Ressources Humaines',
      createdBy: 1,
      isForSgFollowup: false,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-22'
    }
  ];

  const filteredTasks = mockTasks.filter(task =>
    task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.divisionName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Terminé': return 'bg-green-100 text-green-800';
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'En attente': return 'bg-orange-100 text-orange-800';
      case 'Annulé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    return status; // Already in French
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-institutional-blue mb-2">
            Vue d'Ensemble des Tâches
          </h1>
          <p className="text-muted-foreground">
            Consultation de toutes les tâches inter-divisions
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Toutes les Tâches</CardTitle>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une tâche..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <div key={task.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{task.name}</h3>
                      <p className="text-muted-foreground mb-3">{task.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Building2 className="h-4 w-4" />
                          <span>{task.divisionName}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Échéance: {new Date(task.dueDate).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <Badge className={getStatusColor(task.status)}>
                        {getStatusText(task.status)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Mis à jour: {new Date(task.updatedAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
