
/**
 * A simple dependency injection system for classes.
 */
type Constructor = new (...args: any[]) => any;

const dependencies: Map<Constructor, any> = new Map();

export function inject<T extends Constructor>(constructor: T): InstanceType<T> {
  const instance = dependencies.get(constructor)
  if (!instance) {
    throw new Error(`Dependency not found for ${constructor.name}`);
  }
  return instance as InstanceType<T>;
}

export function addInstance(instance: any): void {
  dependencies.set(instance.constructor, instance);
}

export function removeInstance(instance: any): void {
  dependencies.delete(instance.constructor);
}