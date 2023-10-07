import Coordinate from "../base/Coordinate";
import {BaseDrawableConfig, Drawable} from "./Drawable";
import ShaderManager from "../util/ShaderManager";
import {Shape2D} from "../util/Shape2D";
import {Shader} from "../core/Shader";
import {Texture} from "../core/Texture";
import {VertexArray} from "../core/VertexArray";
import {VertexBuffer} from "../core/VertexBuffer";
import {VertexBufferLayout} from "../core/VertexBufferLayout";

// const vertexShader = `
//     attribute vec2 a_position;
//     attribute vec2 a_tex_coord;
// //    attribute float a_tex_alpha;
//     varying mediump vec2 v_tex_coord;
// //    varying mediump float v_texture_alpha;
//     uniform mat4 u_transform;
//
//     void main() {
//         gl_Position = vec4(a_position, 0.0, 1.0) * u_transform;
//         v_tex_coord = a_tex_coord;
// //        v_texture_alpha = a_tex_alpha;
//     }
// `
//
// const fragmentShader = `
//     varying mediump vec2 v_tex_coord;
// //    varying mediump float v_texture_alpha;
//     uniform sampler2D u_sampler;
//     uniform mediump float u_alpha;
//     void main() {
//         mediump vec4 texelColor = texture2D(u_sampler, v_tex_coord);
//         // texelColor.rgb = min(texelColor.rgb + (v_highlight * 0.05), 1.0);
//         texelColor.a = texelColor.a * u_alpha;
//         gl_FragColor = texelColor;
//     }
// `

export class ImageDrawable extends Drawable {

    private readonly shader: Shader
    private readonly buffer: VertexBuffer
    private readonly texture: Texture
    private readonly layout: VertexBufferLayout
    private readonly vertexArray: VertexArray
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
        const vertexArray = new VertexArray(gl)
        vertexArray.bind()
        const buffer = new VertexBuffer(gl)
        const shader = ShaderManager.newTextureShader()//new Shader(gl, vertexShader, fragmentShader)
        const layout = new VertexBufferLayout(gl)
        const texture = new Texture(gl, image)

        buffer.bind()
        shader.bind()

        shader.setUniform1i('u_sampler', this.textureUnit)
        layout.pushFloat(shader.getAttributeLocation('a_position'), 2)
        layout.pushFloat(shader.getAttributeLocation('a_tex_coord'), 2)
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
        const height= this.height
        // this.position.y -= height * 0.007
        const { x, y } = this.position
        // const x = Coordinate.worldX(this.getLeft());
        // const y = Coordinate.worldY(this.getTop());
        const vertexData: number[] = []
        Shape2D.quad(
            x, y, 
            x + width, y - height,
            vertexData, 0, 4
        )
        Shape2D.quad(0, 0, 1, 1, vertexData, 2, 4)
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

    public onWindowResize() {
        super.onWindowResize()
        this.isVertexUpdate = true
        // this.buffer.bind()
        // this.buffer.unbind()

    }

    public unbind() {
        this.vertexArray.unbind()
        this.buffer.unbind()
        this.texture.unbind()
        this.shader.unbind()
    }

    public bind() {
        this.texture.bind(this.textureUnit)
        this.vertexArray.bind()
        this.buffer.bind()
        this.shader.bind()
    }

    public onDraw() {
        const gl = this.gl
        if (this.isVertexUpdate) {
            this.buffer.setBufferData(this.createVertexArray())
            this.isVertexUpdate = false
        }
        this.shader.setUniformMatrix4fv('u_transform', this.matrixArray)
        this.shader.setUniformMatrix4fv('u_orth', Coordinate.orthographicProjectionMatrix4)
        this.shader.setUniform1f('u_alpha', this.alpha)
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