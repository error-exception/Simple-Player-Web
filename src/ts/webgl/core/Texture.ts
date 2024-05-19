import {Disposable} from "./Disposable";
import {Bindable} from "./Bindable";

export const ImageFormat = {
    PNG: 1,
    JPEG: 2
}

export class Texture implements Disposable, Bindable {
    private static blankData = new Uint8Array([0, 0, 0, 0]);
    private readonly rendererId: WebGLTexture;
    public imageWidth: number = 0;
    public imageHeight: number = 0;

    public static NULL = Symbol()

    constructor(
        private gl: WebGL2RenderingContext,
        image: HTMLImageElement | HTMLVideoElement | null = null,
        format: number = ImageFormat.PNG
    ) {
        const texture = gl.createTexture();
        if (!texture) {
            throw new Error("create texture error");
        }
        this.rendererId = texture;
        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            1,
            1,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            Texture.blankData
        );
        gl.bindTexture(gl.TEXTURE_2D, null);
        if (image !== null) {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            this.imageWidth = image.width;
            this.imageHeight = image.height;
            const glFormat = this.getFormat(format)
            gl.texImage2D(
                gl.TEXTURE_2D,
                0,
                glFormat,
                image.width,
                image.height,
                0,
                glFormat,
                gl.UNSIGNED_BYTE,
                image
            );
            gl.bindTexture(gl.TEXTURE_2D, null);
        }
    }

    public texImage2D(image: ImageBitmap, format: number = ImageFormat.PNG) {
        const gl = this.gl;
        this.imageWidth = image.width;
        this.imageHeight = image.height;
        const glFormat = this.getFormat(format)
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            glFormat,
            image.width,
            image.height,
            0,
            glFormat,
            gl.UNSIGNED_BYTE,
            image
        );
    }

    private getFormat(imageFormat: number = ImageFormat.PNG) {
        if (imageFormat === ImageFormat.JPEG) {
            return this.gl.RGB
        }
        return this.gl.RGBA
    }

    public setTextureImage(image: ImageBitmap, format: number = ImageFormat.PNG) {
        const gl = this.gl;
        gl.bindTexture(gl.TEXTURE_2D, this.rendererId);
        this.texImage2D(image)
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    public setTextureVideo(video: HTMLVideoElement) {
        const gl = this.gl;
        gl.bindTexture(gl.TEXTURE_2D, this.rendererId);
        this.imageWidth = video.width;
        this.imageHeight = video.height;
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            video
        );
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    public bind(slot: GLenum = 0) {
        const gl = this.gl;
        gl.activeTexture(gl.TEXTURE0 + slot);
        gl.bindTexture(gl.TEXTURE_2D, this.rendererId);
    }

    public unbind() {
        const gl = this.gl;
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    public dispose() {
        this.gl.deleteTexture(this.rendererId);
    }
}