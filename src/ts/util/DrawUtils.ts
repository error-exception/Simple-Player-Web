// TODO: complete this method
export function drawScaledImage(context: CanvasRenderingContext2D, image: HTMLImageElement, scale: number) {

    const width = image.width
    const height = image.height
    console.log(width, height)
    const centerX = width / 2
    const centerY = height / 2
    const targetWidth = width * scale
    const targetHeight = height * scale
    context.drawImage(
        image,
        centerX - (targetWidth / 2),
        centerY - (targetHeight / 2),
        targetWidth,
        targetHeight
    )

}