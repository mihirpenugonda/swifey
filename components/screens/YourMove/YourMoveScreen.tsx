import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, Image } from 'react-native';
import AppBar from '../../AppBar'; 

interface MoveItem {
  id: string;
  name: string;
  imageUri?: string; 
}

const data: MoveItem[] = [
  { id: '1', name: 'Naguweck', imageUri: 'https://example.com/naguweck.png' },
  { id: '2', name: 'Lexua', imageUri: 'https://example.com/lexua.png' },
  { id: '3', name: 'Veronnee', imageUri: 'https://example.com/veronnee.png' },
  { id: '4', name: 'Deezaika', imageUri: 'https://example.com/deezaika.png' },
  { id: '5', name: 'Anonymous', imageUri: '' },   
  { id: '6', name: 'Another User', imageUri: 'https://example.com/anotheruser.png' },
];

export default function YourMoveScreen() {
  const renderItem = ({ item }: { item: MoveItem }) => (
    <View style={styles.moveItem}>
      <View style={styles.imageContainer}>
        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}
      </View>
      <Text style={styles.name}>{item.name}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppBar />
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2} 
        columnWrapperStyle={styles.row} 
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121515', 
  },
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 16, 
  },
  row: {
    justifyContent: 'space-between', 
    paddingBottom: 20, 
  },
  moveItem: {
    flex: 1,
    alignItems: 'flex-start', 
    marginBottom: 20,
    marginHorizontal: 3,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1, 
    backgroundColor: '#808080', 
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#808080',
    borderRadius: 8,
  },
  name: {
    color: '#FFF',
    fontSize: 14,
    textAlign: 'left',
  },
});
