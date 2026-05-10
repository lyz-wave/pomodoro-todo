import { useState, useRef, useEffect, useCallback } from 'react'

const SAMPLE_RATE = 44100

let sharedCtx = null
function getAudioContext() {
  if (!sharedCtx) {
    sharedCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  return sharedCtx
}

function createNoiseBuffer(duration = 2) {
  const ctx = getAudioContext()
  const length = SAMPLE_RATE * duration
  const buffer = ctx.createBuffer(1, length, SAMPLE_RATE)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < length; i++) {
    data[i] = Math.random() * 2 - 1
  }
  return buffer
}

// Rain: bandpass-filtered noise with amplitude modulation
function createRain(masterGain) {
  const ctx = getAudioContext()
  const buffer = createNoiseBuffer(3)
  const source = ctx.createBufferSource()
  source.buffer = buffer
  source.loop = true

  const bandpass = ctx.createBiquadFilter()
  bandpass.type = 'bandpass'
  bandpass.frequency.value = 800
  bandpass.Q.value = 1

  // 3 Hz modulation for rain patter
  const modOsc = ctx.createOscillator()
  const modGain = ctx.createGain()
  modOsc.frequency.value = 3
  modOsc.type = 'sine'
  modGain.gain.value = 0.6

  modOsc.connect(modGain)
  source.connect(bandpass)
  bandpass.connect(modGain)
  modGain.connect(masterGain)

  source.start()
  modOsc.start()

  return { source, bandpass, modOsc, modGain }
}

// Forest: low wind + chirping birds
function createForest(masterGain) {
  const ctx = getAudioContext()
  const nodes = []

  // Wind layer: lowpassed noise
  const windBuf = createNoiseBuffer(4)
  const windSrc = ctx.createBufferSource()
  windSrc.buffer = windBuf
  windSrc.loop = true

  const lowpass = ctx.createBiquadFilter()
  lowpass.type = 'lowpass'
  lowpass.frequency.value = 300

  const windGain = ctx.createGain()
  windGain.gain.value = 0.5

  windSrc.connect(lowpass)
  lowpass.connect(windGain)
  windGain.connect(masterGain)
  windSrc.start()
  nodes.push(windSrc, lowpass, windGain)

  // Bird chirps: sine oscillators with random gating
  const birdFreqs = [2200, 2800, 3400]
  birdFreqs.forEach((freq) => {
    const osc = ctx.createOscillator()
    const chirpGain = ctx.createGain()
    osc.frequency.value = freq
    osc.type = 'sine'
    chirpGain.gain.value = 0

    osc.connect(chirpGain)
    chirpGain.connect(masterGain)
    osc.start()

    // Schedule random chirps
    function scheduleChirp() {
      const now = ctx.currentTime
      const wait = 1 + Math.random() * 4
      const duration = 0.05 + Math.random() * 0.15
      chirpGain.gain.setValueAtTime(0, now)
      chirpGain.gain.linearRampToValueAtTime(0.08, now + 0.01)
      chirpGain.gain.linearRampToValueAtTime(0, now + duration)
      setTimeout(scheduleChirp, wait * 1000)
    }
    scheduleChirp()

    nodes.push(osc, chirpGain)
  })

  return { nodes, stop: () => nodes.forEach((n) => { try { n.disconnect() } catch {} }) }
}

// Cafe: low hum + murmur bursts
function createCafe(masterGain) {
  const ctx = getAudioContext()
  const nodes = []

  // Hum layer
  const humBuf = createNoiseBuffer(3)
  const humSrc = ctx.createBufferSource()
  humSrc.buffer = humBuf
  humSrc.loop = true

  const lowpass = ctx.createBiquadFilter()
  lowpass.type = 'lowpass'
  lowpass.frequency.value = 400

  const humGain = ctx.createGain()
  humGain.gain.value = 0.6

  humSrc.connect(lowpass)
  lowpass.connect(humGain)
  humGain.connect(masterGain)
  humSrc.start()
  nodes.push(humSrc, lowpass, humGain)

  // Murmur bursts
  const murmurBuf = createNoiseBuffer(0.5)
  function scheduleMurmur() {
    const murmurSrc = ctx.createBufferSource()
    murmurSrc.buffer = murmurBuf
    const murmurGain = ctx.createGain()
    const murmurLowpass = ctx.createBiquadFilter()
    murmurLowpass.type = 'lowpass'
    murmurLowpass.frequency.value = 600

    murmurSrc.connect(murmurLowpass)
    murmurLowpass.connect(murmurGain)
    murmurGain.connect(masterGain)

    const now = ctx.currentTime
    const duration = 0.05 + Math.random() * 0.25
    murmurGain.gain.setValueAtTime(0.15, now)
    murmurGain.gain.linearRampToValueAtTime(0, now + duration)
    murmurSrc.start(now)
    murmurSrc.stop(now + duration + 0.1)

    const wait = 0.5 + Math.random() * 3
    setTimeout(scheduleMurmur, wait * 1000)
  }
  scheduleMurmur()

  return { nodes, stop: () => nodes.forEach((n) => { try { n.disconnect() } catch {} }) }
}

// White noise: flat spectrum
function createWhiteNoise(masterGain) {
  const ctx = getAudioContext()
  const buffer = createNoiseBuffer(3)
  const source = ctx.createBufferSource()
  source.buffer = buffer
  source.loop = true

  source.connect(masterGain)
  source.start()

  return { source }
}

const SOUND_BUILDERS = {
  rain: createRain,
  forest: createForest,
  cafe: createCafe,
  white: createWhiteNoise,
}

export function useWhiteNoise() {
  const [soundType, setSoundType] = useState('none')
  const [volume, setVolumeState] = useState(0.3)
  const activeRef = useRef(null) // { type, nodes, masterGain }

  const setVolume = useCallback((v) => {
    setVolumeState(v)
    if (activeRef.current?.masterGain) {
      activeRef.current.masterGain.gain.setValueAtTime(v, getAudioContext().currentTime)
    }
  }, [])

  const stop = useCallback(() => {
    const a = activeRef.current
    if (!a) return
    const ctx = getAudioContext()
    a.masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5)
    setTimeout(() => {
      if (a.stop) a.stop()
      else if (a.source) { try { a.source.stop() } catch {} }
      try { a.masterGain.disconnect() } catch {}
      if (activeRef.current === a) activeRef.current = null
    }, 600)
  }, [])

  const play = useCallback((type) => {
    stop()
    if (!type || type === 'none') return

    const builder = SOUND_BUILDERS[type]
    if (!builder) return

    const ctx = getAudioContext()
    if (ctx.state === 'suspended') ctx.resume()

    const masterGain = ctx.createGain()
    masterGain.gain.setValueAtTime(0, ctx.currentTime)
    masterGain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 1)
    masterGain.connect(ctx.destination)

    const result = builder(masterGain)
    const nodes = result.nodes || [result.source, result.modOsc, result.modGain, result.bandpass].filter(Boolean)

    activeRef.current = { type, nodes, masterGain, stop: result.stop }
  }, [volume, stop])

  const changeSound = useCallback((type) => {
    setSoundType(type)
  }, [])

  // When soundType changes, play the new sound
  useEffect(() => {
    if (soundType === 'none') {
      stop()
      return
    }
    play(soundType)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soundType])

  // Cleanup on unmount
  useEffect(() => {
    return () => stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { soundType, changeSound, volume, setVolume, stop, play: () => play(soundType) }
}
