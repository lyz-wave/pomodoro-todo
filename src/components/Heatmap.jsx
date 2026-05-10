const DAY_LABELS = ['日', '一', '二', '三', '四', '五', '六']

function getCellColor(count) {
  if (count === 0) return 'rgba(255,255,255,0.03)'
  if (count === 1) return 'rgba(245,158,11,0.15)'
  if (count === 2) return 'rgba(245,158,11,0.3)'
  if (count === 3) return 'rgba(245,158,11,0.5)'
  return 'var(--amber)'
}

export default function Heatmap({ data }) {
  if (!data || data.length === 0) {
    return <div className="heatmap-empty">暂无数据，完成番茄钟后这里会显示热力图</div>
  }

  const totalWeeks = Math.ceil(data.length / 7)
  const padded = [...data]
  while (padded.length < totalWeeks * 7) {
    padded.push({ date: '', count: -1 })
  }

  const weeks = []
  for (let w = 0; w < totalWeeks; w++) {
    weeks.push(padded.slice(w * 7, (w + 1) * 7))
  }

  const monthLabels = []
  const seenMonths = []
  weeks.forEach((week, wi) => {
    const firstDay = week.find((d) => d.date)
    if (!firstDay) return
    const m = firstDay.date.slice(5, 7)
    if (!seenMonths.includes(m)) {
      seenMonths.push(m)
      monthLabels.push({ label: `${parseInt(m)}月`, week: wi })
    }
  })

  return (
    <div className="heatmap-container">
      <div className="heatmap-scroll">
        <table className="heatmap-table">
          <thead>
            <tr className="heatmap-month-row">
              <td className="heatmap-gutter" />
              {weeks.map((_, wi) => (
                <td key={wi} className="heatmap-month-label">
                  {monthLabels.find((m) => m.week === wi)?.label || ''}
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            {DAY_LABELS.map((label, dayIdx) => (
              <tr key={dayIdx}>
                <td className="heatmap-day-label">{label}</td>
                {weeks.map((week, wi) => {
                  const cell = week[dayIdx]
                  if (!cell || cell.count === -1) {
                    return <td key={wi} className="heatmap-cell empty" />
                  }
                  return (
                    <td key={wi} className="heatmap-cell" title={`${cell.date}: ${cell.count} 次专注`}>
                      <div
                        className="heatmap-block"
                        style={{ backgroundColor: getCellColor(cell.count) }}
                      />
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
