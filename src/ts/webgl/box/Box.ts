import {type BaseDrawableConfig, Drawable} from "../drawable/Drawable";
import {Queue} from "../../util/Queue";
import {Vector2} from "../core/Vector2";
import {MouseState} from "../../global/MouseState";
import {ArrayUtils} from "../../util/ArrayUtils";
import  {type WebGLRenderer} from "../WebGLRenderer";
import {DrawNode} from "../drawable/DrawNode";

/**
 * todo: use transform instead relative axes
 * todo: 增加重新布局子 Drawable 的功能
 */
export class Box<T extends BaseDrawableConfig = BaseDrawableConfig> extends Drawable<T> {

    protected childrenList: Drawable[] = []
    private posts: Queue<() => void> = new Queue<() => void>()
    public drawNode: BoxDrawNode = new BoxDrawNode(this)

    public add(...children: Drawable[]) {
        for (let i = 0; i < children.length; i++) {
            const child = children[i]
            child.setParent(this)
            this.childrenList.push(child)
        }
    }

    public addFirst(...children: Drawable[]) {
        for (let i = 0; i < children.length; i++) {
            const child = children[i]
            child.setParent(this)
            this.childrenList.unshift(child)
        }
    }

    public removeChild(child: Drawable) {
        const index = this.childrenList.indexOf(child)
        if (index >= 0) {
            console.log("child found, and can be removed, index", index)
            this.childrenList.splice(index, 1)
            child.dispose()
            console.log("has", this.childrenList.length, "child now")
        }
    }

    public removeAllChildren() {
        for (let i = 0; i < this.childrenList.length; i++) {
            this.childrenList[i].dispose()
        }
        this.childrenList.length = 0
    }

    public get firstChild() {
        return this.childrenList[0]
    }

    public get lastChild() {
        return this.childrenList[this.childrenList.length - 1]
    }

    public get childrenCount() {
        return this.childrenList.length
    }

    public childAt(index: number): Drawable | null {
        if (ArrayUtils.inBound(this.childrenList, index)) {
            return this.childrenList[index]
        }
        return null
    }

    public post(call: () => void) {
        this.posts.push(call)
    }

    public load(renderer: WebGLRenderer): void {
        super.load(renderer)
        for (let i = 0; i < this.childrenList.length; i++) {
            this.childrenList[i].load(renderer)
        }
    }

    public onWindowResize(): void {
        super.onWindowResize()
        for (let i = 0; i < this.childrenList.length; i++) {
            this.childrenList[i].onWindowResize()
        }
    }

    public setParent(parent: Box): void {
        super.setParent(parent)
        for (let i = 0; i < this.childrenList.length; i++) {
            this.childrenList[i].setParent(this)
        }
    }

    public update() {
        super.update()
        if (!this.isVisible) {
            return
        }
        if (!this.posts.isEmpty()) {
            console.log("handle post")
            this.posts.foreach((e) => {
                e()
            })
            this.posts.clear()
        }
        this.updateChildren()
    }

    public updateChildren() {
        for (let i = 0; i < this.childrenList.length; i++) {
            this.childrenList[i].update()
        }
    }

    public bind(): void {}

    public dispose(): void {
        super.dispose()
        for (let i = 0; i < this.childrenList.length; i++) {
            this.childrenList[i].dispose()
        }
    }

    public draw(renderer: WebGLRenderer): void {
        if (!this.isVisible) {
            return
        }
        this.bind()
        for (let i = 0; i < this.childrenList.length; i++) {
            this.childrenList[i].draw(renderer)
        }
        this.unbind()
    }

    public onDraw() {}

    public unbind(): void {}

    public click(which: number, position: Vector2) {
        if (this.isAvailable && this.isInBound(position) && this.shouldDraw) {
            if ('onClick' in this && typeof this.onClick === "function")
                this.onClick(which)
        }
        for (let i = this.childrenList.length - 1; i >= 0; i--) {
            this.childrenList[i].click(which, position)
        }
    }

    public mouseDown(which: number, position: Vector2) {
        if (this.isAvailable && this.isInBound(position) && this.shouldDraw) {
            if ('onMouseDown' in this && typeof this.onMouseDown === "function") {
                this.onMouseDown(which)
            }

        }
        for (let i = this.childrenList.length - 1; i >= 0; i--) {
            this.childrenList[i].mouseDown(which, position)
        }
    }

    public mouseUp(which: number, position: Vector2) {
        if (this.isAvailable && this.isInBound(position) && this.shouldDraw) {
            if ('onMouseUp' in this && typeof this.onMouseUp === "function") {
                this.onMouseUp(which)
            }

        }
        this.dragLost(which, position)
        for (let i = this.childrenList.length - 1; i >= 0; i--) {
            this.childrenList[i].mouseUp(which, position)
        }
    }

    public mouseMove(position: Vector2) {
        if (this.isAvailable && this.isInBound(position) && this.shouldDraw) {
            if ('onMouseMove' in this && typeof this.onMouseMove === "function") {
                this.onMouseMove()
            }
            this.hover(position)
            if (MouseState.hasKeyDown()) {
                this.drag(MouseState.which, position)
            }
        } else {

            if (this.#isDragged) {
                this.drag(MouseState.which, position)
            }
            this.hoverLost(position)
        }
        for (let i = this.childrenList.length - 1; i >= 0; i--) {
            this.childrenList[i].mouseMove(position)
        }
    }

    #isHovered = false

    public hover(position: Vector2) {
        if (this.isAvailable && this.isInBound(position) && this.shouldDraw) {
            if ('onHover' in this && typeof this.onHover === "function" && !this.#isHovered) {
                this.#isHovered = true
                this.onHover()
            }
        }
    }

    public hoverLost(position: Vector2) {
        if (this.isAvailable && this.#isHovered && !this.isInBound(position)) {
            if ('onHoverLost' in this && typeof this.onHoverLost === "function") {
                this.#isHovered = false
                this.onHoverLost()
            }
        }
    }

    #isDragged = false
    public drag(which: number, position: Vector2) {
        if (this.isAvailable && this.isInBound(position) && this.shouldDraw) {
            if ('onDrag' in this && typeof this.onDrag === "function") {
                this.#isDragged = true
                this.onDrag(which)
            }
        }
    }

    public dragLost(which: number, position: Vector2) {
        if (this.isAvailable && this.#isDragged) {
            if ('onDragLost' in this && typeof this.onDragLost === "function") {
                this.#isDragged = false
                this.onDragLost()
            }
        }
    }
}

class BoxDrawNode extends DrawNode {
    draw(renderer: WebGLRenderer) {
        for (let i = 0; i < this.childrenNodes.length; i++) {
            this.childrenNodes[i].draw(renderer)
        }
    }
}