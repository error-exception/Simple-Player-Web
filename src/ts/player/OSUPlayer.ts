import {OSUFile} from "../osu/OSUFile";
import {createMutableStateFlow} from "../util/flow";
import {NoteData} from "../webgl/screen/mania/ManiaPanel";
import AudioPlayerV2 from "./AudioPlayer";
import VideoPlayer from "./VideoPlayer";
import {ref, shallowRef} from "vue";
import {OSZFile} from "../osu/OSZ";
import {eventRef} from "../util/eventRef";

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
  public onChanged = eventRef<[OSUFile, OSZFile]>()
  public maniaNoteData = createMutableStateFlow<NoteData[][] | null>(null)

  public static readonly EMPTY_OSU: OSUFile = {}
  // @ts-ignore
  public static readonly EMPTY_OSZ: OSZFile = {}

  public currentOSUFile = shallowRef<OSUFile>(OSUPlayer.EMPTY_OSU)
  public currentOSZFile = shallowRef<OSZFile>(OSUPlayer.EMPTY_OSZ)

  private isVideoAvailable = false

  constructor() {

  }

  public async setSource(osu: OSUFile, src: OSZFile) {
    this.isVideoAvailable = false
    const { Events, Metadata } = osu
    const { audio, image, video } = src.source
    if (!audio) {
      console.warn("audio is null")
      return
    }
    await AudioPlayerV2.setSource(audio)
    this.title.value = Metadata?.TitleUnicode ?? "None"
    this.artist.value = Metadata?.ArtistUnicode ?? "None"
    this.duration.value = AudioPlayerV2.duration()
    const background: OSUBackground = {}
    this.isVideoAvailable = false
    if (video) {
      try {
        VideoPlayer.baseOffset = Events?.videoOffset ?? 0
        await VideoPlayer.setSource(video)
        this.isVideoAvailable = true
        background.video = VideoPlayer.getVideoElement()
      } catch (_) {
        console.log(_)
        this.isVideoAvailable = false
        background.video = undefined
      }
    }
    if (image) {
      background.imageBlob = image
      background.image = await createImageBitmap(image)
    }
    // this.maniaNoteData.value = isUndef(src.noteData) ? null : src.noteData
    this.background.value = background
    this.onChanged.emit([osu, src])
    this.currentOSUFile.value = osu
    this.currentOSZFile.value = src
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