import React, { FC } from 'react';
import { View, Image, StyleSheet } from 'react-native';

interface ThumbnailCropperProps {
  imageUrl: string;
  cropWidth: number;
  cropHeight: number;
}

const ThumbnailCropper: FC<ThumbnailCropperProps> = ({ imageUrl, cropWidth, cropHeight }) => {
  return (
    <View style={[styles.cropContainer, { width: cropWidth, height: cropHeight }]}>
      <Image 
        source={{ uri: imageUrl }} 
        style={[styles.thumbnailImage, { width: cropWidth * 1, height: cropHeight * 1 }]} 
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cropContainer: {
    overflow: 'hidden',    // Oculta las partes fuera de los límites del contenedor
    borderRadius: 10,      // Opcional: para esquinas redondeadas en el recorte
  },
  thumbnailImage: {
    position: 'absolute',  // Permite ajustar la posición dentro del contenedor
    top: -5,              // Ajusta el desplazamiento vertical para centrar el contenido deseado
    left: -5,             // Ajusta el desplazamiento horizontal para centrar el contenido deseado
  },
});

export default ThumbnailCropper;
