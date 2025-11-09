export class LayoutMember {

  public tag: string = ''
  private _isValid = false

  constructor(public invalidation: number) {
  }

  public invalidate() {
    this._isValid = false
  }

  public isValid() {
    return this._isValid
  }

  public validate() {
    this._isValid = true
  }

}

export class LayoutValue<T = any> extends LayoutMember {

  private _value!: T

  constructor(public invalidation: number, private valueProducer: () => T) {
    super(invalidation)
  }

  get value() {
    if (!this.isValid()) {
      this._value = this.valueProducer()
      this.validate()
    }
    return this._value
  }

  // set value(v: T) {
  //   this._value = v
  //   this.validate()
  // }

}