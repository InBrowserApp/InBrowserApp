export async function waitForVideo(
  video: HTMLVideoElement,
  event: "loadedmetadata" | "loadeddata" | "seeked",
  signal: AbortSignal
) {
  signal.throwIfAborted()
  if (video.error) throw video.error

  const listeners = new AbortController()
  const options = { once: true, signal: listeners.signal }
  try {
    await new Promise<void>((resolve, reject) => {
      video.addEventListener(event, () => resolve(), options)
      video.addEventListener("error", () => reject(video.error), options)
      signal.addEventListener("abort", () => reject(signal.reason), options)
    })
  } finally {
    listeners.abort()
  }
}

export async function seekVideo(
  video: HTMLVideoElement,
  seconds: number,
  signal: AbortSignal
) {
  signal.throwIfAborted()
  if (video.currentTime !== seconds) video.currentTime = seconds
  if (video.seeking) await waitForVideo(video, "seeked", signal)
  if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
    await waitForVideo(video, "loadeddata", signal)
  }
}
