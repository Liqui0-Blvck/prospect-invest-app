import React from 'react';
import { View, StyleSheet } from 'react-native';
import NoteItem from './NoteItem';
import { Notes } from '@/types/Notes';

interface NotesListProps {
  notes: Notes[];
  leadID: string | string[];
  setNoteSelected: (note: Notes) => void;
  setNoteModal: (visible: boolean) => void;
  userID: string;
  loading: boolean;
}

const SkeletonNote = () => {
  return (
    <View style={styles.skeletonContainer}>
      <View style={styles.skeletonTitle} />
      <View style={styles.skeletonContent} />
    </View>
  );
};

const NotesList: React.FC<NotesListProps> = ({ notes, leadID, setNoteSelected, setNoteModal, userID, loading }) => {
  return (
    <View style={styles.container}>
       {loading ? (
        // Muestra 3 skeletons cuando loadingNotes es true
        Array(3).fill(0).map((_, index) => <SkeletonNote key={index} />)
      ) : (
        notes
          .filter((note) => note.leadID === leadID)
          .map((note, index) => (
            <NoteItem
              key={index}
              note={{ ...note, userID }}
              onPress={() => {
                setNoteSelected({ ...note, userID });
                setNoteModal(true);
              }}
            />
          ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 2,
  },
  skeletonContainer: {
    width: '100%',
    backgroundColor: '#e0e0e0',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d4d4d4',
  },
  skeletonTitle: {
    width: '50%',
    height: 20,
    backgroundColor: '#ccc',
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonContent: {
    width: '80%',
    height: 15,
    backgroundColor: '#ccc',
    borderRadius: 4,
  },
});

export default NotesList;
