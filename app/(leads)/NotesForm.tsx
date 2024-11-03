import LeadNotes from '@/components/leadsComponents/leadNotes';
import { ColorsNative } from '@/constants/Colors';
import { useNavigation } from 'expo-router';
import React, { Dispatch, SetStateAction, useEffect, useLayoutEffect } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

const NotesForm = () => {
  const navigator = useNavigation()

  useLayoutEffect(() => {
    navigator.setOptions({ 
      headerShown: true,
      title: 'Agregar Nota',
      headerStyle: {
        backgroundColor: ColorsNative.background[200],
        color: 'white',
      },
      headerTintColor: 'white',
      
    });
  }, [navigator]);

  return (
    <SafeAreaView style={styles.container}>
       <LeadNotes/>  
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: ColorsNative.text[100],
  }
})

export default NotesForm;
