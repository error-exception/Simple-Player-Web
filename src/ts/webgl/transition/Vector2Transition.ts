import {Vector2} from "../core/Vector2";
import {linear, TimeFunction} from "../../util/Easing";
import {Transition, TransitionGroup} from "../Transition";

export class Vector2Transition {
    private vecXTransition: TransitionGroup | null = null
    private vecYTransition: TransitionGroup | null = null
    private offsetTime: number = 0
    public isEnd = false

    public constructor(public obj: Record<string, any>, private property: string) {}

    public setStartTime(startTime: number) {
        this.offsetTime = startTime
        this.isEnd = false
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
        if (x !== null && y !== null) {
            this.obj[this.property] = new Vector2(x, y)
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
            if (vecXValue !== null) {
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
            if (vecYValue !== null) {
                return  vecYValue
            }
        }
        return null
    }

}