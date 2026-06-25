import { formatCurrency } from '@/lib/helpers'
import OrderStatusBadge from './OrderStatusBadge'

export default function OrderDetailCard({ order }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-sm text-gray-500">{order.orderNumber}</p>
          <h2 className="text-lg font-bold text-gray-900">{order.customerName}</h2>
          <p className="text-sm text-gray-500">{order.customerWhatsapp}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {order.notes && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm font-medium text-yellow-800 mb-1">Catatan</p>
          <p className="text-sm text-yellow-700">{order.notes}</p>
        </div>
      )}

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Produk</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Harga</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Qty</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {order.items?.map((item, i) => (
              <tr key={i}>
                <td className="px-4 py-3">
                  <p className="font-medium">{item.productTitle}</p>
                  {item.variantTitle && <p className="text-xs text-gray-500">{item.variantTitle}</p>}
                </td>
                <td className="px-4 py-3 text-right">{formatCurrency(item.price)}</td>
                <td className="px-4 py-3 text-right">{item.quantity}</td>
                <td className="px-4 py-3 text-right font-medium">{formatCurrency(item.subtotal)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td colSpan={3} className="px-4 py-3 text-right font-semibold">Total</td>
              <td className="px-4 py-3 text-right font-bold">{formatCurrency(order.totalAmount)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
