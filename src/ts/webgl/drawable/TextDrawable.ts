import type {BaseDrawableConfig} from "./Drawable";
import {Drawable} from "./Drawable";
import {type DrawNode} from "./DrawNode";
import {type WebGLRenderer} from "../WebGLRenderer";
import {Color} from "../base/Color";
import {Invalidation} from "./Invalidation";
import {DynamicQuadBuffer} from "../buffer/DynamicQuadBuffer";
import {type TextureAtlas, TextureRegin} from "../texture/TextureAtlas";
import {TextureStore} from "../texture/TextureStore";
import {Vector, Vector2} from "../core/Vector2";
import {clamp} from "../../Utils";
import {Rectangle} from "./Rectangle";
import type {Nullable} from "../../type";
import type {DefaultShaderWrapper} from "../shader/DefaultShaderWrapper";
import Coordinate from "../base/Coordinate";

export interface TextConfig extends BaseDrawableConfig {
  text: string;
  lineSpacing?: number;
  fontSize?: number;
  fontColor?: Color;
  fontStyle?: 'normal' | 'bold' | 'italic' | 'light';
  letterSpacing?: number
}

export class TextDrawable extends Drawable<TextConfig> {

  public static MAX_FONT_SIZE = 64

  private text: string = ''
  private fontSize: number = 16
  private fontStyle: 'normal' | 'bold' | 'italic' | 'light' = 'normal'
  private lineSpacing: number = 0
  private letterSpacing: number = 0
  private textAtlas: TextureAtlas

  constructor(config: TextConfig) {
    super(config);
    this.textAtlas = TextureStore.getAtlas('Ascii-Normal-Text-Atlas')
    this.setText(config.text)
    this.setFontColor(config.fontColor ?? Color.White)
    this.setFontSize(config.fontSize ?? 16)
    this.setFontStyle(config.fontStyle ?? 'normal')
    this.setLineSpacing(config.lineSpacing ?? 0)
    this.setLetterSpacing(config.letterSpacing ?? 0)
  }

  onLoad(renderer: WebGLRenderer) {
    super.onLoad(renderer);
    const node = this.drawNode
    node.vertexBuffer = new DynamicQuadBuffer(renderer)
    node.bufferData = []
  }

  public setText(text: string) {
    this.text = text
    this.invalidate(Invalidation.Text)
  }

  public setFontColor(color: Color) {
    this.setColor(color)
    this.invalidate(Invalidation.Text)
  }

  public setLineSpacing(lineSpacing: number) {
    this.lineSpacing = lineSpacing
    this.invalidate(Invalidation.Text)
  }

  public setFontStyle(fontStyle: 'normal' | 'bold' | 'italic' | 'light') {
    this.fontStyle = fontStyle
    this.invalidate(Invalidation.Text)
  }

  public setFontSize(fontSize: number) {
    this.fontSize = fontSize
    this.invalidate(Invalidation.Text)
  }

  public setLetterSpacing(letterSpacing: number) {
    this.letterSpacing = letterSpacing
    this.invalidate(Invalidation.Text)
  }

  public invalidateLayout() {
    super.invalidateLayout();
    if ((this.invalidationValue & Invalidation.Text) > 0) {
      this.invalidationValue &= (~this.invalidationValue)
      this.updateText()
    }
  }

  private textScale = 1
  private textBuilder: Nullable<Text> = null

  private updateText() {
    if (this.fontStyle === 'bold') {
      this.textAtlas = TextureStore.getAtlas('Ascii-Bold-Text-Atlas')
    } else if (this.fontStyle === 'italic') {
      this.textAtlas = TextureStore.getAtlas('Ascii-Italic-Text-Atlas')
    } else if (this.fontStyle === 'light') {
      this.textAtlas = TextureStore.getAtlas('Ascii-Light-Text-Atlas')
    } else {
      this.textAtlas = TextureStore.getAtlas('Ascii-Normal-Text-Atlas')
    }
    this.textScale = clamp(this.fontSize / TextDrawable.MAX_FONT_SIZE, 0, 1)

    const builder = this.getTextBuilder()
    builder.text = this.text
    builder.lineSpacing = this.lineSpacing
    builder.letterSpacing = this.letterSpacing
    builder.textScale = this.textScale
    builder.atlas = this.textAtlas
    builder.viewSize = Vector(this.getWidth(), this.getHeight())
    builder.topLeft.setFrom(this.initRectangle.topLeft)
    builder.update()
    this.drawNode.bufferData = []
  }

  public getTextBuilder() {
    if (this.textBuilder === null) {
      this.textBuilder = new Text(
        this.text,
        this.textAtlas,
        this.lineSpacing,
        this.letterSpacing,
        Vector(this.getWidth(), this.getHeight()),
        this.textScale
      )
    }
    return this.textBuilder
  }

  public getLineAt(lineIndex: number) {
    return this.getTextBuilder().getLine(lineIndex)
  }

  public getAt(line: number, position: number) {
    return this.getTextBuilder().getTextAt(line, position)
  }

  public beforeCommit(node: DrawNode) {
    const shader = node.shader as DefaultShaderWrapper
    shader.sampler2D = 0
    shader.orth = Coordinate.orthographicProjectionMatrix4
    shader.color = this.computeColor()
  }

  public onDraw(node: DrawNode) {
    const chars = this.getTextBuilder().textChars
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i]
      node.drawRect(char.textRectangle.topLeft, char.textRectangle.bottomRight, undefined, i)
      node.drawTexture(char.regin, char.regin.texTopLeft, char.regin.texBottomRight, i)
    }
  }

  public dispose() {
    super.dispose();
    this.drawNode.vertexBuffer.dispose()
  }
}

class Text {

  public lineCount = 0

  constructor(
    public text: string,
    public atlas: TextureAtlas,
    public lineSpacing: number,
    public letterSpacing: number,
    public viewSize: Vector2,
    public textScale: number
  ) {}

  public topLeft = Vector2.newZero()

  public get count() {
    return this.textChars.length
  }

  public getLine(lineIndex: number): string {
    this.organizeText()
    let s = ''
    const line = this.textMap[lineIndex] ?? []
    for (let i = 0; i < line.length; i++) {
      s += line[i].char
    }
    return s
  }

  public getTextAt(line: number, position: number) {
    this.organizeText()
    return this.textMap[line]?.[position]?.char ?? ''
  }

  /**
   * textMap[line][position]
   * @private
   */
  private textMap: TextChar[][] = []
  private shouldOrganizeText = true
  private organizeText() {
    if (!this.shouldOrganizeText) {
      return
    }
    const chars = this.textChars
    const map = this.textMap
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i]
      map[char.line][char.position] = char
    }
    this.shouldOrganizeText = false
  }

  public textChars: TextChar[] = []
  public update() {
    const text = this.text
    let chars = this.textChars
    const currentTopLeft = this.topLeft.copy()
    const bottomLeft = this.topLeft.add(this.viewSize)
    let line = 0, position = 0
    if (chars.length > text.length) {
      this.textChars = chars.slice(0, text.length)
      chars = this.textChars
    }
    let char: string, regin: TextureRegin,
      scaledWidth: number, scaledHeight: number
    for (let i = 0; i < text.length; i++) {
      char = text[i]
      console.log('char code: ', char.charCodeAt(0))
      regin = this.atlas.getRegin(`char-${char.charCodeAt(0).toString(16)}`)
      scaledWidth = regin.size.x * this.textScale
      scaledHeight = regin.size.y * this.textScale
      if (currentTopLeft.x + scaledWidth >= bottomLeft.x) {
        currentTopLeft.y += (scaledHeight + this.lineSpacing)
        currentTopLeft.x = 0
        line++
        position = 0
      }
      if (currentTopLeft.y >= bottomLeft.y) {
        return
      }
      let textChar: TextChar
      if (i < chars.length) {
        textChar = chars[i]
        textChar.regin = regin
      } else {
        textChar = new TextChar(regin)
        chars.push(textChar)
      }
      textChar.char = char
      textChar.textRectangle.setTopLeft(currentTopLeft.x, currentTopLeft.y)
      textChar.textRectangle.setWidth(scaledWidth)
      textChar.textRectangle.setHeight(scaledHeight)
      textChar.line = line
      textChar.position = position++
      currentTopLeft.x += (scaledWidth + this.letterSpacing)
    }
    this.lineCount = line
    this.shouldOrganizeText = true
  }

}

class TextChar {

  public textRectangle = new Rectangle()
  public line = 0 // start from zero
  public position = 0 // start from zero
  public char: string = ''
  constructor(public regin: TextureRegin) {}

}