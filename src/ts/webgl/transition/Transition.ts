import {linear, TimeFunction} from "../../util/Easing";
import {Nullable} from "../../type";

export class Transition {

  public next: Nullable<Transition> = null

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

export class ObjectTransition {

  private transitionGroup: TransitionGroup | null = null
  private timeOffset: number = 0
  public isEnd = false

  public constructor(public obj: Record<string, any>, private propertyName: string) {
    if (typeof obj[propertyName] !== "number") {
      throw new Error("Unsupported data type")
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

export class GetAndSetTransition {
  private transitionGroup: TransitionGroup | null = null
  private timeOffset: number = 0
  public isEnd = false

  public constructor(public readonly getter: () => number, public readonly setter: (a: number) => void) {
    if (typeof getter() !== "number") {
      throw new Error("Unsupported data type")
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
      this.getter()
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
        this.setter(value)
      }
    }
  }
}
