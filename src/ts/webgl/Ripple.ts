import {Viewport} from "./Viewport";
import {BaseDrawableConfig, Drawable} from "./Drawable";
import {VertexArray} from "./core/VertexArray";
import {VertexBuffer} from "./core/VertexBuffer";
import {Texture} from "./core/Texture";
import {Shader} from "./core/Shader";
import {VertexBufferLayout} from "./core/VertexBufferLayout";
import {Vector2} from "./core/Vector2";
import {TransformUtils} from "./core/TransformUtils";
import {ImageLoader} from "../ImageResources";
import Coordinate from "./Coordinate";
import { Shape2D } from "./Shape2D";
import ShaderManager from "./ShaderManager";

const vertexShader = `
    attribute vec2 a_position;
    attribute vec2 a_tex_coord;
    uniform mat4 u_transform;
    varying mediump vec2 v_tex_coord;
    
    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0) * u_transform;
        v_tex_coord = a_tex_coord;
    }
`

const fragmentShader = `
    varying mediump vec2 v_tex_coord;
    uniform sampler2D u_sampler;
    uniform mediump float alpha;
    void main() {
        mediump vec4 texelColor = texture2D(u_sampler, v_tex_coord);
        texelColor.a = alpha * texelColor.a;
        gl_FragColor = texelColor;
    }
`

export class Ripple extends Drawable {

    private readonly vertexArray: VertexArray
    private readonly buffer: VertexBuffer
    private readonly texture: Texture
    private readonly shader: Shader
    private readonly layout: VertexBufferLayout
    private readonly textureUnit: number = 1

    constructor(
        gl: WebGL2RenderingContext,
        config: BaseDrawableConfig
    ) {
        super(gl, config)
        const vertexArray = new VertexArray(gl)
        vertexArray.bind()
        const buffer = new VertexBuffer(gl)
        const layout = new VertexBufferLayout(gl)
        const shader = ShaderManager.newTextureShader()
        const texture = new Texture(gl, ImageLoader.get("ripple"))

        buffer.bind()
        shader.bind()
        shader.setUniform1i('u_sampler', this.textureUnit)
        layout.pushFloat(shader.getAttributeLocation("a_position"), 2)
        layout.pushFloat(shader.getAttributeLocation("a_tex_coord"), 2)
        vertexArray.addBuffer(buffer, layout)

        vertexArray.unbind()
        buffer.unbind()
        shader.unbind()

        this.vertexArray = vertexArray
        this.buffer = buffer
        this.texture = texture
        this.layout = layout
        this.shader = shader

    }

    public set alpha(v: number) {
        super.alpha = v;
    }

    public get alpha(): number {
        return super.alpha;
    }

    public createVertexArray() {
        const width = this.width
        const height = this.height
        let { x, y } = this.position
        y -= height * 0.007
        // let x = -width / 2, y = height / 2
        console.log("create vertex", x, y)
        
        const topLeft = new Vector2(x, y)
        const bottomRight = new Vector2(x + width, y - height)
        // TransformUtils.applyOrigin(topLeft, Coordinate.orthographicProjection)
        // TransformUtils.applyOrigin(bottomRight, Coordinate.orthographicProjection)
        const vertexData: number[] = []
        Shape2D.quad(
            topLeft.x, topLeft.y,
            bottomRight.x, bottomRight.y,
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
        super.onLoad()
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

    public bind() {
        this.vertexArray.bind()
        this.texture.bind(this.textureUnit)
        this.shader.bind()
    }

    public unbind() {
        this.vertexArray.unbind()
        this.texture.unbind()
        this.shader.unbind()
    }

    public onDraw() {
        const gl = this.gl
        const shader = this.shader
        shader.setUniform1f('u_alpha', this.alpha)
        shader.setUniformMatrix4fv('u_transform', this.matrixArray)
        shader.setUniformMatrix4fv('u_orth', Coordinate.orthographicProjectionMatrix4)

        this.vertexArray.addBuffer(this.buffer, this.layout)
        gl.drawArrays(gl.TRIANGLES, 0, 6)
    }

    public dispose() {
        this.texture.dispose()
        this.vertexArray.dispose()
        this.shader.dispose()
        this.buffer.dispose()
    }

}