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
  const { loading } = useSelector((state: RootState) => state.auth);

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
    telefono: Yup.string()
      .required('Número de teléfono es obligatorio')
      .matches(/^\+569\d{8}$/, 'Debe ser un número de teléfono chileno válido (ej: +56912345678)'),
  });

  // Configuración de useFormik
  const formik = useFormik({
    initialValues: { fullName: '', email: '', password: '', telefono: '' },
    validationSchema,
    onSubmit: async (values) => {
      const credentials = {
        email: values.email,
        password: values.password,
        nombre: values.fullName,
        phoneNumber: values.telefono,
      };
      
      try {
        // Ejecutar la acción dispatch para registrar al usuario
        const resultAction = await dispatch(register(credentials));

        if (register.fulfilled.match(resultAction)) {
          console.log("Usuario registrado correctamente");
          router.replace('/auth/login');
        } else {
          console.log(resultAction.payload);
          Alert.alert('Error', resultAction.payload || 'Error al registrar');
        }
      } catch (error: any) {
        Alert.alert('Error', error.message);
      }
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Registrarse</Text>

        {/* Campo de Nombre Completo */}
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

        {/* Campo de Correo Electrónico */}
        <TextInput
          style={styles.input}
          placeholder="Correo Electrónico"
          placeholderTextColor="#888"
          onChangeText={formik.handleChange('email')}
          onBlur={formik.handleBlur('email')}
          value={formik.values.email}
          keyboardType="email-address"
        />
        {formik.touched.email && formik.errors.email && (
          <Text style={styles.error}>{formik.errors.email}</Text>
        )}

        {/* Campo de Contraseña */}
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

        {/* Campo de Número de Teléfono */}
        <TextInput
          style={styles.input}
          placeholder="Número de Teléfono (ej: +56912345678)"
          placeholderTextColor="#888"
          onChangeText={formik.handleChange('telefono')}
          onBlur={formik.handleBlur('telefono')}
          value={formik.values.telefono}
          keyboardType="phone-pad"
        />
        {formik.touched.telefono && formik.errors.telefono && (
          <Text style={styles.error}>{formik.errors.telefono}</Text>
        )}

        {/* Botón de Registro */}
        <TouchableOpacity style={styles.outlineButton} onPress={() => formik.handleSubmit()} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Text style={styles.buttonText}>Crear Cuenta</Text>
          )}
        </TouchableOpacity>

        {/* Botón para redirigir al Login */}
        <TouchableOpacity style={styles.button} onPress={() => router.push('/auth/login')}>
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
    marginBottom: 10,
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
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Register;
