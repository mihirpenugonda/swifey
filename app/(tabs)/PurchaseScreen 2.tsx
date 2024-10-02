import React, { useEffect, useState } from "react";
import { Button, Text, View, Platform, Alert } from "react-native";
import * as InAppPurchases from "react-native-iap";

const purchaseItemId = "your_consumable_item_id_here";
const API_URL = "https://your-api-url.com";

interface Product {
  productId: string;
  title: string;
  description: string;
  price: string;
  currency: string;
}

interface PurchaseVerificationResponse {
  isValid: boolean;
  message: string;
  quantity?: number;
  newBalance?: number;
  error?: string;
}

export default function PurchaseComponent() {
  const [purchaseStatus, setPurchaseStatus] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [itemBalance, setItemBalance] = useState<number>(0);

  useEffect(() => {
    const initPurchases = async () => {
      try {
        await InAppPurchases.initConnection();
        const items = await InAppPurchases.getProducts({
          skus: [purchaseItemId],
        });
        setProducts(items);
        await fetchItemBalance();
        await handlePendingPurchases();
      } catch (err) {
        console.error("Failed to initialize IAP", err);
        setPurchaseStatus("Failed to initialize purchases");
      }
    };

    initPurchases();

    const purchaseUpdateSubscription = InAppPurchases.purchaseUpdatedListener(
      (purchase: InAppPurchases.Purchase) => {
        const receipt = purchase.transactionReceipt;
        if (receipt) {
          handlePurchase(purchase);
        }
      }
    );

    const purchaseErrorSubscription = InAppPurchases.purchaseErrorListener(
      (error: InAppPurchases.PurchaseError) => {
        console.error("Purchase error", error);
        setPurchaseStatus("Purchase failed: " + error.message);
      }
    );

    return () => {
      InAppPurchases.endConnection();
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove();
      }
      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();
      }
    };
  }, []);

  const handlePendingPurchases = async () => {
    try {
      const purchases = await InAppPurchases.getPendingPurchasesIOS();
      for (let purchase of purchases) {
        await handlePurchase(purchase);
      }
    } catch (error) {
      console.error("Error handling pending purchases", error);
    }
  };

  const fetchItemBalance = async () => {
    try {
      const response = await fetch(`${API_URL}/get-item-balance`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer YOUR_AUTH_TOKEN_HERE",
        },
      });
      const data: { balance: number } = await response.json();
      setItemBalance(data.balance);
    } catch (error) {
      console.error("Failed to fetch item balance", error);
    }
  };

  const handlePurchase = async (purchase: InAppPurchases.Purchase) => {
    try {
      setPurchaseStatus("Verifying purchase...");
      const receiptData =
        Platform.OS === "ios"
          ? { receipt: purchase.transactionReceipt }
          : {
              productId: purchase.productId,
              purchaseToken: purchase.purchaseToken,
              packageName: purchase.packageNameAndroid,
            };

      const response = await fetch(`${API_URL}/verify-purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer YOUR_AUTH_TOKEN_HERE",
        },
        body: JSON.stringify(receiptData),
      });

      const result: PurchaseVerificationResponse = await response.json();

      if (result.isValid) {
        setPurchaseStatus("Purchase successful and verified!");
        if (result.newBalance !== undefined) {
          setItemBalance(result.newBalance);
        }
        await InAppPurchases.finishTransaction({
          purchase: purchase,
        });
      } else {
        setPurchaseStatus("Purchase verification failed");
        Alert.alert(
          "Purchase Failed",
          result.error || "Unknown error occurred"
        );
      }
    } catch (error) {
      console.error("Error handling purchase", error);
      setPurchaseStatus("Error handling purchase");
    }
  };

  const initiatePayment = async () => {
    try {
      setPurchaseStatus("Processing purchase...");
      await InAppPurchases.requestPurchase({
        skus: [purchaseItemId],
      });
    } catch (err) {
      console.error("Purchase request failed", err);
      setPurchaseStatus("Purchase request failed");
    }
  };

  return (
    <View>
      {products.map((product) => (
        <Button
          key={product.productId}
          title={`Buy ${product.title} for ${product.price}`}
          onPress={initiatePayment}
        />
      ))}
      <Text>Current Balance: {itemBalance}</Text>
      <Text>{purchaseStatus}</Text>
    </View>
  );
}
