import {IEvent} from "./type";
import {onMounted, onUnmounted} from "vue";
import {Beater} from "./Beater";

const eventList: IEvent[] = []

export function useEvent(ev?: IEvent) {

    onMounted(() => {
        if (ev) {
            eventList.push(ev)
        }
    })

    onUnmounted(() => {
        if (ev) {
            const i = eventList.indexOf(ev)
            eventList.splice(i, 1)
        }
    })

}

export class EventDispatcher {

    public static fireOnBpmChanged(id: number) {
        for (let i = 0; i < eventList.length; i++) {
            eventList[i].onBpmChanged?.(id)
        }
    }

    public static fireOnSongChanged(id: number) {
        for (let i = 0; i < eventList.length; i++) {
            eventList[i].onSongChanged?.(id)
        }
    }

    public static fireOnMusicSeeked(id: number, seekedTime: number) {
        for (let i = 0; i < eventList.length; i++) {
            eventList[i].onMusicSeeked?.(id, seekedTime)
        }
    }

    public static fireOnMusicPlay() {
        for (let i = 0; i < eventList.length; i++) {
            eventList[i].onMusicPlay?.()
        }
    }

    public static fireOnMusicPause() {
        for (let i = 0; i < eventList.length; i++) {
            eventList[i].onMusicPause?.()
        }
    }

}