import * as glMatrix from "./common.js";
import { Vector2 } from "../core/Vector2";

/**
 * 2 Dimensional Vector
 * @module vec2
 */

export namespace vector2 {

  /**
   * Creates a new, empty vec2
   *
   * @returns {vec2} a new 2D vector
   */
  export function create(): vec2 {
    let out = new glMatrix.ARRAY_TYPE(2);
    if (glMatrix.ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
    }
    return out;
  }

  /**
   * Creates a new vec2 initialized with values from an existing vector
   *
   * @param {ReadonlyVec2} a vector to clone
   * @returns {vec2} a new 2D vector
   */
  export function clone(a: ReadonlyVec2): vec2 {
    let out = new glMatrix.ARRAY_TYPE(2);
    out[0] = a[0];
    out[1] = a[1];
    return out;
  }

  /**
   * Creates a new vec2 initialized with the given values
   *
   * @param {Number} x X component
   * @param {Number} y Y component
   * @returns {vec2} a new 2D vector
   */
  export function fromValues(x: number, y: number): vec2 {
    let out = new glMatrix.ARRAY_TYPE(2);
    out[0] = x;
    out[1] = y;
    return out;
  }

  /**
   * Copy the values from one vec2 to another
   *
   * @param {vec2} out the receiving vector
   * @param {ReadonlyVec2} a the source vector
   * @returns {vec2} out
   */
  export function copy(out: vec2, a: ReadonlyVec2): vec2 {
    out[0] = a[0];
    out[1] = a[1];
    return out;
  }

  /**
   * Set the components of a vec2 to the given values
   *
   * @param {vec2} out the receiving vector
   * @param {Number} x X component
   * @param {Number} y Y component
   * @returns {vec2} out
   */
  export function set(out: vec2, x: number, y: number): vec2 {
    out[0] = x;
    out[1] = y;
    return out;
  }

  /**
   * Adds two vec2's
   *
   * @param {vec2} out the receiving vector
   * @param {ReadonlyVec2} a the first operand
   * @param {ReadonlyVec2} b the second operand
   * @returns {vec2} out
   */
  export function add(out: vec2, a: vec2, b: vec2): vec2 {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    return out;
  }

  export function addValue(out: vec2, a: vec2, b: number): vec2 {
    out[0] = a[0] + b;
    out[1] = a[1] + b;
    return out;
  }

  /**
   * Subtracts vector b from vector a
   *
   * @param {vec2} out the receiving vector
   * @param {ReadonlyVec2} a the first operand
   * @param {ReadonlyVec2} b the second operand
   * @returns {vec2} out
   */
  export function subtract(out: vec2, a: vec2, b: vec2): vec2 {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    return out;
  }

  export function subtractValue(out: vec2, a: vec2, b: number): vec2 {
    out[0] = a[0] - b;
    out[1] = a[1] - b;
    return out;
  }

  /**
   * Multiplies two vec2's
   *
   * @param {vec2} out the receiving vector
   * @param {ReadonlyVec2} a the first operand
   * @param {ReadonlyVec2} b the second operand
   * @returns {vec2} out
   */
  export function multiply(out: vec2, a: vec2, b: vec2): vec2 {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    return out;
  }

  export function multiplyScalar(out: vec2, a: vec2, b: number): vec2 {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    return out;
  }

  /**
   * Divides two vec2's
   *
   * @param {vec2} out the receiving vector
   * @param {ReadonlyVec2} a the first operand
   * @param {ReadonlyVec2} b the second operand
   * @returns {vec2} out
   */
  export function divide(out: vec2, a: vec2, b: vec2): vec2 {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    return out;
  }

  export function divideScalar(out: vec2, a: vec2, b: number): vec2 {
    out[0] = a[0] / b;
    out[1] = a[1] / b;
    return out;
  }

  /**
   * Scales a vec2 by a scalar number
   *
   * @param {vec2} out the receiving vector
   * @param {ReadonlyVec2} a the vector to scale
   * @param {Number} b amount to scale the vector by
   * @returns {vec2} out
   */
  export function scale(out: vec2, a: ReadonlyVec2, b: number): vec2 {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    return out;
  }

  /**
   * Adds two vec2's after scaling the second operand by a scalar value
   *
   * @param {vec2} out the receiving vector
   * @param {ReadonlyVec2} a the first operand
   * @param {ReadonlyVec2} b the second operand
   * @param {Number} scale the amount to scale b by before adding
   * @returns {vec2} out
   */
  export function scaleAndAdd(out: vec2, a: ReadonlyVec2, b: ReadonlyVec2, scale: number): vec2 {
    out[0] = a[0] + b[0] * scale;
    out[1] = a[1] + b[1] * scale;
    return out;
  }

  /**
   * Calculates the euclidian distance between two vec2's
   *
   * @param {ReadonlyVec2} a the first operand
   * @param {ReadonlyVec2} b the second operand
   * @returns {Number} distance between a and b
   */
  export function distance(a: ReadonlyVec2, b: ReadonlyVec2): number {
    const x = b[0] - a[0],
      y = b[1] - a[1];
    return Math.sqrt(x * x + y * y);
  }


  /**
   * Calculates the length of a vec2
   *
   * @param {ReadonlyVec2} a vector to calculate length of
   * @returns {Number} length of a
   */
  export function length(a: ReadonlyVec2): number {
    const x = a[0],
      y = a[1];
    return Math.sqrt(x * x + y * y);
  }

  /**
   * Negates the components of a vec2
   *
   * @param {vec2} out the receiving vector
   * @param {ReadonlyVec2} a vector to negate
   * @returns {vec2} out
   */
  export function negate(out: vec2, a: ReadonlyVec2): vec2 {
    out[0] = -a[0];
    out[1] = -a[1];
    return out;
  }

  /**
 * Inverts a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the source matrix
 * @returns {mat3 | null} out, or null if source matrix is not invertible
 */
  export function invert(out: mat3, a: ReadonlyMat3): mat3 | null {
    let a00 = a[0],
      a01 = a[1],
      a02 = a[2];
    let a10 = a[3],
      a11 = a[4],
      a12 = a[5];
    let a20 = a[6],
      a21 = a[7],
      a22 = a[8];

    let b01 = a22 * a11 - a12 * a21;
    let b11 = -a22 * a10 + a12 * a20;
    let b21 = a21 * a10 - a11 * a20;

    // Calculate the determinant
    let det = a00 * b01 + a01 * b11 + a02 * b21;

    if (!det) {
      return null;
    }
    det = 1.0 / det;

    out[0] = b01 * det;
    out[1] = (-a22 * a01 + a02 * a21) * det;
    out[2] = (a12 * a01 - a02 * a11) * det;
    out[3] = b11 * det;
    out[4] = (a22 * a00 - a02 * a20) * det;
    out[5] = (-a12 * a00 + a02 * a10) * det;
    out[6] = b21 * det;
    out[7] = (-a21 * a00 + a01 * a20) * det;
    out[8] = (a11 * a00 - a01 * a10) * det;
    return out;
  }


  /**
   * Transforms the vec2 with a mat3
   * 3rd vector component is implicitly '1'
   *
   * @param {vec2} out the receiving vector
   * @param {vec2} a the vector to transform
   * @param {ReadonlyMat3} m matrix to transform with
   * @returns {vec2} out
   */
  export function transformMat3(out: vec2, a: vec2, m: ReadonlyMat3): vec2 {
    const x = a[0],
      y = a[1];
    out[0] = m[0] * x + m[3] * y + m[6];
    out[1] = m[1] * x + m[4] * y + m[7];
    return out;
  }


  /**
   * Rotate a 2D vector
   * @param {vec2} out The receiving vec2
   * @param {ReadonlyVec2} a The vec2 point to rotate
   * @param {ReadonlyVec2} b The origin of the rotation
   * @param {Number} rad The angle of rotation in radians
   * @returns {vec2} out
   */
  export function rotate(out: Vector2, a: Vector2, b: Vector2, rad: number): Vector2 {
    //Translate point to the origin
    let p0 = a.x - b.x,
      p1 = a.y - b.y,
      sinC = Math.sin(rad),
      cosC = Math.cos(rad);

    //perform rotation and translate to correct position
    out.x = p0 * cosC - p1 * sinC + b.x;
    out.y = p0 * sinC + p1 * cosC + b.y;

    return out;
  }

  /**
   * Get the angle between two 2D vectors
   * @param {ReadonlyVec2} a The first operand
   * @param {ReadonlyVec2} b The second operand
   * @returns {Number} The angle in radians
   */
  export function angle(a: ReadonlyVec2, b: ReadonlyVec2): number {
    let x1 = a[0],
      y1 = a[1],
      x2 = b[0],
      y2 = b[1],
      // mag is the product of the magnitudes of a and b
      mag = Math.sqrt((x1 * x1 + y1 * y1) * (x2 * x2 + y2 * y2)),
      // mag &&.. short circuits if mag == 0
      cosine = mag && (x1 * x2 + y1 * y2) / mag;
    // Math.min(Math.max(cosine, -1), 1) clamps the cosine between -1 and 1
    return Math.acos(Math.min(Math.max(cosine, -1), 1));
  }

  /**
   * Returns whether or not the vectors exactly have the same elements in the same position (when compared with ===)
   *
   * @param {ReadonlyVec2} a The first vector.
   * @param {ReadonlyVec2} b The second vector.
   * @returns {Boolean} True if the vectors are equal, false otherwise.
   */
  export function exactEquals(a: ReadonlyVec2, b: ReadonlyVec2): boolean {
    return a[0] === b[0] && a[1] === b[1];
  }

  /**
   * Returns whether or not the vectors have approximately the same elements in the same position.
   *
   * @param {ReadonlyVec2} a The first vector.
   * @param {ReadonlyVec2} b The second vector.
   * @returns {Boolean} True if the vectors are equal, false otherwise.
   */
  export function equals(a: ReadonlyVec2, b: ReadonlyVec2) {
    let a0 = a[0],
      a1 = a[1];
    let b0 = b[0],
      b1 = b[1];
    return (
      Math.abs(a0 - b0) <=
      glMatrix.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
      Math.abs(a1 - b1) <=
      glMatrix.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1))
    );
  }

  export function middle(out: vec2, a: ReadonlyVec2, b: ReadonlyVec2) {
    out[0] = (a[0] + b[0]) / 2;
    out[1] = (a[1] + b[1]) / 2;
    return out;
  }


}