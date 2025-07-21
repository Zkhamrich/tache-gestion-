
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Search, Filter, Edit, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTask } from '@/contexts/TaskContext';
import { useUser } from '@/contexts/UserContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function TaskList() {
  const navigate = useNavigate();
  const { getTasksForSecretary } = useTask();
  const { user } = useUser();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [divisionFilter, setDivisionFilter] = useState('all');

  // Get tasks created by this personal secretary
  const allTasks = user ? getTasksForSecretary(user.id) : [];

  // Apply filters
  const filteredTasks = allTasks.filter(task => {
    const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.divisionName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesDivision = divisionFilter === 'all' || task.divisionId === parseInt(divisionFilter);

    return matchesSearch && matchesStatus && matchesDivision;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Terminé': return 'bg-green-100 text-green-800 border-green-200';
      case 'En cours': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'En attente': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Annulé': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isOverdue = (dueDate: string, status: string) => {
    if (status === 'Terminé' || status === 'Annulé') return false;
    return new Date(dueDate) < new Date();
  };

  const divisions = [
    { id: 1, name: 'Administration Générale' },
    { id: 2, name: 'Finance' },
    { id: 3, name: 'Ressources Humaines' },
    { id: 4, name: 'Informatique' },
    { id: 5, name: 'Logistique' }
  ];

  return (
    <AppLayout>
      <PageHeader 
        title="Mes Tâches"
        description="Liste de toutes vos tâches créées"
        action={{
          label: "Nouvelle Tâche",
          onClick: () => navigate('/personal-secretary/new-task'),
          icon: PlusCircle
        }}
      />

      <Card>
        <CardHeader>
          <CardTitle>Filtres et Recherche</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une tâche..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="En attente">En attente</SelectItem>
                <SelectItem value="En cours">En cours</SelectItem>
                <SelectItem value="Terminé">Terminé</SelectItem>
                <SelectItem value="Annulé">Annulé</SelectItem>
              </SelectContent>
            </Select>

            <Select value={divisionFilter} onValueChange={setDivisionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Division" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les divisions</SelectItem>
                {divisions.map(division => (
                  <SelectItem key={division.id} value={division.id.toString()}>
                    {division.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setDivisionFilter('all');
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Tâches ({filteredTasks.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTasks.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tâche</TableHead>
                  <TableHead>Division</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Échéance</TableHead>
                  <TableHead>Suivi SG</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map(task => (
                  <TableRow key={task.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{task.name}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-xs">
                          {task.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{task.divisionName}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className={isOverdue(task.dueDate, task.status) ? 'text-red-600' : ''}>
                        {format(new Date(task.dueDate), 'dd/MM/yyyy', { locale: fr })}
                        {isOverdue(task.dueDate, task.status) && (
                          <span className="block text-xs text-red-500">En retard</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {task.isForSgFollowup ? (
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                          Oui
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">Non</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/personal-secretary/tasks/${task.id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== 'all' || divisionFilter !== 'all' 
                  ? 'Aucune tâche trouvée avec ces filtres'
                  : 'Aucune tâche créée'
                }
              </p>
              <Button 
                onClick={() => navigate('/personal-secretary/new-task')}
                variant="outline"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Créer votre première tâche
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
}
