import {createApp, ref} from 'vue'
import './assets/fonts/fonts.css'
import './style.css'
import App from './App.vue'
import {createStore} from "vuex";
import {Music, MusicInfo, Settings} from "./ts/type";



export type StoreType = MusicInfo & {
    musicList: Music[],
    visualizerVolume: number,
    frameTime: number
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
            frameTime: 0,
            visualizerVolume: 0,
            musicList: [{
                title: 'no song',
                artist: 'no title',
                id: -1,
                bpm: 60,
                offset: 0
            }]
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

        setVisualizerVolume(state, v: number) {
            state.visualizerVolume = v;
        },

        setCurrentMusicBpm(state, v: number) {
            state.currentMusic.bpm = v;
        },

        setCurrentMusicOffset(state, v: number) {
            state.currentMusic.offset = v;
        },

        setFrameTime(state, v: number) {
            state.frameTime = v
        }
    }

})

createApp(App).use(store).mount('#app')
