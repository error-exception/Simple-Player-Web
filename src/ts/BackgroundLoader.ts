import {ResourceCache} from "./ResourceCache";
import {int, url} from "./Utils";
import {ResponseResult} from "./type";
import {isUndef} from "./webgl/core/Utils";

export class BackgroundLoader {

    private static cache = new ResourceCache<string, ImageBitmap>(5)
    private static availableMap: Record<string, boolean> = {}
    private static backgroundNames: string[] = []
    private static prevName: string = ""

    public static async init() {
        BackgroundLoader.cache.onRecycle = (key, value) => {
            value.close()
            console.log("recycle image bitmap", key)
        }
        const response = await fetch(url("/backgroundList"))
        const data: ResponseResult<string[]> = await response.json()
        if (!data.data) {
            throw new Error("fetch background list failed")
        }
        console.log(data.data)
        BackgroundLoader.backgroundNames = data.data
        const list = BackgroundLoader.backgroundNames
        const startIndex = int(Math.random() * list.length)
        for (let i = startIndex, j = 0; j < 3; i = (i + 1) & list.length, j++) {
            const name = list[i]
            await BackgroundLoader.downloadImage(name)
        }
    }

    public static getBackground(): ImageBitmap {
        const randomIndex = Math.max(
            int(Math.random() * BackgroundLoader.backgroundNames.length) - 1,
            0
        )
        const cache = BackgroundLoader.cache
        const availableMap = BackgroundLoader.availableMap
        let needDownload = true
        const name = BackgroundLoader.backgroundNames[randomIndex]
        const list = BackgroundLoader.backgroundNames
        const bitmap = cache.get(name)
        if (bitmap) {
            return bitmap
        }
        for (let i = 0, j = (randomIndex + 1) % list.length; i < list.length; i++, j = (j + 1) % list.length) {
            const bgName = list[j]
            const available = availableMap[bgName]
            if (isUndef(available) && needDownload) { // 从未下载过
                BackgroundLoader.downloadImage(bgName)
                needDownload = false
            } else if (available && cache.has(bgName)) { // 从缓存中寻找可用
                return cache.get(bgName)!!
            } else if (available && !cache.has(bgName) && needDownload) { // 下载过，但被回收了，重新下载
                BackgroundLoader.downloadImage(bgName)
                needDownload = false
            }
        }
        throw new Error("no background available")
    }

    private static async downloadImage(name: string) {
        const response = await fetch(url("/background?name=" + name))
        if (int(response.status / 100) != 2) {
            BackgroundLoader.availableMap[name] = false
            return
        }
        const blob = await response.blob()
        const imageBitmap = await createImageBitmap(blob)
        BackgroundLoader.cache.put(name, imageBitmap)
        BackgroundLoader.availableMap[name] = true
    }

}