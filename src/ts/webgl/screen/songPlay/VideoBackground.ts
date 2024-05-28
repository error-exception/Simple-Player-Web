import Coordinate from "../../base/Coordinate";
import {Drawable} from "../../drawable/Drawable";
import {Shape2D} from "../../util/Shape2D";
import {Texture} from "../../core/Texture";
import {Vector, Vector2} from "../../core/Vector2";
import {VertexBuffer} from "../../core/VertexBuffer";
import {UNI_COLOR, UNI_ORTH, UNI_SAMPLER, UNI_TRANSFORM} from "../../shader/ShaderConstant";
import {Shaders} from "../../shader/Shaders";
import type {ShaderWrapper} from "../../shader/ShaderWrapper";

export class VideoBackground extends Drawable {
    private readonly shader: ShaderWrapper;
    private readonly buffer: VertexBuffer;
    private readonly texture: Texture;
    // private readonly layout: VertexBufferLayout;
    // private readonly vertexArray: VertexArray;
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
        this.buffer = new VertexBuffer(gl);
        this.shader = Shaders.Default;
        this.texture = new Texture(gl, video);
    }

    private videoSize = Vector()
    public setVideo(video: HTMLVideoElement) {
        this.video = video
        this.videoSize.set(video.videoWidth, video.videoHeight)
        this.isVertexUpdate = true
    }

    public createVertexArray() {
        const width = this.width;
        const height = this.height;
        const { x, y } = this.position;
        const topLeft = new Vector2(x, y)
        const bottomRight = new Vector2(x + width, y - height)
        const videoSize = this.videoSize
        if (!videoSize.isZero()) {
            const targetWidth = (height * videoSize.x) / videoSize.y
            topLeft.set(
              -targetWidth / 2,
              y
            )
            bottomRight.set(
              topLeft.x + targetWidth,
              topLeft.y - height
            )
        }
        const vertexData: number[] = []
        Shape2D.quadVector2(
            topLeft, bottomRight,
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
        // this.vertexArray.unbind();
        this.buffer.unbind();
        this.texture.unbind();
        this.shader.unbind();
    }

    public bind() {
        this.texture.bind(this.textureUnit);
        // this.vertexArray.bind();
        this.buffer.bind();
        this.shader.bind();
    }

    private white = new Float32Array([1, 1, 1, 1])
    public onDraw() {
        const gl = this.gl;
        if (this.isVertexUpdate) {
            this.buffer.setBufferData(this.createVertexArray());
            this.isVertexUpdate = false;
        }
        const shader = this.shader.shader
        shader.setUniform1i(UNI_SAMPLER, this.textureUnit);
        shader.setUniformMatrix4fv(UNI_TRANSFORM, this.matrixArray);
        shader.setUniformMatrix4fv(UNI_ORTH, Coordinate.orthographicProjectionMatrix4);
        this.white[3] = this.alpha
        shader.setUniform4fv(UNI_COLOR, this.white);
        this.shader.use()
        // vertexArray.addBuffer(this.layout);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    public dispose() {
        super.dispose()
        this.texture.dispose();
        // this.vertexArray.dispose();
        // this.shader.dispose()
        this.buffer.dispose();
    }
}