import AudioPlayer from "../../../player/AudioPlayer";
import type { Canvas } from "../../canvas/Canvas";
import type { Disposable } from "../../graphic/core/Disposable";
import type { StorySprite } from "./Sprite2";
import type { StoryLayer } from "./StoryType";
import { TimeIndexedSpriteCollection } from "./TimeIndexedSpriteCollection";

export class StoryboardLayer implements Disposable {

  public background: TimeIndexedSpriteCollection = new TimeIndexedSpriteCollection()
  public fail: TimeIndexedSpriteCollection = new TimeIndexedSpriteCollection()
  public pass: TimeIndexedSpriteCollection = new TimeIndexedSpriteCollection()
  public foreground: TimeIndexedSpriteCollection = new TimeIndexedSpriteCollection()
  public overlay: TimeIndexedSpriteCollection = new TimeIndexedSpriteCollection()

  public onResize() {
    const background = this.background.getAll()
    const fail = this.fail.getAll()
    const pass = this.pass.getAll()
    const foreground = this.foreground.getAll()
    const overlay = this.overlay.getAll()

    for (let i = 0; i < background.length; i++) {
      background[i].onWindowResize()
    }
    for (let i = 0; i < fail.length; i++) {
      fail[i].onWindowResize()
    }
    for (let i = 0; i < pass.length; i++) {
      pass[i].onWindowResize()
    }
    for (let i = 0; i < foreground.length; i++) {
      foreground[i].onWindowResize()
    }
    for (let i = 0; i < overlay.length; i++) {
      overlay[i].onWindowResize()
    }
  }

  public addSprite(sprite: StorySprite, layer: StoryLayer) {
    switch (layer) {
      case 'Background':
        this.background.add(sprite)
        break
      case 'Fail':
        this.fail.add(sprite)
        break
      case 'Pass':
        this.pass.add(sprite)
        break
      case 'Foreground':
        this.foreground.add(sprite)
        break
      case 'Overlay':
        this.overlay.add(sprite)
        break
      default:
        break
    }
  }

  private presentedBackground: StorySprite[] = []
  private presentedFail: StorySprite[] = []
  private presentedPass: StorySprite[] = []
  private presentedForeground: StorySprite[] = []
  private presentedOverlay: StorySprite[] = []

  public update() {
    // 使用时间索引系统获取当前时间需要渲染的精灵
    const currentTime = AudioPlayer.currentTime()

    this.presentedBackground = this.background.getSpritesAtTime(currentTime)
    this.presentedFail = this.fail.getSpritesAtTime(currentTime)
    this.presentedPass = this.pass.getSpritesAtTime(currentTime)
    this.presentedForeground = this.foreground.getSpritesAtTime(currentTime)
    this.presentedOverlay = this.overlay.getSpritesAtTime(currentTime)

    // 更新所有需要渲染的精灵
    this.updateSprites(this.presentedBackground)
    this.updateSprites(this.presentedFail)
    this.updateSprites(this.presentedPass)
    this.updateSprites(this.presentedForeground)
    this.updateSprites(this.presentedOverlay)
  }

  private updateSprites(sprites: StorySprite[]) {
    for (let i = 0; i < sprites.length; i++) {
      sprites[i].update()
    }
  }

  public draw(canvas: Canvas) {
    const background = this.presentedBackground
    const fail = this.presentedFail
    const pass = this.presentedPass
    const foreground = this.presentedForeground
    const overlay = this.presentedOverlay
    let backgroundLength = background.length
    let failLength = fail.length
    let passLength = pass.length
    let foregroundLength = foreground.length
    let overlayLength = overlay.length

    let sprite: StorySprite
    for (let i = 0; i < backgroundLength; i++) {
      sprite = background[i]
      sprite.draw(canvas)
    }
    for (let i = 0; i < failLength; i++) {
      sprite = fail[i]
      sprite.draw(canvas)
    }
    for (let i = 0; i < passLength; i++) {
      sprite = pass[i]
      sprite.draw(canvas)
    }
    for (let i = 0; i < foregroundLength; i++) {
      sprite = foreground[i]
      sprite.draw(canvas)
    }
    for (let i = 0; i < overlayLength; i++) {
      sprite = overlay[i]
      sprite.draw(canvas)
    }
  }

  public dispose() {
    const background = this.background.getAll()
    const fail = this.fail.getAll()
    const pass = this.pass.getAll()
    const foreground = this.foreground.getAll()
    const overlay = this.overlay.getAll()

    for (let i = 0; i < background.length; i++) {
      background[i].dispose()
    }
    for (let i = 0; i < fail.length; i++) {
      fail[i].dispose()
    }
    for (let i = 0; i < pass.length; i++) {
      pass[i].dispose()
    }
    for (let i = 0; i < foreground.length; i++) {
      foreground[i].dispose()
    }
    for (let i = 0; i < overlay.length; i++) {
      overlay[i].dispose()
    }

    this.background.clear()
    this.fail.clear()
    this.pass.clear()
    this.foreground.clear()
    this.overlay.clear()
  }

}
