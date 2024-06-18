/**
 * 出处
 * https://zhangzhipeng.net/2020/04/19/js%e8%a7%a3%e6%9e%90ttf%e5%ad%97%e4%bd%93%e6%96%87%e4%bb%b6/
 */
export class BinaryReader {

  private index = 0
  private readonly data: Uint8Array

  constructor(buffer: ArrayBuffer) {
    this.data = new Uint8Array(buffer)
  }

  public tell() {
    return this.index
  }

  public seek(pos: number) {
    const oldPos = this.index
    this.index = pos
    return oldPos
  }

  public getUint8() {
    return this.data[this.index++]
  }

  public getUint16() {
    return ((this.getUint8() << 8) | this.getUint8()) >>> 0
  }

  public getUint32() {
    return this.getInt32() >>> 0
  }

  public getInt16() {
    let result = this.getUint16()
    if (result & 0x8000) {
      result -= (1 << 16)
    }
    return result
  }

  public getInt32() {
    return ((this.getUint8() << 24) |
      (this.getUint8() << 16) |
      (this.getUint8() <<  8) |
      (this.getUint8()      ));
  }

  public getFword() {
    return this.getInt16()
  }

  public get2Dot14() {
    return this.getInt16() / (1 << 14)
  }

  public getFixed() {
    return this.getInt32() / (1 << 16)
  }

  public getString(length: number) {
    let result = ''
    for (let i = 0; i < length; i++) {
      result += String.fromCharCode(this.getUint8())
    }
    return result
  }

  public getDate() {
    const macTime = this.getUint32() * 0x100000000 + this.getUint32();
    const utcTime = macTime * 1000 + Date.UTC(1904, 0, 1);
    return new Date(utcTime);
  }

}