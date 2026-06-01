import React, { useState } from 'react';
import { BiLock, BiCheckCircle, BiErrorCircle } from 'react-icons/bi';

interface Props {
  token: string;
}

export default function ResetPasswordForm({ token }: Props) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Password strength indicator
  const getPasswordStrength = (pwd: string): { strength: string; color: string; width: string } => {
    if (pwd.length === 0) return { strength: '', color: '', width: '0%' };
    if (pwd.length < 8) return { strength: 'Débil', color: 'bg-red-500', width: '25%' };
    
    let score = 0;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) score++;
    
    if (score === 4 && pwd.length >= 12) return { strength: 'Muy Fuerte', color: 'bg-green-600', width: '100%' };
    if (score >= 3 && pwd.length >= 10) return { strength: 'Fuerte', color: 'bg-green-500', width: '75%' };
    if (score >= 2) return { strength: 'Media', color: 'bg-yellow-500', width: '50%' };
    return { strength: 'Débil', color: 'bg-red-500', width: '25%' };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    // Validate passwords match
    if (password !== confirmPassword) {
      setErrors(['Las contraseñas no coinciden']);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/password-reset/confirm-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      } else {
        const errorMessages = data.errors?.map((e: any) => e.message) || ['Ocurrió un error. Por favor, intenta nuevamente.'];
        setErrors(errorMessages);
      }
    } catch (err) {
      setErrors(['Error de conexión. Por favor, verifica tu conexión a internet.']);
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
          ¡Contraseña Restablecida!
        </h3>
        <p className="text-gray-600 mb-6">
          Tu contraseña ha sido actualizada exitosamente.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Serás redirigido al inicio de sesión en unos segundos...
        </p>
        <a href="/login" className="btn btn-primary">
          Ir al Inicio de Sesión
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Nueva Contraseña
        </label>
        <div className="relative">
          <BiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Mínimo 8 caracteres"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            disabled={loading}
          />
        </div>
        
        {/* Password Strength Indicator */}
        {password && (
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">Fortaleza:</span>
              <span className={`text-xs font-medium ${
                passwordStrength.strength === 'Muy Fuerte' ? 'text-green-600' :
                passwordStrength.strength === 'Fuerte' ? 'text-green-500' :
                passwordStrength.strength === 'Media' ? 'text-yellow-500' :
                'text-red-500'
              }`}>
                {passwordStrength.strength}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                style={{ width: passwordStrength.width }}
              ></div>
            </div>
          </div>
        )}
        
        <p className="mt-2 text-xs text-gray-500">
          Debe contener al menos 8 caracteres, mayúsculas, minúsculas, números y caracteres especiales.
        </p>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
          Confirmar Contraseña
        </label>
        <div className="relative">
          <BiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Repite tu contraseña"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            disabled={loading}
          />
        </div>
        {confirmPassword && password !== confirmPassword && (
          <p className="mt-2 text-xs text-red-600 flex items-center">
            <BiErrorCircle className="mr-1" />
            Las contraseñas no coinciden
          </p>
        )}
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          {errors.map((error, index) => (
            <p key={index} className="text-sm text-red-800">{error}</p>
          ))}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !password || !confirmPassword || password !== confirmPassword}
        className="btn btn-primary w-full"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Actualizando...
          </span>
        ) : (
          'Restablecer Contraseña'
        )}
      </button>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>🔒 Seguro:</strong> Tu contraseña será encriptada y almacenada de forma segura.
        </p>
      </div>
    </form>
  );
}
