import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ColorsNative } from '@/constants/Colors';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firestoreService } from '@/firebase';
import useCustomHeader from '@/hooks/useCustomHeader';

interface NotificationType {
  id: string;
  title: string;
  description: string;
}

const notificationOptions: NotificationType[] = [
  { id: 'reminders', title: 'Recordatorios', description: 'Notificaciones sobre tareas y citas.' },
  // { id: 'promotions', title: 'Promociones', descriptio n: 'Mensajes de promociones y ofertas.' },
  { id: 'updates', title: 'Actualizaciones', description: 'Actualizaciones importantes de la app.' },
];

const NotificationConfig = () => {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const { user } = useAppSelector((state) => state.auth);
  const auth = getAuth();
  const dispatch = useAppDispatch();

  useCustomHeader({
    title: 'Configuración de Notificaciones',
    headerShown: true,
    backgroundColor: ColorsNative.background[200],
    tintColor: 'white',
  });

  useEffect(() => {
    if (user?.uid) {
      loadNotificationSettings();
    }
  }, [user]);

  // Cargar configuración desde Firestore
  const loadNotificationSettings = async () => {
    try {
      const userDocRef = doc(firestoreService, 'users', user?.uid!);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setEnabled(data.notificationsEnabled);
        setSelectedOptions(data.notificationPreferences || []);
      }
    } catch (error) {
      console.error('Error al cargar configuración:', error);
    }
  };

  // Guardar configuración en Firestore
  const saveNotificationSettings = async () => {
    try {
      const userDocRef = doc(firestoreService, 'users', user?.uid!);
      await setDoc(userDocRef, {
        notificationsEnabled: enabled,
        notificationPreferences: selectedOptions,
      }, { merge: true });

      Alert.alert('Éxito', 'Configuración de notificaciones actualizada');
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      Alert.alert('Error', 'Hubo un problema al guardar la configuración');
    }
  };

  // Manejar el cambio en el Switch
  const handleToggleSwitch = () => {
    setEnabled(!enabled);
  };

  // Manejar la selección de opciones
  const handleSelectOption = (optionId: string) => {
    if (selectedOptions.includes(optionId)) {
      setSelectedOptions(selectedOptions.filter(id => id !== optionId));
    } else {
      setSelectedOptions([...selectedOptions, optionId]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activar Notificaciones</Text>
        <Switch
          value={enabled}
          onValueChange={handleToggleSwitch}
          thumbColor={enabled ? ColorsNative.background[100] : '#f4f3f4'}
          trackColor={{ false: '#767577', true: ColorsNative.primary[100] }}
        />
      </View>

      <FlatList
        data={notificationOptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelectOption(item.id)}>
            <View style={styles.optionContainer}>
              <View>
                <Text style={styles.optionTitle}>{item.title}</Text>
                <Text style={styles.optionDescription}>{item.description}</Text>
              </View>
              <Switch
                value={selectedOptions.includes(item.id)}
                onValueChange={() => handleSelectOption(item.id)}
                thumbColor={selectedOptions.includes(item.id) ? ColorsNative.background[100] : '#f4f3f4'}
                trackColor={{ false: '#767577', true: ColorsNative.primary[100] }}
              />
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <TouchableOpacity style={styles.saveButton} onPress={saveNotificationSettings}>
        <Text style={styles.saveButtonText}>Guardar Configuración</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ColorsNative.text[700],
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: ColorsNative.text[200],
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionDescription: {
    fontSize: 14,
    color: '#555',
  },
  saveButton: {
    backgroundColor: ColorsNative.background[100],
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NotificationConfig;
