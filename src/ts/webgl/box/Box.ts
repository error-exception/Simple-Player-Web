import {type BaseDrawableConfig, Drawable} from "../drawable/Drawable";
import {Queue} from "../../util/Queue";
import {ArrayUtils} from "../../util/ArrayUtils";
import {type WebGLRenderer} from "../WebGLRenderer";
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

}

class BoxDrawNode extends DrawNode {
    draw(renderer: WebGLRenderer) {
        for (let i = 0; i < this.childrenNodes.length; i++) {
            this.childrenNodes[i].draw(renderer)
        }
    }
}