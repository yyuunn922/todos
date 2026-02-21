import type { TreeNode } from '#/types/todo'

interface WithId {
  id: string
  parentId?: string
}

export function buildTree<T extends WithId>(items: T[]): TreeNode<T>[] {
  const itemMap = new Map<string, TreeNode<T>>()
  const roots: TreeNode<T>[] = []

  items.forEach((item) => {
    itemMap.set(item.id, { data: item, children: [] })
  })

  items.forEach((item) => {
    const node = itemMap.get(item.id)!
    if (item.parentId) {
      const parent = itemMap.get(item.parentId)
      if (parent) {
        parent.children.push(node)
      } else {
        roots.push(node)
      }
    } else {
      roots.push(node)
    }
  })

  return roots
}

export function flattenTree<T>(nodes: TreeNode<T>[]): T[] {
  const result: T[] = []

  function traverse(node: TreeNode<T>) {
    result.push(node.data)
    node.children.forEach(traverse)
  }

  nodes.forEach(traverse)
  return result
}

export function findNode<T extends WithId>(
  nodes: TreeNode<T>[],
  id: string
): TreeNode<T> | null {
  for (const node of nodes) {
    if (node.data.id === id) return node
    const found = findNode(node.children, id)
    if (found) return found
  }
  return null
}

export function getAncestors<T extends WithId>(items: T[], id: string): T[] {
  const ancestors: T[] = []
  const itemMap = new Map(items.map((item) => [item.id, item]))

  let current = itemMap.get(id)
  while (current?.parentId) {
    const parent = itemMap.get(current.parentId)
    if (parent) {
      ancestors.unshift(parent)
      current = parent
    } else {
      break
    }
  }

  return ancestors
}

export function getDescendants<T extends WithId>(items: T[], id: string): T[] {
  const descendants: T[] = []
  const childrenMap = new Map<string, T[]>()

  items.forEach((item) => {
    if (item.parentId) {
      const siblings = childrenMap.get(item.parentId) || []
      siblings.push(item)
      childrenMap.set(item.parentId, siblings)
    }
  })

  function collect(parentId: string) {
    const children = childrenMap.get(parentId) || []
    children.forEach((child) => {
      descendants.push(child)
      collect(child.id)
    })
  }

  collect(id)
  return descendants
}

export function sortByOrder<T extends { order: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.order - b.order)
}
