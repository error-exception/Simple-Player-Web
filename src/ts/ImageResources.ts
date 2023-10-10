import {ResourceCache} from "./ResourceCache";

export class ImageLoader {

    public static cache = new ResourceCache<string, HTMLImageElement>(16)

    public static get(key: string): HTMLImageElement {
        return this.cache.get(key)!
    }

    public static async load(url: string, alias: string): Promise<HTMLImageElement> {
        const cache = this.cache
        let image = cache.get(url)
        if (image !== undefined) {
            return image
        }
        image = new Image()
        image.src = url
        await image.decode()
        cache.put(alias, image)
        return image
    }
}