
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Building2 } from 'lucide-react';

interface Division {
  id: number;
  name: string;
  responsible: string;
  taskCount: number;
  completedTasks: number;
}

export default function DivisionsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const mockDivisions: Division[] = [
    { id: 1, name: 'Administration Générale', responsible: 'sec_general', taskCount: 25, completedTasks: 18 },
    { id: 2, name: 'Ressources Humaines', responsible: 'rh_manager', taskCount: 15, completedTasks: 12 },
    { id: 3, name: 'Finance', responsible: 'finance_manager', taskCount: 30, completedTasks: 22 },
    { id: 4, name: 'Informatique', responsible: 'it_manager', taskCount: 20, completedTasks: 16 },
  ];

  const filteredDivisions = mockDivisions.filter(division =>
    division.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    division.responsible.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout>
      <PageHeader 
        title="Gestion des Divisions"
        description="Gérez les divisions et leurs responsables"
        action={{
          label: "Nouvelle Division",
          onClick: () => console.log("Add division"),
          icon: Plus
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {mockDivisions.map((division) => (
          <Card key={division.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">{division.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Responsable: {division.responsible}
                </p>
                <div className="flex justify-between text-sm">
                  <span>Tâches:</span>
                  <span>{division.taskCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Terminées:</span>
                  <span className="text-green-600">{division.completedTasks}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${(division.completedTasks / division.taskCount) * 100}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Divisions</CardTitle>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une division..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Division</th>
                  <th className="text-left p-4">Responsable</th>
                  <th className="text-left p-4">Tâches</th>
                  <th className="text-left p-4">Progression</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDivisions.map((division) => (
                  <tr key={division.id} className="border-b hover:bg-muted/50">
                    <td className="p-4 font-medium">{division.name}</td>
                    <td className="p-4">{division.responsible}</td>
                    <td className="p-4">{division.taskCount}</td>
                    <td className="p-4">
                      <Badge variant="default">
                        {Math.round((division.completedTasks / division.taskCount) * 100)}%
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
