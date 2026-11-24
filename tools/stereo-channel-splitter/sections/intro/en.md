## Split stereo audio into left and right channels

Open a stereo recording to extract its left and right channels as two separate mono files. The splitter is useful when two microphones were recorded into opposite sides of one file, when you need to check noise on one side, or when you want to edit the channels independently in an audio editor.

## How to split a stereo file

1. Choose a stereo audio file or drag it onto the tool. The channels are split automatically.
2. Use the player under each channel to hear what was recorded on that side.
3. Choose one download format for both channels, then save either channel or both. With WAV selected, `interview.wav` becomes `interview-left.wav` and `interview-right.wav`.

Each file contains one channel and keeps the full recording, so the two files line up when placed at the same start time in an editor. During playback, each mono preview plays centered. To identify the source channel, use the label above its player.

## Which audio format should I download?

- **WAV** is the default and works well for editing. For supported PCM recordings, it preserves the source sample rate and precision.
- **FLAC** compresses the samples losslessly for a smaller file. Choose WAV when the FLAC encoder cannot preserve the recording’s sample rate or precision, such as with floating-point WAV.
- **MP3** creates smaller files for sharing. Exporting MP3 applies lossy compression, including when the recording is already an MP3. If MP3 cannot use the source sample rate, it uses the closest supported rate. Choose WAV or FLAC to avoid another round of lossy compression.

Common inputs include stereo WAV, MP3, M4A, FLAC, and OGG. Support depends on your browser and the codec inside the file. If a file cannot be opened, try exporting it as a stereo WAV and opening that copy. The browser reads the recording and creates the downloads on your device.

## What can I separate with a stereo splitter?

A stereo file stores two channels. Splitting keeps their audio in two files, while mixing down to mono combines them into one. If voices and instruments are already mixed together in a channel, they stay together in the export. A mono recording has only one channel to begin with. For a surround recording, export the desired stereo pair in an audio editor first.
