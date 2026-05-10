import { useState, useEffect } from 'react'

const RADIUS = 65
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function FloatingTimer() {
  const [state, setState] = useState({
    timeLeft: 1500,
    mode: 'focus',
    status: 'idle',
    cycles: 0,
    progress: 0,
    total: 1500,
    activeTaskTitle: null,
  })

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.onTimerUpdate((newState) => {
        setState(newState)
      })
    }
  }, [])

  function sendAction(type) {
    if (window.electronAPI) {
      window.electronAPI.sendTimerAction({ type })
    }
  }

  function handleClose() {
    if (window.electronAPI) {
      window.electronAPI.toggleFloatingWindow()
    }
  }

  const { timeLeft, mode, status, cycles, progress, activeTaskTitle } = state
  const dashOffset = CIRCUMFERENCE * (1 - progress)
  const isFocus = mode === 'focus'

  return (
    <div className="floating-timer drag-region">
      <div className="floating-header">
        <span className="floating-mode">{isFocus ? '专注' : '休息'}</span>
        <button className="floating-close" onClick={handleClose}>×</button>
      </div>

      <div className="floating-ring-container">
        <svg className="floating-ring" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
          <circle
            cx="80" cy="80" r={RADIUS}
            fill="none"
            stroke={isFocus ? '#f59e0b' : '#10b981'}
            strokeWidth="7"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform="rotate(-90 80 80)"
            className="timer-progress"
          />
        </svg>
        <div className="floating-display">
          <span className="floating-time">{formatTime(timeLeft)}</span>
          {activeTaskTitle && (
            <span className="floating-task">{activeTaskTitle}</span>
          )}
        </div>
      </div>

      <div className="floating-controls">
        {status === 'running' ? (
          <button className="floating-btn pause" onClick={() => sendAction('pause')}>
            <svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          </button>
        ) : (
          <button className="floating-btn start" onClick={() => sendAction('start')}>
            <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
          </button>
        )}
        <button className="floating-btn reset" onClick={() => sendAction('reset')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="3"/></svg>
        </button>
      </div>

      <div className="floating-cycles">
        {cycles} 轮
      </div>
    </div>
  )
}
