import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import DocumentPicker, { types } from 'react-native-document-picker';

const LeadFormExcel = () => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  // Función para seleccionar un archivo
  const pickExcelFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [types.xlsx, types.xls], // Solo permitir archivos Excel
      });

      // Verifica si el archivo seleccionado es de tipo Excel
      if (res[0].type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
          res[0].type === 'application/vnd.ms-excel') {
        setSelectedFile(res[0].name);
      } else {
        Alert.alert('Error', 'Por favor, selecciona un archivo Excel válido.');
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // El usuario canceló la selección del archivo
        Alert.alert('Cancelado', 'No seleccionaste ningún archivo.');
      } else {
        Alert.alert('Error', 'Ocurrió un error al intentar seleccionar el archivo.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subir archivo de prospectos (Excel)</Text>

      <TouchableOpacity style={styles.button} onPress={pickExcelFile}>
        <Text style={styles.buttonText}>Seleccionar archivo Excel</Text>
      </TouchableOpacity>

      {selectedFile && (
        <Text style={styles.selectedFileText}>Archivo seleccionado: {selectedFile}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0', // Color de fondo claro para mejor contraste
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333', // Color del texto oscuro
  },
  button: {
    backgroundColor: '#4CAF50', // Verde claro para el botón
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedFileText: {
    marginTop: 20,
    fontSize: 16,
    color: '#333', // Texto oscuro para el archivo seleccionado
  },
});

export default LeadFormExcel;
