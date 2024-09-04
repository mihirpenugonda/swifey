import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Logo from '../assets/images/newLogo.svg'; 

interface AppBarProps {
  showRightSide?: boolean;  // Add the optional prop type
}

const AppBar: React.FC<AppBarProps> = ({ showRightSide = true }) => {
  return (
    <View style={styles.appBar}>
      <View style={styles.leftContainer}>
        <Logo width={40} height={40} style={styles.logo} />
        <Text style={styles.logoText}>KISS or RUG</Text>
      </View>

      {showRightSide && (  // Conditionally render the right side
        <View style={styles.bagContainer}>
          <Image
            source={require('../assets/images/bag.png')}
            style={styles.bagImage}
          />
          <Text style={styles.usdText}>$250 USD</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Distribute space between elements
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
    fontFamily: 'Tomorrow', // Ensure this font is available
    fontWeight: '600',
    lineHeight: 17.4,
    textAlign: 'left',
  },
});

export default AppBar;
