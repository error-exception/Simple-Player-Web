import { clamp, int } from "../Utils";
import BackgroundDao from "../dao/BackgroundDao";
import { Interpolation } from "../webgl/util/Interpolation";

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

    }


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