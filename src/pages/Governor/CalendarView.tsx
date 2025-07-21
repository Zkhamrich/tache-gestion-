
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { GovernorCalendar } from '@/components/calendar/GovernorCalendar';
import { EventCard } from '@/components/calendar/EventCard';
import { EventTypeFilter } from '@/components/calendar/EventTypeFilter';
import { useCalendar } from '@/contexts/CalendarContext';
import { CalendarEvent, EventType } from '@/types/user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function CalendarView() {
  const { events, filterEventsByType } = useCalendar();
  const [selectedType, setSelectedType] = useState<EventType | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);

  // Filter events by type
  const filteredEvents = filterEventsByType(selectedType);

  // Get event counts by type for filter badges
  const eventCounts = events.reduce((acc, event) => {
    acc[event.eventType] = (acc[event.eventType] || 0) + 1;
    return acc;
  }, {} as Record<EventType, number>);

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventDialog(true);
  };

  const upcomingEvents = filteredEvents
    .filter(event => new Date(event.startDateTime) > new Date())
    .slice(0, 5);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total événements</p>
                  <p className="text-2xl font-bold text-primary">{events.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ce mois</p>
                  <p className="text-2xl font-bold text-info">
                    {events.filter(event => {
                      const eventDate = new Date(event.startDateTime);
                      const now = new Date();
                      return eventDate.getMonth() === now.getMonth() && 
                             eventDate.getFullYear() === now.getFullYear();
                    }).length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Confirmés</p>
                  <p className="text-2xl font-bold text-success">
                    {events.filter(event => event.status === 'confirmed').length}
                  </p>
                </div>
                <Badge className="bg-success/20 text-success">✓</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">En attente</p>
                  <p className="text-2xl font-bold text-warning">
                    {events.filter(event => event.status === 'scheduled').length}
                  </p>
                </div>
                <Badge className="bg-warning/20 text-warning">⏳</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <EventTypeFilter
          selectedType={selectedType}
          onTypeSelect={setSelectedType}
          eventCounts={eventCounts}
        />

        {/* Main Calendar with PDF Export */}
        <GovernorCalendar
          events={filteredEvents}
          onEventClick={handleEventClick}
        />

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Événements à venir
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {upcomingEvents.map(event => (
                  <div
                    key={event.id}
                    className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {format(new Date(event.startDateTime), 'dd MMMM yyyy, HH:mm', { locale: fr })}
                        </p>
                        {event.location && (
                          <p className="text-sm text-muted-foreground">{event.location}</p>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {event.eventType.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Event Detail Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de l'événement</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <EventCard 
              event={selectedEvent} 
              showActions={false}
              className="border-0 shadow-none"
            />
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
