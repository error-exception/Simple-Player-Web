
import {Queue} from "./Queue";
import {isRef} from "vue";
import {ease, easeIn, easeInOut, easeOut, linear} from "./Easing";

function isNumber(a: any): a is number {
    return typeof a === "number"
}

class Animated {

    private readonly target: any
    private hasAnimationRunning: boolean = false
    private animationQueue: Queue<AnimationItem> = new Queue<AnimationItem>()
    private currentAnimate: AnimationItem | undefined
    private onFinishCallback: Function | undefined

    constructor(target: any) {
        if (!isRef(target)) {
            throw new Error("only ref")
        }
        if (!isNumber(target.value)) {
            throw new Error("only number")
        }

        this.target = target
    }

    public linearTo(targetValue: number, duration: number, delay: number = 0) {
        this.commit(targetValue, duration, delay, linear)
        return this
    }

    public easeInOutTo(targetValue: number, duration: number, delay: number = 0) {
        this.commit(targetValue, duration, delay, easeInOut)
        return this
    }

    public easeInTo(targetValue: number, duration: number, delay: number = 0) {
        this.commit(targetValue, duration, delay, easeIn)
        return this
    }

    public easeTo(targetValue: number, duration: number, delay: number = 0) {
        this.commit(targetValue, duration, delay, ease)
        return this
    }

    public easeOutTo(targetValue: number, duration: number, delay: number = 0) {
        this.commit(targetValue, duration, delay, easeOut)
        return this
    }

    public animateTo(targetValue: number, duration: number, timeFunction: Function, delay: number = 0) {
        this.commit(targetValue, duration, delay, timeFunction)
        return this;
    }

    public onFinish(callback: Function) {
        this.onFinishCallback = callback
    }

    public cancelAll() {
        if (!this.animationQueue.isEmpty()) {
            this.animationQueue.foreach((e) => {
                e.cancel()
            })
            this.animationQueue.clear()
        } else if (this.currentAnimate) {
            this.currentAnimate.cancel()
            this.currentAnimate = undefined
            this.hasAnimationRunning = false
        }
    }

    private commit(targetValue: number, duration: number, delay: number, timeFunction: Function) {
        const animateItem = new AnimationItem(
            timeFunction,
            this.target,
            targetValue,
            duration,
            delay
        )
        animateItem.onFinish(() => {
            if (this.animationQueue.isEmpty()) {
                this.hasAnimationRunning = false
                this.currentAnimate = undefined
                if (this.onFinishCallback)
                    this.onFinishCallback()
            } else {
                this.runNext()
            }
        })

        if (!this.hasAnimationRunning) {
            animateItem.run()
            this.hasAnimationRunning = true
            this.currentAnimate = animateItem
        } else {
            this.animationQueue.push(animateItem)
        }
    }

    private runNext() {
        this.currentAnimate = this.animationQueue.front()
        this.animationQueue.pop()
        this.currentAnimate.run()
    }


}

class AnimationItem {

    private startTime: number = 0
    private readonly target: any
    private initialValue: number = 0
    private readonly destValue: number
    private readonly timeFunction: Function
    private readonly animateDuration: number
    private valueDistance: number = 0
    private elapsed: number = 0;
    private previousTimestamp: number = 0
    private readonly delay: number = 0
    private onFinishCallback: Function | undefined
    private cancelled = false
    private timerId: number = 0

    constructor(
        timeFunction: Function,
        target: any,
        destValue: number,
        duration: number,
        delay: number
    ) {
        this.timeFunction = timeFunction;
        this.target = target;
        this.destValue = destValue;
        this.animateDuration = duration
        this.delay = delay
    }

    public run() {
        this.initialValue = this.target.value;
        this.valueDistance = (this.destValue - this.initialValue)
        if (this.delay === 0) {
            requestAnimationFrame(this.updater.bind(this))
        } else {
            //@ts-ignore
            this.timerId = setTimeout(() => {
                requestAnimationFrame(this.updater.bind(this))
            }, this.delay)
        }
    }

    private updater(timestamp: number) {
        if (this.startTime === 0) {
            this.startTime = timestamp
        }
        this.elapsed = timestamp - this.startTime
        if (this.previousTimestamp !== timestamp) {
            this.target.value =
                this.initialValue + this.timeFunction(this.elapsed / this.animateDuration) * this.valueDistance;
        }
        if (!this.cancelled) {
            if (this.elapsed < this.animateDuration) {
                this.previousTimestamp = timestamp
                requestAnimationFrame(this.updater.bind(this))
            } else {
                this.target.value = this.destValue
                if (this.onFinishCallback)
                    this.onFinishCallback()
            }
        }

    }

    public onFinish(callback: Function) {
        this.onFinishCallback = callback
    }

    public cancel() {
        clearTimeout(this.timerId)
        this.cancelled = true
    }

}

export function simpleAnimate(target: any) {
    return new Animated(target)
}