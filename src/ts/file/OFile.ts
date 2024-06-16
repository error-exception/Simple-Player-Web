import type {Nullable} from "../type";

export class OFile {

  public isDirectory: boolean
  public isFile: boolean
  public name: string
  protected pathNames: string[] = []
  protected parentNames: string[] = []

  constructor(private fileSystemHandle: FileSystemHandle, public parent: Nullable<OFile>) {
    this.name = fileSystemHandle.name
    this.isDirectory = fileSystemHandle.kind === 'directory'
    this.isFile = fileSystemHandle.kind === 'file'
    this.parentNames = [...(parent?.pathNames ?? [])]
    this.pathNames = [...this.parentNames, this.name]
  }

  public equals(file: OFile) {
    return file.fileSystemHandle.isSameEntry(this.fileSystemHandle)
  }

  public async listFiles(filter?: (v: OFile) => boolean): Promise<OFile[]> {
    if (!(this.fileSystemHandle instanceof FileSystemDirectoryHandle)) {
      throw new Error('Not a directory')
    }
    const files: OFile[] = []
    //@ts-ignore
    const entries = await this.fileSystemHandle.entries()
    for await (const entry of entries) {
      const f = new OFile(entry, this.parent)
      if (filter?.(f) ?? true) {
        files.push(f)
      }
    }
    return files
  }

  public getPath(): string {
    return this.pathNames.join('/')
  }

  public getParentPath(): string {
    return this.parentNames.join('/')
  }

  public getParent(): Nullable<OFile> {
    return this.parent
  }

  private nativeFile: Nullable<File> = null
  public async getNativeFile(): Promise<File> {
    if (this.nativeFile !== null) {
      return this.nativeFile
    }
    if (this.fileSystemHandle instanceof FileSystemFileHandle) {
      return this.fileSystemHandle.getFile()
    }
    throw new Error('Not a file')
  }

  public getNativeHandle(): FileSystemHandle {
    return this.fileSystemHandle
  }

  public async length(): Promise<number> {
    return (await this.getNativeFile()).size
  }

  public async lastModified(): Promise<number> {
    return (await this.getNativeFile()).lastModified
  }

}

export class FileProvider {

  public static rootFile: OFile

  public static init(file: FileSystemHandle) {
    this.rootFile = new OFile(file, null)
  }

  public static async getFileByPath(path: string, ignoreCase: boolean = false) {
    if (!path.startsWith('/')) {
      throw new Error('Path must start with /')
    }
    if (ignoreCase) {
      path = path.toLowerCase()
    }
    if (path.endsWith('/')) {
      path = path.substring(0, path.length - 1)
    }
    path = path.substring(1)
    const pathNames = path.split('/')
    let startFile = this.rootFile.getNativeHandle()
    let currentOFile: OFile = this.rootFile
    for (let i = 0; i < pathNames.length; i++) {
      if (startFile instanceof FileSystemDirectoryHandle) {
        startFile = await startFile.getDirectoryHandle(pathNames[i])
        currentOFile = new OFile(startFile, currentOFile)
      } else {
        throw new Error(`Not File with path=${path}`)
      }
    }
    return currentOFile
  }

}

export class FileUtils {

  public static async readTextUTF8(file: OFile): Promise<string> {
    const f = await file.getNativeFile()
    return f.text()
  }

  public static async readBytes(file: OFile): Promise<ArrayBuffer> {
    const f = await file.getNativeFile()
    return f.arrayBuffer()
  }

}