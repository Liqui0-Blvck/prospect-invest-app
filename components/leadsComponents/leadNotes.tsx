import React, { Dispatch, SetStateAction } from 'react';
import { StyleSheet, View, TextInput, Button, Text, Pressable } from 'react-native';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { ColorsNative } from '@/constants/Colors';
import { ADD_NOTAS } from '@/redux/slices/prospects/prospectSlice';
import { useGlobalSearchParams, useNavigation } from 'expo-router';


const LeadNotes = () => {
  const dispatch = useDispatch();
  const { id } = useGlobalSearchParams();
  const navigator = useNavigation()


  const formik = useFormik({
    initialValues: {
      title: '',
      content: '',
      date: new Date().toISOString().slice(0, 10),
    },
    onSubmit: (values, { resetForm }) => {
      // Aquí puedes enviar los valores a Firebase
      dispatch(ADD_NOTAS({
        id: Math.random().toString(36).substring(7),
        title: values.title,
        content: values.content,
        date: values.date,
        leadId: id,
        creatorId: '1', 
      }));
      navigator.goBack();
      resetForm(); 
    },
  });


  return (
    <View style={styles.container}>
      <View style={{ marginTop: 20 }}>
        <Text style={styles.label}>Título</Text>
        <TextInput
          style={styles.input}
          onChangeText={formik.handleChange('title')}
          onBlur={formik.handleBlur('title')}
          value={formik.values.title}
        />
        {formik.touched.title && formik.errors.title ? (
          <Text style={styles.error}>{formik.errors.title}</Text>
        ) : null}

        <Text style={styles.label}>Contenido</Text>
        <TextInput
          style={styles.textArea}
          numberOfLines={5}
          textAlignVertical='top'
          onChangeText={formik.handleChange('content')}
          onBlur={formik.handleBlur('content')}
          value={formik.values.content}
        />
        {formik.touched.content && formik.errors.content ? (
          <Text style={styles.error}>{formik.errors.content}</Text>
        ) : null}

        {/* <Button onPress={() => formik.handleSubmit()} title="Agregar Nota" /> */}
          <Pressable
            style={[styles.button, { backgroundColor: ColorsNative.primary[100] }] }
            onPress={() => formik.handleSubmit()}
          >
            <Text style={{ color: 'white', fontSize: 16 }}>Agregar Nota</Text>
          </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: ColorsNative.background[100],
  },
  input: {
    borderWidth: 1,
    borderColor: ColorsNative.background[100],
    borderRadius: 5,
    color: ColorsNative.background[100],
    padding: 10,
    marginBottom: 15,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    color: ColorsNative.background[100],
    height: 120,
  },
  error: {
    color: 'red',
    fontSize: 12,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
});

export default LeadNotes;
