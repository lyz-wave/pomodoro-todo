import { useState, useRef, useEffect, useCallback } from 'react'
import { loadSettings, saveSettings } from '../utils/storage'

const FOCUS_TIME = 25 * 60
const BREAK_TIME = 5 * 60

function createNotification() {
  if (Notification.permission === 'granted') return
  if (Notification.permission !== 'denied') {
    Notification.requestPermission()
  }
}

function playBeep() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.frequency.value = 800
  osc.type = 'sine'
  gain.gain.setValueAtTime(0.3, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.2)
}

export function useTimer({ onSessionComplete } = {}) {
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME)
  const [mode, setMode] = useState('focus')
  const [status, setStatus] = useState('idle')
  const [cycles, setCycles] = useState(0)
  const [activeTaskId, setActiveTaskId] = useState(null)
  const [activeTaskTitle, setActiveTaskTitle] = useState(null)

  // Auto-cycle settings
  const [settings, setSettings] = useState(loadSettings)
  const { autoCycle, maxCycles } = settings
  const autoCycleCountRef = useRef(0)

  const onSessionCompleteRef = useRef(onSessionComplete)
  onSessionCompleteRef.current = onSessionComplete

  const intervalRef = useRef(null)

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const updateSettings = useCallback((patch) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch }
      saveSettings(next)
      return next
    })
  }, [])

  const setAutoCycle = useCallback((v) => updateSettings({ autoCycle: v }), [updateSettings])
  const setMaxCycles = useCallback((v) => updateSettings({ maxCycles: v }), [updateSettings])

  const bindTask = useCallback((id, title) => {
    setActiveTaskId(id)
    setActiveTaskTitle(title)
  }, [])

  const start = useCallback(() => {
    createNotification()
    setStatus('running')
    autoCycleCountRef.current = 0
  }, [])

  const pause = useCallback(() => {
    setStatus('paused')
  }, [])

  const reset = useCallback(() => {
    clearTimer()
    setStatus('idle')
    setMode('focus')
    setTimeLeft(FOCUS_TIME)
    setActiveTaskId(null)
    setActiveTaskTitle(null)
    autoCycleCountRef.current = 0
  }, [clearTimer])

  useEffect(() => {
    if (status !== 'running') {
      clearTimer()
      return
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearTimer()
          playBeep()
          if (Notification.permission === 'granted') {
            new Notification(
              mode === 'focus' ? '专注结束，休息一下！' : '休息结束，继续专注！'
            )
          }

          const wasFocus = mode === 'focus'

          if (wasFocus) {
            autoCycleCountRef.current += 1
            if (onSessionCompleteRef.current) {
              onSessionCompleteRef.current({
                duration: FOCUS_TIME,
                mode: 'focus',
                taskId: activeTaskId,
                taskTitle: activeTaskTitle,
              })
            }
          }

          // Decide whether to stop or continue
          if (!autoCycle) {
            // No auto-cycle: stop after each session
            setStatus('idle')
          } else if (wasFocus && autoCycleCountRef.current >= maxCycles) {
            // Reached max cycles: stop after this focus
            setStatus('idle')
          }
          // else: continue running (status stays 'running')

          setMode((m) => {
            if (m === 'focus') {
              setCycles((c) => c + 1)
              return 'break'
            }
            return 'focus'
          })

          return wasFocus ? BREAK_TIME : FOCUS_TIME
        }
        return prev - 1
      })
    }, 1000)

    return clearTimer
  }, [status, mode, clearTimer, activeTaskId, activeTaskTitle, autoCycle, maxCycles])

  const total = mode === 'focus' ? FOCUS_TIME : BREAK_TIME
  const progress = 1 - timeLeft / total

  return {
    timeLeft, mode, status, cycles, progress, total,
    activeTaskId, activeTaskTitle, bindTask,
    autoCycle, setAutoCycle, maxCycles, setMaxCycles,
    start, pause, reset,
  }
}
