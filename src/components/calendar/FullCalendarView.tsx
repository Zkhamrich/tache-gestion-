
import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarEvent } from '@/types/user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, List, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface FullCalendarViewProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onDateClick?: (date: Date) => void;
  onEventDrop?: (eventId: number, newDate: Date) => void;
  editable?: boolean;
  className?: string;
}

const eventTypeColors: Record<string, string> = {
  'rendez-vous': '#3b82f6', // blue
  'reunion': '#8b5cf6', // purple
  'conference': '#10b981', // green
  'evenement-public': '#f59e0b', // amber
  'autre': '#6b7280' // gray
};

export function FullCalendarView({ 
  events, 
  onEventClick, 
  onDateClick, 
  onEventDrop,
  editable = false,
  className 
}: FullCalendarViewProps) {
  const [currentView, setCurrentView] = useState('dayGridMonth');

  // Transform events to FullCalendar format
  const calendarEvents = events.map(event => ({
    id: event.id.toString(),
    title: event.title,
    start: event.startDateTime,
    end: event.endDateTime,
    backgroundColor: eventTypeColors[event.eventType] || eventTypeColors.autre,
    borderColor: eventTypeColors[event.eventType] || eventTypeColors.autre,
    extendedProps: {
      originalEvent: event,
      description: event.description,
      location: event.location,
      status: event.status
    }
  }));

  const handleEventClick = (clickInfo: any) => {
    const originalEvent = clickInfo.event.extendedProps.originalEvent;
    if (onEventClick && originalEvent) {
      onEventClick(originalEvent);
    }
  };

  const handleDateClick = (dateClickInfo: any) => {
    if (onDateClick) {
      onDateClick(new Date(dateClickInfo.date));
    }
  };

  const handleEventDrop = (eventDropInfo: any) => {
    if (onEventDrop) {
      const eventId = parseInt(eventDropInfo.event.id);
      const newDate = new Date(eventDropInfo.event.start);
      onEventDrop(eventId, newDate);
    }
  };

  const viewButtons = [
    { key: 'dayGridMonth', label: 'Mois', icon: Calendar },
    { key: 'timeGridWeek', label: 'Semaine', icon: List },
    { key: 'timeGridDay', label: 'Jour', icon: Clock }
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Calendrier Avancé
          </CardTitle>
          
          <div className="flex gap-2">
            {viewButtons.map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant={currentView === key ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentView(key)}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2">
          {Object.entries(eventTypeColors).map(([type, color]) => (
            <Badge key={type} variant="outline" className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: color }}
              />
              {type.replace('-', ' ')}
            </Badge>
          ))}
        </div>

        <div className="fullcalendar-container">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: ''
            }}
            initialView={currentView}
            events={calendarEvents}
            editable={editable}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            eventClick={handleEventClick}
            dateClick={handleDateClick}
            eventDrop={handleEventDrop}
            height="auto"
            locale="fr"
            buttonText={{
              today: 'Aujourd\'hui',
              month: 'Mois',
              week: 'Semaine',
              day: 'Jour'
            }}
            slotLabelFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }}
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }}
            allDayText="Toute la journée"
            noEventsText="Aucun événement"
            moreLinkText="plus"
          />
        </div>
      </CardContent>
    </Card>
  );
}
