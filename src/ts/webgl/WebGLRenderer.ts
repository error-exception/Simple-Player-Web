import {Drawable} from "./drawable/Drawable";
import {Disposable} from "./core/Disposable";
import {MouseState} from "../global/MouseState";
import Coordinate from "./base/Coordinate";

export class WebGLRenderer implements Disposable {

    private readonly drawables: Drawable[] = []
    private readonly disposables: Disposable[] = []
    private readonly gl: WebGL2RenderingContext
    private isViewportChanged: boolean = false
    private isEventReady: boolean = false

    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl
        gl.viewport(0, 0, Coordinate.nativeWidth * window.devicePixelRatio, Coordinate.nativeHeight * window.devicePixelRatio)
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        MouseState.onClick = this.onClick.bind(this)
        MouseState.onMouseMove = this.onMouseMove.bind(this)
        MouseState.onMouseDown = this.onMouseDown.bind(this)
        MouseState.onMouseUp = this.onMouseUp.bind(this)

        Coordinate.onWindowResize = () => {
            this.isViewportChanged = true
        }
    }

    private onClick(which: number) {
        if (!this.isEventReady) return
        for (let i = 0; i < this.drawables.length; i++) {
            this.drawables[i].click(which, MouseState.position)
        }
    }

    private onMouseDown(which: number) {
        if (!this.isEventReady) return
        for (let i = 0; i < this.drawables.length; i++) {
            this.drawables[i].mouseDown(which, MouseState.position)
        }
    }

    private onMouseMove() {
        if (!this.isEventReady) return
        for (let i = 0; i < this.drawables.length; i++) {
            this.drawables[i].mouseMove(MouseState.position)
        }
    }

    private onMouseUp(which: number) {
        if (!this.isEventReady) return
        for (let i = 0; i < this.drawables.length; i++) {
            this.drawables[i].mouseUp(which, MouseState.position)
        }
    }

    public addDrawable(drawable: Drawable) {
        this.drawables.push(drawable)
        drawable.load()
        this.disposables.push(drawable)
    }

    public removeDrawable(drawable: Drawable) {
        let index = this.drawables.indexOf(drawable)
        this.drawables.splice(index, 1)
        index = this.disposables.indexOf(drawable)
        this.disposables.splice(index, 1)
        drawable.dispose()
    }

    public render() {
        this.isEventReady = true
        const gl = this.gl
        if (this.isViewportChanged) {
            this.isViewportChanged = false
            gl.viewport(0, 0, Coordinate.nativeWidth * window.devicePixelRatio, Coordinate.nativeHeight * window.devicePixelRatio)
            for (let i = 0; i < this.drawables.length; i++) {
                this.drawables[i].onWindowResize()
            }
        }
        gl.clear(gl.COLOR_BUFFER_BIT)
        for (let i = 0; i < this.drawables.length; i++) {
            const drawable = this.drawables[i];
            drawable.update()
            drawable.draw()
        }
    }

    public dispose() {
        for (let i = 0; i < this.disposables.length; i++) {
            this.disposables[i].dispose()
        }
    }

}