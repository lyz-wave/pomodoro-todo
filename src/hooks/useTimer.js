import { useState, useRef, useEffect, useCallback } from 'react'

const FOCUS_TIME = 25 * 60
const BREAK_TIME = 5 * 60

const STATES = {
  idle: 'idle',
  running: 'running',
  paused: 'paused',
}

function createNotification() {
  if (Notification.permission === 'granted') {
    return
  }
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

export function useTimer() {
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME)
  const [mode, setMode] = useState('focus') // 'focus' | 'break'
  const [status, setStatus] = useState(STATES.idle)
  const [cycles, setCycles] = useState(0)
  const intervalRef = useRef(null)

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const start = useCallback(() => {
    createNotification()
    setStatus(STATES.running)
  }, [])

  const pause = useCallback(() => {
    setStatus(STATES.paused)
  }, [])

  const reset = useCallback(() => {
    clearTimer()
    setStatus(STATES.idle)
    setMode('focus')
    setTimeLeft(FOCUS_TIME)
  }, [clearTimer])

  useEffect(() => {
    if (status !== STATES.running) {
      clearTimer()
      return
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearTimer()
          playBeep()
          if (Notification.permission === 'granted') {
            new Notification(mode === 'focus' ? '专注结束，休息一下！' : '休息结束，继续专注！')
          }

          setMode((m) => {
            if (m === 'focus') {
              setCycles((c) => c + 1)
              return 'break'
            }
            return 'focus'
          })
          return mode === 'focus' ? BREAK_TIME : FOCUS_TIME
        }
        return prev - 1
      })
    }, 1000)

    return clearTimer
  }, [status, mode, clearTimer])

  const total = mode === 'focus' ? FOCUS_TIME : BREAK_TIME
  const progress = 1 - timeLeft / total

  return { timeLeft, mode, status, cycles, progress, total, start, pause, reset }
}
