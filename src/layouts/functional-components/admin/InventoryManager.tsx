import React, { useState, useEffect } from 'react';
import { BiPackage, BiTrendingDown, BiTrendingUp, BiEdit, BiHistory } from 'react-icons/bi';

interface InventoryItem {
  $id: string;
  product_id: string;
  product_title: string;
  variant_title?: string;
  sku?: string;
  quantity: number;
  low_stock_threshold: number;
  reorder_point: number;
  last_updated_by?: string;
}

interface InventoryStats {
  totalItems: number;
  totalUnits: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export default function InventoryManager({ token }: { token: string }) {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [newQuantity, setNewQuantity] = useState<number>(0);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      // TODO: Implement API endpoints
      // For now, show mock data
      console.log('Fetching inventory...');
      
      // Mock data
      setInventory([]);
      setStats({
        totalItems: 0,
        totalUnits: 0,
        lowStockCount: 0,
        outOfStockCount: 0,
      });
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId: string) => {
    try {
      // TODO: Implement update API
      console.log(`Updating ${itemId} to ${newQuantity}`);
      setEditingItem(null);
      fetchInventory();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity === 0) return { label: 'Sin Stock', color: 'text-red-600 bg-red-50' };
    if (item.quantity <= item.reorder_point) return { label: 'Crítico', color: 'text-orange-600 bg-orange-50' };
    if (item.quantity <= item.low_stock_threshold) return { label: 'Bajo', color: 'text-yellow-600 bg-yellow-50' };
    return { label: 'Normal', color: 'text-green-600 bg-green-50' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando inventario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestión de Inventario</h1>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Productos</p>
                <p className="text-2xl font-bold">{stats.totalItems}</p>
              </div>
              <BiPackage className="text-blue-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Unidades</p>
                <p className="text-2xl font-bold">{stats.totalUnits}</p>
              </div>
              <BiTrendingUp className="text-green-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Stock Bajo</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.lowStockCount}</p>
              </div>
              <BiTrendingDown className="text-yellow-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sin Stock</p>
                <p className="text-2xl font-bold text-red-600">{stats.outOfStockCount}</p>
              </div>
              <BiTrendingDown className="text-red-500" size={32} />
            </div>
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Cantidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <BiPackage size={48} className="text-gray-300 mb-4" />
                      <p className="text-lg font-medium mb-2">No hay productos en inventario</p>
                      <p className="text-sm">
                        El inventario se creará automáticamente cuando agregues productos.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                inventory.map((item) => {
                  const status = getStockStatus(item);
                  const isEditing = editingItem === item.$id;

                  return (
                    <tr key={item.$id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{item.product_title}</div>
                        {item.variant_title && (
                          <div className="text-xs text-gray-500">{item.variant_title}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{item.sku || '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <input
                            type="number"
                            value={newQuantity}
                            onChange={(e) => setNewQuantity(parseInt(e.target.value) || 0)}
                            className="w-20 px-2 py-1 border rounded"
                            min="0"
                          />
                        ) : (
                          <div className="text-sm font-medium text-gray-900">{item.quantity}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => handleUpdateQuantity(item.$id)}
                                className="text-green-600 hover:text-green-900"
                              >
                                Guardar
                              </button>
                              <button
                                onClick={() => setEditingItem(null)}
                                className="text-gray-600 hover:text-gray-900"
                              >
                                Cancelar
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingItem(item.$id);
                                setNewQuantity(item.quantity);
                              }}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <BiEdit size={20} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <BiPackage className="h-5 w-5 text-blue-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Nota:</strong> El inventario se actualiza automáticamente cuando se crean pedidos.
              Los administradores pueden hacer ajustes manuales aquí.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
