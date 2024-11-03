import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRouter } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { register } from '@/redux/slices/auth/authSlice';
import { RootState, useAppDispatch } from '@/redux/store';

const Register = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading } = useSelector((state: RootState) => state.auth); // Accede al estado de auth

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // Validación de esquema usando Yup
  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required('Nombre completo es obligatorio'),
    email: Yup.string().email('Correo inválido').required('Correo electrónico es obligatorio'),
    password: Yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('Contraseña es obligatoria'),
  });

  // Configuración de useFormik
  const formik = useFormik({
    initialValues: { fullName: '', email: '', password: '' },
    validationSchema,
    onSubmit: async (values) => {
      const credentials = { email: values.email, password: values.password };
      
      try {
        // Esperar el resultado de la acción dispatch
        const resultAction = await dispatch(register(credentials))
    
        if (register.fulfilled.match(resultAction)) {
          // Registro exitoso
          console.log("Todo Bien revisa")
          router.replace('/auth/login'); // Navegar a la pantalla de login
        } else {
          // Registro fallido
          console.log(resultAction.payload)
          Alert.alert('Error', resultAction.payload); // Mostrar mensaje de error
        }
      } catch (error: any) {
        // Manejo de errores
        Alert.alert('Error', error.message);
      }
    }    
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Registrarse</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre Completo"
          placeholderTextColor="#888"
          onChangeText={formik.handleChange('fullName')}
          onBlur={formik.handleBlur('fullName')}
          value={formik.values.fullName}
        />
        {formik.touched.fullName && formik.errors.fullName && (
          <Text style={styles.error}>{formik.errors.fullName}</Text>
        )}
        
        <TextInput
          style={styles.input}
          placeholder="Correo Electrónico"
          placeholderTextColor="#888"
          onChangeText={formik.handleChange('email')}
          onBlur={formik.handleBlur('email')}
          value={formik.values.email}
        />
        {formik.touched.email && formik.errors.email && (
          <Text style={styles.error}>{formik.errors.email}</Text>
        )}
        
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          placeholderTextColor="#888"
          onChangeText={formik.handleChange('password')}
          onBlur={formik.handleBlur('password')}
          value={formik.values.password}
        />
        {formik.touched.password && formik.errors.password && (
          <Text style={styles.error}>{formik.errors.password}</Text>
        )}
        
        <TouchableOpacity style={styles.outlineButton} onPress={() => formik.handleSubmit()} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Text style={styles.buttonText}>Crear Cuenta</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/auth/login')}
        >
          <Text style={styles.outlineButtonText}>Ya tengo una cuenta</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 5,
    color: '#333',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: 'black',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  outlineButton: {
    marginBottom: 10,
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
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default Register;

