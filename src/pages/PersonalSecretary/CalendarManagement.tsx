
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { SecretaryCalendar } from '@/components/calendar/SecretaryCalendar';
import { EventCard } from '@/components/calendar/EventCard';
import { EventForm } from '@/components/calendar/EventForm';
import { EventTypeFilter } from '@/components/calendar/EventTypeFilter';
import { useCalendar } from '@/contexts/CalendarContext';
import { useUser } from '@/contexts/UserContext';
import { CalendarEvent, EventType } from '@/types/user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar, Plus, Edit, Trash2, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

export default function CalendarManagement() {
  const { events, addEvent, updateEvent, deleteEvent, addEventNote, filterEventsByType, createEventFromTimeSlot } = useCalendar();
  const { user } = useUser();
  const { toast } = useToast();
  
  const [selectedType, setSelectedType] = useState<EventType | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  
  const [noteContent, setNoteContent] = useState('');

  // Filter events by type
  const filteredEvents = filterEventsByType(selectedType);

  // Get event counts by type for filter badges
  const eventCounts = events.reduce((acc, event) => {
    acc[event.eventType] = (acc[event.eventType] || 0) + 1;
    return acc;
  }, {} as Record<EventType, number>);

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setShowEventForm(true);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setShowEventForm(true);
    setShowEventDialog(false);
  };

  const handleDeleteEvent = (id: number) => {
    deleteEvent(id);
    setShowEventDialog(false);
    toast({
      title: "Événement supprimé",
      description: "L'événement a été supprimé avec succès.",
    });
  };

  const handleEventSubmit = (data: any) => {
    if (!user) return;

    if (editingEvent) {
      updateEvent(editingEvent.id, {
        ...data,
        startDateTime: data.startDateTime,
        endDateTime: data.endDateTime,
      });
      toast({
        title: "Événement modifié",
        description: "L'événement a été modifié avec succès.",
      });
    } else {
      addEvent({
        ...data,
        governorId: 1, // Mock governor ID
        createdBy: user.id,
        startDateTime: data.startDateTime,
        endDateTime: data.endDateTime,
      });
      toast({
        title: "Événement créé",
        description: "L'événement a été créé avec succès.",
      });
    }
    
    setShowEventForm(false);
    setEditingEvent(null);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventDialog(true);
  };

  const handleCreateEventFromTimeSlot = (startTime: string, endTime: string, date: Date) => {
    createEventFromTimeSlot(startTime, endTime, date);
    toast({
      title: "Rendez-vous créé",
      description: "Un nouveau rendez-vous a été créé avec succès.",
    });
  };

  const handleResolveConflict = (event1: CalendarEvent, event2: CalendarEvent) => {
    setEditingEvent(event1);
    setShowEventForm(true);
    toast({
      title: "Résolution de conflit",
      description: "Modifiez l'un des événements pour résoudre le conflit.",
    });
  };

  const handleAddNote = (eventId: number) => {
    setSelectedEvent(events.find(e => e.id === eventId) || null);
    setNoteContent('');
    setShowNoteDialog(true);
    setShowEventDialog(false);
  };

  const handleSubmitNote = () => {
    if (selectedEvent && noteContent.trim()) {
      addEventNote(selectedEvent.id, noteContent.trim());
      setShowNoteDialog(false);
      setNoteContent('');
      toast({
        title: "Note ajoutée",
        description: "La note a été ajoutée à l'événement.",
      });
    }
  };

  const handleEventDrop = (eventId: number, newDate: Date) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      const duration = new Date(event.endDateTime).getTime() - new Date(event.startDateTime).getTime();
      const newEndDate = new Date(newDate.getTime() + duration);
      
      updateEvent(eventId, {
        startDateTime: newDate.toISOString(),
        endDateTime: newEndDate.toISOString(),
      });
      
      toast({
        title: "Événement déplacé",
        description: "L'événement a été déplacé avec succès.",
      });
    }
  };

  const todayEvents = events.filter(event => {
    const eventDate = new Date(event.startDateTime).toDateString();
    const today = new Date().toDateString();
    return eventDate === today;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Gestion du Calendrier" 
          description="Gérez le planning du Gouverneur"
        />

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
                  <p className="text-sm text-muted-foreground">Aujourd'hui</p>
                  <p className="text-2xl font-bold text-info">{todayEvents.length}</p>
                </div>
                <Badge className="bg-info/20 text-info">📅</Badge>
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

        {/* Secretary Calendar with Full Editing Capabilities */}
        <SecretaryCalendar
          events={filteredEvents}
          onEventClick={handleEventClick}
          onEventDrop={handleEventDrop}
          onCreateEvent={handleCreateEvent}
          onCreateEventFromTimeSlot={handleCreateEventFromTimeSlot}
          onResolveConflict={handleResolveConflict}
        />

        {/* Today's Events */}
        {todayEvents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📅 Événements d'aujourd'hui
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {todayEvents.map(event => (
                  <div
                    key={event.id}
                    className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {format(new Date(event.startDateTime), 'HH:mm')} - 
                          {format(new Date(event.endDateTime), 'HH:mm')}
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

      {/* Event Form Dialog */}
      <Dialog open={showEventForm} onOpenChange={setShowEventForm}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? 'Modifier l\'événement' : 'Nouvel événement'}
            </DialogTitle>
          </DialogHeader>
          <EventForm
            event={editingEvent || undefined}
            onSubmit={handleEventSubmit}
            onCancel={() => setShowEventForm(false)}
            isEditing={!!editingEvent}
          />
        </DialogContent>
      </Dialog>

      {/* Event Detail Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de l'événement</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <EventCard 
              event={selectedEvent} 
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
              onAddNote={handleAddNote}
              className="border-0 shadow-none"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Add Note Dialog */}
      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedEvent && (
              <div className="p-3 bg-muted/50 rounded">
                <h4 className="font-medium">{selectedEvent.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(selectedEvent.startDateTime), 'dd MMMM yyyy, HH:mm', { locale: fr })}
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="note">Note</Label>
              <Textarea
                id="note"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Entrez votre note..."
                rows={4}
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleSubmitNote} disabled={!noteContent.trim()}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Ajouter la note
              </Button>
              <Button variant="outline" onClick={() => setShowNoteDialog(false)}>
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
