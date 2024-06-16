import Coordinate from "../../base/Coordinate";
import {Drawable} from "../../drawable/Drawable";
import {Texture} from "../../core/Texture";
import {Vector} from "../../core/Vector2";
import {TextureStore} from "../../texture/TextureStore";
import {Color} from "../../base/Color";
import type {DrawNode} from "../../drawable/DrawNode";
import type {DefaultShaderWrapper} from "../../shader/DefaultShaderWrapper";
import {Size} from "../../drawable/Size";

export class VideoBackground extends Drawable {

    private readonly texture: Texture;

    constructor(
        private video: HTMLVideoElement | null
    ) {
        super({
            size: Size.FillParentSize
        });
        this.texture = TextureStore.create();
        this.setColor(Color.White)
    }

    private videoSize = Vector()
    public setVideo(video: HTMLVideoElement) {
        this.video = video
        this.videoSize.set(video.videoWidth, video.videoHeight)
        // this.isVertexUpdate = true
    }

    public onUpdate(): void {
        if (this.video) {
            this.texture.setTextureVideo(this.video)
        }
    }

    public beforeCommit(node: DrawNode) {
        const shader = node.shader as DefaultShaderWrapper
        shader.orth = Coordinate.orthographicProjectionMatrix4
        shader.color = this.computeColor()
        shader.sampler2D = 0
    }

    public onDraw(node: DrawNode) {
        const topLeft = this.initRectangle.topLeft.copy()
        const bottomRight = this.initRectangle.bottomRight.copy()
        const videoSize = this.videoSize
        if (!videoSize.isZero()) {
            const targetWidth = (this.getHeight() * videoSize.x) / videoSize.y
            topLeft.set(
              (this.getWidth() - targetWidth) / 2,
              this.getPosition().y
            )
            bottomRight.set(
              topLeft.x + targetWidth,
              topLeft.y + this.getHeight()
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