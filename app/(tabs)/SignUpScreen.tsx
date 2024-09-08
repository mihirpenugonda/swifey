import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Keyboard,
  Animated,
  TouchableWithoutFeedback,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { supabase } from '../../supabaseClient';
import { useRouter } from 'expo-router';
import HeaderLogo from '@/components/HeaderLogo';
import { LinearGradient } from 'expo-linear-gradient';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(new Animated.Value(0)); 
  const router = useRouter();

  useEffect(() => {
    const keyboardWillShow = (event: { duration: number; endCoordinates: { height: number } }) => {
      Animated.timing(keyboardHeight, {
        duration: event.duration || 300,
        toValue: event.endCoordinates.height,
        useNativeDriver: false,
      }).start();
    };

    const keyboardWillHide = (event: { duration: number }) => {
      Animated.timing(keyboardHeight, {
        duration: event.duration || 300,
        toValue: 0,
        useNativeDriver: false,
      }).start();
    };

    const showSubscription = Keyboard.addListener('keyboardWillShow', keyboardWillShow);
    const hideSubscription = Keyboard.addListener('keyboardWillHide', keyboardWillHide);

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleSignUp = async () => {
    if (isCooldown) {
      Alert.alert('Please wait', 'You need to wait a few minutes before requesting again.');
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        shouldCreateUser: true,  
      },
    });

    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert(
        'Check your email',
        'An OTP has been sent to your email address. Please check your inbox to verify your account.'
      );
      const staticPassword = "111111"; 

      const { data: user, error: userError } = await supabase.auth.getUser();
  
      if (userError || !user) {
        Alert.alert('Error', 'Failed to fetch user after OTP verification');
      } else {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: staticPassword,  
        });
  
        if (passwordError) {
          Alert.alert('Error', passwordError.message);
        } else {
          Alert.alert('Success', 'Your account has been created with a static password.');
        }
      }
      setIsCooldown(true);
      setTimeout(() => setIsCooldown(false), 300000); 
      router.push({
        pathname: '/VerificationScreen',
        params: { email }, 
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
    <View style={styles.container}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Animated.View style={[styles.innerContainer, { paddingBottom: keyboardHeight }]}>

        <View style={styles.headerContainer}>
          <HeaderLogo />
        </View>


        <View style={styles.content}>
          <Text style={styles.title}>What's your email address?</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#666"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
         
           <TouchableOpacity style={styles.buttonWrapper} onPress={handleSignUp}>
          <LinearGradient
            colors={['#FF56F8', '#B6E300']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.gradientButton}
          >
             <Text style={styles.buttonText}>NEXT</Text>
          </LinearGradient>
        </TouchableOpacity>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
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
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerContainer: {
    width: '100%',
    marginBottom: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 8,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 20,
  },
  buttonWrapper: {
    width: '100%',
  },
  gradientButton: {
    paddingVertical: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '500',
  },
});

