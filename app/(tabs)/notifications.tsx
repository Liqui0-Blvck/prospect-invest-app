import BackgroundStyle from '@/components/BackgroundStyle';
import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Pressable, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; // Asegúrate de tener instalado @expo/vector-icons
import { ColorsNative } from '@/constants/Colors';
import BottomSheet from '@/components/BottomSheet';
import { fetchNotifications } from '@/redux/slices/notifications/notificationsSlice';
import useNotificationsListener from '@/hooks/useNotificationListener';
import { RootState, useAppDispatch, useAppSelector } from '@/redux/store';



const Notifications = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { notifications, loading } = useAppSelector((state: RootState) => state.notifications);
  const { user } = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();

  useNotificationsListener();

  // Renderiza el skeleton de carga
  const renderLoadingSkeleton = () => (
    <View style={styles.notificationContainer}>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>Cargando...</Text>
        <Text style={styles.notificationDescription}>Cargando...</Text>
      </View>
      <View style={[styles.notificationLine, { backgroundColor: '#1E90FF' }]} />
    </View>
  );

  // Renderiza una notificación
  const renderNotification = ({ item }: { item: Notification }) => (
    <View style={styles.notificationContainer}>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationDescription}>{item.body}</Text>
      </View>
      <View style={[styles.notificationLine, { backgroundColor: item.tag === 'reminder' ? '#FF6347' : '#1E90FF' }]} />
    </View>
  );

  const onRefresh = async () => {
    setRefreshing(true);
    if (user?.uid) {
      await dispatch(fetchNotifications(user.uid));
    }
    setRefreshing(false);
  };



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

      
      <FlatList
        style={styles.scrollContainer}
        data={loading ? Array.from({ length: 5 }, (_, index) => ({ id: `loading-${index}` })) : notifications}
        keyExtractor={(item, index) => loading ? `loading-${index}` : item.tag}
        renderItem={loading ? () => renderLoadingSkeleton() : renderNotification}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={ColorsNative.text[100]} />
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay notificaciones disponibles</Text>
            </View>
          )
        }
      />
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
    padding: 5,
    borderRadius: 10,
    backgroundColor: ColorsNative.text[100],
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
    marginVertical: 5,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
});

export default Notifications;
