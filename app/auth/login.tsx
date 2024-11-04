import { ColorsNative } from '@/constants/Colors';
import { useSubmitButton } from '@/hooks/useSubmitButton';
import { login, rememberMeAction } from '@/redux/slices/auth/authSlice';
import { RootState, useAppDispatch, useAppSelector } from '@/redux/store';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useNavigation, useRouter } from 'expo-router';
import { useFormik } from 'formik';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



const Login = () => {
  const { user, loading, error, rememberMe } = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const router = useRouter();

  const BottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%', '50%'], []);
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  
  const { isSubmitting, handleSubmit } = useSubmitButton();
  
  


  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // Manejo de formulario con Formik
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: async (values) => {
      const { email, password } = values;
  
      handleSubmit(async () => {
        try {
          // Intentar iniciar sesión
          const result = await dispatch(login({ email, password })) // Aquí se agrega el campo rememberMe si es necesario
            .unwrap();
    
          if (result) {
            setShowBottomSheet(true);  // Mostrar el modal (BottomSheet)
          } else {
            console.log("Login fallido, sin errores aparentes");
          }
        } catch (err) {
          // Mostrar un mensaje de error si la autenticación falla
          console.log('Error durante el login:', err);
        } finally {
          // Resetear el formulario independientemente del resultado
          formik.resetForm();
        }
      })
    },
  });
  
  
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Iniciar Sesión</Text>
        <TextInput
          value={formik.values.email}
          onChangeText={formik.handleChange('email')}
          onBlur={formik.handleBlur('email')}
          style={styles.input}
          placeholder="Correo Electrónico"
          placeholderTextColor="#888"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {formik.touched.email && formik.errors.email ? (
          <Text style={styles.errorText}>{formik.errors.email}</Text>
        ) : null}
        <TextInput
          value={formik.values.password}
          onChangeText={formik.handleChange('password')}
          onBlur={formik.handleBlur('password')}
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          placeholderTextColor="#888"
        />
        {formik.touched.password && formik.errors.password ? (
          <Text style={styles.errorText}>{formik.errors.password}</Text>
        ) : null}
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            formik.handleSubmit()
            Keyboard.dismiss()
          }} // Enviar el formulario
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>{isSubmitting ? 'Cargando...' : 'Iniciar Sesión'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.outlineButton}
          onPress={() => router.push('/auth/signup')} // Navegar a la página de registro
        >
          <Text style={styles.outlineButtonText}>Registrarse</Text>
        </TouchableOpacity>
      </View>

      {/* BottomSheet para recordar sesión */}
      {showBottomSheet && (
        <BottomSheet
          ref={BottomSheetRef}
          onChange={handleSheetChanges}
          index={0}
          snapPoints={snapPoints}
        >
          <BottomSheetView style={styles.contentContainerSheet}>
            <Text style={styles.questionText}>¿Quieres que la aplicación te recuerde?</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => {
                  dispatch(rememberMeAction(true))
                  setShowBottomSheet(false)
                  router.replace('/(tabs)/')
                }}
              >
                <Text style={styles.optionButtonText}>Sí</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => {
                  dispatch(rememberMeAction(false))
                  setShowBottomSheet(false)
                  router.replace('/(tabs)/')
                }
                }
              >
                <Text style={styles.optionButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </BottomSheetView>
        </BottomSheet>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 16,
  },
  innerContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    color: '#333',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#000',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  outlineButton: {
    width: '100%',
    height: 50,
    backgroundColor: 'transparent',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outlineButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  contentContainerSheet: {
    flex: 1,
    padding: 36,
    alignItems: 'center',
  },
  questionText: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  optionButton: {
    padding: 15,
    backgroundColor: 'black',
    borderRadius: 5,
    width: '45%',
  },
  optionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
});

export default Login;
