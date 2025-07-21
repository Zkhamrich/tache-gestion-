
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/StatCard';
import { TaskStatusChart } from '@/components/dashboard/TaskStatusChart';

export default function SecretaryGeneralDashboard() {
  const stats = [
    { title: 'Tâches Assignées', value: 34, icon: '📋', trend: 8, color: 'bg-blue-500' },
    { title: 'En Cours', value: 18, icon: '🔄', trend: 3, color: 'bg-orange-500' },
    { title: 'Terminées', value: 12, icon: '✅', trend: 15, color: 'bg-green-500' },
    { title: 'En Retard', value: 4, icon: '⚠️', trend: -2, color: 'bg-red-500' },
  ];

  const chartData = [
    { name: 'pending', value: 8 },
    { name: 'in_progress', value: 18 },
    { name: 'completed', value: 12 },
    { name: 'cancelled', value: 0 }
  ];

  return (
    <AppLayout>
      <PageHeader 
        title="Tableau de Bord Secrétaire Général"
        description="Suivi et gestion des tâches de division"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribution des Tâches</CardTitle>
            <CardDescription>
              État actuel de mes tâches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TaskStatusChart data={chartData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tâches Prioritaires</CardTitle>
            <CardDescription>
              Tâches nécessitant une attention immédiate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: 'Révision budget 2024', deadline: '2 jours', priority: 'high', from: 'Gouverneur' },
                { title: 'Rapport mensuel activités', deadline: '5 jours', priority: 'medium', from: 'Admin' },
                { title: 'Préparation réunion conseil', deadline: '1 semaine', priority: 'high', from: 'Gouverneur' },
                { title: 'Analyse performance équipe', deadline: '2 semaines', priority: 'low', from: 'RH' },
              ].map((task, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">De: {task.from}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{task.deadline}</p>
                    <div className={`text-xs px-2 py-1 rounded ${
                      task.priority === 'high' ? 'bg-red-100 text-red-800' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority === 'high' ? 'Urgent' :
                       task.priority === 'medium' ? 'Normal' : 'Faible'}
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
