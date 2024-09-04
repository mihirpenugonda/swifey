import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import AppBar from '../../AppBar';

export default function BagScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <AppBar />
      <LinearGradient
        colors={['#F4F9F5', '#EDDCCC']}
        style={styles.container}
      >
        <View style={styles.balanceContainer}>
          <View style={styles.row}>
            <Text style={styles.label}>Total Balance</Text>
            <Text style={styles.balance}>$0</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Wallet Address</Text>
            <Text style={styles.walletAddress}>-</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.addButton}>
            <LinearGradient
              colors={['#FF56F8', '#B6E300']}
              style={styles.gradientButton}
            >
              <Text style={styles.addButtonText}>ADD CASH</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.withdrawButton}>
            <Text style={styles.withdrawButtonText}>WITHDRAW</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.swipesBoxContainer}>
          <View style={styles.swipesBox}>
            <Text style={styles.swipesLabel}>Total Swipes Remaining</Text>
            <Text style={styles.swipesValue}>0 ($1/swipe)</Text>
          </View>
        </View>

        <View style={styles.activitiesContainer}>
          <Text style={styles.activitiesTitle}>Activity</Text>
          <Text style={styles.activityItem}>Your activity will show up here. Start swiping to see your stats!</Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F9F5', 
    paddingBottom: 0, // Remove any default padding
  },
  container: {
    flex: 1,
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // Removed backgroundColor here because it's defined in the LinearGradient
  },
  balanceContainer: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    color: '#000',
    fontSize: 18,
    opacity: 0.8,
    fontWeight: '400',
  },
  balance: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  walletAddress: {
    color: '#000',
    fontSize: 18,
    fontWeight: '400',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    height: 50,
  },
  addButton: {
    flex: 1,
    borderRadius: 25,
    marginRight: 10,
  },
  gradientButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  addButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
  withdrawButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    borderColor: '#121515',
    borderWidth: 1,
  },
  withdrawButtonText: {
    color: '#121515',
    fontSize: 16,
    fontWeight: '500',
  },
  swipesBoxContainer: {
    position: 'relative',
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    marginBottom: 20,
    padding: 10,
  },
  swipesBox: {
    backgroundColor: '#F4F9F5',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  swipesLabel: {
    color: '#000',
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 8,
  },
  swipesValue: {
    color: '#FF50B9',
    fontSize: 20,
    fontWeight: 'bold',
  },
  activitiesContainer: {
    marginTop: 20,
  },
  activitiesTitle: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  activityItem: {
    color: '#000',
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 5,
  },
});
