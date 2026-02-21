import { useState, useRef, useEffect } from 'react'
import { ChevronRight, ChevronDown, Folder, MoreHorizontal, Pencil, Trash2, Plus } from 'lucide-react'
import type { Category, TreeNode } from '#/types/todo'
import { useCategories } from '#/context/CategoryContext'

interface CategoryItemProps {
  node: TreeNode<Category>
  depth?: number
  onEdit: (category: Category) => void
  onAddChild: (parentId: string) => void
}

export function CategoryItem({
  node,
  depth = 0,
  onEdit,
  onAddChild,
}: CategoryItemProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [showMenu, setShowMenu] = useState(false)
  const { selectedCategoryId, selectCategory, deleteCategory } = useCategories()
  const menuRef = useRef<HTMLDivElement>(null)
  const hasChildren = node.children.length > 0
  const isSelected = selectedCategoryId === node.data.id

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false)
      }
    }
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showMenu])

  const handleClick = () => {
    selectCategory(node.data.id)
  }

  const handleDelete = async () => {
    if (confirm('이 카테고리를 삭제하시겠습니까?')) {
      await deleteCategory(node.data.id)
      setShowMenu(false)
    }
  }

  return (
    <div className="relative">
      {/* 하위 카테고리 연결선 */}
      {depth > 0 && (
        <>
          <div
            className="absolute left-0 top-0 h-5 border-l-2 border-slate-600"
            style={{ marginLeft: `${(depth - 1) * 20 + 18}px` }}
          />
          <div
            className="absolute top-5 w-3 border-t-2 border-slate-600"
            style={{ marginLeft: `${(depth - 1) * 20 + 18}px` }}
          />
        </>
      )}
      <div
        className={`group flex items-center gap-1 px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
          isSelected
            ? 'bg-cyan-500/20 text-cyan-400'
            : 'hover:bg-slate-700/50 text-slate-300'
        } ${depth > 0 ? 'ml-2' : ''}`}
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
        onClick={handleClick}
      >
        <button
          className="p-0.5 hover:bg-slate-600 rounded"
          onClick={(e) => {
            e.stopPropagation()
            setIsExpanded(!isExpanded)
          }}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )
          ) : (
            <span className="w-4" />
          )}
        </button>

        <Folder className="w-4 h-4" style={{ color: node.data.color }} />
        <span className="flex-1 truncate text-sm">{node.data.name}</span>

        <div className="relative" ref={menuRef}>
          <button
            className="p-1 opacity-0 group-hover:opacity-100 hover:bg-slate-600 rounded transition-opacity"
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(!showMenu)
            }}
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-10 py-1 min-w-35">
              <button
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700"
                onClick={(e) => {
                  e.stopPropagation()
                  onAddChild(node.data.id)
                  setShowMenu(false)
                }}
              >
                <Plus className="w-4 h-4" />
                하위 카테고리
              </button>
              <button
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(node.data)
                  setShowMenu(false)
                }}
              >
                <Pencil className="w-4 h-4" />
                수정
              </button>
              <button
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-slate-700"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete()
                }}
              >
                <Trash2 className="w-4 h-4" />
                삭제
              </button>
            </div>
          )}
        </div>
      </div>

      {isExpanded && hasChildren && (
        <div>
          {node.children.map((child) => (
            <CategoryItem
              key={child.data.id}
              node={child}
              depth={depth + 1}
              onEdit={onEdit}
              onAddChild={onAddChild}
            />
          ))}
        </div>
      )}
    </div>
  )
}
