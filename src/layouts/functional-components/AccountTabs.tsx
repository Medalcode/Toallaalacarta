import React, { useState, useEffect } from 'react';
import { databases, APPWRITE_CONFIG, account } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { BiUser, BiShoppingBag } from "react-icons/bi";
import { formatRut } from '@/lib/rut';

export default function AccountTabs({ user: initialUser }: { user: any }) {
  const [user, setUser] = useState<any>(initialUser);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  
  // Profile State
  const [formData, setFormData] = useState({
    name: user?.firstName || '',
    phone: user?.phone || '',
    email: user?.email || '',
    password: ''
  });
  const [profileMsg, setProfileMsg] = useState('');

  // 1. Fetch Real User Data on Mount (Client Side)
  useEffect(() => {
    const getRealUser = async () => {
        try {
            const realUser = await account.get();
            setUser({
                firstName: realUser.name,
                email: realUser.email,
                phone: realUser.phone,
                id: realUser.$id
            });
            // Update form data with real values
            setFormData(prev => ({
                ...prev,
                name: realUser.name,
                email: realUser.email,
                phone: realUser.phone
            }));
        } catch (e) {
            console.error("Could not fetch auth user", e);
        }
    };
    getRealUser();
  }, []);

  // Fetch Orders
  useEffect(() => {
    // Only fetch if tab is active AND we have a valid real email
    if (activeTab === 'orders' && user?.email && user.email !== 'user@example.com') {
      setLoadingOrders(true);
      const fetchOrders = async () => {
         try {
           const res = await databases.listDocuments(
             APPWRITE_CONFIG.DATABASE_ID,
             APPWRITE_CONFIG.COLLECTION_ORDERS,
             [
               Query.equal('customer_email', user.email),
               Query.orderDesc('$createdAt')
             ]
           );
           setOrders(res.documents);
         } catch(e) {
           console.error("Error fetching orders", e);
         } finally {
            setLoadingOrders(false);
         }
      };
      
      fetchOrders();
    }
  }, [activeTab, user]);

  // Update form data when user changes
  useEffect(() => {
     if(user) {
         setFormData(prev => ({
             ...prev,
             name: user.firstName || '',
             email: user.email || '',
             phone: user.phone || ''
         }));
     }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg('Actualizando...');
    try {
        const response = await fetch('/api/profile/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: formData.name !== user.firstName ? formData.name : undefined,
                phone: formData.phone !== user.phone ? formData.phone : undefined,
                password: formData.password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al actualizar perfil');
        }

        // Update local state to reflect change immediately if successful
        if(formData.name) {
             setUser((prev: any) => ({ ...prev, firstName: formData.name }));
        }
        if(formData.phone) {
             setUser((prev: any) => ({ ...prev, phone: formData.phone }));
        }
        
        setProfileMsg('Perfil actualizado correctamente.');
    } catch (err: any) {
        setProfileMsg('Error: ' + err.message);
    }
  };

  return (
    <div>
      {/* Tabs Header */}
      <div className="flex border-b mb-6">
        <button 
          className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${activeTab === 'profile' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('profile')}
        >
          <BiUser /> Mis Datos
        </button>
        <button 
          className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${activeTab === 'orders' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('orders')}
        >
          <BiShoppingBag /> Mis Pedidos
        </button>
      </div>

      {/* Profile Content */}
      {activeTab === 'profile' && (
        <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-lg">
           <div>
             <label className="block text-sm font-medium mb-1">RUT</label>
             <input 
               type="text" 
               value={user?.id ? formatRut(user.id) : ''} 
               disabled 
               className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 cursor-not-allowed" 
             />
             <p className="text-xs text-gray-500 mt-1">Tu RUT es tu identificador único y no se puede cambiar.</p>
           </div>
           
           <div>
             <label className="block text-sm font-medium mb-1">Email</label>
             <input type="email" value={formData.email} disabled className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 cursor-not-allowed" />
             <p className="text-xs text-gray-500 mt-1">El email no se puede cambiar directamente.</p>
           </div>
           
           <div>
             <label className="block text-sm font-medium mb-1">Nombre</label>
             <input 
                type="text" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-primary focus:border-primary" 
             />
           </div>

           {/* 
           <div>
             <label className="block text-sm font-medium mb-1">Teléfono</label>
             <input 
                type="tel" 
                value={formData.phone} 
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-primary focus:border-primary" 
             />
           </div>
           */}
           
           <button type="submit" className="btn btn-primary">Guardar Cambios</button>
           
           {profileMsg && <p className={`mt-2 text-sm font-medium ${profileMsg.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>{profileMsg}</p>}
        </form>
      )}

      {/* Orders Content */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
           {loadingOrders ? (
             <div className="text-center py-12">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
               <p className="text-gray-600">Cargando pedidos...</p>
             </div>
           ) : orders.length === 0 ? (
             <div className="text-center py-12 bg-gray-50 rounded-lg">
               <BiShoppingBag className="mx-auto text-gray-400 mb-4" size={48} />
               <p className="text-gray-500 mb-4">No tienes pedidos registrados aún.</p>
               <a href="/products" className="btn btn-primary">
                 Ver Productos
               </a>
             </div>
           ) : (
             <OrdersList orders={orders} />
           )}
        </div>
      )}
    </div>
  );
}

// Orders List Component
function OrdersList({ orders }: { orders: any[] }) {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  
  return (
    <>
      <div className="grid gap-4">
        {orders.map((order: any) => (
          <OrderCard 
            key={order.$id} 
            order={order} 
            onClick={() => setSelectedOrder(order)}
          />
        ))}
      </div>
      
      {selectedOrder && (
        <OrderDetailModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}
    </>
  );
}

// Order Card Component
function OrderCard({ order, onClick }: { order: any; onClick: () => void }) {
  const { getStatusLabel, getStatusColor, formatPrice } = require('@/lib/order-utils');
  
  return (
    <div 
      className="bg-white border rounded-lg p-6 hover:shadow-md transition cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-mono font-bold text-lg text-primary">
              {order.order_number || order.$id.slice(0, 8)}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
              {getStatusLabel(order.status)}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {new Date(order.$createdAt).toLocaleDateString('es-CL', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">
            {formatPrice(order.total_price || 0)}
          </p>
          <button className="text-primary hover:text-primary/80 text-sm font-medium mt-2">
            Ver Detalles →
          </button>
        </div>
      </div>
    </div>
  );
}

// Order Detail Modal Component
function OrderDetailModal({ order, onClose }: { order: any; onClose: () => void }) {
  const { formatPrice, getStatusLabel, getStatusColor, getPaymentStatusLabel, getPaymentStatusColor } = require('@/lib/order-utils');
  const { BiX } = require('react-icons/bi');
  
  const shippingAddress = order.shipping_address_json ? JSON.parse(order.shipping_address_json) : {};
  const items = order.items_json ? JSON.parse(order.items_json) : [];
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Detalles del Pedido</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <BiX size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Info */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Información del Pedido</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Número de Orden:</span>
                <p className="font-mono font-bold text-primary text-lg">
                  {order.order_number || order.$id}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Fecha:</span>
                <p className="font-medium">
                  {new Date(order.$createdAt).toLocaleDateString('es-CL', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Estado:</span>
                <p>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </p>
              </div>
              <div>
                <span className="text-gray-600">Estado de Pago:</span>
                <p>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(order.payment_status)}`}>
                    {getPaymentStatusLabel(order.payment_status)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {shippingAddress.address && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Dirección de Envío</h3>
              <div className="bg-gray-50 p-4 rounded-lg text-sm">
                <p className="font-medium">{shippingAddress.name}</p>
                <p>{shippingAddress.address}</p>
                <p>{shippingAddress.city}{shippingAddress.region ? `, ${shippingAddress.region}` : ''}</p>
                {shippingAddress.postal_code && <p>CP: {shippingAddress.postal_code}</p>}
                <p className="mt-2">{shippingAddress.phone}</p>
              </div>
            </div>
          )}

          {/* Items */}
          {items.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Productos</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Producto</th>
                      <th className="px-4 py-2 text-center">Cantidad</th>
                      <th className="px-4 py-2 text-right">Precio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {items.map((item: any, idx: number) => (
                      <tr key={idx}>
                        <td className="px-4 py-2">
                          {item.title}
                          {item.variantTitle && <span className="text-gray-500"> - {item.variantTitle}</span>}
                        </td>
                        <td className="px-4 py-2 text-center">{item.quantity}</td>
                        <td className="px-4 py-2 text-right font-medium">{formatPrice(item.price)}</td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-bold">
                      <td colSpan={2} className="px-4 py-3 text-right">Total:</td>
                      <td className="px-4 py-3 text-right text-lg text-primary">
                        {formatPrice(order.total_price)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tracking */}
          {order.tracking_number && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Información de Envío</h3>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p className="text-sm text-blue-900">
                  <span className="font-medium">Número de Seguimiento:</span>{' '}
                  <span className="font-mono font-bold">{order.tracking_number}</span>
                </p>
              </div>
            </div>
          )}

          {/* Notes */}
          {order.notes && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Notas</h3>
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-sm">
                {order.notes}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
