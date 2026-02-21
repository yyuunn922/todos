import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'
import type { Todo, TodoInput, TodoStatus } from '#/types/todo'
import { buildTree, sortByOrder } from '#/lib/tree'
import type { TreeNode } from '#/types/todo'

const STORAGE_KEY = 'todos_data'

type FilterType = 'all' | TodoStatus

interface TodoContextType {
  todos: Todo[]
  todoTree: TreeNode<Todo>[]
  isLoading: boolean
  error: string | null
  filter: FilterType
  setFilter: (filter: FilterType) => void
  addTodo: (input: TodoInput) => Promise<Todo>
  updateTodo: (id: string, input: Partial<TodoInput>) => Promise<void>
  deleteTodo: (id: string) => Promise<void>
  reorderTodos: (activeId: string, overId: string) => Promise<void>
  refresh: () => Promise<void>
  getTodosByCategory: (categoryId: string | null) => Todo[]
  getStatusCounts: () => Record<FilterType, number>
}

const TodoContext = createContext<TodoContextType | null>(null)

function loadFromStorage(): Todo[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveToStorage(todos: Todo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterType>('all')

  const refresh = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const loaded = loadFromStorage()
      setTodos(sortByOrder(loaded))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load todos')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    if (!isLoading) {
      saveToStorage(todos)
    }
  }, [todos, isLoading])

  const addTodo = useCallback(async (input: TodoInput): Promise<Todo> => {
    const now = new Date().toISOString()
    const newTodo: Todo = {
      id: generateId(),
      ...input,
      createdAt: now,
      updatedAt: now,
    }
    setTodos((prev) => sortByOrder([...prev, newTodo]))
    return newTodo
  }, [])

  const updateTodo = useCallback(
    async (id: string, input: Partial<TodoInput>) => {
      setTodos((prev) =>
        sortByOrder(
          prev.map((todo) =>
            todo.id === id
              ? { ...todo, ...input, updatedAt: new Date().toISOString() }
              : todo
          )
        )
      )
    },
    []
  )

  const deleteTodo = useCallback(async (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id && todo.parentId !== id))
  }, [])

  const reorderTodos = useCallback(
    async (activeId: string, overId: string) => {
      const oldIndex = todos.findIndex((t) => t.id === activeId)
      const newIndex = todos.findIndex((t) => t.id === overId)
      if (oldIndex === -1 || newIndex === -1) return

      const newTodos = [...todos]
      const [removed] = newTodos.splice(oldIndex, 1)
      newTodos.splice(newIndex, 0, removed)

      const updatedTodos = newTodos.map((todo, index) => ({
        ...todo,
        order: index,
      }))
      setTodos(updatedTodos)
    },
    [todos]
  )

  const getTodosByCategory = useCallback(
    (categoryId: string | null) => {
      let filtered = categoryId
        ? todos.filter((t) => t.categoryId === categoryId)
        : todos

      if (filter !== 'all') {
        filtered = filtered.filter((t) => t.status === filter)
      }

      return filtered.filter((t) => !t.parentId)
    },
    [todos, filter]
  )

  const getStatusCounts = useCallback(() => {
    const rootTodos = todos.filter((t) => !t.parentId)
    return {
      all: rootTodos.length,
      pending: rootTodos.filter((t) => t.status === 'pending').length,
      in_progress: rootTodos.filter((t) => t.status === 'in_progress').length,
      needs_review: rootTodos.filter((t) => t.status === 'needs_review').length,
      completed: rootTodos.filter((t) => t.status === 'completed').length,
    }
  }, [todos])

  const todoTree = buildTree(
    filter === 'all'
      ? todos
      : todos.filter((t) => t.status === filter)
  )

  return (
    <TodoContext.Provider
      value={{
        todos,
        todoTree,
        isLoading,
        error,
        filter,
        setFilter,
        addTodo,
        updateTodo,
        deleteTodo,
        reorderTodos,
        refresh,
        getTodosByCategory,
        getStatusCounts,
      }}
    >
      {children}
    </TodoContext.Provider>
  )
}

export function useTodos() {
  const context = useContext(TodoContext)
  if (!context) {
    throw new Error('useTodos must be used within TodoProvider')
  }
  return context
}
