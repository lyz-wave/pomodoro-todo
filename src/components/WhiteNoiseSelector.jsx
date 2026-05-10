const SOUNDS = [
  { value: 'none', label: '关', icon: '✕' },
  { value: 'rain', label: '雨声', icon: '🌧' },
  { value: 'forest', label: '森林', icon: '🌲' },
  { value: 'cafe', label: '咖啡馆', icon: '☕' },
  { value: 'white', label: '白噪音', icon: '〰' },
]

export default function WhiteNoiseSelector({ soundType, onChangeSound, volume, onChangeVolume }) {
  return (
    <div className="white-noise-selector">
      <span className="wn-label">环境音</span>
      <div className="wn-buttons">
        {SOUNDS.map((s) => (
          <button
            key={s.value}
            className={`wn-btn ${soundType === s.value ? 'active' : ''}`}
            onClick={() => onChangeSound(s.value)}
            title={s.label}
          >
            <span className="wn-icon">{s.icon}</span>
            <span className="wn-text">{s.label}</span>
          </button>
        ))}
      </div>
      {soundType !== 'none' && (
        <div className="wn-volume-row">
          <span className="wn-vol-label">音量</span>
          <input
            type="range"
            className="wn-volume"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => onChangeVolume(Number(e.target.value))}
          />
        </div>
      )}
    </div>
  )
}
