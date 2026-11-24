A magnet link identifies a BitTorrent torrent using its info hash. The link can also include a display name, tracker addresses, web seeds, or a metadata source. To see the actual file names and sizes, a client needs to retrieve the torrent metadata.

## How to inspect a magnet link

Paste a `magnet:?` link and select the lookup button. The viewer shows the info hash and any name or tracker addresses included in the link. When WebTorrent retrieves the metadata, the viewer shows the torrent name, file paths and sizes, total size, and piece information. You can filter the file list and copy the info hash.

## Why some magnet links do not resolve

In a browser, WebTorrent needs reachable peers that support WebRTC, typically found through a WebSocket tracker. Some magnet links also include an HTTPS metadata source that the browser can read. A link supported by a desktop torrent client may still time out here. If you have the `.torrent` file, use the linked file viewer to read it immediately.

## What the lookup connects to

The lookup runs in your browser. WebTorrent may contact trackers, peers, or a metadata source for the torrent you requested. Those services may see your IP address and the torrent you are looking up. The viewer requests metadata and does not download the files listed in it. Magnet links need a BitTorrent v1 info hash (`btih`), including links that also identify a v2 torrent.
