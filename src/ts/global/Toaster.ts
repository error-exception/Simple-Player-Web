import {createMutableSharedFlow} from "../util/flow";

export class Toaster {

    // public static onToast: ((message: string) => void) | null = null

    public static toast = createMutableSharedFlow<string>()

    public static show(message: string) {
        // Toaster.onToast?.(message)
        this.toast.emit(message)
    }

}