import { Circle, Clock, Eye, CheckCircle2 } from 'lucide-react'
import type { TodoStatus } from '#/types/todo'

interface StatusSelectorProps {
  value: TodoStatus
  onChange: (status: TodoStatus) => void
  size?: 'sm' | 'md'
}

export const statuses: { value: TodoStatus; label: string; color: string; icon: typeof Circle }[] = [
  { value: 'pending', label: '대기중', color: '#94a3b8', icon: Clock },
  { value: 'in_progress', label: '진행중', color: '#3b82f6', icon: Circle },
  { value: 'needs_review', label: '체크필요', color: '#f97316', icon: Eye },
  { value: 'completed', label: '완료', color: '#22c55e', icon: CheckCircle2 },
]

export function StatusSelector({
  value,
  onChange,
  size = 'md',
}: StatusSelectorProps) {
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5'

  return (
    <div className="flex gap-1 flex-wrap">
      {statuses.map((s) => {
        const Icon = s.icon
        return (
          <button
            key={s.value}
            type="button"
            onClick={() => onChange(s.value)}
            className={`flex items-center gap-1.5 rounded-lg font-medium transition-all ${sizeClasses} ${
              value === s.value
                ? 'ring-2 ring-offset-1 ring-offset-slate-900'
                : 'opacity-50 hover:opacity-75'
            }`}
            style={{
              backgroundColor: `${s.color}20`,
              color: s.color,
              ...(value === s.value ? { ringColor: s.color } : {}),
            }}
          >
            <Icon className="w-3.5 h-3.5" />
            {s.label}
          </button>
        )
      })}
    </div>
  )
}

export function StatusBadge({
  status,
  size = 'sm',
  showLabel = false,
}: {
  status: TodoStatus
  size?: 'sm' | 'md'
  showLabel?: boolean
}) {
  const s = statuses.find((st) => st.value === status)!
  const Icon = s.icon
  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'

  if (showLabel) {
    return (
      <span
        className="inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full font-medium"
        style={{ backgroundColor: `${s.color}20`, color: s.color }}
      >
        <Icon className="w-3 h-3" />
        {s.label}
      </span>
    )
  }

  return (
    <Icon
      className={`${iconSize} cursor-pointer hover:scale-110 transition-transform`}
      style={{ color: s.color }}
      title={s.label}
    />
  )
}
