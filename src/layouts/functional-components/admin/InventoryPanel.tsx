import React, { useState, useEffect } from 'react';
import { BiSearch, BiCheckCircle, BiXCircle, BiRefresh } from 'react-icons/bi';
import { formatPrice } from '@/lib/order-utils';

export default function InventoryPanel({ token }: { token: string }) {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/inventory', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setInventory(data);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [token]);

  // Filter inventory based on search query
  const filteredInventory = inventory.filter(product => 
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.vendor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.variants.some((v: any) => v.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-bold">Estado de Inventario (Shopify)</h2>
        <button 
          onClick={fetchInventory}
          className="flex items-center gap-2 text-primary hover:text-primary/80"
        >
          <BiRefresh size={20} /> Actualizar
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="relative mb-6">
          <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre de producto o variante..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-primary focus:border-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variante</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Precio</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Estado (Disponibilidad)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No se encontraron productos en el inventario.
                  </td>
                </tr>
              ) : (
                filteredInventory.map((product) => (
                  <React.Fragment key={product.id}>
                    {product.variants.map((variant: any, idx: number) => (
                      <tr key={variant.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          {idx === 0 ? (
                            <div>
                              <div className="font-medium text-gray-900">{product.title}</div>
                              <div className="text-xs text-gray-500">{product.vendor}</div>
                            </div>
                          ) : null}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {variant.title !== 'Default Title' ? variant.title : '-'}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-right">
                          {formatPrice(parseFloat(variant.price?.amount || 0))}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {variant.availableForSale ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <BiCheckCircle /> En Stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <BiXCircle /> Agotado
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
