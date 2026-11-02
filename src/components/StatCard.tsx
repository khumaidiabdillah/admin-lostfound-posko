import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: number | string
  color?: 'blue' | 'amber' | 'emerald' | 'slate' | 'red'
  accentColor?: 'blue' | 'amber' | 'emerald' | 'slate' | 'red'
}

const colorMap = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
    value: 'text-blue-700',
  },
  amber: {
    bg: 'bg-amber-50',
    icon: 'text-amber-600',
    value: 'text-amber-700',
  },
  emerald: {
    bg: 'bg-emerald-50',
    icon: 'text-emerald-600',
    value: 'text-emerald-700',
  },
  slate: {
    bg: 'bg-slate-100',
    icon: 'text-slate-600',
    value: 'text-slate-700',
  },
  red: {
    bg: 'bg-red-50',
    icon: 'text-red-600',
    value: 'text-red-700',
  },
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  color,
  accentColor,
}: StatCardProps) {
  const chosenColor = accentColor || color || 'blue'
  const c = colorMap[chosenColor] || colorMap.blue

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-xs p-5">
      <div className="flex items-center gap-4">
        <div className={`w-11 h-11 ${c.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${c.icon}`} />
        </div>
        <div>
          <p className="text-sm text-[#475569] font-medium">{label}</p>
          <p className={`text-2xl font-bold tabular-nums ${c.value} mt-0.5`}>{value}</p>
        </div>
      </div>
    </div>
  )
}
