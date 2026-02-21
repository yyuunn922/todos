import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'
import type { Category, CategoryInput } from '#/types/todo'
import { buildTree, sortByOrder } from '#/lib/tree'
import type { TreeNode } from '#/types/todo'

const STORAGE_KEY = 'categories_data'

interface CategoryContextType {
  categories: Category[]
  categoryTree: TreeNode<Category>[]
  isLoading: boolean
  error: string | null
  selectedCategoryId: string | null
  selectCategory: (id: string | null) => void
  addCategory: (input: CategoryInput) => Promise<Category>
  updateCategory: (id: string, input: Partial<CategoryInput>) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
  refresh: () => Promise<void>
}

const CategoryContext = createContext<CategoryContextType | null>(null)

function loadFromStorage(): Category[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveToStorage(categories: Category[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(categories))
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  )

  const refresh = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const loaded = loadFromStorage()
      setCategories(sortByOrder(loaded))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    if (!isLoading) {
      saveToStorage(categories)
    }
  }, [categories, isLoading])

  const addCategory = useCallback(
    async (input: CategoryInput): Promise<Category> => {
      const newCategory: Category = {
        id: generateId(),
        name: input.name,
        color: input.color,
        parentId: input.parentId,
        order: input.order,
      }
      setCategories((prev) => sortByOrder([...prev, newCategory]))
      return newCategory
    },
    []
  )

  const updateCategory = useCallback(
    async (id: string, input: Partial<CategoryInput>) => {
      setCategories((prev) =>
        sortByOrder(
          prev.map((cat) => (cat.id === id ? { ...cat, ...input } : cat))
        )
      )
    },
    []
  )

  const deleteCategory = useCallback(async (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id && cat.parentId !== id))
  }, [])

  const categoryTree = buildTree(categories)

  return (
    <CategoryContext.Provider
      value={{
        categories,
        categoryTree,
        isLoading,
        error,
        selectedCategoryId,
        selectCategory: setSelectedCategoryId,
        addCategory,
        updateCategory,
        deleteCategory,
        refresh,
      }}
    >
      {children}
    </CategoryContext.Provider>
  )
}

export function useCategories() {
  const context = useContext(CategoryContext)
  if (!context) {
    throw new Error('useCategories must be used within CategoryProvider')
  }
  return context
}
