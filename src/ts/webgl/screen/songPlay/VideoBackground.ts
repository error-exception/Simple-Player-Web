import Coordinate from "../../base/Coordinate";
import {Drawable} from "../../drawable/Drawable";
import {Texture} from "../../core/Texture";
import {Vector} from "../../core/Vector2";
import {TextureStore} from "../../texture/TextureStore";
import {Color} from "../../base/Color";
import type {DrawNode} from "../../drawable/DrawNode";
import type {DefaultShaderWrapper} from "../../shader/DefaultShaderWrapper";

export class VideoBackground extends Drawable {

    private readonly texture: Texture;

    constructor(
        private video: HTMLVideoElement | null
    ) {
        super({
            size: ['fill-parent', 'fill-parent']
        });
        this.texture = TextureStore.create();
    }

    private videoSize = Vector()
    public setVideo(video: HTMLVideoElement) {
        this.video = video
        this.videoSize.set(video.videoWidth, video.videoHeight)
        // this.isVertexUpdate = true
    }

    protected onUpdate(): void {
        if (this.video) {
            this.texture.setTextureVideo(this.video)
        }
    }

    private white = Color.White.copy()

    public beforeCommit(node: DrawNode) {
        const shader = node.shader as DefaultShaderWrapper
        shader.orth = Coordinate.orthographicProjectionMatrix4
        this.white.alpha = this.appliedTransform.alpha
        shader.color = this.white
        shader.sampler2D = 0
    }

    public onDraw(node: DrawNode) {
        const topLeft = this.position.copy()
        const bottomRight = this.position.add(this.size)
        const videoSize = this.videoSize
        if (!videoSize.isZero()) {
            const targetWidth = (this.height * videoSize.x) / videoSize.y
            topLeft.set(
              (this.width - targetWidth) / 2,
              this.position.y
            )
            bottomRight.set(
              topLeft.x + targetWidth,
              topLeft.y + this.height
            )
        }
        node.drawRect(topLeft, bottomRight)
        node.drawTexture(this.texture)
    }

    public dispose() {
        super.dispose()
        this.texture.dispose();
    }
}