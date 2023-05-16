import {Queue} from "./util/Queue";
import {isUndef} from "./webgl/core/Utils";

export class ResourceCache<K, V> {

    private map = new Map<K, V>()
    private queue = new Queue<K>()

    public onRecycle: ((key: K, value: V) => void) | null = null

    constructor(public readonly max: number) {}

    public put(key: K, value: V) {
        if (this.queue.size() >= this.max) {
            const key = this.queue.end();
            const value = this.map.get(key)
            this.map.delete(key)
            this.queue.pop()
            if (value) {
                this.onRecycle?.(key, value)
            }
        }
        const v = this.map.get(key)
        this.map.set(key, value)
        if (isUndef(v)) {
            this.queue.push(key)
        }
    }

    public get(key: K): V | undefined {
        return this.map.get(key)
    }

    public has(key: K): boolean {
        return this.get(key) !== undefined
    }

    public get count() {
        return this.queue.size()
    }

}