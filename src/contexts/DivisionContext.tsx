
import React, { createContext, useContext, useState } from 'react';
import { Division } from '@/types';

interface DivisionContextType {
  divisions: Division[];
  getDivisionById: (id: number) => Division | undefined;
  addDivision: (division: Omit<Division, 'id'>) => void;
  updateDivision: (id: number, division: Partial<Division>) => void;
  deleteDivision: (id: number) => void;
}

const DivisionContext = createContext<DivisionContextType | undefined>(undefined);

export function DivisionProvider({ children }: { children: React.ReactNode }) {
  const [divisions, setDivisions] = useState<Division[]>([
    { id: 1, name: 'Administration Générale', responsible: 'Ahmed Ben Ali', taskCount: 25, completedTasks: 18 },
    { id: 2, name: 'Division Technique', responsible: 'Fatima El Mansouri', taskCount: 32, completedTasks: 24 },
    { id: 3, name: 'Finance', responsible: 'Mohammed Hassani', taskCount: 15, completedTasks: 12 },
    { id: 4, name: 'Ressources Humaines', responsible: 'Aicha Benjelloun', taskCount: 18, completedTasks: 16 },
    { id: 5, name: 'Logistique', responsible: 'Omar El Idrissi', taskCount: 22, completedTasks: 19 }
  ]);

  const getDivisionById = (id: number): Division | undefined => {
    return divisions.find(division => division.id === id);
  };

  const addDivision = (newDivision: Omit<Division, 'id'>) => {
    const id = Math.max(...divisions.map(d => d.id), 0) + 1;
    setDivisions(prev => [...prev, { ...newDivision, id }]);
  };

  const updateDivision = (id: number, updatedDivision: Partial<Division>) => {
    setDivisions(prev => 
      prev.map(division => 
        division.id === id ? { ...division, ...updatedDivision } : division
      )
    );
  };

  const deleteDivision = (id: number) => {
    setDivisions(prev => prev.filter(division => division.id !== id));
  };

  return (
    <DivisionContext.Provider value={{
      divisions,
      getDivisionById,
      addDivision,
      updateDivision,
      deleteDivision
    }}>
      {children}
    </DivisionContext.Provider>
  );
}

export function useDivision() {
  const context = useContext(DivisionContext);
  if (context === undefined) {
    throw new Error('useDivision must be used within a DivisionProvider');
  }
  return context;
}
