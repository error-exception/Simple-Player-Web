import {Bindable} from "./Bindable";
import {Disposable} from "./Disposable";

export class VertexBuffer implements Bindable, Disposable {

    private readonly rendererId: WebGLBuffer

    constructor(
        private gl: WebGL2RenderingContext,
        data: Float32Array | null = null,
        private usage: number = gl.STATIC_DRAW
    ) {
        const buffer = gl.createBuffer()
        if (!buffer) {
            throw new Error("create vertex buffer error")
        }
        this.rendererId = buffer
        if (data !== null) {
            this.bind()
            gl.bufferData(gl.ARRAY_BUFFER, data, usage)
            this.unbind()
        }
    }

    public setBufferData(data: Float32Array) {
        const gl = this.gl
        gl.bufferData(gl.ARRAY_BUFFER, data, this.usage)
    }

    public setBufferSubData(data: Float32Array, byteOffset: GLintptr) {
        this.gl.bufferSubData(this.gl.ARRAY_BUFFER, byteOffset, data)
    }

    public bind() {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.rendererId)
    }

    public unbind() {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null)
    }

    public dispose() {
        this.gl.deleteBuffer(this.rendererId)
    }
}