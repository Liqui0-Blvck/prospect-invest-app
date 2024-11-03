import React, { FC } from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity } from 'react-native';

interface NoteDetailModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  description: string;
}

const NoteDetailModal: FC<NoteDetailModalProps> = ({ visible, onClose, title, description }) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose} // Android back button
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Detalles de la Nota</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>Cerrar</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.content}>
            <Text style={styles.noteTitle}>{title}</Text>
            <Text style={styles.noteDescription}>{description}</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    fontSize: 16,
    color: '#FF3D3D', // Color del botón de cerrar
  },
  content: {
    marginTop: 10,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  noteDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default NoteDetailModal;
