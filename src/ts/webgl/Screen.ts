import {Drawable} from "./Drawable";
import {Disposable} from "./core/Disposable";
import {Alignment, Bound, defaultViewport, Viewport} from "./Viewport";
import {isUndef} from "./core/Utils";
//TODO: 坐标转化，解决横纵坐标轴单位长度不同
export abstract class Screen implements Drawable, Disposable {

    protected x: number = 0
    protected y: number = 0
    protected width: number = 0
    protected height: number = 0
    protected viewport: Viewport = defaultViewport

    constructor(
        private gl: WebGL2RenderingContext,
        protected config: Bound & Alignment
    ) {}

    abstract bind(): void;

    abstract dispose(): void;

    abstract draw(): void;

    public setViewport(viewport: Viewport): void {
        this.viewport = viewport
        const config = this.config
        if (
            isUndef(config.y) && isUndef(config.vertical)
            || isUndef(config.x) && isUndef(config.horizontal)
        ) {
            throw new Error('config error')
        }
        if (this.config.x) {
            this.x = viewport.convertUnitX(this.config.x)
        }
        if (this.config.y) {
            this.y = viewport.convertUnitY(this.config.y)
        }
        this.width = viewport.convertUnitX(this.config.width)
        this.height = viewport.convertUnitY(this.config.height)
        if (this.config.horizontal) {
            this.x = viewport.alignmentX(this.config.horizontal, this.width)
        }
        if (this.config.vertical) {
            this.y = viewport.alignmentY(this.config.vertical, this.height)
        }
    }

    abstract unbind(): void;

}