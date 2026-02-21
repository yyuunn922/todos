import type { Priority } from '#/types/todo'

interface PrioritySelectorProps {
  value: Priority
  onChange: (priority: Priority) => void
  size?: 'sm' | 'md'
}

const priorities: { value: Priority; label: string; color: string }[] = [
  { value: 'high', label: '높음', color: '#ef4444' },
  { value: 'medium', label: '보통', color: '#eab308' },
  { value: 'low', label: '낮음', color: '#22c55e' },
]

export function PrioritySelector({
  value,
  onChange,
  size = 'md',
}: PrioritySelectorProps) {
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5'

  return (
    <div className="flex gap-1">
      {priorities.map((p) => (
        <button
          key={p.value}
          type="button"
          onClick={() => onChange(p.value)}
          className={`rounded-lg font-medium transition-all ${sizeClasses} ${
            value === p.value
              ? 'ring-2 ring-offset-1 ring-offset-slate-900'
              : 'opacity-50 hover:opacity-75'
          }`}
          style={{
            backgroundColor: `${p.color}20`,
            color: p.color,
            ...(value === p.value ? { ringColor: p.color } : {}),
          }}
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}

export function PriorityBadge({
  priority,
  size = 'sm',
}: {
  priority: Priority
  size?: 'sm' | 'md'
}) {
  const p = priorities.find((pr) => pr.value === priority)!
  const sizeClasses = size === 'sm' ? 'w-2 h-2' : 'w-3 h-3'

  return (
    <span
      className={`${sizeClasses} rounded-full`}
      style={{ backgroundColor: p.color }}
      title={p.label}
    />
  )
}
