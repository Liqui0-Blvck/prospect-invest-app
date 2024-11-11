import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('No se otorgaron permisos para notificaciones');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Token del dispositivo:', token);
  } else {
    alert('Debe usar un dispositivo físico para las notificaciones');
  }

  return token;
}
