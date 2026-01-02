import React, { useState, useEffect } from 'react';
import { databases, APPWRITE_CONFIG, account } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { BiUser, BiShoppingBag } from "react-icons/bi";

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
           {orders.length === 0 ? (
             <p className="text-gray-500">No tienes pedidos registrados aún.</p>
           ) : (
             <div className="overflow-x-auto">
               <table className="w-full text-left text-sm">
                 <thead className="bg-gray-50 uppercase text-gray-500">
                    <tr>
                        <th className="px-4 py-3">N° Orden</th>
                        <th className="px-4 py-3">Fecha</th>
                        <th className="px-4 py-3">Total</th>
                        <th className="px-4 py-3">Estado</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y">
                    {orders.map((order: any) => (
                        <tr key={order.$id}>
                            <td className="px-4 py-3 font-medium text-gray-900">{order.$id}</td>
                            <td className="px-4 py-3">{new Date(order.$createdAt).toLocaleDateString()}</td>
                            <td className="px-4 py-3">${order.total_price ? order.total_price.toLocaleString('es-CL') : '0'}</td>
                            <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                    order.status === 'paid' ? 'bg-green-100 text-green-800' : 
                                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {order.status || 'Pendiente'}
                                </span>
                            </td>
                        </tr>
                    ))}
                 </tbody>
               </table>
             </div>
           )}
        </div>
      )}
    </div>
  );
}
