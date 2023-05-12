export class Toast {

    public static onToast: ((message: string) => void) | null = null

    public static show(message: string) {
        Toast.onToast?.(message)
    }

}