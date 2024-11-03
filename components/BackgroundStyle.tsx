import { ColorsNative } from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { FC, ReactNode } from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle, StatusBar } from 'react-native';

interface BackgroundStyleProps {
  title?: string;
  icons?: ReactNode;
  styleOptions?: {
    backgroundDesign?: ViewStyle;
    headerText?: TextStyle;
    headerContainer?: ViewStyle;
  };
  children?: ReactNode;
}

const BackgroundStyle: FC<BackgroundStyleProps> = ({ title, icons, styleOptions, children }) => {
  return (
    <>
      <StatusBar
        barStyle="light-content"  // Puedes usar 'dark-content' o 'light-content'
      />
      <View style={[styles.backgroundDesign, styleOptions?.backgroundDesign]}>
      {
        title && icons 
        ? (
          <View style={[styles.headerContainer, styleOptions?.headerContainer]}>
            {icons}
            <Text style={[styles.headerText, styleOptions?.headerText]}>{title}</Text>
          </View>
          )
        : null
      }
      {children}
      </View>
    </>
    
  );
}

const styles = StyleSheet.create({
  backgroundDesign: {
    position: 'absolute',
    width: '100%',
    height: '50%',
    paddingVertical: 70,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    top: 0,
    left: 0,
    zIndex: -1,
    backgroundColor: ColorsNative.background[200],
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  headerText: {
    color: ColorsNative.text[200],
    fontSize: 25,
    fontWeight: 'bold',
  },
});

export default BackgroundStyle;
