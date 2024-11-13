import useCustomHeader from '@/hooks/useCustomHeader';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, Pressable, SafeAreaView, Image, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ColorsNative } from '@/constants/Colors';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestoreService, storageService } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { RootState, useAppDispatch, useAppSelector } from '@/redux/store';
import { useSubmitButton } from '@/hooks/useSubmitButton';
import { fetchUserData } from '@/redux/slices/auth/authSlice';
import { useNavigation } from 'expo-router';

interface FormikValues {
  name: string;
  email: string;
  displayName: string;
  photoURL: string;
  phoneNumber: string;
  address: string;
}


const EditProfile = () => {
  const { isSubmitting, handleSubmit } = useSubmitButton();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const { user } = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch()
  const navigation = useNavigation()

  useCustomHeader({
    title: 'Editar Perfil',
    headerShown: true,
    backgroundColor: ColorsNative.background[200],
    tintColor: ColorsNative.text[100],
  });


  const formik = useFormik<FormikValues>({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      displayName: user?.displayName || '',
      photoURL: user?.photoURL || '',
      phoneNumber: user?.phoneNumber || '',
      address: user?.address || '',
    },
    onSubmit: (values) => {
      handleSubmit(async () => {
        try {
          const downloadURL = await uploadImage();
          if (downloadURL) {
            values.photoURL = downloadURL;
          }
  
          // Guardar los cambios en Firestore
          await updateProfileInFirestore(values);
          dispatch(fetchUserData(user?.uid!));
          Alert.alert('Perfil actualizado', 'Tus cambios han sido guardados exitosamente.');
          setTimeout(() => {
            navigation.goBack();
          }, 1000)
        } catch (error) {
          console.error('Error al actualizar perfil:', error);
          Alert.alert('Error', 'No se pudo actualizar el perfil.');
        }0
      })
    },
  });



  // Función para seleccionar una imagen desde la galería
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      const { uri } = result.assets[0];
      setSelectedImage(uri);
    }
  };

  // Función para subir la imagen a Firebase Storage
  const uploadImage = async (): Promise<string | null> => {
    if (!selectedImage) return null;

    setUploading(true);
    try {
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const filename = `profilePictures/${user?.displayName}-${user?.uid}/${Date.now()}.jpg`;
      const storageRef = ref(storageService, filename);

      // Subir la imagen a Firebase Storage
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      console.log('URL de descarga obtenida:', downloadURL);
      return downloadURL;
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      Alert.alert('Error', 'No se pudo subir la imagen.');
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Función para actualizar el perfil en Firestore
  const updateProfileInFirestore = async (values: FormikValues) => {
    if (!user?.uid) return;

    const userDocRef = doc(firestoreService, 'users', user.uid);
    await setDoc(userDocRef, values, { merge: true });

  };


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Información Personal</Text>
          <View style={styles.contenedorImage}>
            <Image source={{ uri: selectedImage || formik.values.photoURL || 'https://via.placeholder.com/120' }} style={styles.profileImage} />
            <Pressable style={styles.button} onPress={pickImage}>
              <Text style={styles.buttonText}>Seleccionar Imagen</Text>
            </Pressable>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Nombre Completo"
            value={formik.values.name}
            onChangeText={formik.handleChange('name')}
          />

          <TextInput
            style={styles.input}
            placeholder="Nombre para mostrar"
            value={formik.values.displayName}
            onChangeText={formik.handleChange('displayName')}
          />

          <TextInput
            style={styles.input}
            placeholder="Correo Electrónico"
            value={formik.values.email}
            onChangeText={formik.handleChange('email')}
          />

          <TextInput
            style={styles.input}
            placeholder="Número de teléfono"
            keyboardType="phone-pad"
            value={formik.values.phoneNumber}
            onChangeText={formik.handleChange('phoneNumber')}
          />

          <TextInput
            style={styles.input}
            placeholder="Dirección"
            value={formik.values.address}
            onChangeText={formik.handleChange('address')}
          />

          <Pressable 
            style={styles.submitButton}
            disabled={isSubmitting} 
            onPress={() => formik.handleSubmit()}>
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.submitButtonText}>Guardar Cambios</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  scrollContainer: {
    gap: 20,
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    margin: 'auto'
  },
  input: {
    height: 50,
    borderColor: ColorsNative.text[300],
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: ColorsNative.primary[200],
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
  },
  submitButton: {
    backgroundColor: ColorsNative.primary[100],
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
    contenedorImage: {
    display: 'flex',
    gap: 2,
    justifyContent: 'center',
  }
});

export default EditProfile;


