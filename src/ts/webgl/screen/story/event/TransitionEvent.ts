import {Transition} from "../../../transition/Transition";
import {Sprite} from "../Sprite";

export abstract class TransitionEvent<T, V> {
  protected eventCount = 0

  protected transitionSortCompare = (a: Transition, b: Transition) => {
    if (a.startTime !== b.startTime)
      return a.startTime - b.startTime
    else
      return a.endTime - b.endTime
  }

  protected constructor(protected sprite: Sprite) {}

  public abstract addEvent(event: T): void

  public abstract update(timestamp: number): void

  public abstract hasEvent(): boolean

  public abstract startTime(): number

  public abstract endTime(): number

  public abstract startValue(): V

  public abstract endValue(): V

  public commit() {}
}