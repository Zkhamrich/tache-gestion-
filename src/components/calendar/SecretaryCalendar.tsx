
import React, { useState, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarEvent } from '@/types/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, List, Clock, Grid, Plus } from 'lucide-react';

interface SecretaryCalendarProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onDateClick?: (date: Date) => void;
  onEventDrop?: (eventId: number, newDate: Date) => void;
  onCreateEvent?: () => void;
  className?: string;
}

const eventTypeColors: Record<string, string> = {
  'rendez-vous': '#3b82f6',
  'reunion': '#8b5cf6',
  'conference': '#10b981',
  'evenement-public': '#f59e0b',
  'autre': '#6b7280'
};

export function SecretaryCalendar({ 
  events, 
  onEventClick, 
  onDateClick, 
  onEventDrop,
  onCreateEvent,
  className 
}: SecretaryCalendarProps) {
  const [currentView, setCurrentView] = useState('dayGridMonth');

  // Memoized calendar events transformation
  const calendarEvents = React.useMemo(() => 
    events.map(event => ({
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
    })), [events]
  );

  const handleEventClick = useCallback((clickInfo: any) => {
    const originalEvent = clickInfo.event.extendedProps.originalEvent;
    if (onEventClick && originalEvent) {
      onEventClick(originalEvent);
    }
  }, [onEventClick]);

  const handleDateClick = useCallback((dateClickInfo: any) => {
    if (onDateClick) {
      onDateClick(new Date(dateClickInfo.date));
    }
  }, [onDateClick]);

  const handleEventDrop = useCallback((eventDropInfo: any) => {
    if (onEventDrop) {
      const eventId = parseInt(eventDropInfo.event.id);
      const newDate = new Date(eventDropInfo.event.start);
      onEventDrop(eventId, newDate);
    }
  }, [onEventDrop]);

  const viewButtons = [
    { key: 'dayGridMonth', label: 'Mois', icon: Calendar },
    { key: 'timeGridWeek', label: 'Semaine', icon: Grid },
    { key: 'timeGridDay', label: 'Jour', icon: Clock },
    { key: 'listWeek', label: 'Liste', icon: List }
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Gestion du Calendrier
          </CardTitle>
          
          <div className="flex items-center gap-2 flex-wrap">
            {/* Vue Buttons */}
            <div className="flex gap-1" role="group" aria-label="Vues du calendrier">
              {viewButtons.map(({ key, label, icon: Icon }) => (
                <Button
                  key={key}
                  variant={currentView === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentView(key)}
                  className="flex items-center gap-2"
                  aria-pressed={currentView === key}
                  aria-label={`Vue ${label}`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                </Button>
              ))}
            </div>
            
            {/* Create Event Button */}
            {onCreateEvent && (
              <Button
                onClick={onCreateEvent}
                className="gradient-institutional text-white flex items-center gap-2"
                size="sm"
                aria-label="Créer un nouvel événement"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Nouvel événement</span>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Legend */}
        <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Légende des types d'événements">
          {Object.entries(eventTypeColors).map(([type, color]) => (
            <Badge key={type} variant="outline" className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: color }}
                aria-hidden="true"
              />
              <span className="capitalize">{type.replace('-', ' ')}</span>
            </Badge>
          ))}
        </div>

        {/* FullCalendar */}
        <div className="fullcalendar-container" role="application" aria-label="Calendrier des événements éditable">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: ''
            }}
            initialView={currentView}
            events={calendarEvents}
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            eventClick={handleEventClick}
            dateClick={handleDateClick}
            eventDrop={handleEventDrop}
            height="auto"
            aspectRatio={1.8}
            locale="fr"
            buttonText={{
              today: 'Aujourd\'hui',
              month: 'Mois',
              week: 'Semaine',
              day: 'Jour',
              list: 'Liste'
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
            listDayFormat={{ 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long' 
            }}
            eventDidMount={(info) => {
              // Add accessibility attributes
              info.el.setAttribute('role', 'button');
              info.el.setAttribute('aria-label', `Événement: ${info.event.title}. Cliquez pour modifier.`);
              info.el.setAttribute('tabindex', '0');
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
