type MetronomeSettings = {
  bpm: number
  beats: number
  division: number
  accent: boolean
  sound: boolean
}

function click(
  audio: AudioContext,
  output: GainNode,
  time: number,
  mainBeat: boolean,
  accented: boolean
) {
  const oscillator = audio.createOscillator()
  const envelope = audio.createGain()
  oscillator.frequency.value = accented ? 1400 : mainBeat ? 1000 : 760
  envelope.gain.setValueAtTime(mainBeat ? 0.4 : 0.16, time)
  envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.04)
  oscillator.connect(envelope).connect(output)
  oscillator.start(time)
  oscillator.stop(time + 0.045)
}

// Schedule clicks against the audio clock. The frame loop only paints beat indicators.
function playMetronome(
  audio: AudioContext,
  settings: () => MetronomeSettings,
  showBeat: (beat: number | null) => void
) {
  const output = audio.createGain()
  output.connect(audio.destination)
  const upcoming: { time: number; beat: number }[] = []
  let nextTime = audio.currentTime + 0.025
  let lastTime = nextTime
  let previousInterval: number | undefined
  let beat = 0
  let subdivision = 0
  let frameId: number
  let last: (typeof upcoming)[number] | undefined
  let visibleBeat: number | null = null

  function schedule() {
    const now = audio.currentTime
    const { bpm, beats, division, accent, sound } = settings()
    const interval = 60 / bpm / division
    output.gain.value = sound ? 1 : 0
    while (upcoming.length > 1 && upcoming[1]!.time <= now) upcoming.shift()
    if (previousInterval !== undefined && interval !== previousInterval) {
      nextTime = lastTime + interval
    }
    previousInterval = interval
    if (nextTime < now) {
      // After an interruption, continue from the next available audio time.
      nextTime = now + 0.025
    }
    while (nextTime < now + 0.12) {
      beat %= beats
      subdivision %= division
      const mainBeat = subdivision === 0
      if (mainBeat) upcoming.push({ time: nextTime, beat })
      click(audio, output, nextTime, mainBeat, accent && mainBeat && beat === 0)
      lastTime = nextTime
      nextTime += interval
      subdivision = (subdivision + 1) % division
      if (subdivision === 0) beat = (beat + 1) % beats
    }
  }

  function draw() {
    const now = audio.currentTime
    while (upcoming[0] && upcoming[0].time <= now) last = upcoming.shift()
    const active = last && now - last.time < 0.14 ? last.beat : null
    if (active !== visibleBeat) {
      visibleBeat = active
      showBeat(active)
    }
    frameId = requestAnimationFrame(draw)
  }

  schedule()
  const intervalId = window.setInterval(schedule, 25)
  frameId = requestAnimationFrame(draw)
  return () => {
    window.clearInterval(intervalId)
    cancelAnimationFrame(frameId)
    output.disconnect()
  }
}

export { playMetronome, type MetronomeSettings }
