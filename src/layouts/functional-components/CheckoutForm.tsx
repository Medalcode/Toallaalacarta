import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { CHILEAN_REGIONS } from '@/lib/order-utils';

export default function CheckoutForm({ cartId, user }: { cartId: string, user?: any }) {
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    address: '',
    city: '',
    region: '',
    postalCode: '',
    phone: user?.phone || '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
          address: formData.address,
          city: formData.city,
          region: formData.region,
          postalCode: formData.postalCode,
          phone: formData.phone,
          notes: formData.notes,
          cartId,
          // Email, firstName, lastName are NOT sent
          // Backend will use authenticated user's data
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Error en el servidor');
      }

      // Clear Cart
      Cookies.remove('cartId');

      // Redirect to Success Page with order number
      window.location.href = `/checkout/success?orderId=${data.orderId}&orderNumber=${data.orderNumber}`;

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Hubo un error al procesar tu pedido. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const readOnlyClass = "bg-gray-100 cursor-not-allowed text-gray-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Información de Contacto</h3>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Email *</label>
          <input 
            type="email" 
            name="email" 
            required 
            readOnly={!!user?.email}
            className={`w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary border-gray-300 ${user?.email ? readOnlyClass : ''}`}
            value={formData.email}
            onChange={handleChange}
          />
          {user?.email && <p className="text-xs text-gray-500">Este campo no se puede modificar</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Nombre *</label>
            <input 
              type="text" 
              name="firstName" 
              required 
              readOnly={!!user?.firstName}
              className={`w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary border-gray-300 ${user?.firstName ? readOnlyClass : ''}`}
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Apellido *</label>
            <input 
              type="text" 
              name="lastName" 
              required 
              readOnly={!!user?.lastName}
              className={`w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary border-gray-300 ${user?.lastName ? readOnlyClass : ''}`}
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Teléfono *</label>
          <input 
            type="tel" 
            name="phone" 
            required 
            placeholder="+56912345678 o 912345678"
            readOnly={!!user?.phone}
            className={`w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary border-gray-300 ${user?.phone ? readOnlyClass : ''}`}
            value={formData.phone}
            onChange={handleChange}
          />
          <p className="text-xs text-gray-500">Formato: +56912345678 o 912345678</p>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Dirección de Envío</h3>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Dirección Completa *</label>
          <input 
            type="text" 
            name="address" 
            required 
            placeholder="Calle, número, departamento, etc."
            className="w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary border-gray-300"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Ciudad *</label>
            <input 
              type="text" 
              name="city" 
              required 
              placeholder="Ej: Santiago, Valparaíso"
              className="w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary border-gray-300"
              value={formData.city}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Región</label>
            <select 
              name="region" 
              className="w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary border-gray-300"
              value={formData.region}
              onChange={handleChange}
            >
              <option value="">Selecciona una región</option>
              {CHILEAN_REGIONS.map((region) => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Código Postal</label>
          <input 
            type="text" 
            name="postalCode" 
            placeholder="Ej: 8320000"
            maxLength={7}
            className="w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary border-gray-300"
            value={formData.postalCode}
            onChange={handleChange}
          />
          <p className="text-xs text-gray-500">Código postal de 7 dígitos (opcional)</p>
        </div>
      </div>

      {/* Additional Notes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Notas Adicionales</h3>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Instrucciones de Entrega (Opcional)</label>
          <textarea 
            name="notes" 
            rows={3}
            placeholder="Ej: Por favor tocar el timbre, dejar en conserjería, etc."
            className="w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary border-gray-300 resize-none"
            value={formData.notes}
            onChange={handleChange}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <button 
        type="submit" 
        disabled={loading}
        className="btn btn-primary w-full mt-6 py-3 font-bold text-white rounded-md hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Procesando...' : 'Confirmar Pedido'}
      </button>

      <p className="text-xs text-gray-500 text-center mt-4">
        * Campos obligatorios
      </p>
    </form>
  );
}
