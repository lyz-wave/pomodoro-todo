const KEYS = {
  todos: 'pomodoro_todos',
}

export function loadTodos() {
  try {
    const raw = localStorage.getItem(KEYS.todos)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveTodos(todos) {
  localStorage.setItem(KEYS.todos, JSON.stringify(todos))
}
