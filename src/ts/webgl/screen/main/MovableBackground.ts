import BackgroundLoader from "../../../global/BackgroundLoader";
import {Box} from "../../box/Box";
import Coordinate from "../../base/Coordinate";
import {Drawable} from "../../drawable/Drawable";
import {Shape2D} from "../../util/Shape2D";
import {Texture} from "../../core/Texture";
import {TransformUtils} from "../../core/TransformUtils";
import {Vector2} from "../../core/Vector2";
import {VertexBuffer} from "../../core/VertexBuffer";
import {easeOutQuint} from "../../../util/Easing";
import {UNI_COLOR, UNI_ORTH, UNI_SAMPLER, UNI_TRANSFORM} from "../../shader/ShaderConstant";
import type {ShaderWrapper} from "../../shader/ShaderWrapper";
import {Shaders} from "../../shader/Shaders";

// const vertexShader = `
//     attribute vec4 a_position;
//     attribute vec2 a_tex_coord;
//
//     varying mediump vec2 v_tex_coord;
//
//     uniform mat4 u_transform;
//
//     void main() {
//         gl_Position = a_position * u_transform;
//         v_tex_coord = a_tex_coord;
//     }
// `
// // TODO: 调整高亮的位置
// const fragmentShader = `
//     varying mediump vec2 v_tex_coord;
//     uniform sampler2D u_sampler;
//     //uniform mediump vec2 u_brightness;
//     uniform mediump float u_alpha;
//     void main() {
//         mediump vec4 texelColor = texture2D(u_sampler, v_tex_coord);
//         /*
//         mediump float distance = 0.0;
//         mediump float target = 0.0;
//
//         mediump float leftDistance = (0.15 - v_tex_coord.x) / 0.1;
//         mediump float rightDistance = (v_tex_coord.x - 0.85) / 0.1;
//         leftDistance = max(leftDistance, 0.0);
//         rightDistance = max(rightDistance, 0.0);
//         target = max(u_brightness.x * leftDistance, 0.0);
//         target = max(u_brightness.y * rightDistance, target);
//
//         texelColor.rgb = min(texelColor.rgb + target, 1.0);*/
//         texelColor.a = texelColor.a * u_alpha;
//         gl_FragColor = texelColor;
//     }
// `

interface ImageDrawInfo {
    drawWidth: number
    drawHeight: number,
    offsetLeft: number,
    offsetTop: number,
    needToChange: boolean
}

export class MovableBackground extends Drawable {

    // private readonly vertexArray: VertexArray
    private readonly shader: ShaderWrapper
    private readonly buffer: VertexBuffer
    // private readonly layout: VertexBufferLayout
    private readonly texture: Texture

    public imageDrawInfo: ImageDrawInfo = {
        drawHeight: 0, drawWidth: 0, needToChange: false, offsetLeft: 0, offsetTop: 0
    }

    private image: ImageBitmap | null = null
    private needUpdateTexture = false

    constructor(
        gl: WebGL2RenderingContext,
        private textureUnit: number
    ) {
        super(gl, { size: ['fill-parent', 'fill-parent'] })

        this.buffer = new VertexBuffer(gl);
        this.texture = new Texture(gl, null)
        this.shader = Shaders.Default;
    }

    protected onUpdate() {
        super.onUpdate();
        if (this.transition.transitionAlpha.isEnd) {
            this.onFinish?.()
            this.onFinish = null
        }

        const min = Math.min
        const viewport = Coordinate;
        const { imageWidth, imageHeight } = this.texture

        const imageDrawInfo = this.imageDrawInfo
        if (imageDrawInfo.needToChange) {
            const rawWidth = this.width
            const rawHeight = this.height
            const rawRatio = rawWidth / rawHeight
            const imageRatio = imageWidth / imageHeight
            if (rawRatio > imageRatio) {
                imageDrawInfo.drawWidth = imageWidth
                imageDrawInfo.drawHeight = imageWidth / rawRatio
                imageDrawInfo.offsetLeft = 0
                imageDrawInfo.offsetTop = (imageHeight - imageDrawInfo.drawHeight) / 2
            } else {
                imageDrawInfo.drawHeight = imageHeight
                imageDrawInfo.drawWidth = imageHeight * rawRatio
                imageDrawInfo.offsetTop = 0
                imageDrawInfo.offsetLeft = (imageWidth - imageDrawInfo.drawWidth) / 2
            }
            imageDrawInfo.needToChange = false
            this.updateVertex()
        }

        const scale = 1.01
        const translate = this.translate

        const scaledWidth = imageWidth * scale
        const scaledHeight = imageHeight * scale

        const shortOnImage = min(scaledHeight, scaledWidth)
        const shortOnViewport = min(viewport.width, viewport.height)
        const factor = shortOnViewport / shortOnImage

        const widthDiffer = scaledWidth - imageWidth
        const heightDiffer = scaledHeight - imageHeight
        const x = (factor * widthDiffer / viewport.width) * translate.x
        const y = (factor * heightDiffer / viewport.height) * translate.y

        this.scale = new Vector2(scale, scale)
        this.translate = new Vector2(x, y)

        //shader.setUniform2fv('u_brightness', this.brightnessValues)
    }

    public setBackgroundImage(image: ImageBitmap) {
        this.image = image
        this.texture.setTextureImage(this.image)
        this.imageDrawInfo.needToChange = true
        this.needUpdateTexture = true
    }
    private vertex = new Float32Array(4 * 6)
    private updateVertex() {
        const { x, y } = this.position
        const width = this.width
        const height = this.height
        const topLeft = new Vector2(x, y)
        const bottomRight = new Vector2(x + width, y - height)
        
        const info = this.imageDrawInfo
        const imageTopLeft = new Vector2(info.offsetLeft, info.offsetTop)
    
        const imageBottomRight = new Vector2(info.offsetLeft + info.drawWidth, info.offsetTop + info.drawHeight)
        const imageScale = TransformUtils.scale(1 / this.texture.imageWidth, 1 / this.texture.imageHeight)
        TransformUtils.applyOrigin(imageTopLeft, imageScale)
        
        TransformUtils.applyOrigin(imageBottomRight, imageScale)
        Shape2D.quadVector2(
            topLeft,
            bottomRight,
            this.vertex, 0, 4
        )
        Shape2D.quadVector2(
            imageTopLeft,
            imageBottomRight,
            this.vertex, 2, 4
        )
    }

    private onFinish: (() => void) | null = null

    public fadeOut(onFinish: () => void) {
        this.transform().fadeTo(0, 220)
        // this.fadeBegin()
        //     .fadeTo(0, 220)
        this.onFinish = onFinish
    }

    public onWindowResize(): void {
        super.onWindowResize()
        this.imageDrawInfo.needToChange = true
        this.updateVertex()
    }

    public unbind() {
        // this.vertexArray.unbind()
        this.texture.unbind()
        this.buffer.unbind()
        this.shader.unbind()
    }

    public bind() {
        this.texture.bind(this.textureUnit)
        // this.vertexArray.bind()
        this.buffer.bind()
        this.shader.bind()
    }

    private white = new Float32Array([1, 1, 1, 1])

    public onDraw() {
        if (this.needUpdateTexture && this.image) {
            console.log("background need change");
            
            this.needUpdateTexture = false
        }
        this.buffer.setBufferData(this.vertex)
        
        const gl = this.gl
        const shader = this.shader.shader
        shader.setUniform1i(UNI_SAMPLER, this.textureUnit)
        shader.setUniformMatrix4fv(UNI_TRANSFORM, this.matrixArray)
        this.white[3] = this.appliedTransform.alpha
        shader.setUniform4fv(UNI_COLOR, this.white)
        shader.setUniformMatrix4fv(UNI_ORTH, Coordinate.orthographicProjectionMatrix4)
        // this.vertexArray.addBuffer(this.layout)
        this.shader.use()
        gl.drawArrays(gl.TRIANGLES, 0, 6)
    }

    public dispose() {
        super.dispose()
        this.texture.dispose()
        // this.vertexArray.dispose()
        // this.shader.dispose()
        this.buffer.dispose()
    }
}

export class Background extends Box {

    private textureUnits = [2, 3]
    private textureUnitIndex = 0

    constructor(gl: WebGL2RenderingContext, initImage?: ImageBitmap) {
        super(gl, { size: ['fill-parent', 'fill-parent'] });
        const current = new MovableBackground(gl, this.nextTextureUnit())
        const next = new MovableBackground(gl, this.nextTextureUnit())
        this.add(next, current)
        this.backImage.isVisible = false
        this.frontImage.setBackgroundImage(initImage ? initImage : BackgroundLoader.getBackground())
    }

    private swap() {
        const temp = this.childrenList[0]
        this.childrenList[0] = this.childrenList[1]
        this.childrenList[1] = temp
    }

    private get frontImage() {
        return this.childrenList[1] as MovableBackground
    }

    private get backImage() {
        return this.childrenList[0] as MovableBackground
    }

    private isFading = false

    public updateBackground2(image: ImageBitmap) {
        if (this.isFading) return
        this.isFading = true

        this.backImage.setBackgroundImage(image)
        this.backImage.isVisible = true
        this.backImage.alpha = 1
        this.frontImage.fadeOut(() => {
            this.frontImage.isVisible = false
            this.isFading = false
            this.swap()
        })
    }

    set translate(v: Vector2) {
        for (let i = 0; i < this.childrenList.length; i++) {
            this.childrenList[i].translate = v
        }
    }

    get translate(): Vector2 {
        return Vector2.newZero()
    }

    public draw() {
        if (this.isVisible) {
            this.backImage.draw()
            this.frontImage.draw()
        }
    }

    private nextTextureUnit(): number {
        this.textureUnitIndex = (this.textureUnitIndex + 1) % this.textureUnits.length
        return this.textureUnits[this.textureUnitIndex]
    }


}

export class BackgroundBounce extends Box {

    public background: Background

    constructor(gl: WebGL2RenderingContext, backgroundImage: ImageBitmap | undefined) {
        super(gl, {
            size: ['fill-parent', 'fill-parent']
        });

        this.add((this.background = new Background(gl, backgroundImage)))
    }

    public in() {
        // const startTime = Time.currentTime + 300
        const transition = this.transform()
        transition.delay(300).scaleTo(new Vector2(0.98, 0.98), 500, easeOutQuint)
          .delay(300).moveTo(new Vector2(0, -40), 500, easeOutQuint)
          .delay(300).fadeTo(0.7, 500, easeOutQuint)
        // this.fadeBegin(startTime)
        //   .fadeTo(0.7, 500, easeOutQuint)
    }

    public out() {
        const transition = this.transform()
        transition.scaleTo(new Vector2(1, 1), 500, easeOutQuint)
          .moveTo(Vector2.newZero(), 500, easeOutQuint)
          .fadeTo(1, 500, easeOutQuint)
    }

    public updateBackground2(image: ImageBitmap) {
        this.background.updateBackground2(image)
    }

    dispose() {
        super.dispose();
        console.log('background dispose')
    }

}