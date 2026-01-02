import React, { useState, useEffect } from 'react';
import { BiPackage, BiTime, BiCar, BiCheck, BiX, BiDollar, BiSearch } from 'react-icons/bi';
import { getStatusLabel, getStatusColor, formatPrice, getPaymentStatusLabel, getPaymentStatusColor } from '@/lib/order-utils';
import { formatRut } from '@/lib/rut';

interface Order {
  $id: string;
  $createdAt: string;
  order_number: string;
  customer_email: string;
  customer_name: string;
  customer_rut: string;
  total_price: number;
  status: string;
  payment_status: string;
  shipping_address_json: string;
  items_json: string;
  notes: string;
  tracking_number: string | null;
}

interface Stats {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export default function AdminDashboard({ token }: { token: string }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Fetch stats and orders
  useEffect(() => {
    fetchData();
  }, [selectedStatus, searchQuery]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch stats
      const statsRes = await fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const statsData = await statsRes.json();
      setStats(statsData);

      // Fetch orders
      const ordersRes = await fetch(`/api/admin/orders?status=${selectedStatus}&search=${searchQuery}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const ordersData = await ordersRes.json();
      setOrders(ordersData.orders || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/update-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderId, status: newStatus })
      });

      if (res.ok) {
        fetchData(); // Refresh data
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<BiPackage className="text-blue-600" />}
            label="Total Pedidos"
            value={stats.total}
            bgColor="bg-blue-50"
          />
          <StatCard
            icon={<BiTime className="text-yellow-600" />}
            label="Pendientes"
            value={stats.pending}
            bgColor="bg-yellow-50"
          />
          <StatCard
            icon={<BiCar className="text-purple-600" />}
            label="En Envío"
            value={stats.shipped}
            bgColor="bg-purple-50"
          />
          <StatCard
            icon={<BiDollar className="text-green-600" />}
            label="Ingresos Totales"
            value={formatPrice(stats.totalRevenue)}
            bgColor="bg-green-50"
          />
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por email, RUT o número de orden..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-primary focus:border-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            className="px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="processing">En Proceso</option>
            <option value="shipped">Enviado</option>
            <option value="delivered">Entregado</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orden
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No se encontraron pedidos
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.$id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.order_number}</div>
                      <div className="text-xs text-gray-500">{order.$id.slice(0, 8)}...</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{order.customer_name}</div>
                      <div className="text-xs text-gray-500">{order.customer_email}</div>
                      {order.customer_rut && (
                        <div className="text-xs text-gray-500">{formatRut(order.customer_rut)}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.$createdAt).toLocaleDateString('es-CL')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatPrice(order.total_price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status as any)}`}>
                        {getStatusLabel(order.status as any)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-primary hover:text-primary/80"
                      >
                        Ver Detalles
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, label, value, bgColor }: any) {
  return (
    <div className={`${bgColor} rounded-lg p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
}

// Order Detail Modal Component
function OrderDetailModal({ order, onClose, onStatusUpdate }: any) {
  const [newStatus, setNewStatus] = useState(order.status);
  const [trackingNumber, setTrackingNumber] = useState(order.tracking_number || '');

  const shippingAddress = order.shipping_address_json ? JSON.parse(order.shipping_address_json) : {};
  const items = order.items_json ? JSON.parse(order.items_json) : [];

  const handleUpdate = () => {
    onStatusUpdate(order.$id, newStatus, trackingNumber);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Número de Orden:</span>
                <p className="font-mono font-bold text-primary">{order.order_number}</p>
              </div>
              <div>
                <span className="text-gray-600">Fecha:</span>
                <p className="font-medium">{new Date(order.$createdAt).toLocaleString('es-CL')}</p>
              </div>
              <div>
                <span className="text-gray-600">Total:</span>
                <p className="font-bold text-lg">{formatPrice(order.total_price)}</p>
              </div>
              <div>
                <span className="text-gray-600">Estado de Pago:</span>
                <p>
                  <span className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusColor(order.payment_status)}`}>
                    {getPaymentStatusLabel(order.payment_status)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Cliente</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Nombre:</span>
                <p className="font-medium">{order.customer_name}</p>
              </div>
              <div>
                <span className="text-gray-600">Email:</span>
                <p className="font-medium">{order.customer_email}</p>
              </div>
              <div>
                <span className="text-gray-600">RUT:</span>
                <p className="font-medium">{formatRut(order.customer_rut)}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
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

          {/* Items */}
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
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Notas del Cliente</h3>
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-sm">
                {order.notes}
              </div>
            </div>
          )}

          {/* Update Status */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Actualizar Estado</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Estado del Pedido</label>
                <select
                  className="w-full px-4 py-2 border rounded-lg"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="pending">Pendiente</option>
                  <option value="processing">En Proceso</option>
                  <option value="shipped">Enviado</option>
                  <option value="delivered">Entregado</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>

              {newStatus === 'shipped' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Número de Seguimiento</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Ej: CH123456789CL"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                  />
                </div>
              )}

              <button
                onClick={handleUpdate}
                className="btn btn-primary w-full"
              >
                Actualizar Estado
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
