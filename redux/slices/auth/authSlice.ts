import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { FirebaseError } from 'firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, firestoreService } from '@/firebase'; // Asegúrate de que el auth aquí esté configurado con initializeAuth
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut,updateProfile  } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// Define el estado inicial
interface AuthState {
  user: SerializableUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  rememberMe: boolean; // Nuevo campo para recordar la sesión
}

export interface SerializableUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
  name?: string;
  role?: string;
  createdAt?: string;
  notificationToken?: string;
  address?: string;
}

const getSerializableUser = (user: any): SerializableUser => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  photoURL: user.photoURL,
  phoneNumber: user.phoneNumber,
  name: user.name,
  role: user.role,
  createdAt: user.createdAt,
  notificationToken: user.notificationToken,
  address: user.address,
});

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
  nombre: string;
  phoneNumber?: string;
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

export const fetchUserData = createAsyncThunk<
  SerializableUser | null,
  string,
  { rejectValue: string }
>(
  'auth/fetchUserData',
  async (userId, { rejectWithValue, dispatch }) => {
    try {
      // Referencia al documento del usuario en Firestore
      const userDocRef = doc(firestoreService, 'users', userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data() as SerializableUser;

        // Actualizar el estado de Redux con los datos del usuario
        dispatch(setUser(userData));

        return userData;
      } else {
        console.warn('Documento del usuario no encontrado en Firestore.');
        return null;
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Error al obtener datos del usuario';
      console.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Login
export const login = createAsyncThunk<
  SerializableUser | null,
  Credentials,
  { rejectValue: string }
>(
  'auth/login',
  async (credentials, { rejectWithValue, dispatch }) => {
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      const user = getSerializableUser(userCredential.user);

      if (!user) {
        throw new Error('No se pudo obtener la información del usuario.');
      }

      // Obtener datos adicionales del usuario desde Firestore
      const userDocRef = doc(firestoreService, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const additionalData = userDoc.data();
        const completeUser = {
          ...user,
          ...additionalData,
        } as SerializableUser;

        // Guardar el usuario en AsyncStorage si 'rememberMe' está activado
        await saveUserToStorage(completeUser);
        dispatch(rememberMeAction(true)); // Actualizar el estado de rememberMe

        return completeUser;
      } else {
        console.warn('Documento de usuario no encontrado en Firestore.');
        return user;
      }
    } catch (error: any) {
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
      const user = userCredential.user;

      // Actualizar perfil con el nombre
      if (credentials.nombre) {
        await updateProfile(user, { displayName: credentials.nombre });
      }

      // Guardar en Firestore
      const userDoc = {
        uid: user.uid,
        email: user.email,
        nombre: credentials.nombre,
        phoneNumber: credentials.phoneNumber || null,
        role: 'user',
        createdAt: new Date().toISOString(),
        notificationToken: null, // Puedes actualizar esto más adelante
      };

      await setDoc(doc(firestoreService, 'users', user.uid), userDoc);

      return getSerializableUser(user);
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
    setUser(state, action: PayloadAction<SerializableUser | null>) {
      state.user = action.payload;
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
export const { 
  resetError, 
  loadUserFromStorageAction, 
  rememberMeAction,
  setUser
} = authSlice.actions;

// Thunk para cargar usuario de AsyncStorage al iniciar la app
export const loadUserFromStorageThunk = () => async (dispatch: any) => {
  const user = await loadUserFromStorage();
  dispatch(loadUserFromStorageAction(user));
};

export default authSlice.reducer;
