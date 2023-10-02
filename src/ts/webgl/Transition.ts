import {linear, TimeFunction} from "../util/Easing";
import {Drawable} from "./Drawable";
import {Vector2} from "./core/Vector2";
export class Transition {

    public next: Transition | null = null

    public constructor(
        public readonly startTime: number = 0,
        public readonly endTime: number = 0,
        public readonly timeFunction: TimeFunction = linear,
        public readonly toValue: number = 0,
        public fromValue: number = 0,
    ) {
        if (startTime >  endTime) {
            throw new Error('Illegal parameter')
        }
    }

    public isEnd = false
    public isStarted = false

    public setFromValue(v: number) {
        this.fromValue = v
    }

    public update(timestamp: number): number {
        const start = this.startTime
        const end = this.endTime
        if (timestamp < start) {
            return this.fromValue
        }
        this.isStarted = true
        if (timestamp >= end) {
            this.isEnd = true
            return this.toValue
        }
        const progress = (timestamp - start) / (end - start)
        return this.fromValue + this.timeFunction(progress) * (this.toValue - this.fromValue)
    }
}

export class TransitionGroup {

    public transition: Transition | null = null
    public current: Transition | null = null
    public isEnd = false
    public currentValue: number | null = 0

    public add(transition: Transition) {
        if (this.transition === null) {
            this.transition = transition
            this.current = transition
        } else {
            this.current!!.next = transition
            this.current = transition
        }
        this.isEnd = false
    }

    public update(timestamp: number) {
        if (this.transition === null) {
            this.currentValue = null
            return
        }
        // 如果当前过渡尚未结束，但下一个已经开始时，放弃当前过渡，执行下一个过渡
        while (!this.transition.isEnd && this.transition.next != null && this.transition.next.startTime < timestamp) {
            const value = this.transition.update(timestamp)
            this.transition = this.transition.next
            this.transition.setFromValue(value)
        }
        let value = this.transition.update(timestamp)
        if (!this.transition.isStarted) {
            this.currentValue = null
            return;
        }
        // 如果下一个过渡的持续时间非常短，甚至短于帧的间隔时间，则不断寻找下一个过渡，直到找到较长持续时间的过渡
        while (this.transition.isEnd) {
            if (this.transition.next !== null) {
                this.transition = this.transition.next
                this.transition.setFromValue(value)
                value = this.transition.update(timestamp)
            } else {
                this.isEnd = true
                break
            }
        }
        this.currentValue = value
    }

}

export class ScaleTransition {

    private scaleTransitionGroup: TransitionGroup | null  = null
    private scaleTimeOffset: number = 0
    public isEnd = false

    public constructor(public drawable: Drawable) {}

    public setStartTime(startTime: number) {
        this.scaleTimeOffset = startTime
        this.isEnd = false
    }

    public scaleTo(target: number, duration: number = 0, ease: TimeFunction = linear) {
        const transition = new Transition(
            this.scaleTimeOffset,
            this.scaleTimeOffset + duration,
            ease,
            target,
            this.drawable.scale.x
        )
        if (this.scaleTransitionGroup === null) {
            this.scaleTransitionGroup = new TransitionGroup()
        }
        this.scaleTransitionGroup.add(transition)
        this.scaleTimeOffset += duration
        return this
    }

    public update(timestamp: number) {
        const scaleTransitionGroup = this.scaleTransitionGroup
        if (scaleTransitionGroup !== null) {
            scaleTransitionGroup.update(timestamp)
            const scaleValue = scaleTransitionGroup.currentValue
            if (scaleTransitionGroup.isEnd) {
                this.isEnd = true
                this.scaleTransitionGroup = null
            }
            if (scaleValue != null) {
                this.drawable.scale = new Vector2(scaleValue, scaleValue)
            }
        }
    }
}

export class FadeTransition {

    private fadeTransitionGroup: TransitionGroup | null = null
    private fadeTimeOffset: number = 0
    public isEnd = false

    public constructor(public drawable: Drawable) {}

    public setStartTime(startTime: number) {
        this.fadeTimeOffset = startTime
        this.isEnd = false
    }

    public fadeTo(target: number, duration: number = 0, ease: TimeFunction = linear) {
        const transition = new Transition(
            this.fadeTimeOffset,
            this.fadeTimeOffset + duration,
            ease,
            target,
            this.drawable.alpha
        )
        if (this.fadeTransitionGroup === null) {
            this.fadeTransitionGroup = new TransitionGroup()
        }
        this.fadeTransitionGroup.add(transition)
        this.fadeTimeOffset += duration
        return this
    }

    public update(timestamp: number) {

        const fadeTransitionGroup = this.fadeTransitionGroup
        if (fadeTransitionGroup !== null) {
            fadeTransitionGroup.update(timestamp)
            const fadeValue = fadeTransitionGroup.currentValue
            this.isEnd = fadeTransitionGroup.isEnd
            if (fadeTransitionGroup.isEnd) {
                this.fadeTransitionGroup = null
            }
            if (fadeValue != null) {
                this.drawable.alpha = fadeValue
            }
        }
    }
}

export class TranslateTransition {

    private transXTransition: TransitionGroup | null = null
    private transYTransition: TransitionGroup | null = null
    private transOffsetTime: number = 0
    public isEnd = false

    public constructor(public drawable: Drawable) {}

    public setStartTime(startTime: number) {
        this.transOffsetTime = startTime
        this.isEnd = false
    }

    public translateTo(target: Vector2, duration: number = 0, ease: TimeFunction = linear) {
        const translate = this.drawable.translate
        const transitionX = new Transition(
            this.transOffsetTime,
            this.transOffsetTime + duration,
            ease,
            target.x,
            translate.x
        )
        if (this.transXTransition === null) {
            this.transXTransition = new TransitionGroup()
        }
        this.transXTransition.add(transitionX)

        const transitionY = new Transition(
            this.transOffsetTime,
            this.transOffsetTime + duration,
            ease,
            target.y,
            translate.y
        )
        if (this.transYTransition === null) {
            this.transYTransition = new TransitionGroup()
        }
        this.transYTransition.add(transitionY)
        this.transOffsetTime += duration
        return this
    }

    public update(timestamp: number) {
        const x = this.updateX(timestamp)
        const y = this.updateY(timestamp)
        if (x !== null && y !== null) {
            this.drawable.translate = new Vector2(x, y)
        }
    }

    private updateX(timestamp: number) {
        const transXTransition = this.transXTransition
        if (transXTransition !== null) {
            transXTransition.update(timestamp)
            const transXValue = transXTransition.currentValue
            this.isEnd = transXTransition.isEnd
            if (transXTransition.isEnd) {
                this.transXTransition = null
            }
            if (transXValue != null) {
                return transXValue
            }
        }
        return null
    }

    private updateY(timestamp: number) {
        const transYTransition = this.transYTransition
        if (transYTransition !== null) {
            transYTransition.update(timestamp)
            const transYValue = transYTransition.currentValue
            this.isEnd = transYTransition.isEnd
            if (transYTransition.isEnd) {
                this.transYTransition = null
            }
            if (transYValue != null) {
                return  transYValue
            }
        }
        return null
    }

}

export class Vector2Transition {
    private vecXTransition: TransitionGroup | null = null
    private vecYTransition: TransitionGroup | null = null
    private offsetTime: number = 0
    public isEnd = false

    public constructor(public obj: Record<string, any>, private property: string) {}

    public setStartTime(startTime: number) {
        this.offsetTime = startTime
    }

    public to(target: Vector2, duration: number = 0, ease: TimeFunction = linear) {
        const vector = this.obj[this.property]
        const vectorX = new Transition(
            this.offsetTime,
            this.offsetTime + duration,
            ease,
            target.x,
            vector.x
        )
        if (this.vecXTransition === null) {
            this.vecXTransition = new TransitionGroup()
        }
        this.vecXTransition.add(vectorX)

        const vectorY = new Transition(
            this.offsetTime,
            this.offsetTime + duration,
            ease,
            target.y,
            vector.y
        )
        if (this.vecYTransition === null) {
            this.vecYTransition = new TransitionGroup()
        }
        this.vecYTransition.add(vectorY)
        this.offsetTime += duration
        return this
    }

    public update(timestamp: number) {
        const x = this.updateX(timestamp)
        const y = this.updateY(timestamp)
        if (x && y) {
            this.obj.translate = new Vector2(x, y)
        }
    }

    private updateX(timestamp: number) {
        const vecXTransition = this.vecXTransition
        if (vecXTransition !== null) {
            vecXTransition.update(timestamp)
            const vecXValue = vecXTransition.currentValue
            this.isEnd = vecXTransition.isEnd
            if (vecXTransition.isEnd) {
                this.vecXTransition = null
            }
            if (vecXValue != null) {
                return vecXValue
            }
        }
        return null
    }

    private updateY(timestamp: number) {
        const vecYTransition = this.vecYTransition
        if (vecYTransition !== null) {
            vecYTransition.update(timestamp)
            const vecYValue = vecYTransition.currentValue
            this.isEnd = vecYTransition.isEnd
            if (vecYTransition.isEnd) {
                this.vecYTransition = null
            }
            if (vecYValue != null) {
                return  vecYValue
            }
        }
        return null
    }

}

export class ObjectTransition {

    private transitionGroup: TransitionGroup | null = null
    private timeOffset: number = 0
    public isEnd = false

    public constructor(public obj: Record<string, any>, private propertyName: string) {
        if (typeof obj[propertyName] !== "number") {
            throw new Error("An unsupported data type")
        }
    }

    public setStartTime(startTime: number) {
        this.timeOffset = startTime
        this.isEnd = false
    }

    public transitionTo(target: number, duration: number = 0, ease: TimeFunction = linear) {
        const transition = new Transition(
            this.timeOffset,
            this.timeOffset + duration,
            ease,
            target,
            this.obj[this.propertyName]
        )
        if (this.transitionGroup === null) {
            this.transitionGroup = new TransitionGroup()
        }
        this.transitionGroup.add(transition)
        this.timeOffset += duration
        return this
    }

    public update(timestamp: number) {

        const transitionGroup = this.transitionGroup
        if (transitionGroup !== null) {
            transitionGroup.update(timestamp)
            const value = transitionGroup.currentValue
            if (transitionGroup.isEnd) {
                this.isEnd = true
                this.transitionGroup = null
            }
            if (value != null) {
                this.obj[this.propertyName] = value
            }
        }
    }

}
