import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://backend.kissorrug-968.workers.dev';

const getJwtToken = async () => {
    const jwtToken = await AsyncStorage.getItem('jwtToken');
    console.log('Retrieved JWT Token:', jwtToken);  // Ensure the token is being retrieved correctly
    return jwtToken;
  };
  
  export const fetchProfiles = async (limit: number, offset: number) => {
    const jwtToken = await AsyncStorage.getItem('jwtToken'); // Retrieve token
    console.log("JWT Token being sent:", jwtToken); // Log to confirm token is being passed
  
    if (!jwtToken) {
      throw new Error('No JWT token found');
    }
  
    const response = await fetch(`${API_URL}/browse-profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,  // Ensure token is passed correctly
      },
      body: JSON.stringify({ limit, offset }),
    });
  
    if (!response.ok) {
      const errorMessage = await response.text();  // Get the error message from the server
      console.error('Error response:', errorMessage);
      throw new Error(`Failed to fetch profiles: ${response.statusText}`);
    }
  
    return response.json();
  };
  