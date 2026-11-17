## About the subtitle converter

Convert existing subtitle files between 19 timed-text formats, or export a plain-text transcript. Common tasks include changing SRT to VTT for a web video, turning ASS or SSA dialogue into SRT, preparing captions for a video platform, and collecting several converted episodes in one ZIP. Conversion runs in your browser; subtitle files and pasted content are not uploaded.

The tool works with caption text and its timing. Choose files or paste subtitles, select an output format, and use the preview to inspect the result before downloading. You can edit pasted input and convert it again without changing the original file on your device.

## How to convert subtitles

1. Select **Choose files** to open one or more subtitle files, drag files onto the input panel, or paste subtitle text into the editor. **Try an example** loads a short SRT sample with two captions.
2. Leave **Input format** on **Auto-detect** for normal use. Detection examines the content rather than relying only on the filename. Select the source format yourself if a file is ambiguous.
3. Choose an **Output format**. For a typical website caption track, choose WebVTT; for a player or editor requesting an SRT file, choose SubRip.
4. Open **Conversion settings** when you need another file encoding, a frame rate, or a timing offset. Change these settings before converting.
5. Select **Convert subtitles**. The result identifies the source and output formats, the output filename, and the number of converted captions.
6. Switch between **Preview** and **File content**, then copy the converted text or download the file. The table shows up to 100 captions; file content and downloads include the complete result.

**Clear** removes the current input and results from the page. Choosing a new group of files replaces the previous selection. The converter does not keep a subtitle history, so download results you want to retain.

## Supported formats and output precision

All entries below support reading and writing except TXT, which is an export for readable transcripts. Different formats store time differently; choosing a lower-precision format rounds timestamps to its supported units.

| Format                               | Extension | Written timing                     |
| ------------------------------------ | --------- | ---------------------------------- |
| SubRip                               | `.srt`    | Milliseconds                       |
| WebVTT                               | `.vtt`    | Milliseconds                       |
| Advanced SubStation Alpha            | `.ass`    | Hundredths of a second             |
| SubStation Alpha                     | `.ssa`    | Hundredths of a second             |
| YouTube SubViewer                    | `.sbv`    | Milliseconds                       |
| MicroDVD                             | `.sub`    | Video frames                       |
| SubViewer 2.0                        | `.sub`    | Hundredths of a second             |
| SAMI                                 | `.smi`    | Milliseconds                       |
| LRC lyrics                           | `.lrc`    | Hundredths of a second for starts  |
| Timed Text                           | `.ttml`   | Milliseconds                       |
| Distribution Format Exchange Profile | `.dfxp`   | Milliseconds                       |
| YouTube SRV3                         | `.srv3`   | Milliseconds                       |
| YouTube transcript XML               | `.xml`    | Seconds with millisecond precision |
| MPL2                                 | `.mpl`    | Tenths of a second                 |
| Spruce Subtitle, text format         | `.stl`    | Video frames                       |
| QuickTime Text                       | `.qt.txt` | Milliseconds                       |
| JSON                                 | `.json`   | Millisecond numbers                |
| CSV                                  | `.csv`    | Millisecond numbers                |
| TSV                                  | `.tsv`    | Millisecond numbers                |
| Plain-text transcript, export only   | `.txt`    | No timestamps                      |

TTML input also accepts compatible iTT files. DFXP belongs to the TTML family. Exporting TTML does not recreate every platform-specific profile, layout or styling rule.

The `.sub` extension can mean either text-based MicroDVD or SubViewer here. Binary VobSub is a different format. Likewise, the supported `.stl` format is text-based Spruce STL, rather than binary EBU STL. Choose the format by its full name when these extensions are ambiguous.

## Choosing between SRT, VTT, ASS and plain text

**SRT** is a useful choice when a video player, editor or upload form requests SubRip captions. **VTT** is the format used by HTML video text tracks and can also carry web-specific cue settings. Converting between them preserves caption text and millisecond timing while rebuilding the file syntax.

A numbered SRT cue uses a comma before milliseconds:

```text
1
00:00:01,250 --> 00:00:03,500
Hello, world!
```

The same caption as WebVTT has a file header and decimal-point timestamps:

```text
WEBVTT

00:00:01.250 --> 00:00:03.500
Hello, world!
```

**ASS and SSA** are useful interchange options when your next application requires them. Supported bold, italic and underline formatting can travel between formats that represent it. Fonts, screen positioning, drawing commands, karaoke animation and other advanced presentation features are simplified; graphical ASS events without readable dialogue are skipped. The converter focuses on readable captions rather than reproducing an authored animation or layout.

**TXT** extracts readable dialogue without timestamps or styling. Its preview displays the exported text instead of a timing table. TXT export does not invent caption timings, transcribe speech or translate the spoken language.

## File encoding and readable text

Automatic file decoding uses UTF-8, or UTF-16 when a byte-order mark identifies it. For older files, choose the original encoding if characters look wrong or the file cannot be decoded. Available choices include Windows-1252, Windows-1251, GB18030, Big5, Shift_JIS and EUC-KR, alongside explicit UTF-8 and UTF-16 options.

For example, try GB18030 for a Chinese subtitle known to have been saved in that encoding, or Shift_JIS for a Japanese file from an older application. Encoding changes how existing bytes are read; it does not translate their meaning. Convert again after selecting a different encoding. Downloaded subtitle files use UTF-8, regardless of the input encoding.

## Adjusting timing and frame rate

### Move all captions earlier or later

The time offset is measured in milliseconds. A value of `1500` delays every caption by 1.5 seconds; `-500` shows captions half a second earlier. For a caption beginning at `00:00:01.250`, those settings produce `00:00:02.750` and `00:00:00.750`, respectively.

An offset shifts both the start and end, keeping the duration until it reaches the beginning of the timeline. Captions shifted entirely before zero are removed; a caption that partly crosses zero starts at zero. An offset corrects a constant delay. It does not correct a subtitle track whose drift changes throughout a video.

### Use frame rate for frame-based timestamps

MicroDVD and Spruce STL use video frames, so their frame rate determines how frames map to elapsed time. TTML can also contain frame-based timing. Use the frame rate of the source video, such as `23.976`, `24`, `25` or `29.97`, when it is needed to interpret the input.

An embedded input frame rate takes priority when the format supplies one. For frame-based output, the chosen setting determines the written frame rate. Changing this setting does not rescale ordinary SRT or VTT clock timestamps; it changes how frame-based timestamps are interpreted or written.

### Understand rounding and missing end times

SRT and VTT keep millisecond precision. ASS, SSA, SubViewer and LRC round to hundredths; MPL2 rounds to tenths; frame-based output rounds to frames. A very short caption retains a positive duration after rounding. The preview reflects the exported format's timing, rather than showing unrounded input timestamps.

LRC can provide starts without ends. Missing ends use the next distinct start, or two seconds for the final caption. LRC export cannot retain the original gaps and overlapping end times, and multiline captions become single lyric lines. QuickTime Text uses timeline markers; SAMI and QuickTime can rebuild overlapping captions as combined text at each timing boundary, so the result may contain a different number of caption segments.

## Batch conversion and ZIP downloads

Choose or drop several files to convert them with the same output format and settings. Select a result from the filename menu to inspect it. Files that cannot be converted keep their own error, while successful results remain available for individual download.

When at least two files convert successfully, **Download all as ZIP** collects those outputs. The archive contains successful conversions only. Review visible errors, adjust the input format or encoding as appropriate, and convert again for any remaining files.

Output filenames keep the source basename and use the chosen extension: `episode01.srt` becomes `episode01.vtt`, for example. If several results would have the same name, a suffix such as ` (2)` keeps their ZIP entries distinct. ZIP is a download option here; choose the subtitle files themselves as input.

## JSON, CSV and TSV interchange

JSON uses an array of caption objects with millisecond `start` and `end` values and a `text` string:

```json
[
  { "start": 1250, "end": 3500, "text": "Hello, world!" },
  { "start": 4000, "end": 6000, "text": "Another caption." }
]
```

The reader also accepts Whisper-style JSON containing a `segments` array, where segment `start` and `end` values are in seconds. This is a separate input convention; regular JSON export continues to use milliseconds.

CSV and TSV use `start`, `end` and `text` column names. Input times can be millisecond numbers or clock timestamps. CSV quotes fields containing commas, quotes or line breaks; TSV uses tabs between columns. Both exports write millisecond numbers. Use these formats when moving captions into a spreadsheet or another caption-processing workflow.

## Common questions

### Why do the preview and downloaded text look different?

The preview table shows readable caption text and the target format's timing. File content shows the actual serialized file, including headers, numbering, delimiters and supported formatting syntax. Downloads contain that complete serialized content, even when the table stops at the first 100 captions.

### Why did styling or positioning change?

Formats do not share the same styling model. Supported basic formatting is preserved where it can be represented; advanced styles, web cue positioning, animation and platform metadata are not reproduced in full. Use the file content view to inspect the export and test it in the player or editor where you will use it.

### Can this extract subtitles from a video or image track?

Start with an existing text subtitle file. Extract embedded subtitle tracks from the video first. Image-based PGS/SUP and VobSub/IDX tracks need OCR to become text; binary EBU STL needs a subtitle editor that can read that format.

### Where can I check the format specifications?

See the [WebVTT specification](https://www.w3.org/TR/webvtt1/), the [TTML specification](https://www.w3.org/TR/ttml2/), and [YouTube's supported subtitle formats](https://support.google.com/youtube/answer/2734698) for their file syntax and platform requirements.
