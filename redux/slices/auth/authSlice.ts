import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { FirebaseError } from 'firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '@/firebase';

// Define el estado inicial
interface AuthState {
  user: SerializableUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  rememberMe: boolean; // Nuevo campo para recordar la sesión
}

interface SerializableUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
}

const getSerializableUser = (user: firebase.User | null): SerializableUser | null => {
  if (!user) return null;
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    phoneNumber: user.phoneNumber,
  };
};

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  rememberMe: false, // Inicializa como false
};

// Define las credenciales
interface Credentials {
  email: string;
  password: string;
}

// Función para guardar el estado en AsyncStorage
const saveUserToStorage = async (user: SerializableUser | null, rememberMe: boolean) => {
  if (rememberMe && user) {
    await AsyncStorage.setItem('user', JSON.stringify(user));
  }
};

// Función para cargar el usuario desde AsyncStorage
const loadUserFromStorage = async () => {
  const user = await AsyncStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Login
export const login = createAsyncThunk<SerializableUser | null, Credentials, { rejectValue: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const userCredential = await auth.signInWithEmailAndPassword(
        credentials.email,
        credentials.password
      );
      const user = getSerializableUser(userCredential.user);
      return user;
    } catch (error: FirebaseError | any) {
      return rejectWithValue(error.message);
    }
  }
);
// Función asíncrona para el registro
export const register = createAsyncThunk<SerializableUser | null, Credentials, { rejectValue: string }>(
  'auth/register',
  async (credentials, { rejectWithValue }) => {
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(
        credentials.email,
        credentials.password
      );
      return getSerializableUser(userCredential.user);
    } catch (error: FirebaseError | any) {
      return rejectWithValue(error.message);
    }
  }
);


// Logout
export const logout = createAsyncThunk<void, void, { state: any }>(
  'auth/logout',
  async (_, thunkAPI) => {
    try {
      await firebase.auth().signOut();
      await AsyncStorage.removeItem('user'); // Eliminar el usuario de AsyncStorage

      // Accede al dispatch desde thunkAPI para modificar el estado de rememberMe
      thunkAPI.dispatch(rememberMeAction(false)); // Pon rememberMe en false
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
);

// Crea el slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetError(state: AuthState) {
      state.error = null;
    },
    loadUserFromStorageAction(state: AuthState, action: PayloadAction<SerializableUser | null>) {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    rememberMeAction(state: AuthState, action: PayloadAction<boolean>) {
      if (state.isAuthenticated){
        state.rememberMe = action.payload;
        saveUserToStorage(state.user, state.rememberMe);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state: AuthState) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state: AuthState, action: PayloadAction<SerializableUser | null>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload; // Si hay usuario, está autenticado
        state.error = null;
      })
      .addCase(login.rejected, (state: AuthState, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload ?? 'Error de autenticación';
        state.isAuthenticated = false;
      })
      .addCase(register.pending, (state: AuthState) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state: AuthState, action: PayloadAction<SerializableUser | null>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
        state.error = null;
      })
      .addCase(register.rejected, (state: AuthState, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload ?? 'Error de registro';
        state.isAuthenticated = false;
      })
      .addCase(logout.fulfilled, (state: AuthState) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

// Action para cargar usuario desde AsyncStorage
export const { resetError, loadUserFromStorageAction, rememberMeAction } = authSlice.actions;

// Thunk para cargar usuario de AsyncStorage al iniciar la app
export const loadUserFromStorageThunk = () => async (dispatch: any) => {
  const user = await loadUserFromStorage();
  dispatch(loadUserFromStorageAction(user));
};

export default authSlice.reducer;