// prospectsSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { firestoreService } from '@/firebase'; // Asegúrate de que la ruta sea correcta
import { RootState } from '@/redux/store';
import { Lead } from '@/types/Leads';
import { Evento } from '@/types/Eventos';
import { Interaction } from '@/types/Interacciones';
import { Notes } from '@/types/Notes';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';


// Interfaz para los valores de paginación serializables
interface PaginationInfo {
  id?: string;
  fechaCreacion: FirebaseFirestoreTypes.Timestamp;
  nombre: string
}

interface ProspectsState {
  leads: Lead[];
  lead: Lead | null;
  interacciones: Interaction[];
  eventos: Evento[];
  notas: Notes[];
  loading: boolean;
  error: string | null;
  errorLeads: { message: string; lead: Lead }[];
  successFullLeads: number;
  failedLeads: number;
  lastVisible: PaginationInfo | null;
  hasMore: boolean; // Indica si hay más leads para cargar
}

interface FetchLeadsParams {
  search?: string; // Búsqueda opcional
  pageSize: number; // Tamaño de la página (número de registros por página)
  append?: boolean; // Indica si se deben concatenar los leads
  filters?: string[]; // Nuevo parámetro opcional
}

interface FetchLeadsResult {
  leads: Lead[];
  lastVisible: PaginationInfo | null;
}

// Estado inicial
const initialState: ProspectsState = {
  leads: [],
  interacciones: [],
  eventos: [],
  notas: [],
  lead: null,
  loading: false,
  error: null,
  errorLeads: [],
  successFullLeads: 0,
  failedLeads: 0,
  lastVisible: null,
  hasMore: true,
};



export const fetchLeads = createAsyncThunk<FetchLeadsResult, FetchLeadsParams>(
  'prospects/fetchLeads',
  async ({ search, pageSize, append, filters }, { getState, rejectWithValue }) => {
    try {
      const leadsRef = firestoreService.collection('prospects');

      // Inicializar la consulta ordenada
      let q: FirebaseFirestoreTypes.DocumentData = leadsRef.orderBy('nombre').orderBy('fechaCreacion', 'desc');

      // Aplicar filtro de búsqueda si existe
      if (search) {
        const lowerCaseSearch = search.trim().toLowerCase();
        q = q
          .where('nombre', '>=', lowerCaseSearch)
          .where('nombre', '<=', lowerCaseSearch + '\uf8ff');
      }

      // Aplicar filtros adicionales si existen
      if (filters && filters.length > 0) {
        if (filters.length === 1) {
          q = q.where('estado', '==', filters[0]);
        } else {
          q = q.where('estado', 'in', filters.slice(0, 10));
        }
      }

      // Obtener el estado actual para manejar la paginación
      const state = getState() as RootState;
      const lastVisible = state.lead.lastVisible;

      // Paginación usando valores serializables
      if (append && lastVisible) {
        q = q.startAfter(lastVisible.nombre, lastVisible.fechaCreacion);
      }

      // Limitar los resultados al pageSize
      q = q.limit(pageSize);

      const snapshot = await q.get();

      // Obtener los leads
      const leads = snapshot.docs.map((doc: FirebaseFirestoreTypes.DocumentData) => ({
        id: doc.id,
        ...doc.data(),
      })) as Lead[];

      // Obtener el último documento visible para la paginación
      const lastDoc = snapshot.docs[snapshot.docs.length - 1];
      const newLastVisible = lastDoc
        ? {
            nombre: lastDoc.get('nombre') as string,
            fechaCreacion: lastDoc.get('fechaCreacion') as FirebaseFirestoreTypes.Timestamp,
          }
        : null;

      return { leads, lastVisible: newLastVisible };
    } catch (error: any) {
      console.error('Error fetching leads:', error);
      return rejectWithValue('Failed to fetch leads');
    }
  }
);



// Thunk para agregar leads a Firestore
export const addLeadsToFirestore = createAsyncThunk<
  void,
  Lead[],
  { state: RootState; rejectValue: { message: string; lead: Lead }[] }
>(
  'prospects/addLeadsToFirestore',
  async (leads, { getState, rejectWithValue, dispatch }) => {
    const existingLeads = getState().lead.leads;
    const errors: { message: string; lead: Lead }[] = [];

    for (const lead of leads) {
      const leadExists = existingLeads.some((existing) => existing.email === lead.email);
      if (!leadExists) {
        try {
          // Normalizar el nombre antes de agregar
          const leadData = {
            ...lead,
            nombre: lead.nombre.trim().toLowerCase(),
          };
          const docRef = await firestoreService.collection('prospects').add(leadData);
          console.log('Lead agregado con éxito. ID del documento:', docRef.id);
          dispatch(ADD_SUCCESSFUL_LEADS());
        } catch (error: any) {
          console.error('Error al agregar lead a Firestore:', error.message);
          errors.push({ message: error.message, lead });
          dispatch(ADD_FAILED_LEADS());
        }
      } else {
        console.warn(`El lead con el email ${lead.email} ya existe en el sistema.`);
        dispatch(ADD_FAILED_LEADS());
        errors.push({
          message: `El lead con el email ${lead.email} ya existe en el sistema.`,
          lead,
        });
      }
    }

    if (errors.length > 0) {
      return rejectWithValue(errors);
    }
  }
);



// Thunk para eliminar un lead utilizando `leadId` como campo
export const deleteLead = createAsyncThunk<
  string, // Retorna el ID del documento eliminado
  string, // Argumento: `leadId` del lead a eliminar
  { rejectValue: string }
>(
  'prospects/deleteLeadByLeadId',
  async (leadId, { rejectWithValue, dispatch }) => {
    try {
      console.log(`Intentando eliminar lead con leadId: ${leadId}`);
      dispatch(DELETE_PROSPECT(leadId));
      
      // Crear una referencia a la colección 'prospects'
      const prospectsRef = collection(firestoreService, 'prospects');
      
      // Crear una consulta donde 'leadId' es igual al `leadId` proporcionado
      const q = query(prospectsRef, where('id', '==', leadId));
      
      // Ejecutar la consulta
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        console.warn(`No se encontró ningún lead con leadId: ${leadId}`);
        return rejectWithValue('El lead no existe.');
      }
      
      // Suponiendo que `leadId` es único, pero si no lo es, iterar sobre todos los documentos encontrados
      const deletePromises = querySnapshot.docs.map(async (docSnapshot) => {
        console.log(`Eliminando documento con ID: ${docSnapshot.id}`);
        await deleteDoc(docSnapshot.ref);
        return docSnapshot.id;
      });
      
      // Esperar a que todas las eliminaciones se completen
      const deletedDocIds = await Promise.all(deletePromises);
      
      console.log(`Lead(s) con leadId ${leadId} eliminado(s) con éxito. Documentos eliminados:`, deletedDocIds);
      
      // Retornar el primer ID eliminado (puedes ajustar esto según tus necesidades)
      return deletedDocIds[0];
      
    } catch (error: any) {
      console.error(`Error al eliminar el lead con leadId ${leadId}:`, error);
      return rejectWithValue('Error al eliminar el lead.');
    }
  }
);




// Slice de Redux
const prospectsSlice = createSlice({
  name: 'prospects',
  initialState,
  reducers: {
    // Reemplaza los leads existentes
    setLeads: (state, action: PayloadAction<Lead[]>) => {
      state.leads = action.payload;
    },
    // Concatena nuevos leads a los existentes
    appendLeads: (state, action: PayloadAction<Lead[]>) => {
      state.leads.push(...action.payload);
    },
    ADD_PROSPECT: (state, action: PayloadAction<Lead>) => {
      state.leads.push(action.payload);
    },
    DELETE_PROSPECT: (state, action: PayloadAction<string>) => {
      state.leads = state.leads.filter((lead) => lead.id !== action.payload);
    },
    ADD_INTERACTION: (state, action: PayloadAction<Interaction>) => {
      state.interacciones.push(action.payload);
    },
    ADD_EVENT: (state, action: PayloadAction<Evento>) => {
      state.eventos.push(action.payload);
    },
    ADD_NOTAS: (state, action: PayloadAction<Notes>) => {
      state.notas.push(action.payload);
    },
    ADD_SUCCESSFUL_LEADS: (state) => {
      state.successFullLeads += 1;
    },
    ADD_FAILED_LEADS: (state) => {
      state.failedLeads += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeads.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        const { leads, lastVisible } = action.payload;
        if (action.meta.arg.append) {
          state.leads.push(...leads);
        } else {
          state.leads = leads;
        }
        state.lastVisible = lastVisible;
        state.loading = false;
        state.hasMore = leads.length > 0;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const {
  setLeads,
  appendLeads,
  ADD_PROSPECT,
  DELETE_PROSPECT,
  ADD_INTERACTION,
  ADD_EVENT,
  ADD_NOTAS,
  ADD_SUCCESSFUL_LEADS,
  ADD_FAILED_LEADS,
} = prospectsSlice.actions;

export default prospectsSlice.reducer;
