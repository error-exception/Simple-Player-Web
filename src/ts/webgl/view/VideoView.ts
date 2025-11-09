import type { Nullable } from "../../type";
import { color } from "../base/Color";
import { Canvas } from "../canvas/Canvas";
import { Blend } from "../drawable/Blend";
import { Invalidation, InvalidationSource } from "../drawable/Invalidation";
import type { Texture } from "../graphic/core/Texture";
import { TextureStore } from "../graphic/texture/TextureStore";
import { LayoutMember } from "../layout/LayoutValue";
import { View } from "./View";

export type VideoObjectFit = "contains" | "cover" | "fill"

interface VideoRectangle {
  x: number
  y: number
  width: number
  height: number
}

export class VideoView extends View {

  private texture: Texture = TextureStore.create()
  public videoObjectFitMember = new LayoutMember(Invalidation.Draw | Invalidation.Size)

  private _video: Nullable<HTMLVideoElement> = null

  public set video(video: HTMLVideoElement) {    
    this._video = video
    this.invalidate(Invalidation.Draw, InvalidationSource.Self)
  }

  private videoRectangle: VideoRectangle = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  }

  private _objectFit: VideoObjectFit = "contains"

  public set objectFit(objectFit: VideoObjectFit) {
    this._objectFit = objectFit
    this.invalidate(Invalidation.Draw, InvalidationSource.Self)
  }

  public get objectFit(): VideoObjectFit {
    return this._objectFit
  }

  public blend: Blend = Blend.Normal

  constructor() {
    super()
    this.layoutList.push(this.videoObjectFitMember)
    this.color = color.White
  }

  public onUpdate() {
    super.onUpdate();
    if (this._video && this._video.readyState === this._video.HAVE_ENOUGH_DATA) {
      this.texture.setTextureVideo(this._video)
    }
    if (!this.videoObjectFitMember.isValid()) {
      this.computeVideoRectangle();
      this.videoObjectFitMember.validate();
    }
  }

  private computeVideoRectangle() {
    if (!this.texture || this._video === null) {
      this.videoRectangle = { x: 0, y: 0, width: 0, height: 0 };
      return;
    }

    const containerWidth = this.width;
    const containerHeight = this.height;
    let videoWidth = 0, videoHeight = 0;

    
    videoWidth = this.texture.imageWidth
    videoHeight = this.texture.imageHeight

    switch (this._objectFit) {
      case "fill":
        this.videoRectangle = {
          x: 0,
          y: 0,
          width: containerWidth,
          height: containerHeight
        };
        break;

      case "contains":
        const containScale = Math.min(
          containerWidth / videoWidth,
          containerHeight / videoHeight
        );
        const containWidth = videoWidth * containScale;
        const containHeight = videoHeight * containScale;
        this.videoRectangle = {
          x: (containerWidth - containWidth) / 2,
          y: (containerHeight - containHeight) / 2,
          width: containWidth,
          height: containHeight
        };
        break;

      case "cover":
        const coverScale = Math.max(
          containerWidth / videoWidth,
          containerHeight / videoHeight
        );
        const coverWidth = videoWidth * coverScale;
        const coverHeight = videoHeight * coverScale;
        this.videoRectangle = {
          x: (containerWidth - coverWidth) / 2,
          y: (containerHeight - coverHeight) / 2,
          width: coverWidth,
          height: coverHeight
        };
        break;
    }
  }

  public onDraw(canvas: Canvas) {
    super.onDraw(canvas);
    if (!this.texture) {
      return
    }
    const texture = this.texture
    canvas.setBlend(this.blend)
    if (texture !== null) {
      canvas.setBlend(this.blend)
      canvas.drawTexture(
        texture,
        this.videoRectangle.x,
        this.videoRectangle.y,
        this.videoRectangle.width,
        this.videoRectangle.height,
      )
    }
  }

}
