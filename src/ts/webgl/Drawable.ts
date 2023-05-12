import {Alignment, Bound, defaultViewport, Viewport} from "./Viewport";
import {Bindable} from "./core/Bindable";
import {Disposable} from "./core/Disposable";
import {isUndef} from "./core/Utils";
import {Vector2} from "./core/Vector2";
import {Matrix3} from "./core/Matrix3";
import {TransformUtils} from "./core/TransformUtils";
import {FadeTransition, ScaleTransition} from "./Transition";
import {Time} from "../Time";
import {Box} from "./Box";

export interface BaseDrawableConfig extends Alignment, Bound {}

export abstract class Drawable implements Bindable, Disposable {

    protected viewport: Viewport = defaultViewport
    protected position: Vector2 = Vector2.newZero()
    protected size: Vector2 = Vector2.newZero()

    protected _scale: Vector2 = new Vector2(1, 1)
    protected _translate: Vector2 = Vector2.newZero()
    protected _alpha: number = 1

    protected appliedScale: Vector2 = new Vector2(1, 1)
    protected appliedTranslate: Vector2 = Vector2.newZero()
    protected appliedAlpha: number = 1

    protected parent: Box | null = null
    protected isAvailable = false

    protected coordinateScale = TransformUtils.scale(
        2 / this.viewport.width,
        2 / this.viewport.height
    )

    protected transformMatrix: Matrix3 = Matrix3.newIdentify()
    protected matrixArray = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ])

    protected scaleTransition: ScaleTransition = new ScaleTransition(this)
    protected fadeTransition: FadeTransition = new FadeTransition(this)

    constructor(
        protected gl: WebGL2RenderingContext,
        protected config: BaseDrawableConfig
    ) {
        this.isAvailable = true
    }

    public setParent(parent: Box) {
        this.parent = parent
    }

    public remove() {
        this.parent?.removeChild(this)
    }

    public scaleBegin(atTime: number = Time.currentTime): ScaleTransition {
        this.scaleTransition.setStartTime(atTime)
        return this.scaleTransition
    }

    public fadeBegin(atTime: number = Time.currentTime): FadeTransition {
        this.fadeTransition.setStartTime(atTime)
        return this.fadeTransition
    }

    public set scale(v: Vector2) {
        this._scale.x = v.x
        this._scale.y = v.y
    }

    public get scale(): Vector2 {
        return new Vector2(this._scale.x, this._scale.y)
    }

    public set translate(v: Vector2) {
        this._translate.x = v.x
        this._translate.y = v.y
    }

    public get translate(): Vector2 {
        return new Vector2(this._translate.x, this._translate.y)
    }

    public set alpha(v: number) {
        this._alpha = v
    }

    public get alpha() {
        return this._alpha
    }

    protected updateTransform() {
        const matrix = this.transformMatrix
        const translate = this.translate
        translate.x += (this.parent?.appliedTranslate.x ?? 0)
        translate.y += (this.parent?.appliedTranslate.y ?? 0)

        this.appliedTranslate.x = translate.x
        this.appliedTranslate.y = translate.y

        TransformUtils.applyOrigin(translate, this.coordinateScale)
        matrix.M13 = translate.x
        matrix.M23 = translate.y

        this.appliedScale.x = this._scale.x * (this.parent?.appliedScale.x ?? 1)
        this.appliedScale.y = this._scale.y * (this.parent?.appliedScale.y ?? 1)

        matrix.M11 = this.appliedScale.x
        matrix.M22 = this.appliedScale.y
        const array = this.matrixArray
        array[0] = matrix.M11
        array[5] = matrix.M22
        array[3] = matrix.M13
        array[7] = matrix.M23

        this.appliedAlpha = this._alpha * (this.parent?.appliedAlpha ?? 1)

        this.onTransformApplied()
    }

    protected onTransformApplied() {}

    protected onUpdate() {}

    public update() {
        if (this.isAvailable) {
            this.scaleTransition.update(Time.currentTime)
            this.fadeTransition.update(Time.currentTime)
        }
        if (this.isAvailable) {
            this.onUpdate()
        }
        if (this.isAvailable) {
            this.updateTransform()
        }
    }

    public draw(): void {
        if (this.isAvailable) {
            this.bind()
            this.onDraw()
            this.unbind()
        }
    }

    abstract onDraw(): void

    public setViewport(viewport: Viewport): void {
        this.viewport = viewport
        this.coordinateScale = TransformUtils.scale(
            2 / viewport.width,
            2 / viewport.height
        )
        const config = this.config
        if (
            isUndef(config.y) && isUndef(config.vertical)
            || isUndef(config.x) && isUndef(config.horizontal)
        ) {
            throw new Error('config error')
        }
        if (this.config.x) {
            this.position.x = viewport.convertUnitX(this.config.x)
        }
        if (this.config.y) {
            this.position.y = viewport.convertUnitY(this.config.y)
        }
        this.size.x = viewport.convertUnitX(this.config.width)
        this.size.y = viewport.convertUnitY(this.config.height)
        if (this.config.horizontal) {
            this.position.x = viewport.alignmentX(this.config.horizontal, this.size.x)
        }
        if (this.config.vertical) {
            this.position.y = viewport.alignmentY(this.config.vertical, this.size.y)
        }
    }

    abstract bind(): void;

    public dispose(): void {
        this.isAvailable = false
    }

    abstract unbind(): void;

}