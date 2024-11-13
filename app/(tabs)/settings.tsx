import Layout from '@/components/Layout'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Pressable, Switch, Image, Dimensions } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import BackgroundStyle from '@/components/BackgroundStyle';
import { fetchUserData, logout } from '@/redux/slices/auth/authSlice';
import { RootState, useAppDispatch, useAppSelector } from '@/redux/store';

const { height } = Dimensions.get('window');

const settings = () => {
  const [pushNotifications, setPushNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigation = useNavigation()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { user } = useAppSelector((state: RootState) => state.auth)

  useEffect(() => {
    dispatch(fetchUserData(user?.uid!));
  }, [])

  const togglePushNotifications = () => setPushNotifications(!pushNotifications);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false, headerTintColor: 'black' });
  }, [navigation])

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundStyle
        title="Configuración" 
        icons={<Ionicons name="settings" size={30} color="white" />}
        styleOptions={{
          backgroundDesign: {
            height: height * 0.45,
            paddingVertical: 10,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            zIndex: -3
          },
          headerContainer: {
            paddingTop: 20,
          }
          
        }}>
          <View style={{

          }}>

          </View>
        </BackgroundStyle>
      
      <ScrollView style={styles.settingsContainer} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Perfil */}
        <View style={styles.profileContainer}>
          <Image source={{ uri: user?.photoURL ? user.photoURL : 'https://via.placeholder.com/120' }} style={styles.profileImage} />
          <Text style={styles.profileName}>{user?.displayName}</Text>
        </View>

        {/* Sección de Configuración */}
        <Text style={styles.sectionHeader}>Configuración de cuenta</Text>

        <Pressable style={styles.pressableRow}
          onPress={() => router.push('/(configuration)/EditProfile')}>
          <Text style={styles.rowText}>Editar Perfil</Text>
          <Ionicons name="chevron-forward" size={20} color="black" />
        </Pressable>

        <Pressable style={styles.pressableRow} onPress={() => router.push('/(configuration)/PasswordChange')}> 
          <Text style={styles.rowText}>Cambiar contraseña</Text>
          <Ionicons name="chevron-forward" size={20} color="black" />
        </Pressable>

        <Pressable style={styles.pressableRow}>
          <Text style={styles.rowText}>Notificaciones</Text>
          <Ionicons name="add" size={20} color="black" />
        </Pressable>

        {/* <View style={styles.switchRow}>
          <Text style={styles.rowText}>Push notifications</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={pushNotifications ? "#f5dd4b" : "#f4f3f4"}
            onValueChange={togglePushNotifications}
            value={pushNotifications}
          />
        </View> */}

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
        <Text style={styles.sectionHeader}>Más</Text>

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
  },
  
  settingsContainer: {
    height: height * 0.095,
    position: 'relative',
    top: 78,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 10,
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
    width: 70,
    height: 70,
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
