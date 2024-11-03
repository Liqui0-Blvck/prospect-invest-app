import { isFirebaseInitialized } from '@/firebase';
import { loadUserFromStorageThunk } from '@/redux/slices/auth/authSlice';
import { RootState, useAppDispatch } from '@/redux/store';
import { useNavigation, usePathname, useRouter } from 'expo-router';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, Button, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';


const App = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true)
 
  useEffect(() => {
    if (!isFirebaseInitialized) {
      console.log('Firebase no ha sido inicializado correctamente');
      setLoading(false);  // Finaliza la carga si Firebase no está inicializado
    } else {
      dispatch(loadUserFromStorageThunk()).finally(() => setLoading(false));
    }
  }, []);
  
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace('/(tabs)/');
    }
  }, [loading, isAuthenticated]);

  // Configurar el encabezado
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
  

  const handleContinue = () => {
      router.replace('/auth/login'); // Redirigir al login si no está autenticado
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Invest Lead</Text>
      {!user
        ? (
          <TouchableOpacity onPress={handleContinue} style={styles.button}>
            <View>
              <Text>Continuar</Text>
            </View>
          </TouchableOpacity>
        )
        : null
      }
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
