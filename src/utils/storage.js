const KEYS = {
  todos: 'pomodoro_todos',
  sessions: 'pomodoro_sessions',
  settings: 'pomodoro_settings',
}

const DEFAULT_SETTINGS = {
  autoCycle: false,
  maxCycles: 4,
  whiteNoise: 'none',
  whiteNoiseVolume: 0.3,
}

export function loadTodos() {
  try {
    const raw = localStorage.getItem(KEYS.todos)
    const todos = raw ? JSON.parse(raw) : []
    return todos.map((t) => ({ pomodoroCount: 0, ...t }))
  } catch {
    return []
  }
}

export function saveTodos(todos) {
  localStorage.setItem(KEYS.todos, JSON.stringify(todos))
}

export function loadSessions() {
  try {
    const raw = localStorage.getItem(KEYS.sessions)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveSessions(sessions) {
  localStorage.setItem(KEYS.sessions, JSON.stringify(sessions))
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(KEYS.settings)
    return { ...DEFAULT_SETTINGS, ...(raw ? JSON.parse(raw) : {}) }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export function saveSettings(settings) {
  localStorage.setItem(KEYS.settings, JSON.stringify(settings))
}
