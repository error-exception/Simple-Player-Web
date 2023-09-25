import { clamp, int } from "./Utils";
import BackgroundDao from "./dao/BackgroundDao";
import { Interpolation } from "./webgl/Interpolation";

const MAX_CACHE_SIZE = 6
class BackgroundLoader {

    /**
     * 背景图片的 ImageBitmap 队列，存储已下载的图片
     */
    private imageQueue: ImageBitmap[] = [];
    /**
     * 记录背景资源是否可用，当下载失败，则标记为 false，在下次下载时跳过
     */
    private imageRecord: Record<string, boolean> = {};
    /**
     * ImageBitmap 回收队列，当队列超过 MAX_CACHE_SIZE 时，回收队首的 ImageBitmap
     */
    private recycleQueue: ImageBitmap[] = []

    private backgroundNames: string[] = [];

    public isInit = false;

    /**
     * 随机索引序列，实现随机图片展示，且不重复
     */
    private backgroundSequence: number[] = []

    public async init() {
        const backgroundList = await BackgroundDao.getBackgroundList();
        if (!backgroundList) {
            throw new Error("No background");
        }
        for (let i = 0; i < backgroundList.length; i++) {
            this.imageRecord[backgroundList[i]] = true
        }
        this.backgroundNames = backgroundList;
        const downloadCount = Math.min(backgroundList.length, MAX_CACHE_SIZE);
        const randomSequence = this.randomSequence(backgroundList.length)
        this.backgroundSequence = randomSequence
        for (let i = 0; i < downloadCount; i++) {
            const idx = randomSequence.shift()!
            const name = backgroundList[idx];
            const blob = await BackgroundDao.downloadBackground(name)
            if (!blob) {
                this.imageRecord[name] = false
                continue
            }
            this.imageQueue.push(await createImageBitmap(blob))
        }
        this.isInit = true;
    }

    public getBackground(): ImageBitmap {
        let randomSequence = this.backgroundSequence
        if (randomSequence.length) {
            randomSequence = this.randomSequence(this.backgroundNames.length)
            this.backgroundSequence = randomSequence
        }
        const image = this.imageQueue.shift()!
        let index = randomSequence.shift()!
        let name = this.backgroundNames[index]
        while (!this.imageRecord[name]) {
            index = randomSequence.shift()!
            name = this.backgroundNames[index] 
        }
        BackgroundDao.downloadBackground(name)
            .then((blob) => {
                if (blob) {
                    return createImageBitmap(blob);
                } else {
                    this.imageRecord[name] = false;
                }
            })
            .then((image) => {
                if (image) {
                    this.imageQueue.push(image);
                }
            });
        this.recycleQueue.push(image)
        this.recycleImageIfNeed()
        return image



        // const randomIndex = Math.max(
        //     int(Math.random() * this.backgroundNames.length) - 1,
        //     0
        // );
        // const cache = this.cache;
        // const name = this.backgroundNames[randomIndex];
        // const bitmap = cache.get(name);
        // if (bitmap) {
        //     return bitmap;
        // }

        // const availableMap = this.availableMap;
        // let needDownload = true;
        // const list = this.backgroundNames;
        // for (
        //     let i = 0, j = (randomIndex + 1) % list.length;
        //     i < list.length;
        //     i++, j = (j + 1) % list.length
        // ) {
        //     const bgName = list[j];
        //     const available = availableMap[bgName];
        //     if (isUndef(available) && needDownload) {
        //         // 从未下载过
        //         this.downloadImage(bgName);
        //         needDownload = false;
        //     } else if (available && cache.has(bgName)) {
        //         // 从缓存中寻找可用
        //         return cache.get(bgName)!!;
        //     } else if (available && !cache.has(bgName) && needDownload) {
        //         // 下载过，但被回收了，重新下载
        //         this.downloadImage(bgName);
        //         needDownload = false;
        //     }
        // }
        // throw new Error("no background available");
    }

    // private async downloadImage(name: string) {
    //     const response = await fetch(url("/background?name=" + name));
    //     if (int(response.status / 100) != 2) {
    //         this.availableMap[name] = false;
    //         return;
    //     }
    //     const blob = await response.blob();
    //     const imageBitmap = await createImageBitmap(blob);
    //     this.cache.put(name, imageBitmap);
    //     this.availableMap[name] = true;
    // }

    private recycleImageIfNeed() {
        if (this.recycleQueue.length >= MAX_CACHE_SIZE) {
            const image = this.recycleQueue.shift();
            image?.close();
        }
    }

    private randomSequence(count: number) {
        const result = [];
        const mark = new Array(count).fill(true);
        for (let k = 0; k < mark.length; k++) {
            const rand = clamp(
                int(Interpolation.valueAt(Math.random(), 0, 9)),
                0, count - 1
            ); 
            if (mark[rand]) {
                result.push(rand);
                mark[rand] = false;
            } else {
                for (
                    let i = rand, j = 0;
                    j < mark.length;
                    i = (i + 1) % count, j++
                ) {
                    if (mark[i]) {
                        result.push(i);
                        mark[i] = false;
                        break;
                    }
                }
            }
        }
        return result;
    }
}


export default new BackgroundLoader()