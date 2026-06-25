import { formatCurrency } from '@/lib/helpers'

export default function CustomerCard({ customer }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold text-gray-900">{customer.name}</p>
          <p className="text-sm text-gray-500">{customer.whatsapp}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Total Pesanan</p>
          <p className="font-bold text-gray-900">{customer.totalOrders}</p>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-sm">
        <span className="text-gray-500">Total Belanja</span>
        <span className="font-medium text-gray-900">{formatCurrency(customer.totalSpent || 0)}</span>
      </div>
    </div>
  )
}
