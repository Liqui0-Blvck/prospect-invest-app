import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from 'expo-router';
import { useAppDispatch } from '@/redux/store';
import { addLeadsToFirestore } from '@/redux/slices/prospects/prospectSlice';
import { ColorsNative } from '@/constants/Colors';
import { useSubmitButton } from '@/hooks/useSubmitButton'; // Asegúrate de importar el hook

const AddLead = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { isSubmitting, handleSubmit } = useSubmitButton();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Agregar Lead',
      headerStyle: {
        backgroundColor: ColorsNative.background[200],
        color: 'white',
      },
      headerTintColor: 'white',
    });
  }, [navigation]);

  // Validación del formulario con Yup
  const validationSchema = Yup.object().shape({
    nombre: Yup.string().required('El nombre es requerido'),
    email: Yup.string().email('Correo inválido').required('El correo es requerido'),
    numeroTelefono: Yup.string().required('El número de teléfono es requerido'),
  });

  // Configuración de Formik
  const formik = useFormik({
    initialValues: {
      nombre: '',
      email: '',
      numeroTelefono: '',
    },
    validationSchema,
    onSubmit: (values) => {
      const { nombre, email, numeroTelefono } = values;
      if (nombre && email && numeroTelefono) {
        handleSubmit(async () => {
          try {
            await dispatch(addLeadsToFirestore([
              {
                nombre,
                email,
                numeroTelefono,
                fechaCreacion: new Date().toISOString(),
              },
            ])).unwrap();
            formik.resetForm();
            navigation.goBack();
          } catch (error) {
            Alert.alert('Error', 'Hubo un error al agregar el lead. Por favor, intenta de nuevo.');
          }
        });
      }
    },
  });

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={formik.values.nombre}
        onChangeText={formik.handleChange('nombre')}
        onBlur={formik.handleBlur('nombre')}
      />
      {formik.touched.nombre && formik.errors.nombre ? (
        <Text style={styles.errorText}>{formik.errors.nombre}</Text>
      ) : null}

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={formik.values.email}
        onChangeText={formik.handleChange('email')}
        onBlur={formik.handleBlur('email')}
        keyboardType="email-address"
      />
      {formik.touched.email && formik.errors.email ? (
        <Text style={styles.errorText}>{formik.errors.email}</Text>
      ) : null}

      <TextInput
        style={styles.input}
        placeholder="Número de teléfono"
        value={formik.values.numeroTelefono}
        onChangeText={formik.handleChange('numeroTelefono')}
        onBlur={formik.handleBlur('numeroTelefono')}
        keyboardType="phone-pad"
      />
      {formik.touched.numeroTelefono && formik.errors.numeroTelefono ? (
        <Text style={styles.errorText}>{formik.errors.numeroTelefono}</Text>
      ) : null}

      <TouchableOpacity
        style={[styles.button, isSubmitting && styles.disabledButton]}
        onPress={() => formik.handleSubmit()}
        disabled={isSubmitting}
      >
        <Text style={styles.buttonText}>{isSubmitting ? 'Agregando...' : 'Agregar Lead'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#001f3f', // Azul navy
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});

export default AddLead;
