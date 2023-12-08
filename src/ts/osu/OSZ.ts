import JSZip from "jszip";
import {OSUParser} from "./OSUParser";
import {isAnimation, OSBFile, OSUFile} from "./OSUFile";
import {NoteData} from "../webgl/screen/mania/ManiaPanel";
import OSUPlayer from "../player/OSUPlayer";
import {Nullable} from "../type";
import {OSBParser} from "./OSBParser";

export class OSZ {

  public osuFile: OSUFile | null = null
  public osuFileList: OSUFile[] = []
  public maniaNoteData: NoteData[][] | null = null

  public oszSource: OSZSource

  private constructor(private oszFile: File) {
    this.oszSource = {
      image: null,
      video: null,
      audio: null,
      osb: new Map()
    }
  }

  private async decompress() {
    const textDecoder = new TextDecoder()
    const zip = await JSZip.loadAsync(this.oszFile, {
      decodeFileName(a) {
        // if (a instanceof Uint8Array) {
        if (Array.isArray(a)) {
          return a.join("").toLowerCase()
        } else {
          return textDecoder.decode(a).toLowerCase()
        }
        // }
      }
    })
    console.log(zip)
    const filenames = Object.getOwnPropertyNames(zip.files)
    const osuFilenames = filenames.filter(filename => filename.endsWith('.osu'))
    if (osuFilenames) {
      const list: Promise<OSUFile | null>[] = []
      for (let i = 0; i < osuFilenames.length; i++) {
        const name = osuFilenames[i]
        list.push(this.decompressOSUFile(zip, name))
      }
      const osuFileList = await Promise.all(list)
      // @ts-ignore
      this.osuFileList = osuFileList.filter(v => v !== null)
    }

    // will remove below
    const osuFilename = filenames.find(name => name.endsWith('.osu'))
    if (!osuFilename) return
    this.osuFile = await this.decompressOSUFile(zip, osuFilename)

    const osbFilename = filenames.find(filename => filename.endsWith(".osb"))
    if (osbFilename) {
      const osb = await this.decompressOSBFile(zip, osbFilename)
      if (this.osuFile && this.osuFile.Events && osb) {
        this.osuFile.Events.storyboard = osb
      }
      this.osuFileList?.forEach(item => {
        if (item.Events && osb) {
          item.Events.storyboard = osb
        }
      })
    }
  }

  private async decompressOSBFile(zip: JSZip, osbFilename: string) {
    const osbFileContent = await zip.file(osbFilename)?.async("string")
    if (!osbFileContent) return null
    const osbFile = OSBParser.parse(osbFileContent)
    for (let i = 0; i < osbFile.sprites.length; i++) {
      const sprite = osbFile.sprites[i]

      if (isAnimation(sprite)) {
        const path = sprite.filePath, dotIndex = path.lastIndexOf(".")
        const name = path.substring(0, dotIndex)
        const suffix = path.substring(dotIndex)
        for (let i = 0; i < sprite.frameCount; i++) {
          const newName = `${name}${i}${suffix}`
          if (this.oszSource.osb.has(newName)) {
            continue
          }
          try {
            this.oszSource.osb.set(
              newName,
              await createImageBitmap(await zip.file(newName)!.async("blob"))
            )
          } catch (e) {
            console.error("load error", newName, e)
          }
        }
      } else {
        if (this.oszSource.osb.has(sprite.filePath)) {
          continue
        }
        try {
          this.oszSource.osb.set(
            sprite.filePath,
            await createImageBitmap(await zip.file(sprite.filePath)!.async("blob"))
          )
        } catch (e) {
          console.error("load error", sprite.filePath, e)
        }
      }
    }
    console.log(this.oszSource.osb)
    return osbFile
  }

  private async decompressOSUFile(zip: JSZip, osuFilename: string) {
    const osuFileContent = await zip.file(osuFilename)?.async("string")
    if (!osuFileContent) return null
    const osuFile = OSUParser.parse(osuFileContent)
    if (this.hasEmptySource()) {
      if (osuFile.General && osuFile.General.AudioFilename) {
        const audio = await zip.file(osuFile.General.AudioFilename)?.async("arraybuffer")
        if (audio) {
          // this.audio = audio
          this.oszSource.audio = audio
        }
      }
      if (osuFile.Events && osuFile.Events.imageBackground) {
        const background = await zip.file(osuFile.Events.imageBackground)?.async('blob')
        if (background) {
          // this.backgroundImage = background
          this.oszSource.image = background
        }
      }
      if (osuFile.Events && osuFile.Events.videoBackground) {
        const path = osuFile.Events.videoBackground
        const video = await zip.file(path)?.async("blob")
        if (video) {
          // this.backgroundVideo = video
          this.oszSource.video = video
        }
      }
    }
    if (!this.maniaNoteData && osuFile.NoteData) {
      this.maniaNoteData = osuFile.NoteData
    }
    return osuFile
  }

  private hasEmptySource() {
    const { video, audio, image } = this.oszSource
    return video === null || audio !== null || image !== null
  }

  public getOSZFile(): OSZFile {
    let osb = this.osuFileList.length && this.osuFileList[0].Events ? this.osuFileList[0].Events.storyboard : undefined
    return {
      source: this.oszSource,
      osu: this.osuFileList,
      osb: osb ?? null
    }
  }

  public static async newOSZ(file: File): Promise<OSZ> {
    const osz = new OSZ(file)
    await osz.decompress()
    return osz
  }

}

export function loadOSZ(file: File, preview = true) {
  OSZ.newOSZ(file).then(osz => {
    load(osz.getOSZFile(), preview)
  })
}
async function load(osz: OSZFile, preview = true) {
  const osu = osz.osu[0]
  await OSUPlayer.setSource(osu, osz)
  preview && await OSUPlayer.seek(osu.General?.PreviewTime ?? 0)
  if (!preview) OSUPlayer.stop()
  await OSUPlayer.play()
}

export interface OSZFile {
  source: OSZSource
  osu: OSUFile[]
  osb: Nullable<OSBFile>
}

export interface OSZSource {
  audio: Nullable<ArrayBuffer>
  video: Nullable<Blob>
  image: Nullable<Blob>
  osb: Map<string, ImageBitmap>
}

export type OSBSource = Map<string, ImageBitmap>

export function releaseOSZ(osz: OSZFile) {

}
