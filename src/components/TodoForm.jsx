import { useState } from 'react'

const PRIORITIES = [
  { value: 'high', label: '高' },
  { value: 'medium', label: '中' },
  { value: 'low', label: '低' },
]

export default function TodoForm({ categories, onAdd }) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('medium')
  const [category, setCategory] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    onAdd({ title: trimmed, priority, category: category.trim() || undefined })
    setTitle('')
    setPriority('medium')
    setCategory('')
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        className="todo-input"
        type="text"
        placeholder="添加新任务..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className="todo-form-row">
        <div className="priority-select">
          {PRIORITIES.map((p) => (
            <button
              key={p.value}
              type="button"
              className={`priority-option ${p.value} ${priority === p.value ? 'active' : ''}`}
              onClick={() => setPriority(p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="category-input-wrap">
          <input
            className="category-input"
            type="text"
            placeholder="分类..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            list="category-list"
          />
          {categories.length > 0 && (
            <datalist id="category-list">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          )}
        </div>
        <button className="btn btn-add" type="submit">添加</button>
      </div>
    </form>
  )
}
