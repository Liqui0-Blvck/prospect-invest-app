import { onRequest } from 'firebase-functions/v2/https';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

export const generateUID = () => {
  return 'uid-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
};

initializeApp();
const db = getFirestore();

/**
 * Función para registrar el token del dispositivo en Firestore
 */
export const registerDeviceToken = onRequest(async (req, res) => {
  const { userId, token } = req.body;

  // Validar los campos obligatorios
  if (!userId || !token) {
    res.status(400).json({ success: false, error: 'Faltan campos obligatorios' });
    return;
  }

  try {
    // Guardar el token en Firestore
    await db.collection('users').doc(userId).set({ token }, { merge: true });
    res.status(200).json({ success: true, message: 'Token registrado correctamente' });
  } catch (error) {
    console.error('Error al registrar el token:', error);
    res.status(500).json({ success: false, error: 'Error al registrar el token' });
  }
});

/**
 * Función para enviar una notificación push a un usuario específico usando Expo
 */
export const sendNotification = onRequest(async (req, res) => {
  const { userId, title, body } = req.body;

  // Validar los campos obligatorios
  if (!userId || !title || !body) {
    res.status(400).json({ success: false, error: 'Faltan campos obligatorios' });
    return;
  }

  try {
    // Obtener el token de Expo Push desde Firestore
    const userDoc = await db.collection('users').doc(userId).get();
    const expoPushToken = userDoc.data()?.token;

    // Verificar si el token existe
    if (!expoPushToken) {
      res.status(404).json({ success: false, error: 'Token no encontrado' });
      return;
    }

    // Verificar si el token es válido de Expo
    if (!expoPushToken.startsWith('ExponentPushToken')) {
      res.status(400).json({ success: false, error: 'Token inválido de Expo' });
      return;
    }

    // Preparar el mensaje para la notificación
    const message = {
      to: expoPushToken,
      sound: 'default',
      title,
      body,
      data: { someData: 'data' },
    };

    // Enviar la notificación a través de la API de Expo
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    const responseData = await response.json();

    // Verificar si hubo errores en la respuesta de Expo
    if (responseData.errors) {
      console.error('Error al enviar notificación:', responseData.errors);
      res.status(500).json({ success: false, error: 'Error al enviar notificación' });
    } else {
      // Guardar la notificación en Firestore
      await db.collection('notifications').add({
        id: generateUID(),
        userId,
        title,
        body,
        opened: false,
        createdAt: new Date(),
      });
      console.log('Notificación enviada correctamente:', responseData);
      res.status(200).json({ success: true, message: 'Notificación enviada correctamente' });
    }
  } catch (error) {
    console.error('Error al enviar notificación:', error);
    res.status(500).json({ success: false, error: 'Error al enviar notificación' });
  }
});
