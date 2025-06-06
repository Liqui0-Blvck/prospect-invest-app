import BackgroundStyle from '@/components/BackgroundStyle'
import { ColorsNative } from '@/constants/Colors'
import { interacciones, stats } from '@/mocks/leads'
import { RootState, useAppSelector } from '@/redux/store'
import React from 'react'
import { Dimensions, SafeAreaView, StyleSheet, Text, View, ScrollView, Platform, StatusBar } from 'react-native'

const { width, height } = Dimensions.get('window')

const Home = () => {
  const { user } = useAppSelector((state: RootState) => state.auth)
  
  return (
    <SafeAreaView style={styles.containerSafe}>
      <BackgroundStyle styleOptions={{
        backgroundDesign: {
          height: height * 0.47,
          paddingVertical: 10,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }
      }} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Invest Lead</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.welcomeTitleContainer}>
          <Text style={styles.welcomeTitle}>Bienvenid@ {user?.displayName}</Text>
        </View>

        <View style={styles.containerStats}>
          {stats.map(({ title, value }) => (
            <View key={title} style={styles.statsBox}>
              <Text style={styles.titleStats}>{title}</Text>
              <View style={styles.containerValue}>
                <Text style={styles.statsValue}>{value}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.interactionsContainer}>
          <Text style={styles.interactionsTitle}>Historial de interacciones</Text>
          <ScrollView nestedScrollEnabled={true} style={styles.interactionCard}>
            {interacciones.map(({ date, title, description }, index) => (
              <View key={index} style={styles.interactionItem}>
                <Text style={styles.interactionTitle}>
                  {date} - {title}
                </Text>
                <Text style={styles.interactionDescription}>
                  {description}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  containerSafe: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Ajuste de altura en Android
  },
  header: {
    height: height * 0.060, // Dinámico según la altura del dispositivo
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: ColorsNative.text[100],
    textAlign: 'center',
  },
  scrollContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
    marginHorizontal: 10,
    flexGrow: 1, 
    backgroundColor: ColorsNative.text[100],
    borderRadius: 10,
  },
  welcomeTitleContainer: {
    marginVertical: 10,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  containerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    paddingVertical: 15,
    borderRadius: 10,
  },
  statsBox: {
    alignItems: 'center',
    padding: 10,
    width: '32%', // Proporcional para adaptarse a diferentes pantallas
    height: 'auto', // Adaptar según el alto de la pantalla
    backgroundColor: '#D9D9D9',
    borderRadius: 10,
  },
  titleStats: {
    fontWeight: 'bold',
  },
  containerValue: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  statsValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  interactionsContainer: {
    marginTop: 20,
    flex: 1, // Ocupar el espacio restante
  },
  interactionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  interactionCard: {
    width: '100%',
    backgroundColor: '#F3F3F3',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  interactionItem: {
    backgroundColor: ColorsNative.text[100],
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  interactionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  interactionDescription: {
    fontSize: 12,
    color: '#555',
  },
})

export default Home
