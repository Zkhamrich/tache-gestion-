
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar, User, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SecretaryGeneralFollowUp() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const mockTasks = [
    {
      id: 1,
      name: 'Rapport Budget Q1',
      description: 'Préparation du rapport budgétaire du premier trimestre',
      dueDate: '2024-01-25',
      status: 'in_progress',
      createdBy: 'sec_personal',
      createdAt: '2024-01-15',
      priority: 'high'
    },
    {
      id: 2,
      name: 'Préparation Réunion',
      description: 'Documents pour la réunion avec le gouverneur',
      dueDate: '2024-01-22',
      status: 'pending',
      createdBy: 'sec_personal',
      createdAt: '2024-01-18',
      priority: 'medium'
    },
    {
      id: 3,
      name: 'Audit Interne',
      description: 'Coordination de l\'audit interne de la division',
      dueDate: '2024-01-30',
      status: 'in_progress',
      createdBy: 'sec_personal',
      createdAt: '2024-01-10',
      priority: 'high'
    }
  ];

  const filteredTasks = mockTasks.filter(task =>
    task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'in_progress': return 'En cours';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-institutional-blue mb-2">
            Suivi des Tâches
          </h1>
          <p className="text-muted-foreground">
            Suivi des tâches saisies par votre secrétaire personnel
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tâches en Cours de Suivi</CardTitle>
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
                <div key={task.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-lg">{task.name}</h3>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority === 'high' ? 'Priorité Haute' : 
                           task.priority === 'medium' ? 'Priorité Moyenne' : 'Priorité Basse'}
                        </Badge>
                      </div>
                      
                      <p className="text-muted-foreground mb-3">{task.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>Saisi par: {task.createdBy}</span>
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
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Voir détails
                      </Button>
                      <span className="text-xs text-muted-foreground">
                        Créé: {new Date(task.createdAt).toLocaleDateString('fr-FR')}
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
