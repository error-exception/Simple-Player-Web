import JSZip from "jszip";
import type {Nullable} from "../type";

interface ReadAsType {
  base64: string;
  string: string;
  text: string;
  binarystring: string;
  array: number[];
  uint8array: Uint8Array;
  arraybuffer: ArrayBuffer;
  blob: Blob;
  nodebuffer: Buffer;
}

export class OSZProvider {

  public async load(oszFile: File) {
  }

  async getFile<T extends keyof ReadAsType>(path: string, type: T): Promise<ReadAsType[T] | undefined> {
    return undefined
  }

  async getFileList(): Promise<string[]> {
    return []
  }
}

/**
 * 通过 osz 文件加载
 */
export class OSZZipProvider extends OSZProvider {

  private zip: Nullable<JSZip> = null

  async load(oszFile: File): Promise<void> {
    const textDecoder = new TextDecoder()
    this.zip = await JSZip.loadAsync(oszFile, {
      decodeFileName(a) {
        if (Array.isArray(a)) {
          return a.join("").toLowerCase()
        } else {
          return textDecoder.decode(a).toLowerCase()
        }
      }
    })
  }

  private list: string[] = []
  async getFileList(): Promise<string[]> {
    if (this.zip) {
      this.list = Object.getOwnPropertyNames(this.zip.files)
      return this.list
    }
    return []
  }

  async getFile<T extends keyof ReadAsType>(path: string, type: T): Promise<ReadAsType[T] | undefined> {
    return this.zip?.file(path)?.async(type)
  }
}