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
import { client, TABLE_IDS } from '#/services/connectbase'

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

function rowToTodo(item: { id: string; data: Record<string, unknown> }): Todo {
  return {
    id: item.id,
    title: (item.data.title as string) || '',
    description: item.data.description as string | undefined,
    notes: item.data.notes as string | undefined,
    checklist: item.data.checklist as Todo['checklist'],
    status: (item.data.status as TodoStatus) || 'pending',
    priority: (item.data.priority as Todo['priority']) || 'medium',
    categoryId: item.data.categoryId as string | undefined,
    parentId: item.data.parentId as string | undefined,
    dueDate: item.data.dueDate as string | undefined,
    order: (item.data.order as number) || 0,
    createdAt: (item.data.createdAt as string) || new Date().toISOString(),
    updatedAt: (item.data.updatedAt as string) || new Date().toISOString(),
  }
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
      const result = await client.database.getData(TABLE_IDS.todos, { limit: 1000 })
      setTodos(sortByOrder(result.data.map(rowToTodo)))
    } catch (err) {
      setError(err instanceof Error ? err.message : '할 일을 불러오는데 실패했습니다')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addTodo = useCallback(async (input: TodoInput): Promise<Todo> => {
    const now = new Date().toISOString()
    const created = await client.database.createData(TABLE_IDS.todos, {
      data: {
        title: input.title,
        description: input.description || '',
        notes: input.notes || '',
        checklist: input.checklist || [],
        status: input.status,
        priority: input.priority,
        categoryId: input.categoryId || '',
        parentId: input.parentId || '',
        dueDate: input.dueDate || '',
        order: input.order,
        createdAt: now,
        updatedAt: now,
      },
    })
    const newTodo = rowToTodo(created)
    setTodos((prev) => sortByOrder([...prev, newTodo]))
    return newTodo
  }, [])

  const updateTodo = useCallback(
    async (id: string, input: Partial<TodoInput>) => {
      await client.database.updateData(TABLE_IDS.todos, id, {
        data: {
          ...input,
          updatedAt: new Date().toISOString(),
        } as Record<string, unknown>,
      })
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
    await client.database.deleteData(TABLE_IDS.todos, id)
    setTodos((prev) => {
      const children = prev.filter((t) => t.parentId === id)
      children.forEach((child) => {
        client.database.deleteData(TABLE_IDS.todos, child.id).catch(() => {})
      })
      return prev.filter((todo) => todo.id !== id && todo.parentId !== id)
    })
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

      const updatePromises = updatedTodos
        .filter((t, i) => todos[i]?.id !== t.id)
        .map((t) =>
          client.database.updateData(TABLE_IDS.todos, t.id, {
            data: { order: t.order },
          }).catch(() => {})
        )
      await Promise.all(updatePromises)
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
