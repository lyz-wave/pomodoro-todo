import { useTimer } from '../hooks/useTimer'

const RADIUS = 140
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function PomodoroTimer() {
  const { timeLeft, mode, status, cycles, progress, start, pause, reset } = useTimer()

  const dashOffset = CIRCUMFERENCE * (1 - progress)
  const isFocus = mode === 'focus'

  return (
    <div className="timer-card">
      <h2 className="timer-title">番茄钟</h2>
      <div className="timer-mode">
        <span className={`mode-badge ${isFocus ? 'focus' : 'break'}`}>
          {isFocus ? '专注' : '休息'}
        </span>
        <span className="cycles-count">{cycles} 轮完成</span>
      </div>

      <div className="timer-ring-container">
        <svg className={`timer-ring ${!isFocus ? 'break-ring' : ''}`} viewBox="0 0 320 320">
          <circle
            cx="160"
            cy="160"
            r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="12"
          />
          <circle
            cx="160"
            cy="160"
            r={RADIUS}
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
          <button className="btn btn-start" onClick={start}>
            {status === 'paused' ? '继续' : '开始'}
          </button>
        )}
        <button className="btn btn-reset" onClick={reset}>重置</button>
      </div>
    </div>
  )
}
