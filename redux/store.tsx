import { configureStore, ThunkDispatch } from '@reduxjs/toolkit';
import authReducer from '@/redux/slices/auth/authSlice';
import prospectReducer from '@/redux/slices/prospects/prospectSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer, persistStore } from 'redux-persist';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

// Configuración de persistencia para redux-persist
const persistConfig = {
  key: 'root', // Clave de la raíz para el almacenamiento
  storage: AsyncStorage, // El almacenamiento utilizado será AsyncStorage
  whitelist: ['auth', 'lead'], // Solo persistimos auth y lead (prospects)
};

// Configurar los reducers combinados con persistencia
const rootReducer = {
  auth: persistReducer(persistConfig, authReducer),
  lead: prospectReducer,
};

// Configuración del store con redux-persist
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Inferir los tipos `RootState` y `AppDispatch` desde el store
export type RootState = ReturnType<typeof store.getState>;

// Hook para usar el dispatch en toda la aplicación con ThunkDispatch
export const useAppDispatch = () => useDispatch<ThunkDispatch<RootState, any, any>>();

// Uso de selector con el tipo RootState
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Configurar el persistor
export const persistor = persistStore(store);
