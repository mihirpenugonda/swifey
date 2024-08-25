import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, SafeAreaView } from 'react-native';
import AppBar from '../../AppBar';

export default function PlayScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  const handleProfileButtonPress = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {

    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppBar />

      <View style={styles.profileContainer}>
        <View style={styles.profileImagePlaceholder} />

        <TouchableOpacity style={styles.profileButton} onPress={handleProfileButtonPress}>
          <View style={styles.profileImage} />
          <Image
            source={require('../../../assets/images/verificationbadge.png')}
            style={styles.verificationBadge}
          />
        </TouchableOpacity>

        <View style={styles.profileTextContainer}>
          <Text style={styles.profileName}>TattooGirl, 28</Text>
          <Text style={styles.profileDescription}>
            If you’re an attractive woman or a man, you want to be on this app. You’ll rug a lot of people and make money.
          </Text>
        </View>

        <View style={styles.cutCornerOverlay} />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
       <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={handleCloseModal}>
          <View style={styles.modalContentContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalProfileImage} />
              <Image
                source={require('../../../assets/images/verificationbadge.png')}
                style={styles.modalVerificationBadge}
              />
              <Text style={styles.modalProfileName}>TattooGirl, 28</Text>
              <Text style={styles.modalProfileDescription}>This profile is verified.</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121515',
  },
  profileContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 20,
    padding: 0,
    position: 'relative', 
    borderColor: '#rgba(255, 255, 255, 0.6)', 
    borderWidth: 1,
    overflow: 'hidden', 
    marginBottom: 16
  },
  profileImagePlaceholder: {
    width: '100%',
    height: '70%',
    backgroundColor: '#555',
    marginBottom: 16,
  },
  profileButton: {
    position: 'absolute',
    bottom: '32%',
    left: 10,
    zIndex: 10,
  },
  profileImage: {
    width: 68,
    height: 73,
    backgroundColor: '#000',
    borderRadius: 8,
    borderWidth: 1,
  },
  verificationBadge: {
    width: 20,
    height: 20,
    position: 'absolute',
    right: -5,
    top: -5,
  },
  profileTextContainer: {
    paddingHorizontal: 16,
  },
  profileName: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  profileDescription: {
    fontSize: 14,
    color: '#FFF',
  },
  cutCornerOverlay: {
    position: 'absolute',
    bottom: -25,
    right: -25,
    width: 50,
    height: 50,
    backgroundColor: '#121515', 
    borderColor: '#rgba(255, 255, 255, 0.6)', 
    borderTopWidth: 1, 
    borderLeftWidth: 1,
    transform: [{ rotate: '45deg' }], 
    zIndex: 100, 
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContentContainer: {
    width: '80%',
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 20,
  },
  modalContent: {
    alignItems: 'center',
  },
  modalProfileImage: {
    width: 80,
    height: 80,
    backgroundColor: '#000',
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#fff',
  },
  modalVerificationBadge: {
    width: 24,
    height: 24,
    position: 'absolute',
    bottom: 70,
    right: 100,
  },
  modalProfileName: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
    marginTop: 16,
  },
  modalProfileDescription: {
    fontSize: 18,
    color: '#7D92FF',
    marginTop: 5,
    fontWeight: '400'
  },
});
