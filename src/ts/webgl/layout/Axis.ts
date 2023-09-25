export class Axis {

    public static X_LEFT = 1
    public static X_CENTER = 1 << 1
    public static X_RIGHT = 1 << 2
    public static Y_TOP = 1 << 3
    public static Y_CENTER = 1 << 4
    public static Y_BOTTOM = 1 << 5

    public static getXAxis(anchor: number): number {
        return anchor & 0b111
    }

    public static getYAxis(anchor: number): number {
        return anchor & (0b111 << 3)
    }

}