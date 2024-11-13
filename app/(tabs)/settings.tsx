import Layout from '@/components/Layout'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Pressable, Switch, Image } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import BackgroundStyle from '@/components/BackgroundStyle';
import { logout } from '@/redux/slices/auth/authSlice';
import { useAppDispatch } from '@/redux/store';

const settings = () => {
  const [pushNotifications, setPushNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigation = useNavigation()
  const dispatch = useAppDispatch()
  const router = useRouter()

  const togglePushNotifications = () => setPushNotifications(!pushNotifications);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false, headerTintColor: 'white' });
  }, [navigation])

  return (
    <SafeAreaView style={styles.container}>
      
      <ScrollView style={styles.settingsContainer} contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Perfil */}
        <View style={styles.profileContainer}>
          <Image source={{ uri: 'https://via.placeholder.com/50' }} style={styles.profileImage} />
          <Text style={styles.profileName}>Yennefer Doe</Text>
        </View>

        {/* Sección de Configuración */}
        <Text style={styles.sectionHeader}>Account Settings</Text>

        <Pressable style={styles.pressableRow}>
          <Text style={styles.rowText}>Edit profile</Text>
          <Ionicons name="chevron-forward" size={20} color="black" />
        </Pressable>

        <Pressable style={styles.pressableRow}>
          <Text style={styles.rowText}>Change password</Text>
          <Ionicons name="chevron-forward" size={20} color="black" />
        </Pressable>

        <Pressable style={styles.pressableRow}>
          <Text style={styles.rowText}>Add a payment method</Text>
          <Ionicons name="add" size={20} color="black" />
        </Pressable>

        <View style={styles.switchRow}>
          <Text style={styles.rowText}>Push notifications</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={pushNotifications ? "#f5dd4b" : "#f4f3f4"}
            onValueChange={togglePushNotifications}
            value={pushNotifications}
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.rowText}>Dark mode</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={darkMode ? "#f5dd4b" : "#f4f3f4"}
            onValueChange={toggleDarkMode}
            value={darkMode}
          />
        </View>

        {/* Sección de Información */}
        <Text style={styles.sectionHeader}>More</Text>

        <Pressable style={styles.pressableRow}>
          <Text style={styles.rowText}>About us</Text>
          <Ionicons name="chevron-forward" size={20} color="black" />
        </Pressable>

        <Pressable style={styles.pressableRow}>
          <Text style={styles.rowText}>Privacy policy</Text>
          <Ionicons name="chevron-forward" size={20} color="black" />
        </Pressable>

        <Pressable onPress={() => {
          dispatch(logout()).unwrap().then(() => {
            router.replace('/auth/login')
          })
        }} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  
  settingsContainer: {
    marginTop: 130,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 15,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 20,
  
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
  
  
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'gray',
    marginBottom: 10,
    marginTop: 20,
  },
  pressableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  rowText: {
    fontSize: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logoutButton: {
    backgroundColor: '#ff0033',
    width: '100%',
    paddingHorizontal: 5,
    borderRadius: 10,
    marginTop: 10,
  },
  logoutText: {
    color: 'white',
    textAlign: 'center',
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: 'bold',
  }
})

export default settings;
