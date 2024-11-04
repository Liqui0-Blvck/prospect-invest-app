// screens/LeadDetail.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch, useAppSelector } from '@/redux/store';
import { Link, useGlobalSearchParams, useNavigation} from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';
import Entypo from '@expo/vector-icons/Entypo';
import { Lead } from '@/types/Leads';
//@ts-ignore
import call from 'react-native-phone-call';
import { getLead, getNotesByLead } from '@/redux/slices/prospects/prospectSlice';
import CallConfirmationModal from './CallConfirmationModal';
import { ColorsNative } from '@/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import NoteDetailModal from './NoteDetailModal';
import { Notes } from '@/types/Notes';
import { addInteraction, getInteractionsLead } from '@/redux/slices/interactions/interactionSlice';
import InteractionList from '@/components/leadsComponents/Interaction';
import NotesList from '@/components/leadsComponents/leadNotes';
import SlideBarButtons from '@/components/leadsComponents/SlideBarButtons';
import { OptionType } from '@/types/OptionType';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';


const buttons = [
  {
    title: 'General',
    id: 'general',
  },
  {
    title: 'Inversiones',
    id: 'inversiones',
  },
  {
    title: 'Estrategias',
    id: 'estrategias',
  },
];


export const generateUID = () => {
  return 'uid-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
};


const { height } = Dimensions.get('window');

const LeadDetail = () => {
  // Estados de opciones
  const [selectedOption, setSelectedOption] = useState<OptionType>(OptionType.General);
  const fadeAnim = useSharedValue(0);
  const translateYAnim = useSharedValue(20);

  const dispatch = useAppDispatch();
  const navigation = useNavigation()


  // Obtener el id del lead
  const { id } = useGlobalSearchParams()

  // Obtener al prospecto
  const { lead } = useAppSelector((state: RootState) => state.lead)

  useEffect(() => {
    if (id){
      dispatch(getLead(id));
    }
  }, [id])

  console.log("que chucha soy", lead)


  const { interactions, loading: loadingInteracion } = useSelector((state: RootState) => state.interactions);
  const { leads, notes, loading: loadingNotes } = useSelector((state: RootState) => state.lead);
  const { user } = useSelector((state: RootState) => state.auth);
  // const lead = leads.find((lead) => lead.id === id);



  // Estados de llamada
  const [modalVisible, setModalVisible] = useState(false);

  // Estados de notas
  const [noteModal, setNoteModal] = useState(false)
  const [noteSelected, setNoteSelected] = useState<Notes | null>(null)






  const handleSelectOption = (option: OptionType) => {
    setSelectedOption(option);
  };





  // Animaciones
  useEffect(() => {
    if (selectedOption === OptionType.General) {
      fadeAnim.value = withTiming(1, { duration: 400 });
      translateYAnim.value = withTiming(0, { duration: 400 });
    } else {
      fadeAnim.value = withTiming(0, { duration: 400 });
      translateYAnim.value = withTiming(20, { duration: 400 });
    }
  }, [selectedOption]);


  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: translateYAnim.value }],
  }));




  // Obtener interacciones y notas
  useEffect(() => {
    dispatch(getInteractionsLead({ userID: user?.uid!, leadID: id }));
  }, [])

  useEffect(() => {
    dispatch(getNotesByLead({ leadID: id, userID: user?.uid! }));
  }, [])


  // Configuración de la barra de navegación
  useEffect(() => {
    navigation.setOptions({ 
      headerShown: true,
      title: 'Información Prospecto',
      headerStyle: {
        backgroundColor: ColorsNative.background[200],
        color: 'white',
      },
      headerTintColor: 'white',
      
    });
  }, [navigation]);



  // Función para realizar llamada
  const handleCall = (lead: Lead) => {
    const args = {
      number: lead.numeroTelefono,
      prompt: false,
    };

    call(args).then(() => {
      setModalVisible(true); // Mostrar el modal después de la llamada
    }).catch(console.error);
  };





  // Función para confirmar la llamada
  const handleConfirm = (result: string) => {
    if (lead) {
      const today = new Date();
      const uid = generateUID();
      if (result === 'successful') {
        console.log('Llamada completada correctamente');
        dispatch(addInteraction({
          uid: uid,
          leadID: lead?.id!,
          userID: user?.uid!,
          fecha: today.toISOString(),
          tipo: 'llamada',
          notas: 'Llamada realizada exitosamente'
        }));
      } else {
        console.log('Llamada no completada');
        dispatch(addInteraction({
          uid: uid,
          leadID: lead?.id!,
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
     <ScrollView style={styles.container_safe} contentContainerStyle={{ paddingBottom: 50 }}>
      <View style={styles.heroSection}>
          <Text style={styles.title}>{lead?.nombre}</Text>
          <Text>Email: {lead?.email}</Text>
          <Text>Teléfono: {lead?.numeroTelefono}</Text>
          <Text>Estado: {lead?.estado}</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.buttonsContainer}>
            <Pressable onPress={() => {handleCall(lead!)}}>
              <View style={[styles.buttons, { backgroundColor: '#0a8967' }]}>
                <Entypo name="phone" size={30} color="white" />
              </View>
            </Pressable>

            <Link href={'/(leads)/MailLead'} asChild>
              <Pressable>
                <View style={[styles.buttons, { backgroundColor: '#ed2222' }]}>
                  <Entypo name="mail" size={30} color="white" />
                </View>
              </Pressable>
            </Link>

            <Link href={{ pathname: '/(leads)/CalendarAgenda', params: { id } }} asChild>
              <Pressable>
                <View style={[styles.buttons, { backgroundColor: '#2c3e50' }]}>
                  <Entypo name="calendar" size={30} color="white" />
                </View>
              </Pressable>
            </Link>

            <Link href={{ pathname: '/(leads)/NotesForm', params: { id }}} asChild>
              <Pressable>
                <View style={[styles.buttons, { backgroundColor: ColorsNative.primary[200] }]}>
                  <FontAwesome name="sticky-note" size={30} color="white" />
                </View>
              </Pressable>
            </Link>
          </View>
        </ScrollView>


        <SlideBarButtons selectedOption={selectedOption} onSelect={handleSelectOption} />

        {selectedOption === OptionType.General && (
          <>
            <Animated.View style={[styles.interationsContainer, animatedStyle]}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Historial de interacciones</Text>
              <ScrollView nestedScrollEnabled={true} style={styles.interactionCard}>
                <InteractionList interactions={interactions} id={id} loadingInteracion={loadingInteracion} />
              </ScrollView>
            </Animated.View>

            <Animated.View style={[styles.notesContainer, animatedStyle]}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Notas</Text>
              <ScrollView nestedScrollEnabled={true} style={styles.notesCard} contentContainerStyle={{ paddingBottom: 20}}>
                <NotesList notes={notes} leadID={id} setNoteSelected={setNoteSelected} setNoteModal={setNoteModal} userID={user?.uid!} loading={loadingNotes} />
              </ScrollView>
            </Animated.View>
          </>
        )}
     </ScrollView>
      
     <CallConfirmationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirm}
      />

      <NoteDetailModal
        visible={noteModal}
        onClose={() => setNoteModal(false)}
        title={noteSelected?.title!}
        description={noteSelected?.content!}
      />


    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container_safe: {
    height: '100%',
    padding: 20,
    backgroundColor: 'white',
    gap: 10,
  },
  heroSection: {
    display: 'flex',
    justifyContent: 'center',
    gap: 2,
    alignItems: 'center',

  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    padding: 5
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 5
  },
  interationsContainer: {
    width: '100%',
    height: height / 2.8,
    gap: 10,
    marginTop: 20,
  },
  interactionCard: {
    width: '100%',
    backgroundColor: '#F3F3F3',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  notesContainer: {
    width: '100%',
    height: height / 2,
    gap: 10,
    marginTop: 20,
  },
  notesCard: {
    width: '100%',
    backgroundColor: '#F3F3F3',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  notesItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: '#E0E0E0', // Borde sutil
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3, // Para Android
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333', // Color del texto más oscuro
    marginBottom: 5,
  },
  notesDescription: {
    fontSize: 12,
    color: '#666', // Color gris más oscuro
  },
})



export default LeadDetail;
