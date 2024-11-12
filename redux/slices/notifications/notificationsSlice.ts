import { firestoreService, realtimeDB } from '@/firebase';
import { Notification } from '@/types/Notifications';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { collection, getDocs, query as queryStore, where, orderBy, Timestamp } from 'firebase/firestore';
import { ref, get, query, orderByChild, equalTo } from 'firebase/database';

interface NotificationsState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

const initialState: NotificationsState = {
  notifications: [],
  loading: false,
  error: null,
};

export const fetchNotifications = createAsyncThunk<Notification[], string>(
  'notifications/fetchNotifications',
  async (userId, { rejectWithValue }) => {
    try {
      const notificationsRef = collection(firestoreService, 'notifications');
      const q = queryStore(
        notificationsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);

      const notifications = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Convertir `createdAt` a un string ISO si es un `Timestamp`
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
        } as Notification;
      });

      return notifications;
    } catch (error: any) {
      console.error('Error al obtener notificaciones:', error);
      return rejectWithValue('Error al obtener notificaciones.');
    }
  }
);

// Thunk para obtener notificaciones desde Firestore
export const fetchNotificationsFromRealtimeDB = createAsyncThunk<Notification[], string>(
  'notifications/fetchFromRealtimeDB',
  async (userId, { rejectWithValue }) => {
    try {
      const notificationsRef = query(
        ref(realtimeDB, 'notifications'),
        orderByChild('userId'),
        equalTo(userId)
      );
      const snapshot = await get(notificationsRef);

      if (!snapshot.exists()) {
        return [];
      }

      const notifications: Notification[] = [];
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        notifications.push({
          id: childSnapshot.key!,
          ...data,
          createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : new Date().toISOString(),
        });
      });

      return notifications;
    } catch (error: any) {
      console.error('Error al obtener notificaciones desde Realtime Database:', error);
      return rejectWithValue('Error al obtener notificaciones.');
    }
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Obtener notificaciones
      .addCase(fetchNotificationsFromRealtimeDB.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotificationsFromRealtimeDB.fulfilled, (state, action: PayloadAction<Notification[]>) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotificationsFromRealtimeDB.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Obtener notificaciones desde Firestore
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action: PayloadAction<Notification[]>) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

  },
});

export const { setNotifications } = notificationsSlice.actions;

export default notificationsSlice.reducer;
