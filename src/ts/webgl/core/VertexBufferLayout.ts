export class VertexBufferElement {

    constructor(
        public position: number,
        public type: number,
        public count: number,
        public normalized: boolean,
    ) {
    }

    public static getSizeOfType(gl: WebGL2RenderingContext, type: number) {
        switch (type) {
            case gl.FLOAT: return 4;
            case gl.UNSIGNED_INT: return 4;
            case gl.UNSIGNED_BYTE: return 1
        }
        return 0
    }

}

export class VertexBufferLayout {

    public elements: VertexBufferElement[] = []

    public stride: number = 0

    constructor(private gl: WebGL2RenderingContext) {
    }

    public pushFloat(position: number, count: number) {
        const gl = this.gl
        const element
            = new VertexBufferElement(position, gl.FLOAT, count, false)
        this.elements.push(element)
        this.stride += count * VertexBufferElement.getSizeOfType(gl, gl.FLOAT)
    }

    public pushUByte(position: number, count: number) {
        const gl = this.gl
        const element
            = new VertexBufferElement(position, gl.UNSIGNED_BYTE, count, true)
        this.elements.push(element)
        this.stride += count * VertexBufferElement.getSizeOfType(gl, gl.UNSIGNED_BYTE)
    }

    public pushUInt(position: number, count: number) {
        const gl = this.gl
        const element
            = new VertexBufferElement(position, gl.UNSIGNED_INT, count, false)
        this.elements.push(element)
        this.stride += count * VertexBufferElement.getSizeOfType(gl, gl.UNSIGNED_INT)
    }
}