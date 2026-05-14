import { afterEach, describe, expect, test, vi } from "vitest"

import {
  applyTorchConstraint,
  applyZoomConstraint,
  buildCameraConstraints,
  captureVideoFrame,
  defaultZoom,
  isPermissionError,
  resolveTrackControls,
} from "./browser-camera"

afterEach(() => {
  vi.restoreAllMocks()
})

describe("buildCameraConstraints", () => {
  test("builds photo constraints without audio", () => {
    expect(buildCameraConstraints("environment", "photo")).toEqual({
      video: {
        facingMode: { ideal: "environment" },
        width: { ideal: 1920 },
        height: { ideal: 1080 },
      },
      audio: false,
    })
  })

  test("builds video constraints with echo cancellation audio", () => {
    expect(buildCameraConstraints("user", "video")).toMatchObject({
      video: { facingMode: { ideal: "user" } },
      audio: { echoCancellation: true, noiseSuppression: true },
    })
  })

  test("can explicitly disable audio for video fallback", () => {
    expect(buildCameraConstraints("user", "video", false)).toMatchObject({
      audio: false,
    })
  })
})

describe("resolveTrackControls", () => {
  test("returns defaults when no track is available", () => {
    expect(resolveTrackControls(null)).toEqual({
      torchSupported: false,
      torchEnabled: false,
      zoom: defaultZoom,
    })
  })

  test("reads torch and zoom capabilities from the video track", () => {
    const track = {
      getCapabilities: () => ({
        torch: true,
        zoom: { min: 1, max: 4, step: 0.5 },
      }),
      getSettings: () => ({ zoom: 2 }),
    } as unknown as MediaStreamTrack

    expect(resolveTrackControls(track)).toEqual({
      torchSupported: true,
      torchEnabled: false,
      zoom: { supported: true, min: 1, max: 4, step: 0.5, value: 2 },
    })
  })
})

describe("track constraints", () => {
  test("applies torch constraints", async () => {
    const applyConstraints = vi.fn().mockResolvedValue(undefined)

    await applyTorchConstraint({ applyConstraints } as any, true)

    expect(applyConstraints).toHaveBeenCalledWith({
      advanced: [{ torch: true }],
    })
  })

  test("applies zoom constraints", async () => {
    const applyConstraints = vi.fn().mockResolvedValue(undefined)

    await applyZoomConstraint({ applyConstraints } as any, 2.5)

    expect(applyConstraints).toHaveBeenCalledWith({
      advanced: [{ zoom: 2.5 }],
    })
  })
})

describe("captureVideoFrame", () => {
  test("draws and exports a mirrored JPEG frame", async () => {
    const blob = new Blob(["photo"], { type: "image/jpeg" })
    const context = {
      translate: vi.fn(),
      scale: vi.fn(),
      drawImage: vi.fn(),
    }
    const canvas = {
      width: 0,
      height: 0,
      getContext: vi.fn(() => context),
      toBlob: vi.fn((callback: BlobCallback) => callback(blob)),
    }
    vi.spyOn(document, "createElement").mockReturnValue(canvas as any)

    const result = await captureVideoFrame(
      { videoWidth: 640, videoHeight: 480 } as HTMLVideoElement,
      true
    )

    expect(result).toBe(blob)
    expect(canvas.width).toBe(640)
    expect(canvas.height).toBe(480)
    expect(context.translate).toHaveBeenCalledWith(640, 0)
    expect(context.scale).toHaveBeenCalledWith(-1, 1)
    expect(context.drawImage).toHaveBeenCalled()
  })

  test("returns null when the canvas context is unavailable", async () => {
    vi.spyOn(document, "createElement").mockReturnValue({
      getContext: vi.fn(() => null),
    } as any)

    await expect(
      captureVideoFrame(
        { videoWidth: 1, videoHeight: 1 } as HTMLVideoElement,
        false
      )
    ).resolves.toBeNull()
  })
})

describe("isPermissionError", () => {
  test("matches browser permission errors", () => {
    expect(
      isPermissionError(new DOMException("Denied", "NotAllowedError"))
    ).toBe(true)
    expect(isPermissionError(new DOMException("Denied", "SecurityError"))).toBe(
      false
    )
    expect(isPermissionError(new Error("Denied"))).toBe(false)
  })
})
