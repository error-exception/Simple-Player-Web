interface IndexedCollection extends Iterable<number> {
  readonly length: number;
  [index: number]: number;
}

// prettier-ignore
declare type mat3 =
  | [number, number, number,
  number, number, number,
  number, number, number]
  | IndexedCollection;


declare type vec2 = [number, number] | IndexedCollection;

// prettier-ignore
declare type ReadonlyMat3 =
  | readonly [
  number, number, number,
  number, number, number,
  number, number, number
]
  | IndexedCollection;



declare type ReadonlyVec2 = readonly [number, number] | IndexedCollection;