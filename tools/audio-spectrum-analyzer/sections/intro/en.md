## Inspect the frequencies in an audio file

Use the audio spectrum analyzer to find a low hum, compare frequency content, or see where a recording loses high frequencies. The chart shows frequency in hertz (Hz) and level in decibels relative to digital full scale (dBFS). Peaks show which frequency bands have the most energy in the analyzed recording.

## How to view an audio spectrum

1. Choose or drop a mono or stereo WAV, MP3, M4A, FLAC, or OGG file. Decoding support depends on your browser.
2. Look for the strongest frequency, then point to or tap the plot to read another frequency and its level. The slider gives you the same readings with a keyboard.
3. Switch between logarithmic and linear scales as needed. Play the original file to hear the recording while you inspect the chart. Analysis and playback stay on your device.

## How to read the FFT chart

The tool decodes at 48 kHz and analyzes short, Hann-windowed sections sampled across the file with a fast Fourier transform (FFT). It averages their power and combines stereo channels by power, so sounds that are out of phase across channels still show up. The chart reaches 24 kHz. Its level readings describe individual frequency bins, so they differ from overall volume, peak sample level, or integrated LUFS.

A sharp peak near 50 or 60 Hz may indicate electrical hum. A sudden drop at high frequencies may come from filtering or compression. A single peak can be a harmonic, so check nearby peaks before using it to identify the pitch of a note.

## When should I use logarithmic or linear frequency?

The logarithmic scale gives bass and midrange more room and makes it easier to follow octaves. The linear scale gives every equal change in Hz the same distance, which helps when comparing evenly spaced harmonics. This chart summarizes frequency content across the recording. A spectrogram is useful when you need to see when a sound occurs or how its frequency changes over time.
