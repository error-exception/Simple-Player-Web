import {IEvent} from "./type";
import {onMounted, onUnmounted} from "vue";
import {ArrayUtils} from "./Utils";

const eventList: IEvent[] = []

export function useEvent(ev?: IEvent) {

    onMounted(() => {
        if (ev) {
            EventDispatcher.register(ev)
        }
    })

    onUnmounted(() => {
        if (ev) {
            EventDispatcher.unregister(ev)
        }
    })

}

export class EventDispatcher {

    public static register(e: IEvent) {
        eventList.push(e)
    }

    public static unregister(e: IEvent) {
        const i = eventList.indexOf(e)
        if (ArrayUtils.inBound(eventList, i)) {
            eventList.splice(i, 1)
        }
    }

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