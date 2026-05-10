import { useState, useCallback, useMemo } from 'react'
import { loadSessions, saveSessions } from '../utils/storage'

export function useHistory() {
  const [sessions, setSessions] = useState(loadSessions)

  const recordSession = useCallback(({ duration, mode, taskId, taskTitle }) => {
    const session = {
      id: Date.now(),
      timestamp: Date.now(),
      duration,
      mode,
      taskId: taskId || null,
      taskTitle: taskTitle || null,
    }
    setSessions((prev) => {
      const next = [session, ...prev]
      saveSessions(next)
      return next
    })
  }, [])

  const getHeatmapData = useCallback((days = 84) => {
    const now = Date.now()
    const msPerDay = 86400000
    const map = {}

    for (let i = 0; i < days; i++) {
      const date = new Date(now - i * msPerDay)
      const key = date.toISOString().slice(0, 10)
      map[key] = 0
    }

    sessions.forEach((s) => {
      if (s.mode !== 'focus') return
      const key = new Date(s.timestamp).toISOString().slice(0, 10)
      if (key in map) map[key]++
    })

    return Object.entries(map)
      .map(([date, count]) => ({ date, count }))
      .reverse()
  }, [sessions])

  const getSummary = useCallback(() => {
    let totalFocusSeconds = 0
    let totalBreakSeconds = 0
    const taskCounts = {}
    let completedTodos = 0

    sessions.forEach((s) => {
      if (s.mode === 'focus') {
        totalFocusSeconds += s.duration
        if (s.taskId) {
          taskCounts[s.taskId] = (taskCounts[s.taskId] || 0) + 1
          completedTodos++
        }
      } else {
        totalBreakSeconds += s.duration
      }
    })

    const topTasks = Object.entries(taskCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, count]) => {
        const s = sessions.find((x) => x.taskId === Number(id))
        return { id: Number(id), title: s?.taskTitle || '未知', count }
      })

    return {
      totalFocusHours: Math.round((totalFocusSeconds / 3600) * 10) / 10,
      totalBreakHours: Math.round((totalBreakSeconds / 3600) * 10) / 10,
      totalSessions: sessions.filter((s) => s.mode === 'focus').length,
      topTasks,
    }
  }, [sessions])

  const getStats = useCallback(
    (period = 'week') => {
      const now = Date.now()
      const msPerDay = 86400000
      const days = period === 'week' ? 7 : period === 'month' ? 30 : 365
      const cutoff = now - days * msPerDay
      const periodSessions = sessions.filter((s) => s.timestamp > cutoff && s.mode === 'focus')

      const map = {}
      for (let i = 0; i < days; i++) {
        const date = new Date(now - i * msPerDay)
        const key = date.toISOString().slice(0, 10)
        map[key] = 0
      }

      periodSessions.forEach((s) => {
        const key = new Date(s.timestamp).toISOString().slice(0, 10)
        if (key in map) map[key]++
      })

      const entries = Object.entries(map)
        .map(([date, count]) => ({ date, count }))
        .reverse()

      const totalMinutes = Math.round(
        (periodSessions.reduce((sum, s) => sum + s.duration, 0) / 60)
      )

      return { entries, totalMinutes, sessionCount: periodSessions.length }
    },
    [sessions]
  )

  return { sessions, recordSession, getHeatmapData, getSummary, getStats }
}
