import {onMounted, onUnmounted, ref, Ref} from "vue";
import {easeIn, easeOut} from "./util/Animation";
import {Music} from "./type";

export async function fetchJson(url: string) {
    const response = await fetch(url);
    return await response.json()
}

const hexTable = [
    '0', '1', '2', '3', '4', '5', '6', '7',
    '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'
]

const hexTable1 = {
    '0': 0, '1': 1, '2': 2, '3': 3,
    '4': 4, '5': 5, '6': 6, '7': 7,
    '8': 8, '9': 9, 'A': 10, 'B': 11,
    'C': 12, 'D': 13, 'E': 14, 'F': 15,
    'a': 10, 'b': 11,
    'c': 12, 'd': 13, 'e': 14, 'f': 15
}

export function byteToHex(v: number): string {
    const low = v & 0xf
    const high = (v >> 4) & 0xf
    return hexTable[high] + hexTable[low]
}

export function hexToByte(hex: string): number {
    //@ts-ignore
    return hexTable1[hex]
}

export function toRGB(hexString: string): [number, number, number] {
    const hex = hexString.substring(1)
    const rgb: [number, number, number] = [0, 0, 0]
    for (let i = 0, j = 0; i < hex.length; i += 2, j++) {
        const high = hexToByte(hex.charAt(i))
        const low = hexToByte(hex.charAt(i + 1))
        rgb[j] = low + high * 16
    }
    return rgb
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

export function beatFunc(bpm: number) {
    const gap = 60 / bpm * 1000
    return (timestamp: number) => {
        timestamp -= Math.floor(timestamp / gap) * gap
        if (timestamp <= 60) {
            return (1 / 60) * timestamp
        }
        if (timestamp <= gap) {
            return (gap - timestamp) / (gap - 60)
        }
        return 0
    }
}

export function virtualBeatFunc(bpm: number) {
    const gap = 60 / bpm * 1000
    return (timestamp: number) => {
        timestamp -= Math.floor(timestamp / gap) * gap
        if (timestamp <= 60) {
            return (1 / 60) * timestamp
        }
        if (timestamp <= gap) {
            return (gap - 120 + timestamp) / (gap - 60)
        }
        return 0
    }
}

export function fade(bpm: number) {
    const gap = 60 / bpm * 1000
    return (timestamp: number) => {
        timestamp -= Math.floor(timestamp / gap) * gap
        return timestamp / gap
    }
}


export function beatFuncV2(bpm: number): [(v: number) => number, Ref<number>] {
    const gap = 60 / bpm * 1000
    const beatCount = ref(0)
    let flag = false

    const beater = (timestamp: number) => {
        timestamp += 60
        const count = Math.floor(timestamp / gap)
        timestamp -= count * gap
        beatCount.value = count
        if (timestamp <= 60) {
            flag = true
            return easeIn(timestamp / 60)
        }
        if (timestamp <= gap) {
            if (flag) {
                // beatCount.value++
                flag = false
            }
            return easeOut(1 - (timestamp - 60) / (gap - 60))
        }
        return 0
    }

    return [beater, beatCount]
}

export function virtualBeatFuncV2(bpm: number) {
    const gap = 60 / bpm * 1000
    return (timestamp: number) => {
        timestamp -= Math.floor(timestamp / gap) * gap
        if (timestamp <= 40) {
            return (1 / 40) * timestamp
        }
        if (timestamp <= gap) {
            return (gap - 40 + timestamp) / (gap - 40)
        }
        return 0
    }
}

export function fadeV2(bpm: number) {
    const gap = 60 / bpm * 1000
    return (timestamp: number) => {
        timestamp -= Math.floor(timestamp / gap) * gap
        return timestamp / gap
    }

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

export function findMusic(store: any, id: number): Music | undefined {
    const musicList = store.state.musicList;
    for (let i = 0; i < musicList.length; i++) {
        if (musicList[i].id === id)
            return musicList[i]
    }
    return undefined
}

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

export function removeAt<T>(array: T[], index: number) {
    if (array.length === 0 || index < 0 || index >= array.length) {
        throw new Error("array is empty or index out of bound")
    }
    for (let i = index; i < array.length - 1; i++) {
        array[i] = array[i + 1]
    }
    array.pop()
}

export function int(n: number) {
    return Math.floor(n)
}

export function calcRMS(sampleRate: number, left: Float32Array, right: Float32Array, currentTime: number) {
    const wid = 1024 * 2
    const unit = sampleRate / 1000
    const index = int(currentTime * unit)
    let sum = 0
    if (left.length - index < wid) {
        for (let i = left.length; i > left.length - wid; i--) {
            const max = Math.max(left[i], right[i])
            sum += max ** 2
        }
    } else {
        for (let i = index; i < index + wid; i++) {
            const max = Math.max(left[i], right[i])
            sum += max ** 2
        }
    }
    return Math.sqrt(sum / wid)
}