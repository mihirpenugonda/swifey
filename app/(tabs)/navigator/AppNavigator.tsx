import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, ImageSourcePropType } from 'react-native';


import HomeScreen from '../../../components/screens/HomeScreen/PlayScreen';
import KissesScreen from '../../../components/screens/KissesScreen/KissesScreen';
import YourMoveScreen from '../../../components/screens/YourMove/YourMoveScreen';
import BagScreen from '../../../components/screens/BagScreen/BagScreen';
import ProfileScreen from '../../../components/screens/ProfileScreen/ProfileScreen';


const HomeIcon = require('../../../assets/images/play.png');
const KissesIcon = require('../../../assets/images/kisses.png');
const YourMoveIcon = require('../../../assets/images/yourmove.png');
const BagIcon = require('../../../assets/images/bag.png');
const ProfileIcon = require('../../../assets/images/profile.png');

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000000',
        },
        tabBarActiveTintColor: '#E54D51',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.8)', 
        tabBarIcon: ({ focused }) => {
          let iconSource: ImageSourcePropType;

          switch (route.name) {
            case 'Home':
              iconSource = HomeIcon;
              break;
            case 'Kisses':
              iconSource = KissesIcon;
              break;
            case 'YourMove':
              iconSource = YourMoveIcon;
              break;
            case 'Bag':
              iconSource = BagIcon;
              break;
            case 'Profile':
              iconSource = ProfileIcon;
              break;
            default:
              iconSource = HomeIcon;
              break;
          }

          return (
            <Image
              source={iconSource}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          );
        },
        tabBarLabelStyle: { fontSize: 12 }, 
      })}
    >
    
      <Tab.Screen name="Kisses" component={KissesScreen} options={{ tabBarLabel: 'Kisses' }} />
      <Tab.Screen name="YourMove" component={YourMoveScreen} options={{ tabBarLabel: 'Your Move' }} />
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Play' }} />
      <Tab.Screen name="Bag" component={BagScreen} options={{ tabBarLabel: 'Bag' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}
