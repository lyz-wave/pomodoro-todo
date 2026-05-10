import PomodoroTimer from './components/PomodoroTimer'
import TodoList from './components/TodoList'
import './App.css'

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">
          <span className="title-icon">🍅</span>
          番茄钟 + Todo
        </h1>
      </header>
      <main className="app-main">
        <PomodoroTimer />
        <TodoList />
      </main>
    </div>
  )
}
