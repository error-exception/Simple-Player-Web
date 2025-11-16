import { color, type Color4 } from "../base/Color";
import { almostEquals } from "../graphic/core/Utils";
import { matrix3 } from "../graphic/matrix/mat3";
import { vector2 } from "../graphic/matrix/vec2";
import { Nullable } from '../../type';

/**
 * A transformable object that supports 2D transformations (translate, rotate, scale)
 * and maintains both local and world coordinate systems.
 * 
 * Usage:
 * - Transform properties automatically mark the object as changed
 * - Local matrix is updated automatically when properties change
 * - World matrix is updated based on parent's world matrix
 * - For rendering, call updateWorldMatrixRecursively() on the root object
 * 
 * When inherited by View class:
 * - View should call updateLocalMatrix() before drawing to ensure matrices are current
 * - ViewDrawable should use the worldMatrix for coordinate transformations
 * - For coordinate conversion, use localToWorld() and worldToLocal() methods
 * 
 * Example:
 * ```typescript
 * const parent = new Transformable();
 * const child = new Transformable();
 * parent.add(child);
 * 
 * parent.translate = [100, 50];
 * child.scale = [2, 2];
 * 
 * // Update matrices before rendering
 * parent.updateWorldMatrixRecursively();
 * 
 * // Convert coordinates
 * const worldPos = child.localToWorld([10, 10]);
 * const localPos = child.worldToLocal(worldPos);
 * ```
 */
export class Transformable {

  public localMatrix: mat3 = matrix3.identity(matrix3.create())
  public worldMatrix: mat3 = matrix3.identity(matrix3.create())
  public invertWorldMatrix: mat3 = matrix3.identity(matrix3.create())

  public transformableChildren: Transformable[] = []
  public parentTransformable: Nullable<Transformable> = null
  public transformationChanged: boolean = true

  public _translate: vec2 = vector2.create()
  public _scale: vec2 = vector2.fromValues(1, 1)
  public _rotate: number = 0
  public _color: Color4 = color.clone(color.Black)
  public _alpha: number = 1
  public _actualOrigin: vec2 = vector2.create()

  public get translate() {
    return vector2.clone(this._translate)
  }

  public set translate(t: vec2) {
    this.transformationChanged = this.transformationChanged || !vector2.equals(this._translate, t)
    vector2.copy(this._translate, t)
  }

  public get scale() {
    return vector2.clone(this._scale)
  }

  public set scale(s: vec2) {
    this.transformationChanged = this.transformationChanged || !vector2.equals(this._scale, s)
    vector2.copy(this._scale, s)
  }

  public get color() {
    return color.clone(this._color)
  }

  public set color(c: Color4) {
    color.copy(this._color, c)
  }

  public get translateX() {
    return this._translate[0]
  }

  public set translateX(x: number) {    
    this.transformationChanged = this.transformationChanged || !almostEquals(this._translate[0], x)
    this._translate[0] = x
  }

  public get translateY() {
    return this._translate[1]
  }

  public set translateY(y: number) {
    this.transformationChanged = this.transformationChanged || !almostEquals(this._translate[1], y)
    this._translate[1] = y
  }

  public get scaleX() {
    return this._scale[0]
  }

  public set scaleX(x: number) {
    this.transformationChanged = this.transformationChanged || !almostEquals(this._scale[0], x)
    this._scale[0] = x
  }  

  public get scaleY() {
    return this._scale[1]
  }

  public set scaleY(y: number) {
    this.transformationChanged = this.transformationChanged || !almostEquals(this._scale[1], y)
    this._scale[1] = y
  }

  public get colorR() {
    return this._color[0]
  }

  public set colorR(r: number) {
    this._color[0] = r
  }

  public get colorG() {
    return this._color[1]
  }

  public set colorG(g: number) {
    this._color[1] = g
  }

  public get colorB() {
    return this._color[2]
  }

  public set colorB(b: number) {
    this._color[2] = b
  }

  public get colorA() {
    return this._color[3]
  }

  public set colorA(a: number) {
    this._color[3] = a
  }

  public get alpha() {
    return this._alpha
  }

  public set alpha(a: number) {
    this._alpha = a
  }

  public get rotate() {
    return this._rotate
  }

  public set rotate(r: number) {
    this.transformationChanged = this.transformationChanged || !almostEquals(this._rotate, r)
    this._rotate = r
  }

  public get actualOrigin() {
    return this._actualOrigin
  }

  public set actualOrigin(o: vec2) {
    this.transformationChanged = this.transformationChanged || !vector2.equals(this._actualOrigin, o)
    vector2.copy(this._actualOrigin, o)
  }

  public set width(w: number) {}
  public set height(h: number) {}
  public set size(size: vec2) {}
  public get width(): number { return 0 }
  public get height(): number { return 0 }
  public get size(): vec2 { return vector2.create() }

  public apply(block: (t: this) => void) {
    block(this)
    return this
  }

  public run<T>(block: (t: this) => T) {
    return block(this)
  }

  public addTransformable(child: Transformable) {
    child.parentTransformable = this
    this.transformableChildren.push(child)
  }

  public removeTransformable(child: Transformable) {
    const index = this.transformableChildren.indexOf(child)
    if (index >= 0) {
      this.transformableChildren.splice(index, 1)
      child.parentTransformable = null
    }
  }
  
  public updateWorldMatrix() {
    if (this.transformationChanged) {
      this.updateLocalMatrix()

      if (this.parentTransformable) {
        matrix3.multiply(this.worldMatrix, this.parentTransformable.worldMatrix, this.localMatrix)
      } else {
        matrix3.copy(this.worldMatrix, this.localMatrix)
      }

      matrix3.invert(this.invertWorldMatrix, this.worldMatrix)
      return true
    }

    this.transformationChanged = false
    return false
  }

  /**
   * Recursively updates world matrices for this object and all its children.
   * This should be called when you need to ensure the entire hierarchy has updated world matrices,
   * typically before rendering.
   */
  public updateWorldMatrixRecursively() {
    const updated = this.updateWorldMatrix()
    for (const child of this.transformableChildren) {
      // If current transformable has changed, force update of all children
      child.transformationChanged = child.transformationChanged || updated
      child.updateWorldMatrixRecursively()
    }
  }

  /**
   * Updates the local matrix based on the current transform properties (translate, rotate, scale).
   * This is automatically called when transform properties change and transformationChanged is true.
   * You typically don't need to call this manually unless you want to force an update.
   */
  private updateLocalMatrix() {
    matrix3.identity(this.localMatrix)
    
    // Apply transformations in correct order with transform origin support:
    // 1. Translate to transform origin (T(-origin))
    // 2. Apply scale (S)
    // 3. Apply rotation (R)
    // 4. Apply skew (Skew)
    // 5. Translate back from origin (T(origin))
    // 6. Apply translation (T(translate))
    // 
    // Mathematical order: T(translate) * T(origin) * R * Skew * S * T(-origin)

    // Step 4: Apply skew (if implemented)
    // Note: Skew transformation is not currently implemented in the matrix operations
    // but we keep the property for future implementation

    // Step 6: Apply translation
    matrix3.translate(this.localMatrix, this.localMatrix, this._translate)

    // Step 5: Translate back from transform origin (positive)
    matrix3.translate(this.localMatrix, this.localMatrix, this._actualOrigin)

    // Step 3: Apply rotation
    matrix3.rotate(this.localMatrix, this.localMatrix, this._rotate)

        // Step 2: Apply scale
    const temp = vector2.clone(this._scale)
    if (almostEquals(temp[0], 0)) temp[0] = 1e-5
    if (almostEquals(temp[1], 0)) temp[1] = 1e-5
    matrix3.scale(this.localMatrix, this.localMatrix, temp)

    // Step 1: Translate to transform origin (negative)
    matrix3.translate(this.localMatrix, this.localMatrix, vector2.negate(vector2.create(), this._actualOrigin))
  }

  private shouldUpdateFromRoot = false

  public updateTransformFromRoot() {
    // Propagate the update flag up to the root
    if (this.parentTransformable) {
      this.parentTransformable.shouldUpdateFromRoot = this.shouldUpdateFromRoot || this.transformationChanged
      this.parentTransformable.updateTransformFromRoot()
    } else if (this.shouldUpdateFromRoot || this.transformationChanged) { // Root transformable
      this.updateWorldMatrixRecursively()
      this.shouldUpdateFromRoot = false
    }
  }

  public localToWorld(v: vec2): vec2 {
    this.updateTransformFromRoot()
    return vector2.transformMat3(v, v, this.worldMatrix)
  }

  public worldToLocal(v: vec2): vec2 {
    this.updateTransformFromRoot()
    return vector2.transformMat3(v, v, this.invertWorldMatrix)
  }

}
