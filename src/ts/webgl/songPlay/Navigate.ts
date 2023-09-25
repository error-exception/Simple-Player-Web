import {Drawable} from "../Drawable";
import {VertexArray} from "../core/VertexArray";
import {VertexBuffer} from "../core/VertexBuffer";
import {Shader} from "../core/Shader";
import {VertexBufferLayout} from "../core/VertexBufferLayout";
import {int} from "../../Utils";
import {Shape2D} from "../Shape2D";
import Coordinate from "../Coordinate";


const vertexShader = `
    attribute vec2 a_position;
    attribute vec4 a_color;
//    attribute vec2 a_tex_coord;
    
//    varying mediump vec2 v_tex_coord;
    varying mediump vec4 v_color;
    
//    uniform mat4 u_transform;
    
    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
//        v_tex_coord = a_tex_coord;
        v_color = a_color;
    }
`

const fragmentShader = `
//    varying mediump vec2 v_tex_coord;
//    uniform sampler2D u_sampler;
    varying mediump vec4 v_color;
    void main() {
//        mediump vec4 texelColor = texture2D(u_sampler, v_tex_coord);
//        gl_FragColor = texelColor;
//         gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        gl_FragColor = v_color;
    }
`

export class Navigate extends Drawable {

    private readonly vertexArray: VertexArray
    private readonly vertexBuffer: VertexBuffer
    private readonly shader: Shader
    private readonly layout: VertexBufferLayout


    constructor(gl: WebGL2RenderingContext) {
        super(gl, {
            width: '100w', height: '100h', vertical: "center", horizontal: "center"
        });
        const vertexArray = new VertexArray(gl)
        vertexArray.bind()
        const vertexBuffer = new VertexBuffer(gl, null, gl.STREAM_DRAW)
        const layout = new VertexBufferLayout(gl)
        const shader = new Shader(gl, vertexShader, fragmentShader)

        vertexBuffer.bind()
        shader.bind()

        layout.pushFloat(shader.getAttributeLocation("a_position"), 2)
        layout.pushFloat(shader.getAttributeLocation("a_color"), 4)
        vertexArray.addBuffer(vertexBuffer, layout)

        vertexArray.unbind()
        vertexBuffer.unbind()
        shader.unbind()

        this.vertexBuffer = vertexBuffer
        this.layout = layout
        this.shader = shader
        this.vertexArray = vertexArray
    }

    private vertexData = new Float32Array()
    private vertexArrayData: number[] = []
    private vertexCount = 0

    public bind() {
        this.vertexArray.bind()
        this.vertexBuffer.bind()
        this.shader.bind()
    }

    protected onUpdate() {
        super.onUpdate()
        this.vertexArrayData = []

        let offset = 0
        offset += this.topBar(offset)
        this.bottomBar(offset)

        this.vertexData = new Float32Array(this.vertexArrayData)
        this.vertexCount = int(this.vertexArrayData.length / 6)
    }

    private topBar(offset: number) {
        Shape2D.quad(
            -1, 1,
            1, 1 - Coordinate.glYLength(100),
            this.vertexArrayData,
            offset,
            6
        )
        Shape2D.color(
            0, 0, 0, 1,
            0, 0, 0, 1,
            0, 0, 0, 1,
            0, 0, 0, 1,
            this.vertexArrayData,
            offset + 2,
            6
        )
        offset += 36
        Shape2D.quad(
            -1, 1 - Coordinate.glYLength(100),
            1, 1 - Coordinate.glYLength(100 + 2),
            this.vertexArrayData,
            offset,
            6
        )
        Shape2D.color(
            0, 1, 0, 1,
            0, 1, 0, 1,
            0, 1, 0, 1,
            0, 1, 0, 1,
            this.vertexArrayData,
            offset + 2,
            6
        )
        return offset + 36
    }

    private bottomBar(offset: number) {
        Shape2D.quad(
            -1, -1 + Coordinate.glYLength(100),
            1, -1,
            this.vertexArrayData,
            offset,
            6
        )
        Shape2D.color(
            0, 0, 0, 1,
            0, 0, 0, 1,
            0, 0, 0, 1,
            0, 0, 0, 1,
            this.vertexArrayData,
            offset + 2,
            6
        )
        offset += 36
        Shape2D.quad(
            -1, -1 + Coordinate.glYLength(100 + 2),
            1, -1 + Coordinate.glYLength(100),
            this.vertexArrayData,
            offset,
            6
        )
        Shape2D.color(
            0, 1, 0, 1,
            0, 1, 0, 1,
            0, 1, 0, 1,
            0, 1, 0, 1,
            this.vertexArrayData,
            offset + 2,
            6
        )
        return offset + 36
    }

    public unbind() {
        this.shader.unbind()
        this.vertexBuffer.unbind()
        this.vertexArray.unbind()
    }

    public onDraw() {
        const gl = this.gl
        this.vertexBuffer.setBufferData(this.vertexData)
        this.vertexArray.addBuffer(this.vertexBuffer, this.layout)
        gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount)
    }

    public dispose() {
        super.dispose();
        this.shader.dispose()
        this.vertexArray.dispose()
        this.vertexBuffer.dispose()

    }

}