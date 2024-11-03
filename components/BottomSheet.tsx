import React, { Dispatch, FC, SetStateAction, useCallback, useEffect, useState } from 'react';
import { Dimensions, Keyboard, ScrollView, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, runOnJS } from 'react-native-reanimated';

interface BottomSheetProps {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const MAX_TRANSLATION_Y = -SCREEN_HEIGHT + 50; // Posición máxima (abierta)
const MID_TRANSLATION_Y = -SCREEN_HEIGHT / 1.5;  // Posición intermedia (medio abierta)
const CLOSED_TRANSLATION_Y = 0;               // Posición cerrada (inicial)

const BottomSheet: FC<BottomSheetProps> = ({ children, isOpen, setIsOpen }) => {
  const translationY = useSharedValue(CLOSED_TRANSLATION_Y);
  const context = useSharedValue({ y: 0 });
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  
  // Función para desplazarse a la posición deseada
  const scrollTo = useCallback((destination: number) => {
    'worklet';
    translationY.value = withSpring(destination, { damping: 50 });
  }, []);

  const closeBottomSheet = useCallback(() => {
    'worklet';
    scrollTo(CLOSED_TRANSLATION_Y);
    runOnJS(setIsOpen)(false);
  }, [scrollTo, setIsOpen]);

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translationY.value };
    })
    .onUpdate((event) => {
      translationY.value = Math.max(event.translationY + context.value.y, MAX_TRANSLATION_Y);
    })
    .onEnd(() => {
      if (translationY.value > -SCREEN_HEIGHT / 3) { // Cambiado a un tercio
        closeBottomSheet();
      } else {
        scrollTo(MID_TRANSLATION_Y);
      }
    });

  useEffect(() => {
    if (isOpen) {
      scrollTo(MID_TRANSLATION_Y);
    } else {
      scrollTo(CLOSED_TRANSLATION_Y);
    }
  }, [isOpen, scrollTo]);

  useEffect(() => {
    if (translationY.value === CLOSED_TRANSLATION_Y) {
      setIsOpen(false);
    }
  }, [translationY.value]);

  // Listener para detectar apertura y cierre del teclado
  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
      scrollTo(MAX_TRANSLATION_Y); // Ajustar el BottomSheet cuando el teclado aparece
    });

    const keyboardHideListener = Keyboard.addListener('keyboardDidHide', () => {
      if (translationY.value > MAX_TRANSLATION_Y) {
        scrollTo(MID_TRANSLATION_Y); // Devolver a la posición media cuando el teclado se oculta
      }
    });

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, [scrollTo]);


  const rBottomSheetStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translationY.value }],
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.container, rBottomSheetStyles]}>
        <View style={styles.line}></View>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled" // Permitir que los taps de teclado se manejen
        >
          {children}
        </ScrollView>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    height: SCREEN_HEIGHT,
    width: '100%',
    backgroundColor: 'black',
    position: 'absolute',
    top: SCREEN_HEIGHT,
    borderRadius: 25,
  },
  line: {
    width: 40,
    height: 5,
    backgroundColor: 'gray',
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 10,
  },
  scrollContainer: {
    paddingBottom: 50,
    paddingHorizontal: 20,
  },
});

export default BottomSheet;
