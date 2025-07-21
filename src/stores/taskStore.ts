
import { create } from 'zustand';
import { Task } from '@/types/task';

interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  filters: {
    status: string | null;
    priority: string | null;
    division: string | null;
  };
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: number, updates: Partial<Task>) => void;
  deleteTask: (id: number) => void;
  setSelectedTask: (task: Task | null) => void;
  setFilters: (filters: Partial<TaskState['filters']>) => void;
  getFilteredTasks: () => Task[];
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  selectedTask: null,
  filters: {
    status: null,
    priority: null,
    division: null,
  },
  
  setTasks: (tasks) => set({ tasks }),
  
  addTask: (task) => set((state) => ({ 
    tasks: [...state.tasks, task] 
  })),
  
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map(task => 
      task.id === id ? { ...task, ...updates } : task
    )
  })),
  
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter(task => task.id !== id)
  })),
  
  setSelectedTask: (task) => set({ selectedTask: task }),
  
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),
  
  getFilteredTasks: () => {
    const { tasks, filters } = get();
    return tasks.filter(task => {
      if (filters.status && task.status !== filters.status) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      if (filters.division && task.divisionId?.toString() !== filters.division) return false;
      return true;
    });
  },
}));
