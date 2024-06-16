import {OSUFile} from "../osu/OSUFile";
import AudioPlayerV2 from "./AudioPlayer";
import VideoPlayer from "./VideoPlayer";
import {ref, shallowRef} from "vue";
import {OSZ} from "../osu/OSZ";
import {eventRef} from "../util/eventRef";
import {Interpolation} from "../webgl/util/Interpolation";
import type {Nullable} from "../type";

export interface OSUBackground {
  image?: ImageBitmap
  video?: HTMLVideoElement
  imageBlob?: Blob
}

class OSUPlayer {

  public title = ref("None")
  public artist = ref("None")
  public background = shallowRef<OSUBackground>({})
  public currentTime = ref(0)
  public duration = ref(0)
  public onChanged = eventRef<[OSUFile, OSZ]>()

  public static readonly EMPTY_OSU: OSUFile = { name: '' }
  public static readonly EMPTY_OSZ: OSZ = new OSZ()

  public currentOSUFile = shallowRef<OSUFile>(OSUPlayer.EMPTY_OSU)
  public currentOSZFile = shallowRef<OSZ>(OSUPlayer.EMPTY_OSZ)

  private isVideoAvailable = false

  public async setSource(osz: OSZ, osuFile: Nullable<OSUFile> = null) {
    const oldOSZ = this.currentOSZFile.value
    if (oldOSZ !== osz) {
      oldOSZ.dispose()
    }
    this.isVideoAvailable = false
    const index = ~~Interpolation.valueAt(
      Math.random(), 0, osz.osuFileList.length - 1
    )
    const osu = osz.osuFileList[index]
    this.title.value = osu.Metadata?.TitleUnicode ?? osu.Metadata?.Title ?? 'None'
    this.artist.value = osu.Metadata?.ArtistUnicode ?? osu.Metadata?.Artist ?? 'None'

    const audio = osu.General?.AudioFilename
    if (!audio) {
      console.warn("audio is null")
      return null
    }
    await this.setAudioSource(osz, audio)
    const background: OSUBackground = {}
    const videoPath = osu.Events?.videoBackground
    const video = videoPath ? osz.getVideo(videoPath) : undefined
    if (video) {
      await this.setVideoSource(osu, video, background)
    }
    const imagePath = osu.Events?.imageBackground
    const image = imagePath ? osz.getImageBitmap(imagePath) : undefined
    if (image) {
      background.image = image
      background.imageBlob = osz.getImageBlob(imagePath!)
    }
    this.background.value = background
    this.onChanged.emit([osu, osz])
    this.currentOSUFile.value = osu
    this.currentOSZFile.value = osz
    return osu
  }

  private async setVideoSource(osu: OSUFile, video: string, background: OSUBackground) {
    try {
      VideoPlayer.baseOffset = osu.Events?.videoOffset ?? 0
      await VideoPlayer.setSource(video)
      this.isVideoAvailable = true
      background.video = VideoPlayer.getVideoElement()
    } catch (_) {
      console.log(_)
      this.isVideoAvailable = false
      background.video = undefined
    }
  }

  private async setAudioSource(osz: OSZ, audio: string) {
    const audioArrayBuffer = osz.getAudio(audio)!
    await AudioPlayerV2.setSource(audioArrayBuffer)
    this.duration.value = AudioPlayerV2.duration()
  }

  public async play() {
    await Promise.all([this.playVideo(), this.playAudio()])
  }

  private async playAudio() {
    await AudioPlayerV2.play()
  }

  private async playVideo() {
    if (this.isVideoAvailable) {
      await VideoPlayer.play()
    }
  }

  public pause() {
    if (this.isVideoAvailable) {
      VideoPlayer.pause()
    }
    AudioPlayerV2.pause()
  }

  public async seek(v: number) {
    if (this.isVideoAvailable) {
      await VideoPlayer.seek(v)
    }
    await AudioPlayerV2.seek(v)
  }

  public speed(s: number) {
    AudioPlayerV2.speed(s)
    if (this.isVideoAvailable) {
      VideoPlayer.speed(s)
    }
  }

  // driven by requestAnimationFrame()
  public update() {
    this.currentTime.value = AudioPlayerV2.currentTime()
  }

  public isPlaying() {
    return AudioPlayerV2.isPlaying()
  }

  public stop() {
    AudioPlayerV2.stop()
    VideoPlayer.stop()
  }

}

export default new OSUPlayer()