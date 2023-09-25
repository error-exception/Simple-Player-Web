import { OSUStdNote, isStdCircle } from "../../OSUFile";
import Coordinate from "../Coordinate";
import { BaseDrawableConfig, Drawable } from "../Drawable";
import ShaderManager from "../ShaderManager";
import { Shape2D } from "../Shape2D";
import { Shader } from "../core/Shader";
import { VertexArray } from "../core/VertexArray";
import { VertexBuffer } from "../core/VertexBuffer";
import { VertexBufferLayout } from "../core/VertexBufferLayout";
import { StdNote } from "./StdNote";

const vertexShader = `
    attribute vec2 a_position;
    attribute vec4 a_color;
    attribute vec3 a_transform;

    varying mediump vec4 v_color;
    uniform mat4 u_orth;
    void main() {
        mat4 transform = mat4(
            a_transform.z, 0.0, 0.0, a_transform.x,
            0.0, a_transform.z, 0.0, a_transform.y,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0
        );
        v_color = a_color;
        vec4 position = vec4(a_position, 0.0, 1.0) * transform;
        gl_Position = position * u_orth;
    }
`

const fragmentShader = `
    varying mediump vec4 v_color;

    void main() {
        gl_FragColor = v_color;
    }
`

export interface StdPanelConfig extends BaseDrawableConfig {
    stdNotes: OSUStdNote[]
}


export class StdPanel extends Drawable {

    private readonly shader: Shader
    private readonly buffer: VertexBuffer    
    private readonly layout: VertexBufferLayout
    private readonly vertexArray: VertexArray
    private needUpdateVertex = true
    private vertex = new Float32Array()
    private noteList: StdNote[] = []

    constructor(
        gl: WebGL2RenderingContext,
        config: StdPanelConfig
    ) {
        super(gl, config)
        const vertexArray = new VertexArray(gl)
        vertexArray.bind()
        const buffer = new VertexBuffer(gl, null)
        const shader = new Shader(gl, vertexShader, fragmentShader)
        const layout = new VertexBufferLayout(gl)

        buffer.bind()
        shader.bind()

        layout.pushFloat(shader.getAttributeLocation('a_position'), 2)
        layout.pushFloat(shader.getAttributeLocation('a_color'), 4)
        layout.pushFloat(shader.getAttributeLocation('a_transform'), 3)
        vertexArray.addBuffer(buffer, layout)

        vertexArray.unbind()
        buffer.unbind()
        shader.unbind()

        this.vertexArray = vertexArray
        this.buffer = buffer;
        this.layout = layout
        this.shader = shader

        const notes = config.stdNotes
        for (let i = 0; i < notes.length; i++) {
            const note = notes[i]
            if (isStdCircle(note)) {
                this.noteList.push(new StdNote(note))
            }
        }

    }

    protected onUpdate(): void {
        super.onUpdate()
        // debugger
        const list = this.noteList
        let currentOffset = 0
        const data: number[] = []
        for (let i = 0; i < list.length; i++) {
            list[i].update()
            currentOffset += list[i].copyTo(data, currentOffset, 9)
        }
        this.vertex = new Float32Array(data)
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
        this.buffer.setBufferData(this.vertex)
        // this.shader.setUniformMatrix4fv('u_transform', this.matrixArray)
        this.shader.setUniformMatrix4fv('u_orth', Coordinate.orthographicProjectionMatrix4)
        this.vertexArray.addBuffer(this.buffer, this.layout)
        gl.drawArrays(gl.TRIANGLES, 0, this.vertex.length / 9)
    }

    public dispose() {
        this.vertexArray.dispose()
        this.shader.dispose()
        this.buffer.dispose()
    }


}