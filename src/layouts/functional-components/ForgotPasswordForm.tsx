import React, { useState } from 'react';
import { BiEnvelope, BiCheckCircle } from 'react-icons/bi';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.errors?.[0]?.message || 'Ocurrió un error. Por favor, intenta nuevamente.');
      }
    } catch (err) {
      setError('Error de conexión. Por favor, verifica tu conexión a internet.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="mb-6">
          <BiCheckCircle className="mx-auto text-green-500" size={64} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          ¡Email Enviado!
        </h3>
        <p className="text-gray-600 mb-6">
          Si el email <strong>{email}</strong> existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-900">
            <strong>💡 Consejo:</strong> Revisa tu carpeta de spam si no ves el email en tu bandeja de entrada.
          </p>
        </div>
        <p className="text-sm text-gray-500">
          El enlace expirará en 1 hora por seguridad.
        </p>
        <div className="mt-6">
          <a href="/login" className="btn btn-primary">
            Volver al Inicio de Sesión
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <div className="relative">
          <BiEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="tu@email.com"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            disabled={loading}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !email}
        className="btn btn-primary w-full"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Enviando...
          </span>
        ) : (
          'Enviar Enlace de Recuperación'
        )}
      </button>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          ¿Necesitas ayuda?{' '}
          <a href="/contact" className="text-primary hover:underline font-medium">
            Contáctanos
          </a>
        </p>
      </div>
    </form>
  );
}
