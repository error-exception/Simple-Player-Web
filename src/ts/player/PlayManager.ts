import AudioPlayerV2 from "./AudioPlayer";
import { int } from "../Utils";
import {Bullet, Music, newBullet, TimingInfo} from "../type"
import { createMutableSharedFlow, createMutableStateFlow } from "../util/flow"
import { Interpolation } from "../webgl/util/Interpolation";
import { PlayMode } from "./PlayMode"
import MusicDao from "../dao/MusicDao";
import TimingManager from "../global/TimingManager";
import OSUPlayer from "./OSUPlayer";
import {PLAYER} from "../build";
import {collect} from "../util/eventRef";

class PlayManager {
    private _musicList = createMutableStateFlow<Bullet[]>([
        newBullet()
    ]);

    public currentIndex = createMutableStateFlow(0);
    public onSongChanged = createMutableSharedFlow<boolean>();
    public currentPlayMode = createMutableStateFlow(PlayMode.None);

    constructor() {
        collect(AudioPlayerV2.onEnd, () => {
            PLAYER && this.next()
        })
        // AudioPlayerV2.onEnd.collect(() => {
        //     if (PLAYER) {
        //         this.next()
        //     }
        // })
        // this.loadMusicList()
        TimingManager.onTimingUpdate.collect((timing) => {
            const id = timing.id
            const music = this.findMusic(id)
            if (!music) return
            music.timingPoints = TimingManager.toBulletTimingPoints(timing)
        })
    }

    public async loadMusicList() {
        const list = await MusicDao.getMusicList()
        const musicList: Bullet[] = []
        for (let i = 0; i < list.length; i++) {
            const music = list[i]
            const timingInfo = await TimingManager.getTiming(music.id)
            if (timingInfo === null) {
                musicList.push(this.toBullet(music, TimingManager.defaultTiming))
            } else {
                musicList.push(this.toBullet(music, timingInfo))
            }
        }
        console.log(musicList);
        
        // debugger
        this._musicList.value = musicList
    }

    // public setMusicList(musicList: Music[]): void {
    //     if (musicList.length) {
    //         this._musicList.value = musicList;
    //         this.playAt(0)
    //     } else {
    //         console.warn("PlayManager", "setMusicList", "list is empty");
    //     }
    // }

    public getMusicList() {
        // console.log(this._musicList.value)
        return this._musicList
    }

    public findMusic(id: number) {
        return this._musicList.value.find(v => v.metadata.id === id)
    }

    /**
     * @deprecated
     * @param index
     */
    public async playAt(index: number) {
        throw new Error()
        const music = this._musicList.value[index];
        // console.log(this._musicList)
        music.metadata.source = await MusicDao.downloadMusic(music.metadata.id)
        //@ts-ignore
        await OSUPlayer.setSource(music)
        await OSUPlayer.play()
        this.currentIndex.value = index
    }

    public next() {
        const playMode = this.currentPlayMode.value;
        const audioCount = this._musicList.value.length;
        let currentIndex = this.currentIndex.value;
        if (playMode === PlayMode.None) {
            currentIndex = (currentIndex + 1) % audioCount;
        } else if (playMode === PlayMode.Random) {
            currentIndex = int(
                Interpolation.valueAt(Math.random(), 0, audioCount - 1)
            );
        }
        this.playAt(currentIndex);
    }

    public previous() {
        const playMode = this.currentPlayMode.value;
        const audioCount = this._musicList.value.length;
        let currentIndex = this.currentIndex.value;
        if (playMode === PlayMode.None) {
            if (currentIndex === 0) {
                currentIndex = audioCount - 1;
            } else {
                currentIndex--;
            }
        } else if (playMode === PlayMode.Random) {
            currentIndex = int(
                Interpolation.valueAt(Math.random(), 0, audioCount - 1)
            );
        }
        this.playAt(currentIndex);
    }

    public get currentMusic() {
        return this._musicList.value[this.currentIndex.value];
    }

    public setPlayMode(mode: PlayMode): void {
        this.currentPlayMode.value = mode;
    }

    private toBullet(music: Music, info: TimingInfo) {
        const bullet = newBullet()
        bullet.metadata.id = music.id
        bullet.metadata.title = music.title
        bullet.metadata.artist = music.artist
        bullet.available = info.id >= 0
        bullet.timingPoints = TimingManager.toBulletTimingPoints(info)
        // bullet.timingPoints.beatGap = 60 / info.bpm * 1000
        // bullet.timingPoints.offset = info.offset
        // bullet.timingPoints.timingList = info.timingList.map<BulletTimingPointsItem>(v => {
        //     return { time: v.timestamp, isKiai: v.isKiai }
        // })
        return bullet
    }
}

/**
 * cannot use this class
 * @deprecated
 */
export default new PlayManager()