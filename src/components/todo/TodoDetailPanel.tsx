import { useState } from 'react'
import {
  X,
  Calendar,
  Plus,
  Trash2,
  CheckSquare,
  Square,
  FileText,
  ListChecks,
} from 'lucide-react'
import type { Todo, ChecklistItem, Priority, TodoStatus } from '#/types/todo'
import { useTodos } from '#/context/TodoContext'
import { useCategories } from '#/context/CategoryContext'
import { PrioritySelector } from '#/components/ui/PrioritySelector'
import { StatusSelector, StatusBadge } from '#/components/ui/StatusSelector'
import { CategoryBadge } from '#/components/category/CategoryBadge'

interface TodoDetailPanelProps {
  todo: Todo
  onClose: () => void
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function TodoDetailPanel({ todo, onClose }: TodoDetailPanelProps) {
  const { updateTodo } = useTodos()
  const { categories } = useCategories()
  const [notes, setNotes] = useState(todo.notes || '')
  const [newChecklistItem, setNewChecklistItem] = useState('')
  const [activeTab, setActiveTab] = useState<'notes' | 'checklist'>('checklist')

  const category = categories.find((c) => c.id === todo.categoryId)
  const checklist = todo.checklist || []
  const checkedCount = checklist.filter((item) => item.checked).length

  const handleNotesChange = (value: string) => {
    setNotes(value)
    updateTodo(todo.id, { notes: value })
  }

  const handleAddChecklistItem = () => {
    if (!newChecklistItem.trim()) return
    const newItem: ChecklistItem = {
      id: generateId(),
      text: newChecklistItem.trim(),
      checked: false,
    }
    updateTodo(todo.id, { checklist: [...checklist, newItem] })
    setNewChecklistItem('')
  }

  const handleToggleChecklistItem = (itemId: string) => {
    const updated = checklist.map((item) =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    )
    updateTodo(todo.id, { checklist: updated })
  }

  const handleDeleteChecklistItem = (itemId: string) => {
    const updated = checklist.filter((item) => item.id !== itemId)
    updateTodo(todo.id, { checklist: updated })
  }

  const handleUpdateChecklistItemText = (itemId: string, text: string) => {
    const updated = checklist.map((item) =>
      item.id === itemId ? { ...item, text } : item
    )
    updateTodo(todo.id, { checklist: updated })
  }

  const handleStatusChange = (status: TodoStatus) => {
    updateTodo(todo.id, { status })
  }

  const handlePriorityChange = (priority: Priority) => {
    updateTodo(todo.id, { priority })
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-4 border-b border-slate-700">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-white truncate">
              {todo.title}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <StatusBadge status={todo.status} showLabel size="sm" />
              {category && (
                <CategoryBadge name={category.name} color={category.color} />
              )}
              {todo.dueDate && (
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Calendar className="w-3 h-3" />
                  {new Date(todo.dueDate).toLocaleDateString('ko-KR')}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-700 rounded-lg transition-colors ml-2"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Status & Priority Quick Edit */}
        <div className="p-4 border-b border-slate-700 space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">
              상태
            </label>
            <StatusSelector value={todo.status} onChange={handleStatusChange} size="sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">
              우선순위
            </label>
            <PrioritySelector value={todo.priority} onChange={handlePriorityChange} size="sm" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700">
          <button
            onClick={() => setActiveTab('checklist')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'checklist'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ListChecks className="w-4 h-4" />
            체크리스트
            {checklist.length > 0 && (
              <span className="text-xs opacity-70">
                ({checkedCount}/{checklist.length})
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'notes'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            노트
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'checklist' ? (
            <div className="space-y-2">
              {/* Add new item */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newChecklistItem}
                  onChange={(e) => setNewChecklistItem(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddChecklistItem()
                  }}
                  placeholder="새 항목 추가..."
                  className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={handleAddChecklistItem}
                  disabled={!newChecklistItem.trim()}
                  className="p-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Progress bar */}
              {checklist.length > 0 && (
                <div className="mt-4 mb-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>진행률</span>
                    <span>{Math.round((checkedCount / checklist.length) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-500 transition-all duration-300"
                      style={{ width: `${(checkedCount / checklist.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Checklist items */}
              <div className="space-y-1 mt-4">
                {checklist.length === 0 ? (
                  <p className="text-center text-slate-500 py-8">
                    체크리스트가 비어있습니다
                  </p>
                ) : (
                  checklist.map((item) => (
                    <div
                      key={item.id}
                      className="group flex items-center gap-2 p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                    >
                      <button
                        onClick={() => handleToggleChecklistItem(item.id)}
                        className="text-slate-400 hover:text-cyan-400 transition-colors"
                      >
                        {item.checked ? (
                          <CheckSquare className="w-5 h-5 text-cyan-500" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </button>
                      <input
                        type="text"
                        value={item.text}
                        onChange={(e) =>
                          handleUpdateChecklistItemText(item.id, e.target.value)
                        }
                        className={`flex-1 bg-transparent border-none outline-none text-white ${
                          item.checked ? 'line-through text-slate-500' : ''
                        }`}
                      />
                      <button
                        onClick={() => handleDeleteChecklistItem(item.id)}
                        className="p-1 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div>
              <textarea
                value={notes}
                onChange={(e) => handleNotesChange(e.target.value)}
                placeholder="메모, 참고사항, 진행상황 등을 자유롭게 작성하세요..."
                className="w-full h-64 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}
