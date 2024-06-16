import {Queue} from "../../util/Queue";

export class DrawableTask {

  public preTaskQueue = new Queue<() => void>()
  public postTaskQueue = new Queue<() => void>()

  public consumePreTask() {
    if (this.preTaskQueue.size() === 0) {
      return
    }
    this.preTaskQueue.foreach(task => task())
    this.preTaskQueue.clear()
  }

  public consumePostTask() {
    if (this.postTaskQueue.size() === 0) {
      return
    }
    this.postTaskQueue.foreach(task => task())
    this.postTaskQueue.clear()
  }

  public post(task: () => void) {
    this.postTaskQueue.push(task)
  }

  public pre(task: () => void) {
    this.preTaskQueue.push(task)
  }
}