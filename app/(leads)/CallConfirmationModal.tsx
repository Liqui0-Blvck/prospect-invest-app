import React, { useState } from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';

interface CallConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (result: string) => void;
}

const CallConfirmationModal: React.FC<CallConfirmationModalProps> = ({ visible, onClose, onConfirm }) => {
  const [callResult, setCallResult] = useState('');

  const handleConfirm = (result: string) => {
    setCallResult(result);
    onConfirm(result);  // Llamada completada con resultado
    onClose();  // Cerrar el modal
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          
          <Text style={styles.subtitle}>¿Se completó la llamada?</Text>

          <Pressable style={styles.button} onPress={() => handleConfirm('successful')}>
            <Text style={styles.buttonText}>Sí, se completó</Text>
          </Pressable>

          <Pressable style={styles.button} onPress={() => handleConfirm('failed')}>
            <Text style={styles.buttonText}>No, no se completó</Text>
          </Pressable>

          <Pressable style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 10,
    paddingVertical: 10,
  },
  cancelButtonText: {
    color: '#FF0000',
    fontSize: 16,
  },
});

export default CallConfirmationModal;
