import type { ReactNode } from "react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

interface Props {
  children: ReactNode;
}

const PayPalProvider = ({ children }: Props) => {
  const initialOptions = {
    clientId: import.meta.env.PUBLIC_PAYPAL_CLIENT_ID || "test",
    currency: "USD", // TODO: Make dynamic if needed
    intent: "capture",
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      {children}
    </PayPalScriptProvider>
  );
};

export default PayPalProvider;
