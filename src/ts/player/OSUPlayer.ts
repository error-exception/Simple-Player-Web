import { OSUStdNote } from "../osu/OSUFile";
import {Bullet} from "../type";
import {createMutableSharedFlow, createMutableStateFlow} from "../util/flow";
import { isUndef } from "../webgl/core/Utils";
import { NoteData } from "../webgl/screen/mania/ManiaPanel";
import AudioPlayerV2 from "./AudioPlayer";
import VideoPlayer from "./VideoPlayer";

export interface OSUBackground {
    image?: ImageBitmap
    video?: HTMLVideoElement
    imageBlob?: Blob
}

class OSUPlayer {

    public title = createMutableStateFlow("None")
    public artist = createMutableStateFlow("None")
    public background = createMutableStateFlow<OSUBackground>({})
    public currentTime = createMutableStateFlow(0)
    public duration = createMutableStateFlow(0)
    public onChanged = createMutableSharedFlow<Bullet>()
    public maniaNoteData = createMutableStateFlow<NoteData[][] | null>(null)
    public osuStdNotes = createMutableStateFlow<OSUStdNote[] | null>(null)
    // public onTimingChanged = createMutableSharedFlow<Bullet>()

    private isVideoAvailable = false

    constructor() {
        // BackgroundLoader.init()
    }

    public async setSource(src: Bullet) {
        console.log(src)
        this.isVideoAvailable = false
        // this.onTimingChanged.emit(src)
        this.title.value = src.metadata.title
        this.artist.value = src.metadata.artist
        await AudioPlayerV2.setSource(src.metadata.source)
        this.duration.value = AudioPlayerV2.duration()
        const background: OSUBackground = {}
        if (src.events.backgroundVideo) {
            try {
                await VideoPlayer.setSource(src.events.backgroundVideo)
                this.isVideoAvailable = true
                background.video = VideoPlayer.getVideoElement()
            } catch (_) {
                console.log(_)
                this.isVideoAvailable = false
                background.video = undefined
            }
        }
        if (src.events.backgroundImage) {
            background.imageBlob = src.events.backgroundImage
            background.image = await createImageBitmap(src.events.backgroundImage)
            // console.log(background)
        } else {
            // if (BackgroundLoader.isInit) {
            //     await BackgroundLoader.init()
            // }
            // background.image = BackgroundLoader.getBackground()
        }
        this.maniaNoteData.value = isUndef(src.noteData) ? null : src.noteData
        this.osuStdNotes.value = isUndef(src.stdNotes) ? null : src.stdNotes

        this.background.value = background
        this.onChanged.emit(src)
    }

    public async play() {
        if (this.isVideoAvailable) {
            await VideoPlayer.play()
        }
        await AudioPlayerV2.play()
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

}

export default new OSUPlayer()