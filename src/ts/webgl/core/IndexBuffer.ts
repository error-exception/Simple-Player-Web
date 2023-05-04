import {Bindable} from "./Bindable";
import {Disposable} from "./Disposable";

export class IndexBuffer implements Bindable, Disposable {

    private readonly rendererId: WebGLBuffer

    constructor(
        private gl: WebGL2RenderingContext,
        data: Uint32Array | null = null,
        private usage = gl.STATIC_DRAW
    ) {
        const buffer = gl.createBuffer()
        if (!buffer) {
            throw new Error('create index buffer error')
        }
        this.rendererId = buffer
        this.bind()
        if (data !== null) {
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, usage)
        }
        this.unbind()
    }

    public setIndexBuffer(data: Uint32Array) {
        const gl = this.gl
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, this.usage)
    }

    public bind() {
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.rendererId)
    }

    public unbind() {
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null)
    }

    public dispose() {
        this.gl.deleteBuffer(this.rendererId)
    }

}