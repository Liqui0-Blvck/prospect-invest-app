import { Notes } from '@/types/Notes';
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';


interface NoteItemProps {
  note: Notes;
  onPress: () => void;
}

const NoteItem: React.FC<NoteItemProps> = ({ note, onPress }) => {
  return (
    <Pressable style={styles.noteContainer} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title}>{note.title}</Text>
        {/* <Text style={styles.date}>{note?.date!}</Text> */}
      </View>
      <Text style={styles.content}>{note.content}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  noteContainer: {
    width: '100%',
    backgroundColor: '#FFF9C4',
    padding: 10,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E1C699',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5D4037',
  },
  date: {
    fontSize: 12,
    color: '#8D6E63',
  },
  content: {
    fontSize: 14,
    color: '#6D4C41',
    marginTop: 4,
  },
});

export default NoteItem;
