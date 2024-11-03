import React, { useLayoutEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, ScrollView, Pressable } from 'react-native';
import * as MailComposer from 'expo-mail-composer';
import * as DocumentPicker from 'expo-document-picker';
import { useNavigation } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ColorsNative } from '@/constants/Colors';

const MailLead = () => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);

  console.log(attachments)

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ 
      headerShown: true,
      title: 'Enviar Correo',
      headerStyle: {
        backgroundColor: ColorsNative.background[200],
        color: 'white',
      },
      headerTintColor: 'white',
     });
  }, [navigation]);

  const sendEmail = async () => {
    const isAvailable = await MailComposer.isAvailableAsync();
    if (isAvailable) {
      const options = {
        recipients: [to],
        subject: subject,
        body: body,
        attachments: attachments,  // Adjuntar archivos seleccionados
      };

      try {
        await MailComposer.composeAsync(options);
      } catch (error) {
        console.error('Error al enviar el correo:', error);
      }
    } else {
      console.log('El servicio de correo no está disponible.');
    }
  };

  const pickDocument = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({});
      //@ts-ignore
      if (result.type === 'success') {
      //@ts-ignore
        setAttachments([...attachments, result.uri])
      }
    } catch (error) {
      console.error('Error al seleccionar el archivo:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.containerMail}>
        <View>
          <Text style={styles.label}>Para:</Text>
          <TextInput
            style={styles.input}
            placeholder="Correo destinatario"
            value={to}
            onChangeText={setTo}
          />

          <Text style={styles.label}>Asunto:</Text>
          <TextInput
            style={styles.input}
            placeholder="Asunto"
            value={subject}
            onChangeText={setSubject}
          />

          <Text style={styles.label}>Mensaje:</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Escribe tu mensaje"
            value={body}
            onChangeText={setBody}
            multiline={true}
            numberOfLines={5}
          />

        </View>

        <View style={styles.attachmentsContainer}>
          {attachments.length > 0 && (
            <View style={styles.attachmentsContainer}>
              <Text style={styles.label}>Archivos adjuntos:</Text>
              {attachments.map((file, index) => (
                <Text key={index} style={styles.attachmentItem}>
                  {file.split('/').pop()}
                </Text>
              ))}
            </View>
          )}

          <Pressable style={[styles.buttons, { backgroundColor: '#2c3e50'}]} onPress={pickDocument}>
            <Text style={styles.buttonText}>Adjuntar Archivos</Text>
          </Pressable>
          <Pressable style={[styles.buttons, { backgroundColor: '#0a8967'}]}>
            <Text style={styles.buttonText}>Enviar Correo</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  containerMail: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    flexGrow: 1,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 10
  },
  textArea: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingTop: 5,
    textAlignVertical: 'top',
    marginBottom: 16,
    borderRadius: 10
  },
  attachmentsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
    marginTop: 16,
    marginBottom: 16,
  },
  attachmentItem: {
    fontSize: 14,
    color: 'gray',
  },

  buttons: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '48%',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default MailLead;
