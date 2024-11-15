import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { useAppSelector } from '@/redux/store';
import { getAuth } from 'firebase/auth';
import useCustomHeader from '@/hooks/useCustomHeader';
import { ColorsNative } from '@/constants/Colors';

const PasswordChange = () => {
  useCustomHeader({
    title: 'Cambiar Contraseña',
    headerShown: true,
    backgroundColor: ColorsNative.background[200],
    tintColor: 'white',
  });

  const { user } = useAppSelector((state) => state.auth);
  const auth = getAuth();

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required('Contraseña actual es requerida'),
      newPassword: Yup.string()
        .min(6, 'La nueva contraseña debe tener al menos 6 caracteres')
        .required('Nueva contraseña es requerida'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Las contraseñas no coinciden')
        .required('Confirmar contraseña es requerida'),
    }),
    onSubmit: async (values) => {
      if (user) {
        try {
          await handleChangePassword(values.currentPassword, values.newPassword);
          Alert.alert('Éxito', 'La contraseña ha sido actualizada');
        } catch (error: any) {
          Alert.alert('Error', error.message);
        }
      }
    },
  });

  // Función para cambiar la contraseña utilizando Firebase
  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    if (user) {
      const userAuth = auth.currentUser;
      if (userAuth && userAuth.email) {
        // Re-autenticar al usuario antes de cambiar la contraseña
        const credential = EmailAuthProvider.credential(userAuth.email, currentPassword);
        await reauthenticateWithCredential(userAuth, credential);

        // Actualizar la contraseña
        await updatePassword(userAuth, newPassword);
      } else {
        throw new Error('Usuario no autenticado');
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Contraseña Actual</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="Ingrese su contraseña actual"
          value={formik.values.currentPassword}
          onChangeText={formik.handleChange('currentPassword')}
        />
        {formik.errors.currentPassword && <Text style={styles.error}>{formik.errors.currentPassword}</Text>}

        <Text style={styles.label}>Nueva Contraseña</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="Ingrese su nueva contraseña"
          value={formik.values.newPassword}
          onChangeText={formik.handleChange('newPassword')}
        />
        {formik.errors.newPassword && <Text style={styles.error}>{formik.errors.newPassword}</Text>}

        <Text style={styles.label}>Confirmar Contraseña</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="Confirme su nueva contraseña"
          value={formik.values.confirmPassword}
          onChangeText={formik.handleChange('confirmPassword')}
        />
        {formik.errors.confirmPassword && <Text style={styles.error}>{formik.errors.confirmPassword}</Text>}

        <TouchableOpacity style={styles.button} onPress={() => formik.handleSubmit()}>
          <Text style={styles.buttonText}>Actualizar Contraseña</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  formContainer: {
    marginVertical: 20,
    padding: 15,
  },
  label: {
    fontSize: 16,
    color: ColorsNative.text[500],
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderColor: ColorsNative.text[300],
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    color: ColorsNative.text[400],
  },
  error: {
    color: ColorsNative.accent[100],
    marginBottom: 10,
  },
  button: {
    backgroundColor: ColorsNative.primary[100],
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PasswordChange;
