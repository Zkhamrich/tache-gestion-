import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarEvent } from '@/types/user';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Clock, MapPin, User, Edit, Trash2, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: CalendarEvent;
  onEdit?: (event: CalendarEvent) => void;
  onDelete?: (id: number) => void;
  onAddNote?: (eventId: number) => void;
  showActions?: boolean;
  className?: string;
}

const eventTypeLabels: Record<string, string> = {
  'rendez-vous': 'Rendez-vous',
  'reunion': 'Réunion',
  'conference': 'Conférence',
  'evenement-public': 'Événement Public',
  'autre': 'Autre'
};

const eventTypeColors: Record<string, string> = {
  'rendez-vous': 'bg-info/20 text-info border-info/30',
  'reunion': 'bg-primary/20 text-primary border-primary/30',
  'conference': 'bg-accent/20 text-accent-foreground border-accent/30',
  'evenement-public': 'bg-success/20 text-success border-success/30',
  'autre': 'bg-muted text-muted-foreground border-border'
};

const statusLabels: Record<string, string> = {
  'scheduled': 'Programmé',
  'confirmed': 'Confirmé',
  'cancelled': 'Annulé',
  'completed': 'Terminé'
};

const statusColors: Record<string, string> = {
  'scheduled': 'bg-warning/20 text-warning border-warning/30',
  'confirmed': 'bg-success/20 text-success border-success/30',
  'cancelled': 'bg-destructive/20 text-destructive border-destructive/30',
  'completed': 'bg-muted text-muted-foreground border-border'
};

export function EventCard({ 
  event, 
  onEdit, 
  onDelete, 
  onAddNote, 
  showActions = true,
  className 
}: EventCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg">{event.title}</CardTitle>
          <div className="flex gap-2">
            <Badge 
              variant="outline" 
              className={cn("text-xs", eventTypeColors[event.eventType])}
            >
              {eventTypeLabels[event.eventType]}
            </Badge>
            <Badge 
              variant="outline" 
              className={cn("text-xs", statusColors[event.status])}
            >
              {statusLabels[event.status]}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Date and Time */}
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>
            {format(new Date(event.startDateTime), 'dd MMMM yyyy, HH:mm', { locale: fr })} - 
            {format(new Date(event.endDateTime), 'HH:mm')}
          </span>
        </div>

        {/* Location */}
        {event.location && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{event.location}</span>
          </div>
        )}

        {/* Description */}
        {event.description && (
          <p className="text-sm text-muted-foreground">{event.description}</p>
        )}

        {/* Notes */}
        {event.notes && event.notes.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Notes</span>
            </div>
            <div className="space-y-2 pl-6">
              {event.notes.map(note => (
                <div key={note.id} className="p-2 bg-muted/50 rounded text-sm">
                  <p>{note.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(note.createdAt), 'dd/MM/yyyy HH:mm')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex items-center gap-2 pt-2 border-t">
            {onEdit && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onEdit(event)}
                className="flex items-center gap-2"
              >
                <Edit className="h-3 w-3" />
                Modifier
              </Button>
            )}
            {onAddNote && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onAddNote(event.id)}
                className="flex items-center gap-2"
              >
                <MessageSquare className="h-3 w-3" />
                Ajouter une note
              </Button>
            )}
            {onDelete && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onDelete(event.id)}
                className="flex items-center gap-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
                Supprimer
              </Button>
            )}
          </div>
        )}

        {/* Created info */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
          <User className="h-3 w-3" />
          <span>Créé le {format(new Date(event.createdAt), 'dd/MM/yyyy HH:mm')}</span>
        </div>
      </CardContent>
    </Card>
  );
}