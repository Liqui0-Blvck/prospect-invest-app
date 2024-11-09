import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import { GoogleSignin, User } from '@react-native-google-signin/google-signin';

interface GoogleAuthComponentProps {
  onSignIn: (token: string) => void;
}

const GoogleAuthComponent: React.FC<GoogleAuthComponentProps> = ({ onSignIn }) => {
  const [userInfo, setUserInfo] = useState<User | null>(null);

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setUserInfo(userInfo);

      const { accessToken } = await GoogleSignin.getTokens();
      onSignIn(accessToken);
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
    }
  };

  return (
    <View>
      <Button title="Iniciar sesión con Google" onPress={signInWithGoogle} />
      {userInfo && <Text>Bienvenido, {userInfo.user.name}</Text>}
    </View>
  );
};

export default GoogleAuthComponent;
