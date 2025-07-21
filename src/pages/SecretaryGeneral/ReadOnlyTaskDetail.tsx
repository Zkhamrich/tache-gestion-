
import React from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User, Clock, FileText } from 'lucide-react';

export default function ReadOnlyTaskDetail() {
  const { id } = useParams();
  
  // Mock task data
  const task = {
    id: parseInt(id || '1'),
    name: 'Rapport Budget Q1',
    description: 'Préparation du rapport budgétaire du premier trimestre avec analyse détaillée des dépenses et revenus',
    dueDate: '2024-01-25',
    status: 'in_progress',
    createdBy: 'sec_personal',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    priority: 'high',
    estimatedHours: 20,
    completedHours: 12,
    documents: [
      { name: 'Budget_Template.xlsx', uploadedAt: '2024-01-15' },
      { name: 'Financial_Data.pdf', uploadedAt: '2024-01-18' }
    ],
    history: [
      { date: '2024-01-15', action: 'Tâche créée', user: 'sec_personal' },
      { date: '2024-01-18', action: 'Documents ajoutés', user: 'sec_personal' },
      { date: '2024-01-20', action: 'Statut mis à jour', user: 'sec_personal' }
    ]
  };

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au suivi
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-institutional-blue mb-2">
                {task.name}
              </h1>
              <p className="text-muted-foreground">
                Détails de la tâche (lecture seule)
              </p>
            </div>
            <div className="flex space-x-2">
              <Badge className={getStatusColor(task.status)}>
                {task.status === 'in_progress' ? 'En cours' : 'En attente'}
              </Badge>
              <Badge className={getPriorityColor(task.priority)}>
                Priorité Haute
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {task.description}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progression</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Heures travaillées:</span>
                    <span>{task.completedHours} / {task.estimatedHours} heures</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-institutional-blue h-2 rounded-full" 
                      style={{ width: `${(task.completedHours / task.estimatedHours) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {Math.round((task.completedHours / task.estimatedHours) * 100)}% complété
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {task.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{doc.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(doc.uploadedAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Créé par: {task.createdBy}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Échéance: {new Date(task.dueDate).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Créé: {new Date(task.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Modifié: {new Date(task.updatedAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Historique</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {task.history.map((entry, index) => (
                    <div key={index} className="text-sm">
                      <p className="font-medium">{entry.action}</p>
                      <p className="text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString('fr-FR')} - {entry.user}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
