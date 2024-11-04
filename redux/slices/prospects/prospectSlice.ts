import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { firestoreService } from '@/firebase';
import { RootState } from '@/redux/store';
import { Lead } from '@/types/Leads';
import { Evento } from '@/types/Eventos';
import { Interaction } from '@/types/Interacciones';
import { Notes } from '@/types/Notes';
import { collection, query, where, getDocs, deleteDoc, orderBy , addDoc, startAfter, limit } from 'firebase/firestore';

interface PaginationInfo {
  id?: string;
  fechaCreacion: Date;
  nombre: string;
}

interface ProspectsState {
  leads: Lead[];
  lead: Lead | null;
  interacciones: Interaction[];
  eventos: Evento[];
  notes: Notes[];
  loading: boolean;
  error: string | null;
  errorLeads: { message: string; lead: Lead }[];
  successFullLeads: number;
  failedLeads: number;
  lastVisible: PaginationInfo | null;
  hasMore: boolean;
}

interface FetchLeadsParams {
  search?: string;
  pageSize: number;
  append?: boolean;
  filters?: string[];
}

interface FetchLeadsResult {
  leads: Lead[];
  lastVisible: PaginationInfo | null;
}

const initialState: ProspectsState = {
  leads: [],
  interacciones: [],
  eventos: [],
  notes: [],
  lead: null,
  loading: false,
  error: null,
  errorLeads: [],
  successFullLeads: 0,
  failedLeads: 0,
  lastVisible: null,
  hasMore: true,
};


export const getLead = createAsyncThunk<Lead, string | string[], { rejectValue: string }>(
  'prospects/getLeadByLeadId',
  async (leadID, { rejectWithValue }) => {
    try {
      const leadRef = collection(firestoreService, 'prospects');
      const q = query(leadRef, where('id', '==', leadID));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.warn(`No se encontró ningún lead con leadId: ${leadID}`);
        return rejectWithValue('El lead no existe.');
      }

      const lead = querySnapshot.docs[0].data() as Lead;
      return { ...lead, id: querySnapshot.docs[0].id }; // Incluye el ID del documento en el resultado
    } catch (error: any) {
      console.error(`Error al obtener el lead con leadId ${leadID}:`, error);
      return rejectWithValue('Error al obtener el lead.');
    }
  }
);


// Fetch de leads
export const fetchLeads = createAsyncThunk<FetchLeadsResult, FetchLeadsParams>(
  'prospects/fetchLeads',
  async ({ search, pageSize, append, filters }, { getState, rejectWithValue }) => {
    try {
      const leadsRef = collection(firestoreService, 'prospects');
      // Inicializar la consulta ordenada
      let q = query(
        leadsRef,
        orderBy('nombre'),
        orderBy('fechaCreacion', 'desc'),
        limit(pageSize)
      );

      // Aplicar filtro de búsqueda si existe
      if (search) {
        q = query(q, where('nombre', '>=', search));
      }

      // Aplicar filtros adicionales si existen
      if (filters && filters.length > 0) {
        q = query(q, where('estado', 'in', filters.slice(0, 10)));
      }

      // Obtener el estado actual para manejar la paginación
      const state = getState() as RootState;
      const lastVisible = state.lead.lastVisible; // Asegúrate de que la ruta sea correcta

      // Paginación usando `startAfter` con valores correctos
      if (append && lastVisible) {
        q = query(q, startAfter(lastVisible.nombre, lastVisible.fechaCreacion));
      }

      const snapshot = await getDocs(q);
      const leads = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Lead[];

      // Obtener el último documento visible para la paginación
      const lastDoc = snapshot.docs[snapshot.docs.length - 1];
      const newLastVisible = lastDoc
        ? { nombre: lastDoc.get('nombre'), fechaCreacion: lastDoc.get('fechaCreacion') }
        : null;

      return { leads, lastVisible: newLastVisible };
    } catch (error: any) {
      console.error('Error fetching leads:', error);
      return rejectWithValue('Failed to fetch leads');
    }
  }
);

// Agregar leads a Firestore
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
          const leadData = { ...lead, nombre: lead.nombre.trim().toLowerCase() };
          await addDoc(collection(firestoreService, 'prospects'), leadData);
          dispatch(ADD_SUCCESSFUL_LEADS());
        } catch (error: any) {
          console.error('Error al agregar lead a Firestore:', error.message);
          errors.push({ message: error.message, lead });
          dispatch(ADD_FAILED_LEADS());
        }
      } else {
        console.warn(`El lead con el email ${lead.email} ya existe en el sistema.`);
        dispatch(ADD_FAILED_LEADS());
        errors.push({ message: `El lead con el email ${lead.email} ya existe en el sistema.`, lead });
      }
    }

    if (errors.length > 0) {
      return rejectWithValue(errors);
    }
  }
);

// Eliminar lead por ID
export const deleteLead = createAsyncThunk<string, string, { rejectValue: string }>(
  'prospects/deleteLeadByLeadId',
  async (leadId, { rejectWithValue, dispatch }) => {
    try {
      dispatch(DELETE_PROSPECT(leadId));
      const prospectsRef = collection(firestoreService, 'prospects');
      const q = query(prospectsRef, where('id', '==', leadId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.warn(`No se encontró ningún lead con leadId: ${leadId}`);
        return rejectWithValue('El lead no existe.');
      }

      const deletePromises = querySnapshot.docs.map(async (docSnapshot) => {
        await deleteDoc(docSnapshot.ref);
        return docSnapshot.id;
      });

      const deletedDocIds = await Promise.all(deletePromises);
      return deletedDocIds[0];
    } catch (error: any) {
      console.error(`Error al eliminar el lead con leadId ${leadId}:`, error);
      return rejectWithValue('Error al eliminar el lead.');
    }
  }
);

// Agregar una nota a Firebase
export const addNote = createAsyncThunk(
  'notes/addNote',
  async (note: Notes, { rejectWithValue }) => {
    try {
      const noteRef = await addDoc(collection(firestoreService, 'notes'), {
        ...note,
        date: new Date().toISOString(),
      });
      return { ...note, id: noteRef.id };
    } catch (error: any) {
      console.error('Error al agregar la nota:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Obtener las notas según el ID del lead
export const getNotesByLead = createAsyncThunk(
  'notes/getNotesByLead',
  async ({ leadID, userID }: { leadID: string | string[]; userID: string }, { rejectWithValue }) => {
    try {
      const notesSnapshot = await getDocs(
        query(
          collection(firestoreService, 'notes'),
          where('leadID', '==', leadID),
          where('userID', '==', userID)
        )
      );

      const notes = notesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Notes[];

      return notes;
    } catch (error: any) {
      console.error('Error al obtener las notas:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Slice de Redux
const prospectsSlice = createSlice({
  name: 'prospects',
  initialState,
  reducers: {
    setLeads: (state, action: PayloadAction<Lead[]>) => {
      state.leads = action.payload;
    },
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
      state.notes.push(action.payload);
    },
    ADD_SUCCESSFUL_LEADS: (state) => {
      state.successFullLeads += 1;
    },
    ADD_FAILED_LEADS: (state) => {
      state.failedLeads += 1;
    },
    RESET_LEADS_COUNT: (state) => {
      state.successFullLeads = 0;
      state.failedLeads = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeads.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        const { leads, lastVisible } = action.payload;
        state.leads = action.meta.arg.append ? [...state.leads, ...leads] : leads;
        state.lastVisible = lastVisible;
        state.loading = false;
        state.hasMore = leads.length > 0;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(addNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNote.fulfilled, (state, action: PayloadAction<Notes>) => {
        state.loading = false;
        state.notes.push(action.payload);
      })
      .addCase(addNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getNotesByLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNotesByLead.fulfilled, (state, action: PayloadAction<Notes[]>) => {
        state.loading = false;
        state.notes = action.payload;
      })
      .addCase(getNotesByLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLead.fulfilled, (state, action: PayloadAction<Lead>) => {
        state.loading = false;
        state.lead = action.payload;
      })
      .addCase(getLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error al obtener el lead.';
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
  RESET_LEADS_COUNT,
} = prospectsSlice.actions;

export default prospectsSlice.reducer;
