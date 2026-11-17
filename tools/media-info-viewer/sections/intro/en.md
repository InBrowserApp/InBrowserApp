## What this viewer shows

Media Info Viewer reads the technical metadata of local audio and video files,
including MP4, MOV, MKV, WebM, AVI, MP3, FLAC and WAV. Use it to check an export's
specifications, check a movie’s audio language tags, or gather a technical
report for troubleshooting. Analysis starts as soon as you choose or drop a file.

## File, video, audio and subtitle details

- **File overview:** actual container format, file size, duration, overall bitrate,
  title and encoding application, when available.
- **Video tracks:** codec, profile and bitrate, resolution, frame rate and frame rate mode,
  aspect ratio, rotation, bit depth, color space, chroma subsampling and HDR format.
- **Audio tracks:** codec, bitrate, language, track title, channel count and layout,
  sample rate, bit depth, and default or forced flags. Each audio track is listed
  separately, so original sound, dubbing and commentary tracks remain distinct.
- **Subtitle tracks:** format, language, title, duration, and default or forced
  flags when included in the file.

Core specifications are visible immediately. Open **Technical details** within a
track for additional fields, or select a track-count link to jump to the first
track of that type. Available fields depend on the format and its metadata.

## How to inspect a file

1. Choose one local audio or video file, or drag it into the file area.
2. Check the summary, then inspect the individual video, audio and subtitle tracks.
3. Copy the readable report for a message or support ticket, or download JSON for
   an asset inventory, script or further analysis. Both include technical fields
   that are folded away in the interface.
4. Choose **Change file** to inspect another file, or **Remove file** to clear the
   results. Selecting another file or removing the current one also stops any
   analysis that is still running.

## Understanding the numbers

- **Container and codec describe different things.** MP4 and Matroska are
  containers; AVC/H.264, HEVC/H.265 and AAC describe how streams are encoded.
  One container can hold several audio or subtitle tracks.
- **Overall bitrate covers the whole file.** It includes all streams and container
  overhead. A track's bitrate applies to that stream alone. Bitrates use kb/s or
  Mb/s; file sizes use B, KiB, MiB, GiB or TiB.
- **Duration includes milliseconds.** The display uses `HH:MM:SS.mmm`. Frame rate
  uses fps, and audio sample rate uses kHz. CFR indicates constant frame rate;
  VFR indicates variable frame rate.
- **Track flags describe intended selection.** Default marks a preferred track;
  forced is commonly used for subtitles intended to appear without selecting a
  full subtitle track. These are separate flags reported from the file.

Some containers do not provide a separate bitrate for every stream. Unavailable
values remain absent or are marked as not available; they are not guessed from
the filename. Embedded cover art is not counted as a video track.

## Common uses

Check resolution and frame rate after exporting a video, inspect channels and
sample rate before editing audio, identify multiple language or commentary
tracks, or collect codec details when investigating a playback problem. The
report lets you share the relevant specifications without sending the media file.

## Local processing and report exports

Analysis takes place in your browser: the media file is not uploaded and its
contents are not changed. The analyzer reads file segments as needed, so it can
inspect metadata even when the browser cannot play the container or codec.

**Copy report** produces a readable text summary. **Download JSON** exports the
metadata returned by the analyzer, together with the file name and size. In JSON,
`Duration` uses seconds, `BitRate` and `OverallBitRate` use bits per second, and
`SamplingRate` uses hertz. The interface formats these into more readable units. The export also
retains additional metadata fields beyond those shown in the track cards.
