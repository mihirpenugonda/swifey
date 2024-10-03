import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://backend.kissorrug-968.workers.dev";
const DEV_API_URL = "https://backend-dev.kissorrug-968.workers.dev";

const getJwtToken = async () => {
  const jwtToken = await AsyncStorage.getItem("jwtToken");
  console.log("Retrieved JWT Token:", jwtToken); // Ensure the token is being retrieved correctly
  return jwtToken;
};

export const fetchProfiles = async (limit: number, offset: number) => {
  const jwtToken = await AsyncStorage.getItem("jwtToken"); // Retrieve token
  console.log("JWT Token being sent:", jwtToken); // Log to confirm token is being passed

  if (!jwtToken) {
    throw new Error("No JWT token found");
  }

  const response = await fetch(`${API_URL}/browse-profiles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwtToken}`, // Ensure token is passed correctly
    },
    body: JSON.stringify({ limit, offset }),
  });

  // Check response status
  if (!response.ok) {
    const errorMessage = await response.text(); // Get the error message from the server
    console.error("Error response:", errorMessage);
    throw new Error(`Failed to fetch profiles: ${response.statusText}`);
  }

  const data = await response.json();
  console.log("Fetched profiles data:", data); // Log the actual response

  // Ensure that data is in the expected format (an array of profiles)
  return data.profiles || data; // Adjust based on response structure
};

export const fetchUserWallet = async (user_id: any) => {
  const jwtToken = await getJwtToken();

  if (!jwtToken) {
    throw new Error("No JWT token found");
  }

  console.log(jwtToken, "jwtToken");
  const response = await fetch(`${API_URL}/fetch-user-wallet`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwtToken}`, // Pass the JWT token in the Authorization header
    },
    body: JSON.stringify({ user_id }), // Pass the user ID in the body
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(
      `Failed to fetch wallet balance: ${response.statusText} - ${errorMessage}`
    );
  }

  return response.json();
};

export const fetchMatches = async (limit: number, offset: number) => {
  const jwtToken = await getJwtToken();

  if (!jwtToken) {
    throw new Error("No JWT token found");
  }

  const response = await fetch(`${API_URL}/fetch-matches`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwtToken}`,
    },
    body: JSON.stringify({ limit, offset }),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    console.error("Error fetching matches:", errorMessage);
    throw new Error(`Failed to fetch matches: ${response.statusText}`);
  }

  return response.json();
};

// Send a message
export const sendMessageToServer = async (
  matchId: string,
  messageContent: string
) => {
  const jwtToken = await getJwtToken();
  const response = await fetch(`${API_URL}/send-message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwtToken}`,
    },
    body: JSON.stringify({
      match_id: matchId,
      message_content: messageContent,
    }),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to send message: ${errorMessage}`);
  }

  return response.json();
};

// Fetch conversation
export const fetchConversation = async (
  matchId: string,
  limit: number,
  offset: number
) => {
  const jwtToken = await getJwtToken();
  const response = await fetch(`${API_URL}/fetch-conversation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwtToken}`,
    },
    body: JSON.stringify({
      match_id: matchId,
      limit,
      offset,
    }),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to fetch conversation: ${errorMessage}`);
  }

  return response.json();
};

export const fetchMyTurnProfiles = async (limit: number, offset: number) => {
  const jwtToken = await getJwtToken();

  if (!jwtToken) {
    throw new Error("No JWT token found");
  }

  const response = await fetch(`${API_URL}/browse-my-turn-profiles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwtToken}`,
    },
    body: JSON.stringify({ limit, offset }),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(
      `Failed to fetch profiles: ${response.statusText} - ${errorMessage}`
    );
  }

  return response.json();
};

export const sendSwipe = async (userId: string, decision: "kiss" | "rug") => {
  const jwtToken = await getJwtToken(); // Ensure you're getting the JWT token
  const response = await fetch(`${API_URL}/send-swipe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwtToken}`,
    },
    body: JSON.stringify({
      user_id: userId, // Use user_id instead of swipe_id
      decision, // The decision ('kiss' or 'rug')
    }),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to send swipe: ${errorMessage}`);
  }

  return response.json();
};

export const validateInviteCode = async (code: string) => {
  try {
    const response = await fetch(`${API_URL}/validate-invite-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      return { isValid: false };
    }

    const data = await response.json();

    console.log("response", data);

    return { isValid: data.isValid };
  } catch (error) {
    console.error("error validating invite code:", error);

    return { isValid: false };
  }
};

export const validateIAPPurchase = async (
  purchaseReceipt: string,
  is_sandbox: boolean
) => {
  try {
    const jwtToken = await getJwtToken();

    const response = await fetch(`${API_URL}/verify-purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({ receipt: purchaseReceipt, is_sandbox }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to validate IAP purchase: ${errorMessage}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error validating IAP purchase:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

export const updateUserProfile = async (profileData: {
  name?: string;
  bio?: string;
  photos?: string[];
  gender?: string;
  date_of_birth?: string;
  location?: Record<string, any>;
  gender_preference?: string[];
  cryptonoun?: string;
  onboarding_step?: string;
}) => {
  try {
    const jwtToken = await getJwtToken();

    const token = await AsyncStorage.getItem("jwtToken");

    console.log(token, "token");

    const response = await fetch(`${API_URL}/update-profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(
        `Failed to update profile: ${response.statusText} - ${errorMessage}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};
