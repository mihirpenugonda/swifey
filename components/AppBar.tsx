import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Logo from '../assets/images/newLogo.svg'; 
import { fetchUserWallet } from '../services/apiService'; // Import the new function
import { supabase } from '../supabaseClient'; // Assuming you're using Supabase for user authentication

interface AppBarProps {
  showRightSide?: boolean;  // Add the optional prop type
}

const AppBar: React.FC<AppBarProps> = ({ showRightSide = true }) => {
  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
          throw new Error('User not logged in.');
        }

        const userId = user.id; 

        const walletData = await fetchUserWallet(userId);
        const solBalance = walletData.balance.toFixed(2);  
        setBalance(`${solBalance} USD`);
      } catch (error) {
        console.error('Error fetching wallet balance:', error);
        setBalance('Error');
      }
    };

    fetchWallet();
  }, []);

  return (
    <View style={styles.appBar}>
      <View style={styles.leftContainer}>
        <Logo width={40} height={40} style={styles.logo} />
        <Text style={styles.logoText}>KISS or RUG</Text>
      </View>

      {showRightSide && (
        <View style={styles.bagContainer}>
          <Image
            source={require('../assets/images/bag.png')}
            style={styles.bagImage}
          />
          <Text style={styles.usdText}>{balance ? balance : 'Loading...'}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F4F9F5',
    width: '100%',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    marginRight: 8,
  },
  logoText: {
    color: '#000',
    fontSize: 18.65,
    fontFamily: 'Impact',
    fontWeight: '400',
    lineHeight: 27.97,
    letterSpacing: -0.02 * 18.65,
    textAlign: 'center',
  },
  bagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bagImage: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  usdText: {
    color: '#000',
    fontSize: 14,
    fontFamily: 'Tomorrow',
    fontWeight: '600',
    lineHeight: 17.4,
    textAlign: 'left',
  },
});

export default AppBar;
