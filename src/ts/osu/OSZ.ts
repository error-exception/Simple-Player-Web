import JSZip from "jszip";
import {OSUParser} from "./OSUParser";
import {isAnimation, OSBFile, type OSBSprite, OSUFile} from "./OSUFile";
import OSUPlayer from "../player/OSUPlayer";
import {OSBParser} from "./OSBParser";
import type {Disposable} from "../webgl/core/Disposable";
import {OSZConfig} from "../global/GlobalState";


export function loadOSZ(file: File, preview = true) {
  OSZParser.parse(file)
    .then(osz => load(osz, preview))
    .catch(console.log)
}
async function load(osz: OSZ, preview = true) {
  const osu = await OSUPlayer.setSource(osz)
  if (!osu) return
  if (preview) {
    const time = osu.General?.PreviewTime
    await OSUPlayer.seek(time && time >= 0 ? time : 0)
  } else {
    OSUPlayer.stop()
  }
  await OSUPlayer.play()
}

export class OSZ implements Disposable {
  /**
   * .osu 文件
   */
  public osuFileList: OSUFile[] = []
  /**
   * .osb 文件
   */
  public osbFile: OSBFile = { sprites: [] }
  /**
   * 存储图片 ImageBitmap，key 为相对于 osz 的路径
   */
  public imageBitmaps = new Map<string, ImageBitmap>()
  /**
   * 存储图片 Blob，key 为相对于 osz 的路径
   */
  public imageBlobs = new Map<string, Blob>()
  /**
   * 存储视频文件，key 为相对于 osz 的路径, value 为 objectUrl
   */
  public videos = new Map<string, string>()
  /**
   * 存储音乐文件，key 为相对于 osz 的路径
   */
  public audios = new Map<string, ArrayBuffer>()
  /**
   * 存储声音文件，key 为相对于 osz 的路径
   */
  public sounds = new Map<string, ArrayBuffer>()

  public addOSUFile(...osu: OSUFile[]) {
    this.osuFileList.push(...osu)
  }

  public setOSBFile(osb: OSBFile) {
    this.osbFile = osb
  }

  public async addImage(path: string, imageBlob: Blob) {
    if (!this.imageBlobs.has(path)) {
      this.imageBlobs.set(path, imageBlob)
      this.imageBitmaps.set(path, await createImageBitmap(imageBlob))
    }
  }

  public addAudio(path: string, audio: ArrayBuffer) {
    if (!this.audios.has(path)) {
      this.audios.set(path, audio)
    }
  }

  public addSounds(path: string, sound: ArrayBuffer) {
    if (!this.sounds.has(path)) {
      this.sounds.set(path, sound)
    }
  }

  public addVideo(path: string, video: Blob) {
    if (!this.videos.has(path)) {
      const objectUrl = URL.createObjectURL(video)
      this.videos.set(path, objectUrl)
    }
  }

  public getImageBlob(path: string) {
    return this.imageBlobs.get(path)
  }

  public getImageBitmap(path: string) {
    return this.imageBitmaps.get(path)
  }

  public getAudio(path: string) {
    return this.audios.get(path)
  }

  public getSound(path: string) {
    return this.sounds.get(path)
  }

  public getVideo(path: string) {
    return this.videos.get(path)
  }

  public hasVideo() {
    return this.videos.size !== 0
  }

  public hasAudio() {
    return this.audios.size !== 0
  }

  public hasImage(path: string) {
    return this.imageBitmaps.has(path)
  }

  public dispose() {
    this.osuFileList.length = 0
    this.osbFile = { sprites: [] }
    this.imageBitmaps.forEach(image => image.close())
    this.imageBitmaps.clear()
    this.audios.clear()
    this.sounds.clear()
    this.videos.forEach(url => URL.revokeObjectURL(url))
    this.videos.clear()
  }

}

export class OSZParser {

  public static async parse(oszFile: File): Promise<OSZ> {
    const osz = new OSZ()
    const textDecoder = new TextDecoder()
    const zip = await JSZip.loadAsync(oszFile, {
      decodeFileName(a) {
        if (Array.isArray(a)) {
          return a.join("").toLowerCase()
        } else {
          return textDecoder.decode(a).toLowerCase()
        }
      }
    })
    await this.decompressOSU(zip, osz)
    await this.decompressOSB(zip, osz)
    await this.decompressAudio(zip, osz)
    await this.decompressImage(zip, osz)
    if (OSZConfig.loadVideo) {
      await this.decompressVideo(zip, osz)
    }
    return osz
  }

  public static async decompressOSU(zip: JSZip, osz: OSZ) {
    const filenames = Object.getOwnPropertyNames(zip.files)
    const osuFilenames = filenames.filter(name => name.endsWith('.osu'))
    for (const osuFilename of osuFilenames) {
      const osuContent = await zip.file(osuFilename)?.async('string')
      if (!osuContent) continue
      const osuFile = OSUParser.parse(osuContent, osuFilename)
      osz.addOSUFile(osuFile)
    }
  }

  public static async decompressOSB(zip: JSZip, osz: OSZ) {
    const filenames = Object.getOwnPropertyNames(zip.files)
    const osbFilenames = filenames.filter(name => name.endsWith('.osb'))
    for (const osbFilename of osbFilenames) {
      const osbContent = await zip.file(osbFilename)?.async('string')
      if (!osbContent) continue
      osz.osbFile = OSBParser.parse(osbContent)
    }
  }

  private static async addSpriteImage(zip: JSZip, osz: OSZ, sprite: OSBSprite) {
    if (isAnimation(sprite)) {
      const path = sprite.filePath, dotIndex = path.lastIndexOf(".")
      const name = path.substring(0, dotIndex)
      const suffix = path.substring(dotIndex)
      for (let i = 0; i < sprite.frameCount; i++) {
        const newName = `${name}${i}${suffix}`
        if (osz.hasImage(newName)) continue
        try {
          osz.addImage(newName, await zip.file(newName)!.async("blob"))
        } catch (e) {
          console.error("load error", newName, e)
        }
      }
    } else {
      if (osz.hasImage(sprite.filePath)) return
      try {
        osz.addImage(
          sprite.filePath,
          await zip.file(sprite.filePath)!.async("blob")
        )
      } catch (e) {
        console.error("load error", sprite.filePath, e)
      }
    }
  }

  public static async decompressAudio(zip: JSZip, osz: OSZ) {
    if (osz.osuFileList.length <= 0) {
      return
    }
    const osuFileList = osz.osuFileList
    for (const osuFile of osuFileList) {
      if (osuFile.General?.AudioFilename && !osz.hasAudio()) {
        const audio = await zip.file(osuFile.General.AudioFilename)?.async('arraybuffer')
        if (audio) {
          osz.addAudio(osuFile.General.AudioFilename, audio)
        }
      }
    }
  }

  public static async decompressImage(zip: JSZip, osz: OSZ) {
    const osuFileList = osz.osuFileList
    const osbFile = osz.osbFile
    for (const osuFile of osuFileList) {
      const events = osuFile.Events
      if (events?.imageBackground && !osz.hasImage(events.imageBackground)) {
        const image = await zip.file(events.imageBackground)?.async('blob')
        if (image) {
          osz.addImage(events.imageBackground, image)
        }
      }
      if (events?.storyboard) {
        const sprites = events.storyboard.sprites
        for (const sprite of sprites) {
          await this.addSpriteImage(zip, osz, sprite)
        }
      }
    }
    const sprites = osbFile.sprites
    for (const sprite of sprites) {
      await this.addSpriteImage(zip, osz, sprite)
      // if (osz.hasImage(sprite.filePath)) continue
      // const image = await zip.file(sprite.filePath)?.async('blob')
      // if (image) {
      //   osz.addImage(sprite.filePath, await createImageBitmap(image))
      // }
    }
  }

  public static async decompressVideo(zip: JSZip, osz: OSZ) {
    const osuFieList = osz.osuFileList
    for (const osuFile of osuFieList) {
      const videoPath = osuFile.Events?.videoBackground
      if (videoPath && !osz.hasVideo()) {
        const video = await zip.file(videoPath)?.async('blob')
        if (video) {
          osz.addVideo(videoPath, video)
        }
      }
    }
  }

  public static async decompressSound(zip: JSZip, osz: OSZ) {
    // do nothing
  }

}