import {Viewport} from "./Viewport";
import {Bindable} from "./core/Bindable";
import {Disposable} from "./core/Disposable";

export interface Drawable extends Bindable, Disposable {

    draw(): void

    setViewport(viewport: Viewport): void

}