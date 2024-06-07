export function apply<T>(o: T, init: (o: T) => void): T {
  init(o)
  return o
}