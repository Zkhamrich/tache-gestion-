
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskStatusChart } from '@/components/dashboard/TaskStatusChart';
import { StatCard } from '@/components/dashboard/StatCard';
import { BarChart3, TrendingUp, Clock, Target } from 'lucide-react';

export default function GovernorStatsView() {
  const globalStats = [
    { title: 'Productivité Globale', value: 89, icon: '📊', trend: 7, color: 'bg-blue-500' },
    { title: 'Objectifs Atteints', value: 92, icon: '🎯', trend: 12, color: 'bg-green-500' },
    { title: 'Délais Respectés', value: 85, icon: '⏱️', trend: -3, color: 'bg-orange-500' },
    { title: 'Efficacité', value: 94, icon: '📈', trend: 8, color: 'bg-purple-500' },
  ];

  const chartData = [
    { name: 'pending', value: 23 },
    { name: 'in_progress', value: 45 },
    { name: 'completed', value: 87 },
    { name: 'cancelled', value: 1 }
  ];

  const divisionPerformance = [
    { name: 'Administration Générale', tasks: 45, completed: 41, efficiency: 91 },
    { name: 'Finance', tasks: 32, completed: 28, efficiency: 88 },
    { name: 'Ressources Humaines', tasks: 28, completed: 24, efficiency: 86 },
    { name: 'Informatique', tasks: 25, completed: 24, efficiency: 96 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-institutional-blue mb-2">
            Statistiques Gouvernementales
          </h1>
          <p className="text-muted-foreground">
            Analyse des performances et indicateurs clés
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {globalStats.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Distribution des Tâches</CardTitle>
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
              <CardTitle>Performance par Division</CardTitle>
              <CardDescription>
                Efficacité des différentes divisions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {divisionPerformance.map((division) => (
                  <div key={division.name} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">{division.name}</h4>
                      <span className="text-sm font-medium text-institutional-blue">
                        {division.efficiency}%
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Tâches totales:</span>
                        <span>{division.tasks}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Terminées:</span>
                        <span className="text-green-600">{division.completed}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-institutional-blue h-2 rounded-full" 
                          style={{ width: `${division.efficiency}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tendances Mensuelles</CardTitle>
            <CardDescription>
              Évolution de la productivité sur les 6 derniers mois
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { month: 'Janvier', productivity: 87 },
                { month: 'Février', productivity: 89 },
                { month: 'Mars', productivity: 92 },
                { month: 'Avril', productivity: 88 },
                { month: 'Mai', productivity: 94 },
                { month: 'Juin', productivity: 91 },
              ].map((data) => (
                <div key={data.month} className="flex items-center justify-between">
                  <span className="text-sm font-medium w-20">{data.month}</span>
                  <div className="flex items-center space-x-2 flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-institutional-blue to-institutional-gold h-2 rounded-full" 
                        style={{ width: `${data.productivity}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-muted-foreground w-10">
                      {data.productivity}%
                    </span>
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
