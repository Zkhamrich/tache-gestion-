
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
} from '@/components/ui/menubar';
import { 
  FileText, 
  Users, 
  Building2, 
  Calendar, 
  BarChart3, 
  HelpCircle, 
  Download,
  Upload,
  Search,
  Filter,
  RefreshCw,
  LogOut,
  User,
  Bell,
  Moon,
  Sun,
  Globe,
  Crown, 
  Shield, 
  UserCheck, 
  Settings,
  Eye
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const roleIcons = {
  governor: Crown,
  secretary_general: Shield,
  personal_secretary: UserCheck,
  admin: Settings,
  division_head: Building2
};

const roleLabels = {
  governor: 'Gouverneur',
  secretary_general: 'Secrétaire Général',
  personal_secretary: 'Secrétaire Personnel',
  admin: 'Administrateur',
  division_head: 'Chef de Division'
};

const roleColors = {
  governor: 'bg-gradient-to-r from-purple-600 to-indigo-600',
  secretary_general: 'bg-gradient-to-r from-blue-600 to-cyan-600',
  personal_secretary: 'bg-gradient-to-r from-green-600 to-teal-600',
  admin: 'bg-gradient-to-r from-red-600 to-pink-600',
  division_head: 'bg-gradient-to-r from-orange-600 to-yellow-600'
};

export function Header() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  // For testing, use a default admin user if none exists
  const currentUser = user || {
    id: 1,
    username: 'admin',
    role: 'admin' as const
  };

  const RoleIcon = roleIcons[currentUser.role];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleExport = () => {
    console.log('Export functionality to be implemented');
  };

  const handleImport = () => {
    console.log('Import functionality to be implemented');
  };

  const handleSearch = () => {
    console.log('Global search to be implemented');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <header className="border-b bg-white shadow-sm sticky top-0 z-40">
      <div className="h-16 flex items-center justify-between px-4 md:px-6">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <SidebarTrigger className="md:hidden" />
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-institutional-blue truncate">
              Système de Gestion des Tâches
            </h1>
            <p className="text-xs text-muted-foreground hidden md:block">
              Administration Gouvernementale
            </p>
          </div>
        </div>

        {/* Center Section - Menu Bar */}
        <div className="hidden lg:flex flex-1 justify-center max-w-4xl mx-6">
          <Menubar className="border-none bg-transparent">
            {/* Menu Fichier */}
            <MenubarMenu>
              <MenubarTrigger className="text-sm font-medium">Fichier</MenubarTrigger>
              <MenubarContent>
                <MenubarItem onClick={() => handleNavigation('/personal-secretary/new-task')}>
                  <FileText className="mr-2 h-4 w-4" />
                  Nouvelle tâche
                  <MenubarShortcut>Ctrl+N</MenubarShortcut>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarSub>
                  <MenubarSubTrigger>
                    <Download className="mr-2 h-4 w-4" />
                    Exporter
                  </MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarItem onClick={handleExport}>
                      Exporter les tâches (PDF)
                    </MenubarItem>
                    <MenubarItem onClick={handleExport}>
                      Exporter les tâches (Excel)
                    </MenubarItem>
                    <MenubarItem onClick={handleExport}>
                      Exporter le calendrier
                    </MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
                <MenubarItem onClick={handleImport}>
                  <Upload className="mr-2 h-4 w-4" />
                  Importer des données
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            {/* Menu Édition */}
            <MenubarMenu>
              <MenubarTrigger className="text-sm font-medium">Édition</MenubarTrigger>
              <MenubarContent>
                <MenubarItem onClick={handleSearch}>
                  <Search className="mr-2 h-4 w-4" />
                  Recherche globale
                  <MenubarShortcut>Ctrl+F</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>
                  <Filter className="mr-2 h-4 w-4" />
                  Filtres avancés
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem onClick={handleRefresh}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Actualiser
                  <MenubarShortcut>F5</MenubarShortcut>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            {/* Menu Navigation */}
            <MenubarMenu>
              <MenubarTrigger className="text-sm font-medium">Navigation</MenubarTrigger>
              <MenubarContent>
                <MenubarItem onClick={() => handleNavigation(`/${currentUser.role.replace('_', '-')}/dashboard`)}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Tableau de bord
                </MenubarItem>
                
                {currentUser.role === 'personal_secretary' && (
                  <>
                    <MenubarItem onClick={() => handleNavigation('/personal-secretary/tasks')}>
                      <FileText className="mr-2 h-4 w-4" />
                      Mes tâches
                    </MenubarItem>
                    <MenubarItem onClick={() => handleNavigation('/personal-secretary/calendar')}>
                      <Calendar className="mr-2 h-4 w-4" />
                      Calendrier
                    </MenubarItem>
                  </>
                )}

                {currentUser.role === 'governor' && (
                  <>
                    <MenubarItem onClick={() => handleNavigation('/governor/tasks')}>
                      <FileText className="mr-2 h-4 w-4" />
                      Toutes les tâches
                    </MenubarItem>
                    <MenubarItem onClick={() => handleNavigation('/governor/calendar')}>
                      <Calendar className="mr-2 h-4 w-4" />
                      Mon calendrier
                    </MenubarItem>
                    <MenubarItem onClick={() => handleNavigation('/governor/statistics')}>
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Statistiques
                    </MenubarItem>
                  </>
                )}

                {currentUser.role === 'secretary_general' && (
                  <MenubarItem onClick={() => handleNavigation('/secretary-general/followup')}>
                    <Eye className="mr-2 h-4 w-4" />
                    Suivi des tâches
                  </MenubarItem>
                )}

                {currentUser.role === 'admin' && (
                  <>
                    <MenubarItem onClick={() => handleNavigation('/admin/users')}>
                      <Users className="mr-2 h-4 w-4" />
                      Gestion utilisateurs
                    </MenubarItem>
                    <MenubarItem onClick={() => handleNavigation('/admin/divisions')}>
                      <Building2 className="mr-2 h-4 w-4" />
                      Gestion divisions
                    </MenubarItem>
                    <MenubarItem onClick={() => handleNavigation('/admin/statistics')}>
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Statistiques système
                    </MenubarItem>
                  </>
                )}
              </MenubarContent>
            </MenubarMenu>

            {/* Menu Outils */}
            <MenubarMenu>
              <MenubarTrigger className="text-sm font-medium">Outils</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </MenubarItem>
                <MenubarItem>
                  <User className="mr-2 h-4 w-4" />
                  Profil utilisateur
                </MenubarItem>
                <MenubarSeparator />
                <MenubarSub>
                  <MenubarSubTrigger>
                    <Settings className="mr-2 h-4 w-4" />
                    Préférences
                  </MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarItem>
                      <Sun className="mr-2 h-4 w-4" />
                      Thème clair
                    </MenubarItem>
                    <MenubarItem>
                      <Moon className="mr-2 h-4 w-4" />
                      Thème sombre
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem>
                      <Globe className="mr-2 h-4 w-4" />
                      Langue
                    </MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
              </MenubarContent>
            </MenubarMenu>

            {/* Menu Aide */}
            <MenubarMenu>
              <MenubarTrigger className="text-sm font-medium">Aide</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Guide d'utilisation
                </MenubarItem>
                <MenubarItem>
                  <FileText className="mr-2 h-4 w-4" />
                  Documentation
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem>
                  À propos du système
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>

        {/* Right Section - User Info */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="flex items-center space-x-2 md:space-x-3">
            <Avatar className={`h-8 w-8 ${roleColors[currentUser.role]} flex-shrink-0`}>
              <AvatarFallback className="text-white font-semibold">
                <RoleIcon className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="text-right hidden sm:block">
              <p className="font-medium text-sm truncate max-w-32">
                {currentUser.username}
              </p>
              <Badge variant="secondary" className="text-xs">
                {roleLabels[currentUser.role]}
              </Badge>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={logout}
            className="hover:bg-destructive hover:text-destructive-foreground transition-colors flex-shrink-0"
          >
            <LogOut className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Déconnexion</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
