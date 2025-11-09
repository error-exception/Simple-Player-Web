import {Transition} from "../../../transition/Transition";
import type {SpriteV2} from "../SpriteV2";

export abstract class TransitionEvent<T, V> {
  protected eventCount = 0

  protected transitionSortCompare = (a: Transition, b: Transition) => {
    if (a.startTime !== b.startTime)
      return a.startTime - b.startTime
    else
      return a.endTime - b.endTime
  }

  protected constructor(protected sprite: SpriteV2) {}

  public abstract addEvent(event: T): void

  public abstract update(timestamp: number): void

  public abstract hasEvent(): boolean

  public abstract startTime(): number

  public abstract endTime(): number

  public abstract startValue(): V

  public abstract endValue(): V

  public commit() {}
}