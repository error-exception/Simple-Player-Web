import {createApp, ref} from 'vue'
import './assets/fonts/fonts.css'
import './style.css'
import App from './App.vue'
import {createStore} from "vuex";
import {Music, MusicInfo, Settings, VisualizerConfig} from "./ts/type";



export type StoreType = MusicInfo & {
    musicList: Music[],
    visualizer: boolean,
    settings: Settings
    visualizerVolume: number,
    visConfig: VisualizerConfig,
    beat: number
}

const store = createStore({

    state(): StoreType {
        return {
            currentMusic: {
                title: 'no song',
                artist: 'no title',
                id: -1,
                bpm: 60,
                offset: 0
            },
            currentIndex: 0,
            visualizerVolume: 0,
            musicList: [{
                title: 'no song',
                artist: 'no title',
                id: -1,
                bpm: 60,
                offset: 0
            }],
            visualizer: true,
            beat: 0,
            settings: {
                backgroundMovable: true,
                showWhiteBar: false
            },
            visConfig: {
                maxHeight: 20, // 百分比
                paddingBottom: 128,
                mirror: false, // unused
                smooth: 0.4,
                maxDB: 0,
                minDB: -55,
                color: [255, 255, 255],
                startOffset: 0,
                endOffset: -1, // data offset unused
                barCount: 200,
                alpha: 1,
                alphaByVolume: false
            }
        }
    },

    mutations: {

        setIndex(state, i: number) {
            state.currentIndex = i
            state.currentMusic = state.musicList[i]
        },

        setMusic(state, music: Music) {
            state.currentMusic = music
        },

        setMusicList(state, musicList: Music[]) {
            state.musicList = musicList
        },

        setVisualizer(state, v: boolean) {
            state.visualizer = v
        },

        setBackgroundMovable(state, v: boolean) {
            state.settings.backgroundMovable = v;
        },

        setVisualizerVolume(state, v: number) {
            state.visualizerVolume = v;
        },

        setVisualizerMaxHeight(state, v: number) {
            state.visConfig.maxHeight = v;
        },

        setVisualizerPaddingBottom(state, v: number) {
            state.visConfig.paddingBottom = v;
        },

        setVisualizerMirror(state, v: boolean) {
            state.visConfig.mirror = v;
        },

        setVisualizerSmooth(state, v: number) {
            state.visConfig.smooth = v;
        },

        setVisualizerMaxDB(state, v: number) {
            state.visConfig.maxDB = v;
        },

        setVisualizerMinDB(state, v: number) {
            state.visConfig.minDB = v;
        },

        setVisualizerColor(state, v: [number, number, number]) {
            state.visConfig.color = v;
        },

        setVisualizerStartOffset(state, v: number) {
            state.visConfig.startOffset = v;
        },

        setVisualizerEndOffset(state, v: number) {
            state.visConfig.endOffset = v;
        },

        setVisualizerBarCount(state, v: number) {
            state.visConfig.barCount = v;
        },

        setVisualizerAlpha(state, v: number) {
            state.visConfig.alpha = v;
        },

        setVisualizerAlphaByVolume(state, v: boolean) {
            state.visConfig.alphaByVolume = v;
        },

        setShowWhiteBar(state, v: boolean) {
            state.settings.showWhiteBar = v;
        },

        setBeat(state, v: number) {
            state.beat = v;
        },

        setCurrentMusicBpm(state, v: number) {
            state.currentMusic.bpm = v;
        },

        setCurrentMusicOffset(state, v: number) {
            state.currentMusic.offset = v;
        }
    }

})

createApp(App).use(store).mount('#app')
