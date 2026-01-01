import React, { useState } from 'react';
import Cookies from 'js-cookie';

export default function CheckoutForm({ cartId }: { cartId: string }) {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          cartId
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Error en el servidor');
      }

      // 2. Clear Cart (Client side cookie removal)
      Cookies.remove('cartId');

      // 3. Redirect to Success Page
      window.location.href = `/checkout/success?orderId=${data.orderId}`;

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Hubo un error al procesar tu pedido. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Email</label>
        <input 
          type="email" 
          name="email" 
          required 
          className="w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary border-gray-300"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Nombre</label>
          <input 
            type="text" 
            name="firstName" 
            required 
            className="w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary border-gray-300"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Apellido</label>
          <input 
            type="text" 
            name="lastName" 
            required 
            className="w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary border-gray-300"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Dirección</label>
        <input 
          type="text" 
          name="address" 
          required 
          className="w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary border-gray-300"
          value={formData.address}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Ciudad</label>
          <input 
            type="text" 
            name="city" 
            required 
            className="w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary border-gray-300"
            value={formData.city}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Teléfono</label>
          <input 
            type="tel" 
            name="phone" 
            required 
            className="w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary border-gray-300"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button 
        type="submit" 
        disabled={loading}
        className="btn btn-primary w-full mt-6 py-3 font-bold text-white rounded-md hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Procesando...' : 'Confirmar Pedido'}
      </button>
    </form>
  );
}
