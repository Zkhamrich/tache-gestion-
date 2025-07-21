
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

interface User {
  id: number;
  username: string;
  role: string;
  division?: string;
  status: 'active' | 'inactive';
  superiorId?: number;
  superiorName?: string;
}

export default function UsersManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const { hasPermission } = useUser();
  
  const mockUsers: User[] = [
    { id: 1, username: 'admin', role: 'admin', status: 'active' },
    { id: 2, username: 'governor', role: 'governor', status: 'active' },
    { id: 3, username: 'sec_general', role: 'secretary_general', division: 'Administration Générale', status: 'active' },
    { id: 4, username: 'sec_personal_gov', role: 'personal_secretary', division: 'Cabinet du Gouverneur', status: 'active', superiorId: 1, superiorName: 'Governor' },
    { id: 5, username: 'sec_personal_sg', role: 'personal_secretary', division: 'Administration Générale', status: 'active', superiorId: 2, superiorName: 'Secretary General' },
    { id: 6, username: 'division_head', role: 'division_head', division: 'Division Technique', status: 'active' },
  ];

  const filteredUsers = mockUsers.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.division && user.division.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'governor': return 'bg-purple-100 text-purple-800';
      case 'secretary_general': return 'bg-blue-100 text-blue-800';
      case 'personal_secretary': return 'bg-green-100 text-green-800';
      case 'division_head': return 'bg-orange-100 text-orange-800';
      case 'admin': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      'governor': 'Gouverneur',
      'secretary_general': 'Secrétaire Général',
      'personal_secretary': 'Secrétaire Personnel',
      'division_head': 'Chef de Division',
      'admin': 'Administrateur'
    };
    return roleNames[role as keyof typeof roleNames] || role;
  };

  const canManageUsers = hasPermission('users', 'manage') || hasPermission('users', 'create');

  return (
    <AppLayout>
      <PageHeader 
        title="Gestion des Utilisateurs"
        description="Gérez les comptes utilisateurs et leurs permissions dans le système"
        action={canManageUsers ? {
          label: "Nouvel Utilisateur",
          onClick: () => console.log("Add user"),
          icon: Plus
        } : undefined}
      />

      <Card>
        <CardHeader>
          <CardTitle>Liste des Utilisateurs</CardTitle>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un utilisateur..."
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
                  <th className="text-left p-4">Utilisateur</th>
                  <th className="text-left p-4">Rôle</th>
                  <th className="text-left p-4">Division</th>
                  <th className="text-left p-4">Supérieur</th>
                  <th className="text-left p-4">Statut</th>
                  {canManageUsers && <th className="text-left p-4">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-muted/50">
                    <td className="p-4 font-medium">{user.username}</td>
                    <td className="p-4">
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {getRoleDisplayName(user.role)}
                      </Badge>
                    </td>
                    <td className="p-4">{user.division || '-'}</td>
                    <td className="p-4">{user.superiorName || '-'}</td>
                    <td className="p-4">
                      <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                        {user.status === 'active' ? 'Actif' : 'Inactif'}
                      </Badge>
                    </td>
                    {canManageUsers && (
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
                    )}
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
