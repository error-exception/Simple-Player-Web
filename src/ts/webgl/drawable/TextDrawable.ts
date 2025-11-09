import type {BaseDrawableConfig} from "./Drawable";
import {Drawable} from "./Drawable";
import {type DrawNode} from "./DrawNode";
import {type WebGLRenderer} from "../WebGLRenderer";
import {Color} from "../base/Color";
import {Invalidation} from "./Invalidation";
import {DynamicQuadBuffer} from "../graphic/buffer/DynamicQuadBuffer";
import {type TextureAtlas, TextureRegin} from "../graphic/texture/TextureAtlas";
import {TextureStore} from "../graphic/texture/TextureStore";
import {Vector, Vector2} from "../graphic/core/Vector2";
import {clamp} from "../../Utils";
import {Rectangle} from "../graphic/shape/Rectangle";
import type {Nullable} from "../../type";
import type {DefaultShaderWrapper} from "../graphic/shader/DefaultShaderWrapper";
import {LayoutMember} from "../layout/LayoutValue";
import {Coordinate2} from "../base/Coordinate2";

export type TextType = 'normal' | 'bold' | 'italic' | 'light'

export interface TextConfig extends BaseDrawableConfig {
  text: string;
  lineSpacing?: number;
  fontSize?: number;
  fontColor?: Color;
  fontStyle?: TextType;
  letterSpacing?: number;
  fitSize?: boolean
}

export class TextDrawable extends Drawable<TextConfig> {

  public static MAX_FONT_SIZE = 64

  private text: string = ''
  private fontSize: number = 16
  private fontStyle: TextType = 'normal'
  private lineSpacing: number = 0
  private letterSpacing: number = 0
  private textAtlas: TextureAtlas
  private fitSize = true

  constructor(config: TextConfig) {
    super(config);
    this.layoutList.unshift(this.textLayoutMember)
    // this.addLayout(this.textLayoutMember)
    this.textAtlas = TextureStore.getAtlas('Ascii-Normal-Text-Atlas')
    this.setText(config.text)
    this.setFontColor(config.fontColor ?? Color.White)
    this.setFontSize(config.fontSize ?? 16)
    this.setFontStyle(config.fontStyle ?? 'normal')
    this.setLineSpacing(config.lineSpacing ?? 0)
    this.setLetterSpacing(config.letterSpacing ?? 0)
    this.fitSize = config.fitSize ?? true
  }

  onLoad(renderer: WebGLRenderer) {
    super.onLoad(renderer);
    const node = this.drawNode
    node.vertexBuffer = new DynamicQuadBuffer(renderer)
    node.bufferData = []
  }

  public setText(text: string) {
    this.text = text
    this.invalidate(Invalidation.Draw | Invalidation.Layout | Invalidation.Size)
  }

  public setFontColor(color: Color) {
    this.setColor(color)
    this.invalidate(Invalidation.Draw | Invalidation.Layout | Invalidation.Size)
  }

  public setLineSpacing(lineSpacing: number) {
    this.lineSpacing = lineSpacing
    this.invalidate(Invalidation.Draw | Invalidation.Layout | Invalidation.Size)
  }

  public setFontStyle(fontStyle: TextType) {
    this.fontStyle = fontStyle
    this.invalidate(Invalidation.Draw | Invalidation.Layout | Invalidation.Size)
  }

  public setFontSize(fontSize: number) {
    this.fontSize = fontSize
    this.invalidate(Invalidation.Draw | Invalidation.Layout | Invalidation.Size)
  }

  public setLetterSpacing(letterSpacing: number) {
    this.letterSpacing = letterSpacing
    this.invalidate(Invalidation.Draw | Invalidation.Layout | Invalidation.Size)
  }

  public setPosition(x: number, y: number) {
    super.setPosition(x, y);
    const builder = this.getTextBuilder();
    builder.topLeft.set(x, y)

    builder.lineSpacing = this.lineSpacing
    builder.letterSpacing = this.letterSpacing
    builder.updateTextLayout()
  }

  public textLayoutMember = new LayoutMember(Invalidation.Draw)

  // public invalidateLayout() {
  //   if ((this.invalidationValue & Invalidation.Text) > 0) {
  //     this.invalidationValue &= (~this.invalidationValue)
  //     this.updateText()
  //   }
  //   super.invalidateLayout();
  // }

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
    const builder  = this.getTextBuilder()
    builder.text = this.text
    builder.atlas = this.textAtlas
    this.textScale = clamp(this.fontSize / TextDrawable.MAX_FONT_SIZE, 0, 1)
    builder.textScale = this.textScale
    builder.updateText()
  }

  validate() {
    super.validate();
    if (!this.textLayoutMember.isValid()) {
      this.updateText()
      this.textLayoutMember.validate()
    }
  }

  computeSize() {
    const builder = this.getTextBuilder()
    let size = Vector()
    if (this.fitSize) {
      builder.viewSize.setFrom(Coordinate2.size)
      builder.updateTextSize()
      this.initRectangle.setWidth(builder.maxTextWidth)
      this.initRectangle.setHeight(builder.maxTextHeight)
      size.set(builder.maxTextWidth, builder.maxTextHeight)
      // console.log(builder.maxTextWidth, builder.maxTextHeight)

    } else {
      size = super.computeSize();
      builder.viewSize.set(this.getWidth(), this.getHeight())
      builder.updateTextSize()
    }
    return size
  }

  private textScale = 1
  private textBuilder: Nullable<Text> = null

  // private updateText() {
  //   if (this.fontStyle === 'bold') {
  //     this.textAtlas = TextureStore.getAtlas('Ascii-Bold-Text-Atlas')
  //   } else if (this.fontStyle === 'italic') {
  //     this.textAtlas = TextureStore.getAtlas('Ascii-Italic-Text-Atlas')
  //   } else if (this.fontStyle === 'light') {
  //     this.textAtlas = TextureStore.getAtlas('Ascii-Light-Text-Atlas')
  //   } else {
  //     this.textAtlas = TextureStore.getAtlas('Ascii-Normal-Text-Atlas')
  //   }
  //   this.textScale = clamp(this.fontSize / TextDrawable.MAX_FONT_SIZE, 0, 1)
  //
  //   this.sizeLayoutMember.validate()
  //   const builder = this.getTextBuilder()
  //   builder.text = this.text
  //   builder.lineSpacing = this.lineSpacing
  //   builder.letterSpacing = this.letterSpacing
  //   builder.textScale = this.textScale
  //   builder.atlas = this.textAtlas
  //   if (this.fitSize) {
  //     if (this.parent) {
  //       const rectangle = this.parent.initRectangle
  //       builder.viewSize.set(rectangle.getWidth(), rectangle.getHeight())
  //     } else {
  //       builder.viewSize.setFrom(Coordinate.size)
  //     }
  //   } else {
  //     builder.viewSize.set(this.getWidth(), this.getHeight())
  //   }
  //   builder.topLeft.setFrom(this.initRectangle.topLeft)
  //   builder.update()
  //   if (this.fitSize) {
  //     this.setSize(builder.maxTextWidth, builder.maxTextHeight)
  //     // this.initRectangle.setWidth()
  //     // this.initRectangle.setHeight(builder.maxTextHeight)
  //     // this.parent?.invalidate(Invalidation.Layout | Invalidation.ParentAutoSize, InvalidationSource.Child)
  //   }
  //   this.drawNode.bufferData = []
  // }

  public getTextBuilder() {
    if (!this.textBuilder) {
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
    shader.orth = Coordinate2.orthographicProjectionMatrix4
    shader.color = this.computeColor()
  }

  public onDraw(node: DrawNode) {
    const chars = this.getTextBuilder().textChars
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i]
      node.drawRect(char.textRectangle, undefined, i)
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
      if (!map[char.line]) {
        map[char.line] = []
      }
      map[char.line][char.position] = char
    }
    this.shouldOrganizeText = false
  }

  public textChars: TextChar[] = []
  public maxTextWidth = 0
  public maxTextHeight = 0
  public update() {
    this.updateText()
    this.updateTextLayout()
  }

  public updateText() {
    const text = this.text
    let chars = this.textChars
    if (chars.length > text.length) {
      this.textChars = chars.slice(0, text.length)
      chars = this.textChars
    }
    let char: string, regin: TextureRegin
    for (let i = 0; i < text.length; i++) {
      char = text[i]
      regin = this.atlas.getRegin(`char-${char.charCodeAt(0).toString(16)}`)
      let textChar: TextChar
      if (i < chars.length) {
        textChar = chars[i]
        textChar.regin = regin
      } else {
        textChar = new TextChar(regin)
        chars.push(textChar)
      }
      textChar.char = char
      const scaledWidth = regin.size.x * this.textScale
      const scaledHeight = regin.size.y * this.textScale
      console.log(scaledWidth, scaledHeight)
      textChar.textRectangle.setWidth(scaledWidth)
      textChar.textRectangle.setHeight(scaledHeight)
    }
  }

  public updateTextSize() {
    this.maxTextHeight = 0
    this.maxTextWidth = 0
    let currentWidth = 0, currentHeight = 0
    const chars = this.textChars,
      viewSize = this.viewSize
    let scaledWidth: number = 0, scaledHeight: number = 0,
      lineIndex = 0, position = 0

    for (let i = 0; i < chars.length; i++) {
      if (currentHeight >= viewSize.y) {
        return
      }
      const textChar = chars[i]
      scaledWidth = textChar.textRectangle.getWidth()
      scaledHeight = textChar.textRectangle.getHeight()
      currentWidth += (scaledWidth + this.letterSpacing)

      if (currentWidth > viewSize.x) {
        this.maxTextWidth = Math.max(this.maxTextWidth, currentWidth - scaledWidth - this.letterSpacing)
        currentWidth = 0
        lineIndex++
        position = 0
      }
      textChar.line = lineIndex
      textChar.position = position++
    }
    this.lineCount = lineIndex + 1
    this.shouldOrganizeText = true
    this.maxTextHeight = (lineIndex + 1) * scaledHeight + (lineIndex) * this.lineSpacing
    // this.maxTextWidth = currentWidth
    this.organizeText()
  }

  public updateTextLayout() {
    const initX = this.topLeft.x
    let x = initX, y = this.topLeft.y, charHeight = 0
    const lines = this.textMap
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      x = initX
      for (let j = 0; j < line.length; j++) {
        const char = line[j]
        char.textRectangle.setTopLeft(x, y)
        charHeight = char.textRectangle.getHeight()
        x += char.textRectangle.getWidth() + this.letterSpacing
      }
      y += charHeight + this.lineSpacing
    }
    // this.maxTextHeight = 0
    // this.maxTextWidth = 0
    // const chars = this.textChars
    // const currentTopLeft = this.topLeft.copy()
    // const bottomLeft = this.topLeft.add(this.viewSize)
    // let line = 0, position = 0
    // let scaledWidth: number = 0, scaledHeight: number = 0
    // for (let i = 0; i < chars.length; i++) {
    //   const textChar = chars[i]
    //   const regin  = textChar.regin
    //   scaledWidth = regin.size.x * this.textScale
    //   scaledHeight = regin.size.y * this.textScale
    //   if (currentTopLeft.x + scaledWidth >= bottomLeft.x) {
    //     currentTopLeft.y += (scaledHeight + this.lineSpacing)
    //     currentTopLeft.x = this.topLeft.x
    //     this.maxTextWidth = Math.max(this.maxTextWidth, currentTopLeft.x - this.topLeft.x)
    //     line++
    //     position = 0
    //   }
    //   if (currentTopLeft.y >= bottomLeft.y) {
    //     return
    //   }
    //   textChar.textRectangle.setTopLeft(currentTopLeft.x, currentTopLeft.y)
    //   textChar.textRectangle.setWidth(scaledWidth)
    //   textChar.textRectangle.setHeight(scaledHeight)
    //   textChar.line = line
    //   textChar.position = position++
    //   currentTopLeft.x += (scaledWidth + this.letterSpacing)
    // }
    // this.lineCount = line
    // this.shouldOrganizeText = true
    // this.maxTextHeight = (currentTopLeft.y - this.topLeft.y) + scaledHeight + this.lineSpacing
    // this.maxTextWidth = Math.max(this.maxTextWidth, currentTopLeft.x - this.topLeft.x)
  }

}

class TextChar {

  public textRectangle = new Rectangle()
  public line = 0 // start from zero
  public position = 0 // start from zero
  public char: string = ''
  constructor(public regin: TextureRegin) {}

}