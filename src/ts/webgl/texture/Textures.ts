import {Texture} from "../core/Texture";
import {TextureGroup} from "./TextureGroup";
import {Disposable} from "../core/Disposable";

export class Textures implements Disposable {

  public currentBoundedTexture: Texture | null = null

  private textureGroupList: TextureGroup[] = []

  public addTextureGroup(textureGroup: TextureGroup) {
    this.textureGroupList.push(textureGroup)
  }

  public bind(name: string) {
    const list = this.textureGroupList
    for (let i = 0; i < list.length; i++) {
      if (list[i].bind(name)) {
        return
      }
    }
  }

  public disposeTextureGroup(textureGroup: TextureGroup) {
    const i = this.textureGroupList.indexOf(textureGroup)
    if (i >= 0) {
      this.textureGroupList[i].dispose()
      this.textureGroupList.splice(i, 1)
    }
  }

  public dispose() {
    this.textureGroupList.forEach(v => v.dispose())
    this.textureGroupList.length = 0
  }

}

export default new Textures()