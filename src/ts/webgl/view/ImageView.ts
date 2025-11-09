import type { Nullable } from "../../type";
import { color } from "../base/Color";
import { Canvas } from "../canvas/Canvas";
import { Blend } from "../drawable/Blend";
import { Invalidation, InvalidationSource } from "../drawable/Invalidation";
import type { Texture } from "../graphic/core/Texture";
import type { TextureRegin } from "../graphic/texture/TextureAtlas";
import { TextureStore } from "../graphic/texture/TextureStore";
import { LayoutMember } from "../layout/LayoutValue";
import { View } from "./View";

export type ImageObjectFit = "contains" | "cover" | "fill"

interface ImageRectangle {
  x: number
  y: number
  width: number
  height: number
}

export class ImageView extends View {

  public texture: Nullable<Texture> = null
  public imageObjectFitMember = new LayoutMember(Invalidation.Draw | Invalidation.Size)

  public set image(imageBitmap: ImageBitmap) {
    if (this.texture) {
      this.texture.setTextureImage(imageBitmap)
    } else {
      this.texture = TextureStore.create(imageBitmap)
    }
    this.invalidate(Invalidation.Draw, InvalidationSource.Self)
  }

  public textureRegin: Nullable<TextureRegin> = null

  private imageRectangle: ImageRectangle = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  }

  private _objectFit: ImageObjectFit = "contains"

  public set objectFit(objectFit: ImageObjectFit) {
    this._objectFit = objectFit
    this.invalidate(Invalidation.Draw, InvalidationSource.Self)
  }

  public get objectFit(): ImageObjectFit {
    return this._objectFit
  }

  public blend: Blend = Blend.Normal

  constructor() {
    super()
    this.layoutList.push(this.imageObjectFitMember)
    this.color = color.White
  }

  public onUpdate() {
    super.onUpdate();
    if (!this.imageObjectFitMember.isValid()) {
      this.computeImageRectangle();
      this.imageObjectFitMember.validate();
    }
  }

  private computeImageRectangle() {
    if (!this.texture && !this.textureRegin) {
      this.imageRectangle = { x: 0, y: 0, width: 0, height: 0 };
      return;
    }

    const containerWidth = this.width;
    const containerHeight = this.height;
    let imageWidth = 0, imageHeight = 0;
    if (this.texture) {
      imageWidth = this.texture.imageWidth
      imageHeight = this.texture.imageHeight
    } else if (this.textureRegin) {
      imageWidth = this.textureRegin.size[0]
      imageHeight = this.textureRegin.size[1]
    } else {
      return
    }

    switch (this._objectFit) {
      case "fill":
        this.imageRectangle = {
          x: 0,
          y: 0,
          width: containerWidth,
          height: containerHeight
        };
        break;

      case "contains":
        const containScale = Math.min(
          containerWidth / imageWidth,
          containerHeight / imageHeight
        );
        const containWidth = imageWidth * containScale;
        const containHeight = imageHeight * containScale;
        this.imageRectangle = {
          x: (containerWidth - containWidth) / 2,
          y: (containerHeight - containHeight) / 2,
          width: containWidth,
          height: containHeight
        };
        break;

      case "cover":
        const coverScale = Math.max(
          containerWidth / imageWidth,
          containerHeight / imageHeight
        );
        const coverWidth = imageWidth * coverScale;
        const coverHeight = imageHeight * coverScale;
        this.imageRectangle = {
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
    if (!this.texture && !this.textureRegin) {
      return
    }
    const texture = this.texture
    if (texture !== null) {
      canvas.setBlend(this.blend)
      canvas.drawTexture(
        texture,
        this.imageRectangle.x,
        this.imageRectangle.y,
        this.imageRectangle.width,
        this.imageRectangle.height,
      )
    } else if (this.textureRegin !== null) {
      canvas.setBlend(this.blend)
      canvas.drawTextureAtlas(
        this.textureRegin,
        this.imageRectangle.x,
        this.imageRectangle.y,
        this.imageRectangle.width,
        this.imageRectangle.height,
      )
    }
  }

}
