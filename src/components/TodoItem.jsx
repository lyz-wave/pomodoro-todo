const PRIORITY_LABELS = { high: '高', medium: '中', low: '低' }

export default function TodoItem({ todo, onToggle, onRemove }) {
  return (
    <li className={`todo-item ${todo.done ? 'done' : ''}`}>
      <button
        className={`checkbox ${todo.done ? 'checked' : ''}`}
        onClick={() => onToggle(todo.id)}
      >
        {todo.done && (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </button>

      <div className="todo-body">
        <span className="todo-title">{todo.title}</span>
        <div className="todo-meta">
          <span className={`priority-tag ${todo.priority}`}>
            {PRIORITY_LABELS[todo.priority]}
          </span>
          <span className="category-tag">{todo.category}</span>
          {todo.pomodoroCount > 0 && (
            <span className="pomodoro-badge">{todo.pomodoroCount}</span>
          )}
        </div>
      </div>

      <button className="btn-delete" onClick={() => onRemove(todo.id)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </li>
  )
}
