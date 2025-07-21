import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarEvent, EventType } from '@/types/user';
import { format } from 'date-fns';
import { Save, X } from 'lucide-react';

const eventFormSchema = z.object({
  title: z.string().min(1, 'Le titre est obligatoire'),
  description: z.string().optional(),
  eventType: z.enum(['rendez-vous', 'reunion', 'conference', 'evenement-public', 'autre']),
  startDateTime: z.string().min(1, 'La date de début est obligatoire'),
  endDateTime: z.string().min(1, 'La date de fin est obligatoire'),
  location: z.string().optional(),
  status: z.enum(['scheduled', 'confirmed', 'cancelled', 'completed']).default('scheduled')
}).refine((data) => {
  return new Date(data.endDateTime) > new Date(data.startDateTime);
}, {
  message: "La date de fin doit être après la date de début",
  path: ["endDateTime"]
});

type EventFormData = z.infer<typeof eventFormSchema>;

interface EventFormProps {
  event?: CalendarEvent;
  onSubmit: (data: EventFormData) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const eventTypeOptions = [
  { value: 'rendez-vous', label: 'Rendez-vous' },
  { value: 'reunion', label: 'Réunion' },
  { value: 'conference', label: 'Conférence' },
  { value: 'evenement-public', label: 'Événement Public' },
  { value: 'autre', label: 'Autre' }
];

const statusOptions = [
  { value: 'scheduled', label: 'Programmé' },
  { value: 'confirmed', label: 'Confirmé' },
  { value: 'cancelled', label: 'Annulé' },
  { value: 'completed', label: 'Terminé' }
];

export function EventForm({ event, onSubmit, onCancel, isEditing = false }: EventFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: event ? {
      title: event.title,
      description: event.description || '',
      eventType: event.eventType,
      startDateTime: event.startDateTime.slice(0, 16), // Format for datetime-local input
      endDateTime: event.endDateTime.slice(0, 16),
      location: event.location || '',
      status: event.status
    } : {
      startDateTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      endDateTime: format(new Date(Date.now() + 60 * 60 * 1000), "yyyy-MM-dd'T'HH:mm"), // +1 hour
      status: 'scheduled'
    }
  });

  const eventType = watch('eventType');
  const status = watch('status');

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isEditing ? 'Modifier l\'événement' : 'Nouvel événement'}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Entrez le titre de l'événement"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Event Type */}
          <div className="space-y-2">
            <Label>Type d'événement *</Label>
            <Select value={eventType} onValueChange={(value) => setValue('eventType', value as EventType)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un type" />
              </SelectTrigger>
              <SelectContent>
                {eventTypeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.eventType && (
              <p className="text-sm text-destructive">{errors.eventType.message}</p>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDateTime">Date et heure de début *</Label>
              <Input
                id="startDateTime"
                type="datetime-local"
                {...register('startDateTime')}
              />
              {errors.startDateTime && (
                <p className="text-sm text-destructive">{errors.startDateTime.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDateTime">Date et heure de fin *</Label>
              <Input
                id="endDateTime"
                type="datetime-local"
                {...register('endDateTime')}
              />
              {errors.endDateTime && (
                <p className="text-sm text-destructive">{errors.endDateTime.message}</p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Lieu</Label>
            <Input
              id="location"
              {...register('location')}
              placeholder="Entrez le lieu de l'événement"
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Statut</Label>
            <Select value={status} onValueChange={(value) => setValue('status', value as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Entrez une description (optionnel)"
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}