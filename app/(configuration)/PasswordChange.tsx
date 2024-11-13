import useCustomHeader from '@/hooks/useCustomHeader';
import { useNavigation } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const PasswordChange = () => {
  const navigation = useNavigation()

  useCustomHeader({
    title: 'Cambiar contraseña',
    headerShown: true,
  });


  return (
    <View>
      {/* PasswordChange */}
      <Text>Hola soy una mierda</Text>
    </View>
  );
}

const styles = StyleSheet.create({})

export default PasswordChange;
