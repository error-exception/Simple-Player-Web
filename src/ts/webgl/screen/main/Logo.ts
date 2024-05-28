import Coordinate from "../../base/Coordinate";
import {BaseDrawableConfig, Drawable} from "../../drawable/Drawable";
import {Shape2D} from "../../util/Shape2D";
import {Texture} from "../../core/Texture";
import {Vector2} from "../../core/Vector2";
import {VertexBuffer} from "../../core/VertexBuffer";
import {Images} from "../../util/ImageResource";
import type {DefaultShaderWrapper} from "../../shader/DefaultShaderWrapper";
import {Shaders} from "../../shader/Shaders";
import {Color} from "../../base/Color";

export class Logo extends Drawable {

    private readonly shader: DefaultShaderWrapper
    private readonly buffer: VertexBuffer
    private readonly texture: Texture
    private readonly textureUnit = 0

    constructor(
        gl: WebGL2RenderingContext,
        config: BaseDrawableConfig
    ) {
        super(gl, config)
        this.buffer = new VertexBuffer(gl);
        this.shader = Shaders.Default
        this.texture = new Texture(gl, Images.Logo)
    }

    public createVertexArray() {
        const width = this.width
        const height = this.height
        const { x, y } = this.position
        
        const topLeft = new Vector2(x, y)
        const bottomRight = new Vector2(x + width, y - height)
        const vertexData: number[] = []
        Shape2D.quadVector2(
            topLeft, bottomRight,
            vertexData, 0, 4
        )
        Shape2D.quad(
            0, 0, 1, 1,
            vertexData, 2, 4
        )
        
        return new Float32Array(vertexData)
    }

    public onLoad(): void {
        this.buffer.bind()
        this.buffer.setBufferData(this.createVertexArray())
        this.buffer.unbind()
    }

    public onWindowResize(): void {
        super.onWindowResize()
        this.buffer.bind()
        this.buffer.setBufferData(this.createVertexArray())
        this.buffer.unbind()
    }

    public unbind() {
        this.texture.unbind()
        this.shader.unbind()
        this.buffer.unbind()
    }

    public bind() {
        this.texture.bind(this.textureUnit)
        this.shader.bind()
        this.buffer.bind()
    }

    private white = Color.fromHex(0xffffff)
    public onDraw() {
        const gl = this.gl
        this.shader.sampler2D = this.textureUnit
        this.shader.orth = Coordinate.orthographicProjectionMatrix4
        this.shader.transform = this.matrixArray
        this.white.alpha = this.appliedTransform.alpha
        this.shader.color = this.white
        this.shader.use()
        gl.drawArrays(gl.TRIANGLES, 0, 6)
    }

    public dispose() {
        this.texture.dispose()
        this.buffer.dispose()
    }

}