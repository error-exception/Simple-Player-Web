type Id = string | number | symbol

const dependencyMap: Record<Id, any> = {}

export function inject<T>(id: Id): T {
    const dep = dependencyMap[id]
    if (dep === undefined) {
        throw new Error('no dep found')
    }
    return dep
}

export function provide(id: Id, a: any) {
    dependencyMap[id] = a
}

export function unprovide(id: Id) {
    if (id in dependencyMap) {
        delete dependencyMap[id]
    }
}