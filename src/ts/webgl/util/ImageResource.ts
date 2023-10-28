import {ImageName, ImageResourceMap} from "./ImageResourceMap";

export const Images: Record<ImageName, HTMLImageElement> = {}

export async function loadImage() {
  for (const imageSrc of ImageResourceMap) {
    const image = new Image()
    image.src = imageSrc.url
    await image.decode()
    Images[imageSrc.name] = image
  }
}