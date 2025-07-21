
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
import { Calendar, List, Clock, Grid, Download } from 'lucide-react';
import { exportCalendarToPdf } from '@/utils/calendarPdfExport';
import { useToast } from '@/hooks/use-toast';

interface GovernorCalendarProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  className?: string;
}

const eventTypeColors: Record<string, string> = {
  'rendez-vous': '#3b82f6', // blue
  'reunion': '#8b5cf6', // purple
  'conference': '#10b981', // green
  'evenement-public': '#f59e0b', // amber
  'autre': '#6b7280' // gray
};

export function GovernorCalendar({ 
  events, 
  onEventClick,
  className 
}: GovernorCalendarProps) {
  const [currentView, setCurrentView] = useState('dayGridMonth');
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

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

  const handleExportPdf = useCallback(async () => {
    if (isExporting) return;
    
    setIsExporting(true);
    try {
      await exportCalendarToPdf(events);
      toast({
        title: "Export réussi",
        description: "Le calendrier a été exporté en PDF avec succès.",
      });
    } catch (error) {
      console.error('PDF Export Error:', error);
      toast({
        title: "Erreur d'export",
        description: "Une erreur s'est produite lors de l'export PDF.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  }, [events, isExporting, toast]);

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
            Calendrier du Gouverneur
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
            
            {/* Export PDF Button */}
            <Button
              onClick={handleExportPdf}
              disabled={isExporting}
              className="gradient-institutional text-white flex items-center gap-2"
              size="sm"
              aria-label="Exporter le calendrier en PDF"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">
                {isExporting ? 'Export...' : 'Exporter PDF'}
              </span>
            </Button>
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
        <div className="fullcalendar-container" role="application" aria-label="Calendrier des événements">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: ''
            }}
            initialView={currentView}
            events={calendarEvents}
            editable={false}
            selectable={false}
            selectMirror={false}
            dayMaxEvents={true}
            weekends={true}
            eventClick={handleEventClick}
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
              info.el.setAttribute('aria-label', `Événement: ${info.event.title}`);
              info.el.setAttribute('tabindex', '0');
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
