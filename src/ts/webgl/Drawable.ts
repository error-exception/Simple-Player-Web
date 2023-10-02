import {IMouseEvent, MouseState} from "../MouseState";
import {Time} from "../Time";
import {Box} from "./Box";
import Coordinate from "./Coordinate";
import {Transform} from "./Transform";
import {FadeTransition, ScaleTransition, TranslateTransition,} from "./Transition";
import {Viewport} from "./Viewport";
import {Bindable} from "./core/Bindable";
import {Disposable} from "./core/Disposable";
import {isUndef} from "./core/Utils";
import {Vector2} from "./core/Vector2";
import {Axis} from "./layout/Axis";
import {provide, unprovide} from "./DependencyInject";

export interface BaseDrawableConfig {
    size: [number | "fill-parent", number | "fill-parent"];
    anchor?: number;
    offset?: [number, number];
    // 设置变换中心
    origin?: number
}

/**
 *
 * Translate Based
 *
 * TopLeft
 * TopCenter
 * TopRight
 * CenterLeft
 * Center
 * CenterRight
 * BottomLeft
 * BottomCenter
 * BottomRight
 *
 * AnchorTo(ParentRect)
 *
 * Rect { Left, Top, Right, Bottom }
 */

export abstract class Drawable<C extends BaseDrawableConfig = BaseDrawableConfig> implements Bindable, Disposable, IMouseEvent {
    /**
     * 通过 Anchor 调整后的变换
     */
    private layoutTransform: Transform = new Transform();
    /**
     * 记录自身的变换
     */
    protected selfTransform: Transform = new Transform();
    /**
     * 最终计算出来的变换
     */
    public appliedTransform: Transform = new Transform();

    public size = new Vector2();
    public position = new Vector2();
    public anchor = Axis.X_CENTER | Axis.Y_CENTER;

    protected parent: Box | null = null;
    protected isAvailable = false;

    protected matrixArray = new Float32Array([
        1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
    ]);

    protected scaleTransition: ScaleTransition = new ScaleTransition(this);
    protected fadeTransition: FadeTransition = new FadeTransition(this);
    protected translateTransition: TranslateTransition =
        new TranslateTransition(this);

    public isVisible = true;

    constructor(
        protected gl: WebGL2RenderingContext,
        protected config: C
    ) {
        this.isAvailable = true;
        this.updateBounding();
        provide(this.constructor.name, this)
    }

    public get width() {
        return this.size.x;
    }

    public get height() {
        return this.size.y;
    }

    public setParent(parent: Box) {
        this.parent = parent;
    }

    public load() {
        this.updateBounding();
        this.onLoad();
    }

    public onLoad() {}

    public updateBounding() {
        let [width, height] = this.config.size;

        this.anchor = isUndef(this.config.anchor)
            ? Axis.X_CENTER | Axis.Y_CENTER
            : this.config.anchor;

        if (width === "fill-parent") {
            width = Coordinate.width;
        }
        if (height === "fill-parent") {
            height = Coordinate.height;
        }

        let x = 0,
            y = 0,
            left = -width / 2,
            top = height / 2;
        const xAxis = Axis.getXAxis(this.anchor);
        const yAxis = Axis.getYAxis(this.anchor);

        if (xAxis === Axis.X_LEFT) {
            x = -Coordinate.width / 2;
        } else if (xAxis === Axis.X_CENTER) {
            x = -width / 2;
        } else if (xAxis === Axis.X_RIGHT) {
            x = Coordinate.width / 2 - width;
        }
        if (yAxis === Axis.Y_TOP) {
            y = Coordinate.height / 2;
        } else if (yAxis === Axis.Y_CENTER) {
            y = height / 2;
        } else if (yAxis === Axis.Y_BOTTOM) {
            y = -Coordinate.height / 2 + height;
        }
        if (this.config.offset) {
            const [ offsetX, offsetY ] = this.config.offset
            x += offsetX
            y += offsetY
        }

        const centerTranslate = new Vector2(x - left, y - top);
        this.position.set(left, top);

        this.size.set(width, height);
        this.layoutTransform.translateTo(centerTranslate);
    }

    /**
     * remove self from parent
     */
    public remove() {
        this.parent?.removeChild(this);
    }

    public scaleBegin(atTime: number = Time.currentTime): ScaleTransition {
        this.scaleTransition.setStartTime(atTime);
        return this.scaleTransition;
    }

    public fadeBegin(atTime: number = Time.currentTime): FadeTransition {
        this.fadeTransition.setStartTime(atTime);
        return this.fadeTransition;
    }

    public translateBegin(
        atTime: number = Time.currentTime
    ): TranslateTransition {
        this.translateTransition.setStartTime(atTime);
        return this.translateTransition;
    }

    public set scale(v: Vector2) {
        this.selfTransform.scaleTo(v);
    }

    public get scale(): Vector2 {
        return this.selfTransform.scale.copy();
    }

    public set translate(v: Vector2) {
        this.selfTransform.translateTo(v);
    }

    public get translate(): Vector2 {
        return this.selfTransform.translate.copy();
    }

    public set alpha(v: number) {
        this.selfTransform.alphaTo(v);
    }

    public get alpha() {
        return this.selfTransform.alpha;
    }

    protected updateTransform() {
        const layoutTransform = this.layoutTransform;
        const selfTransform = this.selfTransform;
        const appliedTransform = this.appliedTransform;
        const parentTransform = this.parent
            ? this.parent.appliedTransform
            : new Transform();

        appliedTransform.translateTo(parentTransform.translate);
        appliedTransform.translateBy(layoutTransform.translate);
        appliedTransform.translateBy(selfTransform.translate);

        appliedTransform.scaleTo(parentTransform.scale);
        appliedTransform.scaleBy(layoutTransform.scale);
        appliedTransform.scaleBy(selfTransform.scale);

        appliedTransform.alphaTo(parentTransform.alpha);
        appliedTransform.alphaBy(layoutTransform.alpha);
        appliedTransform.alphaBy(selfTransform.alpha);

        appliedTransform.extractToMatrix(this.matrixArray);

        this.onTransformApplied();
    }

    protected onTransformApplied() {}

    protected onUpdate() {}

    public update() {
        if (!this.isVisible) {
            return;
        }
        if (this.isAvailable) {
            this.scaleTransition.update(Time.currentTime);
            this.fadeTransition.update(Time.currentTime);
            this.translateTransition.update(Time.currentTime);
        }
        if (this.isAvailable) {
            this.onUpdate();
        }
        if (this.isAvailable) {
            this.updateTransform();
        }
    }

    public draw(): void {
        if (this.isAvailable && this.isVisible) {
            this.bind();
            this.onDraw();
            this.unbind();
        }
    }

    abstract onDraw(): void;

    /**
     *
     * @deprecated
     */
    public setViewport(viewport: Viewport): void {}

    public onWindowResize() {
        this.updateBounding();
    }

    abstract bind(): void;

    public dispose(): void {
        this.isAvailable = false;
        unprovide(this.constructor.name)
    }

    abstract unbind(): void;

    public placeholder() {}

    /**
     * 检查 position 是否在 Drawable 区域内
     * @param position
     */
    public isInBound(position: Vector2) {

        let { x, y } = this.position;
        const { translate, scale } = this.appliedTransform;

        x *= scale.x;
        y *= scale.y;
        x += translate.x;
        y += translate.y;

        return (
            position.x > x &&
            position.x <= x + this.width * scale.x &&
            position.y < y &&
            position.y >= y - this.height * scale.y
        );
    }

    public click(which: number, position: Vector2) {
        if (this.isAvailable && this.isInBound(position)) {
            if ("onClick" in this && typeof this.onClick === "function")
                this.onClick(which);
        }
    }

    public mouseDown(which: number, position: Vector2) {
        if (this.isAvailable && this.isInBound(position)) {
            if (
                "onMouseDown" in this &&
                typeof this.onMouseDown === "function"
            ) {
                this.onMouseDown(which);
            }
        }
    }

    public mouseUp(which: number, position: Vector2) {
        if (this.isAvailable && this.isInBound(position)) {
            if ("onMouseUp" in this && typeof this.onMouseUp === "function") {
                this.onMouseUp(which);
            }
        }
        this.dragLost(which, position);
    }

    public mouseMove(position: Vector2) {
        if (this.isAvailable && this.isInBound(position)) {
            if (
                "onMouseMove" in this &&
                typeof this.onMouseMove === "function"
            ) {
                this.onMouseMove();
            }
            this.hover(position);
            if (MouseState.hasKeyDown()) {
                this.drag(MouseState.which, position);
            }
            return;
        }
        if (this.isDragged) {
            this.drag(MouseState.which, position);
        }
        this.hoverLost(position);
    }

    private isHovered = false;

    public hover(position: Vector2) {
        // if (this.isAvailable && this.isInBound(position)) {
        if (
            "onHover" in this &&
            typeof this.onHover === "function" &&
            !this.isHovered
        ) {
            this.isHovered = true;
            this.onHover();
        }
        // }
    }

    public hoverLost(position: Vector2) {
        if (this.isAvailable && this.isHovered && !this.isInBound(position)) {
            if (
                "onHoverLost" in this &&
                typeof this.onHoverLost === "function"
            ) {
                this.isHovered = false;
                this.onHoverLost();
            }
        }
    }

    private isDragged = false;
    public drag(which: number, position: Vector2) {
        // if (this.isAvailable && this.isInBound(position)) {
        if ("onDrag" in this && typeof this.onDrag === "function") {
            this.isDragged = true;
            this.onDrag(which);
        }
        // }
    }

    public dragLost(which: number, position: Vector2) {
        if (this.isAvailable && this.isDragged) {
            if ("onDragLost" in this && typeof this.onDragLost === "function") {
                this.isDragged = false;
                this.onDragLost();
            }
        }
    }
}
