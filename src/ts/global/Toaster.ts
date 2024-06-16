import {SingleEvent} from "../util/SingleEvent";

export class Toaster {

    public static onToast = new SingleEvent<string>()

    public static show(message: string) {
        this.onToast.fire(message)
    }

}