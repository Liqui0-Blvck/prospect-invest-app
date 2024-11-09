import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    scopes: ['https://www.googleapis.com/auth/calendar.events'], // Permiso para acceder a eventos del calendario
    webClientId: 'YOUR_WEB_CLIENT_ID', // Reemplaza con tu client ID de OAuth 2.0 para aplicaciones web
  });
};