import {ref, ShallowRef, shallowRef, triggerRef} from "vue";
import {Icon} from "../icon/Icon";

let id = 0
function nextId() {
  if (id >= Number.MAX_SAFE_INTEGER - 10) {
    id = 0
  }
  return id++
}

export class OsuNotification {

  public static messages = shallowRef<RunningTask[]>([])
  public static runningTasks = shallowRef<RunningTask[]>([])
  public static tempQueue = shallowRef<RunningTask[]>([])

  public static removeFrom(r: ShallowRef<RunningTask[]>, item: RunningTask) {
    const index = r.value.indexOf(item)
    index >= 0 && r.value.splice(index, 1)
    triggerRef(r)
  }

  public static clear(r: ShallowRef<RunningTask[]>) {
    r.value.length = 0
    triggerRef(r)
  }

  private static pushTo(r: ShallowRef<RunningTask[]>, item: RunningTask) {
    r.value.push(item)
    triggerRef(r)
  }

  public static push(n: RunningTask) {
    if (n.state === RunningTask.STATE_FINISH) {
      this.pushTo(this.messages, n)
    } else {
      this.pushTo(this.runningTasks, n)
    }
    this.pushTo(this.tempQueue, n)
    setTimeout(() => {
      this.removeFrom(this.tempQueue, n)
    }, 5000)
  }

}

type TaskScope<R> = (task: RunningTask) => Promise<R | undefined>

export class RunningTask {

  public static readonly STATE_WAIT = 0
  public static readonly STATE_RUNNING = 1
  public static readonly STATE_FINISH = 2

  public id = nextId()
  public text = ref("")
  public icon = ref<Icon>(Icon.Check)
  public progress = ref(0)
  public state = RunningTask.STATE_WAIT

  public async run<R>(scope: TaskScope<R>) {
    return scope(this)
  }

  public finish(text: string, icon: Icon = Icon.Info) {
    OsuNotification.removeFrom(OsuNotification.runningTasks, this)
    OsuNotification.removeFrom(OsuNotification.tempQueue, this)
    this.text.value = text
    this.icon.value = icon
    this.state = RunningTask.STATE_FINISH
    this.progress.value = 0
    OsuNotification.push(this)
  }
}

export function notifyMessage(text: string, icon: Icon = Icon.Info) {
  const task = new RunningTask()
  task.text.value = text
  task.icon.value = icon
  task.state = RunningTask.STATE_FINISH
  OsuNotification.push(task)
}

export async function runTask<R>(text: string, scope: TaskScope<R>): Promise<R | undefined> {
  const task = new RunningTask()
  task.text.value = text
  task.state = RunningTask.STATE_RUNNING
  OsuNotification.push(task)
  return task.run<R>(scope)
}

// const task = runTaskLater("downloading", async task => {
//   const response = await fetch("")
//   const reader = response.body!.getReader()
//   const totalLength = parseInt(response.headers.get('Content-Length')!)
//   let len = 0
//   const chunks: Uint8Array[] = []
//   while (true) {
//     const {value, done} = await reader.read()
//     if (done) {
//       break
//     }
//     len += value.length
//     task.progress.value = len / totalLength
//     chunks.push(value)
//   }
//   const all = new Uint8Array(len)
//   let index = 0
//   for (let chunk of chunks) {
//     all.set(chunk, index)
//     index += chunk.length
//   }
//   task.finish("downloaded")
// })