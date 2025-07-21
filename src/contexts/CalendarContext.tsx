import React, { createContext, useContext, useState, useEffect } from 'react';
import { CalendarEvent, EventNote, EventType } from '@/types/user';
import { useUser } from './UserContext';
import { format } from 'date-fns';

interface CalendarContextType {
  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEvent: (id: number, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: number) => void;
  addEventNote: (eventId: number, content: string) => void;
  getEventsByDate: (date: string) => CalendarEvent[];
  getEventsByMonth: (year: number, month: number) => CalendarEvent[];
  filterEventsByType: (type: EventType | null) => CalendarEvent[];
  createEventFromTimeSlot: (startTime: string, endTime: string, date: Date, title?: string) => void;
  checkTimeSlotConflict: (startDateTime: string, endDateTime: string, excludeEventId?: number) => boolean;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

// Mock data for demonstration
const mockEvents: CalendarEvent[] = [
  {
    id: 1,
    title: 'Réunion avec le Maire',
    description: 'Discussion sur les projets d\'infrastructure urbaine',
    eventType: 'reunion',
    startDateTime: '2025-01-16T10:00:00',
    endDateTime: '2025-01-16T11:30:00',
    location: 'Bureau du Gouverneur',
    governorId: 1,
    createdBy: 3,
    status: 'confirmed',
    createdAt: '2025-01-15T09:00:00',
    updatedAt: '2025-01-15T09:00:00',
    notes: [
      {
        id: 1,
        eventId: 1,
        content: 'Préparer les dossiers sur les routes provinciales',
        createdAt: '2025-01-15T14:00:00',
        createdBy: 3
      }
    ]
  },
  {
    id: 2,
    title: 'Conférence de Presse',
    description: 'Annonce des nouveaux investissements dans la santé',
    eventType: 'conference',
    startDateTime: '2025-01-17T15:00:00',
    endDateTime: '2025-01-17T16:00:00',
    location: 'Salle de Presse',
    governorId: 1,
    createdBy: 3,
    status: 'scheduled',
    createdAt: '2025-01-14T16:00:00',
    updatedAt: '2025-01-14T16:00:00'
  },
  {
    id: 3,
    title: 'Rendez-vous avec le Ministre de l\'Éducation',
    eventType: 'rendez-vous',
    startDateTime: '2025-01-20T09:00:00',
    endDateTime: '2025-01-20T10:00:00',
    location: 'Ministère de l\'Éducation',
    governorId: 1,
    createdBy: 3,
    status: 'confirmed',
    createdAt: '2025-01-13T11:00:00',
    updatedAt: '2025-01-13T11:00:00'
  }
];

export function CalendarProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const { user } = useUser();

  useEffect(() => {
    // Load events from localStorage or use mock data
    const storedEvents = localStorage.getItem('calendar_events');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    } else {
      setEvents(mockEvents);
    }
  }, []);

  useEffect(() => {
    // Save events to localStorage whenever events change
    localStorage.setItem('calendar_events', JSON.stringify(events));
  }, [events]);

  const addEvent = (eventData: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: Date.now(), // Simple ID generation for demo
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = (id: number, updates: Partial<CalendarEvent>) => {
    setEvents(prev => prev.map(event => 
      event.id === id 
        ? { ...event, ...updates, updatedAt: new Date().toISOString() }
        : event
    ));
  };

  const deleteEvent = (id: number) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const addEventNote = (eventId: number, content: string) => {
    if (!user) return;
    
    const newNote: EventNote = {
      id: Date.now(),
      eventId,
      content,
      createdAt: new Date().toISOString(),
      createdBy: user.id
    };

    setEvents(prev => prev.map(event => 
      event.id === eventId
        ? { 
            ...event, 
            notes: [...(event.notes || []), newNote],
            updatedAt: new Date().toISOString()
          }
        : event
    ));
  };

  const getEventsByDate = (date: string) => {
    return events.filter(event => {
      const eventDate = new Date(event.startDateTime).toDateString();
      const targetDate = new Date(date).toDateString();
      return eventDate === targetDate;
    });
  };

  const getEventsByMonth = (year: number, month: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.startDateTime);
      return eventDate.getFullYear() === year && eventDate.getMonth() === month;
    });
  };

  const filterEventsByType = (type: EventType | null) => {
    if (!type) return events;
    return events.filter(event => event.eventType === type);
  };

  const createEventFromTimeSlot = (startTime: string, endTime: string, date: Date, title = 'Nouveau rendez-vous') => {
    if (!user) return;
    
    const startDateTime = new Date(date);
    const [startHour, startMinute] = startTime.split(':').map(Number);
    startDateTime.setHours(startHour, startMinute, 0, 0);
    
    const endDateTime = new Date(date);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    endDateTime.setHours(endHour, endMinute, 0, 0);
    
    const newEvent: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'> = {
      title,
      eventType: 'rendez-vous',
      startDateTime: startDateTime.toISOString(),
      endDateTime: endDateTime.toISOString(),
      status: 'scheduled',
      governorId: 1, // Default governor ID
      createdBy: user.id
    };
    
    addEvent(newEvent);
  };

  const checkTimeSlotConflict = (startDateTime: string, endDateTime: string, excludeEventId?: number) => {
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    
    return events.some(event => {
      if (excludeEventId && event.id === excludeEventId) return false;
      
      const eventStart = new Date(event.startDateTime);
      const eventEnd = new Date(event.endDateTime);
      
      return start < eventEnd && end > eventStart;
    });
  };

  const value = {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    addEventNote,
    getEventsByDate,
    getEventsByMonth,
    filterEventsByType,
    createEventFromTimeSlot,
    checkTimeSlotConflict
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
}