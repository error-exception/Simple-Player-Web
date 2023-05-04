import {Disposable} from "./Disposable";
import {Bindable} from "./Bindable";

export class Texture implements Disposable, Bindable {

    private static blankData = new Uint8Array([0, 0, 0, 0])
    private readonly rendererId: WebGLTexture
    public imageWidth: number = 0
    public imageHeight: number = 0

    constructor(
        private gl: WebGL2RenderingContext,
        url: string
    ) {
        const texture = gl.createTexture()
        if (!texture) {
            throw new Error("create texture error")
        }
        this.rendererId = texture
        gl.bindTexture(gl.TEXTURE_2D, texture)

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, Texture.blankData)
        gl.bindTexture(gl.TEXTURE_2D, null)
        const image = new Image()
        image.src = url
        image.decode().then(() => {
            gl.bindTexture(gl.TEXTURE_2D, texture)
            this.imageWidth = image.width
            this.imageHeight = image.height
            gl.texImage2D(
                gl.TEXTURE_2D,
                0,
                gl.RGBA,
                image.width,
                image.height,
                0,
                gl.RGBA,
                gl.UNSIGNED_BYTE,
                image
            )
            gl.bindTexture(gl.TEXTURE_2D, null)
        })
    }

    public bind(slot: GLenum = 0) {
        const gl = this.gl
        gl.activeTexture(gl.TEXTURE0 + slot)
        gl.bindTexture(gl.TEXTURE_2D, this.rendererId)
    }

    public unbind() {
        const gl = this.gl
        gl.bindTexture(gl.TEXTURE_2D, null)
    }

    public dispose() {
        this.gl.deleteTexture(this.rendererId)
    }

}