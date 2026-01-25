import { useState } from 'react';

interface TransbankButtonProps {
  amount: number;
  sessionId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function TransbankButton({
  amount,
  sessionId,
  onSuccess,
  onError,
}: TransbankButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/transbank/create-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          sessionId,
          returnUrl: `${window.location.origin}/payment/transbank-return`,
        }),
      });

      const data = await response.json();

      if (data.success && data.url && data.token) {
        // Create a form to redirect to Transbank
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = data.url;

        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'token_ws';
        input.value = data.token;

        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();

        onSuccess?.();
      } else {
        throw new Error(data.error || 'Error al crear la transacción');
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      onError?.(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className="btn btn-primary w-full flex items-center justify-center gap-2"
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Procesando...</span>
        </>
      ) : (
        <>
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
          <span>Pagar con Transbank</span>
        </>
      )}
    </button>
  );
}
