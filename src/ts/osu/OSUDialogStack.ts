import {createVNode, ref, render} from "vue";
import {SingleEvent} from "../util/SingleEvent";
import {playSound, Sound} from "../player/SoundEffect";

export class OSUDialog<Props = undefined, Returned = undefined> {

  public static dialogs: OSUDialog[] = [];
  public static dialogZIndex = ref(601)

  public static getDialog(dialogId: string) {
    const dialog = this.dialogs.find(d => d.dialogId === dialogId);
    if (!dialog) {
      throw new Error(`Dialog with id ${dialogId} not found`);
    }
    return dialog;
  }

  onDataReturned = new SingleEvent<Returned | undefined>()
  public onCloseRequested = new SingleEvent<Returned | undefined>()
  private isDialogShown = false

  constructor(public dialogId: string, public component: any) {
    //@ts-ignore
    OSUDialog.dialogs.push(this)
  }

  private resolve = Promise.resolve()
  show(dialogProps?: Props): Promise<Returned | undefined> {
    if (this.isDialogShown) {
      throw new Error('AlertDialog is already shown')
    }
    playSound(Sound.DialogPopIn)
    OSUDialog.dialogZIndex.value++
    return new Promise(resolve => {
      this.isDialogShown = true
      this.isCloseRequested = false
      const container = document.createElement('div')
      const vNode = createVNode(this.component, dialogProps as any)
      vNode.appContext = null
      render(vNode, container)
      document.body.appendChild(container)
      const dispose = this.onDataReturned.add((result) => {
        this.isDialogShown = false
        this.resolve.then(() => dispose())
        render(null, container)
        OSUDialog.dialogZIndex.value--
        container.remove()
        resolve(result)
      })
    })
  }

  private isCloseRequested = false
  public sendAndClose(data?: Returned): void {
    if (this.isCloseRequested) {
      return
    }
    this.isCloseRequested = true
    playSound(Sound.DialogPopOut)
    this.onCloseRequested.fire(data)
  }
}