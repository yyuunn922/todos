import { Circle, Clock, Eye, CheckCircle2, ListTodo } from 'lucide-react'
import type { TodoStatus } from '#/types/todo'

type FilterType = 'all' | TodoStatus

interface FilterTabsProps {
  value: FilterType
  onChange: (filter: FilterType) => void
  counts?: Record<FilterType, number>
}

const tabs: { value: FilterType; label: string; color: string; icon: typeof Circle }[] = [
  { value: 'all', label: '전체', color: '#94a3b8', icon: ListTodo },
  { value: 'pending', label: '대기중', color: '#94a3b8', icon: Clock },
  { value: 'in_progress', label: '진행중', color: '#3b82f6', icon: Circle },
  { value: 'needs_review', label: '체크필요', color: '#f97316', icon: Eye },
  { value: 'completed', label: '완료', color: '#22c55e', icon: CheckCircle2 },
]

export function FilterTabs({ value, onChange, counts }: FilterTabsProps) {
  return (
    <div className="flex gap-1 bg-slate-800 p-1 rounded-lg flex-wrap">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = value === tab.value
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              isActive
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Icon
              className="w-3.5 h-3.5"
              style={{ color: isActive ? tab.color : undefined }}
            />
            <span>{tab.label}</span>
            {counts && (
              <span className="ml-1 text-xs opacity-60">
                {counts[tab.value]}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
