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
import { client, TABLE_IDS } from '#/services/connectbase'

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

function rowToCategory(item: { id: string; data: Record<string, unknown> }): Category {
  return {
    id: item.id,
    name: (item.data.name as string) || '',
    color: (item.data.color as string) || '#6b7280',
    parentId: item.data.parentId as string | undefined,
    order: (item.data.order as number) || 0,
  }
}

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await client.database.getData(TABLE_IDS.categories, { limit: 1000 })
      setCategories(sortByOrder(result.data.map(rowToCategory)))
    } catch (err) {
      setError(err instanceof Error ? err.message : '카테고리를 불러오는데 실패했습니다')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addCategory = useCallback(
    async (input: CategoryInput): Promise<Category> => {
      const created = await client.database.createData(TABLE_IDS.categories, {
        data: {
          name: input.name,
          color: input.color,
          parentId: input.parentId || '',
          order: input.order,
        },
      })
      const newCategory = rowToCategory(created)
      setCategories((prev) => sortByOrder([...prev, newCategory]))
      return newCategory
    },
    []
  )

  const updateCategory = useCallback(
    async (id: string, input: Partial<CategoryInput>) => {
      await client.database.updateData(TABLE_IDS.categories, id, {
        data: input as Record<string, unknown>,
      })
      setCategories((prev) =>
        sortByOrder(
          prev.map((cat) => (cat.id === id ? { ...cat, ...input } : cat))
        )
      )
    },
    []
  )

  const deleteCategory = useCallback(async (id: string) => {
    await client.database.deleteData(TABLE_IDS.categories, id)
    setCategories((prev) => {
      const children = prev.filter((c) => c.parentId === id)
      children.forEach((child) => {
        client.database.deleteData(TABLE_IDS.categories, child.id).catch(() => {})
      })
      return prev.filter((cat) => cat.id !== id && cat.parentId !== id)
    })
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
