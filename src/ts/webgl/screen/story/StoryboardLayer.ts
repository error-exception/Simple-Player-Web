import type {Sprite} from "./Sprite";
import type {WebGLRenderer} from "../../WebGLRenderer";

export class StoryboardLayer {

  public background: Sprite[] = []
  public fail: Sprite[] = []
  public pass: Sprite[] = []
  public foreground: Sprite[] = []
  public overlay: Sprite[] = []

  public onResize() {
    const background = this.background
    const fail = this.fail
    const pass = this.pass
    const foreground = this.foreground
    const overlay = this.overlay
    for (let i = 0; i < background.length; i++) {
      background[i].onResize()
    }
    for (let i = 0; i < fail.length; i++) {
      fail[i].onResize()
    }
    for (let i = 0; i < pass.length; i++) {
      pass[i].onResize()
    }
    for (let i = 0; i < foreground.length; i++) {
      foreground[i].onResize()
    }
    for (let i = 0; i < overlay.length; i++) {
      overlay[i].onResize()
    }
  }

  public update() {
    const background = this.background
    const fail = this.fail
    const pass = this.pass
    const foreground = this.foreground
    const overlay = this.overlay
    for (let i = 0; i < background.length; i++) {
      background[i].update()
    }
    for (let i = 0; i < fail.length; i++) {
      fail[i].update()
    }
    for (let i = 0; i < pass.length; i++) {
      pass[i].update()
    }
    for (let i = 0; i < foreground.length; i++) {
      foreground[i].update()
    }
    for (let i = 0; i < overlay.length; i++) {
      overlay[i].update()
    }
  }

  public draw(renderer: WebGLRenderer) {
    const background = this.background
    const fail = this.fail
    const pass = this.pass
    const foreground = this.foreground
    const overlay = this.overlay
    for (let i = 0; i < background.length; i++) {
      background[i].draw(renderer)
    }
    for (let i = 0; i < fail.length; i++) {
      fail[i].draw(renderer)
    }
    for (let i = 0; i < pass.length; i++) {
      pass[i].draw(renderer)
    }
    for (let i = 0; i < foreground.length; i++) {
      foreground[i].draw(renderer)
    }
    for (let i = 0; i < overlay.length; i++) {
      overlay[i].draw(renderer)
    }
  }

  public dispose() {
    const background = this.background
    const fail = this.fail
    const pass = this.pass
    const foreground = this.foreground
    const overlay = this.overlay
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
  }
}