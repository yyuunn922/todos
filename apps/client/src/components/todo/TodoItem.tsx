import { useState, useRef, useEffect } from 'react'
import {
  GripVertical,
  ChevronRight,
  ChevronDown,
  Pencil,
  Trash2,
  Calendar,
  Plus,
  FileText,
} from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Todo, TodoStatus } from '#/types/todo'
import { useTodos } from '#/context/TodoContext'
import { useCategories } from '#/context/CategoryContext'
import { CategoryBadge } from '#/components/category/CategoryBadge'
import { StatusBadge, statuses } from '#/components/ui/StatusSelector'
import { TodoForm } from './TodoForm'
import { TodoEditModal } from './TodoEditModal'
import { TodoDetailPanel } from './TodoDetailPanel'

interface TodoItemProps {
  todo: Todo
  subtasks: Todo[]
  depth?: number
}

export function TodoItem({ todo, subtasks, depth = 0 }: TodoItemProps) {
  const { deleteTodo, updateTodo, todos } = useTodos()
  const { categories } = useCategories()
  const [isExpanded, setIsExpanded] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [showAddSubtask, setShowAddSubtask] = useState(false)
  const [showStatusMenu, setShowStatusMenu] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailPanel, setShowDetailPanel] = useState(false)
  const statusMenuRef = useRef<HTMLDivElement>(null)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (statusMenuRef.current && !statusMenuRef.current.contains(e.target as Node)) {
        setShowStatusMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const hasSubtasks = subtasks.length > 0
  const category = categories.find((c) => c.id === todo.categoryId)
  const completedSubtasks = subtasks.filter((s) => s.status === 'completed').length
  const isCompleted = todo.status === 'completed'
  const checklist = todo.checklist || []
  const checkedCount = checklist.filter((c) => c.checked).length
  const checklistProgress = checklist.length > 0 ? checkedCount / checklist.length : 0
  const hasNotes = !!todo.notes

  const priorityColors = {
    high: 'border-l-red-500',
    medium: 'border-l-yellow-500',
    low: 'border-l-green-500',
  }

  const handleStatusChange = (status: TodoStatus) => {
    updateTodo(todo.id, { status })
    setShowStatusMenu(false)
  }

  const handleDelete = () => {
    if (confirm('이 할 일을 삭제하시겠습니까?')) {
      deleteTodo(todo.id)
    }
  }

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      updateTodo(todo.id, { title: editTitle.trim() })
    }
    setIsEditing(false)
  }

  const formatDueDate = (date: string) => {
    const d = new Date(date)
    const today = new Date()
    const diff = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (diff < 0) return { text: '기한 지남', className: 'text-red-400' }
    if (diff === 0) return { text: '오늘', className: 'text-yellow-400' }
    if (diff === 1) return { text: '내일', className: 'text-yellow-400' }
    return {
      text: d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
      className: 'text-slate-400',
    }
  }

  const childSubtasks = (todoId: string) =>
    todos.filter((t) => t.parentId === todoId)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? 'opacity-50' : ''}`}
    >
      <div
        className={`group flex items-start gap-2 p-3 bg-slate-800/50 rounded-lg border-l-4 ${
          priorityColors[todo.priority]
        } hover:bg-slate-800 transition-colors ${
          isCompleted ? 'opacity-60' : ''
        }`}
        style={{ marginLeft: `${depth * 24}px` }}
      >
        <button
          {...attributes}
          {...listeners}
          className="p-1 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="w-4 h-4 text-slate-500" />
        </button>

        {hasSubtasks && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-slate-700 rounded"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400" />
            )}
          </button>
        )}

        <div className="relative" ref={statusMenuRef}>
          <button
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            className="p-0.5 hover:bg-slate-700 rounded transition-colors"
          >
            <StatusBadge status={todo.status} size="md" />
          </button>

          {showStatusMenu && (
            <div className="absolute left-0 top-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-20 py-1 min-w-[120px]">
              {statuses.map((s) => {
                const Icon = s.icon
                return (
                  <button
                    key={s.value}
                    onClick={() => handleStatusChange(s.value)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-700 transition-colors ${
                      todo.status === s.value ? 'bg-slate-700/50' : ''
                    }`}
                    style={{ color: s.color }}
                  >
                    <Icon className="w-4 h-4" />
                    {s.label}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveEdit()
                if (e.key === 'Escape') setIsEditing(false)
              }}
              className="w-full px-2 py-1 bg-slate-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              autoFocus
            />
          ) : (
            <div
              className={`text-white cursor-pointer hover:text-cyan-400 transition-colors ${
                isCompleted ? 'line-through text-slate-400' : ''
              }`}
              onClick={() => setShowDetailPanel(true)}
              onDoubleClick={() => setIsEditing(true)}
            >
              {todo.title}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 mt-1">
            {/* 우선순위 표시 */}
            {todo.priority === 'high' && (
              <span className="flex items-center gap-1 text-xs font-bold text-red-400">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                긴급
              </span>
            )}
            {todo.priority === 'medium' && (
              <span className="flex items-center gap-1 text-xs text-yellow-400">
                <span className="w-2 h-2 rounded-full bg-yellow-500" />
                보통
              </span>
            )}

            {category && (
              <CategoryBadge name={category.name} color={category.color} />
            )}

            {todo.dueDate && (
              <span
                className={`flex items-center gap-1 text-xs ${
                  formatDueDate(todo.dueDate).className
                }`}
              >
                <Calendar className="w-3 h-3" />
                {formatDueDate(todo.dueDate).text}
              </span>
            )}

            {hasSubtasks && (
              <span className="text-xs text-slate-400">
                {completedSubtasks}/{subtasks.length} 완료
              </span>
            )}

            {hasNotes && (
              <FileText className="w-3 h-3 text-slate-400" />
            )}
          </div>

          {/* 체크리스트 진행률 게이지 */}
          {checklist.length > 0 && (
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      checklistProgress === 1 ? 'bg-green-500' : 'bg-cyan-500'
                    }`}
                    style={{ width: `${checklistProgress * 100}%` }}
                  />
                </div>
                <span className="text-xs text-slate-400 min-w-8">
                  {checkedCount}/{checklist.length}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setShowAddSubtask(true)}
            className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
            title="서브태스크 추가"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowEditModal(true)}
            className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
            title="수정"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-red-400"
            title="삭제"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isExpanded && hasSubtasks && (
        <div className="mt-1 space-y-1">
          {subtasks.map((subtask) => (
            <TodoItem
              key={subtask.id}
              todo={subtask}
              subtasks={childSubtasks(subtask.id)}
              depth={depth + 1}
            />
          ))}
        </div>
      )}

      {showAddSubtask && (
        <div style={{ marginLeft: `${(depth + 1) * 24}px` }} className="mt-2">
          <TodoForm
            parentId={todo.id}
            onClose={() => setShowAddSubtask(false)}
            compact
          />
        </div>
      )}

      {showEditModal && (
        <TodoEditModal todo={todo} onClose={() => setShowEditModal(false)} />
      )}

      {showDetailPanel && (
        <TodoDetailPanel todo={todo} onClose={() => setShowDetailPanel(false)} />
      )}
    </div>
  )
}
