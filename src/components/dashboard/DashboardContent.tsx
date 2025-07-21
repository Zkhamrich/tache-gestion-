
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from './StatCard';
import { TaskStatusChart } from './TaskStatusChart';
import { useUser } from '@/contexts/UserContext';
import { StatCard as StatCardType, User, PersonalSecretary, DivisionHead } from '@/types';
import { Calendar, CheckCircle, Clock, AlertTriangle, Users, Building, FileText, TrendingUp } from 'lucide-react';

const generateMockStats = (role: string): StatCardType[] => {
  const baseStats = [
    {
      title: 'Tâches Totales',
      value: 156,
      icon: '📋',
      trend: 12,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600'
    },
    {
      title: 'Tâches Terminées',
      value: 89,
      icon: '✅',
      trend: 8,
      color: 'bg-gradient-to-r from-green-500 to-green-600'
    },
    {
      title: 'En Cours',
      value: 45,
      icon: '⏳',
      trend: -3,
      color: 'bg-gradient-to-r from-orange-500 to-orange-600'
    },
    {
      title: 'En Retard',
      value: 22,
      icon: '⚠️',
      trend: -15,
      color: 'bg-gradient-to-r from-red-500 to-red-600'
    }
  ];

  if (role === 'governor') {
    return [
      ...baseStats,
      {
        title: 'Divisions Actives',
        value: 8,
        icon: '🏛️',
        trend: 0,
        color: 'bg-gradient-to-r from-purple-500 to-purple-600'
      },
      {
        title: 'Taux de Réussite',
        value: 87,
        icon: '📊',
        trend: 5,
        color: 'bg-gradient-to-r from-indigo-500 to-indigo-600'
      }
    ];
  }

  return baseStats;
};

const mockChartData = [
  { name: 'pending', value: 22 },
  { name: 'in_progress', value: 45 },
  { name: 'completed', value: 89 },
  { name: 'cancelled', value: 0 }
];

export function DashboardContent() {
  const { user } = useUser();
  
  if (!user) return null;

  const stats = generateMockStats(user.role);

  const getWelcomeMessage = () => {
    const messages = {
      governor: 'Bienvenue, Monsieur le Gouverneur',
      secretary_general: 'Bienvenue, Monsieur le Secrétaire Général',
      personal_secretary: 'Bienvenue dans votre espace de travail',
      admin: 'Bienvenue, Administrateur',
      division_head: 'Bienvenue, Chef de Division'
    };
    return messages[user.role];
  };

  const getDescription = () => {
    const descriptions = {
      governor: 'Vue d\'ensemble des performances et statistiques de toutes les divisions',
      secretary_general: 'Suivi et accompagnement des tâches de votre division',
      personal_secretary: 'Gestion et saisie des tâches pour votre division',
      admin: 'Administration complète du système',
      division_head: 'Gestion des tâches de votre division'
    };
    return descriptions[user.role];
  };

  // Type guard to check if user has divisionName
  const hasDivisionName = (user: User): user is PersonalSecretary | DivisionHead => {
    return user.role === 'personal_secretary' || user.role === 'division_head';
  };

  return (
    <div className="space-y-6 animate-fade-in-delay">
      {/* Welcome Section */}
      <div className="gradient-institutional rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">{getWelcomeMessage()}</h1>
        <p className="text-blue-100">{getDescription()}</p>
        {hasDivisionName(user) && (
          <div className="mt-3 inline-flex items-center space-x-2 bg-white/20 rounded-full px-3 py-1">
            <Building className="h-4 w-4" />
            <span className="text-sm">{user.divisionName}</span>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={stat.title} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
            <StatCard stat={stat} />
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <TaskStatusChart data={mockChartData} />
        
        <Card>
          <CardHeader>
            <CardTitle>Activité Récente</CardTitle>
            <CardDescription>
              Dernières actions sur les tâches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'Tâche "Rapport mensuel" terminée', time: 'Il y a 2h', type: 'completed' },
                { action: 'Nouvelle tâche "Réunion cabinet" créée', time: 'Il y a 4h', type: 'created' },
                { action: 'Tâche "Budget 2024" mise à jour', time: 'Il y a 6h', type: 'updated' },
                { action: 'Document ajouté à "Projet loi"', time: 'Il y a 1j', type: 'document' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'completed' ? 'bg-green-500' :
                    activity.type === 'created' ? 'bg-blue-500' :
                    activity.type === 'updated' ? 'bg-orange-500' :
                    'bg-purple-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
          <CardDescription>
            Raccourcis vers les fonctionnalités principales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {user.role !== 'governor' && (
              <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Nouvelle Tâche</p>
                  <p className="text-xs text-muted-foreground">Créer une tâche</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Planning</p>
                <p className="text-xs text-muted-foreground">Voir le calendrier</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Rapports</p>
                <p className="text-xs text-muted-foreground">Statistiques détaillées</p>
              </div>
            </div>
            
            {(user.role === 'admin' || user.role === 'governor') && (
              <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Divisions</p>
                  <p className="text-xs text-muted-foreground">Gérer les divisions</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
