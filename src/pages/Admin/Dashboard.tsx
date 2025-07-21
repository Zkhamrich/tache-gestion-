
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/StatCard';
import { TaskStatusChart } from '@/components/dashboard/TaskStatusChart';
import { Users, Building2, ClipboardList, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { title: 'Total Users', value: 24, icon: '👥', trend: 12, color: 'bg-blue-500' },
    { title: 'Divisions', value: 8, icon: '🏢', trend: 5, color: 'bg-green-500' },
    { title: 'Active Tasks', value: 156, icon: '📋', trend: -8, color: 'bg-orange-500' },
    { title: 'Completion Rate', value: 87, icon: '📈', trend: 15, color: 'bg-purple-500' },
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
        title="Administration Dashboard"
        description="Vue d'ensemble du système de gestion des tâches"
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
              Répartition par statut
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TaskStatusChart data={chartData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
            <CardDescription>
              Gestion du système
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border rounded-lg hover:bg-muted transition-colors">
                <Users className="h-6 w-6 mb-2 text-primary" />
                <div className="text-sm font-medium">Gérer Utilisateurs</div>
              </button>
              <button className="p-4 border rounded-lg hover:bg-muted transition-colors">
                <Building2 className="h-6 w-6 mb-2 text-primary" />
                <div className="text-sm font-medium">Gérer Divisions</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
