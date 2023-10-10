import {Color} from "../base/Color";
import Coordinate from "../base/Coordinate";
import {BaseDrawableConfig, Drawable} from "./Drawable";
import ShaderManager from "../util/ShaderManager";
import {Shape2D} from "../util/Shape2D";
import {Shader} from "../core/Shader";
import {VertexArray} from "../core/VertexArray";
import {VertexBuffer} from "../core/VertexBuffer";
import {VertexBufferLayout} from "../core/VertexBufferLayout";

export interface ColorDrawableConfig extends BaseDrawableConfig {
    color: Color
}

export class ColorDrawable extends Drawable<ColorDrawableConfig> {

    private readonly shader: Shader
    private readonly buffer: VertexBuffer    
    private readonly layout: VertexBufferLayout
    private readonly vertexArray: VertexArray
    private needUpdateVertex = true

    constructor(
        gl: WebGL2RenderingContext,
        config: ColorDrawableConfig
    ) {
        super(gl, config)
        const vertexArray = new VertexArray(gl)
        vertexArray.bind()
        const buffer = new VertexBuffer(gl)
        const shader = ShaderManager.newColoredShader()
        const layout = new VertexBufferLayout(gl)

        buffer.bind()
        shader.bind()

        layout.pushFloat(shader.getAttributeLocation('a_position'), 2)
        layout.pushFloat(shader.getAttributeLocation('a_color'), 4)
        vertexArray.addBuffer(buffer, layout)

        vertexArray.unbind()
        buffer.unbind()
        shader.unbind()

        this.vertexArray = vertexArray
        this.buffer = buffer;
        this.layout = layout
        this.shader = shader

    }

    public createVertexArray() {
        const width = this.width
        const height= this.height
        const { x, y } = this.position
        const vertexData: number[] = []
        Shape2D.quad(
            x, y, 
            x + width, y - height,
            vertexData, 0, 6
        )

        Shape2D.oneColor(this.config.color, vertexData, 2, 6)
        return new Float32Array(vertexData)
    }

    public onWindowResize(): void {
        super.onWindowResize()
        this.needUpdateVertex = true
    }

    public unbind() {
        this.vertexArray.unbind()
        this.buffer.unbind()
        this.shader.unbind()
    }

    public bind() {
        this.vertexArray.bind()
        this.buffer.bind()
        this.shader.bind()
    }

    public onDraw() {
        const gl = this.gl
        if (this.needUpdateVertex) {
            this.needUpdateVertex = false
            this.buffer.setBufferData(this.createVertexArray())
        }
        const shader = this.shader
        shader.setUniformMatrix4fv('u_transform', this.matrixArray)
        shader.setUniformMatrix4fv('u_orth', Coordinate.orthographicProjectionMatrix4)
        shader.setUniform1f('u_alpha', this.appliedTransform.alpha)
        this.vertexArray.addBuffer(this.buffer, this.layout)
        gl.drawArrays(gl.TRIANGLES, 0, 6)
    }

    public dispose() {
        this.vertexArray.dispose()
        this.shader.dispose()
        this.buffer.dispose()
    }



}