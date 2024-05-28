import Coordinate from "../base/Coordinate";
import {BaseDrawableConfig, Drawable} from "./Drawable";
import {Shape2D} from "../util/Shape2D";
import {Texture} from "../core/Texture";
import {VertexBuffer} from "../core/VertexBuffer";
import type {DefaultShaderWrapper} from "../shader/DefaultShaderWrapper";
import {Shaders} from "../shader/Shaders";
import {Color} from "../base/Color";

export class ImageDrawable extends Drawable {

    private readonly shader: DefaultShaderWrapper
    private readonly buffer: VertexBuffer
    private readonly texture: Texture
    private textureUnit = 0
    private isVertexUpdate = true

    constructor(
        gl: WebGL2RenderingContext,
        image: HTMLImageElement,
        textureUnit: number = 0,
        config: BaseDrawableConfig
    ) {
        super(gl, config)
        this.textureUnit = textureUnit
        this.buffer = new VertexBuffer(gl);
        this.shader = Shaders.Default
        this.texture = new Texture(gl, image)
    }

    public createVertexArray() {
        const width = this.width
        const height= this.height
        const { x, y } = this.position
        const vertexData: number[] = []
        Shape2D.quad(
            x, y, 
            x + width, y - height,
            vertexData, 0, 4
        )
        Shape2D.quad(0, 0, 1, 1, vertexData, 2, 4)
        return new Float32Array(vertexData)
    }

    public onWindowResize() {
        super.onWindowResize()
        this.isVertexUpdate = true

    }

    public unbind() {
        this.buffer.unbind()
        this.texture.unbind()
        this.shader.unbind()
    }

    public bind() {
        this.texture.bind(this.textureUnit)
        this.buffer.bind()
        this.shader.bind()
    }

    private white = Color.fromHex(0xffffff)
    public onDraw() {
        const gl = this.gl
        if (this.isVertexUpdate) {
            this.buffer.setBufferData(this.createVertexArray())
            this.isVertexUpdate = false
        }
        const shader = this.shader
        shader.sampler2D = this.textureUnit
        shader.transform = this.matrixArray
        shader.orth = Coordinate.orthographicProjectionMatrix4
        this.white.alpha = this.appliedTransform.alpha
        shader.color = this.white
        shader.use()
        gl.drawArrays(gl.TRIANGLES, 0, 6)
    }

    public dispose() {
        this.texture.dispose()
        this.buffer.dispose()
    }
}