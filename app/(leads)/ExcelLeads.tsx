import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import XLSX from 'xlsx';
import { useNavigation } from 'expo-router';
import { RootState, useAppDispatch, useAppSelector } from '@/redux/store';
import { Lead } from '@/types/Leads';
import { addLeadsToFirestore, RESET_LEADS_COUNT } from '@/redux/slices/prospects/prospectSlice';
import { generateUID } from './leadDetail';
import { ColorsNative } from '@/constants/Colors';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const ExcelLeads = () => {
  const [totalLeads, setTotalLeads] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [file, setFile] = useState<any>(null);
  const positionY = useSharedValue(0);
  const fadeOpacity = useSharedValue(0); // Opacidad de la tarjeta de conteo
  const translateY = useSharedValue(-20); // Traslación de la tarjeta de conteo
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const { successFullLeads, failedLeads } = useAppSelector((state: RootState) => state.lead);

  useEffect(() => {
    dispatch(RESET_LEADS_COUNT());
  }, [])

  useEffect(() => {
    if (file && !file.canceled) {
      positionY.value = -15; // Desplaza el contenedor de carga hacia arriba
      fadeOpacity.value = 1;  // Muestra la tarjeta de conteo
      translateY.value = -20; // Desplaza la tarjeta de conteo hacia abajo
    } else {
      positionY.value = 0; // Posición inicial del contenedor de carga
      fadeOpacity.value = 0; // Oculta la tarjeta de conteo
      translateY.value = -20; // Posición inicial de la tarjeta de conteo
    }
  }, [file]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Carga de Leads',
      headerStyle: {
        backgroundColor: ColorsNative.background[200],
        color: 'white',
      },
      headerTintColor: 'white',
    });
  }, [navigation]);

  const normalizeLeadKeys = (lead: any): Lead => ({
    id: generateUID(),
    nombre: lead['Nombre'] || lead['nombre'],
    email: lead['Email'] || lead['email'],
    numeroTelefono: lead['Teléfono'] || lead['numeroTelefono'],
    fechaCreacion: new Date().toISOString(),
    estado: 'esperando',
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
        await dispatch(addLeadsToFirestore(normalizedLeads))
        setProcessing(false);
      }
    } catch (error) {
      console.log('Error al procesar el archivo Excel:', error);
      setProcessing(false);
    }
  };

  const processedPercentage = totalLeads > 0 ? (successFullLeads + failedLeads) / totalLeads : 0;

  // Estilos animados
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withTiming(positionY.value, { duration: 500, easing: Easing.out(Easing.exp) }) }],
  }));

  const fadeInStyle = useAnimatedStyle(() => ({
    opacity: withTiming(fadeOpacity.value, { duration: 500, easing: Easing.out(Easing.exp) }),
    transform: [{ translateY: withTiming(translateY.value, { duration: 500, easing: Easing.out(Easing.exp) }) }],
  }));

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={stylesChargingLeads.container}>
        <Animated.View style={[stylesChargingLeads.containerLoading, animatedStyle]}>
          <Text style={stylesChargingLeads.title}>Subir archivo</Text>
          <Text style={stylesChargingLeads.subtitle}>Sube un archivo Excel con los leads que deseas cargar</Text>
          <TouchableOpacity 
            style={stylesChargingLeads.uploadButton}
            onPress={handleUploadExcel}
          >
            <Text style={stylesChargingLeads.uploadButtonText}>{!file || file.canceled ? 'Subir archivo' : `${file.assets[0].name}`}</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Tarjeta de progreso con animación de fade-in */}
        {file && !file.canceled && (
          <Animated.View style={[styles.progressContainer, fadeInStyle]}>
            <Text style={styles.progressTitle}>Archivo Cargado: {file.name}</Text>
            <Text style={styles.title}>Progreso de Leads</Text>
            {processing ? (
              <>
                <ActivityIndicator size="large" color="#4A90E2" />
                <Text style={styles.progressText}>Procesando leads...</Text>
              </>
            ) : (
              <Text style={styles.progressText}>Carga completa</Text>
            )}

            <Text style={styles.leadCount}>Leads Totales: {totalLeads}</Text>
            <Text style={styles.leadCount}>Leads Exitosos: {successFullLeads}</Text>
            <Text style={styles.leadCount}>Leads Fallidos: {failedLeads}</Text>

            <AnimatedCircularProgress
              size={120}
              width={15}
              fill={processedPercentage * 100}
              tintColor={ColorsNative.primary[100]}
              onAnimationComplete={() => console.log('onAnimationComplete')}
              backgroundColor={ColorsNative.text[100]}
              style={{ marginTop: 20 }}
            >
              {(fill) => <Text>{fill.toFixed(1)}%</Text>}
            </AnimatedCircularProgress>
          </Animated.View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F3F4F6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  progressText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#555',
  },
  progressContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  leadCount: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
});

const stylesChargingLeads = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerLoading: {
    paddingHorizontal: 20,
    width: '100%',
    paddingVertical: 30,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
  },
  uploadButton: {
    width: '100%',
    height: 60,
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    padding: 10,
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default ExcelLeads;
