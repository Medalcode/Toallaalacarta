/**
 * Export Utilities
 * Functions to export data to CSV and Excel formats
 */

interface Order {
  $id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_rut: string;
  status: string;
  total_price: number;
  payment_status: string;
  shipping_address: any;
  items: any[];
  tracking_number?: string;
  $createdAt: string;
}

/**
 * Convert orders to CSV format
 */
export function ordersToCSV(orders: Order[]): string {
  // CSV Headers
  const headers = [
    'Número de Orden',
    'Fecha',
    'Cliente',
    'Email',
    'RUT',
    'Estado',
    'Estado de Pago',
    'Total',
    'Dirección',
    'Ciudad',
    'Teléfono',
    'Tracking',
    'Productos',
  ];

  // Convert orders to rows
  const rows = orders.map(order => {
    const date = new Date(order.$createdAt).toLocaleDateString('es-CL');
    const address = order.shipping_address;
    const products = order.items.map((item: any) => 
      `${item.title} (x${item.quantity})`
    ).join('; ');

    return [
      order.order_number,
      date,
      order.customer_name,
      order.customer_email,
      order.customer_rut,
      order.status,
      order.payment_status,
      order.total_price,
      address?.address || '',
      address?.city || '',
      address?.phone || '',
      order.tracking_number || '',
      products,
    ];
  });

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => {
      // Escape cells that contain commas or quotes
      const cellStr = String(cell);
      if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
        return `"${cellStr.replace(/"/g, '""')}"`;
      }
      return cellStr;
    }).join(','))
  ].join('\n');

  return csvContent;
}

/**
 * Download CSV file
 */
export function downloadCSV(csvContent: string, filename: string = 'pedidos.csv'): void {
  // Add BOM for Excel UTF-8 support
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * Generate filename with date
 */
export function generateExportFilename(prefix: string = 'pedidos', extension: string = 'csv'): string {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
  const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
  return `${prefix}_${dateStr}_${timeStr}.${extension}`;
}

/**
 * Export orders with filters
 */
export interface ExportOptions {
  status?: string;
  startDate?: Date;
  endDate?: Date;
  searchQuery?: string;
}

export function filterOrdersForExport(orders: Order[], options: ExportOptions = {}): Order[] {
  let filtered = [...orders];

  // Filter by status
  if (options.status && options.status !== 'all') {
    filtered = filtered.filter(order => order.status === options.status);
  }

  // Filter by date range
  if (options.startDate) {
    filtered = filtered.filter(order => 
      new Date(order.$createdAt) >= options.startDate!
    );
  }

  if (options.endDate) {
    filtered = filtered.filter(order => 
      new Date(order.$createdAt) <= options.endDate!
    );
  }

  // Filter by search query
  if (options.searchQuery) {
    const query = options.searchQuery.toLowerCase();
    filtered = filtered.filter(order =>
      order.order_number.toLowerCase().includes(query) ||
      order.customer_name.toLowerCase().includes(query) ||
      order.customer_email.toLowerCase().includes(query) ||
      order.customer_rut.toLowerCase().includes(query)
    );
  }

  return filtered;
}

/**
 * Get export statistics
 */
export function getExportStats(orders: Order[]) {
  const total = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total_price, 0);
  const averageOrderValue = total > 0 ? totalRevenue / total : 0;

  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    total,
    totalRevenue,
    averageOrderValue,
    statusCounts,
  };
}

/**
 * Format currency for export
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  }).format(amount);
}

/**
 * Format date for export
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('es-CL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}
