// SearchInput.tsx
import React, { FC, useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Colors, ColorsNative } from '@/constants/Colors';

interface SearchInputProps {
  isFocused: boolean;
  setIsFocused: React.Dispatch<React.SetStateAction<boolean>>;
  onSearch: (searchValue: string) => void;
  placeholder?: string; // Opcional: permite personalizar el placeholder
}

const SearchInput: FC<SearchInputProps> = ({
  isFocused,
  setIsFocused,
  onSearch,
  placeholder = 'Buscar...',
}) => {
  const [searchValue, setSearchValue] = useState('');

  const handleChangeText = (text: string) => {
    setSearchValue(text);
    onSearch(text); // Llamamos a onSearch cada vez que cambia el texto
  };

  return (
    <View style={[styles.container]}>
      <View style={[styles.inputContainer, { width: '100%' }]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          onChangeText={handleChangeText}
          onBlur={() => {
            setIsFocused(false);
          }}
          onFocus={() => setIsFocused(true)}
          value={searchValue}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    width: '65%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  inputContainer: {
    display: 'flex',
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderColor: ColorsNative.background[300],
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 5,
    marginBottom: 10,
    height: 40,
  },
});

export default SearchInput;
