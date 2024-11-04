import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { FirebaseError } from 'firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '@/firebase'; // Asegúrate de que el auth aquí esté configurado con initializeAuth
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

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

const getSerializableUser = (user: any): SerializableUser | null => {
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
  rememberMe: false,
};

// Define las credenciales
interface Credentials {
  email: string;
  password: string;
}

// Función para guardar el estado en AsyncStorage
const saveUserToStorage = async (user: SerializableUser | null) => {
  if (user) {
    await AsyncStorage.setItem('user', JSON.stringify(user));
  }
};

// Función para cargar el usuario desde AsyncStorage
const loadUserFromStorage = async (): Promise<SerializableUser | null> => {
  const user = await AsyncStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Función para eliminar el usuario de AsyncStorage en el logout
const removeUserFromStorage = async () => {
  await AsyncStorage.removeItem('user');
};

// Login
export const login = createAsyncThunk<SerializableUser | null, Credentials, { rejectValue: string }>(
  'auth/login',
  async (credentials, { rejectWithValue, dispatch }) => {
    try {
      const auth = getAuth(); // Obtener la instancia de auth
      const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      const user = getSerializableUser(userCredential.user);

      // Guardar usuario en AsyncStorage si rememberMe está activado
      if (user) {
        await saveUserToStorage(user);
        dispatch(rememberMeAction(true)); // Actualizar el estado de rememberMe
      }

      return user;
    } catch (error: FirebaseError | any) {
      const errorMessage = error?.message || 'Error desconocido al iniciar sesión';
      return rejectWithValue(errorMessage);
    }
  }
);

// Registro
export const register = createAsyncThunk<SerializableUser | null, Credentials, { rejectValue: string }>(
  'auth/register',
  async (credentials, { rejectWithValue }) => {
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
      return getSerializableUser(userCredential.user);
    } catch (error: FirebaseError | any) {
      const errorMessage = error?.message || 'Error de registro';
      return rejectWithValue(errorMessage);
    }
  }
);

// Logout
export const logout = createAsyncThunk<void, void, { state: any }>(
  'auth/logout',
  async (_, thunkAPI) => {
    try {
      const auth = getAuth();
      await signOut(auth);
      await removeUserFromStorage(); // Eliminar el usuario de AsyncStorage
      thunkAPI.dispatch(rememberMeAction(false)); // Actualizar el estado de rememberMe
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
      state.rememberMe = action.payload;
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
        state.isAuthenticated = !!action.payload;
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
