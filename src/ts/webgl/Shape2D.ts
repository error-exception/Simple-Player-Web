import {Vector2} from "./core/Vector2";

export class Shape {

    public static quad(
        x1: number, // top left x
        y1: number, // top left y
        x2: number, // bottom right x
        y2: number, // bottom right y
        target: Float32Array,
        offset: number,
        stride: number
    ) {
        let currentOffset = offset
        target[currentOffset++] = x1
        target[currentOffset] = y1

        currentOffset += stride
        target[currentOffset++] = x1
        target[currentOffset] = y2

        currentOffset += stride
        target[currentOffset] = 
    }

}