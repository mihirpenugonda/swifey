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

  export const fetchUserWallet = async (user_id: any) => {
    const jwtToken = await getJwtToken();
  
    if (!jwtToken) {
      throw new Error('No JWT token found');
    }
  
    const response = await fetch(`${API_URL}/fetch-user-wallet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,  // Pass the JWT token in the Authorization header
      },
      body: JSON.stringify({ user_id }),  // Pass the user ID in the body
    });
  
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to fetch wallet balance: ${response.statusText} - ${errorMessage}`);
    }
  
    return response.json();
  };
  
  