
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, TaskStatus, TaskHistory, TaskStatusHistory, User } from '@/types/user';
import { useUser } from '@/contexts/UserContext';

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  
  // CRUD operations
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Task>;
  updateTask: (id: number, updates: Partial<Task>) => Promise<Task>;
  deleteTask: (id: number) => Promise<void>;
  getTask: (id: number) => Task | undefined;
  
  // Status management
  updateTaskStatus: (taskId: number, status: TaskStatus, note?: string) => Promise<void>;
  getTaskStatusHistory: (taskId: number) => TaskStatusHistory[];
  
  // History management
  getTaskHistory: (taskId: number) => TaskHistory[];
  addTaskHistory: (taskId: number, description: string) => Promise<void>;
  
  // Filtering and searching
  getTasksByDivision: (divisionId: number) => Task[];
  getTasksForSecretary: (secretaryId: number) => Task[];
  getTasksForFollowup: () => Task[];
  searchTasks: (query: string) => Task[];
  
  // Statistics
  getTaskStats: () => {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
  };
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [statusHistory, setStatusHistory] = useState<TaskStatusHistory[]>([]);
  const [taskHistory, setTaskHistory] = useState<TaskHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  // Mock data - will be replaced with API calls
  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {
    const mockTasks: Task[] = [
      {
        id: 1,
        name: 'Rapport Budget Q1',
        description: 'Préparation du rapport budgétaire du premier trimestre',
        dueDate: '2024-01-25',
        status: 'En cours',
        divisionId: 1,
        divisionName: 'Administration Générale',
        createdBy: 3,
        isForSgFollowup: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-20T14:30:00Z'
      },
      {
        id: 2,
        name: 'Préparation Réunion Conseil',
        description: 'Documents pour la réunion avec le gouverneur',
        dueDate: '2024-01-22',
        status: 'En attente',
        divisionId: 1,
        divisionName: 'Administration Générale',
        createdBy: 3,
        isForSgFollowup: false,
        createdAt: '2024-01-18T09:00:00Z',
        updatedAt: '2024-01-18T09:00:00Z'
      },
      {
        id: 3,
        name: 'Audit Interne Division',
        description: 'Coordination de l\'audit interne de la division',
        dueDate: '2024-01-30',
        status: 'En cours',
        divisionId: 2,
        divisionName: 'Finance',
        createdBy: 3,
        isForSgFollowup: true,
        createdAt: '2024-01-10T11:00:00Z',
        updatedAt: '2024-01-15T16:45:00Z'
      },
      {
        id: 4,
        name: 'Formation Sécurité Personnel',
        description: 'Organisation de la formation annuelle sécurité',
        dueDate: '2024-02-05',
        status: 'Terminé',
        finDate: '2024-01-28',
        divisionId: 3,
        divisionName: 'Ressources Humaines',
        createdBy: 3,
        isForSgFollowup: false,
        createdAt: '2024-01-05T08:30:00Z',
        updatedAt: '2024-01-28T17:00:00Z'
      }
    ];

    const mockStatusHistory: TaskStatusHistory[] = [
      {
        id: 1,
        status: 'En attente',
        dateChanged: '2024-01-15T10:00:00Z',
        taskId: 1,
        changedByUserId: 3,
        changedByUsername: 'sec_personal'
      },
      {
        id: 2,
        status: 'En cours',
        dateChanged: '2024-01-20T14:30:00Z',
        taskId: 1,
        changedByUserId: 2,
        changedByUsername: 'sec_general'
      }
    ];

    const mockTaskHistory: TaskHistory[] = [
      {
        id: 1,
        description: 'Tâche créée avec priorité haute',
        changeDate: '2024-01-15T10:00:00Z',
        taskId: 1,
        changedByUserId: 3,
        changedByUsername: 'sec_personal'
      },
      {
        id: 2,
        description: 'Statut mis à jour - en cours de traitement',
        changeDate: '2024-01-20T14:30:00Z',
        taskId: 1,
        changedByUserId: 2,
        changedByUsername: 'sec_general'
      }
    ];

    setTasks(mockTasks);
    setStatusHistory(mockStatusHistory);
    setTaskHistory(mockTaskHistory);
  };

  const createTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock implementation - replace with API call
      const newTask: Task = {
        ...taskData,
        id: Math.max(...tasks.map(t => t.id), 0) + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setTasks(prev => [...prev, newTask]);
      
      // Add initial status history
      const initialStatus: TaskStatusHistory = {
        id: Math.max(...statusHistory.map(s => s.id), 0) + 1,
        status: taskData.status,
        dateChanged: new Date().toISOString(),
        taskId: newTask.id,
        changedByUserId: user?.id || 0,
        changedByUsername: user?.username
      };
      
      setStatusHistory(prev => [...prev, initialStatus]);
      
      return newTask;
    } catch (err) {
      setError('Erreur lors de la création de la tâche');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id: number, updates: Partial<Task>): Promise<Task> => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedTask = tasks.find(t => t.id === id);
      if (!updatedTask) {
        throw new Error('Tâche non trouvée');
      }

      const newTask: Task = {
        ...updatedTask,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      setTasks(prev => prev.map(t => t.id === id ? newTask : t));
      
      // Add history entry
      if (Object.keys(updates).length > 0) {
        await addTaskHistory(id, `Tâche mise à jour: ${Object.keys(updates).join(', ')}`);
      }
      
      return newTask;
    } catch (err) {
      setError('Erreur lors de la mise à jour de la tâche');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      setTasks(prev => prev.filter(t => t.id !== id));
      setStatusHistory(prev => prev.filter(s => s.taskId !== id));
      setTaskHistory(prev => prev.filter(h => h.taskId !== id));
    } catch (err) {
      setError('Erreur lors de la suppression de la tâche');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getTask = (id: number): Task | undefined => {
    return tasks.find(t => t.id === id);
  };

  const updateTaskStatus = async (taskId: number, status: TaskStatus, note?: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Update task status
      await updateTask(taskId, { 
        status,
        ...(status === 'Terminé' && { finDate: new Date().toISOString().split('T')[0] })
      });
      
      // Add status history
      const statusEntry: TaskStatusHistory = {
        id: Math.max(...statusHistory.map(s => s.id), 0) + 1,
        status,
        dateChanged: new Date().toISOString(),
        taskId,
        changedByUserId: user?.id || 0,
        changedByUsername: user?.username
      };
      
      setStatusHistory(prev => [...prev, statusEntry]);
      
      // Add history note if provided
      if (note) {
        await addTaskHistory(taskId, `Statut changé vers "${status}": ${note}`);
      }
    } catch (err) {
      setError('Erreur lors de la mise à jour du statut');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getTaskStatusHistory = (taskId: number): TaskStatusHistory[] => {
    return statusHistory.filter(s => s.taskId === taskId).sort((a, b) => 
      new Date(b.dateChanged).getTime() - new Date(a.dateChanged).getTime()
    );
  };

  const getTaskHistory = (taskId: number): TaskHistory[] => {
    return taskHistory.filter(h => h.taskId === taskId).sort((a, b) => 
      new Date(b.changeDate).getTime() - new Date(a.changeDate).getTime()
    );
  };

  const addTaskHistory = async (taskId: number, description: string): Promise<void> => {
    const historyEntry: TaskHistory = {
      id: Math.max(...taskHistory.map(h => h.id), 0) + 1,
      description,
      changeDate: new Date().toISOString(),
      taskId,
      changedByUserId: user?.id || 0,
      changedByUsername: user?.username
    };
    
    setTaskHistory(prev => [...prev, historyEntry]);
  };

  const getTasksByDivision = (divisionId: number): Task[] => {
    return tasks.filter(t => t.divisionId === divisionId);
  };

  const getTasksForSecretary = (secretaryId: number): Task[] => {
    return tasks.filter(t => t.createdBy === secretaryId);
  };

  const getTasksForFollowup = (): Task[] => {
    return tasks.filter(t => t.isForSgFollowup);
  };

  const searchTasks = (query: string): Task[] => {
    const lowercaseQuery = query.toLowerCase();
    return tasks.filter(t => 
      t.name.toLowerCase().includes(lowercaseQuery) ||
      t.description.toLowerCase().includes(lowercaseQuery) ||
      t.divisionName.toLowerCase().includes(lowercaseQuery)
    );
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const pending = tasks.filter(t => t.status === 'En attente').length;
    const inProgress = tasks.filter(t => t.status === 'En cours').length;
    const completed = tasks.filter(t => t.status === 'Terminé').length;
    const cancelled = tasks.filter(t => t.status === 'Annulé').length;
    
    return { total, pending, inProgress, completed, cancelled };
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      loading,
      error,
      createTask,
      updateTask,
      deleteTask,
      getTask,
      updateTaskStatus,
      getTaskStatusHistory,
      getTaskHistory,
      addTaskHistory,
      getTasksByDivision,
      getTasksForSecretary,
      getTasksForFollowup,
      searchTasks,
      getTaskStats
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTask() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
}
