import type { Nullable } from "../type";

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

export class ArrayStack<T> {

  private array: Nullable<T>[] = []
  /**
   * 当前栈顶元素的指针
   * @private
   */
  private index = -1

  public get size() {
    return Math.max(0, this.index + 1)
  }

  public push(e: T) {
    const array = this.array
    this.index++
    if (this.index >= array.length) {
      array.push(e)
    } else {
      array[this.index] = e
    }
  }

  public pop(): Nullable<T> {
    if (this.index < 0) {
      return null
    }
    const array = this.array
    const e = array[this.index]
    array[this.index] = null
    this.index--
    return e
  }

  public peek(): Nullable<T> {
    if (this.index < 0) {
      return null
    }
    return this.array[this.index]
  }

  public forEach(callback: (value: T) => void): void {
    const array = this.array
    let e: Nullable<T>
    for (let i = this.index; i >= 0; i--) {
      e = array[i]
      if (e) {
        callback(e)
      }
    }
  }

  public clear() {
    this.array.length = 0
    this.index = -1
  }
}