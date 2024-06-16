import {createVNode, render} from "vue";

export function createDialogDynamically<
  Props = void, Returned = void
>(name: string, comp: any = {}) {
  return (props: Props | object = {}): Promise<Returned | null> => new Promise<Returned | null>(resolve => {
    const container = document.createElement('div')
    let isResolved = false;
    (props as any).onVanish = () => {
      render(null, container)
      if (!isResolved) {
        resolve(null)
        isResolved = true
      }
    };
    (props as any).onAction = (result: Returned | null) => {
      if (!isResolved) {
        resolve(result)
        isResolved = true
      }
    }

    const vNode = createVNode(comp, props as any)
    vNode.appContext = null
    render(vNode, container)
  })
}