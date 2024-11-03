import React, { FC } from 'react';
import { Modal, StyleSheet, View } from 'react-native';

interface ModalProps {
  children: React.ReactNode;
  visible: boolean;
  onClose: () => void;
  onConfirm?: (result: string) => void;
  animation: 'slide' | 'fade' | 'none';
}

const ModalF: FC<ModalProps> = ({ children, visible, onClose, animation }) => {
  return (
    <Modal
      animationType={animation}
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
  >
    {children}
  </Modal>
  );
}

const styles = StyleSheet.create({})

export default ModalF;
