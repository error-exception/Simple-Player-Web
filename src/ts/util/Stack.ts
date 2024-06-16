import type {Nullable} from "../type";

export class Stack<T> {

  private arr: T[] = []

  public push(e: T) {
    this.arr.push(e)
  }

  public pop(): Nullable<T> {
    if (this.arr.length === 0) {
      return null
    }
    return this.arr.pop() ?? null
  }

  public peek(): Nullable<T> {
    if (this.arr.length)
      return this.arr[this.arr.length - 1]
    return null
  }

  public size() {
    return this.arr.length
  }
}