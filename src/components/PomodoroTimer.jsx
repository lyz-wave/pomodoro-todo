import WhiteNoiseSelector from './WhiteNoiseSelector'

const RADIUS = 140
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function PomodoroTimer({
  timeLeft, mode, status, cycles, progress,
  activeTaskId, activeTaskTitle,
  todos, onBindTask,
  autoCycle, setAutoCycle, maxCycles, setMaxCycles,
  soundType, onChangeSound, volume, onChangeVolume,
  start, pause, reset,
}) {
  const dashOffset = CIRCUMFERENCE * (1 - progress)
  const isFocus = mode === 'focus'
  const activeTodos = todos.filter((t) => !t.done)

  function handleStart() {
    start()
  }

  return (
    <div className="timer-card">
      <h2 className="timer-title">Pomelo</h2>
      <div className="timer-mode">
        <span className={`mode-badge ${isFocus ? 'focus' : 'break'}`}>
          {isFocus ? '专注' : '休息'}
        </span>
        <span className="cycles-count">{cycles} 轮完成</span>
      </div>

      <div className="task-selector">
        <select
          className="task-select"
          value={activeTaskId || ''}
          onChange={(e) => {
            const id = e.target.value ? Number(e.target.value) : null
            const t = id ? activeTodos.find((x) => x.id === id) : null
            onBindTask(id, t ? t.title : null)
          }}
          disabled={status === 'running'}
        >
          <option value="">未绑定任务</option>
          {activeTodos.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>
        {status === 'running' && activeTaskTitle && (
          <span className="active-task">当前：{activeTaskTitle}</span>
        )}
      </div>

      <div className="timer-ring-container">
        <svg className={`timer-ring ${!isFocus ? 'break-ring' : ''}`} viewBox="0 0 320 320">
          <circle
            cx="160" cy="160" r={RADIUS}
            fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12"
          />
          <circle
            cx="160" cy="160" r={RADIUS}
            fill="none"
            stroke={isFocus ? '#f59e0b' : '#10b981'}
            strokeWidth="12"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform="rotate(-90 160 160)"
            className="timer-progress"
          />
        </svg>
        <div className="timer-display">
          <span className="time-text">{formatTime(timeLeft)}</span>
          <span className="mode-label">{isFocus ? '专注中' : '休息中'}</span>
        </div>
      </div>

      <div className="timer-controls">
        {status === 'running' ? (
          <button className="btn btn-pause" onClick={pause}>暂停</button>
        ) : (
          <button className="btn btn-start" onClick={handleStart}>
            {status === 'paused' ? '继续' : '开始'}
          </button>
        )}
        <button className="btn btn-reset" onClick={reset}>重置</button>
      </div>

      <WhiteNoiseSelector
        soundType={soundType}
        onChangeSound={onChangeSound}
        volume={volume}
        onChangeVolume={onChangeVolume}
      />

      <div className="auto-cycle-row">
        <label className="auto-cycle-label">
          <input
            type="checkbox"
            checked={autoCycle}
            onChange={(e) => setAutoCycle(e.target.checked)}
          />
          <span>自动循环</span>
        </label>
        {autoCycle && (
          <div className="max-cycles-wrap">
            <span className="max-cycles-label">最多</span>
            <input
              type="number"
              className="max-cycles-input"
              value={maxCycles}
              min={1}
              max={99}
              onChange={(e) => setMaxCycles(Number(e.target.value) || 1)}
            />
            <span className="max-cycles-label">轮</span>
          </div>
        )}
      </div>
    </div>
  )
}
