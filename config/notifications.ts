import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import Constants from 'expo-constants';

export async function registerForPushNotificationsAsync() {
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('No se otorgaron permisos para notificaciones');
      return null;
    }

    const token = (await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId
    })).data;

    return token;
  } else {
    alert('Debe usar un dispositivo físico para recibir notificaciones');
  }
}

export async function saveTokenToFirestore(uid: string, token: string) {
  const db = getFirestore();
  await setDoc(doc(db, 'users', uid), { expoPushToken: token }, { merge: true });
}
