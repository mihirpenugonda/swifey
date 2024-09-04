import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, ListRenderItem } from 'react-native';
import AppBar from '../../AppBar';


interface ChatItem {
  id: string;
  name: string;
  message: string;
}


const data: ChatItem[] = [
  {
    id: '1',
    name: 'Sun Kissed',
    message: 'Yo!',
  },
  {
    id: '2',
    name: 'Just Frieza',
    message: 'Just frying some kisses, wau?',
  },
  {
    id: '3',
    name: 'Tom Siam',
    message: 'M here.!!!',
  },
  {
    id: '4',
    name: 'LovelyRugger',
    message: '?????',
  },
];

export default function KissesScreen() {

  const renderItem: ListRenderItem<ChatItem> = ({ item }) => (
    <View style={styles.chatItem}>
      <View style={styles.avatarPlaceholder}>

      </View>
      <View style={styles.messageContent}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.message}>{item.message}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppBar />
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F9F5', 
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomColor: '#333',
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#808080', 
    marginRight: 12,
  },
  messageContent: {
    flex: 1,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  message: {
    color: '#AAAAAA',
    fontSize: 14,
  },
});
