import BackgroundStyle from '@/components/BackgroundStyle';
import { ColorsNative } from '@/constants/Colors';
import { events } from '@/mocks/calendar';
import { RootState } from '@/redux/store';
import { Evento } from '@/types/Eventos';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Agenda, LocaleConfig } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

// Función para transformar eventos en el formato que necesita Agenda
const transformarEventosAAgenda = (eventos: Evento[]) => {
  const agendaItems: { [key: string]: Evento[] } = {};
  eventos.forEach(evento => {
    const fecha = evento.fecha; // Formato 'YYYY-MM-DD'
    if (!agendaItems[fecha]) {
      agendaItems[fecha] = [];
    }
    agendaItems[fecha].push(evento);
  });
  return agendaItems;
};

// Configuración de Locale en español
LocaleConfig.locales['es'] = {
  monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  monthNamesShort: ['Ene.', 'Feb.', 'Mar.', 'Abr.', 'May.', 'Jun.', 'Jul.', 'Ago.', 'Sep.', 'Oct.', 'Nov.', 'Dic.'],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['Dom.', 'Lun.', 'Mar.', 'Mié.', 'Jue.', 'Vie.', 'Sáb.'],
  today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';

const Calendar = () => {
  const [fechaActual, setFechaActual] = useState({ dia: '', mes: '', ano: '' });
  const { leads, eventos } = useSelector((state: RootState) => state.lead);


  // Obtener la fecha actual
  useEffect(() => {
    const fecha = new Date();
    const dia = fecha.getDate();
    const año = fecha.getFullYear();

    // Formato del mes en texto, usando el valor "long" para obtener el nombre completo del mes
    const opcionesMes = { month: 'long' as const };
    const mes = new Intl.DateTimeFormat('es-ES', opcionesMes).format(fecha);

    // Guardar la fecha actual en el estado
    setFechaActual({
      dia: dia.toString(),
      mes: mes.charAt(0).toUpperCase() + mes.slice(1), // Capitalizar el mes
      ano: año.toString(),
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundStyle 
        styleOptions={{
          backgroundDesign: {
            height: '52%',
            paddingVertical: 10,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          }
        }}
      />
      {/* Encabezado con la fecha actual */}
      <View style={styles.header}>
        <Text style={styles.dia}>{fechaActual.dia}</Text>
        <Text style={styles.fecha}>{fechaActual.mes} {fechaActual.ano}</Text>
      </View>

      {/* Componente Agenda con la configuración en español */}
      <View style={styles.calendarContainer}>
        <Agenda
          items={transformarEventosAAgenda(eventos)} // Convertimos los eventos a formato adecuado
          renderItem={(item: Evento) => {
            const lead = leads.find((lead) => lead.id === item.asistente);
            // console.log("lead encontrado", lead)

            return (
              <View style={styles.eventContainer}>
                <Text style={styles.title}>{item.titulo}</Text>
                <Text style={styles.description}>{item.descripcion}</Text>
                <Text style={styles.location}>Lugar: {item.lugar}</Text>
                <Text style={styles.status}>Prospecto: {lead?.nombre}</Text>
              </View>
            );
          }}
          theme={{
            agendaDayTextColor: ColorsNative.accent[100], // Color del texto del día
            agendaDayNumColor: ColorsNative.accent[100],  // Color del número del día
            agendaTodayColor: '#1e90ff',   // Color del texto de "Hoy"
            agendaKnobColor: ColorsNative.accent[100],    // Color del botón deslizante
            textSectionTitleColor: '#4a90e2', // Color del texto de las secciones
            selectedDayBackgroundColor: ColorsNative.accent[100], // Fondo del día seleccionado
            selectedDayTextColor: '#ffffff', // Texto del día seleccionado
            todayTextColor: '#1e90ff',      // Color del texto del día actual
            dayTextColor: '#2d4150',        // Color del texto de los días no seleccionados
            dotColor: ColorsNative.accent[100],            // Color de los puntos de eventos
            selectedDotColor: '#ffffff',     // Color de los puntos seleccionados
            monthTextColor: '#4a90e2',      // Color del texto del mes
            indicatorColor: '#4a90e2',      // Color del indicador de carga
          }}
        />
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 5,
  },
  dia: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white'
  },
  fecha: {
    fontSize: 25,
    color: 'white'
  },
  calendarContainer: {
    position: 'relative',
    height: '90%',
    top: 10,
    marginHorizontal: 10, 
    borderRadius: 10,
  },
  eventContainer: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
  },
  location: {
    fontSize: 12,
    color: '#888',
  },
  status: {
    fontSize: 12,
    color: '#888',
  },
});

export default Calendar;