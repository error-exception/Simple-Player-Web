export type Collector<T> = (value: T) => void /* |((value: T) => void) | ((value: T | null) => void) | ((value?: T) => void) */

interface Job<T> {
    id: number
    active: boolean
    value: T | null
    func: Collector<T>
}

function createJob<T>(collector: Collector<T>, value: T | null): Job<T> {
    return {
        id: nextID(),
        active: true,
        func: collector,
        value
    }
}

let id = Number.MIN_SAFE_INTEGER + 10

function nextID(): number {
    const i = id++;
    if (id >= Number.MAX_SAFE_INTEGER - 10) {
        id = Number.MIN_SAFE_INTEGER + 10
    }
    return i
}


export abstract class Flow<T> {
    public abstract removeCollect(collector: Collector<T>): void;

    public abstract collect(collector: Collector<T>): void;

    public abstract clear(): void;

    public abstract emit(value: T): void;
}

abstract class StateFlow<T> extends Flow<T> {

    public abstract set value(value: T)

    public abstract get value(): T

}

const resolve = Promise.resolve()

/**
 * 用于数据更新，调用 collect 后对自动应用当前的 value
 */
export class MutableStateFlow<T> extends StateFlow<T> {
    private _value: T;
    private collectorList: Job<T>[] = [];
    private jobQueue: Job<T>[] = [];
    private flushIndex = 0;
    private isFlushing = false;
    private isFlushPending = false;

    constructor(value: T) {
        super();
        this._value = value;
    }

    public set value(newValue: T) {
        this.emit(newValue);
    }

    public emit(newValue: T): void {
        const oldValue = this._value;
        if (oldValue === newValue) {
            return;
        }
        this._value = newValue;
        const collectorList = this.collectorList;
        for (let i = 0; i < collectorList.length; i++) {
            const collector = collectorList[i];
            collector.value = newValue;
            const jobQueue = this.jobQueue;
            if (
                !jobQueue.includes(
                    collector,
                    this.isFlushing ? this.flushIndex + 1 : this.flushIndex
                )
            ) {
                jobQueue.splice(this.findInsertionIndex(collector.id), 0, collector);
            }
        }
        this.flushQueue();
    }

    public get value() {
        return this._value;
    }

    private findInsertionIndex(id: number) {
        // the start index should be `flushIndex + 1`
        const jobQueue = this.jobQueue;
        let start = this.flushIndex + 1;
        let end = jobQueue.length;

        while (start < end) {
            const middle = (start + end) >>> 1;
            const middleJobId = jobQueue[middle].id;
            middleJobId < id ? (start = middle + 1) : (end = middle);
        }

        return start;
    }

    private flushQueue() {
        if (!this.isFlushing && !this.isFlushPending) {
            this.isFlushPending = true;
            resolve.then(this.flushJob.bind(this));
        }
    }

    private flushJob() {
        this.isFlushPending = false;
        this.isFlushing = true;
        this.jobQueue.sort((a, b) => a.id - b.id);
        try {
            for (
                this.flushIndex = 0;
                this.flushIndex < this.jobQueue.length;
                this.flushIndex++
            ) {
                const job = this.jobQueue[this.flushIndex];
                if (job.active) {
                    try {
                        job.func(job.value!!);
                    } catch (e) {
                        console.error(e);
                    }
                }
            }
        } finally {
            this.flushIndex = 0;
            this.jobQueue.length = 0;
            this.isFlushing = false;
        }
    }

    public collect(collector: (value: T) => void) {
        const job = createJob(collector, this._value);
        this.collectorList.push(job);
        job.func(job.value!!);
    }

    public removeCollect(collector: (value: T) => void) {
        const index = this.collectorList.findIndex((v) => v.func === collector);
        this.collectorList[index].active = false;
        this.collectorList.splice(index, 1);
    }

    public clear() {
        this.collectorList.length = 0;
        this.jobQueue.length = 0;
    }
}

/**
 * 用于事件回调
 */
export class MutableSharedFlow<T> extends Flow<T> {

    private _value: T | null = null;
    private collectorList: Job<T>[] = [];
    private jobQueue: Job<T>[] = [];
    private flushIndex = 0;
    private isFlushing = false;
    private isFlushPending = false;

    constructor() {
        super();
        // this._value = value;
    }

    public emit(newValue: T) {
        this._value = newValue;
        const collectorList = this.collectorList;
        for (let i = 0; i < collectorList.length; i++) {
            const collector = collectorList[i];
            collector.value = newValue;
            const jobQueue = this.jobQueue;
            if (
                !jobQueue.includes(
                    collector,
                    this.isFlushing ? this.flushIndex + 1 : this.flushIndex
                )
            ) {
                jobQueue.splice(this.findInsertionIndex(collector.id), 0, collector);
            }
        }
        this.flushQueue();
    }

    private findInsertionIndex(id: number) {
        // the start index should be `flushIndex + 1`
        const jobQueue = this.jobQueue;
        let start = this.flushIndex + 1;
        let end = jobQueue.length;

        while (start < end) {
            const middle = (start + end) >>> 1;
            const middleJobId = jobQueue[middle].id;
            middleJobId < id ? (start = middle + 1) : (end = middle);
        }

        return start;
    }

    private flushQueue() {
        if (!this.isFlushing && !this.isFlushPending) {
            this.isFlushPending = true;
            resolve.then(this.flushJob.bind(this));
        }
    }

    private flushJob() {
        this.isFlushPending = false;
        this.isFlushing = true;
        this.jobQueue.sort((a, b) => a.id - b.id);
        try {
            for (
                this.flushIndex = 0;
                this.flushIndex < this.jobQueue.length;
                this.flushIndex++
            ) {
                const job = this.jobQueue[this.flushIndex];
                if (job.active) {
                    try {
                        //@ts-ignore
                        job.func(job.value);
                    } catch (e) {
                        console.error(e);
                    }
                }
            }
        } finally {
            this.flushIndex = 0;
            this.jobQueue.length = 0;
            this.isFlushing = false;
        }
    }

    public collect(collector: Collector<T>) {
        const job = createJob(collector, this._value);
        this.collectorList.push(job);
    }

    public removeCollect(collector: Collector<T>) {
        const index = this.collectorList.findIndex((v) => v.func === collector);
        this.collectorList[index].active = false;
        this.collectorList.splice(index, 1);
    }

    public clear() {
        this.collectorList.length = 0;
        this.jobQueue.length = 0;
    }
}

export function createMutableStateFlow<T>(a: T) {
    return new MutableStateFlow(a)
}

export function createMutableSharedFlow<T>() {
    return new MutableSharedFlow<T>()
}

