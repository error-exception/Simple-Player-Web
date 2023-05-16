export class Toaster {

    public static onToast: ((message: string) => void) | null = null

    public static show(message: string) {
        Toaster.onToast?.(message)
    }

}