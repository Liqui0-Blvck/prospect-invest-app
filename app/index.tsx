import { isFirebaseInitialized } from '@/firebase';
import { loadUserFromStorageThunk } from '@/redux/slices/auth/authSlice';
import { RootState, useAppDispatch } from '@/redux/store';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { registerForPushNotificationsAsync, saveTokenToFirestore } from '@/config/notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const App = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  // Registrar el token de notificación y configuraciones
  useEffect(() => {
    const registerForNotifications = async () => {
      const token = await registerForPushNotificationsAsync();
      console.log('Expo Push Token:', token);

      if (token && user) {
        await saveTokenToFirestore(user.uid, token);
      }

      // Escuchar notificaciones cuando la app está abierta
      const notificationListener = Notifications.addNotificationReceivedListener(notification => {
        console.log('Notificación recibida (app abierta):', notification);
      });

      // Escuchar cuando el usuario interactúa con la notificación
      const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
        Alert.alert(
          response?.notification?.request?.content?.title || '',
          response?.notification?.request?.content?.body || ''
        );
      });

      return () => {
        Notifications.removeNotificationSubscription(notificationListener);
        Notifications.removeNotificationSubscription(responseListener);
      };
    };

    registerForNotifications();
  }, [user]);

  // Cargar usuario desde el almacenamiento
  useEffect(() => {
    if (!isFirebaseInitialized) {
      console.log('Firebase no ha sido inicializado correctamente');
      setLoading(false);
    } else {
      dispatch(loadUserFromStorageThunk()).finally(() => setLoading(false));
    }
  }, []);

  // Escuchar el estado de autenticación
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        dispatch(loadUserFromStorageThunk());
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace('/(tabs)/');
    }
  }, [loading, isAuthenticated]);

  const handleContinue = () => {
    router.replace('/auth/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Invest Lead</Text>
      {!user && (
        <TouchableOpacity onPress={handleContinue} style={styles.button}>
          <View>
            <Text>Continuar</Text>
          </View>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 64,
    marginBottom: 20,
  },
  button: {
    borderWidth: 1,
    borderColor: 'black',
    paddingHorizontal: 100,
    paddingVertical: 14,
    display: 'flex',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
});

export default App;
