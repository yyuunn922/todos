import { useState } from 'react'
import { Plus, FolderOpen } from 'lucide-react'
import { useCategories } from '#/context/CategoryContext'
import { CategoryItem } from './CategoryItem'
import { CategoryForm } from './CategoryForm'
import type { Category } from '#/types/todo'

export function CategoryTree() {
  const { categoryTree, selectedCategoryId, selectCategory, isLoading } =
    useCategories()
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [parentIdForNew, setParentIdForNew] = useState<string | null>(null)

  const handleAddCategory = (parentId?: string) => {
    setParentIdForNew(parentId || null)
    setEditingCategory(null)
    setShowForm(true)
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setParentIdForNew(null)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingCategory(null)
    setParentIdForNew(null)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
          카테고리
        </h2>
        <button
          onClick={() => handleAddCategory()}
          className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
          title="카테고리 추가"
        >
          <Plus className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <button
          onClick={() => selectCategory(null)}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
            selectedCategoryId === null
              ? 'bg-cyan-500/20 text-cyan-400'
              : 'hover:bg-slate-700/50 text-slate-300'
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          <span className="text-sm">전체</span>
        </button>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="mt-1">
            {categoryTree.map((node) => (
              <CategoryItem
                key={node.data.id}
                node={node}
                onEdit={handleEditCategory}
                onAddChild={handleAddCategory}
              />
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <CategoryForm
          category={editingCategory}
          parentId={parentIdForNew}
          onClose={handleCloseForm}
        />
      )}
    </div>
  )
}
