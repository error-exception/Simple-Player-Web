import { degreeToRadian } from "../Utils"
import { Color } from "./Color"
import { Vector2 } from "./core/Vector2"

export class Shape2D {

    public static quad(
        x1: number, // top left x
        y1: number, // top left y
        x2: number, // bottom right x
        y2: number, // bottom right y
        target: Float32Array | number[],
        offset: number,
        stride: number
    ) {
        // top left
        target[offset] = x1
        target[offset + 1] = y1

        // bottom left
        target[offset + stride] = x1
        target[offset + stride + 1] = y2

        // top right
        target[offset + stride * 2] = x2
        target[offset + stride * 2 + 1] = y1

        // top right
        target[offset + stride * 3] = x2
        target[offset + stride * 3 + 1] = y1

        // bottom left
        target[offset + stride * 4] = x1
        target[offset + stride * 4 + 1] = y2

        // bottom right
        target[offset + stride * 5] = x2
        target[offset + stride * 5 + 1] = y2
    }

    public static color(
        r1: number, g1: number, b1: number, a1: number, // top left
        r2: number, g2: number, b2: number, a2: number, // bottom left
        r3: number, g3: number, b3: number, a3: number, // top right
        r4: number, g4: number, b4: number, a4: number, // bottom right
        target: Float32Array | number[],
        offset: number, stride: number
    ) {
        target[offset] = r1
        target[offset + 1] = g1
        target[offset + 2] = b1
        target[offset + 3] = a1

        target[offset + stride] = r2
        target[offset + stride + 1] = g2
        target[offset + stride + 2] = b2
        target[offset + stride + 3] = a2

        target[offset + stride * 2] = r3
        target[offset + stride * 2 + 1] = g3
        target[offset + stride * 2 + 2] = b3
        target[offset + stride * 2 + 3] = a3

        target[offset + stride * 3] = r3
        target[offset + stride * 3 + 1] = g3
        target[offset + stride * 3 + 2] = b3
        target[offset + stride * 3 + 3] = a3

        target[offset + stride * 4] = r2
        target[offset + stride * 4 + 1] = g2
        target[offset + stride * 4 + 2] = b2
        target[offset + stride * 4 + 3] = a2

        target[offset + stride * 5] = r4
        target[offset + stride * 5 + 1] = g4
        target[offset + stride * 5 + 2] = b4
        target[offset + stride * 5 + 3] = a4
    }

    public static quadVector2(topLeft: Vector2, bottomRight: Vector2, target: Float32Array | number[], offset: number, stride: number) {
        this.quad(topLeft.x, topLeft.y, bottomRight.x, bottomRight.y, target, offset, stride)
    }

    public static oneColor(color: Color, target: Float32Array | number[], offset: number, stride: number) {
        this.color(
            color.red, color.green, color.blue, color.alpha, 
            color.red, color.green, color.blue, color.alpha, 
            color.red, color.green, color.blue, color.alpha, 
            color.red, color.green, color.blue, color.alpha, 
            target, offset, stride
        )
    }

    public static triangle(v1: Vector2, v2: Vector2, v3: Vector2, target: Float32Array | number[], offset: number, stride: number) {
        target[offset] = v1.x
        target[offset + 1] = v1.y

        target[offset + stride] = v2.x
        target[offset + stride + 1] = v2.y

        target[offset + stride * 2] = v3.x
        target[offset + stride * 2 + 1] = v3.y
    }

    public static ring(
        innerRadius: number, 
        width: number, 
        color: Color,
        count: number,
        target: Float32Array | number[], 
        offset: number, 
        stride: number
    ): number {
        const x = 0, innerY = innerRadius, outerY = innerRadius + width;
        const degree = 360 / count;
        const r = color.red, g = color.green, b = color.blue, a = color.alpha;
        let currentOffset = offset
        for (let i = 0; i < count; i++) {
            const current = degreeToRadian(degree * i),
                next = degreeToRadian(degree * (i + 1));
            const sin1 = Math.sin(current), cos1 = Math.cos(current),
                sin2 = Math.sin(next), cos2 = Math.cos(next);
            const x1 = x * cos1 + innerY * -sin1, y1 = x * sin1 + innerY * cos1,
                  x2 = x * cos1 + outerY * -sin1, y2 = x * sin1 + outerY * cos1,
                  x3 = x * cos2 + innerY * -sin2, y3 = x * sin2 + innerY * cos2,
                  x4 = x * cos2 + outerY * -sin2, y4 = x * sin2 + outerY * cos2;
            
            target[currentOffset] = x1
            target[currentOffset + 1] = y1
            target[currentOffset + 2] = r
            target[currentOffset + 3] = g
            target[currentOffset + 4] = b
            target[currentOffset + 5] = a
    
            target[currentOffset + stride] = x2
            target[currentOffset + stride + 1] = y2
            target[currentOffset + stride + 2] = r
            target[currentOffset + stride + 3] = g
            target[currentOffset + stride + 4] = b
            target[currentOffset + stride + 5] = a
    
            target[currentOffset + stride * 2] = x4
            target[currentOffset + stride * 2 + 1] = y4
            target[currentOffset + stride * 2 + 2] = r
            target[currentOffset + stride * 2 + 3] = g
            target[currentOffset + stride * 2 + 4] = b
            target[currentOffset + stride * 2 + 5] = a

            target[currentOffset + stride * 3] = x4
            target[currentOffset + stride * 3 + 1] = y4
            target[currentOffset + stride * 3 + 2] = r
            target[currentOffset + stride * 3 + 3] = g
            target[currentOffset + stride * 3 + 4] = b
            target[currentOffset + stride * 3 + 5] = a

            target[currentOffset + stride * 4] = x1
            target[currentOffset + stride * 4 + 1] = y1
            target[currentOffset + stride * 4 + 2] = r
            target[currentOffset + stride * 4 + 3] = g
            target[currentOffset + stride * 4 + 4] = b
            target[currentOffset + stride * 4 + 5] = a

            target[currentOffset + stride * 5] = x3
            target[currentOffset + stride * 5 + 1] = y3
            target[currentOffset + stride * 5 + 2] = r
            target[currentOffset + stride * 5 + 3] = g
            target[currentOffset + stride * 5 + 4] = b
            target[currentOffset + stride * 5 + 5] = a

            currentOffset += stride * 6

        }

        return count * 36

    }

}