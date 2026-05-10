import { useState } from 'react'
import Heatmap from './Heatmap'

const PERIODS = [
  { value: 'week', label: '本周' },
  { value: 'month', label: '本月' },
  { value: 'year', label: '今年' },
]

export default function HistoryPanel({ summary, stats, heatmapData, onPeriodChange }) {
  const [period, setPeriod] = useState('week')

  function handlePeriodChange(p) {
    setPeriod(p)
    onPeriodChange?.(p)
  }

  const s = stats(period)

  return (
    <div className="history-panel">
      <div className="summary-cards">
        <div className="summary-card">
          <span className="summary-number">{summary.totalFocusHours}</span>
          <span className="summary-label">总专注小时</span>
        </div>
        <div className="summary-card">
          <span className="summary-number">{summary.totalSessions}</span>
          <span className="summary-label">总专注次数</span>
        </div>
        {summary.topTasks.length > 0 && (
          <div className="summary-card">
            <span className="summary-number">{summary.topTasks[0].count}</span>
            <span className="summary-label">最多番茄任务</span>
            <span className="summary-detail">{summary.topTasks[0].title}</span>
          </div>
        )}
      </div>

      <div className="period-select">
        {PERIODS.map((p) => (
          <button
            key={p.value}
            className={`filter-btn ${period === p.value ? 'active' : ''}`}
            onClick={() => handlePeriodChange(p.value)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="bar-chart">
        {s.entries.length > 0 && s.entries.map((entry) => {
          const maxCount = Math.max(...s.entries.map((e) => e.count), 1)
          const height = (entry.count / maxCount) * 100
          return (
            <div key={entry.date} className="bar-item">
              <div className="bar-fill-wrap">
                <div
                  className="bar-fill"
                  style={{ height: `${Math.max(height, 2)}%` }}
                  title={`${entry.date}: ${entry.count} 次`}
                />
              </div>
              <span className="bar-label">
                {period === 'year'
                  ? entry.date.slice(5, 7) + '月'
                  : entry.date.slice(5)}
              </span>
            </div>
          )
        })}
        {s.entries.length === 0 && (
          <div className="bar-empty">暂无数据</div>
        )}
      </div>

      <div className="period-summary">
        <span>{s.totalMinutes} 分钟 · {s.sessionCount} 次专注</span>
      </div>

      <Heatmap data={heatmapData} />
    </div>
  )
}
