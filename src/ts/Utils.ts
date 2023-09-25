import {onMounted, onUnmounted, ref, Ref} from "vue";
import {ArrayUtils} from "./util/ArrayUtils";

export async function fetchJson(url: string) {
    const response = await fetch(url);
    return await response.json()
}

export function useMouse(): [Ref<number>, Ref<number>] {
    const x = ref(0)
    const y = ref(0)
    const callback = (e: MouseEvent) => {
        x.value = e.x
        y.value = e.y
    }
    onMounted(() => {
        window.addEventListener("mousemove", callback)
    })
    onUnmounted(() => {
        window.removeEventListener("mousemove", callback)
    })

    return [x, y]
}

export function degreeToRadian(degree: number) {
    return degree * ( Math.PI / 180)
}

export function timeString(timeUnitS: number) {
    if (isNaN(timeUnitS)) {
        return '00:00'
    }
    const time = Math.floor(timeUnitS)
    const minute = Math.floor(time / 60)
    const seconds = time % 60
    return `${ minute < 10 ? '0' + minute : minute }:${ seconds < 10 ? '0' + seconds : seconds }`
}

export function currentMilliseconds() {
    return Date.now()
}

// export function findMusic(store: any, id: number): Music | undefined {
//     // const musicList = store.state.musicList;
//     // for (let i = 0; i < musicList.length; i++) {
//     //     if (musicList[i].id === id)
//     //         return musicList[i]
//     // }
//     // return undefined
//     return PlayManager.getMusicList().value.find(music => music.id === id)
// }

export function useKeyboard(type: 'up' | 'down', c: (e: KeyboardEvent) => void) {

    const handler = (e: KeyboardEvent) => {
        if (e.isTrusted) {
            c(e)
        }
    }

    onMounted(() => {
        if (type === "up")
            window.addEventListener("keyup", handler)
        else
            window.addEventListener("keydown", handler)
    })

    onUnmounted(() => {
        if (type === "up")
            window.removeEventListener("keyup", handler)
        else
            window.removeEventListener("keydown", handler)
    })

}

export function int(n: number) {
    return Math.floor(n)
}

export function calcRMS(sampleRate: number, left: Float32Array, right: Float32Array, currentTime: number, wind: number = 2048) {
    const unit = sampleRate / 1000
    const index = int(currentTime * unit)
    let sum = 0
    if (!ArrayUtils.inBound(left, index)) {
        return 0
    }
    if (left.length - index < wind) {
        for (let i = left.length - 1; i > left.length - 1 - wind; i--) {
            // const max = Math.max(left[i], right[i])
            sum += (left[i] ** 2 + right[i] ** 2)// / 2
        }
    } else {
        for (let i = index; i < index + wind; i++) {
            // const max = Math.max(left[i], right[i])
            sum += (left[i] ** 2 + right[i] ** 2)// / 2
        }
    }
    return Math.sqrt(sum / wind)
}

export function url(urlString: string) {
    if (__DEV__) {
        return '/api' + urlString
    }
    return urlString
}

export function clamp(value: number, min: number, max: number) {
    if (value < min) return min
    if (value > max) return max
    return value
}

export function scope<T>(target: T, scope: (this: T) => void) {
    scope.call(target)
}

export function isString(v: any): v is string {
    return typeof v === 'string'
}

export function init<T>(target: T, scope: (this: T) => void): T {
    scope.call(target)
    return target
}

export function getClassName<T>(a: T): string {
    if ('constructor' in a) {
        return a.constructor.name
    }
    return 'unknown'
}