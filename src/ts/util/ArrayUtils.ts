import TypedArray = NodeJS.TypedArray;
import {almostEquals} from "../webgl/core/Utils";

export class ArrayUtils {

    public static sumOf(arr: number[], start: number = 0, end: number = arr.length): number {
        let sum = 0
        for (let i = start; i < end; i++) {
            sum += arr[i]
        }
        return sum
    }

    public static averageOf(arr: number[], start: number = 0, end: number = arr.length): number {
        return ArrayUtils.sumOf(arr, start, end) / (end - start)
    }

    public static removeAt<T>(array: T[], index: number) {
        if (array.length === 0 || index < 0 || index >= array.length) {
            throw new Error("array is empty or index out of bound")
        }
        for (let i = index; i < array.length - 1; i++) {
            array[i] = array[i + 1]
        }
        array.pop()
    }

    public static removeRange(arr: number[], start: number = 0, end: number = arr.length) {
        arr.splice(start, (end - start))
    }

    public static copyOfRange<T>(arr: T[], start: number, end: number): T[] {
        const newArray = new Array<T>(end - start)
        for (let i = start; i < end; i++) {
            newArray[i - start] = arr[i]
        }
        return newArray
    }

    public static copyTo<T = any>(src: T[] | Float32Array, start: number, length: number, dest: T[] | Float32Array, destStart: number) {
        if (src.length < start + length || dest.length < destStart + length) {
            return
        }
        for (let i = 0; i < length; i++) {
            dest[destStart + i] = src[start + i]
        }
    }

    public static inBound<T>(arr: T[] | TypedArray, index: number): boolean {
        if (!Number.isInteger(index)) {
            return false
        }
        return index >= 0 && index < arr.length
    }

    public static everyValue<T>(arr: T[], param2: (it: T) => T) {
        for (let i = 0; i < arr.length; i++) {
            arr[i] = param2(arr[i])
        }
    }

    public static maxOf<T>(arr: T[], p: (it: T) => number) {
        let max = Number.MIN_VALUE
        for (let i = 0; i < arr.length; i++) {
            const v = p(arr[i])
            if (v > max) {
                max = v
            }
        }
        return max
    }

    public static minOf<T>(arr: T[], p: (it: T) => number) {
        let min = Number.MAX_VALUE
        for (let i = 0; i < arr.length; i++) {
            const v = p(arr[i])
            if (v < min) {
                min = v
            }
        }
        return min
    }

    public static equals(a: ArrayLike<any>, b: ArrayLike<any>) {
        if (a.length !== b.length) {
            return false
        }
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) {
                return false;
            }
        }
        return true
    }

    public static almostEquals(a: number[] | Float32Array, b: number[] | Float32Array) {
        if (a.length !== b.length) {
            return false
        }
        for (let i = 0; i < a.length; i++) {
            if (!almostEquals(a[i], b[i])) {
                return false;
            }
        }
        return true
    }

    public static emptyFloat32Array = new Float32Array()
}