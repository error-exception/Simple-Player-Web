import Coordinate from "../../base/Coordinate";
import {BaseDrawableConfig, Drawable} from "../../drawable/Drawable";
import {Shape2D} from "../../util/Shape2D";
import {Shader} from "../../core/Shader";
import {Texture} from "../../core/Texture";
import {Vector2} from "../../core/Vector2";
import {VertexArray} from "../../core/VertexArray";
import {VertexBuffer} from "../../core/VertexBuffer";
import {VertexBufferLayout} from "../../core/VertexBufferLayout";
import {
    ATTR_POSITION,
    ATTR_TEXCOORD,
    UNI_ALPHA,
    UNI_ORTH,
    UNI_SAMPLER,
    UNI_TRANSFORM
} from "../../shader/ShaderConstant";
import StaticTextureShader from "../../shader/StaticTextureShader";
import {Images} from "../../util/ImageResource";

export class Logo extends Drawable {

    private readonly shader: Shader
    private readonly buffer: VertexBuffer
    private readonly texture: Texture
    private readonly layout: VertexBufferLayout
    private readonly vertexArray: VertexArray
    private readonly textureUnit = 0

    constructor(
        gl: WebGL2RenderingContext,
        config: BaseDrawableConfig
    ) {
        super(gl, config)
        
        const vertexArray = new VertexArray(gl)
        vertexArray.bind()
        const buffer = new VertexBuffer(gl)
        const shader = StaticTextureShader.getShader(gl)
        const layout = new VertexBufferLayout(gl)
        const texture = new Texture(gl, Images.Logo)

        buffer.bind()
        shader.bind()

        layout.pushFloat(shader.getAttributeLocation(ATTR_POSITION), 2)
        layout.pushFloat(shader.getAttributeLocation(ATTR_TEXCOORD), 2)
        vertexArray.addBuffer(buffer, layout)

        vertexArray.unbind()
        buffer.unbind()
        shader.unbind()

        this.vertexArray = vertexArray
        this.buffer = buffer;
        this.layout = layout
        this.shader = shader
        this.texture = texture
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
        console.log(vertexData);
        
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
        this.vertexArray.unbind()
        this.texture.unbind()
        this.shader.unbind()
    }

    public bind() {
        this.texture.bind(this.textureUnit)
        this.vertexArray.bind()
        this.shader.bind()
    }

    public onDraw() {
        const gl = this.gl
        this.shader.setUniform1i(UNI_SAMPLER, this.textureUnit)

        this.shader.setUniformMatrix4fv(UNI_ORTH, Coordinate.orthographicProjectionMatrix4)
        this.shader.setUniformMatrix4fv(UNI_TRANSFORM, this.matrixArray)
        this.shader.setUniform1f(UNI_ALPHA, this.appliedTransform.alpha)
        this.vertexArray.addBuffer(this.buffer, this.layout)
        gl.drawArrays(gl.TRIANGLES, 0, 6)
    }

    public dispose() {
        this.texture.dispose()
        this.vertexArray.dispose()
        StaticTextureShader.dispose()
        this.buffer.dispose()
    }

}