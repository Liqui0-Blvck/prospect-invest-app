import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { firestoreService } from '@/firebase';
import { collection, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { setNotifications } from '@/redux/slices/notifications/notificationsSlice';
import { Notification } from '@/types/Notifications';

const useNotificationsListener = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.uid) {
      // Referencia a la colección de notificaciones del usuario
      const notificationsRef = query(
        collection(firestoreService, 'notifications'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
  
      // Escuchar en tiempo real
      const unsubscribe = onSnapshot(
        notificationsRef,
        (snapshot) => {
          const notificationsArray = snapshot.docs.map((doc) => {
            const data = doc.data();
            
            // Convertir `createdAt` a un string ISO si es un `Timestamp`
            const createdAt = data.createdAt instanceof Timestamp
              ? data.createdAt.toDate().toISOString()
              : data.createdAt;
  
            return {
              id: doc.id,
              ...data,
              createdAt, // Asegurarse de que `createdAt` sea serializable
            };
          }) as Notification[];
  
          console.log('Notificaciones actualizadas:', notificationsArray);
          dispatch(setNotifications(notificationsArray));
        },
        (error) => {
          console.error('Error al obtener notificaciones:', error);
        }
      );
  
      return () => unsubscribe();
    }
  }, [user, dispatch]);
};

export default useNotificationsListener;
