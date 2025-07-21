
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/StatCard';
import { TaskStatusChart } from '@/components/dashboard/TaskStatusChart';

export default function GovernorDashboard() {
  const stats = [
    { title: 'Tâches Actives', value: 156, icon: '📊', trend: 12, color: 'bg-blue-500' },
    { title: 'Taux de Réussite', value: 87, icon: '📈', trend: 5, color: 'bg-green-500' },
    { title: 'En Attente', value: 23, icon: '⏳', trend: -8, color: 'bg-orange-500' },
    { title: 'Terminées', value: 134, icon: '✅', trend: 15, color: 'bg-purple-500' },
  ];

  const chartData = [
    { name: 'pending', value: 23 },
    { name: 'in_progress', value: 45 },
    { name: 'completed', value: 87 },
    { name: 'cancelled', value: 1 }
  ];

  return (
    <AppLayout>
      <PageHeader 
        title="Tableau de Bord Gouverneur"
        description="Vue d'ensemble des activités gouvernementales"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>État des Tâches</CardTitle>
            <CardDescription>
              Répartition globale par statut
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TaskStatusChart data={chartData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activité Récente</CardTitle>
            <CardDescription>
              Dernières mises à jour des divisions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { division: 'Administration', task: 'Rapport mensuel', time: '2h', status: 'completed' },
                { division: 'Finance', task: 'Audit budgétaire', time: '4h', status: 'in_progress' },
                { division: 'RH', task: 'Recrutement', time: '1j', status: 'pending' },
                { division: 'IT', task: 'Mise à jour système', time: '2j', status: 'completed' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{activity.task}</p>
                    <p className="text-sm text-muted-foreground">{activity.division}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                    <div className={`text-xs px-2 py-1 rounded ${
                      activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                      activity.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {activity.status === 'completed' ? 'Terminé' :
                       activity.status === 'in_progress' ? 'En cours' : 'En attente'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
