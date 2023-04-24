export class Queue<T> {

    private _head: Node<T> | undefined = undefined
    private _end: Node<T> | undefined = undefined
    private _size: number = 0

    public push(value: T) {
        if (!this._head) {
            const node = new Node(value)
            this._head = node;
            this._end = node;
        } else {
            const node = new Node(value)
            this._end!.next = node
            this._end = node
        }
        this._size++
    }

    public front(): T {
        return this._head!.value
    }

    public end(): T {
        return this._end!.value
    }

    public size(): number {
        return this._size
    }

    public isEmpty(): boolean {
        return this._size === 0
    }

    public pop() {
        this._head = this._head!.next
        this._size--
    }

    public foreach(callback: (e: T, i: number) => void) {
        let current = this._head;
        let i = 0
        while (current !== null) {
            callback(current!.value, i++)
            current = current!.next
        }
    }

    public clear() {
        this._head = undefined;
        this._end = undefined;
        this._size = 0
    }
}

class Node<T> {
    public value: T
    public next: Node<T> | undefined = undefined

    constructor(v: T) {
        this.value = v;
    }
}
