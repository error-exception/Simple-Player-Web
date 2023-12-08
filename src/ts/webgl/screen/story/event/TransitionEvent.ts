import {IEntry} from "../IEntry";

export abstract class TransitionEvent<T, V> {
  protected eventCount = 0

  protected constructor(protected sprite: IEntry) {}

  public abstract addEvent(event: T): void

  public abstract update(timestamp: number): void

  public abstract hasEvent(): boolean

  public abstract startTime(): number

  public abstract endTime(): number

  public abstract startValue(): V

  public abstract endValue(): V
}