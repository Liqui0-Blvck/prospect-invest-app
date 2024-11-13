import React, { FC, useLayoutEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Calendar } from 'react-native-calendars';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { router, useGlobalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, useAppDispatch, useAppSelector } from '@/redux/store';
import { ColorsNative } from '@/constants/Colors';
import { agregarEvento } from '@/redux/slices/calendar/calendarSlice';
import { addInteraction } from '@/redux/slices/interactions/interactionSlice';
import { generateUID } from './leadDetail';

// Validación del formulario usando Yup
const MeetingSchema = Yup.object().shape({
  titulo: Yup.string().required('El título es obligatorio'),
  lugar: Yup.string().required('El lugar es obligatorio'),
  hora: Yup.string().required('La hora es obligatoria'),
  details: Yup.string().required('Los detalles son obligatorios'),
});

const CalendarAgenda = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const navigation = useNavigation();
  const router = useRouter()
  const dispatch = useAppDispatch();
  const { id } = useGlobalSearchParams()
  const { user } = useAppSelector((state: RootState) => state.auth)


  // Función para mostrar el selector de hora
  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  // Función para ocultar el selector de hora
  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  // Función para confirmar la hora seleccionada
  const handleConfirmTime = (time: Date, setFieldValue: any) => {
    const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setFieldValue('hora', timeString); // Establece la hora en Formik
    hideTimePicker();
  };

  useLayoutEffect(() => {
    navigation.setOptions({ 
      headerShown: true,
      title: 'Agendar Reunión',
      headerStyle: {
        backgroundColor: ColorsNative.background[200],
        color: 'white',
      },
      headerTintColor: 'white',
     });
  }, [navigation]);

  const { eventos } = useSelector((state: RootState) => state.lead);

  // console.log(eventos)

  const formik = useFormik({
    initialValues: {
      titulo: '',
      lugar: '',
      fecha: '',
      hora: '',
      details: '',
    },
    // validationSchema: MeetingSchema,
    onSubmit: (values) => {
      
      dispatch(
        agregarEvento({
          ...values,
          descripcion: values.details,
          fecha: selectedDate,
          asistente: id.toString(),
        })
      )
        .unwrap()
        .then(() => {
          dispatch(
            addInteraction({
              uid: generateUID(),
              tipo: 'Reunión',
              fecha: selectedDate,
              notas: 'Reunión agendada',
              leadID: id.toString(),
              userID: user?.uid as string,
            })
          )
          
          formik.resetForm();
          navigation.goBack();
        })
        .catch((error) => {
          console.error('Error al agendar el evento:', error);
        });
     
    },
  });


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Calendar
          style={{ color: ColorsNative.background[200], marginBottom: 20 }}
          onDayPress={(day: any) => {
            setSelectedDate(day.dateString);
          }}
          markedDates={{
            [selectedDate]: { selected: true, marked: true },
          }}
        />

        {selectedDate ? (
          <View style={styles.form}>
            {/* Título */}
            <View>
              <Text style={styles.label}>Título de la reunión</Text>
              <TextInput
                style={styles.input}
                onChangeText={formik.handleChange('titulo')}
                onBlur={formik.handleBlur('titulo')}
                value={formik.values.titulo}
                placeholder="Ingresa el título"
              />
              {formik.touched.titulo && formik.errors.titulo && <Text style={styles.error}>{formik.errors.titulo}</Text>}
            </View>

            {/* Lugar */}
            <View>
              <Text style={styles.label}>Lugar de la reunión</Text>
              <TextInput
                style={styles.input}
                onChangeText={formik.handleChange('lugar')}
                onBlur={formik.handleBlur('lugar')}
                value={formik.values.lugar}
                placeholder="Lugar"
              />
              {formik.touched.lugar && formik.errors.lugar && <Text style={styles.error}>{formik.errors.lugar}</Text>}
            </View>

            {/* Hora */}
            <View style={{ marginBottom: 10}}>
              <Text style={styles.label}>Hora</Text>
              <Pressable
                style={[styles.button, { borderWidth: 2, borderColor: ColorsNative.background[100], backgroundColor: ColorsNative.text[100] }] }
                onPress={() => showTimePicker()}
              >
                <Text style={{ fontSize: 17, color: ColorsNative.background[200]}}>
                  {formik.values.hora ? <Text style={styles.selectedTime}>{formik.values.hora}</Text> : 'Seleccionar hora'}
                </Text>
              </Pressable>

              
              {formik.touched.hora && formik.errors.hora && <Text style={styles.error}>{formik.errors.hora}</Text>}
            </View>

            {/* Detalles */}
            <View>
              <Text style={styles.label}>Detalles</Text>
              <TextInput
                style={styles.input}
                onChangeText={formik.handleChange('details')}
                onBlur={formik.handleBlur('details')}
                value={formik.values.details}
                placeholder="Detalles de la reunión"
              />
              {formik.touched.details && formik.errors.details && <Text style={styles.error}>{formik.errors.details}</Text>}
            </View>

            {/* Botón para enviar */}
            <Pressable
              style={[styles.button, { backgroundColor: ColorsNative.primary[100] }] }
              onPress={() => formik.handleSubmit()}
            >
              <Text style={{ fontSize: 17, color: ColorsNative.text[100]}}>Agendar Reunión</Text>
            </Pressable>

            {/* TimePicker */}
            <DateTimePickerModal
              textColor={ColorsNative.text[100]}
              isVisible={isTimePickerVisible}
              mode="time"
              onConfirm={(time) => handleConfirmTime(time, formik.setFieldValue)}
              onCancel={hideTimePicker}
            />
          </View>
        ) : (
          <Text>Selecciona una fecha para agendar la reunión.</Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 20,
  },
  form: {
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  selectedTime: {
    fontSize: 17,
    marginVertical: 10,
    color: ColorsNative.background[200],
  },
  error: {
    fontSize: 14,
    color: 'red',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
});

export default CalendarAgenda;