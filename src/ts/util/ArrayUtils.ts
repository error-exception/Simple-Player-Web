import TypedArray = NodeJS.TypedArray;

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
}