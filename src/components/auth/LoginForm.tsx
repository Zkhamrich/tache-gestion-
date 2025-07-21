
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Crown, Shield, UserCheck, Settings, AlertCircle } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { UserRole } from '@/types/user';
import { Alert, AlertDescription } from '@/components/ui/alert';

const roleOptions = [
  { value: 'governor', label: 'Gouverneur', icon: Crown, description: 'Accès lecture seule + statistiques' },
  { value: 'secretary_general', label: 'Secrétaire Général', icon: Shield, description: 'Suivi des tâches' },
  { value: 'personal_secretary', label: 'Secrétaire Personnel', icon: UserCheck, description: 'Saisie des tâches' },
  { value: 'admin', label: 'Administrateur', icon: Settings, description: 'Accès complet' }
];

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      setError('Veuillez sélectionner un rôle');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const success = await login(username, password, role);
      if (!success) {
        setError('Identifiants incorrects');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedRole = roleOptions.find(r => r.value === role);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-institutional-blue via-primary to-institutional-blue p-6">
      <div className="w-full max-w-md animate-slide-up">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-8">
            <div className="w-16 h-16 gradient-institutional rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-institutional-blue">
              Connexion Sécurisée
            </CardTitle>
            <CardDescription>
              Système de Gestion des Tâches Gouvernementales
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="role">Rôle d'utilisateur</Label>
                <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center space-x-2">
                            <Icon className="h-4 w-4" />
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {selectedRole && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedRole.description}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Entrez votre nom d'utilisateur"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez votre mot de passe"
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full gradient-institutional text-white hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>

            <div className="mt-8 p-4 bg-institutional-light rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Comptes de démonstration :</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p><strong>Gouverneur:</strong> governor / password</p>
                <p><strong>Secrétaire Général:</strong> sec_general / password</p>
                <p><strong>Secrétaire Personnel:</strong> sec_personal / password</p>
                <p><strong>Administrateur:</strong> admin / password</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
