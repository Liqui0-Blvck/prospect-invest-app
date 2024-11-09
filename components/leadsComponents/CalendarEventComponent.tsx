import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';

interface CalendarEventComponentProps {
  accessToken: string;
}

const CalendarEventComponent: React.FC<CalendarEventComponentProps> = ({ accessToken }) => {
  const [eventCreated, setEventCreated] = useState(false);

  const createCalendarEvent = async () => {
    try {
      const event = {
        summary: 'Reunión de ejemplo con Google Meet',
        description: 'Esta es una reunión creada automáticamente con un enlace de Google Meet.',
        start: {
          dateTime: '2024-12-01T09:00:00-07:00', // Fecha de inicio
          timeZone: 'America/Los_Angeles', // Ajusta la zona horaria
        },
        end: {
          dateTime: '2024-12-01T10:00:00-07:00', // Fecha de finalización
          timeZone: 'America/Los_Angeles',
        },
        attendees: [{ email: 'attendee1@example.com' }], // Agrega los asistentes aquí
        conferenceData: {
          createRequest: {
            requestId: 'sample123',
            conferenceSolutionKey: { type: 'hangoutsMeet' },
          },
        },
      };

      const response = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Evento creado:', data);
        setEventCreated(true);
      } else {
        console.error('Error al crear el evento:', response);
      }
    } catch (error) {
      console.error('Error al crear el evento:', error);
    }
  };

  return (
    <View>
      <Button title="Crear evento en Google Calendar" onPress={createCalendarEvent} />
      {eventCreated && <Text>Evento creado exitosamente con Google Meet!</Text>}
    </View>
  );
};

export default CalendarEventComponent;
