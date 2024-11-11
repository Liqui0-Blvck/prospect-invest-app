import { onRequest } from 'firebase-functions/v2/https';
import { initializeApp } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp();
const db = getFirestore();

/**
 * Función para registrar el token del dispositivo en Firestore
 */
export const registerDeviceToken = onRequest(async (req, res) => {
  const { userId, token } = req.body;

  if (!userId || !token) {
    res.status(400).json({ success: false, error: 'Faltan campos obligatorios' });
    return;
  }

  try {
    await db.collection('users').doc(userId).set({ token }, { merge: true });
    res.status(200).json({ success: true, message: 'Token registrado correctamente' });
  } catch (error) {
    console.error('Error al registrar el token:', error);
    res.status(500).json({ success: false, error: 'Error al registrar el token' });
  }
});

/**
 * Función para enviar una notificación push a un usuario específico
 */
export const sendNotification = onRequest(async (req, res) => {
  const { userId, title, body } = req.body;

  if (!userId || !title || !body) {
    res.status(400).json({ success: false, error: 'Faltan campos obligatorios' });
    return;
  }

  try {
    // Obtener el token del usuario desde Firestore
    const userDoc = await db.collection('users').doc(userId).get();
    const userToken = userDoc.data()?.token;

    if (!userToken) {
      res.status(404).json({ success: false, error: 'Token no encontrado' });
      return;
    }

    // Enviar la notificación a través de FCM
    const message = {
      notification: {
        title,
        body,
      },
      token: userToken,
    };

    await getMessaging().send(message);
    res.status(200).json({ success: true, message: 'Notificación enviada correctamente' });
  } catch (error) {
    console.error('Error al enviar notificación:', error);
    res.status(500).json({ success: false, error: 'Error al enviar notificación' });
  }
});
