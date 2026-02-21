export type Priority = 'low' | 'medium' | 'high'
export type TodoStatus = 'pending' | 'in_progress' | 'needs_review' | 'completed'

export interface ChecklistItem {
  id: string
  text: string
  checked: boolean
}

export interface Todo {
  id: string
  title: string
  description?: string
  notes?: string
  checklist?: ChecklistItem[]
  status: TodoStatus
  priority: Priority
  categoryId?: string
  parentId?: string
  dueDate?: string
  order: number
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  color: string
  parentId?: string
  order: number
}

export type TodoInput = Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>
export type CategoryInput = Omit<Category, 'id'>

export interface TreeNode<T> {
  data: T
  children: TreeNode<T>[]
}
