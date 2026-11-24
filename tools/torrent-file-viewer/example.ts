// A small v1 torrent for two sample text files. The file data is not included.
const example =
  "d8:announce40:https://tracker.example.com:443/announce" +
  "4:infod5:filesld6:lengthi17e4:pathl10:README.txteed6:lengthi22e4:pathl4:docs9:notes.txteee" +
  "4:name14:Sample torrent12:piece lengthi16384e6:pieces20:"

const pieceHash = "7195a0486854c885296e4f54dfb9ab9cd34c8b94"

function exampleTorrent() {
  const hashBytes = Uint8Array.from(pieceHash.match(/../g)!, (byte) =>
    Number.parseInt(byte, 16)
  )
  return new Blob([example, hashBytes, "ee"])
}

export { exampleTorrent }
