import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Plus, ListTodo } from 'lucide-react'
import { useTodos } from '#/context/TodoContext'
import { useCategories } from '#/context/CategoryContext'
import { TodoItem } from './TodoItem'
import { TodoForm } from './TodoForm'
import { FilterTabs } from '#/components/ui/FilterTabs'

export function TodoList() {
  const { todos, filter, setFilter, reorderTodos, getTodosByCategory, isLoading, getStatusCounts } =
    useTodos()
  const { selectedCategoryId, categories } = useCategories()
  const [showAddForm, setShowAddForm] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const filteredTodos = getTodosByCategory(selectedCategoryId)
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId)

  const getSubtasks = (parentId: string) =>
    todos.filter((t) => t.parentId === parentId)

  const counts = getStatusCounts()

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      reorderTodos(active.id as string, over.id as string)
    }
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {selectedCategory ? selectedCategory.name : '전체 할 일'}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {filteredTodos.length}개의 할 일
          </p>
        </div>
        <FilterTabs value={filter} onChange={setFilter} counts={counts} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-slate-400">불러오는 중...</p>
          </div>
        ) : filteredTodos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <ListTodo className="w-20 h-20 mb-4 opacity-30" />
            <p className="text-xl font-medium">할 일이 없습니다</p>
            <p className="text-sm mt-2 opacity-70">우측 하단의 + 버튼을 눌러 추가하세요</p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredTodos.map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2 pb-20">
                {filteredTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    subtasks={getSubtasks(todo.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => setShowAddForm(true)}
        className="absolute bottom-6 right-6 w-14 h-14 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full shadow-lg shadow-cyan-500/30 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* Add Todo Modal */}
      {showAddForm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddForm(false)}
        >
          <div
            className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-white mb-4">새 할 일 추가</h2>
            <TodoForm onClose={() => setShowAddForm(false)} />
          </div>
        </div>
      )}
    </div>
  )
}
