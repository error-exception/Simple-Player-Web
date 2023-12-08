import {Nullable} from "../../../type";
import {Transition} from "../../transition/Transition";

/**
 * 该类不同于 TransitionGroup，不会清除已完成的过渡，这是为了当时间回溯时，
 * 还能够使用之前的过渡，同时每个过渡严格按照自己的时间区间和值区间进行更新计算
 */
export class TransitionQueue {

  // public list: Transition[] = []

  public first: Nullable<Transition> = null
  public last: Nullable<Transition> = null

  private _startTime = Number.MAX_VALUE
  private _endTime = Number.MIN_VALUE
  private _startValue = 0
  private _endValue = 0

  public add(transition: Transition) {
    // this.list.push(transition)
    if (this.first === null) {
      this.first = transition
      this.last = transition
    } else {
      // if (transition.startTime > this.last!.startTime) {
        this.last!.next = transition
        this.last = transition
      //   return
      // }
      // sorted by startTime
      // let current = this.first!, previous: Nullable<Transition> = null
      // while (transition.startTime > current.startTime && current.next !== null) {
      //   previous = current
      //   current = current.next
      // }
      // if (previous !== null) {
      //   previous.next = transition
      //   transition.next = current
      // } else {
      //   transition.next = this.first!
      //   this.first = transition
      // }
    }
    // const list = this.list
    // let i = 0, found = false
    // for (; i < list.length; i++) {
    //   if (list[i].startTime >= transition.startTime) {
    //     found = true
    //   }
    // }
    // if (found && i !== list) {
    //   list.pop()
    //   for (; i < list.length; i++) {
    //
    //   }
    //
    // }
    const {startTime, endTime, fromValue, toValue} = transition
    if (startTime < this._startTime) {
      this._startTime = startTime
      this._startValue = fromValue
    }
    if (endTime > this._endTime) {
      this._endTime = endTime
      this._endValue = toValue
    }
    if (this._endTime < this._startTime) {
      this._endTime = this._startTime
    }
  }

  private current: Nullable<Transition> = null
  public update(timestamp: number): Nullable<number> {
    if (this.first === null) {
      return null
    }
    let current: Transition = this.current ?? this.first
    // 当时间回溯时，确保能够找到之前的过渡
    if (timestamp < current.startTime && current !== this.first) {
      current = this.first
    }
    // 根据当前的时间，寻找合适的过渡
    while (timestamp >= current.startTime && current.next !== null && timestamp >= current.next.startTime) {
      current = current.next
    }
    this.current = current

    return current.update(timestamp)
  }


  // public update(timestamp: number): Nullable<number> {
  //   const list = this.list
  //   if (list.length === 0) {
  //     return null
  //   }
  //   let current: Transition = this.current ?? list[0]
  //   // 当时间回溯时，确保能够找到之前的过渡
  //   if (timestamp < current.startTime && current !== list[0]) {
  //     current = list[0]
  //   }
  //   // 根据当前的时间，寻找合适的过渡
  //   while (timestamp >= current.startTime && current.next !== null && timestamp >= current.next.startTime) {
  //     current = current.next
  //   }
  //   if (timestamp >= current.startTime && timestamp <= current.endTime) {
  //     return current.update(timestamp)
  //   }
  //   for (let i = 1; i < list.length; i++) {
  //     const transition = list[i]
  //     if (timestamp >= transition.startTime && timestamp <= transition.endTime) {
  //       current = transition
  //       break
  //     }
  //   }
  //   this.current = current
  //
  //   return current.update(timestamp)
  // }

  public get startTime() {
    // if (this.list.length === 0) {
    //   console.warn("no transition")
    // }
    return this._startTime
  }

  public get endTime() {
    // if (this.list.length === 0) {
    //   console.warn("no transition")
    // }
    return this._endTime
  }

  public get startValue() {
    if (!this.first) {
      throw new Error("no transition")
    }
    return this._startValue
  }

  public get endValue() {
    if (!this.last) {
      throw new Error("no transition")
    }
    return this._endValue
  }

}