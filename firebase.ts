import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';

import AsyncStorage from '@react-native-async-storage/async-storage';

console.log(process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET)

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Inicializar Firebase solo si no ha sido inicializado previamente
const app = initializeApp(firebaseConfig);

// Inicializar Auth con persistencia en AsyncStorage
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  auth = getAuth(app); // Si ya está inicializado, usa la instancia existente
}

// Inicializar otros servicios
const firestoreService = getFirestore(app);
const storageService = getStorage(app);
const realtimeDB  = getDatabase(app);

// Verificar si Firebase fue correctamente inicializado
const isFirebaseInitialized = app ? true : false;

export {
  isFirebaseInitialized,
  auth,
  firestoreService,
  storageService,
  realtimeDB ,
};
