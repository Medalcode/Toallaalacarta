import React from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";

interface PayPalButtonProps {
    cartId: string;
    totalPrice: number;
    internalOrderId?: string; // Appwrite order ID to update if needed
    onSuccess: (details: any) => void;
    onError: (error: any) => void;
}

export const PayPalPaymentButton: React.FC<PayPalButtonProps> = ({ cartId, totalPrice, internalOrderId, onSuccess, onError }) => {
    
    return (
        <PayPalButtons
            style={{ layout: "vertical" }}
            createOrder={async () => {
                try {
                    const response = await fetch("/api/paypal/create-order", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            cartId: cartId,
                            totalPrice: totalPrice,
                        }),
                    });
                    
                    const orderData = await response.json();
                    
                    if (orderData.id) {
                        return orderData.id;
                    } else {
                        throw new Error("Could not create PayPal order");
                    }
                } catch (error) {
                    console.error("Error creating order:", error);
                    onError(error);
                }
            }}
            onApprove={async (data) => {
                try {
                    const response = await fetch("/api/paypal/capture-order", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            orderID: data.orderID,
                            internalOrderId: internalOrderId
                        }),
                    });
                    
                    const transaction = await response.json();
                    
                    if (transaction.status === "COMPLETED") {
                        onSuccess(transaction);
                    } else {
                        throw new Error("Transaction failed");
                    }
                } catch (error) {
                     console.error("Error capturing order:", error);
                     onError(error);
                }
            }}
        />
    );
};
