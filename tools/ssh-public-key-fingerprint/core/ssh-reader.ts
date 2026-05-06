class SshReader {
  private offset = 0

  constructor(private readonly bytes: Uint8Array) {}

  readString() {
    const length = this.readUint32()

    if (this.offset + length > this.bytes.length) {
      throw new Error("Unexpected end of SSH key data.")
    }

    const value = this.bytes.slice(this.offset, this.offset + length)
    this.offset += length

    return value
  }

  readStringAsText() {
    return new TextDecoder().decode(this.readString())
  }

  readMpint() {
    return this.readString()
  }

  private readUint32() {
    if (this.offset + 4 > this.bytes.length) {
      throw new Error("Unexpected end of SSH key data.")
    }

    const view = new DataView(
      this.bytes.buffer,
      this.bytes.byteOffset + this.offset,
      4
    )
    const value = view.getUint32(0, false)
    this.offset += 4

    return value
  }
}

export { SshReader }
