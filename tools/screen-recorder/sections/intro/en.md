# Screen recorder

Record a browser-selected screen, window, or tab without uploading video to a
server. The tool uses your browser's Screen Capture and MediaRecorder APIs, so
the recording stays local until you download it.

## When to use it

Use the recorder for short demos, bug reports, walkthroughs, QA notes, or quick
internal videos where a lightweight browser workflow is enough. You can ask the
browser to include tab or system audio and optionally mix in your microphone
before the recording starts.

## Privacy and browser support

The browser decides which capture sources and audio options are available. Some
browsers only share audio for the current tab, some require HTTPS, and some do
not support pausing or recording at all. If permission is denied, no stream is
kept and you can retry with different settings.

## Tips for reliable recordings

Close unrelated capture sessions before starting, pick the smallest useful
source, and do a short test when audio matters. Download the result before
clearing it, because recordings are held only in the current page session.
