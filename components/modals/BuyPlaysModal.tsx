import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useBottomModal } from "@/helpers/context/bottomModalContext";
import * as InAppPurchases from "react-native-iap";
import {
  endConnection,
  finishTransaction,
  initConnection,
  Purchase,
  PurchaseError,
  purchaseErrorListener,
  purchaseUpdatedListener,
} from "react-native-iap";
import { validateIAPPurchase } from "@/services/apiService";
import { useMainContext } from "@/helpers/context/mainContext";

const productId = "kisstest123";

const products = [
  {
    title: "1\nPlay",
    price: 1.0,
    quantity: 1,
  },
  {
    title: "5\nPlays",
    price: 5.0,
    quantity: 5,
  },
  {
    title: "10\nPlays",
    price: 10.0,
    quantity: 10,
  },
];

export default function BuyPlaysModal({ numOfPlays }: { numOfPlays: number }) {
  const { hideModal } = useBottomModal();
  const { refreshBalance } = useMainContext();

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingIndex, setProcessingIndex] = useState<number | null>(null);

  useEffect(() => {
    let purchaseUpdateSubscription: { remove: () => void } | null = null;
    let purchaseErrorSubscription: { remove: () => void } | null = null;

    const initializeIAP = async () => {
      try {
        const result = await initConnection();
        console.log("IAP connection initialized", result);

        purchaseUpdateSubscription = purchaseUpdatedListener(
          async (purchase: Purchase) => {
            console.log("Purchase updated", purchase);

            try {
              const receipt = purchase.transactionReceipt;

              if (receipt) {
                finishTransaction({
                  purchase: purchase,
                });

                await validateIAPPurchase(receipt, true);
                await refreshBalance();
              }
            } catch (err) {
              console.error("Error handling purchase", err);
            } finally {
              setProcessingIndex(null);
            }
          }
        );

        purchaseErrorSubscription = purchaseErrorListener(
          (error: PurchaseError) => {
            console.log("Purchase error", error);
            setIsProcessing(false);
            setProcessingIndex(null);
            Alert.alert("Error", error.message);
          }
        );
      } catch (err) {
        console.warn(
          `Failed to initialize IAP or fetch products: ${
            err instanceof Error ? err.message : "Unknown error"
          }`
        );
      }
    };

    initializeIAP();

    // Cleanup function
    return () => {
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove();
      }
      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();
      }
      endConnection();
    };
  }, []);

  const onPurchaseClicked = async (quantity: number, index: number) => {
    try {
      setProcessingIndex(index);
      const products = await InAppPurchases.getProducts({
        skus: [productId],
      });
      console.log("Products:", products);

      await InAppPurchases.requestPurchase({
        sku: productId,
        quantity: quantity,
      });
    } catch (error) {
      console.error("Purchase failed:", error);
    } finally {
      setProcessingIndex(null);
    }
  };

  return (
    <View style={{ width: "100%", minHeight: 200 }}>
      {isProcessing ? (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <Text style={{ color: "#FFFFFF", marginTop: 10, fontSize: 16 }}>
            Processing transaction...
          </Text>
          <ActivityIndicator size="small" color="#FFFFFF" />
        </View>
      ) : (
        <View
          style={{
            width: "100%",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 5,
            }}
          >
            <Text style={{ fontSize: 28, fontWeight: "bold" }}>Get Plays</Text>
            <TouchableOpacity onPress={hideModal}>
              <View
                style={{
                  backgroundColor: "#C8C8C8",
                  borderRadius: 9999,
                  width: 40,
                  height: 40,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>×</Text>
              </View>
            </TouchableOpacity>
          </View>

          <Text style={{ marginBottom: 10 }}>Total Plays: {numOfPlays}</Text>

          <View
            style={{
              flexDirection: "row",
              marginBottom: 15,
              gap: 20,
              justifyContent: "center",
            }}
          >
            {products.map((product, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => onPurchaseClicked(product.quantity, index)}
                style={{
                  backgroundColor: "#333",
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 20,
                  height: 70,
                  width: 70,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                disabled={isProcessing}
              >
                {processingIndex === index ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text
                    style={{
                      color: "white",
                      fontSize: 12,
                      lineHeight: 16,
                      textAlign: "center",
                    }}
                  >
                    {product.title}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <Text style={{ textAlign: "center", marginBottom: 15 }}>
            1 Play = $1.00
          </Text>
        </View>
      )}
    </View>
  );
}
