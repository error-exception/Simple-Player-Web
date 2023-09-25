import Coordinate from "./Coordinate";
import { Drawable } from "./Drawable";
import ShaderManager from "./ShaderManager";
import { Shape2D } from "./Shape2D";
import { Viewport } from "./Viewport";
import { Shader } from "./core/Shader";
import { Texture } from "./core/Texture";
import { TransformUtils } from "./core/TransformUtils";
import { Vector2 } from "./core/Vector2";
import { VertexArray } from './core/VertexArray';
import { VertexBuffer } from "./core/VertexBuffer";
import { VertexBufferLayout } from "./core/VertexBufferLayout";

export class VideoBackground extends Drawable {
    private readonly shader: Shader;
    private readonly buffer: VertexBuffer;
    private readonly texture: Texture;
    private readonly layout: VertexBufferLayout;
    private readonly vertexArray: VertexArray;
    private textureUnit = 4;
    private isVertexUpdate = true;

    constructor(
        gl: WebGL2RenderingContext,
        private video: HTMLVideoElement | null
    ) {
        super(gl, {
            size: ['fill-parent', 'fill-parent']
        });
        this.textureUnit = 0;
        const vertexArray = new VertexArray(gl);
        vertexArray.bind();
        const buffer = new VertexBuffer(gl);
        const shader = ShaderManager.newTextureShader()
        const layout = new VertexBufferLayout(gl);
        const texture = new Texture(gl, video);

        buffer.bind();
        shader.bind();

        shader.setUniform1i("u_sampler", this.textureUnit);
        layout.pushFloat(shader.getAttributeLocation("a_position"), 2);
        layout.pushFloat(shader.getAttributeLocation("a_tex_coord"), 2);
        vertexArray.addBuffer(buffer, layout);

        vertexArray.unbind();
        buffer.unbind();
        shader.unbind();

        this.vertexArray = vertexArray;
        this.buffer = buffer;
        this.layout = layout;
        this.shader = shader;
        this.texture = texture;
    }

    public setVideo(video: HTMLVideoElement) {
        this.video = video
    }

    public createVertexArray() {
        const width = this.width;
        const height = this.height;
        // this.position.y -= height * 0.007
        const { x, y } = this.position;
        const topLeft = new Vector2(x, y)
        const bottomRight = new Vector2(x + width, y - height)
        // const vertex = [
        //     new Vector2(x, y),
        //     new Vector2(x + width, y),
        //     new Vector2(x, y - height),
        //     new Vector2(x + width, y),
        //     new Vector2(x, y - height),
        //     new Vector2(),
        // ];
        const vertexData: number[] = []
        Shape2D.quad(
            topLeft.x, topLeft.y, 
            bottomRight.x, bottomRight.y, 
            vertexData, 0, 4
        )
        Shape2D.quad(
            0, 0, 
            1, 1,
            vertexData, 2, 4
        )
        return new Float32Array(vertexData);
    }

    public onWindowResize() {
        super.onWindowResize();
        this.isVertexUpdate = true;
    }

    protected onUpdate(): void {
        if (this.video) {
            this.texture.setTextureVideo(this.video)
        }
    }

    public unbind() {
        this.vertexArray.unbind();
        this.buffer.unbind();
        this.texture.unbind();
        this.shader.unbind();
    }

    public bind() {
        this.texture.bind(this.textureUnit);
        this.vertexArray.bind();
        this.buffer.bind();
        this.shader.bind();
    }

    public onDraw() {
        const gl = this.gl;
        if (this.isVertexUpdate) {
            this.buffer.setBufferData(this.createVertexArray());
            this.isVertexUpdate = false;
        }
        this.shader.setUniformMatrix4fv("u_transform", this.matrixArray);
        this.shader.setUniformMatrix4fv("u_orth", Coordinate.orthographicProjectionMatrix4);
        this.shader.setUniform1f("u_alpha", this.alpha);
        this.vertexArray.addBuffer(this.buffer, this.layout);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    public dispose() {
        this.texture.dispose();
        this.vertexArray.dispose();
        this.shader.dispose();
        this.buffer.dispose();
    }
}