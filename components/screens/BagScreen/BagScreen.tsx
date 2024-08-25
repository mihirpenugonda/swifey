import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppBar from '../../AppBar';

export default function BagScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>

      <AppBar />

      <View style={styles.container}>
      <View style={styles.balanceContainer}>
          <View style={styles.row}>
            <Text style={styles.label}>Total Balance</Text>
            <Text style={styles.balance}>$250</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Wallet Address</Text>
            <Text style={styles.walletAddress}>CoAA...C2vA</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>ADD CASH</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.withdrawButton}>
            <Text style={styles.withdrawButtonText}>WITHDRAW</Text>
          </TouchableOpacity>
        </View>


        <View style={styles.swipesBoxContainer}>
          <View style={styles.swipesBox}>
            <Text style={styles.swipesLabel}>Total Swipes Remaining</Text>
            <Text style={styles.swipesValue}>25 ($1/swipe)</Text>
          </View>
          <View style={styles.cutCornerOverlay} />
        </View>


        <View style={styles.activitiesContainer}>
          <Text style={styles.activitiesTitle}>Activities</Text>
          <Text style={styles.activityItem}>You got rugged 10 times</Text>
          <Text style={styles.activityItem}>You rugged others 12 times</Text>
          <Text style={styles.activityItem}>35 plays pending on others</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121515', 
  },
  container: {
    flex: 1,
    padding: 16,
  },
  balanceContainer: {
    marginBottom: 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    color: '#FFF',
    fontSize: 20,
    opacity: 0.8, 
    paddingRight: 8
  },
  balance: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  walletAddress: {
    color: '#FFF',
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    height: 51
  },
  addButton: {
    flex: 1,
    backgroundColor: '#3D3B8E',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginRight: 10,
    justifyContent: 'center'
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
  withdrawButton: {
    flex: 1,
    justifyContent: 'center',
    borderColor: '#3D3B8E',
    borderWidth: 2,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  withdrawButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  swipesBox: {
    backgroundColor: '#333', 
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  swipesBoxContainer: {
    position: 'relative', 
    backgroundColor: '#333',
    borderRadius: 8,
    marginBottom: 20, 
    padding: 6, 
  },

  cutCornerOverlay: {
    position: 'absolute',
    bottom: -24,  
    right: -27,   
    width: 50,   
    height: 45,  
    backgroundColor: '#121515', 
    transform: [{ rotate: '45deg' }], 
    borderBottomRightRadius: 8,
  },
  swipesLabel: {
    color: '#FFF',
    fontSize: 20,
    marginBottom: 8,
  },
  swipesValue: {
    color: '#FF50B9',
    fontSize: 24,
    fontWeight: 'bold',
  },
  activitiesContainer: {
    marginTop: 20,
  },
  activitiesTitle: {
    color: '#FFF',
    fontSize: 18,
    marginBottom: 10,
  },
  activityItem: {
    color: '#FFF',
    fontSize: 14,
    marginBottom: 5,
  },
});
