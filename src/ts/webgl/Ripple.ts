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

interface RippleConfig extends BaseDrawableConfig {}

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
        config: RippleConfig
    ) {
        super(gl, config)
        const vertexArray = new VertexArray(gl)
        vertexArray.bind()
        const buffer = new VertexBuffer(gl)
        const layout = new VertexBufferLayout(gl)
        const shader = new Shader(gl, vertexShader, fragmentShader)
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
        const { x, y } = this.rawPosition
        const width = this.rawSize.x
        const height= this.rawSize.y
        const vertex = [
            new Vector2(x,         y),
            new Vector2(x + width, y),
            new Vector2(x,         y - height),
            new Vector2(x + width, y),
            new Vector2(x,         y - height),
            new Vector2(x + width, y - height)
        ]
        for (let i = 0; i < vertex.length; i++) {
            TransformUtils.applyOrigin(vertex[i], this.coordinateScale)
        }
        return new Float32Array([
            vertex[0].x, vertex[0].y, 0.0, 0.0,
            vertex[1].x, vertex[1].y, 1.0, 0.0,
            vertex[2].x, vertex[2].y, 0.0, 1.0,
            vertex[3].x, vertex[3].y, 1.0, 0.0,
            vertex[4].x, vertex[4].y, 0.0, 1.0,
            vertex[5].x, vertex[5].y, 1.0, 1.0
        ])
    }

    public setViewport(viewport: Viewport) {
        super.setViewport(viewport)

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

        this.shader.setUniform1f('alpha', this._alpha)
        this.shader.setUniformMatrix4fv('u_transform', this.matrixArray)

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