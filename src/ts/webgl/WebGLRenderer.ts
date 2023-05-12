import {Drawable} from "./Drawable";
import {Disposable} from "./core/Disposable";
import {Viewport} from "./Viewport";

export class WebGLRenderer implements Disposable {

    private readonly drawables: Drawable[] = []
    private readonly disposables: Disposable[] = []
    private readonly gl: WebGL2RenderingContext
    private isViewportChanged: boolean = false

    constructor(gl: WebGL2RenderingContext, private viewport: Viewport) {
        this.gl = gl
        gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height)
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }

    public addDrawable(drawable: Drawable) {
        this.drawables.push(drawable)
        drawable.setViewport(this.viewport)
        this.disposables.push(drawable)
    }

    public setViewport(viewport: Viewport) {
        this.viewport = viewport
        this.isViewportChanged = true
    }

    public render() {
        const gl = this.gl
        if (this.isViewportChanged) {
            this.isViewportChanged = false
            gl.viewport(this.viewport.x, this.viewport.y, this.viewport.width, this.viewport.height)
            for (let i = 0; i < this.drawables.length; i++) {
                this.drawables[i].setViewport(this.viewport)
            }
        }
        gl.clear(gl.COLOR_BUFFER_BIT)
        for (let i = 0; i < this.drawables.length; i++) {
            const drawable = this.drawables[i];
            drawable.update()
            // drawable.bind()
            drawable.draw()
            // drawable.unbind()
        }
    }

    public dispose() {
        for (let i = 0; i < this.disposables.length; i++) {
            this.disposables[i].dispose()
        }
    }

}