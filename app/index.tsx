import { isFirebaseInitialized } from '@/firebase';
import { loadUserFromStorageThunk } from '@/redux/slices/auth/authSlice';
import { RootState, useAppDispatch } from '@/redux/store';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, Button, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const App = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!isFirebaseInitialized) {
      console.log('Firebase no ha sido inicializado correctamente');
      setLoading(false);
    } else {
      dispatch(loadUserFromStorageThunk())
        .finally(() => setLoading(false));
    }
  }, []);

  // Escuchar el estado de autenticación en Firebase
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Usuario autenticado encontrado
        dispatch(loadUserFromStorageThunk());
      } else {
        // No hay usuario autenticado
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

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

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
    width: '100%',
    height: 'auto',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
});

export default App;
