import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from 'expo-router';
import { useAppDispatch } from '@/redux/store';
import { ADD_PROSPECT, addLeadsToFirestore } from '@/redux/slices/prospects/prospectSlice';

const AddLead = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch()


  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
    })
  }, [navigation])


  // Validación del formulario con Yup
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es requerido'),
    email: Yup.string().email('Correo inválido').required('El correo es requerido'),
    phone: Yup.string()
      .required('El número de teléfono es requerido'),
  });

  // Configuración de Formik
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
    },
    validationSchema,
    onSubmit: (values) => {
      const { name, email, phone } = values;
      if (name && email && phone) {
        dispatch(addLeadsToFirestore([{
          nombre: name,
          email,
          numeroTelefono: phone,
          fechaCreacion: new Date().toISOString(),
        }]));
      }
      formik.resetForm();
    },
  });

  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar Lead</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={formik.values.name}
        onChangeText={formik.handleChange('name')}
        onBlur={formik.handleBlur('name')}
      />
      {formik.touched.name && formik.errors.name ? <Text style={styles.errorText}>{formik.errors.name}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={formik.values.email}
        onChangeText={formik.handleChange('email')}
        onBlur={formik.handleBlur('email')}
        keyboardType="email-address"
      />
      {formik.touched.email && formik.errors.email ? <Text style={styles.errorText}>{formik.errors.email}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Número de teléfono"
        value={formik.values.phone}
        onChangeText={formik.handleChange('phone')}
        onBlur={formik.handleBlur('phone')}
        keyboardType="phone-pad"
      />
      {formik.touched.phone && formik.errors.phone ? <Text style={styles.errorText}>{formik.errors.phone}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={() => formik.handleSubmit()}>
        <Text style={styles.buttonText}>Agregar Lead</Text>
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
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddLead;
