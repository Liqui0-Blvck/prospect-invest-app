import { Evento } from "@/types/Eventos";


export const events: Evento[] = [
  {
    id: '1',
    titulo: 'Reunión con Juan Perez',
    descripcion: 'Discusión de posibles inversiones',
    fechaInicio: new Date('2024-10-12T09:00:00'),
    fechaFin: new Date('2024-10-12T10:00:00'),
    lugar: 'Oficina Central',
    asistenteIds: ['1'], // ID de Juan Perez
    estado: 'programado',
  },
  {
    id: '2',
    titulo: 'Reunión con Maria Lopez',
    descripcion: 'Presentación de oportunidades en el sector de energía',
    fechaInicio: new Date('2024-10-12T11:00:00'),
    fechaFin: new Date('2024-10-12T12:00:00'),
    lugar: 'Zoom',
    asistenteIds: ['2'], // ID de Maria Lopez
    estado: 'programado',
  },
  {
    id: '3',
    titulo: 'Revisión de portafolio con Carlos Rodriguez',
    descripcion: 'Actualización de status de inversiones',
    fechaInicio: new Date('2024-10-12T14:00:00'),
    fechaFin: new Date('2024-10-12T15:00:00'),
    lugar: 'Google Meet',
    asistenteIds: ['3'], // ID de Carlos Rodriguez
    estado: 'completado',
  },
  {
    id: '4',
    titulo: 'Reunión con Ana Torres',
    descripcion: 'Exploración de opciones de inversión en tecnología',
    fechaInicio: new Date('2024-10-13T09:30:00'),
    fechaFin: new Date('2024-10-13T10:30:00'),
    lugar: 'Oficina Central',
    asistenteIds: ['4'], // ID de Ana Torres
    estado: 'programado',
  },
  {
    id: '5',
    titulo: 'Reunión con Jorge Martinez',
    descripcion: 'Negociación de términos de inversión',
    fechaInicio: new Date('2024-10-13T11:00:00'),
    fechaFin: new Date('2024-10-13T12:00:00'),
    lugar: 'Oficina Central',
    asistenteIds: ['5'], // ID de Jorge Martinez
    estado: 'programado',
  },
  {
    id: '6',
    titulo: 'Llamada con Claudia Ramirez',
    descripcion: 'Análisis de riesgo de portafolio',
    fechaInicio: new Date('2024-10-14T10:00:00'),
    fechaFin: new Date('2024-10-14T10:30:00'),
    lugar: 'Skype',
    asistenteIds: ['6'], // ID de Claudia Ramirez
    estado: 'completado',
  },
  {
    id: '7',
    titulo: 'Reunión con Luis Fernandez',
    descripcion: 'Presentación de nuevos productos financieros',
    fechaInicio: new Date('2024-10-14T11:00:00'),
    fechaFin: new Date('2024-10-14T12:00:00'),
    lugar: 'Zoom',
    asistenteIds: ['7'], // ID de Luis Fernandez
    estado: 'programado',
  },
  {
    id: '8',
    titulo: 'Reunión con Laura Garcia',
    descripcion: 'Seguimiento de portafolio',
    fechaInicio: new Date('2024-10-15T09:00:00'),
    fechaFin: new Date('2024-10-15T09:30:00'),
    lugar: 'Google Meet',
    asistenteIds: ['8'], // ID de Laura Garcia
    estado: 'completado',
  },
  {
    id: '9',
    titulo: 'Llamada con Roberto Herrera',
    descripcion: 'Discusión de opciones de retiro',
    fechaInicio: new Date('2024-10-15T10:00:00'),
    fechaFin: new Date('2024-10-15T10:30:00'),
    lugar: 'Oficina Central',
    asistenteIds: ['9'], // ID de Roberto Herrera
    estado: 'cancelado',
  },
  {
    id: '10',
    titulo: 'Revisión de inversiones con David Gomez',
    descripcion: 'Evaluación de rendimiento de portafolio',
    fechaInicio: new Date('2024-10-16T09:00:00'),
    fechaFin: new Date('2024-10-16T10:00:00'),
    lugar: 'Oficina Central',
    asistenteIds: ['10'], // ID de David Gomez
    estado: 'completado',
  },
  {
    id: '11',
    titulo: 'Reunión con Sofia Diaz',
    descripcion: 'Exploración de nuevas oportunidades en real estate',
    fechaInicio: new Date('2024-10-16T11:00:00'),
    fechaFin: new Date('2024-10-16T12:00:00'),
    lugar: 'Oficina Central',
    asistenteIds: ['11'], // ID de Sofia Diaz
    estado: 'programado',
  },
  {
    id: '12',
    titulo: 'Revisión de portafolio con Andres Ortiz',
    descripcion: 'Estrategia de diversificación de activos',
    fechaInicio: new Date('2024-10-17T10:00:00'),
    fechaFin: new Date('2024-10-17T11:00:00'),
    lugar: 'Skype',
    asistenteIds: ['12'], // ID de Andres Ortiz
    estado: 'completado',
  },
  {
    id: '13',
    titulo: 'Reunión con Teresa Morales',
    descripcion: 'Discusión de nuevas tendencias de inversión',
    fechaInicio: new Date('2024-10-17T11:30:00'),
    fechaFin: new Date('2024-10-17T12:30:00'),
    lugar: 'Google Meet',
    asistenteIds: ['13'], // ID de Teresa Morales
    estado: 'programado',
  },
  {
    id: '14',
    titulo: 'Revisión de inversiones con Marcos Vega',
    descripcion: 'Evaluación del portafolio a largo plazo',
    fechaInicio: new Date('2024-10-18T09:00:00'),
    fechaFin: new Date('2024-10-18T10:00:00'),
    lugar: 'Zoom',
    asistenteIds: ['14'], // ID de Marcos Vega
    estado: 'completado',
  },
  {
    id: '15',
    titulo: 'Reunión con Paula Romero',
    descripcion: 'Negociación de inversión en fondos de capital',
    fechaInicio: new Date('2024-10-18T11:00:00'),
    fechaFin: new Date('2024-10-18T12:00:00'),
    lugar: 'Oficina Central',
    asistenteIds: ['15'], // ID de Paula Romero
    estado: 'programado',
  },
  {
    id: '16',
    titulo: 'Llamada con Enrique Vargas',
    descripcion: 'Seguimiento de inversión en criptomonedas',
    fechaInicio: new Date('2024-10-19T09:30:00'),
    fechaFin: new Date('2024-10-19T10:00:00'),
    lugar: 'Zoom',
    asistenteIds: ['16'], // ID de Enrique Vargas
    estado: 'programado',
  },
  {
    id: '17',
    titulo: 'Revisión con Felipe Aguirre',
    descripcion: 'Evaluación de portafolio en sectores emergentes',
    fechaInicio: new Date('2024-10-19T11:00:00'),
    fechaFin: new Date('2024-10-19T12:00:00'),
    lugar: 'Google Meet',
    asistenteIds: ['17'], // ID de Felipe Aguirre
    estado: 'programado',
  },
  {
    id: '18',
    titulo: 'Reunión con Carmen Silva',
    descripcion: 'Análisis de nuevos productos financieros',
    fechaInicio: new Date('2024-10-20T10:00:00'),
    fechaFin: new Date('2024-10-20T11:00:00'),
    lugar: 'Oficina Central',
    asistenteIds: ['18'], // ID de Carmen Silva
    estado: 'completado',
  },
  {
    id: '19',
    titulo: 'Llamada con Hector Paredes',
    descripcion: 'Discusión de oportunidades en fondos mutuos',
    fechaInicio: new Date('2024-10-20T12:00:00'),
    fechaFin: new Date('2024-10-20T12:30:00'),
    lugar: 'Skype',
    asistenteIds: ['19'], // ID de Hector Paredes
    estado: 'programado',
  },
  {
    id: '20',
    titulo: 'Reunión con Lucia Pineda',
    descripcion: 'Evaluación de impacto fiscal en inversiones',
    fechaInicio: new Date('2024-10-21T09:00:00'),
    fechaFin: new Date('2024-10-21T10:00:00'),
    lugar: 'Google Meet',
    asistenteIds: ['20'], // ID de Lucia Pineda
    estado: 'completado',
  }
];

