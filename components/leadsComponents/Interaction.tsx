import { Interaction } from '@/types/Interacciones';
import React, { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SkeletonCard = () => {
  return (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonTitle} />
      <View style={styles.skeletonDescription} />
    </View>
  );
};

interface InteractionProps {
  interactions: Interaction[];
  id: string | string[];
  loadingInteracion: boolean;
}



const InteractionList: FC<InteractionProps> = ({ interactions, id, loadingInteracion }) => {
  if (loadingInteracion) {
    return (
      <>
        {Array(3).fill(0).map((_, index) => (
          <View key={index} style={styles.interactionItem}>
            <SkeletonCard />
          </View>
        ))}
      </>
    );
  }

  return (
    <>
      {
      interactions
      .filter((inter) => inter.leadID === id)
      .map(({ fecha, tipo, notas }, index) => (
        <View key={index} style={styles.interactionItem}>
          <Text style={styles.interactionTitle}>
            {fecha.toLocaleString()} - {tipo}
          </Text>
          <Text style={styles.interactionDescription}>
            {notas}
          </Text>
        </View>
        ))
      }
    </>
  );
};

const styles = StyleSheet.create({
  interactionCard: {
    width: '100%',
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

  // Estilos para el "skeleton"
  skeletonCard: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
  },
  skeletonTitle: {
    width: '50%',
    height: 20,
    backgroundColor: '#ccc',
    borderRadius: 4,
    marginBottom: 5,
  },
  skeletonDescription: {
    width: '80%',
    height: 15,
    backgroundColor: '#ccc',
    borderRadius: 4,
  },
});

export default InteractionList;
