// SlideBarButtons.tsx
import React from 'react';
import { Pressable, StyleSheet, Text, ScrollView } from 'react-native';
import { OptionType } from '@/types/OptionType';
import { ColorsNative } from '@/constants/Colors';

interface SlideBarButtonsProps {
  selectedOption: OptionType;
  onSelect: (option: OptionType) => void;
}

const buttons = [
  { title: 'General', id: OptionType.General },
  { title: 'Inversiones', id: OptionType.Inversiones },
  { title: 'Estrategias', id: OptionType.Estrategias },
];

const SlideBarButtons: React.FC<SlideBarButtonsProps> = ({ selectedOption, onSelect }) => {
  return (
    <ScrollView
      style={styles.container}
      horizontal
      contentContainerStyle={{ alignItems: 'center' }}
      showsHorizontalScrollIndicator={false}
    >
      {buttons.map((button) => (
        <Pressable
          key={button.id}
          style={[
            styles.button,
            selectedOption === button.id && styles.buttonActive,
          ]}
          onPress={() => onSelect(button.id)}
        >
          <Text
            style={[
              styles.buttonText,
              selectedOption === button.id && styles.buttonTextActive,
            ]}
          >
            {button.title}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  button: {
    backgroundColor: ColorsNative.background[200],
    paddingVertical: 12,
    marginHorizontal: 8,
    borderRadius: 8,
    width: 120,
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: ColorsNative.primary[100],
  },
  buttonText: {
    color: ColorsNative.text[300],
    fontSize: 16,
  },
  buttonTextActive: {
    color: ColorsNative.text[100],
    fontWeight: 'bold',
  },
});

export default SlideBarButtons;
