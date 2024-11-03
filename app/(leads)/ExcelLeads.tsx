import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Button } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import XLSX from 'xlsx';
import { ProgressBar } from 'react-native-paper';
import { useNavigation } from 'expo-router';
import { RootState, useAppDispatch, useAppSelector } from '@/redux/store';
import { Lead } from '@/types/Leads';
import { ADD_PROSPECT, addLeadsToFirestore } from '@/redux/slices/prospects/prospectSlice';
import { generateUID } from './leadDetail';

const ExcelLeads = () => {
  const [totalLeads, setTotalLeads] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [file, setFile] = useState<any>(null);
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const { successFullLeads, failedLeads } = useAppSelector((state: RootState) => state.lead);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Carga de Leads',
    });
  }, [navigation]);

  const normalizeLeadKeys = (lead: any): Lead => ({
    id: generateUID(),
    nombre: lead['Nombre'] || lead['nombre'],
    email: lead['Email'] || lead['email'],
    numeroTelefono: lead['Teléfono'] || lead['numeroTelefono'],
    fechaCreacion: new Date().toISOString(),
  });

  const handleUploadExcel = async () => {
    try {
      const file = await DocumentPicker.getDocumentAsync({
        type: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'],
      });
      setFile(file);

      if (!file.canceled) {
        setProcessing(true);
        const data = await fetch(file.assets[0].uri);
        const arrayBuffer = await data.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const rawLeads = XLSX.utils.sheet_to_json<any>(worksheet);
        const normalizedLeads = rawLeads.map((lead) => normalizeLeadKeys(lead));

        setTotalLeads(normalizedLeads.length);

        // Dispatch para agregar leads al store
        await dispatch(addLeadsToFirestore(normalizedLeads));
        setProcessing(false);
      }
    } catch (error) {
      console.log('Error al procesar el archivo Excel:', error);
      setProcessing(false);
    }
  };

  const validateLead = (lead: Lead) => lead.nombre && lead.email;

  const processedPercentage = totalLeads > 0 ? (successFullLeads + failedLeads) / totalLeads : 0;

  return (
    <View style={styles.container}>
      {!file ? (
        <>
          <Button title="Cargar Excel" onPress={handleUploadExcel} />
        </>
      ) : (
        <>
          <Text>Archivo Cargado: {file.name}</Text>

          <Text style={styles.title}>Progreso de Leads</Text>
          {processing ? (
            <>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text style={styles.progressText}>Procesando leads...</Text>
            </>
          ) : (
            <Text style={styles.progressText}>Carga completa</Text>
          )}

          <Text>Leads Totales: {totalLeads}</Text>
          <Text>Leads Exitosos: {successFullLeads}</Text>
          <Text>Leads Fallidos: {failedLeads}</Text>

          <ProgressBar progress={processedPercentage} color="#0000ff" style={styles.progressBar} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  progressText: {
    fontSize: 18,
    marginBottom: 10,
  },
  progressBar: {
    height: 10,
    marginVertical: 20,
  },
});

export default ExcelLeads;
