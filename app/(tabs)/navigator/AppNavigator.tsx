import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, ImageSourcePropType, View, Text, ImageStyle, TextStyle } from 'react-native';

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
          height: 90,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontFamily: 'Tomorrow_400Regular',
          fontWeight: '400',
        },
        tabBarActiveTintColor: '#CDFF8B',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.8)',
        tabBarIcon: ({ focused }) => {
          let iconSource: ImageSourcePropType;
          let iconStyle: ImageStyle = { width: 24, height: 24 };

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
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ margin: focused ? 10 : 0 }}>
                <Image
                  source={iconSource}
                  style={iconStyle}
                  resizeMode="contain"
                />
              </View>
            </View>
          );
        },
        tabBarLabel: ({ focused, color }) => {
          const labelStyle: TextStyle = focused
            ? {
                fontFamily: 'Tomorrow_400Regular',
                fontSize: 16,
                fontStyle: 'italic',
                fontWeight: '700',
                lineHeight: 17.4,

                color: '#CDFF8B', 
              }
            : {
                fontFamily: 'Tomorrow_400Regular',
                fontSize: 14,
                fontWeight: '400',
                lineHeight: 14,

                color: 'rgba(255, 255, 255, 0.8)', 
              };

          return <Text style={labelStyle}>{route.name}</Text>;
        },
      })}
    >
      <Tab.Screen name="Kisses" component={KissesScreen} options={{ tabBarLabel: 'Kisses' }} />
      <Tab.Screen name="YourMove" component={YourMoveScreen} options={{ tabBarLabel: 'Your Turn' }} />
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Play' }} />
      <Tab.Screen name="Bag" component={BagScreen} options={{ tabBarLabel: 'Bag' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}
