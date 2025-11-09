import { OSUApplication } from "../../OSUApplication";
import type { Nullable } from "../../type";
import { ArrayUtils } from "../../util/ArrayUtils";
import type { Canvas } from "../canvas/Canvas";
import { Invalidation } from "../drawable/Invalidation";
import { DynamicQuadBuffer } from "../graphic/buffer/DynamicQuadBuffer";
import { vector2 } from "../graphic/matrix/vec2";
import { rect } from "../graphic/shape/Rectangle";
import type { TextureAtlas, TextureRegin } from "../graphic/texture/TextureAtlas";
import { TextureStore } from "../graphic/texture/TextureStore";
import { LayoutMember } from "../layout/LayoutValue";
import { genTexture } from "../util/GenTexture";
import { View } from "./View";

export class TextStore {

  private static charMap = new Map<string, Set<string>>();

  public static addChar(char: string, fontSize: number, fontStyle: FontStyle) {
    const key = this.textKey(fontSize, fontStyle)
    let charSet = this.charMap.get(key);
    if (!charSet) {
      charSet = new Set<string>();
      this.charMap.set(key, charSet);
    }
    charSet.add(char);
  }

  private static textKey(fontSize: number, fontStyle: FontStyle) {
    return `char-${fontSize}-${fontStyle}`;
  }

  public static generateTextureAtlas() {
    // TODO: generate texture atlas to TextureStore dynamically
  }

}

export type TextAlign = "left" | "center" | "right";
export type FontStyle = "normal" | "italic" | "bold" | "light";

export class TextView extends View {
  
  private _textAlignment: TextAlign = "left";
  public set textAlignment(value: TextAlign) {
    if (this._textAlignment !== value) {
      this._textAlignment = value;
      this.invalidate(Invalidation.Draw);
    }
  }
  public get textAlignment(): TextAlign {
    return this._textAlignment;
  }

  private _textSize = 16;
  public set textSize(value: number) {
    if (this._textSize !== value) {
      this._textSize = value;
      this.invalidate(Invalidation.Draw);
    }
  }
  public get textSize(): number {
    return this._textSize;
  }

  private _text = "";
  public set text(value: string) {
    if (this._text !== value) {
      this._text = value;
      this.invalidate(Invalidation.Draw);
    }
  }
  public get text(): string {
    return this._text;
  }
  private _letterSpacing = 0;
  public set letterSpacing(value: number) {
    if (this._letterSpacing !== value) {
      this._letterSpacing = value;
      this.invalidate(Invalidation.Draw);
    }
  }
  public get letterSpacing(): number {
    return this._letterSpacing;
  }

  private _lineHeight = 1.2;
  public set lineHeight(value: number) {
    if (this._lineHeight !== value) {
      this._lineHeight = value;
      this.invalidate(Invalidation.Draw);
    }
  }
  public get lineHeight(): number {
    return this._lineHeight;
  }

  private _fontStyle: FontStyle = "normal";
  public set fontStyle(value: FontStyle) {
    if (this._fontStyle !== value) {
      this._fontStyle = value;
      this.invalidate(Invalidation.Draw);
    }
  }
  public get fontStyle(): FontStyle {
    return this._fontStyle;
  }
  private _maxLines = Number.MAX_SAFE_INTEGER;
  public set maxLines(value: number) {
    if (value === -1) {
      value = Number.MAX_SAFE_INTEGER;
    }
    if (this._maxLines !== value) {
      this._maxLines = value;
      this.invalidate(Invalidation.Draw);
    }
  }
  public get maxLines(): number {
    return this._maxLines;
  }
  
  private _autoWrap = false;
  public set autoWrap(value: boolean) {
    if (this._autoWrap !== value) {
      this._autoWrap = value;
      this.invalidate(Invalidation.Draw);
    }
  }
  public get autoWrap(): boolean {
    return this._autoWrap;
  }

  private textLayoutMember = new LayoutMember(Invalidation.Draw | Invalidation.Size);

  constructor() {
    super();
    this.layoutList.push(this.textLayoutMember);
  }

  private dynamicQuadBuffer: Nullable<DynamicQuadBuffer> = null;

  public onLoad(): void {
    super.onLoad();
    const renderer = OSUApplication.renderer
    if (!renderer) {
      return
    }
    
    this.dynamicQuadBuffer = new DynamicQuadBuffer(renderer, 4)
  }

  public onUpdate(): void {
    super.onUpdate();
    if (!this.textLayoutMember.isValid()) {
      this.updateText();
      this.textLayoutMember.validate();
    }
  }

  private textBuilder: Text | null = null;

  private updateText() {
    let textAtlas: TextureAtlas
    if (this.fontStyle === 'bold') {
      textAtlas = TextureStore.getAtlas('Ascii-Bold-Text-Atlas')
    } else if (this.fontStyle === 'italic') {
      textAtlas = TextureStore.getAtlas('Ascii-Italic-Text-Atlas')
    } else if (this.fontStyle === "light") {
      textAtlas = TextureStore.getAtlas('Ascii-Light-Text-Atlas')
    } else {
      textAtlas = TextureStore.getAtlas('Ascii-Normal-Text-Atlas')
    }
    if (this.textBuilder == null) {
      this.textBuilder = new Text(
        this.text,
        this.textSize,
        textAtlas,
        this.letterSpacing,
        this.lineHeight,
        this.maxLines,
        this.autoWrap,
        this.size,
        this.textAlignment
      )
    } else {
      const text = this.textBuilder;
      text.text = this.text;
      text.textSize = this.textSize;
      text.textTextureAtlas = textAtlas;
      text.letterSpacing = this.letterSpacing;
      text.lineHeight = this.lineHeight;
      text.maxLines = this.maxLines;
      text.autoWrap = this.autoWrap;
      text.viewSize = this.size;
      text.textAlignment = this.textAlignment;
    }
    // debugger
    this.textBuilder.updateTextSize();
    this.textBuilder.updateTextLayout();
  }

  public onDraw(canvas: Canvas): void {
    super.onDraw(canvas)
    // canvas.drawRect(
    //   0, 0,
    //   this.width, this.height
    // )
    const lines = this.textBuilder?.lines;
    if (lines == null) return;

    // console.log(lines)
    canvas.useVertexBuffer(this.dynamicQuadBuffer!!)
    canvas.beginBatch();
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].textLine;

      for (let j = 0; j < line.length; j++) {
        const textChar = line[j];
        
        canvas.drawTextureAtlas(
          textChar.regin,
          textChar.x,
          textChar.y,
          textChar.width,
          textChar.height
        )        
      }
    }
    canvas.endBatch();
  }
}
class Text {

  public static MAX_TEXT_SIZE = 72;

  public lines: TextLine[] = [];
  public charMap = new Map<string, TextChar>();
  public textCharList: TextChar[] = [];

  constructor(
    public text: string,
    public textSize: number,
    public textTextureAtlas: TextureAtlas,
    public letterSpacing: number,
    public lineHeight: number,
    public maxLines: number,
    public autoWrap: boolean,
    public viewSize: vec2,
    public textAlignment: TextAlign,
  ) {
  }

  /**
   * update text char size
   */
  public updateTextSize() {
    const text = this.text;
    let textCharList = this.textCharList;
    const textSize = this.textSize;
    const textTextureAtlas = this.textTextureAtlas;

    if (textCharList.length > text.length) {
      this.textCharList = textCharList.slice(0, text.length);
      textCharList = this.textCharList;
    }

    let char: string, length = text.length;

    for (let i = 0; i < length; i++) {
      char = text.charAt(i);
      const regin = textTextureAtlas.getRegin(`char-${char.charCodeAt(0).toString(16)}`);
      let textChar: TextChar;
      
      if (i < textCharList.length) {
        textChar = textCharList[i];
        
      } else {
        textChar = new TextChar(regin);
        textCharList.push(textChar);
      }

      textChar.regin = regin;
      textChar.char = char;
      const textScale = textSize / Text.MAX_TEXT_SIZE;
      textChar.width = textChar.regin.size[0] * textScale;
      textChar.height = textChar.regin.size[1] * textScale;
    }
  }

  public updateTextLayout() {
    const [ viewWidth, viewHeight ] = this.viewSize;
    const textCharList = this.textCharList;
    const letterSpacing = this.letterSpacing;
    const lineHeight = this.lineHeight;
    const maxLines = this.maxLines;
    const autoWrap = this.autoWrap;
    const textAlignment = this.textAlignment;

    let line = 0, offsetY = 0
    const textCharListLength = textCharList.length;

    const lines = this.lines;
    let currentLine: Nullable<TextLine> = null;

    lines.length = 0;

    for (let i = 0; i < textCharListLength; i++) {

      if (line >= maxLines) {
        break;
      }
      
      const textChar = textCharList[i];
      currentLine = lines[line];

      if (!currentLine) {
        currentLine = new TextLine(viewWidth);
        currentLine.offsetY = offsetY;
        currentLine.textAlignment = textAlignment;
        currentLine.letterSpacing = letterSpacing;
        lines[line] = currentLine;
      }

      if (!currentLine.addTextChar(textChar)) {
        line++;
        offsetY += currentLine.height + lineHeight;
        currentLine.updateLineLayout();
        currentLine = new TextLine(viewWidth);
        currentLine.offsetY = offsetY;
        currentLine.textAlignment = textAlignment;
        currentLine.letterSpacing = letterSpacing;
        lines[line] = currentLine;
        currentLine.addTextChar(textChar)
      }
    }
    currentLine?.updateLineLayout();
  }

}

class TextLine {

  public textLine: TextChar[] = [];
  public letterSpacing = 0;
  public textAlignment: TextAlign = "left";
  public width = 0;
  public offsetY = 0;
  public height = 0;

  constructor(
    readonly viewWidth: number,
  ) {}

  public charAt(index: number): TextChar {
    if (ArrayUtils.inBound(this.textLine, index)) {
      return this.textLine[index];
    }
    throw new Error(`index out of bound ${index}`)
  }

  public addTextChar(textChar: TextChar): boolean {
    if (this.width + textChar.width + this.letterSpacing > this.viewWidth) {
      return false;
    }
    if (textChar.char === '\n') {
      return false
    }
    this.textLine.push(textChar);
    this.width += this.letterSpacing + textChar.width;
    this.height = Math.max(this.height, textChar.height);
    return true;
  }

  public updateLineLayout() {
    const currentWidth = this.width;
    const viewWidth = this.viewWidth;
    const textAlignment = this.textAlignment;

    let offsetX = 0, offsetY = this.offsetY;
    if (textAlignment === "left") {
      for (let i = 0; i < this.textLine.length; i++) {
        const textChar = this.textLine[i];
        textChar.x = offsetX;
        textChar.y = offsetY;
        offsetX += textChar.width + this.letterSpacing;
      }
    } else if (textAlignment === "center") {
      const centerX = (viewWidth - currentWidth) / 2;
      for (let i = 0; i < this.textLine.length; i++) {
        const textChar = this.textLine[i];
        textChar.x = centerX + offsetX;
        textChar.y = offsetY;
        offsetX += textChar.width + this.letterSpacing;
      }
    } else if (textAlignment === "right") {
      const rightX = viewWidth - currentWidth;
      for (let i = 0; i < this.textLine.length; i++) {
        const textChar = this.textLine[i];
        textChar.x = rightX + offsetX;
        textChar.y = offsetY;
        offsetX += textChar.width + this.letterSpacing;
      }
    }
  }

}

class TextChar {
  public x = 0
  public y = 0
  public width = 0
  public height = 0
  public line = 0 // start from zero
  public position = 0 // start from zero
  public char: string = ''
  constructor(public regin: TextureRegin) {}

}