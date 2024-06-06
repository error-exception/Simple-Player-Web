import {Vector, Vector2} from "../core/Vector2";
import type {Nullable} from "../../type";
import {Texture} from "../core/Texture";
import type {Disposable} from "../core/Disposable";

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

  public getRegin(name: string) {
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

export class TextureRegin {

  public parent: Nullable<TextureAtlas> = null
  public topLeft = Vector2.newZero()
  public size = Vector2.newZero()
  public bottomRight = Vector2.zero
  public texTopLeft = Vector2.zero
  public texBottomRight = Vector2.zero

  constructor(public name: string) {}

  public init() {
    const { imageWidth, imageHeight } = this.texture
    const scale = Vector(1 / imageWidth, 1 / imageHeight)
    this.bottomRight = this.topLeft.add(this.size)
    this.texTopLeft = this.topLeft.mul(scale)
    this.texBottomRight = this.bottomRight.mul(scale)
  }

  public get texture() {
    return this.parent!.texture
  }


}