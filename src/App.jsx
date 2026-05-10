import { useState, useEffect, useRef } from 'react'
import PomodoroTimer from './components/PomodoroTimer'
import TodoList from './components/TodoList'
import HistoryPanel from './components/HistoryPanel'
import { useTimer } from './hooks/useTimer'
import { useTodos } from './hooks/useTodos'
import { useHistory } from './hooks/useHistory'
import { useWhiteNoise } from './hooks/useWhiteNoise'

export default function App() {
  const [activeTab, setActiveTab] = useState('timer')

  const history = useHistory()
  const todos = useTodos()
  const whiteNoise = useWhiteNoise()

  const handleSessionComplete = ({ duration, mode, taskId, taskTitle }) => {
    history.recordSession({ duration, mode, taskId, taskTitle })
    if (taskId) {
      todos.incrementPomodoroCount(taskId)
    }
  }

  const timer = useTimer({ onSessionComplete: handleSessionComplete })

  // Auto-play/stop white noise based on timer state
  const isFocusRunning = timer.status === 'running' && timer.mode === 'focus'
  const prevActiveRef = useRef(false)

  useEffect(() => {
    if (isFocusRunning && !prevActiveRef.current && whiteNoise.soundType !== 'none') {
      whiteNoise.play()
    } else if (!isFocusRunning && prevActiveRef.current) {
      whiteNoise.stop()
    }
    prevActiveRef.current = isFocusRunning
  }, [isFocusRunning, whiteNoise.soundType])

  // IPC: send timer state to floating window
  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.sendTimerState({
        timeLeft: timer.timeLeft,
        mode: timer.mode,
        status: timer.status,
        cycles: timer.cycles,
        progress: timer.progress,
        total: timer.total,
        activeTaskTitle: timer.activeTaskTitle,
      })
    }
  }, [
    timer.timeLeft, timer.mode, timer.status, timer.cycles,
    timer.progress, timer.total, timer.activeTaskTitle,
  ])

  // IPC: receive timer actions from floating window
  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.onTimerAction((action) => {
        if (action.type === 'start') timer.start()
        else if (action.type === 'pause') timer.pause()
        else if (action.type === 'reset') timer.reset()
      })
    }
  }, [timer])

  // IPC: floating window toggle
  function handleToggleFloating() {
    if (window.electronAPI) {
      window.electronAPI.toggleFloatingWindow()
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">
          <span className="title-icon">🍅</span>
          番茄钟 + Todo
        </h1>
        <button className="floating-toggle-btn" onClick={handleToggleFloating} title="切换悬浮窗">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="8" height="8" rx="1" />
            <rect x="13" y="13" width="8" height="8" rx="1" />
            <line x1="20" y1="4" x2="13" y2="11" />
          </svg>
        </button>
      </header>

      <nav className="tab-bar">
        <button
          className={`tab-btn ${activeTab === 'timer' ? 'active' : ''}`}
          onClick={() => setActiveTab('timer')}
        >
          番茄钟
        </button>
        <button
          className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          统计
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'timer' ? (
          <>
            <PomodoroTimer
              {...timer}
              todos={todos.allTodos}
              onBindTask={timer.bindTask}
              soundType={whiteNoise.soundType}
              onChangeSound={whiteNoise.changeSound}
              volume={whiteNoise.volume}
              onChangeVolume={whiteNoise.setVolume}
            />
            <TodoList
              todos={todos.todos}
              allTodos={todos.allTodos}
              filter={todos.filter}
              setFilter={todos.setFilter}
              priorityFilter={todos.priorityFilter}
              setPriorityFilter={todos.setPriorityFilter}
              categoryFilter={todos.categoryFilter}
              setCategoryFilter={todos.setCategoryFilter}
              categories={todos.categories}
              onAdd={todos.addTodo}
              onToggle={todos.toggleTodo}
              onRemove={todos.removeTodo}
            />
          </>
        ) : (
          <>
            <HistoryPanel
              summary={history.getSummary()}
              stats={history.getStats}
              heatmapData={history.getHeatmapData()}
            />
            <TodoList
              todos={todos.todos}
              allTodos={todos.allTodos}
              filter={todos.filter}
              setFilter={todos.setFilter}
              priorityFilter={todos.priorityFilter}
              setPriorityFilter={todos.setPriorityFilter}
              categoryFilter={todos.categoryFilter}
              setCategoryFilter={todos.setCategoryFilter}
              categories={todos.categories}
              onAdd={todos.addTodo}
              onToggle={todos.toggleTodo}
              onRemove={todos.removeTodo}
            />
          </>
        )}
      </main>
    </div>
  )
}
