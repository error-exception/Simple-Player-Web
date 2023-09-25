import { Color } from "./Color";
import Coordinate from "./Coordinate";
import { BaseDrawableConfig, Drawable } from "./Drawable";
import ShaderManager from "./ShaderManager";
import { Shape2D } from "./Shape2D";
import { Shader } from "./core/Shader";
import { Texture } from "./core/Texture";
import { VertexArray } from "./core/VertexArray";
import { VertexBuffer } from "./core/VertexBuffer";
import { VertexBufferLayout } from "./core/VertexBufferLayout";

export interface ColorDrawableConfig extends BaseDrawableConfig {
    color: Color
}

export class ColorDrawable extends Drawable {

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
        const shader = ShaderManager.newColoredShader()//new Shader(gl, vertexShader, fragmentShader)
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
        // this.position.y -= height * 0.007
        const { x, y } = this.position
        // const x = Coordinate.worldX(this.getLeft());
        // const y = Coordinate.worldY(this.getTop());
        const vertexData: number[] = []
        Shape2D.quad(
            x, y, 
            x + width, y - height,
            vertexData, 0, 6
        )
        //@ts-ignore
        Shape2D.oneColor(this.config.color, vertexData, 2, 6)
        // const vertex = [
        //     new Vector2(x,         y),
        //     new Vector2(x + width, y),
        //     new Vector2(x,         y - height),
        //     new Vector2(x + width, y),
        //     new Vector2(x,         y - height),
        //     new Vector2(x + width, y - height)
        // ]

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
        this.shader.setUniformMatrix4fv('u_transform', this.matrixArray)
        this.shader.setUniformMatrix4fv('u_orth', Coordinate.orthographicProjectionMatrix4)
        this.vertexArray.addBuffer(this.buffer, this.layout)
        gl.drawArrays(gl.TRIANGLES, 0, 6)
    }

    public dispose() {
        this.vertexArray.dispose()
        this.shader.dispose()
        this.buffer.dispose()
    }



}