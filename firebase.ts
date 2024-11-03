import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/compat/database';

import { getAnalytics } from "firebase/analytics";

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const isFirebaseInitialized = firebase.apps.length ? firebase.app() : firebase.initializeApp(firebaseConfig);

// Inicializa los servicios
const auth = firebase.auth();
const firestoreService = firebase.firestore();
const storageService = firebase.storage();
const databaseService = firebase.database();

export {
  isFirebaseInitialized,
  auth,
  firestoreService,
  storageService,
  databaseService,
};
