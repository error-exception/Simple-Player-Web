export class Matrix3 {

    /**
     * readonly, do not modify
     */
    public static identify = [
        1, 0, 0,
        0, 1, 0,
        0, 0, 1
    ]

    private value: number[] = [
        0, 0, 0,
        0, 0, 0,
        0, 0, 0
    ]

    public static newIdentify(): Matrix3 {
        const ma = new Matrix3()
        ma.M11 = 1
        ma.M22 = 1
        ma.M33 = 1
        return ma
    }

    public static newMatrix(value: number[]) {
        const ma = new Matrix3()
        ma.value = value
        return ma
    }

    public static copyTo(ma: Matrix3, out: number[] | Float32Array | Float64Array) {
        if (out.length < ma.value.length) {
            throw new Error("out.length should be greater than or equal to 9")
        }
        for (let i = 0; i < out.length; i++) {
            out[i] = ma.value[i]
        }
    }

    public get M11() {
        return this.value[0]
    }
    public set M11(v: number) {
        this.value[0] = v
    }

    public get M12() {
        return this.value[1]
    }
    public set M12(v: number) {
        this.value[1] = v
    }

    public get M13() {
        return this.value[2]
    }
    public set M13(v: number) {
        this.value[2] = v;
    }

    public get M21() {
        return this.value[3]
    }
    public set M21(v: number) {
        this.value[3] = v;
    }

    public get M22() {
        return this.value[4]
    }
    public set M22(v: number) {
        this.value[4] = v;
    }

    public get M23() {
        return this.value[5]
    }
    public set M23(v: number) {
        this.value[5] = v;
    }

    public get M31() {
        return this.value[6]
    }
    public set M31(v: number) {
        this.value[6] = v;
    }

    public get M32() {
        return this.value[7]
    }
    public set M32(v: number) {
        this.value[7] = v;
    }

    public get M33() {
        return this.value[8]
    }
    public set M33(v: number) {
        this.value[8] = v;
    }


}