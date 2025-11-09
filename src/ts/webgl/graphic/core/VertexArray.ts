import {Bindable} from "./Bindable";
import {Disposable} from "./Disposable";
import {VertexBufferElement, VertexBufferLayout} from "./VertexBufferLayout";

export class VertexArray implements Bindable, Disposable {

    private readonly rendererId: WebGLVertexArrayObject

    constructor(
        private gl: WebGL2RenderingContext
    ) {
        const va = gl.createVertexArray()
        if (!va) {
            throw new Error("create vertex array error")
        }
        this.rendererId = va
    }

    public addBuffer(/*vertexBuffer: VertexBuffer,*/ layout: VertexBufferLayout) {
        // this.bind()
        // vertexBuffer.bind()
        const gl = this.gl
        const elements = layout.elements
        let offset = 0
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i]
            gl.enableVertexAttribArray(element.position)
            gl.vertexAttribPointer(
                element.position,
                element.count,
                element.type,
                element.normalized,
                layout.stride,
                offset
            )
            offset += element.count * VertexBufferElement.getSizeOfType(gl, element.type)
        }
    }

    public bind() {
        this.gl.bindVertexArray(this.rendererId)
    }

    public unbind() {
        this.gl.bindVertexArray(null)
    }

    public dispose() {
        this.gl.deleteVertexArray(this.rendererId)
    }

}