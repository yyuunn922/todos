import { createFileRoute } from '@tanstack/react-router'
import { TodoList } from '#/components/todo/TodoList'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return <TodoList />
}
