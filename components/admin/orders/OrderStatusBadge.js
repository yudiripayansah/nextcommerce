import { ORDER_STATUSES } from '@/constants'

export default function OrderStatusBadge({ status }) {
  const found = ORDER_STATUSES.find((s) => s.value === status)
  const color = found?.color || 'bg-gray-100 text-gray-700'
  const label = found?.label || status
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
      {label}
    </span>
  )
}
