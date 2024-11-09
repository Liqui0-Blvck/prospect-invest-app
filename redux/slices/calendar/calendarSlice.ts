// store/calendarSlice.ts
import { firestoreService } from '@/firebase';
import { Evento } from '@/types/Eventos';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';

interface CalendarState {
  eventos: Evento[];
  loading: boolean;
  error: string | null;
}

const initialState: CalendarState = {
  eventos: [],
  loading: false,
  error: null,
};

// Thunks para manejar operaciones asíncronas con Firestore

// Obtener eventos de Firestore
export const fetchEventos = createAsyncThunk('calendar/fetchEventos', async (_, { rejectWithValue }) => {
  try {
    const querySnapshot = await getDocs(collection(firestoreService, 'events'));
    const eventos = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Evento[];

    // Verifica si obtuviste datos
    if (eventos.length === 0) {
      console.warn('No se encontraron eventos.');
    }

    return eventos;
  } catch (error: any) {
    console.error('Error al obtener eventos:', error);
    return rejectWithValue('Error al obtener eventos');
  }
});

// Agregar evento a Firestore
export const agregarEvento = createAsyncThunk('calendar/agregarEvento', async (evento: Evento) => {
  const docRef = await addDoc(collection(firestoreService, 'events'), evento);
  return { ...evento, id: docRef.id };
});

// // Actualizar evento en Firestore
// export const actualizarEvento = createAsyncThunk(
//   'calendar/actualizarEvento',
//   async (evento: Evento) => {
//     if (!evento.id) throw new Error('El evento debe tener un ID para actualizarse');
//     const docRef = doc(firestoreService, 'eventos', evento.id);
//     await updateDoc(docRef, evento);
//     return evento;
//   }
// );

// Eliminar evento de Firestore
export const eliminarEvento = createAsyncThunk('calendar/eliminarEvento', async (id: string) => {
  const docRef = doc(firestoreService, 'events', id);
  await deleteDoc(docRef);
  return id;
});

// Slice de Redux
const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Obtener eventos
      .addCase(fetchEventos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEventos.fulfilled, (state, action: PayloadAction<Evento[]>) => {
        state.loading = false;
        state.eventos = action.payload;
      })
      .addCase(fetchEventos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al obtener eventos';
      })
      // Agregar evento
      .addCase(agregarEvento.fulfilled, (state, action: PayloadAction<Evento>) => {
        state.eventos.push(action.payload);
      })
      // Actualizar evento
      // .addCase(actualizarEvento.fulfilled, (state, action: PayloadAction<Evento>) => {
      //   const index = state.eventos.findIndex((evento) => evento.id === action.payload.id);
      //   if (index !== -1) {
      //     state.eventos[index] = action.payload;
      //   }
      // })
      // Eliminar evento
      .addCase(eliminarEvento.fulfilled, (state, action: PayloadAction<string>) => {
        state.eventos = state.eventos.filter((evento) => evento.id !== action.payload);
      });
  },
});

export default calendarSlice.reducer;
