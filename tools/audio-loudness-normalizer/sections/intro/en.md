## Normalize audio to a target LUFS

Match the perceived loudness of podcast episodes, voice-overs, and music tracks. The normalizer measures integrated loudness across the recording, then applies one gain adjustment to every channel. Quiet and loud parts keep their relationship. Choose a preset or enter the LUFS value specified by your project.

## How to normalize an audio file

1. Choose or drop a mono or stereo recording. Common inputs include WAV, MP3, M4A, FLAC, and OGG. The codecs available depend on your browser.
2. Select a target such as −16 LUFS for a podcast, −14 LUFS for music, or −23 LUFS for broadcast. Publishing requirements vary, so use a custom target if you have a delivery specification.
3. Compare the original and normalized readings, play the result, and download a 16-bit, 48 kHz WAV. Decoding, analysis, and export happen on your device.

## What is the difference between LUFS and true peak?

Integrated LUFS estimates the perceived loudness of the entire recording using frequency weighting and a loudness gate. True peak, shown in dBTP, estimates how high the reconstructed signal can reach between samples. Two tracks can have similar peaks and very different loudness, which is why matching peaks alone often leaves one track sounding quieter.

## Why is the result quieter than my target?

A short transient can reach the −1 dBTP ceiling before the overall loudness reaches the target. The tool reduces the gain in that case and shows the achievable reading. For a louder master with the same headroom, control high peaks in your audio editor before normalizing. A silent file may have no measurable integrated loudness.
