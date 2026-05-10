import TodoForm from './TodoForm'
import TodoItem from './TodoItem'
import { useTodos } from '../hooks/useTodos'

const FILTERS = [
  { value: 'all', label: '全部' },
  { value: 'active', label: '待完成' },
  { value: 'done', label: '已完成' },
]

const PRIORITY_FILTERS = [
  { value: 'all', label: '全部' },
  { value: 'high', label: '高' },
  { value: 'medium', label: '中' },
  { value: 'low', label: '低' },
]

export default function TodoList() {
  const {
    todos,
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
  } = useTodos()

  return (
    <div className="todo-card">
      <h2 className="todo-title-header">待办事项</h2>

      <TodoForm categories={categories} onAdd={addTodo} />

      <div className="filters">
        <div className="filter-group">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              className={`filter-btn ${filter === f.value ? 'active' : ''}`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="filter-group">
          {PRIORITY_FILTERS.map((f) => (
            <button
              key={f.value}
              className={`filter-btn ${priorityFilter === f.value ? 'active' : ''}`}
              onClick={() => setPriorityFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
        {categories.length > 1 && (
          <div className="filter-group">
            <button
              className={`filter-btn ${categoryFilter === 'all' ? 'active' : ''}`}
              onClick={() => setCategoryFilter('all')}
            >
              全部分类
            </button>
            {categories.map((c) => (
              <button
                key={c}
                className={`filter-btn ${categoryFilter === c ? 'active' : ''}`}
                onClick={() => setCategoryFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      {todos.length === 0 ? (
        <div className="empty-state">
          <p>暂无任务</p>
          <span>添加一个任务开始吧</span>
        </div>
      ) : (
        <ul className="todo-list">
          {todos.map((t) => (
            <TodoItem key={t.id} todo={t} onToggle={toggleTodo} onRemove={removeTodo} />
          ))}
        </ul>
      )}
    </div>
  )
}
