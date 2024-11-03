// screens/LeadDetail.tsx
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Link, useGlobalSearchParams, useNavigation} from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';
import { interacciones } from '@/mocks/leads';
import Entypo from '@expo/vector-icons/Entypo';
import {Linking} from 'react-native'
import { Lead } from '@/types/Leads';
//@ts-ignore
import call from 'react-native-phone-call';
import { ADD_INTERACTION } from '@/redux/slices/prospects/prospectSlice';
import CallConfirmationModal from './CallConfirmationModal';
import { ColorsNative } from '@/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import BottomSheet from '@/components/BottomSheet';
import LeadNotes from '@/components/leadsComponents/leadNotes';
import NoteDetailModal from './NoteDetailModal';
import { Notes } from '@/types/Notes';


export const generateUID = () => {
  return 'uid-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
};


const { height } = Dimensions.get('window');

interface LeadDetailProps {
  route: {
    params: {
      id: string;
    };
  };
}

const LeadDetail: React.FC<LeadDetailProps> = ({ route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentLead, setCurrentLead] = useState<Lead | null>(null)
  const { id } = useGlobalSearchParams()
  const { leads, interacciones, notas } = useSelector((state: RootState) => state.lead);
  const { user } = useSelector((state: RootState) => state.auth);
  const lead = leads.find((lead) => lead.id === id);
  const today = new Date();


  const [buttonModal, setButtonModal] = useState(false)
  const [noteModal, setNoteModal] = useState(false)

  const [noteSelected, setNoteSelected] = useState<Notes | null>(null)

  const dispatch = useDispatch();

  const navigation = useNavigation()

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




  console.log("currentLead", id)

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
     <ScrollView style={styles.container_safe} contentContainerStyle={{ paddingBottom: 50 }}>
      <View style={styles.heroSection}>
          <Text style={styles.title}>{lead?.nombre}</Text>
          <Text>Email: {lead?.email}</Text>
          <Text>Teléfono: {lead?.numeroTelefono}</Text>
          <Text>Estado: {lead?.estado}</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.buttonsContainer}>
            <Pressable onPress={() => {
              handleCall(lead!);
              dispatch(ADD_INTERACTION({
                uid: generateUID(),
                leadID: currentLead?.id!,
                userID: user?.uid!,
                fecha: today.toISOString(),
                tipo: 'llamada fallida',
                notas: 'El usuario no completó la llamada'
              }));
            }}>
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

        <View style={styles.interationsContainer}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Historial de interacciones</Text>
          <ScrollView nestedScrollEnabled={true} style={styles.interactionCard}>
            {
              interacciones.filter((inter) => inter.leadID === id).map(({ fecha, tipo, notas }, index) => (
                <View key={index} style={styles.interactionItem}>
                  <Text style={styles.interactionTitle}>
                    {fecha.toString()} - {tipo}
                  </Text>
                  <Text style={styles.interactionDescription}>
                    {notas}
                  </Text>
                </View>
              ))
            }
          </ScrollView>
        </View>

        <View style={styles.notesContainer}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Notas</Text>
          <ScrollView nestedScrollEnabled={true} style={styles.notesCard} contentContainerStyle={{ paddingBottom: 20}}>
            {
              notas.filter((inter) => inter.leadId === id).map(({ title, content, date, leadId  }, index) => (
                
                <View key={index}>
                  <Pressable style={styles.notesItem} onPress={() => {
                    setNoteSelected({ title, content, date, leadId })
                    setNoteModal(true)
                  }}>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                      <Text style={{ fontSize: 20, fontWeight: 'bold'}}>
                        {title}
                      </Text>

                      <Text style={styles.notesTitle}>
                        {date?.toString()}
                      </Text>
                    </View>
                    <Text style={styles.notesDescription}>
                      {content}
                    </Text>
                  </Pressable>


                </View>
              ))
            }
          </ScrollView>
        </View>
     </ScrollView>
     <CallConfirmationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirm}
      />

      {/* <BottomSheet
        isOpen={buttonModal}
        setIsOpen={setButtonModal}
        >
          <LeadNotes setIsOpen={setButtonModal}/>
      </BottomSheet> */}

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
    height: height / 3,
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
  interactionItem: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'column',
  },
  interactionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  interactionDescription: {
    fontSize: 12,
    color: '#555',
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
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
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
