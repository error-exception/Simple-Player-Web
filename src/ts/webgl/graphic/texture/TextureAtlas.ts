import {Vector, Vector2} from "../core/Vector2";
import type {Nullable} from "../../../type";
import {Texture} from "../core/Texture";
import type {Disposable} from "../core/Disposable";
import { vector2 } from "../matrix/vec2";

export class TextureAtlas implements Disposable {

  public readonly texture: Texture
  public readonly textureReginList: TextureRegin[] = []

  constructor(gl: WebGL2RenderingContext, image: TexImageSource) {
    this.texture = new Texture(gl, image)
  }

  public addRegin(regin: TextureRegin) {
    this.textureReginList.push(regin)
    regin.parent = this
  }

  public getRegin<T = string>(name: T) {
    const list = this.textureReginList
    for (let i = 0; i < list.length; i++) {
      if (name === list[i].name) {
        return list[i]
      }
    }
    throw new Error(`no regin found name=${name}`)
  }

  dispose() {
    this.textureReginList.length = 0
    this.texture.dispose()
  }

  initRegin() {
    const list = this.textureReginList
    for (let i = 0; i < list.length; i++) {
      list[i].init()
    }
  }
}

export interface TexRegin {
  name: string
  x: number
  y: number
  width: number
  height: number
}

export function toTexReginString(regin: TexRegin) {
  return `${regin.name}\n`
    + `  x: ${regin.x}\n`
    + `  y: ${regin.y}\n`
    + `  width: ${regin.width}\n`
    + `  height: ${regin.height}\n`
}

export class TextureRegin {

  public parent: Nullable<TextureAtlas> = null
  public topLeft = vector2.create()
  public size = vector2.create()
  public bottomRight = vector2.create()
  public texTopLeft = vector2.create()
  public texBottomRight = vector2.create()

  constructor(public name: string) {}

  public init() {
    const { imageWidth, imageHeight } = this.texture
    const scale = vector2.fromValues(1 / imageWidth, 1 / imageHeight)
    vector2.add(this.bottomRight, this.topLeft, this.size)
    // this.bottomRight = this.topLeft.add(this.size)
    // this.texTopLeft = this.topLeft.mul(scale)
    vector2.multiply(this.texTopLeft, this.topLeft, scale)
    vector2.multiply(this.texBottomRight, this.bottomRight, scale)
    // this.texBottomRight = this.bottomRight.mul(scale)
  }

  public get texture() {
    return this.parent!.texture
  }

}