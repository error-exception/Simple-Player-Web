import {Stack} from "../util/Stack";
import {SingleEvent} from "../util/SingleEvent";
import {playSound, Sound} from "../player/SoundEffect";
import {ref} from "vue";

export interface PanelStack {
  name: string
}

export class OSUPanelStack {

  public static stack: Stack<PanelStack> = new Stack()
  public static panelZIndex = ref(401)

  public static onPanelPushed = new SingleEvent<PanelStack>()
  public static onPanelPopped = new SingleEvent<PanelStack>()
  public static onAllPanelsPopped = new SingleEvent<void>()

  public static push(panel: PanelStack) {
    this.stack.push(panel)
    playSound(Sound.WavePopIn)
    this.onPanelPushed.fire(panel)
    this.panelZIndex.value++
  }

  public static pop() {
    const stack = this.stack
    const panel = stack.pop()
    if (panel) {
      playSound(Sound.WavePopOut)
      this.onPanelPopped.fire(panel)
      this.panelZIndex.value--
    }
    if (stack.size() === 0) {
      this.onAllPanelsPopped.fire()
    }
  }

}