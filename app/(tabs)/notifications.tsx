import BackgroundStyle from '@/components/BackgroundStyle';
import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; // Asegúrate de tener instalado @expo/vector-icons
import { ColorsNative } from '@/constants/Colors';
import BottomSheet from '@/components/BottomSheet';

// Mock de notificaciones
const notifications = [
  { id: 1, type: 'reminder', title: 'Recordatorio de reunión', description: 'Reunión con cliente a las 10am' },
  { id: 2, type: 'note', title: 'Nueva nota', description: 'Agregar nota sobre cliente' },
  { id: 3, type: 'reminder', title: 'Llamada pendiente', description: 'Llamar a Juan Pérez' },
  { id: 4, type: 'note', title: 'Nota de seguimiento', description: 'Enviar correo de seguimiento' },
];

const Notifications = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);



  return (
    <SafeAreaView style={styles.container}>
      <BackgroundStyle
        styleOptions={{
          backgroundDesign: {
            height: '52%',
            paddingVertical: 10,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          }
        }}
      />
      {/* Header con botones */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notificaciones</Text>
      </View>

      {/* Lista scrolleable de notificaciones */}
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        {notifications.map(({ id, type, title, description }) => (
          <View key={id} style={styles.notificationContainer}>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>{title}</Text>
              <Text style={styles.notificationDescription}>{description}</Text>
            </View>
            <View style={[styles.notificationLine, { backgroundColor: type === 'reminder' ? '#FF6347' : '#1E90FF' }]} />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorsNative.text[100],
  },
  header: {
    height: 90,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  headerButton: {
    alignItems: 'center',
  },
  headerButtonText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
  },
  scrollContainer: {
    flex: 1,
    margin: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    // Sombras para iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  
    // Elevación para Android
    elevation: 5,
  },
  scrollContent: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 10
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationLine: {
    width: 10,
    height: '100%',
    borderRadius: 5,
    marginRight: 10,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationDescription: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
});

export default Notifications;
