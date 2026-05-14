## What does this camera tool do?

This tool turns the current browser tab into a local camera capture surface. It can open your device camera, take a still photo, record a short video when the browser supports `MediaRecorder`, preview the latest capture, and download the file.

## Good use cases

- Taking a quick profile photo or webcam snapshot without opening a separate app.
- Recording a short visual note when you need a disposable browser-local clip.
- Checking front and rear camera behavior, zoom support, or torch support on a device.

## Privacy and browser limits

The media stream stays in your browser and is not uploaded by this tool. Camera, microphone, torch, zoom, available devices, and recording formats still depend on the browser, the operating system, the device hardware, and whether the page is served from a secure context such as HTTPS or localhost.

- The preview, capture, and export happen locally in this browser.
- Photos are saved as JPEG. Video format depends on what the current browser can record, usually WebM or MP4.
- Camera and microphone prompts are controlled by the browser. This page cannot bypass blocked permissions.
