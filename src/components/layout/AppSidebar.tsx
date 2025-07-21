
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  BarChart3, 
  ClipboardList, 
  Eye, 
  FileText, 
  PlusCircle, 
  Crown,
  Calendar,
  Settings,
  CheckSquare
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import { useUser } from '@/contexts/UserContext';
import { User, PersonalSecretary, DivisionHead } from '@/types';

const menuItems = {
  admin: [
    {
      title: 'Dashboard Admin',
      url: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Gestion Utilisateurs',
      url: '/admin/users',
      icon: Users,
    },
    {
      title: 'Gestion Divisions',
      url: '/admin/divisions',
      icon: Building2,
    },
    {
      title: 'Statistiques Système',
      url: '/admin/statistics',
      icon: BarChart3,
    },
  ],
  governor: [
    {
      title: 'Dashboard Gouverneur',
      url: '/governor/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Mon Calendrier',
      url: '/governor/calendar',
      icon: Calendar,
    },
    {
      title: 'Toutes les Tâches',
      url: '/governor/tasks',
      icon: ClipboardList,
    },
    {
      title: 'Statistiques',
      url: '/governor/statistics',
      icon: BarChart3,
    },
  ],
  secretary_general: [
    {
      title: 'Dashboard SG',
      url: '/secretary-general/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Suivi des Tâches',
      url: '/secretary-general/followup',
      icon: Eye,
    },
  ],
  personal_secretary: [
    {
      title: 'Dashboard Secrétaire',
      url: '/personal-secretary/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Gestion Calendrier',
      url: '/personal-secretary/calendar',
      icon: Calendar,
    },
    {
      title: 'Nouvelle Tâche',
      url: '/personal-secretary/new-task',
      icon: PlusCircle,
    },
    {
      title: 'Mes Tâches',
      url: '/personal-secretary/tasks',
      icon: CheckSquare,
    },
  ],
  division_head: [
    {
      title: 'Dashboard Division',
      url: '/division-head/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Tâches Division',
      url: '/division-head/tasks',
      icon: ClipboardList,
    },
    {
      title: 'Rapports',
      url: '/division-head/reports',
      icon: FileText,
    },
    {
      title: 'Équipe',
      url: '/division-head/team',
      icon: Users,
    },
  ],
};

// For testing, show all menu items
const allMenuItems = [
  ...menuItems.admin.map(item => ({ ...item, group: 'Admin' })),
  ...menuItems.governor.map(item => ({ ...item, group: 'Gouverneur' })),
  ...menuItems.secretary_general.map(item => ({ ...item, group: 'Secrétaire Général' })),
  ...menuItems.personal_secretary.map(item => ({ ...item, group: 'Secrétaire Personnel' })),
  ...menuItems.division_head.map(item => ({ ...item, group: 'Chef Division' })),
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user } = useUser();
  
  const currentPath = location.pathname;
  const isActive = (path: string) => currentPath === path;

  // Type guard to check if user has divisionName
  const hasDivisionName = (user: User): user is PersonalSecretary | DivisionHead => {
    return user?.role === 'personal_secretary' || user?.role === 'division_head';
  };

  // Group menu items by group for better organization
  const groupedMenuItems = allMenuItems.reduce((acc, item) => {
    if (!acc[item.group]) {
      acc[item.group] = [];
    }
    acc[item.group].push(item);
    return acc;
  }, {} as Record<string, typeof allMenuItems>);

  return (
    <Sidebar className="border-r bg-sidebar">
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 gradient-institutional rounded-lg flex items-center justify-center flex-shrink-0">
            <Crown className="h-5 w-5 text-white" />
          </div>
          {state === 'expanded' && (
            <div className="min-w-0">
              <h2 className="font-bold text-institutional-blue text-sm truncate">
                SGT - Système de Gestion
              </h2>
              <p className="text-xs text-muted-foreground truncate">
                Administration Gouvernementale
              </p>
              {user && hasDivisionName(user) && (
                <p className="text-xs text-muted-foreground font-medium truncate">
                  {user.divisionName}
                </p>
              )}
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="overflow-y-auto">
        {Object.entries(groupedMenuItems).map(([groupName, items]) => (
          <SidebarGroup key={groupName}>
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {groupName}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <NavLink 
                        to={item.url} 
                        className="flex items-center gap-3 w-full text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        {state === 'expanded' && (
                          <span className="truncate">{item.title}</span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
