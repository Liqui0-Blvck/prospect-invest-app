import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import SearchInput from '@/components/SearchInput';
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors, ColorsNative } from '@/constants/Colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Swipeable } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch, useAppSelector } from '@/redux/store';
import { ADD_INTERACTION, deleteLead, fetchLeads } from '@/redux/slices/prospects/prospectSlice';
import { useNavigation } from '@react-navigation/native';
import { Link, useRouter } from 'expo-router';
import BackgroundStyle from '@/components/BackgroundStyle';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { ActivityIndicator, Checkbox } from 'react-native-paper';
import { Lead } from '@/types/Leads';
//@ts-ignore
import call from 'react-native-phone-call';
import CallConfirmationModal from '../(leads)/CallConfirmationModal';
import { generateUID } from '../(leads)/leadDetail';
import ModalF from '@/components/Modal';
import { Dropdown } from 'react-native-element-dropdown';
import { AntDesign } from '@expo/vector-icons';

const data = [
  { label: 'Interesado', value: 'interesado' },
  { label: 'No Interesado', value: 'no interesado' },
  { label: 'Esperando', value: 'esperando' },
  { label: 'Cerrado', value: 'cerrado' },
];
interface LeadToDelete {
  id: string | null;
  index: number | null;
}

const optionsLeads = [
  {
    title: 'Agregar Leads Excel',
    icon: 'microsoft-excel',
    color: 'green',
  },
  {
    title: 'Agregar Leads Manual',
    icon: 'file-document',
    color: 'blue',
  }
]

const getStatusColor = (estado: string) => {
  switch (estado) {
    case 'interesado':
      return ColorsNative.estados.interesado;
    case 'no interesado':
      return ColorsNative.estados.desinteresado;
    case 'esperando':
      return ColorsNative.estados.esperando;
    case 'cerrado':
      return ColorsNative.estados.cerrado;
    default:
      return 'white';
  }
};

const Leads = () => {


  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [isFocus, setIsFocus] = useState(false);

  const handleDropdownChange = (item: any) => {
    if (selectedValues.includes(item.value)) {
      // Si el valor ya está seleccionado, lo eliminamos
      setSelectedValues(selectedValues.filter((val) => val !== item.value));
    } else {
      // Si no está seleccionado, lo añadimos
      setSelectedValues([...selectedValues, item.value]);
    }
  };

  const renderLabel = () => {
    return (
     <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: 10,
        borderRadius: 10,
        backgroundColor: ColorsNative.text[100],
        marginVertical: 2
     }}>
      <Text style={{
          fontSize: 16,
          fontWeight: 'bold'
        }}>
          {selectedValues.length > 0 && `${selectedValues.length} filtros seleccionados`}
      </Text>

        {
          selectedValues.length > 0 && (
            <Pressable onPress={() => setSelectedValues([])}>
              <Text style={{ color: 'blue', marginLeft: 10 }}>Limpiar</Text>
            </Pressable>
          )
        }
     </View>
    );
  };

  
  
  
  


  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const filterBottomSheetRef = useRef<BottomSheet>(null);
  const filterSnapPoints = useMemo(() => ['1%', '40%'], []);

  const openFilterSheet = () => {
    setFilterVisible(true);
    filterBottomSheetRef.current?.expand();
  };
  
  const applyFilters = () => {
    filterBottomSheetRef.current?.close();
    setFilterVisible(false);
  
    dispatch(fetchLeads({ 
      search: currentSearch, 
      pageSize, 
      append: false,
      filters: selectedFilters.concat(selectedValues) // Combina filtros de checkboxes y dropdown
    })).unwrap();
  };
  
  
  const resetFilters = () => {
    setSelectedFilters([]);
    applyFilters();
  };
  


  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<LeadToDelete>({ id: null, index: null });


  // Hooks de navegación
  const router = useRouter();
  const navigator = useNavigation();
  
  
  // obtencion de informacion desde el store
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { leads, hasMore: hasMoreData } = useSelector((state: RootState) => state.lead)

  // Snap points para el BottomSheet
  const BottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['1%','25%', '30%'], []);
  const [showBottomSheet, setShowBottomSheet] = useState(false);


  const today = new Date();




  
  // Swipe ref para cada elemento de la lista
  const swipeableRefs = useRef<(Swipeable | null)[]>([]);

  const [isFocused, setIsFocused] = useState(false);


  // control de estados y lista de leads
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const pageSize = 15;


  // Estados para el modal de confirmacion
  const [modalVisible, setModalVisible] = useState(false);
  const [currentLead, setCurrentLead] = useState<Lead | null>(null)


  // Estado para la búsqueda actual
  const [currentSearch, setCurrentSearch] = useState('');


    // Ref para almacenar el timer del debounce
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

 // Cargar la primera página
  const loadFirstPage = async (searchValue?: string) => {
    try {
      setRefreshing(true);
      await dispatch(fetchLeads({ search: searchValue, pageSize, append: false })).unwrap();
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  const loadMoreLeads = async () => {
    if (loadingMore || !hasMoreData) return;

    try {
      setLoadingMore(true);
      await dispatch(fetchLeads({ search: currentSearch, pageSize, append: true })).unwrap();
    } catch (error) {
      console.error('Error loading more leads:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleCall = (lead: Lead) => {
    const args = {
      number: lead.numeroTelefono,
      prompt: false,
    };

    call(args).then(() => {
      setCurrentLead(lead); // Guardar el lead para registrar la interacción tras la confirmación
      setModalVisible(true); // Mostrar el modal después de la llamada
    }).catch(console.error);
  };

  // Efecto para cargar la primera página al cambiar la búsqueda
  useEffect(() => {
    loadFirstPage('');
  }, []);

  // Actualizar el estado `loading` según los leads y el estado de refresco
  useEffect(() => {
    if (leads.length === 0 && !refreshing) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [leads, refreshing]);

  
  

  useEffect(() => {
    navigator.setOptions({
      headerShown: false
    })
  }, [navigator])



  
  const renderRightActions = (id: string, index: number) => (
    <Pressable
      style={styles.actionButtonDelete}
      onPress={() => {
        setLeadToDelete({ id: id, index: index });
        setModalDeleteVisible(true)
      }}
    >
      <Text style={styles.actionText}>Eliminar</Text>
    </Pressable>
  );


  console.log(leadToDelete)


  const renderLeftActions = (index: number) => (
    <Pressable
      style={styles.actionButton}
      onPress={() => {
        handleCall(leads[index])
        swipeableRefs.current[index]?.close(); // Cierra Swipeable
      }}
    >
      <Text style={styles.actionText}>Llamar</Text>
    </Pressable>
  );

  const handleDeleteConfirmation = () => {
    const { id, index } = leadToDelete;

    console.log(id, index)
    if (id && index !== null) {
      dispatch(deleteLead(id)); // Despacha la acción de eliminar
      if (swipeableRefs.current[index]) {
        swipeableRefs.current[index].close(); // Cierra Swipeable
      }
      setLeadToDelete({ id: null, index: null }); // Reinicia el estado
      setModalDeleteVisible(false); // Cierra el modal
    }
  };




  const handleSheetChanges = useCallback((index: number) => {
    if (index === 0) {
      setShowBottomSheet(false);
    }
  }, []);


  // Función para manejar el cambio de texto en el SearchInput con debounce
  const handleSearch = useCallback((searchValue: string) => {
    // Actualizar el estado de currentSearch
    setCurrentSearch(searchValue);

    // Limpiar el timer anterior si existe
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Iniciar un nuevo timer
    debounceTimer.current = setTimeout(() => {
      loadFirstPage(searchValue);
    }, 500); // Debounce de 500 ms
  }, []);

  // Limpiar el timer al desmontar el componente
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const handleConfirm = (result: string) => {
    if (currentLead) {
      const uid = generateUID();
      if (result === 'successful') {
        console.log('Llamada completada correctamente');
        dispatch(ADD_INTERACTION({
          uid: uid,
          leadID: currentLead?.id!,
          userID: user?.uid!,
          fecha: today.toISOString(),
          tipo: 'llamada',
          notas: 'Llamada realizada exitosamente'
        }));
      } else {
        console.log('Llamada no completada');
        dispatch(ADD_INTERACTION({
          uid: uid,
          leadID: currentLead?.id!,
          userID: user?.uid!,
          fecha: today.toISOString(),
          tipo: 'llamada fallida',
          notas: 'El usuario no completó la llamada'
        }));
      }
      setModalVisible(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundStyle 
        styleOptions={{
          backgroundDesign: {
            height: '49%',
            paddingVertical: 10,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            zIndex: -3
          }
        }}
        children={
          <View style={styles.searchAndButtonContainer}>
            <SearchInput
              isFocused={isFocused}
              setIsFocused={setIsFocused}
              onSearch={handleSearch}
            />

            <Pressable style={styles.newLeadsButton} onPress={openFilterSheet}>
                <TabBarIcon name="filter" color="white" />
            </Pressable>


           <View style={styles.newLeadsContainer}>
             <Pressable onPress={() => setShowBottomSheet(true)} style={[styles.newLeadsButton, { backgroundColor: ColorsNative.primary[100]}]}>
               <TabBarIcon name="add" color="white" />
             </Pressable>
           </View>
         </View>
        }
        />


        {
          loading && leads.length === 0 ? (
            <View style={styles.leadsCard}>
              <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                textAlign: 'center',
                marginVertical: 5
              }}>No hay leads</Text>
            </View>
          )
          : (
            <FlatList
                data={leads}
                contentContainerStyle={{ paddingBottom: 120 }}
                style={[styles.leadsCard]}
                keyExtractor={(item) => item.id!}
                refreshing={refreshing}
                onRefresh={loadFirstPage}
                ListFooterComponent={
                  loadingMore && hasMoreData 
                  ? <ActivityIndicator size="small" color="#0000ff" /> 
                  : <Text style={{ textAlign: 'center', padding: 10 }}
                      onPress={() => 
                        loadMoreLeads()
                      }>
                      {hasMoreData ? 'Cargar más leads' : 'No hay más leads'}
                    </Text> 
                }

                renderItem={({ item, index }) => {
                  // Asegurarse de que haya una referencia para cada elemento
                  if (!swipeableRefs.current[index]) {
                    swipeableRefs.current[index] = null;
                  }

                  return (
                    <Swipeable
                      key={item.id}
                      ref={(ref) => (swipeableRefs.current[index] = ref)}
                      renderLeftActions={() => renderLeftActions(index)}
                      renderRightActions={() => renderRightActions(item?.id!, index)}
                    >
                      <View style={styles.interactionItem}>
                        <Link href={{ pathname: '/(leads)/leadDetail', params: { id: item.id, nombre: item.nombre, email: item.email }}}  asChild>
                          <Pressable>
                            <View style={styles.cardHeader}>
                              <Text style={{ fontSize: 17, fontWeight: 'bold', paddingVertical: 2,}}>{item.nombre}</Text>
                              <View style={{
                                borderRadius: 10,
                                paddingHorizontal: 5,
                                paddingVertical: 2,
                                width: 95,
                                backgroundColor: getStatusColor(item.estado!)
                              }}>
                                <Text style={{ fontSize: 13, color: 'white', textAlign: 'center', fontWeight: 700 }}>{item.estado}</Text>
                              </View>
                            </View>
                            <Text style={{ fontSize: 14 }}>{item.email}</Text>
                            <Text style={{ fontSize: 15, marginTop: 15 }}>{item.numeroTelefono}</Text>
                          </Pressable>
                        </Link>
                      </View>
                    </Swipeable>
                  );
                }}
              />
          )
        }
        {showBottomSheet && (
        <BottomSheet
          ref={BottomSheetRef}
          onChange={handleSheetChanges}
          index={2}
          snapPoints={snapPoints}
        >
          <BottomSheetView style={styles.contentContainerSheet}>
            <View style={styles.contentSheet}>
              <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                textAlign: 'center',
                marginVertical: 5
              }}>Agregar Prospectos</Text>
              <FlatList
                data={optionsLeads}
                keyExtractor={(item) => item.title}
                renderItem={({ item }) => (
                  <Pressable
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderWidth: 1,
                      borderColor: ColorsNative.text[100],
                      width: '100%',
                      padding: 10,
                      borderRadius: 10,
                      backgroundColor: ColorsNative.text[100],
                      marginVertical: 2
                    }}
                    onPress={() => {
                      setShowBottomSheet(false);
                      if (item.title === 'Agregar Leads Excel') {
                        router.push('/(leads)/ExcelLeads');
                      } else {
                        router.push('/(leads)/AddLead');
                      }
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <MaterialCommunityIcons
                        //@ts-ignore
                        name={item.icon}
                        size={24}
                        color={item.color}
                      />
                      <Text style={{ marginLeft: 10 }}>{item.title}</Text>
                    </View>
                  </Pressable>
                )}

              />
            </View>
          </BottomSheetView>
        </BottomSheet>
      )}

      <CallConfirmationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirm}
      />

      <ModalF
        visible={modalDeleteVisible}
        animation='fade'
        onClose={() => setModalDeleteVisible(false)}
      >
        <View style={modalStyle.modalBackground}>
          <View style={modalStyle.modalContainer}>
            <View style={modalStyle.modalContent}>
              <Text style={modalStyle.title}>¿Estás seguro de eliminar?</Text>
              <View style={modalStyle.containerButtons}>
                <Pressable
                  onPress={handleDeleteConfirmation}
                  style={[
                    modalStyle.buttons,
                    { backgroundColor: ColorsNative.primary[100] },
                  ]}
                >
                  <Text style={modalStyle.buttonText}>Sí</Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    swipeableRefs.current[leadToDelete?.index!]?.close();
                    setModalDeleteVisible(false)
                  }}
                  style={[
                    modalStyle.buttons,
                    { backgroundColor: ColorsNative.options.red },
                  ]}
                >
                  <Text style={modalStyle.buttonText}>No</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </ModalF>

      {
  filterVisible && (
    <BottomSheet
      ref={filterBottomSheetRef}
      onChange={handleSheetChanges}
      index={1}
      snapPoints={filterSnapPoints}
      enablePanDownToClose={true}
    >
      <BottomSheetView style={styles.filterContainer}>
        <Text style={styles.filterTitle}>Filtrar Leads</Text>
        
        <View style={styles.filterOption}>
            {renderLabel()}
          <Dropdown
            style={[stylesSelect.dropdown, isFocus && { borderColor: 'blue' }]}
            placeholderStyle={stylesSelect.placeholderStyle}
            selectedTextStyle={stylesSelect.selectedTextStyle}
            inputSearchStyle={stylesSelect.inputSearchStyle}
            iconStyle={stylesSelect.iconStyle}
            data={data}
            search
            maxHeight={200}
            
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? 'Selecciona filtros' : 'Filtros seleccionados'}
            searchPlaceholder="Buscar..."
            value={selectedValues}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={handleDropdownChange}
            renderLeftIcon={() => (
              <AntDesign
                style={stylesSelect.icon}
                color={isFocus ? 'blue' : 'black'}
                name="Safety"
                size={20}
              />
            )}
            // Añadir un render para mostrar las selecciones
            renderItem={(item) => (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Checkbox
                  status={selectedValues.includes(item.value) ? 'checked' : 'unchecked'}
                  onPress={() => handleDropdownChange(item)}
                />
                <Text style={{ marginLeft: 10 }}>{item.label}</Text>
              </View>
            )}
          />
      </View>

        <View style={styles.filterButtons}>
          <Pressable style={styles.applyButton} onPress={applyFilters}>
            <Text style={styles.applyButtonText}>Aplicar</Text>
          </Pressable>

          <Pressable style={styles.resetButton} onPress={resetFilters}>
            <Text style={styles.resetButtonText}>Reiniciar</Text>
          </Pressable>
        </View>
      </BottomSheetView>
    </BottomSheet>
  )
  }

    </SafeAreaView>
      
  );
};

const modalStyle = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Fondo semi-transparente
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 20,
  },
  modalContent: {
    // Tus estilos para el contenido del modal
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  containerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttons: {
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
})

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: ColorsNative.text[100],
  },
  searchAndButtonContainer: {
    position: 'relative',
    top: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
  },
  newLeadsContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newLeadsButton: {
    backgroundColor: Colors.light.tint,
    borderRadius: 10,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  circularButtonsContainer: {
    position: 'absolute',
    flexDirection: 'column',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'space-around',
    top: 6,
    right: 0,
    zIndex: 1,
  },
  circularButton: {
    backgroundColor: ColorsNative.primary[100],
    borderRadius: 10,
    width: 45,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leadsCard: {
    position: 'relative',
    top: 110,
    height: '100%',
    marginHorizontal: 10,
    backgroundColor: ColorsNative.text[100],
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    zIndex: -2,
  },
  scrollViewContent: {
    paddingBottom: 120,
  },
  interactionItem: {
    backgroundColor: ColorsNative.text[100],
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
    borderWidth: .2,
    borderColor: 'black'
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    height: '89%',
    borderRadius: 10,
  },
  actionButtonDelete: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    height: '89%',
    borderRadius: 10,
  },
  actionText: {
    color: 'white',
    fontWeight: 'bold',
  },
  contentContainerSheet: {
    flex: 1,
    padding: 5
  },
  contentSheet: {
    width: '100%',
    flex: 1,
  },

  filterContainer: {
    flex: 1,
    padding: 20,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  filterOption: {
    flexDirection: 'column-reverse',
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
  },
  filterLabel: {
    marginLeft: 10,
    fontSize: 16,
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  applyButton: {
    backgroundColor: ColorsNative.primary[100],
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  applyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: ColorsNative.options.red,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  resetButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

const stylesSelect = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
    width: '100%',
  },
  dropdown: {
    width: '100%',
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});


export default Leads;
