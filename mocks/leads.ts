import { Lead } from "@/types/Leads";

export const stats = [
  {
    title: 'Llamados',
    value: 100
  },
  {
    title: 'Interesados',
    value: 80
  },
  {
    title: 'Reuniones',
    value: 6
  },
]

export const interacciones = [
  {
    title: 'Llamada',
    date: '2021-09-01',
    description: 'Llamada de seguimiento',
    leadId: '1' // Juan Pérez
  },
  {
    title: 'Llamada',
    date: '2021-09-01',
    description: 'Llamada de seguimiento',
    leadId: '2' // María Gómez
  },
  {
    title: 'Llamada',
    date: '2021-09-01',
    description: 'Llamada de seguimiento',
    leadId: '3' // Carlos López
  },
  {
    title: 'Llamada',
    date: '2021-09-01',
    description: 'Llamada de seguimiento',
    leadId: '4' // Ana Martínez
  },
  {
    title: 'Llamada',
    date: '2021-09-01',
    description: 'Llamada de seguimiento',
    leadId: '5' // José Hernández
  },
  {
    title: 'Llamada',
    date: '2021-09-01',
    description: 'Llamada de seguimiento',
    leadId: '6' // Laura Torres
  },
  {
    title: 'Llamada',
    date: '2021-09-01',
    description: 'Llamada de seguimiento',
    leadId: '7' // Pedro Ramírez
  },
  {
    title: 'Llamada',
    date: '2021-09-01',
    description: 'Llamada de seguimiento',
    leadId: '8' // Sofía Castro
  },
  {
    title: 'Llamada',
    date: '2021-09-01',
    description: 'Llamada de seguimiento',
    leadId: '9' // Miguel Díaz
  }
];


export const leads_array: Lead[] = [
  {
    id: '1',
    nombre: 'Juan Pérez',
    numeroTelefono: '+569 12345678',
    email: 'juan.perez@example.com',
    estado: 'interesado',
    fechaCreacion: '2024-01-01',
    fechaUltimaInteraccion: '2024-01-10',
    notas: 'Interesado en productos financieros',
    fuente: 'Publicidad en redes sociales'
  },
  {
    id: '2',
    nombre: 'María Gómez',
    numeroTelefono: '+5691234567891',
    email: 'maria.gomez@example.com',
    estado: 'desinteresado',
    fechaCreacion: '2024-01-03',
    fechaUltimaInteraccion: '2024-01-05',
    notas: 'Prefiere otros productos',
    fuente: 'Referencia de amigo'
  },
  {
    id: '3',
    nombre: 'Carlos López',
    numeroTelefono: '+5691234567892',
    email: 'carlos.lopez@example.com',
    estado: 'frío',
    fechaCreacion: '2024-01-05',
    fuente: 'Evento local'
  },
  {
    id: '4',
    nombre: 'Ana Martínez',
    numeroTelefono: '+5691234567893',
    email: 'ana.martinez@example.com',
    estado: 'caliente',
    fechaCreacion: '2024-01-07',
    fechaUltimaInteraccion: '2024-01-09',
    notas: 'Interesada en inversiones de bajo riesgo',
    fuente: 'Publicidad en internet'
  },
  {
    id: '5',
    nombre: 'José Hernández',
    numeroTelefono: '+5691234567894',
    email: 'jose.hernandez@example.com',
    estado: 'interesado',
    fechaCreacion: '2024-01-09',
    notas: 'Busca opciones de crédito',
    fuente: 'Llamada telefónica'
  },
  {
    id: '6',
    nombre: 'Laura Torres',
    numeroTelefono: '+5691234567895',
    email: 'laura.torres@example.com',
    estado: 'frío',
    fechaCreacion: '2024-01-10',
    notas: 'Le falta información adicional',
    fuente: 'Feria de empleo'
  },
  {
    id: '7',
    nombre: 'Pedro Ramírez',
    numeroTelefono: '+5691234567896',
    email: 'pedro.ramirez@example.com',
    estado: 'caliente',
    fechaCreacion: '2024-01-12',
    fechaUltimaInteraccion: '2024-01-13',
    fuente: 'Anuncio en Google'
  },
  {
    id: '8',
    nombre: 'Sofía Castro',
    numeroTelefono: '+5691234567897',
    email: 'sofia.castro@example.com',
    estado: 'desinteresado',
    fechaCreacion: '2024-01-14',
    fechaUltimaInteraccion: '2024-01-15',
    notas: 'Prefiere productos tradicionales',
    fuente: 'Publicidad en televisión'
  },
  {
    id: '9',
    nombre: 'Miguel Díaz',
    numeroTelefono: '+5691234567898',
    email: 'miguel.diaz@example.com',
    estado: 'interesado',
    fechaCreacion: '2024-01-15',
    fuente: 'Llamada de referencia'
  },
  {
    id: '10',
    nombre: 'Elena Rojas',
    numeroTelefono: '+5691234567899',
    email: 'elena.rojas@example.com',
    estado: 'frío',
    fechaCreacion: '2024-01-17',
    fuente: 'Anuncio en YouTube'
  },
  {
    id: '11',
    nombre: 'Fernando García',
    numeroTelefono: '+5691234567800',
    email: 'fernando.garcia@example.com',
    estado: 'caliente',
    fechaCreacion: '2024-01-18',
    fechaUltimaInteraccion: '2024-01-20',
    notas: 'Dispuesto a invertir de inmediato',
    fuente: 'Referencia de cliente'
  },
  {
    id: '12',
    nombre: 'Valeria Vargas',
    numeroTelefono: '+5691234567801',
    email: 'valeria.vargas@example.com',
    estado: 'interesado',
    fechaCreacion: '2024-01-19',
    fuente: 'Evento en línea'
  },
  {
    id: '13',
    nombre: 'Roberto Ruiz',
    numeroTelefono: '+5691234567802',
    email: 'roberto.ruiz@example.com',
    estado: 'desinteresado',
    fechaCreacion: '2024-01-20',
    notas: 'Ya tiene otro proveedor de servicios financieros',
    fuente: 'Publicidad impresa'
  },
  {
    id: '14',
    nombre: 'Patricia Flores',
    numeroTelefono: '+5691234567803',
    email: 'patricia.flores@example.com',
    estado: 'caliente',
    fechaCreacion: '2024-01-22',
    fechaUltimaInteraccion: '2024-01-23',
    fuente: 'Anuncio en redes sociales'
  },
  {
    id: '15',
    nombre: 'Diego Méndez',
    numeroTelefono: '+5691234567804',
    email: 'diego.mendez@example.com',
    estado: 'frío',
    fechaCreacion: '2024-01-24',
    fuente: 'Llamada en frío'
  },
  {
    id: '16',
    nombre: 'Carmen Ortiz',
    numeroTelefono: '+5691234567805',
    email: 'carmen.ortiz@example.com',
    estado: 'interesado',
    fechaCreacion: '2024-01-25',
    fuente: 'Referido por cliente'
  },
  {
    id: '17',
    nombre: 'Javier Sánchez',
    numeroTelefono: '+5691234567806',
    email: 'javier.sanchez@example.com',
    estado: 'desinteresado',
    fechaCreacion: '2024-01-26',
    notas: 'No está buscando nuevos productos financieros',
    fuente: 'Redes sociales'
  },
  {
    id: '18',
    nombre: 'Lucía Morales',
    numeroTelefono: '+5691234567807',
    email: 'lucia.morales@example.com',
    estado: 'caliente',
    fechaCreacion: '2024-01-28',
    fechaUltimaInteraccion: '2024-01-30',
    fuente: 'Anuncio en prensa'
  },
  {
    id: '19',
    nombre: 'Raúl Romero',
    numeroTelefono: '+5691234567808',
    email: 'raul.romero@example.com',
    estado: 'frío',
    fechaCreacion: '2024-01-29',
    fuente: 'Evento corporativo'
  },
  {
    id: '20',
    nombre: 'Gabriela Herrera',
    numeroTelefono: '+5691234567809',
    email: 'gabriela.herrera@example.com',
    estado: 'interesado',
    fechaCreacion: '2024-01-30',
    fuente: 'Publicidad en LinkedIn'
  }
];

