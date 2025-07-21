
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskStatusChart } from '@/components/dashboard/TaskStatusChart';
import { StatCard } from '@/components/dashboard/StatCard';
import { BarChart3, PieChart, TrendingUp, Activity } from 'lucide-react';

export default function SystemStats() {
  const stats = [
    { title: 'Tâches Totales', value: 156, icon: '📊', trend: 12, color: 'bg-blue-500' },
    { title: 'Taux de Réussite', value: 87, icon: '📈', trend: 5, color: 'bg-green-500' },
    { title: 'Activité Mensuelle', value: 42, icon: '⚡', trend: 8, color: 'bg-purple-500' },
    { title: 'Efficacité', value: 94, icon: '🎯', trend: 3, color: 'bg-orange-500' },
  ];

  const chartData = [
    { name: 'pending', value: 23 },
    { name: 'in_progress', value: 45 },
    { name: 'completed', value: 87 },
    { name: 'cancelled', value: 1 }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-institutional-blue mb-2">
            Statistiques Système
          </h1>
          <p className="text-muted-foreground">
            Vue d'ensemble des performances et métriques du système
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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
              <CardTitle>Performance par Division</CardTitle>
              <CardDescription>
                Taux de completion des divisions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Administration', completion: 92 },
                  { name: 'Finance', completion: 87 },
                  { name: 'RH', completion: 85 },
                  { name: 'IT', completion: 94 },
                ].map((division) => (
                  <div key={division.name} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{division.name}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-institutional-blue h-2 rounded-full" 
                          style={{ width: `${division.completion}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-muted-foreground w-10">
                        {division.completion}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
