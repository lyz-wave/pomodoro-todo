import { useState, useCallback } from 'react'
import { loadTodos, saveTodos } from '../utils/storage'

let nextId = Date.now()

export function useTodos() {
  const [todos, setTodos] = useState(loadTodos)
  const [filter, setFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const addTodo = useCallback(({ title, priority, category }) => {
    const todo = {
      id: ++nextId,
      title,
      priority: priority || 'medium',
      category: category || '默认',
      done: false,
      pomodoroCount: 0,
      createdAt: Date.now(),
    }
    setTodos((prev) => {
      const next = [todo, ...prev]
      saveTodos(next)
      return next
    })
  }, [])

  const toggleTodo = useCallback((id) => {
    setTodos((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
      saveTodos(next)
      return next
    })
  }, [])

  const removeTodo = useCallback((id) => {
    setTodos((prev) => {
      const next = prev.filter((t) => t.id !== id)
      saveTodos(next)
      return next
    })
  }, [])

  const incrementPomodoroCount = useCallback((id) => {
    setTodos((prev) => {
      const next = prev.map((t) =>
        t.id === id ? { ...t, pomodoroCount: t.pomodoroCount + 1 } : t
      )
      saveTodos(next)
      return next
    })
  }, [])

  const categories = [...new Set(todos.map((t) => t.category))]

  let filtered = todos
  if (filter === 'active') filtered = filtered.filter((t) => !t.done)
  if (filter === 'done') filtered = filtered.filter((t) => t.done)
  if (priorityFilter !== 'all') filtered = filtered.filter((t) => t.priority === priorityFilter)
  if (categoryFilter !== 'all') filtered = filtered.filter((t) => t.category === categoryFilter)

  return {
    todos: filtered,
    allTodos: todos,
    filter,
    setFilter,
    priorityFilter,
    setPriorityFilter,
    categoryFilter,
    setCategoryFilter,
    categories,
    addTodo,
    toggleTodo,
    removeTodo,
    incrementPomodoroCount,
  }
}
