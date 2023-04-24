
import {Queue} from "./Queue";
import {isRef} from "vue";

export const ease = cubicBezier(0.25, 0.1, 0.25, 1)
export const easeIn = cubicBezier(0.25, 0.1, 0.25, 1)
export const easeOut = cubicBezier(0, 0, 0.58, 1)
export const easeInOut = cubicBezier(0.42, 0, 0.58, 1)
export const linear = cubicBezier(0, 0, 1, 1)

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

export function cubicBezier(p1x: number, p1y: number, p2x: number, p2y: number) {
    const ZERO_LIMIT = 1e-6;
    // Calculate the polynomial coefficients,
    // implicit first and last control points are (0,0) and (1,1).
    const ax = 3 * p1x - 3 * p2x + 1;
    const bx = 3 * p2x - 6 * p1x;
    const cx = 3 * p1x;

    const ay = 3 * p1y - 3 * p2y + 1;
    const by = 3 * p2y - 6 * p1y;
    const cy = 3 * p1y;

    function sampleCurveDerivativeX(t: number) {
        // `ax t^3 + bx t^2 + cx t` expanded using Horner's rule
        return (3 * ax * t + 2 * bx) * t + cx;
    }

    function sampleCurveX(t: number) {
        return ((ax * t + bx) * t + cx) * t;
    }

    function sampleCurveY(t: number) {
        return ((ay * t + by) * t + cy) * t;
    }

    // Given an x value, find a parametric value it came from.
    function solveCurveX(x: number) {
        let t2 = x;
        let derivative;
        let x2;

        // https://trac.webkit.org/browser/trunk/Source/WebCore/platform/animation
        // first try a few iterations of Newton's method -- normally very fast.
        // http://en.wikipedia.org/wikiNewton's_method
        for (let i = 0; i < 8; i++) {
            // f(t) - x = 0
            x2 = sampleCurveX(t2) - x;
            if (Math.abs(x2) < ZERO_LIMIT) {
                return t2;
            }
            derivative = sampleCurveDerivativeX(t2);
            // == 0, failure
            /* istanbul ignore if */
            if (Math.abs(derivative) < ZERO_LIMIT) {
                break;
            }
            t2 -= x2 / derivative;
        }

        // Fall back to the bisection method for reliability.
        // bisection
        // http://en.wikipedia.org/wiki/Bisection_method
        let t1 = 1;
        /* istanbul ignore next */
        let t0 = 0;

        /* istanbul ignore next */
        t2 = x;
        /* istanbul ignore next */
        while (t1 > t0) {
            x2 = sampleCurveX(t2) - x;
            if (Math.abs(x2) < ZERO_LIMIT) {
                return t2;
            }
            if (x2 > 0) {
                t1 = t2;
            } else {
                t0 = t2;
            }
            t2 = (t1 + t0) / 2;
        }

        // Failure
        return t2;
    }

    function solve(x: number) {
        return sampleCurveY(solveCurveX(x));
    }

    return solve;
}