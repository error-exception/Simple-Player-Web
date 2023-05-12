import {Drawable} from "./Drawable";
import {Viewport} from "./Viewport";
import {ArrayUtils} from "../Utils";
import {Queue} from "../util/Queue";

export class Box extends Drawable {

    protected childrenList: Drawable[] = []
    private posts: Queue<() => void> = new Queue<() => void>()

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
            ArrayUtils.removeAt(this.childrenList, index)
            child.dispose()
            console.log("has", this.childrenList.length, "child now")
        }
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

    public draw(): void {
        for (let i = 0; i < this.childrenList.length; i++) {
            this.childrenList[i].draw()
        }
    }

    public onDraw() {}

    public unbind(): void {}

    public setViewport(viewport: Viewport) {
        super.setViewport(viewport)
        for (let i = 0; i < this.childrenList.length; i++) {
            this.childrenList[i].setViewport(viewport)
        }
    }

}