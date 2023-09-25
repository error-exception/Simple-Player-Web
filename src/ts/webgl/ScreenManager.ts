import {Drawable} from "./Drawable";
import {WebGLRenderer} from "./WebGLRenderer";
import {Disposable} from "./core/Disposable";

class ScreenManager implements Disposable {

    private readonly screenMap = new Map<string, () => Drawable>();

    private currentScreen: Drawable | null = null;
    private currentId: string = ''
    private renderer: WebGLRenderer | null = null;

    public init(renderer: WebGLRenderer) {
        this.renderer = renderer;
        return this
    }

    public addScreen(id: string, screenConstructor: () => Drawable) {
        if (id === '') {
            throw Error("id cannot be empty")
        }
        this.screenMap.set(id, screenConstructor);
        return this
    }

    public removeScreen(id: string) {
        this.screenMap.delete(id);
    }

    public activeScreen(id: string) {
        if (this.currentId === id) {
            return
        }
        const constructor = this.screenMap.get(id);
        if (constructor) {
            if (this.currentScreen) {
                this.renderer!.removeDrawable(this.currentScreen);
            }
            this.currentScreen = constructor()
            this.currentId = id
            this.renderer!.addDrawable(this.currentScreen)
        }
    }

    public dispose(): void {
        this.currentScreen?.dispose();
        this.screenMap.clear();
    }
}

export default new ScreenManager()