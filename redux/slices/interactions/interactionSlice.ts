import { RootState } from '@/redux/store';
import { Interaction } from '@/types/Interacciones';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { firestoreService } from '@/firebase'; // Asegúrate de que la ruta de importación sea correcta
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';

interface InteractionsState {
  interactions: Interaction[];
  loading: boolean;
  error: string | null;
}

const initialState: InteractionsState = {
  interactions: [],
  loading: false,
  error: null,
};

// Thunk para agregar una interacción a Firebase
export const addInteraction = createAsyncThunk(
  'interactions/addInteraction',
  async (interaction: Interaction, { rejectWithValue }) => {
    try {
      const interactionRef = await addDoc(collection(firestoreService, 'interactions'), interaction);
      return { ...interaction, uid: interactionRef.id }; // Retornamos la interacción con el ID asignado
    } catch (error: any) {
      console.error('Error al agregar la interacción:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Thunk para obtener las interacciones según el ID del usuario y del lead
export const getInteractionsLead = createAsyncThunk(
  'interactions/getInteractionsLead',
  async ({ userID, leadID }: { userID: string; leadID: string | string[] }, { rejectWithValue }) => {
    try {
      const interactionsQuery = query(
        collection(firestoreService, 'interactions'),
        where('userID', '==', userID),
        where('leadID', '==', leadID)
      );
      
      const interactionsSnapshot = await getDocs(interactionsQuery);
      const interactions = interactionsSnapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      })) as Interaction[];

      return interactions;
    } catch (error: any) {
      console.error('Error al obtener las interacciones:', error);
      return rejectWithValue(error.message);
    }
  }
);

const interactionSlice = createSlice({
  name: 'interactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addInteraction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addInteraction.fulfilled, (state, action: PayloadAction<Interaction>) => {
        state.loading = false;
        state.interactions.push(action.payload);
      })
      .addCase(addInteraction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getInteractionsLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInteractionsLead.fulfilled, (state, action: PayloadAction<Interaction[]>) => {
        state.loading = false;
        state.interactions = action.payload;
      })
      .addCase(getInteractionsLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default interactionSlice.reducer;
