import { useState } from 'react'
import { Plus, Calendar, X } from 'lucide-react'
import type { Priority, TodoStatus } from '#/types/todo'
import { useTodos } from '#/context/TodoContext'
import { useCategories } from '#/context/CategoryContext'
import { PrioritySelector } from '#/components/ui/PrioritySelector'
import { StatusSelector } from '#/components/ui/StatusSelector'

interface TodoFormProps {
  parentId?: string
  onClose?: () => void
  compact?: boolean
}

export function TodoForm({ parentId, onClose, compact }: TodoFormProps) {
  const { addTodo, todos } = useTodos()
  const { categories, selectedCategoryId } = useCategories()
  const [isExpanded, setIsExpanded] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [status, setStatus] = useState<TodoStatus>('pending')
  const [dueDate, setDueDate] = useState('')
  const [categoryId, setCategoryId] = useState(selectedCategoryId || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsSubmitting(true)
    try {
      const order = todos.filter((t) => t.parentId === parentId).length
      await addTodo({
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        priority,
        categoryId: categoryId || undefined,
        parentId,
        dueDate: dueDate || undefined,
        order,
      })
      setTitle('')
      setDescription('')
      setPriority('medium')
      setStatus('pending')
      setDueDate('')
      setIsExpanded(false)
      onClose?.()
    } finally {
      setIsSubmitting(false)
    }
  }

  if (compact && !isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full flex items-center gap-2 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
      >
        <Plus className="w-5 h-5" />
        <span>서브태스크 추가</span>
      </button>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-slate-800/50 rounded-xl border border-slate-700 p-4 ${
        compact ? '' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="할 일을 입력하세요..."
            className="w-full px-0 py-1 bg-transparent text-white placeholder-slate-500 focus:outline-none text-lg"
            autoFocus
          />

          {!compact && (
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="설명 (선택사항)"
              className="w-full px-0 py-1 bg-transparent text-slate-300 placeholder-slate-500 focus:outline-none resize-none text-sm"
              rows={2}
            />
          )}

          <div className="flex flex-wrap items-center gap-4">
            <PrioritySelector
              value={priority}
              onChange={setPriority}
              size="sm"
            />

            {!compact && (
              <>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="bg-transparent text-sm text-slate-300 focus:outline-none"
                  />
                </div>

                {!parentId && categories.length > 0 && (
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="bg-slate-700 text-sm text-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="">카테고리 없음</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                )}
              </>
            )}
          </div>
        </div>

        {compact && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-slate-700 rounded"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        )}
      </div>

      <div className="flex justify-end gap-2 mt-4">
        {(compact || onClose) && (
          <button
            type="button"
            onClick={() => {
              setIsExpanded(false)
              onClose?.()
            }}
            className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
          >
            취소
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || !title.trim()}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          추가
        </button>
      </div>
    </form>
  )
}
