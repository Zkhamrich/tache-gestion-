
export type EventType = 'rendez-vous' | 'reunion' | 'conference' | 'evenement-public' | 'autre';

export interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  eventType: EventType;
  startDateTime: string;
  endDateTime: string;
  location?: string;
  governorId: number;
  createdBy: number; // personal_secretary.secretary_id
  notes?: EventNote[];
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface EventNote {
  id: number;
  eventId: number;
  content: string;
  createdAt: string;
  createdBy: number; // personal_secretary.secretary_id
}

export interface EventTypeOption {
  value: EventType;
  label: string;
  color: string;
}

export const EVENT_TYPE_OPTIONS: EventTypeOption[] = [
  { value: 'rendez-vous', label: 'Rendez-vous', color: 'bg-blue-100 text-blue-800' },
  { value: 'reunion', label: 'Réunion', color: 'bg-green-100 text-green-800' },
  { value: 'conference', label: 'Conférence', color: 'bg-purple-100 text-purple-800' },
  { value: 'evenement-public', label: 'Événement public', color: 'bg-orange-100 text-orange-800' },
  { value: 'autre', label: 'Autre', color: 'bg-gray-100 text-gray-800' }
];

// Interface pour l'export de types vers les autres fichiers
export type { CalendarEvent as CalendarEventType };
