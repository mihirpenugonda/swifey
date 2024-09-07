import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, SafeAreaView, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { fetchConversation, sendMessageToServer } from '../../services/apiService';
import { supabase } from '../../supabaseClient';

export default function ChatScreen() {
  const router = useRouter();
  const { name, profileImage, matchId } = useLocalSearchParams();

  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const imageUri = Array.isArray(profileImage) ? profileImage[0] : profileImage;

  useEffect(() => {
    const fetchUserId = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        console.error('Error fetching user:', error);
      } else {
        setUserId(user.id); // Store the current user's profile ID
        loadConversation(user.id);
      }
    };
    fetchUserId();
  }, []);

  const loadConversation = async (currentUserId: string) => {
    try {
      if (typeof matchId === 'string') {
        const fetchedConversation = await fetchConversation(matchId, 20, 0);
        console.log("Fetched conversation for match ID:", matchId);
        console.log("Fetched conversation response:", fetchedConversation);
  
        if (fetchedConversation && Array.isArray(fetchedConversation.messages) && fetchedConversation.messages.length > 0) {
          // Sort messages by created_at in ascending order
          const sortedMessages = fetchedConversation.messages.sort(
            (a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
  
          // Map the sorted messages to fit the structure of your chat
          const updatedMessages = sortedMessages.map((msg: any) => ({
            id: msg.id,
            text: msg.message_content,
            sender: msg.sender_profile_id === currentUserId ? 'self' : 'other',
          }));
  
          setMessages(updatedMessages);
        } else {
          console.log('No conversation found.');
          setMessages([]);
        }
      } else {
        console.error('Invalid matchId:', matchId);
      }
    } catch (error) {
      console.error('Error fetching conversation:', error);
      setMessages([]);
    }
  };
  

  const handleSendMessage = async () => {
    if (message.trim() === '') return; // Avoid sending empty messages
  
    const newMessage = {
      id: Date.now().toString(), // Temporary ID for the message
      text: message,
      sender: 'self',
    };
  
    try {
      const validMatchId = Array.isArray(matchId) ? matchId[0] : matchId;
      
      // Send message to the server
      const response = await sendMessageToServer(validMatchId, message);
  
      if (response.success) {
        // Add the new message to the messages array (append at the bottom)
        setMessages((prevMessages) => [...prevMessages, newMessage]);
  
        // Clear the input field
        setMessage('');
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  const renderMessage = ({ item }: { item: { id: string; text: string; sender: 'self' | 'other' } }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === 'self' ? styles.selfMessage : styles.otherMessage,
      ]}
    >
      <Text style={item.sender === 'self' ? styles.selfText : styles.otherText}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Image source={require('../../assets/images/back-icon.png')} style={styles.backIcon} />
        </TouchableOpacity>
        {imageUri && <Image source={{ uri: imageUri }} style={styles.avatar} />}
        <Text style={styles.username}>{name}</Text>
      </View>

      {messages.length > 0 ? (
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messageList}
        
        />
      ) : (
        <View style={styles.noConversationContainer}>
          <Text style={styles.noConversationText}>No conversation, say hi!</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message"
          placeholderTextColor="#666"
          style={styles.input}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Image source={require('../../assets/images/send-icon.png')} style={styles.sendIcon} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F9F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#F4F9F5',
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: 16,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#000',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  messageList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  messageBubble: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginBottom: 10,
    maxWidth: '70%',
  },
  selfMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#D1FFA3',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0e0e0',
  },
  selfText: {
    color: '#000',
  },
  otherText: {
    color: '#000',
  },
  noConversationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noConversationText: {
    fontSize: 16,
    color: '#999',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#F4F9F5',
    borderTopColor: '#e0e0e0',
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderColor: '#e0e0e0',
    borderWidth: 1,
    marginRight: 10,
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    width: 40,
    height: 40,
  },
});
