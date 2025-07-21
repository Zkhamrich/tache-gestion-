
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, UserPermission } from '@/types';
import { ROLE_PERMISSIONS } from '@/types/permissions';

interface UserContextType {
  user: User | null;
  login: (username: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (resource: string, action: string) => boolean;
  canAccessRoute: (route: string) => boolean;
  getUserPermissions: () => UserPermission[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, password: string, role: UserRole): Promise<boolean> => {
    // Simulate authentication logic with updated user structure
    console.log('Attempting login:', { username, role });
    
    // Enhanced mock users with proper role structure according to new schema
    const mockUsers: Record<string, User> = {
      'governor': { 
        id: 1, 
        username: 'governor', 
        role: 'governor',
        personalSecretaryId: 3
      },
      'sec_general': { 
        id: 2, 
        username: 'sec_general', 
        role: 'secretary_general',
        personalSecretaryId: 4
      },
      'sec_personal_gov': { 
        id: 3, 
        username: 'sec_personal_gov', 
        role: 'personal_secretary',
        superiorRole: 'governor',
        superiorId: 1, // References governor
        divisionId: 1, 
        divisionName: 'Cabinet du Gouverneur'
      },
      'sec_personal_sg': { 
        id: 4, 
        username: 'sec_personal_sg', 
        role: 'personal_secretary',
        superiorRole: 'secretary_general',
        superiorId: 2, // References secretary general
        divisionId: 1, 
        divisionName: 'Administration Générale'
      },
      'division_head': { 
        id: 5, 
        username: 'division_head', 
        role: 'division_head',
        divisionId: 2, 
        divisionName: 'Division Technique'
      },
      'admin': { 
        id: 6, 
        username: 'admin', 
        role: 'admin'
      }
    };

    const userData = mockUsers[username];
    
    if (userData && password === 'password') {
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const hasPermission = (resource: string, action: string): boolean => {
    if (!user) return false;
    
    const roleConfig = ROLE_PERMISSIONS[user.role];
    if (!roleConfig) return false;
    
    const permission = roleConfig.permissions.find(p => p.resource === resource);
    if (!permission) return false;
    
    return permission.actions.includes(action) || permission.actions.includes('manage');
  };

  const canAccessRoute = (route: string): boolean => {
    if (!user) return false;
    
    const roleConfig = ROLE_PERMISSIONS[user.role];
    if (!roleConfig) return false;
    
    // Check if route matches the user's allowed dashboard path or sub-routes
    const basePath = `/${user.role.replace('_', '-')}`;
    return route.startsWith(basePath) || route === '/' || route === '/login';
  };

  const getUserPermissions = (): UserPermission[] => {
    if (!user) return [];
    
    const roleConfig = ROLE_PERMISSIONS[user.role];
    return roleConfig?.permissions || [];
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated, 
      hasPermission, 
      canAccessRoute, 
      getUserPermissions 
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
