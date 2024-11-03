import React, { Dispatch, FC, SetStateAction } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Pressable } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { ADD_PROSPECT } from '@/redux/slices/prospects/prospectSlice';
import { Keyboard } from 'react-native';

export interface Lead {
  nombre: string; // Nombre del lead
  numeroTelefono: string; // Número de teléfono
  email: string; // Dirección de correo electrónico
}

// Esquema de validación con Yup
const LeadSchema = Yup.object().shape({
  nombre: Yup.string().required('El nombre es requerido'),
  numeroTelefono: Yup.string()
    .matches(/^\d+$/, 'El número de teléfono no es válido')
    .required('El número de teléfono es requerido'),
  email: Yup.string().email('Correo electrónico inválido').required('El correo electrónico es requerido'),
});

interface LeadFormProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const LeadForm: FC<LeadFormProps> = ({ setIsOpen }) => {
  const dispatch = useDispatch()

  return (
    <Formik
      initialValues={{ nombre: '', numeroTelefono: '', email: '' }}
      validationSchema={LeadSchema}
      onSubmit={(values: Lead, { resetForm }) => {
        dispatch(ADD_PROSPECT({ id: '111001', ...values }))
        Keyboard.dismiss()
        resetForm()
        Keyboard.dismiss()
        setIsOpen(false)

      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <View>
          <Text style={styles.title}>Nuevo Prospecto</Text>
          <View style={styles.container}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleChange('nombre')}
              onBlur={handleBlur('nombre')}
              value={values.nombre}
              placeholder="Nombre del lead"
            />
            {touched.nombre && errors.nombre && <Text style={styles.error}>{errors.nombre}</Text>}

            <Text style={styles.label}>Número de Teléfono</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleChange('numeroTelefono')}
              onBlur={handleBlur('numeroTelefono')}
              value={values.numeroTelefono}
              keyboardType="numeric"
              placeholder="Número de teléfono"
            />
            {touched.numeroTelefono && errors.numeroTelefono && (
              <Text style={styles.error}>{errors.numeroTelefono}</Text>
            )}

            <Text style={styles.label}>Correo Electrónico</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              keyboardType="email-address"
              placeholder="Correo electrónico"
            />
            {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

            {/* <Button onPress={() => handleSubmit} title="Guardar Lead" /> */}
              <Pressable style={styles.button} onPress={() => handleSubmit()}>
                <Text style={{ color: 'white' }} >Guardar Prospecto</Text>
              </Pressable>
          </View>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    color: 'white'
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: 'white'
  },
  input: {
    height: 40,
    borderColor: '#ffffff',
    color: 'white',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 8,
  },
  error: {
    fontSize: 12,
    color: 'red',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#0a8967',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    display: 'flex',
    alignItems: 'center',
    marginTop: 10,
  },
  title: { 
    fontSize: 25,
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginTop: 20,
    color: 'white'
  }
});

export default LeadForm;
