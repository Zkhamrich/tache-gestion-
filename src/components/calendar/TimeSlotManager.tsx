import React, { useState, useMemo } from 'react';
import { CalendarEvent } from '@/types/user';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, AlertTriangle, Plus } from 'lucide-react';
import { format, parse, isWithinInterval, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface TimeSlotManagerProps {
  selectedDate: Date;
  events: CalendarEvent[];
  onTimeSlotSelect: (startTime: string, endTime: string) => void;
  onEventClick: (event: CalendarEvent) => void;
  className?: string;
}

interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
  conflictsWith?: CalendarEvent[];
}

interface ConflictInfo {
  event1: CalendarEvent;
  event2: CalendarEvent;
  overlapMinutes: number;
}

// Créneaux horaires prédéfinis (8h-18h par tranches de 30min)
const generateTimeSlots = (): { time: string; label: string }[] => {
  const slots = [];
  for (let hour = 8; hour < 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push({ time, label: time });
    }
  }
  return slots;
};

const TIME_SLOTS = generateTimeSlots();

export function TimeSlotManager({
  selectedDate,
  events,
  onTimeSlotSelect,
  onEventClick,
  className
}: TimeSlotManagerProps) {
  const [selectedStartTime, setSelectedStartTime] = useState<string>('');
  const [selectedEndTime, setSelectedEndTime] = useState<string>('');

  // Filtrer les événements du jour sélectionné
  const dayEvents = useMemo(() => {
    return events.filter(event => 
      isSameDay(new Date(event.startDateTime), selectedDate)
    ).sort((a, b) => 
      new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()
    );
  }, [events, selectedDate]);

  // Détecter les conflits d'horaires
  const conflicts = useMemo((): ConflictInfo[] => {
    const conflictList: ConflictInfo[] = [];
    
    for (let i = 0; i < dayEvents.length; i++) {
      for (let j = i + 1; j < dayEvents.length; j++) {
        const event1 = dayEvents[i];
        const event2 = dayEvents[j];
        
        const start1 = new Date(event1.startDateTime);
        const end1 = new Date(event1.endDateTime);
        const start2 = new Date(event2.startDateTime);
        const end2 = new Date(event2.endDateTime);
        
        // Vérifier si les événements se chevauchent
        const isOverlapping = start1 < end2 && start2 < end1;
        
        if (isOverlapping) {
          const overlapStart = new Date(Math.max(start1.getTime(), start2.getTime()));
          const overlapEnd = new Date(Math.min(end1.getTime(), end2.getTime()));
          const overlapMinutes = Math.round((overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60));
          
          conflictList.push({
            event1,
            event2,
            overlapMinutes
          });
        }
      }
    }
    
    return conflictList;
  }, [dayEvents]);

  // Vérifier si un créneau est disponible
  const isTimeSlotAvailable = (startTime: string, endTime: string): boolean => {
    const proposedStart = parse(startTime, 'HH:mm', selectedDate);
    const proposedEnd = parse(endTime, 'HH:mm', selectedDate);
    
    return !dayEvents.some(event => {
      const eventStart = new Date(event.startDateTime);
      const eventEnd = new Date(event.endDateTime);
      
      return (
        (proposedStart >= eventStart && proposedStart < eventEnd) ||
        (proposedEnd > eventStart && proposedEnd <= eventEnd) ||
        (proposedStart <= eventStart && proposedEnd >= eventEnd)
      );
    });
  };

  // Créer un nouveau rendez-vous
  const handleCreateAppointment = () => {
    if (selectedStartTime && selectedEndTime) {
      onTimeSlotSelect(selectedStartTime, selectedEndTime);
      setSelectedStartTime('');
      setSelectedEndTime('');
    }
  };

  // Suggestions de créneaux libres
  const getAvailableSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    
    for (let i = 0; i < TIME_SLOTS.length - 1; i++) {
      const start = TIME_SLOTS[i].time;
      const end = TIME_SLOTS[i + 1].time;
      
      slots.push({
        start,
        end,
        available: isTimeSlotAvailable(start, end),
        conflictsWith: dayEvents.filter(event => {
          const eventStart = new Date(event.startDateTime);
          const eventEnd = new Date(event.endDateTime);
          const slotStart = parse(start, 'HH:mm', selectedDate);
          const slotEnd = parse(end, 'HH:mm', selectedDate);
          
          return !(eventEnd <= slotStart || eventStart >= slotEnd);
        })
      });
    }
    
    return slots;
  };

  const availableSlots = getAvailableSlots();

  return (
    <div className={cn("space-y-6", className)}>
      {/* En-tête avec la date */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {format(selectedDate, 'EEEE dd MMMM yyyy', { locale: fr })}
        </h3>
        <Badge variant="outline" className="flex items-center gap-2">
          <Clock className="h-3 w-3" />
          {dayEvents.length} événement{dayEvents.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Alertes de conflit */}
      {conflicts.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">⚠️ Conflits détectés :</p>
              {conflicts.map((conflict, index) => (
                <div key={index} className="text-sm">
                  <span className="font-medium">{conflict.event1.title}</span> et{' '}
                  <span className="font-medium">{conflict.event2.title}</span>{' '}
                  se chevauchent ({conflict.overlapMinutes} min)
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Événements du jour */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Planning du jour
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dayEvents.length > 0 ? (
            <div className="space-y-3">
              {dayEvents.map((event, index) => (
                <div
                  key={event.id}
                  onClick={() => onEventClick(event)}
                  className={cn(
                    "p-3 border rounded-lg cursor-pointer transition-all duration-200",
                    "hover:bg-muted/50 hover:shadow-sm",
                    conflicts.some(c => c.event1.id === event.id || c.event2.id === event.id) 
                      ? "border-destructive/50 bg-destructive/5" 
                      : "border-border"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-primary">
                          {format(new Date(event.startDateTime), 'HH:mm')} - 
                          {format(new Date(event.endDateTime), 'HH:mm')}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {event.eventType.replace('-', ' ')}
                        </Badge>
                      </div>
                      <h4 className="font-medium text-sm truncate">{event.title}</h4>
                      {event.location && (
                        <p className="text-xs text-muted-foreground mt-1">{event.location}</p>
                      )}
                    </div>
                    <Badge 
                      variant={event.status === 'confirmed' ? 'default' : 'outline'}
                      className="text-xs shrink-0"
                    >
                      {event.status === 'confirmed' ? 'Confirmé' : 'Programmé'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-6">
              Aucun événement prévu
            </p>
          )}
        </CardContent>
      </Card>

      {/* Créateur de nouveau créneau */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouveau rendez-vous
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Heure de début</label>
              <select
                value={selectedStartTime}
                onChange={(e) => setSelectedStartTime(e.target.value)}
                className="w-full p-2 border rounded-lg text-sm"
              >
                <option value="">Sélectionner...</option>
                {TIME_SLOTS.map(slot => (
                  <option key={slot.time} value={slot.time}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Heure de fin</label>
              <select
                value={selectedEndTime}
                onChange={(e) => setSelectedEndTime(e.target.value)}
                className="w-full p-2 border rounded-lg text-sm"
              >
                <option value="">Sélectionner...</option>
                {TIME_SLOTS.map(slot => (
                  <option 
                    key={slot.time} 
                    value={slot.time}
                    disabled={selectedStartTime ? slot.time <= selectedStartTime : false}
                  >
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedStartTime && selectedEndTime && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm">
                  Créneau : {selectedStartTime} - {selectedEndTime}
                </span>
                <Badge 
                  variant={isTimeSlotAvailable(selectedStartTime, selectedEndTime) ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {isTimeSlotAvailable(selectedStartTime, selectedEndTime) ? 'Disponible' : 'Conflit'}
                </Badge>
              </div>
            </div>
          )}

          <Button 
            onClick={handleCreateAppointment}
            disabled={!selectedStartTime || !selectedEndTime || !isTimeSlotAvailable(selectedStartTime, selectedEndTime)}
            className="w-full"
          >
            Créer le rendez-vous
          </Button>
        </CardContent>
      </Card>

      {/* Créneaux suggérés */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Créneaux disponibles (suggestions)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {availableSlots.slice(0, 12).map((slot, index) => (
              <Button
                key={index}
                variant={slot.available ? "outline" : "ghost"}
                size="sm"
                disabled={!slot.available}
                onClick={() => {
                  setSelectedStartTime(slot.start);
                  setSelectedEndTime(slot.end);
                }}
                className={cn(
                  "justify-start text-xs",
                  slot.available 
                    ? "hover:bg-primary/10 hover:border-primary" 
                    : "opacity-50 cursor-not-allowed"
                )}
              >
                {slot.start} - {slot.end}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}