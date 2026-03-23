export function createAudio() {
  const audioCtx =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new (window.AudioContext || (window as any).webkitAudioContext)()

  function shoot() {
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()

    osc.type = "square"
    osc.frequency.value = 400
    gain.gain.value = 0.04

    osc.connect(gain)
    gain.connect(audioCtx.destination)

    osc.start()
    osc.stop(audioCtx.currentTime + 0.05)
  }

  return { shoot }
}