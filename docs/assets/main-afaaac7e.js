(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link2 of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link2);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link2) {
    const fetchOpts = {};
    if (link2.integrity)
      fetchOpts.integrity = link2.integrity;
    if (link2.referrerPolicy)
      fetchOpts.referrerPolicy = link2.referrerPolicy;
    if (link2.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link2.crossOrigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link2) {
    if (link2.ep)
      return;
    link2.ep = true;
    const fetchOpts = getFetchOpts(link2);
    fetch(link2.href, fetchOpts);
  }
})();
function makeMap(str, expectsLowerCase) {
  const map2 = /* @__PURE__ */ Object.create(null);
  const list2 = str.split(",");
  for (let i = 0; i < list2.length; i++) {
    map2[list2[i]] = true;
  }
  return expectsLowerCase ? (val) => !!map2[val.toLowerCase()] : (val) => !!map2[val];
}
const EMPTY_OBJ = {};
const EMPTY_ARR = [];
const NOOP = () => {
};
const NO = () => false;
const onRE = /^on[^a-z]/;
const isOn = (key) => onRE.test(key);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend = Object.assign;
const remove = (arr, el) => {
  const i = arr.indexOf(el);
  if (i > -1) {
    arr.splice(i, 1);
  }
};
const hasOwnProperty$1 = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty$1.call(val, key);
const isArray = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isDate = (val) => toTypeString(val) === "[object Date]";
const isFunction$1 = (val) => typeof val === "function";
const isString$3 = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject$1 = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return isObject$1(val) && isFunction$1(val.then) && isFunction$1(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString$3(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
);
const cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction(
  (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
);
const capitalize = cacheStringFunction(
  (str) => str.charAt(0).toUpperCase() + str.slice(1)
);
const toHandlerKey = cacheStringFunction(
  (str) => str ? `on${capitalize(str)}` : ``
);
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns = (fns, arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](arg);
  }
};
const def = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value
  });
};
const looseToNumber = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
};
const toNumber = (val) => {
  const n = isString$3(val) ? Number(val) : NaN;
  return isNaN(n) ? val : n;
};
let _globalThis;
const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
};
function normalizeStyle(value) {
  if (isArray(value)) {
    const res = {};
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const normalized = isString$3(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString$3(value)) {
    return value;
  } else if (isObject$1(value)) {
    return value;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:([^]+)/;
const styleCommentRE = /\/\*[^]*?\*\//g;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function normalizeClass(value) {
  let res = "";
  if (isString$3(value)) {
    res = value;
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject$1(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
function includeBooleanAttr(value) {
  return !!value || value === "";
}
function looseCompareArrays(a, b) {
  if (a.length !== b.length)
    return false;
  let equal = true;
  for (let i = 0; equal && i < a.length; i++) {
    equal = looseEqual(a[i], b[i]);
  }
  return equal;
}
function looseEqual(a, b) {
  if (a === b)
    return true;
  let aValidType = isDate(a);
  let bValidType = isDate(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? a.getTime() === b.getTime() : false;
  }
  aValidType = isSymbol(a);
  bValidType = isSymbol(b);
  if (aValidType || bValidType) {
    return a === b;
  }
  aValidType = isArray(a);
  bValidType = isArray(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? looseCompareArrays(a, b) : false;
  }
  aValidType = isObject$1(a);
  bValidType = isObject$1(b);
  if (aValidType || bValidType) {
    if (!aValidType || !bValidType) {
      return false;
    }
    const aKeysCount = Object.keys(a).length;
    const bKeysCount = Object.keys(b).length;
    if (aKeysCount !== bKeysCount) {
      return false;
    }
    for (const key in a) {
      const aHasKey = a.hasOwnProperty(key);
      const bHasKey = b.hasOwnProperty(key);
      if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a[key], b[key])) {
        return false;
      }
    }
  }
  return String(a) === String(b);
}
function looseIndexOf(arr, val) {
  return arr.findIndex((item) => looseEqual(item, val));
}
const toDisplayString = (val) => {
  return isString$3(val) ? val : val == null ? "" : isArray(val) || isObject$1(val) && (val.toString === objectToString || !isFunction$1(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (val && val.__v_isRef) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val2]) => {
        entries[`${key} =>`] = val2;
        return entries;
      }, {})
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()]
    };
  } else if (isObject$1(val) && !isArray(val) && !isPlainObject(val)) {
    return String(val);
  }
  return val;
};
let activeEffectScope;
class EffectScope {
  constructor(detached = false) {
    this.detached = detached;
    this._active = true;
    this.effects = [];
    this.cleanups = [];
    this.parent = activeEffectScope;
    if (!detached && activeEffectScope) {
      this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
        this
      ) - 1;
    }
  }
  get active() {
    return this._active;
  }
  run(fn) {
    if (this._active) {
      const currentEffectScope = activeEffectScope;
      try {
        activeEffectScope = this;
        return fn();
      } finally {
        activeEffectScope = currentEffectScope;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    activeEffectScope = this;
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    activeEffectScope = this.parent;
  }
  stop(fromParent) {
    if (this._active) {
      let i, l;
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].stop();
      }
      for (i = 0, l = this.cleanups.length; i < l; i++) {
        this.cleanups[i]();
      }
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].stop(true);
        }
      }
      if (!this.detached && this.parent && !fromParent) {
        const last = this.parent.scopes.pop();
        if (last && last !== this) {
          this.parent.scopes[this.index] = last;
          last.index = this.index;
        }
      }
      this.parent = void 0;
      this._active = false;
    }
  }
}
function effectScope(detached) {
  return new EffectScope(detached);
}
function recordEffectScope(effect, scope2 = activeEffectScope) {
  if (scope2 && scope2.active) {
    scope2.effects.push(effect);
  }
}
function getCurrentScope() {
  return activeEffectScope;
}
const createDep = (effects) => {
  const dep = new Set(effects);
  dep.w = 0;
  dep.n = 0;
  return dep;
};
const wasTracked = (dep) => (dep.w & trackOpBit) > 0;
const newTracked = (dep) => (dep.n & trackOpBit) > 0;
const initDepMarkers = ({ deps }) => {
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].w |= trackOpBit;
    }
  }
};
const finalizeDepMarkers = (effect) => {
  const { deps } = effect;
  if (deps.length) {
    let ptr = 0;
    for (let i = 0; i < deps.length; i++) {
      const dep = deps[i];
      if (wasTracked(dep) && !newTracked(dep)) {
        dep.delete(effect);
      } else {
        deps[ptr++] = dep;
      }
      dep.w &= ~trackOpBit;
      dep.n &= ~trackOpBit;
    }
    deps.length = ptr;
  }
};
const targetMap = /* @__PURE__ */ new WeakMap();
let effectTrackDepth = 0;
let trackOpBit = 1;
const maxMarkerBits = 30;
let activeEffect;
const ITERATE_KEY = Symbol("");
const MAP_KEY_ITERATE_KEY = Symbol("");
class ReactiveEffect {
  constructor(fn, scheduler = null, scope2) {
    this.fn = fn;
    this.scheduler = scheduler;
    this.active = true;
    this.deps = [];
    this.parent = void 0;
    recordEffectScope(this, scope2);
  }
  run() {
    if (!this.active) {
      return this.fn();
    }
    let parent = activeEffect;
    let lastShouldTrack = shouldTrack;
    while (parent) {
      if (parent === this) {
        return;
      }
      parent = parent.parent;
    }
    try {
      this.parent = activeEffect;
      activeEffect = this;
      shouldTrack = true;
      trackOpBit = 1 << ++effectTrackDepth;
      if (effectTrackDepth <= maxMarkerBits) {
        initDepMarkers(this);
      } else {
        cleanupEffect(this);
      }
      return this.fn();
    } finally {
      if (effectTrackDepth <= maxMarkerBits) {
        finalizeDepMarkers(this);
      }
      trackOpBit = 1 << --effectTrackDepth;
      activeEffect = this.parent;
      shouldTrack = lastShouldTrack;
      this.parent = void 0;
      if (this.deferStop) {
        this.stop();
      }
    }
  }
  stop() {
    if (activeEffect === this) {
      this.deferStop = true;
    } else if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}
function cleanupEffect(effect2) {
  const { deps } = effect2;
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect2);
    }
    deps.length = 0;
  }
}
let shouldTrack = true;
const trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function track(target, type, key) {
  if (shouldTrack && activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = createDep());
    }
    trackEffects(dep);
  }
}
function trackEffects(dep, debuggerEventExtraInfo) {
  let shouldTrack2 = false;
  if (effectTrackDepth <= maxMarkerBits) {
    if (!newTracked(dep)) {
      dep.n |= trackOpBit;
      shouldTrack2 = !wasTracked(dep);
    }
  } else {
    shouldTrack2 = !dep.has(activeEffect);
  }
  if (shouldTrack2) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
  }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let deps = [];
  if (type === "clear") {
    deps = [...depsMap.values()];
  } else if (key === "length" && isArray(target)) {
    const newLength = Number(newValue);
    depsMap.forEach((dep, key2) => {
      if (key2 === "length" || key2 >= newLength) {
        deps.push(dep);
      }
    });
  } else {
    if (key !== void 0) {
      deps.push(depsMap.get(key));
    }
    switch (type) {
      case "add":
        if (!isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if (isIntegerKey(key)) {
          deps.push(depsMap.get("length"));
        }
        break;
      case "delete":
        if (!isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        }
        break;
      case "set":
        if (isMap(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
        }
        break;
    }
  }
  if (deps.length === 1) {
    if (deps[0]) {
      {
        triggerEffects(deps[0]);
      }
    }
  } else {
    const effects = [];
    for (const dep of deps) {
      if (dep) {
        effects.push(...dep);
      }
    }
    {
      triggerEffects(createDep(effects));
    }
  }
}
function triggerEffects(dep, debuggerEventExtraInfo) {
  const effects = isArray(dep) ? dep : [...dep];
  for (const effect2 of effects) {
    if (effect2.computed) {
      triggerEffect(effect2);
    }
  }
  for (const effect2 of effects) {
    if (!effect2.computed) {
      triggerEffect(effect2);
    }
  }
}
function triggerEffect(effect2, debuggerEventExtraInfo) {
  if (effect2 !== activeEffect || effect2.allowRecurse) {
    if (effect2.scheduler) {
      effect2.scheduler();
    } else {
      effect2.run();
    }
  }
}
const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
);
const get$1 = /* @__PURE__ */ createGetter();
const shallowGet = /* @__PURE__ */ createGetter(false, true);
const readonlyGet = /* @__PURE__ */ createGetter(true);
const arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
function createArrayInstrumentations() {
  const instrumentations = {};
  ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
    instrumentations[key] = function(...args) {
      const arr = toRaw(this);
      for (let i = 0, l = this.length; i < l; i++) {
        track(arr, "get", i + "");
      }
      const res = arr[key](...args);
      if (res === -1 || res === false) {
        return arr[key](...args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
    instrumentations[key] = function(...args) {
      pauseTracking();
      const res = toRaw(this)[key].apply(this, args);
      resetTracking();
      return res;
    };
  });
  return instrumentations;
}
function hasOwnProperty(key) {
  const obj = toRaw(this);
  track(obj, "has", key);
  return obj.hasOwnProperty(key);
}
function createGetter(isReadonly2 = false, shallow = false) {
  return function get2(target, key, receiver) {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_isShallow") {
      return shallow;
    } else if (key === "__v_raw" && receiver === (isReadonly2 ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target)) {
      return target;
    }
    const targetIsArray = isArray(target);
    if (!isReadonly2) {
      if (targetIsArray && hasOwn(arrayInstrumentations, key)) {
        return Reflect.get(arrayInstrumentations, key, receiver);
      }
      if (key === "hasOwnProperty") {
        return hasOwnProperty;
      }
    }
    const res = Reflect.get(target, key, receiver);
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly2) {
      track(target, "get", key);
    }
    if (shallow) {
      return res;
    }
    if (isRef(res)) {
      return targetIsArray && isIntegerKey(key) ? res : res.value;
    }
    if (isObject$1(res)) {
      return isReadonly2 ? readonly(res) : reactive(res);
    }
    return res;
  };
}
const set$1 = /* @__PURE__ */ createSetter();
const shallowSet = /* @__PURE__ */ createSetter(true);
function createSetter(shallow = false) {
  return function set22(target, key, value, receiver) {
    let oldValue = target[key];
    if (isReadonly(oldValue) && isRef(oldValue) && !isRef(value)) {
      return false;
    }
    if (!shallow) {
      if (!isShallow(value) && !isReadonly(value)) {
        oldValue = toRaw(oldValue);
        value = toRaw(value);
      }
      if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      }
    }
    const hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
    const result = Reflect.set(target, key, value, receiver);
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target, "set", key, value);
      }
    }
    return result;
  };
}
function deleteProperty(target, key) {
  const hadKey = hasOwn(target, key);
  target[key];
  const result = Reflect.deleteProperty(target, key);
  if (result && hadKey) {
    trigger(target, "delete", key, void 0);
  }
  return result;
}
function has$1(target, key) {
  const result = Reflect.has(target, key);
  if (!isSymbol(key) || !builtInSymbols.has(key)) {
    track(target, "has", key);
  }
  return result;
}
function ownKeys(target) {
  track(target, "iterate", isArray(target) ? "length" : ITERATE_KEY);
  return Reflect.ownKeys(target);
}
const mutableHandlers = {
  get: get$1,
  set: set$1,
  deleteProperty,
  has: has$1,
  ownKeys
};
const readonlyHandlers = {
  get: readonlyGet,
  set(target, key) {
    return true;
  },
  deleteProperty(target, key) {
    return true;
  }
};
const shallowReactiveHandlers = /* @__PURE__ */ extend(
  {},
  mutableHandlers,
  {
    get: shallowGet,
    set: shallowSet
  }
);
const toShallow = (value) => value;
const getProto = (v) => Reflect.getPrototypeOf(v);
function get(target, key, isReadonly2 = false, isShallow2 = false) {
  target = target["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (key !== rawKey) {
      track(rawTarget, "get", key);
    }
    track(rawTarget, "get", rawKey);
  }
  const { has: has2 } = getProto(rawTarget);
  const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
  if (has2.call(rawTarget, key)) {
    return wrap(target.get(key));
  } else if (has2.call(rawTarget, rawKey)) {
    return wrap(target.get(rawKey));
  } else if (target !== rawTarget) {
    target.get(key);
  }
}
function has$2(key, isReadonly2 = false) {
  const target = this["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (key !== rawKey) {
      track(rawTarget, "has", key);
    }
    track(rawTarget, "has", rawKey);
  }
  return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
}
function size(target, isReadonly2 = false) {
  target = target["__v_raw"];
  !isReadonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
  return Reflect.get(target, "size", target);
}
function add(value) {
  value = toRaw(value);
  const target = toRaw(this);
  const proto = getProto(target);
  const hadKey = proto.has.call(target, value);
  if (!hadKey) {
    target.add(value);
    trigger(target, "add", value, value);
  }
  return this;
}
function set(key, value) {
  value = toRaw(value);
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  }
  const oldValue = get2.call(target, key);
  target.set(key, value);
  if (!hadKey) {
    trigger(target, "add", key, value);
  } else if (hasChanged(value, oldValue)) {
    trigger(target, "set", key, value);
  }
  return this;
}
function deleteEntry(key) {
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  }
  get2 ? get2.call(target, key) : void 0;
  const result = target.delete(key);
  if (hadKey) {
    trigger(target, "delete", key, void 0);
  }
  return result;
}
function clear() {
  const target = toRaw(this);
  const hadItems = target.size !== 0;
  const result = target.clear();
  if (hadItems) {
    trigger(target, "clear", void 0, void 0);
  }
  return result;
}
function createForEach(isReadonly2, isShallow2) {
  return function forEach(callback, thisArg) {
    const observed = this;
    const target = observed["__v_raw"];
    const rawTarget = toRaw(target);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
    return target.forEach((value, key) => {
      return callback.call(thisArg, wrap(value), wrap(key), observed);
    });
  };
}
function createIterableMethod(method, isReadonly2, isShallow2) {
  return function(...args) {
    const target = this["__v_raw"];
    const rawTarget = toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(
      rawTarget,
      "iterate",
      isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
    );
    return {
      // iterator protocol
      next() {
        const { value, done } = innerIterator.next();
        return done ? { value, done } : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    return type === "delete" ? false : this;
  };
}
function createInstrumentations() {
  const mutableInstrumentations2 = {
    get(key) {
      return get(this, key);
    },
    get size() {
      return size(this);
    },
    has: has$2,
    add,
    set,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
  };
  const shallowInstrumentations2 = {
    get(key) {
      return get(this, key, false, true);
    },
    get size() {
      return size(this);
    },
    has: has$2,
    add,
    set,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
  };
  const readonlyInstrumentations2 = {
    get(key) {
      return get(this, key, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$2.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, false)
  };
  const shallowReadonlyInstrumentations2 = {
    get(key) {
      return get(this, key, true, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$2.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, true)
  };
  const iteratorMethods = ["keys", "values", "entries", Symbol.iterator];
  iteratorMethods.forEach((method) => {
    mutableInstrumentations2[method] = createIterableMethod(
      method,
      false,
      false
    );
    readonlyInstrumentations2[method] = createIterableMethod(
      method,
      true,
      false
    );
    shallowInstrumentations2[method] = createIterableMethod(
      method,
      false,
      true
    );
    shallowReadonlyInstrumentations2[method] = createIterableMethod(
      method,
      true,
      true
    );
  });
  return [
    mutableInstrumentations2,
    readonlyInstrumentations2,
    shallowInstrumentations2,
    shallowReadonlyInstrumentations2
  ];
}
const [
  mutableInstrumentations,
  readonlyInstrumentations,
  shallowInstrumentations,
  shallowReadonlyInstrumentations
] = /* @__PURE__ */ createInstrumentations();
function createInstrumentationGetter(isReadonly2, shallow) {
  const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(
      hasOwn(instrumentations, key) && key in target ? instrumentations : target,
      key,
      receiver
    );
  };
}
const mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
const reactiveMap = /* @__PURE__ */ new WeakMap();
const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
const readonlyMap = /* @__PURE__ */ new WeakMap();
const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive(target) {
  if (isReadonly(target)) {
    return target;
  }
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap
  );
}
function shallowReactive(target) {
  return createReactiveObject(
    target,
    false,
    shallowReactiveHandlers,
    shallowCollectionHandlers,
    shallowReactiveMap
  );
}
function readonly(target) {
  return createReactiveObject(
    target,
    true,
    readonlyHandlers,
    readonlyCollectionHandlers,
    readonlyMap
  );
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject$1(target)) {
    return target;
  }
  if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const proxy = new Proxy(
    target,
    targetType === 2 ? collectionHandlers : baseHandlers
  );
  proxyMap.set(target, proxy);
  return proxy;
}
function isReactive(value) {
  if (isReadonly(value)) {
    return isReactive(value["__v_raw"]);
  }
  return !!(value && value["__v_isReactive"]);
}
function isReadonly(value) {
  return !!(value && value["__v_isReadonly"]);
}
function isShallow(value) {
  return !!(value && value["__v_isShallow"]);
}
function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}
function toRaw(observed) {
  const raw = observed && observed["__v_raw"];
  return raw ? toRaw(raw) : observed;
}
function markRaw(value) {
  def(value, "__v_skip", true);
  return value;
}
const toReactive = (value) => isObject$1(value) ? reactive(value) : value;
const toReadonly = (value) => isObject$1(value) ? readonly(value) : value;
function trackRefValue(ref2) {
  if (shouldTrack && activeEffect) {
    ref2 = toRaw(ref2);
    {
      trackEffects(ref2.dep || (ref2.dep = createDep()));
    }
  }
}
function triggerRefValue(ref2, newVal) {
  ref2 = toRaw(ref2);
  const dep = ref2.dep;
  if (dep) {
    {
      triggerEffects(dep);
    }
  }
}
function isRef(r) {
  return !!(r && r.__v_isRef === true);
}
function ref(value) {
  return createRef(value, false);
}
function shallowRef(value) {
  return createRef(value, true);
}
function createRef(rawValue, shallow) {
  if (isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}
class RefImpl {
  constructor(value, __v_isShallow) {
    this.__v_isShallow = __v_isShallow;
    this.dep = void 0;
    this.__v_isRef = true;
    this._rawValue = __v_isShallow ? value : toRaw(value);
    this._value = __v_isShallow ? value : toReactive(value);
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newVal) {
    const useDirectValue = this.__v_isShallow || isShallow(newVal) || isReadonly(newVal);
    newVal = useDirectValue ? newVal : toRaw(newVal);
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal;
      this._value = useDirectValue ? newVal : toReactive(newVal);
      triggerRefValue(this);
    }
  }
}
function triggerRef(ref2) {
  triggerRefValue(ref2);
}
function unref(ref2) {
  return isRef(ref2) ? ref2.value : ref2;
}
const shallowUnwrapHandlers = {
  get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key];
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value;
      return true;
    } else {
      return Reflect.set(target, key, value, receiver);
    }
  }
};
function proxyRefs(objectWithRefs) {
  return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
class CustomRefImpl {
  constructor(factory) {
    this.dep = void 0;
    this.__v_isRef = true;
    const { get: get2, set: set3 } = factory(
      () => trackRefValue(this),
      () => triggerRefValue(this)
    );
    this._get = get2;
    this._set = set3;
  }
  get value() {
    return this._get();
  }
  set value(newVal) {
    this._set(newVal);
  }
}
function customRef(factory) {
  return new CustomRefImpl(factory);
}
class ComputedRefImpl {
  constructor(getter, _setter, isReadonly2, isSSR) {
    this._setter = _setter;
    this.dep = void 0;
    this.__v_isRef = true;
    this["__v_isReadonly"] = false;
    this._dirty = true;
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true;
        triggerRefValue(this);
      }
    });
    this.effect.computed = this;
    this.effect.active = this._cacheable = !isSSR;
    this["__v_isReadonly"] = isReadonly2;
  }
  get value() {
    const self2 = toRaw(this);
    trackRefValue(self2);
    if (self2._dirty || !self2._cacheable) {
      self2._dirty = false;
      self2._value = self2.effect.run();
    }
    return self2._value;
  }
  set value(newValue) {
    this._setter(newValue);
  }
}
function computed$1(getterOrOptions, debugOptions, isSSR = false) {
  let getter;
  let setter;
  const onlyGetter = isFunction$1(getterOrOptions);
  if (onlyGetter) {
    getter = getterOrOptions;
    setter = NOOP;
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
  return cRef;
}
function warn(msg, ...args) {
  return;
}
function callWithErrorHandling(fn, instance, type, args) {
  let res;
  try {
    res = args ? fn(...args) : fn();
  } catch (err) {
    handleError(err, instance, type);
  }
  return res;
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
  if (isFunction$1(fn)) {
    const res = callWithErrorHandling(fn, instance, type, args);
    if (res && isPromise(res)) {
      res.catch((err) => {
        handleError(err, instance, type);
      });
    }
    return res;
  }
  const values = [];
  for (let i = 0; i < fn.length; i++) {
    values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
  }
  return values;
}
function handleError(err, instance, type, throwInDev = true) {
  const contextVNode = instance ? instance.vnode : null;
  if (instance) {
    let cur = instance.parent;
    const exposedInstance = instance.proxy;
    const errorInfo = type;
    while (cur) {
      const errorCapturedHooks = cur.ec;
      if (errorCapturedHooks) {
        for (let i = 0; i < errorCapturedHooks.length; i++) {
          if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }
      cur = cur.parent;
    }
    const appErrorHandler = instance.appContext.config.errorHandler;
    if (appErrorHandler) {
      callWithErrorHandling(
        appErrorHandler,
        null,
        10,
        [err, exposedInstance, errorInfo]
      );
      return;
    }
  }
  logError(err, type, contextVNode, throwInDev);
}
function logError(err, type, contextVNode, throwInDev = true) {
  {
    console.error(err);
  }
}
let isFlushing = false;
let isFlushPending = false;
const queue = [];
let flushIndex = 0;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = /* @__PURE__ */ Promise.resolve();
let currentFlushPromise = null;
function nextTick(fn) {
  const p2 = currentFlushPromise || resolvedPromise;
  return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
}
function findInsertionIndex(id2) {
  let start = flushIndex + 1;
  let end = queue.length;
  while (start < end) {
    const middle = start + end >>> 1;
    const middleJobId = getId(queue[middle]);
    middleJobId < id2 ? start = middle + 1 : end = middle;
  }
  return start;
}
function queueJob(job) {
  if (!queue.length || !queue.includes(
    job,
    isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex
  )) {
    if (job.id == null) {
      queue.push(job);
    } else {
      queue.splice(findInsertionIndex(job.id), 0, job);
    }
    queueFlush();
  }
}
function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function invalidateJob(job) {
  const i = queue.indexOf(job);
  if (i > flushIndex) {
    queue.splice(i, 1);
  }
}
function queuePostFlushCb(cb) {
  if (!isArray(cb)) {
    if (!activePostFlushCbs || !activePostFlushCbs.includes(
      cb,
      cb.allowRecurse ? postFlushIndex + 1 : postFlushIndex
    )) {
      pendingPostFlushCbs.push(cb);
    }
  } else {
    pendingPostFlushCbs.push(...cb);
  }
  queueFlush();
}
function flushPreFlushCbs(seen, i = isFlushing ? flushIndex + 1 : 0) {
  for (; i < queue.length; i++) {
    const cb = queue[i];
    if (cb && cb.pre) {
      queue.splice(i, 1);
      i--;
      cb();
    }
  }
}
function flushPostFlushCbs(seen) {
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)];
    pendingPostFlushCbs.length = 0;
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped);
      return;
    }
    activePostFlushCbs = deduped;
    activePostFlushCbs.sort((a, b) => getId(a) - getId(b));
    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      activePostFlushCbs[postFlushIndex]();
    }
    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}
const getId = (job) => job.id == null ? Infinity : job.id;
const comparator = (a, b) => {
  const diff = getId(a) - getId(b);
  if (diff === 0) {
    if (a.pre && !b.pre)
      return -1;
    if (b.pre && !a.pre)
      return 1;
  }
  return diff;
};
function flushJobs(seen) {
  isFlushPending = false;
  isFlushing = true;
  queue.sort(comparator);
  const check = NOOP;
  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job && job.active !== false) {
        if (false)
          ;
        callWithErrorHandling(job, null, 14);
      }
    }
  } finally {
    flushIndex = 0;
    queue.length = 0;
    flushPostFlushCbs();
    isFlushing = false;
    currentFlushPromise = null;
    if (queue.length || pendingPostFlushCbs.length) {
      flushJobs();
    }
  }
}
function emit(instance, event, ...rawArgs) {
  if (instance.isUnmounted)
    return;
  const props = instance.vnode.props || EMPTY_OBJ;
  let args = rawArgs;
  const isModelListener2 = event.startsWith("update:");
  const modelArg = isModelListener2 && event.slice(7);
  if (modelArg && modelArg in props) {
    const modifiersKey = `${modelArg === "modelValue" ? "model" : modelArg}Modifiers`;
    const { number, trim } = props[modifiersKey] || EMPTY_OBJ;
    if (trim) {
      args = rawArgs.map((a) => isString$3(a) ? a.trim() : a);
    }
    if (number) {
      args = rawArgs.map(looseToNumber);
    }
  }
  let handlerName;
  let handler = props[handlerName = toHandlerKey(event)] || // also try camelCase event handler (#2249)
  props[handlerName = toHandlerKey(camelize(event))];
  if (!handler && isModelListener2) {
    handler = props[handlerName = toHandlerKey(hyphenate(event))];
  }
  if (handler) {
    callWithAsyncErrorHandling(
      handler,
      instance,
      6,
      args
    );
  }
  const onceHandler = props[handlerName + `Once`];
  if (onceHandler) {
    if (!instance.emitted) {
      instance.emitted = {};
    } else if (instance.emitted[handlerName]) {
      return;
    }
    instance.emitted[handlerName] = true;
    callWithAsyncErrorHandling(
      onceHandler,
      instance,
      6,
      args
    );
  }
}
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.emitsCache;
  const cached = cache.get(comp);
  if (cached !== void 0) {
    return cached;
  }
  const raw = comp.emits;
  let normalized = {};
  let hasExtends = false;
  if (!isFunction$1(comp)) {
    const extendEmits = (raw2) => {
      const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
      if (normalizedFromExtend) {
        hasExtends = true;
        extend(normalized, normalizedFromExtend);
      }
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendEmits);
    }
    if (comp.extends) {
      extendEmits(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendEmits);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject$1(comp)) {
      cache.set(comp, null);
    }
    return null;
  }
  if (isArray(raw)) {
    raw.forEach((key) => normalized[key] = null);
  } else {
    extend(normalized, raw);
  }
  if (isObject$1(comp)) {
    cache.set(comp, normalized);
  }
  return normalized;
}
function isEmitListener(options, key) {
  if (!options || !isOn(key)) {
    return false;
  }
  key = key.slice(2).replace(/Once$/, "");
  return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
}
let currentRenderingInstance = null;
let currentScopeId = null;
function setCurrentRenderingInstance(instance) {
  const prev = currentRenderingInstance;
  currentRenderingInstance = instance;
  currentScopeId = instance && instance.type.__scopeId || null;
  return prev;
}
function pushScopeId(id2) {
  currentScopeId = id2;
}
function popScopeId() {
  currentScopeId = null;
}
function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
  if (!ctx)
    return fn;
  if (fn._n) {
    return fn;
  }
  const renderFnWithContext = (...args) => {
    if (renderFnWithContext._d) {
      setBlockTracking(-1);
    }
    const prevInstance = setCurrentRenderingInstance(ctx);
    let res;
    try {
      res = fn(...args);
    } finally {
      setCurrentRenderingInstance(prevInstance);
      if (renderFnWithContext._d) {
        setBlockTracking(1);
      }
    }
    return res;
  };
  renderFnWithContext._n = true;
  renderFnWithContext._c = true;
  renderFnWithContext._d = true;
  return renderFnWithContext;
}
function markAttrsAccessed() {
}
function renderComponentRoot(instance) {
  const {
    type: Component,
    vnode,
    proxy,
    withProxy,
    props,
    propsOptions: [propsOptions],
    slots,
    attrs,
    emit: emit2,
    render: render2,
    renderCache,
    data,
    setupState,
    ctx,
    inheritAttrs
  } = instance;
  let result;
  let fallthroughAttrs;
  const prev = setCurrentRenderingInstance(instance);
  try {
    if (vnode.shapeFlag & 4) {
      const proxyToUse = withProxy || proxy;
      result = normalizeVNode(
        render2.call(
          proxyToUse,
          proxyToUse,
          renderCache,
          props,
          setupState,
          data,
          ctx
        )
      );
      fallthroughAttrs = attrs;
    } else {
      const render22 = Component;
      if (false)
        ;
      result = normalizeVNode(
        render22.length > 1 ? render22(
          props,
          false ? {
            get attrs() {
              markAttrsAccessed();
              return attrs;
            },
            slots,
            emit: emit2
          } : { attrs, slots, emit: emit2 }
        ) : render22(
          props,
          null
          /* we know it doesn't need it */
        )
      );
      fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
    }
  } catch (err) {
    blockStack.length = 0;
    handleError(err, instance, 1);
    result = createVNode(Comment);
  }
  let root = result;
  if (fallthroughAttrs && inheritAttrs !== false) {
    const keys = Object.keys(fallthroughAttrs);
    const { shapeFlag } = root;
    if (keys.length) {
      if (shapeFlag & (1 | 6)) {
        if (propsOptions && keys.some(isModelListener)) {
          fallthroughAttrs = filterModelListeners(
            fallthroughAttrs,
            propsOptions
          );
        }
        root = cloneVNode(root, fallthroughAttrs);
      }
    }
  }
  if (vnode.dirs) {
    root = cloneVNode(root);
    root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
  }
  if (vnode.transition) {
    root.transition = vnode.transition;
  }
  {
    result = root;
  }
  setCurrentRenderingInstance(prev);
  return result;
}
const getFunctionalFallthrough = (attrs) => {
  let res;
  for (const key in attrs) {
    if (key === "class" || key === "style" || isOn(key)) {
      (res || (res = {}))[key] = attrs[key];
    }
  }
  return res;
};
const filterModelListeners = (attrs, props) => {
  const res = {};
  for (const key in attrs) {
    if (!isModelListener(key) || !(key.slice(9) in props)) {
      res[key] = attrs[key];
    }
  }
  return res;
};
function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
  const { props: prevProps, children: prevChildren, component } = prevVNode;
  const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
  const emits = component.emitsOptions;
  if (nextVNode.dirs || nextVNode.transition) {
    return true;
  }
  if (optimized && patchFlag >= 0) {
    if (patchFlag & 1024) {
      return true;
    }
    if (patchFlag & 16) {
      if (!prevProps) {
        return !!nextProps;
      }
      return hasPropsChanged(prevProps, nextProps, emits);
    } else if (patchFlag & 8) {
      const dynamicProps = nextVNode.dynamicProps;
      for (let i = 0; i < dynamicProps.length; i++) {
        const key = dynamicProps[i];
        if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
          return true;
        }
      }
    }
  } else {
    if (prevChildren || nextChildren) {
      if (!nextChildren || !nextChildren.$stable) {
        return true;
      }
    }
    if (prevProps === nextProps) {
      return false;
    }
    if (!prevProps) {
      return !!nextProps;
    }
    if (!nextProps) {
      return true;
    }
    return hasPropsChanged(prevProps, nextProps, emits);
  }
  return false;
}
function hasPropsChanged(prevProps, nextProps, emitsOptions) {
  const nextKeys = Object.keys(nextProps);
  if (nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i];
    if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
      return true;
    }
  }
  return false;
}
function updateHOCHostEl({ vnode, parent }, el) {
  while (parent && parent.subTree === vnode) {
    (vnode = parent.vnode).el = el;
    parent = parent.parent;
  }
}
const isSuspense = (type) => type.__isSuspense;
function queueEffectWithSuspense(fn, suspense) {
  if (suspense && suspense.pendingBranch) {
    if (isArray(fn)) {
      suspense.effects.push(...fn);
    } else {
      suspense.effects.push(fn);
    }
  } else {
    queuePostFlushCb(fn);
  }
}
function watchEffect(effect, options) {
  return doWatch(effect, null, options);
}
function watchPostEffect(effect, options) {
  return doWatch(
    effect,
    null,
    { flush: "post" }
  );
}
const INITIAL_WATCHER_VALUE = {};
function watch(source, cb, options) {
  return doWatch(source, cb, options);
}
function doWatch(source, cb, { immediate, deep, flush, onTrack, onTrigger } = EMPTY_OBJ) {
  var _a2;
  const instance = getCurrentScope() === ((_a2 = currentInstance) == null ? void 0 : _a2.scope) ? currentInstance : null;
  let getter;
  let forceTrigger = false;
  let isMultiSource = false;
  if (isRef(source)) {
    getter = () => source.value;
    forceTrigger = isShallow(source);
  } else if (isReactive(source)) {
    getter = () => source;
    deep = true;
  } else if (isArray(source)) {
    isMultiSource = true;
    forceTrigger = source.some((s) => isReactive(s) || isShallow(s));
    getter = () => source.map((s) => {
      if (isRef(s)) {
        return s.value;
      } else if (isReactive(s)) {
        return traverse(s);
      } else if (isFunction$1(s)) {
        return callWithErrorHandling(s, instance, 2);
      } else
        ;
    });
  } else if (isFunction$1(source)) {
    if (cb) {
      getter = () => callWithErrorHandling(source, instance, 2);
    } else {
      getter = () => {
        if (instance && instance.isUnmounted) {
          return;
        }
        if (cleanup) {
          cleanup();
        }
        return callWithAsyncErrorHandling(
          source,
          instance,
          3,
          [onCleanup]
        );
      };
    }
  } else {
    getter = NOOP;
  }
  if (cb && deep) {
    const baseGetter = getter;
    getter = () => traverse(baseGetter());
  }
  let cleanup;
  let onCleanup = (fn) => {
    cleanup = effect.onStop = () => {
      callWithErrorHandling(fn, instance, 4);
    };
  };
  let ssrCleanup;
  if (isInSSRComponentSetup) {
    onCleanup = NOOP;
    if (!cb) {
      getter();
    } else if (immediate) {
      callWithAsyncErrorHandling(cb, instance, 3, [
        getter(),
        isMultiSource ? [] : void 0,
        onCleanup
      ]);
    }
    if (flush === "sync") {
      const ctx = useSSRContext();
      ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
    } else {
      return NOOP;
    }
  }
  let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
  const job = () => {
    if (!effect.active) {
      return;
    }
    if (cb) {
      const newValue = effect.run();
      if (deep || forceTrigger || (isMultiSource ? newValue.some(
        (v, i) => hasChanged(v, oldValue[i])
      ) : hasChanged(newValue, oldValue)) || false) {
        if (cleanup) {
          cleanup();
        }
        callWithAsyncErrorHandling(cb, instance, 3, [
          newValue,
          // pass undefined as the old value when it's changed for the first time
          oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
          onCleanup
        ]);
        oldValue = newValue;
      }
    } else {
      effect.run();
    }
  };
  job.allowRecurse = !!cb;
  let scheduler;
  if (flush === "sync") {
    scheduler = job;
  } else if (flush === "post") {
    scheduler = () => queuePostRenderEffect(job, instance && instance.suspense);
  } else {
    job.pre = true;
    if (instance)
      job.id = instance.uid;
    scheduler = () => queueJob(job);
  }
  const effect = new ReactiveEffect(getter, scheduler);
  if (cb) {
    if (immediate) {
      job();
    } else {
      oldValue = effect.run();
    }
  } else if (flush === "post") {
    queuePostRenderEffect(
      effect.run.bind(effect),
      instance && instance.suspense
    );
  } else {
    effect.run();
  }
  const unwatch = () => {
    effect.stop();
    if (instance && instance.scope) {
      remove(instance.scope.effects, effect);
    }
  };
  if (ssrCleanup)
    ssrCleanup.push(unwatch);
  return unwatch;
}
function instanceWatch(source, value, options) {
  const publicThis = this.proxy;
  const getter = isString$3(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
  let cb;
  if (isFunction$1(value)) {
    cb = value;
  } else {
    cb = value.handler;
    options = value;
  }
  const cur = currentInstance;
  setCurrentInstance(this);
  const res = doWatch(getter, cb.bind(publicThis), options);
  if (cur) {
    setCurrentInstance(cur);
  } else {
    unsetCurrentInstance();
  }
  return res;
}
function createPathGetter(ctx, path) {
  const segments = path.split(".");
  return () => {
    let cur = ctx;
    for (let i = 0; i < segments.length && cur; i++) {
      cur = cur[segments[i]];
    }
    return cur;
  };
}
function traverse(value, seen) {
  if (!isObject$1(value) || value["__v_skip"]) {
    return value;
  }
  seen = seen || /* @__PURE__ */ new Set();
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  if (isRef(value)) {
    traverse(value.value, seen);
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], seen);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v) => {
      traverse(v, seen);
    });
  } else if (isPlainObject(value)) {
    for (const key in value) {
      traverse(value[key], seen);
    }
  }
  return value;
}
function withDirectives(vnode, directives) {
  const internalInstance = currentRenderingInstance;
  if (internalInstance === null) {
    return vnode;
  }
  const instance = getExposeProxy(internalInstance) || internalInstance.proxy;
  const bindings = vnode.dirs || (vnode.dirs = []);
  for (let i = 0; i < directives.length; i++) {
    let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
    if (dir) {
      if (isFunction$1(dir)) {
        dir = {
          mounted: dir,
          updated: dir
        };
      }
      if (dir.deep) {
        traverse(value);
      }
      bindings.push({
        dir,
        instance,
        value,
        oldValue: void 0,
        arg,
        modifiers
      });
    }
  }
  return vnode;
}
function invokeDirectiveHook(vnode, prevVNode, instance, name) {
  const bindings = vnode.dirs;
  const oldBindings = prevVNode && prevVNode.dirs;
  for (let i = 0; i < bindings.length; i++) {
    const binding = bindings[i];
    if (oldBindings) {
      binding.oldValue = oldBindings[i].value;
    }
    let hook = binding.dir[name];
    if (hook) {
      pauseTracking();
      callWithAsyncErrorHandling(hook, instance, 8, [
        vnode.el,
        binding,
        vnode,
        prevVNode
      ]);
      resetTracking();
    }
  }
}
function useTransitionState() {
  const state = {
    isMounted: false,
    isLeaving: false,
    isUnmounting: false,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  onMounted(() => {
    state.isMounted = true;
  });
  onBeforeUnmount(() => {
    state.isUnmounting = true;
  });
  return state;
}
const TransitionHookValidator = [Function, Array];
const BaseTransitionPropsValidators = {
  mode: String,
  appear: Boolean,
  persisted: Boolean,
  // enter
  onBeforeEnter: TransitionHookValidator,
  onEnter: TransitionHookValidator,
  onAfterEnter: TransitionHookValidator,
  onEnterCancelled: TransitionHookValidator,
  // leave
  onBeforeLeave: TransitionHookValidator,
  onLeave: TransitionHookValidator,
  onAfterLeave: TransitionHookValidator,
  onLeaveCancelled: TransitionHookValidator,
  // appear
  onBeforeAppear: TransitionHookValidator,
  onAppear: TransitionHookValidator,
  onAfterAppear: TransitionHookValidator,
  onAppearCancelled: TransitionHookValidator
};
const BaseTransitionImpl = {
  name: `BaseTransition`,
  props: BaseTransitionPropsValidators,
  setup(props, { slots }) {
    const instance = getCurrentInstance();
    const state = useTransitionState();
    let prevTransitionKey;
    return () => {
      const children = slots.default && getTransitionRawChildren(slots.default(), true);
      if (!children || !children.length) {
        return;
      }
      let child = children[0];
      if (children.length > 1) {
        for (const c of children) {
          if (c.type !== Comment) {
            child = c;
            break;
          }
        }
      }
      const rawProps = toRaw(props);
      const { mode } = rawProps;
      if (state.isLeaving) {
        return emptyPlaceholder(child);
      }
      const innerChild = getKeepAliveChild(child);
      if (!innerChild) {
        return emptyPlaceholder(child);
      }
      const enterHooks = resolveTransitionHooks(
        innerChild,
        rawProps,
        state,
        instance
      );
      setTransitionHooks(innerChild, enterHooks);
      const oldChild = instance.subTree;
      const oldInnerChild = oldChild && getKeepAliveChild(oldChild);
      let transitionKeyChanged = false;
      const { getTransitionKey } = innerChild.type;
      if (getTransitionKey) {
        const key = getTransitionKey();
        if (prevTransitionKey === void 0) {
          prevTransitionKey = key;
        } else if (key !== prevTransitionKey) {
          prevTransitionKey = key;
          transitionKeyChanged = true;
        }
      }
      if (oldInnerChild && oldInnerChild.type !== Comment && (!isSameVNodeType(innerChild, oldInnerChild) || transitionKeyChanged)) {
        const leavingHooks = resolveTransitionHooks(
          oldInnerChild,
          rawProps,
          state,
          instance
        );
        setTransitionHooks(oldInnerChild, leavingHooks);
        if (mode === "out-in") {
          state.isLeaving = true;
          leavingHooks.afterLeave = () => {
            state.isLeaving = false;
            if (instance.update.active !== false) {
              instance.update();
            }
          };
          return emptyPlaceholder(child);
        } else if (mode === "in-out" && innerChild.type !== Comment) {
          leavingHooks.delayLeave = (el, earlyRemove, delayedLeave) => {
            const leavingVNodesCache = getLeavingNodesForType(
              state,
              oldInnerChild
            );
            leavingVNodesCache[String(oldInnerChild.key)] = oldInnerChild;
            el._leaveCb = () => {
              earlyRemove();
              el._leaveCb = void 0;
              delete enterHooks.delayedLeave;
            };
            enterHooks.delayedLeave = delayedLeave;
          };
        }
      }
      return child;
    };
  }
};
const BaseTransition = BaseTransitionImpl;
function getLeavingNodesForType(state, vnode) {
  const { leavingVNodes } = state;
  let leavingVNodesCache = leavingVNodes.get(vnode.type);
  if (!leavingVNodesCache) {
    leavingVNodesCache = /* @__PURE__ */ Object.create(null);
    leavingVNodes.set(vnode.type, leavingVNodesCache);
  }
  return leavingVNodesCache;
}
function resolveTransitionHooks(vnode, props, state, instance) {
  const {
    appear,
    mode,
    persisted = false,
    onBeforeEnter,
    onEnter,
    onAfterEnter,
    onEnterCancelled,
    onBeforeLeave,
    onLeave,
    onAfterLeave,
    onLeaveCancelled,
    onBeforeAppear,
    onAppear,
    onAfterAppear,
    onAppearCancelled
  } = props;
  const key = String(vnode.key);
  const leavingVNodesCache = getLeavingNodesForType(state, vnode);
  const callHook2 = (hook, args) => {
    hook && callWithAsyncErrorHandling(
      hook,
      instance,
      9,
      args
    );
  };
  const callAsyncHook = (hook, args) => {
    const done = args[1];
    callHook2(hook, args);
    if (isArray(hook)) {
      if (hook.every((hook2) => hook2.length <= 1))
        done();
    } else if (hook.length <= 1) {
      done();
    }
  };
  const hooks = {
    mode,
    persisted,
    beforeEnter(el) {
      let hook = onBeforeEnter;
      if (!state.isMounted) {
        if (appear) {
          hook = onBeforeAppear || onBeforeEnter;
        } else {
          return;
        }
      }
      if (el._leaveCb) {
        el._leaveCb(
          true
          /* cancelled */
        );
      }
      const leavingVNode = leavingVNodesCache[key];
      if (leavingVNode && isSameVNodeType(vnode, leavingVNode) && leavingVNode.el._leaveCb) {
        leavingVNode.el._leaveCb();
      }
      callHook2(hook, [el]);
    },
    enter(el) {
      let hook = onEnter;
      let afterHook = onAfterEnter;
      let cancelHook = onEnterCancelled;
      if (!state.isMounted) {
        if (appear) {
          hook = onAppear || onEnter;
          afterHook = onAfterAppear || onAfterEnter;
          cancelHook = onAppearCancelled || onEnterCancelled;
        } else {
          return;
        }
      }
      let called = false;
      const done = el._enterCb = (cancelled) => {
        if (called)
          return;
        called = true;
        if (cancelled) {
          callHook2(cancelHook, [el]);
        } else {
          callHook2(afterHook, [el]);
        }
        if (hooks.delayedLeave) {
          hooks.delayedLeave();
        }
        el._enterCb = void 0;
      };
      if (hook) {
        callAsyncHook(hook, [el, done]);
      } else {
        done();
      }
    },
    leave(el, remove2) {
      const key2 = String(vnode.key);
      if (el._enterCb) {
        el._enterCb(
          true
          /* cancelled */
        );
      }
      if (state.isUnmounting) {
        return remove2();
      }
      callHook2(onBeforeLeave, [el]);
      let called = false;
      const done = el._leaveCb = (cancelled) => {
        if (called)
          return;
        called = true;
        remove2();
        if (cancelled) {
          callHook2(onLeaveCancelled, [el]);
        } else {
          callHook2(onAfterLeave, [el]);
        }
        el._leaveCb = void 0;
        if (leavingVNodesCache[key2] === vnode) {
          delete leavingVNodesCache[key2];
        }
      };
      leavingVNodesCache[key2] = vnode;
      if (onLeave) {
        callAsyncHook(onLeave, [el, done]);
      } else {
        done();
      }
    },
    clone(vnode2) {
      return resolveTransitionHooks(vnode2, props, state, instance);
    }
  };
  return hooks;
}
function emptyPlaceholder(vnode) {
  if (isKeepAlive(vnode)) {
    vnode = cloneVNode(vnode);
    vnode.children = null;
    return vnode;
  }
}
function getKeepAliveChild(vnode) {
  return isKeepAlive(vnode) ? vnode.children ? vnode.children[0] : void 0 : vnode;
}
function setTransitionHooks(vnode, hooks) {
  if (vnode.shapeFlag & 6 && vnode.component) {
    setTransitionHooks(vnode.component.subTree, hooks);
  } else if (vnode.shapeFlag & 128) {
    vnode.ssContent.transition = hooks.clone(vnode.ssContent);
    vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
  } else {
    vnode.transition = hooks;
  }
}
function getTransitionRawChildren(children, keepComment = false, parentKey) {
  let ret = [];
  let keyedFragmentCount = 0;
  for (let i = 0; i < children.length; i++) {
    let child = children[i];
    const key = parentKey == null ? child.key : String(parentKey) + String(child.key != null ? child.key : i);
    if (child.type === Fragment) {
      if (child.patchFlag & 128)
        keyedFragmentCount++;
      ret = ret.concat(
        getTransitionRawChildren(child.children, keepComment, key)
      );
    } else if (keepComment || child.type !== Comment) {
      ret.push(key != null ? cloneVNode(child, { key }) : child);
    }
  }
  if (keyedFragmentCount > 1) {
    for (let i = 0; i < ret.length; i++) {
      ret[i].patchFlag = -2;
    }
  }
  return ret;
}
function defineComponent(options, extraOptions) {
  return isFunction$1(options) ? (
    // #8326: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    /* @__PURE__ */ (() => extend({ name: options.name }, extraOptions, { setup: options }))()
  ) : options;
}
const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
function onActivated(hook, target) {
  registerKeepAliveHook(hook, "a", target);
}
function onDeactivated(hook, target) {
  registerKeepAliveHook(hook, "da", target);
}
function registerKeepAliveHook(hook, type, target = currentInstance) {
  const wrappedHook = hook.__wdc || (hook.__wdc = () => {
    let current = target;
    while (current) {
      if (current.isDeactivated) {
        return;
      }
      current = current.parent;
    }
    return hook();
  });
  injectHook(type, wrappedHook, target);
  if (target) {
    let current = target.parent;
    while (current && current.parent) {
      if (isKeepAlive(current.parent.vnode)) {
        injectToKeepAliveRoot(wrappedHook, type, target, current);
      }
      current = current.parent;
    }
  }
}
function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
  const injected = injectHook(
    type,
    hook,
    keepAliveRoot,
    true
    /* prepend */
  );
  onUnmounted(() => {
    remove(keepAliveRoot[type], injected);
  }, target);
}
function injectHook(type, hook, target = currentInstance, prepend = false) {
  if (target) {
    const hooks = target[type] || (target[type] = []);
    const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
      if (target.isUnmounted) {
        return;
      }
      pauseTracking();
      setCurrentInstance(target);
      const res = callWithAsyncErrorHandling(hook, target, type, args);
      unsetCurrentInstance();
      resetTracking();
      return res;
    });
    if (prepend) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }
    return wrappedHook;
  }
}
const createHook = (lifecycle) => (hook, target = currentInstance) => (
  // post-create lifecycle registrations are noops during SSR (except for serverPrefetch)
  (!isInSSRComponentSetup || lifecycle === "sp") && injectHook(lifecycle, (...args) => hook(...args), target)
);
const onBeforeMount = createHook("bm");
const onMounted = createHook("m");
const onBeforeUpdate = createHook("bu");
const onUpdated = createHook("u");
const onBeforeUnmount = createHook("bum");
const onUnmounted = createHook("um");
const onServerPrefetch = createHook("sp");
const onRenderTriggered = createHook(
  "rtg"
);
const onRenderTracked = createHook(
  "rtc"
);
function onErrorCaptured(hook, target = currentInstance) {
  injectHook("ec", hook, target);
}
const COMPONENTS = "components";
const DIRECTIVES = "directives";
function resolveComponent(name, maybeSelfReference) {
  return resolveAsset(COMPONENTS, name, true, maybeSelfReference) || name;
}
const NULL_DYNAMIC_COMPONENT = Symbol.for("v-ndc");
function resolveDirective(name) {
  return resolveAsset(DIRECTIVES, name);
}
function resolveAsset(type, name, warnMissing = true, maybeSelfReference = false) {
  const instance = currentRenderingInstance || currentInstance;
  if (instance) {
    const Component = instance.type;
    if (type === COMPONENTS) {
      const selfName = getComponentName(
        Component,
        false
        /* do not include inferred name to avoid breaking existing code */
      );
      if (selfName && (selfName === name || selfName === camelize(name) || selfName === capitalize(camelize(name)))) {
        return Component;
      }
    }
    const res = (
      // local registration
      // check instance[type] first which is resolved for options API
      resolve$1(instance[type] || Component[type], name) || // global registration
      resolve$1(instance.appContext[type], name)
    );
    if (!res && maybeSelfReference) {
      return Component;
    }
    return res;
  }
}
function resolve$1(registry, name) {
  return registry && (registry[name] || registry[camelize(name)] || registry[capitalize(camelize(name))]);
}
function renderList(source, renderItem, cache, index) {
  let ret;
  const cached = cache && cache[index];
  if (isArray(source) || isString$3(source)) {
    ret = new Array(source.length);
    for (let i = 0, l = source.length; i < l; i++) {
      ret[i] = renderItem(source[i], i, void 0, cached && cached[i]);
    }
  } else if (typeof source === "number") {
    ret = new Array(source);
    for (let i = 0; i < source; i++) {
      ret[i] = renderItem(i + 1, i, void 0, cached && cached[i]);
    }
  } else if (isObject$1(source)) {
    if (source[Symbol.iterator]) {
      ret = Array.from(
        source,
        (item, i) => renderItem(item, i, void 0, cached && cached[i])
      );
    } else {
      const keys = Object.keys(source);
      ret = new Array(keys.length);
      for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i];
        ret[i] = renderItem(source[key], key, i, cached && cached[i]);
      }
    }
  } else {
    ret = [];
  }
  if (cache) {
    cache[index] = ret;
  }
  return ret;
}
function renderSlot(slots, name, props = {}, fallback, noSlotted) {
  if (currentRenderingInstance.isCE || currentRenderingInstance.parent && isAsyncWrapper(currentRenderingInstance.parent) && currentRenderingInstance.parent.isCE) {
    if (name !== "default")
      props.name = name;
    return createVNode("slot", props, fallback && fallback());
  }
  let slot = slots[name];
  if (slot && slot._c) {
    slot._d = false;
  }
  openBlock();
  const validSlotContent = slot && ensureValidVNode(slot(props));
  const rendered = createBlock(
    Fragment,
    {
      key: props.key || // slot content array of a dynamic conditional slot may have a branch
      // key attached in the `createSlots` helper, respect that
      validSlotContent && validSlotContent.key || `_${name}`
    },
    validSlotContent || (fallback ? fallback() : []),
    validSlotContent && slots._ === 1 ? 64 : -2
  );
  if (!noSlotted && rendered.scopeId) {
    rendered.slotScopeIds = [rendered.scopeId + "-s"];
  }
  if (slot && slot._c) {
    slot._d = true;
  }
  return rendered;
}
function ensureValidVNode(vnodes) {
  return vnodes.some((child) => {
    if (!isVNode(child))
      return true;
    if (child.type === Comment)
      return false;
    if (child.type === Fragment && !ensureValidVNode(child.children))
      return false;
    return true;
  }) ? vnodes : null;
}
const getPublicInstance = (i) => {
  if (!i)
    return null;
  if (isStatefulComponent(i))
    return getExposeProxy(i) || i.proxy;
  return getPublicInstance(i.parent);
};
const publicPropertiesMap = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
    $: (i) => i,
    $el: (i) => i.vnode.el,
    $data: (i) => i.data,
    $props: (i) => i.props,
    $attrs: (i) => i.attrs,
    $slots: (i) => i.slots,
    $refs: (i) => i.refs,
    $parent: (i) => getPublicInstance(i.parent),
    $root: (i) => getPublicInstance(i.root),
    $emit: (i) => i.emit,
    $options: (i) => resolveMergedOptions(i),
    $forceUpdate: (i) => i.f || (i.f = () => queueJob(i.update)),
    $nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
    $watch: (i) => instanceWatch.bind(i)
  })
);
const hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
    let normalizedProps;
    if (key[0] !== "$") {
      const n = accessCache[key];
      if (n !== void 0) {
        switch (n) {
          case 1:
            return setupState[key];
          case 2:
            return data[key];
          case 4:
            return ctx[key];
          case 3:
            return props[key];
        }
      } else if (hasSetupBinding(setupState, key)) {
        accessCache[key] = 1;
        return setupState[key];
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        accessCache[key] = 2;
        return data[key];
      } else if (
        // only cache other properties when instance has declared (thus stable)
        // props
        (normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)
      ) {
        accessCache[key] = 3;
        return props[key];
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (shouldCacheAccess) {
        accessCache[key] = 0;
      }
    }
    const publicGetter = publicPropertiesMap[key];
    let cssModule, globalProperties;
    if (publicGetter) {
      if (key === "$attrs") {
        track(instance, "get", key);
      }
      return publicGetter(instance);
    } else if (
      // css module (injected by vue-loader)
      (cssModule = type.__cssModules) && (cssModule = cssModule[key])
    ) {
      return cssModule;
    } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
      accessCache[key] = 4;
      return ctx[key];
    } else if (
      // global properties
      globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)
    ) {
      {
        return globalProperties[key];
      }
    } else
      ;
  },
  set({ _: instance }, key, value) {
    const { data, setupState, ctx } = instance;
    if (hasSetupBinding(setupState, key)) {
      setupState[key] = value;
      return true;
    } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
      data[key] = value;
      return true;
    } else if (hasOwn(instance.props, key)) {
      return false;
    }
    if (key[0] === "$" && key.slice(1) in instance) {
      return false;
    } else {
      {
        ctx[key] = value;
      }
    }
    return true;
  },
  has({
    _: { data, setupState, accessCache, ctx, appContext, propsOptions }
  }, key) {
    let normalizedProps;
    return !!accessCache[key] || data !== EMPTY_OBJ && hasOwn(data, key) || hasSetupBinding(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
  },
  defineProperty(target, key, descriptor) {
    if (descriptor.get != null) {
      target._.accessCache[key] = 0;
    } else if (hasOwn(descriptor, "value")) {
      this.set(target, key, descriptor.value, null);
    }
    return Reflect.defineProperty(target, key, descriptor);
  }
};
function useModel(props, name, options) {
  const i = getCurrentInstance();
  if (options && options.local) {
    const proxy = ref(props[name]);
    watch(
      () => props[name],
      (v) => proxy.value = v
    );
    watch(proxy, (value) => {
      if (value !== props[name]) {
        i.emit(`update:${name}`, value);
      }
    });
    return proxy;
  } else {
    return {
      __v_isRef: true,
      get value() {
        return props[name];
      },
      set value(value) {
        i.emit(`update:${name}`, value);
      }
    };
  }
}
function normalizePropsOrEmits(props) {
  return isArray(props) ? props.reduce(
    (normalized, p2) => (normalized[p2] = null, normalized),
    {}
  ) : props;
}
function mergeModels(a, b) {
  if (!a || !b)
    return a || b;
  if (isArray(a) && isArray(b))
    return a.concat(b);
  return extend({}, normalizePropsOrEmits(a), normalizePropsOrEmits(b));
}
let shouldCacheAccess = true;
function applyOptions(instance) {
  const options = resolveMergedOptions(instance);
  const publicThis = instance.proxy;
  const ctx = instance.ctx;
  shouldCacheAccess = false;
  if (options.beforeCreate) {
    callHook$1(options.beforeCreate, instance, "bc");
  }
  const {
    // state
    data: dataOptions,
    computed: computedOptions,
    methods,
    watch: watchOptions,
    provide: provideOptions,
    inject: injectOptions,
    // lifecycle
    created,
    beforeMount,
    mounted,
    beforeUpdate,
    updated,
    activated,
    deactivated,
    beforeDestroy,
    beforeUnmount,
    destroyed,
    unmounted,
    render: render2,
    renderTracked,
    renderTriggered,
    errorCaptured,
    serverPrefetch,
    // public API
    expose,
    inheritAttrs,
    // assets
    components,
    directives,
    filters
  } = options;
  const checkDuplicateProperties = null;
  if (injectOptions) {
    resolveInjections(injectOptions, ctx, checkDuplicateProperties);
  }
  if (methods) {
    for (const key in methods) {
      const methodHandler = methods[key];
      if (isFunction$1(methodHandler)) {
        {
          ctx[key] = methodHandler.bind(publicThis);
        }
      }
    }
  }
  if (dataOptions) {
    const data = dataOptions.call(publicThis, publicThis);
    if (!isObject$1(data))
      ;
    else {
      instance.data = reactive(data);
    }
  }
  shouldCacheAccess = true;
  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = computedOptions[key];
      const get2 = isFunction$1(opt) ? opt.bind(publicThis, publicThis) : isFunction$1(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
      const set3 = !isFunction$1(opt) && isFunction$1(opt.set) ? opt.set.bind(publicThis) : NOOP;
      const c = computed({
        get: get2,
        set: set3
      });
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c.value,
        set: (v) => c.value = v
      });
    }
  }
  if (watchOptions) {
    for (const key in watchOptions) {
      createWatcher(watchOptions[key], ctx, publicThis, key);
    }
  }
  if (provideOptions) {
    const provides = isFunction$1(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
    Reflect.ownKeys(provides).forEach((key) => {
      provide$1(key, provides[key]);
    });
  }
  if (created) {
    callHook$1(created, instance, "c");
  }
  function registerLifecycleHook(register, hook) {
    if (isArray(hook)) {
      hook.forEach((_hook) => register(_hook.bind(publicThis)));
    } else if (hook) {
      register(hook.bind(publicThis));
    }
  }
  registerLifecycleHook(onBeforeMount, beforeMount);
  registerLifecycleHook(onMounted, mounted);
  registerLifecycleHook(onBeforeUpdate, beforeUpdate);
  registerLifecycleHook(onUpdated, updated);
  registerLifecycleHook(onActivated, activated);
  registerLifecycleHook(onDeactivated, deactivated);
  registerLifecycleHook(onErrorCaptured, errorCaptured);
  registerLifecycleHook(onRenderTracked, renderTracked);
  registerLifecycleHook(onRenderTriggered, renderTriggered);
  registerLifecycleHook(onBeforeUnmount, beforeUnmount);
  registerLifecycleHook(onUnmounted, unmounted);
  registerLifecycleHook(onServerPrefetch, serverPrefetch);
  if (isArray(expose)) {
    if (expose.length) {
      const exposed = instance.exposed || (instance.exposed = {});
      expose.forEach((key) => {
        Object.defineProperty(exposed, key, {
          get: () => publicThis[key],
          set: (val) => publicThis[key] = val
        });
      });
    } else if (!instance.exposed) {
      instance.exposed = {};
    }
  }
  if (render2 && instance.render === NOOP) {
    instance.render = render2;
  }
  if (inheritAttrs != null) {
    instance.inheritAttrs = inheritAttrs;
  }
  if (components)
    instance.components = components;
  if (directives)
    instance.directives = directives;
}
function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP) {
  if (isArray(injectOptions)) {
    injectOptions = normalizeInject(injectOptions);
  }
  for (const key in injectOptions) {
    const opt = injectOptions[key];
    let injected;
    if (isObject$1(opt)) {
      if ("default" in opt) {
        injected = inject$1(
          opt.from || key,
          opt.default,
          true
          /* treat default function as factory */
        );
      } else {
        injected = inject$1(opt.from || key);
      }
    } else {
      injected = inject$1(opt);
    }
    if (isRef(injected)) {
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => injected.value,
        set: (v) => injected.value = v
      });
    } else {
      ctx[key] = injected;
    }
  }
}
function callHook$1(hook, instance, type) {
  callWithAsyncErrorHandling(
    isArray(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy),
    instance,
    type
  );
}
function createWatcher(raw, ctx, publicThis, key) {
  const getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
  if (isString$3(raw)) {
    const handler = ctx[raw];
    if (isFunction$1(handler)) {
      watch(getter, handler);
    }
  } else if (isFunction$1(raw)) {
    watch(getter, raw.bind(publicThis));
  } else if (isObject$1(raw)) {
    if (isArray(raw)) {
      raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
    } else {
      const handler = isFunction$1(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
      if (isFunction$1(handler)) {
        watch(getter, handler, raw);
      }
    }
  } else
    ;
}
function resolveMergedOptions(instance) {
  const base2 = instance.type;
  const { mixins, extends: extendsOptions } = base2;
  const {
    mixins: globalMixins,
    optionsCache: cache,
    config: { optionMergeStrategies }
  } = instance.appContext;
  const cached = cache.get(base2);
  let resolved;
  if (cached) {
    resolved = cached;
  } else if (!globalMixins.length && !mixins && !extendsOptions) {
    {
      resolved = base2;
    }
  } else {
    resolved = {};
    if (globalMixins.length) {
      globalMixins.forEach(
        (m) => mergeOptions(resolved, m, optionMergeStrategies, true)
      );
    }
    mergeOptions(resolved, base2, optionMergeStrategies);
  }
  if (isObject$1(base2)) {
    cache.set(base2, resolved);
  }
  return resolved;
}
function mergeOptions(to, from, strats, asMixin = false) {
  const { mixins, extends: extendsOptions } = from;
  if (extendsOptions) {
    mergeOptions(to, extendsOptions, strats, true);
  }
  if (mixins) {
    mixins.forEach(
      (m) => mergeOptions(to, m, strats, true)
    );
  }
  for (const key in from) {
    if (asMixin && key === "expose")
      ;
    else {
      const strat = internalOptionMergeStrats[key] || strats && strats[key];
      to[key] = strat ? strat(to[key], from[key]) : from[key];
    }
  }
  return to;
}
const internalOptionMergeStrats = {
  data: mergeDataFn,
  props: mergeEmitsOrPropsOptions,
  emits: mergeEmitsOrPropsOptions,
  // objects
  methods: mergeObjectOptions,
  computed: mergeObjectOptions,
  // lifecycle
  beforeCreate: mergeAsArray,
  created: mergeAsArray,
  beforeMount: mergeAsArray,
  mounted: mergeAsArray,
  beforeUpdate: mergeAsArray,
  updated: mergeAsArray,
  beforeDestroy: mergeAsArray,
  beforeUnmount: mergeAsArray,
  destroyed: mergeAsArray,
  unmounted: mergeAsArray,
  activated: mergeAsArray,
  deactivated: mergeAsArray,
  errorCaptured: mergeAsArray,
  serverPrefetch: mergeAsArray,
  // assets
  components: mergeObjectOptions,
  directives: mergeObjectOptions,
  // watch
  watch: mergeWatchOptions,
  // provide / inject
  provide: mergeDataFn,
  inject: mergeInject
};
function mergeDataFn(to, from) {
  if (!from) {
    return to;
  }
  if (!to) {
    return from;
  }
  return function mergedDataFn() {
    return extend(
      isFunction$1(to) ? to.call(this, this) : to,
      isFunction$1(from) ? from.call(this, this) : from
    );
  };
}
function mergeInject(to, from) {
  return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
  if (isArray(raw)) {
    const res = {};
    for (let i = 0; i < raw.length; i++) {
      res[raw[i]] = raw[i];
    }
    return res;
  }
  return raw;
}
function mergeAsArray(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
  return to ? extend(/* @__PURE__ */ Object.create(null), to, from) : from;
}
function mergeEmitsOrPropsOptions(to, from) {
  if (to) {
    if (isArray(to) && isArray(from)) {
      return [.../* @__PURE__ */ new Set([...to, ...from])];
    }
    return extend(
      /* @__PURE__ */ Object.create(null),
      normalizePropsOrEmits(to),
      normalizePropsOrEmits(from != null ? from : {})
    );
  } else {
    return from;
  }
}
function mergeWatchOptions(to, from) {
  if (!to)
    return from;
  if (!from)
    return to;
  const merged = extend(/* @__PURE__ */ Object.create(null), to);
  for (const key in from) {
    merged[key] = mergeAsArray(to[key], from[key]);
  }
  return merged;
}
function createAppContext() {
  return {
    app: null,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let uid$1 = 0;
function createAppAPI(render2, hydrate) {
  return function createApp2(rootComponent, rootProps = null) {
    if (!isFunction$1(rootComponent)) {
      rootComponent = extend({}, rootComponent);
    }
    if (rootProps != null && !isObject$1(rootProps)) {
      rootProps = null;
    }
    const context2 = createAppContext();
    const installedPlugins = /* @__PURE__ */ new Set();
    let isMounted = false;
    const app2 = context2.app = {
      _uid: uid$1++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      _context: context2,
      _instance: null,
      version,
      get config() {
        return context2.config;
      },
      set config(v) {
      },
      use(plugin, ...options) {
        if (installedPlugins.has(plugin))
          ;
        else if (plugin && isFunction$1(plugin.install)) {
          installedPlugins.add(plugin);
          plugin.install(app2, ...options);
        } else if (isFunction$1(plugin)) {
          installedPlugins.add(plugin);
          plugin(app2, ...options);
        } else
          ;
        return app2;
      },
      mixin(mixin) {
        {
          if (!context2.mixins.includes(mixin)) {
            context2.mixins.push(mixin);
          }
        }
        return app2;
      },
      component(name, component) {
        if (!component) {
          return context2.components[name];
        }
        context2.components[name] = component;
        return app2;
      },
      directive(name, directive) {
        if (!directive) {
          return context2.directives[name];
        }
        context2.directives[name] = directive;
        return app2;
      },
      mount(rootContainer, isHydrate, isSVG) {
        if (!isMounted) {
          const vnode = createVNode(
            rootComponent,
            rootProps
          );
          vnode.appContext = context2;
          if (isHydrate && hydrate) {
            hydrate(vnode, rootContainer);
          } else {
            render2(vnode, rootContainer, isSVG);
          }
          isMounted = true;
          app2._container = rootContainer;
          rootContainer.__vue_app__ = app2;
          return getExposeProxy(vnode.component) || vnode.component.proxy;
        }
      },
      unmount() {
        if (isMounted) {
          render2(null, app2._container);
          delete app2._container.__vue_app__;
        }
      },
      provide(key, value) {
        context2.provides[key] = value;
        return app2;
      },
      runWithContext(fn) {
        currentApp = app2;
        try {
          return fn();
        } finally {
          currentApp = null;
        }
      }
    };
    return app2;
  };
}
let currentApp = null;
function provide$1(key, value) {
  if (!currentInstance)
    ;
  else {
    let provides = currentInstance.provides;
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = value;
  }
}
function inject$1(key, defaultValue, treatDefaultAsFactory = false) {
  const instance = currentInstance || currentRenderingInstance;
  if (instance || currentApp) {
    const provides = instance ? instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : currentApp._context.provides;
    if (provides && key in provides) {
      return provides[key];
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction$1(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
    } else
      ;
  }
}
function initProps(instance, rawProps, isStateful, isSSR = false) {
  const props = {};
  const attrs = {};
  def(attrs, InternalObjectKey, 1);
  instance.propsDefaults = /* @__PURE__ */ Object.create(null);
  setFullProps(instance, rawProps, props, attrs);
  for (const key in instance.propsOptions[0]) {
    if (!(key in props)) {
      props[key] = void 0;
    }
  }
  if (isStateful) {
    instance.props = isSSR ? props : shallowReactive(props);
  } else {
    if (!instance.type.props) {
      instance.props = attrs;
    } else {
      instance.props = props;
    }
  }
  instance.attrs = attrs;
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
  const {
    props,
    attrs,
    vnode: { patchFlag }
  } = instance;
  const rawCurrentProps = toRaw(props);
  const [options] = instance.propsOptions;
  let hasAttrsChanged = false;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (optimized || patchFlag > 0) && !(patchFlag & 16)
  ) {
    if (patchFlag & 8) {
      const propsToUpdate = instance.vnode.dynamicProps;
      for (let i = 0; i < propsToUpdate.length; i++) {
        let key = propsToUpdate[i];
        if (isEmitListener(instance.emitsOptions, key)) {
          continue;
        }
        const value = rawProps[key];
        if (options) {
          if (hasOwn(attrs, key)) {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          } else {
            const camelizedKey = camelize(key);
            props[camelizedKey] = resolvePropValue(
              options,
              rawCurrentProps,
              camelizedKey,
              value,
              instance,
              false
              /* isAbsent */
            );
          }
        } else {
          if (value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
  } else {
    if (setFullProps(instance, rawProps, props, attrs)) {
      hasAttrsChanged = true;
    }
    let kebabKey;
    for (const key in rawCurrentProps) {
      if (!rawProps || // for camelCase
      !hasOwn(rawProps, key) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
        if (options) {
          if (rawPrevProps && // for camelCase
          (rawPrevProps[key] !== void 0 || // for kebab-case
          rawPrevProps[kebabKey] !== void 0)) {
            props[key] = resolvePropValue(
              options,
              rawCurrentProps,
              key,
              void 0,
              instance,
              true
              /* isAbsent */
            );
          }
        } else {
          delete props[key];
        }
      }
    }
    if (attrs !== rawCurrentProps) {
      for (const key in attrs) {
        if (!rawProps || !hasOwn(rawProps, key) && true) {
          delete attrs[key];
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (hasAttrsChanged) {
    trigger(instance, "set", "$attrs");
  }
}
function setFullProps(instance, rawProps, props, attrs) {
  const [options, needCastKeys] = instance.propsOptions;
  let hasAttrsChanged = false;
  let rawCastValues;
  if (rawProps) {
    for (let key in rawProps) {
      if (isReservedProp(key)) {
        continue;
      }
      const value = rawProps[key];
      let camelKey;
      if (options && hasOwn(options, camelKey = camelize(key))) {
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          props[camelKey] = value;
        } else {
          (rawCastValues || (rawCastValues = {}))[camelKey] = value;
        }
      } else if (!isEmitListener(instance.emitsOptions, key)) {
        if (!(key in attrs) || value !== attrs[key]) {
          attrs[key] = value;
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (needCastKeys) {
    const rawCurrentProps = toRaw(props);
    const castValues = rawCastValues || EMPTY_OBJ;
    for (let i = 0; i < needCastKeys.length; i++) {
      const key = needCastKeys[i];
      props[key] = resolvePropValue(
        options,
        rawCurrentProps,
        key,
        castValues[key],
        instance,
        !hasOwn(castValues, key)
      );
    }
  }
  return hasAttrsChanged;
}
function resolvePropValue(options, props, key, value, instance, isAbsent) {
  const opt = options[key];
  if (opt != null) {
    const hasDefault = hasOwn(opt, "default");
    if (hasDefault && value === void 0) {
      const defaultValue = opt.default;
      if (opt.type !== Function && !opt.skipFactory && isFunction$1(defaultValue)) {
        const { propsDefaults } = instance;
        if (key in propsDefaults) {
          value = propsDefaults[key];
        } else {
          setCurrentInstance(instance);
          value = propsDefaults[key] = defaultValue.call(
            null,
            props
          );
          unsetCurrentInstance();
        }
      } else {
        value = defaultValue;
      }
    }
    if (opt[
      0
      /* shouldCast */
    ]) {
      if (isAbsent && !hasDefault) {
        value = false;
      } else if (opt[
        1
        /* shouldCastTrue */
      ] && (value === "" || value === hyphenate(key))) {
        value = true;
      }
    }
  }
  return value;
}
function normalizePropsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.propsCache;
  const cached = cache.get(comp);
  if (cached) {
    return cached;
  }
  const raw = comp.props;
  const normalized = {};
  const needCastKeys = [];
  let hasExtends = false;
  if (!isFunction$1(comp)) {
    const extendProps = (raw2) => {
      hasExtends = true;
      const [props, keys] = normalizePropsOptions(raw2, appContext, true);
      extend(normalized, props);
      if (keys)
        needCastKeys.push(...keys);
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendProps);
    }
    if (comp.extends) {
      extendProps(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendProps);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject$1(comp)) {
      cache.set(comp, EMPTY_ARR);
    }
    return EMPTY_ARR;
  }
  if (isArray(raw)) {
    for (let i = 0; i < raw.length; i++) {
      const normalizedKey = camelize(raw[i]);
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ;
      }
    }
  } else if (raw) {
    for (const key in raw) {
      const normalizedKey = camelize(key);
      if (validatePropName(normalizedKey)) {
        const opt = raw[key];
        const prop = normalized[normalizedKey] = isArray(opt) || isFunction$1(opt) ? { type: opt } : extend({}, opt);
        if (prop) {
          const booleanIndex = getTypeIndex(Boolean, prop.type);
          const stringIndex = getTypeIndex(String, prop.type);
          prop[
            0
            /* shouldCast */
          ] = booleanIndex > -1;
          prop[
            1
            /* shouldCastTrue */
          ] = stringIndex < 0 || booleanIndex < stringIndex;
          if (booleanIndex > -1 || hasOwn(prop, "default")) {
            needCastKeys.push(normalizedKey);
          }
        }
      }
    }
  }
  const res = [normalized, needCastKeys];
  if (isObject$1(comp)) {
    cache.set(comp, res);
  }
  return res;
}
function validatePropName(key) {
  if (key[0] !== "$") {
    return true;
  }
  return false;
}
function getType(ctor) {
  const match2 = ctor && ctor.toString().match(/^\s*(function|class) (\w+)/);
  return match2 ? match2[2] : ctor === null ? "null" : "";
}
function isSameType(a, b) {
  return getType(a) === getType(b);
}
function getTypeIndex(type, expectedTypes) {
  if (isArray(expectedTypes)) {
    return expectedTypes.findIndex((t) => isSameType(t, type));
  } else if (isFunction$1(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1;
  }
  return -1;
}
const isInternalKey = (key) => key[0] === "_" || key === "$stable";
const normalizeSlotValue = (value) => isArray(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
const normalizeSlot = (key, rawSlot, ctx) => {
  if (rawSlot._n) {
    return rawSlot;
  }
  const normalized = withCtx((...args) => {
    if (false)
      ;
    return normalizeSlotValue(rawSlot(...args));
  }, ctx);
  normalized._c = false;
  return normalized;
};
const normalizeObjectSlots = (rawSlots, slots, instance) => {
  const ctx = rawSlots._ctx;
  for (const key in rawSlots) {
    if (isInternalKey(key))
      continue;
    const value = rawSlots[key];
    if (isFunction$1(value)) {
      slots[key] = normalizeSlot(key, value, ctx);
    } else if (value != null) {
      const normalized = normalizeSlotValue(value);
      slots[key] = () => normalized;
    }
  }
};
const normalizeVNodeSlots = (instance, children) => {
  const normalized = normalizeSlotValue(children);
  instance.slots.default = () => normalized;
};
const initSlots = (instance, children) => {
  if (instance.vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      instance.slots = toRaw(children);
      def(children, "_", type);
    } else {
      normalizeObjectSlots(
        children,
        instance.slots = {}
      );
    }
  } else {
    instance.slots = {};
    if (children) {
      normalizeVNodeSlots(instance, children);
    }
  }
  def(instance.slots, InternalObjectKey, 1);
};
const updateSlots = (instance, children, optimized) => {
  const { vnode, slots } = instance;
  let needDeletionCheck = true;
  let deletionComparisonTarget = EMPTY_OBJ;
  if (vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      if (optimized && type === 1) {
        needDeletionCheck = false;
      } else {
        extend(slots, children);
        if (!optimized && type === 1) {
          delete slots._;
        }
      }
    } else {
      needDeletionCheck = !children.$stable;
      normalizeObjectSlots(children, slots);
    }
    deletionComparisonTarget = children;
  } else if (children) {
    normalizeVNodeSlots(instance, children);
    deletionComparisonTarget = { default: 1 };
  }
  if (needDeletionCheck) {
    for (const key in slots) {
      if (!isInternalKey(key) && !(key in deletionComparisonTarget)) {
        delete slots[key];
      }
    }
  }
};
function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
  if (isArray(rawRef)) {
    rawRef.forEach(
      (r, i) => setRef(
        r,
        oldRawRef && (isArray(oldRawRef) ? oldRawRef[i] : oldRawRef),
        parentSuspense,
        vnode,
        isUnmount
      )
    );
    return;
  }
  if (isAsyncWrapper(vnode) && !isUnmount) {
    return;
  }
  const refValue = vnode.shapeFlag & 4 ? getExposeProxy(vnode.component) || vnode.component.proxy : vnode.el;
  const value = isUnmount ? null : refValue;
  const { i: owner, r: ref2 } = rawRef;
  const oldRef = oldRawRef && oldRawRef.r;
  const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
  const setupState = owner.setupState;
  if (oldRef != null && oldRef !== ref2) {
    if (isString$3(oldRef)) {
      refs[oldRef] = null;
      if (hasOwn(setupState, oldRef)) {
        setupState[oldRef] = null;
      }
    } else if (isRef(oldRef)) {
      oldRef.value = null;
    }
  }
  if (isFunction$1(ref2)) {
    callWithErrorHandling(ref2, owner, 12, [value, refs]);
  } else {
    const _isString = isString$3(ref2);
    const _isRef = isRef(ref2);
    if (_isString || _isRef) {
      const doSet = () => {
        if (rawRef.f) {
          const existing = _isString ? hasOwn(setupState, ref2) ? setupState[ref2] : refs[ref2] : ref2.value;
          if (isUnmount) {
            isArray(existing) && remove(existing, refValue);
          } else {
            if (!isArray(existing)) {
              if (_isString) {
                refs[ref2] = [refValue];
                if (hasOwn(setupState, ref2)) {
                  setupState[ref2] = refs[ref2];
                }
              } else {
                ref2.value = [refValue];
                if (rawRef.k)
                  refs[rawRef.k] = ref2.value;
              }
            } else if (!existing.includes(refValue)) {
              existing.push(refValue);
            }
          }
        } else if (_isString) {
          refs[ref2] = value;
          if (hasOwn(setupState, ref2)) {
            setupState[ref2] = value;
          }
        } else if (_isRef) {
          ref2.value = value;
          if (rawRef.k)
            refs[rawRef.k] = value;
        } else
          ;
      };
      if (value) {
        doSet.id = -1;
        queuePostRenderEffect(doSet, parentSuspense);
      } else {
        doSet();
      }
    }
  }
}
const queuePostRenderEffect = queueEffectWithSuspense;
function createRenderer(options) {
  return baseCreateRenderer(options);
}
function baseCreateRenderer(options, createHydrationFns) {
  const target = getGlobalThis();
  target.__VUE__ = true;
  const {
    insert: hostInsert,
    remove: hostRemove,
    patchProp: hostPatchProp,
    createElement: hostCreateElement,
    createText: hostCreateText,
    createComment: hostCreateComment,
    setText: hostSetText,
    setElementText: hostSetElementText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    setScopeId: hostSetScopeId = NOOP,
    insertStaticContent: hostInsertStaticContent
  } = options;
  const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, isSVG = false, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
    if (n1 === n2) {
      return;
    }
    if (n1 && !isSameVNodeType(n1, n2)) {
      anchor = getNextHostNode(n1);
      unmount(n1, parentComponent, parentSuspense, true);
      n1 = null;
    }
    if (n2.patchFlag === -2) {
      optimized = false;
      n2.dynamicChildren = null;
    }
    const { type, ref: ref2, shapeFlag } = n2;
    switch (type) {
      case Text:
        processText(n1, n2, container, anchor);
        break;
      case Comment:
        processCommentNode(n1, n2, container, anchor);
        break;
      case Static:
        if (n1 == null) {
          mountStaticNode(n2, container, anchor, isSVG);
        }
        break;
      case Fragment:
        processFragment(
          n1,
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized
        );
        break;
      default:
        if (shapeFlag & 1) {
          processElement(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          );
        } else if (shapeFlag & 6) {
          processComponent(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          );
        } else if (shapeFlag & 64) {
          type.process(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized,
            internals
          );
        } else if (shapeFlag & 128) {
          type.process(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized,
            internals
          );
        } else
          ;
    }
    if (ref2 != null && parentComponent) {
      setRef(ref2, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
    }
  };
  const processText = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(
        n2.el = hostCreateText(n2.children),
        container,
        anchor
      );
    } else {
      const el = n2.el = n1.el;
      if (n2.children !== n1.children) {
        hostSetText(el, n2.children);
      }
    }
  };
  const processCommentNode = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(
        n2.el = hostCreateComment(n2.children || ""),
        container,
        anchor
      );
    } else {
      n2.el = n1.el;
    }
  };
  const mountStaticNode = (n2, container, anchor, isSVG) => {
    [n2.el, n2.anchor] = hostInsertStaticContent(
      n2.children,
      container,
      anchor,
      isSVG,
      n2.el,
      n2.anchor
    );
  };
  const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostInsert(el, container, nextSibling);
      el = next;
    }
    hostInsert(anchor, container, nextSibling);
  };
  const removeStaticNode = ({ el, anchor }) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostRemove(el);
      el = next;
    }
    hostRemove(anchor);
  };
  const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    isSVG = isSVG || n2.type === "svg";
    if (n1 == null) {
      mountElement(
        n2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized
      );
    } else {
      patchElement(
        n1,
        n2,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized
      );
    }
  };
  const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    let el;
    let vnodeHook;
    const { type, props, shapeFlag, transition, dirs } = vnode;
    el = vnode.el = hostCreateElement(
      vnode.type,
      isSVG,
      props && props.is,
      props
    );
    if (shapeFlag & 8) {
      hostSetElementText(el, vnode.children);
    } else if (shapeFlag & 16) {
      mountChildren(
        vnode.children,
        el,
        null,
        parentComponent,
        parentSuspense,
        isSVG && type !== "foreignObject",
        slotScopeIds,
        optimized
      );
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "created");
    }
    setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
    if (props) {
      for (const key in props) {
        if (key !== "value" && !isReservedProp(key)) {
          hostPatchProp(
            el,
            key,
            null,
            props[key],
            isSVG,
            vnode.children,
            parentComponent,
            parentSuspense,
            unmountChildren
          );
        }
      }
      if ("value" in props) {
        hostPatchProp(el, "value", null, props.value);
      }
      if (vnodeHook = props.onVnodeBeforeMount) {
        invokeVNodeHook(vnodeHook, parentComponent, vnode);
      }
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
    }
    const needCallTransitionHooks = (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
    if (needCallTransitionHooks) {
      transition.beforeEnter(el);
    }
    hostInsert(el, container, anchor);
    if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        needCallTransitionHooks && transition.enter(el);
        dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
      }, parentSuspense);
    }
  };
  const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
    if (scopeId) {
      hostSetScopeId(el, scopeId);
    }
    if (slotScopeIds) {
      for (let i = 0; i < slotScopeIds.length; i++) {
        hostSetScopeId(el, slotScopeIds[i]);
      }
    }
    if (parentComponent) {
      let subTree = parentComponent.subTree;
      if (vnode === subTree) {
        const parentVNode = parentComponent.vnode;
        setScopeId(
          el,
          parentVNode,
          parentVNode.scopeId,
          parentVNode.slotScopeIds,
          parentComponent.parent
        );
      }
    }
  };
  const mountChildren = (children, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, start = 0) => {
    for (let i = start; i < children.length; i++) {
      const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
      patch(
        null,
        child,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized
      );
    }
  };
  const patchElement = (n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    const el = n2.el = n1.el;
    let { patchFlag, dynamicChildren, dirs } = n2;
    patchFlag |= n1.patchFlag & 16;
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    let vnodeHook;
    parentComponent && toggleRecurse(parentComponent, false);
    if (vnodeHook = newProps.onVnodeBeforeUpdate) {
      invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
    }
    if (dirs) {
      invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
    }
    parentComponent && toggleRecurse(parentComponent, true);
    const areChildrenSVG = isSVG && n2.type !== "foreignObject";
    if (dynamicChildren) {
      patchBlockChildren(
        n1.dynamicChildren,
        dynamicChildren,
        el,
        parentComponent,
        parentSuspense,
        areChildrenSVG,
        slotScopeIds
      );
    } else if (!optimized) {
      patchChildren(
        n1,
        n2,
        el,
        null,
        parentComponent,
        parentSuspense,
        areChildrenSVG,
        slotScopeIds,
        false
      );
    }
    if (patchFlag > 0) {
      if (patchFlag & 16) {
        patchProps(
          el,
          n2,
          oldProps,
          newProps,
          parentComponent,
          parentSuspense,
          isSVG
        );
      } else {
        if (patchFlag & 2) {
          if (oldProps.class !== newProps.class) {
            hostPatchProp(el, "class", null, newProps.class, isSVG);
          }
        }
        if (patchFlag & 4) {
          hostPatchProp(el, "style", oldProps.style, newProps.style, isSVG);
        }
        if (patchFlag & 8) {
          const propsToUpdate = n2.dynamicProps;
          for (let i = 0; i < propsToUpdate.length; i++) {
            const key = propsToUpdate[i];
            const prev = oldProps[key];
            const next = newProps[key];
            if (next !== prev || key === "value") {
              hostPatchProp(
                el,
                key,
                prev,
                next,
                isSVG,
                n1.children,
                parentComponent,
                parentSuspense,
                unmountChildren
              );
            }
          }
        }
      }
      if (patchFlag & 1) {
        if (n1.children !== n2.children) {
          hostSetElementText(el, n2.children);
        }
      }
    } else if (!optimized && dynamicChildren == null) {
      patchProps(
        el,
        n2,
        oldProps,
        newProps,
        parentComponent,
        parentSuspense,
        isSVG
      );
    }
    if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
        dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
      }, parentSuspense);
    }
  };
  const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, isSVG, slotScopeIds) => {
    for (let i = 0; i < newChildren.length; i++) {
      const oldVNode = oldChildren[i];
      const newVNode = newChildren[i];
      const container = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        oldVNode.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (oldVNode.type === Fragment || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !isSameVNodeType(oldVNode, newVNode) || // - In the case of a component, it could contain anything.
        oldVNode.shapeFlag & (6 | 64)) ? hostParentNode(oldVNode.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          fallbackContainer
        )
      );
      patch(
        oldVNode,
        newVNode,
        container,
        null,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        true
      );
    }
  };
  const patchProps = (el, vnode, oldProps, newProps, parentComponent, parentSuspense, isSVG) => {
    if (oldProps !== newProps) {
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!isReservedProp(key) && !(key in newProps)) {
            hostPatchProp(
              el,
              key,
              oldProps[key],
              null,
              isSVG,
              vnode.children,
              parentComponent,
              parentSuspense,
              unmountChildren
            );
          }
        }
      }
      for (const key in newProps) {
        if (isReservedProp(key))
          continue;
        const next = newProps[key];
        const prev = oldProps[key];
        if (next !== prev && key !== "value") {
          hostPatchProp(
            el,
            key,
            prev,
            next,
            isSVG,
            vnode.children,
            parentComponent,
            parentSuspense,
            unmountChildren
          );
        }
      }
      if ("value" in newProps) {
        hostPatchProp(el, "value", oldProps.value, newProps.value);
      }
    }
  };
  const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
    const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
    let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
    if (fragmentSlotScopeIds) {
      slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
    }
    if (n1 == null) {
      hostInsert(fragmentStartAnchor, container, anchor);
      hostInsert(fragmentEndAnchor, container, anchor);
      mountChildren(
        n2.children,
        container,
        fragmentEndAnchor,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized
      );
    } else {
      if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && // #2715 the previous fragment could've been a BAILed one as a result
      // of renderSlot() with no valid children
      n1.dynamicChildren) {
        patchBlockChildren(
          n1.dynamicChildren,
          dynamicChildren,
          container,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds
        );
        if (
          // #2080 if the stable fragment has a key, it's a <template v-for> that may
          //  get moved around. Make sure all root level vnodes inherit el.
          // #2134 or if it's a component root, it may also get moved around
          // as the component is being moved.
          n2.key != null || parentComponent && n2 === parentComponent.subTree
        ) {
          traverseStaticChildren(
            n1,
            n2,
            true
            /* shallow */
          );
        }
      } else {
        patchChildren(
          n1,
          n2,
          container,
          fragmentEndAnchor,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized
        );
      }
    }
  };
  const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    n2.slotScopeIds = slotScopeIds;
    if (n1 == null) {
      if (n2.shapeFlag & 512) {
        parentComponent.ctx.activate(
          n2,
          container,
          anchor,
          isSVG,
          optimized
        );
      } else {
        mountComponent(
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          optimized
        );
      }
    } else {
      updateComponent(n1, n2, optimized);
    }
  };
  const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
    const instance = initialVNode.component = createComponentInstance(
      initialVNode,
      parentComponent,
      parentSuspense
    );
    if (isKeepAlive(initialVNode)) {
      instance.ctx.renderer = internals;
    }
    {
      setupComponent(instance);
    }
    if (instance.asyncDep) {
      parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect);
      if (!initialVNode.el) {
        const placeholder = instance.subTree = createVNode(Comment);
        processCommentNode(null, placeholder, container, anchor);
      }
      return;
    }
    setupRenderEffect(
      instance,
      initialVNode,
      container,
      anchor,
      parentSuspense,
      isSVG,
      optimized
    );
  };
  const updateComponent = (n1, n2, optimized) => {
    const instance = n2.component = n1.component;
    if (shouldUpdateComponent(n1, n2, optimized)) {
      if (instance.asyncDep && !instance.asyncResolved) {
        updateComponentPreRender(instance, n2, optimized);
        return;
      } else {
        instance.next = n2;
        invalidateJob(instance.update);
        instance.update();
      }
    } else {
      n2.el = n1.el;
      instance.vnode = n2;
    }
  };
  const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized) => {
    const componentUpdateFn = () => {
      if (!instance.isMounted) {
        let vnodeHook;
        const { el, props } = initialVNode;
        const { bm, m, parent } = instance;
        const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
        toggleRecurse(instance, false);
        if (bm) {
          invokeArrayFns(bm);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
          invokeVNodeHook(vnodeHook, parent, initialVNode);
        }
        toggleRecurse(instance, true);
        if (el && hydrateNode) {
          const hydrateSubTree = () => {
            instance.subTree = renderComponentRoot(instance);
            hydrateNode(
              el,
              instance.subTree,
              instance,
              parentSuspense,
              null
            );
          };
          if (isAsyncWrapperVNode) {
            initialVNode.type.__asyncLoader().then(
              // note: we are moving the render call into an async callback,
              // which means it won't track dependencies - but it's ok because
              // a server-rendered async wrapper is already in resolved state
              // and it will never need to change.
              () => !instance.isUnmounted && hydrateSubTree()
            );
          } else {
            hydrateSubTree();
          }
        } else {
          const subTree = instance.subTree = renderComponentRoot(instance);
          patch(
            null,
            subTree,
            container,
            anchor,
            instance,
            parentSuspense,
            isSVG
          );
          initialVNode.el = subTree.el;
        }
        if (m) {
          queuePostRenderEffect(m, parentSuspense);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
          const scopedInitialVNode = initialVNode;
          queuePostRenderEffect(
            () => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode),
            parentSuspense
          );
        }
        if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) {
          instance.a && queuePostRenderEffect(instance.a, parentSuspense);
        }
        instance.isMounted = true;
        initialVNode = container = anchor = null;
      } else {
        let { next, bu, u, parent, vnode } = instance;
        let originNext = next;
        let vnodeHook;
        toggleRecurse(instance, false);
        if (next) {
          next.el = vnode.el;
          updateComponentPreRender(instance, next, optimized);
        } else {
          next = vnode;
        }
        if (bu) {
          invokeArrayFns(bu);
        }
        if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
          invokeVNodeHook(vnodeHook, parent, next, vnode);
        }
        toggleRecurse(instance, true);
        const nextTree = renderComponentRoot(instance);
        const prevTree = instance.subTree;
        instance.subTree = nextTree;
        patch(
          prevTree,
          nextTree,
          // parent may have changed if it's in a teleport
          hostParentNode(prevTree.el),
          // anchor may have changed if it's in a fragment
          getNextHostNode(prevTree),
          instance,
          parentSuspense,
          isSVG
        );
        next.el = nextTree.el;
        if (originNext === null) {
          updateHOCHostEl(instance, nextTree.el);
        }
        if (u) {
          queuePostRenderEffect(u, parentSuspense);
        }
        if (vnodeHook = next.props && next.props.onVnodeUpdated) {
          queuePostRenderEffect(
            () => invokeVNodeHook(vnodeHook, parent, next, vnode),
            parentSuspense
          );
        }
      }
    };
    const effect = instance.effect = new ReactiveEffect(
      componentUpdateFn,
      () => queueJob(update),
      instance.scope
      // track it in component's effect scope
    );
    const update = instance.update = () => effect.run();
    update.id = instance.uid;
    toggleRecurse(instance, true);
    update();
  };
  const updateComponentPreRender = (instance, nextVNode, optimized) => {
    nextVNode.component = instance;
    const prevProps = instance.vnode.props;
    instance.vnode = nextVNode;
    instance.next = null;
    updateProps(instance, nextVNode.props, prevProps, optimized);
    updateSlots(instance, nextVNode.children, optimized);
    pauseTracking();
    flushPreFlushCbs();
    resetTracking();
  };
  const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized = false) => {
    const c1 = n1 && n1.children;
    const prevShapeFlag = n1 ? n1.shapeFlag : 0;
    const c2 = n2.children;
    const { patchFlag, shapeFlag } = n2;
    if (patchFlag > 0) {
      if (patchFlag & 128) {
        patchKeyedChildren(
          c1,
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized
        );
        return;
      } else if (patchFlag & 256) {
        patchUnkeyedChildren(
          c1,
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized
        );
        return;
      }
    }
    if (shapeFlag & 8) {
      if (prevShapeFlag & 16) {
        unmountChildren(c1, parentComponent, parentSuspense);
      }
      if (c2 !== c1) {
        hostSetElementText(container, c2);
      }
    } else {
      if (prevShapeFlag & 16) {
        if (shapeFlag & 16) {
          patchKeyedChildren(
            c1,
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          );
        } else {
          unmountChildren(c1, parentComponent, parentSuspense, true);
        }
      } else {
        if (prevShapeFlag & 8) {
          hostSetElementText(container, "");
        }
        if (shapeFlag & 16) {
          mountChildren(
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          );
        }
      }
    }
  };
  const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    c1 = c1 || EMPTY_ARR;
    c2 = c2 || EMPTY_ARR;
    const oldLength = c1.length;
    const newLength = c2.length;
    const commonLength = Math.min(oldLength, newLength);
    let i;
    for (i = 0; i < commonLength; i++) {
      const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      patch(
        c1[i],
        nextChild,
        container,
        null,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized
      );
    }
    if (oldLength > newLength) {
      unmountChildren(
        c1,
        parentComponent,
        parentSuspense,
        true,
        false,
        commonLength
      );
    } else {
      mountChildren(
        c2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized,
        commonLength
      );
    }
  };
  const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    let i = 0;
    const l2 = c2.length;
    let e1 = c1.length - 1;
    let e2 = l2 - 1;
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized
        );
      } else {
        break;
      }
      i++;
    }
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized
        );
      } else {
        break;
      }
      e1--;
      e2--;
    }
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1;
        const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
        while (i <= e2) {
          patch(
            null,
            c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]),
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          );
          i++;
        }
      }
    } else if (i > e2) {
      while (i <= e1) {
        unmount(c1[i], parentComponent, parentSuspense, true);
        i++;
      }
    } else {
      const s1 = i;
      const s2 = i;
      const keyToNewIndexMap = /* @__PURE__ */ new Map();
      for (i = s2; i <= e2; i++) {
        const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        if (nextChild.key != null) {
          keyToNewIndexMap.set(nextChild.key, i);
        }
      }
      let j;
      let patched = 0;
      const toBePatched = e2 - s2 + 1;
      let moved = false;
      let maxNewIndexSoFar = 0;
      const newIndexToOldIndexMap = new Array(toBePatched);
      for (i = 0; i < toBePatched; i++)
        newIndexToOldIndexMap[i] = 0;
      for (i = s1; i <= e1; i++) {
        const prevChild = c1[i];
        if (patched >= toBePatched) {
          unmount(prevChild, parentComponent, parentSuspense, true);
          continue;
        }
        let newIndex;
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key);
        } else {
          for (j = s2; j <= e2; j++) {
            if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
              newIndex = j;
              break;
            }
          }
        }
        if (newIndex === void 0) {
          unmount(prevChild, parentComponent, parentSuspense, true);
        } else {
          newIndexToOldIndexMap[newIndex - s2] = i + 1;
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex;
          } else {
            moved = true;
          }
          patch(
            prevChild,
            c2[newIndex],
            container,
            null,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          );
          patched++;
        }
      }
      const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
      j = increasingNewIndexSequence.length - 1;
      for (i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i;
        const nextChild = c2[nextIndex];
        const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
        if (newIndexToOldIndexMap[i] === 0) {
          patch(
            null,
            nextChild,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          );
        } else if (moved) {
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            move(nextChild, container, anchor, 2);
          } else {
            j--;
          }
        }
      }
    }
  };
  const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
    const { el, type, transition, children, shapeFlag } = vnode;
    if (shapeFlag & 6) {
      move(vnode.component.subTree, container, anchor, moveType);
      return;
    }
    if (shapeFlag & 128) {
      vnode.suspense.move(container, anchor, moveType);
      return;
    }
    if (shapeFlag & 64) {
      type.move(vnode, container, anchor, internals);
      return;
    }
    if (type === Fragment) {
      hostInsert(el, container, anchor);
      for (let i = 0; i < children.length; i++) {
        move(children[i], container, anchor, moveType);
      }
      hostInsert(vnode.anchor, container, anchor);
      return;
    }
    if (type === Static) {
      moveStaticNode(vnode, container, anchor);
      return;
    }
    const needTransition = moveType !== 2 && shapeFlag & 1 && transition;
    if (needTransition) {
      if (moveType === 0) {
        transition.beforeEnter(el);
        hostInsert(el, container, anchor);
        queuePostRenderEffect(() => transition.enter(el), parentSuspense);
      } else {
        const { leave, delayLeave, afterLeave } = transition;
        const remove22 = () => hostInsert(el, container, anchor);
        const performLeave = () => {
          leave(el, () => {
            remove22();
            afterLeave && afterLeave();
          });
        };
        if (delayLeave) {
          delayLeave(el, remove22, performLeave);
        } else {
          performLeave();
        }
      }
    } else {
      hostInsert(el, container, anchor);
    }
  };
  const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
    const {
      type,
      props,
      ref: ref2,
      children,
      dynamicChildren,
      shapeFlag,
      patchFlag,
      dirs
    } = vnode;
    if (ref2 != null) {
      setRef(ref2, null, parentSuspense, vnode, true);
    }
    if (shapeFlag & 256) {
      parentComponent.ctx.deactivate(vnode);
      return;
    }
    const shouldInvokeDirs = shapeFlag & 1 && dirs;
    const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
    let vnodeHook;
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
      invokeVNodeHook(vnodeHook, parentComponent, vnode);
    }
    if (shapeFlag & 6) {
      unmountComponent(vnode.component, parentSuspense, doRemove);
    } else {
      if (shapeFlag & 128) {
        vnode.suspense.unmount(parentSuspense, doRemove);
        return;
      }
      if (shouldInvokeDirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
      }
      if (shapeFlag & 64) {
        vnode.type.remove(
          vnode,
          parentComponent,
          parentSuspense,
          optimized,
          internals,
          doRemove
        );
      } else if (dynamicChildren && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
        unmountChildren(
          dynamicChildren,
          parentComponent,
          parentSuspense,
          false,
          true
        );
      } else if (type === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
        unmountChildren(children, parentComponent, parentSuspense);
      }
      if (doRemove) {
        remove2(vnode);
      }
    }
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
      }, parentSuspense);
    }
  };
  const remove2 = (vnode) => {
    const { type, el, anchor, transition } = vnode;
    if (type === Fragment) {
      {
        removeFragment(el, anchor);
      }
      return;
    }
    if (type === Static) {
      removeStaticNode(vnode);
      return;
    }
    const performRemove = () => {
      hostRemove(el);
      if (transition && !transition.persisted && transition.afterLeave) {
        transition.afterLeave();
      }
    };
    if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
      const { leave, delayLeave } = transition;
      const performLeave = () => leave(el, performRemove);
      if (delayLeave) {
        delayLeave(vnode.el, performRemove, performLeave);
      } else {
        performLeave();
      }
    } else {
      performRemove();
    }
  };
  const removeFragment = (cur, end) => {
    let next;
    while (cur !== end) {
      next = hostNextSibling(cur);
      hostRemove(cur);
      cur = next;
    }
    hostRemove(end);
  };
  const unmountComponent = (instance, parentSuspense, doRemove) => {
    const { bum, scope: scope2, update, subTree, um } = instance;
    if (bum) {
      invokeArrayFns(bum);
    }
    scope2.stop();
    if (update) {
      update.active = false;
      unmount(subTree, instance, parentSuspense, doRemove);
    }
    if (um) {
      queuePostRenderEffect(um, parentSuspense);
    }
    queuePostRenderEffect(() => {
      instance.isUnmounted = true;
    }, parentSuspense);
    if (parentSuspense && parentSuspense.pendingBranch && !parentSuspense.isUnmounted && instance.asyncDep && !instance.asyncResolved && instance.suspenseId === parentSuspense.pendingId) {
      parentSuspense.deps--;
      if (parentSuspense.deps === 0) {
        parentSuspense.resolve();
      }
    }
  };
  const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
    for (let i = start; i < children.length; i++) {
      unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
    }
  };
  const getNextHostNode = (vnode) => {
    if (vnode.shapeFlag & 6) {
      return getNextHostNode(vnode.component.subTree);
    }
    if (vnode.shapeFlag & 128) {
      return vnode.suspense.next();
    }
    return hostNextSibling(vnode.anchor || vnode.el);
  };
  const render2 = (vnode, container, isSVG) => {
    if (vnode == null) {
      if (container._vnode) {
        unmount(container._vnode, null, null, true);
      }
    } else {
      patch(container._vnode || null, vnode, container, null, null, null, isSVG);
    }
    flushPreFlushCbs();
    flushPostFlushCbs();
    container._vnode = vnode;
  };
  const internals = {
    p: patch,
    um: unmount,
    m: move,
    r: remove2,
    mt: mountComponent,
    mc: mountChildren,
    pc: patchChildren,
    pbc: patchBlockChildren,
    n: getNextHostNode,
    o: options
  };
  let hydrate;
  let hydrateNode;
  if (createHydrationFns) {
    [hydrate, hydrateNode] = createHydrationFns(
      internals
    );
  }
  return {
    render: render2,
    hydrate,
    createApp: createAppAPI(render2, hydrate)
  };
}
function toggleRecurse({ effect, update }, allowed) {
  effect.allowRecurse = update.allowRecurse = allowed;
}
function traverseStaticChildren(n1, n2, shallow = false) {
  const ch1 = n1.children;
  const ch2 = n2.children;
  if (isArray(ch1) && isArray(ch2)) {
    for (let i = 0; i < ch1.length; i++) {
      const c1 = ch1[i];
      let c2 = ch2[i];
      if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
        if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
          c2 = ch2[i] = cloneIfMounted(ch2[i]);
          c2.el = c1.el;
        }
        if (!shallow)
          traverseStaticChildren(c1, c2);
      }
      if (c2.type === Text) {
        c2.el = c1.el;
      }
    }
  }
}
function getSequence(arr) {
  const p2 = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p2[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = u + v >> 1;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p2[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p2[v];
  }
  return result;
}
const isTeleport = (type) => type.__isTeleport;
const Fragment = Symbol.for("v-fgt");
const Text = Symbol.for("v-txt");
const Comment = Symbol.for("v-cmt");
const Static = Symbol.for("v-stc");
const blockStack = [];
let currentBlock = null;
function openBlock(disableTracking = false) {
  blockStack.push(currentBlock = disableTracking ? null : []);
}
function closeBlock() {
  blockStack.pop();
  currentBlock = blockStack[blockStack.length - 1] || null;
}
let isBlockTreeEnabled = 1;
function setBlockTracking(value) {
  isBlockTreeEnabled += value;
}
function setupBlock(vnode) {
  vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
  closeBlock();
  if (isBlockTreeEnabled > 0 && currentBlock) {
    currentBlock.push(vnode);
  }
  return vnode;
}
function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
  return setupBlock(
    createBaseVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      shapeFlag,
      true
      /* isBlock */
    )
  );
}
function createBlock(type, props, children, patchFlag, dynamicProps) {
  return setupBlock(
    createVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      true
      /* isBlock: prevent a block from tracking itself */
    )
  );
}
function isVNode(value) {
  return value ? value.__v_isVNode === true : false;
}
function isSameVNodeType(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key;
}
const InternalObjectKey = `__vInternal`;
const normalizeKey = ({ key }) => key != null ? key : null;
const normalizeRef = ({
  ref: ref2,
  ref_key,
  ref_for
}) => {
  if (typeof ref2 === "number") {
    ref2 = "" + ref2;
  }
  return ref2 != null ? isString$3(ref2) || isRef(ref2) || isFunction$1(ref2) ? { i: currentRenderingInstance, r: ref2, k: ref_key, f: !!ref_for } : ref2 : null;
};
function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
  const vnode = {
    __v_isVNode: true,
    __v_skip: true,
    type,
    props,
    key: props && normalizeKey(props),
    ref: props && normalizeRef(props),
    scopeId: currentScopeId,
    slotScopeIds: null,
    children,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    appContext: null,
    ctx: currentRenderingInstance
  };
  if (needFullChildrenNormalization) {
    normalizeChildren(vnode, children);
    if (shapeFlag & 128) {
      type.normalize(vnode);
    }
  } else if (children) {
    vnode.shapeFlag |= isString$3(children) ? 8 : 16;
  }
  if (isBlockTreeEnabled > 0 && // avoid a block node from tracking itself
  !isBlockNode && // has current parent block
  currentBlock && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (vnode.patchFlag > 0 || shapeFlag & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  vnode.patchFlag !== 32) {
    currentBlock.push(vnode);
  }
  return vnode;
}
const createVNode = _createVNode;
function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
  if (!type || type === NULL_DYNAMIC_COMPONENT) {
    type = Comment;
  }
  if (isVNode(type)) {
    const cloned = cloneVNode(
      type,
      props,
      true
      /* mergeRef: true */
    );
    if (children) {
      normalizeChildren(cloned, children);
    }
    if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
      if (cloned.shapeFlag & 6) {
        currentBlock[currentBlock.indexOf(type)] = cloned;
      } else {
        currentBlock.push(cloned);
      }
    }
    cloned.patchFlag |= -2;
    return cloned;
  }
  if (isClassComponent(type)) {
    type = type.__vccOpts;
  }
  if (props) {
    props = guardReactiveProps(props);
    let { class: klass, style: style2 } = props;
    if (klass && !isString$3(klass)) {
      props.class = normalizeClass(klass);
    }
    if (isObject$1(style2)) {
      if (isProxy(style2) && !isArray(style2)) {
        style2 = extend({}, style2);
      }
      props.style = normalizeStyle(style2);
    }
  }
  const shapeFlag = isString$3(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject$1(type) ? 4 : isFunction$1(type) ? 2 : 0;
  return createBaseVNode(
    type,
    props,
    children,
    patchFlag,
    dynamicProps,
    shapeFlag,
    isBlockNode,
    true
  );
}
function guardReactiveProps(props) {
  if (!props)
    return null;
  return isProxy(props) || InternalObjectKey in props ? extend({}, props) : props;
}
function cloneVNode(vnode, extraProps, mergeRef = false) {
  const { props, ref: ref2, patchFlag, children } = vnode;
  const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
  const cloned = {
    __v_isVNode: true,
    __v_skip: true,
    type: vnode.type,
    props: mergedProps,
    key: mergedProps && normalizeKey(mergedProps),
    ref: extraProps && extraProps.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      mergeRef && ref2 ? isArray(ref2) ? ref2.concat(normalizeRef(extraProps)) : [ref2, normalizeRef(extraProps)] : normalizeRef(extraProps)
    ) : ref2,
    scopeId: vnode.scopeId,
    slotScopeIds: vnode.slotScopeIds,
    children,
    target: vnode.target,
    targetAnchor: vnode.targetAnchor,
    staticCount: vnode.staticCount,
    shapeFlag: vnode.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
    dynamicProps: vnode.dynamicProps,
    dynamicChildren: vnode.dynamicChildren,
    appContext: vnode.appContext,
    dirs: vnode.dirs,
    transition: vnode.transition,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: vnode.component,
    suspense: vnode.suspense,
    ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
    ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
    el: vnode.el,
    anchor: vnode.anchor,
    ctx: vnode.ctx,
    ce: vnode.ce
  };
  return cloned;
}
function createTextVNode(text2 = " ", flag = 0) {
  return createVNode(Text, null, text2, flag);
}
function createCommentVNode(text2 = "", asBlock = false) {
  return asBlock ? (openBlock(), createBlock(Comment, null, text2)) : createVNode(Comment, null, text2);
}
function normalizeVNode(child) {
  if (child == null || typeof child === "boolean") {
    return createVNode(Comment);
  } else if (isArray(child)) {
    return createVNode(
      Fragment,
      null,
      // #3666, avoid reference pollution when reusing vnode
      child.slice()
    );
  } else if (typeof child === "object") {
    return cloneIfMounted(child);
  } else {
    return createVNode(Text, null, String(child));
  }
}
function cloneIfMounted(child) {
  return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
}
function normalizeChildren(vnode, children) {
  let type = 0;
  const { shapeFlag } = vnode;
  if (children == null) {
    children = null;
  } else if (isArray(children)) {
    type = 16;
  } else if (typeof children === "object") {
    if (shapeFlag & (1 | 64)) {
      const slot = children.default;
      if (slot) {
        slot._c && (slot._d = false);
        normalizeChildren(vnode, slot());
        slot._c && (slot._d = true);
      }
      return;
    } else {
      type = 32;
      const slotFlag = children._;
      if (!slotFlag && !(InternalObjectKey in children)) {
        children._ctx = currentRenderingInstance;
      } else if (slotFlag === 3 && currentRenderingInstance) {
        if (currentRenderingInstance.slots._ === 1) {
          children._ = 1;
        } else {
          children._ = 2;
          vnode.patchFlag |= 1024;
        }
      }
    }
  } else if (isFunction$1(children)) {
    children = { default: children, _ctx: currentRenderingInstance };
    type = 32;
  } else {
    children = String(children);
    if (shapeFlag & 64) {
      type = 16;
      children = [createTextVNode(children)];
    } else {
      type = 8;
    }
  }
  vnode.children = children;
  vnode.shapeFlag |= type;
}
function mergeProps(...args) {
  const ret = {};
  for (let i = 0; i < args.length; i++) {
    const toMerge = args[i];
    for (const key in toMerge) {
      if (key === "class") {
        if (ret.class !== toMerge.class) {
          ret.class = normalizeClass([ret.class, toMerge.class]);
        }
      } else if (key === "style") {
        ret.style = normalizeStyle([ret.style, toMerge.style]);
      } else if (isOn(key)) {
        const existing = ret[key];
        const incoming = toMerge[key];
        if (incoming && existing !== incoming && !(isArray(existing) && existing.includes(incoming))) {
          ret[key] = existing ? [].concat(existing, incoming) : incoming;
        }
      } else if (key !== "") {
        ret[key] = toMerge[key];
      }
    }
  }
  return ret;
}
function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
  callWithAsyncErrorHandling(hook, instance, 7, [
    vnode,
    prevVNode
  ]);
}
const emptyAppContext = createAppContext();
let uid = 0;
function createComponentInstance(vnode, parent, suspense) {
  const type = vnode.type;
  const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
  const instance = {
    uid: uid++,
    vnode,
    type,
    parent,
    appContext,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    scope: new EffectScope(
      true
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: parent ? parent.provides : Object.create(appContext.provides),
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: normalizePropsOptions(type, appContext),
    emitsOptions: normalizeEmitsOptions(type, appContext),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: EMPTY_OBJ,
    // inheritAttrs
    inheritAttrs: type.inheritAttrs,
    // state
    ctx: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,
    slots: EMPTY_OBJ,
    refs: EMPTY_OBJ,
    setupState: EMPTY_OBJ,
    setupContext: null,
    attrsProxy: null,
    slotsProxy: null,
    // suspense related
    suspense,
    suspenseId: suspense ? suspense.pendingId : 0,
    asyncDep: null,
    asyncResolved: false,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  {
    instance.ctx = { _: instance };
  }
  instance.root = parent ? parent.root : instance;
  instance.emit = emit.bind(null, instance);
  if (vnode.ce) {
    vnode.ce(instance);
  }
  return instance;
}
let currentInstance = null;
const getCurrentInstance = () => currentInstance || currentRenderingInstance;
let internalSetCurrentInstance;
let globalCurrentInstanceSetters;
let settersKey = "__VUE_INSTANCE_SETTERS__";
{
  if (!(globalCurrentInstanceSetters = getGlobalThis()[settersKey])) {
    globalCurrentInstanceSetters = getGlobalThis()[settersKey] = [];
  }
  globalCurrentInstanceSetters.push((i) => currentInstance = i);
  internalSetCurrentInstance = (instance) => {
    if (globalCurrentInstanceSetters.length > 1) {
      globalCurrentInstanceSetters.forEach((s) => s(instance));
    } else {
      globalCurrentInstanceSetters[0](instance);
    }
  };
}
const setCurrentInstance = (instance) => {
  internalSetCurrentInstance(instance);
  instance.scope.on();
};
const unsetCurrentInstance = () => {
  currentInstance && currentInstance.scope.off();
  internalSetCurrentInstance(null);
};
function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & 4;
}
let isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false) {
  isInSSRComponentSetup = isSSR;
  const { props, children } = instance.vnode;
  const isStateful = isStatefulComponent(instance);
  initProps(instance, props, isStateful, isSSR);
  initSlots(instance, children);
  const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
  isInSSRComponentSetup = false;
  return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
  const Component = instance.type;
  instance.accessCache = /* @__PURE__ */ Object.create(null);
  instance.proxy = markRaw(new Proxy(instance.ctx, PublicInstanceProxyHandlers));
  const { setup } = Component;
  if (setup) {
    const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
    setCurrentInstance(instance);
    pauseTracking();
    const setupResult = callWithErrorHandling(
      setup,
      instance,
      0,
      [instance.props, setupContext]
    );
    resetTracking();
    unsetCurrentInstance();
    if (isPromise(setupResult)) {
      setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
      if (isSSR) {
        return setupResult.then((resolvedResult) => {
          handleSetupResult(instance, resolvedResult, isSSR);
        }).catch((e) => {
          handleError(e, instance, 0);
        });
      } else {
        instance.asyncDep = setupResult;
      }
    } else {
      handleSetupResult(instance, setupResult, isSSR);
    }
  } else {
    finishComponentSetup(instance, isSSR);
  }
}
function handleSetupResult(instance, setupResult, isSSR) {
  if (isFunction$1(setupResult)) {
    if (instance.type.__ssrInlineRender) {
      instance.ssrRender = setupResult;
    } else {
      instance.render = setupResult;
    }
  } else if (isObject$1(setupResult)) {
    instance.setupState = proxyRefs(setupResult);
  } else
    ;
  finishComponentSetup(instance, isSSR);
}
let compile$1;
function finishComponentSetup(instance, isSSR, skipOptions) {
  const Component = instance.type;
  if (!instance.render) {
    if (!isSSR && compile$1 && !Component.render) {
      const template = Component.template || resolveMergedOptions(instance).template;
      if (template) {
        const { isCustomElement, compilerOptions } = instance.appContext.config;
        const { delimiters, compilerOptions: componentCompilerOptions } = Component;
        const finalCompilerOptions = extend(
          extend(
            {
              isCustomElement,
              delimiters
            },
            compilerOptions
          ),
          componentCompilerOptions
        );
        Component.render = compile$1(template, finalCompilerOptions);
      }
    }
    instance.render = Component.render || NOOP;
  }
  {
    setCurrentInstance(instance);
    pauseTracking();
    applyOptions(instance);
    resetTracking();
    unsetCurrentInstance();
  }
}
function getAttrsProxy(instance) {
  return instance.attrsProxy || (instance.attrsProxy = new Proxy(
    instance.attrs,
    {
      get(target, key) {
        track(instance, "get", "$attrs");
        return target[key];
      }
    }
  ));
}
function createSetupContext(instance) {
  const expose = (exposed) => {
    instance.exposed = exposed || {};
  };
  {
    return {
      get attrs() {
        return getAttrsProxy(instance);
      },
      slots: instance.slots,
      emit: instance.emit,
      expose
    };
  }
}
function getExposeProxy(instance) {
  if (instance.exposed) {
    return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
      get(target, key) {
        if (key in target) {
          return target[key];
        } else if (key in publicPropertiesMap) {
          return publicPropertiesMap[key](instance);
        }
      },
      has(target, key) {
        return key in target || key in publicPropertiesMap;
      }
    }));
  }
}
function getComponentName(Component, includeInferred = true) {
  return isFunction$1(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
}
function isClassComponent(value) {
  return isFunction$1(value) && "__vccOpts" in value;
}
const computed = (getterOrOptions, debugOptions) => {
  return computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
};
function h(type, propsOrChildren, children) {
  const l = arguments.length;
  if (l === 2) {
    if (isObject$1(propsOrChildren) && !isArray(propsOrChildren)) {
      if (isVNode(propsOrChildren)) {
        return createVNode(type, null, [propsOrChildren]);
      }
      return createVNode(type, propsOrChildren);
    } else {
      return createVNode(type, null, propsOrChildren);
    }
  } else {
    if (l > 3) {
      children = Array.prototype.slice.call(arguments, 2);
    } else if (l === 3 && isVNode(children)) {
      children = [children];
    }
    return createVNode(type, propsOrChildren, children);
  }
}
const ssrContextKey = Symbol.for("v-scx");
const useSSRContext = () => {
  {
    const ctx = inject$1(ssrContextKey);
    return ctx;
  }
};
const version = "3.3.4";
const svgNS = "http://www.w3.org/2000/svg";
const doc = typeof document !== "undefined" ? document : null;
const templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
const nodeOps = {
  insert: (child, parent, anchor) => {
    parent.insertBefore(child, anchor || null);
  },
  remove: (child) => {
    const parent = child.parentNode;
    if (parent) {
      parent.removeChild(child);
    }
  },
  createElement: (tag, isSVG, is, props) => {
    const el = isSVG ? doc.createElementNS(svgNS, tag) : doc.createElement(tag, is ? { is } : void 0);
    if (tag === "select" && props && props.multiple != null) {
      el.setAttribute("multiple", props.multiple);
    }
    return el;
  },
  createText: (text2) => doc.createTextNode(text2),
  createComment: (text2) => doc.createComment(text2),
  setText: (node, text2) => {
    node.nodeValue = text2;
  },
  setElementText: (el, text2) => {
    el.textContent = text2;
  },
  parentNode: (node) => node.parentNode,
  nextSibling: (node) => node.nextSibling,
  querySelector: (selector) => doc.querySelector(selector),
  setScopeId(el, id2) {
    el.setAttribute(id2, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(content, parent, anchor, isSVG, start, end) {
    const before = anchor ? anchor.previousSibling : parent.lastChild;
    if (start && (start === end || start.nextSibling)) {
      while (true) {
        parent.insertBefore(start.cloneNode(true), anchor);
        if (start === end || !(start = start.nextSibling))
          break;
      }
    } else {
      templateContainer.innerHTML = isSVG ? `<svg>${content}</svg>` : content;
      const template = templateContainer.content;
      if (isSVG) {
        const wrapper = template.firstChild;
        while (wrapper.firstChild) {
          template.appendChild(wrapper.firstChild);
        }
        template.removeChild(wrapper);
      }
      parent.insertBefore(template, anchor);
    }
    return [
      // first
      before ? before.nextSibling : parent.firstChild,
      // last
      anchor ? anchor.previousSibling : parent.lastChild
    ];
  }
};
function patchClass(el, value, isSVG) {
  const transitionClasses = el._vtc;
  if (transitionClasses) {
    value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
  }
  if (value == null) {
    el.removeAttribute("class");
  } else if (isSVG) {
    el.setAttribute("class", value);
  } else {
    el.className = value;
  }
}
function patchStyle(el, prev, next) {
  const style2 = el.style;
  const isCssString = isString$3(next);
  if (next && !isCssString) {
    if (prev && !isString$3(prev)) {
      for (const key in prev) {
        if (next[key] == null) {
          setStyle(style2, key, "");
        }
      }
    }
    for (const key in next) {
      setStyle(style2, key, next[key]);
    }
  } else {
    const currentDisplay = style2.display;
    if (isCssString) {
      if (prev !== next) {
        style2.cssText = next;
      }
    } else if (prev) {
      el.removeAttribute("style");
    }
    if ("_vod" in el) {
      style2.display = currentDisplay;
    }
  }
}
const importantRE = /\s*!important$/;
function setStyle(style2, name, val) {
  if (isArray(val)) {
    val.forEach((v) => setStyle(style2, name, v));
  } else {
    if (val == null)
      val = "";
    if (name.startsWith("--")) {
      style2.setProperty(name, val);
    } else {
      const prefixed = autoPrefix(style2, name);
      if (importantRE.test(val)) {
        style2.setProperty(
          hyphenate(prefixed),
          val.replace(importantRE, ""),
          "important"
        );
      } else {
        style2[prefixed] = val;
      }
    }
  }
}
const prefixes = ["Webkit", "Moz", "ms"];
const prefixCache = {};
function autoPrefix(style2, rawName) {
  const cached = prefixCache[rawName];
  if (cached) {
    return cached;
  }
  let name = camelize(rawName);
  if (name !== "filter" && name in style2) {
    return prefixCache[rawName] = name;
  }
  name = capitalize(name);
  for (let i = 0; i < prefixes.length; i++) {
    const prefixed = prefixes[i] + name;
    if (prefixed in style2) {
      return prefixCache[rawName] = prefixed;
    }
  }
  return rawName;
}
const xlinkNS = "http://www.w3.org/1999/xlink";
function patchAttr(el, key, value, isSVG, instance) {
  if (isSVG && key.startsWith("xlink:")) {
    if (value == null) {
      el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    const isBoolean = isSpecialBooleanAttr(key);
    if (value == null || isBoolean && !includeBooleanAttr(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, isBoolean ? "" : value);
    }
  }
}
function patchDOMProp(el, key, value, prevChildren, parentComponent, parentSuspense, unmountChildren) {
  if (key === "innerHTML" || key === "textContent") {
    if (prevChildren) {
      unmountChildren(prevChildren, parentComponent, parentSuspense);
    }
    el[key] = value == null ? "" : value;
    return;
  }
  const tag = el.tagName;
  if (key === "value" && tag !== "PROGRESS" && // custom elements may use _value internally
  !tag.includes("-")) {
    el._value = value;
    const oldValue = tag === "OPTION" ? el.getAttribute("value") : el.value;
    const newValue = value == null ? "" : value;
    if (oldValue !== newValue) {
      el.value = newValue;
    }
    if (value == null) {
      el.removeAttribute(key);
    }
    return;
  }
  let needRemove = false;
  if (value === "" || value == null) {
    const type = typeof el[key];
    if (type === "boolean") {
      value = includeBooleanAttr(value);
    } else if (value == null && type === "string") {
      value = "";
      needRemove = true;
    } else if (type === "number") {
      value = 0;
      needRemove = true;
    }
  }
  try {
    el[key] = value;
  } catch (e) {
  }
  needRemove && el.removeAttribute(key);
}
function addEventListener(el, event, handler, options) {
  el.addEventListener(event, handler, options);
}
function removeEventListener(el, event, handler, options) {
  el.removeEventListener(event, handler, options);
}
function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
  const invokers = el._vei || (el._vei = {});
  const existingInvoker = invokers[rawName];
  if (nextValue && existingInvoker) {
    existingInvoker.value = nextValue;
  } else {
    const [name, options] = parseName(rawName);
    if (nextValue) {
      const invoker = invokers[rawName] = createInvoker(nextValue, instance);
      addEventListener(el, name, invoker, options);
    } else if (existingInvoker) {
      removeEventListener(el, name, existingInvoker, options);
      invokers[rawName] = void 0;
    }
  }
}
const optionsModifierRE = /(?:Once|Passive|Capture)$/;
function parseName(name) {
  let options;
  if (optionsModifierRE.test(name)) {
    options = {};
    let m;
    while (m = name.match(optionsModifierRE)) {
      name = name.slice(0, name.length - m[0].length);
      options[m[0].toLowerCase()] = true;
    }
  }
  const event = name[2] === ":" ? name.slice(3) : hyphenate(name.slice(2));
  return [event, options];
}
let cachedNow = 0;
const p = /* @__PURE__ */ Promise.resolve();
const getNow = () => cachedNow || (p.then(() => cachedNow = 0), cachedNow = Date.now());
function createInvoker(initialValue, instance) {
  const invoker = (e) => {
    if (!e._vts) {
      e._vts = Date.now();
    } else if (e._vts <= invoker.attached) {
      return;
    }
    callWithAsyncErrorHandling(
      patchStopImmediatePropagation(e, invoker.value),
      instance,
      5,
      [e]
    );
  };
  invoker.value = initialValue;
  invoker.attached = getNow();
  return invoker;
}
function patchStopImmediatePropagation(e, value) {
  if (isArray(value)) {
    const originalStop = e.stopImmediatePropagation;
    e.stopImmediatePropagation = () => {
      originalStop.call(e);
      e._stopped = true;
    };
    return value.map((fn) => (e2) => !e2._stopped && fn && fn(e2));
  } else {
    return value;
  }
}
const nativeOnRE = /^on[a-z]/;
const patchProp = (el, key, prevValue, nextValue, isSVG = false, prevChildren, parentComponent, parentSuspense, unmountChildren) => {
  if (key === "class") {
    patchClass(el, nextValue, isSVG);
  } else if (key === "style") {
    patchStyle(el, prevValue, nextValue);
  } else if (isOn(key)) {
    if (!isModelListener(key)) {
      patchEvent(el, key, prevValue, nextValue, parentComponent);
    }
  } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
    patchDOMProp(
      el,
      key,
      nextValue,
      prevChildren,
      parentComponent,
      parentSuspense,
      unmountChildren
    );
  } else {
    if (key === "true-value") {
      el._trueValue = nextValue;
    } else if (key === "false-value") {
      el._falseValue = nextValue;
    }
    patchAttr(el, key, nextValue, isSVG);
  }
};
function shouldSetAsProp(el, key, value, isSVG) {
  if (isSVG) {
    if (key === "innerHTML" || key === "textContent") {
      return true;
    }
    if (key in el && nativeOnRE.test(key) && isFunction$1(value)) {
      return true;
    }
    return false;
  }
  if (key === "spellcheck" || key === "draggable" || key === "translate") {
    return false;
  }
  if (key === "form") {
    return false;
  }
  if (key === "list" && el.tagName === "INPUT") {
    return false;
  }
  if (key === "type" && el.tagName === "TEXTAREA") {
    return false;
  }
  if (nativeOnRE.test(key) && isString$3(value)) {
    return false;
  }
  return key in el;
}
function useCssVars(getter) {
  const instance = getCurrentInstance();
  if (!instance) {
    return;
  }
  const updateTeleports = instance.ut = (vars = getter(instance.proxy)) => {
    Array.from(
      document.querySelectorAll(`[data-v-owner="${instance.uid}"]`)
    ).forEach((node) => setVarsOnNode(node, vars));
  };
  const setVars = () => {
    const vars = getter(instance.proxy);
    setVarsOnVNode(instance.subTree, vars);
    updateTeleports(vars);
  };
  watchPostEffect(setVars);
  onMounted(() => {
    const ob = new MutationObserver(setVars);
    ob.observe(instance.subTree.el.parentNode, { childList: true });
    onUnmounted(() => ob.disconnect());
  });
}
function setVarsOnVNode(vnode, vars) {
  if (vnode.shapeFlag & 128) {
    const suspense = vnode.suspense;
    vnode = suspense.activeBranch;
    if (suspense.pendingBranch && !suspense.isHydrating) {
      suspense.effects.push(() => {
        setVarsOnVNode(suspense.activeBranch, vars);
      });
    }
  }
  while (vnode.component) {
    vnode = vnode.component.subTree;
  }
  if (vnode.shapeFlag & 1 && vnode.el) {
    setVarsOnNode(vnode.el, vars);
  } else if (vnode.type === Fragment) {
    vnode.children.forEach((c) => setVarsOnVNode(c, vars));
  } else if (vnode.type === Static) {
    let { el, anchor } = vnode;
    while (el) {
      setVarsOnNode(el, vars);
      if (el === anchor)
        break;
      el = el.nextSibling;
    }
  }
}
function setVarsOnNode(el, vars) {
  if (el.nodeType === 1) {
    const style2 = el.style;
    for (const key in vars) {
      style2.setProperty(`--${key}`, vars[key]);
    }
  }
}
const TRANSITION = "transition";
const ANIMATION = "animation";
const Transition$1 = (props, { slots }) => h(BaseTransition, resolveTransitionProps(props), slots);
Transition$1.displayName = "Transition";
const DOMTransitionPropsValidators = {
  name: String,
  type: String,
  css: {
    type: Boolean,
    default: true
  },
  duration: [String, Number, Object],
  enterFromClass: String,
  enterActiveClass: String,
  enterToClass: String,
  appearFromClass: String,
  appearActiveClass: String,
  appearToClass: String,
  leaveFromClass: String,
  leaveActiveClass: String,
  leaveToClass: String
};
const TransitionPropsValidators = Transition$1.props = /* @__PURE__ */ extend(
  {},
  BaseTransitionPropsValidators,
  DOMTransitionPropsValidators
);
const callHook = (hook, args = []) => {
  if (isArray(hook)) {
    hook.forEach((h2) => h2(...args));
  } else if (hook) {
    hook(...args);
  }
};
const hasExplicitCallback = (hook) => {
  return hook ? isArray(hook) ? hook.some((h2) => h2.length > 1) : hook.length > 1 : false;
};
function resolveTransitionProps(rawProps) {
  const baseProps = {};
  for (const key in rawProps) {
    if (!(key in DOMTransitionPropsValidators)) {
      baseProps[key] = rawProps[key];
    }
  }
  if (rawProps.css === false) {
    return baseProps;
  }
  const {
    name = "v",
    type,
    duration,
    enterFromClass = `${name}-enter-from`,
    enterActiveClass = `${name}-enter-active`,
    enterToClass = `${name}-enter-to`,
    appearFromClass = enterFromClass,
    appearActiveClass = enterActiveClass,
    appearToClass = enterToClass,
    leaveFromClass = `${name}-leave-from`,
    leaveActiveClass = `${name}-leave-active`,
    leaveToClass = `${name}-leave-to`
  } = rawProps;
  const durations = normalizeDuration(duration);
  const enterDuration = durations && durations[0];
  const leaveDuration = durations && durations[1];
  const {
    onBeforeEnter,
    onEnter,
    onEnterCancelled,
    onLeave,
    onLeaveCancelled,
    onBeforeAppear = onBeforeEnter,
    onAppear = onEnter,
    onAppearCancelled = onEnterCancelled
  } = baseProps;
  const finishEnter = (el, isAppear, done) => {
    removeTransitionClass(el, isAppear ? appearToClass : enterToClass);
    removeTransitionClass(el, isAppear ? appearActiveClass : enterActiveClass);
    done && done();
  };
  const finishLeave = (el, done) => {
    el._isLeaving = false;
    removeTransitionClass(el, leaveFromClass);
    removeTransitionClass(el, leaveToClass);
    removeTransitionClass(el, leaveActiveClass);
    done && done();
  };
  const makeEnterHook = (isAppear) => {
    return (el, done) => {
      const hook = isAppear ? onAppear : onEnter;
      const resolve2 = () => finishEnter(el, isAppear, done);
      callHook(hook, [el, resolve2]);
      nextFrame(() => {
        removeTransitionClass(el, isAppear ? appearFromClass : enterFromClass);
        addTransitionClass(el, isAppear ? appearToClass : enterToClass);
        if (!hasExplicitCallback(hook)) {
          whenTransitionEnds(el, type, enterDuration, resolve2);
        }
      });
    };
  };
  return extend(baseProps, {
    onBeforeEnter(el) {
      callHook(onBeforeEnter, [el]);
      addTransitionClass(el, enterFromClass);
      addTransitionClass(el, enterActiveClass);
    },
    onBeforeAppear(el) {
      callHook(onBeforeAppear, [el]);
      addTransitionClass(el, appearFromClass);
      addTransitionClass(el, appearActiveClass);
    },
    onEnter: makeEnterHook(false),
    onAppear: makeEnterHook(true),
    onLeave(el, done) {
      el._isLeaving = true;
      const resolve2 = () => finishLeave(el, done);
      addTransitionClass(el, leaveFromClass);
      forceReflow();
      addTransitionClass(el, leaveActiveClass);
      nextFrame(() => {
        if (!el._isLeaving) {
          return;
        }
        removeTransitionClass(el, leaveFromClass);
        addTransitionClass(el, leaveToClass);
        if (!hasExplicitCallback(onLeave)) {
          whenTransitionEnds(el, type, leaveDuration, resolve2);
        }
      });
      callHook(onLeave, [el, resolve2]);
    },
    onEnterCancelled(el) {
      finishEnter(el, false);
      callHook(onEnterCancelled, [el]);
    },
    onAppearCancelled(el) {
      finishEnter(el, true);
      callHook(onAppearCancelled, [el]);
    },
    onLeaveCancelled(el) {
      finishLeave(el);
      callHook(onLeaveCancelled, [el]);
    }
  });
}
function normalizeDuration(duration) {
  if (duration == null) {
    return null;
  } else if (isObject$1(duration)) {
    return [NumberOf(duration.enter), NumberOf(duration.leave)];
  } else {
    const n = NumberOf(duration);
    return [n, n];
  }
}
function NumberOf(val) {
  const res = toNumber(val);
  return res;
}
function addTransitionClass(el, cls) {
  cls.split(/\s+/).forEach((c) => c && el.classList.add(c));
  (el._vtc || (el._vtc = /* @__PURE__ */ new Set())).add(cls);
}
function removeTransitionClass(el, cls) {
  cls.split(/\s+/).forEach((c) => c && el.classList.remove(c));
  const { _vtc } = el;
  if (_vtc) {
    _vtc.delete(cls);
    if (!_vtc.size) {
      el._vtc = void 0;
    }
  }
}
function nextFrame(cb) {
  requestAnimationFrame(() => {
    requestAnimationFrame(cb);
  });
}
let endId = 0;
function whenTransitionEnds(el, expectedType, explicitTimeout, resolve2) {
  const id2 = el._endId = ++endId;
  const resolveIfNotStale = () => {
    if (id2 === el._endId) {
      resolve2();
    }
  };
  if (explicitTimeout) {
    return setTimeout(resolveIfNotStale, explicitTimeout);
  }
  const { type, timeout, propCount } = getTransitionInfo(el, expectedType);
  if (!type) {
    return resolve2();
  }
  const endEvent = type + "end";
  let ended = 0;
  const end = () => {
    el.removeEventListener(endEvent, onEnd);
    resolveIfNotStale();
  };
  const onEnd = (e) => {
    if (e.target === el && ++ended >= propCount) {
      end();
    }
  };
  setTimeout(() => {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(endEvent, onEnd);
}
function getTransitionInfo(el, expectedType) {
  const styles = window.getComputedStyle(el);
  const getStyleProperties = (key) => (styles[key] || "").split(", ");
  const transitionDelays = getStyleProperties(`${TRANSITION}Delay`);
  const transitionDurations = getStyleProperties(`${TRANSITION}Duration`);
  const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  const animationDelays = getStyleProperties(`${ANIMATION}Delay`);
  const animationDurations = getStyleProperties(`${ANIMATION}Duration`);
  const animationTimeout = getTimeout(animationDelays, animationDurations);
  let type = null;
  let timeout = 0;
  let propCount = 0;
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
    propCount = type ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
  }
  const hasTransform = type === TRANSITION && /\b(transform|all)(,|$)/.test(
    getStyleProperties(`${TRANSITION}Property`).toString()
  );
  return {
    type,
    timeout,
    propCount,
    hasTransform
  };
}
function getTimeout(delays, durations) {
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }
  return Math.max(...durations.map((d, i) => toMs(d) + toMs(delays[i])));
}
function toMs(s) {
  return Number(s.slice(0, -1).replace(",", ".")) * 1e3;
}
function forceReflow() {
  return document.body.offsetHeight;
}
const positionMap = /* @__PURE__ */ new WeakMap();
const newPositionMap = /* @__PURE__ */ new WeakMap();
const TransitionGroupImpl = {
  name: "TransitionGroup",
  props: /* @__PURE__ */ extend({}, TransitionPropsValidators, {
    tag: String,
    moveClass: String
  }),
  setup(props, { slots }) {
    const instance = getCurrentInstance();
    const state = useTransitionState();
    let prevChildren;
    let children;
    onUpdated(() => {
      if (!prevChildren.length) {
        return;
      }
      const moveClass = props.moveClass || `${props.name || "v"}-move`;
      if (!hasCSSTransform(
        prevChildren[0].el,
        instance.vnode.el,
        moveClass
      )) {
        return;
      }
      prevChildren.forEach(callPendingCbs);
      prevChildren.forEach(recordPosition);
      const movedChildren = prevChildren.filter(applyTranslation);
      forceReflow();
      movedChildren.forEach((c) => {
        const el = c.el;
        const style2 = el.style;
        addTransitionClass(el, moveClass);
        style2.transform = style2.webkitTransform = style2.transitionDuration = "";
        const cb = el._moveCb = (e) => {
          if (e && e.target !== el) {
            return;
          }
          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener("transitionend", cb);
            el._moveCb = null;
            removeTransitionClass(el, moveClass);
          }
        };
        el.addEventListener("transitionend", cb);
      });
    });
    return () => {
      const rawProps = toRaw(props);
      const cssTransitionProps = resolveTransitionProps(rawProps);
      let tag = rawProps.tag || Fragment;
      prevChildren = children;
      children = slots.default ? getTransitionRawChildren(slots.default()) : [];
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child.key != null) {
          setTransitionHooks(
            child,
            resolveTransitionHooks(child, cssTransitionProps, state, instance)
          );
        }
      }
      if (prevChildren) {
        for (let i = 0; i < prevChildren.length; i++) {
          const child = prevChildren[i];
          setTransitionHooks(
            child,
            resolveTransitionHooks(child, cssTransitionProps, state, instance)
          );
          positionMap.set(child, child.el.getBoundingClientRect());
        }
      }
      return createVNode(tag, null, children);
    };
  }
};
const removeMode = (props) => delete props.mode;
/* @__PURE__ */ removeMode(TransitionGroupImpl.props);
const TransitionGroup$1 = TransitionGroupImpl;
function callPendingCbs(c) {
  const el = c.el;
  if (el._moveCb) {
    el._moveCb();
  }
  if (el._enterCb) {
    el._enterCb();
  }
}
function recordPosition(c) {
  newPositionMap.set(c, c.el.getBoundingClientRect());
}
function applyTranslation(c) {
  const oldPos = positionMap.get(c);
  const newPos = newPositionMap.get(c);
  const dx = oldPos.left - newPos.left;
  const dy = oldPos.top - newPos.top;
  if (dx || dy) {
    const s = c.el.style;
    s.transform = s.webkitTransform = `translate(${dx}px,${dy}px)`;
    s.transitionDuration = "0s";
    return c;
  }
}
function hasCSSTransform(el, root, moveClass) {
  const clone = el.cloneNode();
  if (el._vtc) {
    el._vtc.forEach((cls) => {
      cls.split(/\s+/).forEach((c) => c && clone.classList.remove(c));
    });
  }
  moveClass.split(/\s+/).forEach((c) => c && clone.classList.add(c));
  clone.style.display = "none";
  const container = root.nodeType === 1 ? root : root.parentNode;
  container.appendChild(clone);
  const { hasTransform } = getTransitionInfo(clone);
  container.removeChild(clone);
  return hasTransform;
}
const getModelAssigner = (vnode) => {
  const fn = vnode.props["onUpdate:modelValue"] || false;
  return isArray(fn) ? (value) => invokeArrayFns(fn, value) : fn;
};
const vModelCheckbox = {
  // #4096 array checkboxes need to be deep traversed
  deep: true,
  created(el, _, vnode) {
    el._assign = getModelAssigner(vnode);
    addEventListener(el, "change", () => {
      const modelValue = el._modelValue;
      const elementValue = getValue(el);
      const checked = el.checked;
      const assign2 = el._assign;
      if (isArray(modelValue)) {
        const index = looseIndexOf(modelValue, elementValue);
        const found = index !== -1;
        if (checked && !found) {
          assign2(modelValue.concat(elementValue));
        } else if (!checked && found) {
          const filtered = [...modelValue];
          filtered.splice(index, 1);
          assign2(filtered);
        }
      } else if (isSet(modelValue)) {
        const cloned = new Set(modelValue);
        if (checked) {
          cloned.add(elementValue);
        } else {
          cloned.delete(elementValue);
        }
        assign2(cloned);
      } else {
        assign2(getCheckboxValue(el, checked));
      }
    });
  },
  // set initial checked on mount to wait for true-value/false-value
  mounted: setChecked,
  beforeUpdate(el, binding, vnode) {
    el._assign = getModelAssigner(vnode);
    setChecked(el, binding, vnode);
  }
};
function setChecked(el, { value, oldValue }, vnode) {
  el._modelValue = value;
  if (isArray(value)) {
    el.checked = looseIndexOf(value, vnode.props.value) > -1;
  } else if (isSet(value)) {
    el.checked = value.has(vnode.props.value);
  } else if (value !== oldValue) {
    el.checked = looseEqual(value, getCheckboxValue(el, true));
  }
}
function getValue(el) {
  return "_value" in el ? el._value : el.value;
}
function getCheckboxValue(el, checked) {
  const key = checked ? "_trueValue" : "_falseValue";
  return key in el ? el[key] : checked;
}
const rendererOptions = /* @__PURE__ */ extend({ patchProp }, nodeOps);
let renderer;
function ensureRenderer() {
  return renderer || (renderer = createRenderer(rendererOptions));
}
const render = (...args) => {
  ensureRenderer().render(...args);
};
const createApp = (...args) => {
  const app2 = ensureRenderer().createApp(...args);
  const { mount } = app2;
  app2.mount = (containerOrSelector) => {
    const container = normalizeContainer(containerOrSelector);
    if (!container)
      return;
    const component = app2._component;
    if (!isFunction$1(component) && !component.render && !component.template) {
      component.template = container.innerHTML;
    }
    container.innerHTML = "";
    const proxy = mount(container, false, container instanceof SVGElement);
    if (container instanceof Element) {
      container.removeAttribute("v-cloak");
      container.setAttribute("data-v-app", "");
    }
    return proxy;
  };
  return app2;
};
function normalizeContainer(container) {
  if (isString$3(container)) {
    const res = document.querySelector(container);
    return res;
  }
  return container;
}
const style = "";
const materialIcons = "";
const _sfc_main$w = /* @__PURE__ */ defineComponent({
  __name: "Row",
  props: {
    center: { type: Boolean },
    centerVertical: { type: Boolean },
    centerHorizontal: { type: Boolean },
    left: { type: Boolean },
    right: { type: Boolean },
    top: { type: Boolean },
    bottom: { type: Boolean },
    gap: {}
  },
  setup(__props) {
    const p2 = __props;
    const classes = computed(() => {
      const classList = [];
      if (p2.center)
        classList.push("center");
      if (p2.centerVertical)
        classList.push("center-vertical");
      if (p2.centerHorizontal)
        classList.push("center-horizontal");
      if (p2.left)
        classList.push("left");
      if (p2.right)
        classList.push("right");
      if (p2.top)
        classList.push("top");
      if (p2.bottom)
        classList.push("bottom");
      return classList.join(" ");
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass("row " + classes.value),
        style: normalizeStyle("column-gap: " + _ctx.gap + "px")
      }, [
        renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ], 6);
    };
  }
});
const Row_vue_vue_type_style_index_0_scoped_98094a68_lang = "";
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const Row = /* @__PURE__ */ _export_sfc(_sfc_main$w, [["__scopeId", "data-v-98094a68"]]);
const _sfc_main$v = /* @__PURE__ */ defineComponent({
  __name: "Column",
  props: {
    center: { type: Boolean },
    centerVertical: { type: Boolean },
    centerHorizontal: { type: Boolean },
    left: { type: Boolean },
    right: { type: Boolean },
    top: { type: Boolean },
    bottom: { type: Boolean },
    gap: {}
  },
  setup(__props) {
    const p2 = __props;
    const classes = computed(() => {
      const classList = [];
      if (p2.center)
        classList.push("center");
      if (p2.centerVertical)
        classList.push("center-vertical");
      if (p2.centerHorizontal)
        classList.push("center-horizontal");
      if (p2.left)
        classList.push("left");
      if (p2.right)
        classList.push("right");
      if (p2.top)
        classList.push("top");
      if (p2.bottom)
        classList.push("bottom");
      return classList.join(" ");
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass("col " + classes.value),
        style: normalizeStyle("row-gap: " + _ctx.gap + "px")
      }, [
        renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ], 6);
    };
  }
});
const Column_vue_vue_type_style_index_0_scoped_5a6a4ea8_lang = "";
const Column = /* @__PURE__ */ _export_sfc(_sfc_main$v, [["__scopeId", "data-v-5a6a4ea8"]]);
const Icon = {
  ThreeDRotation: "",
  AcUnit: "",
  AccessAlarm: "",
  AccessAlarms: "",
  AccessTime: "",
  Accessibility: "",
  Accessible: "",
  AccountBalance: "",
  AccountBalanceWallet: "",
  AccountBox: "",
  AccountCircle: "",
  Adb: "",
  Add: "",
  AddAPhoto: "",
  AddAlarm: "",
  AddAlert: "",
  AddBox: "",
  AddCircle: "",
  AddCircleOutline: "",
  AddLocation: "",
  AddShoppingCart: "",
  AddToPhotos: "",
  AddToQueue: "",
  Adjust: "",
  AirlineSeatFlat: "",
  AirlineSeatFlatAngled: "",
  AirlineSeatIndividualSuite: "",
  AirlineSeatLegroomExtra: "",
  AirlineSeatLegroomNormal: "",
  AirlineSeatLegroomReduced: "",
  AirlineSeatReclineExtra: "",
  AirlineSeatReclineNormal: "",
  AirplanemodeActive: "",
  AirplanemodeInactive: "",
  Airplay: "",
  AirportShuttle: "",
  Alarm: "",
  AlarmAdd: "",
  AlarmOff: "",
  AlarmOn: "",
  Album: "",
  AllInclusive: "",
  AllOut: "",
  Android: "",
  Announcement: "",
  Apps: "",
  Archive: "",
  ArrowBack: "",
  ArrowDownward: "",
  ArrowDropDown: "",
  ArrowDropDownCircle: "",
  ArrowDropUp: "",
  ArrowForward: "",
  ArrowUpward: "",
  ArtTrack: "",
  AspectRatio: "",
  Assessment: "",
  Assignment: "",
  AssignmentInd: "",
  AssignmentLate: "",
  AssignmentReturn: "",
  AssignmentReturned: "",
  AssignmentTurnedIn: "",
  Assistant: "",
  AssistantPhoto: "",
  AttachFile: "",
  AttachMoney: "",
  Attachment: "",
  Audiotrack: "",
  Autorenew: "",
  AvTimer: "",
  Backspace: "",
  Backup: "",
  BatteryAlert: "",
  BatteryChargingFull: "",
  BatteryFull: "",
  BatteryStd: "",
  BatteryUnknown: "",
  BeachAccess: "",
  Beenhere: "",
  Block: "",
  Bluetooth: "",
  BluetoothAudio: "",
  BluetoothConnected: "",
  BluetoothDisabled: "",
  BluetoothSearching: "",
  BlurCircular: "",
  BlurLinear: "",
  BlurOff: "",
  BlurOn: "",
  Book: "",
  Bookmark: "",
  BookmarkBorder: "",
  BorderAll: "",
  BorderBottom: "",
  BorderClear: "",
  BorderColor: "",
  BorderHorizontal: "",
  BorderInner: "",
  BorderLeft: "",
  BorderOuter: "",
  BorderRight: "",
  BorderStyle: "",
  BorderTop: "",
  BorderVertical: "",
  BrandingWatermark: "",
  Brightness1: "",
  Brightness2: "",
  Brightness3: "",
  Brightness4: "",
  Brightness5: "",
  Brightness6: "",
  Brightness7: "",
  BrightnessAuto: "",
  BrightnessHigh: "",
  BrightnessLow: "",
  BrightnessMedium: "",
  BrokenImage: "",
  Brush: "",
  BubbleChart: "",
  BugReport: "",
  Build: "",
  BurstMode: "",
  Business: "",
  BusinessCenter: "",
  Cached: "",
  Cake: "",
  Call: "",
  CallEnd: "",
  CallMade: "",
  CallMerge: "",
  CallMissed: "",
  CallMissedOutgoing: "",
  CallReceived: "",
  CallSplit: "",
  CallToAction: "",
  Camera: "",
  CameraAlt: "",
  CameraEnhance: "",
  CameraFront: "",
  CameraRear: "",
  CameraRoll: "",
  Cancel: "",
  CardGiftcard: "",
  CardMembership: "",
  CardTravel: "",
  Casino: "",
  Cast: "",
  CastConnected: "",
  CenterFocusStrong: "",
  CenterFocusWeak: "",
  ChangeHistory: "",
  Chat: "",
  ChatBubble: "",
  ChatBubbleOutline: "",
  Check: "",
  CheckBox: "",
  CheckBoxOutlineBlank: "",
  CheckCircle: "",
  ChevronLeft: "",
  ChevronRight: "",
  ChildCare: "",
  ChildFriendly: "",
  ChromeReaderMode: "",
  Class: "",
  Clear: "",
  ClearAll: "",
  Close: "",
  ClosedCaption: "",
  Cloud: "",
  CloudCircle: "",
  CloudDone: "",
  CloudDownload: "",
  CloudOff: "",
  CloudQueue: "",
  CloudUpload: "",
  Code: "",
  Collections: "",
  CollectionsBookmark: "",
  ColorLens: "",
  Colorize: "",
  Comment: "",
  Compare: "",
  CompareArrows: "",
  Computer: "",
  ConfirmationNumber: "",
  ContactMail: "",
  ContactPhone: "",
  Contacts: "",
  ContentCopy: "",
  ContentCut: "",
  ContentPaste: "",
  ControlPoint: "",
  ControlPointDuplicate: "",
  Copyright: "",
  Create: "",
  CreateNewFolder: "",
  CreditCard: "",
  Crop: "",
  Crop169: "",
  Crop32: "",
  Crop54: "",
  Crop75: "",
  CropDin: "",
  CropFree: "",
  CropLandscape: "",
  CropOriginal: "",
  CropPortrait: "",
  CropRotate: "",
  CropSquare: "",
  Dashboard: "",
  DataUsage: "",
  DateRange: "",
  Dehaze: "",
  Delete: "",
  DeleteForever: "",
  DeleteSweep: "",
  Description: "",
  DesktopMac: "",
  DesktopWindows: "",
  Details: "",
  DeveloperBoard: "",
  DeveloperMode: "",
  DeviceHub: "",
  Devices: "",
  DevicesOther: "",
  DialerSip: "",
  Dialpad: "",
  Directions: "",
  DirectionsBike: "",
  DirectionsBoat: "",
  DirectionsBus: "",
  DirectionsCar: "",
  DirectionsRailway: "",
  DirectionsRun: "",
  DirectionsSubway: "",
  DirectionsTransit: "",
  DirectionsWalk: "",
  DiscFull: "",
  Dns: "",
  DoNotDisturb: "",
  DoNotDisturbAlt: "",
  DoNotDisturbOff: "",
  DoNotDisturbOn: "",
  Dock: "",
  Domain: "",
  Done: "",
  DoneAll: "",
  DonutLarge: "",
  DonutSmall: "",
  Drafts: "",
  DragHandle: "",
  DriveEta: "",
  Dvr: "",
  Edit: "",
  EditLocation: "",
  Eject: "",
  Email: "",
  EnhancedEncryption: "",
  Equalizer: "",
  Error: "",
  ErrorOutline: "",
  EuroSymbol: "",
  EvStation: "",
  Event: "",
  EventAvailable: "",
  EventBusy: "",
  EventNote: "",
  EventSeat: "",
  ExitToApp: "",
  ExpandLess: "",
  ExpandMore: "",
  Explicit: "",
  Explore: "",
  Exposure: "",
  ExposureNeg1: "",
  ExposureNeg2: "",
  ExposurePlus1: "",
  ExposurePlus2: "",
  ExposureZero: "",
  Extension: "",
  Face: "",
  FastForward: "",
  FastRewind: "",
  Favorite: "",
  FavoriteBorder: "",
  FeaturedPlayList: "",
  FeaturedVideo: "",
  Feedback: "",
  FiberDvr: "",
  FiberManualRecord: "",
  FiberNew: "",
  FiberPin: "",
  FiberSmartRecord: "",
  FileDownload: "",
  FileUpload: "",
  Filter: "",
  Filter1: "",
  Filter2: "",
  Filter3: "",
  Filter4: "",
  Filter5: "",
  Filter6: "",
  Filter7: "",
  Filter8: "",
  Filter9: "",
  Filter9Plus: "",
  FilterBAndW: "",
  FilterCenterFocus: "",
  FilterDrama: "",
  FilterFrames: "",
  FilterHdr: "",
  FilterList: "",
  FilterNone: "",
  FilterTiltShift: "",
  FilterVintage: "",
  FindInPage: "",
  FindReplace: "",
  Fingerprint: "",
  FirstPage: "",
  FitnessCenter: "",
  Flag: "",
  Flare: "",
  FlashAuto: "",
  FlashOff: "",
  FlashOn: "",
  Flight: "",
  FlightLand: "",
  FlightTakeoff: "",
  Flip: "",
  FlipToBack: "",
  FlipToFront: "",
  Folder: "",
  FolderOpen: "",
  FolderShared: "",
  FolderSpecial: "",
  FontDownload: "",
  FormatAlignCenter: "",
  FormatAlignJustify: "",
  FormatAlignLeft: "",
  FormatAlignRight: "",
  FormatBold: "",
  FormatClear: "",
  FormatColorFill: "",
  FormatColorReset: "",
  FormatColorText: "",
  FormatIndentDecrease: "",
  FormatIndentIncrease: "",
  FormatItalic: "",
  FormatLineSpacing: "",
  FormatListBulleted: "",
  FormatListNumbered: "",
  FormatPaint: "",
  FormatQuote: "",
  FormatShapes: "",
  FormatSize: "",
  FormatStrikethrough: "",
  FormatTextdirectionLToR: "",
  FormatTextdirectionRToL: "",
  FormatUnderlined: "",
  Forum: "",
  Forward: "",
  Forward10: "",
  Forward30: "",
  Forward5: "",
  FreeBreakfast: "",
  Fullscreen: "",
  FullscreenExit: "",
  Functions: "",
  GTranslate: "",
  Gamepad: "",
  Games: "",
  Gavel: "",
  Gesture: "",
  GetApp: "",
  Gif: "",
  GolfCourse: "",
  GpsFixed: "",
  GpsNotFixed: "",
  GpsOff: "",
  Grade: "",
  Gradient: "",
  Grain: "",
  GraphicEq: "",
  GridOff: "",
  GridOn: "",
  Group: "",
  GroupAdd: "",
  GroupWork: "",
  Hd: "",
  HdrOff: "",
  HdrOn: "",
  HdrStrong: "",
  HdrWeak: "",
  Headset: "",
  HeadsetMic: "",
  Healing: "",
  Hearing: "",
  Help: "",
  HelpOutline: "",
  HighQuality: "",
  Highlight: "",
  HighlightOff: "",
  History: "",
  Home: "",
  HotTub: "",
  Hotel: "",
  HourglassEmpty: "",
  HourglassFull: "",
  Http: "",
  Https: "",
  Image: "",
  ImageAspectRatio: "",
  ImportContacts: "",
  ImportExport: "",
  ImportantDevices: "",
  Inbox: "",
  IndeterminateCheckBox: "",
  Info: "",
  InfoOutline: "",
  Input: "",
  InsertChart: "",
  InsertComment: "",
  InsertDriveFile: "",
  InsertEmoticon: "",
  InsertInvitation: "",
  InsertLink: "",
  InsertPhoto: "",
  InvertColors: "",
  InvertColorsOff: "",
  Iso: "",
  Keyboard: "",
  KeyboardArrowDown: "",
  KeyboardArrowLeft: "",
  KeyboardArrowRight: "",
  KeyboardArrowUp: "",
  KeyboardBackspace: "",
  KeyboardCapslock: "",
  KeyboardHide: "",
  KeyboardReturn: "",
  KeyboardTab: "",
  KeyboardVoice: "",
  Kitchen: "",
  Label: "",
  LabelOutline: "",
  Landscape: "",
  Language: "",
  Laptop: "",
  LaptopChromebook: "",
  LaptopMac: "",
  LaptopWindows: "",
  LastPage: "",
  Launch: "",
  Layers: "",
  LayersClear: "",
  LeakAdd: "",
  LeakRemove: "",
  Lens: "",
  LibraryAdd: "",
  LibraryBooks: "",
  LibraryMusic: "",
  LightbulbOutline: "",
  LineStyle: "",
  LineWeight: "",
  LinearScale: "",
  Link: "",
  LinkedCamera: "",
  List: "",
  LiveHelp: "",
  LiveTv: "",
  LocalActivity: "",
  LocalAirport: "",
  LocalAtm: "",
  LocalBar: "",
  LocalCafe: "",
  LocalCarWash: "",
  LocalConvenienceStore: "",
  LocalDining: "",
  LocalDrink: "",
  LocalFlorist: "",
  LocalGasStation: "",
  LocalGroceryStore: "",
  LocalHospital: "",
  LocalHotel: "",
  LocalLaundryService: "",
  LocalLibrary: "",
  LocalMall: "",
  LocalMovies: "",
  LocalOffer: "",
  LocalParking: "",
  LocalPharmacy: "",
  LocalPhone: "",
  LocalPizza: "",
  LocalPlay: "",
  LocalPostOffice: "",
  LocalPrintshop: "",
  LocalSee: "",
  LocalShipping: "",
  LocalTaxi: "",
  LocationCity: "",
  LocationDisabled: "",
  LocationOff: "",
  LocationOn: "",
  LocationSearching: "",
  Lock: "",
  LockOpen: "",
  LockOutline: "",
  Looks: "",
  Looks3: "",
  Looks4: "",
  Looks5: "",
  Looks6: "",
  LooksOne: "",
  LooksTwo: "",
  Loop: "",
  Loupe: "",
  LowPriority: "",
  Loyalty: "",
  Mail: "",
  MailOutline: "",
  Map: "",
  Markunread: "",
  MarkunreadMailbox: "",
  Memory: "",
  Menu: "",
  MergeType: "",
  Message: "",
  Mic: "",
  MicNone: "",
  MicOff: "",
  Mms: "",
  ModeComment: "",
  ModeEdit: "",
  MonetizationOn: "",
  MoneyOff: "",
  MonochromePhotos: "",
  Mood: "",
  MoodBad: "",
  More: "",
  MoreHoriz: "",
  MoreVert: "",
  Motorcycle: "",
  Mouse: "",
  MoveToInbox: "",
  Movie: "",
  MovieCreation: "",
  MovieFilter: "",
  MultilineChart: "",
  MusicNote: "",
  MusicVideo: "",
  MyLocation: "",
  Nature: "",
  NaturePeople: "",
  NavigateBefore: "",
  NavigateNext: "",
  Navigation: "",
  NearMe: "",
  NetworkCell: "",
  NetworkCheck: "",
  NetworkLocked: "",
  NetworkWifi: "",
  NewReleases: "",
  NextWeek: "",
  Nfc: "",
  NoEncryption: "",
  NoSim: "",
  NotInterested: "",
  Note: "",
  NoteAdd: "",
  Notifications: "",
  NotificationsActive: "",
  NotificationsNone: "",
  NotificationsOff: "",
  NotificationsPaused: "",
  OfflinePin: "",
  OndemandVideo: "",
  Opacity: "",
  OpenInBrowser: "",
  OpenInNew: "",
  OpenWith: "",
  Pages: "",
  Pageview: "",
  Palette: "",
  PanTool: "",
  Panorama: "",
  PanoramaFishEye: "",
  PanoramaHorizontal: "",
  PanoramaVertical: "",
  PanoramaWideAngle: "",
  PartyMode: "",
  Pause: "",
  PauseCircleFilled: "",
  PauseCircleOutline: "",
  Payment: "",
  People: "",
  PeopleOutline: "",
  PermCameraMic: "",
  PermContactCalendar: "",
  PermDataSetting: "",
  PermDeviceInformation: "",
  PermIdentity: "",
  PermMedia: "",
  PermPhoneMsg: "",
  PermScanWifi: "",
  Person: "",
  PersonAdd: "",
  PersonOutline: "",
  PersonPin: "",
  PersonPinCircle: "",
  PersonalVideo: "",
  Pets: "",
  Phone: "",
  PhoneAndroid: "",
  PhoneBluetoothSpeaker: "",
  PhoneForwarded: "",
  PhoneInTalk: "",
  PhoneIphone: "",
  PhoneLocked: "",
  PhoneMissed: "",
  PhonePaused: "",
  Phonelink: "",
  PhonelinkErase: "",
  PhonelinkLock: "",
  PhonelinkOff: "",
  PhonelinkRing: "",
  PhonelinkSetup: "",
  Photo: "",
  PhotoAlbum: "",
  PhotoCamera: "",
  PhotoFilter: "",
  PhotoLibrary: "",
  PhotoSizeSelectActual: "",
  PhotoSizeSelectLarge: "",
  PhotoSizeSelectSmall: "",
  PictureAsPdf: "",
  PictureInPicture: "",
  PictureInPictureAlt: "",
  PieChart: "",
  PieChartOutlined: "",
  PinDrop: "",
  Place: "",
  PlayArrow: "",
  PlayCircleFilled: "",
  PlayCircleOutline: "",
  PlayForWork: "",
  PlaylistAdd: "",
  PlaylistAddCheck: "",
  PlaylistPlay: "",
  PlusOne: "",
  Poll: "",
  Polymer: "",
  Pool: "",
  PortableWifiOff: "",
  Portrait: "",
  Power: "",
  PowerInput: "",
  PowerSettingsNew: "",
  PregnantWoman: "",
  PresentToAll: "",
  Print: "",
  PriorityHigh: "",
  Public: "",
  Publish: "",
  QueryBuilder: "",
  QuestionAnswer: "",
  Queue: "",
  QueueMusic: "",
  QueuePlayNext: "",
  Radio: "",
  RadioButtonChecked: "",
  RadioButtonUnchecked: "",
  RateReview: "",
  Receipt: "",
  RecentActors: "",
  RecordVoiceOver: "",
  Redeem: "",
  Redo: "",
  Refresh: "",
  Remove: "",
  RemoveCircle: "",
  RemoveCircleOutline: "",
  RemoveFromQueue: "",
  RemoveRedEye: "",
  RemoveShoppingCart: "",
  Reorder: "",
  Repeat: "",
  RepeatOne: "",
  Replay: "",
  Replay10: "",
  Replay30: "",
  Replay5: "",
  Reply: "",
  ReplyAll: "",
  Report: "",
  ReportProblem: "",
  Restaurant: "",
  RestaurantMenu: "",
  Restore: "",
  RestorePage: "",
  RingVolume: "",
  Room: "",
  RoomService: "",
  Rotate90DegreesCcw: "",
  RotateLeft: "",
  RotateRight: "",
  RoundedCorner: "",
  Router: "",
  Rowing: "",
  RssFeed: "",
  RvHookup: "",
  Satellite: "",
  Save: "",
  Scanner: "",
  Schedule: "",
  School: "",
  ScreenLockLandscape: "",
  ScreenLockPortrait: "",
  ScreenLockRotation: "",
  ScreenRotation: "",
  ScreenShare: "",
  SdCard: "",
  SdStorage: "",
  Search: "",
  Security: "",
  SelectAll: "",
  Send: "",
  SentimentDissatisfied: "",
  SentimentNeutral: "",
  SentimentSatisfied: "",
  SentimentVeryDissatisfied: "",
  SentimentVerySatisfied: "",
  Settings: "",
  SettingsApplications: "",
  SettingsBackupRestore: "",
  SettingsBluetooth: "",
  SettingsBrightness: "",
  SettingsCell: "",
  SettingsEthernet: "",
  SettingsInputAntenna: "",
  SettingsInputComponent: "",
  SettingsInputComposite: "",
  SettingsInputHdmi: "",
  SettingsInputSvideo: "",
  SettingsOverscan: "",
  SettingsPhone: "",
  SettingsPower: "",
  SettingsRemote: "",
  SettingsSystemDaydream: "",
  SettingsVoice: "",
  Share: "",
  Shop: "",
  ShopTwo: "",
  ShoppingBasket: "",
  ShoppingCart: "",
  ShortText: "",
  ShowChart: "",
  Shuffle: "",
  SignalCellular4Bar: "",
  SignalCellularConnectedNoInternet4Bar: "",
  SignalCellularNoSim: "",
  SignalCellularNull: "",
  SignalCellularOff: "",
  SignalWifi4Bar: "",
  SignalWifi4BarLock: "",
  SignalWifiOff: "",
  SimCard: "",
  SimCardAlert: "",
  SkipNext: "",
  SkipPrevious: "",
  Slideshow: "",
  SlowMotionVideo: "",
  Smartphone: "",
  SmokeFree: "",
  SmokingRooms: "",
  Sms: "",
  SmsFailed: "",
  Snooze: "",
  Sort: "",
  SortByAlpha: "",
  Spa: "",
  SpaceBar: "",
  Speaker: "",
  SpeakerGroup: "",
  SpeakerNotes: "",
  SpeakerNotesOff: "",
  SpeakerPhone: "",
  Spellcheck: "",
  Star: "",
  StarBorder: "",
  StarHalf: "",
  Stars: "",
  StayCurrentLandscape: "",
  StayCurrentPortrait: "",
  StayPrimaryLandscape: "",
  StayPrimaryPortrait: "",
  Stop: "",
  StopScreenShare: "",
  Storage: "",
  Store: "",
  StoreMallDirectory: "",
  Straighten: "",
  Streetview: "",
  StrikethroughS: "",
  Style: "",
  SubdirectoryArrowLeft: "",
  SubdirectoryArrowRight: "",
  Subject: "",
  Subscriptions: "",
  Subtitles: "",
  Subway: "",
  SupervisorAccount: "",
  SurroundSound: "",
  SwapCalls: "",
  SwapHoriz: "",
  SwapVert: "",
  SwapVerticalCircle: "",
  SwitchCamera: "",
  SwitchVideo: "",
  Sync: "",
  SyncDisabled: "",
  SyncProblem: "",
  SystemUpdate: "",
  SystemUpdateAlt: "",
  Tab: "",
  TabUnselected: "",
  Tablet: "",
  TabletAndroid: "",
  TabletMac: "",
  TagFaces: "",
  TapAndPlay: "",
  Terrain: "",
  TextFields: "",
  TextFormat: "",
  Textsms: "",
  Texture: "",
  Theaters: "",
  ThumbDown: "",
  ThumbUp: "",
  ThumbsUpDown: "",
  TimeToLeave: "",
  Timelapse: "",
  Timeline: "",
  Timer: "",
  Timer10: "",
  Timer3: "",
  TimerOff: "",
  Title: "",
  Toc: "",
  Today: "",
  Toll: "",
  Tonality: "",
  TouchApp: "",
  Toys: "",
  TrackChanges: "",
  Traffic: "",
  Train: "",
  Tram: "",
  TransferWithinAStation: "",
  Transform: "",
  Translate: "",
  TrendingDown: "",
  TrendingFlat: "",
  TrendingUp: "",
  Tune: "",
  TurnedIn: "",
  TurnedInNot: "",
  Tv: "",
  Unarchive: "",
  Undo: "",
  UnfoldLess: "",
  UnfoldMore: "",
  Update: "",
  Usb: "",
  VerifiedUser: "",
  VerticalAlignBottom: "",
  VerticalAlignCenter: "",
  VerticalAlignTop: "",
  Vibration: "",
  VideoCall: "",
  VideoLabel: "",
  VideoLibrary: "",
  Videocam: "",
  VideocamOff: "",
  VideogameAsset: "",
  ViewAgenda: "",
  ViewArray: "",
  ViewCarousel: "",
  ViewColumn: "",
  ViewComfy: "",
  ViewCompact: "",
  ViewDay: "",
  ViewHeadline: "",
  ViewList: "",
  ViewModule: "",
  ViewQuilt: "",
  ViewStream: "",
  ViewWeek: "",
  Vignette: "",
  Visibility: "",
  VisibilityOff: "",
  VoiceChat: "",
  Voicemail: "",
  VolumeDown: "",
  VolumeMute: "",
  VolumeOff: "",
  VolumeUp: "",
  VpnKey: "",
  VpnLock: "",
  Wallpaper: "",
  Warning: "",
  Watch: "",
  WatchLater: "",
  WbAuto: "",
  WbCloudy: "",
  WbIncandescent: "",
  WbIridescent: "",
  WbSunny: "",
  Wc: "",
  Web: "",
  WebAsset: "",
  Weekend: "",
  Whatshot: "",
  Widgets: "",
  Wifi: "",
  WifiLock: "",
  WifiTethering: "",
  Work: "",
  WrapText: "",
  YoutubeSearchedFor: "",
  ZoomIn: "",
  ZoomOut: "",
  ZoomOutMap: ""
};
function isUndef(v) {
  return typeof v === "undefined";
}
function almostEquals(a, b) {
  return Math.abs(a - b) <= 1e-5;
}
const _ArrayUtils = class _ArrayUtils2 {
  static sumOf(arr, start = 0, end = arr.length) {
    let sum = 0;
    for (let i = start; i < end; i++) {
      sum += arr[i];
    }
    return sum;
  }
  static averageOf(arr, start = 0, end = arr.length) {
    return _ArrayUtils2.sumOf(arr, start, end) / (end - start);
  }
  static removeAt(array, index) {
    if (array.length === 0 || index < 0 || index >= array.length) {
      throw new Error("array is empty or index out of bound");
    }
    for (let i = index; i < array.length - 1; i++) {
      array[i] = array[i + 1];
    }
    array.pop();
  }
  static removeRange(arr, start = 0, end = arr.length) {
    arr.splice(start, end - start);
  }
  static copyOfRange(arr, start, end) {
    const newArray = new Array(end - start);
    for (let i = start; i < end; i++) {
      newArray[i - start] = arr[i];
    }
    return newArray;
  }
  static copyTo(src, start, length, dest, destStart) {
    if (src.length < start + length || dest.length < destStart + length) {
      return;
    }
    for (let i = 0; i < length; i++) {
      dest[destStart + i] = src[start + i];
    }
  }
  static inBound(arr, index) {
    if (!Number.isInteger(index)) {
      return false;
    }
    return index >= 0 && index < arr.length;
  }
  static everyValue(arr, param2) {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = param2(arr[i]);
    }
  }
  static maxOf(arr, p2) {
    let max = Number.MIN_VALUE;
    for (let i = 0; i < arr.length; i++) {
      const v = p2(arr[i]);
      if (v > max) {
        max = v;
      }
    }
    return max;
  }
  static minOf(arr, p2) {
    let min = Number.MAX_VALUE;
    for (let i = 0; i < arr.length; i++) {
      const v = p2(arr[i]);
      if (v < min) {
        min = v;
      }
    }
    return min;
  }
  static equals(a, b) {
    if (a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }
    return true;
  }
  static almostEquals(a, b) {
    if (a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (!almostEquals(a[i], b[i])) {
        return false;
      }
    }
    return true;
  }
};
_ArrayUtils.emptyFloat32Array = new Float32Array();
let ArrayUtils = _ArrayUtils;
function degreeToRadian(degree) {
  return degree * (Math.PI / 180);
}
function radianToDegree(radian) {
  return radian * (180 / Math.PI);
}
function currentMilliseconds() {
  return Date.now();
}
function useKeyboard(type, c) {
  const handler = (e) => e.isTrusted && c(e);
  const event = type === "up" ? "keyup" : "keydown";
  onMounted(() => window.addEventListener(event, handler));
  onUnmounted(() => window.removeEventListener(event, handler));
}
function int(n) {
  return Math.floor(n);
}
function calcRMS(sampleRate, left, right, currentTime, wind = 2048) {
  const unit = sampleRate / 1e3;
  const index = int(currentTime * unit);
  let sum = 0;
  if (!ArrayUtils.inBound(left, index)) {
    return 0;
  }
  if (left.length - index < wind) {
    for (let i = left.length - 1; i > left.length - 1 - wind; i--) {
      sum += left[i] ** 2 + right[i] ** 2;
    }
  } else {
    for (let i = index; i < index + wind; i++) {
      sum += left[i] ** 2 + right[i] ** 2;
    }
  }
  return Math.sqrt(sum / wind);
}
function url(urlString) {
  {
    return "/api" + urlString;
  }
}
function clamp(value, min, max) {
  if (value < min)
    return min;
  if (value > max)
    return max;
  return value;
}
function scope(target, scope2) {
  scope2.call(target);
}
function isString$2(v) {
  return typeof v === "string";
}
function shallowCopy(source) {
  const result = {};
  const keys = Object.getOwnPropertyNames(source);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    result[key] = source[key];
  }
  return result;
}
function TODO(reason) {
  throw new Error(reason);
}
function debounce(callback, delay) {
  let timeout;
  return () => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(callback, delay);
  };
}
let id$1 = 0;
function nextId() {
  if (id$1 >= Number.MAX_SAFE_INTEGER - 10) {
    id$1 = 0;
  }
  return id$1++;
}
class OsuNotification {
  static removeFrom(r, item) {
    const index = r.value.indexOf(item);
    index >= 0 && r.value.splice(index, 1);
    triggerRef(r);
  }
  static clear(r) {
    r.value.length = 0;
    triggerRef(r);
  }
  static pushTo(r, item) {
    r.value.push(item);
    triggerRef(r);
  }
  static push(n) {
    if (n.state === RunningTask.STATE_FINISH) {
      this.pushTo(this.messages, n);
    } else {
      this.pushTo(this.runningTasks, n);
    }
    this.pushTo(this.tempQueue, n);
    if (n.always) {
      return;
    }
    setTimeout(() => {
      this.removeFrom(this.tempQueue, n);
    }, 5e3);
  }
}
OsuNotification.messages = shallowRef([]);
OsuNotification.runningTasks = shallowRef([]);
OsuNotification.tempQueue = shallowRef([]);
const _RunningTask = class _RunningTask2 {
  constructor() {
    this.id = nextId();
    this.text = ref("");
    this.icon = ref(Icon.Check);
    this.progress = ref(0);
    this.state = _RunningTask2.STATE_WAIT;
    this.always = false;
  }
  async run(scope2) {
    return scope2(this);
  }
  finish(text2, icon = Icon.Info) {
    this.always = false;
    OsuNotification.removeFrom(OsuNotification.runningTasks, this);
    OsuNotification.removeFrom(OsuNotification.tempQueue, this);
    this.text.value = text2;
    this.icon.value = icon;
    this.state = _RunningTask2.STATE_FINISH;
    this.progress.value = 0;
    OsuNotification.push(this);
  }
};
_RunningTask.STATE_WAIT = 0;
_RunningTask.STATE_RUNNING = 1;
_RunningTask.STATE_FINISH = 2;
let RunningTask = _RunningTask;
function notifyMessage(text2, icon = Icon.Info) {
  const task = new RunningTask();
  task.text.value = text2;
  task.icon.value = icon;
  task.state = RunningTask.STATE_FINISH;
  OsuNotification.push(task);
}
async function runTask(text2, scope2, isAlways = false) {
  const task = new RunningTask();
  task.always = isAlways;
  task.text.value = text2;
  task.state = RunningTask.STATE_RUNNING;
  OsuNotification.push(task);
  return task.run(scope2);
}
const buttonHover = "" + new URL("button-hover-0b4883cb.wav", import.meta.url).href;
const buttonSelect = "" + new URL("button-select-83584559.wav", import.meta.url).href;
const buttonSidebarHover = "" + new URL("button-sidebar-hover-00f4de94.wav", import.meta.url).href;
const buttonSidebarSelect = "" + new URL("button-sidebar-select-3a873086.wav", import.meta.url).href;
const checkOff = "" + new URL("check-off-a6b5b3ca.wav", import.meta.url).href;
const checkOn = "" + new URL("check-on-42f5d244.wav", import.meta.url).href;
const cursorTap = "" + new URL("cursor-tap-df5b433b.wav", import.meta.url).href;
const defaultHover = "" + new URL("default-hover-93870cdb.wav", import.meta.url).href;
const defaultSelectDisabled = "" + new URL("default-select-disabled-634484e3.wav", import.meta.url).href;
const defaultSelect = "" + new URL("default-select-0ed4e0dc.wav", import.meta.url).href;
const dialogCancelSelect = "" + new URL("dialog-cancel-select-49d54957.wav", import.meta.url).href;
const dialogDangerousSelect = "" + new URL("dialog-dangerous-select-cd72fb87.wav", import.meta.url).href;
const dialogDangerousTick = "" + new URL("dialog-dangerous-tick-05a6813b.wav", import.meta.url).href;
const dialogOkSelect = "" + new URL("dialog-ok-select-2f86a8e2.wav", import.meta.url).href;
const dialogPopIn = "" + new URL("dialog-pop-in-2e513e70.wav", import.meta.url).href;
const dialogPopOut = "" + new URL("dialog-pop-out-e5fdc8b2.wav", import.meta.url).href;
const dropdownClose = "" + new URL("dropdown-close-61b0ddf7.wav", import.meta.url).href;
const dropdownOpen = "" + new URL("dropdown-open-0bac7737.wav", import.meta.url).href;
const genericError = "" + new URL("generic-error-7d3bcf64.wav", import.meta.url).href;
const itemSwap = "" + new URL("item-swap-40102b26.wav", import.meta.url).href;
const metronomeLatch = "" + new URL("metronome-latch-e6130143.wav", import.meta.url).href;
const metronomeTickDownbeat = "" + new URL("metronome-tick-downbeat-709397cf.wav", import.meta.url).href;
const metronomeTick = "" + new URL("metronome-tick-d0bbf806.wav", import.meta.url).href;
const noclickHover = "data:audio/wav;base64,UklGRuANAABXQVZFZm10IBAAAAABAAIARKwAABCxAgAEABAAZGF0YbwNAABsAG0AoACfANsA3AAmASUBdgF4Ac8BzgEgAiACdAJ1ArsCugL9Av0CLQMsA1oDWgN4A3gDjAONA3sDegNZA1oDFgMTA7kCuwJQAk8C4wHjAYEBgQEjASIB1QDVAJgAmQBvAG8AawBqAIEAgQDFAMUAMQEwAcEBwQF4AngCLAMtA9ED0QNKBEoEpASkBNQE1ATJBMkEhgSFBAsEDQRTA08DUQJTAhsBGwGw/7D/N/43/s/8zvyS+5L7ifqK+sP5wvlC+UT5Ifkf+VP5VPnk+eT50vrQ+gv8DvyW/ZP9IP8k/4gAhQCTAZUBRQJFAnsCegItAi0CXgFbARYAGwBv/mz+b/xv/ET6Qvo1+Db4cfZx9h31G/Vv9HL0cfRt9Bj1H/VR9kr2+/f/9wP6Avo3/Db8Pf5A/sX/wf+YAJsAtgCzAPz/AAB6/nf+QPxB/H35ffli9mH2F/MZ8wnwCPDA7b/tiOyL7E7sS+wc7SDt3e7Z7lnxXPF79Hn0zPfN97D6sfql/KL8lP2X/Yv9iP2a/Jz83frb+lv4XPhe9Vz1ePJ68n3wefC5773vUPBN8DzyPvKK9Yn1HPoc+q3/rv+vBa4FPQs/C84Pyw9iE2MT3hXeFfcW+BawFq8WXhVeFaYTpxOHEoUSfxKBEpYTlBPPFdAVGRkcGSEdHR0XIRohESQNJA8lESUHJAckLSEtIa0crRzzFvMWtxC2EAgLCAvhBuEGqwSpBFQEVQTDBcQFkQiQCBcMGgxjD18PehF8ERcSGRIqEScRuw6+DkILPwtmB2cHPgQ+BH8CfwI1AjQCKgMsAxEFDgU9Bz4HpQikCDcINwixBbIFagFpAbD7sPsr9Sv1y+7K7sbpyOn85v3mU+ZR5jvnPOcf6RzpEusU69zr2uvU6tbqLugu6E/kT+QG4AfgWNxW3C/aM9rn2eLZWtte23nedN5X4lri9+X35WToYeie6aHp7Onp6bPpt+kS6g7qJewm7FHwU/AS9hD24/zk/I8DkAO0CLEIVgtZC3sLeAtmCWgJ0gXQBRwCHgKi/57/uv68/kX/Rf8UARQBbgNyA1YFUQUOBhIGtAWxBaoErATJA8kDDwQOBCoGKgYACgAKEA8RD6gUpxSGGYUZOBw6HCscKBzCGcQZ3BXYFaERpRF0DnMOOA03Dd4N3g0MEAwQERMQE4QVhRX7FfkVAxQFFEEQQRBcC1gLbwZ0BukC4wKFAYsBMAIqAlQEWARTB1IH4AnhCfcK9wpJCkgK+gf7B3sEewSDAIMAHv0d/az6rfoE+QP5/vcB+En3RvdA9kP2gPR99HDyc/Jv8G3w1O7U7kHuQe5Y71fvtfG28ZL0jvQ990L3FPkP+Uf5S/mn96b31PTT9JXxmPEY7xLvPO5C7pbvke+t8rHy4fbe9nv7fPuK/4n/BQIHAsYCxQIsAi0CyQDIAE3/S//G/sr+rf+o/4sBkAHiA90D+AX8BfsG+AYPBhEGbwNuA23/bv/H+sj6YPZd9oHzgvOy8rPyzfPL84r2i/Yy+jH6z/3N/YgAjQBDAj0C7ALxArsCuAI7AjwCKAIoAooChwI/A0IDHgQbBOcE6gQdBRoFogSjBAMEAgSQA48DvAO/A/wE+ARRB1UHOAo0Ci4NMA3ZD9kPixGJEdAR0xHtEOkQSw9OD3wNew0MDA0MkQuPCwAMAAzvDO4M4w3kDUAOQQ5CDUENiAqJCpEGkQbjAeMBGv0a/Qz5DfmZ9pf2vfXD9S72JvZ093v3B/kB+en57fm5+bn5tPiw+Bb3G/dQ9Uv1A/QJ9LHzrfNB9EP0rPWr9ZL3lPdj+WD5kfqV+kb7QfuX+5z7pvul+7D7r/s//ED8Uv1R/Z7+oP7z//D/1gDaAOsA5gAbAB8Ayv7G/iv9Lf2j+6H75/ro+of7iPst/Sv9gP+C/+gB5gGiA6QDAwQDBAIDAQPhAOEAy/3L/Wv6a/q197b3QPZA9hb2FfYl9yf3H/ke+VH7U/tN/Uv97f7v/gcABQCLAIwAyQDJAD0BPAHRAdMBlQKTAncDdwM6BDoEVwRXBMEDwAPAAsECggF+AUgATgCp/6X/BQAIADkBNwEtAy4DlQWVBeEH4AdvCW4JIQoiCgAKAAobCR0J3AfaB9wG2wZQBlIGIgYgBmwGbwb7BvgGVAdYBywHKAeKBo4GiAWEBSIEJQTaAtoCBQIEArIBswHVAdUBXgJeAgIDAgMyAzED1wLXAucB6QFmAGMAf/6A/qX8o/wc+x/73vnc+RL5E/nR+M/44fji+PH48PgD+Qb5EPkP+Qr5Cfkg+SD5pPmj+ZD6kvrW+9b7e/17/Tj/Nv+5AL0AzwHMAXECcwJ1AnUC3wHeAf8AAQEtACwAXP9b/5r+nf4Q/g3+iP2L/dv82Pz7+/77JPsj+0v6Svqq+av5hfmD+eD55Pmx+qv6xfvJ+xD9C/0T/hf+qP6l/sj+y/6C/oD+1/3Y/RD9Dv2D/IX8RvxG/GP8Yfzm/Oj8vv28/YX+if4s/yn/qv+s//j/9f8gACEAWgBYAN4A4ACXAZUBfAJ+AoMDgQOeBKEEkwWQBRUGFgY3BjgGCwYJBooFjAWqBKgEpgOnA+kC6QKnAqYCtQKzAiMDJQPxA+4DEwUVBVgGVgZRB1IHwAe/B5oHmwf6BvkG8AXyBXAEbwSPAo4CowClAA3/Df///f/9WP1X/Rr9G/0O/Q39Rv1I/cf9xP1y/nP+Ff8U/4r/i//Q/9D/1v/U/5z/nv85/zb/n/6j/r39uf20/LX8yPvI+y/7L/vg+uH68Prt+lT7WPsf/Bv8Q/1G/cH+v/5wAG8AIwIlAqkDpwOvBK4EMwU0BUIFQgXlBOYEDAQMBMQCwwIhASEBSP9J/1X9U/1p+2v72/nb+dX40/hX+Fz4avhl+OH45vit+ar5vPq7+gf8DPyF/X/9D/8V/8EAuwBYAlwCoAOfA4wEiwQyBTMFkwWSBZwFngVfBVsFzATPBOQD4QOuArMCQAE8Aaf/qf8i/iD+9fz4/Dz8Ofzs++37BvwH/H/8ffw8/UH9Mf4r/lP/WP+rAKcAHwIiAqsDqwMwBS0FZAZnBiQHIAdpB2wHWQdZB/MG8QZUBlgGnwWdBdQE0wTxA/AD9AL2AsoByQFKAEsAjv6N/sL8wvwa+xz7n/me+WH4Yfhl92X3sfay9kD2P/Ym9ij2bfZs9iT3JvdO+Ez41PnX+ar7pvuT/Zb9bf9q/+sA7QAXAhcC7gLsAqADogMpBCYEmgSdBPEE7gQMBQ4F6ATmBGQEZQSSA5EDUQJTAtwA2QBS/1X/8/3x/cz8zvzt++z7X/tf+xP7E/sI+wf7Nvs4+6n7pvtk/Gv8hf1+/fL++P65ALYAuAK4AtIE1QTABr0GSQhMCGoJaAkQChAKNQo2CukJ6Qk4CTkJMAguCNUG1wZHBUMFfwOEA5QBkAGD/4P/cP1y/Y37ivvo+ev5pfii+Kz3rvcT9xH3y/bM9uL24PZI90v39ffz9/D48/gs+ij6kfuV+yn9J/3Z/tn+pQCmAGACXQLyA/UDUgVOBV8GYwYcBxkHagdrB0YHRQewBq8GxAXFBZQElARBA0ED5AHjAacApwCP/4//rf6t/gf+Cf6u/ar9hv2K/Y/9i/2u/bD92v3b/RT+E/5a/lr+wf7B/jn/Of/T/9H/hwCKAE0BSgEWAhoC1ALTAncDdQPkA+cDHgQeBDAEMAQcBB4E6APlA5UDlwMkAyQDjwKNAr8BwQHDAMEAkv+T/zX+M/69/L/8P/s+++L55Pmw+K34zvfO9yj3K/fP9s32uva99uP24fZJ90v34/fi98f4x/jl+eX5QPtB+8r8yPxq/m3+EwAQAJQBlgHlAuYC5gPjA5MElwT2BPEECQUOBe0E6ASUBJYEIgQhBIQDgwPLAs4CAQL/AScBKQFQAE4AgP+B/9H+0f5K/kr+/f3//fX98/0p/ir+kP6Q/hz/G/+1/7f/VwBTAO8A8gCTAZIBOwI6Au0C7gKlA6MDXwRjBB8FHQXMBc0FXgZcBrAGsgbEBsQGiwaKBhoGGwZzBXIFqQSrBMkDxwPbAt0C+AH3ARMBEwE8ADsAa/9s/6r+qv7+/f/9af1p/fP88fyR/JT8V/xV/Cr8LPwL/Ar87fvs+8370PvP+8372fvb+wr8CPxS/FL8tvy4/Db9Mv2o/a39F/4S/mH+Y/6P/pD+m/6Y/pD+lf6P/on+mf6e/sf+xv4K/wn/a/9u/83/yv8LAA4AJwAlABYAFwDm/+f/n/+e/2f/af9V/1P/b/9y/77/u/8wADEArACrAAYBBwFIAUcBZQFkAWkBawFpAWcBfwGCAbYBswH4AfoBSAJIAnQCdAKCAoMCaAJmAjcCOAIHAgYC7AHtAfEB8AH/Af4BEQIUAgQCAQLSAdQBewF6AQwBDAGUAJYALAAsAM3/y/9p/2r/Af8C/4T+g/4H/gr+of2c/Uz9UP0z/TH9NP00/VL9VP17/Xf9i/2P/Zj9k/2c/Z/9uv25/er96f03/jf+mf6Z/gb/B/9m/2b/vv+//w4ADABcAF4ArQCrAOYA5gAMAQ0BGAEWARABEgENAQwBAgEDAQQBBQH/APsA9QD5AOUA4gDOANEAwQC/ALgAuAC4ALkAtwC2ALEAtACaAJUAfwCFAG0AaABhAGUAZABhAGEAYgBgAGAAUQBPAEMARgBBAD0APgBDAF4AWgA=";
const noclickSelect = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAIARKwAABCxAgAEABAAZGF0YQAAAAA=";
const notchTick = "" + new URL("notch-tick-ab9e59d1.wav", import.meta.url).href;
const notificationCancel = "" + new URL("notification-cancel-e395b948.wav", import.meta.url).href;
const notificationDefault = "" + new URL("notification-default-ed834b5e.wav", import.meta.url).href;
const notificationDone = "" + new URL("notification-done-d9b767cc.wav", import.meta.url).href;
const notificationError = "" + new URL("notification-error-3d7dcd95.wav", import.meta.url).href;
const notificationMention = "" + new URL("notification-mention-9d3cf7d6.wav", import.meta.url).href;
const nowPlayingPopIn = "" + new URL("now-playing-pop-in-0ece71e2.wav", import.meta.url).href;
const nowPlayingPopOut = "" + new URL("now-playing-pop-out-63fa0fc2.wav", import.meta.url).href;
const osdChange = "" + new URL("osd-change-1c2c84ab.wav", import.meta.url).href;
const osdOff = "" + new URL("osd-off-23727b4f.wav", import.meta.url).href;
const osdOn = "" + new URL("osd-on-93431fb3.wav", import.meta.url).href;
const osuLogoSelect = "" + new URL("osu-logo-select-db426488.wav", import.meta.url).href;
const osuLogoHeartbeat = "" + new URL("osu-logo-heartbeat-b5b40024.wav", import.meta.url).href;
const osuLogoDownbeat = "" + new URL("osu-logo-downbeat-3a24ddd2.wav", import.meta.url).href;
const overlayBigPopIn = "" + new URL("overlay-big-pop-in-313d2472.wav", import.meta.url).href;
const overlayBigPopOut = "" + new URL("overlay-big-pop-out-8ae35783.wav", import.meta.url).href;
const overlayPopIn = "" + new URL("overlay-pop-in-52f9489a.wav", import.meta.url).href;
const overlayPopOut = "" + new URL("overlay-pop-out-ecf91cb5.wav", import.meta.url).href;
const rulesetSelectFruits = "" + new URL("ruleset-select-fruits-949b174a.wav", import.meta.url).href;
const rulesetSelectMania = "" + new URL("ruleset-select-mania-0d64dc93.wav", import.meta.url).href;
const rulesetSelectOsu = "" + new URL("ruleset-select-osu-9fa4029e.wav", import.meta.url).href;
const rulesetSelectTaiko = "" + new URL("ruleset-select-taiko-2b1aad11.wav", import.meta.url).href;
const screenBack = "" + new URL("screen-back-2eed1388.wav", import.meta.url).href;
const scrolltotopSelect = "" + new URL("scrolltotop-select-63351c85.wav", import.meta.url).href;
const settingsPopIn = "" + new URL("settings-pop-in-15b7e5ca.wav", import.meta.url).href;
const shutter = "" + new URL("shutter-3d6115f6.wav", import.meta.url).href;
const softHitwhistle = "" + new URL("soft-hitwhistle-244b7593.wav", import.meta.url).href;
const submitSelect = "" + new URL("submit-select-e9deba2b.wav", import.meta.url).href;
const tabselectSelect = "" + new URL("tabselect-select-ae3cac20.wav", import.meta.url).href;
const toolbarHover = "" + new URL("button-hover-0b4883cb.wav", import.meta.url).href;
const toolbarSelect = "" + new URL("toolbar-select-382744b1.wav", import.meta.url).href;
const wavePopIn = "" + new URL("wave-pop-in-0e44e88b.wav", import.meta.url).href;
const wavePopOut = "" + new URL("wave-pop-out-77d45182.wav", import.meta.url).href;
const SoundEffectMap = [
  {
    name: "ButtonHover",
    url: buttonHover
  },
  {
    name: "ButtonSelect",
    url: buttonSelect
  },
  {
    name: "ButtonSidebarHover",
    url: buttonSidebarHover
  },
  {
    name: "ButtonSidebarSelect",
    url: buttonSidebarSelect
  },
  {
    name: "CheckOff",
    url: checkOff
  },
  {
    name: "CheckOn",
    url: checkOn
  },
  {
    name: "CursorTap",
    url: cursorTap
  },
  {
    name: "DefaultHover",
    url: defaultHover
  },
  {
    name: "DefaultSelectDisabled",
    url: defaultSelectDisabled
  },
  {
    name: "DefaultSelect",
    url: defaultSelect
  },
  {
    name: "DialogCancelSelect",
    url: dialogCancelSelect
  },
  {
    name: "DialogDangerousSelect",
    url: dialogDangerousSelect
  },
  {
    name: "DialogDangerousTick",
    url: dialogDangerousTick
  },
  {
    name: "DialogOkSelect",
    url: dialogOkSelect
  },
  {
    name: "DialogPopIn",
    url: dialogPopIn
  },
  {
    name: "DialogPopOut",
    url: dialogPopOut
  },
  {
    name: "DropdownClose",
    url: dropdownClose
  },
  {
    name: "DropdownOpen",
    url: dropdownOpen
  },
  {
    name: "GenericError",
    url: genericError
  },
  {
    name: "ItemSwap",
    url: itemSwap
  },
  {
    name: "MetronomeLatch",
    url: metronomeLatch
  },
  {
    name: "MetronomeTickDownbeat",
    url: metronomeTickDownbeat
  },
  {
    name: "MetronomeTick",
    url: metronomeTick
  },
  {
    name: "NoclickHover",
    url: noclickHover
  },
  {
    name: "NoclickSelect",
    url: noclickSelect
  },
  {
    name: "NotchTick",
    url: notchTick
  },
  {
    name: "NotificationCancel",
    url: notificationCancel
  },
  {
    name: "NotificationDefault",
    url: notificationDefault
  },
  {
    name: "NotificationDone",
    url: notificationDone
  },
  {
    name: "NotificationError",
    url: notificationError
  },
  {
    name: "NotificationMention",
    url: notificationMention
  },
  {
    name: "NowPlayingPopIn",
    url: nowPlayingPopIn
  },
  {
    name: "NowPlayingPopOut",
    url: nowPlayingPopOut
  },
  {
    name: "OsdChange",
    url: osdChange
  },
  {
    name: "OsdOff",
    url: osdOff
  },
  {
    name: "OsdOn",
    url: osdOn
  },
  {
    name: "OsuLogoSelect",
    url: osuLogoSelect
  },
  {
    name: "OsuLogoDownbeat",
    url: osuLogoDownbeat
  },
  {
    name: "OsuLogoHeartbeat",
    url: osuLogoHeartbeat
  },
  {
    name: "OverlayBigPopIn",
    url: overlayBigPopIn
  },
  {
    name: "OverlayBigPopOut",
    url: overlayBigPopOut
  },
  {
    name: "OverlayPopIn",
    url: overlayPopIn
  },
  {
    name: "OverlayPopOut",
    url: overlayPopOut
  },
  {
    name: "RulesetSelectFruits",
    url: rulesetSelectFruits
  },
  {
    name: "RulesetSelectMania",
    url: rulesetSelectMania
  },
  {
    name: "RulesetSelectOsu",
    url: rulesetSelectOsu
  },
  {
    name: "RulesetSelectTaiko",
    url: rulesetSelectTaiko
  },
  {
    name: "ScreenBack",
    url: screenBack
  },
  {
    name: "ScrolltotopSelect",
    url: scrolltotopSelect
  },
  {
    name: "SettingsPopIn",
    url: settingsPopIn
  },
  {
    name: "Shutter",
    url: shutter
  },
  {
    name: "SoftHitwhistle",
    url: softHitwhistle
  },
  {
    name: "SubmitSelect",
    url: submitSelect
  },
  {
    name: "TabselectSelect",
    url: tabselectSelect
  },
  {
    name: "ToolbarHover",
    url: toolbarHover
  },
  {
    name: "ToolbarSelect",
    url: toolbarSelect
  },
  {
    name: "WavePopIn",
    url: wavePopIn
  },
  {
    name: "WavePopOut",
    url: wavePopOut
  }
];
const audioContext = new AudioContext();
const Sound = {};
async function loadSoundEffect() {
  await runTask("Downloading sounds", async (task) => {
    let buffer;
    task.progress.value = 0;
    let length = SoundEffectMap.length, i = 0;
    for (let soundSrc of SoundEffectMap) {
      buffer = await downloadSound(soundSrc.url);
      try {
        Sound[soundSrc.name] = await audioContext.decodeAudioData(buffer);
      } catch (e) {
      }
      task.progress.value = ++i / length;
    }
    task.progress.value = 1;
    task.finish("Sounds downloaded", Icon.Check);
  }, true);
}
async function downloadSound(url2) {
  const response = await fetch(url2);
  return response.arrayBuffer();
}
function playSound(buffer) {
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start();
  source.onended = () => {
    source.stop();
    source.disconnect();
  };
}
const _sfc_main$u = /* @__PURE__ */ defineComponent({
  __name: "CheckBox",
  props: mergeModels({
    color: { default: "#33cb98" }
  }, {
    "modelValue": { type: Boolean, ...{ default: false } }
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const props = __props;
    const checkValue = useModel(__props, "modelValue");
    const value = ref(checkValue.value);
    watch(value, (v) => {
      playSound(v ? Sound.CheckOn : Sound.CheckOff);
      checkValue.value = v;
    });
    const checkBox = ref(null);
    const callback = () => {
      var _a2;
      (_a2 = checkBox.value) == null ? void 0 : _a2.style.setProperty("--checkbox-color", props.color);
    };
    watch(() => props.color, callback);
    onMounted(callback);
    return (_ctx, _cache) => {
      return withDirectives((openBlock(), createElementBlock("input", {
        type: "checkbox",
        class: "o-checkbox",
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => value.value = $event)
      }, null, 512)), [
        [vModelCheckbox, value.value]
      ]);
    };
  }
});
const CheckBox_vue_vue_type_style_index_0_scoped_baa6d9c1_lang = "";
const CheckBox = /* @__PURE__ */ _export_sfc(_sfc_main$u, [["__scopeId", "data-v-baa6d9c1"]]);
class TimePlayer {
  constructor() {
    this.previousTime = 0;
    this.startTime = 0;
    this.isPlaying = false;
    this._current = ref(0);
    this.sp = 1;
  }
  reset() {
    this.sp = 1;
    this._current.value = 0;
    this.previousTime = 0;
    this.startTime = 0;
    this.isPlaying = false;
  }
  play() {
    this.isPlaying = true;
    this.startTime = currentMilliseconds();
  }
  pause() {
    this.isPlaying = false;
    this.previousTime = this._current.value;
  }
  seek(milli) {
    this.startTime = currentMilliseconds();
    this._current.value = milli;
    this.previousTime = milli;
  }
  currentTime() {
    if (this.isPlaying) {
      this._current.value = this.previousTime + int((currentMilliseconds() - this.startTime) * this.sp);
    }
    return this._current;
  }
  speed(s) {
    this.sp = s;
    this.previousTime = this._current.value;
    this.startTime = currentMilliseconds();
  }
}
class VisualizerV2 {
  constructor(analyse) {
    this.analyse = analyse;
    this.source = null;
    this.fftBuffer = new Uint8Array(0);
    this.emptyBuffer = new Uint8Array(0);
    this.isAvailable = false;
    analyse.smoothingTimeConstant = 0.3;
    analyse.minDecibels = -45;
    analyse.maxDecibels = 0;
    analyse.fftSize = 1024;
    const bufferLength = analyse.frequencyBinCount;
    this.fftBuffer = new Uint8Array(bufferLength);
    this.emptyBuffer = new Uint8Array(bufferLength);
  }
  disable() {
    this.isAvailable = false;
    this.source = null;
  }
  enable() {
    this.isAvailable = true;
  }
  setSourceNode(node) {
    node.connect(this.analyse);
    this.source = node;
  }
  getFFT() {
    if (this.isAvailable) {
      this.analyse.getByteFrequencyData(this.fftBuffer);
      return this.fftBuffer;
    }
    return this.emptyBuffer;
  }
}
const PlayerState = {
  STATE_DOWNLOADING: 0,
  STATE_DECODING: 1,
  STATE_PLAYING: 2,
  STATE_DECODE_DONE: 3,
  STATE_PAUSING: 4
};
class AbstractPlayer {
}
function eventRef(val) {
  const event = customRef((track2, trigger2) => {
    let value = val;
    return {
      get() {
        track2();
        return value;
      },
      set(newValue) {
        value = newValue;
        trigger2();
      }
    };
  });
  event.emit = function(val2) {
    this.value = val2;
  };
  return event;
}
function collect(r, callback) {
  let skipFirst = true;
  let newValue = r.value;
  const job = () => {
    callback(newValue);
  };
  return watchEffect(() => {
    newValue = r.value;
    if (skipFirst) {
      skipFirst = false;
      return;
    }
    queuePostFlushCb(job);
  });
}
function collectLatest(r, callback) {
  return watch(r, callback, { immediate: true });
}
class AudioPlayer extends AbstractPlayer {
  constructor() {
    super();
    this.source = null;
    this.audioBuffer = null;
    this.isAvailable = false;
    this.time = new TimePlayer();
    this._duration = 0;
    this.volume = ref(1);
    this.onEnd = eventRef();
    this.onSeeked = eventRef();
    this.playState = ref(-1);
    this._busyState = [PlayerState.STATE_DECODING];
    this.needToPlay = false;
    this.seekTime = -1;
    this.playbackRate = 1;
    this.visualizer = null;
    this.audioContext = new AudioContext();
  }
  async setSource(src) {
    if (this.isBusy()) {
      return;
    }
    this.pause();
    this.isAvailable = false;
    if (!(src instanceof ArrayBuffer)) {
      return;
    }
    await this.decode(src);
    this.isAvailable = true;
    this.time.reset();
    this._duration = int(this.audioBuffer.duration * 1e3);
  }
  isBusy() {
    return this._busyState.includes(this.playState.value);
  }
  async decode(arrayBuffer) {
    this.playState.value = PlayerState.STATE_DECODING;
    this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    this.playState.value = PlayerState.STATE_DECODE_DONE;
  }
  async play() {
    var _a2, _b;
    if (this.isPlaying()) {
      return;
    }
    if (this.isBusy()) {
      this.needToPlay = true;
      return;
    }
    this.playState.value = PlayerState.STATE_PLAYING;
    const source = this.audioContext.createBufferSource();
    source.buffer = this.audioBuffer;
    source.playbackRate.value = this.playbackRate;
    source.connect(this.audioContext.destination);
    source.onended = () => {
      this.pause();
      this.onEnd.emit(false);
    };
    let startTime = 0;
    if (this.seekTime > 0) {
      startTime = this.seekTime / 1e3;
      this.seekTime = -1;
    } else {
      startTime = this.time.currentTime().value / 1e3;
    }
    source.start(0, startTime);
    this.time.play();
    this.source = source;
    (_a2 = this.visualizer) == null ? void 0 : _a2.enable();
    (_b = this.visualizer) == null ? void 0 : _b.setSourceNode(source);
  }
  pause() {
    var _a2;
    if (this.playState.value === PlayerState.STATE_PAUSING) {
      return;
    }
    if (this.isBusy()) {
      this.needToPlay = false;
      return;
    }
    this.playState.value = PlayerState.STATE_PAUSING;
    const source = this.source;
    if (source != null) {
      source.onended = null;
      source.stop();
      this.time.pause();
      source.disconnect();
      this.source = null;
    }
    (_a2 = this.visualizer) == null ? void 0 : _a2.disable();
  }
  async seek(time) {
    if (this.isBusy()) {
      this.seekTime = time;
      return;
    }
    let shouldReplay = this.isPlaying();
    if (shouldReplay) {
      this.pause();
    }
    this.time.seek(time);
    if (shouldReplay) {
      await this.play();
    }
    this.onSeeked.emit(true);
  }
  speed(rate) {
    this.playbackRate = rate;
    if (!this.isAvailable) {
      return;
    }
    const source = this.source;
    if (source != null) {
      source.playbackRate.value = rate;
      this.time.speed(rate);
    }
  }
  setVolume(v) {
    this.volume.value = clamp(v, 0, 1);
    if (!this.isAvailable)
      return;
  }
  currentTime() {
    return Math.min(this.time.currentTime().value, this.duration());
  }
  duration() {
    return this._duration;
  }
  isPlaying() {
    return this.playState.value === PlayerState.STATE_PLAYING;
  }
  stop() {
    this.seek(0);
    this.pause();
  }
  getAudioBuffer() {
    return this.audioBuffer;
  }
  getVisualizer() {
    if (this.visualizer != null) {
      return this.visualizer;
    }
    const visualizer = new VisualizerV2(this.audioContext.createAnalyser());
    if (this.isAvailable && this.source != null) {
      visualizer.setSourceNode(this.source);
    }
    this.visualizer = visualizer;
    return visualizer;
  }
}
const AudioPlayerV2 = new AudioPlayer();
const easeIn = cubicBezier(0.25, 0.1, 0.25, 1);
const easeInSine = cubicBezier(0.12, 0, 0.39, 0);
const easeInQuad = cubicBezier(0.11, 0, 0.5, 0);
const easeInCubic = cubicBezier(0.32, 0, 0.67, 0);
const easeInQuart = cubicBezier(0.5, 0, 0.75, 0);
const easeInQuint = cubicBezier(0.64, 0, 0.78, 0);
const easeInExpo = cubicBezier(0.7, 0, 0.84, 0);
const easeInCirc = cubicBezier(0.55, 0, 1, 0.45);
const easeInBack = cubicBezier(0.36, 0, 0.66, -0.56);
const easeInElastic = (x) => {
  const c4 = 2 * Math.PI / 3;
  return x === 0 ? 0 : x === 1 ? 1 : -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * c4);
};
const easeInBounce = (x) => {
  return 1 - easeOutBounce(1 - x);
};
const easeOut = cubicBezier(0, 0, 0.58, 1);
const easeOutSine = cubicBezier(0.61, 1, 0.88, 1);
const easeOutQuad = cubicBezier(0.5, 1, 0.89, 1);
const easeOutCubic = cubicBezier(0.33, 1, 0.68, 1);
const easeOutQuart = cubicBezier(0.25, 1, 0.5, 1);
const easeOutQuint = cubicBezier(0.22, 1, 0.36, 1);
const easeOutExpo = cubicBezier(0.16, 1, 0.3, 1);
const easeOutCirc = cubicBezier(0, 0.55, 0.45, 1);
const easeOutBack = cubicBezier(0.34, 1.56, 0.64, 1);
const easeOutElastic = (x) => {
  const c4 = 2 * Math.PI / 3;
  return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
};
const easeOutBounce = (x) => {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (x < 1 / d1) {
    return n1 * x * x;
  } else if (x < 2 / d1) {
    return n1 * (x -= 1.5 / d1) * x + 0.75;
  } else if (x < 2.5 / d1) {
    return n1 * (x -= 2.25 / d1) * x + 0.9375;
  } else {
    return n1 * (x -= 2.625 / d1) * x + 0.984375;
  }
};
const easeInOut = cubicBezier(0.42, 0, 0.58, 1);
const easeInOutSine = cubicBezier(0.37, 0, 0.63, 1);
const easeInOutQuad = cubicBezier(0.45, 0, 0.55, 1);
const easeInOutCubic = cubicBezier(0.65, 0, 0.35, 1);
const easeInOutQuart = cubicBezier(0.76, 0, 0.24, 1);
const easeInOutQuint = cubicBezier(0.83, 0, 0.17, 1);
const easeInOutExpo = cubicBezier(0.87, 0, 0.13, 1);
const easeInOutCirc = cubicBezier(0.85, 0, 0.15, 1);
const easeInOutBack = cubicBezier(0.68, -0.6, 0.32, 1.6);
const easeInOutElastic = (x) => {
  const c5 = 2 * Math.PI / 4.5;
  return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2 : Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5) / 2 + 1;
};
const easeInOutBounce = (x) => {
  return x < 0.5 ? (1 - easeOutBounce(1 - 2 * x)) / 2 : (1 + easeOutBounce(2 * x - 1)) / 2;
};
const linear = cubicBezier(0, 0, 1, 1);
function cubicBezier(p1x, p1y, p2x, p2y) {
  const ZERO_LIMIT = 1e-6;
  const ax = 3 * p1x - 3 * p2x + 1;
  const bx = 3 * p2x - 6 * p1x;
  const cx = 3 * p1x;
  const ay = 3 * p1y - 3 * p2y + 1;
  const by = 3 * p2y - 6 * p1y;
  const cy = 3 * p1y;
  function sampleCurveDerivativeX(t) {
    return (3 * ax * t + 2 * bx) * t + cx;
  }
  function sampleCurveX(t) {
    return ((ax * t + bx) * t + cx) * t;
  }
  function sampleCurveY(t) {
    return ((ay * t + by) * t + cy) * t;
  }
  function solveCurveX(x) {
    let t2 = x;
    let derivative;
    let x2;
    for (let i = 0; i < 8; i++) {
      x2 = sampleCurveX(t2) - x;
      if (Math.abs(x2) < ZERO_LIMIT) {
        return t2;
      }
      derivative = sampleCurveDerivativeX(t2);
      if (Math.abs(derivative) < ZERO_LIMIT) {
        break;
      }
      t2 -= x2 / derivative;
    }
    let t1 = 1;
    let t0 = 0;
    t2 = x;
    while (t1 > t0) {
      x2 = sampleCurveX(t2) - x;
      if (Math.abs(x2) < ZERO_LIMIT) {
        return t2;
      }
      if (x2 > 0) {
        t1 = t2;
      } else {
        t0 = t2;
      }
      t2 = (t1 + t0) / 2;
    }
    return t2;
  }
  function solve(x) {
    return sampleCurveY(solveCurveX(x));
  }
  return solve;
}
class TestBeater {
  constructor() {
    this.gap = 0;
    this.offset = 0;
    this.timingList = [];
    this.beatCount = 0;
    this.beatFlag = false;
    this.prevBeat = -1;
  }
  getGap() {
    return this.gap;
  }
  setBpm(bpm) {
    this.gap = 60 / bpm * 1e3;
  }
  setOffset(offset) {
    this.offset = offset;
  }
  setTimingList(list2) {
    this.timingList = [...list2];
    this.timingList = this.timingList.sort((a, b) => a.timestamp - b.timestamp);
  }
  isKiai(currentTime) {
    currentTime += 60;
    const timingList = this.timingList;
    if (timingList.length === 0) {
      return false;
    }
    let item = null;
    for (let i = 0; i < timingList.length; i++) {
      if (currentTime <= timingList[i].timestamp) {
        if (i > 0) {
          item = timingList[i - 1];
        }
        break;
      }
    }
    if (item === null) {
      return false;
    } else {
      return item.isKiai;
    }
  }
  beat(timestamp) {
    if (timestamp < this.offset) {
      return 0;
    }
    timestamp -= this.offset;
    const gap = this.gap;
    timestamp += 60;
    const count = Math.floor(timestamp / gap);
    timestamp -= count * gap;
    this.beatCount = count;
    if (timestamp <= 60) {
      return easeOut(timestamp / 60);
    }
    if (timestamp <= gap - 60) {
      if (!this.beatFlag && this.prevBeat != count) {
        this.beatFlag = true;
        this.prevBeat = count;
      } else {
        this.beatFlag = false;
      }
      return easeInOut(1 - (timestamp - 60) / (gap - 120));
    }
    if (timestamp <= gap) {
      return 0;
    }
    return 0;
  }
  getBeatCount() {
    return this.beatCount;
  }
  getOffset() {
    return this.offset;
  }
  isBeat() {
    return this.beatFlag;
  }
}
function useAnimationFrame(key, callback) {
  let handle;
  const k = isRef(key) ? key : ref(null);
  const animationCallback = (timestamp) => {
    callback(timestamp);
    handle = requestAnimationFrame(animationCallback);
  };
  watch(k, (value) => {
    if (value) {
      handle = requestAnimationFrame(animationCallback);
    } else if (handle !== void 0) {
      cancelAnimationFrame(handle);
      handle = void 0;
    }
  }, { immediate: true });
  onUnmounted(() => {
    handle !== void 0 && cancelAnimationFrame(handle);
  });
}
function useAnimationFrame2(callback) {
  let handle, isStop = ref(false);
  const animationCallback = (timestamp) => {
    callback(timestamp);
    if (!isStop.value) {
      handle = requestAnimationFrame(animationCallback);
    }
  };
  handle = requestAnimationFrame(animationCallback);
  onUnmounted(() => {
    handle !== void 0 && cancelAnimationFrame(handle);
    isStop.value = true;
  });
}
const _hoisted_1$j = { class: "relative" };
const _hoisted_2$c = ["value"];
const _hoisted_3$7 = ["onClick"];
const _sfc_main$t = /* @__PURE__ */ defineComponent({
  __name: "ExpandMenu",
  props: mergeModels({
    items: {},
    align: { default: "left" }
  }, {
    "modelValue": { default: "" }
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const props = __props;
    const value = useModel(__props, "modelValue");
    const selectedIndex = computed({
      get() {
        return props.items.indexOf(value.value);
      },
      set(v) {
        value.value = props.items[v];
      }
    });
    const hidden = ref(true);
    const select = (index) => {
      selectedIndex.value = index;
      hidden.value = true;
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$j, [
        createBaseVNode("input", {
          onFocus: _cache[0] || (_cache[0] = ($event) => hidden.value = false),
          class: normalizeClass(["expand-select", {
            "text-center": _ctx.align === "center",
            "text-left": _ctx.align === "left",
            "text-right": _ctx.align === "right"
          }]),
          readonly: "",
          value: value.value
        }, null, 42, _hoisted_2$c),
        createBaseVNode("div", {
          class: "expand-item-list",
          style: normalizeStyle({
            display: hidden.value ? "none" : "block"
          })
        }, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.items, (item, index) => {
            return openBlock(), createElementBlock("div", {
              onClick: ($event) => select(index),
              class: normalizeClass({
                "expand-item-selected": index === selectedIndex.value,
                "expand-item": index !== selectedIndex.value
              })
            }, toDisplayString(item), 11, _hoisted_3$7);
          }), 256))
        ], 4)
      ]);
    };
  }
});
const ExpandMenu_vue_vue_type_style_index_0_scoped_91fe4232_lang = "";
const ExpandMenu = /* @__PURE__ */ _export_sfc(_sfc_main$t, [["__scopeId", "data-v-91fe4232"]]);
const _hoisted_1$i = { class: "w-full text-center text-white text-sm" };
const _hoisted_2$b = ["value"];
const _sfc_main$s = /* @__PURE__ */ defineComponent({
  __name: "ValueAdjust",
  props: mergeModels({
    label: {}
  }, {
    "modelValue": {
      default: 60
    }
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const value = useModel(__props, "modelValue");
    const step = ref("");
    const increase = () => {
      const v = parseInt(step.value);
      value.value += v;
    };
    const decrease = () => {
      const v = parseInt(step.value);
      value.value -= v;
    };
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Column, {
        class: "flex-grow bg-[--bpm-color-3] rounded p-2",
        style: { "flex-basis": "0" },
        gap: 8
      }, {
        default: withCtx(() => [
          createBaseVNode("span", _hoisted_1$i, toDisplayString(_ctx.label), 1),
          createBaseVNode("input", {
            class: "w-full bg-black text-white rounded text-center text-[22px] py-2",
            value: value.value
          }, null, 8, _hoisted_2$b),
          createVNode(Row, {
            class: "w-full text-white",
            gap: 8
          }, {
            default: withCtx(() => [
              createBaseVNode("button", {
                onClick: _cache[0] || (_cache[0] = ($event) => decrease()),
                class: "ma adjust-btn"
              }, toDisplayString(unref(Icon).Remove), 1),
              createVNode(ExpandMenu, {
                class: "flex-grow",
                items: ["1", "5", "10", "100"],
                modelValue: step.value,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => step.value = $event)
              }, null, 8, ["modelValue"]),
              createBaseVNode("button", {
                onClick: _cache[2] || (_cache[2] = ($event) => increase()),
                class: "ma adjust-btn"
              }, toDisplayString(unref(Icon).Add), 1)
            ]),
            _: 1
          })
        ]),
        _: 1
      });
    };
  }
});
const ValueAdjust_vue_vue_type_style_index_0_scoped_86011a6a_lang = "";
const ValueAdjust = /* @__PURE__ */ _export_sfc(_sfc_main$s, [["__scopeId", "data-v-86011a6a"]]);
class SingleEvent {
  constructor() {
    this.eventList = [];
  }
  add(callback) {
    this.eventList.push(callback);
    return () => this.remove(callback);
  }
  remove(callback) {
    const index = this.eventList.indexOf(callback);
    if (index !== -1) {
      this.eventList.splice(index, 1);
    }
  }
  fire(p2) {
    const list2 = this.eventList;
    for (let i = 0; i < list2.length; i++) {
      list2[i](p2);
    }
  }
  removeAll() {
    this.eventList.length = 0;
  }
}
function useSingleEvent(event, callback) {
  onMounted(() => {
    event.add(callback);
  });
  onUnmounted(() => {
    event.remove(callback);
  });
}
class Toaster {
  static show(message) {
    this.onToast.fire(message);
  }
}
Toaster.onToast = new SingleEvent();
const _withScopeId$4 = (n) => (pushScopeId("data-v-48768823"), n = n(), popScopeId(), n);
const _hoisted_1$h = /* @__PURE__ */ _withScopeId$4(() => /* @__PURE__ */ createBaseVNode("button", { class: "text-white fill-height" }, "Timing", -1));
const _hoisted_2$a = {
  class: "h-full flex flex-col justify-evenly px-1",
  style: { "background-color": "var(--bpm-color-3)" }
};
const _hoisted_3$6 = {
  class: "flex-grow text-white h-20",
  style: { "background-color": "var(--bpm-color-2)" }
};
const _hoisted_4$5 = {
  class: "text-white stack flex flex-row flex-grow h-full",
  style: { "background-color": "var(--bpm-color-3)" }
};
const _hoisted_5$4 = /* @__PURE__ */ _withScopeId$4(() => /* @__PURE__ */ createBaseVNode("div", {
  class: "flex-grow h-full w-96",
  style: { "background-color": "var(--bpm-color-4)" }
}, null, -1));
const _hoisted_6$2 = { class: "w-full h-full flex flex-col pb-2" };
const _hoisted_7$1 = { class: "w-96 px-4" };
const _hoisted_8$1 = { style: { "background-color": "#171c1a", "height": "240px", "width": "50%" } };
const _hoisted_9$1 = /* @__PURE__ */ _withScopeId$4(() => /* @__PURE__ */ createBaseVNode("span", { class: "text-white" }, "Kiai Mode", -1));
const _hoisted_10$1 = {
  class: "text-white select-none",
  style: { "font-size": "26px", "letter-spacing": "2px" }
};
const _hoisted_11$1 = { class: "select-none text-[--bpm-color-7]" };
const _hoisted_12$1 = { class: "flex-grow" };
const _hoisted_13$1 = /* @__PURE__ */ _withScopeId$4(() => /* @__PURE__ */ createBaseVNode("div", {
  class: "flex items-end flex-grow",
  style: { "flex-basis": "0" }
}, [
  /* @__PURE__ */ createBaseVNode("span", null, "Playback rate")
], -1));
const _hoisted_14$1 = ["onClick"];
const WINDOW = 12;
const _sfc_main$r = /* @__PURE__ */ defineComponent({
  __name: "BpmCalculator",
  emits: ["close"],
  setup(__props, { emit: emit2 }) {
    const bpmInfo = reactive({
      offset: 0,
      bpm: 60
    });
    const beater = new TestBeater();
    let progressContext;
    let waveContext;
    let beatWaveContext;
    let intervals = [];
    const drawFlag = ref(false);
    const playState = AudioPlayerV2.playState;
    const player = AudioPlayerV2;
    const wave = ref(null);
    let DRAW_COUNT = 12;
    let peeks = [];
    onMounted(() => {
      Toaster.show("Under developing......");
      if (wave.value) {
        const ctx = wave.value.getContext("2d");
        if (ctx) {
          waveContext = ctx;
        }
      }
      peeks = generatePeek();
    });
    watch(() => bpmInfo.bpm, (value, oldValue) => {
      if (value != oldValue) {
        beater.setBpm(value);
      }
      if (!player.isPlaying()) {
        drawWave();
      }
    });
    watch(() => bpmInfo.offset, (value) => {
      beater.setOffset(value);
      if (!player.isPlaying()) {
        drawWave();
      }
    });
    function changeByBpm(e) {
      changeProgressByBeatGap(e.deltaY > 0);
    }
    function changeProgressByBeatGap(isPlus) {
      const offset = bpmInfo.offset;
      const current = Math.max(player.currentTime() - offset, 0);
      const gap = 60 / bpmInfo.bpm * 1e3;
      let count = Math.round(current / gap);
      if (isPlus)
        count++;
      else {
        count = Math.max(--count, 0);
      }
      const targetCurrent = gap * count + offset;
      player.seek(targetCurrent);
      drawProgressbar();
      drawWave();
      state.currentTime = timeString(player.currentTime());
    }
    function drawWave() {
      const bound = resizeCanvas(wave);
      const gap = 60 / bpmInfo.bpm * 1e3;
      const offset = bpmInfo.offset;
      const visibleTime = gap * DRAW_COUNT;
      const halfVisibleTime = visibleTime / 2;
      const unit = bound.width / visibleTime;
      const currentTime = player.currentTime();
      const ctx = waveContext;
      const musicStartX = (halfVisibleTime - currentTime) * unit;
      const start = int(currentTime - bound.width / 2 / unit);
      const end = int(currentTime + bound.width / 2 / unit);
      const duration = player.duration();
      ctx.clearRect(0, 0, bound.width, bound.height);
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.fillStyle = "#33cb9840";
      let x2 = 0;
      const startLength = peeks[start] * bound.height;
      ctx.moveTo(x2, (bound.height - startLength) / 2);
      for (let i = start + 1; i < end && i < duration; i++) {
        const length = peeks[i] * bound.height;
        ctx.lineTo(x2, (bound.height - length) / 2);
        x2 += unit;
      }
      for (let i = end - 1; i >= start; i--) {
        const length = peeks[i] * bound.height;
        ctx.lineTo(x2, (bound.height - length) / 2 + length);
        x2 -= unit;
      }
      ctx.moveTo(0, (bound.height - startLength) / 2);
      ctx.fill();
      if (musicStartX > 0) {
        ctx.beginPath();
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 4;
        ctx.moveTo(musicStartX, 0);
        ctx.lineTo(musicStartX, bound.height);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 1;
      let x = musicStartX + offset * unit;
      for (let i = 0; x < bound.width; i++) {
        if (x > 0 && (i & 3) != 0) {
          ctx.moveTo(Math.floor(x), 10);
          ctx.lineTo(Math.floor(x), bound.height - 10);
        }
        x += gap * unit;
      }
      ctx.stroke();
      ctx.beginPath();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 3;
      x = musicStartX + offset * unit;
      for (let i = 0; x < bound.width; i++) {
        if (x > 0) {
          ctx.moveTo(Math.floor(x), 10);
          ctx.lineTo(Math.floor(x), bound.height - 10);
        }
        x += gap * unit * 4;
      }
      ctx.stroke();
      ctx.beginPath();
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.moveTo(bound.width / 2, 0);
      ctx.lineTo(bound.width / 2, bound.height);
      ctx.stroke();
    }
    function generatePeek() {
      const peek = [];
      const audioBuffer = player.getAudioBuffer();
      const sampleRate = audioBuffer.sampleRate;
      let leftChannel, rightChannel;
      if (audioBuffer.numberOfChannels < 2) {
        leftChannel = audioBuffer.getChannelData(0);
        rightChannel = leftChannel;
      } else {
        leftChannel = audioBuffer.getChannelData(0);
        rightChannel = audioBuffer.getChannelData(1);
      }
      const duration = int(audioBuffer.duration * 1e3);
      for (let i = 0; i < duration; i++) {
        const value = calcRMS(sampleRate, leftChannel, rightChannel, i, 512);
        peek.push(value);
      }
      return peek;
    }
    const timing = reactive({
      list: [],
      selectedIndex: -1,
      selectedTiming: {
        timestamp: 0,
        isKiai: false
      }
    });
    function addAtCurrent() {
      const timingItem = {
        isKiai: false,
        timestamp: Math.floor(player.currentTime())
      };
      timing.list.push(timingItem);
      timing.list = timing.list.sort((a, b) => a.timestamp - b.timestamp);
      timing.selectedIndex = timing.list.length - 1;
      timing.selectedTiming = timing.list[timing.selectedIndex];
    }
    function removeSelected() {
      if (timing.selectedIndex < 0) {
        return;
      }
      ArrayUtils.removeAt(timing.list, timing.selectedIndex);
    }
    function selectCurrentTiming(index) {
      timing.selectedIndex = index;
      player.seek(timing.list[index].timestamp);
      timing.selectedTiming = timing.list[index];
    }
    function timeString(time) {
      if (isNaN(time)) {
        return "00:00:000";
      }
      time = Math.floor(time);
      const milliseconds = time % 1e3;
      time /= 1e3;
      const minute = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      let millisecondsString;
      let minuteString;
      let secondsString;
      if (milliseconds < 10) {
        millisecondsString = "00" + milliseconds;
      } else if (milliseconds < 100) {
        millisecondsString = "0" + milliseconds;
      } else {
        millisecondsString = "" + milliseconds;
      }
      if (minute < 10) {
        minuteString = "0" + minute;
      } else {
        minuteString = "" + minute;
      }
      if (seconds < 10) {
        secondsString = "0" + seconds;
      } else {
        secondsString = "" + seconds;
      }
      return `${minuteString}:${secondsString}:${millisecondsString}`;
    }
    computed({
      set(value) {
        if (typeof value !== "number") {
          value = parseInt(value);
        }
        bpmInfo.offset = value;
      },
      get() {
        return bpmInfo.offset;
      }
    });
    let previous = -1;
    function tapV2() {
      const timestamp = currentMilliseconds();
      if (previous < 0) {
        previous = timestamp;
        return;
      }
      const interval = timestamp - previous;
      if (interval > 2e3) {
        intervals.length = 0;
        previous = timestamp;
        return;
      }
      if (intervals.length < WINDOW) {
        intervals.push(interval);
        intervals.sort();
      } else {
        const start = int(intervals.length * 0.2);
        const end = int(intervals.length * 0.8);
        intervals = ArrayUtils.copyOfRange(intervals, start, end);
        bpmInfo.bpm = Math.round(60 / ArrayUtils.averageOf(intervals) * 1e3);
      }
      previous = timestamp;
    }
    function reset() {
      state.gap.length = 0;
      bpmInfo.bpm = 0;
      previous = 0;
    }
    function beat() {
      const time = player.currentTime();
      const scale = beater.beat(time);
      beatEffect.isKiai = beater.isKiai(time);
      beatEffect.tapBeat = scale;
      return scale;
    }
    const beatWave = ref(null);
    const beatEffect = reactive({
      tapBeat: 0,
      isKiai: false
    });
    onMounted(() => {
      if (beatWave.value) {
        const ctx = beatWave.value.getContext("2d");
        if (ctx) {
          beatWaveContext = ctx;
        }
      }
    });
    function drawBeatWave() {
      if (!beater.isBeat()) {
        return;
      }
      const beatIndex = beater.getBeatCount() - 4;
      const bound = resizeCanvas(beatWave, window.devicePixelRatio);
      const ctx = beatWaveContext;
      const beatLength = beater.getGap();
      const unit = bound.width / beatLength;
      const heightPerWave = bound.height / 8;
      ctx.scale(0.8, 0.8);
      ctx.clearRect(0, 0, bound.width, bound.height);
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.fillStyle = "#33cb98";
      for (let i = beatIndex, j = 0; i < beatIndex + 8; i++, j++) {
        if (i < 0)
          continue;
        const offsetY = heightPerWave * j;
        const time = beatLength * i + beater.getOffset();
        const width = bound.width;
        const height = heightPerWave;
        const start = int(time - width / 2 / unit);
        const end = int(time + width / 2 / unit);
        const duration = player.duration();
        let x2 = 0;
        const startLength = peeks[start] * height;
        ctx.moveTo(x2, offsetY + (height - startLength) / 2);
        for (let i2 = start + 1; i2 < end && i2 < duration; i2++) {
          const length = peeks[i2] * height;
          ctx.lineTo(x2, offsetY + (height - length) / 2);
          x2 += unit;
        }
        for (let i2 = end - 1; i2 >= start; i2--) {
          const length = peeks[i2] * height;
          ctx.lineTo(x2, offsetY + (height - length) / 2 + length);
          x2 -= unit;
        }
        ctx.lineTo(0, offsetY + (height - startLength) / 2);
      }
      ctx.fill();
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "white";
      ctx.moveTo(bound.width / 2, 0);
      ctx.lineTo(bound.width / 2, bound.height);
      ctx.stroke();
    }
    let progressBound;
    const progress = ref(null);
    const mouseState = ref(false);
    onMounted(() => {
      if (progress.value) {
        const ctx = progress.value.getContext("2d");
        if (ctx) {
          progressContext = ctx;
        }
      }
    });
    function drawProgressbar() {
      const bound = resizeCanvas(progress);
      progressBound = bound;
      const ctx = progressContext;
      const duration = player.duration();
      const progressValue = player.currentTime() / duration;
      ctx.clearRect(0, 0, bound.width, bound.height);
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "white";
      ctx.moveTo(0, bound.height / 2);
      ctx.lineTo(bound.width, bound.height / 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.fillStyle = "#7a0a5180";
      const list2 = timing.list;
      for (let i = 0; i < list2.length; i++) {
        const { timestamp, isKiai } = list2[i];
        if (!isKiai) {
          continue;
        }
        const startPosition = timestamp / duration;
        let endPosition = -1;
        for (let j = i + 1; j < list2.length; j++) {
          const endTiming = list2[j];
          if (endTiming.isKiai) {
            continue;
          }
          endPosition = endTiming.timestamp / duration;
          i = j;
          break;
        }
        if (endPosition < 0) {
          endPosition = 1;
        }
        ctx.moveTo(bound.width * startPosition, 30);
        ctx.lineTo(bound.width * startPosition, bound.height - 30);
        ctx.lineTo(bound.width * endPosition, bound.height - 30);
        ctx.lineTo(bound.width * endPosition, 30);
        ctx.lineTo(bound.width * startPosition, 30);
        if (endPosition === 1)
          break;
      }
      ctx.fill();
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "red";
      ctx.moveTo(bound.width * progressValue, 0);
      ctx.lineTo(bound.width * progressValue, bound.height);
      ctx.stroke();
    }
    function changeProgress(e) {
      slideProgress(e);
      mouseState.value = false;
    }
    function slideProgress(e) {
      if (!mouseState.value) {
        return;
      }
      const x = e.offsetX;
      const durationMilliseconds = player.duration();
      const p2 = x / progressBound.width * durationMilliseconds;
      if (p2 < 0 || p2 > durationMilliseconds) {
        return;
      }
      player.seek(p2);
      state.currentTime = timeString(player.currentTime());
      drawProgressbar();
      drawWave();
    }
    const playbackRate = ref([0.25, 0.5, 0.75, 1]);
    const loadState = ref("正在初始化......");
    async function applyTiming() {
    }
    function playOrStart() {
      if (player.isPlaying()) {
        player.pause();
      } else {
        player.play();
      }
    }
    function stopPlay() {
      player.pause();
      player.seek(0);
      drawProgressbar();
      drawWave();
    }
    const state = reactive({
      precisionIndex: 2,
      playbackRateIndex: 3,
      gap: [],
      currentTime: "00:00:000"
    });
    useKeyboard("down", (evt) => {
      if (!evt.isTrusted) {
        return;
      }
      if (evt.code === "KeyT" || evt.code === "KeyY") {
        tapV2();
      }
      if (evt.code === "KeyR") {
        reset();
      }
    });
    collectLatest(player.playState, (value) => {
      drawFlag.value = value === PlayerState.STATE_PLAYING;
    });
    watch(() => state.playbackRateIndex, (value) => {
      player.speed(playbackRate.value[value]);
    });
    useKeyboard("down", (evt) => {
      if (evt.code === "ArrowRight") {
        changeProgressByBeatGap(true);
      } else if (evt.code === "ArrowLeft") {
        changeProgressByBeatGap(false);
      } else if (evt.code === "ArrowUp") {
        state.playbackRateIndex = Math.min(state.playbackRateIndex + 1, 3);
      } else if (evt.code === "ArrowDown") {
        state.playbackRateIndex = Math.max(state.playbackRateIndex - 1, 0);
      }
    });
    onMounted(() => {
      loadState.value = "";
    });
    onUnmounted(() => {
      drawFlag.value = false;
    });
    function closeCalculator() {
      player.speed(playbackRate.value[3]);
      emit2("close");
    }
    useAnimationFrame(drawFlag, () => {
      beat();
      state.currentTime = timeString(player.currentTime());
      drawProgressbar();
      drawWave();
      drawBeatWave();
    });
    function resizeCanvas(htmlRef, pixelRatio = 1) {
      const canvas2 = htmlRef.value;
      if (!canvas2) {
        return {
          width: 0,
          height: 0
        };
      }
      const parent = canvas2.parentElement;
      if (canvas2.height !== parent.offsetHeight || canvas2.width !== parent.offsetWidth) {
        canvas2.height = parent.offsetHeight * pixelRatio;
        canvas2.width = parent.offsetWidth * pixelRatio;
      }
      return {
        width: canvas2.width,
        height: canvas2.height
      };
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Column, {
        class: "fill-size bpm-calc-box",
        style: { "background-color": "var(--bpm-color-1)" }
      }, {
        default: withCtx(() => [
          createVNode(Row, {
            class: "w-full min-h-[36px]",
            style: { "background-color": "#374340", "padding": "0 16px" }
          }, {
            default: withCtx(() => [
              _hoisted_1$h,
              createBaseVNode("button", {
                class: "text-white h-full bpm-close ml-auto",
                onClick: _cache[0] || (_cache[0] = ($event) => closeCalculator())
              }, "Close")
            ]),
            _: 1
          }),
          createVNode(Row, { class: "w-full" }, {
            default: withCtx(() => [
              createBaseVNode("div", _hoisted_2$a, [
                createBaseVNode("button", {
                  class: "ma text-white",
                  onClick: _cache[1] || (_cache[1] = ($event) => isRef(DRAW_COUNT) ? DRAW_COUNT.value++ : DRAW_COUNT++)
                }, toDisplayString(unref(Icon).ZoomOut), 1),
                createBaseVNode("button", {
                  class: "text-white ma",
                  onClick: _cache[2] || (_cache[2] = ($event) => isRef(DRAW_COUNT) ? DRAW_COUNT.value-- : DRAW_COUNT--)
                }, toDisplayString(unref(Icon).ZoomIn), 1)
              ]),
              createBaseVNode("div", _hoisted_3$6, [
                createBaseVNode("canvas", {
                  ref_key: "wave",
                  ref: wave,
                  onWheel: changeByBpm
                }, null, 544)
              ])
            ]),
            _: 1
          }),
          createVNode(Row, {
            class: "flex-grow",
            style: { "flex-basis": "0" },
            gap: 8
          }, {
            default: withCtx(() => [
              createBaseVNode("div", _hoisted_4$5, [
                _hoisted_5$4,
                createBaseVNode("div", _hoisted_6$2, [
                  createVNode(Column, {
                    class: "flex-grow vertical-scroll no-scroller",
                    style: { "height": "200px" }
                  }, {
                    default: withCtx(() => [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(timing.list, (item, index) => {
                        return openBlock(), createBlock(Row, {
                          class: normalizeClass(`w-full py-1 ${timing.selectedIndex === index ? "timing-item-selected" : "timing-item"}`),
                          gap: 32,
                          onClick: ($event) => selectCurrentTiming(index),
                          key: item.timestamp
                        }, {
                          default: withCtx(() => [
                            createBaseVNode("span", _hoisted_7$1, toDisplayString(timeString(item.timestamp)), 1),
                            createBaseVNode("div", {
                              class: "timing-attr flex flex-center rounded bg-black px-2 text-sm",
                              style: normalizeStyle(`display: ${item.isKiai ? "block" : "none"}`)
                            }, "Kiai", 4)
                          ]),
                          _: 2
                        }, 1032, ["class", "onClick"]);
                      }), 128))
                    ]),
                    _: 1
                  }),
                  createVNode(Row, {
                    class: "w-full pr-4",
                    right: "",
                    gap: 16
                  }, {
                    default: withCtx(() => [
                      createBaseVNode("button", {
                        class: "btn h-6",
                        onClick: _cache[3] || (_cache[3] = ($event) => addAtCurrent())
                      }, "+"),
                      createBaseVNode("button", {
                        class: "btn h-6",
                        onClick: _cache[4] || (_cache[4] = ($event) => removeSelected())
                      }, "-")
                    ]),
                    _: 1
                  })
                ])
              ]),
              createVNode(Column, {
                class: "h-full vertical-scroll no-scroller pt-2 w-[480px]",
                gap: 8,
                "center-horizontal": ""
              }, {
                default: withCtx(() => [
                  createVNode(Row, {
                    class: "w-full",
                    gap: 8
                  }, {
                    default: withCtx(() => [
                      createVNode(ValueAdjust, {
                        label: "BPM",
                        modelValue: bpmInfo.bpm,
                        "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => bpmInfo.bpm = $event),
                        style: { "flex-basis": "0" },
                        class: "flex-grow"
                      }, null, 8, ["modelValue"]),
                      createVNode(ValueAdjust, {
                        label: "Offset",
                        modelValue: bpmInfo.offset,
                        "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => bpmInfo.offset = $event),
                        style: { "flex-basis": "0" },
                        class: "flex-grow"
                      }, null, 8, ["modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(Column, {
                    class: "fill-width block-box",
                    "center-horizontal": "",
                    gap: 16
                  }, {
                    default: withCtx(() => [
                      createVNode(Row, { class: "fill-width justify-evenly items-center" }, {
                        default: withCtx(() => [
                          createBaseVNode("button", {
                            class: "beat-button",
                            style: normalizeStyle(`transform: scale(${1 - beatEffect.tapBeat * 0.05}); opacity: ${0.6 + beatEffect.tapBeat * 0.4}`)
                          }, null, 4),
                          createBaseVNode("div", _hoisted_8$1, [
                            createBaseVNode("canvas", {
                              ref_key: "beatWave",
                              ref: beatWave
                            }, null, 512)
                          ])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  timing.list.length !== 0 ? (openBlock(), createBlock(Row, {
                    key: 0,
                    class: "fill-width block-box",
                    "center-vertical": ""
                  }, {
                    default: withCtx(() => [
                      _hoisted_9$1,
                      createVNode(CheckBox, {
                        class: "ml-auto",
                        modelValue: timing.selectedTiming.isKiai,
                        "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => timing.selectedTiming.isKiai = $event)
                      }, null, 8, ["modelValue"])
                    ]),
                    _: 1
                  })) : createCommentVNode("", true)
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          createVNode(Row, {
            class: "w-full text-white",
            style: { "height": "80px" }
          }, {
            default: withCtx(() => [
              createVNode(Column, {
                center: "",
                style: { "background-color": "#222a27", "padding": "0 16px" }
              }, {
                default: withCtx(() => [
                  createBaseVNode("span", _hoisted_10$1, toDisplayString(state.currentTime), 1),
                  createBaseVNode("span", _hoisted_11$1, toDisplayString(bpmInfo.bpm) + " BPM ", 1)
                ]),
                _: 1
              }),
              createBaseVNode("div", _hoisted_12$1, [
                createBaseVNode("canvas", {
                  ref_key: "progress",
                  ref: progress,
                  class: "fill-size",
                  onMousedown: _cache[8] || (_cache[8] = ($event) => mouseState.value = true),
                  onMouseup: changeProgress,
                  onMousemove: slideProgress,
                  onMouseleave: changeProgress
                }, null, 544)
              ]),
              createVNode(Row, { class: "bg-[--bpm-color-3]" }, {
                default: withCtx(() => [
                  createBaseVNode("button", {
                    class: "min-w-[48px] min-h-[48px] ma text-white hover:bg-[--bpm-color-5]",
                    style: { "font-size": "36px" },
                    onClick: _cache[9] || (_cache[9] = ($event) => playOrStart())
                  }, toDisplayString(unref(playState) === unref(PlayerState).STATE_PLAYING ? unref(Icon).Pause : unref(Icon).PlayArrow), 1),
                  createBaseVNode("button", {
                    class: "w-12 aspect-square ma text-white hover:bg-[--bpm-color-5]",
                    style: { "font-size": "36px" },
                    onClick: _cache[10] || (_cache[10] = ($event) => stopPlay())
                  }, toDisplayString(unref(Icon).Stop), 1),
                  createVNode(Column, { class: "w-60" }, {
                    default: withCtx(() => [
                      _hoisted_13$1,
                      createVNode(Row, {
                        class: "flex-grow",
                        style: { "flex-basis": "0" }
                      }, {
                        default: withCtx(() => [
                          (openBlock(true), createElementBlock(Fragment, null, renderList(playbackRate.value, (item, index) => {
                            return openBlock(), createElementBlock("button", {
                              class: "flex-grow text-white text-sm hover:text-yellow-200",
                              onClick: ($event) => state.playbackRateIndex = index,
                              style: normalizeStyle([{ "flex-basis": "0" }, {
                                color: state.playbackRateIndex === index ? "var(--bpm-color-8)" : "white"
                              }])
                            }, toDisplayString(Math.round(item * 100)) + "% ", 13, _hoisted_14$1);
                          }), 256))
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createBaseVNode("button", {
                    class: "fill-height bpm-apply",
                    onClick: _cache[11] || (_cache[11] = ($event) => applyTiming())
                  }, " Apply ")
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ]),
        _: 1
      });
    };
  }
});
const BpmCalculator_vue_vue_type_style_index_0_scoped_48768823_lang = "";
const BpmCalculator = /* @__PURE__ */ _export_sfc(_sfc_main$r, [["__scopeId", "data-v-48768823"]]);
const _sfc_main$q = {};
const _hoisted_1$g = { class: "flex flex-row develop-box rounded-tl-[8px] py-2 px-4 text-white bg-[#00000080] pointer-events-none" };
const _hoisted_2$9 = /* @__PURE__ */ createBaseVNode("span", null, "开发中版本", -1);
const _hoisted_3$5 = [
  _hoisted_2$9
];
function _sfc_render$1(_ctx, _cache) {
  return openBlock(), createElementBlock("div", _hoisted_1$g, _hoisted_3$5);
}
const DevelopTip = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["render", _sfc_render$1]]);
class VideoPlayer extends AbstractPlayer {
  constructor() {
    super();
    this.video = document.createElement("video");
    this.isAvailable = false;
    this.baseOffset = 0;
    this.isStop = false;
    this.previousObjectUrl = null;
  }
  currentTime() {
    return this.isAvailable ? int(this.video.currentTime * 1e3) : 0;
  }
  duration() {
    return this.isAvailable ? int(this.video.duration * 1e3) : 0;
  }
  pause() {
    this.video.pause();
  }
  async play() {
    if (this.isStop) {
      await this.seek(0);
      this.isStop = false;
    }
    await this.video.play();
  }
  isPlaying() {
    return !this.video.paused;
  }
  seek(milliseconds) {
    return new Promise((resolve2) => {
      this.video.onseeked = () => {
        resolve2();
      };
      const targetCurrentTime = milliseconds - this.baseOffset;
      if (targetCurrentTime >= 0) {
        this.video.currentTime = targetCurrentTime / 1e3;
      } else {
        const tick = currentMilliseconds();
        setTimeout(() => {
          const gap = currentMilliseconds() - tick;
          console.log("VideoPlayer gap", gap);
          if (gap > -targetCurrentTime) {
            this.video.currentTime = (gap + targetCurrentTime) / 1e3;
          } else {
            this.video.currentTime = 0;
          }
        }, -targetCurrentTime);
      }
    });
  }
  async setSource(src) {
    this.isAvailable = false;
    const video = this.video;
    if (isString$2(src)) {
      video.src = src;
    } else if (src instanceof Blob) {
      video.src = "";
      if (this.previousObjectUrl) {
        URL.revokeObjectURL(this.previousObjectUrl);
      }
      this.previousObjectUrl = URL.createObjectURL(src);
      video.src = this.previousObjectUrl;
    } else {
      return;
    }
    video.load();
    await this.play();
    this.pause();
    this.isAvailable = true;
  }
  setVolume(_) {
  }
  speed(rate) {
    this.video.playbackRate = rate;
  }
  stop() {
    this.isStop = true;
    this.video.pause();
  }
  getVideoElement() {
    return this.video;
  }
}
const VideoPlayer$1 = new VideoPlayer();
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
function commonjsRequire(path) {
  throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var jszip_min = { exports: {} };
/*!

JSZip v3.10.1 - A JavaScript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/main/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/main/LICENSE
*/
(function(module, exports) {
  !function(e) {
    module.exports = e();
  }(function() {
    return function s(a, o, h2) {
      function u(r, e2) {
        if (!o[r]) {
          if (!a[r]) {
            var t = "function" == typeof commonjsRequire && commonjsRequire;
            if (!e2 && t)
              return t(r, true);
            if (l)
              return l(r, true);
            var n = new Error("Cannot find module '" + r + "'");
            throw n.code = "MODULE_NOT_FOUND", n;
          }
          var i = o[r] = { exports: {} };
          a[r][0].call(i.exports, function(e3) {
            var t2 = a[r][1][e3];
            return u(t2 || e3);
          }, i, i.exports, s, a, o, h2);
        }
        return o[r].exports;
      }
      for (var l = "function" == typeof commonjsRequire && commonjsRequire, e = 0; e < h2.length; e++)
        u(h2[e]);
      return u;
    }({ 1: [function(e, t, r) {
      var d = e("./utils"), c = e("./support"), p2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      r.encode = function(e2) {
        for (var t2, r2, n, i, s, a, o, h2 = [], u = 0, l = e2.length, f = l, c2 = "string" !== d.getTypeOf(e2); u < e2.length; )
          f = l - u, n = c2 ? (t2 = e2[u++], r2 = u < l ? e2[u++] : 0, u < l ? e2[u++] : 0) : (t2 = e2.charCodeAt(u++), r2 = u < l ? e2.charCodeAt(u++) : 0, u < l ? e2.charCodeAt(u++) : 0), i = t2 >> 2, s = (3 & t2) << 4 | r2 >> 4, a = 1 < f ? (15 & r2) << 2 | n >> 6 : 64, o = 2 < f ? 63 & n : 64, h2.push(p2.charAt(i) + p2.charAt(s) + p2.charAt(a) + p2.charAt(o));
        return h2.join("");
      }, r.decode = function(e2) {
        var t2, r2, n, i, s, a, o = 0, h2 = 0, u = "data:";
        if (e2.substr(0, u.length) === u)
          throw new Error("Invalid base64 input, it looks like a data url.");
        var l, f = 3 * (e2 = e2.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
        if (e2.charAt(e2.length - 1) === p2.charAt(64) && f--, e2.charAt(e2.length - 2) === p2.charAt(64) && f--, f % 1 != 0)
          throw new Error("Invalid base64 input, bad content length.");
        for (l = c.uint8array ? new Uint8Array(0 | f) : new Array(0 | f); o < e2.length; )
          t2 = p2.indexOf(e2.charAt(o++)) << 2 | (i = p2.indexOf(e2.charAt(o++))) >> 4, r2 = (15 & i) << 4 | (s = p2.indexOf(e2.charAt(o++))) >> 2, n = (3 & s) << 6 | (a = p2.indexOf(e2.charAt(o++))), l[h2++] = t2, 64 !== s && (l[h2++] = r2), 64 !== a && (l[h2++] = n);
        return l;
      };
    }, { "./support": 30, "./utils": 32 }], 2: [function(e, t, r) {
      var n = e("./external"), i = e("./stream/DataWorker"), s = e("./stream/Crc32Probe"), a = e("./stream/DataLengthProbe");
      function o(e2, t2, r2, n2, i2) {
        this.compressedSize = e2, this.uncompressedSize = t2, this.crc32 = r2, this.compression = n2, this.compressedContent = i2;
      }
      o.prototype = { getContentWorker: function() {
        var e2 = new i(n.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new a("data_length")), t2 = this;
        return e2.on("end", function() {
          if (this.streamInfo.data_length !== t2.uncompressedSize)
            throw new Error("Bug : uncompressed data size mismatch");
        }), e2;
      }, getCompressedWorker: function() {
        return new i(n.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
      } }, o.createWorkerFrom = function(e2, t2, r2) {
        return e2.pipe(new s()).pipe(new a("uncompressedSize")).pipe(t2.compressWorker(r2)).pipe(new a("compressedSize")).withStreamInfo("compression", t2);
      }, t.exports = o;
    }, { "./external": 6, "./stream/Crc32Probe": 25, "./stream/DataLengthProbe": 26, "./stream/DataWorker": 27 }], 3: [function(e, t, r) {
      var n = e("./stream/GenericWorker");
      r.STORE = { magic: "\0\0", compressWorker: function() {
        return new n("STORE compression");
      }, uncompressWorker: function() {
        return new n("STORE decompression");
      } }, r.DEFLATE = e("./flate");
    }, { "./flate": 7, "./stream/GenericWorker": 28 }], 4: [function(e, t, r) {
      var n = e("./utils");
      var o = function() {
        for (var e2, t2 = [], r2 = 0; r2 < 256; r2++) {
          e2 = r2;
          for (var n2 = 0; n2 < 8; n2++)
            e2 = 1 & e2 ? 3988292384 ^ e2 >>> 1 : e2 >>> 1;
          t2[r2] = e2;
        }
        return t2;
      }();
      t.exports = function(e2, t2) {
        return void 0 !== e2 && e2.length ? "string" !== n.getTypeOf(e2) ? function(e3, t3, r2, n2) {
          var i = o, s = n2 + r2;
          e3 ^= -1;
          for (var a = n2; a < s; a++)
            e3 = e3 >>> 8 ^ i[255 & (e3 ^ t3[a])];
          return -1 ^ e3;
        }(0 | t2, e2, e2.length, 0) : function(e3, t3, r2, n2) {
          var i = o, s = n2 + r2;
          e3 ^= -1;
          for (var a = n2; a < s; a++)
            e3 = e3 >>> 8 ^ i[255 & (e3 ^ t3.charCodeAt(a))];
          return -1 ^ e3;
        }(0 | t2, e2, e2.length, 0) : 0;
      };
    }, { "./utils": 32 }], 5: [function(e, t, r) {
      r.base64 = false, r.binary = false, r.dir = false, r.createFolders = true, r.date = null, r.compression = null, r.compressionOptions = null, r.comment = null, r.unixPermissions = null, r.dosPermissions = null;
    }, {}], 6: [function(e, t, r) {
      var n = null;
      n = "undefined" != typeof Promise ? Promise : e("lie"), t.exports = { Promise: n };
    }, { lie: 37 }], 7: [function(e, t, r) {
      var n = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Uint32Array, i = e("pako"), s = e("./utils"), a = e("./stream/GenericWorker"), o = n ? "uint8array" : "array";
      function h2(e2, t2) {
        a.call(this, "FlateWorker/" + e2), this._pako = null, this._pakoAction = e2, this._pakoOptions = t2, this.meta = {};
      }
      r.magic = "\b\0", s.inherits(h2, a), h2.prototype.processChunk = function(e2) {
        this.meta = e2.meta, null === this._pako && this._createPako(), this._pako.push(s.transformTo(o, e2.data), false);
      }, h2.prototype.flush = function() {
        a.prototype.flush.call(this), null === this._pako && this._createPako(), this._pako.push([], true);
      }, h2.prototype.cleanUp = function() {
        a.prototype.cleanUp.call(this), this._pako = null;
      }, h2.prototype._createPako = function() {
        this._pako = new i[this._pakoAction]({ raw: true, level: this._pakoOptions.level || -1 });
        var t2 = this;
        this._pako.onData = function(e2) {
          t2.push({ data: e2, meta: t2.meta });
        };
      }, r.compressWorker = function(e2) {
        return new h2("Deflate", e2);
      }, r.uncompressWorker = function() {
        return new h2("Inflate", {});
      };
    }, { "./stream/GenericWorker": 28, "./utils": 32, pako: 38 }], 8: [function(e, t, r) {
      function A(e2, t2) {
        var r2, n2 = "";
        for (r2 = 0; r2 < t2; r2++)
          n2 += String.fromCharCode(255 & e2), e2 >>>= 8;
        return n2;
      }
      function n(e2, t2, r2, n2, i2, s2) {
        var a, o, h2 = e2.file, u = e2.compression, l = s2 !== O.utf8encode, f = I.transformTo("string", s2(h2.name)), c = I.transformTo("string", O.utf8encode(h2.name)), d = h2.comment, p2 = I.transformTo("string", s2(d)), m = I.transformTo("string", O.utf8encode(d)), _ = c.length !== h2.name.length, g = m.length !== d.length, b = "", v = "", y = "", w = h2.dir, k = h2.date, x = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
        t2 && !r2 || (x.crc32 = e2.crc32, x.compressedSize = e2.compressedSize, x.uncompressedSize = e2.uncompressedSize);
        var S2 = 0;
        t2 && (S2 |= 8), l || !_ && !g || (S2 |= 2048);
        var z = 0, C2 = 0;
        w && (z |= 16), "UNIX" === i2 ? (C2 = 798, z |= function(e3, t3) {
          var r3 = e3;
          return e3 || (r3 = t3 ? 16893 : 33204), (65535 & r3) << 16;
        }(h2.unixPermissions, w)) : (C2 = 20, z |= function(e3) {
          return 63 & (e3 || 0);
        }(h2.dosPermissions)), a = k.getUTCHours(), a <<= 6, a |= k.getUTCMinutes(), a <<= 5, a |= k.getUTCSeconds() / 2, o = k.getUTCFullYear() - 1980, o <<= 4, o |= k.getUTCMonth() + 1, o <<= 5, o |= k.getUTCDate(), _ && (v = A(1, 1) + A(B(f), 4) + c, b += "up" + A(v.length, 2) + v), g && (y = A(1, 1) + A(B(p2), 4) + m, b += "uc" + A(y.length, 2) + y);
        var E = "";
        return E += "\n\0", E += A(S2, 2), E += u.magic, E += A(a, 2), E += A(o, 2), E += A(x.crc32, 4), E += A(x.compressedSize, 4), E += A(x.uncompressedSize, 4), E += A(f.length, 2), E += A(b.length, 2), { fileRecord: R2.LOCAL_FILE_HEADER + E + f + b, dirRecord: R2.CENTRAL_FILE_HEADER + A(C2, 2) + E + A(p2.length, 2) + "\0\0\0\0" + A(z, 4) + A(n2, 4) + f + b + p2 };
      }
      var I = e("../utils"), i = e("../stream/GenericWorker"), O = e("../utf8"), B = e("../crc32"), R2 = e("../signature");
      function s(e2, t2, r2, n2) {
        i.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = t2, this.zipPlatform = r2, this.encodeFileName = n2, this.streamFiles = e2, this.accumulate = false, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
      }
      I.inherits(s, i), s.prototype.push = function(e2) {
        var t2 = e2.meta.percent || 0, r2 = this.entriesCount, n2 = this._sources.length;
        this.accumulate ? this.contentBuffer.push(e2) : (this.bytesWritten += e2.data.length, i.prototype.push.call(this, { data: e2.data, meta: { currentFile: this.currentFile, percent: r2 ? (t2 + 100 * (r2 - n2 - 1)) / r2 : 100 } }));
      }, s.prototype.openedSource = function(e2) {
        this.currentSourceOffset = this.bytesWritten, this.currentFile = e2.file.name;
        var t2 = this.streamFiles && !e2.file.dir;
        if (t2) {
          var r2 = n(e2, t2, false, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
          this.push({ data: r2.fileRecord, meta: { percent: 0 } });
        } else
          this.accumulate = true;
      }, s.prototype.closedSource = function(e2) {
        this.accumulate = false;
        var t2 = this.streamFiles && !e2.file.dir, r2 = n(e2, t2, true, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
        if (this.dirRecords.push(r2.dirRecord), t2)
          this.push({ data: function(e3) {
            return R2.DATA_DESCRIPTOR + A(e3.crc32, 4) + A(e3.compressedSize, 4) + A(e3.uncompressedSize, 4);
          }(e2), meta: { percent: 100 } });
        else
          for (this.push({ data: r2.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length; )
            this.push(this.contentBuffer.shift());
        this.currentFile = null;
      }, s.prototype.flush = function() {
        for (var e2 = this.bytesWritten, t2 = 0; t2 < this.dirRecords.length; t2++)
          this.push({ data: this.dirRecords[t2], meta: { percent: 100 } });
        var r2 = this.bytesWritten - e2, n2 = function(e3, t3, r3, n3, i2) {
          var s2 = I.transformTo("string", i2(n3));
          return R2.CENTRAL_DIRECTORY_END + "\0\0\0\0" + A(e3, 2) + A(e3, 2) + A(t3, 4) + A(r3, 4) + A(s2.length, 2) + s2;
        }(this.dirRecords.length, r2, e2, this.zipComment, this.encodeFileName);
        this.push({ data: n2, meta: { percent: 100 } });
      }, s.prototype.prepareNextSource = function() {
        this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
      }, s.prototype.registerPrevious = function(e2) {
        this._sources.push(e2);
        var t2 = this;
        return e2.on("data", function(e3) {
          t2.processChunk(e3);
        }), e2.on("end", function() {
          t2.closedSource(t2.previous.streamInfo), t2._sources.length ? t2.prepareNextSource() : t2.end();
        }), e2.on("error", function(e3) {
          t2.error(e3);
        }), this;
      }, s.prototype.resume = function() {
        return !!i.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), true) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), true));
      }, s.prototype.error = function(e2) {
        var t2 = this._sources;
        if (!i.prototype.error.call(this, e2))
          return false;
        for (var r2 = 0; r2 < t2.length; r2++)
          try {
            t2[r2].error(e2);
          } catch (e3) {
          }
        return true;
      }, s.prototype.lock = function() {
        i.prototype.lock.call(this);
        for (var e2 = this._sources, t2 = 0; t2 < e2.length; t2++)
          e2[t2].lock();
      }, t.exports = s;
    }, { "../crc32": 4, "../signature": 23, "../stream/GenericWorker": 28, "../utf8": 31, "../utils": 32 }], 9: [function(e, t, r) {
      var u = e("../compressions"), n = e("./ZipFileWorker");
      r.generateWorker = function(e2, a, t2) {
        var o = new n(a.streamFiles, t2, a.platform, a.encodeFileName), h2 = 0;
        try {
          e2.forEach(function(e3, t3) {
            h2++;
            var r2 = function(e4, t4) {
              var r3 = e4 || t4, n3 = u[r3];
              if (!n3)
                throw new Error(r3 + " is not a valid compression method !");
              return n3;
            }(t3.options.compression, a.compression), n2 = t3.options.compressionOptions || a.compressionOptions || {}, i = t3.dir, s = t3.date;
            t3._compressWorker(r2, n2).withStreamInfo("file", { name: e3, dir: i, date: s, comment: t3.comment || "", unixPermissions: t3.unixPermissions, dosPermissions: t3.dosPermissions }).pipe(o);
          }), o.entriesCount = h2;
        } catch (e3) {
          o.error(e3);
        }
        return o;
      };
    }, { "../compressions": 3, "./ZipFileWorker": 8 }], 10: [function(e, t, r) {
      function n() {
        if (!(this instanceof n))
          return new n();
        if (arguments.length)
          throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
        this.files = /* @__PURE__ */ Object.create(null), this.comment = null, this.root = "", this.clone = function() {
          var e2 = new n();
          for (var t2 in this)
            "function" != typeof this[t2] && (e2[t2] = this[t2]);
          return e2;
        };
      }
      (n.prototype = e("./object")).loadAsync = e("./load"), n.support = e("./support"), n.defaults = e("./defaults"), n.version = "3.10.1", n.loadAsync = function(e2, t2) {
        return new n().loadAsync(e2, t2);
      }, n.external = e("./external"), t.exports = n;
    }, { "./defaults": 5, "./external": 6, "./load": 11, "./object": 15, "./support": 30 }], 11: [function(e, t, r) {
      var u = e("./utils"), i = e("./external"), n = e("./utf8"), s = e("./zipEntries"), a = e("./stream/Crc32Probe"), l = e("./nodejsUtils");
      function f(n2) {
        return new i.Promise(function(e2, t2) {
          var r2 = n2.decompressed.getContentWorker().pipe(new a());
          r2.on("error", function(e3) {
            t2(e3);
          }).on("end", function() {
            r2.streamInfo.crc32 !== n2.decompressed.crc32 ? t2(new Error("Corrupted zip : CRC32 mismatch")) : e2();
          }).resume();
        });
      }
      t.exports = function(e2, o) {
        var h2 = this;
        return o = u.extend(o || {}, { base64: false, checkCRC32: false, optimizedBinaryString: false, createFolders: false, decodeFileName: n.utf8decode }), l.isNode && l.isStream(e2) ? i.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : u.prepareContent("the loaded zip file", e2, true, o.optimizedBinaryString, o.base64).then(function(e3) {
          var t2 = new s(o);
          return t2.load(e3), t2;
        }).then(function(e3) {
          var t2 = [i.Promise.resolve(e3)], r2 = e3.files;
          if (o.checkCRC32)
            for (var n2 = 0; n2 < r2.length; n2++)
              t2.push(f(r2[n2]));
          return i.Promise.all(t2);
        }).then(function(e3) {
          for (var t2 = e3.shift(), r2 = t2.files, n2 = 0; n2 < r2.length; n2++) {
            var i2 = r2[n2], s2 = i2.fileNameStr, a2 = u.resolve(i2.fileNameStr);
            h2.file(a2, i2.decompressed, { binary: true, optimizedBinaryString: true, date: i2.date, dir: i2.dir, comment: i2.fileCommentStr.length ? i2.fileCommentStr : null, unixPermissions: i2.unixPermissions, dosPermissions: i2.dosPermissions, createFolders: o.createFolders }), i2.dir || (h2.file(a2).unsafeOriginalName = s2);
          }
          return t2.zipComment.length && (h2.comment = t2.zipComment), h2;
        });
      };
    }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function(e, t, r) {
      var n = e("../utils"), i = e("../stream/GenericWorker");
      function s(e2, t2) {
        i.call(this, "Nodejs stream input adapter for " + e2), this._upstreamEnded = false, this._bindStream(t2);
      }
      n.inherits(s, i), s.prototype._bindStream = function(e2) {
        var t2 = this;
        (this._stream = e2).pause(), e2.on("data", function(e3) {
          t2.push({ data: e3, meta: { percent: 0 } });
        }).on("error", function(e3) {
          t2.isPaused ? this.generatedError = e3 : t2.error(e3);
        }).on("end", function() {
          t2.isPaused ? t2._upstreamEnded = true : t2.end();
        });
      }, s.prototype.pause = function() {
        return !!i.prototype.pause.call(this) && (this._stream.pause(), true);
      }, s.prototype.resume = function() {
        return !!i.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), true);
      }, t.exports = s;
    }, { "../stream/GenericWorker": 28, "../utils": 32 }], 13: [function(e, t, r) {
      var i = e("readable-stream").Readable;
      function n(e2, t2, r2) {
        i.call(this, t2), this._helper = e2;
        var n2 = this;
        e2.on("data", function(e3, t3) {
          n2.push(e3) || n2._helper.pause(), r2 && r2(t3);
        }).on("error", function(e3) {
          n2.emit("error", e3);
        }).on("end", function() {
          n2.push(null);
        });
      }
      e("../utils").inherits(n, i), n.prototype._read = function() {
        this._helper.resume();
      }, t.exports = n;
    }, { "../utils": 32, "readable-stream": 16 }], 14: [function(e, t, r) {
      t.exports = { isNode: "undefined" != typeof Buffer, newBufferFrom: function(e2, t2) {
        if (Buffer.from && Buffer.from !== Uint8Array.from)
          return Buffer.from(e2, t2);
        if ("number" == typeof e2)
          throw new Error('The "data" argument must not be a number');
        return new Buffer(e2, t2);
      }, allocBuffer: function(e2) {
        if (Buffer.alloc)
          return Buffer.alloc(e2);
        var t2 = new Buffer(e2);
        return t2.fill(0), t2;
      }, isBuffer: function(e2) {
        return Buffer.isBuffer(e2);
      }, isStream: function(e2) {
        return e2 && "function" == typeof e2.on && "function" == typeof e2.pause && "function" == typeof e2.resume;
      } };
    }, {}], 15: [function(e, t, r) {
      function s(e2, t2, r2) {
        var n2, i2 = u.getTypeOf(t2), s2 = u.extend(r2 || {}, f);
        s2.date = s2.date || /* @__PURE__ */ new Date(), null !== s2.compression && (s2.compression = s2.compression.toUpperCase()), "string" == typeof s2.unixPermissions && (s2.unixPermissions = parseInt(s2.unixPermissions, 8)), s2.unixPermissions && 16384 & s2.unixPermissions && (s2.dir = true), s2.dosPermissions && 16 & s2.dosPermissions && (s2.dir = true), s2.dir && (e2 = g(e2)), s2.createFolders && (n2 = _(e2)) && b.call(this, n2, true);
        var a2 = "string" === i2 && false === s2.binary && false === s2.base64;
        r2 && void 0 !== r2.binary || (s2.binary = !a2), (t2 instanceof c && 0 === t2.uncompressedSize || s2.dir || !t2 || 0 === t2.length) && (s2.base64 = false, s2.binary = true, t2 = "", s2.compression = "STORE", i2 = "string");
        var o2 = null;
        o2 = t2 instanceof c || t2 instanceof l ? t2 : p2.isNode && p2.isStream(t2) ? new m(e2, t2) : u.prepareContent(e2, t2, s2.binary, s2.optimizedBinaryString, s2.base64);
        var h3 = new d(e2, o2, s2);
        this.files[e2] = h3;
      }
      var i = e("./utf8"), u = e("./utils"), l = e("./stream/GenericWorker"), a = e("./stream/StreamHelper"), f = e("./defaults"), c = e("./compressedObject"), d = e("./zipObject"), o = e("./generate"), p2 = e("./nodejsUtils"), m = e("./nodejs/NodejsStreamInputAdapter"), _ = function(e2) {
        "/" === e2.slice(-1) && (e2 = e2.substring(0, e2.length - 1));
        var t2 = e2.lastIndexOf("/");
        return 0 < t2 ? e2.substring(0, t2) : "";
      }, g = function(e2) {
        return "/" !== e2.slice(-1) && (e2 += "/"), e2;
      }, b = function(e2, t2) {
        return t2 = void 0 !== t2 ? t2 : f.createFolders, e2 = g(e2), this.files[e2] || s.call(this, e2, null, { dir: true, createFolders: t2 }), this.files[e2];
      };
      function h2(e2) {
        return "[object RegExp]" === Object.prototype.toString.call(e2);
      }
      var n = { load: function() {
        throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
      }, forEach: function(e2) {
        var t2, r2, n2;
        for (t2 in this.files)
          n2 = this.files[t2], (r2 = t2.slice(this.root.length, t2.length)) && t2.slice(0, this.root.length) === this.root && e2(r2, n2);
      }, filter: function(r2) {
        var n2 = [];
        return this.forEach(function(e2, t2) {
          r2(e2, t2) && n2.push(t2);
        }), n2;
      }, file: function(e2, t2, r2) {
        if (1 !== arguments.length)
          return e2 = this.root + e2, s.call(this, e2, t2, r2), this;
        if (h2(e2)) {
          var n2 = e2;
          return this.filter(function(e3, t3) {
            return !t3.dir && n2.test(e3);
          });
        }
        var i2 = this.files[this.root + e2];
        return i2 && !i2.dir ? i2 : null;
      }, folder: function(r2) {
        if (!r2)
          return this;
        if (h2(r2))
          return this.filter(function(e3, t3) {
            return t3.dir && r2.test(e3);
          });
        var e2 = this.root + r2, t2 = b.call(this, e2), n2 = this.clone();
        return n2.root = t2.name, n2;
      }, remove: function(r2) {
        r2 = this.root + r2;
        var e2 = this.files[r2];
        if (e2 || ("/" !== r2.slice(-1) && (r2 += "/"), e2 = this.files[r2]), e2 && !e2.dir)
          delete this.files[r2];
        else
          for (var t2 = this.filter(function(e3, t3) {
            return t3.name.slice(0, r2.length) === r2;
          }), n2 = 0; n2 < t2.length; n2++)
            delete this.files[t2[n2].name];
        return this;
      }, generate: function() {
        throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
      }, generateInternalStream: function(e2) {
        var t2, r2 = {};
        try {
          if ((r2 = u.extend(e2 || {}, { streamFiles: false, compression: "STORE", compressionOptions: null, type: "", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: i.utf8encode })).type = r2.type.toLowerCase(), r2.compression = r2.compression.toUpperCase(), "binarystring" === r2.type && (r2.type = "string"), !r2.type)
            throw new Error("No output type specified.");
          u.checkSupport(r2.type), "darwin" !== r2.platform && "freebsd" !== r2.platform && "linux" !== r2.platform && "sunos" !== r2.platform || (r2.platform = "UNIX"), "win32" === r2.platform && (r2.platform = "DOS");
          var n2 = r2.comment || this.comment || "";
          t2 = o.generateWorker(this, r2, n2);
        } catch (e3) {
          (t2 = new l("error")).error(e3);
        }
        return new a(t2, r2.type || "string", r2.mimeType);
      }, generateAsync: function(e2, t2) {
        return this.generateInternalStream(e2).accumulate(t2);
      }, generateNodeStream: function(e2, t2) {
        return (e2 = e2 || {}).type || (e2.type = "nodebuffer"), this.generateInternalStream(e2).toNodejsStream(t2);
      } };
      t.exports = n;
    }, { "./compressedObject": 2, "./defaults": 5, "./generate": 9, "./nodejs/NodejsStreamInputAdapter": 12, "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31, "./utils": 32, "./zipObject": 35 }], 16: [function(e, t, r) {
      t.exports = e("stream");
    }, { stream: void 0 }], 17: [function(e, t, r) {
      var n = e("./DataReader");
      function i(e2) {
        n.call(this, e2);
        for (var t2 = 0; t2 < this.data.length; t2++)
          e2[t2] = 255 & e2[t2];
      }
      e("../utils").inherits(i, n), i.prototype.byteAt = function(e2) {
        return this.data[this.zero + e2];
      }, i.prototype.lastIndexOfSignature = function(e2) {
        for (var t2 = e2.charCodeAt(0), r2 = e2.charCodeAt(1), n2 = e2.charCodeAt(2), i2 = e2.charCodeAt(3), s = this.length - 4; 0 <= s; --s)
          if (this.data[s] === t2 && this.data[s + 1] === r2 && this.data[s + 2] === n2 && this.data[s + 3] === i2)
            return s - this.zero;
        return -1;
      }, i.prototype.readAndCheckSignature = function(e2) {
        var t2 = e2.charCodeAt(0), r2 = e2.charCodeAt(1), n2 = e2.charCodeAt(2), i2 = e2.charCodeAt(3), s = this.readData(4);
        return t2 === s[0] && r2 === s[1] && n2 === s[2] && i2 === s[3];
      }, i.prototype.readData = function(e2) {
        if (this.checkOffset(e2), 0 === e2)
          return [];
        var t2 = this.data.slice(this.zero + this.index, this.zero + this.index + e2);
        return this.index += e2, t2;
      }, t.exports = i;
    }, { "../utils": 32, "./DataReader": 18 }], 18: [function(e, t, r) {
      var n = e("../utils");
      function i(e2) {
        this.data = e2, this.length = e2.length, this.index = 0, this.zero = 0;
      }
      i.prototype = { checkOffset: function(e2) {
        this.checkIndex(this.index + e2);
      }, checkIndex: function(e2) {
        if (this.length < this.zero + e2 || e2 < 0)
          throw new Error("End of data reached (data length = " + this.length + ", asked index = " + e2 + "). Corrupted zip ?");
      }, setIndex: function(e2) {
        this.checkIndex(e2), this.index = e2;
      }, skip: function(e2) {
        this.setIndex(this.index + e2);
      }, byteAt: function() {
      }, readInt: function(e2) {
        var t2, r2 = 0;
        for (this.checkOffset(e2), t2 = this.index + e2 - 1; t2 >= this.index; t2--)
          r2 = (r2 << 8) + this.byteAt(t2);
        return this.index += e2, r2;
      }, readString: function(e2) {
        return n.transformTo("string", this.readData(e2));
      }, readData: function() {
      }, lastIndexOfSignature: function() {
      }, readAndCheckSignature: function() {
      }, readDate: function() {
        var e2 = this.readInt(4);
        return new Date(Date.UTC(1980 + (e2 >> 25 & 127), (e2 >> 21 & 15) - 1, e2 >> 16 & 31, e2 >> 11 & 31, e2 >> 5 & 63, (31 & e2) << 1));
      } }, t.exports = i;
    }, { "../utils": 32 }], 19: [function(e, t, r) {
      var n = e("./Uint8ArrayReader");
      function i(e2) {
        n.call(this, e2);
      }
      e("../utils").inherits(i, n), i.prototype.readData = function(e2) {
        this.checkOffset(e2);
        var t2 = this.data.slice(this.zero + this.index, this.zero + this.index + e2);
        return this.index += e2, t2;
      }, t.exports = i;
    }, { "../utils": 32, "./Uint8ArrayReader": 21 }], 20: [function(e, t, r) {
      var n = e("./DataReader");
      function i(e2) {
        n.call(this, e2);
      }
      e("../utils").inherits(i, n), i.prototype.byteAt = function(e2) {
        return this.data.charCodeAt(this.zero + e2);
      }, i.prototype.lastIndexOfSignature = function(e2) {
        return this.data.lastIndexOf(e2) - this.zero;
      }, i.prototype.readAndCheckSignature = function(e2) {
        return e2 === this.readData(4);
      }, i.prototype.readData = function(e2) {
        this.checkOffset(e2);
        var t2 = this.data.slice(this.zero + this.index, this.zero + this.index + e2);
        return this.index += e2, t2;
      }, t.exports = i;
    }, { "../utils": 32, "./DataReader": 18 }], 21: [function(e, t, r) {
      var n = e("./ArrayReader");
      function i(e2) {
        n.call(this, e2);
      }
      e("../utils").inherits(i, n), i.prototype.readData = function(e2) {
        if (this.checkOffset(e2), 0 === e2)
          return new Uint8Array(0);
        var t2 = this.data.subarray(this.zero + this.index, this.zero + this.index + e2);
        return this.index += e2, t2;
      }, t.exports = i;
    }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function(e, t, r) {
      var n = e("../utils"), i = e("../support"), s = e("./ArrayReader"), a = e("./StringReader"), o = e("./NodeBufferReader"), h2 = e("./Uint8ArrayReader");
      t.exports = function(e2) {
        var t2 = n.getTypeOf(e2);
        return n.checkSupport(t2), "string" !== t2 || i.uint8array ? "nodebuffer" === t2 ? new o(e2) : i.uint8array ? new h2(n.transformTo("uint8array", e2)) : new s(n.transformTo("array", e2)) : new a(e2);
      };
    }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function(e, t, r) {
      r.LOCAL_FILE_HEADER = "PK", r.CENTRAL_FILE_HEADER = "PK", r.CENTRAL_DIRECTORY_END = "PK", r.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", r.ZIP64_CENTRAL_DIRECTORY_END = "PK", r.DATA_DESCRIPTOR = "PK\x07\b";
    }, {}], 24: [function(e, t, r) {
      var n = e("./GenericWorker"), i = e("../utils");
      function s(e2) {
        n.call(this, "ConvertWorker to " + e2), this.destType = e2;
      }
      i.inherits(s, n), s.prototype.processChunk = function(e2) {
        this.push({ data: i.transformTo(this.destType, e2.data), meta: e2.meta });
      }, t.exports = s;
    }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function(e, t, r) {
      var n = e("./GenericWorker"), i = e("../crc32");
      function s() {
        n.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
      }
      e("../utils").inherits(s, n), s.prototype.processChunk = function(e2) {
        this.streamInfo.crc32 = i(e2.data, this.streamInfo.crc32 || 0), this.push(e2);
      }, t.exports = s;
    }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function(e, t, r) {
      var n = e("../utils"), i = e("./GenericWorker");
      function s(e2) {
        i.call(this, "DataLengthProbe for " + e2), this.propName = e2, this.withStreamInfo(e2, 0);
      }
      n.inherits(s, i), s.prototype.processChunk = function(e2) {
        if (e2) {
          var t2 = this.streamInfo[this.propName] || 0;
          this.streamInfo[this.propName] = t2 + e2.data.length;
        }
        i.prototype.processChunk.call(this, e2);
      }, t.exports = s;
    }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function(e, t, r) {
      var n = e("../utils"), i = e("./GenericWorker");
      function s(e2) {
        i.call(this, "DataWorker");
        var t2 = this;
        this.dataIsReady = false, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = false, e2.then(function(e3) {
          t2.dataIsReady = true, t2.data = e3, t2.max = e3 && e3.length || 0, t2.type = n.getTypeOf(e3), t2.isPaused || t2._tickAndRepeat();
        }, function(e3) {
          t2.error(e3);
        });
      }
      n.inherits(s, i), s.prototype.cleanUp = function() {
        i.prototype.cleanUp.call(this), this.data = null;
      }, s.prototype.resume = function() {
        return !!i.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = true, n.delay(this._tickAndRepeat, [], this)), true);
      }, s.prototype._tickAndRepeat = function() {
        this._tickScheduled = false, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (n.delay(this._tickAndRepeat, [], this), this._tickScheduled = true));
      }, s.prototype._tick = function() {
        if (this.isPaused || this.isFinished)
          return false;
        var e2 = null, t2 = Math.min(this.max, this.index + 16384);
        if (this.index >= this.max)
          return this.end();
        switch (this.type) {
          case "string":
            e2 = this.data.substring(this.index, t2);
            break;
          case "uint8array":
            e2 = this.data.subarray(this.index, t2);
            break;
          case "array":
          case "nodebuffer":
            e2 = this.data.slice(this.index, t2);
        }
        return this.index = t2, this.push({ data: e2, meta: { percent: this.max ? this.index / this.max * 100 : 0 } });
      }, t.exports = s;
    }, { "../utils": 32, "./GenericWorker": 28 }], 28: [function(e, t, r) {
      function n(e2) {
        this.name = e2 || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = true, this.isFinished = false, this.isLocked = false, this._listeners = { data: [], end: [], error: [] }, this.previous = null;
      }
      n.prototype = { push: function(e2) {
        this.emit("data", e2);
      }, end: function() {
        if (this.isFinished)
          return false;
        this.flush();
        try {
          this.emit("end"), this.cleanUp(), this.isFinished = true;
        } catch (e2) {
          this.emit("error", e2);
        }
        return true;
      }, error: function(e2) {
        return !this.isFinished && (this.isPaused ? this.generatedError = e2 : (this.isFinished = true, this.emit("error", e2), this.previous && this.previous.error(e2), this.cleanUp()), true);
      }, on: function(e2, t2) {
        return this._listeners[e2].push(t2), this;
      }, cleanUp: function() {
        this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
      }, emit: function(e2, t2) {
        if (this._listeners[e2])
          for (var r2 = 0; r2 < this._listeners[e2].length; r2++)
            this._listeners[e2][r2].call(this, t2);
      }, pipe: function(e2) {
        return e2.registerPrevious(this);
      }, registerPrevious: function(e2) {
        if (this.isLocked)
          throw new Error("The stream '" + this + "' has already been used.");
        this.streamInfo = e2.streamInfo, this.mergeStreamInfo(), this.previous = e2;
        var t2 = this;
        return e2.on("data", function(e3) {
          t2.processChunk(e3);
        }), e2.on("end", function() {
          t2.end();
        }), e2.on("error", function(e3) {
          t2.error(e3);
        }), this;
      }, pause: function() {
        return !this.isPaused && !this.isFinished && (this.isPaused = true, this.previous && this.previous.pause(), true);
      }, resume: function() {
        if (!this.isPaused || this.isFinished)
          return false;
        var e2 = this.isPaused = false;
        return this.generatedError && (this.error(this.generatedError), e2 = true), this.previous && this.previous.resume(), !e2;
      }, flush: function() {
      }, processChunk: function(e2) {
        this.push(e2);
      }, withStreamInfo: function(e2, t2) {
        return this.extraStreamInfo[e2] = t2, this.mergeStreamInfo(), this;
      }, mergeStreamInfo: function() {
        for (var e2 in this.extraStreamInfo)
          Object.prototype.hasOwnProperty.call(this.extraStreamInfo, e2) && (this.streamInfo[e2] = this.extraStreamInfo[e2]);
      }, lock: function() {
        if (this.isLocked)
          throw new Error("The stream '" + this + "' has already been used.");
        this.isLocked = true, this.previous && this.previous.lock();
      }, toString: function() {
        var e2 = "Worker " + this.name;
        return this.previous ? this.previous + " -> " + e2 : e2;
      } }, t.exports = n;
    }, {}], 29: [function(e, t, r) {
      var h2 = e("../utils"), i = e("./ConvertWorker"), s = e("./GenericWorker"), u = e("../base64"), n = e("../support"), a = e("../external"), o = null;
      if (n.nodestream)
        try {
          o = e("../nodejs/NodejsStreamOutputAdapter");
        } catch (e2) {
        }
      function l(e2, o2) {
        return new a.Promise(function(t2, r2) {
          var n2 = [], i2 = e2._internalType, s2 = e2._outputType, a2 = e2._mimeType;
          e2.on("data", function(e3, t3) {
            n2.push(e3), o2 && o2(t3);
          }).on("error", function(e3) {
            n2 = [], r2(e3);
          }).on("end", function() {
            try {
              var e3 = function(e4, t3, r3) {
                switch (e4) {
                  case "blob":
                    return h2.newBlob(h2.transformTo("arraybuffer", t3), r3);
                  case "base64":
                    return u.encode(t3);
                  default:
                    return h2.transformTo(e4, t3);
                }
              }(s2, function(e4, t3) {
                var r3, n3 = 0, i3 = null, s3 = 0;
                for (r3 = 0; r3 < t3.length; r3++)
                  s3 += t3[r3].length;
                switch (e4) {
                  case "string":
                    return t3.join("");
                  case "array":
                    return Array.prototype.concat.apply([], t3);
                  case "uint8array":
                    for (i3 = new Uint8Array(s3), r3 = 0; r3 < t3.length; r3++)
                      i3.set(t3[r3], n3), n3 += t3[r3].length;
                    return i3;
                  case "nodebuffer":
                    return Buffer.concat(t3);
                  default:
                    throw new Error("concat : unsupported type '" + e4 + "'");
                }
              }(i2, n2), a2);
              t2(e3);
            } catch (e4) {
              r2(e4);
            }
            n2 = [];
          }).resume();
        });
      }
      function f(e2, t2, r2) {
        var n2 = t2;
        switch (t2) {
          case "blob":
          case "arraybuffer":
            n2 = "uint8array";
            break;
          case "base64":
            n2 = "string";
        }
        try {
          this._internalType = n2, this._outputType = t2, this._mimeType = r2, h2.checkSupport(n2), this._worker = e2.pipe(new i(n2)), e2.lock();
        } catch (e3) {
          this._worker = new s("error"), this._worker.error(e3);
        }
      }
      f.prototype = { accumulate: function(e2) {
        return l(this, e2);
      }, on: function(e2, t2) {
        var r2 = this;
        return "data" === e2 ? this._worker.on(e2, function(e3) {
          t2.call(r2, e3.data, e3.meta);
        }) : this._worker.on(e2, function() {
          h2.delay(t2, arguments, r2);
        }), this;
      }, resume: function() {
        return h2.delay(this._worker.resume, [], this._worker), this;
      }, pause: function() {
        return this._worker.pause(), this;
      }, toNodejsStream: function(e2) {
        if (h2.checkSupport("nodestream"), "nodebuffer" !== this._outputType)
          throw new Error(this._outputType + " is not supported by this method");
        return new o(this, { objectMode: "nodebuffer" !== this._outputType }, e2);
      } }, t.exports = f;
    }, { "../base64": 1, "../external": 6, "../nodejs/NodejsStreamOutputAdapter": 13, "../support": 30, "../utils": 32, "./ConvertWorker": 24, "./GenericWorker": 28 }], 30: [function(e, t, r) {
      if (r.base64 = true, r.array = true, r.string = true, r.arraybuffer = "undefined" != typeof ArrayBuffer && "undefined" != typeof Uint8Array, r.nodebuffer = "undefined" != typeof Buffer, r.uint8array = "undefined" != typeof Uint8Array, "undefined" == typeof ArrayBuffer)
        r.blob = false;
      else {
        var n = new ArrayBuffer(0);
        try {
          r.blob = 0 === new Blob([n], { type: "application/zip" }).size;
        } catch (e2) {
          try {
            var i = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
            i.append(n), r.blob = 0 === i.getBlob("application/zip").size;
          } catch (e3) {
            r.blob = false;
          }
        }
      }
      try {
        r.nodestream = !!e("readable-stream").Readable;
      } catch (e2) {
        r.nodestream = false;
      }
    }, { "readable-stream": 16 }], 31: [function(e, t, s) {
      for (var o = e("./utils"), h2 = e("./support"), r = e("./nodejsUtils"), n = e("./stream/GenericWorker"), u = new Array(256), i = 0; i < 256; i++)
        u[i] = 252 <= i ? 6 : 248 <= i ? 5 : 240 <= i ? 4 : 224 <= i ? 3 : 192 <= i ? 2 : 1;
      u[254] = u[254] = 1;
      function a() {
        n.call(this, "utf-8 decode"), this.leftOver = null;
      }
      function l() {
        n.call(this, "utf-8 encode");
      }
      s.utf8encode = function(e2) {
        return h2.nodebuffer ? r.newBufferFrom(e2, "utf-8") : function(e3) {
          var t2, r2, n2, i2, s2, a2 = e3.length, o2 = 0;
          for (i2 = 0; i2 < a2; i2++)
            55296 == (64512 & (r2 = e3.charCodeAt(i2))) && i2 + 1 < a2 && 56320 == (64512 & (n2 = e3.charCodeAt(i2 + 1))) && (r2 = 65536 + (r2 - 55296 << 10) + (n2 - 56320), i2++), o2 += r2 < 128 ? 1 : r2 < 2048 ? 2 : r2 < 65536 ? 3 : 4;
          for (t2 = h2.uint8array ? new Uint8Array(o2) : new Array(o2), i2 = s2 = 0; s2 < o2; i2++)
            55296 == (64512 & (r2 = e3.charCodeAt(i2))) && i2 + 1 < a2 && 56320 == (64512 & (n2 = e3.charCodeAt(i2 + 1))) && (r2 = 65536 + (r2 - 55296 << 10) + (n2 - 56320), i2++), r2 < 128 ? t2[s2++] = r2 : (r2 < 2048 ? t2[s2++] = 192 | r2 >>> 6 : (r2 < 65536 ? t2[s2++] = 224 | r2 >>> 12 : (t2[s2++] = 240 | r2 >>> 18, t2[s2++] = 128 | r2 >>> 12 & 63), t2[s2++] = 128 | r2 >>> 6 & 63), t2[s2++] = 128 | 63 & r2);
          return t2;
        }(e2);
      }, s.utf8decode = function(e2) {
        return h2.nodebuffer ? o.transformTo("nodebuffer", e2).toString("utf-8") : function(e3) {
          var t2, r2, n2, i2, s2 = e3.length, a2 = new Array(2 * s2);
          for (t2 = r2 = 0; t2 < s2; )
            if ((n2 = e3[t2++]) < 128)
              a2[r2++] = n2;
            else if (4 < (i2 = u[n2]))
              a2[r2++] = 65533, t2 += i2 - 1;
            else {
              for (n2 &= 2 === i2 ? 31 : 3 === i2 ? 15 : 7; 1 < i2 && t2 < s2; )
                n2 = n2 << 6 | 63 & e3[t2++], i2--;
              1 < i2 ? a2[r2++] = 65533 : n2 < 65536 ? a2[r2++] = n2 : (n2 -= 65536, a2[r2++] = 55296 | n2 >> 10 & 1023, a2[r2++] = 56320 | 1023 & n2);
            }
          return a2.length !== r2 && (a2.subarray ? a2 = a2.subarray(0, r2) : a2.length = r2), o.applyFromCharCode(a2);
        }(e2 = o.transformTo(h2.uint8array ? "uint8array" : "array", e2));
      }, o.inherits(a, n), a.prototype.processChunk = function(e2) {
        var t2 = o.transformTo(h2.uint8array ? "uint8array" : "array", e2.data);
        if (this.leftOver && this.leftOver.length) {
          if (h2.uint8array) {
            var r2 = t2;
            (t2 = new Uint8Array(r2.length + this.leftOver.length)).set(this.leftOver, 0), t2.set(r2, this.leftOver.length);
          } else
            t2 = this.leftOver.concat(t2);
          this.leftOver = null;
        }
        var n2 = function(e3, t3) {
          var r3;
          for ((t3 = t3 || e3.length) > e3.length && (t3 = e3.length), r3 = t3 - 1; 0 <= r3 && 128 == (192 & e3[r3]); )
            r3--;
          return r3 < 0 ? t3 : 0 === r3 ? t3 : r3 + u[e3[r3]] > t3 ? r3 : t3;
        }(t2), i2 = t2;
        n2 !== t2.length && (h2.uint8array ? (i2 = t2.subarray(0, n2), this.leftOver = t2.subarray(n2, t2.length)) : (i2 = t2.slice(0, n2), this.leftOver = t2.slice(n2, t2.length))), this.push({ data: s.utf8decode(i2), meta: e2.meta });
      }, a.prototype.flush = function() {
        this.leftOver && this.leftOver.length && (this.push({ data: s.utf8decode(this.leftOver), meta: {} }), this.leftOver = null);
      }, s.Utf8DecodeWorker = a, o.inherits(l, n), l.prototype.processChunk = function(e2) {
        this.push({ data: s.utf8encode(e2.data), meta: e2.meta });
      }, s.Utf8EncodeWorker = l;
    }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function(e, t, a) {
      var o = e("./support"), h2 = e("./base64"), r = e("./nodejsUtils"), u = e("./external");
      function n(e2) {
        return e2;
      }
      function l(e2, t2) {
        for (var r2 = 0; r2 < e2.length; ++r2)
          t2[r2] = 255 & e2.charCodeAt(r2);
        return t2;
      }
      e("setimmediate"), a.newBlob = function(t2, r2) {
        a.checkSupport("blob");
        try {
          return new Blob([t2], { type: r2 });
        } catch (e2) {
          try {
            var n2 = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
            return n2.append(t2), n2.getBlob(r2);
          } catch (e3) {
            throw new Error("Bug : can't construct the Blob.");
          }
        }
      };
      var i = { stringifyByChunk: function(e2, t2, r2) {
        var n2 = [], i2 = 0, s2 = e2.length;
        if (s2 <= r2)
          return String.fromCharCode.apply(null, e2);
        for (; i2 < s2; )
          "array" === t2 || "nodebuffer" === t2 ? n2.push(String.fromCharCode.apply(null, e2.slice(i2, Math.min(i2 + r2, s2)))) : n2.push(String.fromCharCode.apply(null, e2.subarray(i2, Math.min(i2 + r2, s2)))), i2 += r2;
        return n2.join("");
      }, stringifyByChar: function(e2) {
        for (var t2 = "", r2 = 0; r2 < e2.length; r2++)
          t2 += String.fromCharCode(e2[r2]);
        return t2;
      }, applyCanBeUsed: { uint8array: function() {
        try {
          return o.uint8array && 1 === String.fromCharCode.apply(null, new Uint8Array(1)).length;
        } catch (e2) {
          return false;
        }
      }(), nodebuffer: function() {
        try {
          return o.nodebuffer && 1 === String.fromCharCode.apply(null, r.allocBuffer(1)).length;
        } catch (e2) {
          return false;
        }
      }() } };
      function s(e2) {
        var t2 = 65536, r2 = a.getTypeOf(e2), n2 = true;
        if ("uint8array" === r2 ? n2 = i.applyCanBeUsed.uint8array : "nodebuffer" === r2 && (n2 = i.applyCanBeUsed.nodebuffer), n2)
          for (; 1 < t2; )
            try {
              return i.stringifyByChunk(e2, r2, t2);
            } catch (e3) {
              t2 = Math.floor(t2 / 2);
            }
        return i.stringifyByChar(e2);
      }
      function f(e2, t2) {
        for (var r2 = 0; r2 < e2.length; r2++)
          t2[r2] = e2[r2];
        return t2;
      }
      a.applyFromCharCode = s;
      var c = {};
      c.string = { string: n, array: function(e2) {
        return l(e2, new Array(e2.length));
      }, arraybuffer: function(e2) {
        return c.string.uint8array(e2).buffer;
      }, uint8array: function(e2) {
        return l(e2, new Uint8Array(e2.length));
      }, nodebuffer: function(e2) {
        return l(e2, r.allocBuffer(e2.length));
      } }, c.array = { string: s, array: n, arraybuffer: function(e2) {
        return new Uint8Array(e2).buffer;
      }, uint8array: function(e2) {
        return new Uint8Array(e2);
      }, nodebuffer: function(e2) {
        return r.newBufferFrom(e2);
      } }, c.arraybuffer = { string: function(e2) {
        return s(new Uint8Array(e2));
      }, array: function(e2) {
        return f(new Uint8Array(e2), new Array(e2.byteLength));
      }, arraybuffer: n, uint8array: function(e2) {
        return new Uint8Array(e2);
      }, nodebuffer: function(e2) {
        return r.newBufferFrom(new Uint8Array(e2));
      } }, c.uint8array = { string: s, array: function(e2) {
        return f(e2, new Array(e2.length));
      }, arraybuffer: function(e2) {
        return e2.buffer;
      }, uint8array: n, nodebuffer: function(e2) {
        return r.newBufferFrom(e2);
      } }, c.nodebuffer = { string: s, array: function(e2) {
        return f(e2, new Array(e2.length));
      }, arraybuffer: function(e2) {
        return c.nodebuffer.uint8array(e2).buffer;
      }, uint8array: function(e2) {
        return f(e2, new Uint8Array(e2.length));
      }, nodebuffer: n }, a.transformTo = function(e2, t2) {
        if (t2 = t2 || "", !e2)
          return t2;
        a.checkSupport(e2);
        var r2 = a.getTypeOf(t2);
        return c[r2][e2](t2);
      }, a.resolve = function(e2) {
        for (var t2 = e2.split("/"), r2 = [], n2 = 0; n2 < t2.length; n2++) {
          var i2 = t2[n2];
          "." === i2 || "" === i2 && 0 !== n2 && n2 !== t2.length - 1 || (".." === i2 ? r2.pop() : r2.push(i2));
        }
        return r2.join("/");
      }, a.getTypeOf = function(e2) {
        return "string" == typeof e2 ? "string" : "[object Array]" === Object.prototype.toString.call(e2) ? "array" : o.nodebuffer && r.isBuffer(e2) ? "nodebuffer" : o.uint8array && e2 instanceof Uint8Array ? "uint8array" : o.arraybuffer && e2 instanceof ArrayBuffer ? "arraybuffer" : void 0;
      }, a.checkSupport = function(e2) {
        if (!o[e2.toLowerCase()])
          throw new Error(e2 + " is not supported by this platform");
      }, a.MAX_VALUE_16BITS = 65535, a.MAX_VALUE_32BITS = -1, a.pretty = function(e2) {
        var t2, r2, n2 = "";
        for (r2 = 0; r2 < (e2 || "").length; r2++)
          n2 += "\\x" + ((t2 = e2.charCodeAt(r2)) < 16 ? "0" : "") + t2.toString(16).toUpperCase();
        return n2;
      }, a.delay = function(e2, t2, r2) {
        setImmediate(function() {
          e2.apply(r2 || null, t2 || []);
        });
      }, a.inherits = function(e2, t2) {
        function r2() {
        }
        r2.prototype = t2.prototype, e2.prototype = new r2();
      }, a.extend = function() {
        var e2, t2, r2 = {};
        for (e2 = 0; e2 < arguments.length; e2++)
          for (t2 in arguments[e2])
            Object.prototype.hasOwnProperty.call(arguments[e2], t2) && void 0 === r2[t2] && (r2[t2] = arguments[e2][t2]);
        return r2;
      }, a.prepareContent = function(r2, e2, n2, i2, s2) {
        return u.Promise.resolve(e2).then(function(n3) {
          return o.blob && (n3 instanceof Blob || -1 !== ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(n3))) && "undefined" != typeof FileReader ? new u.Promise(function(t2, r3) {
            var e3 = new FileReader();
            e3.onload = function(e4) {
              t2(e4.target.result);
            }, e3.onerror = function(e4) {
              r3(e4.target.error);
            }, e3.readAsArrayBuffer(n3);
          }) : n3;
        }).then(function(e3) {
          var t2 = a.getTypeOf(e3);
          return t2 ? ("arraybuffer" === t2 ? e3 = a.transformTo("uint8array", e3) : "string" === t2 && (s2 ? e3 = h2.decode(e3) : n2 && true !== i2 && (e3 = function(e4) {
            return l(e4, o.uint8array ? new Uint8Array(e4.length) : new Array(e4.length));
          }(e3))), e3) : u.Promise.reject(new Error("Can't read the data of '" + r2 + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
        });
      };
    }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, setimmediate: 54 }], 33: [function(e, t, r) {
      var n = e("./reader/readerFor"), i = e("./utils"), s = e("./signature"), a = e("./zipEntry"), o = e("./support");
      function h2(e2) {
        this.files = [], this.loadOptions = e2;
      }
      h2.prototype = { checkSignature: function(e2) {
        if (!this.reader.readAndCheckSignature(e2)) {
          this.reader.index -= 4;
          var t2 = this.reader.readString(4);
          throw new Error("Corrupted zip or bug: unexpected signature (" + i.pretty(t2) + ", expected " + i.pretty(e2) + ")");
        }
      }, isSignature: function(e2, t2) {
        var r2 = this.reader.index;
        this.reader.setIndex(e2);
        var n2 = this.reader.readString(4) === t2;
        return this.reader.setIndex(r2), n2;
      }, readBlockEndOfCentral: function() {
        this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
        var e2 = this.reader.readData(this.zipCommentLength), t2 = o.uint8array ? "uint8array" : "array", r2 = i.transformTo(t2, e2);
        this.zipComment = this.loadOptions.decodeFileName(r2);
      }, readBlockZip64EndOfCentral: function() {
        this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
        for (var e2, t2, r2, n2 = this.zip64EndOfCentralSize - 44; 0 < n2; )
          e2 = this.reader.readInt(2), t2 = this.reader.readInt(4), r2 = this.reader.readData(t2), this.zip64ExtensibleData[e2] = { id: e2, length: t2, value: r2 };
      }, readBlockZip64EndOfCentralLocator: function() {
        if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount)
          throw new Error("Multi-volumes zip are not supported");
      }, readLocalFiles: function() {
        var e2, t2;
        for (e2 = 0; e2 < this.files.length; e2++)
          t2 = this.files[e2], this.reader.setIndex(t2.localHeaderOffset), this.checkSignature(s.LOCAL_FILE_HEADER), t2.readLocalPart(this.reader), t2.handleUTF8(), t2.processAttributes();
      }, readCentralDir: function() {
        var e2;
        for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(s.CENTRAL_FILE_HEADER); )
          (e2 = new a({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(e2);
        if (this.centralDirRecords !== this.files.length && 0 !== this.centralDirRecords && 0 === this.files.length)
          throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
      }, readEndOfCentral: function() {
        var e2 = this.reader.lastIndexOfSignature(s.CENTRAL_DIRECTORY_END);
        if (e2 < 0)
          throw !this.isSignature(0, s.LOCAL_FILE_HEADER) ? new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html") : new Error("Corrupted zip: can't find end of central directory");
        this.reader.setIndex(e2);
        var t2 = e2;
        if (this.checkSignature(s.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === i.MAX_VALUE_16BITS || this.diskWithCentralDirStart === i.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === i.MAX_VALUE_16BITS || this.centralDirRecords === i.MAX_VALUE_16BITS || this.centralDirSize === i.MAX_VALUE_32BITS || this.centralDirOffset === i.MAX_VALUE_32BITS) {
          if (this.zip64 = true, (e2 = this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0)
            throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
          if (this.reader.setIndex(e2), this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, s.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0))
            throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
          this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
        }
        var r2 = this.centralDirOffset + this.centralDirSize;
        this.zip64 && (r2 += 20, r2 += 12 + this.zip64EndOfCentralSize);
        var n2 = t2 - r2;
        if (0 < n2)
          this.isSignature(t2, s.CENTRAL_FILE_HEADER) || (this.reader.zero = n2);
        else if (n2 < 0)
          throw new Error("Corrupted zip: missing " + Math.abs(n2) + " bytes.");
      }, prepareReader: function(e2) {
        this.reader = n(e2);
      }, load: function(e2) {
        this.prepareReader(e2), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
      } }, t.exports = h2;
    }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utils": 32, "./zipEntry": 34 }], 34: [function(e, t, r) {
      var n = e("./reader/readerFor"), s = e("./utils"), i = e("./compressedObject"), a = e("./crc32"), o = e("./utf8"), h2 = e("./compressions"), u = e("./support");
      function l(e2, t2) {
        this.options = e2, this.loadOptions = t2;
      }
      l.prototype = { isEncrypted: function() {
        return 1 == (1 & this.bitFlag);
      }, useUTF8: function() {
        return 2048 == (2048 & this.bitFlag);
      }, readLocalPart: function(e2) {
        var t2, r2;
        if (e2.skip(22), this.fileNameLength = e2.readInt(2), r2 = e2.readInt(2), this.fileName = e2.readData(this.fileNameLength), e2.skip(r2), -1 === this.compressedSize || -1 === this.uncompressedSize)
          throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
        if (null === (t2 = function(e3) {
          for (var t3 in h2)
            if (Object.prototype.hasOwnProperty.call(h2, t3) && h2[t3].magic === e3)
              return h2[t3];
          return null;
        }(this.compressionMethod)))
          throw new Error("Corrupted zip : compression " + s.pretty(this.compressionMethod) + " unknown (inner file : " + s.transformTo("string", this.fileName) + ")");
        this.decompressed = new i(this.compressedSize, this.uncompressedSize, this.crc32, t2, e2.readData(this.compressedSize));
      }, readCentralPart: function(e2) {
        this.versionMadeBy = e2.readInt(2), e2.skip(2), this.bitFlag = e2.readInt(2), this.compressionMethod = e2.readString(2), this.date = e2.readDate(), this.crc32 = e2.readInt(4), this.compressedSize = e2.readInt(4), this.uncompressedSize = e2.readInt(4);
        var t2 = e2.readInt(2);
        if (this.extraFieldsLength = e2.readInt(2), this.fileCommentLength = e2.readInt(2), this.diskNumberStart = e2.readInt(2), this.internalFileAttributes = e2.readInt(2), this.externalFileAttributes = e2.readInt(4), this.localHeaderOffset = e2.readInt(4), this.isEncrypted())
          throw new Error("Encrypted zip are not supported");
        e2.skip(t2), this.readExtraFields(e2), this.parseZIP64ExtraField(e2), this.fileComment = e2.readData(this.fileCommentLength);
      }, processAttributes: function() {
        this.unixPermissions = null, this.dosPermissions = null;
        var e2 = this.versionMadeBy >> 8;
        this.dir = !!(16 & this.externalFileAttributes), 0 == e2 && (this.dosPermissions = 63 & this.externalFileAttributes), 3 == e2 && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535), this.dir || "/" !== this.fileNameStr.slice(-1) || (this.dir = true);
      }, parseZIP64ExtraField: function() {
        if (this.extraFields[1]) {
          var e2 = n(this.extraFields[1].value);
          this.uncompressedSize === s.MAX_VALUE_32BITS && (this.uncompressedSize = e2.readInt(8)), this.compressedSize === s.MAX_VALUE_32BITS && (this.compressedSize = e2.readInt(8)), this.localHeaderOffset === s.MAX_VALUE_32BITS && (this.localHeaderOffset = e2.readInt(8)), this.diskNumberStart === s.MAX_VALUE_32BITS && (this.diskNumberStart = e2.readInt(4));
        }
      }, readExtraFields: function(e2) {
        var t2, r2, n2, i2 = e2.index + this.extraFieldsLength;
        for (this.extraFields || (this.extraFields = {}); e2.index + 4 < i2; )
          t2 = e2.readInt(2), r2 = e2.readInt(2), n2 = e2.readData(r2), this.extraFields[t2] = { id: t2, length: r2, value: n2 };
        e2.setIndex(i2);
      }, handleUTF8: function() {
        var e2 = u.uint8array ? "uint8array" : "array";
        if (this.useUTF8())
          this.fileNameStr = o.utf8decode(this.fileName), this.fileCommentStr = o.utf8decode(this.fileComment);
        else {
          var t2 = this.findExtraFieldUnicodePath();
          if (null !== t2)
            this.fileNameStr = t2;
          else {
            var r2 = s.transformTo(e2, this.fileName);
            this.fileNameStr = this.loadOptions.decodeFileName(r2);
          }
          var n2 = this.findExtraFieldUnicodeComment();
          if (null !== n2)
            this.fileCommentStr = n2;
          else {
            var i2 = s.transformTo(e2, this.fileComment);
            this.fileCommentStr = this.loadOptions.decodeFileName(i2);
          }
        }
      }, findExtraFieldUnicodePath: function() {
        var e2 = this.extraFields[28789];
        if (e2) {
          var t2 = n(e2.value);
          return 1 !== t2.readInt(1) ? null : a(this.fileName) !== t2.readInt(4) ? null : o.utf8decode(t2.readData(e2.length - 5));
        }
        return null;
      }, findExtraFieldUnicodeComment: function() {
        var e2 = this.extraFields[25461];
        if (e2) {
          var t2 = n(e2.value);
          return 1 !== t2.readInt(1) ? null : a(this.fileComment) !== t2.readInt(4) ? null : o.utf8decode(t2.readData(e2.length - 5));
        }
        return null;
      } }, t.exports = l;
    }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function(e, t, r) {
      function n(e2, t2, r2) {
        this.name = e2, this.dir = r2.dir, this.date = r2.date, this.comment = r2.comment, this.unixPermissions = r2.unixPermissions, this.dosPermissions = r2.dosPermissions, this._data = t2, this._dataBinary = r2.binary, this.options = { compression: r2.compression, compressionOptions: r2.compressionOptions };
      }
      var s = e("./stream/StreamHelper"), i = e("./stream/DataWorker"), a = e("./utf8"), o = e("./compressedObject"), h2 = e("./stream/GenericWorker");
      n.prototype = { internalStream: function(e2) {
        var t2 = null, r2 = "string";
        try {
          if (!e2)
            throw new Error("No output type specified.");
          var n2 = "string" === (r2 = e2.toLowerCase()) || "text" === r2;
          "binarystring" !== r2 && "text" !== r2 || (r2 = "string"), t2 = this._decompressWorker();
          var i2 = !this._dataBinary;
          i2 && !n2 && (t2 = t2.pipe(new a.Utf8EncodeWorker())), !i2 && n2 && (t2 = t2.pipe(new a.Utf8DecodeWorker()));
        } catch (e3) {
          (t2 = new h2("error")).error(e3);
        }
        return new s(t2, r2, "");
      }, async: function(e2, t2) {
        return this.internalStream(e2).accumulate(t2);
      }, nodeStream: function(e2, t2) {
        return this.internalStream(e2 || "nodebuffer").toNodejsStream(t2);
      }, _compressWorker: function(e2, t2) {
        if (this._data instanceof o && this._data.compression.magic === e2.magic)
          return this._data.getCompressedWorker();
        var r2 = this._decompressWorker();
        return this._dataBinary || (r2 = r2.pipe(new a.Utf8EncodeWorker())), o.createWorkerFrom(r2, e2, t2);
      }, _decompressWorker: function() {
        return this._data instanceof o ? this._data.getContentWorker() : this._data instanceof h2 ? this._data : new i(this._data);
      } };
      for (var u = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], l = function() {
        throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
      }, f = 0; f < u.length; f++)
        n.prototype[u[f]] = l;
      t.exports = n;
    }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function(e, l, t) {
      (function(t2) {
        var r, n, e2 = t2.MutationObserver || t2.WebKitMutationObserver;
        if (e2) {
          var i = 0, s = new e2(u), a = t2.document.createTextNode("");
          s.observe(a, { characterData: true }), r = function() {
            a.data = i = ++i % 2;
          };
        } else if (t2.setImmediate || void 0 === t2.MessageChannel)
          r = "document" in t2 && "onreadystatechange" in t2.document.createElement("script") ? function() {
            var e3 = t2.document.createElement("script");
            e3.onreadystatechange = function() {
              u(), e3.onreadystatechange = null, e3.parentNode.removeChild(e3), e3 = null;
            }, t2.document.documentElement.appendChild(e3);
          } : function() {
            setTimeout(u, 0);
          };
        else {
          var o = new t2.MessageChannel();
          o.port1.onmessage = u, r = function() {
            o.port2.postMessage(0);
          };
        }
        var h2 = [];
        function u() {
          var e3, t3;
          n = true;
          for (var r2 = h2.length; r2; ) {
            for (t3 = h2, h2 = [], e3 = -1; ++e3 < r2; )
              t3[e3]();
            r2 = h2.length;
          }
          n = false;
        }
        l.exports = function(e3) {
          1 !== h2.push(e3) || n || r();
        };
      }).call(this, "undefined" != typeof commonjsGlobal ? commonjsGlobal : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, {}], 37: [function(e, t, r) {
      var i = e("immediate");
      function u() {
      }
      var l = {}, s = ["REJECTED"], a = ["FULFILLED"], n = ["PENDING"];
      function o(e2) {
        if ("function" != typeof e2)
          throw new TypeError("resolver must be a function");
        this.state = n, this.queue = [], this.outcome = void 0, e2 !== u && d(this, e2);
      }
      function h2(e2, t2, r2) {
        this.promise = e2, "function" == typeof t2 && (this.onFulfilled = t2, this.callFulfilled = this.otherCallFulfilled), "function" == typeof r2 && (this.onRejected = r2, this.callRejected = this.otherCallRejected);
      }
      function f(t2, r2, n2) {
        i(function() {
          var e2;
          try {
            e2 = r2(n2);
          } catch (e3) {
            return l.reject(t2, e3);
          }
          e2 === t2 ? l.reject(t2, new TypeError("Cannot resolve promise with itself")) : l.resolve(t2, e2);
        });
      }
      function c(e2) {
        var t2 = e2 && e2.then;
        if (e2 && ("object" == typeof e2 || "function" == typeof e2) && "function" == typeof t2)
          return function() {
            t2.apply(e2, arguments);
          };
      }
      function d(t2, e2) {
        var r2 = false;
        function n2(e3) {
          r2 || (r2 = true, l.reject(t2, e3));
        }
        function i2(e3) {
          r2 || (r2 = true, l.resolve(t2, e3));
        }
        var s2 = p2(function() {
          e2(i2, n2);
        });
        "error" === s2.status && n2(s2.value);
      }
      function p2(e2, t2) {
        var r2 = {};
        try {
          r2.value = e2(t2), r2.status = "success";
        } catch (e3) {
          r2.status = "error", r2.value = e3;
        }
        return r2;
      }
      (t.exports = o).prototype.finally = function(t2) {
        if ("function" != typeof t2)
          return this;
        var r2 = this.constructor;
        return this.then(function(e2) {
          return r2.resolve(t2()).then(function() {
            return e2;
          });
        }, function(e2) {
          return r2.resolve(t2()).then(function() {
            throw e2;
          });
        });
      }, o.prototype.catch = function(e2) {
        return this.then(null, e2);
      }, o.prototype.then = function(e2, t2) {
        if ("function" != typeof e2 && this.state === a || "function" != typeof t2 && this.state === s)
          return this;
        var r2 = new this.constructor(u);
        this.state !== n ? f(r2, this.state === a ? e2 : t2, this.outcome) : this.queue.push(new h2(r2, e2, t2));
        return r2;
      }, h2.prototype.callFulfilled = function(e2) {
        l.resolve(this.promise, e2);
      }, h2.prototype.otherCallFulfilled = function(e2) {
        f(this.promise, this.onFulfilled, e2);
      }, h2.prototype.callRejected = function(e2) {
        l.reject(this.promise, e2);
      }, h2.prototype.otherCallRejected = function(e2) {
        f(this.promise, this.onRejected, e2);
      }, l.resolve = function(e2, t2) {
        var r2 = p2(c, t2);
        if ("error" === r2.status)
          return l.reject(e2, r2.value);
        var n2 = r2.value;
        if (n2)
          d(e2, n2);
        else {
          e2.state = a, e2.outcome = t2;
          for (var i2 = -1, s2 = e2.queue.length; ++i2 < s2; )
            e2.queue[i2].callFulfilled(t2);
        }
        return e2;
      }, l.reject = function(e2, t2) {
        e2.state = s, e2.outcome = t2;
        for (var r2 = -1, n2 = e2.queue.length; ++r2 < n2; )
          e2.queue[r2].callRejected(t2);
        return e2;
      }, o.resolve = function(e2) {
        if (e2 instanceof this)
          return e2;
        return l.resolve(new this(u), e2);
      }, o.reject = function(e2) {
        var t2 = new this(u);
        return l.reject(t2, e2);
      }, o.all = function(e2) {
        var r2 = this;
        if ("[object Array]" !== Object.prototype.toString.call(e2))
          return this.reject(new TypeError("must be an array"));
        var n2 = e2.length, i2 = false;
        if (!n2)
          return this.resolve([]);
        var s2 = new Array(n2), a2 = 0, t2 = -1, o2 = new this(u);
        for (; ++t2 < n2; )
          h3(e2[t2], t2);
        return o2;
        function h3(e3, t3) {
          r2.resolve(e3).then(function(e4) {
            s2[t3] = e4, ++a2 !== n2 || i2 || (i2 = true, l.resolve(o2, s2));
          }, function(e4) {
            i2 || (i2 = true, l.reject(o2, e4));
          });
        }
      }, o.race = function(e2) {
        var t2 = this;
        if ("[object Array]" !== Object.prototype.toString.call(e2))
          return this.reject(new TypeError("must be an array"));
        var r2 = e2.length, n2 = false;
        if (!r2)
          return this.resolve([]);
        var i2 = -1, s2 = new this(u);
        for (; ++i2 < r2; )
          a2 = e2[i2], t2.resolve(a2).then(function(e3) {
            n2 || (n2 = true, l.resolve(s2, e3));
          }, function(e3) {
            n2 || (n2 = true, l.reject(s2, e3));
          });
        var a2;
        return s2;
      };
    }, { immediate: 36 }], 38: [function(e, t, r) {
      var n = {};
      (0, e("./lib/utils/common").assign)(n, e("./lib/deflate"), e("./lib/inflate"), e("./lib/zlib/constants")), t.exports = n;
    }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function(e, t, r) {
      var a = e("./zlib/deflate"), o = e("./utils/common"), h2 = e("./utils/strings"), i = e("./zlib/messages"), s = e("./zlib/zstream"), u = Object.prototype.toString, l = 0, f = -1, c = 0, d = 8;
      function p2(e2) {
        if (!(this instanceof p2))
          return new p2(e2);
        this.options = o.assign({ level: f, method: d, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: c, to: "" }, e2 || {});
        var t2 = this.options;
        t2.raw && 0 < t2.windowBits ? t2.windowBits = -t2.windowBits : t2.gzip && 0 < t2.windowBits && t2.windowBits < 16 && (t2.windowBits += 16), this.err = 0, this.msg = "", this.ended = false, this.chunks = [], this.strm = new s(), this.strm.avail_out = 0;
        var r2 = a.deflateInit2(this.strm, t2.level, t2.method, t2.windowBits, t2.memLevel, t2.strategy);
        if (r2 !== l)
          throw new Error(i[r2]);
        if (t2.header && a.deflateSetHeader(this.strm, t2.header), t2.dictionary) {
          var n2;
          if (n2 = "string" == typeof t2.dictionary ? h2.string2buf(t2.dictionary) : "[object ArrayBuffer]" === u.call(t2.dictionary) ? new Uint8Array(t2.dictionary) : t2.dictionary, (r2 = a.deflateSetDictionary(this.strm, n2)) !== l)
            throw new Error(i[r2]);
          this._dict_set = true;
        }
      }
      function n(e2, t2) {
        var r2 = new p2(t2);
        if (r2.push(e2, true), r2.err)
          throw r2.msg || i[r2.err];
        return r2.result;
      }
      p2.prototype.push = function(e2, t2) {
        var r2, n2, i2 = this.strm, s2 = this.options.chunkSize;
        if (this.ended)
          return false;
        n2 = t2 === ~~t2 ? t2 : true === t2 ? 4 : 0, "string" == typeof e2 ? i2.input = h2.string2buf(e2) : "[object ArrayBuffer]" === u.call(e2) ? i2.input = new Uint8Array(e2) : i2.input = e2, i2.next_in = 0, i2.avail_in = i2.input.length;
        do {
          if (0 === i2.avail_out && (i2.output = new o.Buf8(s2), i2.next_out = 0, i2.avail_out = s2), 1 !== (r2 = a.deflate(i2, n2)) && r2 !== l)
            return this.onEnd(r2), !(this.ended = true);
          0 !== i2.avail_out && (0 !== i2.avail_in || 4 !== n2 && 2 !== n2) || ("string" === this.options.to ? this.onData(h2.buf2binstring(o.shrinkBuf(i2.output, i2.next_out))) : this.onData(o.shrinkBuf(i2.output, i2.next_out)));
        } while ((0 < i2.avail_in || 0 === i2.avail_out) && 1 !== r2);
        return 4 === n2 ? (r2 = a.deflateEnd(this.strm), this.onEnd(r2), this.ended = true, r2 === l) : 2 !== n2 || (this.onEnd(l), !(i2.avail_out = 0));
      }, p2.prototype.onData = function(e2) {
        this.chunks.push(e2);
      }, p2.prototype.onEnd = function(e2) {
        e2 === l && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = o.flattenChunks(this.chunks)), this.chunks = [], this.err = e2, this.msg = this.strm.msg;
      }, r.Deflate = p2, r.deflate = n, r.deflateRaw = function(e2, t2) {
        return (t2 = t2 || {}).raw = true, n(e2, t2);
      }, r.gzip = function(e2, t2) {
        return (t2 = t2 || {}).gzip = true, n(e2, t2);
      };
    }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53 }], 40: [function(e, t, r) {
      var c = e("./zlib/inflate"), d = e("./utils/common"), p2 = e("./utils/strings"), m = e("./zlib/constants"), n = e("./zlib/messages"), i = e("./zlib/zstream"), s = e("./zlib/gzheader"), _ = Object.prototype.toString;
      function a(e2) {
        if (!(this instanceof a))
          return new a(e2);
        this.options = d.assign({ chunkSize: 16384, windowBits: 0, to: "" }, e2 || {});
        var t2 = this.options;
        t2.raw && 0 <= t2.windowBits && t2.windowBits < 16 && (t2.windowBits = -t2.windowBits, 0 === t2.windowBits && (t2.windowBits = -15)), !(0 <= t2.windowBits && t2.windowBits < 16) || e2 && e2.windowBits || (t2.windowBits += 32), 15 < t2.windowBits && t2.windowBits < 48 && 0 == (15 & t2.windowBits) && (t2.windowBits |= 15), this.err = 0, this.msg = "", this.ended = false, this.chunks = [], this.strm = new i(), this.strm.avail_out = 0;
        var r2 = c.inflateInit2(this.strm, t2.windowBits);
        if (r2 !== m.Z_OK)
          throw new Error(n[r2]);
        this.header = new s(), c.inflateGetHeader(this.strm, this.header);
      }
      function o(e2, t2) {
        var r2 = new a(t2);
        if (r2.push(e2, true), r2.err)
          throw r2.msg || n[r2.err];
        return r2.result;
      }
      a.prototype.push = function(e2, t2) {
        var r2, n2, i2, s2, a2, o2, h2 = this.strm, u = this.options.chunkSize, l = this.options.dictionary, f = false;
        if (this.ended)
          return false;
        n2 = t2 === ~~t2 ? t2 : true === t2 ? m.Z_FINISH : m.Z_NO_FLUSH, "string" == typeof e2 ? h2.input = p2.binstring2buf(e2) : "[object ArrayBuffer]" === _.call(e2) ? h2.input = new Uint8Array(e2) : h2.input = e2, h2.next_in = 0, h2.avail_in = h2.input.length;
        do {
          if (0 === h2.avail_out && (h2.output = new d.Buf8(u), h2.next_out = 0, h2.avail_out = u), (r2 = c.inflate(h2, m.Z_NO_FLUSH)) === m.Z_NEED_DICT && l && (o2 = "string" == typeof l ? p2.string2buf(l) : "[object ArrayBuffer]" === _.call(l) ? new Uint8Array(l) : l, r2 = c.inflateSetDictionary(this.strm, o2)), r2 === m.Z_BUF_ERROR && true === f && (r2 = m.Z_OK, f = false), r2 !== m.Z_STREAM_END && r2 !== m.Z_OK)
            return this.onEnd(r2), !(this.ended = true);
          h2.next_out && (0 !== h2.avail_out && r2 !== m.Z_STREAM_END && (0 !== h2.avail_in || n2 !== m.Z_FINISH && n2 !== m.Z_SYNC_FLUSH) || ("string" === this.options.to ? (i2 = p2.utf8border(h2.output, h2.next_out), s2 = h2.next_out - i2, a2 = p2.buf2string(h2.output, i2), h2.next_out = s2, h2.avail_out = u - s2, s2 && d.arraySet(h2.output, h2.output, i2, s2, 0), this.onData(a2)) : this.onData(d.shrinkBuf(h2.output, h2.next_out)))), 0 === h2.avail_in && 0 === h2.avail_out && (f = true);
        } while ((0 < h2.avail_in || 0 === h2.avail_out) && r2 !== m.Z_STREAM_END);
        return r2 === m.Z_STREAM_END && (n2 = m.Z_FINISH), n2 === m.Z_FINISH ? (r2 = c.inflateEnd(this.strm), this.onEnd(r2), this.ended = true, r2 === m.Z_OK) : n2 !== m.Z_SYNC_FLUSH || (this.onEnd(m.Z_OK), !(h2.avail_out = 0));
      }, a.prototype.onData = function(e2) {
        this.chunks.push(e2);
      }, a.prototype.onEnd = function(e2) {
        e2 === m.Z_OK && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = d.flattenChunks(this.chunks)), this.chunks = [], this.err = e2, this.msg = this.strm.msg;
      }, r.Inflate = a, r.inflate = o, r.inflateRaw = function(e2, t2) {
        return (t2 = t2 || {}).raw = true, o(e2, t2);
      }, r.ungzip = o;
    }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function(e, t, r) {
      var n = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Int32Array;
      r.assign = function(e2) {
        for (var t2 = Array.prototype.slice.call(arguments, 1); t2.length; ) {
          var r2 = t2.shift();
          if (r2) {
            if ("object" != typeof r2)
              throw new TypeError(r2 + "must be non-object");
            for (var n2 in r2)
              r2.hasOwnProperty(n2) && (e2[n2] = r2[n2]);
          }
        }
        return e2;
      }, r.shrinkBuf = function(e2, t2) {
        return e2.length === t2 ? e2 : e2.subarray ? e2.subarray(0, t2) : (e2.length = t2, e2);
      };
      var i = { arraySet: function(e2, t2, r2, n2, i2) {
        if (t2.subarray && e2.subarray)
          e2.set(t2.subarray(r2, r2 + n2), i2);
        else
          for (var s2 = 0; s2 < n2; s2++)
            e2[i2 + s2] = t2[r2 + s2];
      }, flattenChunks: function(e2) {
        var t2, r2, n2, i2, s2, a;
        for (t2 = n2 = 0, r2 = e2.length; t2 < r2; t2++)
          n2 += e2[t2].length;
        for (a = new Uint8Array(n2), t2 = i2 = 0, r2 = e2.length; t2 < r2; t2++)
          s2 = e2[t2], a.set(s2, i2), i2 += s2.length;
        return a;
      } }, s = { arraySet: function(e2, t2, r2, n2, i2) {
        for (var s2 = 0; s2 < n2; s2++)
          e2[i2 + s2] = t2[r2 + s2];
      }, flattenChunks: function(e2) {
        return [].concat.apply([], e2);
      } };
      r.setTyped = function(e2) {
        e2 ? (r.Buf8 = Uint8Array, r.Buf16 = Uint16Array, r.Buf32 = Int32Array, r.assign(r, i)) : (r.Buf8 = Array, r.Buf16 = Array, r.Buf32 = Array, r.assign(r, s));
      }, r.setTyped(n);
    }, {}], 42: [function(e, t, r) {
      var h2 = e("./common"), i = true, s = true;
      try {
        String.fromCharCode.apply(null, [0]);
      } catch (e2) {
        i = false;
      }
      try {
        String.fromCharCode.apply(null, new Uint8Array(1));
      } catch (e2) {
        s = false;
      }
      for (var u = new h2.Buf8(256), n = 0; n < 256; n++)
        u[n] = 252 <= n ? 6 : 248 <= n ? 5 : 240 <= n ? 4 : 224 <= n ? 3 : 192 <= n ? 2 : 1;
      function l(e2, t2) {
        if (t2 < 65537 && (e2.subarray && s || !e2.subarray && i))
          return String.fromCharCode.apply(null, h2.shrinkBuf(e2, t2));
        for (var r2 = "", n2 = 0; n2 < t2; n2++)
          r2 += String.fromCharCode(e2[n2]);
        return r2;
      }
      u[254] = u[254] = 1, r.string2buf = function(e2) {
        var t2, r2, n2, i2, s2, a = e2.length, o = 0;
        for (i2 = 0; i2 < a; i2++)
          55296 == (64512 & (r2 = e2.charCodeAt(i2))) && i2 + 1 < a && 56320 == (64512 & (n2 = e2.charCodeAt(i2 + 1))) && (r2 = 65536 + (r2 - 55296 << 10) + (n2 - 56320), i2++), o += r2 < 128 ? 1 : r2 < 2048 ? 2 : r2 < 65536 ? 3 : 4;
        for (t2 = new h2.Buf8(o), i2 = s2 = 0; s2 < o; i2++)
          55296 == (64512 & (r2 = e2.charCodeAt(i2))) && i2 + 1 < a && 56320 == (64512 & (n2 = e2.charCodeAt(i2 + 1))) && (r2 = 65536 + (r2 - 55296 << 10) + (n2 - 56320), i2++), r2 < 128 ? t2[s2++] = r2 : (r2 < 2048 ? t2[s2++] = 192 | r2 >>> 6 : (r2 < 65536 ? t2[s2++] = 224 | r2 >>> 12 : (t2[s2++] = 240 | r2 >>> 18, t2[s2++] = 128 | r2 >>> 12 & 63), t2[s2++] = 128 | r2 >>> 6 & 63), t2[s2++] = 128 | 63 & r2);
        return t2;
      }, r.buf2binstring = function(e2) {
        return l(e2, e2.length);
      }, r.binstring2buf = function(e2) {
        for (var t2 = new h2.Buf8(e2.length), r2 = 0, n2 = t2.length; r2 < n2; r2++)
          t2[r2] = e2.charCodeAt(r2);
        return t2;
      }, r.buf2string = function(e2, t2) {
        var r2, n2, i2, s2, a = t2 || e2.length, o = new Array(2 * a);
        for (r2 = n2 = 0; r2 < a; )
          if ((i2 = e2[r2++]) < 128)
            o[n2++] = i2;
          else if (4 < (s2 = u[i2]))
            o[n2++] = 65533, r2 += s2 - 1;
          else {
            for (i2 &= 2 === s2 ? 31 : 3 === s2 ? 15 : 7; 1 < s2 && r2 < a; )
              i2 = i2 << 6 | 63 & e2[r2++], s2--;
            1 < s2 ? o[n2++] = 65533 : i2 < 65536 ? o[n2++] = i2 : (i2 -= 65536, o[n2++] = 55296 | i2 >> 10 & 1023, o[n2++] = 56320 | 1023 & i2);
          }
        return l(o, n2);
      }, r.utf8border = function(e2, t2) {
        var r2;
        for ((t2 = t2 || e2.length) > e2.length && (t2 = e2.length), r2 = t2 - 1; 0 <= r2 && 128 == (192 & e2[r2]); )
          r2--;
        return r2 < 0 ? t2 : 0 === r2 ? t2 : r2 + u[e2[r2]] > t2 ? r2 : t2;
      };
    }, { "./common": 41 }], 43: [function(e, t, r) {
      t.exports = function(e2, t2, r2, n) {
        for (var i = 65535 & e2 | 0, s = e2 >>> 16 & 65535 | 0, a = 0; 0 !== r2; ) {
          for (r2 -= a = 2e3 < r2 ? 2e3 : r2; s = s + (i = i + t2[n++] | 0) | 0, --a; )
            ;
          i %= 65521, s %= 65521;
        }
        return i | s << 16 | 0;
      };
    }, {}], 44: [function(e, t, r) {
      t.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
    }, {}], 45: [function(e, t, r) {
      var o = function() {
        for (var e2, t2 = [], r2 = 0; r2 < 256; r2++) {
          e2 = r2;
          for (var n = 0; n < 8; n++)
            e2 = 1 & e2 ? 3988292384 ^ e2 >>> 1 : e2 >>> 1;
          t2[r2] = e2;
        }
        return t2;
      }();
      t.exports = function(e2, t2, r2, n) {
        var i = o, s = n + r2;
        e2 ^= -1;
        for (var a = n; a < s; a++)
          e2 = e2 >>> 8 ^ i[255 & (e2 ^ t2[a])];
        return -1 ^ e2;
      };
    }, {}], 46: [function(e, t, r) {
      var h2, c = e("../utils/common"), u = e("./trees"), d = e("./adler32"), p2 = e("./crc32"), n = e("./messages"), l = 0, f = 4, m = 0, _ = -2, g = -1, b = 4, i = 2, v = 8, y = 9, s = 286, a = 30, o = 19, w = 2 * s + 1, k = 15, x = 3, S2 = 258, z = S2 + x + 1, C2 = 42, E = 113, A = 1, I = 2, O = 3, B = 4;
      function R2(e2, t2) {
        return e2.msg = n[t2], t2;
      }
      function T(e2) {
        return (e2 << 1) - (4 < e2 ? 9 : 0);
      }
      function D(e2) {
        for (var t2 = e2.length; 0 <= --t2; )
          e2[t2] = 0;
      }
      function F2(e2) {
        var t2 = e2.state, r2 = t2.pending;
        r2 > e2.avail_out && (r2 = e2.avail_out), 0 !== r2 && (c.arraySet(e2.output, t2.pending_buf, t2.pending_out, r2, e2.next_out), e2.next_out += r2, t2.pending_out += r2, e2.total_out += r2, e2.avail_out -= r2, t2.pending -= r2, 0 === t2.pending && (t2.pending_out = 0));
      }
      function N(e2, t2) {
        u._tr_flush_block(e2, 0 <= e2.block_start ? e2.block_start : -1, e2.strstart - e2.block_start, t2), e2.block_start = e2.strstart, F2(e2.strm);
      }
      function U(e2, t2) {
        e2.pending_buf[e2.pending++] = t2;
      }
      function P2(e2, t2) {
        e2.pending_buf[e2.pending++] = t2 >>> 8 & 255, e2.pending_buf[e2.pending++] = 255 & t2;
      }
      function L(e2, t2) {
        var r2, n2, i2 = e2.max_chain_length, s2 = e2.strstart, a2 = e2.prev_length, o2 = e2.nice_match, h3 = e2.strstart > e2.w_size - z ? e2.strstart - (e2.w_size - z) : 0, u2 = e2.window, l2 = e2.w_mask, f2 = e2.prev, c2 = e2.strstart + S2, d2 = u2[s2 + a2 - 1], p3 = u2[s2 + a2];
        e2.prev_length >= e2.good_match && (i2 >>= 2), o2 > e2.lookahead && (o2 = e2.lookahead);
        do {
          if (u2[(r2 = t2) + a2] === p3 && u2[r2 + a2 - 1] === d2 && u2[r2] === u2[s2] && u2[++r2] === u2[s2 + 1]) {
            s2 += 2, r2++;
            do {
            } while (u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && s2 < c2);
            if (n2 = S2 - (c2 - s2), s2 = c2 - S2, a2 < n2) {
              if (e2.match_start = t2, o2 <= (a2 = n2))
                break;
              d2 = u2[s2 + a2 - 1], p3 = u2[s2 + a2];
            }
          }
        } while ((t2 = f2[t2 & l2]) > h3 && 0 != --i2);
        return a2 <= e2.lookahead ? a2 : e2.lookahead;
      }
      function j(e2) {
        var t2, r2, n2, i2, s2, a2, o2, h3, u2, l2, f2 = e2.w_size;
        do {
          if (i2 = e2.window_size - e2.lookahead - e2.strstart, e2.strstart >= f2 + (f2 - z)) {
            for (c.arraySet(e2.window, e2.window, f2, f2, 0), e2.match_start -= f2, e2.strstart -= f2, e2.block_start -= f2, t2 = r2 = e2.hash_size; n2 = e2.head[--t2], e2.head[t2] = f2 <= n2 ? n2 - f2 : 0, --r2; )
              ;
            for (t2 = r2 = f2; n2 = e2.prev[--t2], e2.prev[t2] = f2 <= n2 ? n2 - f2 : 0, --r2; )
              ;
            i2 += f2;
          }
          if (0 === e2.strm.avail_in)
            break;
          if (a2 = e2.strm, o2 = e2.window, h3 = e2.strstart + e2.lookahead, u2 = i2, l2 = void 0, l2 = a2.avail_in, u2 < l2 && (l2 = u2), r2 = 0 === l2 ? 0 : (a2.avail_in -= l2, c.arraySet(o2, a2.input, a2.next_in, l2, h3), 1 === a2.state.wrap ? a2.adler = d(a2.adler, o2, l2, h3) : 2 === a2.state.wrap && (a2.adler = p2(a2.adler, o2, l2, h3)), a2.next_in += l2, a2.total_in += l2, l2), e2.lookahead += r2, e2.lookahead + e2.insert >= x)
            for (s2 = e2.strstart - e2.insert, e2.ins_h = e2.window[s2], e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[s2 + 1]) & e2.hash_mask; e2.insert && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[s2 + x - 1]) & e2.hash_mask, e2.prev[s2 & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = s2, s2++, e2.insert--, !(e2.lookahead + e2.insert < x)); )
              ;
        } while (e2.lookahead < z && 0 !== e2.strm.avail_in);
      }
      function Z2(e2, t2) {
        for (var r2, n2; ; ) {
          if (e2.lookahead < z) {
            if (j(e2), e2.lookahead < z && t2 === l)
              return A;
            if (0 === e2.lookahead)
              break;
          }
          if (r2 = 0, e2.lookahead >= x && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + x - 1]) & e2.hash_mask, r2 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart), 0 !== r2 && e2.strstart - r2 <= e2.w_size - z && (e2.match_length = L(e2, r2)), e2.match_length >= x)
            if (n2 = u._tr_tally(e2, e2.strstart - e2.match_start, e2.match_length - x), e2.lookahead -= e2.match_length, e2.match_length <= e2.max_lazy_match && e2.lookahead >= x) {
              for (e2.match_length--; e2.strstart++, e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + x - 1]) & e2.hash_mask, r2 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart, 0 != --e2.match_length; )
                ;
              e2.strstart++;
            } else
              e2.strstart += e2.match_length, e2.match_length = 0, e2.ins_h = e2.window[e2.strstart], e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + 1]) & e2.hash_mask;
          else
            n2 = u._tr_tally(e2, 0, e2.window[e2.strstart]), e2.lookahead--, e2.strstart++;
          if (n2 && (N(e2, false), 0 === e2.strm.avail_out))
            return A;
        }
        return e2.insert = e2.strstart < x - 1 ? e2.strstart : x - 1, t2 === f ? (N(e2, true), 0 === e2.strm.avail_out ? O : B) : e2.last_lit && (N(e2, false), 0 === e2.strm.avail_out) ? A : I;
      }
      function W(e2, t2) {
        for (var r2, n2, i2; ; ) {
          if (e2.lookahead < z) {
            if (j(e2), e2.lookahead < z && t2 === l)
              return A;
            if (0 === e2.lookahead)
              break;
          }
          if (r2 = 0, e2.lookahead >= x && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + x - 1]) & e2.hash_mask, r2 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart), e2.prev_length = e2.match_length, e2.prev_match = e2.match_start, e2.match_length = x - 1, 0 !== r2 && e2.prev_length < e2.max_lazy_match && e2.strstart - r2 <= e2.w_size - z && (e2.match_length = L(e2, r2), e2.match_length <= 5 && (1 === e2.strategy || e2.match_length === x && 4096 < e2.strstart - e2.match_start) && (e2.match_length = x - 1)), e2.prev_length >= x && e2.match_length <= e2.prev_length) {
            for (i2 = e2.strstart + e2.lookahead - x, n2 = u._tr_tally(e2, e2.strstart - 1 - e2.prev_match, e2.prev_length - x), e2.lookahead -= e2.prev_length - 1, e2.prev_length -= 2; ++e2.strstart <= i2 && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + x - 1]) & e2.hash_mask, r2 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart), 0 != --e2.prev_length; )
              ;
            if (e2.match_available = 0, e2.match_length = x - 1, e2.strstart++, n2 && (N(e2, false), 0 === e2.strm.avail_out))
              return A;
          } else if (e2.match_available) {
            if ((n2 = u._tr_tally(e2, 0, e2.window[e2.strstart - 1])) && N(e2, false), e2.strstart++, e2.lookahead--, 0 === e2.strm.avail_out)
              return A;
          } else
            e2.match_available = 1, e2.strstart++, e2.lookahead--;
        }
        return e2.match_available && (n2 = u._tr_tally(e2, 0, e2.window[e2.strstart - 1]), e2.match_available = 0), e2.insert = e2.strstart < x - 1 ? e2.strstart : x - 1, t2 === f ? (N(e2, true), 0 === e2.strm.avail_out ? O : B) : e2.last_lit && (N(e2, false), 0 === e2.strm.avail_out) ? A : I;
      }
      function M2(e2, t2, r2, n2, i2) {
        this.good_length = e2, this.max_lazy = t2, this.nice_length = r2, this.max_chain = n2, this.func = i2;
      }
      function H() {
        this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = v, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new c.Buf16(2 * w), this.dyn_dtree = new c.Buf16(2 * (2 * a + 1)), this.bl_tree = new c.Buf16(2 * (2 * o + 1)), D(this.dyn_ltree), D(this.dyn_dtree), D(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new c.Buf16(k + 1), this.heap = new c.Buf16(2 * s + 1), D(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new c.Buf16(2 * s + 1), D(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
      }
      function G(e2) {
        var t2;
        return e2 && e2.state ? (e2.total_in = e2.total_out = 0, e2.data_type = i, (t2 = e2.state).pending = 0, t2.pending_out = 0, t2.wrap < 0 && (t2.wrap = -t2.wrap), t2.status = t2.wrap ? C2 : E, e2.adler = 2 === t2.wrap ? 0 : 1, t2.last_flush = l, u._tr_init(t2), m) : R2(e2, _);
      }
      function K(e2) {
        var t2 = G(e2);
        return t2 === m && function(e3) {
          e3.window_size = 2 * e3.w_size, D(e3.head), e3.max_lazy_match = h2[e3.level].max_lazy, e3.good_match = h2[e3.level].good_length, e3.nice_match = h2[e3.level].nice_length, e3.max_chain_length = h2[e3.level].max_chain, e3.strstart = 0, e3.block_start = 0, e3.lookahead = 0, e3.insert = 0, e3.match_length = e3.prev_length = x - 1, e3.match_available = 0, e3.ins_h = 0;
        }(e2.state), t2;
      }
      function Y(e2, t2, r2, n2, i2, s2) {
        if (!e2)
          return _;
        var a2 = 1;
        if (t2 === g && (t2 = 6), n2 < 0 ? (a2 = 0, n2 = -n2) : 15 < n2 && (a2 = 2, n2 -= 16), i2 < 1 || y < i2 || r2 !== v || n2 < 8 || 15 < n2 || t2 < 0 || 9 < t2 || s2 < 0 || b < s2)
          return R2(e2, _);
        8 === n2 && (n2 = 9);
        var o2 = new H();
        return (e2.state = o2).strm = e2, o2.wrap = a2, o2.gzhead = null, o2.w_bits = n2, o2.w_size = 1 << o2.w_bits, o2.w_mask = o2.w_size - 1, o2.hash_bits = i2 + 7, o2.hash_size = 1 << o2.hash_bits, o2.hash_mask = o2.hash_size - 1, o2.hash_shift = ~~((o2.hash_bits + x - 1) / x), o2.window = new c.Buf8(2 * o2.w_size), o2.head = new c.Buf16(o2.hash_size), o2.prev = new c.Buf16(o2.w_size), o2.lit_bufsize = 1 << i2 + 6, o2.pending_buf_size = 4 * o2.lit_bufsize, o2.pending_buf = new c.Buf8(o2.pending_buf_size), o2.d_buf = 1 * o2.lit_bufsize, o2.l_buf = 3 * o2.lit_bufsize, o2.level = t2, o2.strategy = s2, o2.method = r2, K(e2);
      }
      h2 = [new M2(0, 0, 0, 0, function(e2, t2) {
        var r2 = 65535;
        for (r2 > e2.pending_buf_size - 5 && (r2 = e2.pending_buf_size - 5); ; ) {
          if (e2.lookahead <= 1) {
            if (j(e2), 0 === e2.lookahead && t2 === l)
              return A;
            if (0 === e2.lookahead)
              break;
          }
          e2.strstart += e2.lookahead, e2.lookahead = 0;
          var n2 = e2.block_start + r2;
          if ((0 === e2.strstart || e2.strstart >= n2) && (e2.lookahead = e2.strstart - n2, e2.strstart = n2, N(e2, false), 0 === e2.strm.avail_out))
            return A;
          if (e2.strstart - e2.block_start >= e2.w_size - z && (N(e2, false), 0 === e2.strm.avail_out))
            return A;
        }
        return e2.insert = 0, t2 === f ? (N(e2, true), 0 === e2.strm.avail_out ? O : B) : (e2.strstart > e2.block_start && (N(e2, false), e2.strm.avail_out), A);
      }), new M2(4, 4, 8, 4, Z2), new M2(4, 5, 16, 8, Z2), new M2(4, 6, 32, 32, Z2), new M2(4, 4, 16, 16, W), new M2(8, 16, 32, 32, W), new M2(8, 16, 128, 128, W), new M2(8, 32, 128, 256, W), new M2(32, 128, 258, 1024, W), new M2(32, 258, 258, 4096, W)], r.deflateInit = function(e2, t2) {
        return Y(e2, t2, v, 15, 8, 0);
      }, r.deflateInit2 = Y, r.deflateReset = K, r.deflateResetKeep = G, r.deflateSetHeader = function(e2, t2) {
        return e2 && e2.state ? 2 !== e2.state.wrap ? _ : (e2.state.gzhead = t2, m) : _;
      }, r.deflate = function(e2, t2) {
        var r2, n2, i2, s2;
        if (!e2 || !e2.state || 5 < t2 || t2 < 0)
          return e2 ? R2(e2, _) : _;
        if (n2 = e2.state, !e2.output || !e2.input && 0 !== e2.avail_in || 666 === n2.status && t2 !== f)
          return R2(e2, 0 === e2.avail_out ? -5 : _);
        if (n2.strm = e2, r2 = n2.last_flush, n2.last_flush = t2, n2.status === C2)
          if (2 === n2.wrap)
            e2.adler = 0, U(n2, 31), U(n2, 139), U(n2, 8), n2.gzhead ? (U(n2, (n2.gzhead.text ? 1 : 0) + (n2.gzhead.hcrc ? 2 : 0) + (n2.gzhead.extra ? 4 : 0) + (n2.gzhead.name ? 8 : 0) + (n2.gzhead.comment ? 16 : 0)), U(n2, 255 & n2.gzhead.time), U(n2, n2.gzhead.time >> 8 & 255), U(n2, n2.gzhead.time >> 16 & 255), U(n2, n2.gzhead.time >> 24 & 255), U(n2, 9 === n2.level ? 2 : 2 <= n2.strategy || n2.level < 2 ? 4 : 0), U(n2, 255 & n2.gzhead.os), n2.gzhead.extra && n2.gzhead.extra.length && (U(n2, 255 & n2.gzhead.extra.length), U(n2, n2.gzhead.extra.length >> 8 & 255)), n2.gzhead.hcrc && (e2.adler = p2(e2.adler, n2.pending_buf, n2.pending, 0)), n2.gzindex = 0, n2.status = 69) : (U(n2, 0), U(n2, 0), U(n2, 0), U(n2, 0), U(n2, 0), U(n2, 9 === n2.level ? 2 : 2 <= n2.strategy || n2.level < 2 ? 4 : 0), U(n2, 3), n2.status = E);
          else {
            var a2 = v + (n2.w_bits - 8 << 4) << 8;
            a2 |= (2 <= n2.strategy || n2.level < 2 ? 0 : n2.level < 6 ? 1 : 6 === n2.level ? 2 : 3) << 6, 0 !== n2.strstart && (a2 |= 32), a2 += 31 - a2 % 31, n2.status = E, P2(n2, a2), 0 !== n2.strstart && (P2(n2, e2.adler >>> 16), P2(n2, 65535 & e2.adler)), e2.adler = 1;
          }
        if (69 === n2.status)
          if (n2.gzhead.extra) {
            for (i2 = n2.pending; n2.gzindex < (65535 & n2.gzhead.extra.length) && (n2.pending !== n2.pending_buf_size || (n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p2(e2.adler, n2.pending_buf, n2.pending - i2, i2)), F2(e2), i2 = n2.pending, n2.pending !== n2.pending_buf_size)); )
              U(n2, 255 & n2.gzhead.extra[n2.gzindex]), n2.gzindex++;
            n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p2(e2.adler, n2.pending_buf, n2.pending - i2, i2)), n2.gzindex === n2.gzhead.extra.length && (n2.gzindex = 0, n2.status = 73);
          } else
            n2.status = 73;
        if (73 === n2.status)
          if (n2.gzhead.name) {
            i2 = n2.pending;
            do {
              if (n2.pending === n2.pending_buf_size && (n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p2(e2.adler, n2.pending_buf, n2.pending - i2, i2)), F2(e2), i2 = n2.pending, n2.pending === n2.pending_buf_size)) {
                s2 = 1;
                break;
              }
              s2 = n2.gzindex < n2.gzhead.name.length ? 255 & n2.gzhead.name.charCodeAt(n2.gzindex++) : 0, U(n2, s2);
            } while (0 !== s2);
            n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p2(e2.adler, n2.pending_buf, n2.pending - i2, i2)), 0 === s2 && (n2.gzindex = 0, n2.status = 91);
          } else
            n2.status = 91;
        if (91 === n2.status)
          if (n2.gzhead.comment) {
            i2 = n2.pending;
            do {
              if (n2.pending === n2.pending_buf_size && (n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p2(e2.adler, n2.pending_buf, n2.pending - i2, i2)), F2(e2), i2 = n2.pending, n2.pending === n2.pending_buf_size)) {
                s2 = 1;
                break;
              }
              s2 = n2.gzindex < n2.gzhead.comment.length ? 255 & n2.gzhead.comment.charCodeAt(n2.gzindex++) : 0, U(n2, s2);
            } while (0 !== s2);
            n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p2(e2.adler, n2.pending_buf, n2.pending - i2, i2)), 0 === s2 && (n2.status = 103);
          } else
            n2.status = 103;
        if (103 === n2.status && (n2.gzhead.hcrc ? (n2.pending + 2 > n2.pending_buf_size && F2(e2), n2.pending + 2 <= n2.pending_buf_size && (U(n2, 255 & e2.adler), U(n2, e2.adler >> 8 & 255), e2.adler = 0, n2.status = E)) : n2.status = E), 0 !== n2.pending) {
          if (F2(e2), 0 === e2.avail_out)
            return n2.last_flush = -1, m;
        } else if (0 === e2.avail_in && T(t2) <= T(r2) && t2 !== f)
          return R2(e2, -5);
        if (666 === n2.status && 0 !== e2.avail_in)
          return R2(e2, -5);
        if (0 !== e2.avail_in || 0 !== n2.lookahead || t2 !== l && 666 !== n2.status) {
          var o2 = 2 === n2.strategy ? function(e3, t3) {
            for (var r3; ; ) {
              if (0 === e3.lookahead && (j(e3), 0 === e3.lookahead)) {
                if (t3 === l)
                  return A;
                break;
              }
              if (e3.match_length = 0, r3 = u._tr_tally(e3, 0, e3.window[e3.strstart]), e3.lookahead--, e3.strstart++, r3 && (N(e3, false), 0 === e3.strm.avail_out))
                return A;
            }
            return e3.insert = 0, t3 === f ? (N(e3, true), 0 === e3.strm.avail_out ? O : B) : e3.last_lit && (N(e3, false), 0 === e3.strm.avail_out) ? A : I;
          }(n2, t2) : 3 === n2.strategy ? function(e3, t3) {
            for (var r3, n3, i3, s3, a3 = e3.window; ; ) {
              if (e3.lookahead <= S2) {
                if (j(e3), e3.lookahead <= S2 && t3 === l)
                  return A;
                if (0 === e3.lookahead)
                  break;
              }
              if (e3.match_length = 0, e3.lookahead >= x && 0 < e3.strstart && (n3 = a3[i3 = e3.strstart - 1]) === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3]) {
                s3 = e3.strstart + S2;
                do {
                } while (n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && i3 < s3);
                e3.match_length = S2 - (s3 - i3), e3.match_length > e3.lookahead && (e3.match_length = e3.lookahead);
              }
              if (e3.match_length >= x ? (r3 = u._tr_tally(e3, 1, e3.match_length - x), e3.lookahead -= e3.match_length, e3.strstart += e3.match_length, e3.match_length = 0) : (r3 = u._tr_tally(e3, 0, e3.window[e3.strstart]), e3.lookahead--, e3.strstart++), r3 && (N(e3, false), 0 === e3.strm.avail_out))
                return A;
            }
            return e3.insert = 0, t3 === f ? (N(e3, true), 0 === e3.strm.avail_out ? O : B) : e3.last_lit && (N(e3, false), 0 === e3.strm.avail_out) ? A : I;
          }(n2, t2) : h2[n2.level].func(n2, t2);
          if (o2 !== O && o2 !== B || (n2.status = 666), o2 === A || o2 === O)
            return 0 === e2.avail_out && (n2.last_flush = -1), m;
          if (o2 === I && (1 === t2 ? u._tr_align(n2) : 5 !== t2 && (u._tr_stored_block(n2, 0, 0, false), 3 === t2 && (D(n2.head), 0 === n2.lookahead && (n2.strstart = 0, n2.block_start = 0, n2.insert = 0))), F2(e2), 0 === e2.avail_out))
            return n2.last_flush = -1, m;
        }
        return t2 !== f ? m : n2.wrap <= 0 ? 1 : (2 === n2.wrap ? (U(n2, 255 & e2.adler), U(n2, e2.adler >> 8 & 255), U(n2, e2.adler >> 16 & 255), U(n2, e2.adler >> 24 & 255), U(n2, 255 & e2.total_in), U(n2, e2.total_in >> 8 & 255), U(n2, e2.total_in >> 16 & 255), U(n2, e2.total_in >> 24 & 255)) : (P2(n2, e2.adler >>> 16), P2(n2, 65535 & e2.adler)), F2(e2), 0 < n2.wrap && (n2.wrap = -n2.wrap), 0 !== n2.pending ? m : 1);
      }, r.deflateEnd = function(e2) {
        var t2;
        return e2 && e2.state ? (t2 = e2.state.status) !== C2 && 69 !== t2 && 73 !== t2 && 91 !== t2 && 103 !== t2 && t2 !== E && 666 !== t2 ? R2(e2, _) : (e2.state = null, t2 === E ? R2(e2, -3) : m) : _;
      }, r.deflateSetDictionary = function(e2, t2) {
        var r2, n2, i2, s2, a2, o2, h3, u2, l2 = t2.length;
        if (!e2 || !e2.state)
          return _;
        if (2 === (s2 = (r2 = e2.state).wrap) || 1 === s2 && r2.status !== C2 || r2.lookahead)
          return _;
        for (1 === s2 && (e2.adler = d(e2.adler, t2, l2, 0)), r2.wrap = 0, l2 >= r2.w_size && (0 === s2 && (D(r2.head), r2.strstart = 0, r2.block_start = 0, r2.insert = 0), u2 = new c.Buf8(r2.w_size), c.arraySet(u2, t2, l2 - r2.w_size, r2.w_size, 0), t2 = u2, l2 = r2.w_size), a2 = e2.avail_in, o2 = e2.next_in, h3 = e2.input, e2.avail_in = l2, e2.next_in = 0, e2.input = t2, j(r2); r2.lookahead >= x; ) {
          for (n2 = r2.strstart, i2 = r2.lookahead - (x - 1); r2.ins_h = (r2.ins_h << r2.hash_shift ^ r2.window[n2 + x - 1]) & r2.hash_mask, r2.prev[n2 & r2.w_mask] = r2.head[r2.ins_h], r2.head[r2.ins_h] = n2, n2++, --i2; )
            ;
          r2.strstart = n2, r2.lookahead = x - 1, j(r2);
        }
        return r2.strstart += r2.lookahead, r2.block_start = r2.strstart, r2.insert = r2.lookahead, r2.lookahead = 0, r2.match_length = r2.prev_length = x - 1, r2.match_available = 0, e2.next_in = o2, e2.input = h3, e2.avail_in = a2, r2.wrap = s2, m;
      }, r.deflateInfo = "pako deflate (from Nodeca project)";
    }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function(e, t, r) {
      t.exports = function() {
        this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = false;
      };
    }, {}], 48: [function(e, t, r) {
      t.exports = function(e2, t2) {
        var r2, n, i, s, a, o, h2, u, l, f, c, d, p2, m, _, g, b, v, y, w, k, x, S2, z, C2;
        r2 = e2.state, n = e2.next_in, z = e2.input, i = n + (e2.avail_in - 5), s = e2.next_out, C2 = e2.output, a = s - (t2 - e2.avail_out), o = s + (e2.avail_out - 257), h2 = r2.dmax, u = r2.wsize, l = r2.whave, f = r2.wnext, c = r2.window, d = r2.hold, p2 = r2.bits, m = r2.lencode, _ = r2.distcode, g = (1 << r2.lenbits) - 1, b = (1 << r2.distbits) - 1;
        e:
          do {
            p2 < 15 && (d += z[n++] << p2, p2 += 8, d += z[n++] << p2, p2 += 8), v = m[d & g];
            t:
              for (; ; ) {
                if (d >>>= y = v >>> 24, p2 -= y, 0 === (y = v >>> 16 & 255))
                  C2[s++] = 65535 & v;
                else {
                  if (!(16 & y)) {
                    if (0 == (64 & y)) {
                      v = m[(65535 & v) + (d & (1 << y) - 1)];
                      continue t;
                    }
                    if (32 & y) {
                      r2.mode = 12;
                      break e;
                    }
                    e2.msg = "invalid literal/length code", r2.mode = 30;
                    break e;
                  }
                  w = 65535 & v, (y &= 15) && (p2 < y && (d += z[n++] << p2, p2 += 8), w += d & (1 << y) - 1, d >>>= y, p2 -= y), p2 < 15 && (d += z[n++] << p2, p2 += 8, d += z[n++] << p2, p2 += 8), v = _[d & b];
                  r:
                    for (; ; ) {
                      if (d >>>= y = v >>> 24, p2 -= y, !(16 & (y = v >>> 16 & 255))) {
                        if (0 == (64 & y)) {
                          v = _[(65535 & v) + (d & (1 << y) - 1)];
                          continue r;
                        }
                        e2.msg = "invalid distance code", r2.mode = 30;
                        break e;
                      }
                      if (k = 65535 & v, p2 < (y &= 15) && (d += z[n++] << p2, (p2 += 8) < y && (d += z[n++] << p2, p2 += 8)), h2 < (k += d & (1 << y) - 1)) {
                        e2.msg = "invalid distance too far back", r2.mode = 30;
                        break e;
                      }
                      if (d >>>= y, p2 -= y, (y = s - a) < k) {
                        if (l < (y = k - y) && r2.sane) {
                          e2.msg = "invalid distance too far back", r2.mode = 30;
                          break e;
                        }
                        if (S2 = c, (x = 0) === f) {
                          if (x += u - y, y < w) {
                            for (w -= y; C2[s++] = c[x++], --y; )
                              ;
                            x = s - k, S2 = C2;
                          }
                        } else if (f < y) {
                          if (x += u + f - y, (y -= f) < w) {
                            for (w -= y; C2[s++] = c[x++], --y; )
                              ;
                            if (x = 0, f < w) {
                              for (w -= y = f; C2[s++] = c[x++], --y; )
                                ;
                              x = s - k, S2 = C2;
                            }
                          }
                        } else if (x += f - y, y < w) {
                          for (w -= y; C2[s++] = c[x++], --y; )
                            ;
                          x = s - k, S2 = C2;
                        }
                        for (; 2 < w; )
                          C2[s++] = S2[x++], C2[s++] = S2[x++], C2[s++] = S2[x++], w -= 3;
                        w && (C2[s++] = S2[x++], 1 < w && (C2[s++] = S2[x++]));
                      } else {
                        for (x = s - k; C2[s++] = C2[x++], C2[s++] = C2[x++], C2[s++] = C2[x++], 2 < (w -= 3); )
                          ;
                        w && (C2[s++] = C2[x++], 1 < w && (C2[s++] = C2[x++]));
                      }
                      break;
                    }
                }
                break;
              }
          } while (n < i && s < o);
        n -= w = p2 >> 3, d &= (1 << (p2 -= w << 3)) - 1, e2.next_in = n, e2.next_out = s, e2.avail_in = n < i ? i - n + 5 : 5 - (n - i), e2.avail_out = s < o ? o - s + 257 : 257 - (s - o), r2.hold = d, r2.bits = p2;
      };
    }, {}], 49: [function(e, t, r) {
      var I = e("../utils/common"), O = e("./adler32"), B = e("./crc32"), R2 = e("./inffast"), T = e("./inftrees"), D = 1, F2 = 2, N = 0, U = -2, P2 = 1, n = 852, i = 592;
      function L(e2) {
        return (e2 >>> 24 & 255) + (e2 >>> 8 & 65280) + ((65280 & e2) << 8) + ((255 & e2) << 24);
      }
      function s() {
        this.mode = 0, this.last = false, this.wrap = 0, this.havedict = false, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new I.Buf16(320), this.work = new I.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
      }
      function a(e2) {
        var t2;
        return e2 && e2.state ? (t2 = e2.state, e2.total_in = e2.total_out = t2.total = 0, e2.msg = "", t2.wrap && (e2.adler = 1 & t2.wrap), t2.mode = P2, t2.last = 0, t2.havedict = 0, t2.dmax = 32768, t2.head = null, t2.hold = 0, t2.bits = 0, t2.lencode = t2.lendyn = new I.Buf32(n), t2.distcode = t2.distdyn = new I.Buf32(i), t2.sane = 1, t2.back = -1, N) : U;
      }
      function o(e2) {
        var t2;
        return e2 && e2.state ? ((t2 = e2.state).wsize = 0, t2.whave = 0, t2.wnext = 0, a(e2)) : U;
      }
      function h2(e2, t2) {
        var r2, n2;
        return e2 && e2.state ? (n2 = e2.state, t2 < 0 ? (r2 = 0, t2 = -t2) : (r2 = 1 + (t2 >> 4), t2 < 48 && (t2 &= 15)), t2 && (t2 < 8 || 15 < t2) ? U : (null !== n2.window && n2.wbits !== t2 && (n2.window = null), n2.wrap = r2, n2.wbits = t2, o(e2))) : U;
      }
      function u(e2, t2) {
        var r2, n2;
        return e2 ? (n2 = new s(), (e2.state = n2).window = null, (r2 = h2(e2, t2)) !== N && (e2.state = null), r2) : U;
      }
      var l, f, c = true;
      function j(e2) {
        if (c) {
          var t2;
          for (l = new I.Buf32(512), f = new I.Buf32(32), t2 = 0; t2 < 144; )
            e2.lens[t2++] = 8;
          for (; t2 < 256; )
            e2.lens[t2++] = 9;
          for (; t2 < 280; )
            e2.lens[t2++] = 7;
          for (; t2 < 288; )
            e2.lens[t2++] = 8;
          for (T(D, e2.lens, 0, 288, l, 0, e2.work, { bits: 9 }), t2 = 0; t2 < 32; )
            e2.lens[t2++] = 5;
          T(F2, e2.lens, 0, 32, f, 0, e2.work, { bits: 5 }), c = false;
        }
        e2.lencode = l, e2.lenbits = 9, e2.distcode = f, e2.distbits = 5;
      }
      function Z2(e2, t2, r2, n2) {
        var i2, s2 = e2.state;
        return null === s2.window && (s2.wsize = 1 << s2.wbits, s2.wnext = 0, s2.whave = 0, s2.window = new I.Buf8(s2.wsize)), n2 >= s2.wsize ? (I.arraySet(s2.window, t2, r2 - s2.wsize, s2.wsize, 0), s2.wnext = 0, s2.whave = s2.wsize) : (n2 < (i2 = s2.wsize - s2.wnext) && (i2 = n2), I.arraySet(s2.window, t2, r2 - n2, i2, s2.wnext), (n2 -= i2) ? (I.arraySet(s2.window, t2, r2 - n2, n2, 0), s2.wnext = n2, s2.whave = s2.wsize) : (s2.wnext += i2, s2.wnext === s2.wsize && (s2.wnext = 0), s2.whave < s2.wsize && (s2.whave += i2))), 0;
      }
      r.inflateReset = o, r.inflateReset2 = h2, r.inflateResetKeep = a, r.inflateInit = function(e2) {
        return u(e2, 15);
      }, r.inflateInit2 = u, r.inflate = function(e2, t2) {
        var r2, n2, i2, s2, a2, o2, h3, u2, l2, f2, c2, d, p2, m, _, g, b, v, y, w, k, x, S2, z, C2 = 0, E = new I.Buf8(4), A = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
        if (!e2 || !e2.state || !e2.output || !e2.input && 0 !== e2.avail_in)
          return U;
        12 === (r2 = e2.state).mode && (r2.mode = 13), a2 = e2.next_out, i2 = e2.output, h3 = e2.avail_out, s2 = e2.next_in, n2 = e2.input, o2 = e2.avail_in, u2 = r2.hold, l2 = r2.bits, f2 = o2, c2 = h3, x = N;
        e:
          for (; ; )
            switch (r2.mode) {
              case P2:
                if (0 === r2.wrap) {
                  r2.mode = 13;
                  break;
                }
                for (; l2 < 16; ) {
                  if (0 === o2)
                    break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                if (2 & r2.wrap && 35615 === u2) {
                  E[r2.check = 0] = 255 & u2, E[1] = u2 >>> 8 & 255, r2.check = B(r2.check, E, 2, 0), l2 = u2 = 0, r2.mode = 2;
                  break;
                }
                if (r2.flags = 0, r2.head && (r2.head.done = false), !(1 & r2.wrap) || (((255 & u2) << 8) + (u2 >> 8)) % 31) {
                  e2.msg = "incorrect header check", r2.mode = 30;
                  break;
                }
                if (8 != (15 & u2)) {
                  e2.msg = "unknown compression method", r2.mode = 30;
                  break;
                }
                if (l2 -= 4, k = 8 + (15 & (u2 >>>= 4)), 0 === r2.wbits)
                  r2.wbits = k;
                else if (k > r2.wbits) {
                  e2.msg = "invalid window size", r2.mode = 30;
                  break;
                }
                r2.dmax = 1 << k, e2.adler = r2.check = 1, r2.mode = 512 & u2 ? 10 : 12, l2 = u2 = 0;
                break;
              case 2:
                for (; l2 < 16; ) {
                  if (0 === o2)
                    break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                if (r2.flags = u2, 8 != (255 & r2.flags)) {
                  e2.msg = "unknown compression method", r2.mode = 30;
                  break;
                }
                if (57344 & r2.flags) {
                  e2.msg = "unknown header flags set", r2.mode = 30;
                  break;
                }
                r2.head && (r2.head.text = u2 >> 8 & 1), 512 & r2.flags && (E[0] = 255 & u2, E[1] = u2 >>> 8 & 255, r2.check = B(r2.check, E, 2, 0)), l2 = u2 = 0, r2.mode = 3;
              case 3:
                for (; l2 < 32; ) {
                  if (0 === o2)
                    break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                r2.head && (r2.head.time = u2), 512 & r2.flags && (E[0] = 255 & u2, E[1] = u2 >>> 8 & 255, E[2] = u2 >>> 16 & 255, E[3] = u2 >>> 24 & 255, r2.check = B(r2.check, E, 4, 0)), l2 = u2 = 0, r2.mode = 4;
              case 4:
                for (; l2 < 16; ) {
                  if (0 === o2)
                    break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                r2.head && (r2.head.xflags = 255 & u2, r2.head.os = u2 >> 8), 512 & r2.flags && (E[0] = 255 & u2, E[1] = u2 >>> 8 & 255, r2.check = B(r2.check, E, 2, 0)), l2 = u2 = 0, r2.mode = 5;
              case 5:
                if (1024 & r2.flags) {
                  for (; l2 < 16; ) {
                    if (0 === o2)
                      break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  r2.length = u2, r2.head && (r2.head.extra_len = u2), 512 & r2.flags && (E[0] = 255 & u2, E[1] = u2 >>> 8 & 255, r2.check = B(r2.check, E, 2, 0)), l2 = u2 = 0;
                } else
                  r2.head && (r2.head.extra = null);
                r2.mode = 6;
              case 6:
                if (1024 & r2.flags && (o2 < (d = r2.length) && (d = o2), d && (r2.head && (k = r2.head.extra_len - r2.length, r2.head.extra || (r2.head.extra = new Array(r2.head.extra_len)), I.arraySet(r2.head.extra, n2, s2, d, k)), 512 & r2.flags && (r2.check = B(r2.check, n2, d, s2)), o2 -= d, s2 += d, r2.length -= d), r2.length))
                  break e;
                r2.length = 0, r2.mode = 7;
              case 7:
                if (2048 & r2.flags) {
                  if (0 === o2)
                    break e;
                  for (d = 0; k = n2[s2 + d++], r2.head && k && r2.length < 65536 && (r2.head.name += String.fromCharCode(k)), k && d < o2; )
                    ;
                  if (512 & r2.flags && (r2.check = B(r2.check, n2, d, s2)), o2 -= d, s2 += d, k)
                    break e;
                } else
                  r2.head && (r2.head.name = null);
                r2.length = 0, r2.mode = 8;
              case 8:
                if (4096 & r2.flags) {
                  if (0 === o2)
                    break e;
                  for (d = 0; k = n2[s2 + d++], r2.head && k && r2.length < 65536 && (r2.head.comment += String.fromCharCode(k)), k && d < o2; )
                    ;
                  if (512 & r2.flags && (r2.check = B(r2.check, n2, d, s2)), o2 -= d, s2 += d, k)
                    break e;
                } else
                  r2.head && (r2.head.comment = null);
                r2.mode = 9;
              case 9:
                if (512 & r2.flags) {
                  for (; l2 < 16; ) {
                    if (0 === o2)
                      break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  if (u2 !== (65535 & r2.check)) {
                    e2.msg = "header crc mismatch", r2.mode = 30;
                    break;
                  }
                  l2 = u2 = 0;
                }
                r2.head && (r2.head.hcrc = r2.flags >> 9 & 1, r2.head.done = true), e2.adler = r2.check = 0, r2.mode = 12;
                break;
              case 10:
                for (; l2 < 32; ) {
                  if (0 === o2)
                    break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                e2.adler = r2.check = L(u2), l2 = u2 = 0, r2.mode = 11;
              case 11:
                if (0 === r2.havedict)
                  return e2.next_out = a2, e2.avail_out = h3, e2.next_in = s2, e2.avail_in = o2, r2.hold = u2, r2.bits = l2, 2;
                e2.adler = r2.check = 1, r2.mode = 12;
              case 12:
                if (5 === t2 || 6 === t2)
                  break e;
              case 13:
                if (r2.last) {
                  u2 >>>= 7 & l2, l2 -= 7 & l2, r2.mode = 27;
                  break;
                }
                for (; l2 < 3; ) {
                  if (0 === o2)
                    break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                switch (r2.last = 1 & u2, l2 -= 1, 3 & (u2 >>>= 1)) {
                  case 0:
                    r2.mode = 14;
                    break;
                  case 1:
                    if (j(r2), r2.mode = 20, 6 !== t2)
                      break;
                    u2 >>>= 2, l2 -= 2;
                    break e;
                  case 2:
                    r2.mode = 17;
                    break;
                  case 3:
                    e2.msg = "invalid block type", r2.mode = 30;
                }
                u2 >>>= 2, l2 -= 2;
                break;
              case 14:
                for (u2 >>>= 7 & l2, l2 -= 7 & l2; l2 < 32; ) {
                  if (0 === o2)
                    break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                if ((65535 & u2) != (u2 >>> 16 ^ 65535)) {
                  e2.msg = "invalid stored block lengths", r2.mode = 30;
                  break;
                }
                if (r2.length = 65535 & u2, l2 = u2 = 0, r2.mode = 15, 6 === t2)
                  break e;
              case 15:
                r2.mode = 16;
              case 16:
                if (d = r2.length) {
                  if (o2 < d && (d = o2), h3 < d && (d = h3), 0 === d)
                    break e;
                  I.arraySet(i2, n2, s2, d, a2), o2 -= d, s2 += d, h3 -= d, a2 += d, r2.length -= d;
                  break;
                }
                r2.mode = 12;
                break;
              case 17:
                for (; l2 < 14; ) {
                  if (0 === o2)
                    break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                if (r2.nlen = 257 + (31 & u2), u2 >>>= 5, l2 -= 5, r2.ndist = 1 + (31 & u2), u2 >>>= 5, l2 -= 5, r2.ncode = 4 + (15 & u2), u2 >>>= 4, l2 -= 4, 286 < r2.nlen || 30 < r2.ndist) {
                  e2.msg = "too many length or distance symbols", r2.mode = 30;
                  break;
                }
                r2.have = 0, r2.mode = 18;
              case 18:
                for (; r2.have < r2.ncode; ) {
                  for (; l2 < 3; ) {
                    if (0 === o2)
                      break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  r2.lens[A[r2.have++]] = 7 & u2, u2 >>>= 3, l2 -= 3;
                }
                for (; r2.have < 19; )
                  r2.lens[A[r2.have++]] = 0;
                if (r2.lencode = r2.lendyn, r2.lenbits = 7, S2 = { bits: r2.lenbits }, x = T(0, r2.lens, 0, 19, r2.lencode, 0, r2.work, S2), r2.lenbits = S2.bits, x) {
                  e2.msg = "invalid code lengths set", r2.mode = 30;
                  break;
                }
                r2.have = 0, r2.mode = 19;
              case 19:
                for (; r2.have < r2.nlen + r2.ndist; ) {
                  for (; g = (C2 = r2.lencode[u2 & (1 << r2.lenbits) - 1]) >>> 16 & 255, b = 65535 & C2, !((_ = C2 >>> 24) <= l2); ) {
                    if (0 === o2)
                      break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  if (b < 16)
                    u2 >>>= _, l2 -= _, r2.lens[r2.have++] = b;
                  else {
                    if (16 === b) {
                      for (z = _ + 2; l2 < z; ) {
                        if (0 === o2)
                          break e;
                        o2--, u2 += n2[s2++] << l2, l2 += 8;
                      }
                      if (u2 >>>= _, l2 -= _, 0 === r2.have) {
                        e2.msg = "invalid bit length repeat", r2.mode = 30;
                        break;
                      }
                      k = r2.lens[r2.have - 1], d = 3 + (3 & u2), u2 >>>= 2, l2 -= 2;
                    } else if (17 === b) {
                      for (z = _ + 3; l2 < z; ) {
                        if (0 === o2)
                          break e;
                        o2--, u2 += n2[s2++] << l2, l2 += 8;
                      }
                      l2 -= _, k = 0, d = 3 + (7 & (u2 >>>= _)), u2 >>>= 3, l2 -= 3;
                    } else {
                      for (z = _ + 7; l2 < z; ) {
                        if (0 === o2)
                          break e;
                        o2--, u2 += n2[s2++] << l2, l2 += 8;
                      }
                      l2 -= _, k = 0, d = 11 + (127 & (u2 >>>= _)), u2 >>>= 7, l2 -= 7;
                    }
                    if (r2.have + d > r2.nlen + r2.ndist) {
                      e2.msg = "invalid bit length repeat", r2.mode = 30;
                      break;
                    }
                    for (; d--; )
                      r2.lens[r2.have++] = k;
                  }
                }
                if (30 === r2.mode)
                  break;
                if (0 === r2.lens[256]) {
                  e2.msg = "invalid code -- missing end-of-block", r2.mode = 30;
                  break;
                }
                if (r2.lenbits = 9, S2 = { bits: r2.lenbits }, x = T(D, r2.lens, 0, r2.nlen, r2.lencode, 0, r2.work, S2), r2.lenbits = S2.bits, x) {
                  e2.msg = "invalid literal/lengths set", r2.mode = 30;
                  break;
                }
                if (r2.distbits = 6, r2.distcode = r2.distdyn, S2 = { bits: r2.distbits }, x = T(F2, r2.lens, r2.nlen, r2.ndist, r2.distcode, 0, r2.work, S2), r2.distbits = S2.bits, x) {
                  e2.msg = "invalid distances set", r2.mode = 30;
                  break;
                }
                if (r2.mode = 20, 6 === t2)
                  break e;
              case 20:
                r2.mode = 21;
              case 21:
                if (6 <= o2 && 258 <= h3) {
                  e2.next_out = a2, e2.avail_out = h3, e2.next_in = s2, e2.avail_in = o2, r2.hold = u2, r2.bits = l2, R2(e2, c2), a2 = e2.next_out, i2 = e2.output, h3 = e2.avail_out, s2 = e2.next_in, n2 = e2.input, o2 = e2.avail_in, u2 = r2.hold, l2 = r2.bits, 12 === r2.mode && (r2.back = -1);
                  break;
                }
                for (r2.back = 0; g = (C2 = r2.lencode[u2 & (1 << r2.lenbits) - 1]) >>> 16 & 255, b = 65535 & C2, !((_ = C2 >>> 24) <= l2); ) {
                  if (0 === o2)
                    break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                if (g && 0 == (240 & g)) {
                  for (v = _, y = g, w = b; g = (C2 = r2.lencode[w + ((u2 & (1 << v + y) - 1) >> v)]) >>> 16 & 255, b = 65535 & C2, !(v + (_ = C2 >>> 24) <= l2); ) {
                    if (0 === o2)
                      break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  u2 >>>= v, l2 -= v, r2.back += v;
                }
                if (u2 >>>= _, l2 -= _, r2.back += _, r2.length = b, 0 === g) {
                  r2.mode = 26;
                  break;
                }
                if (32 & g) {
                  r2.back = -1, r2.mode = 12;
                  break;
                }
                if (64 & g) {
                  e2.msg = "invalid literal/length code", r2.mode = 30;
                  break;
                }
                r2.extra = 15 & g, r2.mode = 22;
              case 22:
                if (r2.extra) {
                  for (z = r2.extra; l2 < z; ) {
                    if (0 === o2)
                      break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  r2.length += u2 & (1 << r2.extra) - 1, u2 >>>= r2.extra, l2 -= r2.extra, r2.back += r2.extra;
                }
                r2.was = r2.length, r2.mode = 23;
              case 23:
                for (; g = (C2 = r2.distcode[u2 & (1 << r2.distbits) - 1]) >>> 16 & 255, b = 65535 & C2, !((_ = C2 >>> 24) <= l2); ) {
                  if (0 === o2)
                    break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                if (0 == (240 & g)) {
                  for (v = _, y = g, w = b; g = (C2 = r2.distcode[w + ((u2 & (1 << v + y) - 1) >> v)]) >>> 16 & 255, b = 65535 & C2, !(v + (_ = C2 >>> 24) <= l2); ) {
                    if (0 === o2)
                      break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  u2 >>>= v, l2 -= v, r2.back += v;
                }
                if (u2 >>>= _, l2 -= _, r2.back += _, 64 & g) {
                  e2.msg = "invalid distance code", r2.mode = 30;
                  break;
                }
                r2.offset = b, r2.extra = 15 & g, r2.mode = 24;
              case 24:
                if (r2.extra) {
                  for (z = r2.extra; l2 < z; ) {
                    if (0 === o2)
                      break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  r2.offset += u2 & (1 << r2.extra) - 1, u2 >>>= r2.extra, l2 -= r2.extra, r2.back += r2.extra;
                }
                if (r2.offset > r2.dmax) {
                  e2.msg = "invalid distance too far back", r2.mode = 30;
                  break;
                }
                r2.mode = 25;
              case 25:
                if (0 === h3)
                  break e;
                if (d = c2 - h3, r2.offset > d) {
                  if ((d = r2.offset - d) > r2.whave && r2.sane) {
                    e2.msg = "invalid distance too far back", r2.mode = 30;
                    break;
                  }
                  p2 = d > r2.wnext ? (d -= r2.wnext, r2.wsize - d) : r2.wnext - d, d > r2.length && (d = r2.length), m = r2.window;
                } else
                  m = i2, p2 = a2 - r2.offset, d = r2.length;
                for (h3 < d && (d = h3), h3 -= d, r2.length -= d; i2[a2++] = m[p2++], --d; )
                  ;
                0 === r2.length && (r2.mode = 21);
                break;
              case 26:
                if (0 === h3)
                  break e;
                i2[a2++] = r2.length, h3--, r2.mode = 21;
                break;
              case 27:
                if (r2.wrap) {
                  for (; l2 < 32; ) {
                    if (0 === o2)
                      break e;
                    o2--, u2 |= n2[s2++] << l2, l2 += 8;
                  }
                  if (c2 -= h3, e2.total_out += c2, r2.total += c2, c2 && (e2.adler = r2.check = r2.flags ? B(r2.check, i2, c2, a2 - c2) : O(r2.check, i2, c2, a2 - c2)), c2 = h3, (r2.flags ? u2 : L(u2)) !== r2.check) {
                    e2.msg = "incorrect data check", r2.mode = 30;
                    break;
                  }
                  l2 = u2 = 0;
                }
                r2.mode = 28;
              case 28:
                if (r2.wrap && r2.flags) {
                  for (; l2 < 32; ) {
                    if (0 === o2)
                      break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  if (u2 !== (4294967295 & r2.total)) {
                    e2.msg = "incorrect length check", r2.mode = 30;
                    break;
                  }
                  l2 = u2 = 0;
                }
                r2.mode = 29;
              case 29:
                x = 1;
                break e;
              case 30:
                x = -3;
                break e;
              case 31:
                return -4;
              case 32:
              default:
                return U;
            }
        return e2.next_out = a2, e2.avail_out = h3, e2.next_in = s2, e2.avail_in = o2, r2.hold = u2, r2.bits = l2, (r2.wsize || c2 !== e2.avail_out && r2.mode < 30 && (r2.mode < 27 || 4 !== t2)) && Z2(e2, e2.output, e2.next_out, c2 - e2.avail_out) ? (r2.mode = 31, -4) : (f2 -= e2.avail_in, c2 -= e2.avail_out, e2.total_in += f2, e2.total_out += c2, r2.total += c2, r2.wrap && c2 && (e2.adler = r2.check = r2.flags ? B(r2.check, i2, c2, e2.next_out - c2) : O(r2.check, i2, c2, e2.next_out - c2)), e2.data_type = r2.bits + (r2.last ? 64 : 0) + (12 === r2.mode ? 128 : 0) + (20 === r2.mode || 15 === r2.mode ? 256 : 0), (0 == f2 && 0 === c2 || 4 === t2) && x === N && (x = -5), x);
      }, r.inflateEnd = function(e2) {
        if (!e2 || !e2.state)
          return U;
        var t2 = e2.state;
        return t2.window && (t2.window = null), e2.state = null, N;
      }, r.inflateGetHeader = function(e2, t2) {
        var r2;
        return e2 && e2.state ? 0 == (2 & (r2 = e2.state).wrap) ? U : ((r2.head = t2).done = false, N) : U;
      }, r.inflateSetDictionary = function(e2, t2) {
        var r2, n2 = t2.length;
        return e2 && e2.state ? 0 !== (r2 = e2.state).wrap && 11 !== r2.mode ? U : 11 === r2.mode && O(1, t2, n2, 0) !== r2.check ? -3 : Z2(e2, t2, n2, n2) ? (r2.mode = 31, -4) : (r2.havedict = 1, N) : U;
      }, r.inflateInfo = "pako inflate (from Nodeca project)";
    }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(e, t, r) {
      var D = e("../utils/common"), F2 = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], N = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], U = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], P2 = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
      t.exports = function(e2, t2, r2, n, i, s, a, o) {
        var h2, u, l, f, c, d, p2, m, _, g = o.bits, b = 0, v = 0, y = 0, w = 0, k = 0, x = 0, S2 = 0, z = 0, C2 = 0, E = 0, A = null, I = 0, O = new D.Buf16(16), B = new D.Buf16(16), R2 = null, T = 0;
        for (b = 0; b <= 15; b++)
          O[b] = 0;
        for (v = 0; v < n; v++)
          O[t2[r2 + v]]++;
        for (k = g, w = 15; 1 <= w && 0 === O[w]; w--)
          ;
        if (w < k && (k = w), 0 === w)
          return i[s++] = 20971520, i[s++] = 20971520, o.bits = 1, 0;
        for (y = 1; y < w && 0 === O[y]; y++)
          ;
        for (k < y && (k = y), b = z = 1; b <= 15; b++)
          if (z <<= 1, (z -= O[b]) < 0)
            return -1;
        if (0 < z && (0 === e2 || 1 !== w))
          return -1;
        for (B[1] = 0, b = 1; b < 15; b++)
          B[b + 1] = B[b] + O[b];
        for (v = 0; v < n; v++)
          0 !== t2[r2 + v] && (a[B[t2[r2 + v]]++] = v);
        if (d = 0 === e2 ? (A = R2 = a, 19) : 1 === e2 ? (A = F2, I -= 257, R2 = N, T -= 257, 256) : (A = U, R2 = P2, -1), b = y, c = s, S2 = v = E = 0, l = -1, f = (C2 = 1 << (x = k)) - 1, 1 === e2 && 852 < C2 || 2 === e2 && 592 < C2)
          return 1;
        for (; ; ) {
          for (p2 = b - S2, _ = a[v] < d ? (m = 0, a[v]) : a[v] > d ? (m = R2[T + a[v]], A[I + a[v]]) : (m = 96, 0), h2 = 1 << b - S2, y = u = 1 << x; i[c + (E >> S2) + (u -= h2)] = p2 << 24 | m << 16 | _ | 0, 0 !== u; )
            ;
          for (h2 = 1 << b - 1; E & h2; )
            h2 >>= 1;
          if (0 !== h2 ? (E &= h2 - 1, E += h2) : E = 0, v++, 0 == --O[b]) {
            if (b === w)
              break;
            b = t2[r2 + a[v]];
          }
          if (k < b && (E & f) !== l) {
            for (0 === S2 && (S2 = k), c += y, z = 1 << (x = b - S2); x + S2 < w && !((z -= O[x + S2]) <= 0); )
              x++, z <<= 1;
            if (C2 += 1 << x, 1 === e2 && 852 < C2 || 2 === e2 && 592 < C2)
              return 1;
            i[l = E & f] = k << 24 | x << 16 | c - s | 0;
          }
        }
        return 0 !== E && (i[c + E] = b - S2 << 24 | 64 << 16 | 0), o.bits = k, 0;
      };
    }, { "../utils/common": 41 }], 51: [function(e, t, r) {
      t.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
    }, {}], 52: [function(e, t, r) {
      var i = e("../utils/common"), o = 0, h2 = 1;
      function n(e2) {
        for (var t2 = e2.length; 0 <= --t2; )
          e2[t2] = 0;
      }
      var s = 0, a = 29, u = 256, l = u + 1 + a, f = 30, c = 19, _ = 2 * l + 1, g = 15, d = 16, p2 = 7, m = 256, b = 16, v = 17, y = 18, w = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], k = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], x = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], S2 = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], z = new Array(2 * (l + 2));
      n(z);
      var C2 = new Array(2 * f);
      n(C2);
      var E = new Array(512);
      n(E);
      var A = new Array(256);
      n(A);
      var I = new Array(a);
      n(I);
      var O, B, R2, T = new Array(f);
      function D(e2, t2, r2, n2, i2) {
        this.static_tree = e2, this.extra_bits = t2, this.extra_base = r2, this.elems = n2, this.max_length = i2, this.has_stree = e2 && e2.length;
      }
      function F2(e2, t2) {
        this.dyn_tree = e2, this.max_code = 0, this.stat_desc = t2;
      }
      function N(e2) {
        return e2 < 256 ? E[e2] : E[256 + (e2 >>> 7)];
      }
      function U(e2, t2) {
        e2.pending_buf[e2.pending++] = 255 & t2, e2.pending_buf[e2.pending++] = t2 >>> 8 & 255;
      }
      function P2(e2, t2, r2) {
        e2.bi_valid > d - r2 ? (e2.bi_buf |= t2 << e2.bi_valid & 65535, U(e2, e2.bi_buf), e2.bi_buf = t2 >> d - e2.bi_valid, e2.bi_valid += r2 - d) : (e2.bi_buf |= t2 << e2.bi_valid & 65535, e2.bi_valid += r2);
      }
      function L(e2, t2, r2) {
        P2(e2, r2[2 * t2], r2[2 * t2 + 1]);
      }
      function j(e2, t2) {
        for (var r2 = 0; r2 |= 1 & e2, e2 >>>= 1, r2 <<= 1, 0 < --t2; )
          ;
        return r2 >>> 1;
      }
      function Z2(e2, t2, r2) {
        var n2, i2, s2 = new Array(g + 1), a2 = 0;
        for (n2 = 1; n2 <= g; n2++)
          s2[n2] = a2 = a2 + r2[n2 - 1] << 1;
        for (i2 = 0; i2 <= t2; i2++) {
          var o2 = e2[2 * i2 + 1];
          0 !== o2 && (e2[2 * i2] = j(s2[o2]++, o2));
        }
      }
      function W(e2) {
        var t2;
        for (t2 = 0; t2 < l; t2++)
          e2.dyn_ltree[2 * t2] = 0;
        for (t2 = 0; t2 < f; t2++)
          e2.dyn_dtree[2 * t2] = 0;
        for (t2 = 0; t2 < c; t2++)
          e2.bl_tree[2 * t2] = 0;
        e2.dyn_ltree[2 * m] = 1, e2.opt_len = e2.static_len = 0, e2.last_lit = e2.matches = 0;
      }
      function M2(e2) {
        8 < e2.bi_valid ? U(e2, e2.bi_buf) : 0 < e2.bi_valid && (e2.pending_buf[e2.pending++] = e2.bi_buf), e2.bi_buf = 0, e2.bi_valid = 0;
      }
      function H(e2, t2, r2, n2) {
        var i2 = 2 * t2, s2 = 2 * r2;
        return e2[i2] < e2[s2] || e2[i2] === e2[s2] && n2[t2] <= n2[r2];
      }
      function G(e2, t2, r2) {
        for (var n2 = e2.heap[r2], i2 = r2 << 1; i2 <= e2.heap_len && (i2 < e2.heap_len && H(t2, e2.heap[i2 + 1], e2.heap[i2], e2.depth) && i2++, !H(t2, n2, e2.heap[i2], e2.depth)); )
          e2.heap[r2] = e2.heap[i2], r2 = i2, i2 <<= 1;
        e2.heap[r2] = n2;
      }
      function K(e2, t2, r2) {
        var n2, i2, s2, a2, o2 = 0;
        if (0 !== e2.last_lit)
          for (; n2 = e2.pending_buf[e2.d_buf + 2 * o2] << 8 | e2.pending_buf[e2.d_buf + 2 * o2 + 1], i2 = e2.pending_buf[e2.l_buf + o2], o2++, 0 === n2 ? L(e2, i2, t2) : (L(e2, (s2 = A[i2]) + u + 1, t2), 0 !== (a2 = w[s2]) && P2(e2, i2 -= I[s2], a2), L(e2, s2 = N(--n2), r2), 0 !== (a2 = k[s2]) && P2(e2, n2 -= T[s2], a2)), o2 < e2.last_lit; )
            ;
        L(e2, m, t2);
      }
      function Y(e2, t2) {
        var r2, n2, i2, s2 = t2.dyn_tree, a2 = t2.stat_desc.static_tree, o2 = t2.stat_desc.has_stree, h3 = t2.stat_desc.elems, u2 = -1;
        for (e2.heap_len = 0, e2.heap_max = _, r2 = 0; r2 < h3; r2++)
          0 !== s2[2 * r2] ? (e2.heap[++e2.heap_len] = u2 = r2, e2.depth[r2] = 0) : s2[2 * r2 + 1] = 0;
        for (; e2.heap_len < 2; )
          s2[2 * (i2 = e2.heap[++e2.heap_len] = u2 < 2 ? ++u2 : 0)] = 1, e2.depth[i2] = 0, e2.opt_len--, o2 && (e2.static_len -= a2[2 * i2 + 1]);
        for (t2.max_code = u2, r2 = e2.heap_len >> 1; 1 <= r2; r2--)
          G(e2, s2, r2);
        for (i2 = h3; r2 = e2.heap[1], e2.heap[1] = e2.heap[e2.heap_len--], G(e2, s2, 1), n2 = e2.heap[1], e2.heap[--e2.heap_max] = r2, e2.heap[--e2.heap_max] = n2, s2[2 * i2] = s2[2 * r2] + s2[2 * n2], e2.depth[i2] = (e2.depth[r2] >= e2.depth[n2] ? e2.depth[r2] : e2.depth[n2]) + 1, s2[2 * r2 + 1] = s2[2 * n2 + 1] = i2, e2.heap[1] = i2++, G(e2, s2, 1), 2 <= e2.heap_len; )
          ;
        e2.heap[--e2.heap_max] = e2.heap[1], function(e3, t3) {
          var r3, n3, i3, s3, a3, o3, h4 = t3.dyn_tree, u3 = t3.max_code, l2 = t3.stat_desc.static_tree, f2 = t3.stat_desc.has_stree, c2 = t3.stat_desc.extra_bits, d2 = t3.stat_desc.extra_base, p3 = t3.stat_desc.max_length, m2 = 0;
          for (s3 = 0; s3 <= g; s3++)
            e3.bl_count[s3] = 0;
          for (h4[2 * e3.heap[e3.heap_max] + 1] = 0, r3 = e3.heap_max + 1; r3 < _; r3++)
            p3 < (s3 = h4[2 * h4[2 * (n3 = e3.heap[r3]) + 1] + 1] + 1) && (s3 = p3, m2++), h4[2 * n3 + 1] = s3, u3 < n3 || (e3.bl_count[s3]++, a3 = 0, d2 <= n3 && (a3 = c2[n3 - d2]), o3 = h4[2 * n3], e3.opt_len += o3 * (s3 + a3), f2 && (e3.static_len += o3 * (l2[2 * n3 + 1] + a3)));
          if (0 !== m2) {
            do {
              for (s3 = p3 - 1; 0 === e3.bl_count[s3]; )
                s3--;
              e3.bl_count[s3]--, e3.bl_count[s3 + 1] += 2, e3.bl_count[p3]--, m2 -= 2;
            } while (0 < m2);
            for (s3 = p3; 0 !== s3; s3--)
              for (n3 = e3.bl_count[s3]; 0 !== n3; )
                u3 < (i3 = e3.heap[--r3]) || (h4[2 * i3 + 1] !== s3 && (e3.opt_len += (s3 - h4[2 * i3 + 1]) * h4[2 * i3], h4[2 * i3 + 1] = s3), n3--);
          }
        }(e2, t2), Z2(s2, u2, e2.bl_count);
      }
      function X(e2, t2, r2) {
        var n2, i2, s2 = -1, a2 = t2[1], o2 = 0, h3 = 7, u2 = 4;
        for (0 === a2 && (h3 = 138, u2 = 3), t2[2 * (r2 + 1) + 1] = 65535, n2 = 0; n2 <= r2; n2++)
          i2 = a2, a2 = t2[2 * (n2 + 1) + 1], ++o2 < h3 && i2 === a2 || (o2 < u2 ? e2.bl_tree[2 * i2] += o2 : 0 !== i2 ? (i2 !== s2 && e2.bl_tree[2 * i2]++, e2.bl_tree[2 * b]++) : o2 <= 10 ? e2.bl_tree[2 * v]++ : e2.bl_tree[2 * y]++, s2 = i2, u2 = (o2 = 0) === a2 ? (h3 = 138, 3) : i2 === a2 ? (h3 = 6, 3) : (h3 = 7, 4));
      }
      function V(e2, t2, r2) {
        var n2, i2, s2 = -1, a2 = t2[1], o2 = 0, h3 = 7, u2 = 4;
        for (0 === a2 && (h3 = 138, u2 = 3), n2 = 0; n2 <= r2; n2++)
          if (i2 = a2, a2 = t2[2 * (n2 + 1) + 1], !(++o2 < h3 && i2 === a2)) {
            if (o2 < u2)
              for (; L(e2, i2, e2.bl_tree), 0 != --o2; )
                ;
            else
              0 !== i2 ? (i2 !== s2 && (L(e2, i2, e2.bl_tree), o2--), L(e2, b, e2.bl_tree), P2(e2, o2 - 3, 2)) : o2 <= 10 ? (L(e2, v, e2.bl_tree), P2(e2, o2 - 3, 3)) : (L(e2, y, e2.bl_tree), P2(e2, o2 - 11, 7));
            s2 = i2, u2 = (o2 = 0) === a2 ? (h3 = 138, 3) : i2 === a2 ? (h3 = 6, 3) : (h3 = 7, 4);
          }
      }
      n(T);
      var q = false;
      function J(e2, t2, r2, n2) {
        P2(e2, (s << 1) + (n2 ? 1 : 0), 3), function(e3, t3, r3, n3) {
          M2(e3), n3 && (U(e3, r3), U(e3, ~r3)), i.arraySet(e3.pending_buf, e3.window, t3, r3, e3.pending), e3.pending += r3;
        }(e2, t2, r2, true);
      }
      r._tr_init = function(e2) {
        q || (function() {
          var e3, t2, r2, n2, i2, s2 = new Array(g + 1);
          for (n2 = r2 = 0; n2 < a - 1; n2++)
            for (I[n2] = r2, e3 = 0; e3 < 1 << w[n2]; e3++)
              A[r2++] = n2;
          for (A[r2 - 1] = n2, n2 = i2 = 0; n2 < 16; n2++)
            for (T[n2] = i2, e3 = 0; e3 < 1 << k[n2]; e3++)
              E[i2++] = n2;
          for (i2 >>= 7; n2 < f; n2++)
            for (T[n2] = i2 << 7, e3 = 0; e3 < 1 << k[n2] - 7; e3++)
              E[256 + i2++] = n2;
          for (t2 = 0; t2 <= g; t2++)
            s2[t2] = 0;
          for (e3 = 0; e3 <= 143; )
            z[2 * e3 + 1] = 8, e3++, s2[8]++;
          for (; e3 <= 255; )
            z[2 * e3 + 1] = 9, e3++, s2[9]++;
          for (; e3 <= 279; )
            z[2 * e3 + 1] = 7, e3++, s2[7]++;
          for (; e3 <= 287; )
            z[2 * e3 + 1] = 8, e3++, s2[8]++;
          for (Z2(z, l + 1, s2), e3 = 0; e3 < f; e3++)
            C2[2 * e3 + 1] = 5, C2[2 * e3] = j(e3, 5);
          O = new D(z, w, u + 1, l, g), B = new D(C2, k, 0, f, g), R2 = new D(new Array(0), x, 0, c, p2);
        }(), q = true), e2.l_desc = new F2(e2.dyn_ltree, O), e2.d_desc = new F2(e2.dyn_dtree, B), e2.bl_desc = new F2(e2.bl_tree, R2), e2.bi_buf = 0, e2.bi_valid = 0, W(e2);
      }, r._tr_stored_block = J, r._tr_flush_block = function(e2, t2, r2, n2) {
        var i2, s2, a2 = 0;
        0 < e2.level ? (2 === e2.strm.data_type && (e2.strm.data_type = function(e3) {
          var t3, r3 = 4093624447;
          for (t3 = 0; t3 <= 31; t3++, r3 >>>= 1)
            if (1 & r3 && 0 !== e3.dyn_ltree[2 * t3])
              return o;
          if (0 !== e3.dyn_ltree[18] || 0 !== e3.dyn_ltree[20] || 0 !== e3.dyn_ltree[26])
            return h2;
          for (t3 = 32; t3 < u; t3++)
            if (0 !== e3.dyn_ltree[2 * t3])
              return h2;
          return o;
        }(e2)), Y(e2, e2.l_desc), Y(e2, e2.d_desc), a2 = function(e3) {
          var t3;
          for (X(e3, e3.dyn_ltree, e3.l_desc.max_code), X(e3, e3.dyn_dtree, e3.d_desc.max_code), Y(e3, e3.bl_desc), t3 = c - 1; 3 <= t3 && 0 === e3.bl_tree[2 * S2[t3] + 1]; t3--)
            ;
          return e3.opt_len += 3 * (t3 + 1) + 5 + 5 + 4, t3;
        }(e2), i2 = e2.opt_len + 3 + 7 >>> 3, (s2 = e2.static_len + 3 + 7 >>> 3) <= i2 && (i2 = s2)) : i2 = s2 = r2 + 5, r2 + 4 <= i2 && -1 !== t2 ? J(e2, t2, r2, n2) : 4 === e2.strategy || s2 === i2 ? (P2(e2, 2 + (n2 ? 1 : 0), 3), K(e2, z, C2)) : (P2(e2, 4 + (n2 ? 1 : 0), 3), function(e3, t3, r3, n3) {
          var i3;
          for (P2(e3, t3 - 257, 5), P2(e3, r3 - 1, 5), P2(e3, n3 - 4, 4), i3 = 0; i3 < n3; i3++)
            P2(e3, e3.bl_tree[2 * S2[i3] + 1], 3);
          V(e3, e3.dyn_ltree, t3 - 1), V(e3, e3.dyn_dtree, r3 - 1);
        }(e2, e2.l_desc.max_code + 1, e2.d_desc.max_code + 1, a2 + 1), K(e2, e2.dyn_ltree, e2.dyn_dtree)), W(e2), n2 && M2(e2);
      }, r._tr_tally = function(e2, t2, r2) {
        return e2.pending_buf[e2.d_buf + 2 * e2.last_lit] = t2 >>> 8 & 255, e2.pending_buf[e2.d_buf + 2 * e2.last_lit + 1] = 255 & t2, e2.pending_buf[e2.l_buf + e2.last_lit] = 255 & r2, e2.last_lit++, 0 === t2 ? e2.dyn_ltree[2 * r2]++ : (e2.matches++, t2--, e2.dyn_ltree[2 * (A[r2] + u + 1)]++, e2.dyn_dtree[2 * N(t2)]++), e2.last_lit === e2.lit_bufsize - 1;
      }, r._tr_align = function(e2) {
        P2(e2, 2, 3), L(e2, m, z), function(e3) {
          16 === e3.bi_valid ? (U(e3, e3.bi_buf), e3.bi_buf = 0, e3.bi_valid = 0) : 8 <= e3.bi_valid && (e3.pending_buf[e3.pending++] = 255 & e3.bi_buf, e3.bi_buf >>= 8, e3.bi_valid -= 8);
        }(e2);
      };
    }, { "../utils/common": 41 }], 53: [function(e, t, r) {
      t.exports = function() {
        this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
      };
    }, {}], 54: [function(e, t, r) {
      (function(e2) {
        !function(r2, n) {
          if (!r2.setImmediate) {
            var i, s, t2, a, o = 1, h2 = {}, u = false, l = r2.document, e3 = Object.getPrototypeOf && Object.getPrototypeOf(r2);
            e3 = e3 && e3.setTimeout ? e3 : r2, i = "[object process]" === {}.toString.call(r2.process) ? function(e4) {
              process.nextTick(function() {
                c(e4);
              });
            } : function() {
              if (r2.postMessage && !r2.importScripts) {
                var e4 = true, t3 = r2.onmessage;
                return r2.onmessage = function() {
                  e4 = false;
                }, r2.postMessage("", "*"), r2.onmessage = t3, e4;
              }
            }() ? (a = "setImmediate$" + Math.random() + "$", r2.addEventListener ? r2.addEventListener("message", d, false) : r2.attachEvent("onmessage", d), function(e4) {
              r2.postMessage(a + e4, "*");
            }) : r2.MessageChannel ? ((t2 = new MessageChannel()).port1.onmessage = function(e4) {
              c(e4.data);
            }, function(e4) {
              t2.port2.postMessage(e4);
            }) : l && "onreadystatechange" in l.createElement("script") ? (s = l.documentElement, function(e4) {
              var t3 = l.createElement("script");
              t3.onreadystatechange = function() {
                c(e4), t3.onreadystatechange = null, s.removeChild(t3), t3 = null;
              }, s.appendChild(t3);
            }) : function(e4) {
              setTimeout(c, 0, e4);
            }, e3.setImmediate = function(e4) {
              "function" != typeof e4 && (e4 = new Function("" + e4));
              for (var t3 = new Array(arguments.length - 1), r3 = 0; r3 < t3.length; r3++)
                t3[r3] = arguments[r3 + 1];
              var n2 = { callback: e4, args: t3 };
              return h2[o] = n2, i(o), o++;
            }, e3.clearImmediate = f;
          }
          function f(e4) {
            delete h2[e4];
          }
          function c(e4) {
            if (u)
              setTimeout(c, 0, e4);
            else {
              var t3 = h2[e4];
              if (t3) {
                u = true;
                try {
                  !function(e5) {
                    var t4 = e5.callback, r3 = e5.args;
                    switch (r3.length) {
                      case 0:
                        t4();
                        break;
                      case 1:
                        t4(r3[0]);
                        break;
                      case 2:
                        t4(r3[0], r3[1]);
                        break;
                      case 3:
                        t4(r3[0], r3[1], r3[2]);
                        break;
                      default:
                        t4.apply(n, r3);
                    }
                  }(t3);
                } finally {
                  f(e4), u = false;
                }
              }
            }
          }
          function d(e4) {
            e4.source === r2 && "string" == typeof e4.data && 0 === e4.data.indexOf(a) && c(+e4.data.slice(a.length));
          }
        }("undefined" == typeof self ? void 0 === e2 ? this : e2 : self);
      }).call(this, "undefined" != typeof commonjsGlobal ? commonjsGlobal : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, {}] }, {}, [10])(10);
  });
})(jszip_min);
var jszip_minExports = jszip_min.exports;
const JSZip = /* @__PURE__ */ getDefaultExportFromCjs(jszip_minExports);
function isAnimation(sprite) {
  return "frameCount" in sprite && "frameDelay" in sprite && "loopType" in sprite;
}
function isColorEvent(event) {
  return event.type === "C";
}
function isValueEvent(event) {
  return event.type === "F" || event.type === "MX" || event.type === "MY" || event.type === "S" || event.type === "R" || event.type === "F";
}
function isVectorEvent(event) {
  return event.type === "M" || event.type === "V";
}
function isLoopEvent(event) {
  return event.type === "L";
}
function isParamEvent(event) {
  return event.type === "P";
}
const _Vector2 = class _Vector22 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  isZero() {
    return this.x === 0 && this.y === 0;
  }
  static newZero() {
    return new _Vector22(0, 0);
  }
  static newOne() {
    return new _Vector22(1, 1);
  }
  equals(v2) {
    return this.x === v2.x && this.y === v2.y;
  }
  add(vec2) {
    return new _Vector22(vec2.x + this.x, vec2.y + this.y);
  }
  addValue(v) {
    return new _Vector22(this.x + v, this.y + v);
  }
  increment(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }
  minus(vec2) {
    return new _Vector22(this.x - vec2.x, this.y - vec2.y);
  }
  minusValue(v) {
    return new _Vector22(this.x - v, this.y - v);
  }
  div(v) {
    return new _Vector22(this.x / v.x, this.y / v.y);
  }
  divValue(v) {
    return new _Vector22(this.x / v, this.y / v);
  }
  mul(v) {
    return new _Vector22(this.x * v.x, this.y * v.y);
  }
  mulValue(v) {
    return new _Vector22(this.x * v, this.y * v);
  }
  copy() {
    return new _Vector22(this.x, this.y);
  }
  negative() {
    return new _Vector22(-this.x, -this.y);
  }
  // public static negative(src: Vector2): Vector2 {
  //     return new Vector2(-src.x, -src.y)
  // }
  // public static multi(src: Vector2, n: number): Vector2 {
  //     return new Vector2(src.x * n, src.y * n)
  // }
  // public static dotMulti(src: Vector2, vec2: Vector2): number {
  //     return src.x * vec2.x + src.y * vec2.y
  // }
  // public static crossMulti(src: Vector2, vec2: Vector2): Vector2 {
  //     return new Vector2(src.x * vec2.y, vec2.x * src.y)
  // }
  // public static norm(src: Vector2): number {
  //     return Math.sqrt(src.x ** 2 + src.y ** 2)
  // }
  set(x, y) {
    this.x = x;
    this.y = y;
  }
  setFrom(from) {
    this.x = from.x;
    this.y = from.y;
  }
  distance(other) {
    return Math.sqrt(
      (this.x - other.x) * (this.x - other.x) + (this.y - other.y) * (this.y - other.y)
    );
  }
};
_Vector2.one = new _Vector2(1, 1);
_Vector2.zero = new _Vector2(0, 0);
let Vector2 = _Vector2;
function Vector(x = 0, y) {
  return new Vector2(x, y === void 0 ? x : y);
}
const _Color = class _Color2 {
  constructor(r, g, b, a) {
    this.red = 0;
    this.green = 0;
    this.blue = 0;
    this.alpha = 0;
    this.red = r;
    this.blue = b;
    this.green = g;
    this.alpha = a;
  }
  static fromHex(hex, alphaInt = 255) {
    const red = hex >> 16 & 255;
    const green = hex >> 8 & 255;
    const blue = hex & 255;
    return new _Color2(red / 255, green / 255, blue / 255, alphaInt / 255);
  }
  copy() {
    return new _Color2(this.red, this.green, this.blue, this.alpha);
  }
  setFrom(c) {
    this.red = c.red;
    this.green = c.green;
    this.blue = c.blue;
    this.alpha = c.alpha;
  }
  set(red, green, blue, alpha) {
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.alpha = alpha;
  }
  static fromRGB(red, green, blue) {
    return new _Color2(red / 255, green / 255, blue / 255, 1);
  }
};
_Color.White = _Color.fromHex(16777215);
_Color.Black = _Color.fromHex(0);
_Color.Transparent = _Color.fromHex(0, 0);
let Color = _Color;
class OSBParser {
  static parse(content) {
    const lines = content.split("\n").map((s) => s.trimEnd());
    const osb = {
      sprites: []
    };
    for (let i = 0; i < lines.length; ) {
      const line = lines[i];
      if (line.startsWith("[")) {
        i++;
        continue;
      }
      if (line.startsWith("Sprite")) {
        i = this.parseSprite(lines, i, osb);
      } else if (line.startsWith("Animation")) {
        i = this.parseAnimation(lines, i, osb);
      } else {
        i++;
      }
    }
    return osb;
  }
  static parseSprite(lines, lineIndex, out) {
    let i = lineIndex;
    const line = lines[i++];
    const spriteInfo = [];
    const firstQuotationIndex = line.indexOf('"');
    const lastQuotationIndex = line.lastIndexOf('"');
    const pre = line.substring(0, firstQuotationIndex).replaceAll(",", " ").trim();
    const after = line.substring(lastQuotationIndex + 1).replaceAll(",", " ").trim();
    const filePath = line.substring(firstQuotationIndex + 1, lastQuotationIndex).replaceAll("\\", "/").toLowerCase();
    const preList = pre.split(" ").map((v) => v.trim());
    const afterList = after.split(" ").map((v) => v.trim());
    spriteInfo.push(...preList, filePath, ...afterList);
    const sprite = {
      layer: spriteInfo[1],
      origin: spriteInfo[2],
      filePath: spriteInfo[3],
      x: parseInt(spriteInfo[4]),
      y: parseInt(spriteInfo[5]),
      events: []
    };
    while (!isUndef(lines[i]) && lines[i].startsWith(" ")) {
      i = this.parseEvent(lines, i, sprite.events);
    }
    out.sprites.push(sprite);
    return i;
  }
  static parseAnimation(lines, lineIndex, out) {
    let i = lineIndex;
    const line = lines[i++];
    const animeInfo = [];
    const firstQuotationIndex = line.indexOf('"');
    const lastQuotationIndex = line.lastIndexOf('"');
    const pre = line.substring(0, firstQuotationIndex).replaceAll(",", " ").trim();
    const after = line.substring(lastQuotationIndex + 1).replaceAll(",", " ").trim();
    const filePath = line.substring(firstQuotationIndex + 1, lastQuotationIndex).replaceAll("\\", "/").toLowerCase();
    const preList = pre.split(" ").map((v) => v.trim());
    const afterList = after.split(" ").map((v) => v.trim());
    animeInfo.push(...preList, filePath, ...afterList);
    const animation = {
      layer: animeInfo[1],
      origin: animeInfo[2],
      filePath: animeInfo[3],
      x: parseInt(animeInfo[4]),
      y: parseInt(animeInfo[5]),
      events: [],
      frameCount: parseInt(animeInfo[6]),
      frameDelay: parseInt(animeInfo[7]),
      loopType: animeInfo[8]
    };
    while (!isUndef(lines[i]) && lines[i].startsWith(" ")) {
      i = this.parseEvent(lines, i, animation.events);
    }
    out.sprites.push(animation);
    return i - 1;
  }
  /**
   *
   * @param lines
   * @param lineIndex
   * @param events
   * @return next line index
   * @private
   */
  static parseEvent(lines, lineIndex, events) {
    const line = lines[lineIndex];
    const splits = line.split(",").map((s) => s.trim());
    const eventType = splits[0];
    const event = {
      type: eventType,
      startTime: 0
    };
    if (isLoopEvent(event)) {
      event.startTime = parseInt(splits[1]);
      event.loopCount = parseInt(splits[2]);
      event.children = [];
      events.push(event);
      let nextLineIndex = lineIndex + 1;
      while (!isUndef(lines[nextLineIndex]) && lines[nextLineIndex].startsWith("  ")) {
        nextLineIndex = this.parseEvent(lines, nextLineIndex, event.children);
      }
      return nextLineIndex;
    }
    const baseEvent = event;
    baseEvent.ease = parseInt(splits[1]);
    baseEvent.startTime = parseInt(splits[2]);
    baseEvent.endTime = this.toInt(splits[3]) ?? baseEvent.startTime;
    if (isValueEvent(baseEvent)) {
      const from = parseFloat(splits[4]), to = this.toFloat(splits[5]) ?? from;
      baseEvent.from = from;
      baseEvent.to = to;
      events.push(baseEvent);
      const duration = baseEvent.endTime - baseEvent.startTime;
      let currentEvent = baseEvent;
      for (let index = 6; index < splits.length; index++) {
        const copied = this.shallowCopy(currentEvent);
        copied.startTime += duration;
        copied.endTime += duration;
        copied.from = copied.to;
        copied.to = parseFloat(splits[index]);
        events.push(copied);
        currentEvent = copied;
      }
    } else if (isVectorEvent(baseEvent)) {
      baseEvent.from = Vector(parseFloat(splits[4]), parseFloat(splits[5]));
      if (splits.length === 6) {
        baseEvent.to = baseEvent.from;
      } else {
        baseEvent.to = Vector(parseFloat(splits[6]), parseFloat(splits[7]));
      }
      events.push(baseEvent);
      const duration = baseEvent.endTime - baseEvent.startTime;
      let currentEvent = baseEvent;
      for (let index = 8; index < splits.length; index += 2) {
        const copied = this.shallowCopy(currentEvent);
        copied.startTime += duration;
        copied.endTime += duration;
        copied.from = copied.to;
        copied.to = Vector(parseFloat(splits[index]), parseFloat(splits[index + 1]));
        events.push(copied);
        currentEvent = copied;
      }
    } else if (isColorEvent(baseEvent)) {
      baseEvent.from = new Color(
        parseInt(splits[4]) / 255,
        parseInt(splits[5]) / 255,
        parseInt(splits[6]) / 255,
        1
      );
      if (splits.length === 7) {
        baseEvent.to = baseEvent.from;
      } else {
        baseEvent.to = new Color(
          parseInt(splits[7]) / 255,
          parseInt(splits[8]) / 255,
          parseInt(splits[9]) / 255,
          1
        );
      }
      events.push(baseEvent);
      const duration = baseEvent.endTime - baseEvent.startTime;
      let currentEvent = baseEvent;
      for (let index = 10; index < splits.length; index += 3) {
        const copied = this.shallowCopy(currentEvent);
        copied.startTime += duration;
        copied.endTime += duration;
        copied.from = copied.to;
        copied.to = new Color(
          parseInt(splits[index]) / 255,
          parseInt(splits[index + 1]) / 255,
          parseInt(splits[index + 2]) / 255,
          1
        );
        events.push(copied);
        currentEvent = copied;
      }
    } else if (isParamEvent(baseEvent)) {
      baseEvent.p = splits[4];
      events.push(baseEvent);
      const duration = baseEvent.endTime - baseEvent.startTime;
      let currentEvent = baseEvent;
      for (let index = 5; index < splits.length; index++) {
        const copied = this.shallowCopy(currentEvent);
        copied.startTime += duration;
        copied.endTime += duration;
        copied.p = splits[index];
        events.push(copied);
        currentEvent = copied;
      }
    }
    return lineIndex + 1;
  }
  static toInt(s) {
    try {
      const maybeInt = parseInt(s);
      return isNaN(maybeInt) ? void 0 : maybeInt;
    } catch (e) {
      return void 0;
    }
  }
  static toFloat(s) {
    try {
      const maybeFloat = parseFloat(s);
      return isNaN(maybeFloat) ? void 0 : maybeFloat;
    } catch (e) {
      return void 0;
    }
  }
  static shallowCopy(source2) {
    const result = {};
    const keys = Object.getOwnPropertyNames(source2);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      result[key] = source2[key];
    }
    return result;
  }
}
class OSUParser {
  static parse(textContent, osuFilename) {
    const osuFile = { name: osuFilename };
    const lines = textContent.split("\n").map((v) => v.trimEnd());
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line === this.general) {
        this.parseGeneral(lines, i + 1, osuFile);
      } else if (line === this.metadata) {
        this.parseMetadata(lines, i + 1, osuFile);
      } else if (line === this.timingPoints) {
        this.parseTimingPoints(lines, i + 1, osuFile);
      } else if (line === this.events) {
        this.parseEvents(lines, i + 1, osuFile);
      } else if (line === this.difficulty) {
        this.parseDifficulty(lines, i + 1, osuFile);
      }
    }
    return osuFile;
  }
  static parseEvents(lines, index, out) {
    let i = index, hasStoryboard = false;
    out.Events = {};
    const storyLines = [
      "[Events]"
    ];
    while (lines[i].length > 0 && lines[i].charAt(0) !== "[") {
      const line = lines[i++];
      if (line.startsWith("Video")) {
        let firstIndex = line.indexOf('"');
        let lastIndex = line.lastIndexOf('"');
        if (firstIndex >= 0 && lastIndex > 0) {
          out.Events.videoBackground = line.substring(firstIndex + 1, lastIndex).toLowerCase();
        }
        firstIndex = line.indexOf(",");
        lastIndex = line.indexOf(",", firstIndex + 1);
        if (firstIndex >= 0 && lastIndex > 0) {
          try {
            out.Events.videoOffset = parseInt(line.substring(firstIndex + 1, lastIndex).trim());
          } catch (_) {
            out.Events.videoOffset = 0;
          }
        }
      } else if (line.startsWith("0,0")) {
        const firstIndex = line.indexOf('"');
        const lastIndex = line.lastIndexOf('"');
        if (firstIndex >= 0 && lastIndex > 0) {
          out.Events.imageBackground = line.substring(firstIndex + 1, lastIndex).toLowerCase();
        }
      } else if (hasStoryboard) {
        storyLines.push(line);
      } else if (line.startsWith("Sprite") || line.startsWith("Animation")) {
        hasStoryboard = true;
        storyLines.push(line);
      }
    }
    out.Events.storyboard = OSBParser.parse(storyLines.join("\n"));
  }
  static parseGeneral(lines, index, out) {
    let i = index;
    const general = {
      AudioFilename: "",
      PreviewTime: 0,
      Mode: 3,
      AudioLeadIn: 0,
      Countdown: 0,
      SampleSet: "",
      StackLeniency: 0,
      SpecialStyle: false,
      WidescreenStoryboard: false,
      LetterboxInBreaks: false,
      EpilepsyWarning: false
    };
    while (lines[i].length > 0 && lines[i].charAt(0) !== "[") {
      const [key, value] = lines[i++].split(":").map((v) => v.trim());
      if (key === "AudioFilename") {
        general.AudioFilename = value.toLowerCase();
      } else if (key === "PreviewTime") {
        general.PreviewTime = parseInt(value);
      } else if (key === "Mode") {
        general.Mode = parseInt(value);
      } else if (key === "AudioLeadIn") {
        general.AudioLeadIn = parseInt(value);
      } else if (key === "Countdown") {
        general.Countdown = parseInt(value);
      } else if (key === "SampleSet") {
        general.SampleSet = value;
      } else if (key === "StackLeniency") {
        general.StackLeniency = parseFloat(value);
      } else if (key === "EpilepsyWarning") {
        general.EpilepsyWarning = value === "1";
      } else if (key === "SpecialStyle") {
        general.SpecialStyle = value === "1";
      } else if (key === "WidescreenStoryboard") {
        general.WidescreenStoryboard = value === "1";
      } else if (key === "LetterboxInBreaks") {
        general.LetterboxInBreaks = value === "1";
      }
    }
    out.General = general;
  }
  static parseMetadata(lines, index, out) {
    let i = index;
    const metadata = {
      Title: "",
      TitleUnicode: "",
      Artist: "",
      ArtistUnicode: "",
      Version: "",
      BeatmapID: "-1",
      BeatmapSetID: "",
      Tags: "",
      Source: "",
      Creator: ""
    };
    while (lines[i].length > 0 && lines[i].charAt(0) !== "[") {
      const [key, value] = lines[i++].split(":").map((v) => v.trim());
      if (key === "Title") {
        metadata.Title = value;
      } else if (key === "TitleUnicode") {
        metadata.TitleUnicode = value;
      } else if (key === "Artist") {
        metadata.Artist = value;
      } else if (key === "ArtistUnicode") {
        metadata.ArtistUnicode = value;
      } else if (key === "Version") {
        metadata.Version = value;
      } else if (key === "Creator") {
        metadata.Creator = value;
      } else if (key === "Source") {
        metadata.Source = value;
      } else if (key === "BeatmapID") {
        metadata.BeatmapID = value;
      } else if (key === "BeatmapSetID") {
        metadata.BeatmapSetID = value;
      } else if (key === "Tags") {
        metadata.Tags = value;
      }
    }
    out.Metadata = metadata;
  }
  static parseTimingPoints(lines, index, out) {
    let i = index;
    const timingPoints = {
      timingList: []
    };
    while (lines[i].length > 0 && lines[i].charAt(0) !== "[") {
      const [time, beatLength, _1, _2, _3, _4, _5, isKiai] = lines[i++].split(",").map((v) => v.trim());
      timingPoints.timingList.push({
        time: parseInt(time),
        beatLength: parseFloat(beatLength),
        isKiai: isKiai === "1"
      });
    }
    out.TimingPoints = timingPoints;
  }
  static parseDifficulty(lines, index, out) {
    let i = index;
    const difficulty = {
      HPDrainRate: 0,
      OverallDifficulty: 0,
      SliderMultiplier: 0,
      SliderTickRate: 0,
      CircleSize: 0,
      ApproachRate: 0
    };
    while (lines[i].length > 0 && lines[i].charAt(0) !== "[") {
      const [key, value] = lines[i++].split(":").map((v) => v.trim());
      if (key === "HPDrainRate") {
        difficulty.HPDrainRate = parseFloat(value);
      } else if (key === "OverallDifficulty") {
        difficulty.OverallDifficulty = parseFloat(value);
      } else if (key === "SliderMultiplier") {
        difficulty.SliderMultiplier = parseFloat(value);
      } else if (key === "SliderTickRate") {
        difficulty.SliderTickRate = parseFloat(value);
      } else if (key === "CircleSize") {
        difficulty.CircleSize = parseFloat(value);
      } else if (key === "ApproachRate") {
        difficulty.ApproachRate = parseFloat(value);
      }
    }
    out.Difficulty = difficulty;
  }
}
OSUParser.general = "[General]";
OSUParser.metadata = "[Metadata]";
OSUParser.timingPoints = "[TimingPoints]";
OSUParser.events = "[Events]";
OSUParser.difficulty = "[Difficulty]";
function createJob(collector, value) {
  return {
    id: nextID(),
    active: true,
    func: collector,
    value
  };
}
let id = Number.MIN_SAFE_INTEGER + 10;
function nextID() {
  const i = id++;
  if (id >= Number.MAX_SAFE_INTEGER - 10) {
    id = Number.MIN_SAFE_INTEGER + 10;
  }
  return i;
}
class Flow {
}
class StateFlow extends Flow {
}
const resolve = Promise.resolve();
class MutableStateFlow extends StateFlow {
  constructor(value) {
    super();
    this.collectorList = [];
    this.jobQueue = [];
    this.flushIndex = 0;
    this.isFlushing = false;
    this.isFlushPending = false;
    this._value = value;
  }
  set value(newValue) {
    this.emit(newValue);
  }
  emit(newValue) {
    const oldValue = this._value;
    if (oldValue === newValue) {
      return;
    }
    this._value = newValue;
    const collectorList = this.collectorList;
    for (let i = 0; i < collectorList.length; i++) {
      const collector = collectorList[i];
      collector.value = newValue;
      const jobQueue = this.jobQueue;
      if (!jobQueue.includes(
        collector,
        this.isFlushing ? this.flushIndex + 1 : this.flushIndex
      )) {
        jobQueue.splice(this.findInsertionIndex(collector.id), 0, collector);
      }
    }
    this.flushQueue();
  }
  get value() {
    return this._value;
  }
  findInsertionIndex(id2) {
    const jobQueue = this.jobQueue;
    let start = this.flushIndex + 1;
    let end = jobQueue.length;
    while (start < end) {
      const middle = start + end >>> 1;
      const middleJobId = jobQueue[middle].id;
      middleJobId < id2 ? start = middle + 1 : end = middle;
    }
    return start;
  }
  flushQueue() {
    if (!this.isFlushing && !this.isFlushPending) {
      this.isFlushPending = true;
      resolve.then(this.flushJob.bind(this));
    }
  }
  flushJob() {
    this.isFlushPending = false;
    this.isFlushing = true;
    this.jobQueue.sort((a, b) => a.id - b.id);
    try {
      for (this.flushIndex = 0; this.flushIndex < this.jobQueue.length; this.flushIndex++) {
        const job = this.jobQueue[this.flushIndex];
        if (job.active) {
          try {
            job.func(job.value);
          } catch (e) {
            console.error(e);
          }
        }
      }
    } finally {
      this.flushIndex = 0;
      this.jobQueue.length = 0;
      this.isFlushing = false;
    }
  }
  collect(collector) {
    const job = createJob(collector, this._value);
    this.collectorList.push(job);
    job.func(job.value);
  }
  removeCollect(collector) {
    const index = this.collectorList.findIndex((v) => v.func === collector);
    this.collectorList[index].active = false;
    this.collectorList.splice(index, 1);
  }
  clear() {
    this.collectorList.length = 0;
    this.jobQueue.length = 0;
  }
}
class MutableSharedFlow extends Flow {
  constructor() {
    super();
    this._value = null;
    this.collectorList = [];
    this.jobQueue = [];
    this.flushIndex = 0;
    this.isFlushing = false;
    this.isFlushPending = false;
  }
  emit(newValue) {
    this._value = newValue;
    const collectorList = this.collectorList;
    for (let i = 0; i < collectorList.length; i++) {
      const collector = collectorList[i];
      collector.value = newValue;
      const jobQueue = this.jobQueue;
      if (!jobQueue.includes(
        collector,
        this.isFlushing ? this.flushIndex + 1 : this.flushIndex
      )) {
        jobQueue.splice(this.findInsertionIndex(collector.id), 0, collector);
      }
    }
    this.flushQueue();
  }
  findInsertionIndex(id2) {
    const jobQueue = this.jobQueue;
    let start = this.flushIndex + 1;
    let end = jobQueue.length;
    while (start < end) {
      const middle = start + end >>> 1;
      const middleJobId = jobQueue[middle].id;
      middleJobId < id2 ? start = middle + 1 : end = middle;
    }
    return start;
  }
  flushQueue() {
    if (!this.isFlushing && !this.isFlushPending) {
      this.isFlushPending = true;
      resolve.then(this.flushJob.bind(this));
    }
  }
  flushJob() {
    this.isFlushPending = false;
    this.isFlushing = true;
    this.jobQueue.sort((a, b) => a.id - b.id);
    try {
      for (this.flushIndex = 0; this.flushIndex < this.jobQueue.length; this.flushIndex++) {
        const job = this.jobQueue[this.flushIndex];
        if (job.active) {
          try {
            job.func(job.value);
          } catch (e) {
            console.error(e);
          }
        }
      }
    } finally {
      this.flushIndex = 0;
      this.jobQueue.length = 0;
      this.isFlushing = false;
    }
  }
  collect(collector) {
    const job = createJob(collector, this._value);
    this.collectorList.push(job);
  }
  removeCollect(collector) {
    const index = this.collectorList.findIndex((v) => v.func === collector);
    this.collectorList[index].active = false;
    this.collectorList.splice(index, 1);
  }
  clear() {
    this.collectorList.length = 0;
    this.jobQueue.length = 0;
  }
}
function createMutableStateFlow(a) {
  return new MutableStateFlow(a);
}
function createMutableSharedFlow() {
  return new MutableSharedFlow();
}
let beatmapDirectoryId = "beatmap";
const onEnterMenu = createMutableSharedFlow();
const onLeftSide = createMutableSharedFlow();
const onRightSide = createMutableSharedFlow();
const VueUI = reactive({
  settings: false,
  miniPlayer: false,
  notification: false,
  selectBeatmapDirectory: false
});
const OSZConfig = reactive({
  /**
   * 是否默认自动加载视频，设置为 false 可以避免因视频加载问题而导致 osz 不能播放
   */
  loadVideo: false
});
function loadOSZ(file, preview = true) {
  OSZParser.parse(file).then((osz) => load(osz, preview)).catch(console.log);
}
async function load(osz, preview = true) {
  var _a2;
  const osu = await OSUPlayer$1.setSource(osz);
  if (!osu)
    return;
  if (preview) {
    const time = (_a2 = osu.General) == null ? void 0 : _a2.PreviewTime;
    await OSUPlayer$1.seek(time && time >= 0 ? time : 0);
  } else {
    OSUPlayer$1.stop();
  }
  await OSUPlayer$1.play();
}
class OSZ {
  constructor() {
    this.osuFileList = [];
    this.osbFile = { sprites: [] };
    this.imageBitmaps = /* @__PURE__ */ new Map();
    this.imageBlobs = /* @__PURE__ */ new Map();
    this.videos = /* @__PURE__ */ new Map();
    this.audios = /* @__PURE__ */ new Map();
    this.sounds = /* @__PURE__ */ new Map();
  }
  addOSUFile(...osu) {
    this.osuFileList.push(...osu);
  }
  setOSBFile(osb) {
    this.osbFile = osb;
  }
  async addImage(path, imageBlob) {
    if (!this.imageBlobs.has(path)) {
      this.imageBlobs.set(path, imageBlob);
      this.imageBitmaps.set(path, await createImageBitmap(imageBlob));
    }
  }
  addAudio(path, audio) {
    if (!this.audios.has(path)) {
      this.audios.set(path, audio);
    }
  }
  addSounds(path, sound) {
    if (!this.sounds.has(path)) {
      this.sounds.set(path, sound);
    }
  }
  addVideo(path, video) {
    if (!this.videos.has(path)) {
      const objectUrl = URL.createObjectURL(video);
      this.videos.set(path, objectUrl);
    }
  }
  getImageBlob(path) {
    return this.imageBlobs.get(path);
  }
  getImageBitmap(path) {
    return this.imageBitmaps.get(path);
  }
  getAudio(path) {
    return this.audios.get(path);
  }
  getSound(path) {
    return this.sounds.get(path);
  }
  getVideo(path) {
    return this.videos.get(path);
  }
  hasVideo() {
    return this.videos.size !== 0;
  }
  hasAudio() {
    return this.audios.size !== 0;
  }
  hasImage(path) {
    return this.imageBitmaps.has(path);
  }
  dispose() {
    this.osuFileList.length = 0;
    this.osbFile = { sprites: [] };
    this.imageBitmaps.forEach((image2) => image2.close());
    this.imageBitmaps.clear();
    this.audios.clear();
    this.sounds.clear();
    this.videos.forEach((url2) => URL.revokeObjectURL(url2));
    this.videos.clear();
  }
}
class OSZParser {
  static async parse(oszFile) {
    const osz = new OSZ();
    const textDecoder = new TextDecoder();
    const zip = await JSZip.loadAsync(oszFile, {
      decodeFileName(a) {
        if (Array.isArray(a)) {
          return a.join("").toLowerCase();
        } else {
          return textDecoder.decode(a).toLowerCase();
        }
      }
    });
    await this.decompressOSU(zip, osz);
    await this.decompressOSB(zip, osz);
    await this.decompressAudio(zip, osz);
    await this.decompressImage(zip, osz);
    if (OSZConfig.loadVideo) {
      await this.decompressVideo(zip, osz);
    }
    return osz;
  }
  static async decompressOSU(zip, osz) {
    var _a2;
    const filenames = Object.getOwnPropertyNames(zip.files);
    const osuFilenames = filenames.filter((name) => name.endsWith(".osu"));
    for (const osuFilename of osuFilenames) {
      const osuContent = await ((_a2 = zip.file(osuFilename)) == null ? void 0 : _a2.async("string"));
      if (!osuContent)
        continue;
      const osuFile = OSUParser.parse(osuContent, osuFilename);
      osz.addOSUFile(osuFile);
    }
  }
  static async decompressOSB(zip, osz) {
    var _a2;
    const filenames = Object.getOwnPropertyNames(zip.files);
    const osbFilenames = filenames.filter((name) => name.endsWith(".osb"));
    for (const osbFilename of osbFilenames) {
      const osbContent = await ((_a2 = zip.file(osbFilename)) == null ? void 0 : _a2.async("string"));
      if (!osbContent)
        continue;
      osz.osbFile = OSBParser.parse(osbContent);
    }
  }
  static async addSpriteImage(zip, osz, sprite) {
    if (isAnimation(sprite)) {
      const path = sprite.filePath, dotIndex = path.lastIndexOf(".");
      const name = path.substring(0, dotIndex);
      const suffix = path.substring(dotIndex);
      for (let i = 0; i < sprite.frameCount; i++) {
        const newName = `${name}${i}${suffix}`;
        if (osz.hasImage(newName))
          continue;
        try {
          osz.addImage(newName, await zip.file(newName).async("blob"));
        } catch (e) {
          console.error("load error", newName, e);
        }
      }
    } else {
      if (osz.hasImage(sprite.filePath))
        return;
      try {
        osz.addImage(
          sprite.filePath,
          await zip.file(sprite.filePath).async("blob")
        );
      } catch (e) {
        console.error("load error", sprite.filePath, e);
      }
    }
  }
  static async decompressAudio(zip, osz) {
    var _a2, _b;
    if (osz.osuFileList.length <= 0) {
      return;
    }
    const osuFileList = osz.osuFileList;
    for (const osuFile of osuFileList) {
      if (((_a2 = osuFile.General) == null ? void 0 : _a2.AudioFilename) && !osz.hasAudio()) {
        const audio = await ((_b = zip.file(osuFile.General.AudioFilename)) == null ? void 0 : _b.async("arraybuffer"));
        if (audio) {
          osz.addAudio(osuFile.General.AudioFilename, audio);
        }
      }
    }
  }
  static async decompressImage(zip, osz) {
    var _a2;
    const osuFileList = osz.osuFileList;
    const osbFile = osz.osbFile;
    for (const osuFile of osuFileList) {
      const events = osuFile.Events;
      if ((events == null ? void 0 : events.imageBackground) && !osz.hasImage(events.imageBackground)) {
        const image2 = await ((_a2 = zip.file(events.imageBackground)) == null ? void 0 : _a2.async("blob"));
        if (image2) {
          osz.addImage(events.imageBackground, image2);
        }
      }
      if (events == null ? void 0 : events.storyboard) {
        const sprites2 = events.storyboard.sprites;
        for (const sprite of sprites2) {
          await this.addSpriteImage(zip, osz, sprite);
        }
      }
    }
    const sprites = osbFile.sprites;
    for (const sprite of sprites) {
      await this.addSpriteImage(zip, osz, sprite);
    }
  }
  static async decompressVideo(zip, osz) {
    var _a2, _b;
    const osuFieList = osz.osuFileList;
    for (const osuFile of osuFieList) {
      const videoPath = (_a2 = osuFile.Events) == null ? void 0 : _a2.videoBackground;
      if (videoPath && !osz.hasVideo()) {
        const video = await ((_b = zip.file(videoPath)) == null ? void 0 : _b.async("blob"));
        if (video) {
          osz.addVideo(videoPath, video);
        }
      }
    }
  }
  static async decompressSound(zip, osz) {
  }
}
class Interpolation {
  static damp(start, final, base2, exponent) {
    const amount = 1 - Math.pow(base2, exponent);
    return start + (final - start) * amount;
  }
  static valueAt(factor, start, end) {
    return start + factor * (end - start);
  }
  static colorAt(randomValue, startColor, endColor) {
    const r = startColor.red + (endColor.red - startColor.red) * randomValue;
    const g = startColor.green + (endColor.green - startColor.green) * randomValue;
    const b = startColor.blue + (endColor.blue - startColor.blue) * randomValue;
    return new Color(r, g, b, 1);
  }
}
const _OSUPlayer = class _OSUPlayer2 {
  constructor() {
    this.title = ref("None");
    this.artist = ref("None");
    this.background = shallowRef({});
    this.currentTime = ref(0);
    this.duration = ref(0);
    this.onChanged = eventRef();
    this.currentOSUFile = shallowRef(_OSUPlayer2.EMPTY_OSU);
    this.currentOSZFile = shallowRef(_OSUPlayer2.EMPTY_OSZ);
    this.isVideoAvailable = false;
  }
  async setSource(osz, osuFile = null) {
    var _a2, _b, _c, _d, _e, _f, _g;
    const oldOSZ = this.currentOSZFile.value;
    if (oldOSZ !== osz) {
      oldOSZ.dispose();
    }
    this.isVideoAvailable = false;
    const index = ~~Interpolation.valueAt(
      Math.random(),
      0,
      osz.osuFileList.length - 1
    );
    const osu = osz.osuFileList[index];
    this.title.value = ((_a2 = osu.Metadata) == null ? void 0 : _a2.TitleUnicode) ?? ((_b = osu.Metadata) == null ? void 0 : _b.Title) ?? "None";
    this.artist.value = ((_c = osu.Metadata) == null ? void 0 : _c.ArtistUnicode) ?? ((_d = osu.Metadata) == null ? void 0 : _d.Artist) ?? "None";
    const audio = (_e = osu.General) == null ? void 0 : _e.AudioFilename;
    if (!audio) {
      console.warn("audio is null");
      return null;
    }
    await this.setAudioSource(osz, audio);
    const background = {};
    const videoPath = (_f = osu.Events) == null ? void 0 : _f.videoBackground;
    const video = videoPath ? osz.getVideo(videoPath) : void 0;
    if (video) {
      await this.setVideoSource(osu, video, background);
    }
    const imagePath = (_g = osu.Events) == null ? void 0 : _g.imageBackground;
    const image2 = imagePath ? osz.getImageBitmap(imagePath) : void 0;
    if (image2) {
      background.image = image2;
      background.imageBlob = osz.getImageBlob(imagePath);
    }
    this.background.value = background;
    this.onChanged.emit([osu, osz]);
    this.currentOSUFile.value = osu;
    this.currentOSZFile.value = osz;
    return osu;
  }
  async setVideoSource(osu, video, background) {
    var _a2;
    try {
      VideoPlayer$1.baseOffset = ((_a2 = osu.Events) == null ? void 0 : _a2.videoOffset) ?? 0;
      await VideoPlayer$1.setSource(video);
      this.isVideoAvailable = true;
      background.video = VideoPlayer$1.getVideoElement();
    } catch (_) {
      console.log(_);
      this.isVideoAvailable = false;
      background.video = void 0;
    }
  }
  async setAudioSource(osz, audio) {
    const audioArrayBuffer = osz.getAudio(audio);
    await AudioPlayerV2.setSource(audioArrayBuffer);
    this.duration.value = AudioPlayerV2.duration();
  }
  async play() {
    await Promise.all([this.playVideo(), this.playAudio()]);
  }
  async playAudio() {
    await AudioPlayerV2.play();
  }
  async playVideo() {
    if (this.isVideoAvailable) {
      await VideoPlayer$1.play();
    }
  }
  pause() {
    if (this.isVideoAvailable) {
      VideoPlayer$1.pause();
    }
    AudioPlayerV2.pause();
  }
  async seek(v) {
    if (this.isVideoAvailable) {
      await VideoPlayer$1.seek(v);
    }
    await AudioPlayerV2.seek(v);
  }
  speed(s) {
    AudioPlayerV2.speed(s);
    if (this.isVideoAvailable) {
      VideoPlayer$1.speed(s);
    }
  }
  // driven by requestAnimationFrame()
  update() {
    this.currentTime.value = AudioPlayerV2.currentTime();
  }
  isPlaying() {
    return AudioPlayerV2.isPlaying();
  }
  stop() {
    AudioPlayerV2.stop();
    VideoPlayer$1.stop();
  }
};
_OSUPlayer.EMPTY_OSU = { name: "" };
_OSUPlayer.EMPTY_OSZ = new OSZ();
let OSUPlayer = _OSUPlayer;
const OSUPlayer$1 = new OSUPlayer();
const _sfc_main$p = /* @__PURE__ */ defineComponent({
  __name: "ProgressBar",
  setup(__props) {
    const state = reactive({
      width: 0
    });
    const progressBar = ref(null);
    const duration = OSUPlayer$1.duration;
    const current = OSUPlayer$1.currentTime;
    const progress = computed(() => {
      return `width: ${current.value / duration.value * state.width}px`;
    });
    const changeProgress = (ev) => {
      const progress2 = ev.offsetX / state.width;
      OSUPlayer$1.seek(duration.value * progress2);
    };
    onMounted(() => {
      if (progressBar.value) {
        state.width = progressBar.value.clientWidth;
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "progress-box",
        onMousedown: changeProgress,
        ref_key: "progressBar",
        ref: progressBar
      }, [
        createBaseVNode("div", {
          class: "progress-bg",
          style: normalizeStyle(progress.value)
        }, null, 4)
      ], 544);
    };
  }
});
const ProgressBar_vue_vue_type_style_index_0_scoped_06aef6dc_lang = "";
const ProgressBar$1 = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["__scopeId", "data-v-06aef6dc"]]);
class TempOSUPlayManager {
  constructor() {
    this.list = ref([]);
    this.currentIndex = ref(0);
    collect(AudioPlayerV2.onEnd, () => {
      this.list.value.length && this.next();
    });
  }
  async playAt(index, preview = true) {
    loadOSZ(this.list.value[index], preview);
    this.currentIndex.value = index;
  }
  next() {
    let list2 = this.list.value, currentIndex = this.currentIndex.value;
    currentIndex = (currentIndex + 1) % list2.length;
    this.currentIndex.value = currentIndex;
    this.playAt(currentIndex, false);
  }
  prev() {
    let list2 = this.list.value, currentIndex = this.currentIndex.value;
    currentIndex--;
    this.currentIndex.value = currentIndex < 0 ? list2.length - 1 : currentIndex;
    this.playAt(this.currentIndex.value, false);
  }
}
const TempOSUPlayManager$1 = new TempOSUPlayManager();
class ColorUtils {
  static lum(color, value, alpha = false) {
    const out = Color.Transparent.copy();
    this.lumTo(color, value, alpha, out);
    return out;
  }
  static lumTo(color, value, alpha = false, out) {
    const red = clamp(color.red + value, 0, 1);
    const green = clamp(color.green + value, 0, 1);
    const blue = clamp(color.blue + value, 0, 1);
    if (alpha) {
      const a = clamp(color.alpha + value, 0, 1);
      out.set(red, green, blue, a);
    } else {
      out.set(red, green, blue, color.alpha);
    }
  }
}
class Transition {
  constructor(startTime = 0, endTime = 0, timeFunction = linear, toValue = 0, fromValue = 0) {
    this.startTime = startTime;
    this.endTime = endTime;
    this.timeFunction = timeFunction;
    this.toValue = toValue;
    this.fromValue = fromValue;
    this.next = null;
    this.isEnd = false;
    this.isStarted = false;
    if (startTime > endTime) {
      throw new Error("Illegal parameter");
    }
  }
  setFromValue(v) {
    this.fromValue = v;
  }
  update(timestamp) {
    const start = this.startTime;
    const end = this.endTime;
    if (timestamp < start) {
      return this.fromValue;
    }
    this.isStarted = true;
    if (timestamp >= end) {
      this.isEnd = true;
      return this.toValue;
    }
    const progress = (timestamp - start) / (end - start);
    return this.fromValue + this.timeFunction(progress) * (this.toValue - this.fromValue);
  }
}
class TransitionGroup {
  constructor() {
    this.transition = null;
    this.current = null;
    this.isEnd = false;
    this.currentValue = 0;
  }
  add(transition) {
    if (this.transition === null) {
      this.transition = transition;
      this.current = transition;
    } else {
      this.current.next = transition;
      this.current = transition;
    }
    this.isEnd = false;
  }
  update(timestamp) {
    if (this.transition === null) {
      this.currentValue = null;
      return;
    }
    while (!this.transition.isEnd && this.transition.next != null && this.transition.next.startTime < timestamp) {
      const value2 = this.transition.update(timestamp);
      this.transition = this.transition.next;
      this.transition.setFromValue(value2);
    }
    let value = this.transition.update(timestamp);
    if (!this.transition.isStarted) {
      this.currentValue = null;
      return;
    }
    while (this.transition.isEnd) {
      if (this.transition.next !== null) {
        this.transition = this.transition.next;
        this.transition.setFromValue(value);
        value = this.transition.update(timestamp);
      } else {
        this.isEnd = true;
        break;
      }
    }
    this.currentValue = value;
  }
}
class ObjectTransition {
  constructor(obj, propertyName) {
    this.obj = obj;
    this.propertyName = propertyName;
    this.transitionGroup = null;
    this.timeOffset = 0;
    this.isEnd = false;
    if (typeof obj[propertyName] !== "number") {
      throw new Error("Unsupported data type");
    }
  }
  setStartTime(startTime) {
    this.timeOffset = startTime;
    this.isEnd = false;
  }
  transitionTo(target, duration = 0, ease = linear) {
    const transition = new Transition(
      this.timeOffset,
      this.timeOffset + duration,
      ease,
      target,
      this.obj[this.propertyName]
    );
    if (this.transitionGroup === null) {
      this.transitionGroup = new TransitionGroup();
    }
    this.transitionGroup.add(transition);
    this.timeOffset += duration;
    return this;
  }
  update(timestamp) {
    const transitionGroup = this.transitionGroup;
    if (transitionGroup !== null) {
      transitionGroup.update(timestamp);
      const value = transitionGroup.currentValue;
      if (transitionGroup.isEnd) {
        this.isEnd = true;
        this.transitionGroup = null;
      }
      if (value != null) {
        this.obj[this.propertyName] = value;
      }
    }
  }
}
class GetAndSetTransition {
  constructor(getter, setter) {
    this.getter = getter;
    this.setter = setter;
    this.transitionGroup = null;
    this.timeOffset = 0;
    this.isEnd = false;
    if (typeof getter() !== "number") {
      throw new Error("Unsupported data type");
    }
  }
  setStartTime(startTime) {
    this.timeOffset = startTime;
    this.isEnd = false;
  }
  transitionTo(target, duration = 0, ease = linear) {
    const transition = new Transition(
      this.timeOffset,
      this.timeOffset + duration,
      ease,
      target,
      this.getter()
    );
    if (this.transitionGroup === null) {
      this.transitionGroup = new TransitionGroup();
    }
    this.transitionGroup.add(transition);
    this.timeOffset += duration;
    return this;
  }
  update(timestamp) {
    const transitionGroup = this.transitionGroup;
    if (transitionGroup !== null) {
      transitionGroup.update(timestamp);
      const value = transitionGroup.currentValue;
      if (transitionGroup.isEnd) {
        this.isEnd = true;
        this.transitionGroup = null;
      }
      if (value != null) {
        this.setter(value);
      }
    }
  }
}
function useTransition(getter, setter) {
  const transition = new GetAndSetTransition(getter, setter);
  useAnimationFrame2((timestamp) => {
    transition.update(currentMilliseconds());
  });
  return (target, duration = 0, timeFunc = linear, delay = 0) => {
    transition.setStartTime(currentMilliseconds() + delay);
    transition.transitionTo(target, duration, timeFunc);
    return transition;
  };
}
function useTransitionRef(value) {
  return useTransition(() => value.value, (val) => value.value = val);
}
function useDomEvent(target, eventName, handler) {
  onMounted(() => {
    var _a2;
    (_a2 = unref(target)) == null ? void 0 : _a2.addEventListener(eventName, handler);
  });
  onUnmounted(() => {
    var _a2;
    (_a2 = unref(target)) == null ? void 0 : _a2.removeEventListener(eventName, handler);
  });
}
const _sfc_main$o = /* @__PURE__ */ defineComponent({
  __name: "BasicButton",
  props: {
    color: {},
    applyScale: { type: Boolean, default: true }
  },
  setup(__props) {
    const props = __props;
    const normalColor = props.color;
    const hoverColor = ColorUtils.lum(normalColor, 0.2);
    const activeColor = ColorUtils.lum(normalColor, 0.4);
    const red = ref(normalColor.red);
    const green = ref(normalColor.green);
    const blue = ref(normalColor.blue);
    const redTo = useTransitionRef(red);
    const greenTo = useTransitionRef(green);
    const blueTo = useTransitionRef(blue);
    const rgba = computed(() => {
      return `rgb(${red.value * 255}, ${green.value * 255}, ${blue.value * 255})`;
    });
    function colorTo(color, duration, timeFunc, delay) {
      redTo(color.red, duration, timeFunc, delay);
      greenTo(color.green, duration, timeFunc, delay);
      blueTo(color.blue, duration, timeFunc, delay);
    }
    const buttonRef = ref(null);
    const value = ref(1);
    if (props.applyScale) {
      const to = useTransitionRef(value);
      useDomEvent(buttonRef, "mousedown", () => {
        to(0.9, 4e3, easeOutQuint);
      });
      useDomEvent(buttonRef, "mouseup", () => {
        to(1, 1e3, easeOutElastic);
      });
      useDomEvent(buttonRef, "mouseleave", () => {
        to(1, 1e3, easeOutElastic);
      });
    }
    useDomEvent(buttonRef, "mouseup", () => {
      colorTo(activeColor, 40, easeOutQuint, 0);
      colorTo(hoverColor, 800, easeOutQuint, 40);
    });
    useDomEvent(buttonRef, "mouseleave", () => {
      colorTo(normalColor, 800, easeOutQuint, 0);
    });
    useDomEvent(buttonRef, "mouseenter", () => {
      colorTo(hoverColor, 800, easeOutQuint, 0);
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("button", {
        style: normalizeStyle({
          transform: `scale(${value.value})`,
          backgroundColor: rgba.value
        }),
        ref_key: "buttonRef",
        ref: buttonRef
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 4);
    };
  }
});
const _withScopeId$3 = (n) => (pushScopeId("data-v-266f3aaf"), n = n(), popScopeId(), n);
const _hoisted_1$f = { class: "player-controls" };
const _hoisted_2$8 = /* @__PURE__ */ _withScopeId$3(() => /* @__PURE__ */ createBaseVNode("div", { class: "w-1/5" }, null, -1));
const _hoisted_3$4 = { class: "player-info" };
const _hoisted_4$4 = ["src"];
const _hoisted_5$3 = ["onClick"];
const _sfc_main$n = /* @__PURE__ */ defineComponent({
  __name: "MiniPlayer",
  setup(__props) {
    const img = ref(null);
    const title = OSUPlayer$1.title;
    const artist = OSUPlayer$1.artist;
    const playState = AudioPlayerV2.playState;
    const image2 = shallowRef();
    collectLatest(OSUPlayer$1.background, (bg) => {
      if (image2.value) {
        URL.revokeObjectURL(image2.value);
      }
      if (bg.imageBlob) {
        image2.value = URL.createObjectURL(bg.imageBlob);
      }
    });
    const next = () => {
      TempOSUPlayManager$1.next();
    };
    const previous = () => {
      TempOSUPlayManager$1.prev();
    };
    const stop = () => {
      OSUPlayer$1.stop();
    };
    const play = () => {
      if (OSUPlayer$1.isPlaying()) {
        OSUPlayer$1.pause();
      } else {
        OSUPlayer$1.play();
      }
    };
    const list2 = ref(false);
    const playlist = TempOSUPlayManager$1.list;
    function playAt(i) {
      TempOSUPlayManager$1.playAt(i, false);
    }
    const listContainer = ref(null);
    const playIndex = TempOSUPlayManager$1.currentIndex;
    watch(listContainer, () => {
      if (!listContainer.value) {
        return;
      }
      const container = listContainer.value;
      const children = container.children;
      const targetIndex = Math.max(
        TempOSUPlayManager$1.currentIndex.value - 3,
        0
      );
      let scrollY = 0;
      for (let i = 0; i < targetIndex; i++) {
        scrollY += children[i].clientHeight;
      }
      container.scrollTo(0, scrollY);
    });
    return (_ctx, _cache) => {
      const _directive_osu_button = resolveDirective("osu-button");
      const _directive_osu_default = resolveDirective("osu-default");
      return openBlock(), createBlock(Column, { class: "w-fit mini-player gap-y-2" }, {
        default: withCtx(() => [
          createVNode(Column, { class: "mini-player-box relative" }, {
            default: withCtx(() => [
              createBaseVNode("div", _hoisted_1$f, [
                _hoisted_2$8,
                createVNode(Row, {
                  class: "w-3/5",
                  center: "",
                  gap: 8
                }, {
                  default: withCtx(() => [
                    withDirectives((openBlock(), createBlock(_sfc_main$o, {
                      color: unref(Color).fromHex(3157560),
                      class: "ma text-white rounded-md",
                      "apply-scale": false,
                      style: { "font-size": "36px" },
                      onClick: _cache[0] || (_cache[0] = ($event) => previous())
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(unref(Icon).SkipPrevious), 1)
                      ]),
                      _: 1
                    }, 8, ["color"])), [
                      [_directive_osu_button]
                    ]),
                    withDirectives((openBlock(), createBlock(_sfc_main$o, {
                      color: unref(Color).fromHex(3157560),
                      class: "ma text-white rounded-md",
                      "apply-scale": false,
                      style: { "font-size": "36px" },
                      onClick: _cache[1] || (_cache[1] = ($event) => play())
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(unref(playState) === unref(PlayerState).STATE_PLAYING ? unref(Icon).Pause : unref(Icon).PlayArrow), 1)
                      ]),
                      _: 1
                    }, 8, ["color"])), [
                      [_directive_osu_button]
                    ]),
                    withDirectives((openBlock(), createBlock(_sfc_main$o, {
                      color: unref(Color).fromHex(3157560),
                      class: "ma text-white rounded-md",
                      "apply-scale": false,
                      style: { "font-size": "36px" },
                      onClick: _cache[2] || (_cache[2] = ($event) => stop())
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(unref(Icon).Stop), 1)
                      ]),
                      _: 1
                    }, 8, ["color"])), [
                      [_directive_osu_button]
                    ]),
                    withDirectives((openBlock(), createBlock(_sfc_main$o, {
                      color: unref(Color).fromHex(3157560),
                      class: "ma text-white rounded-md",
                      "apply-scale": false,
                      style: { "font-size": "36px" },
                      onClick: _cache[3] || (_cache[3] = ($event) => next())
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(unref(Icon).SkipNext), 1)
                      ]),
                      _: 1
                    }, 8, ["color"])), [
                      [_directive_osu_button]
                    ])
                  ]),
                  _: 1
                }),
                createVNode(Row, {
                  class: "w-1/5",
                  center: ""
                }, {
                  default: withCtx(() => [
                    withDirectives((openBlock(), createBlock(_sfc_main$o, {
                      color: unref(Color).fromHex(3157560),
                      class: "ma text-white rounded-md",
                      "apply-scale": false,
                      style: { "font-size": "36px" },
                      onClick: _cache[4] || (_cache[4] = ($event) => list2.value = !list2.value)
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(unref(Icon).List), 1)
                      ]),
                      _: 1
                    }, 8, ["color"])), [
                      [_directive_osu_button]
                    ])
                  ]),
                  _: 1
                })
              ]),
              createBaseVNode("div", _hoisted_3$4, [
                createBaseVNode("img", {
                  ref_key: "img",
                  ref: img,
                  src: image2.value,
                  alt: "",
                  class: "object-cover w-full h-full absolute song-cover"
                }, null, 8, _hoisted_4$4),
                createVNode(Column, {
                  class: "w-full h-full flex-grow absolute bg-black bg-opacity-10",
                  center: "",
                  gap: 8
                }, {
                  default: withCtx(() => [
                    createBaseVNode("span", null, toDisplayString(unref(title)), 1),
                    createBaseVNode("span", null, toDisplayString(unref(artist)), 1)
                  ]),
                  _: 1
                })
              ]),
              createVNode(ProgressBar$1, {
                style: { "width": "100%" },
                class: "absolute bottom-0 progress-bar"
              })
            ]),
            _: 1
          }),
          createVNode(Transition$1, { name: "mini-list" }, {
            default: withCtx(() => [
              list2.value ? (openBlock(), createBlock(Column, {
                key: 0,
                class: "mini-playlist no-scroller",
                style: { "height": "calc(100vh - var(--top-bar-height) - 16px - 160px)" }
              }, {
                default: withCtx(() => [
                  createBaseVNode("div", {
                    ref_key: "listContainer",
                    ref: listContainer
                  }, [
                    (openBlock(true), createElementBlock(Fragment, null, renderList(unref(playlist), (item, i) => {
                      return withDirectives((openBlock(), createElementBlock("span", {
                        class: normalizeClass(["rounded-md w-full hover:text-yellow-500 p-2 text-sm cursor-pointer", {
                          "text-yellow-500": unref(playIndex) === i,
                          "text-white": unref(playIndex) !== i
                        }]),
                        onClick: ($event) => playAt(i)
                      }, [
                        createTextVNode(toDisplayString(item.name), 1)
                      ], 10, _hoisted_5$3)), [
                        [_directive_osu_default]
                      ]);
                    }), 256))
                  ], 512)
                ]),
                _: 1
              })) : createCommentVNode("", true)
            ]),
            _: 1
          })
        ]),
        _: 1
      });
    };
  }
});
const MiniPlayer_vue_vue_type_style_index_0_scoped_266f3aaf_lang = "";
const MiniPlayer = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["__scopeId", "data-v-266f3aaf"]]);
const UIState = reactive({
  starSmoke: false,
  logoDrag: true,
  logoHover: true,
  beatmapBackground: true
});
const defaultImage = "" + new URL("menu-background-1-05e31a26.jpg", import.meta.url).href;
const bg2 = "" + new URL("menu-background-2-9c4c914b.jpg", import.meta.url).href;
const bg3 = "" + new URL("menu-background-3-1f77c019.jpg", import.meta.url).href;
const bg4 = "" + new URL("menu-background-4-7a8f47a6.jpg", import.meta.url).href;
const bg5 = "" + new URL("menu-background-5-a087a7e0.jpg", import.meta.url).href;
const bg6 = "" + new URL("menu-background-6-6a466c0e.jpg", import.meta.url).href;
const bg7 = "" + new URL("menu-background-7-60ba0f5f.jpg", import.meta.url).href;
class BackgroundDao {
  async downloadBackground(name) {
    let response;
    {
      response = await fetch(name);
    }
    if (int(response.status / 100) !== 2) {
      return null;
    }
    return await response.blob();
  }
  async getBackgroundList() {
    {
      return [defaultImage, bg2, bg3, bg4, bg5, bg6, bg7];
    }
  }
}
const BackgroundDao$1 = new BackgroundDao();
const MAX_CACHE_SIZE$1 = 6;
class BackgroundLoader {
  constructor() {
    this.imageQueue = [];
    this.imageRecord = {};
    this.recycleQueue = [];
    this.backgroundNames = [];
    this.isInit = false;
    this.backgroundSequence = [];
  }
  async init() {
    const backgroundList = await BackgroundDao$1.getBackgroundList();
    if (!backgroundList) {
      throw new Error("No background");
    }
    for (let i = 0; i < backgroundList.length; i++) {
      this.imageRecord[backgroundList[i]] = true;
    }
    this.backgroundNames = backgroundList;
    const downloadCount = Math.min(backgroundList.length, MAX_CACHE_SIZE$1);
    const randomSequence = this.randomSequence(backgroundList.length);
    this.backgroundSequence = randomSequence;
    for (let i = 0; i < downloadCount; i++) {
      const idx = randomSequence.shift();
      const name = backgroundList[idx];
      const blob = await BackgroundDao$1.downloadBackground(name);
      if (!blob) {
        this.imageRecord[name] = false;
        continue;
      }
      this.imageQueue.push(await createImageBitmap(blob));
    }
    this.isInit = true;
  }
  getBackground() {
    let randomSequence = this.backgroundSequence;
    if (randomSequence.length) {
      randomSequence = this.randomSequence(this.backgroundNames.length);
      this.backgroundSequence = randomSequence;
    }
    const image2 = this.imageQueue.shift();
    let index = randomSequence.shift();
    let name = this.backgroundNames[index];
    while (!this.imageRecord[name]) {
      index = randomSequence.shift();
      name = this.backgroundNames[index];
    }
    BackgroundDao$1.downloadBackground(name).then((blob) => {
      if (blob) {
        return createImageBitmap(blob);
      } else {
        this.imageRecord[name] = false;
      }
    }).then((image22) => {
      if (image22) {
        this.imageQueue.push(image22);
      }
    });
    this.recycleQueue.push(image2);
    this.recycleImageIfNeed();
    return image2;
  }
  recycleImageIfNeed() {
    if (this.recycleQueue.length >= MAX_CACHE_SIZE$1) {
      const image2 = this.recycleQueue.shift();
      image2 == null ? void 0 : image2.close();
    }
  }
  randomSequence(count) {
    const result = [];
    const mark = new Array(count).fill(true);
    for (let k = 0; k < mark.length; k++) {
      const rand = clamp(
        int(Interpolation.valueAt(Math.random(), 0, 9)),
        0,
        count - 1
      );
      if (mark[rand]) {
        result.push(rand);
        mark[rand] = false;
      } else {
        for (let i = rand, j = 0; j < mark.length; i = (i + 1) % count, j++) {
          if (mark[i]) {
            result.push(i);
            mark[i] = false;
            break;
          }
        }
      }
    }
    return result;
  }
}
const BackgroundLoader$1 = new BackgroundLoader();
const MAX_CACHE_SIZE = 6;
class LocalBackgroundLoader {
  constructor() {
    this.backgroundFiles = [];
    this.recycleQueue = [];
    this.isInit = false;
    this.currentBackgroundFile = null;
    this.currentBackgroundImage = null;
    this.formats = ["jpg", "jpeg", "png"];
  }
  async init() {
    if (this.isInit) {
      return true;
    }
    try {
      const handle = await window.showDirectoryPicker();
      this.backgroundFiles.length = 0;
      for await (const entry of handle.values()) {
        if (entry.kind === "file" && this.isAccept(entry.name)) {
          const file = await entry.getFile();
          this.backgroundFiles.push(file);
        }
      }
      if (this.backgroundFiles.length === 0) {
        return false;
      }
      const index = ~~Interpolation.valueAt(Math.random(), 0, this.backgroundFiles.length - 1);
      this.currentBackgroundFile = this.backgroundFiles[index];
      this.currentBackgroundImage = await createImageBitmap(this.backgroundFiles[index]);
      this.isInit = true;
      return true;
    } catch (_) {
      return false;
    }
  }
  async forceInit() {
    this.isInit = false;
    await this.init();
  }
  getBackground() {
    let index = ~~Interpolation.valueAt(Math.random(), 0, this.backgroundFiles.length - 1);
    if (this.currentBackgroundFile === this.backgroundFiles[index]) {
      index = (index + 1) % this.backgroundFiles.length;
    }
    const image2 = this.currentBackgroundImage;
    this.recycleQueue.push(image2);
    this.recycleImageIfNeed();
    createImageBitmap(this.backgroundFiles[index]).then((image22) => {
      this.currentBackgroundImage = image22;
    });
    return image2;
  }
  isAccept(name) {
    const dotIndex = name.indexOf(".");
    if (dotIndex < 0) {
      return false;
    }
    const extension = name.substring(dotIndex + 1).toLowerCase();
    return this.formats.includes(extension);
  }
  recycleImageIfNeed() {
    if (this.recycleQueue.length > MAX_CACHE_SIZE) {
      const image2 = this.recycleQueue.shift();
      image2 == null ? void 0 : image2.close();
    }
  }
}
const LocalBackgroundLoader$1 = new LocalBackgroundLoader();
class BackgroundManager {
  constructor() {
    this.Default = 0;
    this.Beatmap = 1;
    this.Custom = 2;
    this.currentLoader = ref(-1);
    this.customBackgroundChange = ref(0);
  }
  async changeLoader(loader) {
    const currentLoader = this.currentLoader.value;
    let success = true;
    if (currentLoader === loader) {
      return success;
    }
    if (loader === this.Default) {
      await BackgroundLoader$1.init();
      success = true;
    } else if (loader === this.Custom) {
      success = await LocalBackgroundLoader$1.init();
    }
    if (!success) {
      return false;
    }
    this.currentLoader.value = loader;
    return success;
  }
  getBackground() {
    const loader = this.currentLoader.value;
    if (loader === this.Default) {
      return BackgroundLoader$1.getBackground();
    } else if (loader === this.Custom) {
      return LocalBackgroundLoader$1.getBackground();
    } else {
      throw new Error("No loader found");
    }
  }
  changeCustomBackground() {
    const loader = this.currentLoader.value;
    if (loader === this.Custom) {
      this.customBackgroundChange.value = (this.customBackgroundChange.value + 1) % 5;
    }
  }
}
const BackgroundManager$1 = new BackgroundManager();
const _sfc_main$m = /* @__PURE__ */ defineComponent({
  __name: "OSUButton",
  props: {
    fill: { type: Boolean, default: false }
  },
  setup(__props) {
    const normalColor = Color.fromHex(5845964);
    const hoverColor = ColorUtils.lum(normalColor, 0.2);
    const activeColor = ColorUtils.lum(normalColor, 0.4);
    const red = ref(normalColor.red);
    const green = ref(normalColor.green);
    const blue = ref(normalColor.blue);
    const redTo = useTransitionRef(red);
    const greenTo = useTransitionRef(green);
    const blueTo = useTransitionRef(blue);
    const rgb = computed(() => {
      return `rgba(${red.value * 255}, ${green.value * 255}, ${blue.value * 255}, ${normalColor.alpha})`;
    });
    function colorTo(color, duration, timeFunc, delay) {
      redTo(color.red, duration, timeFunc, delay);
      greenTo(color.green, duration, timeFunc, delay);
      blueTo(color.blue, duration, timeFunc, delay);
    }
    const value = ref(1);
    const to = useTransitionRef(value);
    const buttonRef = ref(null);
    useDomEvent(buttonRef, "mousedown", () => {
      to(0.9, 4e3, easeOutQuint);
    });
    useDomEvent(buttonRef, "mouseup", () => {
      to(1, 1e3, easeOutElastic);
      colorTo(activeColor, 40, easeOutQuint, 0);
      colorTo(hoverColor, 800, easeOutQuint, 40);
    });
    useDomEvent(buttonRef, "mouseleave", () => {
      to(1, 1e3, easeOutElastic);
      colorTo(normalColor, 800, easeOutQuint, 0);
    });
    useDomEvent(buttonRef, "mouseenter", () => {
      colorTo(hoverColor, 800, easeOutQuint, 0);
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("button", {
        class: normalizeClass(["osu-button", { "w-full": _ctx.fill }]),
        style: normalizeStyle({
          transform: `scale(${value.value})`,
          backgroundColor: rgb.value
        }),
        ref_key: "buttonRef",
        ref: buttonRef
      }, [
        renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ], 6);
    };
  }
});
const OSUButton_vue_vue_type_style_index_0_scoped_06c43e24_lang = "";
const OSUButton = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["__scopeId", "data-v-06c43e24"]]);
const _hoisted_1$e = /* @__PURE__ */ createBaseVNode("h1", { class: "text-3xl mb-4 mt-2" }, "界面", -1);
const _hoisted_2$7 = /* @__PURE__ */ createBaseVNode("span", null, "Logo Drag", -1);
const _hoisted_3$3 = /* @__PURE__ */ createBaseVNode("span", { class: "flex-row" }, "Logo Hover", -1);
const _hoisted_4$3 = /* @__PURE__ */ createBaseVNode("span", null, "背景", -1);
const _hoisted_5$2 = /* @__PURE__ */ createBaseVNode("span", null, "加载视频", -1);
const _sfc_main$l = /* @__PURE__ */ defineComponent({
  __name: "UISettings",
  setup(__props) {
    const backgroundType = [
      "default",
      "beatmap",
      "custom"
    ];
    const item = ref(
      backgroundType[BackgroundManager$1.currentLoader.value] ?? "beatmap"
    );
    watch(item, (value, oldValue) => {
      if (value === "default") {
        BackgroundManager$1.changeLoader(BackgroundManager$1.Default);
      } else if (value === "beatmap") {
        BackgroundManager$1.changeLoader(BackgroundManager$1.Beatmap);
      } else if (value === "custom") {
        BackgroundManager$1.changeLoader(BackgroundManager$1.Custom).then((v) => {
          if (!v) {
            item.value = oldValue;
          }
        });
      }
    });
    function refreshCustomBackground() {
      BackgroundManager$1.changeCustomBackground();
    }
    function reloadCustomBackground() {
      LocalBackgroundLoader$1.forceInit();
    }
    return (_ctx, _cache) => {
      const _directive_osu_button = resolveDirective("osu-button");
      return openBlock(), createBlock(Column, {
        class: "w-full h-full text-white p-6",
        gap: 16
      }, {
        default: withCtx(() => [
          _hoisted_1$e,
          createVNode(Row, {
            class: "w-full",
            "center-vertical": ""
          }, {
            default: withCtx(() => [
              _hoisted_2$7,
              createVNode(CheckBox, {
                class: "ml-auto",
                modelValue: unref(UIState).logoDrag,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => unref(UIState).logoDrag = $event)
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }),
          createVNode(Row, {
            class: "w-full",
            "center-vertical": ""
          }, {
            default: withCtx(() => [
              _hoisted_3$3,
              createVNode(CheckBox, {
                class: "ml-auto",
                modelValue: unref(UIState).logoHover,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => unref(UIState).logoHover = $event)
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }),
          createVNode(Column, {
            class: "w-full",
            "center-vertical": "",
            gap: 8
          }, {
            default: withCtx(() => [
              _hoisted_4$3,
              createVNode(ExpandMenu, {
                items: backgroundType,
                modelValue: item.value,
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => item.value = $event),
                class: "w-full"
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }),
          createVNode(Row, {
            class: "w-full",
            center: ""
          }, {
            default: withCtx(() => [
              withDirectives((openBlock(), createBlock(OSUButton, {
                fill: "",
                onClick: _cache[3] || (_cache[3] = ($event) => refreshCustomBackground())
              }, {
                default: withCtx(() => [
                  createTextVNode(" 切换自定义背景 ")
                ]),
                _: 1
              })), [
                [_directive_osu_button]
              ])
            ]),
            _: 1
          }),
          createVNode(Row, {
            class: "w-full",
            center: ""
          }, {
            default: withCtx(() => [
              withDirectives((openBlock(), createBlock(OSUButton, {
                fill: "",
                onClick: _cache[4] || (_cache[4] = ($event) => reloadCustomBackground())
              }, {
                default: withCtx(() => [
                  createTextVNode(" 修改自定义背景文件夹 ")
                ]),
                _: 1
              })), [
                [_directive_osu_button]
              ])
            ]),
            _: 1
          }),
          createVNode(Row, {
            class: "w-full",
            center: ""
          }, {
            default: withCtx(() => [
              _hoisted_5$2,
              createVNode(CheckBox, {
                class: "ml-auto",
                modelValue: unref(OSZConfig).loadVideo,
                "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => unref(OSZConfig).loadVideo = $event)
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          })
        ]),
        _: 1
      });
    };
  }
});
const _sfc_main$k = /* @__PURE__ */ defineComponent({
  __name: "VisualizerSettings",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Column, {
        class: "fill-size",
        gap: 16,
        style: { "padding": "16px", "color": "white" }
      });
    };
  }
});
const _withScopeId$2 = (n) => (pushScopeId("data-v-5156e2c8"), n = n(), popScopeId(), n);
const _hoisted_1$d = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("div", null, null, -1));
const _hoisted_2$6 = { class: "ma" };
const _sfc_main$j = /* @__PURE__ */ defineComponent({
  __name: "SelectorButton",
  props: {
    icon: {},
    title: {},
    active: { type: Boolean }
  },
  setup(__props) {
    const color = Color.fromHex(2368042);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$o, {
        color: unref(color),
        class: "rounded-md px-6 py-2"
      }, {
        default: withCtx(() => [
          createVNode(Row, {
            gap: 4,
            "center-vertical": "",
            class: normalizeClass(["selector-item", {
              "selector-item-selected": _ctx.active
            }])
          }, {
            default: withCtx(() => [
              _hoisted_1$d,
              createBaseVNode("div", _hoisted_2$6, toDisplayString(_ctx.icon), 1),
              createBaseVNode("div", null, toDisplayString(_ctx.title), 1)
            ]),
            _: 1
          }, 8, ["class"])
        ]),
        _: 1
      }, 8, ["color"]);
    };
  }
});
const SelectorButton_vue_vue_type_style_index_0_scoped_5156e2c8_lang = "";
const SelectorButton = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["__scopeId", "data-v-5156e2c8"]]);
const _hoisted_1$c = {
  style: { "flex-grow": "1", "background-color": "var(--settings-content-bg)" },
  class: "fill-height"
};
const _sfc_main$i = /* @__PURE__ */ defineComponent({
  __name: "SettingsPanel",
  setup(__props) {
    const state = reactive({
      selectIndex: 0,
      selectors: [{
        icon: Icon.FormatPaint,
        title: "界面"
      }, {
        icon: Icon.MusicNote,
        title: "可视化"
      }]
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Row, {
        class: "h-full",
        style: { "width": "600px" }
      }, {
        default: withCtx(() => [
          createVNode(Column, {
            class: "selector",
            gap: 4
          }, {
            default: withCtx(() => [
              (openBlock(true), createElementBlock(Fragment, null, renderList(state.selectors, (item, index) => {
                return openBlock(), createBlock(SelectorButton, {
                  title: item.title,
                  icon: item.icon,
                  active: state.selectIndex === index,
                  onClick: ($event) => state.selectIndex = index
                }, null, 8, ["title", "icon", "active", "onClick"]);
              }), 256))
            ]),
            _: 1
          }),
          createBaseVNode("div", _hoisted_1$c, [
            state.selectIndex === 0 ? (openBlock(), createBlock(_sfc_main$l, { key: 0 })) : createCommentVNode("", true),
            state.selectIndex === 2 ? (openBlock(), createBlock(_sfc_main$k, { key: 1 })) : createCommentVNode("", true)
          ])
        ]),
        _: 1
      });
    };
  }
});
const SettingsPanel_vue_vue_type_style_index_0_scoped_0c211cc6_lang = "";
const SettingsPanel = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["__scopeId", "data-v-0c211cc6"]]);
const _sfc_main$h = /* @__PURE__ */ defineComponent({
  __name: "Toast",
  setup(__props) {
    const toastMessage = ref("");
    const opacity = ref(0);
    const opacityTo = useTransitionRef(opacity);
    const clearMessage = debounce(() => {
      toastMessage.value = "";
    }, 3200);
    useSingleEvent(Toaster.onToast, (message) => {
      opacityTo(1, 200, easeOut);
      opacityTo(0, 500, easeOutQuint, 2500);
      toastMessage.value = message;
      clearMessage();
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "toast-box",
        style: normalizeStyle(`opacity: ${opacity.value};`)
      }, [
        createVNode(Row, { center: "" }, {
          default: withCtx(() => [
            createTextVNode(toDisplayString(toastMessage.value), 1)
          ]),
          _: 1
        })
      ], 4);
    };
  }
});
const Toast_vue_vue_type_style_index_0_scoped_e6d3bc01_lang = "";
const Toast = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["__scopeId", "data-v-e6d3bc01"]]);
const _BeatDispatcher = class _BeatDispatcher2 {
  static register(beat) {
    this.IBeatList.push(beat);
  }
  static unregister(beat) {
    const index = this.IBeatList.indexOf(beat);
    if (ArrayUtils.inBound(_BeatDispatcher2.IBeatList, index)) {
      _BeatDispatcher2.IBeatList.splice(index, 1);
    }
  }
  static fireNewBeat(isKiai, newBeatTimestamp, gap) {
    const list2 = _BeatDispatcher2.IBeatList;
    for (let i = 0; i < list2.length; i++) {
      list2[i].onNewBeat(isKiai, newBeatTimestamp, gap);
    }
  }
};
_BeatDispatcher.IBeatList = [];
let BeatDispatcher = _BeatDispatcher;
const BeatState = {
  currentBeat: 0,
  isKiai: false,
  beatIndex: 0,
  currentRMS: 0,
  isAvailable: false,
  nextBeatRMS: 0
};
class MusicDao {
  async downloadMusic(id2) {
    AudioPlayerV2.playState.value = PlayerState.STATE_DOWNLOADING;
    const response = await fetch(url(`/music?id=${id2}`));
    return await response.arrayBuffer();
  }
  async getMusicList() {
    const response = await fetch(url("/musicList"));
    return (await response.json()).data;
  }
  async uploadTimingInfo(timingInfo) {
    return true;
  }
  async getAllTimingList() {
    const response = await fetch(url("/allTimingList"));
    const data = await response.json();
    if (data.code === 0 && data.data) {
      return data.data;
    } else {
      console.log("fetch all timing failed");
    }
  }
  async getTimingById(id2) {
    const response = await fetch(url(`/timing?id=${id2}`));
    const result = await response.json();
    if (result.code != 0) {
      return null;
    }
    return result.data;
  }
}
const MusicDao$1 = new MusicDao();
class TimingManager {
  constructor() {
    this.defaultTiming = {
      version: "1.0",
      bpm: 60,
      offset: 0,
      id: -1,
      timingList: []
    };
    this.onTimingUpdate = createMutableSharedFlow();
    this.timingCache = /* @__PURE__ */ new Map();
    this.isInit = false;
  }
  async init() {
    const list2 = await MusicDao$1.getAllTimingList();
    console.log(list2);
    if (!list2)
      return;
    for (let i = 0; i < list2.length; i++) {
      const timing = list2[i];
      this.addTimingInfoToCache(timing);
    }
    this.isInit = true;
  }
  async getTiming(id2) {
    if (!this.isInit) {
      await this.init();
    }
    const timing = this.timingCache.get(id2);
    if (timing) {
      return timing;
    } else {
      return null;
    }
  }
  addTimingInfoToCache(timingInfo) {
    if (timingInfo.id < 0) {
      return timingInfo;
    }
    this.timingCache.set(timingInfo.id, timingInfo);
    return timingInfo;
  }
  async updateTiming(newTiming) {
    const success = await MusicDao$1.uploadTimingInfo(newTiming);
    if (success) {
      this.addTimingInfoToCache(newTiming);
      this.onTimingUpdate.emit(newTiming);
    }
    return success;
  }
  toBulletTimingPoints(timingInfo) {
    const beatLength = 60 / timingInfo.bpm * 1e3;
    const timingList = timingInfo.timingList.map((value) => {
      return {
        isKiai: value.isKiai,
        time: value.timestamp,
        beatLength
      };
    });
    return {
      timingList
    };
  }
}
const TimingManager$1 = new TimingManager();
class BeatBooster {
  constructor() {
    this.timingList = [];
    this.beatCount = 0;
    this.prevBeat = -1;
    this.isAvailable = false;
    this.currentBeatLength = 1e3;
    this.currentTime = 0;
    this.isDynamicBPM = false;
    this.beatTimingPoints = [];
    TimingManager$1.onTimingUpdate.collect((timingInfo) => {
      if (!timingInfo) {
        this.setTimingPoints(null);
        return;
      }
      const bulletTimingPoints = TimingManager$1.toBulletTimingPoints(timingInfo);
      this.setTimingPoints(bulletTimingPoints.timingList);
    });
    collect(OSUPlayer$1.onChanged, ([osu]) => {
      if (osu.TimingPoints && osu.TimingPoints.timingList.length) {
        this.setTimingPoints(osu.TimingPoints.timingList);
      } else {
        this.setTimingPoints(null);
      }
    });
  }
  setTimingPoints(timingList) {
    if (timingList === null || timingList.length === 0) {
      this.isAvailable = false;
      timingList = [{
        beatLength: 1e3,
        isKiai: false,
        time: 0
      }];
    } else {
      this.isAvailable = true;
    }
    this.prevBeat = -1;
    this.timingList = timingList;
    this.beatTimingPoints = timingList.filter((v) => v.beatLength > 0);
    if (this.beatTimingPoints.length === 1) {
      this.isDynamicBPM = false;
      this.currentTime = this.beatTimingPoints[0].time;
      this.currentBeatLength = this.beatTimingPoints[0].beatLength;
    } else {
      this.isDynamicBPM = true;
    }
  }
  updateBeat(timestamp, before = linear, after = linear) {
    if (this.isDynamicBPM) {
      const timingList = this.beatTimingPoints;
      let timing, i = 0;
      while (i < timingList.length) {
        if (timestamp < timingList[i].time) {
          if (i > 0) {
            timing = timingList[i - 1];
          }
          break;
        }
        i++;
      }
      if (i === timingList.length) {
        timing = timingList[i - 1];
      }
      if (!timing || i === 0 && timestamp < timing.time) {
        return 0;
      }
      this.currentBeatLength = timing.beatLength;
      this.currentTime = timing.time;
    } else {
      if (timestamp < this.currentTime) {
        return 0;
      }
    }
    timestamp -= this.currentTime;
    const gap = this.currentBeatLength;
    timestamp += 60;
    const count = int(timestamp / gap);
    timestamp -= count * gap;
    this.beatCount = count;
    if (count === 0) {
      return 0;
    }
    if (this.prevBeat != count) {
      this.prevBeat = count;
      const nextBeatTime = this.getNextBeatTime();
      BeatDispatcher.fireNewBeat(this.isKiai(nextBeatTime), nextBeatTime, this.currentBeatLength);
    }
    if (timestamp <= 60) {
      return before(timestamp / 60);
    }
    if (timestamp <= gap) {
      return after(1 - (timestamp - 60) / (gap - 60));
    }
    return 0;
  }
  getNextBeatTime() {
    return this.currentTime + this.currentBeatLength * (this.beatCount + 1);
  }
  isKiai(currentTime) {
    currentTime += 60;
    const timingList = this.timingList;
    if (timingList.length === 0) {
      return false;
    }
    let item = null;
    for (let i = 0; i < timingList.length; i++) {
      if (currentTime <= timingList[i].time) {
        if (i > 0) {
          item = timingList[i - 1];
        }
        break;
      }
    }
    if (item === null) {
      return false;
    } else {
      return item.isKiai;
    }
  }
  getCurrentBeatCount() {
    return this.beatCount;
  }
}
const BeatBooster$1 = new BeatBooster();
class MouseEventRecorder {
  static record(event) {
    this.eventList.push(event);
    this.eventListReserve.unshift(event);
  }
  static remove(event) {
    let index = this.eventList.indexOf(event);
    if (index >= 0)
      this.eventList.splice(index, 1);
    index = this.eventListReserve.indexOf(event);
    if (index >= 0)
      this.eventListReserve.splice(index, 1);
  }
}
MouseEventRecorder.eventList = [];
MouseEventRecorder.eventListReserve = [];
class MouseEventFire {
  static pause() {
    this.fireMouseEvent = false;
  }
  static resume() {
    this.fireMouseEvent = true;
  }
  static fireMouseDown(which, position) {
    if (!this.fireMouseEvent) {
      return;
    }
    const events = MouseEventRecorder.eventList;
    for (let i = events.length - 1; i >= 0; i--) {
      const event = events[i];
      if (event.inBound(position) && event.isPresent) {
        event == null ? void 0 : event.mouseDown(which, position);
      }
    }
  }
  static fireMouseMove(which, position) {
    if (!this.fireMouseEvent) {
      return;
    }
    const events = MouseEventRecorder.eventList;
    for (let i = events.length - 1; i >= 0; i--) {
      const event = events[i];
      event == null ? void 0 : event.mouseMove(which, position);
    }
  }
  static fireMouseUp(which, position) {
    if (!this.fireMouseEvent) {
      return;
    }
    const events = MouseEventRecorder.eventListReserve;
    for (const event of events) {
      event.mouseUp(which, position);
    }
  }
}
MouseEventFire.fireMouseEvent = true;
const MOUSE_LEFT_DOWN = 1;
const MOUSE_RIGHT_DOWN = 2;
const MOUSE_MOVE = 4;
const MOUSE_NONE = 0;
const MOUSE_KEY_LEFT = 1;
const MOUSE_KEY_RIGHT = 2;
const MOUSE_KEY_NONE = 0;
const _MouseState = class _MouseState2 {
  static receiveMouseDown(which, x, y) {
    _MouseState2.which |= which;
    _MouseState2.state |= which === MOUSE_KEY_LEFT ? MOUSE_LEFT_DOWN : MOUSE_RIGHT_DOWN;
    _MouseState2.position.x = x;
    _MouseState2.position.y = y;
    _MouseState2.downPosition.x = x;
    _MouseState2.downPosition.y = y;
    MouseEventFire.fireMouseDown(which, _MouseState2.position);
  }
  static receiveMouseUp(which, x, y) {
    _MouseState2.which ^= which;
    _MouseState2.state ^= which === MOUSE_KEY_LEFT ? MOUSE_LEFT_DOWN : MOUSE_RIGHT_DOWN;
    _MouseState2.position.x = x;
    _MouseState2.position.y = y;
    _MouseState2.upPosition.x = x;
    _MouseState2.upPosition.y = y;
    MouseEventFire.fireMouseUp(which, _MouseState2.position);
    if (_MouseState2.downPosition.equals(_MouseState2.upPosition)) {
      _MouseState2.fireOnClick(which);
    }
  }
  static receiveMouseMove(x, y) {
    _MouseState2.state |= MOUSE_MOVE;
    _MouseState2.position.x = x;
    _MouseState2.position.y = y;
    MouseEventFire.fireMouseMove(_MouseState2.which, _MouseState2.position);
  }
  static isLeftDown() {
    return (_MouseState2.state & MOUSE_LEFT_DOWN) === 1;
  }
  static isRightDown() {
    return (_MouseState2.state >> 1 & MOUSE_RIGHT_DOWN) === 1;
  }
  static isLeftUp() {
    return (_MouseState2.state & MOUSE_LEFT_DOWN) !== 1;
  }
  static isRightUp() {
    return (_MouseState2.state >> 1 & MOUSE_RIGHT_DOWN) !== 1;
  }
  static isMove() {
    return (_MouseState2.state >> 2 & MOUSE_MOVE) === 1;
  }
  static fireOnClick(which) {
    var _a2;
    (_a2 = _MouseState2.onClick) == null ? void 0 : _a2.call(_MouseState2, which);
  }
  static fireOnMousedown(which) {
    var _a2;
    (_a2 = _MouseState2.onMouseDown) == null ? void 0 : _a2.call(_MouseState2, which);
  }
  static fireOnMouseUp(which) {
    var _a2;
    (_a2 = _MouseState2.onMouseUp) == null ? void 0 : _a2.call(_MouseState2, which);
  }
  static fireOnMouseMove() {
    var _a2;
    (_a2 = _MouseState2.onMouseMove) == null ? void 0 : _a2.call(_MouseState2);
  }
  static hasKeyDown() {
    return (_MouseState2.state & 3) !== 0;
  }
  static isLeftKey(which) {
    return (which & MOUSE_KEY_LEFT) != 0;
  }
  static isRightKey(which) {
    return (which & MOUSE_KEY_RIGHT) != 0;
  }
};
_MouseState.state = MOUSE_NONE;
_MouseState.downPosition = Vector2.newZero();
_MouseState.upPosition = Vector2.newZero();
_MouseState.position = Vector2.newZero();
_MouseState.which = MOUSE_KEY_NONE;
_MouseState.onClick = null;
_MouseState.onMouseDown = null;
_MouseState.onMouseMove = null;
_MouseState.onMouseUp = null;
let MouseState = _MouseState;
const Time = {
  elapsed: 0,
  currentTime: 0
};
const _Matrix3 = class _Matrix32 {
  constructor() {
    this.value = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ];
  }
  static newIdentify() {
    const ma = new _Matrix32();
    ma.M11 = 1;
    ma.M22 = 1;
    ma.M33 = 1;
    return ma;
  }
  static newMatrix(value) {
    const ma = new _Matrix32();
    ma.value = value;
    return ma;
  }
  static copyTo(ma, out) {
    if (out.length < ma.value.length) {
      throw new Error("out.length should be greater than or equal to 9");
    }
    for (let i = 0; i < out.length; i++) {
      out[i] = ma.value[i];
    }
  }
  setFrom(other) {
    for (let i = 0; i < 9; i++) {
      this.value[i] = other.value[i];
    }
  }
  copy() {
    const m = new _Matrix32();
    m.setFrom(this);
    return m;
  }
  get M11() {
    return this.value[0];
  }
  set M11(v) {
    this.value[0] = v;
  }
  get M12() {
    return this.value[1];
  }
  set M12(v) {
    this.value[1] = v;
  }
  get M13() {
    return this.value[2];
  }
  set M13(v) {
    this.value[2] = v;
  }
  get M21() {
    return this.value[3];
  }
  set M21(v) {
    this.value[3] = v;
  }
  get M22() {
    return this.value[4];
  }
  set M22(v) {
    this.value[4] = v;
  }
  get M23() {
    return this.value[5];
  }
  set M23(v) {
    this.value[5] = v;
  }
  get M31() {
    return this.value[6];
  }
  set M31(v) {
    this.value[6] = v;
  }
  get M32() {
    return this.value[7];
  }
  set M32(v) {
    this.value[7] = v;
  }
  get M33() {
    return this.value[8];
  }
  set M33(v) {
    this.value[8] = v;
  }
};
_Matrix3.identify = _Matrix3.newIdentify();
let Matrix3 = _Matrix3;
class MatrixUtils {
  static m3Multi(mt1, mt2) {
    return this.m3MultiTo(mt1, mt2, new Matrix3());
  }
  static m3MultiTo(mt1, mt2, result) {
    result.M11 = mt1.M11 * mt2.M11 + mt1.M12 * mt2.M21 + mt1.M13 * mt2.M31;
    result.M12 = mt1.M11 * mt2.M12 + mt1.M12 * mt2.M22 + mt1.M13 * mt2.M32;
    result.M13 = mt1.M11 * mt2.M13 + mt1.M12 * mt2.M23 + mt1.M13 * mt2.M33;
    result.M21 = mt1.M21 * mt2.M11 + mt1.M22 * mt2.M21 + mt1.M23 * mt2.M31;
    result.M22 = mt1.M21 * mt2.M12 + mt1.M22 * mt2.M22 + mt1.M23 * mt2.M32;
    result.M23 = mt1.M21 * mt2.M13 + mt1.M22 * mt2.M23 + mt1.M23 * mt2.M33;
    result.M31 = mt1.M31 * mt2.M11 + mt1.M32 * mt2.M21 + mt1.M33 * mt2.M31;
    result.M32 = mt1.M31 * mt2.M12 + mt1.M32 * mt2.M22 + mt1.M33 * mt2.M32;
    result.M33 = mt1.M31 * mt2.M13 + mt1.M32 * mt2.M23 + mt1.M33 * mt2.M33;
    return result;
  }
  static m3MultiToArray(mt1, mt2, result) {
    result[0] = mt1.M11 * mt2.M11 + mt1.M12 * mt2.M21 + mt1.M13 * mt2.M31;
    result[1] = mt1.M11 * mt2.M12 + mt1.M12 * mt2.M22 + mt1.M13 * mt2.M32;
    result[2] = mt1.M11 * mt2.M13 + mt1.M12 * mt2.M23 + mt1.M13 * mt2.M33;
    result[3] = mt1.M21 * mt2.M11 + mt1.M22 * mt2.M21 + mt1.M23 * mt2.M31;
    result[4] = mt1.M21 * mt2.M12 + mt1.M22 * mt2.M22 + mt1.M23 * mt2.M32;
    result[5] = mt1.M21 * mt2.M13 + mt1.M22 * mt2.M23 + mt1.M23 * mt2.M33;
    result[6] = mt1.M31 * mt2.M11 + mt1.M32 * mt2.M21 + mt1.M33 * mt2.M31;
    result[7] = mt1.M31 * mt2.M12 + mt1.M32 * mt2.M22 + mt1.M33 * mt2.M32;
    result[8] = mt1.M31 * mt2.M13 + mt1.M32 * mt2.M23 + mt1.M33 * mt2.M33;
    return result;
  }
  static m4Multi(mt1, mt2) {
    const result = new Float32Array([
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ]);
    this.m4MultiTo(mt1, mt2, result);
    return result;
  }
  static m4MultiTo(mt1, mt2, result) {
    result[0] = mt1[0] * mt2[0] + mt1[1] * mt2[1] + mt1[2] * mt2[2] + mt1[3] * mt2[3];
    result[1] = mt1[0] * mt2[4] + mt1[1] * mt2[5] + mt1[2] * mt2[6] + mt1[3] * mt2[7];
    result[2] = mt1[0] * mt2[8] + mt1[1] * mt2[9] + mt1[2] * mt2[10] + mt1[3] * mt2[11];
    result[3] = mt1[0] * mt2[12] + mt1[1] * mt2[13] + mt1[2] * mt2[14] + mt1[3] * mt2[15];
    result[4] = mt1[4] * mt2[0] + mt1[5] * mt2[1] + mt1[6] * mt2[2] + mt1[7] * mt2[3];
    result[5] = mt1[4] * mt2[4] + mt1[5] * mt2[5] + mt1[6] * mt2[6] + mt1[7] * mt2[7];
    result[6] = mt1[4] * mt2[8] + mt1[5] * mt2[9] + mt1[6] * mt2[10] + mt1[7] * mt2[11];
    result[7] = mt1[4] * mt2[12] + mt1[5] * mt2[13] + mt1[6] * mt2[14] + mt1[7] * mt2[15];
    result[8] = mt1[8] * mt2[0] + mt1[9] * mt2[1] + mt1[10] * mt2[2] + mt1[11] * mt2[3];
    result[9] = mt1[8] * mt2[4] + mt1[9] * mt2[5] + mt1[10] * mt2[6] + mt1[11] * mt2[7];
    result[10] = mt1[8] * mt2[8] + mt1[9] * mt2[9] + mt1[10] * mt2[10] + mt1[11] * mt2[11];
    result[11] = mt1[8] * mt2[12] + mt1[9] * mt2[13] + mt1[10] * mt2[14] + mt1[11] * mt2[15];
    result[12] = mt1[12] * mt2[0] + mt1[13] * mt2[1] + mt1[14] * mt2[2] + mt1[15] * mt2[3];
    result[13] = mt1[12] * mt2[4] + mt1[13] * mt2[5] + mt1[14] * mt2[6] + mt1[15] * mt2[7];
    result[14] = mt1[12] * mt2[8] + mt1[13] * mt2[9] + mt1[14] * mt2[10] + mt1[15] * mt2[11];
    result[15] = mt1[12] * mt2[12] + mt1[13] * mt2[13] + mt1[14] * mt2[14] + mt1[15] * mt2[15];
    return result;
  }
  static toInverse(m) {
    const matrix = new Matrix3();
    const v = m.M11 * m.M22 * m.M33 + m.M12 * m.M23 * m.M31 + m.M13 * m.M21 * m.M32 - (m.M11 * m.M23 * m.M32 + m.M12 * m.M21 * m.M33 + m.M13 * m.M22 * m.M31);
    if (v === 0) {
      throw new Error("this matrix does not exists inverse matrix");
    }
    const v11 = m.M22 * m.M33 - m.M23 * m.M32;
    const v12 = m.M21 * m.M33 - m.M23 * m.M31;
    const v13 = m.M21 * m.M32 - m.M22 * m.M31;
    const v21 = m.M12 * m.M33 - m.M13 * m.M32;
    const v22 = m.M11 * m.M33 - m.M13 * m.M31;
    const v23 = m.M11 * m.M32 - m.M12 * m.M31;
    const v31 = m.M12 * m.M23 - m.M13 * m.M22;
    const v32 = m.M11 * m.M23 - m.M13 * m.M21;
    const v33 = m.M11 * m.M22 - m.M12 * m.M21;
    matrix.M11 = v11 / v;
    matrix.M12 = -v21 / v;
    matrix.M13 = v31 / v;
    matrix.M21 = -v12 / v;
    matrix.M22 = v22 / v;
    matrix.M23 = -v32 / v;
    matrix.M31 = v13 / v;
    matrix.M32 = -v23 / v;
    matrix.M33 = v33 / v;
    return matrix;
  }
  static inverseSelf(m) {
    const v = m.M11 * m.M22 * m.M33 + m.M12 * m.M23 * m.M31 + m.M13 * m.M21 * m.M32 - (m.M11 * m.M23 * m.M32 + m.M12 * m.M21 * m.M33 + m.M13 * m.M22 * m.M31);
    if (v === 0) {
      throw new Error("this matrix does not exists inverse matrix");
    }
    const v11 = m.M22 * m.M33 - m.M23 * m.M32;
    const v12 = m.M21 * m.M33 - m.M23 * m.M31;
    const v13 = m.M21 * m.M32 - m.M22 * m.M31;
    const v21 = m.M12 * m.M33 - m.M13 * m.M32;
    const v22 = m.M11 * m.M33 - m.M13 * m.M31;
    const v23 = m.M11 * m.M32 - m.M12 * m.M31;
    const v31 = m.M12 * m.M23 - m.M13 * m.M22;
    const v32 = m.M11 * m.M23 - m.M13 * m.M21;
    const v33 = m.M11 * m.M22 - m.M12 * m.M21;
    m.M11 = v11 / v;
    m.M12 = -v21 / v;
    m.M13 = v31 / v;
    m.M21 = -v12 / v;
    m.M22 = v22 / v;
    m.M23 = -v32 / v;
    m.M31 = v13 / v;
    m.M32 = -v23 / v;
    m.M33 = v33 / v;
  }
  static inverseTo(m, out) {
    const v = m.M11 * m.M22 * m.M33 + m.M12 * m.M23 * m.M31 + m.M13 * m.M21 * m.M32 - (m.M11 * m.M23 * m.M32 + m.M12 * m.M21 * m.M33 + m.M13 * m.M22 * m.M31);
    if (v === 0) {
      throw new Error("this matrix does not exists inverse matrix");
    }
    const v11 = m.M22 * m.M33 - m.M23 * m.M32;
    const v12 = m.M21 * m.M33 - m.M23 * m.M31;
    const v13 = m.M21 * m.M32 - m.M22 * m.M31;
    const v21 = m.M12 * m.M33 - m.M13 * m.M32;
    const v22 = m.M11 * m.M33 - m.M13 * m.M31;
    const v23 = m.M11 * m.M32 - m.M12 * m.M31;
    const v31 = m.M12 * m.M23 - m.M13 * m.M22;
    const v32 = m.M11 * m.M23 - m.M13 * m.M21;
    const v33 = m.M11 * m.M22 - m.M12 * m.M21;
    out.M11 = v11 / v;
    out.M12 = -v21 / v;
    out.M13 = v31 / v;
    out.M21 = -v12 / v;
    out.M22 = v22 / v;
    out.M23 = -v32 / v;
    out.M31 = v13 / v;
    out.M32 = -v23 / v;
    out.M33 = v33 / v;
  }
}
class TransformUtils {
  static rotate(radian) {
    const cos = Math.cos(radian), sin = Math.sin(radian);
    const matrix = Matrix3.newIdentify();
    matrix.M11 = cos;
    matrix.M12 = -sin;
    matrix.M21 = sin;
    matrix.M22 = cos;
    return matrix;
  }
  static translate(translateX, translateY) {
    const matrix = Matrix3.newIdentify();
    matrix.M13 = translateX;
    matrix.M23 = translateY;
    return matrix;
  }
  static scale(scaleX, scaleY) {
    const matrix = Matrix3.newIdentify();
    matrix.M11 = scaleX;
    matrix.M22 = scaleY;
    return matrix;
  }
  static orth(left, right, bottom, top, near, far) {
    const mat4 = new Float32Array([
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ]);
    let x_orth = 2 / (right - left);
    let y_orth = 2 / (top - bottom);
    let z_orth = -2 / (far - near);
    let tx = -(right + left) / (right - left);
    let ty = -(top + bottom) / (top - bottom);
    let tz = -(far + near) / (far - near);
    mat4[0] = x_orth;
    mat4[1] = 0;
    mat4[2] = 0;
    mat4[3] = tx;
    mat4[4] = 0;
    mat4[5] = y_orth;
    mat4[6] = 0;
    mat4[7] = ty;
    mat4[8] = 0;
    mat4[9] = 0;
    mat4[10] = z_orth;
    mat4[11] = tz;
    mat4[12] = 0;
    mat4[13] = 0;
    mat4[14] = 0;
    mat4[15] = 1;
    return mat4;
  }
  static apply(vec2, matrix) {
    const result = new Vector2();
    result.x = vec2.x * matrix.M11 + vec2.y * matrix.M12 + matrix.M13;
    result.y = vec2.x * matrix.M21 + vec2.y * matrix.M22 + matrix.M23;
    return result;
  }
  static applyScale(vec2, scaleX, scaleY) {
    const matrix = TransformUtils.scale(scaleX, scaleY);
    return TransformUtils.apply(vec2, matrix);
  }
  static applyScaleSelf(vec2, scaleX, scaleY) {
    const matrix = TransformUtils.scale(scaleX, scaleY);
    TransformUtils.applySelf(vec2, matrix);
  }
  static applyTranslate(vec2, translateX, translateY) {
    const matrix = TransformUtils.translate(translateX, translateY);
    return TransformUtils.apply(vec2, matrix);
  }
  static applyTranslateSelf(vec2, translateX, translateY) {
    const matrix = TransformUtils.translate(translateX, translateY);
    TransformUtils.applySelf(vec2, matrix);
  }
  static applyRotate(vec2, radian) {
    const matrix = TransformUtils.rotate(radian);
    return TransformUtils.apply(vec2, matrix);
  }
  static applySelf(vec2, matrix) {
    const x = vec2.x * matrix.M11 + vec2.y * matrix.M12 + matrix.M13;
    const y = vec2.x * matrix.M21 + vec2.y * matrix.M22 + matrix.M23;
    vec2.x = x;
    vec2.y = y;
  }
  transform(translate, scale, rotate) {
    const m3 = MatrixUtils.m3Multi(
      TransformUtils.translate(translate.x, translate.y),
      TransformUtils.rotate(degreeToRadian(rotate))
    );
    return MatrixUtils.m3Multi(m3, TransformUtils.scale(scale.x, scale.y));
  }
}
const _Coordinate = class _Coordinate2 {
  constructor() {
    this.size = Vector();
    this.nativeSize = Vector();
    this.resolution = Vector();
    this.onWindowResize = null;
    this.orthographicProjectionMatrix4 = new Float32Array([
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ]);
    this.center = Vector();
    this.ratio = 1;
  }
  updateCoordinate(width, height) {
    var _a2;
    console.log("window resize", width, height);
    this.nativeSize.set(width, height);
    this.ratio = _Coordinate2.MAX_WIDTH / width;
    this.size.set(_Coordinate2.MAX_WIDTH, height * this.ratio);
    console.log("adjust", this.ratio);
    this.orthographicProjectionMatrix4 = TransformUtils.orth(
      0,
      this.size.x,
      this.size.y,
      0,
      0,
      1
    );
    this.center.set(this.size.x / 2, this.size.y / 2);
    this.resolution.set(width * window.devicePixelRatio, height * window.devicePixelRatio);
    (_a2 = this.onWindowResize) == null ? void 0 : _a2.call(this);
  }
  get width() {
    return this.size.x;
  }
  get height() {
    return this.size.y;
  }
  get left() {
    return 0;
  }
  get right() {
    return this.size.x;
  }
  get top() {
    return 0;
  }
  get bottom() {
    return this.size.y;
  }
  get nativeWidth() {
    return this.nativeSize.x;
  }
  get nativeHeight() {
    return this.nativeSize.y;
  }
  get centerX() {
    return this.width / 2;
  }
  get centerY() {
    return this.height / 2;
  }
};
_Coordinate.MAX_WIDTH = 1280;
let Coordinate = _Coordinate;
const Coordinate$1 = new Coordinate();
class Axis {
  static getXAxis(anchor) {
    return anchor & 7;
  }
  static getYAxis(anchor) {
    return anchor & 7 << 3;
  }
}
Axis.X_LEFT = 1;
Axis.X_CENTER = 1 << 1;
Axis.X_RIGHT = 1 << 2;
Axis.Y_TOP = 1 << 3;
Axis.Y_CENTER = 1 << 4;
Axis.Y_BOTTOM = 1 << 5;
const dependencyMap = {};
function inject(id2) {
  const dep = dependencyMap[id2];
  if (dep === void 0) {
    throw new Error("no dep found");
  }
  return dep;
}
function provide(id2, a) {
  dependencyMap[id2] = a;
}
function unprovide(id2) {
  if (id2 in dependencyMap) {
    delete dependencyMap[id2];
  }
}
const M = 0, MX = 1, MY = 2, F = 3, R = 4, S = 5, SX = 6, SY = 7, SK = 8, SKX = 9, SKY = 10, C = 11;
class DrawableTransition {
  constructor(transform) {
    this.transform = transform;
    this.transitionDelay = 0;
    this.transformType = -1;
    this.transitionX = new GetAndSetTransition(
      () => transform.getTranslateX(),
      (x) => transform.setTranslateX(x)
    );
    this.transitionY = new GetAndSetTransition(
      () => transform.getTranslateY(),
      (y) => transform.setTranslateY(y)
    );
    this.transitionScaleX = new GetAndSetTransition(
      () => transform.getScaleX(),
      (x) => transform.setScaleX(x)
    );
    this.transitionScaleY = new GetAndSetTransition(
      () => transform.getScaleY(),
      (y) => transform.setScaleY(y)
    );
    this.transitionAlpha = new GetAndSetTransition(
      () => transform.getAlpha(),
      (a) => transform.setAlpha(a)
    );
    this.transitionRotate = new GetAndSetTransition(
      () => transform.getRotate(),
      (r) => transform.setRotate(r)
    );
    this.transitionSkewX = new GetAndSetTransition(
      () => transform.getSkewX(),
      (x) => transform.setSkewX(x)
    );
    this.transitionSkewY = new GetAndSetTransition(
      () => transform.getSkewY(),
      (y) => transform.setSkewY(y)
    );
    this.transitionColorR = new GetAndSetTransition(
      () => transform.getColorR(),
      (r) => transform.setColorR(r)
    );
    this.transitionColorG = new GetAndSetTransition(
      () => transform.getColorG(),
      (g) => transform.setColorG(g)
    );
    this.transitionColorB = new GetAndSetTransition(
      () => transform.getColorB(),
      (b) => transform.setColorB(b)
    );
  }
  /**
   * 仅当变换类型变化时生效
   * @param ms
   */
  delay(ms) {
    this.transitionDelay = ms;
    return this;
  }
  /**
   * 如果想正常开始一段新动画，你必须首先调用 clear
   */
  get clear() {
    this.transformType = -1;
    return this;
  }
  moveXTo(x, duration, ease = linear) {
    if (this.transformType !== MX) {
      this.transitionX.setStartTime(Time.currentTime + this.transitionDelay);
      this.transitionDelay = 0;
      this.transformType = MX;
    }
    this.transitionX.transitionTo(x, duration, ease);
    return this;
  }
  moveYTo(y, duration, ease = linear) {
    if (this.transformType !== MY) {
      this.transitionY.setStartTime(Time.currentTime + this.transitionDelay);
      this.transitionDelay = 0;
      this.transformType = MY;
    }
    this.transitionY.transitionTo(y, duration, ease);
    return this;
  }
  moveTo(v, duration, ease = linear) {
    if (this.transformType !== M) {
      const time = Time.currentTime + this.transitionDelay;
      this.transitionX.setStartTime(time);
      this.transitionY.setStartTime(time);
      this.transitionDelay = 0;
      this.transformType = M;
    }
    this.transitionX.transitionTo(v.x, duration, ease);
    this.transitionY.transitionTo(v.y, duration, ease);
    return this;
  }
  fadeTo(alpha, duration, ease = linear) {
    if (this.transformType !== F) {
      this.transitionAlpha.setStartTime(Time.currentTime + this.transitionDelay);
      this.transitionDelay = 0;
      this.transformType = F;
    }
    this.transitionAlpha.transitionTo(alpha, duration, ease);
    return this;
  }
  rotateTo(degree, duration, ease = linear) {
    if (this.transformType !== R) {
      this.transitionRotate.setStartTime(Time.currentTime + this.transitionDelay);
      this.transitionDelay = 0;
      this.transformType = R;
    }
    this.transitionRotate.transitionTo(degree, duration, ease);
    return this;
  }
  scaleYTo(y, duration, ease = linear) {
    if (this.transformType !== SY) {
      this.transitionScaleY.setStartTime(Time.currentTime + this.transitionDelay);
      this.transitionDelay = 0;
      this.transformType = SY;
    }
    this.transitionScaleY.transitionTo(y, duration, ease);
    return this;
  }
  scaleXTo(x, duration, ease = linear) {
    if (this.transformType !== SX) {
      this.transitionScaleX.setStartTime(Time.currentTime + this.transitionDelay);
      this.transitionDelay = 0;
      this.transformType = SX;
    }
    this.transitionScaleX.transitionTo(x, duration, ease);
    return this;
  }
  scaleTo(scale, duration, ease = linear) {
    if (this.transformType !== S) {
      const time = Time.currentTime + this.transitionDelay;
      this.transitionScaleX.setStartTime(time);
      this.transitionScaleY.setStartTime(time);
      this.transitionDelay = 0;
      this.transformType = S;
    }
    this.transitionScaleX.transitionTo(scale.x, duration, ease);
    this.transitionScaleY.transitionTo(scale.y, duration, ease);
    return this;
  }
  skewTo(skew2, duration, ease = linear) {
    if (this.transformType !== SK) {
      const time = Time.currentTime + this.transitionDelay;
      this.transitionSkewX.setStartTime(time);
      this.transitionSkewY.setStartTime(time);
      this.transitionDelay = 0;
      this.transformType = SK;
    }
    this.transitionSkewX.transitionTo(skew2.x, duration, ease);
    this.transitionSkewY.transitionTo(skew2.y, duration, ease);
    return this;
  }
  skewXTo(skewX, duration, ease = linear) {
    if (this.transformType !== SKX) {
      this.transitionSkewX.setStartTime(Time.currentTime + this.transitionDelay);
      this.transitionDelay = 0;
      this.transformType = SKX;
    }
    this.transitionSkewX.transitionTo(skewX, duration, ease);
    return this;
  }
  skewYTo(skewY, duration, ease = linear) {
    if (this.transformType !== SKY) {
      this.transitionSkewY.setStartTime(Time.currentTime + this.transitionDelay);
      this.transitionDelay = 0;
      this.transformType = SKY;
    }
    this.transitionSkewY.transitionTo(skewY, duration, ease);
    return this;
  }
  colorTo(color, duration, ease = linear) {
    if (this.transformType !== C) {
      const time = Time.currentTime + this.transitionDelay;
      this.transitionColorR.setStartTime(time);
      this.transitionColorG.setStartTime(time);
      this.transitionColorB.setStartTime(time);
      this.transitionDelay = 0;
      this.transformType = C;
    }
    this.transitionColorR.transitionTo(color.red, duration, ease);
    this.transitionColorG.transitionTo(color.green, duration, ease);
    this.transitionColorB.transitionTo(color.blue, duration, ease);
    return this;
  }
  updateTransform() {
    const time = Time.currentTime;
    this.transitionX.update(time);
    this.transitionY.update(time);
    this.transitionScaleX.update(time);
    this.transitionScaleY.update(time);
    this.transitionAlpha.update(time);
    this.transitionRotate.update(time);
    this.transitionSkewX.update(time);
    this.transitionSkewY.update(time);
    this.transitionColorR.update(time);
    this.transitionColorG.update(time);
    this.transitionColorB.update(time);
  }
}
class Anchor {
}
Anchor.TopLeft = Axis.X_LEFT | Axis.Y_TOP;
Anchor.TopCenter = Axis.X_CENTER | Axis.Y_TOP;
Anchor.TopRight = Axis.X_RIGHT | Axis.Y_TOP;
Anchor.CenterLeft = Axis.X_LEFT | Axis.Y_CENTER;
Anchor.Center = Axis.X_CENTER | Axis.Y_CENTER;
Anchor.CenterRight = Axis.X_RIGHT | Axis.Y_CENTER;
Anchor.BottomLeft = Axis.X_LEFT | Axis.Y_BOTTOM;
Anchor.BottomCenter = Axis.X_CENTER | Axis.Y_BOTTOM;
Anchor.BottomRight = Axis.X_RIGHT | Axis.Y_BOTTOM;
Anchor.Custom = -1;
const ImageFormat = {
  PNG: 1,
  JPEG: 2
};
const _Texture = class _Texture2 {
  constructor(gl, image2 = null, format2 = ImageFormat.PNG) {
    this.gl = gl;
    this.imageWidth = 0;
    this.imageHeight = 0;
    const texture = gl.createTexture();
    if (!texture) {
      throw new Error("create texture error");
    }
    this.rendererId = texture;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      _Texture2.blankData
    );
    gl.bindTexture(gl.TEXTURE_2D, null);
    if (image2 !== null) {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      this.imageWidth = image2.width;
      this.imageHeight = image2.height;
      const glFormat = this.getFormat(format2);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        glFormat,
        image2.width,
        image2.height,
        0,
        glFormat,
        gl.UNSIGNED_BYTE,
        image2
      );
      gl.bindTexture(gl.TEXTURE_2D, null);
    }
  }
  texImage2D(image2, format2 = ImageFormat.PNG) {
    const gl = this.gl;
    this.imageWidth = image2.width;
    this.imageHeight = image2.height;
    const glFormat = this.getFormat(format2);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      glFormat,
      image2.width,
      image2.height,
      0,
      glFormat,
      gl.UNSIGNED_BYTE,
      image2
    );
  }
  getFormat(imageFormat = ImageFormat.PNG) {
    if (imageFormat === ImageFormat.JPEG) {
      return this.gl.RGB;
    }
    return this.gl.RGBA;
  }
  setTextureImage(image2, format2 = ImageFormat.PNG) {
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, this.rendererId);
    this.texImage2D(image2);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }
  setTextureVideo(video) {
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, this.rendererId);
    this.imageWidth = video.width;
    this.imageHeight = video.height;
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      video
    );
    gl.bindTexture(gl.TEXTURE_2D, null);
  }
  bind(slot = 0) {
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0 + slot);
    gl.bindTexture(gl.TEXTURE_2D, this.rendererId);
  }
  unbind() {
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, null);
  }
  dispose() {
    this.gl.deleteTexture(this.rendererId);
  }
};
_Texture.blankData = new Uint8Array([0, 0, 0, 0]);
_Texture.NULL = Symbol();
let Texture = _Texture;
var Blend = /* @__PURE__ */ ((Blend2) => {
  Blend2[Blend2["Normal"] = 0] = "Normal";
  Blend2[Blend2["Additive"] = 1] = "Additive";
  return Blend2;
})(Blend || {});
class TransformUtils2 {
  /**
   * Vector2 对应的矩阵 x Matrix3
   * @param m
   * @param v
   */
  static translateFromLeft(m, v) {
    m.M11 += m.M31 * v.x;
    m.M12 += m.M32 * v.x;
    m.M13 += m.M33 * v.x;
    m.M21 += m.M31 * v.y;
    m.M22 += m.M32 * v.y;
    m.M23 += m.M33 * v.y;
  }
  static rotateFromLeft(m, degree) {
    const radian = degreeToRadian(degree);
    const cos = Math.cos(radian), sin = Math.sin(radian);
    const m11 = m.M11 * cos + -sin * m.M21;
    const m12 = m.M12 * cos + -sin * m.M22;
    const m13 = m.M13 * cos + -sin * m.M23;
    const m21 = m.M11 * sin + m.M21 * cos;
    const m22 = m.M12 * sin + m.M22 * cos;
    const m23 = m.M13 * sin + m.M23 * cos;
    m.M11 = m11;
    m.M12 = m12;
    m.M13 = m13;
    m.M21 = m21;
    m.M22 = m22;
    m.M23 = m23;
  }
  /**
   * Vector2 对应的矩阵 x Matrix3
   * @param m
   * @param s
   */
  static scaleFromLeft(m, s) {
    m.M11 *= s.x;
    m.M12 *= s.x;
    m.M13 *= s.x;
    m.M21 *= s.y;
    m.M22 *= s.y;
    m.M23 *= s.y;
  }
  /**
   * Vector2 对应的矩阵 x Matrix3
   * @param m
   * @param s
   */
  static skewFromLeft(m, s) {
    const m11 = m.M21 * s.x + m.M11;
    const m12 = m.M22 * s.x + m.M12;
    const m13 = m.M23 * s.x + m.M13;
    const m21 = m.M11 * s.y + m.M21;
    const m22 = m.M12 * s.y + m.M22;
    const m23 = m.M13 * s.y + m.M23;
    m.M11 = m11;
    m.M12 = m12;
    m.M13 = m13;
    m.M21 = m21;
    m.M22 = m22;
    m.M23 = m23;
  }
  static applyTo(m, v, out, offset = 0) {
    const x = v.x * m.M11 + v.y * m.M12 + m.M13;
    const y = v.x * m.M21 + v.y * m.M22 + m.M23;
    out[offset] = x;
    out[offset + 1] = y;
  }
}
class VertexBufferElement {
  constructor(position, type, count, normalized) {
    this.position = position;
    this.type = type;
    this.count = count;
    this.normalized = normalized;
  }
  static getSizeOfType(gl, type) {
    switch (type) {
      case gl.FLOAT:
        return 4;
      case gl.UNSIGNED_INT:
        return 4;
      case gl.UNSIGNED_BYTE:
        return 1;
    }
    return 0;
  }
}
class VertexBufferLayout {
  constructor(gl) {
    this.gl = gl;
    this.elements = [];
    this.stride = 0;
  }
  pushFloat(position, count) {
    const gl = this.gl;
    const element = new VertexBufferElement(position, gl.FLOAT, count, false);
    this.elements.push(element);
    this.stride += count * VertexBufferElement.getSizeOfType(gl, gl.FLOAT);
  }
  pushUByte(position, count) {
    const gl = this.gl;
    const element = new VertexBufferElement(position, gl.UNSIGNED_BYTE, count, true);
    this.elements.push(element);
    this.stride += count * VertexBufferElement.getSizeOfType(gl, gl.UNSIGNED_BYTE);
  }
  pushUInt(position, count) {
    const gl = this.gl;
    const element = new VertexBufferElement(position, gl.UNSIGNED_INT, count, false);
    this.elements.push(element);
    this.stride += count * VertexBufferElement.getSizeOfType(gl, gl.UNSIGNED_INT);
  }
}
VertexBufferLayout.NULL = Symbol();
class VertexArray {
  constructor(gl) {
    this.gl = gl;
    const va = gl.createVertexArray();
    if (!va) {
      throw new Error("create vertex array error");
    }
    this.rendererId = va;
  }
  addBuffer(layout) {
    const gl = this.gl;
    const elements = layout.elements;
    let offset = 0;
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      gl.enableVertexAttribArray(element.position);
      gl.vertexAttribPointer(
        element.position,
        element.count,
        element.type,
        element.normalized,
        layout.stride,
        offset
      );
      offset += element.count * VertexBufferElement.getSizeOfType(gl, element.type);
    }
  }
  bind() {
    this.gl.bindVertexArray(this.rendererId);
  }
  unbind() {
    this.gl.bindVertexArray(null);
  }
  dispose() {
    this.gl.deleteVertexArray(this.rendererId);
  }
}
class ShaderWrapper {
  constructor(renderer2, shader, shaderAttributes) {
    this.renderer = renderer2;
    this.shader = shader;
    this.shaderAttributes = shaderAttributes;
    this.stride = 0;
    shader.bind();
    const gl = renderer2.gl;
    this.layout = new VertexBufferLayout(gl);
    this.vertexArray = new VertexArray(gl);
    for (let i = 0; i < shaderAttributes.length; i++) {
      const attr = shaderAttributes[i];
      const position = shader.getAttributeLocation(attr.name);
      if (attr.type == gl.FLOAT) {
        this.layout.pushFloat(position, attr.count);
      } else if (attr.type === gl.UNSIGNED_BYTE) {
        this.layout.pushUByte(position, attr.count);
      } else if (attr.type === gl.UNSIGNED_INT) {
        this.layout.pushUInt(position, attr.count);
      }
      this.stride += attr.count;
    }
    shader.unbind();
  }
  bind() {
    const renderer2 = this.renderer;
    renderer2.bindShader(this.shader);
    renderer2.bindVertexArray(this.vertexArray);
  }
  unbind() {
    const renderer2 = this.renderer;
    renderer2.unbindShader(this.shader);
    renderer2.unbindVertexArray(this.vertexArray);
  }
  use() {
    this.vertexArray.addBuffer(this.layout);
  }
  dispose() {
    const renderer2 = this.renderer;
    renderer2.unbindShader(this.shader);
    renderer2.unbindVertexArray(this.vertexArray);
    this.shader.dispose();
    this.vertexArray.dispose();
  }
}
const ATTR_POSITION = "a_position";
const ATTR_COLOR = "a_color";
const ATTR_TEXCOORD = "a_tex_coord";
const ATTR_ALPHA = "a_alpha";
const UNI_ORTH = "u_orth";
const UNI_TRANSFORM = "u_transform";
const UNI_SAMPLER = "u_sampler";
const UNI_ALPHA = "u_alpha";
const UNI_CIRCLE = "u_circle";
const UNI_COLOR = "u_color";
const UNI_BRIGHTNESS = "u_brightness";
const UNI_RESOLUTION = "u_resolution";
const _ShaderSource = class _ShaderSource2 {
};
_ShaderSource.Default = {
  vertex: `
      attribute vec2 ${ATTR_POSITION};
      attribute vec2 ${ATTR_TEXCOORD};
      
      varying vec2 v_texcoord;
      
      uniform mat4 ${UNI_ORTH};
      void main() {
          vec4 position = vec4(a_position, 0.0, 1.0) * ${UNI_ORTH};
          gl_Position = position;
          v_texcoord = ${ATTR_TEXCOORD};
      }
    `,
  fragment: `
      varying highp vec2 v_texcoord;
    
      uniform sampler2D ${UNI_SAMPLER};
      uniform mediump vec4 ${UNI_COLOR};
    
      void main() {
          mediump vec4 tex_color = texture2D(${UNI_SAMPLER}, v_texcoord);
          mediump vec4 out_color = vec4(tex_color.rgb / tex_color.a, tex_color.a) * ${UNI_COLOR};
          // out_color = out_color.rgba * ${UNI_COLOR}.rgba;
          gl_FragColor = out_color;
      }
    `
};
_ShaderSource.StoryDefault = {
  vertex: `
      attribute vec2 ${ATTR_POSITION};
      attribute vec2 ${ATTR_TEXCOORD};
      
      varying vec2 v_texcoord;
      
      uniform mat4 ${UNI_ORTH};
      uniform mat4 ${UNI_TRANSFORM};
      void main() {
          vec4 position = vec4(a_position, 0.0, 1.0) * ${UNI_TRANSFORM};
          gl_Position = position * ${UNI_ORTH};
          v_texcoord = ${ATTR_TEXCOORD};
      }
    `,
  fragment: _ShaderSource.Default.fragment
};
_ShaderSource.RoundClip = {
  fragment: `
      varying mediump vec4 v_color;
      uniform mediump vec3 u_circle;
      uniform mediump vec2 u_resolution;
      uniform mediump float u_light;
      void main() {
          mediump float minLength = min(u_resolution.x, u_resolution.y);
          mediump vec2 coord = gl_FragCoord.xy / minLength;
          coord = vec2(coord.x, 1.0 - coord.y);
          mediump float dist = distance(u_circle.xy, coord);
          if (dist < u_circle.z) {
              lowp vec4 color = vec4(0.0);
              color.rgb = min(v_color.rgb + u_light, 1.0);
              color.a = v_color.a;
              gl_FragColor = color;
          } else {
              discard;
          }
      }
    `,
  vertex: `
      attribute vec2 ${ATTR_POSITION};
      attribute vec4 ${ATTR_COLOR};
      
      varying mediump vec4 v_color;
      
      uniform mat4 ${UNI_ORTH};
      // uniform mat4 ${UNI_TRANSFORM};
      void main() {
          vec4 position = vec4(${ATTR_POSITION}, 0.0, 1.0);
          gl_Position = position * ${UNI_ORTH};
          v_color = ${ATTR_COLOR};
      }
    `
};
_ShaderSource.Simple = {
  vertex: `
      attribute vec2 ${ATTR_POSITION};
      attribute vec4 ${ATTR_COLOR};
      varying mediump vec4 v_color;
      uniform mat4 ${UNI_ORTH};
      uniform mat4 ${UNI_TRANSFORM};
      void main() {
          vec4 position = vec4(${ATTR_POSITION}, 0.0, 1.0) * ${UNI_TRANSFORM};
          gl_Position = position * ${UNI_ORTH};
          v_color = ${ATTR_COLOR};
      }
    `,
  fragment: `
      varying mediump vec4 v_color;
      uniform mediump float ${UNI_ALPHA};
      void main() {
          mediump vec4 color = vec4(v_color);
          color.a = color.a * ${UNI_ALPHA};
          gl_FragColor = color;
      }
    `
};
_ShaderSource.White = {
  vertex: `
      attribute vec2 ${ATTR_POSITION};
      uniform mat4 ${UNI_ORTH};
      uniform mat4 ${UNI_TRANSFORM};
      void main() {
          vec4 coord = vec4(${ATTR_POSITION}, 0.0, 1.0) * ${UNI_TRANSFORM};
          gl_Position = coord * ${UNI_ORTH};
      }
    `,
  fragment: `
      uniform lowp float ${UNI_ALPHA};
      void main() {
        gl_FragColor = vec4(1.0, 1.0, 1.0, ${UNI_ALPHA});
      }
    `
};
_ShaderSource.AlphaTexture = {
  vertex: `
      attribute vec2 ${ATTR_POSITION};
      attribute vec2 ${ATTR_TEXCOORD};
      attribute float ${ATTR_ALPHA};
  
      varying mediump vec2 v_tex_coord;
      varying mediump float v_alpha;
      uniform mat4 ${UNI_ORTH};
      // uniform mat4 ${UNI_TRANSFORM};
      void main() {
          vec4 position = vec4(${ATTR_POSITION}, 0.0, 1.0);
          gl_Position = position * ${UNI_ORTH};
          v_tex_coord = ${ATTR_TEXCOORD};
          v_alpha = ${ATTR_ALPHA};
      }
    `,
  fragment: `
      varying mediump float v_alpha;
      varying mediump vec2 v_tex_coord;
      uniform sampler2D ${UNI_SAMPLER};
  
      void main() {
          mediump vec4 texelColor = texture2D(${UNI_SAMPLER}, v_tex_coord);
          texelColor.a = texelColor.a * v_alpha;
          gl_FragColor = texelColor;
      }
    `
};
_ShaderSource.LegacyVisualizer = {
  vertex: `
      attribute vec2 a_vertexPosition;
      attribute vec2 a_tex_coord;
      attribute float a_sampler_flag;
      
      varying lowp float v_sampler_flag;
      varying mediump vec2 v_tex_coord;
      
      uniform mat4 u_orth;
      
      void main() {
          vec4 coord = vec4(a_vertexPosition, 0.0, 1.0);
          v_sampler_flag = a_sampler_flag;
          v_tex_coord = a_tex_coord;
          gl_Position = coord * u_orth;
      }
    `,
  fragment: `
      uniform lowp float u_alpha;
      uniform sampler2D u_sampler_4;
      uniform sampler2D u_sampler_5;
      
      varying mediump vec2 v_tex_coord;
      varying lowp float v_sampler_flag;
      
      void main() {
          mediump vec4 texelColor = vec4(0.0);
          if (v_sampler_flag > 0.5) {
              texelColor = texture2D(u_sampler_4, v_tex_coord);
          } else {
              texelColor = texture2D(u_sampler_5, v_tex_coord);
          }
          
          texelColor.a = texelColor.a * u_alpha;
//          gl_FragColor = vec4(1.0, 1.0, 1.0, u_alpha);
          gl_FragColor = texelColor;
      }
    `
};
_ShaderSource.BrightnessTexture = {
  vertex: `
        attribute vec2 ${ATTR_POSITION};
        attribute vec2 ${ATTR_TEXCOORD};
    
        varying mediump vec2 v_tex_coord;
        uniform mat4 ${UNI_ORTH};
        void main() {
            gl_Position = vec4(${ATTR_POSITION}, 0.0, 1.0) * ${UNI_ORTH};
            v_tex_coord = ${ATTR_TEXCOORD};
        }
    `,
  fragment: `
        varying mediump vec2 v_tex_coord;
        uniform mediump float ${UNI_ALPHA};
        uniform sampler2D ${UNI_SAMPLER};
        uniform mediump float ${UNI_BRIGHTNESS};
    
        void main() {
            mediump vec4 texelColor = texture2D(${UNI_SAMPLER}, v_tex_coord);
            texelColor.rgb = min(texelColor.rgb * (1.0 + ${UNI_BRIGHTNESS}), 1.0);
            texelColor.a = texelColor.a * ${UNI_ALPHA};
            gl_FragColor = texelColor;
        }
    `
};
let ShaderSource = _ShaderSource;
class Shader {
  constructor(gl, vertexShader, fragmentShader) {
    this.gl = gl;
    this.uniformLocationCache = {};
    this.attributeLocationCache = {};
    this.rendererId = createShader(gl, vertexShader, fragmentShader);
  }
  bind() {
    this.gl.useProgram(this.rendererId);
  }
  unbind() {
    this.gl.useProgram(null);
  }
  dispose() {
    this.gl.deleteProgram(this.rendererId);
  }
  setUniform1f(name, value) {
    this.gl.uniform1f(this.getUniformLocation(name), value);
  }
  setUniform2fv(name, value) {
    this.gl.uniform2fv(this.getUniformLocation(name), value);
  }
  setUniform3fv(name, value) {
    this.gl.uniform3fv(this.getUniformLocation(name), value);
  }
  setUniform4fv(name, value) {
    this.gl.uniform4fv(this.getUniformLocation(name), value);
  }
  setUniform1i(name, value) {
    this.gl.uniform1i(this.getUniformLocation(name), value);
  }
  setUniform1iv(name, value) {
    this.gl.uniform1iv(this.getUniformLocation(name), value);
  }
  setUniformMatrix4fv(name, value) {
    this.gl.uniformMatrix4fv(this.getUniformLocation(name), false, value);
  }
  setUniformMatrix3fv(name, value) {
    this.gl.uniformMatrix3fv(this.getUniformLocation(name), false, value);
  }
  getUniformLocation(name) {
    const gl = this.gl;
    if (name in this.uniformLocationCache) {
      return this.uniformLocationCache[name];
    }
    const uniformLocation = gl.getUniformLocation(this.rendererId, name);
    if (!uniformLocation) {
      console.log("Warning: uniform", name, "does not exist!");
    }
    this.uniformLocationCache[name] = uniformLocation;
    return uniformLocation;
  }
  getAttributeLocation(name) {
    if (name in this.attributeLocationCache) {
      return this.attributeLocationCache[name];
    }
    const location = this.gl.getAttribLocation(this.rendererId, name);
    if (location === -1) {
      console.log("Warning: attribute", name, "does not exist!");
    }
    this.attributeLocationCache[name] = location;
    return location;
  }
}
Shader.NULL = Symbol();
function createShader(gl, vertexSrc, fragmentSrc) {
  const program = gl.createProgram();
  if (!program) {
    throw new Error("create program error");
  }
  const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexSrc);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSrc);
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.validateProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  return program;
}
function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error("create shader error");
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.log(
      `Error compiling ${type === gl.VERTEX_SHADER ? "vertex" : "fragment"} shader:`
    );
    console.log(gl.getShaderInfoLog(shader));
  }
  return shader;
}
class DefaultShaderWrapper extends ShaderWrapper {
  constructor(renderer2) {
    const gl = renderer2.gl;
    const shader = new Shader(gl, ShaderSource.Default.vertex, ShaderSource.Default.fragment);
    super(renderer2, shader, [
      { name: ATTR_POSITION, count: 2, type: gl.FLOAT },
      { name: ATTR_TEXCOORD, count: 2, type: gl.FLOAT }
    ]);
    this._orth = ArrayUtils.emptyFloat32Array;
    this.colorArray = new Float32Array(4);
    this._sampler2D = Number.NaN;
  }
  set orth(mat4) {
    if (!ArrayUtils.equals(this._orth, mat4)) {
      this.shader.setUniformMatrix4fv(UNI_ORTH, mat4);
      this._orth = mat4;
    }
  }
  set color(color) {
    const arr = this.colorArray;
    arr[0] = color.red;
    arr[1] = color.green;
    arr[2] = color.blue;
    arr[3] = color.alpha;
    this.shader.setUniform4fv(UNI_COLOR, arr);
  }
  set sampler2D(sampler) {
    if (sampler !== this._sampler2D) {
      this.shader.setUniform1i(UNI_SAMPLER, sampler);
      this._sampler2D = sampler;
    }
  }
  unbind() {
    super.unbind();
    this._orth = ArrayUtils.emptyFloat32Array;
    this._sampler2D = Number.NaN;
  }
}
class SimpleShaderWrapper extends ShaderWrapper {
  constructor(renderer2) {
    const gl = renderer2.gl;
    const shader = new Shader(gl, ShaderSource.Simple.vertex, ShaderSource.Simple.fragment);
    super(renderer2, shader, [
      { name: ATTR_POSITION, count: 2, type: gl.FLOAT },
      { name: ATTR_COLOR, count: 4, type: gl.FLOAT }
    ]);
    this._orth = ArrayUtils.emptyFloat32Array;
    this._transform = ArrayUtils.emptyFloat32Array;
    this._alpha = Number.NaN;
  }
  set orth(mat4) {
    if (!ArrayUtils.equals(this._orth, mat4)) {
      this.shader.setUniformMatrix4fv(UNI_ORTH, mat4);
      this._orth = mat4;
    }
  }
  set transform(mat4) {
    if (!ArrayUtils.equals(this._transform, mat4)) {
      this.shader.setUniformMatrix4fv(UNI_TRANSFORM, mat4);
      this._transform = mat4;
    }
  }
  set alpha(a) {
    if (this._alpha !== a) {
      this.shader.setUniform1f(UNI_ALPHA, a);
      this._alpha = a;
    }
  }
  unbind() {
    super.unbind();
    this._orth = ArrayUtils.emptyFloat32Array;
    this._transform = ArrayUtils.emptyFloat32Array;
    this._alpha = Number.NaN;
  }
}
class RoundClipShaderWrapper extends ShaderWrapper {
  constructor(renderer2) {
    const gl = renderer2.gl;
    const shader = new Shader(gl, ShaderSource.RoundClip.vertex, ShaderSource.RoundClip.fragment);
    super(renderer2, shader, [
      { name: ATTR_POSITION, count: 2, type: gl.FLOAT },
      { name: ATTR_COLOR, count: 4, type: gl.FLOAT }
    ]);
    this._orth = ArrayUtils.emptyFloat32Array;
    this._light = Number.NaN;
    this._circle = ArrayUtils.emptyFloat32Array;
    this._resolution = new Float32Array(2);
  }
  set orth(mat4) {
    if (!ArrayUtils.equals(this._orth, mat4)) {
      this.shader.setUniformMatrix4fv(UNI_ORTH, mat4);
      this._orth = mat4;
    }
  }
  set light(light) {
    if (this._light !== light) {
      this.shader.setUniform1f("u_light", light);
      this._light = light;
    }
  }
  /**
   *
   * @param circle 数据分布 [x, y, radius]
   */
  set circle(circle) {
    if (!ArrayUtils.equals(this._circle, circle)) {
      this.shader.setUniform3fv(UNI_CIRCLE, circle);
      this._circle = circle;
    }
  }
  set resolution(r) {
    const res = this._resolution;
    if (res[0] !== r.x || res[1] !== r.y) {
      res[0] = r.x;
      res[1] = r.y;
      this.shader.setUniform2fv(UNI_RESOLUTION, res);
    }
  }
  unbind() {
    super.unbind();
    this._orth = ArrayUtils.emptyFloat32Array;
    this._circle = ArrayUtils.emptyFloat32Array;
    this._light = Number.NaN;
    this._resolution[0] = 0;
    this._resolution[1] = 0;
  }
}
class WhiteShaderWrapper extends ShaderWrapper {
  constructor(renderer2) {
    const gl = renderer2.gl;
    const shader = new Shader(gl, ShaderSource.White.vertex, ShaderSource.White.fragment);
    super(renderer2, shader, [
      { name: ATTR_POSITION, count: 2, type: gl.FLOAT }
    ]);
    this._orth = ArrayUtils.emptyFloat32Array;
    this._alpha = Number.NaN;
  }
  set orth(mat4) {
    if (!ArrayUtils.equals(this._orth, mat4)) {
      this.shader.setUniformMatrix4fv(UNI_ORTH, mat4);
      this._orth = mat4;
    }
  }
  set alpha(a) {
    if (this._alpha !== a) {
      this.shader.setUniform1f(UNI_ALPHA, a);
      this._alpha = a;
    }
  }
  unbind() {
    super.unbind();
    this._orth = ArrayUtils.emptyFloat32Array;
    this._alpha = Number.NaN;
  }
}
class AlphaTextureShaderWrapper extends ShaderWrapper {
  constructor(renderer2) {
    const gl = renderer2.gl;
    const shader = new Shader(gl, ShaderSource.AlphaTexture.vertex, ShaderSource.AlphaTexture.fragment);
    super(renderer2, shader, [
      { name: ATTR_POSITION, count: 2, type: gl.FLOAT },
      { name: ATTR_TEXCOORD, count: 2, type: gl.FLOAT },
      { name: ATTR_ALPHA, count: 1, type: gl.FLOAT }
    ]);
    this._orth = ArrayUtils.emptyFloat32Array;
    this._sampler2D = Number.NaN;
  }
  set orth(mat4) {
    if (!ArrayUtils.equals(this._orth, mat4)) {
      this.shader.setUniformMatrix4fv(UNI_ORTH, mat4);
      this._orth = mat4;
    }
  }
  set sampler2D(sampler) {
    if (sampler !== this._sampler2D) {
      this.shader.setUniform1i(UNI_SAMPLER, sampler);
      this._sampler2D = sampler;
    }
  }
  unbind() {
    super.unbind();
    this._orth = ArrayUtils.emptyFloat32Array;
    this._sampler2D = Number.NaN;
  }
}
class LegacyVisualizerShaderWrapper extends ShaderWrapper {
  constructor(renderer2) {
    const gl = renderer2.gl;
    const shader = new Shader(gl, ShaderSource.LegacyVisualizer.vertex, ShaderSource.LegacyVisualizer.fragment);
    super(renderer2, shader, [
      { name: "a_vertexPosition", count: 2, type: gl.FLOAT },
      { name: "a_tex_coord", count: 2, type: gl.FLOAT },
      { name: "a_sampler_flag", count: 1, type: gl.FLOAT }
    ]);
    this._orth = ArrayUtils.emptyFloat32Array;
    this._alpha = Number.NaN;
    this._sampler2D1 = Number.NaN;
    this._sampler2D2 = Number.NaN;
  }
  set orth(mat4) {
    if (!ArrayUtils.equals(this._orth, mat4)) {
      this.shader.setUniformMatrix4fv(UNI_ORTH, mat4);
      this._orth = mat4;
    }
  }
  set alpha(a) {
    if (this._alpha !== a) {
      this.shader.setUniform1f("u_alpha", a);
      this._alpha = a;
    }
  }
  set sampler2D1(sampler) {
    if (this._sampler2D1 !== sampler) {
      this.shader.setUniform1i("u_sampler_4", sampler);
      this._sampler2D1 = sampler;
    }
  }
  set sampler2D2(sampler) {
    if (this._sampler2D2 !== sampler) {
      this.shader.setUniform1i("u_sampler_5", sampler);
      this._sampler2D2 = sampler;
    }
  }
  unbind() {
    super.unbind();
    this._orth = ArrayUtils.emptyFloat32Array;
    this._alpha = Number.NaN;
    this._sampler2D1 = -1;
    this._sampler2D2 = -1;
  }
}
class StoryShaderWrapper extends ShaderWrapper {
  constructor(renderer2) {
    const gl = renderer2.gl;
    const shader = new Shader(gl, ShaderSource.StoryDefault.vertex, ShaderSource.StoryDefault.fragment);
    super(renderer2, shader, [
      { name: ATTR_POSITION, count: 2, type: gl.FLOAT },
      { name: ATTR_TEXCOORD, count: 2, type: gl.FLOAT }
    ]);
    this._orth = ArrayUtils.emptyFloat32Array;
    this._transform = ArrayUtils.emptyFloat32Array;
    this.colorArray = new Float32Array(4);
    this._sampler2D = Number.NaN;
  }
  set orth(mat4) {
    if (!ArrayUtils.equals(this._orth, mat4)) {
      this.shader.setUniformMatrix4fv(UNI_ORTH, mat4);
      this._orth = mat4;
    }
  }
  set transform(mat4) {
    if (!ArrayUtils.equals(this._transform, mat4)) {
      this.shader.setUniformMatrix4fv(UNI_TRANSFORM, mat4);
      this._transform = mat4;
    }
  }
  set color(color) {
    const arr = this.colorArray;
    arr[0] = color.red;
    arr[1] = color.green;
    arr[2] = color.blue;
    arr[3] = color.alpha;
    this.shader.setUniform4fv(UNI_COLOR, arr);
  }
  set sampler2D(sampler) {
    if (sampler !== this._sampler2D) {
      this.shader.setUniform1i(UNI_SAMPLER, sampler);
      this._sampler2D = sampler;
    }
  }
  unbind() {
    super.unbind();
    this._orth = ArrayUtils.emptyFloat32Array;
    this._transform = ArrayUtils.emptyFloat32Array;
    this._sampler2D = Number.NaN;
  }
}
class BrightnessTextureShaderWrapper extends ShaderWrapper {
  constructor(renderer2) {
    const gl = renderer2.gl;
    const shader = new Shader(gl, ShaderSource.BrightnessTexture.vertex, ShaderSource.BrightnessTexture.fragment);
    super(renderer2, shader, [
      { name: ATTR_POSITION, count: 2, type: gl.FLOAT },
      { name: ATTR_TEXCOORD, count: 2, type: gl.FLOAT }
    ]);
    this._orth = ArrayUtils.emptyFloat32Array;
    this._alpha = Number.NaN;
    this._sampler2D = Number.NaN;
    this._brightness = Number.NaN;
  }
  set orth(mat4) {
    if (!ArrayUtils.equals(this._orth, mat4)) {
      this.shader.setUniformMatrix4fv(UNI_ORTH, mat4);
      this._orth = mat4;
    }
  }
  set alpha(a) {
    if (!almostEquals(a, this._alpha)) {
      this.shader.setUniform1f(UNI_ALPHA, a);
      this._alpha = a;
    }
  }
  set sampler2D(sampler) {
    if (sampler !== this._sampler2D) {
      this.shader.setUniform1i(UNI_SAMPLER, sampler);
      this._sampler2D = sampler;
    }
  }
  set brightness(b) {
    if (!almostEquals(b, this._brightness)) {
      this.shader.setUniform1f(UNI_BRIGHTNESS, b);
      this._brightness = b;
    }
  }
  unbind() {
    super.unbind();
    this._orth = ArrayUtils.emptyFloat32Array;
    this._sampler2D = Number.NaN;
    this._alpha = Number.NaN;
    this._brightness = Number.NaN;
  }
}
class Shaders {
  static init(renderer2) {
    this.Default = new DefaultShaderWrapper(renderer2);
    this.RoundClip = new RoundClipShaderWrapper(renderer2);
    this.Simple = new SimpleShaderWrapper(renderer2);
    this.White = new WhiteShaderWrapper(renderer2);
    this.AlphaTexture = new AlphaTextureShaderWrapper(renderer2);
    this.LegacyVisualizer = new LegacyVisualizerShaderWrapper(renderer2);
    this.StoryDefault = new StoryShaderWrapper(renderer2);
    this.BrightnessTexture = new BrightnessTextureShaderWrapper(renderer2);
  }
  static dispose() {
    this.Default.dispose();
    this.Simple.dispose();
    this.RoundClip.dispose();
    this.White.dispose();
    this.AlphaTexture.dispose();
    this.LegacyVisualizer.dispose();
    this.StoryDefault.dispose();
    this.BrightnessTexture.dispose();
  }
}
class VertexBuffer {
  constructor(gl, data = null, usage = gl.STATIC_DRAW) {
    this.gl = gl;
    this.usage = usage;
    const buffer = gl.createBuffer();
    if (!buffer) {
      throw new Error("create vertex buffer error");
    }
    this.rendererId = buffer;
    if (data !== null) {
      this.bind();
      gl.bufferData(gl.ARRAY_BUFFER, data, usage);
      this.unbind();
    }
  }
  setBufferData(data) {
    const gl = this.gl;
    gl.bufferData(gl.ARRAY_BUFFER, data, this.usage);
  }
  setBufferSubData(data, byteOffset) {
    this.gl.bufferSubData(this.gl.ARRAY_BUFFER, byteOffset, data);
  }
  bind() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.rendererId);
  }
  unbind() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  }
  dispose() {
    this.gl.deleteBuffer(this.rendererId);
  }
}
class BasicVertexBuffer {
  /**
   *
   * @param renderer
   * @param verticesCount 顶点数量
   * @param stride 每个顶点的的元素数量
   * @param usage
   */
  constructor(renderer2, verticesCount, stride, usage) {
    this.renderer = renderer2;
    this.stride = stride;
    this.usage = usage;
    this.isInit = false;
    this.buffer = null;
    this.isIndexBufferSet = false;
    this.maxVerticesToEquals = 24;
    this.size = verticesCount;
    this.bufferData = new Float32Array(verticesCount * this.stride);
  }
  get elementCount() {
    return this.size * this.stride;
  }
  setVertex(data) {
    var _a2, _b;
    if (data.length <= this.maxVerticesToEquals) {
      const bufferData = this.bufferData;
      if (ArrayUtils.almostEquals(bufferData, data)) {
        return;
      }
      ArrayUtils.copyTo(data, 0, data.length, bufferData, 0);
      (_a2 = this.buffer) == null ? void 0 : _a2.setBufferData(bufferData);
    } else {
      (_b = this.buffer) == null ? void 0 : _b.setBufferData(data);
    }
  }
  init() {
    this.buffer = new VertexBuffer(this.renderer.gl, null, this.usage);
    this.renderer.bindVertexBuffer(this.buffer);
    this.buffer.setBufferData(this.bufferData);
    this.renderer.unbindVertexBuffer(this.buffer);
  }
  bind() {
    if (!this.isInit) {
      this.init();
      this.isInit = true;
    }
    if (this.buffer) {
      this.renderer.bindVertexBuffer(this.buffer);
    }
  }
  unbind() {
    if (this.buffer) {
      this.renderer.unbindVertexBuffer(this.buffer);
    }
  }
  toElements(vertices) {
    return ~~vertices;
  }
  toElementIndex(vertexIndex) {
    return ~~vertexIndex;
  }
  draw() {
    const gl = this.renderer.gl;
    if (this.isIndexBufferSet) {
      gl.drawElements(
        gl.TRIANGLES,
        this.toElements(this.size),
        gl.UNSIGNED_INT,
        0
      );
    } else {
      gl.drawArrays(
        gl.TRIANGLES,
        0,
        this.toElements(this.size)
      );
    }
  }
  dispose() {
    var _a2;
    if (this.buffer)
      this.renderer.unbindVertexBuffer(this.buffer);
    (_a2 = this.buffer) == null ? void 0 : _a2.dispose();
  }
}
class IndexBuffer {
  constructor(gl, data = null, usage = gl.STATIC_DRAW) {
    this.gl = gl;
    this.usage = usage;
    const buffer = gl.createBuffer();
    if (!buffer) {
      throw new Error("create index buffer error");
    }
    this.rendererId = buffer;
    this.bind();
    if (data !== null) {
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, usage);
    }
    this.unbind();
  }
  setIndexBuffer(data) {
    const gl = this.gl;
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, this.usage);
  }
  bind() {
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.rendererId);
  }
  unbind() {
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
  }
  dispose() {
    this.gl.deleteBuffer(this.rendererId);
  }
}
class QuadIndexBuffer {
  constructor() {
    this.buffer = null;
    this.renderer = null;
    this.maxAmountIndices = 0;
    this.isDisposed = false;
  }
  init(renderer2) {
    if (!this.buffer) {
      this.buffer = new IndexBuffer(renderer2.gl);
    }
    this.renderer = renderer2;
  }
  tryExtendTo(count) {
    if (!this.buffer) {
      throw new Error("index buffer is null");
    }
    const maxAmountIndices = this.maxAmountIndices;
    if (count > maxAmountIndices) {
      const indices = new Uint32Array(count);
      for (let i = 0, j = 0; j < count; i += 4, j += 6) {
        indices[j] = i;
        indices[j + 1] = i + 1;
        indices[j + 2] = i + 3;
        indices[j + 3] = i + 3;
        indices[j + 4] = i + 2;
        indices[j + 5] = i;
      }
      this.buffer.setIndexBuffer(indices);
      this.maxAmountIndices = count;
    }
  }
  bind() {
    if (this.renderer && this.buffer) {
      this.renderer.bindIndexBuffer(this.buffer);
    }
  }
  unbind() {
    if (this.renderer && this.buffer) {
      this.renderer.unbindIndexBuffer(this.buffer);
    }
  }
  dispose() {
    var _a2;
    if (!this.isDisposed) {
      this.unbind();
      (_a2 = this.buffer) == null ? void 0 : _a2.dispose();
      this.renderer = null;
      this.isDisposed = true;
    }
  }
}
const QuadIndexBuffer$1 = new QuadIndexBuffer();
class QuadBuffer extends BasicVertexBuffer {
  constructor(renderer2, quadCount, usage = renderer2.gl.STATIC_DRAW, stride = 4) {
    super(renderer2, quadCount * 4, stride, usage);
    QuadIndexBuffer$1.init(renderer2);
    this.amountIndices = quadCount * 6;
    console.log("amountIndices", this.amountIndices);
    this.isIndexBufferSet = true;
  }
  init() {
    super.init();
    QuadIndexBuffer$1.bind();
    QuadIndexBuffer$1.tryExtendTo(this.amountIndices);
    QuadIndexBuffer$1.unbind();
  }
  bind() {
    super.bind();
    QuadIndexBuffer$1.bind();
  }
  unbind() {
    super.unbind();
    QuadIndexBuffer$1.unbind();
  }
  toElements(vertices) {
    return ~~(3 * vertices / 2);
  }
  toElementIndex(vertexIndex) {
    return ~~(3 * vertexIndex / 2);
  }
}
class Buffers {
  static init(renderer2) {
    this.SingleQuad = new QuadBuffer(renderer2, 1, renderer2.gl.STREAM_DRAW);
  }
  static dispose() {
    this.SingleQuad.dispose();
  }
}
const _DrawNode = class _DrawNode2 {
  constructor(source, matrix = Matrix3.newIdentify()) {
    this.source = source;
    this.matrix = matrix;
    this.blend = Blend.Normal;
    this.color = Color.White.copy();
    this.texture = null;
    this.bufferData = ArrayUtils.emptyFloat32Array;
    this.one = Vector2.newOne();
    this.childrenNodes = [];
    this.vertexBuffer = Buffers.SingleQuad;
    this.shader = Shaders.Default;
    this.apply();
  }
  /**
   * 如果中途更改了 vertexBuffer 或 Shader，需要调用此方法
   */
  apply() {
    this.bufferData = new Float32Array(this.vertexBuffer.elementCount);
  }
  addDrawNodes(...nodes) {
    this.childrenNodes.push(...nodes);
  }
  applyTransform(translate, rotate, scale, skew2, origin) {
    const m = this.matrix;
    if (!origin.isZero()) {
      TransformUtils2.translateFromLeft(m, origin.negative());
    }
    if (!translate.isZero()) {
      TransformUtils2.translateFromLeft(m, translate);
    }
    if (rotate !== 0) {
      TransformUtils2.rotateFromLeft(m, rotate);
    }
    if (!scale.equals(this.one)) {
      TransformUtils2.scaleFromLeft(m, scale);
    }
    if (!skew2.isZero()) {
      TransformUtils2.skewFromLeft(m, skew2);
    }
    if (!origin.isZero()) {
      TransformUtils2.translateFromLeft(m, origin);
    }
  }
  /**
   * 绘制一个四边形
   * @param topLeft
   * @param topRight
   * @param bottomLeft
   * @param bottomRight
   * @param color
   * @param index
   */
  drawQuad(topLeft, topRight, bottomLeft, bottomRight, color, index = 0) {
    const matrix = this.matrix, data = this.bufferData, stride = this.shader.stride, positionIndex = _DrawNode2.POSITION_INDEX, startIndex = index * stride * _DrawNode2.VERTEX_PER_QUAD;
    TransformUtils2.applyTo(matrix, topLeft, data, startIndex + positionIndex);
    TransformUtils2.applyTo(matrix, topRight, data, startIndex + stride + positionIndex);
    TransformUtils2.applyTo(matrix, bottomLeft, data, startIndex + stride * 2 + positionIndex);
    TransformUtils2.applyTo(matrix, bottomRight, data, startIndex + stride * 3 + positionIndex);
    if (color) {
      const colorIndex = _DrawNode2.COLOR_INDEX;
      data[startIndex + colorIndex] = color.red;
      data[startIndex + colorIndex + 1] = color.green;
      data[startIndex + colorIndex + 2] = color.blue;
      data[startIndex + colorIndex + 3] = color.alpha;
      data[startIndex + stride + colorIndex] = color.red;
      data[startIndex + stride + colorIndex + 1] = color.green;
      data[startIndex + stride + colorIndex + 2] = color.blue;
      data[startIndex + stride + colorIndex + 3] = color.alpha;
      data[startIndex + stride * 2 + colorIndex] = color.red;
      data[startIndex + stride * 2 + colorIndex + 1] = color.green;
      data[startIndex + stride * 2 + colorIndex + 2] = color.blue;
      data[startIndex + stride * 2 + colorIndex + 3] = color.alpha;
      data[startIndex + stride * 3 + colorIndex] = color.red;
      data[startIndex + stride * 3 + colorIndex + 1] = color.green;
      data[startIndex + stride * 3 + colorIndex + 2] = color.blue;
      data[startIndex + stride * 3 + colorIndex + 3] = color.alpha;
    }
  }
  /**
   * 绘制一个矩形
   * @param topLeft
   * @param bottomRight
   * @param color
   * @param index
   */
  drawRect(topLeft, bottomRight, color, index = 0) {
    this.drawQuad(
      topLeft,
      Vector(bottomRight.x, topLeft.y),
      Vector(topLeft.x, bottomRight.y),
      bottomRight,
      color,
      index
    );
  }
  /**
   * 绘制纹理
   * @param texture
   * @param topLeft
   * @param bottomRight
   * @param index
   */
  drawTexture(texture, topLeft = Vector2.zero, bottomRight = Vector2.one, index = 0) {
    const data = this.bufferData;
    const stride = this.shader.stride;
    const textureIndex = _DrawNode2.TEXTURE_INDEX;
    const startIndex = index * stride * _DrawNode2.VERTEX_PER_QUAD;
    data[startIndex + textureIndex] = topLeft.x;
    data[startIndex + textureIndex + 1] = topLeft.y;
    data[startIndex + stride + textureIndex] = bottomRight.x;
    data[startIndex + stride + textureIndex + 1] = topLeft.y;
    data[startIndex + stride * 2 + textureIndex] = topLeft.x;
    data[startIndex + stride * 2 + textureIndex + 1] = bottomRight.y;
    data[startIndex + stride * 3 + textureIndex] = bottomRight.x;
    data[startIndex + stride * 3 + textureIndex + 1] = bottomRight.y;
    if (texture instanceof Texture) {
      this.texture = texture;
    } else {
      this.texture = texture.texture;
    }
  }
  drawTriangle(a1, a2, a3, color, index = 0) {
    const matrix = this.matrix, data = this.bufferData, positionIndex = _DrawNode2.POSITION_INDEX, stride = this.shader.stride, startIndex = index * stride * _DrawNode2.VERTEX_PER_TRIANGLE;
    TransformUtils2.applyTo(matrix, a1, data, startIndex + positionIndex);
    TransformUtils2.applyTo(matrix, a2, data, startIndex + stride + positionIndex);
    TransformUtils2.applyTo(matrix, a3, data, startIndex + stride * 2 + positionIndex);
    if (color) {
      const colorIndex = _DrawNode2.COLOR_INDEX;
      data[startIndex + colorIndex] = color.red;
      data[startIndex + colorIndex + 1] = color.green;
      data[startIndex + colorIndex + 2] = color.blue;
      data[startIndex + colorIndex + 3] = color.alpha;
      data[startIndex + stride + colorIndex] = color.red;
      data[startIndex + stride + colorIndex + 1] = color.green;
      data[startIndex + stride + colorIndex + 2] = color.blue;
      data[startIndex + stride + colorIndex + 3] = color.alpha;
      data[startIndex + stride * 2 + colorIndex] = color.red;
      data[startIndex + stride * 2 + colorIndex + 1] = color.green;
      data[startIndex + stride * 2 + colorIndex + 2] = color.blue;
      data[startIndex + stride * 2 + colorIndex + 3] = color.alpha;
    }
  }
  /**
   * 向 buffer 顶点填充一个顶点属性值
   * @param value
   * @param elementSize 如绘制一个三角形，则为 3，若四边形，则为 4
   * @param offsetOfStride 一个顶点数据中，该值的位置
   * @param index
   */
  drawOne(value, elementSize, offsetOfStride = 4, index) {
    const stride = this.shader.stride;
    const startIndex = index * stride * elementSize;
    const data = this.bufferData;
    for (let i = 0; i < elementSize; i++) {
      data[startIndex + offsetOfStride + stride * i] = value;
    }
  }
  draw(renderer2) {
    if (!this.source.isPresent) {
      return;
    }
    this.source.onDraw(this, renderer2);
    this.shader.bind();
    if (this.texture)
      renderer2.bindTexture(this.texture);
    this.vertexBuffer.bind();
    const data = this.bufferData;
    this.vertexBuffer.setVertex(
      data instanceof Float32Array ? data : new Float32Array(data)
    );
    renderer2.setBlend(this.blend);
    this.source.beforeCommit(this);
    this.shader.use();
    this.vertexBuffer.draw();
    this.shader.unbind();
    this.vertexBuffer.unbind();
    if (this.texture)
      renderer2.unbindTexture(this.texture);
  }
};
_DrawNode.POSITION_INDEX = 0;
_DrawNode.COLOR_INDEX = 2;
_DrawNode.TEXTURE_INDEX = 2;
_DrawNode.VERTEX_PER_QUAD = 4;
_DrawNode.VERTEX_PER_TRIANGLE = 3;
let DrawNode = _DrawNode;
class DrawableRecorder {
  static record(drawable) {
    this.drawables.push(drawable);
  }
  static remove(drawable) {
    const index = this.drawables.indexOf(drawable);
    this.drawables.splice(index, 1);
  }
  static getIndex(drawable) {
    return this.drawables.indexOf(drawable);
  }
}
DrawableRecorder.drawables = [];
class DrawableMouseEvent {
  constructor(source) {
    this.source = source;
    this.downPosition = Vector2.newZero();
    this.isClickDown = false;
    this.isHovered = false;
    this.isDragged = false;
    this.event = { x: 0, y: 9, viewPosition: Vector2.newZero(), which: 0 };
    this.onMouseDown = null;
    this.onMouseMove = null;
    this.onMouseUp = null;
    this.onClick = null;
    this.onHover = null;
    this.onHoverLost = null;
    this.onDrag = null;
    this.onDragLost = null;
    MouseEventRecorder.record(this);
  }
  inBound(position) {
    return this.source.drawQuad.inBound(position);
  }
  get isAvailable() {
    return this.source.isVisible;
  }
  get isPresent() {
    return this.source.isPresent;
  }
  hasEvent(source, eventName) {
    return eventName in source && typeof source[eventName] === "function";
  }
  mouseDown(which, position) {
    if (this.isAvailable && this.inBound(position) && this.isPresent) {
      this.downPosition.setFrom(position);
      this.isClickDown = true;
      this.triggerMouseDown(which, position);
    }
  }
  mouseUp(which, position) {
    if (this.isAvailable && this.inBound(position) && this.isPresent) {
      this.triggerMouseUp(which, position);
      if (!this.downPosition.isZero() && this.isClickDown) {
        this.triggerClick(which, position);
        this.downPosition.set(0, 0);
        this.isClickDown = false;
      }
    }
    this.dragLost(which, position);
  }
  mouseMove(which, position) {
    if (this.isAvailable && this.inBound(position) && this.isPresent) {
      this.triggerMouseMove(which, position);
      this.hover(which, position);
      if (MouseState.hasKeyDown()) {
        this.drag(MouseState.which, position);
      }
      return;
    }
    if (this.isDragged) {
      this.drag(MouseState.which, position);
    }
    this.hoverLost(which, position);
  }
  hover(which, position) {
    if (!this.isHovered) {
      this.isHovered = true;
      this.triggerHover(which, position);
    }
  }
  hoverLost(which, position) {
    if (this.isAvailable && this.isHovered && !this.inBound(position) && this.isPresent) {
      this.isHovered = false;
      this.triggerHoverLost(which, position);
    }
  }
  drag(which, position) {
    if (this.isAvailable && this.isPresent && this.inBound(position)) {
      this.isDragged = true;
      this.triggerDrag(which, position);
    }
  }
  dragLost(which, position) {
    if (this.isAvailable && this.isDragged) {
      this.isDragged = false;
      this.triggerDragLost(which, position);
    }
  }
  triggerMouseDown(which, position) {
    var _a2;
    const event = this.event;
    event.viewPosition = position;
    event.which = which;
    if (this.hasEvent(this.source, "onMouseDown")) {
      this.source.onMouseDown();
    }
    (_a2 = this.onMouseDown) == null ? void 0 : _a2.call(this, event);
  }
  triggerMouseMove(which, position) {
    var _a2;
    const event = this.event;
    event.viewPosition = position;
    event.which = which;
    if (this.hasEvent(this.source, "onMouseMove")) {
      this.source.onMouseMove();
    }
    (_a2 = this.onMouseMove) == null ? void 0 : _a2.call(this, event);
  }
  triggerMouseUp(which, position) {
    var _a2;
    const event = this.event;
    event.viewPosition = position;
    event.which = which;
    if (this.hasEvent(this.source, "onMouseUp")) {
      this.source.onMouseUp();
    }
    (_a2 = this.onMouseUp) == null ? void 0 : _a2.call(this, event);
  }
  triggerClick(which, position) {
    var _a2;
    const event = this.event;
    event.viewPosition = position;
    event.which = which;
    if (this.hasEvent(this.source, "onClick")) {
      this.source.onClick();
    }
    (_a2 = this.onClick) == null ? void 0 : _a2.call(this, event);
  }
  triggerHover(which, position) {
    var _a2;
    const event = this.event;
    event.viewPosition = position;
    event.which = which;
    if (this.hasEvent(this.source, "onHover")) {
      this.source.onHover();
    }
    (_a2 = this.onHover) == null ? void 0 : _a2.call(this, event);
  }
  triggerHoverLost(which, position) {
    var _a2;
    const event = this.event;
    event.viewPosition = position;
    event.which = which;
    if (this.hasEvent(this.source, "onHoverLost")) {
      this.source.onHoverLost();
    }
    (_a2 = this.onHoverLost) == null ? void 0 : _a2.call(this, event);
  }
  triggerDrag(which, position) {
    var _a2;
    const event = this.event;
    event.viewPosition = position;
    event.which = which;
    if (this.hasEvent(this.source, "onDrag")) {
      this.source.onDrag();
    }
    (_a2 = this.onDrag) == null ? void 0 : _a2.call(this, event);
  }
  triggerDragLost(which, position) {
    var _a2;
    const event = this.event;
    event.viewPosition = position;
    event.which = which;
    if (this.hasEvent(this.source, "onDragLost")) {
      this.source.onDragLost();
    }
    (_a2 = this.onDragLost) == null ? void 0 : _a2.call(this, event);
  }
  dispose() {
    this.onMouseDown = null;
    this.onMouseMove = null;
    this.onMouseUp = null;
    this.onClick = null;
    this.onHover = null;
    this.onHoverLost = null;
    this.onDrag = null;
    this.onDragLost = null;
    MouseEventRecorder.remove(this);
  }
}
class Size {
  static of(width, height) {
    return Vector(width, height);
  }
}
Size.FillParent = -1;
Size.FillParentSize = Vector(-1, -1);
class Transformable {
  constructor() {
    this._translate = Vector2.newZero();
    this._scale = Vector2.newOne();
    this._rotate = 0;
    this._color = Color.Black.copy();
    this._skew = Vector2.newZero();
  }
  getTranslate() {
    return this._translate.copy();
  }
  setTranslate(t) {
    this._translate.setFrom(t);
  }
  getScale() {
    return this._scale.copy();
  }
  setScale(s) {
    this._scale.setFrom(s);
  }
  getSkew() {
    return this._skew;
  }
  setSkew(s) {
    this._skew.setFrom(s);
  }
  getColor() {
    return this._color.copy();
  }
  setColor(c) {
    this._color.red = c.red;
    this._color.green = c.green;
    this._color.blue = c.blue;
  }
  getTranslateX() {
    return this._translate.x;
  }
  setTranslateX(x) {
    this._translate.x = x;
  }
  getTranslateY() {
    return this._translate.y;
  }
  setTranslateY(y) {
    this._translate.y = y;
  }
  getScaleX() {
    return this._scale.x;
  }
  setScaleX(x) {
    this._scale.x = x;
  }
  getScaleY() {
    return this._scale.y;
  }
  setScaleY(y) {
    this._scale.y = y;
  }
  getColorR() {
    return this._color.red;
  }
  setColorR(r) {
    this._color.red = r;
  }
  getColorG() {
    return this._color.green;
  }
  setColorG(g) {
    this._color.green = g;
  }
  getColorB() {
    return this._color.blue;
  }
  setColorB(b) {
    this._color.blue = b;
  }
  getAlpha() {
    return this._color.alpha;
  }
  setAlpha(a) {
    this._color.alpha = a;
  }
  getSkewX() {
    return this._skew.x;
  }
  setSkewX(x) {
    this._skew.x = x;
  }
  getSkewY() {
    return this._skew.y;
  }
  setSkewY(y) {
    this._skew.y = y;
  }
  getRotate() {
    return this._rotate;
  }
  setRotate(r) {
    this._rotate = r;
  }
  apply(block2) {
    block2(this);
    return this;
  }
  run(block2) {
    return block2(this);
  }
}
class Rectangle {
  constructor() {
    this.topLeft = Vector2.newZero();
    this.bottomRight = Vector2.newZero();
  }
  getWidth() {
    return this.bottomRight.x - this.topLeft.x;
  }
  getHeight() {
    return this.bottomRight.y - this.topLeft.y;
  }
  setWidth(width) {
    this.bottomRight.x = this.topLeft.x + width;
  }
  setHeight(height) {
    this.bottomRight.y = this.topLeft.y + height;
  }
  copy() {
    const rectangle = new Rectangle();
    rectangle.topLeft.setFrom(this.topLeft);
    rectangle.bottomRight.setFrom(this.bottomRight);
    return rectangle;
  }
  setFrom(rectangle) {
    this.topLeft.setFrom(rectangle.topLeft);
    this.bottomRight.setFrom(rectangle.bottomRight);
  }
  set(x, y, width, height) {
    this.topLeft.set(x, y);
    this.bottomRight.set(x + width, y + height);
  }
  /**
   * 设置矩形的 TopLeft 坐标，并自动调整 BottomRight 坐标以保持宽度/高度不变
   * @param x x 坐标
   * @param y y 坐标
   */
  setTopLeft(x, y) {
    const width = this.getWidth(), height = this.getHeight();
    this.topLeft.set(x, y);
    this.bottomRight.set(x + width, y + height);
  }
  /**
   * 设置矩形的 BottomRight 坐标，并自动调整 TopLeft 坐标以保持宽度/高度不变
   * @param x x 坐标
   * @param y y 坐标
   */
  setBottomRight(x, y) {
    const width = this.getWidth(), height = this.getHeight();
    this.bottomRight.set(x, y);
    this.topLeft.set(x - width, y - height);
  }
  /**
   * 检查 position 是否在矩形内
   * @param position
   */
  inBound(position) {
    return position.x >= this.topLeft.x && position.x <= this.bottomRight.x && position.y >= this.topLeft.y && position.y <= this.bottomRight.y;
  }
}
class Quad {
  constructor() {
    this.topLeft = Vector2.newZero();
    this.bottomLeft = Vector2.newZero();
    this.topRight = Vector2.newZero();
    this.bottomRight = Vector2.newZero();
  }
  copy() {
    const quad = new Quad();
    quad.topLeft.setFrom(this.topLeft);
    quad.bottomLeft.setFrom(this.bottomLeft);
    quad.topRight.setFrom(this.topRight);
    quad.bottomRight.setFrom(this.bottomRight);
    return quad;
  }
  setFrom(quad) {
    this.topLeft.setFrom(quad.topLeft);
    this.bottomLeft.setFrom(quad.bottomLeft);
    this.topRight.setFrom(quad.topRight);
    this.bottomRight.setFrom(quad.bottomRight);
  }
  copyTo(out) {
    out.setFrom(this);
  }
  equals(quad) {
    return this.topLeft.equals(quad.topLeft) && this.bottomLeft.equals(quad.bottomLeft) && this.topRight.equals(quad.topRight) && this.bottomRight.equals(quad.bottomRight);
  }
  inBound(position) {
    const A = this.bottomLeft, B = this.topLeft, C2 = this.topRight, D = this.bottomRight;
    const a = (B.x - A.x) * (position.y - A.y) - (B.y - A.y) * (position.x - A.x);
    const b = (C2.x - B.x) * (position.y - B.y) - (C2.y - B.y) * (position.x - B.x);
    const c = (D.x - C2.x) * (position.y - C2.y) - (D.y - C2.y) * (position.x - C2.x);
    const d = (A.x - D.x) * (position.y - D.y) - (A.y - D.y) * (position.x - D.x);
    return a >= 0 && b >= 0 && c >= 0 && d >= 0 || a <= 0 && b <= 0 && c <= 0 && d <= 0;
  }
}
class Vector2Utils {
  static middle(v1, v2) {
    return new Vector2((v1.x + v2.x) / 2, (v1.y + v2.y) / 2);
  }
  static middleTo(v1, v2, out) {
    out.set((v1.x + v2.x) / 2, (v1.y + v2.y) / 2);
  }
  static apply(v, matrix) {
    const vector2 = new Vector2();
    this.applySelf(vector2, matrix);
    return vector2;
  }
  static applySelf(vec2, matrix) {
    const x = vec2.x * matrix.M11 + vec2.y * matrix.M12 + matrix.M13;
    const y = vec2.x * matrix.M21 + vec2.y * matrix.M22 + matrix.M23;
    vec2.x = x;
    vec2.y = y;
  }
}
class RectangleUtils {
  static apply(rectangle, matrix) {
    const newRectangle = new Rectangle();
    newRectangle.setFrom(rectangle);
    this.applySelf(newRectangle, matrix);
    return newRectangle;
  }
  static applySelf(rectangle, matrix) {
    Vector2Utils.applySelf(rectangle.topLeft, matrix);
    Vector2Utils.applySelf(rectangle.bottomRight, matrix);
  }
  static applyTo(rectangle, matrix, out) {
    out.setFrom(rectangle);
    this.applySelf(out, matrix);
  }
}
class QuadUtils {
  static apply(quad, matrix) {
    const newQuad = new Quad();
    newQuad.setFrom(quad);
    this.applySelf(newQuad, matrix);
    return newQuad;
  }
  static applySelf(quad, matrix) {
    Vector2Utils.applySelf(quad.topLeft, matrix);
    Vector2Utils.applySelf(quad.bottomLeft, matrix);
    Vector2Utils.applySelf(quad.topRight, matrix);
    Vector2Utils.applySelf(quad.bottomRight, matrix);
  }
  static applyTo(quad, matrix, out) {
    out.setFrom(quad);
    this.applySelf(out, matrix);
  }
  static fromRectangle(rectangle) {
    const quad = new Quad();
    this.fromRectangleTo(rectangle, quad);
    return quad;
  }
  static fromRectangleTo(rectangle, out) {
    out.topLeft.setFrom(rectangle.topLeft);
    out.bottomRight.setFrom(rectangle.bottomRight);
    out.topRight.set(rectangle.bottomRight.x, rectangle.topLeft.y);
    out.bottomLeft.set(rectangle.topLeft.x, rectangle.bottomRight.y);
  }
}
const _Invalidation = class _Invalidation2 {
};
_Invalidation.None = 0;
_Invalidation.Size = 1 << 1;
_Invalidation.Layout = 1 << 2;
_Invalidation.ParentAutoSize = 1 << 3;
_Invalidation.All = _Invalidation.Size | _Invalidation.Layout | _Invalidation.ParentAutoSize;
let Invalidation = _Invalidation;
const _InvalidationSource = class _InvalidationSource2 {
};
_InvalidationSource.Child = 1;
_InvalidationSource.Self = 1 << 1;
_InvalidationSource.Parent = 1 << 2;
_InvalidationSource.All = _InvalidationSource.Child | _InvalidationSource.Self | _InvalidationSource.Parent;
let InvalidationSource = _InvalidationSource;
class Queue {
  constructor() {
    this._head = void 0;
    this._end = void 0;
    this._size = 0;
  }
  push(value) {
    if (!this._head) {
      const node = new Node(value);
      this._head = node;
      this._end = node;
    } else {
      const node = new Node(value);
      this._end.next = node;
      this._end = node;
    }
    this._size++;
  }
  front() {
    return this._head.value;
  }
  end() {
    return this._end.value;
  }
  size() {
    return this._size;
  }
  isEmpty() {
    return this._size === 0;
  }
  pop() {
    this._head = this._head.next;
    this._size--;
  }
  foreach(callback) {
    let current = this._head;
    let i = 0;
    while (current !== void 0) {
      callback(current.value, i++);
      current = current.next;
    }
  }
  clear() {
    this._head = void 0;
    this._end = void 0;
    this._size = 0;
  }
}
class Node {
  constructor(v) {
    this.next = void 0;
    this.value = v;
  }
}
class DrawableTask {
  constructor() {
    this.preTaskQueue = new Queue();
    this.postTaskQueue = new Queue();
  }
  consumePreTask() {
    if (this.preTaskQueue.size() === 0) {
      return;
    }
    this.preTaskQueue.foreach((task) => task());
    this.preTaskQueue.clear();
  }
  consumePostTask() {
    if (this.postTaskQueue.size() === 0) {
      return;
    }
    this.postTaskQueue.foreach((task) => task());
    this.postTaskQueue.clear();
  }
  post(task) {
    this.postTaskQueue.push(task);
  }
  pre(task) {
    this.preTaskQueue.push(task);
  }
}
class Drawable extends Transformable {
  constructor(config2) {
    super();
    this.config = config2;
    this.sizeParam = Vector2.newZero();
    this.anchor = Vector2.newZero();
    this.anchorValue = Anchor.TopLeft;
    this.anchorOffset = Vector2.newZero();
    this.origin = Vector2.newZero();
    this.initRectangle = new Rectangle();
    this.rectangle = new Rectangle();
    this.drawQuad = new Quad();
    this.parent = null;
    this.isAvailable = false;
    this.isVisible = true;
    this.disposeList = [];
    this.invalidationValue = Invalidation.None;
    this.invalidationSource = InvalidationSource.Self;
    this.transition = new DrawableTransition(this);
    this.appliedColor = Color.Transparent.copy();
    this.isPresent = true;
    this.hasInvalidate = false;
    this.drawNode = new DrawNode(this);
    this.mouseEvent = null;
    this.task = new DrawableTask();
    this.isAvailable = true;
    this.applyConfig();
    provide(this.constructor.name, this);
    DrawableRecorder.record(this);
  }
  setAnchor(anchor) {
    var _a2;
    this.anchorValue = anchor;
    const anchorX = Axis.getXAxis(anchor), anchorY = Axis.getYAxis(anchor);
    if (anchorX === Axis.X_LEFT) {
      this.anchor.x = 0;
    } else if (anchorX === Axis.X_CENTER) {
      this.anchor.x = 0.5;
    } else {
      this.anchor.x = 1;
    }
    if (anchorY === Axis.Y_TOP) {
      this.anchor.y = 0;
    } else if (anchorY === Axis.Y_CENTER) {
      this.anchor.y = 0.5;
    } else {
      this.anchor.y = 1;
    }
    (_a2 = this.parent) == null ? void 0 : _a2.invalidate(Invalidation.Layout, InvalidationSource.Child);
  }
  setAnchorOffset(offset) {
    var _a2;
    this.anchorOffset.setFrom(offset);
    (_a2 = this.parent) == null ? void 0 : _a2.invalidate(Invalidation.Layout, InvalidationSource.Child);
  }
  setOrigin(origin) {
    const originX = Axis.getXAxis(origin), originY = Axis.getYAxis(origin);
    if (originX === Axis.X_LEFT) {
      this.origin.x = 0;
    } else if (originX === Axis.X_CENTER) {
      this.origin.x = 0.5;
    } else {
      this.origin.x = 1;
    }
    if (originY === Axis.Y_TOP) {
      this.origin.y = 0;
    } else if (originY === Axis.Y_CENTER) {
      this.origin.y = 0.5;
    } else {
      this.origin.y = 1;
    }
  }
  getWidth() {
    return this.initRectangle.getWidth();
  }
  getHeight() {
    return this.initRectangle.getHeight();
  }
  setWidth(w) {
    var _a2;
    this.sizeParam.x = w;
    (_a2 = this.parent) == null ? void 0 : _a2.invalidate(Invalidation.Layout, InvalidationSource.Child);
    this.invalidate(Invalidation.Size);
  }
  setHeight(h2) {
    var _a2;
    this.sizeParam.y = h2;
    (_a2 = this.parent) == null ? void 0 : _a2.invalidate(Invalidation.Layout, InvalidationSource.Child);
    this.invalidate(Invalidation.Size);
  }
  setSize(width, height) {
    var _a2;
    this.sizeParam.set(width, height);
    (_a2 = this.parent) == null ? void 0 : _a2.invalidate(Invalidation.Layout, InvalidationSource.Child);
    this.invalidate(Invalidation.Size);
  }
  getSize() {
    return Vector(this.initRectangle.getWidth(), this.initRectangle.getHeight());
  }
  getPosition() {
    return this.initRectangle.topLeft;
  }
  applyConfig() {
    const config2 = this.config;
    this.sizeParam.set(config2.size.x, config2.size.y);
    if (config2.size.x !== Size.FillParent && config2.size.y !== Size.FillParent) {
      this.initRectangle.setWidth(config2.size.x);
      this.initRectangle.setHeight(config2.size.y);
    } else {
      this.invalidate(Invalidation.Size | Invalidation.Layout);
    }
    this.setAnchor(config2.anchor ?? Anchor.TopLeft);
    this.setOrigin(config2.origin ?? Anchor.Center);
    if (config2.offset) {
      this.setAnchorOffset(Vector(config2.offset.x, config2.offset.y));
    }
  }
  /**
   * 当父容器的尺寸发生变化时调用，如果没有父容器，则在窗口尺寸变化时调用
   * @protected
   */
  onSizeChanged() {
    this.invalidate(Invalidation.Layout);
  }
  updateSize() {
    const width = this.sizeParam.x;
    const height = this.sizeParam.y;
    const parentWidth = this.parent ? this.parent.initRectangle.getWidth() : Coordinate$1.size.x;
    const parentHeight = this.parent ? this.parent.initRectangle.getHeight() : Coordinate$1.size.y;
    this.initRectangle.setWidth(width === Size.FillParent ? parentWidth : width);
    this.initRectangle.setHeight(height === Size.FillParent ? parentHeight : height);
    if (this.rectangle.getHeight() === 0 || this.rectangle.getWidth() === 0) {
      this.rectangle.setFrom(this.initRectangle);
    }
  }
  //////////////////////////////////////////////////////////////////////////
  setScaleY(y) {
    var _a2;
    super.setScaleY(y);
    (_a2 = this.parent) == null ? void 0 : _a2.invalidate(Invalidation.ParentAutoSize, InvalidationSource.Child);
  }
  setScaleX(x) {
    var _a2;
    super.setScaleX(x);
    (_a2 = this.parent) == null ? void 0 : _a2.invalidate(Invalidation.ParentAutoSize, InvalidationSource.Child);
  }
  setScale(s) {
    var _a2;
    super.setScale(s);
    (_a2 = this.parent) == null ? void 0 : _a2.invalidate(Invalidation.ParentAutoSize, InvalidationSource.Child);
  }
  computeOrigin() {
    const origin = this.origin.copy();
    const width = this.initRectangle.getWidth();
    const height = this.initRectangle.getHeight();
    origin.setFrom(this.initRectangle.topLeft);
    origin.x += width * this.origin.x;
    origin.y += height * this.origin.y;
    return origin;
  }
  updateTransform3() {
    var _a2;
    const node = this.drawNode;
    const matrix = node.matrix;
    matrix.setFrom(((_a2 = this.parent) == null ? void 0 : _a2.drawNode.matrix) ?? Matrix3.identify);
    const origin = this.computeOrigin();
    if (this.parent) {
      TransformUtils.applySelf(origin, node.matrix);
    }
    node.applyTransform(
      this._translate,
      this._rotate,
      this._scale,
      this._skew,
      origin
    );
    RectangleUtils.applyTo(this.initRectangle, matrix, this.rectangle);
    QuadUtils.fromRectangleTo(this.initRectangle, this.drawQuad);
    QuadUtils.applySelf(this.drawQuad, matrix);
    this.isPresent = !almostEquals(this.appliedColor.alpha, 0) || !(almostEquals(this.rectangle.getWidth(), 0) || almostEquals(this.rectangle.getHeight(), 0));
    this.computeColor();
  }
  onTransformApplied() {
  }
  /**
   * 返回一个平滑过渡的变换
   * @param clear 默认为 true，如果为 true，初次调用变换方法时，将根据当前时间为基准进行平滑变换，如果想开始一个新的平滑
   * 过渡，则应该保持默认值
   */
  transform(clear2 = true) {
    if (clear2) {
      return this.transition.clear;
    }
    return this.transition;
  }
  updateTransition() {
    this.transition.updateTransform();
  }
  /////////////////////////////////////////////////////////////////////////////////////
  setParent(parent) {
    this.parent = parent;
  }
  /**
   * remove self from parent
   */
  remove() {
    var _a2;
    (_a2 = this.parent) == null ? void 0 : _a2.removeChild(this);
  }
  load(renderer2) {
    this.invalidateSelf();
    this.onLoad(renderer2);
  }
  onLoad(renderer2) {
  }
  //////////////////////////////////////////////////////////////////
  onUpdate() {
  }
  update() {
    if (this.isAvailable) {
      this.invalidateSelf();
      this.doPreTask();
      this.updateTransition();
      this.onUpdate();
      this.updateTransform3();
      this.onTransformApplied();
      this.invalidateLayout();
      this.doOnInvalidate();
      this.doPostTask();
    }
  }
  invalidate(value = Invalidation.All, source = InvalidationSource.Self) {
    this.invalidationValue |= value;
    this.invalidationSource |= source;
  }
  invalidateSelf() {
    this.hasInvalidate = this.invalidationValue !== Invalidation.None;
    const value = this.invalidationValue;
    if ((value & Invalidation.Size) > 0) {
      this.updateSize();
      this.invalidationValue &= ~Invalidation.Size;
    }
  }
  invalidateLayout() {
    if ((this.invalidationValue & Invalidation.Layout) > 0) {
      this.updateLayout();
      this.invalidationValue &= ~Invalidation.Layout;
    }
  }
  updateLayout() {
  }
  doOnInvalidate() {
    if (this.hasInvalidate) {
      this.onInvalidate();
      this.hasInvalidate = false;
    }
  }
  onInvalidate() {
  }
  beforeCommit(node) {
  }
  draw(renderer2) {
    if (this.isAvailable && this.isVisible && this.isPresent) {
      this.drawNode.draw(renderer2);
    }
  }
  onWindowResize() {
    this.invalidate(Invalidation.All);
  }
  computeColor(alpha = 1) {
    var _a2;
    const parentAlpha = ((_a2 = this.parent) == null ? void 0 : _a2.appliedColor.alpha) ?? 1;
    this.appliedColor.setFrom(this._color);
    this.appliedColor.alpha = parentAlpha * this.getAlpha() * alpha;
    this.isPresent = this.isPresent || !almostEquals(this.appliedColor.alpha, 0);
    return this.appliedColor;
  }
  /////////////////////////////////////////////////////////
  dispose() {
    this.isAvailable = false;
    unprovide(this.constructor.name);
    DrawableRecorder.remove(this);
    this.disableMouseEvent();
    for (let i = 0; i < this.disposeList.length; i++) {
      const disposable = this.disposeList[i];
      disposable && disposable();
    }
  }
  addDisposable(init) {
    this.disposeList.push(init());
  }
  /////////////////////////////////////////////////////////////
  placeholder() {
  }
  enableMouseEvent() {
    this.mouseEvent = new DrawableMouseEvent(this);
  }
  disableMouseEvent() {
    var _a2;
    (_a2 = this.mouseEvent) == null ? void 0 : _a2.dispose();
    this.mouseEvent = null;
  }
  setOnClick(click) {
    if (this.mouseEvent) {
      this.mouseEvent.onClick = click;
    }
    return this;
  }
  setOnMouseDown(mouseDown) {
    if (this.mouseEvent) {
      this.mouseEvent.onMouseDown = mouseDown;
    }
    return this;
  }
  setOnMouseMove(mouseMove) {
    if (this.mouseEvent) {
      this.mouseEvent.onMouseMove = mouseMove;
    }
    return this;
  }
  setOnMouseUp(mouseUp) {
    if (this.mouseEvent) {
      this.mouseEvent.onMouseUp = mouseUp;
    }
    return this;
  }
  setOnHover(hover) {
    if (this.mouseEvent) {
      this.mouseEvent.onHover = hover;
    }
    return this;
  }
  setOnHoverLost(hoverLost) {
    if (this.mouseEvent) {
      this.mouseEvent.onHoverLost = hoverLost;
    }
    return this;
  }
  setOnDrag(drag) {
    if (this.mouseEvent) {
      this.mouseEvent.onDrag = drag;
    }
    return this;
  }
  setOnDragLost(dragLost) {
    if (this.mouseEvent) {
      this.mouseEvent.onDragLost = dragLost;
    }
    return this;
  }
  post(task) {
    this.task.post(task);
  }
  pre(task) {
    this.task.pre(task);
  }
  doPreTask() {
    this.task.consumePreTask();
  }
  doPostTask() {
    this.task.consumePostTask();
  }
}
const _Axes = class _Axes2 {
  static hasX(axes) {
    return (axes & this.X) > 0;
  }
  static hasY(axes) {
    return (axes & this.Y) > 0;
  }
};
_Axes.X = 1;
_Axes.Y = 1 << 1;
_Axes.Both = _Axes.X | _Axes.Y;
let Axes = _Axes;
class Box extends Drawable {
  constructor() {
    super(...arguments);
    this.childrenList = [];
    this.drawNode = new BoxDrawNode(this);
  }
  //////////////////////////////////////////////////////////
  add(...children) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      child.setParent(this);
      this.childrenList.push(child);
    }
  }
  removeChild(child) {
    const index = this.childrenList.indexOf(child);
    if (index >= 0) {
      console.log("child found, and can be removed, index", index);
      this.childrenList.splice(index, 1);
      child.dispose();
      console.log("has", this.childrenList.length, "child now");
    }
  }
  removeAllChildren() {
    for (let i = 0; i < this.childrenList.length; i++) {
      this.childrenList[i].dispose();
    }
    this.childrenList.length = 0;
  }
  get firstChild() {
    return this.childrenList[0];
  }
  getFirstChild() {
    return this.childrenList[0];
  }
  get lastChild() {
    return this.childrenList[this.childrenList.length - 1];
  }
  getLastChild() {
    return this.childrenList[this.childrenList.length - 1];
  }
  get childrenCount() {
    return this.childrenList.length;
  }
  childAt(index) {
    if (ArrayUtils.inBound(this.childrenList, index)) {
      return this.childrenList[index];
    }
    return null;
  }
  ////////////////////////////////////////////
  load(renderer2) {
    super.load(renderer2);
    const config2 = this.config;
    if (config2.children) {
      this.add(...config2.children);
    }
    for (let i = 0; i < this.childrenList.length; i++) {
      this.childrenList[i].load(renderer2);
    }
  }
  onWindowResize() {
    super.onWindowResize();
    for (let i = 0; i < this.childrenList.length; i++) {
      this.childrenList[i].onWindowResize();
    }
  }
  invalidateSelf() {
    super.invalidateSelf();
    for (let i = 0; i < this.childrenList.length; i++) {
      this.childrenList[i].invalidateSelf();
    }
  }
  updateTransition() {
    super.updateTransition();
    for (let i = 0; i < this.childrenList.length; i++) {
      this.childrenList[i].updateTransition();
    }
  }
  doPreTask() {
    super.doPreTask();
    for (let i = 0; i < this.childrenList.length; i++) {
      this.childrenList[i].doPreTask();
    }
  }
  doPostTask() {
    super.doPostTask();
    for (let i = 0; i < this.childrenList.length; i++) {
      this.childrenList[i].doPostTask();
    }
  }
  updateTransform3() {
    super.updateTransform3();
    for (let i = 0; i < this.childrenList.length; i++) {
      this.childrenList[i].updateTransform3();
    }
  }
  invalidate(value = Invalidation.All, source = InvalidationSource.Self) {
    super.invalidate(value, source);
    if (this.childrenList) {
      for (let i = 0; i < this.childrenList.length; i++) {
        this.childrenList[i].invalidate(value, source);
      }
    }
  }
  invalidateLayout() {
    if ((this.invalidationValue & Invalidation.ParentAutoSize) > 0) {
      this.updateSizeByChildren(true);
    }
    super.invalidateLayout();
    for (let i = 0; i < this.childrenList.length; i++) {
      this.childrenList[i].invalidateLayout();
    }
  }
  doOnInvalidate() {
    super.doOnInvalidate();
    for (let i = 0; i < this.childrenList.length; i++) {
      this.childrenList[i].doOnInvalidate();
    }
  }
  onUpdate() {
    super.onUpdate();
    for (let i = 0; i < this.childrenList.length; i++) {
      this.childrenList[i].onUpdate();
    }
  }
  onTransformApplied() {
    super.onTransformApplied();
    for (let i = 0; i < this.childrenList.length; i++) {
      this.childrenList[i].onTransformApplied();
    }
  }
  updateLayout() {
    const children = this.childrenList;
    let child, anchor, childWidth, childHeight;
    const width = this.getWidth();
    const height = this.getHeight();
    const topLeft = this.getPosition();
    for (let i = 0; i < children.length; i++) {
      child = children[i];
      anchor = child.anchor;
      childWidth = child.getWidth();
      childHeight = child.getHeight();
      child.initRectangle.setTopLeft(
        width * anchor.x - childWidth * anchor.x + topLeft.x + child.anchorOffset.x,
        height * anchor.y - childHeight * anchor.y + topLeft.y + child.anchorOffset.y
      );
      child.invalidate(Invalidation.Layout, InvalidationSource.Parent);
    }
  }
  updateSizeByChildren(toParent = false) {
    var _a2, _b;
    const autoSize = this.config.autoSize;
    if (!autoSize) {
      return false;
    }
    const children = this.childrenList;
    let maxWidth = -1, maxHeight = -1;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      maxWidth = Math.max(child.rectangle.getWidth(), maxWidth);
      maxHeight = Math.max(child.rectangle.getHeight(), maxHeight);
    }
    if (Axes.hasX(autoSize))
      this.setWidth(maxWidth);
    if (Axes.hasY(autoSize))
      this.setHeight(maxHeight);
    toParent && ((_a2 = this.parent) == null ? void 0 : _a2.updateSizeByChildren());
    (_b = this.parent) == null ? void 0 : _b.invalidate(Invalidation.Layout, InvalidationSource.Child);
    this.invalidate(Invalidation.Layout);
    return true;
  }
  dispose() {
    super.dispose();
    for (let i = 0; i < this.childrenList.length; i++) {
      this.childrenList[i].dispose();
    }
  }
  draw(renderer2) {
    if (!this.isVisible) {
      return;
    }
    for (let i = 0; i < this.childrenList.length; i++) {
      this.childrenList[i].draw(renderer2);
    }
  }
  onDraw() {
  }
}
class BoxDrawNode extends DrawNode {
  draw(renderer2) {
  }
}
class TextureAtlas {
  constructor(gl, image2) {
    this.textureReginList = [];
    this.texture = new Texture(gl, image2);
  }
  addRegin(regin) {
    this.textureReginList.push(regin);
    regin.parent = this;
  }
  getRegin(name) {
    const list2 = this.textureReginList;
    for (let i = 0; i < list2.length; i++) {
      if (name === list2[i].name) {
        return list2[i];
      }
    }
    throw new Error(`no regin found name=${name}`);
  }
  dispose() {
    this.textureReginList.length = 0;
    this.texture.dispose();
  }
  initRegin() {
    const list2 = this.textureReginList;
    for (let i = 0; i < list2.length; i++) {
      list2[i].init();
    }
  }
}
class TextureRegin {
  constructor(name) {
    this.name = name;
    this.parent = null;
    this.topLeft = Vector2.newZero();
    this.size = Vector2.newZero();
    this.bottomRight = Vector2.zero;
    this.texTopLeft = Vector2.zero;
    this.texBottomRight = Vector2.zero;
  }
  init() {
    const { imageWidth, imageHeight } = this.texture;
    const scale = Vector(1 / imageWidth, 1 / imageHeight);
    this.bottomRight = this.topLeft.add(this.size);
    this.texTopLeft = this.topLeft.mul(scale);
    this.texBottomRight = this.bottomRight.mul(scale);
  }
  get texture() {
    return this.parent.texture;
  }
}
class TextureAtlasParser {
  static parse(gl, content, image2) {
    const lines = content.split("\n").map((v) => v.trimEnd());
    let regin = null;
    const atlas = new TextureAtlas(gl, image2);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith(" ")) {
        const [prop, value] = line.split(":").map((v) => v.trim());
        if (regin !== null) {
          if (prop === "x") {
            regin.topLeft.x = parseFloat(value);
          } else if (prop === "y") {
            regin.topLeft.y = parseFloat(value);
          } else if (prop === "width") {
            regin.size.x = parseFloat(value);
          } else if (prop === "height") {
            regin.size.y = parseFloat(value);
          }
        }
      } else {
        regin = new TextureRegin(line.trim());
        atlas.addRegin(regin);
      }
    }
    atlas.initRegin();
    return atlas;
  }
}
class TextureStore {
  static add(gl, name, source) {
    this.gl = gl;
    const texture = new Texture(gl, source);
    this.map.set(name, texture);
  }
  static addTexture(name, texture) {
    this.map.set(name, texture);
  }
  static get(name) {
    return this.map.get(name);
  }
  static getAtlas(name) {
    return this.map.get(name);
  }
  static create(image2) {
    return new Texture(this.gl, image2);
  }
  static async addTextureAtlas(name, atlasUrl, image2, isUrl = true) {
    let text2;
    if (isUrl) {
      const response = await fetch(atlasUrl);
      text2 = await response.text();
    } else {
      text2 = atlasUrl;
    }
    const atlas = TextureAtlasParser.parse(this.gl, text2, image2);
    if (atlas) {
      this.map.set(name, atlas);
    } else {
      throw new Error(`add texture atlas failed, name=${name}, url=${atlasUrl}`);
    }
  }
  static dispose() {
    this.map.forEach((v) => v.dispose());
  }
}
TextureStore.map = /* @__PURE__ */ new Map();
class MovableBackground extends Drawable {
  constructor() {
    super({
      size: Size.FillParentSize,
      anchor: Anchor.Center
    });
    this.imageDrawInfo = {
      drawHeight: 0,
      drawWidth: 0,
      needToChange: false,
      offsetLeft: 0,
      offsetTop: 0
    };
    this.onFinish = null;
    this.texture = TextureStore.create();
    this.setColor(Color.White);
  }
  onUpdate() {
    var _a2;
    if (this.transition.transitionAlpha.isEnd) {
      (_a2 = this.onFinish) == null ? void 0 : _a2.call(this);
      this.onFinish = null;
    }
    const min = Math.min;
    const viewport = Coordinate$1;
    const { imageWidth, imageHeight } = this.texture;
    const imageDrawInfo = this.imageDrawInfo;
    if (imageDrawInfo.needToChange) {
      const rawWidth = this.getWidth();
      const rawHeight = this.getHeight();
      const rawRatio = rawWidth / rawHeight;
      const imageRatio = imageWidth / imageHeight;
      if (rawRatio > imageRatio) {
        imageDrawInfo.drawWidth = imageWidth;
        imageDrawInfo.drawHeight = imageWidth / rawRatio;
        imageDrawInfo.offsetLeft = 0;
        imageDrawInfo.offsetTop = (imageHeight - imageDrawInfo.drawHeight) / 2;
      } else {
        imageDrawInfo.drawHeight = imageHeight;
        imageDrawInfo.drawWidth = imageHeight * rawRatio;
        imageDrawInfo.offsetTop = 0;
        imageDrawInfo.offsetLeft = (imageWidth - imageDrawInfo.drawWidth) / 2;
      }
      imageDrawInfo.needToChange = false;
    }
    const scale = 1.02;
    const translate = this.getTranslate();
    const scaledWidth = imageWidth * scale;
    const scaledHeight = imageHeight * scale;
    const shortOnImage = min(scaledHeight, scaledWidth);
    const shortOnViewport = min(viewport.width, viewport.height);
    const factor = shortOnViewport / shortOnImage;
    const widthDiffer = scaledWidth - imageWidth;
    const heightDiffer = scaledHeight - imageHeight;
    const x = factor * widthDiffer / viewport.width * (translate.x - Coordinate$1.centerX);
    const y = factor * heightDiffer / viewport.height * (translate.y - Coordinate$1.centerY);
    this.setScale(Vector(scale));
    this.setTranslate(new Vector2(x, y));
  }
  setBackgroundImage(image2) {
    this.texture.setTextureImage(image2);
    this.imageDrawInfo.needToChange = true;
  }
  fadeOut(onFinish) {
    this.transform().fadeTo(0, 220);
    this.onFinish = onFinish;
  }
  onWindowResize() {
    super.onWindowResize();
    this.imageDrawInfo.needToChange = true;
  }
  beforeCommit(node) {
    const shader = node.shader;
    shader.orth = Coordinate$1.orthographicProjectionMatrix4;
    shader.sampler2D = 0;
    shader.color = this.computeColor();
  }
  onDraw(node) {
    const info = this.imageDrawInfo;
    const imageTopLeft = new Vector2(info.offsetLeft, info.offsetTop);
    const imageBottomRight = new Vector2(info.offsetLeft + info.drawWidth, info.offsetTop + info.drawHeight);
    const imageScale = TransformUtils.scale(1 / this.texture.imageWidth, 1 / this.texture.imageHeight);
    TransformUtils.applySelf(imageTopLeft, imageScale);
    TransformUtils.applySelf(imageBottomRight, imageScale);
    node.drawRect(this.initRectangle.topLeft, this.initRectangle.bottomRight);
    node.drawTexture(this.texture, imageTopLeft, imageBottomRight);
  }
  dispose() {
    super.dispose();
    this.texture.dispose();
  }
}
class Background extends Box {
  constructor(initImage) {
    super({ size: Size.FillParentSize });
    this.isFading = false;
    const current = new MovableBackground();
    const next = new MovableBackground();
    this.add(next, current);
    this.backImage.isVisible = false;
    this.frontImage.setBackgroundImage(initImage ? initImage : BackgroundLoader$1.getBackground());
  }
  swap() {
    const temp = this.childrenList[0];
    this.childrenList[0] = this.childrenList[1];
    this.childrenList[1] = temp;
  }
  get frontImage() {
    return this.childrenList[1];
  }
  get backImage() {
    return this.childrenList[0];
  }
  updateBackground2(image2) {
    if (this.isFading)
      return;
    this.isFading = true;
    this.backImage.setBackgroundImage(image2);
    this.backImage.isVisible = true;
    this.backImage.setAlpha(1);
    this.frontImage.fadeOut(() => {
      this.frontImage.isVisible = false;
      this.isFading = false;
      this.swap();
    });
  }
  setTranslate(t) {
    for (let i = 0; i < this.childrenList.length; i++) {
      this.childrenList[i].setTranslate(t);
    }
  }
  getTranslate() {
    return Vector2.newZero();
  }
  onUpdate() {
    this.setTranslate(MouseState.position);
    super.onUpdate();
  }
  draw(renderer2) {
    if (this.isVisible) {
      this.backImage.draw(renderer2);
      this.frontImage.draw(renderer2);
    }
  }
}
class BackgroundBounce extends Box {
  constructor(backgroundImage) {
    super({
      size: Size.FillParentSize
    });
    this.add(this.background = new Background(backgroundImage));
  }
  in() {
    this.transform().delay(300).scaleTo(Vector(0.996), 500, easeOutQuint).delay(300).moveTo(Vector(0, 35), 500, easeOutQuint).delay(300).fadeTo(0.7, 500, easeOutQuint);
  }
  out() {
    this.transform().scaleTo(Vector(1), 500, easeOutQuint).moveTo(Vector2.newZero(), 500, easeOutQuint).fadeTo(1, 500, easeOutQuint);
  }
  updateBackground2(image2) {
    this.background.updateBackground2(image2);
  }
}
class VideoBackground extends Drawable {
  constructor(video) {
    super({
      size: Size.FillParentSize
    });
    this.video = video;
    this.videoSize = Vector();
    this.texture = TextureStore.create();
    this.setColor(Color.White);
  }
  setVideo(video) {
    this.video = video;
    this.videoSize.set(video.videoWidth, video.videoHeight);
  }
  onUpdate() {
    if (this.video) {
      this.texture.setTextureVideo(this.video);
    }
  }
  beforeCommit(node) {
    const shader = node.shader;
    shader.orth = Coordinate$1.orthographicProjectionMatrix4;
    shader.color = this.computeColor();
    shader.sampler2D = 0;
  }
  onDraw(node) {
    const topLeft = this.initRectangle.topLeft.copy();
    const bottomRight = this.initRectangle.bottomRight.copy();
    const videoSize = this.videoSize;
    if (!videoSize.isZero()) {
      const targetWidth = this.getHeight() * videoSize.x / videoSize.y;
      topLeft.set(
        (this.getWidth() - targetWidth) / 2,
        this.getPosition().y
      );
      bottomRight.set(
        topLeft.x + targetWidth,
        topLeft.y + this.getHeight()
      );
    }
    node.drawRect(topLeft, bottomRight);
    node.drawTexture(this.texture);
  }
  dispose() {
    super.dispose();
    this.texture.dispose();
  }
}
class ScreenManager {
  constructor() {
    this.screenMap = /* @__PURE__ */ new Map();
    this.currentScreen = null;
    this.currentId = createMutableStateFlow("");
    this.renderer = null;
  }
  init(renderer2) {
    this.renderer = renderer2;
    return this;
  }
  addScreen(id2, screenConstructor) {
    if (id2 === "") {
      throw Error("id cannot be empty");
    }
    this.screenMap.set(id2, screenConstructor);
    return this;
  }
  removeScreen(id2) {
    this.screenMap.delete(id2);
  }
  activeScreen(id2) {
    if (this.currentId.value === id2) {
      return;
    }
    const constructor = this.screenMap.get(id2);
    if (constructor) {
      if (this.currentScreen) {
        this.renderer.removeDrawable(this.currentScreen);
      }
      this.currentScreen = constructor();
      this.currentId.value = id2;
      this.renderer.addDrawable(this.currentScreen);
    }
  }
  dispose() {
    var _a2;
    (_a2 = this.currentScreen) == null ? void 0 : _a2.dispose();
    this.screenMap.clear();
  }
}
const ScreenManager$1 = new ScreenManager();
class BackgroundScreen extends Box {
  constructor() {
    super({
      size: Size.FillParentSize
    });
    this.leftSideCollector = (value) => {
      const translate = value ? new Vector2(40, 0) : Vector2.newZero();
      this.transform().moveTo(translate, 500, easeOutCubic);
    };
    this.rightSideCollector = (value) => {
      const translate = value ? new Vector2(-40, 0) : Vector2.newZero();
      this.transform().moveTo(translate, 500, easeOutCubic);
    };
    this.collector = (bg) => {
      this.setupVideoBackground(bg);
      this.setupImageBackground(bg);
    };
    this.background = new BackgroundBounce(OSUPlayer$1.background.value.image);
    this.videoBackground = new VideoBackground(null);
    this.addDisposable(() => {
      return collectLatest(OSUPlayer$1.background, this.collector);
    });
    this.add(
      this.background,
      this.videoBackground
    );
    ScreenManager$1.currentId.collect((screenId) => {
      this.isVisible = screenId !== "story";
      const bg = OSUPlayer$1.background.value;
      this.videoBackground.isVisible = !!bg.video && (screenId !== "main" && screenId !== "legacy" && UIState.beatmapBackground);
      if (screenId !== "main") {
        this.background.out();
      }
    });
    onLeftSide.collect(this.leftSideCollector);
    onRightSide.collect(this.rightSideCollector);
    this.addDisposable(() => {
      const scope2 = effectScope();
      scope2.run(() => {
        watch(BackgroundManager$1.currentLoader, (value) => {
          if (value === BackgroundManager$1.Default || value === BackgroundManager$1.Custom) {
            this.videoBackground.isVisible = false;
            this.background.updateBackground2(BackgroundManager$1.getBackground());
          } else if (value === BackgroundManager$1.Beatmap) {
            const bg = OSUPlayer$1.background.value;
            if (bg.video && !["main", "legacy"].includes(ScreenManager$1.currentId.value)) {
              this.videoBackground.isVisible = true;
              this.videoBackground.setVideo(bg.video);
            }
            this.background.updateBackground2(bg.image ?? BackgroundLoader$1.getBackground());
          }
          watch(BackgroundManager$1.customBackgroundChange, () => {
            this.background.updateBackground2(BackgroundManager$1.getBackground());
          });
        });
      });
      return scope2.stop;
    });
  }
  setupVideoBackground(bg) {
    if (bg.video) {
      !["main", "legacy"].includes(ScreenManager$1.currentId.value) && (this.videoBackground.isVisible = true);
      this.videoBackground.setVideo(bg.video);
    } else {
      this.videoBackground.isVisible = false;
    }
  }
  setupImageBackground(bg) {
    if (bg.image && BackgroundManager$1.currentLoader.value === BackgroundManager$1.Beatmap) {
      this.background.updateBackground2(bg.image);
    } else {
      this.background.updateBackground2(BackgroundManager$1.getBackground());
    }
  }
  get isVideoVisible() {
    return this.videoBackground.isVisible;
  }
  dispose() {
    super.dispose();
    onLeftSide.removeCollect(this.leftSideCollector);
    onRightSide.removeCollect(this.rightSideCollector);
  }
}
class AudioChannel {
  constructor() {
    this.left = new Float32Array(0);
    this.right = new Float32Array(0);
    this.buffer = new AudioBuffer({
      sampleRate: 48e3,
      length: 1
    });
    this.leftChannelVolume = 0;
    this.rightChannelVolume = 0;
    collect(OSUPlayer$1.onChanged, () => {
      const audioBuffer = AudioPlayerV2.getAudioBuffer();
      this.buffer = audioBuffer;
      if (audioBuffer.numberOfChannels >= 2) {
        this.left = audioBuffer.getChannelData(0);
        this.right = audioBuffer.getChannelData(1);
      } else {
        this.left = this.right = audioBuffer.getChannelData(0);
      }
    });
  }
  update(currentTime) {
    if (AudioPlayerV2.isPlaying()) {
      this.leftChannelVolume = calculateAmplitude(this.buffer.sampleRate, this.left, currentTime);
      this.rightChannelVolume = calculateAmplitude(this.buffer.sampleRate, this.right, currentTime);
    } else {
      this.leftChannelVolume = 0;
      this.rightChannelVolume = 0;
    }
  }
  leftVolume() {
    return this.leftChannelVolume;
  }
  rightVolume() {
    return this.rightChannelVolume;
  }
  maxVolume() {
    return Math.max(this.leftChannelVolume, this.rightChannelVolume);
  }
  get leftChannelData() {
    return this.left;
  }
  get rightChannelData() {
    return this.right;
  }
}
function calculateAmplitude(sampleRate, channelData, time) {
  const fromIndex = Math.min(Math.floor(time * (sampleRate / 1e3)), channelData.length), toIndex = Math.min(Math.floor((time + 1 / 60 * 1e3) * (sampleRate / 1e3)), channelData.length);
  let max = -1, min = 1, i = fromIndex;
  for (; i < toIndex; i++) {
    max = Math.max(channelData[i], max);
    min = Math.min(channelData[i], min);
  }
  return (max - min) / 2;
}
const AudioChannel$1 = new AudioChannel();
class OFile {
  constructor(fileSystemHandle, parent) {
    this.fileSystemHandle = fileSystemHandle;
    this.parent = parent;
    this.pathNames = [];
    this.parentNames = [];
    this.nativeFile = null;
    this.name = fileSystemHandle.name;
    this.isDirectory = fileSystemHandle.kind === "directory";
    this.isFile = fileSystemHandle.kind === "file";
    this.parentNames = [...(parent == null ? void 0 : parent.pathNames) ?? []];
    this.pathNames = [...this.parentNames, this.name];
  }
  equals(file) {
    return file.fileSystemHandle.isSameEntry(this.fileSystemHandle);
  }
  async listFiles(filter) {
    if (!(this.fileSystemHandle instanceof FileSystemDirectoryHandle)) {
      throw new Error("Not a directory");
    }
    const files = [];
    const entries = await this.fileSystemHandle.entries();
    for await (const entry of entries) {
      const f = new OFile(entry, this.parent);
      if ((filter == null ? void 0 : filter(f)) ?? true) {
        files.push(f);
      }
    }
    return files;
  }
  getPath() {
    return this.pathNames.join("/");
  }
  getParentPath() {
    return this.parentNames.join("/");
  }
  getParent() {
    return this.parent;
  }
  async getNativeFile() {
    if (this.nativeFile !== null) {
      return this.nativeFile;
    }
    if (this.fileSystemHandle instanceof FileSystemFileHandle) {
      return this.fileSystemHandle.getFile();
    }
    throw new Error("Not a file");
  }
  getNativeHandle() {
    return this.fileSystemHandle;
  }
  async length() {
    return (await this.getNativeFile()).size;
  }
  async lastModified() {
    return (await this.getNativeFile()).lastModified;
  }
}
class FileProvider {
  static init(file) {
    this.rootFile = new OFile(file, null);
  }
  static async getFileByPath(path, ignoreCase = false) {
    if (!path.startsWith("/")) {
      throw new Error("Path must start with /");
    }
    if (ignoreCase) {
      path = path.toLowerCase();
    }
    if (path.endsWith("/")) {
      path = path.substring(0, path.length - 1);
    }
    path = path.substring(1);
    const pathNames = path.split("/");
    let startFile = this.rootFile.getNativeHandle();
    let currentOFile = this.rootFile;
    for (let i = 0; i < pathNames.length; i++) {
      if (startFile instanceof FileSystemDirectoryHandle) {
        startFile = await startFile.getDirectoryHandle(pathNames[i]);
        currentOFile = new OFile(startFile, currentOFile);
      } else {
        throw new Error(`Not File with path=${path}`);
      }
    }
    return currentOFile;
  }
}
class Resource {
  static async init() {
    try {
      const handle = await window.showDirectoryPicker();
      FileProvider.init(handle);
      this.Background = await FileProvider.getFileByPath("/Background");
      this.Beatmap = await FileProvider.getFileByPath("/Beatmap");
      return true;
    } catch (e) {
      return false;
    }
  }
}
const logo = "" + new URL("logo-76d27be1.png", import.meta.url).href;
const cursor = "" + new URL("cursor-40b79df2.png", import.meta.url).href;
const backIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAABsElEQVRYw+2XMW7CQBBFAdEgDAWUUCJOkMStTwFXwJzABYgoBZzAnMIdSIhjADcAyQ1ISQfdSxF7hbC9XjvyRpGYdv7+2Zn5O7tbKj3tHxhlTBw89vgA+OzxcDAp/568w4ITSXZiQSc/eQuXG2l2w6WVh37ABVW7MMhGXmX5sMstNhY9DAx6WNhsH7JbUlWlr7G6W+hjY8TiDOyg7T+2oqa2+7VYcmVKXYquM+Uq8GuFLO6K42MqZWze5bFMAw8FdKcuQDrsxLqhDNjmLHbfzSSLrsjiTDsZ5oram5llbYpeuMmJhsKb5DqYEyHq+OIyF+VJVA4zZhJFhWWax7krHAP3SEIPSEKMAoYjlbgahgk2pfQATgKiKYoc7SFO4Nqk0n/ykpjDJnELeIFrnEr/Kmn0OEB5UdchcFlS+i/epEqyAtwh6gqPWF9CH2MP2H543KIBwvY0stBHAjRCqfxBgMJLpNpkM2+TVWUqDSGTqfpBk4SQHbQso2KSZ1SoD7uPXMNOeVy/5xzXGi6cwq9MDZd+4c8WDQ8vDU/Hwh+/Gp7vGj4gWr5QGj6BWr6xT9Ng32riAijeSkHUAAAAAElFTkSuQmCC";
const approachCircle = "" + new URL("approachcircle-0459bffe.png", import.meta.url).href;
const star = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAV/SURBVHgB7d2Bdds2EAbg310gzgRlJqg9QZkJ6kxQZYK6E1SZoMkESSaIN7A7QbqB2AmUTnA5hNSzrIgKQYLQ8fB/7+HJ0fOLKQI84AgQAoiIiIiIiIiIiIiI/BKRlZYbUJm08u9DAZVHK/5KHtUo1E8o1+3ez+wGSqJXfCVPbbVcokClRoD64N+h8m9BZdCrfSPf24L861K/PjXIty7168OU0LMjg7/io0Bpg8D1gN9hSuhRd/VvB0SAolLCkiJAjTbd+xGmhB7J8dSvzwbkh1bojcSrQT5oZd5JPKaEHsiw1K9PBedKGASuMd4KtGwSN/g75D4ldB0BtPJW+lJhvFD5K9AyTbz6dzgYXCKtuFrSqeGU5y5ghXT+glMXcEja9C313bznFxcXX+CM1wiwRnou5we8RoBw9VdIK1z9L7xFAXcRQKanfn1CSuhurYDHLuAPzOd3kF2JU78iUkJvEWCF+c0ZYbJzMwicKfU7xtVg0FMEyDVAc7VkzFMEmCP16/NFI8BzOOAiAsyY+vW5FCcbS3jpAs6RnrkYDJrtAuRxOVaFx6s7vP588P4lhi33nkMYCDbd6678d+T9xuqgMVsDkHZlTSgVnlZoeO/Zkfc9OmwYRxsL2jFGlgYzugHsVeiuUvdfnx15n+I1eNow/t/7udn9jjaWBiNFNQCt9E/6coXzhl3q12h50PLn0AgS2wAqfQlLpCqQRY2WlzERISoL6P7jay13IGv+0XId2x1Ep4EhtGh5pT++A1nxTuukHjNwHH0fQP9YuB36BnRub7q6GGVyGtjdhXsPyi1c7WGw9wETJLkPoI0gZAYhQ6hAOTRaXmnl/4uJkt0IYoaQTYPIkf4pyeYCugN6qWVyq6Re4dxep6r8IOlkUDgwLSFNZIaQ3ke0V37SW8SzzAYyQ0gujPRXc8wPzDoZpOOC0BD+Bk0RRvpvMZPZZwO7hRMhTeTcQZxwtYeR/gNmlGU6mBlCtAYJR/qnZFkRtJchNKAfCSP9LJUfZFsSxomkQcKETrbKD7KuCdybSGKG8L3REzpTnGVRqH7INdgI9k2a0JnirItCOZGUZkJnirOvCi54IqlBogmdKUwsCy8wTWyQebDXx8SDIYVNJCWf0JnCzJNBhUwkzTKh4452CWvxZw0aTk/YrfhxlhRv8eT0d/wthenKt/50MGcQZ2a9AdRYvhqGmX08PJC8u37MxfRuImYjgLR3CCssX9hNpIJRlruAK/hRwyjLDaCGH7/CKMsN4Bf4UcMok4NAaXcf2cIXk983YDUC1PCnhkFsAPnUMMhqA/DU/++Y/ExWxwACn8yNA8xFAPH9rd3m7m1Y7AI83QA6xAYwwG/wy9xnMzcG0C4g5P9ep4HNTQyZigDdBJDnNQCX3Wc0w1oXkPPkfHsoQ8tr5H1otYYh1hrADfIIK49fhI0XuqdywpL0j8jD4z2ONCTN172f8nAqzQzz9hmOIccXWy1Pd/LnspWIxZnSrkjeyHwq0FN6Um5kHu+lnV2MPZ7QID/IPFYwwtIYoEZau502Xo+5/do9qbRCu6lFg7Q83+waR6+Kz5JGVLiPOL6U3cJn0CM9IZeSxicZEe4jjjNlt8BnHnZk+pc+byTjJJK045WNTFODWjL+YdAQ7tc4k+64tzLObJs/Lo6ejHuJF8J9hTOT8d3CPaglcVfRRgyGT4nvFrwteh1Hhvf/38K9GB88SVx3VqN0MmwfgHALt8JCyPBugfsG6Em4O3GCNku+SqTd32Bz4vNx19SeE7SIcD+U9HcLZY8D9ARcHTkpiwr3Q0l/t1ChVPJ0C5jNksP9UEe6hRVK1V0RrsL9UPLYLZS7Va5++Lclh8CuW1iDiIiIiIiIiIiIiIiIiIiIKKGvmG5znrTvqA4AAAAASUVORK5CYII=";
const whiteRound = "" + new URL("white_round-9623cbb6.png", import.meta.url).href;
const ripple = "" + new URL("ripple_new-d127df79.png", import.meta.url).href;
const legacyLogo = "" + new URL("legacy_logo-21c56fce.png", import.meta.url).href;
const stdNoteCircle = "" + new URL("hitcircleoverlay-8d1effa1.png", import.meta.url).href;
const bar = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAEACAYAAACphba6AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADjSURBVHgB7dDRDYIwFEDRpxPoBm7iCDoKGzCKbsIouAEj1DYh0Q9FUPrluckjhIR3mkZMlFLa5WnzdHn69GgYvzV5DrG08tO4YG6X2dB4qiEtr/zTfFrept9rp06+Vs2rO//mWt5Vdh2egWtav67s3oxSH3Xab/PjHPVqCnCKeh3LFQ35ZRd1uhUgRcW2UTkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFE5AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPDnwB1NyOqG0K354gAAAABJRU5ErkJggg==";
const borderBar = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAEACAYAAACphba6AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEiSURBVHgB7dzRTcMwFAXQ107QERihGzACKzBCNghMAiswQdkkI2QE40iRCK5J3JaKn3OlVzWJ42O/5DsRK0kpHXL1uU65hvSdcT7X5XqISzPdNE/QmrdmaF7VmC7PdE+3NXmfbk+/tvJaPlPR6/z/mOs5/Xwuy3S1npdt2d7y7y0dlwuaBr1XBhyjMfOOSuS0XP36FtuQWosPtQtDXJl0/mq/7PP5p2Lca1yfj+L4MSq9a+59mUq7h930uxy0y4kbUs63jzsHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEDcOQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMC/Amcf1P7reAab+QIlDA12vUxxDgAAAABJRU5ErkJggg==";
const square = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAQSURBVHgBAQUA+v8A/////wn7A/2j0UkKAAAAAElFTkSuQmCC";
const maniaNote1 = "" + new URL("mania-note1@2x-dfbf9db6.png", import.meta.url).href;
const maniaKey2 = "" + new URL("mania-key2@2x-24e4d9fb.png", import.meta.url).href;
const ImageResourceMap = [
  {
    name: "Logo",
    url: logo
  },
  {
    name: "Ripple",
    url: ripple
  },
  {
    name: "LegacyLogo",
    url: legacyLogo
  },
  {
    name: "Cursor",
    url: cursor
  },
  {
    name: "ApproachCircle",
    url: approachCircle
  },
  {
    name: "StdNoteCircle",
    url: stdNoteCircle
  },
  {
    name: "BackIcon",
    url: backIcon
  },
  {
    name: "WhiteRound",
    url: whiteRound
  },
  {
    name: "Star",
    url: star
  },
  {
    name: "Bar",
    url: bar
  },
  {
    name: "BorderBar",
    url: borderBar
  },
  {
    name: "Square",
    url: square
  },
  {
    name: "ManiaNote1",
    url: maniaNote1
  },
  {
    name: "ManiaKey2",
    url: maniaKey2
  }
];
const Images = {};
async function loadImage() {
  for (const imageSrc of ImageResourceMap) {
    const image2 = new Image();
    image2.src = imageSrc.url;
    await image2.decode();
    Images[imageSrc.name] = image2;
  }
}
class WebGLRenderer {
  constructor(gl) {
    this.currentBoundedShader = null;
    this.currentBoundedVertexBuffer = null;
    this.currentBoundedIndexBuffer = null;
    this.currentBoundedVertexArray = null;
    this.currentBoundedTexture = null;
    this.drawables = [];
    this.disposables = [];
    this.isViewportChanged = false;
    this.onDispose = null;
    this.currentBlend = Blend.Normal;
    this.gl = gl;
    console.log(Coordinate$1.resolution);
    console.log(Coordinate$1.nativeWidth * window.devicePixelRatio, Coordinate$1.nativeHeight * window.devicePixelRatio);
    gl.viewport(0, 0, Coordinate$1.nativeWidth * window.devicePixelRatio, Coordinate$1.nativeHeight * window.devicePixelRatio);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);
    const maxVertexAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
    console.log("Max vertex attributes: " + maxVertexAttribs);
    const maxVertexUniformVectors = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
    console.log("Max vertex uniform vectors: " + maxVertexUniformVectors);
    const maxVertexAttribStride = gl.getParameter(gl.MAX_ELEMENTS_VERTICES);
    console.log("Max elements vertices : " + maxVertexAttribStride);
    Coordinate$1.onWindowResize = () => {
      this.isViewportChanged = true;
    };
  }
  setBlend(blend) {
    if (this.currentBlend === blend) {
      return;
    }
    const gl = this.gl;
    if (blend === Blend.Normal) {
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    } else if (blend === Blend.Additive) {
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_CONSTANT_ALPHA);
    }
    this.currentBlend = blend;
  }
  bindShader(shader) {
    if (this.currentBoundedShader !== shader) {
      shader.bind();
      this.currentBoundedShader = shader;
    }
  }
  unbindShader(shader) {
    if (this.currentBoundedShader === shader) {
      shader.unbind();
      this.currentBoundedShader = null;
    }
  }
  bindVertexArray(va) {
    if (this.currentBoundedVertexArray !== va) {
      va.bind();
      this.currentBoundedVertexArray = va;
    }
  }
  unbindVertexArray(va) {
    if (this.currentBoundedVertexArray === va) {
      va.unbind();
      this.currentBoundedVertexArray = null;
    }
  }
  bindVertexBuffer(vb) {
    if (this.currentBoundedVertexBuffer !== vb) {
      vb.bind();
      this.currentBoundedVertexBuffer = vb;
    }
  }
  unbindVertexBuffer(vb) {
    if (this.currentBoundedVertexBuffer === vb) {
      vb.unbind();
      this.currentBoundedVertexBuffer = null;
    }
  }
  bindTexture(texture, unit = 0) {
    if (this.currentBoundedTexture !== texture) {
      texture.bind(unit);
      this.currentBoundedTexture = texture;
    }
  }
  unbindTexture(texture) {
    if (this.currentBoundedTexture === texture) {
      texture.unbind();
      this.currentBoundedTexture = null;
    }
  }
  bindIndexBuffer(ib) {
    if (this.currentBoundedIndexBuffer !== ib) {
      ib.bind();
      this.currentBoundedIndexBuffer = ib;
    }
  }
  unbindIndexBuffer(ib) {
    if (this.currentBoundedIndexBuffer === ib) {
      ib.unbind();
      this.currentBoundedIndexBuffer = null;
    }
  }
  disposeBounded() {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j;
    (_a2 = this.currentBoundedTexture) == null ? void 0 : _a2.unbind();
    (_b = this.currentBoundedShader) == null ? void 0 : _b.dispose();
    (_c = this.currentBoundedShader) == null ? void 0 : _c.unbind();
    (_d = this.currentBoundedShader) == null ? void 0 : _d.dispose();
    (_e = this.currentBoundedVertexArray) == null ? void 0 : _e.unbind();
    (_f = this.currentBoundedVertexArray) == null ? void 0 : _f.dispose();
    (_g = this.currentBoundedVertexBuffer) == null ? void 0 : _g.unbind();
    (_h = this.currentBoundedVertexBuffer) == null ? void 0 : _h.dispose();
    (_i = this.currentBoundedIndexBuffer) == null ? void 0 : _i.unbind();
    (_j = this.currentBoundedIndexBuffer) == null ? void 0 : _j.dispose();
  }
  // private onClick(which: number) {
  //   if (!this.isEventReady) return
  //   for (let i = 0; i < this.drawables.length; i++) {
  //     this.drawables[i].click(which, MouseState.position)
  //   }
  // }
  //
  // private onMouseDown(which: number) {
  //   if (!this.isEventReady) return
  //   for (let i = 0; i < this.drawables.length; i++) {
  //     this.drawables[i].mouseDown(which, MouseState.position)
  //   }
  // }
  // private onMouseMove() {
  //   if (!this.isEventReady) return
  //   for (let i = 0; i < this.drawables.length; i++) {
  //     this.drawables[i].mouseMove(MouseState.position)
  //   }
  // }
  //
  // private onMouseUp(which: number) {
  //   if (!this.isEventReady) return
  //   for (let i = 0; i < this.drawables.length; i++) {
  //     this.drawables[i].mouseUp(which, MouseState.position)
  //   }
  // }
  addDrawable(drawable) {
    this.drawables.push(drawable);
    drawable.load(this);
    this.disposables.push(drawable);
  }
  removeDrawable(drawable) {
    let index = this.drawables.indexOf(drawable);
    this.drawables.splice(index, 1);
    index = this.disposables.indexOf(drawable);
    this.disposables.splice(index, 1);
    drawable.dispose();
  }
  render() {
    const gl = this.gl;
    if (this.isViewportChanged) {
      this.isViewportChanged = false;
      gl.viewport(0, 0, Coordinate$1.nativeWidth * window.devicePixelRatio, Coordinate$1.nativeHeight * window.devicePixelRatio);
      console.log(Coordinate$1.resolution);
      console.log(Coordinate$1.nativeWidth * window.devicePixelRatio, Coordinate$1.nativeHeight * window.devicePixelRatio);
      for (let i = 0; i < this.drawables.length; i++) {
        this.drawables[i].onWindowResize();
      }
    }
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    for (let i = 0; i < this.drawables.length; i++) {
      const drawable = this.drawables[i];
      drawable.update();
      drawable.draw(this);
    }
  }
  dispose() {
    var _a2;
    for (let i = 0; i < this.disposables.length; i++) {
      this.disposables[i].dispose();
    }
    this.disposeBounded();
    (_a2 = this.onDispose) == null ? void 0 : _a2.call(this);
    this.onDispose = null;
  }
}
const canvas = new OffscreenCanvas(480, 480);
const context = canvas.getContext("2d");
function genTexture(gl, size2, draw) {
  function resize(size22) {
    canvas.width = size22.x;
    canvas.height = size22.y;
  }
  resize(size2);
  const op = { resize };
  draw(context, op);
  return new Texture(gl, canvas);
}
function drawCanvas(size2, draw) {
  function resize(size22) {
    canvas.width = size22.x;
    canvas.height = size22.y;
  }
  resize(size2);
  const op = { resize };
  draw(context, op);
  return canvas;
}
class RoundVisualizer extends Drawable {
  constructor(config2) {
    super(config2);
    this.barCountPerRound = 220;
    this.maxSpectrumHeight = 160;
    this.scaleFactor = 160 / (450 / 2 * 0.9);
    this.innerRadius = 236;
    this.centerOfDrawable = Vector();
    this.simpleSpectrum = new Array(this.barCountPerRound);
    this.lastTime = 0;
    this.updateOffsetTime = 0;
    this.indexOffset = 0;
    this.indexChange = ~~Math.round(this.barCountPerRound / 40);
    this.targetSpectrum = new Array(this.barCountPerRound).fill(0);
    this.spectrumShape = [
      1.5,
      2,
      2.7,
      2.1,
      1.4,
      1.1,
      1,
      1,
      1,
      1,
      ...new Array(this.barCountPerRound - 10).fill(1)
    ];
    if (config2.innerRadius) {
      this.innerRadius = config2.innerRadius;
    }
    this.visualizer = AudioPlayerV2.getVisualizer();
    this.maxSpectrumHeight = this.innerRadius * this.scaleFactor;
    this.setColor(Color.White);
  }
  onLoad(renderer2) {
    const node = this.drawNode;
    node.vertexBuffer = new QuadBuffer(renderer2, this.barCountPerRound * 5, renderer2.gl.STREAM_DRAW);
    node.blend = Blend.Additive;
    node.apply();
    this.centerOfDrawable = Vector2Utils.middle(this.initRectangle.topLeft, this.initRectangle.bottomRight);
    this.setScaleX(-1);
  }
  onInvalidate() {
    this.centerOfDrawable = Vector2Utils.middle(this.initRectangle.topLeft, this.initRectangle.bottomRight);
  }
  onUpdate() {
    super.onUpdate();
    this.getSpectrum(Time.currentTime, BeatState.isKiai ? 1 : 0.5);
  }
  getSpectrum(timestamp, barScale) {
    if (this.lastTime === 0 || this.updateOffsetTime === 0) {
      this.lastTime = timestamp;
      this.updateOffsetTime = timestamp;
    }
    const fftData = this.visualizer.getFFT();
    for (let i = 0; i < fftData.length; i++) {
      this.simpleSpectrum[i] = fftData[i] / 255;
    }
    const c = this.barCountPerRound;
    for (let i = 0; i < c; i++) {
      const targetIndex = (i + this.indexOffset) % c;
      const target = this.simpleSpectrum[targetIndex];
      if (target > this.targetSpectrum[i]) {
        this.targetSpectrum[i] = target * this.spectrumShape[targetIndex] * (0.5 + barScale);
      }
    }
    if (timestamp - this.updateOffsetTime >= 50) {
      this.updateOffsetTime = timestamp;
      this.indexOffset = (this.indexOffset - this.indexChange) % c;
    }
    const decayFactor = (timestamp - this.lastTime) * 24e-4;
    for (let i = 0; i < c; i++) {
      this.targetSpectrum[i] -= decayFactor * (this.targetSpectrum[i] + 0.03);
      if (this.targetSpectrum[i] < 0) {
        this.targetSpectrum[i] = 0;
      }
    }
    this.lastTime = timestamp;
  }
  beforeCommit(node) {
    const shader = node.shader;
    shader.orth = Coordinate$1.orthographicProjectionMatrix4;
    shader.color = this.computeColor(BeatState.isKiai ? 0.14 + BeatState.currentBeat * 0.1 : 0.14);
    shader.sampler2D = 0;
  }
  onDraw(node) {
    const centerX = 0, centerY = 0;
    const spectrum = this.targetSpectrum;
    const length = this.barCountPerRound;
    const innerRadius = this.innerRadius;
    const lineWidth = innerRadius / 2 * Math.sin(
      degreeToRadian(360 / length)
    ) * 2;
    const half = lineWidth / 2;
    let k = 0;
    const texture = TextureStore.get("Square");
    const maxSpectrumHeight = this.maxSpectrumHeight;
    for (let j = 0; j < 5; j++) {
      for (let i = 0; i < length; i++) {
        const degree = i / length * 360 + j * 360 / 5;
        const value = innerRadius + spectrum[i] * maxSpectrumHeight;
        const fromX = centerX;
        const fromY = centerY + innerRadius;
        const toX = centerX;
        const toY = centerY + value;
        const point1 = new Vector2(fromX - half, fromY);
        const point2 = new Vector2(fromX + half, fromY);
        const point3 = new Vector2(toX - half, toY);
        const point4 = new Vector2(toX + half, toY);
        const matrix3 = Matrix3.newIdentify();
        TransformUtils2.rotateFromLeft(matrix3, degree);
        TransformUtils2.translateFromLeft(matrix3, this.centerOfDrawable);
        TransformUtils.applySelf(point1, matrix3);
        TransformUtils.applySelf(point2, matrix3);
        TransformUtils.applySelf(point3, matrix3);
        TransformUtils.applySelf(point4, matrix3);
        node.drawQuad(point1, point2, point3, point4, void 0, k);
        node.drawTexture(texture, void 0, void 0, k);
        k++;
      }
    }
  }
}
class LogoTriangles extends Drawable {
  constructor(config2) {
    super(config2);
    this.particles = [];
    this.startColor = Color.fromHex(16743863);
    this.endColor = Color.fromHex(14572437);
    this.MAX_SIZE = 300;
    this.MIN_SIZE = 20;
    this.light = 0;
    this.lightTransition = new ObjectTransition(this, "light");
    this.velocityIncrement = 0;
    this.velocityTransition = new ObjectTransition(this, "velocityIncrement");
    this.circleInfo = new Float32Array(3);
    this.isInitialed = false;
    for (let i = 0; i < 32; i++) {
      const triangle = new TriangleParticle(this);
      this.particles.push(triangle);
    }
  }
  lightBegin(atTime = Time.currentTime) {
    this.lightTransition.setStartTime(atTime);
    return this.lightTransition;
  }
  velocityBegin(atTime = Time.currentTime) {
    this.velocityTransition.setStartTime(atTime);
    return this.velocityTransition;
  }
  onUpdate() {
    super.onUpdate();
    this.lightTransition.update(Time.currentTime);
    this.velocityTransition.update(Time.currentTime);
    this.initParticles();
    this.updateParticles();
  }
  /**
   * todo: 解决高帧率下的移动速度过快
   * @private
   */
  updateParticles() {
    for (let i = 0; i < this.particles.length; i++) {
      const triangle = this.particles[i];
      if (triangle.isFinish()) {
        triangle.size = Interpolation.valueAt(Math.random(), this.MIN_SIZE, this.MAX_SIZE);
        const { x, y } = this.initRectangle.topLeft;
        triangle.position = new Vector2(
          Interpolation.valueAt(Math.random(), x, x + this.getWidth()),
          y + this.getHeight() + triangle.size
        );
        triangle.color = Interpolation.colorAt(Math.random(), this.startColor, this.endColor);
      } else {
        const size2 = triangle.size;
        triangle.position.y -= 3.33333334 / Time.elapsed + size2 / 400 + this.velocityIncrement * (size2 / 400);
      }
      triangle.update();
    }
  }
  onLoad(renderer2) {
    super.onLoad(renderer2);
    this.MAX_SIZE = this.initRectangle.getWidth() * 0.7;
    this.MIN_SIZE = this.MAX_SIZE * 0.066667;
    const node = this.drawNode;
    node.shader = Shaders.RoundClip;
    node.vertexBuffer = new BasicVertexBuffer(
      renderer2,
      this.particles.length * 3,
      6,
      renderer2.gl.STREAM_DRAW
    );
    node.apply();
  }
  initParticles() {
    if (this.isInitialed)
      return;
    this.isInitialed = true;
    for (let i = 0; i < this.particles.length; i++) {
      const triangle = this.particles[i];
      triangle.size = Interpolation.valueAt(Math.random(), this.MIN_SIZE, this.MAX_SIZE);
      const { x, y } = this.initRectangle.topLeft;
      triangle.position.set(
        Interpolation.valueAt(Math.random(), x, x + this.getWidth()),
        Interpolation.valueAt(Math.random(), y, y + this.getHeight())
      );
      triangle.color = Interpolation.colorAt(Math.random(), this.startColor, this.endColor);
      triangle.update();
    }
  }
  onTransformApplied() {
    super.onTransformApplied();
    const topLeft = this.rectangle.topLeft;
    const bottomRight = this.rectangle.bottomRight;
    const size2 = bottomRight.minus(topLeft);
    const radius = Math.min(size2.x, size2.y) / 2;
    const center = topLeft.add(size2.divValue(2));
    const minLength = Math.min(Coordinate$1.size.x, Coordinate$1.size.y);
    this.circleInfo[0] = center.x / minLength;
    this.circleInfo[1] = center.y / minLength;
    this.circleInfo[2] = radius / minLength;
    const alpha = this.appliedColor.alpha;
    const particles = this.particles;
    for (let i = 0; i < particles.length; i++) {
      particles[i].color.alpha = alpha;
    }
  }
  beforeCommit(node) {
    const shader = node.shader;
    shader.orth = Coordinate$1.orthographicProjectionMatrix4;
    shader.circle = this.circleInfo;
    shader.light = this.light;
    shader.resolution = Coordinate$1.resolution;
  }
  onDraw(node) {
    const startColor = this.startColor;
    startColor.alpha = this.appliedColor.alpha;
    const position = this.initRectangle.topLeft;
    node.drawTriangle(
      position,
      Vector(position.x, position.y + this.getHeight()),
      this.initRectangle.bottomRight,
      startColor,
      0
    );
    node.drawTriangle(
      position,
      Vector(position.x + this.getWidth(), position.y),
      this.initRectangle.bottomRight,
      startColor,
      1
    );
    const particles = this.particles;
    for (let i = 0; i < particles.length; i++) {
      const particle = this.particles[i];
      node.drawTriangle(
        particle.top,
        particle.bottomLeft,
        particle.bottomRight,
        particle.color,
        i + 2
      );
    }
  }
  dispose() {
    super.dispose();
    this.drawNode.vertexBuffer.dispose();
  }
}
class TriangleParticle {
  constructor(parent) {
    this.parent = parent;
    this.top = Vector2.newZero();
    this.bottomLeft = Vector2.newZero();
    this.bottomRight = Vector2.newZero();
    this.position = Vector2.newZero();
    this.size = 0;
    this.color = Color.fromHex(16743863);
    this.cos30 = Math.sqrt(3) / 2;
    this.sin30 = 0.5;
  }
  isFinish() {
    return this.bottomLeft.y <= this.parent.initRectangle.topLeft.y;
  }
  update() {
    const position = this.position;
    const size2 = this.size;
    this.top.set(
      position.x,
      position.y - size2
    );
    this.bottomLeft.set(
      position.x - size2 * this.cos30,
      position.y + size2 * this.sin30
    );
    this.bottomRight.set(
      position.x + size2 * this.cos30,
      position.y + size2 * this.sin30
    );
  }
}
class BeatBox extends Box {
  constructor(config2) {
    super(config2);
    BeatDispatcher.register(this);
  }
  dispose() {
    super.dispose();
    BeatDispatcher.unregister(this);
  }
}
class ImageDrawable extends Drawable {
  constructor(texture, config2) {
    var _a2;
    super(config2);
    this.texture = texture;
    this.setColor(config2.color ?? Color.White);
    this.setAlpha(((_a2 = config2.color) == null ? void 0 : _a2.alpha) ?? 1);
  }
  onLoad(renderer2) {
    super.onLoad(renderer2);
    this.drawNode.blend = this.config.blend ?? Blend.Normal;
  }
  beforeCommit(node) {
    const shader = node.shader;
    shader.orth = Coordinate$1.orthographicProjectionMatrix4;
    shader.color = this.computeColor();
    shader.sampler2D = 0;
  }
  onDraw(node) {
    node.drawRect(this.initRectangle.topLeft, this.initRectangle.bottomRight);
    if (this.texture instanceof Texture) {
      node.drawTexture(this.texture);
    } else {
      node.drawTexture(this.texture, this.texture.texTopLeft, this.texture.texBottomRight);
    }
  }
}
class BeatDrawable extends Drawable {
  constructor(config2) {
    super(config2);
    BeatDispatcher.register(this);
  }
  dispose() {
    super.dispose();
    BeatDispatcher.unregister(this);
  }
}
class DynamicQuadBuffer extends BasicVertexBuffer {
  constructor(renderer2, stride = 4) {
    super(renderer2, 0, stride, renderer2.gl.STREAM_DRAW);
    QuadIndexBuffer$1.init(renderer2);
    this.amountIndices = 0;
    this.isIndexBufferSet = true;
  }
  setVertex(data) {
    var _a2;
    this.size = ~~(data.length / this.stride);
    this.amountIndices = this.toElements(this.size);
    QuadIndexBuffer$1.tryExtendTo(this.amountIndices);
    (_a2 = this.buffer) == null ? void 0 : _a2.setBufferData(data);
  }
  bind() {
    super.bind();
    QuadIndexBuffer$1.bind();
  }
  unbind() {
    super.unbind();
    QuadIndexBuffer$1.unbind();
  }
  toElements(vertices) {
    return ~~(3 * vertices / 2);
  }
  toElementIndex(vertexIndex) {
    return ~~(3 * vertexIndex / 2);
  }
}
class Ripples extends BeatDrawable {
  constructor() {
    super(...arguments);
    this.ripples = [];
    this.drawNode = new class extends DrawNode {
      apply() {
        this.bufferData = [];
      }
    }(this);
  }
  onLoad(renderer2) {
    super.onLoad(renderer2);
    this.drawNode.vertexBuffer = new DynamicQuadBuffer(renderer2, 5);
    this.drawNode.shader = Shaders.AlphaTexture;
    this.drawNode.blend = Blend.Additive;
    this.drawNode.apply();
  }
  onNewBeat(isKiai, newBeatTimestamp, gap) {
    if (!BeatBooster$1.isAvailable) {
      return;
    }
    let ripple2;
    const ripples = this.ripples;
    if (ripples.length === 0) {
      ripple2 = new Ripple(this);
      ripples.unshift(ripple2);
      ripple2.start();
    } else {
      ripple2 = ripples[ripples.length - 1];
      if (ripple2.isEnd()) {
        ripples.pop();
        ripples.unshift(ripple2);
        ripple2.reset();
      } else {
        ripple2 = new Ripple(this);
        ripples.unshift(ripple2);
      }
    }
    ripple2.start();
  }
  onUpdate() {
    super.onUpdate();
    const ripples = this.ripples;
    if (ripples.length === 0) {
      return;
    }
    for (let i = 0; i < ripples.length; i++) {
      const ripple2 = ripples[i];
      ripple2.update();
    }
  }
  beforeCommit(node) {
    const shader = node.shader;
    shader.orth = Coordinate$1.orthographicProjectionMatrix4;
    shader.sampler2D = 0;
  }
  onDraw(node) {
    const ripples = this.ripples;
    if (ripples.length === 0) {
      return;
    }
    const texture = TextureStore.get("Ripple");
    const center = Vector2Utils.middle(this.initRectangle.topLeft, this.initRectangle.bottomRight);
    let ripple2;
    for (let i = 0; i < ripples.length; i++) {
      ripple2 = ripples[i];
      const currentRadius = ripple2.innerRadius + ripple2.currentThickWidth;
      node.drawRect(
        center.minusValue(currentRadius),
        center.addValue(currentRadius),
        void 0,
        i
      );
      node.drawTexture(texture, void 0, void 0, i);
      node.drawOne(
        this.computeColor(ripple2.alpha).alpha,
        DrawNode.VERTEX_PER_QUAD,
        4,
        i
      );
    }
  }
  dispose() {
    super.dispose();
    this.drawNode.vertexBuffer.dispose();
  }
}
class Ripple {
  constructor(parent) {
    this.currentThickWidth = 1;
    this.defaultAlpha = 0.045;
    this.transition = new ObjectTransition(this, "currentThickWidth");
    this.alpha = this.defaultAlpha;
    this.alphaTransition = new ObjectTransition(this, "alpha");
    this.movementDuration = 1e3;
    this.innerRadius = parent.getWidth() / 2;
    this.maxThickWidth = parent.config.maxThickWidth ?? this.innerRadius * 0.6;
    this.movementDuration = parent.config.duration ?? 1e3;
    this.defaultAlpha = parent.config.defaultRippleAlpha ?? 0.045;
    this.currentThickWidth = 0;
  }
  reset() {
    this.currentThickWidth = 0;
    this.alpha = this.defaultAlpha;
  }
  start() {
    this.startTransition().transitionTo(this.maxThickWidth, this.movementDuration, easeOut);
    this.alphaBegin().transitionTo(0, this.movementDuration, easeInQuart);
  }
  isEnd() {
    return this.transition.isEnd;
  }
  update() {
    this.transition.update(Time.currentTime);
    this.alphaTransition.update(Time.currentTime);
  }
  startTransition(startTime = Time.currentTime) {
    this.transition.setStartTime(startTime);
    return this.transition;
  }
  alphaBegin(startTime = Time.currentTime) {
    this.alphaTransition.setStartTime(startTime);
    return this.alphaTransition;
  }
}
class BeatLogo extends BeatBox {
  constructor(config2) {
    super(config2);
    const logo2 = new ImageDrawable(TextureStore.get("Logo"), {
      size: config2.size,
      anchor: Anchor.Center
    });
    const triangles = new LogoTriangles({
      size: Size.of(config2.size.x * 0.9, config2.size.y * 0.9),
      anchor: Anchor.Center
    });
    this.logo = logo2;
    this.triangles = triangles;
    this.add(
      triangles,
      logo2
    );
  }
  onNewBeat(isKiai, newBeatTimestamp, gap) {
    if (!BeatState.isAvailable) {
      return;
    }
    const volume = AudioPlayerV2.isPlaying() ? AudioChannel$1.maxVolume() + 0.4 : 0;
    const adjust = Math.min(volume, 1);
    this.transform().scaleTo(Vector(1 - adjust * 0.02), 60, easeOut).scaleTo(Vector(1), gap * 2, easeOutQuint);
    this.triangles.velocityBegin().transitionTo(1 + adjust + (BeatState.isKiai ? 4 : 0), 60, easeOut).transitionTo(0, gap * 2, easeOutQuint);
    if (BeatState.isKiai) {
      this.triangles.lightBegin().transitionTo(0.2, 60, easeOut).transitionTo(0, gap * 2, easeOutQuint);
    }
  }
}
class LogoBeatBox extends Box {
  constructor(config2) {
    super(config2);
    this.beatLogo = new BeatLogo(config2);
    this.add(this.beatLogo);
  }
  onUpdate() {
    super.onUpdate();
    if (AudioPlayerV2.isPlaying()) {
      const scale = this.getScale();
      const adjust = AudioPlayerV2.isPlaying() ? AudioChannel$1.maxVolume() - 0.4 : 0;
      const a = Interpolation.damp(
        scale.x,
        1 - Math.max(0, adjust) * 0.04,
        0.94,
        Time.elapsed
      );
      scale.x = a;
      scale.y = a;
      this.setScale(scale);
    }
  }
}
let LogoAmpBox$1 = class LogoAmpBox extends Box {
  constructor(config2) {
    super(config2);
    this.logoHoverable = false;
    this.scope = effectScope();
    this.enableMouseEvent();
    this.visualizer = new RoundVisualizer({
      size: Size.FillParentSize,
      innerRadius: Math.min(config2.size.x, config2.size.y) / 2 * 0.9,
      anchor: Anchor.Center
    });
    const ripple2 = new Ripples({
      size: Size.of(config2.size.x * 0.98, config2.size.y * 0.98),
      anchor: Anchor.Center,
      maxThickWidth: 5,
      duration: 180,
      defaultRippleAlpha: 0.06
    });
    this.logoBeatBox = new LogoBeatBox({
      size: config2.size,
      anchor: Anchor.Center
    });
    this.add(
      this.visualizer,
      ripple2,
      this.logoBeatBox
    );
    this.scope.run(() => {
      watch(() => UIState.logoHover, (val) => this.logoHoverable = val, { immediate: true });
    });
  }
  onHover() {
    if (!this.logoHoverable) {
      return true;
    }
    this.transform().scaleTo(new Vector2(1.1, 1.1), 500, easeOutElastic);
    const menu = inject("Menu");
    menu.onLogoHover();
    return true;
  }
  onHoverLost() {
    if (!this.logoHoverable) {
      return true;
    }
    this.transform().scaleTo(Vector2.one, 500, easeOutElastic);
    const menu = inject("Menu");
    menu.onLogoHoverLost();
    return true;
  }
  onMouseDown(which) {
    this.transform().scaleTo(Vector(0.9), 1e3, easeOut);
    const menu = inject("Menu");
    menu.onLogoPress();
    return true;
  }
  onMouseUp(which) {
    this.transform().scaleTo(Vector(1), 500, easeOutElastic);
    const menu = inject("Menu");
    menu.onLogoRelease();
    return true;
  }
  dispose() {
    super.dispose();
    this.scope.stop();
  }
};
let LogoBounceBox$1 = class LogoBounceBox extends Box {
  constructor(config2) {
    super(config2);
    this.isDraggable = true;
    this.scope = effectScope();
    this.flag = false;
    this.startPosition = Vector2.newZero();
    this.enableMouseEvent();
    this.logoAmpBox = new LogoAmpBox$1(config2);
    this.add(this.logoAmpBox);
    this.scope.run(() => {
      watch(() => UIState.logoDrag, (value) => {
        this.isDraggable = value;
      }, { immediate: true });
    });
  }
  onDrag(which) {
    if (!this.isDraggable) {
      return true;
    }
    const position = MouseState.position;
    if (!this.flag) {
      this.flag = true;
      this.startPosition.x = MouseState.position.x;
      this.startPosition.y = MouseState.position.y;
    }
    let translateX = position.x - this.startPosition.x;
    let translateY = position.y - this.startPosition.y;
    translateX = Math.sqrt(Math.abs(translateX)) * (translateX < 0 ? -1 : 1);
    translateY = Math.sqrt(Math.abs(translateY)) * (translateY < 0 ? -1 : 1);
    this.setTranslate(Vector(translateX, translateY));
    return true;
  }
  onDragLost(which) {
    if (!this.isDraggable) {
      return true;
    }
    this.flag = false;
    this.transform().moveTo(new Vector2(0, 0), 600, easeOutElastic);
    return true;
  }
  dispose() {
    super.dispose();
    this.scope.stop();
  }
};
class BeatLogoBox extends Box {
  constructor(config2) {
    super(config2);
    this.flag = true;
    this.enableMouseEvent();
    this.logoBounceBox = new LogoBounceBox$1(config2);
    this.add(this.logoBounceBox);
  }
  onClick(which) {
    const menu = inject("Menu");
    const bg = inject("BackgroundBounce");
    const topBar = inject("TopBar");
    const transition = this.transform();
    if (this.flag) {
      transition.moveTo(new Vector2(-480, 0), 400, easeInCubic).scaleTo(new Vector2(0.5, 0.5), 400, easeInCubic);
      menu.show();
      bg.in();
      topBar.transform().delay(300).moveYTo(0, 500, easeOutQuint);
    } else {
      transition.moveTo(Vector2.zero, 400, easeOutCubic).scaleTo(Vector2.one, 400, easeOutCubic);
      menu.hide();
      bg.out();
      topBar.transform().moveYTo(-36, 500, easeOutQuint);
    }
    const v = this.flag;
    onEnterMenu.emit(v);
    this.flag = !this.flag;
    return true;
  }
}
class RowBox extends Box {
  constructor(config2) {
    super(config2);
    this.leftChildren = [];
    this.centerChildren = [];
    this.rightChildren = [];
    this.space = config2.space ?? 0;
  }
  onLoad(renderer2) {
    super.onLoad(renderer2);
    this.invalidate(Invalidation.Layout);
  }
  add(...children) {
    super.add(...children);
    this.categoryChildren(children);
    this.invalidate(Invalidation.Layout);
  }
  addFirst(...children) {
    TODO("method addFirst() not implemented");
  }
  setWidth(w) {
    super.setWidth(w);
    this.invalidate(Invalidation.Layout);
  }
  setHeight(h2) {
    super.setHeight(h2);
    this.invalidate(Invalidation.Layout);
  }
  setSize(width, height) {
    super.setSize(width, height);
    this.invalidate(Invalidation.Layout);
  }
  categoryChildren(children) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const anchorX = Axis.getXAxis(child.anchorValue);
      if (anchorX === Axis.X_LEFT) {
        this.leftChildren.push(child);
      } else if (anchorX === Axis.X_CENTER) {
        this.centerChildren.push(child);
      } else {
        this.rightChildren.push(child);
      }
    }
  }
  updateLayout() {
    this.layoutLeftChildren();
    this.layoutCenterChildren();
    this.layoutRightChildren();
  }
  layoutLeftChildren() {
    const position = this.initRectangle.topLeft.copy();
    const leftChildren = this.leftChildren;
    for (let i = 0; i < leftChildren.length; i++) {
      const child = leftChildren[i];
      child.initRectangle.setTopLeft(position.x, position.y);
      position.x += child.rectangle.getWidth() + this.space;
    }
  }
  layoutCenterChildren() {
    const position = Vector(0, this.initRectangle.topLeft.y);
    let width = 0;
    const centerChildren = this.centerChildren;
    for (let i = 0; i < centerChildren.length; i++) {
      width += centerChildren[i].rectangle.getWidth();
    }
    const space = this.space;
    width += centerChildren.length * space;
    position.x = this.getPosition().x + this.getWidth() / 2 - width / 2;
    for (let i = 0; i < centerChildren.length; i++) {
      const child = centerChildren[i];
      child.initRectangle.setTopLeft(position.x, position.y);
      position.x += child.rectangle.getWidth() + space;
    }
  }
  layoutRightChildren() {
    const position = Vector(this.getPosition().x + this.getWidth(), this.initRectangle.topLeft.y);
    const rightChildren = this.rightChildren;
    for (let i = rightChildren.length - 1; i >= 0; i--) {
      const child = rightChildren[i];
      const width = child.rectangle.getWidth();
      position.x -= width;
      child.initRectangle.setTopLeft(position.x, position.y);
      position.x -= this.space;
    }
  }
  updateSizeByChildren(toParent = false) {
    var _a2, _b;
    const autoSize = this.config.autoSize;
    if (!autoSize)
      return false;
    const children = this.childrenList;
    let width = 0, maxHeight = -1;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      width += child.rectangle.getWidth();
      maxHeight = Math.max(child.rectangle.getHeight(), maxHeight);
    }
    width += (children.length - 1) * this.space;
    if (Axes.hasX(autoSize))
      this.setWidth(width);
    if (Axes.hasY(autoSize))
      this.setHeight(maxHeight);
    toParent && ((_a2 = this.parent) == null ? void 0 : _a2.updateSizeByChildren());
    (_b = this.parent) == null ? void 0 : _b.invalidate(Invalidation.Layout, InvalidationSource.Child);
    this.invalidate(Invalidation.Layout);
    return true;
  }
}
class Menu extends Box {
  constructor() {
    super({
      size: Size.of(Size.FillParent, 96),
      anchor: Anchor.Center
    });
    this.add(
      new ImageDrawable(TextureStore.get("Square"), {
        size: Size.FillParentSize,
        color: Color.fromHex(3289650)
      }),
      this.leftButtonGroup = new Box({
        size: Size.of(304, Size.FillParent),
        anchor: Anchor.CenterLeft,
        children: [
          new MenuButton({
            size: Size.of(120, 96),
            backgroundAnchor: Anchor.CenterRight,
            backgroundOrigin: Anchor.CenterRight,
            anchor: Anchor.CenterRight,
            color: Color.fromHex(5592405),
            icon: "Icon-Settings",
            sound: Sound.ButtonSelect,
            onClick() {
              VueUI.settings = true;
            }
          })
        ]
      }),
      new Box({
        size: Size.of(784, Size.FillParent),
        anchor: Anchor.CenterRight,
        children: [
          this.rightButtonGroup = new RowBox({
            size: Size.FillParentSize,
            anchor: Anchor.CenterLeft,
            autoSize: Axes.X,
            children: [
              new MenuButton({
                size: Size.of(120, 96),
                backgroundAnchor: Anchor.CenterLeft,
                backgroundOrigin: Anchor.CenterLeft,
                color: Color.fromHex(6702284),
                icon: "Icon-PlayArrow",
                sound: Sound.DefaultSelect,
                onClick() {
                  ScreenManager$1.activeScreen("second");
                }
              }),
              new MenuButton({
                size: Size.of(120, 96),
                backgroundAnchor: Anchor.CenterLeft,
                backgroundOrigin: Anchor.CenterLeft,
                color: Color.fromHex(6597993),
                icon: "Icon-RadioButtonUnchecked",
                sound: Sound.DefaultSelect,
                onClick() {
                  ScreenManager$1.activeScreen("story");
                }
              })
            ]
          })
        ]
      })
    );
    this.setAlpha(0);
    this.setScale(new Vector2(1, 0));
    this.isVisible = false;
  }
  show() {
    this.isVisible = true;
    this.transform().delay(300).fadeTo(1, 220, easeInCubic).delay(300).scaleYTo(1, 400, easeOutBack);
  }
  hide() {
    this.transform().fadeTo(0, 220, easeOutCubic).scaleYTo(0, 220, easeOutCubic);
    setTimeout(() => {
      this.isVisible = false;
    }, 220);
  }
  onLogoHover() {
    if (this.isVisible) {
      this.leftButtonGroup.transform().moveXTo(-12, 500, easeOutElastic);
      this.rightButtonGroup.transform().moveXTo(12, 500, easeOutElastic);
    }
  }
  onLogoHoverLost() {
    if (this.isVisible) {
      this.leftButtonGroup.transform().moveXTo(0, 500, easeOutElastic);
      this.rightButtonGroup.transform().moveXTo(0, 500, easeOutElastic);
    }
  }
  onLogoPress() {
    if (this.isVisible) {
      this.leftButtonGroup.transform().moveXTo(12, 1e3, easeOut);
      this.rightButtonGroup.transform().moveXTo(-12, 1e3, easeOut);
    }
  }
  onLogoRelease() {
    if (this.isVisible) {
      this.leftButtonGroup.transform().moveXTo(0, 500, easeOutElastic);
      this.rightButtonGroup.transform().moveXTo(0, 500, easeOutElastic);
    }
  }
}
class MenuButton extends BeatBox {
  constructor(config2) {
    super({
      ...config2,
      autoSize: Axes.X
    });
    this.isBeat = false;
    const atlas = TextureStore.getAtlas("Icons-Atlas");
    this.add(
      new MenuButtonBackground(config2.color, config2.sound, {
        size: config2.size,
        origin: config2.backgroundOrigin,
        anchor: config2.backgroundAnchor
      }),
      this.icon = new ImageDrawable(atlas.getRegin(config2.icon), {
        size: Size.of(36),
        anchor: Anchor.Center
      })
    );
  }
  onLoad(renderer2) {
    super.onLoad(renderer2);
    this.enableMouseEvent();
  }
  onClick(which) {
    this.config.onClick();
    console.log(this);
    return true;
  }
  onHover() {
    this.isBeat = true;
    return true;
  }
  onHoverLost() {
    this.isBeat = false;
    return true;
  }
  onNewBeat(isKiai, newBeatTimestamp, gap) {
    if (this.isPresent && this.isBeat) {
      this.icon.transform().scaleTo(Vector(0.9), 60, easeOutCubic).scaleTo(Vector(1), gap * 2, easeOutQuint);
    }
  }
}
class MenuButtonBackground extends Drawable {
  constructor(originColor, sound, config2) {
    super(config2);
    this.originColor = originColor;
    this.sound = sound;
    this.pressColor = new Color(
      Math.min(this.originColor.red * 1.2, 1),
      Math.min(this.originColor.green * 1.2, 1),
      Math.min(this.originColor.blue * 1.2, 1),
      1
    );
    this.activeColor = new Color(
      Math.min(this.originColor.red * 2, 1),
      Math.min(this.originColor.green * 2, 1),
      Math.min(this.originColor.blue * 2, 1),
      1
    );
    this.transform().colorTo(originColor, 0).skewXTo(-0.2, 0);
  }
  onLoad(renderer2) {
    super.onLoad(renderer2);
    this.enableMouseEvent();
  }
  onMouseDown(which) {
    this.transform().colorTo(this.pressColor, 300);
    return true;
  }
  onMouseUp(which) {
    this.transform().colorTo(this.activeColor, 30).colorTo(this.originColor, 400, easeOutQuint);
    playSound(this.sound);
    return true;
  }
  onHover() {
    this.transform().scaleXTo(1.4, 500, easeOutElastic);
    playSound(Sound.ButtonHover);
    return true;
  }
  onHoverLost() {
    this.transform().scaleXTo(1, 500, easeOutElastic);
    return true;
  }
  beforeCommit(node) {
    const shader = node.shader;
    shader.orth = Coordinate$1.orthographicProjectionMatrix4;
    shader.color = this.appliedColor;
    shader.sampler2D = 0;
  }
  onDraw(node, renderer2) {
    node.drawRect(this.initRectangle.topLeft, this.initRectangle.bottomRight);
    node.drawTexture(TextureStore.get("Square"));
  }
}
class SideFlashlight extends BeatBox {
  constructor(color, width) {
    super({
      size: Size.FillParentSize
    });
    const w = width ?? Coordinate$1.width * 0.2;
    const texture = TextureStore.get("Gradiant");
    const left = new ImageDrawable(texture, {
      size: Size.of(w, Size.FillParent),
      anchor: Anchor.TopLeft,
      blend: Blend.Additive,
      color
    });
    const right = new ImageDrawable(texture, {
      size: Size.of(w, Size.FillParent),
      anchor: Anchor.TopRight,
      blend: Blend.Additive,
      color
    });
    right.setScaleX(-1);
    left.setAlpha(0);
    right.setAlpha(0);
    this.add(left, right);
    this.left = left;
    this.right = right;
  }
  onNewBeat(isKiai, newBeatTimestamp, gap) {
    if (!this.isAvailable)
      return;
    if (!BeatState.isAvailable)
      return;
    let leftAdjust = AudioChannel$1.leftVolume(), rightAdjust = AudioChannel$1.rightVolume();
    let left = 0, right = 0;
    const lightTimeFunc = easeInQuad;
    const beatLength = gap;
    if (BeatState.isKiai) {
      if ((BeatState.beatIndex & 1) === 0) {
        left = 0.54 * leftAdjust;
        this.left.transform().fadeTo(left, 60).fadeTo(0, beatLength, lightTimeFunc);
      } else {
        right = 0.54 * rightAdjust;
        this.right.transform().fadeTo(right, 60).fadeTo(0, beatLength, lightTimeFunc);
      }
    } else {
      if ((BeatState.beatIndex & 3) === 0 && BeatState.beatIndex != 0) {
        left = 0.3 * leftAdjust;
        right = 0.3 * rightAdjust;
        this.left.transform().fadeTo(left, 60).fadeTo(0, beatLength, lightTimeFunc);
        this.right.transform().fadeTo(right, 60).fadeTo(0, beatLength, lightTimeFunc);
      }
    }
  }
}
class Stack {
  constructor() {
    this.arr = [];
  }
  push(e) {
    this.arr.push(e);
  }
  pop() {
    if (this.arr.length === 0) {
      return null;
    }
    return this.arr.pop() ?? null;
  }
  peek() {
    if (this.arr.length)
      return this.arr[this.arr.length - 1];
    return null;
  }
  size() {
    return this.arr.length;
  }
}
class OSUPanelStack {
  static push(panel) {
    this.stack.push(panel);
    playSound(Sound.WavePopIn);
    this.onPanelPushed.fire(panel);
    this.panelZIndex.value++;
  }
  static pop() {
    const stack = this.stack;
    const panel = stack.pop();
    if (panel) {
      playSound(Sound.WavePopOut);
      this.onPanelPopped.fire(panel);
      this.panelZIndex.value--;
    }
    if (stack.size() === 0) {
      this.onAllPanelsPopped.fire();
    }
  }
}
OSUPanelStack.stack = new Stack();
OSUPanelStack.panelZIndex = ref(401);
OSUPanelStack.onPanelPushed = new SingleEvent();
OSUPanelStack.onPanelPopped = new SingleEvent();
OSUPanelStack.onAllPanelsPopped = new SingleEvent();
class TopBar extends Box {
  constructor() {
    super({
      size: Size.of(Size.FillParent, 36)
    });
    this.enableMouseEvent();
    this.shadow = new TopBarShadow();
    this.shadow.setAlpha(0);
    const atlas = TextureStore.getAtlas("Icons-Atlas");
    this.add(
      new ImageDrawable(TextureStore.get("Square"), {
        size: Size.of(Size.FillParent, 36),
        color: Color.fromHex(1644825)
      }),
      new RowBox({
        size: Size.of(Size.FillParent, 36),
        children: [
          new TopBarButton(atlas.getRegin("Icon-Settings"), Anchor.TopLeft).setOnClick(() => {
            VueUI.settings = true;
          }),
          new TopBarButton(atlas.getRegin("Icon-Help"), Anchor.TopLeft).setOnClick(() => {
            OSUPanelStack.push({ name: "help" });
          }),
          new TopBarButton(atlas.getRegin("Icon-Help"), Anchor.TopLeft).setOnClick(() => {
            OSUPanelStack.push({ name: "test" });
          }),
          new TopBarButton(atlas.getRegin("Icon-MusicNote"), Anchor.TopRight).setOnClick(() => {
            VueUI.miniPlayer = true;
          }),
          new TopBarButton(atlas.getRegin("Icon-Folder"), Anchor.TopRight).setOnClick(() => {
            OSUPanelStack.push({ name: "beatmapList" });
          }),
          new TopBarButton(atlas.getRegin("Icon-Fullscreen"), Anchor.TopRight),
          new TopBarButton(atlas.getRegin("Icon-RadioButtonUnchecked"), Anchor.TopRight).setOnClick(() => {
            OSUPanelStack.push({ name: "beatmapDetails" });
          }),
          new TopBarButton(atlas.getRegin("Icon-Notifications"), Anchor.TopRight).setOnClick(() => {
            VueUI.notification = true;
          })
        ]
      }),
      this.shadow
    );
  }
  onHover() {
    this.shadow.transform().fadeTo(1, 300);
    return true;
  }
  onHoverLost() {
    this.shadow.transform().fadeTo(0, 300);
    return true;
  }
}
class TopBarButton extends Box {
  constructor(textureRegin, anchor) {
    super({
      size: Size.of(36),
      anchor
    });
    this.enableMouseEvent();
    this.add(
      new ButtonBackground(),
      new ImageDrawable(textureRegin, {
        size: Size.of(20),
        anchor: Anchor.Center,
        color: Color.White.copy()
      })
    );
  }
}
class ButtonBackground extends ImageDrawable {
  constructor() {
    super(TextureStore.get("Square"), {
      size: Size.of(36),
      color: Color.White.copy()
    });
    this.enableMouseEvent();
    this.setAlpha(0);
  }
  onMouseDown(which) {
    this.transform().fadeTo(0.4, 40);
    return true;
  }
  onMouseUp(which) {
    this.transform().fadeTo(0.8, 45).fadeTo(0.25, 400, easeOutQuint);
    playSound(Sound.ButtonSelect);
    return true;
  }
  onHover() {
    this.transform().fadeTo(0.25, 200);
    playSound(Sound.ButtonHover);
    return true;
  }
  onHoverLost() {
    this.transform().fadeTo(0, 200);
    return true;
  }
}
class TopBarShadow extends Drawable {
  constructor() {
    super({
      size: Size.of(Size.FillParent, 120),
      anchor: Anchor.TopCenter,
      offset: Vector(0, 36)
    });
    this.setColor(Color.Black);
  }
  beforeCommit(node) {
    const shader = node.shader;
    shader.orth = Coordinate$1.orthographicProjectionMatrix4;
    shader.sampler2D = 0;
    shader.color = this.computeColor();
  }
  onDraw(node) {
    node.drawRect(
      this.initRectangle.topLeft,
      this.initRectangle.bottomRight
    );
    node.drawTexture(
      TextureStore.get("VerticalGradiant"),
      Vector(0, 0),
      Vector(1, 1)
    );
  }
}
class MainScreen extends Box {
  constructor() {
    super({
      size: Size.FillParentSize
    });
    this.leftSideCollector = (value) => {
      const translate = value ? new Vector2(40, 0) : Vector2.newZero();
      this.transform().moveTo(translate, 500, easeOutCubic);
    };
    this.rightSideCollector = (value) => {
      const translate = value ? new Vector2(-40, 0) : Vector2.newZero();
      this.transform().moveTo(translate, 500, easeOutCubic);
    };
    this.scope = effectScope();
    const menu = new Menu();
    const beatLogo = new BeatLogoBox({
      size: Size.of(460),
      anchor: Anchor.Center
    });
    const flashlight = new SideFlashlight(
      Color.fromHex(37119),
      Coordinate$1.width / 5
    );
    const topBar = new TopBar();
    topBar.setTranslate(Vector(0, -36));
    this.add(
      menu,
      flashlight,
      beatLogo,
      // smoke,
      topBar
    );
    onLeftSide.collect(this.leftSideCollector);
    onRightSide.collect(this.rightSideCollector);
  }
  dispose() {
    super.dispose();
    onLeftSide.removeCollect(this.leftSideCollector);
    onRightSide.removeCollect(this.rightSideCollector);
    this.scope.stop();
  }
}
class FadeLogo extends BeatBox {
  constructor(config2) {
    super({ size: Size.FillParentSize });
    this.logo = new ImageDrawable(TextureStore.get("Logo"), {
      ...config2,
      blend: Blend.Additive
    });
    this.logo.setAlpha(0.3);
    this.add(this.logo);
  }
  onNewBeat(isKiai, newBeatTimestamp, gap) {
    this.logo.transform().fadeTo(0.3, 60, easeOut).fadeTo(0.1, gap * 2, easeOutQuint);
  }
}
class SongPlayScreen extends Box {
  constructor() {
    super({
      size: Size.FillParentSize,
      children: [
        new FadeLogo({
          size: Size.of(180, 180),
          anchor: Anchor.Center
        }),
        new Box({
          size: Size.of(56, 56),
          anchor: Anchor.BottomLeft,
          autoSize: Axes.X,
          children: [
            new ImageDrawable(TextureStore.get("Square"), {
              size: Size.of(56),
              anchor: Anchor.CenterLeft,
              origin: Anchor.CenterLeft,
              color: Color.fromRGB(236, 72, 153)
            }).apply((bg) => {
              bg.enableMouseEvent();
              bg.setOnHover(() => {
                playSound(Sound.DefaultHover);
                bg.transform().scaleXTo(1.5, 500, easeOutElastic);
              });
              bg.setOnHoverLost(() => {
                bg.transform().scaleXTo(1, 500, easeOutElastic);
              });
              bg.setOnClick(() => {
                playSound(Sound.DefaultSelect);
                setTimeout(() => {
                  ScreenManager$1.activeScreen("main");
                }, 100);
              });
            }),
            new ImageDrawable(TextureStore.getAtlas("Icons-Atlas").getRegin("Icon-KeyboardArrowLeft"), {
              size: Size.of(24, 24),
              anchor: Anchor.Center
            }).apply((icon) => {
              icon.addDisposable(() => {
                const onBeat = {
                  onNewBeat(isKiai, newBeatTimestamp, gap) {
                    icon.transform().scaleTo(Vector(0.9), 60, easeOut).scaleTo(Vector(1), gap * 2, easeOutQuint);
                  }
                };
                BeatDispatcher.register(onBeat);
                return () => {
                  BeatDispatcher.unregister(onBeat);
                };
              });
            })
          ]
        }),
        new LogoBounceBox$1({
          size: Size.of(200, 200),
          anchor: Anchor.BottomRight,
          offset: Vector(16, 34)
        })
      ]
    });
  }
}
class TestScreen extends Box {
  constructor() {
    super({
      size: Size.FillParentSize,
      children: [
        new StdNote().apply((it) => {
          it.setTranslate(Vector(100, 100));
        }),
        new StdNote().apply((it) => {
          it.setTranslate(Vector(180, 100));
        }),
        new StdNote().apply((it) => {
          it.setTranslate(Vector(260, 100));
        }),
        new StdNote().apply((it) => {
          it.setTranslate(Vector(340, 100));
        })
      ]
    });
  }
}
class StdNote extends Box {
  constructor() {
    super({
      size: Size.of(64),
      children: [
        new ImageDrawable(TextureStore.get("WhiteRound"), {
          size: Size.FillParentSize,
          color: Color.fromHex(37119)
        }).apply((it) => {
          it.setScale(Vector(0.9));
        }),
        new ImageDrawable(TextureStore.get("StdNoteCircle"), {
          size: Size.FillParentSize
        })
      ]
    });
  }
}
class LegacyLogo extends Drawable {
  constructor(config2) {
    super(config2);
    this.brightness = 0;
    this.brightnessTransition = new ObjectTransition(this, "brightness");
    this.setColor(Color.White);
  }
  onLoad(renderer2) {
    super.onLoad(renderer2);
    const node = this.drawNode;
    node.shader = Shaders.BrightnessTexture;
    node.apply();
  }
  brightnessBegin(atTime = Time.currentTime) {
    this.brightnessTransition.setStartTime(atTime);
    return this.brightnessTransition;
  }
  onUpdate() {
    super.onUpdate();
    this.brightnessTransition.update(Time.currentTime);
  }
  beforeCommit(node) {
    const shader = node.shader;
    shader.orth = Coordinate$1.orthographicProjectionMatrix4;
    shader.sampler2D = 0;
    shader.alpha = this.computeColor().alpha;
    shader.brightness = this.brightness;
  }
  onDraw(node) {
    node.drawRect(
      this.initRectangle.topLeft,
      this.initRectangle.bottomRight
    );
    node.drawTexture(TextureStore.get("LegacyLogo"));
  }
}
class LegacyRoundVisualizer extends Drawable {
  constructor(config2) {
    super(config2);
    this.innerRadius = 236;
    this.drawNode = new LegacyVisualizerDrawNode(this);
    this.centerOfDrawable = Vector();
    this.simpleSpectrum = new Array(200);
    this.lastTime = 0;
    this.updateOffsetTime = 0;
    this.indexOffset = 0;
    this.indexChange = 5;
    this.targetSpectrum = new Array(200).fill(0);
    this.spectrumShape = [
      1.5,
      2,
      2.7,
      2.1,
      1.4,
      1.1,
      1,
      1,
      1,
      1,
      ...new Array(190).fill(1)
    ];
    if (config2.innerRadius) {
      this.innerRadius = config2.innerRadius;
    }
    this.barTexture = TextureStore.get("Bar");
    this.borderBarTexture = TextureStore.get("BorderBar");
    this.visualizer = AudioPlayerV2.getVisualizer();
  }
  onLoad(renderer2) {
    super.onLoad(renderer2);
    const node = this.drawNode;
    node.blend = Blend.Additive;
    node.vertexBuffer = new QuadBuffer(renderer2, 200 * 5 * 2, renderer2.gl.STREAM_DRAW, 5);
    node.shader = Shaders.LegacyVisualizer;
    node.useTexture(
      { texture: this.barTexture, unit: 5 },
      { texture: this.borderBarTexture, unit: 6 }
    );
    node.apply();
    this.setScale(Vector(-1, 1));
  }
  onUpdate() {
    super.onUpdate();
    this.getSpectrum(Time.currentTime, BeatState.isKiai ? 1 : 0.5);
  }
  getSpectrum(timestamp, barScale) {
    if (this.lastTime === 0 || this.updateOffsetTime === 0) {
      this.lastTime = timestamp;
      this.updateOffsetTime = timestamp;
    }
    const fftData = this.visualizer.getFFT();
    for (let i = 0; i < fftData.length; i++) {
      this.simpleSpectrum[i] = fftData[i] / 255;
    }
    for (let i = 0; i < 200; i++) {
      const targetIndex = (i + this.indexOffset) % 200;
      const target = this.simpleSpectrum[targetIndex];
      if (target > this.targetSpectrum[i]) {
        this.targetSpectrum[i] = target * this.spectrumShape[targetIndex] * (0.5 + barScale);
      }
    }
    if (timestamp - this.updateOffsetTime >= 50) {
      this.updateOffsetTime = timestamp;
      this.indexOffset = (this.indexOffset - this.indexChange) % 200;
    }
    const decayFactor = (timestamp - this.lastTime) * 24e-4;
    for (let i = 0; i < 200; i++) {
      this.targetSpectrum[i] -= decayFactor * (this.targetSpectrum[i] + 0.03);
      if (this.targetSpectrum[i] < 0) {
        this.targetSpectrum[i] = 0;
      }
    }
    this.lastTime = timestamp;
  }
  beforeCommit(node) {
    const shader = node.shader;
    shader.orth = Coordinate$1.orthographicProjectionMatrix4;
    shader.alpha = this.computeColor(BeatState.isKiai ? 0.14 + BeatState.currentBeat * 0.1 : 0.14).alpha;
    shader.sampler2D1 = 5;
    shader.sampler2D2 = 6;
  }
  onDraw(node) {
    Vector2Utils.middleTo(this.initRectangle.topLeft, this.initRectangle.bottomRight, this.centerOfDrawable);
    const centerX = 0, centerY = 0;
    const spectrum = this.targetSpectrum;
    const length = 200;
    const innerRadius = this.innerRadius;
    const lineWidth = innerRadius / 2 * Math.sin(
      degreeToRadian(360 / length)
    ) * 2;
    const half = lineWidth / 2;
    let k = 0;
    const barMatrix = Matrix3.newIdentify();
    for (let j = 0; j < 5; j++) {
      for (let i = 0; i < length; i++) {
        const degree = i / 200 * 360 + j * 360 / 5;
        const value = innerRadius + spectrum[i] * 160;
        const fromX = centerX;
        const fromY = centerY + innerRadius;
        const toX = centerX;
        const toY = centerY + value;
        let point1 = new Vector2(fromX - half, fromY);
        let point2 = new Vector2(fromX + half, fromY);
        let point3 = new Vector2(toX - half, toY);
        let point4 = new Vector2(toX + half, toY);
        barMatrix.setFrom(Matrix3.identify);
        TransformUtils2.rotateFromLeft(barMatrix, degree);
        TransformUtils2.translateFromLeft(barMatrix, this.centerOfDrawable);
        TransformUtils.applySelf(point1, barMatrix);
        TransformUtils.applySelf(point2, barMatrix);
        TransformUtils.applySelf(point3, barMatrix);
        TransformUtils.applySelf(point4, barMatrix);
        node.drawQuad(point1, point2, point3, point4, void 0, k);
        node.drawTexture(this.barTexture, Vector(0, 1), Vector(1, 0), k);
        node.drawOne(0, 4, 4, k);
        k++;
      }
    }
    for (let j = 0; j < 5; j++) {
      for (let i = 0; i < length; i++) {
        const degree = i / 200 * 360 + j * 360 / 5 + 1.8;
        const value = innerRadius + spectrum[i] * 80;
        const fromX = centerX;
        const fromY = centerY + innerRadius;
        const toX = centerX;
        const toY = centerY + value;
        let point1 = new Vector2(fromX - half, fromY);
        let point2 = new Vector2(fromX + half, fromY);
        let point3 = new Vector2(toX - half, toY);
        let point4 = new Vector2(toX + half, toY);
        barMatrix.setFrom(Matrix3.identify);
        TransformUtils2.rotateFromLeft(barMatrix, degree);
        TransformUtils2.translateFromLeft(barMatrix, this.centerOfDrawable);
        TransformUtils.applySelf(point1, barMatrix);
        TransformUtils.applySelf(point2, barMatrix);
        TransformUtils.applySelf(point3, barMatrix);
        TransformUtils.applySelf(point4, barMatrix);
        node.drawQuad(point1, point2, point3, point4, void 0, k);
        node.drawTexture(this.borderBarTexture, Vector(0, 1), Vector(1, 0), k);
        node.drawOne(1, 4, 4, k);
        k++;
      }
    }
  }
  dispose() {
    super.dispose();
    this.drawNode.vertexBuffer.dispose();
  }
}
class LegacyVisualizerDrawNode extends DrawNode {
  constructor() {
    super(...arguments);
    this.textures = [];
  }
  useTexture(...textures) {
    this.textures.push(...textures);
  }
  draw(renderer2) {
    this.source.onDraw(this, renderer2);
    this.shader.bind();
    const textures = this.textures;
    for (let i = 0; i < textures.length; i++) {
      const texture = textures[i];
      renderer2.bindTexture(texture.texture, texture.unit);
    }
    this.vertexBuffer.bind();
    const data = this.bufferData;
    this.vertexBuffer.setVertex(
      data instanceof Float32Array ? data : new Float32Array(data)
    );
    renderer2.setBlend(this.blend);
    this.source.beforeCommit(this);
    this.shader.use();
    this.vertexBuffer.draw();
    this.shader.unbind();
    this.vertexBuffer.unbind();
    for (let i = 0; i < textures.length; i++) {
      const texture = textures[i];
      renderer2.unbindTexture(texture.texture);
    }
  }
}
class LegacyBeatLogo extends BeatBox {
  constructor(config2) {
    super(config2);
    const logo2 = new LegacyLogo({
      size: config2.size,
      anchor: Anchor.Center
    });
    this.logo = logo2;
    this.add(logo2);
  }
  onNewBeat(isKiai, newBeatTimestamp, gap) {
    if (!BeatState.isAvailable) {
      return;
    }
    const volume = AudioPlayerV2.isPlaying() ? AudioChannel$1.maxVolume() + 0.4 : 0;
    const adjust = Math.min(volume + 0.4, 1);
    this.logo.transform().scaleTo(Vector(1 - adjust * 0.02), 60, easeOut).scaleTo(Vector(1), gap * 2, easeOutQuint);
    if (BeatState.isKiai) {
      this.logo.brightnessBegin().transitionTo(0.05).transitionTo(0, 60, easeOut).transitionTo(0.05, gap * 2, easeOutQuint);
    } else {
      this.logo.brightnessBegin().transitionTo(0);
    }
  }
}
class LegacyFadeBeatLogo extends BeatBox {
  constructor(config2) {
    super(config2);
    const logo2 = new LegacyLogo({
      size: config2.size,
      anchor: Anchor.Center
    });
    this.logo = logo2;
    this.logo.setAlpha(0.08);
    this.add(logo2);
  }
  onNewBeat(isKiai, newBeatTimestamp, gap) {
    if (!BeatState.isAvailable) {
      return;
    }
    const volume = AudioPlayerV2.isPlaying() ? AudioChannel$1.maxVolume() + 0.4 : 0;
    const adjust = Math.min(volume, 1);
    this.logo.transform().scaleTo(Vector(1 + adjust * 0.02), 60, easeOut).scaleTo(Vector(1), gap * 2, easeOutQuint);
  }
}
class LegacyLogoBeatBox extends Box {
  constructor(config2) {
    super(config2);
    this.beatLogo = new LegacyBeatLogo(config2);
    this.add(this.beatLogo);
  }
  onUpdate() {
    super.onUpdate();
    if (AudioPlayerV2.isPlaying()) {
      const scale = this.getScale();
      const adjust = AudioPlayerV2.isPlaying() ? AudioChannel$1.maxVolume() - 0.4 : 0;
      const a = Interpolation.damp(scale.x, 1 - Math.max(0, adjust) * 0.04, 0.94, Time.elapsed);
      scale.x = a;
      scale.y = a;
      this.setScale(scale);
    }
  }
}
class LegacyFadeLogoBeatBox extends Box {
  constructor(config2) {
    super(config2);
    this.beatLogo = new LegacyFadeBeatLogo(config2);
    this.add(this.beatLogo);
  }
  onUpdate() {
    super.onUpdate();
    if (AudioPlayerV2.isPlaying()) {
      const scale = this.getScale();
      const adjust = AudioPlayerV2.isPlaying() ? AudioChannel$1.maxVolume() - 0.4 : 0;
      const a = Interpolation.damp(2 - scale.x, 1 - Math.max(0, adjust) * 0.04, 0.94, Time.elapsed);
      scale.x = (2 - a) * 0.99;
      scale.y = (2 - a) * 0.99;
      this.setScale(scale);
    }
  }
}
class LogoAmpBox2 extends BeatBox {
  constructor(config2) {
    super(config2);
    this.logoHoverable = false;
    this.scope = effectScope();
    this.visualizer = new LegacyRoundVisualizer({
      size: Size.of(config2.size.x * 0.96, config2.size.y * 0.96),
      innerRadius: config2.size.x * 0.92 / 2,
      anchor: Anchor.Center
    });
    const ripple2 = new Ripples({
      size: Size.of(config2.size.x * 0.98, config2.size.y * 0.98),
      anchor: Anchor.Center
    });
    this.logoBeatBox = new LegacyLogoBeatBox(config2);
    this.fadeLogoBeatBox = new LegacyFadeLogoBeatBox(config2);
    this.add(this.visualizer, ripple2, this.logoBeatBox, this.fadeLogoBeatBox);
    this.scope.run(() => {
      watch(() => UIState.logoHover, (val) => this.logoHoverable = val, { immediate: true });
    });
  }
  onNewBeat(isKiai, newBeatTimestamp, gap) {
    this.fadeLogoBeatBox.isVisible = !BeatState.isKiai;
  }
  onHover() {
    if (!this.logoHoverable) {
      return true;
    }
    this.transform().scaleTo(Vector(1.1), 500, easeOutElastic);
    return true;
  }
  onHoverLost() {
    if (!this.logoHoverable) {
      return true;
    }
    this.transform().scaleTo(Vector(1), 500, easeOutElastic);
    return true;
  }
  dispose() {
    super.dispose();
    this.scope.stop();
  }
}
class LogoBounceBox2 extends Box {
  // private readonly logoAmpBox: LogoAmpBox
  constructor(config2) {
    super(config2);
    this.add(new LogoAmpBox2(config2));
  }
  // private flag = true
  onClick(which) {
    return true;
  }
}
class PlayControls extends RowBox {
  constructor(config2) {
    super(config2);
    const atlas = TextureStore.getAtlas("Icons-Atlas");
    this.add(
      new ControlButton(atlas.getRegin("Icon-SkipPrevious")).setOnClick(() => {
        TempOSUPlayManager$1.prev();
      }),
      new ControlButton(atlas.getRegin("Icon-PlayArrow")).setOnClick(() => {
        OSUPlayer$1.play();
      }),
      new ControlButton(atlas.getRegin("Icon-Pause")).setOnClick(() => {
        OSUPlayer$1.pause();
      }),
      new ControlButton(atlas.getRegin("Icon-Stop")).setOnClick(() => {
        OSUPlayer$1.stop();
      }),
      new ControlButton(atlas.getRegin("Icon-SkipNext")).setOnClick(() => {
        TempOSUPlayManager$1.next();
      })
    );
  }
}
class ControlButton extends ImageDrawable {
  constructor(texture, anchor = Anchor.TopLeft) {
    super(texture, {
      size: Size.of(28),
      anchor: Anchor.CenterRight
    });
    this.enableMouseEvent();
  }
  onHover() {
    this.transform().scaleTo(Vector(1.1), 50);
    return true;
  }
  onHoverLost() {
    this.transform().scaleTo(Vector2.one, 50);
    return true;
  }
}
class ProgressBar extends Box {
  constructor(config2) {
    super(config2);
    this.add(
      new ImageDrawable(TextureStore.get("Square"), {
        size: Size.FillParentSize,
        color: Color.fromHex(16777215, 40)
      }),
      this.progress = new ImageDrawable(TextureStore.get("Square"), {
        size: Size.FillParentSize,
        color: Color.fromHex(16777215, 80),
        origin: Anchor.CenterLeft
      })
    );
  }
  onUpdate() {
    super.onUpdate();
    this.progress.setScaleX(OSUPlayer$1.currentTime.value / OSUPlayer$1.duration.value);
  }
}
class LegacyScreen extends Box {
  constructor() {
    super({
      size: Size.FillParentSize
    });
    this.add(
      new LogoBounceBox2({
        size: Size.of(500),
        anchor: Anchor.Center
      }),
      new SideFlashlight(Color.fromHex(16777215)),
      new HomeOverlay()
    );
  }
}
class HomeOverlay extends Box {
  constructor() {
    super({
      size: Size.FillParentSize
    });
    this.lastPosition = Vector2.newZero();
    const texture = TextureStore.get("Square");
    this.top = new ImageDrawable(texture, {
      size: Size.of(Size.FillParent, 100),
      anchor: Axis.Y_TOP | Axis.X_CENTER,
      color: Color.fromHex(0, 128)
    });
    this.bottom = new ImageDrawable(texture, {
      size: Size.of(Size.FillParent, 100),
      anchor: Axis.Y_BOTTOM | Axis.X_CENTER,
      color: Color.fromHex(0, 128)
    });
    this.add(
      this.top,
      this.bottom,
      new PlayControls({
        size: Size.of(Size.FillParent, 36),
        anchor: Anchor.TopRight,
        space: 8,
        offset: Vector(-8, 8)
      }),
      new ProgressBar({
        size: Size.of(168, 4),
        anchor: Anchor.TopRight,
        offset: Vector(-8, 36 + 16)
      })
    );
    this.setAlpha(0);
    this.enableMouseEvent();
  }
  onMouseMove() {
    const position = MouseState.position;
    if (this.lastPosition.isZero()) {
      this.lastPosition.setFrom(position);
    }
    const distance = position.distance(this.lastPosition);
    this.lastPosition.setFrom(position);
    if (distance > 500) {
      this.transform().fadeTo(1, 250).fadeTo(0, 1e4);
    } else {
      this.setAlpha(Math.min(this.getAlpha() + distance / 500, 1));
      this.transform().fadeTo(this.getAlpha(), 0).fadeTo(0, this.getAlpha() * 1e4);
    }
    return true;
  }
}
const _Transform = class _Transform2 {
  constructor() {
    this.translateMatrix4 = new Float32Array([
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ]);
    this.rotateMatrix4 = new Float32Array([
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ]);
    this.scaleMatrix4 = new Float32Array([
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ]);
    this.translate = Vector();
    this.scale = Vector(1);
    this.skew = Vector();
    this.rotate = 0;
    this.alpha = 1;
    this.color = Color.Black.copy();
    this.transformMatrix = Matrix3.newIdentify();
  }
  /**
   * @deprecated
   */
  extractToMatrix4(matrix4) {
    const sc = this.scale, t = this.translate, r = this.rotate;
    this.scaleMatrix4[0] = sc.x;
    this.scaleMatrix4[5] = sc.y;
    this.translateMatrix4[3] = t.x;
    this.translateMatrix4[7] = t.y;
    const radian = degreeToRadian(r);
    const cos = Math.cos(radian), sin = Math.sin(radian);
    this.rotateMatrix4[0] = cos;
    this.rotateMatrix4[1] = -sin;
    this.rotateMatrix4[4] = sin;
    this.rotateMatrix4[5] = cos;
    const m4 = MatrixUtils.m4Multi(this.translateMatrix4, this.rotateMatrix4);
    MatrixUtils.m4MultiTo(m4, this.scaleMatrix4, matrix4);
  }
  /**
   * @deprecated
   */
  extractToMatrix3(matrix3) {
    const sc = this.scale, t = this.translate, r = this.rotate;
    const scM3 = TransformUtils.scale(sc.x, sc.y);
    const tM3 = TransformUtils.translate(t.x, t.y);
    const rM3 = TransformUtils.rotate(degreeToRadian(r));
    const m3 = MatrixUtils.m3Multi(tM3, rM3);
    MatrixUtils.m3MultiTo(m3, scM3, matrix3);
  }
  /**
   * @deprecated
   */
  translateTo(v) {
    this.translate.set(v.x, v.y);
  }
  /**
   * @deprecated
   */
  scaleTo(v) {
    this.scale.set(v.x, v.y);
  }
  alphaTo(alpha) {
    this.alpha = alpha;
  }
  /**
   * @deprecated
   */
  translateBy(v) {
    this.translate.increment(v);
  }
  alphaBy(alpha) {
    this.alpha *= alpha;
  }
  /**
   * @deprecated
   */
  scaleBy(v) {
    this.scale.x *= v.x;
    this.scale.y *= v.y;
  }
  /**
   * @deprecated
   */
  skewBy(v) {
    this.skew.x += v.x;
    this.skew.y += v.y;
  }
  /**
   * @deprecated
   */
  skewTo(v) {
    this.skew.x = v.x;
    this.skew.y = v.y;
  }
  /**
   * @deprecated
   */
  rotateTo(n) {
    this.rotate = n;
  }
  /**
   * @deprecated
   */
  rotateBy(n) {
    this.rotate += n;
  }
};
_Transform.emptyTransform = new _Transform();
let Transform = _Transform;
class Shape2D {
  static quad(x1, y1, x2, y2, target, offset, stride) {
    target[offset] = x1;
    target[offset + 1] = y1;
    target[offset + stride] = x1;
    target[offset + stride + 1] = y2;
    target[offset + stride * 2] = x2;
    target[offset + stride * 2 + 1] = y1;
    target[offset + stride * 3] = x2;
    target[offset + stride * 3 + 1] = y1;
    target[offset + stride * 4] = x1;
    target[offset + stride * 4 + 1] = y2;
    target[offset + stride * 5] = x2;
    target[offset + stride * 5 + 1] = y2;
  }
  static color(r1, g1, b1, a1, r2, g2, b2, a2, r3, g3, b3, a3, r4, g4, b4, a4, target, offset, stride) {
    target[offset] = r1;
    target[offset + 1] = g1;
    target[offset + 2] = b1;
    target[offset + 3] = a1;
    target[offset + stride] = r2;
    target[offset + stride + 1] = g2;
    target[offset + stride + 2] = b2;
    target[offset + stride + 3] = a2;
    target[offset + stride * 2] = r3;
    target[offset + stride * 2 + 1] = g3;
    target[offset + stride * 2 + 2] = b3;
    target[offset + stride * 2 + 3] = a3;
    target[offset + stride * 3] = r3;
    target[offset + stride * 3 + 1] = g3;
    target[offset + stride * 3 + 2] = b3;
    target[offset + stride * 3 + 3] = a3;
    target[offset + stride * 4] = r2;
    target[offset + stride * 4 + 1] = g2;
    target[offset + stride * 4 + 2] = b2;
    target[offset + stride * 4 + 3] = a2;
    target[offset + stride * 5] = r4;
    target[offset + stride * 5 + 1] = g4;
    target[offset + stride * 5 + 2] = b4;
    target[offset + stride * 5 + 3] = a4;
  }
  static quadVector2(topLeft, bottomRight, target, offset, stride) {
    this.quad(topLeft.x, topLeft.y, bottomRight.x, bottomRight.y, target, offset, stride);
  }
  static oneColor(color, target, offset, stride) {
    this.color(
      color.red,
      color.green,
      color.blue,
      color.alpha,
      color.red,
      color.green,
      color.blue,
      color.alpha,
      color.red,
      color.green,
      color.blue,
      color.alpha,
      color.red,
      color.green,
      color.blue,
      color.alpha,
      target,
      offset,
      stride
    );
  }
  static triangle(v1, v2, v3, target, offset, stride) {
    target[offset] = v1.x;
    target[offset + 1] = v1.y;
    target[offset + stride] = v2.x;
    target[offset + stride + 1] = v2.y;
    target[offset + stride * 2] = v3.x;
    target[offset + stride * 2 + 1] = v3.y;
  }
  static ring(innerRadius, width, color, count, target, offset, stride) {
    const x = 0, innerY = innerRadius, outerY = innerRadius + width;
    const degree = 360 / count;
    const r = color.red, g = color.green, b = color.blue, a = color.alpha;
    let currentOffset = offset;
    for (let i = 0; i < count; i++) {
      const current = degreeToRadian(degree * i), next = degreeToRadian(degree * (i + 1));
      const sin1 = Math.sin(current), cos1 = Math.cos(current), sin2 = Math.sin(next), cos2 = Math.cos(next);
      const x1 = x * cos1 + innerY * -sin1, y1 = x * sin1 + innerY * cos1, x2 = x * cos1 + outerY * -sin1, y2 = x * sin1 + outerY * cos1, x3 = x * cos2 + innerY * -sin2, y3 = x * sin2 + innerY * cos2, x4 = x * cos2 + outerY * -sin2, y4 = x * sin2 + outerY * cos2;
      target[currentOffset] = x1;
      target[currentOffset + 1] = y1;
      target[currentOffset + 2] = r;
      target[currentOffset + 3] = g;
      target[currentOffset + 4] = b;
      target[currentOffset + 5] = a;
      target[currentOffset + stride] = x2;
      target[currentOffset + stride + 1] = y2;
      target[currentOffset + stride + 2] = r;
      target[currentOffset + stride + 3] = g;
      target[currentOffset + stride + 4] = b;
      target[currentOffset + stride + 5] = a;
      target[currentOffset + stride * 2] = x4;
      target[currentOffset + stride * 2 + 1] = y4;
      target[currentOffset + stride * 2 + 2] = r;
      target[currentOffset + stride * 2 + 3] = g;
      target[currentOffset + stride * 2 + 4] = b;
      target[currentOffset + stride * 2 + 5] = a;
      target[currentOffset + stride * 3] = x4;
      target[currentOffset + stride * 3 + 1] = y4;
      target[currentOffset + stride * 3 + 2] = r;
      target[currentOffset + stride * 3 + 3] = g;
      target[currentOffset + stride * 3 + 4] = b;
      target[currentOffset + stride * 3 + 5] = a;
      target[currentOffset + stride * 4] = x1;
      target[currentOffset + stride * 4 + 1] = y1;
      target[currentOffset + stride * 4 + 2] = r;
      target[currentOffset + stride * 4 + 3] = g;
      target[currentOffset + stride * 4 + 4] = b;
      target[currentOffset + stride * 4 + 5] = a;
      target[currentOffset + stride * 5] = x3;
      target[currentOffset + stride * 5 + 1] = y3;
      target[currentOffset + stride * 5 + 2] = r;
      target[currentOffset + stride * 5 + 3] = g;
      target[currentOffset + stride * 5 + 4] = b;
      target[currentOffset + stride * 5 + 5] = a;
      currentOffset += stride * 6;
    }
    return count * 36;
  }
  static one(value, target, offset, stride, count) {
    for (let i = 0; i < count; i++) {
      target[offset + stride * i] = value;
    }
  }
}
class StoryTextureManager {
  constructor() {
    this.textureMap = /* @__PURE__ */ new Map();
    this.currentBondedTexture = null;
  }
  addIf(gl, name, imageBitmap, format2) {
    if (this.textureMap.has(name)) {
      return;
    }
    const texture = new Texture(gl);
    texture.setTextureImage(imageBitmap, format2);
    this.textureMap.set(name, texture);
  }
  tryBind(name, slot = 0) {
    try {
      const texture = this.textureMap.get(name);
      if (this.currentBondedTexture === texture) {
        return;
      }
      if (this.currentBondedTexture) {
        this.currentBondedTexture.unbind();
      }
      texture.bind(slot);
      this.currentBondedTexture = texture;
    } catch (e) {
      console.error("texture bind error", name);
      throw new Error();
    }
  }
  dispose() {
    if (this.currentBondedTexture) {
      this.currentBondedTexture.unbind();
    }
    this.currentBondedTexture = null;
    this.textureMap.forEach((v) => v.dispose());
    this.textureMap.clear();
  }
}
const StoryTextureManager$1 = new StoryTextureManager();
class TransitionQueue {
  constructor() {
    this.first = null;
    this.last = null;
    this._startTime = Number.MAX_VALUE;
    this._endTime = Number.MIN_VALUE;
    this._startValue = 0;
    this._endValue = 0;
    this.current = null;
  }
  add(transition) {
    if (this.first === null) {
      this.first = transition;
      this.last = transition;
    } else {
      this.last.next = transition;
      this.last = transition;
    }
    const { startTime, endTime, fromValue, toValue } = transition;
    if (startTime < this._startTime) {
      this._startTime = startTime;
      this._startValue = fromValue;
    }
    if (endTime > this._endTime) {
      this._endTime = endTime;
      this._endValue = toValue;
    }
    if (this._endTime < this._startTime) {
      this._endTime = this._startTime;
    }
  }
  update(timestamp) {
    if (this.first === null) {
      return null;
    }
    let current = this.current ?? this.first;
    if (timestamp < current.startTime && current !== this.first) {
      current = this.first;
    }
    while (timestamp >= current.startTime && current.next !== null && timestamp >= current.next.startTime) {
      current = current.next;
    }
    this.current = current;
    return current.update(timestamp);
  }
  // public update(timestamp: number): Nullable<number> {
  //   const list = this.list
  //   if (list.length === 0) {
  //     return null
  //   }
  //   let current: Transition = this.current ?? list[0]
  //   // 当时间回溯时，确保能够找到之前的过渡
  //   if (timestamp < current.startTime && current !== list[0]) {
  //     current = list[0]
  //   }
  //   // 根据当前的时间，寻找合适的过渡
  //   while (timestamp >= current.startTime && current.next !== null && timestamp >= current.next.startTime) {
  //     current = current.next
  //   }
  //   if (timestamp >= current.startTime && timestamp <= current.endTime) {
  //     return current.update(timestamp)
  //   }
  //   for (let i = 1; i < list.length; i++) {
  //     const transition = list[i]
  //     if (timestamp >= transition.startTime && timestamp <= transition.endTime) {
  //       current = transition
  //       break
  //     }
  //   }
  //   this.current = current
  //
  //   return current.update(timestamp)
  // }
  get startTime() {
    return this._startTime;
  }
  get endTime() {
    return this._endTime;
  }
  get startValue() {
    if (!this.first) {
      throw new Error("no transition");
    }
    return this._startValue;
  }
  get endValue() {
    if (!this.last) {
      throw new Error("no transition");
    }
    return this._endValue;
  }
}
const easeFunction = [
  linear,
  easeOut,
  easeIn,
  easeInQuad,
  easeOutQuad,
  easeInOutQuad,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  easeInQuart,
  easeOutQuart,
  easeInOutQuart,
  easeInQuint,
  easeOutQuint,
  easeInOutQuint,
  easeInSine,
  easeOutSine,
  easeInOutSine,
  easeInExpo,
  easeOutExpo,
  easeInOutExpo,
  easeInCirc,
  easeOutCirc,
  easeInOutCirc,
  easeInElastic,
  easeOutElastic,
  easeInOutElastic,
  linear,
  linear,
  easeInBack,
  easeOutBack,
  easeInOutBack,
  easeInBounce,
  easeOutBounce,
  easeInOutBounce
];
class TransitionEvent {
  constructor(sprite) {
    this.sprite = sprite;
    this.eventCount = 0;
    this.transitionSortCompare = (a, b) => {
      if (a.startTime !== b.startTime)
        return a.startTime - b.startTime;
      else
        return a.endTime - b.endTime;
    };
  }
  commit() {
  }
}
class StoryMoveEvent extends TransitionEvent {
  constructor(sprite) {
    super(sprite);
    this.transitionXQueue = new TransitionQueue();
    this.transitionYQueue = new TransitionQueue();
    this.transitionXList = [];
    this.transitionYList = [];
    this.eventCount = 0;
  }
  addEvent(event) {
    if (isValueEvent(event)) {
      if (event.type === "MX") {
        const { startTime, endTime, ease, from, to } = event;
        const transitionX = new Transition(
          startTime,
          endTime,
          easeFunction[ease],
          to,
          from
        );
        this.transitionXList.push(transitionX);
      }
      if (event.type === "MY") {
        const { startTime, endTime, ease, from, to } = event;
        const transitionY = new Transition(
          startTime,
          endTime,
          easeFunction[ease],
          to,
          from
        );
        this.transitionYList.push(transitionY);
      }
      this.eventCount++;
    } else if (isVectorEvent(event)) {
      const { startTime, endTime, ease, from, to } = event;
      const transitionX = new Transition(
        startTime,
        endTime,
        easeFunction[ease],
        to.x,
        from.x
      );
      const transitionY = new Transition(
        startTime,
        endTime,
        easeFunction[ease],
        to.y,
        from.y
      );
      this.transitionXList.push(transitionX);
      this.transitionYList.push(transitionY);
      this.eventCount++;
    }
  }
  commit() {
    this.transitionXList.sort(this.transitionSortCompare);
    this.transitionYList.sort(this.transitionSortCompare);
    for (const transitionX of this.transitionXList) {
      this.transitionXQueue.add(transitionX);
    }
    for (const transitionY of this.transitionYList) {
      this.transitionYQueue.add(transitionY);
    }
  }
  update(timestamp) {
    if (this.eventCount === 0) {
      return;
    }
    const x = this.transitionXQueue.update(timestamp);
    const y = this.transitionYQueue.update(timestamp);
    const transform = this.sprite.transform;
    if (x !== null) {
      transform.translate.x = x;
    }
    if (y !== null) {
      transform.translate.y = y;
    }
  }
  hasEvent() {
    return this.eventCount > 0;
  }
  startTime() {
    let startTime = Number.MAX_SAFE_INTEGER;
    if (this.transitionXQueue.first !== null) {
      startTime = Math.min(startTime, this.transitionXQueue.startTime);
    }
    if (this.transitionYQueue.first !== null) {
      startTime = Math.min(startTime, this.transitionYQueue.startTime);
    }
    return startTime;
  }
  endTime() {
    let endTime = -1;
    if (this.transitionXQueue.first !== null) {
      endTime = Math.max(endTime, this.transitionXQueue.endTime);
    }
    if (this.transitionYQueue.first !== null) {
      endTime = Math.max(endTime, this.transitionYQueue.endTime);
    }
    return endTime;
  }
  startValue() {
    return Vector(
      this.transitionXQueue.startValue,
      this.transitionYQueue.startValue
    );
  }
  endValue() {
    return Vector(
      this.transitionXQueue.endValue,
      this.transitionYQueue.endValue
    );
  }
}
class StoryFadeEvent extends TransitionEvent {
  constructor(sprite) {
    super(sprite);
    this.transitionQueue = new TransitionQueue();
    this.eventCount = 0;
    this.transitionList = [];
  }
  addEvent(event) {
    const { startTime, endTime, ease, from, to } = event;
    const transition = new Transition(
      startTime,
      endTime,
      easeFunction[ease],
      to,
      from
    );
    this.transitionList.push(transition);
    this.eventCount++;
  }
  commit() {
    const list2 = this.transitionList;
    list2.sort(this.transitionSortCompare);
    for (let i = 0; i < list2.length; i++) {
      this.transitionQueue.add(list2[i]);
    }
  }
  update(timestamp) {
    if (this.eventCount === 0) {
      return;
    }
    const value = this.transitionQueue.update(timestamp);
    if (value !== null) {
      this.sprite.transform.alphaTo(value);
    }
  }
  hasEvent() {
    return this.eventCount > 0;
  }
  startTime() {
    return this.transitionQueue.startTime;
  }
  endTime() {
    return this.transitionQueue.endTime;
  }
  startValue() {
    return this.transitionQueue.startValue;
  }
  endValue() {
    return this.transitionQueue.endValue;
  }
}
class StoryRotateEvent extends TransitionEvent {
  constructor(sprite) {
    super(sprite);
    this.transitionQueue = new TransitionQueue();
    this.transitionList = [];
    this.eventCount = 0;
  }
  addEvent(event) {
    const { startTime, endTime, ease, from, to } = event;
    const transition = new Transition(
      startTime,
      endTime,
      easeFunction[ease],
      to,
      from
    );
    this.transitionList.push(transition);
    this.eventCount++;
  }
  commit() {
    this.transitionList.sort(this.transitionSortCompare);
    for (const transition of this.transitionList) {
      this.transitionQueue.add(transition);
    }
  }
  update(timestamp) {
    if (this.eventCount === 0) {
      return;
    }
    const value = this.transitionQueue.update(timestamp);
    if (value !== null) {
      this.sprite.transform.rotateTo(radianToDegree(-value));
    }
  }
  hasEvent() {
    return this.eventCount > 0;
  }
  startTime() {
    return this.transitionQueue.startTime;
  }
  endTime() {
    return this.transitionQueue.endTime;
  }
  startValue() {
    return this.transitionQueue.startValue;
  }
  endValue() {
    return this.transitionQueue.endValue;
  }
}
class StoryScaleEvent extends TransitionEvent {
  constructor(sprite) {
    super(sprite);
    this.transitionXQueue = new TransitionQueue();
    this.transitionYQueue = new TransitionQueue();
    this.transitionXList = [];
    this.transitionYList = [];
    this.eventCount = 0;
  }
  addEvent(event) {
    if (isValueEvent(event)) {
      const { startTime, endTime, ease, from, to } = event;
      const transitionX = new Transition(
        startTime,
        endTime,
        easeFunction[ease],
        to,
        from
      );
      const transitionY = new Transition(
        startTime,
        endTime,
        easeFunction[ease],
        to,
        from
      );
      this.transitionXList.push(transitionX);
      this.transitionYList.push(transitionY);
      this.eventCount++;
    } else if (isVectorEvent(event)) {
      const { startTime, endTime, ease, from, to } = event;
      const transitionX = new Transition(
        startTime,
        endTime,
        easeFunction[ease],
        to.x,
        from.x
      );
      const transitionY = new Transition(
        startTime,
        endTime,
        easeFunction[ease],
        to.y,
        from.y
      );
      this.transitionXList.push(transitionX);
      this.transitionYList.push(transitionY);
      this.eventCount++;
    }
  }
  commit() {
    this.transitionXList.sort(this.transitionSortCompare);
    this.transitionYList.sort(this.transitionSortCompare);
    for (const transitionX of this.transitionXList) {
      this.transitionXQueue.add(transitionX);
    }
    for (const transitionY of this.transitionYList) {
      this.transitionYQueue.add(transitionY);
    }
  }
  update(timestamp) {
    if (this.eventCount === 0) {
      return;
    }
    const x = this.transitionXQueue.update(timestamp);
    const y = this.transitionYQueue.update(timestamp);
    const transform = this.sprite.transform;
    if (x !== null) {
      transform.scale.x = x;
    }
    if (y !== null) {
      transform.scale.y = y;
    }
  }
  hasEvent() {
    return this.eventCount > 0;
  }
  startTime() {
    return Math.min(this.transitionXQueue.startTime, this.transitionYQueue.startTime);
  }
  endTime() {
    return Math.max(this.transitionXQueue.endTime, this.transitionYQueue.endTime);
  }
  startValue() {
    return Vector(
      this.transitionXQueue.startValue,
      this.transitionYQueue.startValue
    );
  }
  endValue() {
    return Vector(
      this.transitionXQueue.endValue,
      this.transitionYQueue.endValue
    );
  }
}
class StoryColorEvent extends TransitionEvent {
  constructor(sprite) {
    super(sprite);
    this.transitionRQueue = new TransitionQueue();
    this.transitionGQueue = new TransitionQueue();
    this.transitionBQueue = new TransitionQueue();
    this.transitionRList = [];
    this.transitionGList = [];
    this.transitionBList = [];
    this.eventCount = 0;
  }
  addEvent(event) {
    const { startTime, endTime, ease, from, to } = event;
    const redTransition = new Transition(
      startTime,
      endTime,
      easeFunction[ease],
      to.red,
      from.red
    );
    const greenTransition = new Transition(
      startTime,
      endTime,
      easeFunction[ease],
      to.green,
      from.green
    );
    const blueTransition = new Transition(
      startTime,
      endTime,
      easeFunction[ease],
      to.blue,
      from.blue
    );
    this.transitionRList.push(redTransition);
    this.transitionGList.push(greenTransition);
    this.transitionBList.push(blueTransition);
    this.eventCount++;
  }
  commit() {
    this.transitionRList.sort(this.transitionSortCompare);
    this.transitionGList.sort(this.transitionSortCompare);
    this.transitionBList.sort(this.transitionSortCompare);
    for (const transitionR of this.transitionRList) {
      this.transitionRQueue.add(transitionR);
    }
    for (const transitionG of this.transitionGList) {
      this.transitionGQueue.add(transitionG);
    }
    for (const transitionB of this.transitionBList) {
      this.transitionBQueue.add(transitionB);
    }
  }
  update(timestamp) {
    if (this.eventCount === 0) {
      return;
    }
    const r = this.transitionRQueue.update(timestamp);
    const g = this.transitionGQueue.update(timestamp);
    const b = this.transitionBQueue.update(timestamp);
    const color = this.sprite.color;
    if (r !== null) {
      color.red = r;
    }
    if (g !== null) {
      color.green = g;
    }
    if (b !== null) {
      color.blue = b;
    }
  }
  hasEvent() {
    return this.eventCount > 0;
  }
  startTime() {
    return Math.min(this.transitionRQueue.startTime, this.transitionGQueue.startTime, this.transitionBQueue.startTime);
  }
  endTime() {
    return Math.max(this.transitionRQueue.endTime, this.transitionGQueue.endTime, this.transitionBQueue.endTime);
  }
  startValue() {
    return new Color(
      this.transitionRQueue.startValue,
      this.transitionGQueue.startValue,
      this.transitionBQueue.startValue,
      1
    );
  }
  endValue() {
    return new Color(
      this.transitionRQueue.endValue,
      this.transitionGQueue.endValue,
      this.transitionBQueue.endValue,
      1
    );
  }
}
class StoryParamEvent extends TransitionEvent {
  constructor(sprite, paramType) {
    super(sprite);
    this.paramType = paramType;
    this.paramList = [];
    this._startTime = -1;
    this._endTime = -1;
    this.currentIndex = -1;
    if (paramType === "A") {
      this.updateSprite = (value) => {
        sprite.additiveBlend = value;
      };
    } else if (paramType === "V") {
      this.updateSprite = (value) => {
        sprite.verticalFlip = value;
      };
    } else {
      this.updateSprite = (value) => {
        sprite.horizontalFlip = value;
      };
    }
  }
  addEvent(event) {
    if (event.p === this.paramType) {
      this.paramList.push(event);
      this.eventCount++;
    }
  }
  commit() {
    this.paramList.sort((a, b) => a.startTime - b.startTime);
  }
  hasEvent() {
    return this.eventCount > 0;
  }
  endTime() {
    if (this._endTime < 0) {
      const list2 = this.paramList;
      let max = -1;
      for (let i = 0; i < list2.length; i++) {
        max = Math.max(list2[i].endTime, max);
      }
      this._endTime = max;
    }
    return this._endTime;
  }
  startTime() {
    if (this._startTime < 0) {
      const list2 = this.paramList;
      let min = Number.MAX_SAFE_INTEGER;
      for (let i = 0; i < list2.length; i++) {
        min = Math.min(list2[i].startTime, min);
      }
      this._startTime = min;
    }
    return this._startTime;
  }
  update(timestamp) {
    const list2 = this.paramList;
    if (list2.length === 0 || this.eventCount === 0) {
      return;
    }
    let currentIndex = this.currentIndex;
    if (currentIndex < 0 || timestamp < list2[currentIndex].startTime) {
      currentIndex = 0;
    }
    while (timestamp >= list2[currentIndex].startTime && currentIndex < list2.length - 1 && timestamp >= list2[currentIndex + 1].startTime) {
      currentIndex++;
    }
    this.currentIndex = currentIndex;
    const event = list2[currentIndex];
    if (event.startTime === event.endTime) {
      this.updateSprite(true);
    } else if (timestamp >= event.startTime && timestamp <= event.endTime) {
      this.updateSprite(true);
    } else {
      this.updateSprite(false);
    }
  }
  startValue() {
  }
  endValue() {
  }
}
class StoryEventGroup {
  constructor(sprite, events) {
    this._startTime = Number.MAX_VALUE;
    this._endTime = Number.MIN_VALUE;
    this.move = new StoryMoveEvent(sprite);
    this.fade = new StoryFadeEvent(sprite);
    this.rotate = new StoryRotateEvent(sprite);
    this.scale = new StoryScaleEvent(sprite);
    this.color = new StoryColorEvent(sprite);
    this.vFlip = new StoryParamEvent(sprite, "V");
    this.hFlip = new StoryParamEvent(sprite, "H");
    this.additive = new StoryParamEvent(sprite, "A");
    this.storyEventList = [
      this.move,
      this.scale,
      this.fade,
      this.rotate,
      this.color,
      this.vFlip,
      this.hFlip,
      this.additive
    ];
    for (const event of events) {
      this.addEvent(event);
    }
    const loopEvents = events.filter((v) => isLoopEvent(v));
    const maxOf = (e) => e.endTime;
    for (let i = 0; i < loopEvents.length; i++) {
      const loopEvent = loopEvents[i], duration = ArrayUtils.maxOf(loopEvent.children, maxOf), loopStartTime = loopEvent.startTime;
      for (let j = 0; j < loopEvent.loopCount; j++) {
        const baseTime = loopStartTime + duration * j;
        for (const event of loopEvent.children) {
          const copied = shallowCopy(event);
          copied.startTime += baseTime;
          copied.endTime += baseTime;
          this.addEvent(copied);
        }
      }
    }
    for (const storyEvent of this.storyEventList) {
      storyEvent.commit();
    }
    const startTime = ArrayUtils.minOf(this.storyEventList, (e) => e.startTime());
    const endTime = ArrayUtils.maxOf(this.storyEventList, (e) => e.endTime());
    if (sprite.path.includes("sb/m.png")) {
      console.log(sprite.path, "story group", this);
    }
    this._startTime = startTime;
    this._endTime = endTime;
  }
  addEvent(event) {
    if (event.type === "S" || event.type === "V") {
      this.scale.addEvent(event);
    } else if (event.type === "M" || event.type === "MX" || event.type === "MY") {
      this.move.addEvent(event);
    } else if (event.type === "F") {
      this.fade.addEvent(event);
    } else if (event.type === "R") {
      this.rotate.addEvent(event);
    } else if (event.type === "C") {
      this.color.addEvent(event);
    } else if (event.type === "P") {
      const e = event;
      if (e.p === "V") {
        this.vFlip.addEvent(e);
      } else if (e.p === "H") {
        this.hFlip.addEvent(e);
      } else if (e.p === "A") {
        this.additive.addEvent(e);
      }
    }
  }
  update(timestamp) {
    const list2 = this.storyEventList, length = list2.length;
    for (let i = 0; i < length; i++) {
      list2[i].update(timestamp);
    }
  }
  startTime() {
    return this._startTime;
  }
  endTime() {
    return this._endTime;
  }
}
const originMap = {
  TopLeft: Axis.Y_TOP | Axis.X_LEFT,
  TopCentre: Axis.Y_TOP | Axis.X_CENTER,
  TopRight: Axis.Y_TOP | Axis.X_RIGHT,
  CentreLeft: Axis.Y_CENTER | Axis.X_LEFT,
  Centre: Axis.Y_CENTER | Axis.X_CENTER,
  CentreRight: Axis.Y_CENTER | Axis.X_RIGHT,
  BottomLeft: Axis.Y_BOTTOM | Axis.X_LEFT,
  BottomCentre: Axis.Y_BOTTOM | Axis.X_CENTER,
  BottomRight: Axis.Y_BOTTOM | Axis.X_RIGHT,
  "": Axis.Y_TOP | Axis.X_LEFT
};
class Sprite {
  constructor(gl, sprite, source) {
    this.gl = gl;
    this.layer = "";
    this.path = "";
    this.x = 0;
    this.y = 0;
    this.origin = "";
    this.color = Color.fromHex(16777215);
    this.size = Vector();
    this.topLeft = Vector();
    this.bottomRight = Vector();
    this.transform = new Transform();
    this.transformMatrix4 = new Float32Array([
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ]);
    this.buffer = [];
    this.verticalFlip = false;
    this.horizontalFlip = false;
    this.additiveBlend = false;
    this.originPosition = Vector();
    this.needUpdateVertex = true;
    this.colorArray = new Float32Array(4);
    this.layer = sprite.layer;
    this.origin = sprite.origin;
    this.x = sprite.x;
    this.y = sprite.y;
    this.path = sprite.filePath;
    this.vertexBuffer = new VertexBuffer(gl);
    this.eventsGroup = new StoryEventGroup(this, sprite.events);
    this.showTime = this.eventsGroup.startTime();
    this.hideTime = this.eventsGroup.endTime();
    this.loadTexture(sprite, source);
    this.setupBound();
  }
  loadTexture(sprite, source) {
    const format2 = sprite.filePath.endsWith(".jpg") || sprite.filePath.endsWith(".jpeg") ? ImageFormat.JPEG : ImageFormat.PNG;
    const image2 = source.getImageBitmap(sprite.filePath);
    if (isUndef(image2)) {
      throw new Error("sprite texture cannot be undefined or null " + sprite.filePath);
    }
    this.size.set(image2.width, image2.height);
    StoryTextureManager$1.addIf(this.gl, sprite.filePath, image2, format2);
  }
  shouldVisible() {
    const current = AudioPlayerV2.currentTime();
    return current >= this.showTime && current < this.hideTime;
  }
  setupBound() {
    this.adjustOrigin();
    this.transform.translateTo(Vector(this.x, this.y));
  }
  adjustOrigin() {
    const origin = originMap[this.origin], hFlip = this.horizontalFlip, vFlip = this.verticalFlip;
    let x, y, xAxis = Axis.getXAxis(origin), yAxis = Axis.getYAxis(origin);
    if (hFlip) {
      if (xAxis === Axis.X_LEFT) {
        xAxis = Axis.X_RIGHT;
      } else if (xAxis === Axis.X_RIGHT) {
        xAxis = Axis.X_LEFT;
      }
    }
    if (vFlip) {
      if (yAxis === Axis.Y_TOP) {
        yAxis = Axis.Y_BOTTOM;
      } else if (yAxis === Axis.Y_BOTTOM) {
        yAxis = Axis.Y_TOP;
      }
    }
    if (xAxis === Axis.X_LEFT) {
      x = 0;
    } else if (xAxis === Axis.X_CENTER) {
      x = -this.size.x / 2;
    } else {
      x = -this.size.x;
    }
    if (yAxis === Axis.Y_TOP) {
      y = 0;
    } else if (yAxis === Axis.Y_CENTER) {
      y = -this.size.y / 2;
    } else {
      y = -this.size.y;
    }
    this.originPosition.set(x, y);
  }
  onResize() {
    this.setupBound();
    this.needUpdateVertex = true;
  }
  update() {
    const current = AudioPlayerV2.currentTime();
    this.eventsGroup.update(current);
    this.applyTransform();
  }
  applyTransform() {
    const transform = this.transform, topLeft = this.topLeft, bottomRight = this.bottomRight, scaleY = this.verticalFlip ? -1 : 1, scaleX = this.horizontalFlip ? -1 : 1;
    this.adjustOrigin();
    transform.scale.x *= scaleX;
    transform.scale.y *= scaleY;
    transform.extractToMatrix4(this.transformMatrix4);
    topLeft.set(this.originPosition.x, this.originPosition.y);
    bottomRight.set(this.originPosition.x + this.size.x, this.originPosition.y + this.size.y);
    this.color.alpha = transform.alpha;
  }
  draw(renderer2) {
    if (!this.shouldVisible()) {
      return;
    }
    const shader = Shaders.StoryDefault, gl = this.gl;
    this.vertexBuffer.bind();
    if (this.needUpdateVertex) {
      Shape2D.quadVector2(this.topLeft, this.bottomRight, this.buffer, 0, 4);
      Shape2D.quad(0, 0, 1, 1, this.buffer, 2, 4);
      this.vertexBuffer.setBufferData(new Float32Array(this.buffer));
      this.needUpdateVertex = false;
    }
    shader.transform = this.transformMatrix4;
    shader.color = this.color;
    shader.use();
    StoryTextureManager$1.tryBind(this.path);
    if (this.additiveBlend) {
      renderer2.setBlend(Blend.Additive);
    } else {
      renderer2.setBlend(Blend.Normal);
    }
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    this.vertexBuffer.unbind();
  }
  dispose() {
    this.vertexBuffer.dispose();
  }
}
class Animation extends Sprite {
  loadTexture(sprite, source) {
    this.frameDelay = sprite.frameDelay;
    this.frameCount = sprite.frameCount;
    this.loopType = sprite.loopType;
    this.loopForever = sprite.loopType === "LoopForever";
    this.frames = [];
    const path = sprite.filePath, dotIndex = path.lastIndexOf(".");
    const name = path.substring(0, dotIndex);
    const suffix = path.substring(dotIndex);
    for (let i = 0; i < this.frameCount; i++) {
      const newName = `${name}${i}${suffix}`;
      const image2 = source.getImageBitmap(newName);
      if (isUndef(image2)) {
        console.error("no image found");
        throw new Error("sprite texture cannot be undefined or null " + newName);
      }
      const format2 = newName.endsWith(".jpg") || newName.endsWith(".jpeg") ? ImageFormat.JPEG : ImageFormat.PNG;
      this.frames.push(newName);
      this.size.set(image2.width, image2.height);
      StoryTextureManager$1.addIf(this.gl, newName, image2, format2);
    }
  }
  getFrameIndex() {
    const showTime = this.showTime, current = AudioPlayerV2.currentTime();
    const time = current - showTime;
    if (time < 0) {
      return -1;
    }
    const frameNum = Math.floor(time / this.frameDelay);
    this.loopedCount = Math.floor(frameNum / this.frameCount);
    if (!this.loopForever && this.loopedCount > 1) {
      return -1;
    }
    return frameNum % this.frameCount;
  }
  draw(renderer2) {
    if (!this.shouldVisible()) {
      return;
    }
    const frameIndex = this.getFrameIndex();
    if (frameIndex < 0) {
      return;
    }
    const shader = Shaders.StoryDefault, gl = this.gl;
    this.vertexBuffer.bind();
    if (this.needUpdateVertex) {
      Shape2D.quadVector2(this.topLeft, this.bottomRight, this.buffer, 0, 4);
      Shape2D.quad(0, 0, 1, 1, this.buffer, 2, 4);
      this.vertexBuffer.setBufferData(new Float32Array(this.buffer));
      this.needUpdateVertex = false;
    }
    shader.transform = this.transformMatrix4;
    shader.color = this.color;
    shader.use();
    StoryTextureManager$1.tryBind(this.frames[frameIndex]);
    if (this.additiveBlend) {
      renderer2.setBlend(Blend.Additive);
    } else {
      renderer2.setBlend(Blend.Normal);
    }
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    this.vertexBuffer.unbind();
  }
}
class StoryboardLayer {
  constructor() {
    this.background = [];
    this.fail = [];
    this.pass = [];
    this.foreground = [];
    this.overlay = [];
  }
  onResize() {
    const background = this.background;
    const fail = this.fail;
    const pass = this.pass;
    const foreground = this.foreground;
    const overlay = this.overlay;
    for (let i = 0; i < background.length; i++) {
      background[i].onResize();
    }
    for (let i = 0; i < fail.length; i++) {
      fail[i].onResize();
    }
    for (let i = 0; i < pass.length; i++) {
      pass[i].onResize();
    }
    for (let i = 0; i < foreground.length; i++) {
      foreground[i].onResize();
    }
    for (let i = 0; i < overlay.length; i++) {
      overlay[i].onResize();
    }
  }
  update() {
    const background = this.background;
    const fail = this.fail;
    const pass = this.pass;
    const foreground = this.foreground;
    const overlay = this.overlay;
    for (let i = 0; i < background.length; i++) {
      background[i].update();
    }
    for (let i = 0; i < fail.length; i++) {
      fail[i].update();
    }
    for (let i = 0; i < pass.length; i++) {
      pass[i].update();
    }
    for (let i = 0; i < foreground.length; i++) {
      foreground[i].update();
    }
    for (let i = 0; i < overlay.length; i++) {
      overlay[i].update();
    }
  }
  draw(renderer2) {
    const background = this.background;
    const fail = this.fail;
    const pass = this.pass;
    const foreground = this.foreground;
    const overlay = this.overlay;
    for (let i = 0; i < background.length; i++) {
      background[i].draw(renderer2);
    }
    for (let i = 0; i < fail.length; i++) {
      fail[i].draw(renderer2);
    }
    for (let i = 0; i < pass.length; i++) {
      pass[i].draw(renderer2);
    }
    for (let i = 0; i < foreground.length; i++) {
      foreground[i].draw(renderer2);
    }
    for (let i = 0; i < overlay.length; i++) {
      overlay[i].draw(renderer2);
    }
  }
  dispose() {
    const background = this.background;
    const fail = this.fail;
    const pass = this.pass;
    const foreground = this.foreground;
    const overlay = this.overlay;
    for (let i = 0; i < background.length; i++) {
      background[i].dispose();
    }
    for (let i = 0; i < fail.length; i++) {
      fail[i].dispose();
    }
    for (let i = 0; i < pass.length; i++) {
      pass[i].dispose();
    }
    for (let i = 0; i < foreground.length; i++) {
      foreground[i].dispose();
    }
    for (let i = 0; i < overlay.length; i++) {
      overlay[i].dispose();
    }
  }
}
class StoryScreen extends Drawable {
  constructor(gl) {
    var _a2, _b;
    super({
      size: Size.FillParentSize
    });
    this.orth = new Float32Array(16);
    this.layers = new StoryboardLayer();
    this.drawNode = new class extends DrawNode {
      apply() {
      }
      draw(renderer2) {
        this.source.onDraw(this, renderer2);
      }
    }(this);
    const osz = OSUPlayer$1.currentOSZFile.value;
    const sprites = [...osz.osbFile.sprites];
    sprites.push(...((_b = (_a2 = OSUPlayer$1.currentOSUFile.value.Events) == null ? void 0 : _a2.storyboard) == null ? void 0 : _b.sprites) ?? []);
    if (sprites.length) {
      for (let i = 0; i < sprites.length; i++) {
        try {
          const osbSprite = sprites[i];
          let sprite;
          if (isAnimation(osbSprite)) {
            sprite = new Animation(gl, osbSprite, osz);
          } else {
            sprite = new Sprite(gl, osbSprite, osz);
          }
          if (sprite.layer === "Background") {
            this.layers.background.push(sprite);
          } else if (sprite.layer === "Fail") {
            this.layers.fail.push(sprite);
          } else if (sprite.layer === "Pass") {
            this.layers.pass.push(sprite);
          } else if (sprite.layer === "Foreground") {
            this.layers.foreground.push(sprite);
          } else {
            this.layers.overlay.push(sprite);
          }
        } catch (e) {
          console.log(e);
        }
      }
    }
    const shader = Shaders.StoryDefault;
    shader.bind();
    shader.sampler2D = 0;
    shader.unbind();
    const scale = 480 / Coordinate$1.height;
    const scaledWidth = Coordinate$1.width * scale;
    const s = scaledWidth - 640 < 0 ? 0 : scaledWidth - 640;
    this.orth = TransformUtils.orth(
      -s / 2,
      640 + s / 2,
      480,
      0,
      0,
      1
    );
  }
  onWindowResize() {
    super.onWindowResize();
    const scale = 480 / Coordinate$1.height;
    const scaledWidth = 640 / scale;
    const s = Coordinate$1.width - scaledWidth;
    this.orth = TransformUtils.orth(
      -s / 2,
      scaledWidth + s / 2,
      480,
      0,
      0,
      1
    );
    this.layers.onResize();
  }
  onUpdate() {
    super.onUpdate();
    this.layers.update();
  }
  bind() {
    Shaders.StoryDefault.bind();
  }
  onDraw(node, renderer2) {
    this.bind();
    Shaders.StoryDefault.orth = this.orth;
    this.layers.draw(renderer2);
    this.unbind();
  }
  dispose() {
    super.dispose();
    StoryTextureManager$1.dispose();
    this.layers.dispose();
  }
  unbind() {
  }
}
class LegacyPlayScreen extends BeatBox {
  constructor() {
    super({
      size: Size.FillParentSize
    });
    this.activeScale = Vector(1.1);
    this.fadeLogoMinScale = Vector(1.12);
    this.fadeLogoMaxScale = Vector(1.18);
    this.fade = 0.65;
    this.add(
      this.logo = new LegacyLogo({
        size: Size.of(200),
        offset: Vector(36, 65),
        anchor: Anchor.BottomRight
      }),
      this.fadeLogo = new LegacyLogo({
        size: Size.of(200),
        offset: Vector(36, 65),
        anchor: Anchor.BottomRight
      }).apply((fadeLogo) => {
        fadeLogo.setAlpha(this.fade);
      })
    );
  }
  onNewBeat(isKiai, newBeatTimestamp, gap) {
    this.logo.transform().delay(30).scaleTo(this.activeScale, 30, easeOut).scaleTo(Vector(1), gap * 2, easeOutQuint);
    this.fadeLogo.transform().delay(60).fadeTo(this.fade, 0).fadeTo(0, gap * 2, easeOutQuint).clear.delay(60).scaleTo(this.fadeLogoMinScale, 0).scaleTo(this.fadeLogoMaxScale, gap * 2, easeOutQuint);
  }
}
const usedIcons = [
  "MusicNote",
  "Folder",
  "PlayArrow",
  "Pause",
  "SkipNext",
  "SkipPrevious",
  "Help",
  "Stop",
  "Fullscreen",
  "Notifications",
  "KeyboardArrowLeft",
  "Settings",
  "RadioButtonUnchecked"
];
async function loadIconsAtlas() {
  let atlasText = ``;
  const iconLine = Math.ceil(usedIcons.length / 10);
  let iconIdx = 0;
  for (let i = 0; i < iconLine; i++) {
    const y = i * 96;
    for (let j = 0; j < 10; j++) {
      const x = 96 * j;
      if (iconIdx >= usedIcons.length)
        break;
      const icon = usedIcons[iconIdx++];
      atlasText += `Icon-${icon}
  x: ${x}
  y: ${y}
  width: 96
  height: 96
`;
    }
  }
  const iconsValue = usedIcons.map((v) => Icon[v]);
  const iconTexture = drawCanvas(Vector(96 * 10), (context2) => {
    context2.font = "96px 'Material Icons'";
    context2.textAlign = "left";
    context2.fillStyle = "#ffffff";
    let iconIndex = 0;
    for (let i = 0; i < iconLine; i++) {
      for (let j = 0; j < 10; j++) {
        if (iconIndex >= iconsValue.length)
          break;
        context2.fillText(iconsValue[iconIndex++], j * 96, (i + 1) * 96);
      }
    }
  });
  await TextureStore.addTextureAtlas("Icons-Atlas", atlasText, iconTexture, false);
}
class ApplicationLoader {
  static async loadWorkDirectly() {
    await Resource.init();
  }
  static async loadWebGL(webgl) {
    const renderer2 = new WebGLRenderer(webgl);
    Shaders.init(renderer2);
    Buffers.init(renderer2);
    await this.loadTexture(webgl);
    return renderer2;
  }
  static async loadTexture(webgl) {
    for (const imagesKey in Images) {
      TextureStore.add(webgl, imagesKey, Images[imagesKey]);
    }
    const gradiant = genTexture(webgl, Vector(40, 90), (context2) => {
      context2.beginPath();
      let canvasGradient = context2.createLinearGradient(0, 0, 40, 0);
      canvasGradient.addColorStop(0, "#ffffff");
      canvasGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      context2.fillStyle = canvasGradient;
      context2.fillRect(0, 0, 40, 90);
      context2.fill();
    });
    TextureStore.addTexture("Gradiant", gradiant);
    const verticalGradiant = genTexture(webgl, Vector(90, 40), (context2) => {
      context2.beginPath();
      let canvasGradient = context2.createLinearGradient(45, 0, 45, 40);
      canvasGradient.addColorStop(0, "#ffffff");
      canvasGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      context2.fillStyle = canvasGradient;
      context2.fillRect(0, 0, 90, 40);
      context2.fill();
    });
    TextureStore.addTexture("VerticalGradiant", verticalGradiant);
    await loadIconsAtlas();
  }
  static async loadImages() {
    await runTask("Downloading images...", async (task) => {
      task.progress.value = 0;
      await loadImage();
      task.progress.value = 0.5;
      await BackgroundManager$1.changeLoader(BackgroundManager$1.Default);
      task.progress.value = 1;
      task.finish("Images downloaded", Icon.Check);
    }, true);
  }
  static async loadSounds() {
    await loadSoundEffect();
  }
  static async loadScreen(renderer2) {
    ScreenManager$1.init(renderer2);
    ScreenManager$1.addScreen("main", () => {
      return new MainScreen();
    });
    ScreenManager$1.addScreen("second", () => {
      return new SongPlayScreen();
    });
    ScreenManager$1.addScreen("test", () => {
      return new TestScreen();
    });
    ScreenManager$1.addScreen("legacy", () => {
      return new LegacyScreen();
    });
    ScreenManager$1.addScreen("story", () => {
      return new StoryScreen(renderer2.gl);
    });
    ScreenManager$1.addScreen("legacyPlay", () => {
      return new LegacyPlayScreen();
    });
    ScreenManager$1.activeScreen("main");
  }
}
const _hoisted_1$b = {
  class: "fill-size",
  style: { "pointer-events": "none" }
};
const _sfc_main$g = /* @__PURE__ */ defineComponent({
  __name: "Visualizer2",
  setup(__props) {
    const canvas2 = ref(null);
    let renderer2;
    const player = AudioPlayerV2;
    const mousePosition = Vector();
    function handleMousePosition(position) {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const width = Coordinate$1.width;
      const height = Coordinate$1.height;
      const scaleX = width / windowWidth;
      const scaleY = height / windowHeight;
      position.x *= scaleX;
      position.y *= scaleY;
    }
    const mouseListener = {
      mousedown(e) {
        mousePosition.set(e.x, e.y);
        handleMousePosition(mousePosition);
        let which = MOUSE_KEY_NONE;
        if (e.button === 0)
          which = MOUSE_KEY_LEFT;
        if (e.button === 2)
          which = MOUSE_KEY_RIGHT;
        if (which !== MOUSE_KEY_NONE)
          MouseState.receiveMouseDown(which, mousePosition.x, mousePosition.y);
      },
      mouseup(e) {
        mousePosition.set(e.x, e.y);
        handleMousePosition(mousePosition);
        let which = MOUSE_KEY_NONE;
        if (e.button === 0)
          which = MOUSE_KEY_LEFT;
        if (e.button === 2)
          which = MOUSE_KEY_RIGHT;
        if (which !== MOUSE_KEY_NONE)
          MouseState.receiveMouseUp(which, mousePosition.x, mousePosition.y);
      },
      mousemove(e) {
        mousePosition.set(e.x, e.y);
        handleMousePosition(mousePosition);
        MouseState.receiveMouseMove(mousePosition.x, mousePosition.y);
      }
    };
    onMounted(async () => {
      let backgroundScreen = null;
      document.addEventListener("visibilitychange", () => {
        if (!document.hidden) {
          if (backgroundScreen == null ? void 0 : backgroundScreen.isVideoVisible) {
            OSUPlayer$1.seek(AudioPlayerV2.currentTime());
          } else {
            VideoPlayer$1.seek(AudioPlayerV2.currentTime());
          }
        }
      });
      window.addEventListener("mousedown", mouseListener.mousedown);
      window.addEventListener("mouseup", mouseListener.mouseup);
      window.addEventListener("mousemove", mouseListener.mousemove);
      const c = canvas2.value;
      if (!c)
        return;
      const webgl = c.getContext("webgl2", {
        alpha: false,
        premultipliedAlpha: false
      });
      if (!webgl) {
        return;
      }
      resizeCanvas();
      await ApplicationLoader.loadImages();
      await ApplicationLoader.loadSounds();
      renderer2 = await ApplicationLoader.loadWebGL(webgl);
      window.onresize = () => {
        resizeCanvas();
      };
      backgroundScreen = new BackgroundScreen();
      renderer2.addDrawable(backgroundScreen);
      await ApplicationLoader.loadScreen(renderer2);
      renderer2.onDispose = () => {
        Shaders.dispose();
        Buffers.dispose();
        TextureStore.dispose();
        QuadIndexBuffer$1.dispose();
      };
      draw();
    });
    onUnmounted(() => {
      window.removeEventListener("mousedown", mouseListener.mousedown);
      window.removeEventListener("mouseup", mouseListener.mouseup);
      window.removeEventListener("mousemove", mouseListener.mousemove);
      renderer2.dispose();
    });
    let prevTimestamp = -1;
    function draw(timestamp = 0) {
      requestAnimationFrame(draw);
      if (prevTimestamp < 0) {
        prevTimestamp = timestamp;
      }
      const elapsed = timestamp - prevTimestamp;
      prevTimestamp = timestamp;
      OSUPlayer$1.update();
      const time = player.currentTime();
      Time.currentTime = timestamp;
      Time.elapsed = elapsed;
      AudioChannel$1.update(time);
      BeatState.isKiai = BeatBooster$1.isKiai(time);
      BeatState.beatIndex = BeatBooster$1.getCurrentBeatCount() + 1;
      BeatState.currentBeat = BeatBooster$1.updateBeat(time, easeOut, easeOutQuint);
      BeatState.isAvailable = BeatBooster$1.isAvailable;
      renderer2.render();
    }
    function resizeCanvas() {
      if (canvas2.value) {
        canvas2.value.height = canvas2.value.clientHeight * window.devicePixelRatio;
        canvas2.value.width = canvas2.value.clientWidth * window.devicePixelRatio;
        const { clientWidth, clientHeight } = canvas2.value;
        Coordinate$1.updateCoordinate(clientWidth, clientHeight);
      }
    }
    useKeyboard("up", (e) => {
      if (e.code === "KeyF") {
        canvasFullscreen();
      }
    });
    function canvasFullscreen() {
      if (canvas2.value) {
        canvas2.value.requestFullscreen();
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$b, [
        createBaseVNode("canvas", {
          style: { "width": "100vw", "height": "100vh" },
          ref_key: "canvas",
          ref: canvas2
        }, null, 512)
      ]);
    };
  }
});
function useCollect(flow, collector) {
  flow.collect(collector);
  onUnmounted(() => {
    flow.removeCollect(collector);
  });
}
function useStateFlow(stateFlow) {
  const value = ref(stateFlow.value);
  useCollect(stateFlow, (v) => value.value = v);
  return value;
}
const _hoisted_1$a = { class: "bg-[--item-icon-bg-color] h-full aspect-square text-[--item-progress-color] ma" };
const _sfc_main$f = /* @__PURE__ */ defineComponent({
  __name: "NotifyItem",
  props: {
    text: {},
    progress: { default: 0 }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Column, { class: "w-full relative h-16 bg-[--item-bg-color] rounded-md overflow-hidden" }, {
        default: withCtx(() => [
          createVNode(Row, { class: "absolute w-full h-full" }, {
            default: withCtx(() => [
              createBaseVNode("button", _hoisted_1$a, toDisplayString(unref(Icon).RadioButtonUnchecked), 1),
              createVNode(Row, {
                center: "",
                class: "text-white px-4 text-sm"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(_ctx.text), 1)
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          createBaseVNode("div", {
            style: normalizeStyle(`transform: scaleX(${_ctx.progress})`),
            class: "bg-[--item-progress-color] h-1 w-full origin-left absolute bottom-0 transition-transform"
          }, null, 4)
        ]),
        _: 1
      });
    };
  }
});
const _withScopeId$1 = (n) => (pushScopeId("data-v-dfa4ad2e"), n = n(), popScopeId(), n);
const _hoisted_1$9 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ createBaseVNode("span", { class: "font-bold text-[12px] text-white" }, "NOTIFICATION", -1));
const _hoisted_2$5 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ createBaseVNode("span", { class: "font-bold text-[12px] text-white" }, "RUNNING TASK", -1));
const _sfc_main$e = /* @__PURE__ */ defineComponent({
  __name: "NotificationPanel",
  setup(__props) {
    const messages = OsuNotification.messages;
    const tasks = OsuNotification.runningTasks;
    OsuNotification.clear(OsuNotification.tempQueue);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Column, { class: "notify-box bg-[--bg-color] w-96 h-full p-4 gap-y-2" }, {
        default: withCtx(() => [
          createVNode(Column, { class: "w-full gap-y-2" }, {
            default: withCtx(() => [
              createVNode(Row, { class: "w-full" }, {
                default: withCtx(() => [
                  _hoisted_1$9,
                  createBaseVNode("button", {
                    class: "text-[12px] text-white ml-auto",
                    onClick: _cache[0] || (_cache[0] = ($event) => unref(OsuNotification).clear(unref(OsuNotification).messages))
                  }, "CLEAR ALL")
                ]),
                _: 1
              }),
              createVNode(TransitionGroup$1, {
                name: "list1",
                tag: "div",
                class: "gap-y-2 flex flex-col"
              }, {
                default: withCtx(() => [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(unref(messages), (item) => {
                    return openBlock(), createBlock(_sfc_main$f, {
                      key: item.id,
                      text: item.text.value,
                      type: "text"
                    }, null, 8, ["text"]);
                  }), 128))
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          createVNode(Column, { class: "w-full gap-y-2" }, {
            default: withCtx(() => [
              createVNode(Row, { class: "w-full" }, {
                default: withCtx(() => [
                  _hoisted_2$5,
                  createBaseVNode("button", {
                    onClick: _cache[1] || (_cache[1] = ($event) => unref(OsuNotification).clear(unref(OsuNotification).runningTasks)),
                    class: "text-[12px] text-white ml-auto"
                  }, "CLEAR ALL")
                ]),
                _: 1
              }),
              createVNode(TransitionGroup$1, {
                name: "list1",
                tag: "div",
                class: "gap-y-2 flex flex-col"
              }, {
                default: withCtx(() => [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(unref(tasks), (item) => {
                    return openBlock(), createBlock(_sfc_main$f, {
                      text: item.text.value,
                      type: "progress",
                      progress: item.progress.value,
                      key: item.id
                    }, null, 8, ["text", "progress"]);
                  }), 128))
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ]),
        _: 1
      });
    };
  }
});
const NotificationPanel_vue_vue_type_style_index_0_scoped_dfa4ad2e_lang = "";
const Notification = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["__scopeId", "data-v-dfa4ad2e"]]);
const _sfc_main$d = /* @__PURE__ */ defineComponent({
  __name: "FloatNotification",
  setup(__props) {
    const queue2 = OsuNotification.tempQueue;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Column, { class: "notify-box w-96 p-4 pt-[68px] pointer-events-none" }, {
        default: withCtx(() => [
          createVNode(TransitionGroup$1, {
            name: "list",
            tag: "div",
            class: "gap-y-2 flex flex-col"
          }, {
            default: withCtx(() => [
              (openBlock(true), createElementBlock(Fragment, null, renderList(unref(queue2), (item) => {
                return openBlock(), createBlock(_sfc_main$f, {
                  text: item.text.value,
                  progress: item.progress.value,
                  key: item.id
                }, null, 8, ["text", "progress"]);
              }), 128))
            ]),
            _: 1
          })
        ]),
        _: 1
      });
    };
  }
});
const FloatNotification_vue_vue_type_style_index_0_scoped_b10ae20c_lang = "";
const FloatNotification = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["__scopeId", "data-v-b10ae20c"]]);
const _hoisted_1$8 = { class: "flex items-center gap-x-2" };
const _hoisted_2$4 = ["onClick"];
const _sfc_main$c = /* @__PURE__ */ defineComponent({
  __name: "ScreenSelector",
  emits: ["close"],
  setup(__props) {
    const screenId = useStateFlow(ScreenManager$1.currentId);
    const screenSource = [
      {
        name: "Lazer! Home",
        id: "main"
      },
      {
        name: "Background Preview",
        id: "second"
      },
      {
        name: "Test",
        id: "test"
      },
      {
        name: "Stable! Home",
        id: "legacy"
      },
      {
        name: "Storyboard",
        id: "story"
      },
      {
        name: "LegacyPlay",
        id: "legacyPlay"
      }
    ];
    function changeScreen(id2) {
      ScreenManager$1.activeScreen(id2);
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "screen-box h-full absolute left-0 flex items-center",
        onMouseleave: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("close"))
      }, [
        createBaseVNode("div", {
          class: "w-60 p-1 bg-[--bpm-color-3] rounded-r-md",
          onMouseleave: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("close"))
        }, [
          (openBlock(), createElementBlock(Fragment, null, renderList(screenSource, (item) => {
            return createBaseVNode("div", _hoisted_1$8, [
              createBaseVNode("div", {
                class: "w-4 rounded-full bg-[--bpm-color-11] aspect-square",
                style: normalizeStyle({
                  backgroundColor: item.id === unref(screenId) ? "var(--bpm-color-11)" : "transparent"
                })
              }, null, 4),
              createBaseVNode("span", {
                class: "rounded-md w-full px-4 py-2 text-white hover:bg-[--bpm-color-6] cursor-pointer",
                onClick: ($event) => changeScreen(item.id)
              }, toDisplayString(item.name), 9, _hoisted_2$4)
            ]);
          }), 64))
        ], 32)
      ], 32);
    };
  }
});
const ScreenSelector_vue_vue_type_style_index_0_scoped_3ae1c242_lang = "";
const ScreenSelector = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["__scopeId", "data-v-3ae1c242"]]);
const _sfc_main$b = /* @__PURE__ */ defineComponent({
  __name: "SideButton",
  emits: ["sideClick"],
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "absolute h-full w-1 bg-white opacity-0 hover:opacity-20 left-0 transition",
        onMouseenter: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("sideClick"))
      }, null, 32);
    };
  }
});
const _hoisted_1$7 = { class: "mask-box" };
const _sfc_main$a = /* @__PURE__ */ defineComponent({
  __name: "Mask",
  setup(__props) {
    onMounted(() => {
      MouseEventFire.pause();
    });
    onUnmounted(() => {
      MouseEventFire.resume();
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$7);
    };
  }
});
const Mask_vue_vue_type_style_index_0_scoped_aac9c921_lang = "";
const Mask = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__scopeId", "data-v-aac9c921"]]);
const _hoisted_1$6 = { class: "osu-panel-box no-scroller" };
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "OSUPanel",
  props: {
    themeColor: {},
    panelId: {}
  },
  setup(__props) {
    useCssVars((_ctx) => ({
      "192fe558": unref(zIndex)
    }));
    const zIndex = OSUPanelStack.panelZIndex;
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$6, [
        renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ]);
    };
  }
});
const OSUPanel_vue_vue_type_style_index_0_scoped_a1367280_lang = "";
const OSUPanel = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__scopeId", "data-v-a1367280"]]);
const _hoisted_1$5 = /* @__PURE__ */ createBaseVNode("span", { class: "text-white text-xl" }, " 铺面列表 ", -1);
const _hoisted_2$3 = { style: { "color": "#ffffff80" } };
const _hoisted_3$2 = { class: "text-[16px]" };
const _hoisted_4$2 = {
  style: { "font-size": "12px" },
  class: "text-yellow-400"
};
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "BeatmapListPanel",
  setup(__props) {
    const theme = Color.fromHex(0);
    const files = TempOSUPlayManager$1.list;
    if (files.value.length === 0) {
      showBeatmapList();
    }
    async function showBeatmapList() {
      const handle = await window.showDirectoryPicker({ id: beatmapDirectoryId });
      const list2 = [];
      for await (const fileHandle of handle.values()) {
        const file = await fileHandle.getFile();
        list2.push(file);
      }
      files.value = list2.sort((a, b) => {
        return b.lastModified - a.lastModified;
      });
    }
    const play = (file, index) => {
      TempOSUPlayManager$1.playAt(index, true);
    };
    function close() {
      OSUPanelStack.pop();
    }
    return (_ctx, _cache) => {
      const _directive_osu_button = resolveDirective("osu-button");
      return openBlock(), createBlock(OSUPanel, {
        "panel-id": "beatmapList",
        "theme-color": unref(theme)
      }, {
        default: withCtx(() => [
          createVNode(Column, {
            class: "bg-green-950 w-full h-full",
            gap: 16
          }, {
            default: withCtx(() => [
              createVNode(Row, {
                class: "w-full bg-green-900 p-4",
                "center-vertical": ""
              }, {
                default: withCtx(() => [
                  _hoisted_1$5,
                  createVNode(Row, {
                    class: "ml-auto",
                    gap: 16
                  }, {
                    default: withCtx(() => [
                      withDirectives((openBlock(), createBlock(_sfc_main$o, {
                        color: unref(Color).fromRGB(20, 83, 45),
                        "apply-scale": false,
                        onClick: _cache[0] || (_cache[0] = ($event) => showBeatmapList()),
                        class: "text-white py-2 px-3 rounded-md text-sm"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" 重新选择 ")
                        ]),
                        _: 1
                      }, 8, ["color"])), [
                        [_directive_osu_button]
                      ]),
                      createVNode(_sfc_main$o, {
                        color: unref(Color).fromRGB(20, 83, 45),
                        "apply-scale": false,
                        class: "ma text-white p-2 rounded-md",
                        style: { "font-size": "24px" },
                        onClick: _cache[1] || (_cache[1] = ($event) => close())
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(unref(Icon).Close), 1)
                        ]),
                        _: 1
                      }, 8, ["color"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(Column, { class: "fill-width flex-grow overflow-y-scroll no-scroller px-4 pb-4" }, {
                default: withCtx(() => [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(unref(files), (item, index) => {
                    return withDirectives((openBlock(), createBlock(_sfc_main$o, {
                      color: unref(Color).fromRGB(5, 46, 22),
                      class: "w-full p-3 rounded-md text-white hover:text-yellow-400",
                      onClick: ($event) => play(item, index)
                    }, {
                      default: withCtx(() => [
                        createVNode(Row, {
                          gap: 16,
                          "center-vertical": "",
                          class: "w-full"
                        }, {
                          default: withCtx(() => [
                            createBaseVNode("span", _hoisted_2$3, toDisplayString(index + 1), 1),
                            createVNode(Column, {
                              class: "w-full",
                              gap: 4,
                              left: ""
                            }, {
                              default: withCtx(() => [
                                createBaseVNode("span", _hoisted_3$2, toDisplayString(item.name), 1),
                                createBaseVNode("span", _hoisted_4$2, toDisplayString((item.size / 1024 / 1024).toFixed(2)) + " MB ", 1)
                              ]),
                              _: 2
                            }, 1024)
                          ]),
                          _: 2
                        }, 1024)
                      ]),
                      _: 2
                    }, 1032, ["color", "onClick"])), [
                      [_directive_osu_button]
                    ]);
                  }), 256))
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["theme-color"]);
    };
  }
});
const _withScopeId = (n) => (pushScopeId("data-v-9a7d137b"), n = n(), popScopeId(), n);
const _hoisted_1$4 = { class: "ma" };
const _hoisted_2$2 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("span", { class: "text-xl" }, "铺面信息", -1));
const _hoisted_3$1 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("span", { class: "ml-0.5" }, "Info", -1));
const _hoisted_4$1 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("div", { class: "absolute w-8 h-1 bg-cyan-200 self-end" }, null, -1));
const _hoisted_5$1 = {
  class: "w-full",
  style: { "height": "384px" }
};
const _hoisted_6$1 = { class: "font-bold text-3xl" };
const _hoisted_7 = { class: "text-xl" };
const _hoisted_8 = { class: "font-light" };
const _hoisted_9 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("div", null, "视频", -1));
const _hoisted_10 = { class: "ma" };
const _hoisted_11 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("div", null, "故事板", -1));
const _hoisted_12 = { class: "ma" };
const _hoisted_13 = {
  class: "p-4",
  style: { "background-color": "#00000080" }
};
const _hoisted_14 = {
  class: "w-full",
  style: { "font-size": "12px" }
};
const _hoisted_15 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("td", {
  class: "text-white font-light",
  style: { "font-size": "12px" }
}, [
  /* @__PURE__ */ createBaseVNode("div", { class: "w-20" }, "Key Count")
], -1));
const _hoisted_16 = { class: "text-white w-full px-4" };
const _hoisted_17 = {
  class: "w-full h-1 rounded-md",
  style: { "background-color": "#ffffff80" }
};
const _hoisted_18 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("td", { class: "text-white font-light" }, "4", -1));
const _hoisted_19 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("td", {
  class: "text-white font-light",
  style: { "font-size": "12px" }
}, [
  /* @__PURE__ */ createBaseVNode("div", { class: "w-20" }, "HP Drain")
], -1));
const _hoisted_20 = { class: "text-white w-full px-4" };
const _hoisted_21 = {
  class: "w-full h-1 rounded-md",
  style: { "background-color": "#ffffff80" }
};
const _hoisted_22 = { class: "text-white font-light" };
const _hoisted_23 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("td", {
  class: "text-white font-light",
  style: { "font-size": "12px" }
}, [
  /* @__PURE__ */ createBaseVNode("div", { class: "w-20" }, "Approach Rate")
], -1));
const _hoisted_24 = { class: "text-white w-full px-4" };
const _hoisted_25 = {
  class: "w-full h-1 rounded-md",
  style: { "background-color": "#ffffff80" }
};
const _hoisted_26 = { class: "text-white font-light" };
const _hoisted_27 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("td", { class: "text-white font-light" }, [
  /* @__PURE__ */ createBaseVNode("div", { class: "w-20" }, "Star Rate")
], -1));
const _hoisted_28 = { class: "text-white w-full px-4" };
const _hoisted_29 = {
  class: "w-full h-1 rounded-md",
  style: { "background-color": "#ffffff80" }
};
const _hoisted_30 = { class: "text-white font-light" };
const _hoisted_31 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("span", { class: "font-bold text-white mb-3" }, "Source", -1));
const _hoisted_32 = { class: "flex-wrap text-white" };
const _hoisted_33 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("span", { class: "font-bold text-white mb-3" }, "Tags", -1));
const _hoisted_34 = {
  class: "flex-wrap text-white",
  style: { "font-size": "12px" }
};
const _hoisted_35 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("span", { class: "text-white font-light ml-2" }, "Difficulty", -1));
const _hoisted_36 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("div", { class: "absolute w-20 h-1 bg-cyan-200 self-end" }, null, -1));
const _hoisted_37 = { class: "beatmap-list" };
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "BeatmapDetailsPanel",
  setup(__props) {
    const info = reactive({
      title: "",
      artist: "",
      creator: "",
      startRate: 0,
      hpDrain: 0,
      approachRate: 0,
      beatmapID: "",
      beatmapSetID: "",
      source: "",
      tags: "",
      bpm: "-"
    });
    const events = reactive({
      hasStoryboard: false,
      hasVideo: false
    });
    const url2 = ref(defaultImage);
    const list2 = ref([]);
    watch(OSUPlayer$1.currentOSZFile, (value, oldValue, onCleanup) => {
      var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
      if (!value || !value.osuFileList || value.osuFileList.length === 0) {
        return;
      }
      const osu = OSUPlayer$1.currentOSUFile.value;
      onCleanup(() => {
        if (url2.value !== defaultImage) {
          url2.value && URL.revokeObjectURL(url2.value);
        }
      });
      const bg = (_a2 = osu.Events) == null ? void 0 : _a2.imageBackground;
      if (bg && value.hasImage(bg)) {
        url2.value = URL.createObjectURL(value.getImageBlob(bg));
      }
      info.approachRate = ((_b = osu == null ? void 0 : osu.Difficulty) == null ? void 0 : _b.ApproachRate) ?? 0;
      info.hpDrain = ((_c = osu == null ? void 0 : osu.Difficulty) == null ? void 0 : _c.HPDrainRate) ?? 0;
      info.startRate = ((_d = osu == null ? void 0 : osu.Difficulty) == null ? void 0 : _d.OverallDifficulty) ?? 0;
      info.title = ((_e = osu == null ? void 0 : osu.Metadata) == null ? void 0 : _e.TitleUnicode) ?? "";
      info.artist = ((_f = osu == null ? void 0 : osu.Metadata) == null ? void 0 : _f.ArtistUnicode) ?? "";
      if (info.title === "")
        info.title = ((_g = osu == null ? void 0 : osu.Metadata) == null ? void 0 : _g.Title) ?? "";
      if (info.artist === "")
        info.artist = ((_h = osu == null ? void 0 : osu.Metadata) == null ? void 0 : _h.Artist) ?? "";
      info.creator = ((_i = osu == null ? void 0 : osu.Metadata) == null ? void 0 : _i.Creator) ?? "";
      info.beatmapID = ((_j = osu == null ? void 0 : osu.Metadata) == null ? void 0 : _j.BeatmapID) ?? "";
      info.beatmapSetID = ((_k = osu == null ? void 0 : osu.Metadata) == null ? void 0 : _k.BeatmapSetID) ?? "";
      info.source = ((_l = osu == null ? void 0 : osu.Metadata) == null ? void 0 : _l.Source) ?? "";
      info.tags = ((_m = osu == null ? void 0 : osu.Metadata) == null ? void 0 : _m.Tags) ?? "";
      handleOsuFiles(value.osuFileList);
      if (osu.TimingPoints) {
        calculateBPM(osu.TimingPoints);
      }
      events.hasVideo = !!((_n = osu.Events) == null ? void 0 : _n.videoBackground);
      events.hasStoryboard = value.osbFile.sprites.length > 0;
    }, { immediate: true });
    function handleOsuFiles(files) {
      list2.value = files.map((file) => ({ name: file.name }));
    }
    function calculateBPM(timingPoints) {
      const list22 = timingPoints.timingList;
      if (!list22 || list22.length === 0) {
        return;
      }
      const maxBeatLength = ArrayUtils.maxOf(list22, (v) => v.beatLength);
      let minBeatLength = ArrayUtils.minOf(list22, (v) => v.beatLength);
      if (minBeatLength <= 0) {
        minBeatLength = maxBeatLength;
      }
      const minBPM = (1e3 * 60 / maxBeatLength).toFixed(2);
      const maxBPM = (1e3 * 60 / minBeatLength).toFixed(2);
      if (minBPM === maxBPM) {
        info.bpm = minBPM;
      } else {
        info.bpm = `${minBPM} ~ ${maxBPM}`;
      }
    }
    const currentDuration = computed(() => {
      const time = OSUPlayer$1.duration.value / 1e3;
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
    });
    onUnmounted(() => {
      if (url2.value !== defaultImage) {
        url2.value && URL.revokeObjectURL(url2.value);
      }
    });
    function close() {
      OSUPanelStack.pop();
    }
    function jumpToBeatmapDetails() {
      try {
        parseInt(info.beatmapSetID);
      } catch (e) {
        return;
      }
      if (info.beatmapSetID.length > 0) {
        window.open(`https://osu.ppy.sh/beatmapsets/${info.beatmapSetID}`, "_blank");
      }
    }
    return (_ctx, _cache) => {
      const _directive_osu_button = resolveDirective("osu-button");
      return openBlock(), createBlock(OSUPanel, {
        "panel-id": "beatmapDetails",
        "theme-color": unref(Color).fromHex(0)
      }, {
        default: withCtx(() => [
          createVNode(Column, { class: "bg-cyan-950 w-full h-fit" }, {
            default: withCtx(() => [
              createVNode(Row, {
                class: "w-full bg-cyan-700 text-white py-2 px-4",
                gap: 8,
                "center-vertical": ""
              }, {
                default: withCtx(() => [
                  createBaseVNode("span", _hoisted_1$4, toDisplayString(unref(Icon).InfoOutline), 1),
                  _hoisted_2$2,
                  createBaseVNode("button", {
                    class: "ma ml-auto hover:bg-cyan-600 transition active:bg-cyan-500 rounded-md p-3",
                    onClick: _cache[0] || (_cache[0] = ($event) => close())
                  }, toDisplayString(unref(Icon).Close), 1)
                ]),
                _: 1
              }),
              createVNode(Row, {
                class: "w-full bg-cyan-800 text-white px-4",
                style: { "height": "48px" }
              }, {
                default: withCtx(() => [
                  createVNode(Row, {
                    class: "font-light h-full",
                    "center-vertical": ""
                  }, {
                    default: withCtx(() => [
                      _hoisted_3$1,
                      _hoisted_4$1
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createBaseVNode("div", _hoisted_5$1, [
                createBaseVNode("div", {
                  class: "w-full overflow-clip h-full bg-black bg-no-repeat",
                  style: normalizeStyle([{ backgroundImage: `url(${url2.value})` }, { "background-size": "cover", "background-position-y": "10%" }])
                }, [
                  createVNode(Row, {
                    class: "w-full h-full justify-between",
                    style: { "background-color": "#00000040" }
                  }, {
                    default: withCtx(() => [
                      createVNode(Column, {
                        class: "h-full text-white p-8",
                        bottom: "",
                        gap: 16
                      }, {
                        default: withCtx(() => [
                          createBaseVNode("span", _hoisted_6$1, toDisplayString(info.title), 1),
                          createBaseVNode("span", _hoisted_7, toDisplayString(info.artist), 1),
                          createBaseVNode("span", _hoisted_8, "mapped by " + toDisplayString(info.creator), 1),
                          createVNode(Row, {
                            class: "w-full",
                            gap: 32
                          }, {
                            default: withCtx(() => [
                              withDirectives((openBlock(), createBlock(_sfc_main$o, {
                                color: unref(Color).fromRGB(2, 132, 199),
                                "apply-scale": false,
                                class: "text-white p-4 rounded-md w-fit",
                                onClick: _cache[1] || (_cache[1] = ($event) => jumpToBeatmapDetails())
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(" 跳转到官网 ")
                                ]),
                                _: 1
                              }, 8, ["color"])), [
                                [_directive_osu_button]
                              ]),
                              events.hasVideo ? withDirectives((openBlock(), createBlock(_sfc_main$o, {
                                key: 0,
                                color: unref(Color).fromRGB(2, 132, 199),
                                "apply-scale": false,
                                class: "text-white rounded-full w-fit px-8"
                              }, {
                                default: withCtx(() => [
                                  createVNode(Row, {
                                    "center-vertical": "",
                                    gap: 16
                                  }, {
                                    default: withCtx(() => [
                                      _hoisted_9,
                                      createTextVNode(),
                                      createBaseVNode("div", _hoisted_10, toDisplayString(unref(Icon).Movie), 1)
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }, 8, ["color"])), [
                                [_directive_osu_button]
                              ]) : createCommentVNode("", true),
                              events.hasStoryboard ? withDirectives((openBlock(), createBlock(_sfc_main$o, {
                                key: 1,
                                color: unref(Color).fromRGB(2, 132, 199),
                                "apply-scale": false,
                                class: "text-white rounded-full w-fit px-8"
                              }, {
                                default: withCtx(() => [
                                  createVNode(Row, {
                                    "center-vertical": "",
                                    gap: 16
                                  }, {
                                    default: withCtx(() => [
                                      _hoisted_11,
                                      createTextVNode(),
                                      createBaseVNode("div", _hoisted_12, toDisplayString(unref(Icon).Image), 1)
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }, 8, ["color"])), [
                                [_directive_osu_button]
                              ]) : createCommentVNode("", true)
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(Column, {
                        class: "right-0 w-96 self-end pr-8",
                        gap: 1
                      }, {
                        default: withCtx(() => [
                          createVNode(Row, {
                            class: "text-yellow-500 justify-evenly w-full font-bold py-4",
                            style: { "font-size": "12px", "background-color": "#00000080" }
                          }, {
                            default: withCtx(() => [
                              createBaseVNode("span", null, toDisplayString(currentDuration.value), 1),
                              createBaseVNode("span", null, toDisplayString(info.bpm), 1)
                            ]),
                            _: 1
                          }),
                          createBaseVNode("div", _hoisted_13, [
                            createBaseVNode("table", _hoisted_14, [
                              createBaseVNode("tr", null, [
                                _hoisted_15,
                                createBaseVNode("td", _hoisted_16, [
                                  createBaseVNode("div", _hoisted_17, [
                                    createBaseVNode("div", {
                                      class: "w-full h-full bg-white transition origin-left",
                                      style: normalizeStyle({ transform: `scaleX(${1})` })
                                    }, null, 4)
                                  ])
                                ]),
                                _hoisted_18
                              ]),
                              createBaseVNode("tr", null, [
                                _hoisted_19,
                                createBaseVNode("td", _hoisted_20, [
                                  createBaseVNode("div", _hoisted_21, [
                                    createBaseVNode("div", {
                                      class: "w-full h-full bg-white transition origin-left",
                                      style: normalizeStyle({ transform: `scaleX(${info.hpDrain / 10})` })
                                    }, null, 4)
                                  ])
                                ]),
                                createBaseVNode("td", _hoisted_22, toDisplayString(info.hpDrain.toFixed(2)), 1)
                              ]),
                              createBaseVNode("tr", null, [
                                _hoisted_23,
                                createBaseVNode("td", _hoisted_24, [
                                  createBaseVNode("div", _hoisted_25, [
                                    createBaseVNode("div", {
                                      class: "w-full h-full bg-white transition origin-left",
                                      style: normalizeStyle({ transform: `scaleX(${info.approachRate / 10})` })
                                    }, null, 4)
                                  ])
                                ]),
                                createBaseVNode("td", _hoisted_26, toDisplayString(info.approachRate.toFixed(2)), 1)
                              ]),
                              createBaseVNode("tr", null, [
                                _hoisted_27,
                                createBaseVNode("td", _hoisted_28, [
                                  createBaseVNode("div", _hoisted_29, [
                                    createBaseVNode("div", {
                                      class: "w-full h-full bg-white transition origin-left",
                                      style: normalizeStyle({ transform: `scaleX(${info.startRate / 10})` })
                                    }, null, 4)
                                  ])
                                ]),
                                createBaseVNode("td", _hoisted_30, toDisplayString(info.startRate.toFixed(2)), 1)
                              ])
                            ])
                          ])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ], 4)
              ]),
              createVNode(Row, {
                class: "w-full p-8 bg-cyan-900 overflow-y-hidden mt-2",
                style: { "height": "240px" },
                gap: 16
              }, {
                default: withCtx(() => [
                  createVNode(Column, { class: "w-1/4" }, {
                    default: withCtx(() => [
                      _hoisted_31,
                      createBaseVNode("span", _hoisted_32, toDisplayString(info.source), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(Column, { class: "w-1/4" }, {
                    default: withCtx(() => [
                      _hoisted_33,
                      createBaseVNode("span", _hoisted_34, toDisplayString(info.tags), 1)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(Column, { class: "w-full h-fit mt-2" }, {
                default: withCtx(() => [
                  createVNode(Row, {
                    class: "w-full bg-cyan-900 h-14 px-4",
                    "center-vertical": ""
                  }, {
                    default: withCtx(() => [
                      _hoisted_35,
                      _hoisted_36
                    ]),
                    _: 1
                  }),
                  createBaseVNode("div", _hoisted_37, [
                    (openBlock(true), createElementBlock(Fragment, null, renderList(list2.value, (item) => {
                      return withDirectives((openBlock(), createBlock(_sfc_main$o, {
                        color: unref(Color).fromRGB(8, 145, 178),
                        "apply-scale": false,
                        class: "beatmap-list-item"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(item.name.substring(0, item.name.length - 4)), 1)
                        ]),
                        _: 2
                      }, 1032, ["color"])), [
                        [_directive_osu_button]
                      ]);
                    }), 256))
                  ])
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["theme-color"]);
    };
  }
});
const BeatmapDetailsPanel_vue_vue_type_style_index_0_scoped_9a7d137b_lang = "";
const BeatmapDetailsPanel = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-9a7d137b"]]);
const decodeCache = {};
function getDecodeCache(exclude) {
  let cache = decodeCache[exclude];
  if (cache) {
    return cache;
  }
  cache = decodeCache[exclude] = [];
  for (let i = 0; i < 128; i++) {
    const ch = String.fromCharCode(i);
    cache.push(ch);
  }
  for (let i = 0; i < exclude.length; i++) {
    const ch = exclude.charCodeAt(i);
    cache[ch] = "%" + ("0" + ch.toString(16).toUpperCase()).slice(-2);
  }
  return cache;
}
function decode$1(string, exclude) {
  if (typeof exclude !== "string") {
    exclude = decode$1.defaultChars;
  }
  const cache = getDecodeCache(exclude);
  return string.replace(/(%[a-f0-9]{2})+/gi, function(seq) {
    let result = "";
    for (let i = 0, l = seq.length; i < l; i += 3) {
      const b1 = parseInt(seq.slice(i + 1, i + 3), 16);
      if (b1 < 128) {
        result += cache[b1];
        continue;
      }
      if ((b1 & 224) === 192 && i + 3 < l) {
        const b2 = parseInt(seq.slice(i + 4, i + 6), 16);
        if ((b2 & 192) === 128) {
          const chr = b1 << 6 & 1984 | b2 & 63;
          if (chr < 128) {
            result += "��";
          } else {
            result += String.fromCharCode(chr);
          }
          i += 3;
          continue;
        }
      }
      if ((b1 & 240) === 224 && i + 6 < l) {
        const b2 = parseInt(seq.slice(i + 4, i + 6), 16);
        const b3 = parseInt(seq.slice(i + 7, i + 9), 16);
        if ((b2 & 192) === 128 && (b3 & 192) === 128) {
          const chr = b1 << 12 & 61440 | b2 << 6 & 4032 | b3 & 63;
          if (chr < 2048 || chr >= 55296 && chr <= 57343) {
            result += "���";
          } else {
            result += String.fromCharCode(chr);
          }
          i += 6;
          continue;
        }
      }
      if ((b1 & 248) === 240 && i + 9 < l) {
        const b2 = parseInt(seq.slice(i + 4, i + 6), 16);
        const b3 = parseInt(seq.slice(i + 7, i + 9), 16);
        const b4 = parseInt(seq.slice(i + 10, i + 12), 16);
        if ((b2 & 192) === 128 && (b3 & 192) === 128 && (b4 & 192) === 128) {
          let chr = b1 << 18 & 1835008 | b2 << 12 & 258048 | b3 << 6 & 4032 | b4 & 63;
          if (chr < 65536 || chr > 1114111) {
            result += "����";
          } else {
            chr -= 65536;
            result += String.fromCharCode(55296 + (chr >> 10), 56320 + (chr & 1023));
          }
          i += 9;
          continue;
        }
      }
      result += "�";
    }
    return result;
  });
}
decode$1.defaultChars = ";/?:@&=+$,#";
decode$1.componentChars = "";
const encodeCache = {};
function getEncodeCache(exclude) {
  let cache = encodeCache[exclude];
  if (cache) {
    return cache;
  }
  cache = encodeCache[exclude] = [];
  for (let i = 0; i < 128; i++) {
    const ch = String.fromCharCode(i);
    if (/^[0-9a-z]$/i.test(ch)) {
      cache.push(ch);
    } else {
      cache.push("%" + ("0" + i.toString(16).toUpperCase()).slice(-2));
    }
  }
  for (let i = 0; i < exclude.length; i++) {
    cache[exclude.charCodeAt(i)] = exclude[i];
  }
  return cache;
}
function encode$1(string, exclude, keepEscaped) {
  if (typeof exclude !== "string") {
    keepEscaped = exclude;
    exclude = encode$1.defaultChars;
  }
  if (typeof keepEscaped === "undefined") {
    keepEscaped = true;
  }
  const cache = getEncodeCache(exclude);
  let result = "";
  for (let i = 0, l = string.length; i < l; i++) {
    const code2 = string.charCodeAt(i);
    if (keepEscaped && code2 === 37 && i + 2 < l) {
      if (/^[0-9a-f]{2}$/i.test(string.slice(i + 1, i + 3))) {
        result += string.slice(i, i + 3);
        i += 2;
        continue;
      }
    }
    if (code2 < 128) {
      result += cache[code2];
      continue;
    }
    if (code2 >= 55296 && code2 <= 57343) {
      if (code2 >= 55296 && code2 <= 56319 && i + 1 < l) {
        const nextCode = string.charCodeAt(i + 1);
        if (nextCode >= 56320 && nextCode <= 57343) {
          result += encodeURIComponent(string[i] + string[i + 1]);
          i++;
          continue;
        }
      }
      result += "%EF%BF%BD";
      continue;
    }
    result += encodeURIComponent(string[i]);
  }
  return result;
}
encode$1.defaultChars = ";/?:@&=+$,-_.!~*'()#";
encode$1.componentChars = "-_.!~*'()";
function format(url2) {
  let result = "";
  result += url2.protocol || "";
  result += url2.slashes ? "//" : "";
  result += url2.auth ? url2.auth + "@" : "";
  if (url2.hostname && url2.hostname.indexOf(":") !== -1) {
    result += "[" + url2.hostname + "]";
  } else {
    result += url2.hostname || "";
  }
  result += url2.port ? ":" + url2.port : "";
  result += url2.pathname || "";
  result += url2.search || "";
  result += url2.hash || "";
  return result;
}
function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.pathname = null;
}
const protocolPattern = /^([a-z0-9.+-]+:)/i;
const portPattern = /:[0-9]*$/;
const simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/;
const delims = ["<", ">", '"', "`", " ", "\r", "\n", "	"];
const unwise = ["{", "}", "|", "\\", "^", "`"].concat(delims);
const autoEscape = ["'"].concat(unwise);
const nonHostChars = ["%", "/", "?", ";", "#"].concat(autoEscape);
const hostEndingChars = ["/", "?", "#"];
const hostnameMaxLen = 255;
const hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/;
const hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/;
const hostlessProtocol = {
  javascript: true,
  "javascript:": true
};
const slashedProtocol = {
  http: true,
  https: true,
  ftp: true,
  gopher: true,
  file: true,
  "http:": true,
  "https:": true,
  "ftp:": true,
  "gopher:": true,
  "file:": true
};
function urlParse(url2, slashesDenoteHost) {
  if (url2 && url2 instanceof Url)
    return url2;
  const u = new Url();
  u.parse(url2, slashesDenoteHost);
  return u;
}
Url.prototype.parse = function(url2, slashesDenoteHost) {
  let lowerProto, hec, slashes;
  let rest = url2;
  rest = rest.trim();
  if (!slashesDenoteHost && url2.split("#").length === 1) {
    const simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
      }
      return this;
    }
  }
  let proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    lowerProto = proto.toLowerCase();
    this.protocol = proto;
    rest = rest.substr(proto.length);
  }
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    slashes = rest.substr(0, 2) === "//";
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }
  if (!hostlessProtocol[proto] && (slashes || proto && !slashedProtocol[proto])) {
    let hostEnd = -1;
    for (let i = 0; i < hostEndingChars.length; i++) {
      hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) {
        hostEnd = hec;
      }
    }
    let auth, atSign;
    if (hostEnd === -1) {
      atSign = rest.lastIndexOf("@");
    } else {
      atSign = rest.lastIndexOf("@", hostEnd);
    }
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = auth;
    }
    hostEnd = -1;
    for (let i = 0; i < nonHostChars.length; i++) {
      hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) {
        hostEnd = hec;
      }
    }
    if (hostEnd === -1) {
      hostEnd = rest.length;
    }
    if (rest[hostEnd - 1] === ":") {
      hostEnd--;
    }
    const host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);
    this.parseHost(host);
    this.hostname = this.hostname || "";
    const ipv6Hostname = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
    if (!ipv6Hostname) {
      const hostparts = this.hostname.split(/\./);
      for (let i = 0, l = hostparts.length; i < l; i++) {
        const part = hostparts[i];
        if (!part) {
          continue;
        }
        if (!part.match(hostnamePartPattern)) {
          let newpart = "";
          for (let j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              newpart += "x";
            } else {
              newpart += part[j];
            }
          }
          if (!newpart.match(hostnamePartPattern)) {
            const validParts = hostparts.slice(0, i);
            const notHost = hostparts.slice(i + 1);
            const bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = notHost.join(".") + rest;
            }
            this.hostname = validParts.join(".");
            break;
          }
        }
      }
    }
    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = "";
    }
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
    }
  }
  const hash = rest.indexOf("#");
  if (hash !== -1) {
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  const qm = rest.indexOf("?");
  if (qm !== -1) {
    this.search = rest.substr(qm);
    rest = rest.slice(0, qm);
  }
  if (rest) {
    this.pathname = rest;
  }
  if (slashedProtocol[lowerProto] && this.hostname && !this.pathname) {
    this.pathname = "";
  }
  return this;
};
Url.prototype.parseHost = function(host) {
  let port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ":") {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) {
    this.hostname = host;
  }
};
const mdurl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  decode: decode$1,
  encode: encode$1,
  format,
  parse: urlParse
}, Symbol.toStringTag, { value: "Module" }));
const Any = /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
const Cc = /[\0-\x1F\x7F-\x9F]/;
const regex$1 = /[\xAD\u0600-\u0605\u061C\u06DD\u070F\u0890\u0891\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804[\uDCBD\uDCCD]|\uD80D[\uDC30-\uDC3F]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/;
const P = /[!-#%-\*,-\/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061D-\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1B7D\u1B7E\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52-\u2E5D\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDEAD\uDF55-\uDF59\uDF86-\uDF89]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDC4B-\uDC4F\uDC5A\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDEB9\uDF3C-\uDF3E]|\uD806[\uDC3B\uDD44-\uDD46\uDDE2\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2\uDF00-\uDF09]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8\uDF43-\uDF4F\uDFFF]|\uD809[\uDC70-\uDC74]|\uD80B[\uDFF1\uDFF2]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDE97-\uDE9A\uDFE2]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD83A[\uDD5E\uDD5F]/;
const regex = /[\$\+<->\^`\|~\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058D-\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u07FE\u07FF\u0888\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D4F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u166D\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20C0\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2307\u230C-\u2328\u232B-\u2426\u2440-\u244A\u249C-\u24E9\u2500-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B73\u2B76-\u2B95\u2B97-\u2BFF\u2CE5-\u2CEA\u2E50\u2E51\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFF\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E3\u31EF\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uAB5B\uAB6A\uAB6B\uFB29\uFBB2-\uFBC2\uFD40-\uFD4F\uFDCF\uFDFC-\uFDFF\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\uD805\uDF3F|\uD807[\uDFD5-\uDFF1]|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD82F\uDC9C|\uD833[\uDF50-\uDFC3]|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDEA\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD838[\uDD4F\uDEFF]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED7\uDEDC-\uDEEC\uDEF0-\uDEFC\uDF00-\uDF76\uDF7B-\uDFD9\uDFE0-\uDFEB\uDFF0]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0\uDCB1\uDD00-\uDE53\uDE60-\uDE6D\uDE70-\uDE7C\uDE80-\uDE88\uDE90-\uDEBD\uDEBF-\uDEC5\uDECE-\uDEDB\uDEE0-\uDEE8\uDEF0-\uDEF8\uDF00-\uDF92\uDF94-\uDFCA]/;
const Z = /[ \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/;
const ucmicro = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Any,
  Cc,
  Cf: regex$1,
  P,
  S: regex,
  Z
}, Symbol.toStringTag, { value: "Module" }));
const htmlDecodeTree = new Uint16Array(
  // prettier-ignore
  'ᵁ<Õıʊҝջאٵ۞ޢߖࠏ੊ઑඡ๭༉༦჊ረዡᐕᒝᓃᓟᔥ\0\0\0\0\0\0ᕫᛍᦍᰒᷝ὾⁠↰⊍⏀⏻⑂⠤⤒ⴈ⹈⿎〖㊺㘹㞬㣾㨨㩱㫠㬮ࠀEMabcfglmnoprstu\\bfms¦³¹ÈÏlig耻Æ䃆P耻&䀦cute耻Á䃁reve;䄂Āiyx}rc耻Â䃂;䐐r;쀀𝔄rave耻À䃀pha;䎑acr;䄀d;橓Āgp¡on;䄄f;쀀𝔸plyFunction;恡ing耻Å䃅Ācs¾Ãr;쀀𝒜ign;扔ilde耻Ã䃃ml耻Ä䃄ЀaceforsuåûþėĜĢħĪĀcrêòkslash;或Ŷöø;櫧ed;挆y;䐑ƀcrtąċĔause;戵noullis;愬a;䎒r;쀀𝔅pf;쀀𝔹eve;䋘còēmpeq;扎܀HOacdefhilorsuōőŖƀƞƢƵƷƺǜȕɳɸɾcy;䐧PY耻©䂩ƀcpyŝŢźute;䄆Ā;iŧŨ拒talDifferentialD;慅leys;愭ȀaeioƉƎƔƘron;䄌dil耻Ç䃇rc;䄈nint;戰ot;䄊ĀdnƧƭilla;䂸terDot;䂷òſi;䎧rcleȀDMPTǇǋǑǖot;抙inus;抖lus;投imes;抗oĀcsǢǸkwiseContourIntegral;戲eCurlyĀDQȃȏoubleQuote;思uote;怙ȀlnpuȞȨɇɕonĀ;eȥȦ户;橴ƀgitȯȶȺruent;扡nt;戯ourIntegral;戮ĀfrɌɎ;愂oduct;成nterClockwiseContourIntegral;戳oss;樯cr;쀀𝒞pĀ;Cʄʅ拓ap;才րDJSZacefiosʠʬʰʴʸˋ˗ˡ˦̳ҍĀ;oŹʥtrahd;椑cy;䐂cy;䐅cy;䐏ƀgrsʿ˄ˇger;怡r;憡hv;櫤Āayː˕ron;䄎;䐔lĀ;t˝˞戇a;䎔r;쀀𝔇Āaf˫̧Ācm˰̢riticalȀADGT̖̜̀̆cute;䂴oŴ̋̍;䋙bleAcute;䋝rave;䁠ilde;䋜ond;拄ferentialD;慆Ѱ̽\0\0\0͔͂\0Ѕf;쀀𝔻ƀ;DE͈͉͍䂨ot;惜qual;扐blèCDLRUVͣͲ΂ϏϢϸontourIntegraìȹoɴ͹\0\0ͻ»͉nArrow;懓Āeo·ΤftƀARTΐΖΡrrow;懐ightArrow;懔eåˊngĀLRΫτeftĀARγιrrow;柸ightArrow;柺ightArrow;柹ightĀATϘϞrrow;懒ee;抨pɁϩ\0\0ϯrrow;懑ownArrow;懕erticalBar;戥ǹABLRTaВЪаўѿͼrrowƀ;BUНОТ憓ar;椓pArrow;懵reve;䌑eft˒к\0ц\0ѐightVector;楐eeVector;楞ectorĀ;Bљњ憽ar;楖ightǔѧ\0ѱeeVector;楟ectorĀ;BѺѻ懁ar;楗eeĀ;A҆҇护rrow;憧ĀctҒҗr;쀀𝒟rok;䄐ࠀNTacdfglmopqstuxҽӀӄӋӞӢӧӮӵԡԯԶՒ՝ՠեG;䅊H耻Ð䃐cute耻É䃉ƀaiyӒӗӜron;䄚rc耻Ê䃊;䐭ot;䄖r;쀀𝔈rave耻È䃈ement;戈ĀapӺӾcr;䄒tyɓԆ\0\0ԒmallSquare;旻erySmallSquare;斫ĀgpԦԪon;䄘f;쀀𝔼silon;䎕uĀaiԼՉlĀ;TՂՃ橵ilde;扂librium;懌Āci՗՚r;愰m;橳a;䎗ml耻Ë䃋Āipժկsts;戃onentialE;慇ʀcfiosօֈ֍ֲ׌y;䐤r;쀀𝔉lledɓ֗\0\0֣mallSquare;旼erySmallSquare;斪Ͱֺ\0ֿ\0\0ׄf;쀀𝔽All;戀riertrf;愱cò׋؀JTabcdfgorstר׬ׯ׺؀ؒؖ؛؝أ٬ٲcy;䐃耻>䀾mmaĀ;d׷׸䎓;䏜reve;䄞ƀeiy؇،ؐdil;䄢rc;䄜;䐓ot;䄠r;쀀𝔊;拙pf;쀀𝔾eater̀EFGLSTصلَٖٛ٦qualĀ;Lؾؿ扥ess;招ullEqual;执reater;檢ess;扷lantEqual;橾ilde;扳cr;쀀𝒢;扫ЀAacfiosuڅڋږڛڞڪھۊRDcy;䐪Āctڐڔek;䋇;䁞irc;䄤r;愌lbertSpace;愋ǰگ\0ڲf;愍izontalLine;攀Āctۃۅòکrok;䄦mpńېۘownHumðįqual;扏܀EJOacdfgmnostuۺ۾܃܇܎ܚܞܡܨ݄ݸދޏޕcy;䐕lig;䄲cy;䐁cute耻Í䃍Āiyܓܘrc耻Î䃎;䐘ot;䄰r;愑rave耻Ì䃌ƀ;apܠܯܿĀcgܴܷr;䄪inaryI;慈lieóϝǴ݉\0ݢĀ;eݍݎ戬Āgrݓݘral;戫section;拂isibleĀCTݬݲomma;恣imes;恢ƀgptݿރވon;䄮f;쀀𝕀a;䎙cr;愐ilde;䄨ǫޚ\0ޞcy;䐆l耻Ï䃏ʀcfosuެ޷޼߂ߐĀiyޱ޵rc;䄴;䐙r;쀀𝔍pf;쀀𝕁ǣ߇\0ߌr;쀀𝒥rcy;䐈kcy;䐄΀HJacfosߤߨ߽߬߱ࠂࠈcy;䐥cy;䐌ppa;䎚Āey߶߻dil;䄶;䐚r;쀀𝔎pf;쀀𝕂cr;쀀𝒦րJTaceflmostࠥࠩࠬࡐࡣ঳সে্਷ੇcy;䐉耻<䀼ʀcmnpr࠷࠼ࡁࡄࡍute;䄹bda;䎛g;柪lacetrf;愒r;憞ƀaeyࡗ࡜ࡡron;䄽dil;䄻;䐛Āfsࡨ॰tԀACDFRTUVarࡾࢩࢱࣦ࣠ࣼयज़ΐ४Ānrࢃ࢏gleBracket;柨rowƀ;BR࢙࢚࢞憐ar;懤ightArrow;懆eiling;挈oǵࢷ\0ࣃbleBracket;柦nǔࣈ\0࣒eeVector;楡ectorĀ;Bࣛࣜ懃ar;楙loor;挊ightĀAV࣯ࣵrrow;憔ector;楎Āerँगeƀ;AVउऊऐ抣rrow;憤ector;楚iangleƀ;BEतथऩ抲ar;槏qual;抴pƀDTVषूौownVector;楑eeVector;楠ectorĀ;Bॖॗ憿ar;楘ectorĀ;B॥०憼ar;楒ightáΜs̀EFGLSTॾঋকঝঢভqualGreater;拚ullEqual;扦reater;扶ess;檡lantEqual;橽ilde;扲r;쀀𝔏Ā;eঽা拘ftarrow;懚idot;䄿ƀnpw৔ਖਛgȀLRlr৞৷ਂਐeftĀAR০৬rrow;柵ightArrow;柷ightArrow;柶eftĀarγਊightáοightáϊf;쀀𝕃erĀLRਢਬeftArrow;憙ightArrow;憘ƀchtਾੀੂòࡌ;憰rok;䅁;扪Ѐacefiosuਗ਼੝੠੷੼અઋ઎p;椅y;䐜Ādl੥੯iumSpace;恟lintrf;愳r;쀀𝔐nusPlus;戓pf;쀀𝕄cò੶;䎜ҀJacefostuણધભીଔଙඑ඗ඞcy;䐊cute;䅃ƀaey઴હાron;䅇dil;䅅;䐝ƀgswે૰଎ativeƀMTV૓૟૨ediumSpace;怋hiĀcn૦૘ë૙eryThiî૙tedĀGL૸ଆreaterGreateòٳessLesóੈLine;䀊r;쀀𝔑ȀBnptଢନଷ଺reak;恠BreakingSpace;䂠f;愕ڀ;CDEGHLNPRSTV୕ୖ୪୼஡௫ఄ౞಄ದ೘ൡඅ櫬Āou୛୤ngruent;扢pCap;扭oubleVerticalBar;戦ƀlqxஃஊ஛ement;戉ualĀ;Tஒஓ扠ilde;쀀≂̸ists;戄reater΀;EFGLSTஶஷ஽௉௓௘௥扯qual;扱ullEqual;쀀≧̸reater;쀀≫̸ess;批lantEqual;쀀⩾̸ilde;扵umpń௲௽ownHump;쀀≎̸qual;쀀≏̸eĀfsఊధtTriangleƀ;BEచఛడ拪ar;쀀⧏̸qual;括s̀;EGLSTవశ఼ౄోౘ扮qual;扰reater;扸ess;쀀≪̸lantEqual;쀀⩽̸ilde;扴estedĀGL౨౹reaterGreater;쀀⪢̸essLess;쀀⪡̸recedesƀ;ESಒಓಛ技qual;쀀⪯̸lantEqual;拠ĀeiಫಹverseElement;戌ghtTriangleƀ;BEೋೌ೒拫ar;쀀⧐̸qual;拭ĀquೝഌuareSuĀbp೨೹setĀ;E೰ೳ쀀⊏̸qual;拢ersetĀ;Eഃആ쀀⊐̸qual;拣ƀbcpഓതൎsetĀ;Eഛഞ쀀⊂⃒qual;抈ceedsȀ;ESTലള഻െ抁qual;쀀⪰̸lantEqual;拡ilde;쀀≿̸ersetĀ;E൘൛쀀⊃⃒qual;抉ildeȀ;EFT൮൯൵ൿ扁qual;扄ullEqual;扇ilde;扉erticalBar;戤cr;쀀𝒩ilde耻Ñ䃑;䎝܀Eacdfgmoprstuvලෂ෉෕ෛ෠෧෼ขภยา฿ไlig;䅒cute耻Ó䃓Āiy෎ීrc耻Ô䃔;䐞blac;䅐r;쀀𝔒rave耻Ò䃒ƀaei෮ෲ෶cr;䅌ga;䎩cron;䎟pf;쀀𝕆enCurlyĀDQฎบoubleQuote;怜uote;怘;橔Āclวฬr;쀀𝒪ash耻Ø䃘iŬื฼de耻Õ䃕es;樷ml耻Ö䃖erĀBP๋๠Āar๐๓r;怾acĀek๚๜;揞et;掴arenthesis;揜Ҁacfhilors๿ງຊຏຒດຝະ໼rtialD;戂y;䐟r;쀀𝔓i;䎦;䎠usMinus;䂱Āipຢອncareplanåڝf;愙Ȁ;eio຺ູ໠໤檻cedesȀ;EST່້໏໚扺qual;檯lantEqual;扼ilde;找me;怳Ādp໩໮uct;戏ortionĀ;aȥ໹l;戝Āci༁༆r;쀀𝒫;䎨ȀUfos༑༖༛༟OT耻"䀢r;쀀𝔔pf;愚cr;쀀𝒬؀BEacefhiorsu༾གྷཇའཱིྦྷྪྭ႖ႩႴႾarr;椐G耻®䂮ƀcnrཎནབute;䅔g;柫rĀ;tཛྷཝ憠l;椖ƀaeyཧཬཱron;䅘dil;䅖;䐠Ā;vླྀཹ愜erseĀEUྂྙĀlq྇ྎement;戋uilibrium;懋pEquilibrium;楯r»ཹo;䎡ghtЀACDFTUVa࿁࿫࿳ဢဨၛႇϘĀnr࿆࿒gleBracket;柩rowƀ;BL࿜࿝࿡憒ar;懥eftArrow;懄eiling;按oǵ࿹\0စbleBracket;柧nǔည\0နeeVector;楝ectorĀ;Bဝသ懂ar;楕loor;挋Āerိ၃eƀ;AVဵံြ抢rrow;憦ector;楛iangleƀ;BEၐၑၕ抳ar;槐qual;抵pƀDTVၣၮၸownVector;楏eeVector;楜ectorĀ;Bႂႃ憾ar;楔ectorĀ;B႑႒懀ar;楓Āpuႛ႞f;愝ndImplies;楰ightarrow;懛ĀchႹႼr;愛;憱leDelayed;槴ڀHOacfhimoqstuფჱჷჽᄙᄞᅑᅖᅡᅧᆵᆻᆿĀCcჩხHcy;䐩y;䐨FTcy;䐬cute;䅚ʀ;aeiyᄈᄉᄎᄓᄗ檼ron;䅠dil;䅞rc;䅜;䐡r;쀀𝔖ortȀDLRUᄪᄴᄾᅉownArrow»ОeftArrow»࢚ightArrow»࿝pArrow;憑gma;䎣allCircle;战pf;쀀𝕊ɲᅭ\0\0ᅰt;戚areȀ;ISUᅻᅼᆉᆯ斡ntersection;抓uĀbpᆏᆞsetĀ;Eᆗᆘ抏qual;抑ersetĀ;Eᆨᆩ抐qual;抒nion;抔cr;쀀𝒮ar;拆ȀbcmpᇈᇛሉላĀ;sᇍᇎ拐etĀ;Eᇍᇕqual;抆ĀchᇠህeedsȀ;ESTᇭᇮᇴᇿ扻qual;檰lantEqual;扽ilde;承Tháྌ;我ƀ;esሒሓሣ拑rsetĀ;Eሜም抃qual;抇et»ሓրHRSacfhiorsሾቄ቉ቕ቞ቱቶኟዂወዑORN耻Þ䃞ADE;愢ĀHc቎ቒcy;䐋y;䐦Ābuቚቜ;䀉;䎤ƀaeyብቪቯron;䅤dil;䅢;䐢r;쀀𝔗Āeiቻ኉ǲኀ\0ኇefore;戴a;䎘Ācn኎ኘkSpace;쀀  Space;怉ldeȀ;EFTካኬኲኼ戼qual;扃ullEqual;扅ilde;扈pf;쀀𝕋ipleDot;惛Āctዖዛr;쀀𝒯rok;䅦ૡዷጎጚጦ\0ጬጱ\0\0\0\0\0ጸጽ፷ᎅ\0᏿ᐄᐊᐐĀcrዻጁute耻Ú䃚rĀ;oጇገ憟cir;楉rǣጓ\0጖y;䐎ve;䅬Āiyጞጣrc耻Û䃛;䐣blac;䅰r;쀀𝔘rave耻Ù䃙acr;䅪Ādiፁ፩erĀBPፈ፝Āarፍፐr;䁟acĀekፗፙ;揟et;掵arenthesis;揝onĀ;P፰፱拃lus;抎Āgp፻፿on;䅲f;쀀𝕌ЀADETadps᎕ᎮᎸᏄϨᏒᏗᏳrrowƀ;BDᅐᎠᎤar;椒ownArrow;懅ownArrow;憕quilibrium;楮eeĀ;AᏋᏌ报rrow;憥ownáϳerĀLRᏞᏨeftArrow;憖ightArrow;憗iĀ;lᏹᏺ䏒on;䎥ing;䅮cr;쀀𝒰ilde;䅨ml耻Ü䃜ҀDbcdefosvᐧᐬᐰᐳᐾᒅᒊᒐᒖash;披ar;櫫y;䐒ashĀ;lᐻᐼ抩;櫦Āerᑃᑅ;拁ƀbtyᑌᑐᑺar;怖Ā;iᑏᑕcalȀBLSTᑡᑥᑪᑴar;戣ine;䁼eparator;杘ilde;所ThinSpace;怊r;쀀𝔙pf;쀀𝕍cr;쀀𝒱dash;抪ʀcefosᒧᒬᒱᒶᒼirc;䅴dge;拀r;쀀𝔚pf;쀀𝕎cr;쀀𝒲Ȁfiosᓋᓐᓒᓘr;쀀𝔛;䎞pf;쀀𝕏cr;쀀𝒳ҀAIUacfosuᓱᓵᓹᓽᔄᔏᔔᔚᔠcy;䐯cy;䐇cy;䐮cute耻Ý䃝Āiyᔉᔍrc;䅶;䐫r;쀀𝔜pf;쀀𝕐cr;쀀𝒴ml;䅸ЀHacdefosᔵᔹᔿᕋᕏᕝᕠᕤcy;䐖cute;䅹Āayᕄᕉron;䅽;䐗ot;䅻ǲᕔ\0ᕛoWidtè૙a;䎖r;愨pf;愤cr;쀀𝒵௡ᖃᖊᖐ\0ᖰᖶᖿ\0\0\0\0ᗆᗛᗫᙟ᙭\0ᚕ᚛ᚲᚹ\0ᚾcute耻á䃡reve;䄃̀;Ediuyᖜᖝᖡᖣᖨᖭ戾;쀀∾̳;房rc耻â䃢te肻´̆;䐰lig耻æ䃦Ā;r²ᖺ;쀀𝔞rave耻à䃠ĀepᗊᗖĀfpᗏᗔsym;愵èᗓha;䎱ĀapᗟcĀclᗤᗧr;䄁g;樿ɤᗰ\0\0ᘊʀ;adsvᗺᗻᗿᘁᘇ戧nd;橕;橜lope;橘;橚΀;elmrszᘘᘙᘛᘞᘿᙏᙙ戠;榤e»ᘙsdĀ;aᘥᘦ戡ѡᘰᘲᘴᘶᘸᘺᘼᘾ;榨;榩;榪;榫;榬;榭;榮;榯tĀ;vᙅᙆ戟bĀ;dᙌᙍ抾;榝Āptᙔᙗh;戢»¹arr;捼Āgpᙣᙧon;䄅f;쀀𝕒΀;Eaeiop዁ᙻᙽᚂᚄᚇᚊ;橰cir;橯;扊d;手s;䀧roxĀ;e዁ᚒñᚃing耻å䃥ƀctyᚡᚦᚨr;쀀𝒶;䀪mpĀ;e዁ᚯñʈilde耻ã䃣ml耻ä䃤Āciᛂᛈoninôɲnt;樑ࠀNabcdefiklnoprsu᛭ᛱᜰ᜼ᝃᝈ᝸᝽០៦ᠹᡐᜍ᤽᥈ᥰot;櫭Ācrᛶ᜞kȀcepsᜀᜅᜍᜓong;扌psilon;䏶rime;怵imĀ;e᜚᜛戽q;拍Ŷᜢᜦee;抽edĀ;gᜬᜭ挅e»ᜭrkĀ;t፜᜷brk;掶Āoyᜁᝁ;䐱quo;怞ʀcmprtᝓ᝛ᝡᝤᝨausĀ;eĊĉptyv;榰séᜌnoõēƀahwᝯ᝱ᝳ;䎲;愶een;扬r;쀀𝔟g΀costuvwឍឝឳេ៕៛៞ƀaiuបពរðݠrc;旯p»፱ƀdptឤឨឭot;樀lus;樁imes;樂ɱឹ\0\0ើcup;樆ar;昅riangleĀdu៍្own;施p;斳plus;樄eåᑄåᒭarow;植ƀako៭ᠦᠵĀcn៲ᠣkƀlst៺֫᠂ozenge;槫riangleȀ;dlr᠒᠓᠘᠝斴own;斾eft;旂ight;斸k;搣Ʊᠫ\0ᠳƲᠯ\0ᠱ;斒;斑4;斓ck;斈ĀeoᠾᡍĀ;qᡃᡆ쀀=⃥uiv;쀀≡⃥t;挐Ȁptwxᡙᡞᡧᡬf;쀀𝕓Ā;tᏋᡣom»Ꮜtie;拈؀DHUVbdhmptuvᢅᢖᢪᢻᣗᣛᣬ᣿ᤅᤊᤐᤡȀLRlrᢎᢐᢒᢔ;敗;敔;敖;敓ʀ;DUduᢡᢢᢤᢦᢨ敐;敦;敩;敤;敧ȀLRlrᢳᢵᢷᢹ;敝;敚;敜;教΀;HLRhlrᣊᣋᣍᣏᣑᣓᣕ救;敬;散;敠;敫;敢;敟ox;槉ȀLRlrᣤᣦᣨᣪ;敕;敒;攐;攌ʀ;DUduڽ᣷᣹᣻᣽;敥;敨;攬;攴inus;抟lus;択imes;抠ȀLRlrᤙᤛᤝ᤟;敛;敘;攘;攔΀;HLRhlrᤰᤱᤳᤵᤷ᤻᤹攂;敪;敡;敞;攼;攤;攜Āevģ᥂bar耻¦䂦Ȁceioᥑᥖᥚᥠr;쀀𝒷mi;恏mĀ;e᜚᜜lƀ;bhᥨᥩᥫ䁜;槅sub;柈Ŭᥴ᥾lĀ;e᥹᥺怢t»᥺pƀ;Eeįᦅᦇ;檮Ā;qۜۛೡᦧ\0᧨ᨑᨕᨲ\0ᨷᩐ\0\0᪴\0\0᫁\0\0ᬡᬮ᭍᭒\0᯽\0ᰌƀcpr᦭ᦲ᧝ute;䄇̀;abcdsᦿᧀᧄ᧊᧕᧙戩nd;橄rcup;橉Āau᧏᧒p;橋p;橇ot;橀;쀀∩︀Āeo᧢᧥t;恁îړȀaeiu᧰᧻ᨁᨅǰ᧵\0᧸s;橍on;䄍dil耻ç䃧rc;䄉psĀ;sᨌᨍ橌m;橐ot;䄋ƀdmnᨛᨠᨦil肻¸ƭptyv;榲t脀¢;eᨭᨮ䂢räƲr;쀀𝔠ƀceiᨽᩀᩍy;䑇ckĀ;mᩇᩈ朓ark»ᩈ;䏇r΀;Ecefms᩟᩠ᩢᩫ᪤᪪᪮旋;槃ƀ;elᩩᩪᩭ䋆q;扗eɡᩴ\0\0᪈rrowĀlr᩼᪁eft;憺ight;憻ʀRSacd᪒᪔᪖᪚᪟»ཇ;擈st;抛irc;抚ash;抝nint;樐id;櫯cir;槂ubsĀ;u᪻᪼晣it»᪼ˬ᫇᫔᫺\0ᬊonĀ;eᫍᫎ䀺Ā;qÇÆɭ᫙\0\0᫢aĀ;t᫞᫟䀬;䁀ƀ;fl᫨᫩᫫戁îᅠeĀmx᫱᫶ent»᫩eóɍǧ᫾\0ᬇĀ;dኻᬂot;橭nôɆƀfryᬐᬔᬗ;쀀𝕔oäɔ脀©;sŕᬝr;愗Āaoᬥᬩrr;憵ss;朗Ācuᬲᬷr;쀀𝒸Ābpᬼ᭄Ā;eᭁᭂ櫏;櫑Ā;eᭉᭊ櫐;櫒dot;拯΀delprvw᭠᭬᭷ᮂᮬᯔ᯹arrĀlr᭨᭪;椸;椵ɰ᭲\0\0᭵r;拞c;拟arrĀ;p᭿ᮀ憶;椽̀;bcdosᮏᮐᮖᮡᮥᮨ截rcap;橈Āauᮛᮞp;橆p;橊ot;抍r;橅;쀀∪︀Ȁalrv᮵ᮿᯞᯣrrĀ;mᮼᮽ憷;椼yƀevwᯇᯔᯘqɰᯎ\0\0ᯒreã᭳uã᭵ee;拎edge;拏en耻¤䂤earrowĀlrᯮ᯳eft»ᮀight»ᮽeäᯝĀciᰁᰇoninôǷnt;戱lcty;挭ঀAHabcdefhijlorstuwz᰸᰻᰿ᱝᱩᱵᲊᲞᲬᲷ᳻᳿ᴍᵻᶑᶫᶻ᷆᷍rò΁ar;楥Ȁglrs᱈ᱍ᱒᱔ger;怠eth;愸òᄳhĀ;vᱚᱛ怐»ऊūᱡᱧarow;椏aã̕Āayᱮᱳron;䄏;䐴ƀ;ao̲ᱼᲄĀgrʿᲁr;懊tseq;橷ƀglmᲑᲔᲘ耻°䂰ta;䎴ptyv;榱ĀirᲣᲨsht;楿;쀀𝔡arĀlrᲳᲵ»ࣜ»သʀaegsv᳂͸᳖᳜᳠mƀ;oș᳊᳔ndĀ;ș᳑uit;晦amma;䏝in;拲ƀ;io᳧᳨᳸䃷de脀÷;o᳧ᳰntimes;拇nø᳷cy;䑒cɯᴆ\0\0ᴊrn;挞op;挍ʀlptuwᴘᴝᴢᵉᵕlar;䀤f;쀀𝕕ʀ;emps̋ᴭᴷᴽᵂqĀ;d͒ᴳot;扑inus;戸lus;戔quare;抡blebarwedgåúnƀadhᄮᵝᵧownarrowóᲃarpoonĀlrᵲᵶefôᲴighôᲶŢᵿᶅkaro÷གɯᶊ\0\0ᶎrn;挟op;挌ƀcotᶘᶣᶦĀryᶝᶡ;쀀𝒹;䑕l;槶rok;䄑Ādrᶰᶴot;拱iĀ;fᶺ᠖斿Āah᷀᷃ròЩaòྦangle;榦Āci᷒ᷕy;䑟grarr;柿ऀDacdefglmnopqrstuxḁḉḙḸոḼṉṡṾấắẽỡἪἷὄ὎὚ĀDoḆᴴoôᲉĀcsḎḔute耻é䃩ter;橮ȀaioyḢḧḱḶron;䄛rĀ;cḭḮ扖耻ê䃪lon;払;䑍ot;䄗ĀDrṁṅot;扒;쀀𝔢ƀ;rsṐṑṗ檚ave耻è䃨Ā;dṜṝ檖ot;檘Ȁ;ilsṪṫṲṴ檙nters;揧;愓Ā;dṹṺ檕ot;檗ƀapsẅẉẗcr;䄓tyƀ;svẒẓẕ戅et»ẓpĀ1;ẝẤĳạả;怄;怅怃ĀgsẪẬ;䅋p;怂ĀgpẴẸon;䄙f;쀀𝕖ƀalsỄỎỒrĀ;sỊị拕l;槣us;橱iƀ;lvỚớở䎵on»ớ;䏵ȀcsuvỪỳἋἣĀioữḱrc»Ḯɩỹ\0\0ỻíՈantĀglἂἆtr»ṝess»Ṻƀaeiἒ἖Ἒls;䀽st;扟vĀ;DȵἠD;橸parsl;槥ĀDaἯἳot;打rr;楱ƀcdiἾὁỸr;愯oô͒ĀahὉὋ;䎷耻ð䃰Āmrὓὗl耻ë䃫o;悬ƀcipὡὤὧl;䀡sôծĀeoὬὴctatioîՙnentialåչৡᾒ\0ᾞ\0ᾡᾧ\0\0ῆῌ\0ΐ\0ῦῪ \0 ⁚llingdotseñṄy;䑄male;晀ƀilrᾭᾳ῁lig;耀ﬃɩᾹ\0\0᾽g;耀ﬀig;耀ﬄ;쀀𝔣lig;耀ﬁlig;쀀fjƀaltῙ῜ῡt;晭ig;耀ﬂns;斱of;䆒ǰ΅\0ῳf;쀀𝕗ĀakֿῷĀ;vῼ´拔;櫙artint;樍Āao‌⁕Ācs‑⁒α‚‰‸⁅⁈\0⁐β•‥‧‪‬\0‮耻½䂽;慓耻¼䂼;慕;慙;慛Ƴ‴\0‶;慔;慖ʴ‾⁁\0\0⁃耻¾䂾;慗;慜5;慘ƶ⁌\0⁎;慚;慝8;慞l;恄wn;挢cr;쀀𝒻ࢀEabcdefgijlnorstv₂₉₟₥₰₴⃰⃵⃺⃿℃ℒℸ̗ℾ⅒↞Ā;lٍ₇;檌ƀcmpₐₕ₝ute;䇵maĀ;dₜ᳚䎳;檆reve;䄟Āiy₪₮rc;䄝;䐳ot;䄡Ȁ;lqsؾق₽⃉ƀ;qsؾٌ⃄lanô٥Ȁ;cdl٥⃒⃥⃕c;檩otĀ;o⃜⃝檀Ā;l⃢⃣檂;檄Ā;e⃪⃭쀀⋛︀s;檔r;쀀𝔤Ā;gٳ؛mel;愷cy;䑓Ȁ;Eajٚℌℎℐ;檒;檥;檤ȀEaesℛℝ℩ℴ;扩pĀ;p℣ℤ檊rox»ℤĀ;q℮ℯ檈Ā;q℮ℛim;拧pf;쀀𝕘Āci⅃ⅆr;愊mƀ;el٫ⅎ⅐;檎;檐茀>;cdlqr׮ⅠⅪⅮⅳⅹĀciⅥⅧ;檧r;橺ot;拗Par;榕uest;橼ʀadelsↄⅪ←ٖ↛ǰ↉\0↎proø₞r;楸qĀlqؿ↖lesó₈ií٫Āen↣↭rtneqq;쀀≩︀Å↪ԀAabcefkosy⇄⇇⇱⇵⇺∘∝∯≨≽ròΠȀilmr⇐⇔⇗⇛rsðᒄf»․ilôکĀdr⇠⇤cy;䑊ƀ;cwࣴ⇫⇯ir;楈;憭ar;意irc;䄥ƀalr∁∎∓rtsĀ;u∉∊晥it»∊lip;怦con;抹r;쀀𝔥sĀew∣∩arow;椥arow;椦ʀamopr∺∾≃≞≣rr;懿tht;戻kĀlr≉≓eftarrow;憩ightarrow;憪f;쀀𝕙bar;怕ƀclt≯≴≸r;쀀𝒽asè⇴rok;䄧Ābp⊂⊇ull;恃hen»ᱛૡ⊣\0⊪\0⊸⋅⋎\0⋕⋳\0\0⋸⌢⍧⍢⍿\0⎆⎪⎴cute耻í䃭ƀ;iyݱ⊰⊵rc耻î䃮;䐸Ācx⊼⊿y;䐵cl耻¡䂡ĀfrΟ⋉;쀀𝔦rave耻ì䃬Ȁ;inoܾ⋝⋩⋮Āin⋢⋦nt;樌t;戭fin;槜ta;愩lig;䄳ƀaop⋾⌚⌝ƀcgt⌅⌈⌗r;䄫ƀelpܟ⌏⌓inåގarôܠh;䄱f;抷ed;䆵ʀ;cfotӴ⌬⌱⌽⍁are;愅inĀ;t⌸⌹戞ie;槝doô⌙ʀ;celpݗ⍌⍐⍛⍡al;抺Āgr⍕⍙eróᕣã⍍arhk;樗rod;樼Ȁcgpt⍯⍲⍶⍻y;䑑on;䄯f;쀀𝕚a;䎹uest耻¿䂿Āci⎊⎏r;쀀𝒾nʀ;EdsvӴ⎛⎝⎡ӳ;拹ot;拵Ā;v⎦⎧拴;拳Ā;iݷ⎮lde;䄩ǫ⎸\0⎼cy;䑖l耻ï䃯̀cfmosu⏌⏗⏜⏡⏧⏵Āiy⏑⏕rc;䄵;䐹r;쀀𝔧ath;䈷pf;쀀𝕛ǣ⏬\0⏱r;쀀𝒿rcy;䑘kcy;䑔Ѐacfghjos␋␖␢␧␭␱␵␻ppaĀ;v␓␔䎺;䏰Āey␛␠dil;䄷;䐺r;쀀𝔨reen;䄸cy;䑅cy;䑜pf;쀀𝕜cr;쀀𝓀஀ABEHabcdefghjlmnoprstuv⑰⒁⒆⒍⒑┎┽╚▀♎♞♥♹♽⚚⚲⛘❝❨➋⟀⠁⠒ƀart⑷⑺⑼rò৆òΕail;椛arr;椎Ā;gঔ⒋;檋ar;楢ॣ⒥\0⒪\0⒱\0\0\0\0\0⒵Ⓔ\0ⓆⓈⓍ\0⓹ute;䄺mptyv;榴raîࡌbda;䎻gƀ;dlࢎⓁⓃ;榑åࢎ;檅uo耻«䂫rЀ;bfhlpst࢙ⓞⓦⓩ⓫⓮⓱⓵Ā;f࢝ⓣs;椟s;椝ë≒p;憫l;椹im;楳l;憢ƀ;ae⓿─┄檫il;椙Ā;s┉┊檭;쀀⪭︀ƀabr┕┙┝rr;椌rk;杲Āak┢┬cĀek┨┪;䁻;䁛Āes┱┳;榋lĀdu┹┻;榏;榍Ȁaeuy╆╋╖╘ron;䄾Ādi═╔il;䄼ìࢰâ┩;䐻Ȁcqrs╣╦╭╽a;椶uoĀ;rนᝆĀdu╲╷har;楧shar;楋h;憲ʀ;fgqs▋▌উ◳◿扤tʀahlrt▘▤▷◂◨rrowĀ;t࢙□aé⓶arpoonĀdu▯▴own»њp»०eftarrows;懇ightƀahs◍◖◞rrowĀ;sࣴࢧarpoonó྘quigarro÷⇰hreetimes;拋ƀ;qs▋ও◺lanôবʀ;cdgsব☊☍☝☨c;檨otĀ;o☔☕橿Ā;r☚☛檁;檃Ā;e☢☥쀀⋚︀s;檓ʀadegs☳☹☽♉♋pproøⓆot;拖qĀgq♃♅ôউgtò⒌ôছiíলƀilr♕࣡♚sht;楼;쀀𝔩Ā;Eজ♣;檑š♩♶rĀdu▲♮Ā;l॥♳;楪lk;斄cy;䑙ʀ;achtੈ⚈⚋⚑⚖rò◁orneòᴈard;楫ri;旺Āio⚟⚤dot;䅀ustĀ;a⚬⚭掰che»⚭ȀEaes⚻⚽⛉⛔;扨pĀ;p⛃⛄檉rox»⛄Ā;q⛎⛏檇Ā;q⛎⚻im;拦Ѐabnoptwz⛩⛴⛷✚✯❁❇❐Ānr⛮⛱g;柬r;懽rëࣁgƀlmr⛿✍✔eftĀar০✇ightá৲apsto;柼ightá৽parrowĀlr✥✩efô⓭ight;憬ƀafl✶✹✽r;榅;쀀𝕝us;樭imes;樴š❋❏st;戗áፎƀ;ef❗❘᠀旊nge»❘arĀ;l❤❥䀨t;榓ʀachmt❳❶❼➅➇ròࢨorneòᶌarĀ;d྘➃;業;怎ri;抿̀achiqt➘➝ੀ➢➮➻quo;怹r;쀀𝓁mƀ;egল➪➬;檍;檏Ābu┪➳oĀ;rฟ➹;怚rok;䅂萀<;cdhilqrࠫ⟒☹⟜⟠⟥⟪⟰Āci⟗⟙;檦r;橹reå◲mes;拉arr;楶uest;橻ĀPi⟵⟹ar;榖ƀ;ef⠀भ᠛旃rĀdu⠇⠍shar;楊har;楦Āen⠗⠡rtneqq;쀀≨︀Å⠞܀Dacdefhilnopsu⡀⡅⢂⢎⢓⢠⢥⢨⣚⣢⣤ઃ⣳⤂Dot;戺Ȁclpr⡎⡒⡣⡽r耻¯䂯Āet⡗⡙;時Ā;e⡞⡟朠se»⡟Ā;sျ⡨toȀ;dluျ⡳⡷⡻owîҌefôएðᏑker;斮Āoy⢇⢌mma;権;䐼ash;怔asuredangle»ᘦr;쀀𝔪o;愧ƀcdn⢯⢴⣉ro耻µ䂵Ȁ;acdᑤ⢽⣀⣄sôᚧir;櫰ot肻·Ƶusƀ;bd⣒ᤃ⣓戒Ā;uᴼ⣘;横ţ⣞⣡p;櫛ò−ðઁĀdp⣩⣮els;抧f;쀀𝕞Āct⣸⣽r;쀀𝓂pos»ᖝƀ;lm⤉⤊⤍䎼timap;抸ఀGLRVabcdefghijlmoprstuvw⥂⥓⥾⦉⦘⧚⧩⨕⨚⩘⩝⪃⪕⪤⪨⬄⬇⭄⭿⮮ⰴⱧⱼ⳩Āgt⥇⥋;쀀⋙̸Ā;v⥐௏쀀≫⃒ƀelt⥚⥲⥶ftĀar⥡⥧rrow;懍ightarrow;懎;쀀⋘̸Ā;v⥻ే쀀≪⃒ightarrow;懏ĀDd⦎⦓ash;抯ash;抮ʀbcnpt⦣⦧⦬⦱⧌la»˞ute;䅄g;쀀∠⃒ʀ;Eiop඄⦼⧀⧅⧈;쀀⩰̸d;쀀≋̸s;䅉roø඄urĀ;a⧓⧔普lĀ;s⧓ସǳ⧟\0⧣p肻 ଷmpĀ;e௹ఀʀaeouy⧴⧾⨃⨐⨓ǰ⧹\0⧻;橃on;䅈dil;䅆ngĀ;dൾ⨊ot;쀀⩭̸p;橂;䐽ash;怓΀;Aadqsxஒ⨩⨭⨻⩁⩅⩐rr;懗rĀhr⨳⨶k;椤Ā;oᏲᏰot;쀀≐̸uiöୣĀei⩊⩎ar;椨í஘istĀ;s஠டr;쀀𝔫ȀEest௅⩦⩹⩼ƀ;qs஼⩭௡ƀ;qs஼௅⩴lanô௢ií௪Ā;rஶ⪁»ஷƀAap⪊⪍⪑rò⥱rr;憮ar;櫲ƀ;svྍ⪜ྌĀ;d⪡⪢拼;拺cy;䑚΀AEadest⪷⪺⪾⫂⫅⫶⫹rò⥦;쀀≦̸rr;憚r;急Ȁ;fqs఻⫎⫣⫯tĀar⫔⫙rro÷⫁ightarro÷⪐ƀ;qs఻⪺⫪lanôౕĀ;sౕ⫴»శiíౝĀ;rవ⫾iĀ;eచథiäඐĀpt⬌⬑f;쀀𝕟膀¬;in⬙⬚⬶䂬nȀ;Edvஉ⬤⬨⬮;쀀⋹̸ot;쀀⋵̸ǡஉ⬳⬵;拷;拶iĀ;vಸ⬼ǡಸ⭁⭃;拾;拽ƀaor⭋⭣⭩rȀ;ast୻⭕⭚⭟lleì୻l;쀀⫽⃥;쀀∂̸lint;樔ƀ;ceಒ⭰⭳uåಥĀ;cಘ⭸Ā;eಒ⭽ñಘȀAait⮈⮋⮝⮧rò⦈rrƀ;cw⮔⮕⮙憛;쀀⤳̸;쀀↝̸ghtarrow»⮕riĀ;eೋೖ΀chimpqu⮽⯍⯙⬄୸⯤⯯Ȁ;cerല⯆ഷ⯉uå൅;쀀𝓃ortɭ⬅\0\0⯖ará⭖mĀ;e൮⯟Ā;q൴൳suĀbp⯫⯭å೸åഋƀbcp⯶ⰑⰙȀ;Ees⯿ⰀഢⰄ抄;쀀⫅̸etĀ;eഛⰋqĀ;qണⰀcĀ;eലⰗñസȀ;EesⰢⰣൟⰧ抅;쀀⫆̸etĀ;e൘ⰮqĀ;qൠⰣȀgilrⰽⰿⱅⱇìௗlde耻ñ䃱çృiangleĀlrⱒⱜeftĀ;eచⱚñదightĀ;eೋⱥñ೗Ā;mⱬⱭ䎽ƀ;esⱴⱵⱹ䀣ro;愖p;怇ҀDHadgilrsⲏⲔⲙⲞⲣⲰⲶⳓⳣash;抭arr;椄p;쀀≍⃒ash;抬ĀetⲨⲬ;쀀≥⃒;쀀>⃒nfin;槞ƀAetⲽⳁⳅrr;椂;쀀≤⃒Ā;rⳊⳍ쀀<⃒ie;쀀⊴⃒ĀAtⳘⳜrr;椃rie;쀀⊵⃒im;쀀∼⃒ƀAan⳰⳴ⴂrr;懖rĀhr⳺⳽k;椣Ā;oᏧᏥear;椧ቓ᪕\0\0\0\0\0\0\0\0\0\0\0\0\0ⴭ\0ⴸⵈⵠⵥ⵲ⶄᬇ\0\0ⶍⶫ\0ⷈⷎ\0ⷜ⸙⸫⸾⹃Ācsⴱ᪗ute耻ó䃳ĀiyⴼⵅrĀ;c᪞ⵂ耻ô䃴;䐾ʀabios᪠ⵒⵗǈⵚlac;䅑v;樸old;榼lig;䅓Ācr⵩⵭ir;榿;쀀𝔬ͯ⵹\0\0⵼\0ⶂn;䋛ave耻ò䃲;槁Ābmⶈ෴ar;榵Ȁacitⶕ⶘ⶥⶨrò᪀Āir⶝ⶠr;榾oss;榻nå๒;槀ƀaeiⶱⶵⶹcr;䅍ga;䏉ƀcdnⷀⷅǍron;䎿;榶pf;쀀𝕠ƀaelⷔ⷗ǒr;榷rp;榹΀;adiosvⷪⷫⷮ⸈⸍⸐⸖戨rò᪆Ȁ;efmⷷⷸ⸂⸅橝rĀ;oⷾⷿ愴f»ⷿ耻ª䂪耻º䂺gof;抶r;橖lope;橗;橛ƀclo⸟⸡⸧ò⸁ash耻ø䃸l;折iŬⸯ⸴de耻õ䃵esĀ;aǛ⸺s;樶ml耻ö䃶bar;挽ૡ⹞\0⹽\0⺀⺝\0⺢⺹\0\0⻋ຜ\0⼓\0\0⼫⾼\0⿈rȀ;astЃ⹧⹲຅脀¶;l⹭⹮䂶leìЃɩ⹸\0\0⹻m;櫳;櫽y;䐿rʀcimpt⺋⺏⺓ᡥ⺗nt;䀥od;䀮il;怰enk;怱r;쀀𝔭ƀimo⺨⺰⺴Ā;v⺭⺮䏆;䏕maô੶ne;明ƀ;tv⺿⻀⻈䏀chfork»´;䏖Āau⻏⻟nĀck⻕⻝kĀ;h⇴⻛;愎ö⇴sҀ;abcdemst⻳⻴ᤈ⻹⻽⼄⼆⼊⼎䀫cir;樣ir;樢Āouᵀ⼂;樥;橲n肻±ຝim;樦wo;樧ƀipu⼙⼠⼥ntint;樕f;쀀𝕡nd耻£䂣Ԁ;Eaceinosu່⼿⽁⽄⽇⾁⾉⾒⽾⾶;檳p;檷uå໙Ā;c໎⽌̀;acens່⽙⽟⽦⽨⽾pproø⽃urlyeñ໙ñ໎ƀaes⽯⽶⽺pprox;檹qq;檵im;拨iíໟmeĀ;s⾈ຮ怲ƀEas⽸⾐⽺ð⽵ƀdfp໬⾙⾯ƀals⾠⾥⾪lar;挮ine;挒urf;挓Ā;t໻⾴ï໻rel;抰Āci⿀⿅r;쀀𝓅;䏈ncsp;怈̀fiopsu⿚⋢⿟⿥⿫⿱r;쀀𝔮pf;쀀𝕢rime;恗cr;쀀𝓆ƀaeo⿸〉〓tĀei⿾々rnionóڰnt;樖stĀ;e【】䀿ñἙô༔઀ABHabcdefhilmnoprstux぀けさすムㄎㄫㅇㅢㅲㆎ㈆㈕㈤㈩㉘㉮㉲㊐㊰㊷ƀartぇおがròႳòϝail;検aròᱥar;楤΀cdenqrtとふへみわゔヌĀeuねぱ;쀀∽̱te;䅕iãᅮmptyv;榳gȀ;del࿑らるろ;榒;榥å࿑uo耻»䂻rր;abcfhlpstw࿜ガクシスゼゾダッデナp;極Ā;f࿠ゴs;椠;椳s;椞ë≝ð✮l;楅im;楴l;憣;憝Āaiパフil;椚oĀ;nホボ戶aló༞ƀabrョリヮrò៥rk;杳ĀakンヽcĀekヹ・;䁽;䁝Āes㄂㄄;榌lĀduㄊㄌ;榎;榐Ȁaeuyㄗㄜㄧㄩron;䅙Ādiㄡㄥil;䅗ì࿲âヺ;䑀Ȁclqsㄴㄷㄽㅄa;椷dhar;楩uoĀ;rȎȍh;憳ƀacgㅎㅟངlȀ;ipsླྀㅘㅛႜnåႻarôྩt;断ƀilrㅩဣㅮsht;楽;쀀𝔯ĀaoㅷㆆrĀduㅽㅿ»ѻĀ;l႑ㆄ;楬Ā;vㆋㆌ䏁;䏱ƀgns㆕ㇹㇼht̀ahlrstㆤㆰ㇂㇘㇤㇮rrowĀ;t࿜ㆭaéトarpoonĀduㆻㆿowîㅾp»႒eftĀah㇊㇐rrowó࿪arpoonóՑightarrows;應quigarro÷ニhreetimes;拌g;䋚ingdotseñἲƀahm㈍㈐㈓rò࿪aòՑ;怏oustĀ;a㈞㈟掱che»㈟mid;櫮Ȁabpt㈲㈽㉀㉒Ānr㈷㈺g;柭r;懾rëဃƀafl㉇㉊㉎r;榆;쀀𝕣us;樮imes;樵Āap㉝㉧rĀ;g㉣㉤䀩t;榔olint;樒arò㇣Ȁachq㉻㊀Ⴜ㊅quo;怺r;쀀𝓇Ābu・㊊oĀ;rȔȓƀhir㊗㊛㊠reåㇸmes;拊iȀ;efl㊪ၙᠡ㊫方tri;槎luhar;楨;愞ൡ㋕㋛㋟㌬㌸㍱\0㍺㎤\0\0㏬㏰\0㐨㑈㑚㒭㒱㓊㓱\0㘖\0\0㘳cute;䅛quï➺Ԁ;Eaceinpsyᇭ㋳㋵㋿㌂㌋㌏㌟㌦㌩;檴ǰ㋺\0㋼;檸on;䅡uåᇾĀ;dᇳ㌇il;䅟rc;䅝ƀEas㌖㌘㌛;檶p;檺im;择olint;樓iíሄ;䑁otƀ;be㌴ᵇ㌵担;橦΀Aacmstx㍆㍊㍗㍛㍞㍣㍭rr;懘rĀhr㍐㍒ë∨Ā;oਸ਼਴t耻§䂧i;䀻war;椩mĀin㍩ðnuóñt;朶rĀ;o㍶⁕쀀𝔰Ȁacoy㎂㎆㎑㎠rp;景Āhy㎋㎏cy;䑉;䑈rtɭ㎙\0\0㎜iäᑤaraì⹯耻­䂭Āgm㎨㎴maƀ;fv㎱㎲㎲䏃;䏂Ѐ;deglnprካ㏅㏉㏎㏖㏞㏡㏦ot;橪Ā;q኱ኰĀ;E㏓㏔檞;檠Ā;E㏛㏜檝;檟e;扆lus;樤arr;楲aròᄽȀaeit㏸㐈㐏㐗Āls㏽㐄lsetmé㍪hp;樳parsl;槤Ādlᑣ㐔e;挣Ā;e㐜㐝檪Ā;s㐢㐣檬;쀀⪬︀ƀflp㐮㐳㑂tcy;䑌Ā;b㐸㐹䀯Ā;a㐾㐿槄r;挿f;쀀𝕤aĀdr㑍ЂesĀ;u㑔㑕晠it»㑕ƀcsu㑠㑹㒟Āau㑥㑯pĀ;sᆈ㑫;쀀⊓︀pĀ;sᆴ㑵;쀀⊔︀uĀbp㑿㒏ƀ;esᆗᆜ㒆etĀ;eᆗ㒍ñᆝƀ;esᆨᆭ㒖etĀ;eᆨ㒝ñᆮƀ;afᅻ㒦ְrť㒫ֱ»ᅼaròᅈȀcemt㒹㒾㓂㓅r;쀀𝓈tmîñiì㐕aræᆾĀar㓎㓕rĀ;f㓔ឿ昆Āan㓚㓭ightĀep㓣㓪psiloîỠhé⺯s»⡒ʀbcmnp㓻㕞ሉ㖋㖎Ҁ;Edemnprs㔎㔏㔑㔕㔞㔣㔬㔱㔶抂;櫅ot;檽Ā;dᇚ㔚ot;櫃ult;櫁ĀEe㔨㔪;櫋;把lus;檿arr;楹ƀeiu㔽㕒㕕tƀ;en㔎㕅㕋qĀ;qᇚ㔏eqĀ;q㔫㔨m;櫇Ābp㕚㕜;櫕;櫓c̀;acensᇭ㕬㕲㕹㕻㌦pproø㋺urlyeñᇾñᇳƀaes㖂㖈㌛pproø㌚qñ㌗g;晪ڀ123;Edehlmnps㖩㖬㖯ሜ㖲㖴㗀㗉㗕㗚㗟㗨㗭耻¹䂹耻²䂲耻³䂳;櫆Āos㖹㖼t;檾ub;櫘Ā;dሢ㗅ot;櫄sĀou㗏㗒l;柉b;櫗arr;楻ult;櫂ĀEe㗤㗦;櫌;抋lus;櫀ƀeiu㗴㘉㘌tƀ;enሜ㗼㘂qĀ;qሢ㖲eqĀ;q㗧㗤m;櫈Ābp㘑㘓;櫔;櫖ƀAan㘜㘠㘭rr;懙rĀhr㘦㘨ë∮Ā;oਫ਩war;椪lig耻ß䃟௡㙑㙝㙠ዎ㙳㙹\0㙾㛂\0\0\0\0\0㛛㜃\0㜉㝬\0\0\0㞇ɲ㙖\0\0㙛get;挖;䏄rë๟ƀaey㙦㙫㙰ron;䅥dil;䅣;䑂lrec;挕r;쀀𝔱Ȁeiko㚆㚝㚵㚼ǲ㚋\0㚑eĀ4fኄኁaƀ;sv㚘㚙㚛䎸ym;䏑Ācn㚢㚲kĀas㚨㚮pproø዁im»ኬsðኞĀas㚺㚮ð዁rn耻þ䃾Ǭ̟㛆⋧es膀×;bd㛏㛐㛘䃗Ā;aᤏ㛕r;樱;樰ƀeps㛡㛣㜀á⩍Ȁ;bcf҆㛬㛰㛴ot;挶ir;櫱Ā;o㛹㛼쀀𝕥rk;櫚á㍢rime;怴ƀaip㜏㜒㝤dåቈ΀adempst㜡㝍㝀㝑㝗㝜㝟ngleʀ;dlqr㜰㜱㜶㝀㝂斵own»ᶻeftĀ;e⠀㜾ñम;扜ightĀ;e㊪㝋ñၚot;旬inus;樺lus;樹b;槍ime;樻ezium;揢ƀcht㝲㝽㞁Āry㝷㝻;쀀𝓉;䑆cy;䑛rok;䅧Āio㞋㞎xô᝷headĀlr㞗㞠eftarro÷ࡏightarrow»ཝऀAHabcdfghlmoprstuw㟐㟓㟗㟤㟰㟼㠎㠜㠣㠴㡑㡝㡫㢩㣌㣒㣪㣶ròϭar;楣Ācr㟜㟢ute耻ú䃺òᅐrǣ㟪\0㟭y;䑞ve;䅭Āiy㟵㟺rc耻û䃻;䑃ƀabh㠃㠆㠋ròᎭlac;䅱aòᏃĀir㠓㠘sht;楾;쀀𝔲rave耻ù䃹š㠧㠱rĀlr㠬㠮»ॗ»ႃlk;斀Āct㠹㡍ɯ㠿\0\0㡊rnĀ;e㡅㡆挜r»㡆op;挏ri;旸Āal㡖㡚cr;䅫肻¨͉Āgp㡢㡦on;䅳f;쀀𝕦̀adhlsuᅋ㡸㡽፲㢑㢠ownáᎳarpoonĀlr㢈㢌efô㠭ighô㠯iƀ;hl㢙㢚㢜䏅»ᏺon»㢚parrows;懈ƀcit㢰㣄㣈ɯ㢶\0\0㣁rnĀ;e㢼㢽挝r»㢽op;挎ng;䅯ri;旹cr;쀀𝓊ƀdir㣙㣝㣢ot;拰lde;䅩iĀ;f㜰㣨»᠓Āam㣯㣲rò㢨l耻ü䃼angle;榧ހABDacdeflnoprsz㤜㤟㤩㤭㦵㦸㦽㧟㧤㧨㧳㧹㧽㨁㨠ròϷarĀ;v㤦㤧櫨;櫩asèϡĀnr㤲㤷grt;榜΀eknprst㓣㥆㥋㥒㥝㥤㦖appá␕othinçẖƀhir㓫⻈㥙opô⾵Ā;hᎷ㥢ïㆍĀiu㥩㥭gmá㎳Ābp㥲㦄setneqĀ;q㥽㦀쀀⊊︀;쀀⫋︀setneqĀ;q㦏㦒쀀⊋︀;쀀⫌︀Āhr㦛㦟etá㚜iangleĀlr㦪㦯eft»थight»ၑy;䐲ash»ံƀelr㧄㧒㧗ƀ;beⷪ㧋㧏ar;抻q;扚lip;拮Ābt㧜ᑨaòᑩr;쀀𝔳tré㦮suĀbp㧯㧱»ജ»൙pf;쀀𝕧roð໻tré㦴Ācu㨆㨋r;쀀𝓋Ābp㨐㨘nĀEe㦀㨖»㥾nĀEe㦒㨞»㦐igzag;榚΀cefoprs㨶㨻㩖㩛㩔㩡㩪irc;䅵Ādi㩀㩑Ābg㩅㩉ar;機eĀ;qᗺ㩏;扙erp;愘r;쀀𝔴pf;쀀𝕨Ā;eᑹ㩦atèᑹcr;쀀𝓌ૣណ㪇\0㪋\0㪐㪛\0\0㪝㪨㪫㪯\0\0㫃㫎\0㫘ៜ៟tré៑r;쀀𝔵ĀAa㪔㪗ròσrò৶;䎾ĀAa㪡㪤ròθrò৫að✓is;拻ƀdptឤ㪵㪾Āfl㪺ឩ;쀀𝕩imåឲĀAa㫇㫊ròώròਁĀcq㫒ីr;쀀𝓍Āpt៖㫜ré។Ѐacefiosu㫰㫽㬈㬌㬑㬕㬛㬡cĀuy㫶㫻te耻ý䃽;䑏Āiy㬂㬆rc;䅷;䑋n耻¥䂥r;쀀𝔶cy;䑗pf;쀀𝕪cr;쀀𝓎Ācm㬦㬩y;䑎l耻ÿ䃿Ԁacdefhiosw㭂㭈㭔㭘㭤㭩㭭㭴㭺㮀cute;䅺Āay㭍㭒ron;䅾;䐷ot;䅼Āet㭝㭡træᕟa;䎶r;쀀𝔷cy;䐶grarr;懝pf;쀀𝕫cr;쀀𝓏Ājn㮅㮇;怍j;怌'.split("").map((c) => c.charCodeAt(0))
);
const xmlDecodeTree = new Uint16Array(
  // prettier-ignore
  "Ȁaglq	\x1Bɭ\0\0p;䀦os;䀧t;䀾t;䀼uot;䀢".split("").map((c) => c.charCodeAt(0))
);
var _a;
const decodeMap = /* @__PURE__ */ new Map([
  [0, 65533],
  // C1 Unicode control character reference replacements
  [128, 8364],
  [130, 8218],
  [131, 402],
  [132, 8222],
  [133, 8230],
  [134, 8224],
  [135, 8225],
  [136, 710],
  [137, 8240],
  [138, 352],
  [139, 8249],
  [140, 338],
  [142, 381],
  [145, 8216],
  [146, 8217],
  [147, 8220],
  [148, 8221],
  [149, 8226],
  [150, 8211],
  [151, 8212],
  [152, 732],
  [153, 8482],
  [154, 353],
  [155, 8250],
  [156, 339],
  [158, 382],
  [159, 376]
]);
const fromCodePoint$1 = (
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, node/no-unsupported-features/es-builtins
  (_a = String.fromCodePoint) !== null && _a !== void 0 ? _a : function(codePoint) {
    let output = "";
    if (codePoint > 65535) {
      codePoint -= 65536;
      output += String.fromCharCode(codePoint >>> 10 & 1023 | 55296);
      codePoint = 56320 | codePoint & 1023;
    }
    output += String.fromCharCode(codePoint);
    return output;
  }
);
function replaceCodePoint(codePoint) {
  var _a2;
  if (codePoint >= 55296 && codePoint <= 57343 || codePoint > 1114111) {
    return 65533;
  }
  return (_a2 = decodeMap.get(codePoint)) !== null && _a2 !== void 0 ? _a2 : codePoint;
}
var CharCodes;
(function(CharCodes2) {
  CharCodes2[CharCodes2["NUM"] = 35] = "NUM";
  CharCodes2[CharCodes2["SEMI"] = 59] = "SEMI";
  CharCodes2[CharCodes2["EQUALS"] = 61] = "EQUALS";
  CharCodes2[CharCodes2["ZERO"] = 48] = "ZERO";
  CharCodes2[CharCodes2["NINE"] = 57] = "NINE";
  CharCodes2[CharCodes2["LOWER_A"] = 97] = "LOWER_A";
  CharCodes2[CharCodes2["LOWER_F"] = 102] = "LOWER_F";
  CharCodes2[CharCodes2["LOWER_X"] = 120] = "LOWER_X";
  CharCodes2[CharCodes2["LOWER_Z"] = 122] = "LOWER_Z";
  CharCodes2[CharCodes2["UPPER_A"] = 65] = "UPPER_A";
  CharCodes2[CharCodes2["UPPER_F"] = 70] = "UPPER_F";
  CharCodes2[CharCodes2["UPPER_Z"] = 90] = "UPPER_Z";
})(CharCodes || (CharCodes = {}));
const TO_LOWER_BIT = 32;
var BinTrieFlags;
(function(BinTrieFlags2) {
  BinTrieFlags2[BinTrieFlags2["VALUE_LENGTH"] = 49152] = "VALUE_LENGTH";
  BinTrieFlags2[BinTrieFlags2["BRANCH_LENGTH"] = 16256] = "BRANCH_LENGTH";
  BinTrieFlags2[BinTrieFlags2["JUMP_TABLE"] = 127] = "JUMP_TABLE";
})(BinTrieFlags || (BinTrieFlags = {}));
function isNumber(code2) {
  return code2 >= CharCodes.ZERO && code2 <= CharCodes.NINE;
}
function isHexadecimalCharacter(code2) {
  return code2 >= CharCodes.UPPER_A && code2 <= CharCodes.UPPER_F || code2 >= CharCodes.LOWER_A && code2 <= CharCodes.LOWER_F;
}
function isAsciiAlphaNumeric(code2) {
  return code2 >= CharCodes.UPPER_A && code2 <= CharCodes.UPPER_Z || code2 >= CharCodes.LOWER_A && code2 <= CharCodes.LOWER_Z || isNumber(code2);
}
function isEntityInAttributeInvalidEnd(code2) {
  return code2 === CharCodes.EQUALS || isAsciiAlphaNumeric(code2);
}
var EntityDecoderState;
(function(EntityDecoderState2) {
  EntityDecoderState2[EntityDecoderState2["EntityStart"] = 0] = "EntityStart";
  EntityDecoderState2[EntityDecoderState2["NumericStart"] = 1] = "NumericStart";
  EntityDecoderState2[EntityDecoderState2["NumericDecimal"] = 2] = "NumericDecimal";
  EntityDecoderState2[EntityDecoderState2["NumericHex"] = 3] = "NumericHex";
  EntityDecoderState2[EntityDecoderState2["NamedEntity"] = 4] = "NamedEntity";
})(EntityDecoderState || (EntityDecoderState = {}));
var DecodingMode;
(function(DecodingMode2) {
  DecodingMode2[DecodingMode2["Legacy"] = 0] = "Legacy";
  DecodingMode2[DecodingMode2["Strict"] = 1] = "Strict";
  DecodingMode2[DecodingMode2["Attribute"] = 2] = "Attribute";
})(DecodingMode || (DecodingMode = {}));
class EntityDecoder {
  constructor(decodeTree, emitCodePoint, errors2) {
    this.decodeTree = decodeTree;
    this.emitCodePoint = emitCodePoint;
    this.errors = errors2;
    this.state = EntityDecoderState.EntityStart;
    this.consumed = 1;
    this.result = 0;
    this.treeIndex = 0;
    this.excess = 1;
    this.decodeMode = DecodingMode.Strict;
  }
  /** Resets the instance to make it reusable. */
  startEntity(decodeMode) {
    this.decodeMode = decodeMode;
    this.state = EntityDecoderState.EntityStart;
    this.result = 0;
    this.treeIndex = 0;
    this.excess = 1;
    this.consumed = 1;
  }
  /**
   * Write an entity to the decoder. This can be called multiple times with partial entities.
   * If the entity is incomplete, the decoder will return -1.
   *
   * Mirrors the implementation of `getDecoder`, but with the ability to stop decoding if the
   * entity is incomplete, and resume when the next string is written.
   *
   * @param string The string containing the entity (or a continuation of the entity).
   * @param offset The offset at which the entity begins. Should be 0 if this is not the first call.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  write(str, offset) {
    switch (this.state) {
      case EntityDecoderState.EntityStart: {
        if (str.charCodeAt(offset) === CharCodes.NUM) {
          this.state = EntityDecoderState.NumericStart;
          this.consumed += 1;
          return this.stateNumericStart(str, offset + 1);
        }
        this.state = EntityDecoderState.NamedEntity;
        return this.stateNamedEntity(str, offset);
      }
      case EntityDecoderState.NumericStart: {
        return this.stateNumericStart(str, offset);
      }
      case EntityDecoderState.NumericDecimal: {
        return this.stateNumericDecimal(str, offset);
      }
      case EntityDecoderState.NumericHex: {
        return this.stateNumericHex(str, offset);
      }
      case EntityDecoderState.NamedEntity: {
        return this.stateNamedEntity(str, offset);
      }
    }
  }
  /**
   * Switches between the numeric decimal and hexadecimal states.
   *
   * Equivalent to the `Numeric character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNumericStart(str, offset) {
    if (offset >= str.length) {
      return -1;
    }
    if ((str.charCodeAt(offset) | TO_LOWER_BIT) === CharCodes.LOWER_X) {
      this.state = EntityDecoderState.NumericHex;
      this.consumed += 1;
      return this.stateNumericHex(str, offset + 1);
    }
    this.state = EntityDecoderState.NumericDecimal;
    return this.stateNumericDecimal(str, offset);
  }
  addToNumericResult(str, start, end, base2) {
    if (start !== end) {
      const digitCount = end - start;
      this.result = this.result * Math.pow(base2, digitCount) + parseInt(str.substr(start, digitCount), base2);
      this.consumed += digitCount;
    }
  }
  /**
   * Parses a hexadecimal numeric entity.
   *
   * Equivalent to the `Hexademical character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNumericHex(str, offset) {
    const startIdx = offset;
    while (offset < str.length) {
      const char = str.charCodeAt(offset);
      if (isNumber(char) || isHexadecimalCharacter(char)) {
        offset += 1;
      } else {
        this.addToNumericResult(str, startIdx, offset, 16);
        return this.emitNumericEntity(char, 3);
      }
    }
    this.addToNumericResult(str, startIdx, offset, 16);
    return -1;
  }
  /**
   * Parses a decimal numeric entity.
   *
   * Equivalent to the `Decimal character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNumericDecimal(str, offset) {
    const startIdx = offset;
    while (offset < str.length) {
      const char = str.charCodeAt(offset);
      if (isNumber(char)) {
        offset += 1;
      } else {
        this.addToNumericResult(str, startIdx, offset, 10);
        return this.emitNumericEntity(char, 2);
      }
    }
    this.addToNumericResult(str, startIdx, offset, 10);
    return -1;
  }
  /**
   * Validate and emit a numeric entity.
   *
   * Implements the logic from the `Hexademical character reference start
   * state` and `Numeric character reference end state` in the HTML spec.
   *
   * @param lastCp The last code point of the entity. Used to see if the
   *               entity was terminated with a semicolon.
   * @param expectedLength The minimum number of characters that should be
   *                       consumed. Used to validate that at least one digit
   *                       was consumed.
   * @returns The number of characters that were consumed.
   */
  emitNumericEntity(lastCp, expectedLength) {
    var _a2;
    if (this.consumed <= expectedLength) {
      (_a2 = this.errors) === null || _a2 === void 0 ? void 0 : _a2.absenceOfDigitsInNumericCharacterReference(this.consumed);
      return 0;
    }
    if (lastCp === CharCodes.SEMI) {
      this.consumed += 1;
    } else if (this.decodeMode === DecodingMode.Strict) {
      return 0;
    }
    this.emitCodePoint(replaceCodePoint(this.result), this.consumed);
    if (this.errors) {
      if (lastCp !== CharCodes.SEMI) {
        this.errors.missingSemicolonAfterCharacterReference();
      }
      this.errors.validateNumericCharacterReference(this.result);
    }
    return this.consumed;
  }
  /**
   * Parses a named entity.
   *
   * Equivalent to the `Named character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNamedEntity(str, offset) {
    const { decodeTree } = this;
    let current = decodeTree[this.treeIndex];
    let valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
    for (; offset < str.length; offset++, this.excess++) {
      const char = str.charCodeAt(offset);
      this.treeIndex = determineBranch(decodeTree, current, this.treeIndex + Math.max(1, valueLength), char);
      if (this.treeIndex < 0) {
        return this.result === 0 || // If we are parsing an attribute
        this.decodeMode === DecodingMode.Attribute && // We shouldn't have consumed any characters after the entity,
        (valueLength === 0 || // And there should be no invalid characters.
        isEntityInAttributeInvalidEnd(char)) ? 0 : this.emitNotTerminatedNamedEntity();
      }
      current = decodeTree[this.treeIndex];
      valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
      if (valueLength !== 0) {
        if (char === CharCodes.SEMI) {
          return this.emitNamedEntityData(this.treeIndex, valueLength, this.consumed + this.excess);
        }
        if (this.decodeMode !== DecodingMode.Strict) {
          this.result = this.treeIndex;
          this.consumed += this.excess;
          this.excess = 0;
        }
      }
    }
    return -1;
  }
  /**
   * Emit a named entity that was not terminated with a semicolon.
   *
   * @returns The number of characters consumed.
   */
  emitNotTerminatedNamedEntity() {
    var _a2;
    const { result, decodeTree } = this;
    const valueLength = (decodeTree[result] & BinTrieFlags.VALUE_LENGTH) >> 14;
    this.emitNamedEntityData(result, valueLength, this.consumed);
    (_a2 = this.errors) === null || _a2 === void 0 ? void 0 : _a2.missingSemicolonAfterCharacterReference();
    return this.consumed;
  }
  /**
   * Emit a named entity.
   *
   * @param result The index of the entity in the decode tree.
   * @param valueLength The number of bytes in the entity.
   * @param consumed The number of characters consumed.
   *
   * @returns The number of characters consumed.
   */
  emitNamedEntityData(result, valueLength, consumed) {
    const { decodeTree } = this;
    this.emitCodePoint(valueLength === 1 ? decodeTree[result] & ~BinTrieFlags.VALUE_LENGTH : decodeTree[result + 1], consumed);
    if (valueLength === 3) {
      this.emitCodePoint(decodeTree[result + 2], consumed);
    }
    return consumed;
  }
  /**
   * Signal to the parser that the end of the input was reached.
   *
   * Remaining data will be emitted and relevant errors will be produced.
   *
   * @returns The number of characters consumed.
   */
  end() {
    var _a2;
    switch (this.state) {
      case EntityDecoderState.NamedEntity: {
        return this.result !== 0 && (this.decodeMode !== DecodingMode.Attribute || this.result === this.treeIndex) ? this.emitNotTerminatedNamedEntity() : 0;
      }
      case EntityDecoderState.NumericDecimal: {
        return this.emitNumericEntity(0, 2);
      }
      case EntityDecoderState.NumericHex: {
        return this.emitNumericEntity(0, 3);
      }
      case EntityDecoderState.NumericStart: {
        (_a2 = this.errors) === null || _a2 === void 0 ? void 0 : _a2.absenceOfDigitsInNumericCharacterReference(this.consumed);
        return 0;
      }
      case EntityDecoderState.EntityStart: {
        return 0;
      }
    }
  }
}
function getDecoder(decodeTree) {
  let ret = "";
  const decoder = new EntityDecoder(decodeTree, (str) => ret += fromCodePoint$1(str));
  return function decodeWithTrie(str, decodeMode) {
    let lastIndex = 0;
    let offset = 0;
    while ((offset = str.indexOf("&", offset)) >= 0) {
      ret += str.slice(lastIndex, offset);
      decoder.startEntity(decodeMode);
      const len = decoder.write(
        str,
        // Skip the "&"
        offset + 1
      );
      if (len < 0) {
        lastIndex = offset + decoder.end();
        break;
      }
      lastIndex = offset + len;
      offset = len === 0 ? lastIndex + 1 : lastIndex;
    }
    const result = ret + str.slice(lastIndex);
    ret = "";
    return result;
  };
}
function determineBranch(decodeTree, current, nodeIdx, char) {
  const branchCount = (current & BinTrieFlags.BRANCH_LENGTH) >> 7;
  const jumpOffset = current & BinTrieFlags.JUMP_TABLE;
  if (branchCount === 0) {
    return jumpOffset !== 0 && char === jumpOffset ? nodeIdx : -1;
  }
  if (jumpOffset) {
    const value = char - jumpOffset;
    return value < 0 || value >= branchCount ? -1 : decodeTree[nodeIdx + value] - 1;
  }
  let lo = nodeIdx;
  let hi = lo + branchCount - 1;
  while (lo <= hi) {
    const mid = lo + hi >>> 1;
    const midVal = decodeTree[mid];
    if (midVal < char) {
      lo = mid + 1;
    } else if (midVal > char) {
      hi = mid - 1;
    } else {
      return decodeTree[mid + branchCount];
    }
  }
  return -1;
}
const htmlDecoder = getDecoder(htmlDecodeTree);
getDecoder(xmlDecodeTree);
function decodeHTML(str, mode = DecodingMode.Legacy) {
  return htmlDecoder(str, mode);
}
function _class$1(obj) {
  return Object.prototype.toString.call(obj);
}
function isString$1(obj) {
  return _class$1(obj) === "[object String]";
}
const _hasOwnProperty = Object.prototype.hasOwnProperty;
function has(object, key) {
  return _hasOwnProperty.call(object, key);
}
function assign$1(obj) {
  const sources = Array.prototype.slice.call(arguments, 1);
  sources.forEach(function(source) {
    if (!source) {
      return;
    }
    if (typeof source !== "object") {
      throw new TypeError(source + "must be object");
    }
    Object.keys(source).forEach(function(key) {
      obj[key] = source[key];
    });
  });
  return obj;
}
function arrayReplaceAt(src, pos, newElements) {
  return [].concat(src.slice(0, pos), newElements, src.slice(pos + 1));
}
function isValidEntityCode(c) {
  if (c >= 55296 && c <= 57343) {
    return false;
  }
  if (c >= 64976 && c <= 65007) {
    return false;
  }
  if ((c & 65535) === 65535 || (c & 65535) === 65534) {
    return false;
  }
  if (c >= 0 && c <= 8) {
    return false;
  }
  if (c === 11) {
    return false;
  }
  if (c >= 14 && c <= 31) {
    return false;
  }
  if (c >= 127 && c <= 159) {
    return false;
  }
  if (c > 1114111) {
    return false;
  }
  return true;
}
function fromCodePoint(c) {
  if (c > 65535) {
    c -= 65536;
    const surrogate1 = 55296 + (c >> 10);
    const surrogate2 = 56320 + (c & 1023);
    return String.fromCharCode(surrogate1, surrogate2);
  }
  return String.fromCharCode(c);
}
const UNESCAPE_MD_RE = /\\([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/g;
const ENTITY_RE = /&([a-z#][a-z0-9]{1,31});/gi;
const UNESCAPE_ALL_RE = new RegExp(UNESCAPE_MD_RE.source + "|" + ENTITY_RE.source, "gi");
const DIGITAL_ENTITY_TEST_RE = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))$/i;
function replaceEntityPattern(match2, name) {
  if (name.charCodeAt(0) === 35 && DIGITAL_ENTITY_TEST_RE.test(name)) {
    const code2 = name[1].toLowerCase() === "x" ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10);
    if (isValidEntityCode(code2)) {
      return fromCodePoint(code2);
    }
    return match2;
  }
  const decoded = decodeHTML(match2);
  if (decoded !== match2) {
    return decoded;
  }
  return match2;
}
function unescapeMd(str) {
  if (str.indexOf("\\") < 0) {
    return str;
  }
  return str.replace(UNESCAPE_MD_RE, "$1");
}
function unescapeAll(str) {
  if (str.indexOf("\\") < 0 && str.indexOf("&") < 0) {
    return str;
  }
  return str.replace(UNESCAPE_ALL_RE, function(match2, escaped, entity2) {
    if (escaped) {
      return escaped;
    }
    return replaceEntityPattern(match2, entity2);
  });
}
const HTML_ESCAPE_TEST_RE = /[&<>"]/;
const HTML_ESCAPE_REPLACE_RE = /[&<>"]/g;
const HTML_REPLACEMENTS = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;"
};
function replaceUnsafeChar(ch) {
  return HTML_REPLACEMENTS[ch];
}
function escapeHtml(str) {
  if (HTML_ESCAPE_TEST_RE.test(str)) {
    return str.replace(HTML_ESCAPE_REPLACE_RE, replaceUnsafeChar);
  }
  return str;
}
const REGEXP_ESCAPE_RE = /[.?*+^$[\]\\(){}|-]/g;
function escapeRE$1(str) {
  return str.replace(REGEXP_ESCAPE_RE, "\\$&");
}
function isSpace(code2) {
  switch (code2) {
    case 9:
    case 32:
      return true;
  }
  return false;
}
function isWhiteSpace(code2) {
  if (code2 >= 8192 && code2 <= 8202) {
    return true;
  }
  switch (code2) {
    case 9:
    case 10:
    case 11:
    case 12:
    case 13:
    case 32:
    case 160:
    case 5760:
    case 8239:
    case 8287:
    case 12288:
      return true;
  }
  return false;
}
function isPunctChar(ch) {
  return P.test(ch) || regex.test(ch);
}
function isMdAsciiPunct(ch) {
  switch (ch) {
    case 33:
    case 34:
    case 35:
    case 36:
    case 37:
    case 38:
    case 39:
    case 40:
    case 41:
    case 42:
    case 43:
    case 44:
    case 45:
    case 46:
    case 47:
    case 58:
    case 59:
    case 60:
    case 61:
    case 62:
    case 63:
    case 64:
    case 91:
    case 92:
    case 93:
    case 94:
    case 95:
    case 96:
    case 123:
    case 124:
    case 125:
    case 126:
      return true;
    default:
      return false;
  }
}
function normalizeReference(str) {
  str = str.trim().replace(/\s+/g, " ");
  if ("ẞ".toLowerCase() === "Ṿ") {
    str = str.replace(/ẞ/g, "ß");
  }
  return str.toLowerCase().toUpperCase();
}
const lib = { mdurl, ucmicro };
const utils = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  arrayReplaceAt,
  assign: assign$1,
  escapeHtml,
  escapeRE: escapeRE$1,
  fromCodePoint,
  has,
  isMdAsciiPunct,
  isPunctChar,
  isSpace,
  isString: isString$1,
  isValidEntityCode,
  isWhiteSpace,
  lib,
  normalizeReference,
  unescapeAll,
  unescapeMd
}, Symbol.toStringTag, { value: "Module" }));
function parseLinkLabel(state, start, disableNested) {
  let level, found, marker, prevPos;
  const max = state.posMax;
  const oldPos = state.pos;
  state.pos = start + 1;
  level = 1;
  while (state.pos < max) {
    marker = state.src.charCodeAt(state.pos);
    if (marker === 93) {
      level--;
      if (level === 0) {
        found = true;
        break;
      }
    }
    prevPos = state.pos;
    state.md.inline.skipToken(state);
    if (marker === 91) {
      if (prevPos === state.pos - 1) {
        level++;
      } else if (disableNested) {
        state.pos = oldPos;
        return -1;
      }
    }
  }
  let labelEnd = -1;
  if (found) {
    labelEnd = state.pos;
  }
  state.pos = oldPos;
  return labelEnd;
}
function parseLinkDestination(str, start, max) {
  let code2;
  let pos = start;
  const result = {
    ok: false,
    pos: 0,
    str: ""
  };
  if (str.charCodeAt(pos) === 60) {
    pos++;
    while (pos < max) {
      code2 = str.charCodeAt(pos);
      if (code2 === 10) {
        return result;
      }
      if (code2 === 60) {
        return result;
      }
      if (code2 === 62) {
        result.pos = pos + 1;
        result.str = unescapeAll(str.slice(start + 1, pos));
        result.ok = true;
        return result;
      }
      if (code2 === 92 && pos + 1 < max) {
        pos += 2;
        continue;
      }
      pos++;
    }
    return result;
  }
  let level = 0;
  while (pos < max) {
    code2 = str.charCodeAt(pos);
    if (code2 === 32) {
      break;
    }
    if (code2 < 32 || code2 === 127) {
      break;
    }
    if (code2 === 92 && pos + 1 < max) {
      if (str.charCodeAt(pos + 1) === 32) {
        break;
      }
      pos += 2;
      continue;
    }
    if (code2 === 40) {
      level++;
      if (level > 32) {
        return result;
      }
    }
    if (code2 === 41) {
      if (level === 0) {
        break;
      }
      level--;
    }
    pos++;
  }
  if (start === pos) {
    return result;
  }
  if (level !== 0) {
    return result;
  }
  result.str = unescapeAll(str.slice(start, pos));
  result.pos = pos;
  result.ok = true;
  return result;
}
function parseLinkTitle(str, start, max, prev_state) {
  let code2;
  let pos = start;
  const state = {
    // if `true`, this is a valid link title
    ok: false,
    // if `true`, this link can be continued on the next line
    can_continue: false,
    // if `ok`, it's the position of the first character after the closing marker
    pos: 0,
    // if `ok`, it's the unescaped title
    str: "",
    // expected closing marker character code
    marker: 0
  };
  if (prev_state) {
    state.str = prev_state.str;
    state.marker = prev_state.marker;
  } else {
    if (pos >= max) {
      return state;
    }
    let marker = str.charCodeAt(pos);
    if (marker !== 34 && marker !== 39 && marker !== 40) {
      return state;
    }
    start++;
    pos++;
    if (marker === 40) {
      marker = 41;
    }
    state.marker = marker;
  }
  while (pos < max) {
    code2 = str.charCodeAt(pos);
    if (code2 === state.marker) {
      state.pos = pos + 1;
      state.str += unescapeAll(str.slice(start, pos));
      state.ok = true;
      return state;
    } else if (code2 === 40 && state.marker === 41) {
      return state;
    } else if (code2 === 92 && pos + 1 < max) {
      pos++;
    }
    pos++;
  }
  state.can_continue = true;
  state.str += unescapeAll(str.slice(start, pos));
  return state;
}
const helpers = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  parseLinkDestination,
  parseLinkLabel,
  parseLinkTitle
}, Symbol.toStringTag, { value: "Module" }));
const default_rules = {};
default_rules.code_inline = function(tokens, idx, options, env, slf) {
  const token = tokens[idx];
  return "<code" + slf.renderAttrs(token) + ">" + escapeHtml(token.content) + "</code>";
};
default_rules.code_block = function(tokens, idx, options, env, slf) {
  const token = tokens[idx];
  return "<pre" + slf.renderAttrs(token) + "><code>" + escapeHtml(tokens[idx].content) + "</code></pre>\n";
};
default_rules.fence = function(tokens, idx, options, env, slf) {
  const token = tokens[idx];
  const info = token.info ? unescapeAll(token.info).trim() : "";
  let langName = "";
  let langAttrs = "";
  if (info) {
    const arr = info.split(/(\s+)/g);
    langName = arr[0];
    langAttrs = arr.slice(2).join("");
  }
  let highlighted;
  if (options.highlight) {
    highlighted = options.highlight(token.content, langName, langAttrs) || escapeHtml(token.content);
  } else {
    highlighted = escapeHtml(token.content);
  }
  if (highlighted.indexOf("<pre") === 0) {
    return highlighted + "\n";
  }
  if (info) {
    const i = token.attrIndex("class");
    const tmpAttrs = token.attrs ? token.attrs.slice() : [];
    if (i < 0) {
      tmpAttrs.push(["class", options.langPrefix + langName]);
    } else {
      tmpAttrs[i] = tmpAttrs[i].slice();
      tmpAttrs[i][1] += " " + options.langPrefix + langName;
    }
    const tmpToken = {
      attrs: tmpAttrs
    };
    return `<pre><code${slf.renderAttrs(tmpToken)}>${highlighted}</code></pre>
`;
  }
  return `<pre><code${slf.renderAttrs(token)}>${highlighted}</code></pre>
`;
};
default_rules.image = function(tokens, idx, options, env, slf) {
  const token = tokens[idx];
  token.attrs[token.attrIndex("alt")][1] = slf.renderInlineAsText(token.children, options, env);
  return slf.renderToken(tokens, idx, options);
};
default_rules.hardbreak = function(tokens, idx, options) {
  return options.xhtmlOut ? "<br />\n" : "<br>\n";
};
default_rules.softbreak = function(tokens, idx, options) {
  return options.breaks ? options.xhtmlOut ? "<br />\n" : "<br>\n" : "\n";
};
default_rules.text = function(tokens, idx) {
  return escapeHtml(tokens[idx].content);
};
default_rules.html_block = function(tokens, idx) {
  return tokens[idx].content;
};
default_rules.html_inline = function(tokens, idx) {
  return tokens[idx].content;
};
function Renderer() {
  this.rules = assign$1({}, default_rules);
}
Renderer.prototype.renderAttrs = function renderAttrs(token) {
  let i, l, result;
  if (!token.attrs) {
    return "";
  }
  result = "";
  for (i = 0, l = token.attrs.length; i < l; i++) {
    result += " " + escapeHtml(token.attrs[i][0]) + '="' + escapeHtml(token.attrs[i][1]) + '"';
  }
  return result;
};
Renderer.prototype.renderToken = function renderToken(tokens, idx, options) {
  const token = tokens[idx];
  let result = "";
  if (token.hidden) {
    return "";
  }
  if (token.block && token.nesting !== -1 && idx && tokens[idx - 1].hidden) {
    result += "\n";
  }
  result += (token.nesting === -1 ? "</" : "<") + token.tag;
  result += this.renderAttrs(token);
  if (token.nesting === 0 && options.xhtmlOut) {
    result += " /";
  }
  let needLf = false;
  if (token.block) {
    needLf = true;
    if (token.nesting === 1) {
      if (idx + 1 < tokens.length) {
        const nextToken = tokens[idx + 1];
        if (nextToken.type === "inline" || nextToken.hidden) {
          needLf = false;
        } else if (nextToken.nesting === -1 && nextToken.tag === token.tag) {
          needLf = false;
        }
      }
    }
  }
  result += needLf ? ">\n" : ">";
  return result;
};
Renderer.prototype.renderInline = function(tokens, options, env) {
  let result = "";
  const rules = this.rules;
  for (let i = 0, len = tokens.length; i < len; i++) {
    const type = tokens[i].type;
    if (typeof rules[type] !== "undefined") {
      result += rules[type](tokens, i, options, env, this);
    } else {
      result += this.renderToken(tokens, i, options);
    }
  }
  return result;
};
Renderer.prototype.renderInlineAsText = function(tokens, options, env) {
  let result = "";
  for (let i = 0, len = tokens.length; i < len; i++) {
    switch (tokens[i].type) {
      case "text":
        result += tokens[i].content;
        break;
      case "image":
        result += this.renderInlineAsText(tokens[i].children, options, env);
        break;
      case "html_inline":
      case "html_block":
        result += tokens[i].content;
        break;
      case "softbreak":
      case "hardbreak":
        result += "\n";
        break;
    }
  }
  return result;
};
Renderer.prototype.render = function(tokens, options, env) {
  let result = "";
  const rules = this.rules;
  for (let i = 0, len = tokens.length; i < len; i++) {
    const type = tokens[i].type;
    if (type === "inline") {
      result += this.renderInline(tokens[i].children, options, env);
    } else if (typeof rules[type] !== "undefined") {
      result += rules[type](tokens, i, options, env, this);
    } else {
      result += this.renderToken(tokens, i, options, env);
    }
  }
  return result;
};
function Ruler() {
  this.__rules__ = [];
  this.__cache__ = null;
}
Ruler.prototype.__find__ = function(name) {
  for (let i = 0; i < this.__rules__.length; i++) {
    if (this.__rules__[i].name === name) {
      return i;
    }
  }
  return -1;
};
Ruler.prototype.__compile__ = function() {
  const self2 = this;
  const chains = [""];
  self2.__rules__.forEach(function(rule) {
    if (!rule.enabled) {
      return;
    }
    rule.alt.forEach(function(altName) {
      if (chains.indexOf(altName) < 0) {
        chains.push(altName);
      }
    });
  });
  self2.__cache__ = {};
  chains.forEach(function(chain) {
    self2.__cache__[chain] = [];
    self2.__rules__.forEach(function(rule) {
      if (!rule.enabled) {
        return;
      }
      if (chain && rule.alt.indexOf(chain) < 0) {
        return;
      }
      self2.__cache__[chain].push(rule.fn);
    });
  });
};
Ruler.prototype.at = function(name, fn, options) {
  const index = this.__find__(name);
  const opt = options || {};
  if (index === -1) {
    throw new Error("Parser rule not found: " + name);
  }
  this.__rules__[index].fn = fn;
  this.__rules__[index].alt = opt.alt || [];
  this.__cache__ = null;
};
Ruler.prototype.before = function(beforeName, ruleName, fn, options) {
  const index = this.__find__(beforeName);
  const opt = options || {};
  if (index === -1) {
    throw new Error("Parser rule not found: " + beforeName);
  }
  this.__rules__.splice(index, 0, {
    name: ruleName,
    enabled: true,
    fn,
    alt: opt.alt || []
  });
  this.__cache__ = null;
};
Ruler.prototype.after = function(afterName, ruleName, fn, options) {
  const index = this.__find__(afterName);
  const opt = options || {};
  if (index === -1) {
    throw new Error("Parser rule not found: " + afterName);
  }
  this.__rules__.splice(index + 1, 0, {
    name: ruleName,
    enabled: true,
    fn,
    alt: opt.alt || []
  });
  this.__cache__ = null;
};
Ruler.prototype.push = function(ruleName, fn, options) {
  const opt = options || {};
  this.__rules__.push({
    name: ruleName,
    enabled: true,
    fn,
    alt: opt.alt || []
  });
  this.__cache__ = null;
};
Ruler.prototype.enable = function(list2, ignoreInvalid) {
  if (!Array.isArray(list2)) {
    list2 = [list2];
  }
  const result = [];
  list2.forEach(function(name) {
    const idx = this.__find__(name);
    if (idx < 0) {
      if (ignoreInvalid) {
        return;
      }
      throw new Error("Rules manager: invalid rule name " + name);
    }
    this.__rules__[idx].enabled = true;
    result.push(name);
  }, this);
  this.__cache__ = null;
  return result;
};
Ruler.prototype.enableOnly = function(list2, ignoreInvalid) {
  if (!Array.isArray(list2)) {
    list2 = [list2];
  }
  this.__rules__.forEach(function(rule) {
    rule.enabled = false;
  });
  this.enable(list2, ignoreInvalid);
};
Ruler.prototype.disable = function(list2, ignoreInvalid) {
  if (!Array.isArray(list2)) {
    list2 = [list2];
  }
  const result = [];
  list2.forEach(function(name) {
    const idx = this.__find__(name);
    if (idx < 0) {
      if (ignoreInvalid) {
        return;
      }
      throw new Error("Rules manager: invalid rule name " + name);
    }
    this.__rules__[idx].enabled = false;
    result.push(name);
  }, this);
  this.__cache__ = null;
  return result;
};
Ruler.prototype.getRules = function(chainName) {
  if (this.__cache__ === null) {
    this.__compile__();
  }
  return this.__cache__[chainName] || [];
};
function Token(type, tag, nesting) {
  this.type = type;
  this.tag = tag;
  this.attrs = null;
  this.map = null;
  this.nesting = nesting;
  this.level = 0;
  this.children = null;
  this.content = "";
  this.markup = "";
  this.info = "";
  this.meta = null;
  this.block = false;
  this.hidden = false;
}
Token.prototype.attrIndex = function attrIndex(name) {
  if (!this.attrs) {
    return -1;
  }
  const attrs = this.attrs;
  for (let i = 0, len = attrs.length; i < len; i++) {
    if (attrs[i][0] === name) {
      return i;
    }
  }
  return -1;
};
Token.prototype.attrPush = function attrPush(attrData) {
  if (this.attrs) {
    this.attrs.push(attrData);
  } else {
    this.attrs = [attrData];
  }
};
Token.prototype.attrSet = function attrSet(name, value) {
  const idx = this.attrIndex(name);
  const attrData = [name, value];
  if (idx < 0) {
    this.attrPush(attrData);
  } else {
    this.attrs[idx] = attrData;
  }
};
Token.prototype.attrGet = function attrGet(name) {
  const idx = this.attrIndex(name);
  let value = null;
  if (idx >= 0) {
    value = this.attrs[idx][1];
  }
  return value;
};
Token.prototype.attrJoin = function attrJoin(name, value) {
  const idx = this.attrIndex(name);
  if (idx < 0) {
    this.attrPush([name, value]);
  } else {
    this.attrs[idx][1] = this.attrs[idx][1] + " " + value;
  }
};
function StateCore(src, md, env) {
  this.src = src;
  this.env = env;
  this.tokens = [];
  this.inlineMode = false;
  this.md = md;
}
StateCore.prototype.Token = Token;
const NEWLINES_RE = /\r\n?|\n/g;
const NULL_RE = /\0/g;
function normalize(state) {
  let str;
  str = state.src.replace(NEWLINES_RE, "\n");
  str = str.replace(NULL_RE, "�");
  state.src = str;
}
function block(state) {
  let token;
  if (state.inlineMode) {
    token = new state.Token("inline", "", 0);
    token.content = state.src;
    token.map = [0, 1];
    token.children = [];
    state.tokens.push(token);
  } else {
    state.md.block.parse(state.src, state.md, state.env, state.tokens);
  }
}
function inline(state) {
  const tokens = state.tokens;
  for (let i = 0, l = tokens.length; i < l; i++) {
    const tok = tokens[i];
    if (tok.type === "inline") {
      state.md.inline.parse(tok.content, state.md, state.env, tok.children);
    }
  }
}
function isLinkOpen$1(str) {
  return /^<a[>\s]/i.test(str);
}
function isLinkClose$1(str) {
  return /^<\/a\s*>/i.test(str);
}
function linkify$1(state) {
  const blockTokens = state.tokens;
  if (!state.md.options.linkify) {
    return;
  }
  for (let j = 0, l = blockTokens.length; j < l; j++) {
    if (blockTokens[j].type !== "inline" || !state.md.linkify.pretest(blockTokens[j].content)) {
      continue;
    }
    let tokens = blockTokens[j].children;
    let htmlLinkLevel = 0;
    for (let i = tokens.length - 1; i >= 0; i--) {
      const currentToken = tokens[i];
      if (currentToken.type === "link_close") {
        i--;
        while (tokens[i].level !== currentToken.level && tokens[i].type !== "link_open") {
          i--;
        }
        continue;
      }
      if (currentToken.type === "html_inline") {
        if (isLinkOpen$1(currentToken.content) && htmlLinkLevel > 0) {
          htmlLinkLevel--;
        }
        if (isLinkClose$1(currentToken.content)) {
          htmlLinkLevel++;
        }
      }
      if (htmlLinkLevel > 0) {
        continue;
      }
      if (currentToken.type === "text" && state.md.linkify.test(currentToken.content)) {
        const text2 = currentToken.content;
        let links = state.md.linkify.match(text2);
        const nodes = [];
        let level = currentToken.level;
        let lastPos = 0;
        if (links.length > 0 && links[0].index === 0 && i > 0 && tokens[i - 1].type === "text_special") {
          links = links.slice(1);
        }
        for (let ln = 0; ln < links.length; ln++) {
          const url2 = links[ln].url;
          const fullUrl = state.md.normalizeLink(url2);
          if (!state.md.validateLink(fullUrl)) {
            continue;
          }
          let urlText = links[ln].text;
          if (!links[ln].schema) {
            urlText = state.md.normalizeLinkText("http://" + urlText).replace(/^http:\/\//, "");
          } else if (links[ln].schema === "mailto:" && !/^mailto:/i.test(urlText)) {
            urlText = state.md.normalizeLinkText("mailto:" + urlText).replace(/^mailto:/, "");
          } else {
            urlText = state.md.normalizeLinkText(urlText);
          }
          const pos = links[ln].index;
          if (pos > lastPos) {
            const token = new state.Token("text", "", 0);
            token.content = text2.slice(lastPos, pos);
            token.level = level;
            nodes.push(token);
          }
          const token_o = new state.Token("link_open", "a", 1);
          token_o.attrs = [["href", fullUrl]];
          token_o.level = level++;
          token_o.markup = "linkify";
          token_o.info = "auto";
          nodes.push(token_o);
          const token_t = new state.Token("text", "", 0);
          token_t.content = urlText;
          token_t.level = level;
          nodes.push(token_t);
          const token_c = new state.Token("link_close", "a", -1);
          token_c.level = --level;
          token_c.markup = "linkify";
          token_c.info = "auto";
          nodes.push(token_c);
          lastPos = links[ln].lastIndex;
        }
        if (lastPos < text2.length) {
          const token = new state.Token("text", "", 0);
          token.content = text2.slice(lastPos);
          token.level = level;
          nodes.push(token);
        }
        blockTokens[j].children = tokens = arrayReplaceAt(tokens, i, nodes);
      }
    }
  }
}
const RARE_RE = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/;
const SCOPED_ABBR_TEST_RE = /\((c|tm|r)\)/i;
const SCOPED_ABBR_RE = /\((c|tm|r)\)/ig;
const SCOPED_ABBR = {
  c: "©",
  r: "®",
  tm: "™"
};
function replaceFn(match2, name) {
  return SCOPED_ABBR[name.toLowerCase()];
}
function replace_scoped(inlineTokens) {
  let inside_autolink = 0;
  for (let i = inlineTokens.length - 1; i >= 0; i--) {
    const token = inlineTokens[i];
    if (token.type === "text" && !inside_autolink) {
      token.content = token.content.replace(SCOPED_ABBR_RE, replaceFn);
    }
    if (token.type === "link_open" && token.info === "auto") {
      inside_autolink--;
    }
    if (token.type === "link_close" && token.info === "auto") {
      inside_autolink++;
    }
  }
}
function replace_rare(inlineTokens) {
  let inside_autolink = 0;
  for (let i = inlineTokens.length - 1; i >= 0; i--) {
    const token = inlineTokens[i];
    if (token.type === "text" && !inside_autolink) {
      if (RARE_RE.test(token.content)) {
        token.content = token.content.replace(/\+-/g, "±").replace(/\.{2,}/g, "…").replace(/([?!])…/g, "$1..").replace(/([?!]){4,}/g, "$1$1$1").replace(/,{2,}/g, ",").replace(/(^|[^-])---(?=[^-]|$)/mg, "$1—").replace(/(^|\s)--(?=\s|$)/mg, "$1–").replace(/(^|[^-\s])--(?=[^-\s]|$)/mg, "$1–");
      }
    }
    if (token.type === "link_open" && token.info === "auto") {
      inside_autolink--;
    }
    if (token.type === "link_close" && token.info === "auto") {
      inside_autolink++;
    }
  }
}
function replace(state) {
  let blkIdx;
  if (!state.md.options.typographer) {
    return;
  }
  for (blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {
    if (state.tokens[blkIdx].type !== "inline") {
      continue;
    }
    if (SCOPED_ABBR_TEST_RE.test(state.tokens[blkIdx].content)) {
      replace_scoped(state.tokens[blkIdx].children);
    }
    if (RARE_RE.test(state.tokens[blkIdx].content)) {
      replace_rare(state.tokens[blkIdx].children);
    }
  }
}
const QUOTE_TEST_RE = /['"]/;
const QUOTE_RE = /['"]/g;
const APOSTROPHE = "’";
function replaceAt(str, index, ch) {
  return str.slice(0, index) + ch + str.slice(index + 1);
}
function process_inlines(tokens, state) {
  let j;
  const stack = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const thisLevel = tokens[i].level;
    for (j = stack.length - 1; j >= 0; j--) {
      if (stack[j].level <= thisLevel) {
        break;
      }
    }
    stack.length = j + 1;
    if (token.type !== "text") {
      continue;
    }
    let text2 = token.content;
    let pos = 0;
    let max = text2.length;
    OUTER:
      while (pos < max) {
        QUOTE_RE.lastIndex = pos;
        const t = QUOTE_RE.exec(text2);
        if (!t) {
          break;
        }
        let canOpen = true;
        let canClose = true;
        pos = t.index + 1;
        const isSingle = t[0] === "'";
        let lastChar = 32;
        if (t.index - 1 >= 0) {
          lastChar = text2.charCodeAt(t.index - 1);
        } else {
          for (j = i - 1; j >= 0; j--) {
            if (tokens[j].type === "softbreak" || tokens[j].type === "hardbreak")
              break;
            if (!tokens[j].content)
              continue;
            lastChar = tokens[j].content.charCodeAt(tokens[j].content.length - 1);
            break;
          }
        }
        let nextChar = 32;
        if (pos < max) {
          nextChar = text2.charCodeAt(pos);
        } else {
          for (j = i + 1; j < tokens.length; j++) {
            if (tokens[j].type === "softbreak" || tokens[j].type === "hardbreak")
              break;
            if (!tokens[j].content)
              continue;
            nextChar = tokens[j].content.charCodeAt(0);
            break;
          }
        }
        const isLastPunctChar = isMdAsciiPunct(lastChar) || isPunctChar(String.fromCharCode(lastChar));
        const isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctChar(String.fromCharCode(nextChar));
        const isLastWhiteSpace = isWhiteSpace(lastChar);
        const isNextWhiteSpace = isWhiteSpace(nextChar);
        if (isNextWhiteSpace) {
          canOpen = false;
        } else if (isNextPunctChar) {
          if (!(isLastWhiteSpace || isLastPunctChar)) {
            canOpen = false;
          }
        }
        if (isLastWhiteSpace) {
          canClose = false;
        } else if (isLastPunctChar) {
          if (!(isNextWhiteSpace || isNextPunctChar)) {
            canClose = false;
          }
        }
        if (nextChar === 34 && t[0] === '"') {
          if (lastChar >= 48 && lastChar <= 57) {
            canClose = canOpen = false;
          }
        }
        if (canOpen && canClose) {
          canOpen = isLastPunctChar;
          canClose = isNextPunctChar;
        }
        if (!canOpen && !canClose) {
          if (isSingle) {
            token.content = replaceAt(token.content, t.index, APOSTROPHE);
          }
          continue;
        }
        if (canClose) {
          for (j = stack.length - 1; j >= 0; j--) {
            let item = stack[j];
            if (stack[j].level < thisLevel) {
              break;
            }
            if (item.single === isSingle && stack[j].level === thisLevel) {
              item = stack[j];
              let openQuote;
              let closeQuote;
              if (isSingle) {
                openQuote = state.md.options.quotes[2];
                closeQuote = state.md.options.quotes[3];
              } else {
                openQuote = state.md.options.quotes[0];
                closeQuote = state.md.options.quotes[1];
              }
              token.content = replaceAt(token.content, t.index, closeQuote);
              tokens[item.token].content = replaceAt(
                tokens[item.token].content,
                item.pos,
                openQuote
              );
              pos += closeQuote.length - 1;
              if (item.token === i) {
                pos += openQuote.length - 1;
              }
              text2 = token.content;
              max = text2.length;
              stack.length = j;
              continue OUTER;
            }
          }
        }
        if (canOpen) {
          stack.push({
            token: i,
            pos: t.index,
            single: isSingle,
            level: thisLevel
          });
        } else if (canClose && isSingle) {
          token.content = replaceAt(token.content, t.index, APOSTROPHE);
        }
      }
  }
}
function smartquotes(state) {
  if (!state.md.options.typographer) {
    return;
  }
  for (let blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {
    if (state.tokens[blkIdx].type !== "inline" || !QUOTE_TEST_RE.test(state.tokens[blkIdx].content)) {
      continue;
    }
    process_inlines(state.tokens[blkIdx].children, state);
  }
}
function text_join(state) {
  let curr, last;
  const blockTokens = state.tokens;
  const l = blockTokens.length;
  for (let j = 0; j < l; j++) {
    if (blockTokens[j].type !== "inline")
      continue;
    const tokens = blockTokens[j].children;
    const max = tokens.length;
    for (curr = 0; curr < max; curr++) {
      if (tokens[curr].type === "text_special") {
        tokens[curr].type = "text";
      }
    }
    for (curr = last = 0; curr < max; curr++) {
      if (tokens[curr].type === "text" && curr + 1 < max && tokens[curr + 1].type === "text") {
        tokens[curr + 1].content = tokens[curr].content + tokens[curr + 1].content;
      } else {
        if (curr !== last) {
          tokens[last] = tokens[curr];
        }
        last++;
      }
    }
    if (curr !== last) {
      tokens.length = last;
    }
  }
}
const _rules$2 = [
  ["normalize", normalize],
  ["block", block],
  ["inline", inline],
  ["linkify", linkify$1],
  ["replacements", replace],
  ["smartquotes", smartquotes],
  // `text_join` finds `text_special` tokens (for escape sequences)
  // and joins them with the rest of the text
  ["text_join", text_join]
];
function Core() {
  this.ruler = new Ruler();
  for (let i = 0; i < _rules$2.length; i++) {
    this.ruler.push(_rules$2[i][0], _rules$2[i][1]);
  }
}
Core.prototype.process = function(state) {
  const rules = this.ruler.getRules("");
  for (let i = 0, l = rules.length; i < l; i++) {
    rules[i](state);
  }
};
Core.prototype.State = StateCore;
function StateBlock(src, md, env, tokens) {
  this.src = src;
  this.md = md;
  this.env = env;
  this.tokens = tokens;
  this.bMarks = [];
  this.eMarks = [];
  this.tShift = [];
  this.sCount = [];
  this.bsCount = [];
  this.blkIndent = 0;
  this.line = 0;
  this.lineMax = 0;
  this.tight = false;
  this.ddIndent = -1;
  this.listIndent = -1;
  this.parentType = "root";
  this.level = 0;
  const s = this.src;
  for (let start = 0, pos = 0, indent = 0, offset = 0, len = s.length, indent_found = false; pos < len; pos++) {
    const ch = s.charCodeAt(pos);
    if (!indent_found) {
      if (isSpace(ch)) {
        indent++;
        if (ch === 9) {
          offset += 4 - offset % 4;
        } else {
          offset++;
        }
        continue;
      } else {
        indent_found = true;
      }
    }
    if (ch === 10 || pos === len - 1) {
      if (ch !== 10) {
        pos++;
      }
      this.bMarks.push(start);
      this.eMarks.push(pos);
      this.tShift.push(indent);
      this.sCount.push(offset);
      this.bsCount.push(0);
      indent_found = false;
      indent = 0;
      offset = 0;
      start = pos + 1;
    }
  }
  this.bMarks.push(s.length);
  this.eMarks.push(s.length);
  this.tShift.push(0);
  this.sCount.push(0);
  this.bsCount.push(0);
  this.lineMax = this.bMarks.length - 1;
}
StateBlock.prototype.push = function(type, tag, nesting) {
  const token = new Token(type, tag, nesting);
  token.block = true;
  if (nesting < 0)
    this.level--;
  token.level = this.level;
  if (nesting > 0)
    this.level++;
  this.tokens.push(token);
  return token;
};
StateBlock.prototype.isEmpty = function isEmpty(line) {
  return this.bMarks[line] + this.tShift[line] >= this.eMarks[line];
};
StateBlock.prototype.skipEmptyLines = function skipEmptyLines(from) {
  for (let max = this.lineMax; from < max; from++) {
    if (this.bMarks[from] + this.tShift[from] < this.eMarks[from]) {
      break;
    }
  }
  return from;
};
StateBlock.prototype.skipSpaces = function skipSpaces(pos) {
  for (let max = this.src.length; pos < max; pos++) {
    const ch = this.src.charCodeAt(pos);
    if (!isSpace(ch)) {
      break;
    }
  }
  return pos;
};
StateBlock.prototype.skipSpacesBack = function skipSpacesBack(pos, min) {
  if (pos <= min) {
    return pos;
  }
  while (pos > min) {
    if (!isSpace(this.src.charCodeAt(--pos))) {
      return pos + 1;
    }
  }
  return pos;
};
StateBlock.prototype.skipChars = function skipChars(pos, code2) {
  for (let max = this.src.length; pos < max; pos++) {
    if (this.src.charCodeAt(pos) !== code2) {
      break;
    }
  }
  return pos;
};
StateBlock.prototype.skipCharsBack = function skipCharsBack(pos, code2, min) {
  if (pos <= min) {
    return pos;
  }
  while (pos > min) {
    if (code2 !== this.src.charCodeAt(--pos)) {
      return pos + 1;
    }
  }
  return pos;
};
StateBlock.prototype.getLines = function getLines(begin, end, indent, keepLastLF) {
  if (begin >= end) {
    return "";
  }
  const queue2 = new Array(end - begin);
  for (let i = 0, line = begin; line < end; line++, i++) {
    let lineIndent = 0;
    const lineStart = this.bMarks[line];
    let first = lineStart;
    let last;
    if (line + 1 < end || keepLastLF) {
      last = this.eMarks[line] + 1;
    } else {
      last = this.eMarks[line];
    }
    while (first < last && lineIndent < indent) {
      const ch = this.src.charCodeAt(first);
      if (isSpace(ch)) {
        if (ch === 9) {
          lineIndent += 4 - (lineIndent + this.bsCount[line]) % 4;
        } else {
          lineIndent++;
        }
      } else if (first - lineStart < this.tShift[line]) {
        lineIndent++;
      } else {
        break;
      }
      first++;
    }
    if (lineIndent > indent) {
      queue2[i] = new Array(lineIndent - indent + 1).join(" ") + this.src.slice(first, last);
    } else {
      queue2[i] = this.src.slice(first, last);
    }
  }
  return queue2.join("");
};
StateBlock.prototype.Token = Token;
const MAX_AUTOCOMPLETED_CELLS = 65536;
function getLine(state, line) {
  const pos = state.bMarks[line] + state.tShift[line];
  const max = state.eMarks[line];
  return state.src.slice(pos, max);
}
function escapedSplit(str) {
  const result = [];
  const max = str.length;
  let pos = 0;
  let ch = str.charCodeAt(pos);
  let isEscaped = false;
  let lastPos = 0;
  let current = "";
  while (pos < max) {
    if (ch === 124) {
      if (!isEscaped) {
        result.push(current + str.substring(lastPos, pos));
        current = "";
        lastPos = pos + 1;
      } else {
        current += str.substring(lastPos, pos - 1);
        lastPos = pos;
      }
    }
    isEscaped = ch === 92;
    pos++;
    ch = str.charCodeAt(pos);
  }
  result.push(current + str.substring(lastPos));
  return result;
}
function table(state, startLine, endLine, silent) {
  if (startLine + 2 > endLine) {
    return false;
  }
  let nextLine = startLine + 1;
  if (state.sCount[nextLine] < state.blkIndent) {
    return false;
  }
  if (state.sCount[nextLine] - state.blkIndent >= 4) {
    return false;
  }
  let pos = state.bMarks[nextLine] + state.tShift[nextLine];
  if (pos >= state.eMarks[nextLine]) {
    return false;
  }
  const firstCh = state.src.charCodeAt(pos++);
  if (firstCh !== 124 && firstCh !== 45 && firstCh !== 58) {
    return false;
  }
  if (pos >= state.eMarks[nextLine]) {
    return false;
  }
  const secondCh = state.src.charCodeAt(pos++);
  if (secondCh !== 124 && secondCh !== 45 && secondCh !== 58 && !isSpace(secondCh)) {
    return false;
  }
  if (firstCh === 45 && isSpace(secondCh)) {
    return false;
  }
  while (pos < state.eMarks[nextLine]) {
    const ch = state.src.charCodeAt(pos);
    if (ch !== 124 && ch !== 45 && ch !== 58 && !isSpace(ch)) {
      return false;
    }
    pos++;
  }
  let lineText = getLine(state, startLine + 1);
  let columns = lineText.split("|");
  const aligns = [];
  for (let i = 0; i < columns.length; i++) {
    const t = columns[i].trim();
    if (!t) {
      if (i === 0 || i === columns.length - 1) {
        continue;
      } else {
        return false;
      }
    }
    if (!/^:?-+:?$/.test(t)) {
      return false;
    }
    if (t.charCodeAt(t.length - 1) === 58) {
      aligns.push(t.charCodeAt(0) === 58 ? "center" : "right");
    } else if (t.charCodeAt(0) === 58) {
      aligns.push("left");
    } else {
      aligns.push("");
    }
  }
  lineText = getLine(state, startLine).trim();
  if (lineText.indexOf("|") === -1) {
    return false;
  }
  if (state.sCount[startLine] - state.blkIndent >= 4) {
    return false;
  }
  columns = escapedSplit(lineText);
  if (columns.length && columns[0] === "")
    columns.shift();
  if (columns.length && columns[columns.length - 1] === "")
    columns.pop();
  const columnCount = columns.length;
  if (columnCount === 0 || columnCount !== aligns.length) {
    return false;
  }
  if (silent) {
    return true;
  }
  const oldParentType = state.parentType;
  state.parentType = "table";
  const terminatorRules = state.md.block.ruler.getRules("blockquote");
  const token_to = state.push("table_open", "table", 1);
  const tableLines = [startLine, 0];
  token_to.map = tableLines;
  const token_tho = state.push("thead_open", "thead", 1);
  token_tho.map = [startLine, startLine + 1];
  const token_htro = state.push("tr_open", "tr", 1);
  token_htro.map = [startLine, startLine + 1];
  for (let i = 0; i < columns.length; i++) {
    const token_ho = state.push("th_open", "th", 1);
    if (aligns[i]) {
      token_ho.attrs = [["style", "text-align:" + aligns[i]]];
    }
    const token_il = state.push("inline", "", 0);
    token_il.content = columns[i].trim();
    token_il.children = [];
    state.push("th_close", "th", -1);
  }
  state.push("tr_close", "tr", -1);
  state.push("thead_close", "thead", -1);
  let tbodyLines;
  let autocompletedCells = 0;
  for (nextLine = startLine + 2; nextLine < endLine; nextLine++) {
    if (state.sCount[nextLine] < state.blkIndent) {
      break;
    }
    let terminate = false;
    for (let i = 0, l = terminatorRules.length; i < l; i++) {
      if (terminatorRules[i](state, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
    }
    if (terminate) {
      break;
    }
    lineText = getLine(state, nextLine).trim();
    if (!lineText) {
      break;
    }
    if (state.sCount[nextLine] - state.blkIndent >= 4) {
      break;
    }
    columns = escapedSplit(lineText);
    if (columns.length && columns[0] === "")
      columns.shift();
    if (columns.length && columns[columns.length - 1] === "")
      columns.pop();
    autocompletedCells += columnCount - columns.length;
    if (autocompletedCells > MAX_AUTOCOMPLETED_CELLS) {
      break;
    }
    if (nextLine === startLine + 2) {
      const token_tbo = state.push("tbody_open", "tbody", 1);
      token_tbo.map = tbodyLines = [startLine + 2, 0];
    }
    const token_tro = state.push("tr_open", "tr", 1);
    token_tro.map = [nextLine, nextLine + 1];
    for (let i = 0; i < columnCount; i++) {
      const token_tdo = state.push("td_open", "td", 1);
      if (aligns[i]) {
        token_tdo.attrs = [["style", "text-align:" + aligns[i]]];
      }
      const token_il = state.push("inline", "", 0);
      token_il.content = columns[i] ? columns[i].trim() : "";
      token_il.children = [];
      state.push("td_close", "td", -1);
    }
    state.push("tr_close", "tr", -1);
  }
  if (tbodyLines) {
    state.push("tbody_close", "tbody", -1);
    tbodyLines[1] = nextLine;
  }
  state.push("table_close", "table", -1);
  tableLines[1] = nextLine;
  state.parentType = oldParentType;
  state.line = nextLine;
  return true;
}
function code(state, startLine, endLine) {
  if (state.sCount[startLine] - state.blkIndent < 4) {
    return false;
  }
  let nextLine = startLine + 1;
  let last = nextLine;
  while (nextLine < endLine) {
    if (state.isEmpty(nextLine)) {
      nextLine++;
      continue;
    }
    if (state.sCount[nextLine] - state.blkIndent >= 4) {
      nextLine++;
      last = nextLine;
      continue;
    }
    break;
  }
  state.line = last;
  const token = state.push("code_block", "code", 0);
  token.content = state.getLines(startLine, last, 4 + state.blkIndent, false) + "\n";
  token.map = [startLine, state.line];
  return true;
}
function fence(state, startLine, endLine, silent) {
  let pos = state.bMarks[startLine] + state.tShift[startLine];
  let max = state.eMarks[startLine];
  if (state.sCount[startLine] - state.blkIndent >= 4) {
    return false;
  }
  if (pos + 3 > max) {
    return false;
  }
  const marker = state.src.charCodeAt(pos);
  if (marker !== 126 && marker !== 96) {
    return false;
  }
  let mem = pos;
  pos = state.skipChars(pos, marker);
  let len = pos - mem;
  if (len < 3) {
    return false;
  }
  const markup = state.src.slice(mem, pos);
  const params = state.src.slice(pos, max);
  if (marker === 96) {
    if (params.indexOf(String.fromCharCode(marker)) >= 0) {
      return false;
    }
  }
  if (silent) {
    return true;
  }
  let nextLine = startLine;
  let haveEndMarker = false;
  for (; ; ) {
    nextLine++;
    if (nextLine >= endLine) {
      break;
    }
    pos = mem = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];
    if (pos < max && state.sCount[nextLine] < state.blkIndent) {
      break;
    }
    if (state.src.charCodeAt(pos) !== marker) {
      continue;
    }
    if (state.sCount[nextLine] - state.blkIndent >= 4) {
      continue;
    }
    pos = state.skipChars(pos, marker);
    if (pos - mem < len) {
      continue;
    }
    pos = state.skipSpaces(pos);
    if (pos < max) {
      continue;
    }
    haveEndMarker = true;
    break;
  }
  len = state.sCount[startLine];
  state.line = nextLine + (haveEndMarker ? 1 : 0);
  const token = state.push("fence", "code", 0);
  token.info = params;
  token.content = state.getLines(startLine + 1, nextLine, len, true);
  token.markup = markup;
  token.map = [startLine, state.line];
  return true;
}
function blockquote(state, startLine, endLine, silent) {
  let pos = state.bMarks[startLine] + state.tShift[startLine];
  let max = state.eMarks[startLine];
  const oldLineMax = state.lineMax;
  if (state.sCount[startLine] - state.blkIndent >= 4) {
    return false;
  }
  if (state.src.charCodeAt(pos) !== 62) {
    return false;
  }
  if (silent) {
    return true;
  }
  const oldBMarks = [];
  const oldBSCount = [];
  const oldSCount = [];
  const oldTShift = [];
  const terminatorRules = state.md.block.ruler.getRules("blockquote");
  const oldParentType = state.parentType;
  state.parentType = "blockquote";
  let lastLineEmpty = false;
  let nextLine;
  for (nextLine = startLine; nextLine < endLine; nextLine++) {
    const isOutdented = state.sCount[nextLine] < state.blkIndent;
    pos = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];
    if (pos >= max) {
      break;
    }
    if (state.src.charCodeAt(pos++) === 62 && !isOutdented) {
      let initial = state.sCount[nextLine] + 1;
      let spaceAfterMarker;
      let adjustTab;
      if (state.src.charCodeAt(pos) === 32) {
        pos++;
        initial++;
        adjustTab = false;
        spaceAfterMarker = true;
      } else if (state.src.charCodeAt(pos) === 9) {
        spaceAfterMarker = true;
        if ((state.bsCount[nextLine] + initial) % 4 === 3) {
          pos++;
          initial++;
          adjustTab = false;
        } else {
          adjustTab = true;
        }
      } else {
        spaceAfterMarker = false;
      }
      let offset = initial;
      oldBMarks.push(state.bMarks[nextLine]);
      state.bMarks[nextLine] = pos;
      while (pos < max) {
        const ch = state.src.charCodeAt(pos);
        if (isSpace(ch)) {
          if (ch === 9) {
            offset += 4 - (offset + state.bsCount[nextLine] + (adjustTab ? 1 : 0)) % 4;
          } else {
            offset++;
          }
        } else {
          break;
        }
        pos++;
      }
      lastLineEmpty = pos >= max;
      oldBSCount.push(state.bsCount[nextLine]);
      state.bsCount[nextLine] = state.sCount[nextLine] + 1 + (spaceAfterMarker ? 1 : 0);
      oldSCount.push(state.sCount[nextLine]);
      state.sCount[nextLine] = offset - initial;
      oldTShift.push(state.tShift[nextLine]);
      state.tShift[nextLine] = pos - state.bMarks[nextLine];
      continue;
    }
    if (lastLineEmpty) {
      break;
    }
    let terminate = false;
    for (let i = 0, l = terminatorRules.length; i < l; i++) {
      if (terminatorRules[i](state, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
    }
    if (terminate) {
      state.lineMax = nextLine;
      if (state.blkIndent !== 0) {
        oldBMarks.push(state.bMarks[nextLine]);
        oldBSCount.push(state.bsCount[nextLine]);
        oldTShift.push(state.tShift[nextLine]);
        oldSCount.push(state.sCount[nextLine]);
        state.sCount[nextLine] -= state.blkIndent;
      }
      break;
    }
    oldBMarks.push(state.bMarks[nextLine]);
    oldBSCount.push(state.bsCount[nextLine]);
    oldTShift.push(state.tShift[nextLine]);
    oldSCount.push(state.sCount[nextLine]);
    state.sCount[nextLine] = -1;
  }
  const oldIndent = state.blkIndent;
  state.blkIndent = 0;
  const token_o = state.push("blockquote_open", "blockquote", 1);
  token_o.markup = ">";
  const lines = [startLine, 0];
  token_o.map = lines;
  state.md.block.tokenize(state, startLine, nextLine);
  const token_c = state.push("blockquote_close", "blockquote", -1);
  token_c.markup = ">";
  state.lineMax = oldLineMax;
  state.parentType = oldParentType;
  lines[1] = state.line;
  for (let i = 0; i < oldTShift.length; i++) {
    state.bMarks[i + startLine] = oldBMarks[i];
    state.tShift[i + startLine] = oldTShift[i];
    state.sCount[i + startLine] = oldSCount[i];
    state.bsCount[i + startLine] = oldBSCount[i];
  }
  state.blkIndent = oldIndent;
  return true;
}
function hr(state, startLine, endLine, silent) {
  const max = state.eMarks[startLine];
  if (state.sCount[startLine] - state.blkIndent >= 4) {
    return false;
  }
  let pos = state.bMarks[startLine] + state.tShift[startLine];
  const marker = state.src.charCodeAt(pos++);
  if (marker !== 42 && marker !== 45 && marker !== 95) {
    return false;
  }
  let cnt = 1;
  while (pos < max) {
    const ch = state.src.charCodeAt(pos++);
    if (ch !== marker && !isSpace(ch)) {
      return false;
    }
    if (ch === marker) {
      cnt++;
    }
  }
  if (cnt < 3) {
    return false;
  }
  if (silent) {
    return true;
  }
  state.line = startLine + 1;
  const token = state.push("hr", "hr", 0);
  token.map = [startLine, state.line];
  token.markup = Array(cnt + 1).join(String.fromCharCode(marker));
  return true;
}
function skipBulletListMarker(state, startLine) {
  const max = state.eMarks[startLine];
  let pos = state.bMarks[startLine] + state.tShift[startLine];
  const marker = state.src.charCodeAt(pos++);
  if (marker !== 42 && marker !== 45 && marker !== 43) {
    return -1;
  }
  if (pos < max) {
    const ch = state.src.charCodeAt(pos);
    if (!isSpace(ch)) {
      return -1;
    }
  }
  return pos;
}
function skipOrderedListMarker(state, startLine) {
  const start = state.bMarks[startLine] + state.tShift[startLine];
  const max = state.eMarks[startLine];
  let pos = start;
  if (pos + 1 >= max) {
    return -1;
  }
  let ch = state.src.charCodeAt(pos++);
  if (ch < 48 || ch > 57) {
    return -1;
  }
  for (; ; ) {
    if (pos >= max) {
      return -1;
    }
    ch = state.src.charCodeAt(pos++);
    if (ch >= 48 && ch <= 57) {
      if (pos - start >= 10) {
        return -1;
      }
      continue;
    }
    if (ch === 41 || ch === 46) {
      break;
    }
    return -1;
  }
  if (pos < max) {
    ch = state.src.charCodeAt(pos);
    if (!isSpace(ch)) {
      return -1;
    }
  }
  return pos;
}
function markTightParagraphs(state, idx) {
  const level = state.level + 2;
  for (let i = idx + 2, l = state.tokens.length - 2; i < l; i++) {
    if (state.tokens[i].level === level && state.tokens[i].type === "paragraph_open") {
      state.tokens[i + 2].hidden = true;
      state.tokens[i].hidden = true;
      i += 2;
    }
  }
}
function list(state, startLine, endLine, silent) {
  let max, pos, start, token;
  let nextLine = startLine;
  let tight = true;
  if (state.sCount[nextLine] - state.blkIndent >= 4) {
    return false;
  }
  if (state.listIndent >= 0 && state.sCount[nextLine] - state.listIndent >= 4 && state.sCount[nextLine] < state.blkIndent) {
    return false;
  }
  let isTerminatingParagraph = false;
  if (silent && state.parentType === "paragraph") {
    if (state.sCount[nextLine] >= state.blkIndent) {
      isTerminatingParagraph = true;
    }
  }
  let isOrdered;
  let markerValue;
  let posAfterMarker;
  if ((posAfterMarker = skipOrderedListMarker(state, nextLine)) >= 0) {
    isOrdered = true;
    start = state.bMarks[nextLine] + state.tShift[nextLine];
    markerValue = Number(state.src.slice(start, posAfterMarker - 1));
    if (isTerminatingParagraph && markerValue !== 1)
      return false;
  } else if ((posAfterMarker = skipBulletListMarker(state, nextLine)) >= 0) {
    isOrdered = false;
  } else {
    return false;
  }
  if (isTerminatingParagraph) {
    if (state.skipSpaces(posAfterMarker) >= state.eMarks[nextLine])
      return false;
  }
  if (silent) {
    return true;
  }
  const markerCharCode = state.src.charCodeAt(posAfterMarker - 1);
  const listTokIdx = state.tokens.length;
  if (isOrdered) {
    token = state.push("ordered_list_open", "ol", 1);
    if (markerValue !== 1) {
      token.attrs = [["start", markerValue]];
    }
  } else {
    token = state.push("bullet_list_open", "ul", 1);
  }
  const listLines = [nextLine, 0];
  token.map = listLines;
  token.markup = String.fromCharCode(markerCharCode);
  let prevEmptyEnd = false;
  const terminatorRules = state.md.block.ruler.getRules("list");
  const oldParentType = state.parentType;
  state.parentType = "list";
  while (nextLine < endLine) {
    pos = posAfterMarker;
    max = state.eMarks[nextLine];
    const initial = state.sCount[nextLine] + posAfterMarker - (state.bMarks[nextLine] + state.tShift[nextLine]);
    let offset = initial;
    while (pos < max) {
      const ch = state.src.charCodeAt(pos);
      if (ch === 9) {
        offset += 4 - (offset + state.bsCount[nextLine]) % 4;
      } else if (ch === 32) {
        offset++;
      } else {
        break;
      }
      pos++;
    }
    const contentStart = pos;
    let indentAfterMarker;
    if (contentStart >= max) {
      indentAfterMarker = 1;
    } else {
      indentAfterMarker = offset - initial;
    }
    if (indentAfterMarker > 4) {
      indentAfterMarker = 1;
    }
    const indent = initial + indentAfterMarker;
    token = state.push("list_item_open", "li", 1);
    token.markup = String.fromCharCode(markerCharCode);
    const itemLines = [nextLine, 0];
    token.map = itemLines;
    if (isOrdered) {
      token.info = state.src.slice(start, posAfterMarker - 1);
    }
    const oldTight = state.tight;
    const oldTShift = state.tShift[nextLine];
    const oldSCount = state.sCount[nextLine];
    const oldListIndent = state.listIndent;
    state.listIndent = state.blkIndent;
    state.blkIndent = indent;
    state.tight = true;
    state.tShift[nextLine] = contentStart - state.bMarks[nextLine];
    state.sCount[nextLine] = offset;
    if (contentStart >= max && state.isEmpty(nextLine + 1)) {
      state.line = Math.min(state.line + 2, endLine);
    } else {
      state.md.block.tokenize(state, nextLine, endLine, true);
    }
    if (!state.tight || prevEmptyEnd) {
      tight = false;
    }
    prevEmptyEnd = state.line - nextLine > 1 && state.isEmpty(state.line - 1);
    state.blkIndent = state.listIndent;
    state.listIndent = oldListIndent;
    state.tShift[nextLine] = oldTShift;
    state.sCount[nextLine] = oldSCount;
    state.tight = oldTight;
    token = state.push("list_item_close", "li", -1);
    token.markup = String.fromCharCode(markerCharCode);
    nextLine = state.line;
    itemLines[1] = nextLine;
    if (nextLine >= endLine) {
      break;
    }
    if (state.sCount[nextLine] < state.blkIndent) {
      break;
    }
    if (state.sCount[nextLine] - state.blkIndent >= 4) {
      break;
    }
    let terminate = false;
    for (let i = 0, l = terminatorRules.length; i < l; i++) {
      if (terminatorRules[i](state, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
    }
    if (terminate) {
      break;
    }
    if (isOrdered) {
      posAfterMarker = skipOrderedListMarker(state, nextLine);
      if (posAfterMarker < 0) {
        break;
      }
      start = state.bMarks[nextLine] + state.tShift[nextLine];
    } else {
      posAfterMarker = skipBulletListMarker(state, nextLine);
      if (posAfterMarker < 0) {
        break;
      }
    }
    if (markerCharCode !== state.src.charCodeAt(posAfterMarker - 1)) {
      break;
    }
  }
  if (isOrdered) {
    token = state.push("ordered_list_close", "ol", -1);
  } else {
    token = state.push("bullet_list_close", "ul", -1);
  }
  token.markup = String.fromCharCode(markerCharCode);
  listLines[1] = nextLine;
  state.line = nextLine;
  state.parentType = oldParentType;
  if (tight) {
    markTightParagraphs(state, listTokIdx);
  }
  return true;
}
function reference(state, startLine, _endLine, silent) {
  let pos = state.bMarks[startLine] + state.tShift[startLine];
  let max = state.eMarks[startLine];
  let nextLine = startLine + 1;
  if (state.sCount[startLine] - state.blkIndent >= 4) {
    return false;
  }
  if (state.src.charCodeAt(pos) !== 91) {
    return false;
  }
  function getNextLine(nextLine2) {
    const endLine = state.lineMax;
    if (nextLine2 >= endLine || state.isEmpty(nextLine2)) {
      return null;
    }
    let isContinuation = false;
    if (state.sCount[nextLine2] - state.blkIndent > 3) {
      isContinuation = true;
    }
    if (state.sCount[nextLine2] < 0) {
      isContinuation = true;
    }
    if (!isContinuation) {
      const terminatorRules = state.md.block.ruler.getRules("reference");
      const oldParentType = state.parentType;
      state.parentType = "reference";
      let terminate = false;
      for (let i = 0, l = terminatorRules.length; i < l; i++) {
        if (terminatorRules[i](state, nextLine2, endLine, true)) {
          terminate = true;
          break;
        }
      }
      state.parentType = oldParentType;
      if (terminate) {
        return null;
      }
    }
    const pos2 = state.bMarks[nextLine2] + state.tShift[nextLine2];
    const max2 = state.eMarks[nextLine2];
    return state.src.slice(pos2, max2 + 1);
  }
  let str = state.src.slice(pos, max + 1);
  max = str.length;
  let labelEnd = -1;
  for (pos = 1; pos < max; pos++) {
    const ch = str.charCodeAt(pos);
    if (ch === 91) {
      return false;
    } else if (ch === 93) {
      labelEnd = pos;
      break;
    } else if (ch === 10) {
      const lineContent = getNextLine(nextLine);
      if (lineContent !== null) {
        str += lineContent;
        max = str.length;
        nextLine++;
      }
    } else if (ch === 92) {
      pos++;
      if (pos < max && str.charCodeAt(pos) === 10) {
        const lineContent = getNextLine(nextLine);
        if (lineContent !== null) {
          str += lineContent;
          max = str.length;
          nextLine++;
        }
      }
    }
  }
  if (labelEnd < 0 || str.charCodeAt(labelEnd + 1) !== 58) {
    return false;
  }
  for (pos = labelEnd + 2; pos < max; pos++) {
    const ch = str.charCodeAt(pos);
    if (ch === 10) {
      const lineContent = getNextLine(nextLine);
      if (lineContent !== null) {
        str += lineContent;
        max = str.length;
        nextLine++;
      }
    } else if (isSpace(ch))
      ;
    else {
      break;
    }
  }
  const destRes = state.md.helpers.parseLinkDestination(str, pos, max);
  if (!destRes.ok) {
    return false;
  }
  const href = state.md.normalizeLink(destRes.str);
  if (!state.md.validateLink(href)) {
    return false;
  }
  pos = destRes.pos;
  const destEndPos = pos;
  const destEndLineNo = nextLine;
  const start = pos;
  for (; pos < max; pos++) {
    const ch = str.charCodeAt(pos);
    if (ch === 10) {
      const lineContent = getNextLine(nextLine);
      if (lineContent !== null) {
        str += lineContent;
        max = str.length;
        nextLine++;
      }
    } else if (isSpace(ch))
      ;
    else {
      break;
    }
  }
  let titleRes = state.md.helpers.parseLinkTitle(str, pos, max);
  while (titleRes.can_continue) {
    const lineContent = getNextLine(nextLine);
    if (lineContent === null)
      break;
    str += lineContent;
    pos = max;
    max = str.length;
    nextLine++;
    titleRes = state.md.helpers.parseLinkTitle(str, pos, max, titleRes);
  }
  let title;
  if (pos < max && start !== pos && titleRes.ok) {
    title = titleRes.str;
    pos = titleRes.pos;
  } else {
    title = "";
    pos = destEndPos;
    nextLine = destEndLineNo;
  }
  while (pos < max) {
    const ch = str.charCodeAt(pos);
    if (!isSpace(ch)) {
      break;
    }
    pos++;
  }
  if (pos < max && str.charCodeAt(pos) !== 10) {
    if (title) {
      title = "";
      pos = destEndPos;
      nextLine = destEndLineNo;
      while (pos < max) {
        const ch = str.charCodeAt(pos);
        if (!isSpace(ch)) {
          break;
        }
        pos++;
      }
    }
  }
  if (pos < max && str.charCodeAt(pos) !== 10) {
    return false;
  }
  const label = normalizeReference(str.slice(1, labelEnd));
  if (!label) {
    return false;
  }
  if (silent) {
    return true;
  }
  if (typeof state.env.references === "undefined") {
    state.env.references = {};
  }
  if (typeof state.env.references[label] === "undefined") {
    state.env.references[label] = { title, href };
  }
  state.line = nextLine;
  return true;
}
const block_names = [
  "address",
  "article",
  "aside",
  "base",
  "basefont",
  "blockquote",
  "body",
  "caption",
  "center",
  "col",
  "colgroup",
  "dd",
  "details",
  "dialog",
  "dir",
  "div",
  "dl",
  "dt",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "frame",
  "frameset",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hr",
  "html",
  "iframe",
  "legend",
  "li",
  "link",
  "main",
  "menu",
  "menuitem",
  "nav",
  "noframes",
  "ol",
  "optgroup",
  "option",
  "p",
  "param",
  "search",
  "section",
  "summary",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "title",
  "tr",
  "track",
  "ul"
];
const attr_name = "[a-zA-Z_:][a-zA-Z0-9:._-]*";
const unquoted = "[^\"'=<>`\\x00-\\x20]+";
const single_quoted = "'[^']*'";
const double_quoted = '"[^"]*"';
const attr_value = "(?:" + unquoted + "|" + single_quoted + "|" + double_quoted + ")";
const attribute = "(?:\\s+" + attr_name + "(?:\\s*=\\s*" + attr_value + ")?)";
const open_tag = "<[A-Za-z][A-Za-z0-9\\-]*" + attribute + "*\\s*\\/?>";
const close_tag = "<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>";
const comment = "<!---?>|<!--(?:[^-]|-[^-]|--[^>])*-->";
const processing = "<[?][\\s\\S]*?[?]>";
const declaration = "<![A-Za-z][^>]*>";
const cdata = "<!\\[CDATA\\[[\\s\\S]*?\\]\\]>";
const HTML_TAG_RE = new RegExp("^(?:" + open_tag + "|" + close_tag + "|" + comment + "|" + processing + "|" + declaration + "|" + cdata + ")");
const HTML_OPEN_CLOSE_TAG_RE = new RegExp("^(?:" + open_tag + "|" + close_tag + ")");
const HTML_SEQUENCES = [
  [/^<(script|pre|style|textarea)(?=(\s|>|$))/i, /<\/(script|pre|style|textarea)>/i, true],
  [/^<!--/, /-->/, true],
  [/^<\?/, /\?>/, true],
  [/^<![A-Z]/, />/, true],
  [/^<!\[CDATA\[/, /\]\]>/, true],
  [new RegExp("^</?(" + block_names.join("|") + ")(?=(\\s|/?>|$))", "i"), /^$/, true],
  [new RegExp(HTML_OPEN_CLOSE_TAG_RE.source + "\\s*$"), /^$/, false]
];
function html_block(state, startLine, endLine, silent) {
  let pos = state.bMarks[startLine] + state.tShift[startLine];
  let max = state.eMarks[startLine];
  if (state.sCount[startLine] - state.blkIndent >= 4) {
    return false;
  }
  if (!state.md.options.html) {
    return false;
  }
  if (state.src.charCodeAt(pos) !== 60) {
    return false;
  }
  let lineText = state.src.slice(pos, max);
  let i = 0;
  for (; i < HTML_SEQUENCES.length; i++) {
    if (HTML_SEQUENCES[i][0].test(lineText)) {
      break;
    }
  }
  if (i === HTML_SEQUENCES.length) {
    return false;
  }
  if (silent) {
    return HTML_SEQUENCES[i][2];
  }
  let nextLine = startLine + 1;
  if (!HTML_SEQUENCES[i][1].test(lineText)) {
    for (; nextLine < endLine; nextLine++) {
      if (state.sCount[nextLine] < state.blkIndent) {
        break;
      }
      pos = state.bMarks[nextLine] + state.tShift[nextLine];
      max = state.eMarks[nextLine];
      lineText = state.src.slice(pos, max);
      if (HTML_SEQUENCES[i][1].test(lineText)) {
        if (lineText.length !== 0) {
          nextLine++;
        }
        break;
      }
    }
  }
  state.line = nextLine;
  const token = state.push("html_block", "", 0);
  token.map = [startLine, nextLine];
  token.content = state.getLines(startLine, nextLine, state.blkIndent, true);
  return true;
}
function heading(state, startLine, endLine, silent) {
  let pos = state.bMarks[startLine] + state.tShift[startLine];
  let max = state.eMarks[startLine];
  if (state.sCount[startLine] - state.blkIndent >= 4) {
    return false;
  }
  let ch = state.src.charCodeAt(pos);
  if (ch !== 35 || pos >= max) {
    return false;
  }
  let level = 1;
  ch = state.src.charCodeAt(++pos);
  while (ch === 35 && pos < max && level <= 6) {
    level++;
    ch = state.src.charCodeAt(++pos);
  }
  if (level > 6 || pos < max && !isSpace(ch)) {
    return false;
  }
  if (silent) {
    return true;
  }
  max = state.skipSpacesBack(max, pos);
  const tmp = state.skipCharsBack(max, 35, pos);
  if (tmp > pos && isSpace(state.src.charCodeAt(tmp - 1))) {
    max = tmp;
  }
  state.line = startLine + 1;
  const token_o = state.push("heading_open", "h" + String(level), 1);
  token_o.markup = "########".slice(0, level);
  token_o.map = [startLine, state.line];
  const token_i = state.push("inline", "", 0);
  token_i.content = state.src.slice(pos, max).trim();
  token_i.map = [startLine, state.line];
  token_i.children = [];
  const token_c = state.push("heading_close", "h" + String(level), -1);
  token_c.markup = "########".slice(0, level);
  return true;
}
function lheading(state, startLine, endLine) {
  const terminatorRules = state.md.block.ruler.getRules("paragraph");
  if (state.sCount[startLine] - state.blkIndent >= 4) {
    return false;
  }
  const oldParentType = state.parentType;
  state.parentType = "paragraph";
  let level = 0;
  let marker;
  let nextLine = startLine + 1;
  for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
    if (state.sCount[nextLine] - state.blkIndent > 3) {
      continue;
    }
    if (state.sCount[nextLine] >= state.blkIndent) {
      let pos = state.bMarks[nextLine] + state.tShift[nextLine];
      const max = state.eMarks[nextLine];
      if (pos < max) {
        marker = state.src.charCodeAt(pos);
        if (marker === 45 || marker === 61) {
          pos = state.skipChars(pos, marker);
          pos = state.skipSpaces(pos);
          if (pos >= max) {
            level = marker === 61 ? 1 : 2;
            break;
          }
        }
      }
    }
    if (state.sCount[nextLine] < 0) {
      continue;
    }
    let terminate = false;
    for (let i = 0, l = terminatorRules.length; i < l; i++) {
      if (terminatorRules[i](state, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
    }
    if (terminate) {
      break;
    }
  }
  if (!level) {
    return false;
  }
  const content = state.getLines(startLine, nextLine, state.blkIndent, false).trim();
  state.line = nextLine + 1;
  const token_o = state.push("heading_open", "h" + String(level), 1);
  token_o.markup = String.fromCharCode(marker);
  token_o.map = [startLine, state.line];
  const token_i = state.push("inline", "", 0);
  token_i.content = content;
  token_i.map = [startLine, state.line - 1];
  token_i.children = [];
  const token_c = state.push("heading_close", "h" + String(level), -1);
  token_c.markup = String.fromCharCode(marker);
  state.parentType = oldParentType;
  return true;
}
function paragraph(state, startLine, endLine) {
  const terminatorRules = state.md.block.ruler.getRules("paragraph");
  const oldParentType = state.parentType;
  let nextLine = startLine + 1;
  state.parentType = "paragraph";
  for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
    if (state.sCount[nextLine] - state.blkIndent > 3) {
      continue;
    }
    if (state.sCount[nextLine] < 0) {
      continue;
    }
    let terminate = false;
    for (let i = 0, l = terminatorRules.length; i < l; i++) {
      if (terminatorRules[i](state, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
    }
    if (terminate) {
      break;
    }
  }
  const content = state.getLines(startLine, nextLine, state.blkIndent, false).trim();
  state.line = nextLine;
  const token_o = state.push("paragraph_open", "p", 1);
  token_o.map = [startLine, state.line];
  const token_i = state.push("inline", "", 0);
  token_i.content = content;
  token_i.map = [startLine, state.line];
  token_i.children = [];
  state.push("paragraph_close", "p", -1);
  state.parentType = oldParentType;
  return true;
}
const _rules$1 = [
  // First 2 params - rule name & source. Secondary array - list of rules,
  // which can be terminated by this one.
  ["table", table, ["paragraph", "reference"]],
  ["code", code],
  ["fence", fence, ["paragraph", "reference", "blockquote", "list"]],
  ["blockquote", blockquote, ["paragraph", "reference", "blockquote", "list"]],
  ["hr", hr, ["paragraph", "reference", "blockquote", "list"]],
  ["list", list, ["paragraph", "reference", "blockquote"]],
  ["reference", reference],
  ["html_block", html_block, ["paragraph", "reference", "blockquote"]],
  ["heading", heading, ["paragraph", "reference", "blockquote"]],
  ["lheading", lheading],
  ["paragraph", paragraph]
];
function ParserBlock() {
  this.ruler = new Ruler();
  for (let i = 0; i < _rules$1.length; i++) {
    this.ruler.push(_rules$1[i][0], _rules$1[i][1], { alt: (_rules$1[i][2] || []).slice() });
  }
}
ParserBlock.prototype.tokenize = function(state, startLine, endLine) {
  const rules = this.ruler.getRules("");
  const len = rules.length;
  const maxNesting = state.md.options.maxNesting;
  let line = startLine;
  let hasEmptyLines = false;
  while (line < endLine) {
    state.line = line = state.skipEmptyLines(line);
    if (line >= endLine) {
      break;
    }
    if (state.sCount[line] < state.blkIndent) {
      break;
    }
    if (state.level >= maxNesting) {
      state.line = endLine;
      break;
    }
    const prevLine = state.line;
    let ok = false;
    for (let i = 0; i < len; i++) {
      ok = rules[i](state, line, endLine, false);
      if (ok) {
        if (prevLine >= state.line) {
          throw new Error("block rule didn't increment state.line");
        }
        break;
      }
    }
    if (!ok)
      throw new Error("none of the block rules matched");
    state.tight = !hasEmptyLines;
    if (state.isEmpty(state.line - 1)) {
      hasEmptyLines = true;
    }
    line = state.line;
    if (line < endLine && state.isEmpty(line)) {
      hasEmptyLines = true;
      line++;
      state.line = line;
    }
  }
};
ParserBlock.prototype.parse = function(src, md, env, outTokens) {
  if (!src) {
    return;
  }
  const state = new this.State(src, md, env, outTokens);
  this.tokenize(state, state.line, state.lineMax);
};
ParserBlock.prototype.State = StateBlock;
function StateInline(src, md, env, outTokens) {
  this.src = src;
  this.env = env;
  this.md = md;
  this.tokens = outTokens;
  this.tokens_meta = Array(outTokens.length);
  this.pos = 0;
  this.posMax = this.src.length;
  this.level = 0;
  this.pending = "";
  this.pendingLevel = 0;
  this.cache = {};
  this.delimiters = [];
  this._prev_delimiters = [];
  this.backticks = {};
  this.backticksScanned = false;
  this.linkLevel = 0;
}
StateInline.prototype.pushPending = function() {
  const token = new Token("text", "", 0);
  token.content = this.pending;
  token.level = this.pendingLevel;
  this.tokens.push(token);
  this.pending = "";
  return token;
};
StateInline.prototype.push = function(type, tag, nesting) {
  if (this.pending) {
    this.pushPending();
  }
  const token = new Token(type, tag, nesting);
  let token_meta = null;
  if (nesting < 0) {
    this.level--;
    this.delimiters = this._prev_delimiters.pop();
  }
  token.level = this.level;
  if (nesting > 0) {
    this.level++;
    this._prev_delimiters.push(this.delimiters);
    this.delimiters = [];
    token_meta = { delimiters: this.delimiters };
  }
  this.pendingLevel = this.level;
  this.tokens.push(token);
  this.tokens_meta.push(token_meta);
  return token;
};
StateInline.prototype.scanDelims = function(start, canSplitWord) {
  const max = this.posMax;
  const marker = this.src.charCodeAt(start);
  const lastChar = start > 0 ? this.src.charCodeAt(start - 1) : 32;
  let pos = start;
  while (pos < max && this.src.charCodeAt(pos) === marker) {
    pos++;
  }
  const count = pos - start;
  const nextChar = pos < max ? this.src.charCodeAt(pos) : 32;
  const isLastPunctChar = isMdAsciiPunct(lastChar) || isPunctChar(String.fromCharCode(lastChar));
  const isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctChar(String.fromCharCode(nextChar));
  const isLastWhiteSpace = isWhiteSpace(lastChar);
  const isNextWhiteSpace = isWhiteSpace(nextChar);
  const left_flanking = !isNextWhiteSpace && (!isNextPunctChar || isLastWhiteSpace || isLastPunctChar);
  const right_flanking = !isLastWhiteSpace && (!isLastPunctChar || isNextWhiteSpace || isNextPunctChar);
  const can_open = left_flanking && (canSplitWord || !right_flanking || isLastPunctChar);
  const can_close = right_flanking && (canSplitWord || !left_flanking || isNextPunctChar);
  return { can_open, can_close, length: count };
};
StateInline.prototype.Token = Token;
function isTerminatorChar(ch) {
  switch (ch) {
    case 10:
    case 33:
    case 35:
    case 36:
    case 37:
    case 38:
    case 42:
    case 43:
    case 45:
    case 58:
    case 60:
    case 61:
    case 62:
    case 64:
    case 91:
    case 92:
    case 93:
    case 94:
    case 95:
    case 96:
    case 123:
    case 125:
    case 126:
      return true;
    default:
      return false;
  }
}
function text(state, silent) {
  let pos = state.pos;
  while (pos < state.posMax && !isTerminatorChar(state.src.charCodeAt(pos))) {
    pos++;
  }
  if (pos === state.pos) {
    return false;
  }
  if (!silent) {
    state.pending += state.src.slice(state.pos, pos);
  }
  state.pos = pos;
  return true;
}
const SCHEME_RE = /(?:^|[^a-z0-9.+-])([a-z][a-z0-9.+-]*)$/i;
function linkify(state, silent) {
  if (!state.md.options.linkify)
    return false;
  if (state.linkLevel > 0)
    return false;
  const pos = state.pos;
  const max = state.posMax;
  if (pos + 3 > max)
    return false;
  if (state.src.charCodeAt(pos) !== 58)
    return false;
  if (state.src.charCodeAt(pos + 1) !== 47)
    return false;
  if (state.src.charCodeAt(pos + 2) !== 47)
    return false;
  const match2 = state.pending.match(SCHEME_RE);
  if (!match2)
    return false;
  const proto = match2[1];
  const link2 = state.md.linkify.matchAtStart(state.src.slice(pos - proto.length));
  if (!link2)
    return false;
  let url2 = link2.url;
  if (url2.length <= proto.length)
    return false;
  url2 = url2.replace(/\*+$/, "");
  const fullUrl = state.md.normalizeLink(url2);
  if (!state.md.validateLink(fullUrl))
    return false;
  if (!silent) {
    state.pending = state.pending.slice(0, -proto.length);
    const token_o = state.push("link_open", "a", 1);
    token_o.attrs = [["href", fullUrl]];
    token_o.markup = "linkify";
    token_o.info = "auto";
    const token_t = state.push("text", "", 0);
    token_t.content = state.md.normalizeLinkText(url2);
    const token_c = state.push("link_close", "a", -1);
    token_c.markup = "linkify";
    token_c.info = "auto";
  }
  state.pos += url2.length - proto.length;
  return true;
}
function newline(state, silent) {
  let pos = state.pos;
  if (state.src.charCodeAt(pos) !== 10) {
    return false;
  }
  const pmax = state.pending.length - 1;
  const max = state.posMax;
  if (!silent) {
    if (pmax >= 0 && state.pending.charCodeAt(pmax) === 32) {
      if (pmax >= 1 && state.pending.charCodeAt(pmax - 1) === 32) {
        let ws = pmax - 1;
        while (ws >= 1 && state.pending.charCodeAt(ws - 1) === 32)
          ws--;
        state.pending = state.pending.slice(0, ws);
        state.push("hardbreak", "br", 0);
      } else {
        state.pending = state.pending.slice(0, -1);
        state.push("softbreak", "br", 0);
      }
    } else {
      state.push("softbreak", "br", 0);
    }
  }
  pos++;
  while (pos < max && isSpace(state.src.charCodeAt(pos))) {
    pos++;
  }
  state.pos = pos;
  return true;
}
const ESCAPED = [];
for (let i = 0; i < 256; i++) {
  ESCAPED.push(0);
}
"\\!\"#$%&'()*+,./:;<=>?@[]^_`{|}~-".split("").forEach(function(ch) {
  ESCAPED[ch.charCodeAt(0)] = 1;
});
function escape(state, silent) {
  let pos = state.pos;
  const max = state.posMax;
  if (state.src.charCodeAt(pos) !== 92)
    return false;
  pos++;
  if (pos >= max)
    return false;
  let ch1 = state.src.charCodeAt(pos);
  if (ch1 === 10) {
    if (!silent) {
      state.push("hardbreak", "br", 0);
    }
    pos++;
    while (pos < max) {
      ch1 = state.src.charCodeAt(pos);
      if (!isSpace(ch1))
        break;
      pos++;
    }
    state.pos = pos;
    return true;
  }
  let escapedStr = state.src[pos];
  if (ch1 >= 55296 && ch1 <= 56319 && pos + 1 < max) {
    const ch2 = state.src.charCodeAt(pos + 1);
    if (ch2 >= 56320 && ch2 <= 57343) {
      escapedStr += state.src[pos + 1];
      pos++;
    }
  }
  const origStr = "\\" + escapedStr;
  if (!silent) {
    const token = state.push("text_special", "", 0);
    if (ch1 < 256 && ESCAPED[ch1] !== 0) {
      token.content = escapedStr;
    } else {
      token.content = origStr;
    }
    token.markup = origStr;
    token.info = "escape";
  }
  state.pos = pos + 1;
  return true;
}
function backtick(state, silent) {
  let pos = state.pos;
  const ch = state.src.charCodeAt(pos);
  if (ch !== 96) {
    return false;
  }
  const start = pos;
  pos++;
  const max = state.posMax;
  while (pos < max && state.src.charCodeAt(pos) === 96) {
    pos++;
  }
  const marker = state.src.slice(start, pos);
  const openerLength = marker.length;
  if (state.backticksScanned && (state.backticks[openerLength] || 0) <= start) {
    if (!silent)
      state.pending += marker;
    state.pos += openerLength;
    return true;
  }
  let matchEnd = pos;
  let matchStart;
  while ((matchStart = state.src.indexOf("`", matchEnd)) !== -1) {
    matchEnd = matchStart + 1;
    while (matchEnd < max && state.src.charCodeAt(matchEnd) === 96) {
      matchEnd++;
    }
    const closerLength = matchEnd - matchStart;
    if (closerLength === openerLength) {
      if (!silent) {
        const token = state.push("code_inline", "code", 0);
        token.markup = marker;
        token.content = state.src.slice(pos, matchStart).replace(/\n/g, " ").replace(/^ (.+) $/, "$1");
      }
      state.pos = matchEnd;
      return true;
    }
    state.backticks[closerLength] = matchStart;
  }
  state.backticksScanned = true;
  if (!silent)
    state.pending += marker;
  state.pos += openerLength;
  return true;
}
function strikethrough_tokenize(state, silent) {
  const start = state.pos;
  const marker = state.src.charCodeAt(start);
  if (silent) {
    return false;
  }
  if (marker !== 126) {
    return false;
  }
  const scanned = state.scanDelims(state.pos, true);
  let len = scanned.length;
  const ch = String.fromCharCode(marker);
  if (len < 2) {
    return false;
  }
  let token;
  if (len % 2) {
    token = state.push("text", "", 0);
    token.content = ch;
    len--;
  }
  for (let i = 0; i < len; i += 2) {
    token = state.push("text", "", 0);
    token.content = ch + ch;
    state.delimiters.push({
      marker,
      length: 0,
      // disable "rule of 3" length checks meant for emphasis
      token: state.tokens.length - 1,
      end: -1,
      open: scanned.can_open,
      close: scanned.can_close
    });
  }
  state.pos += scanned.length;
  return true;
}
function postProcess$1(state, delimiters) {
  let token;
  const loneMarkers = [];
  const max = delimiters.length;
  for (let i = 0; i < max; i++) {
    const startDelim = delimiters[i];
    if (startDelim.marker !== 126) {
      continue;
    }
    if (startDelim.end === -1) {
      continue;
    }
    const endDelim = delimiters[startDelim.end];
    token = state.tokens[startDelim.token];
    token.type = "s_open";
    token.tag = "s";
    token.nesting = 1;
    token.markup = "~~";
    token.content = "";
    token = state.tokens[endDelim.token];
    token.type = "s_close";
    token.tag = "s";
    token.nesting = -1;
    token.markup = "~~";
    token.content = "";
    if (state.tokens[endDelim.token - 1].type === "text" && state.tokens[endDelim.token - 1].content === "~") {
      loneMarkers.push(endDelim.token - 1);
    }
  }
  while (loneMarkers.length) {
    const i = loneMarkers.pop();
    let j = i + 1;
    while (j < state.tokens.length && state.tokens[j].type === "s_close") {
      j++;
    }
    j--;
    if (i !== j) {
      token = state.tokens[j];
      state.tokens[j] = state.tokens[i];
      state.tokens[i] = token;
    }
  }
}
function strikethrough_postProcess(state) {
  const tokens_meta = state.tokens_meta;
  const max = state.tokens_meta.length;
  postProcess$1(state, state.delimiters);
  for (let curr = 0; curr < max; curr++) {
    if (tokens_meta[curr] && tokens_meta[curr].delimiters) {
      postProcess$1(state, tokens_meta[curr].delimiters);
    }
  }
}
const r_strikethrough = {
  tokenize: strikethrough_tokenize,
  postProcess: strikethrough_postProcess
};
function emphasis_tokenize(state, silent) {
  const start = state.pos;
  const marker = state.src.charCodeAt(start);
  if (silent) {
    return false;
  }
  if (marker !== 95 && marker !== 42) {
    return false;
  }
  const scanned = state.scanDelims(state.pos, marker === 42);
  for (let i = 0; i < scanned.length; i++) {
    const token = state.push("text", "", 0);
    token.content = String.fromCharCode(marker);
    state.delimiters.push({
      // Char code of the starting marker (number).
      //
      marker,
      // Total length of these series of delimiters.
      //
      length: scanned.length,
      // A position of the token this delimiter corresponds to.
      //
      token: state.tokens.length - 1,
      // If this delimiter is matched as a valid opener, `end` will be
      // equal to its position, otherwise it's `-1`.
      //
      end: -1,
      // Boolean flags that determine if this delimiter could open or close
      // an emphasis.
      //
      open: scanned.can_open,
      close: scanned.can_close
    });
  }
  state.pos += scanned.length;
  return true;
}
function postProcess(state, delimiters) {
  const max = delimiters.length;
  for (let i = max - 1; i >= 0; i--) {
    const startDelim = delimiters[i];
    if (startDelim.marker !== 95 && startDelim.marker !== 42) {
      continue;
    }
    if (startDelim.end === -1) {
      continue;
    }
    const endDelim = delimiters[startDelim.end];
    const isStrong = i > 0 && delimiters[i - 1].end === startDelim.end + 1 && // check that first two markers match and adjacent
    delimiters[i - 1].marker === startDelim.marker && delimiters[i - 1].token === startDelim.token - 1 && // check that last two markers are adjacent (we can safely assume they match)
    delimiters[startDelim.end + 1].token === endDelim.token + 1;
    const ch = String.fromCharCode(startDelim.marker);
    const token_o = state.tokens[startDelim.token];
    token_o.type = isStrong ? "strong_open" : "em_open";
    token_o.tag = isStrong ? "strong" : "em";
    token_o.nesting = 1;
    token_o.markup = isStrong ? ch + ch : ch;
    token_o.content = "";
    const token_c = state.tokens[endDelim.token];
    token_c.type = isStrong ? "strong_close" : "em_close";
    token_c.tag = isStrong ? "strong" : "em";
    token_c.nesting = -1;
    token_c.markup = isStrong ? ch + ch : ch;
    token_c.content = "";
    if (isStrong) {
      state.tokens[delimiters[i - 1].token].content = "";
      state.tokens[delimiters[startDelim.end + 1].token].content = "";
      i--;
    }
  }
}
function emphasis_post_process(state) {
  const tokens_meta = state.tokens_meta;
  const max = state.tokens_meta.length;
  postProcess(state, state.delimiters);
  for (let curr = 0; curr < max; curr++) {
    if (tokens_meta[curr] && tokens_meta[curr].delimiters) {
      postProcess(state, tokens_meta[curr].delimiters);
    }
  }
}
const r_emphasis = {
  tokenize: emphasis_tokenize,
  postProcess: emphasis_post_process
};
function link(state, silent) {
  let code2, label, res, ref2;
  let href = "";
  let title = "";
  let start = state.pos;
  let parseReference = true;
  if (state.src.charCodeAt(state.pos) !== 91) {
    return false;
  }
  const oldPos = state.pos;
  const max = state.posMax;
  const labelStart = state.pos + 1;
  const labelEnd = state.md.helpers.parseLinkLabel(state, state.pos, true);
  if (labelEnd < 0) {
    return false;
  }
  let pos = labelEnd + 1;
  if (pos < max && state.src.charCodeAt(pos) === 40) {
    parseReference = false;
    pos++;
    for (; pos < max; pos++) {
      code2 = state.src.charCodeAt(pos);
      if (!isSpace(code2) && code2 !== 10) {
        break;
      }
    }
    if (pos >= max) {
      return false;
    }
    start = pos;
    res = state.md.helpers.parseLinkDestination(state.src, pos, state.posMax);
    if (res.ok) {
      href = state.md.normalizeLink(res.str);
      if (state.md.validateLink(href)) {
        pos = res.pos;
      } else {
        href = "";
      }
      start = pos;
      for (; pos < max; pos++) {
        code2 = state.src.charCodeAt(pos);
        if (!isSpace(code2) && code2 !== 10) {
          break;
        }
      }
      res = state.md.helpers.parseLinkTitle(state.src, pos, state.posMax);
      if (pos < max && start !== pos && res.ok) {
        title = res.str;
        pos = res.pos;
        for (; pos < max; pos++) {
          code2 = state.src.charCodeAt(pos);
          if (!isSpace(code2) && code2 !== 10) {
            break;
          }
        }
      }
    }
    if (pos >= max || state.src.charCodeAt(pos) !== 41) {
      parseReference = true;
    }
    pos++;
  }
  if (parseReference) {
    if (typeof state.env.references === "undefined") {
      return false;
    }
    if (pos < max && state.src.charCodeAt(pos) === 91) {
      start = pos + 1;
      pos = state.md.helpers.parseLinkLabel(state, pos);
      if (pos >= 0) {
        label = state.src.slice(start, pos++);
      } else {
        pos = labelEnd + 1;
      }
    } else {
      pos = labelEnd + 1;
    }
    if (!label) {
      label = state.src.slice(labelStart, labelEnd);
    }
    ref2 = state.env.references[normalizeReference(label)];
    if (!ref2) {
      state.pos = oldPos;
      return false;
    }
    href = ref2.href;
    title = ref2.title;
  }
  if (!silent) {
    state.pos = labelStart;
    state.posMax = labelEnd;
    const token_o = state.push("link_open", "a", 1);
    const attrs = [["href", href]];
    token_o.attrs = attrs;
    if (title) {
      attrs.push(["title", title]);
    }
    state.linkLevel++;
    state.md.inline.tokenize(state);
    state.linkLevel--;
    state.push("link_close", "a", -1);
  }
  state.pos = pos;
  state.posMax = max;
  return true;
}
function image(state, silent) {
  let code2, content, label, pos, ref2, res, title, start;
  let href = "";
  const oldPos = state.pos;
  const max = state.posMax;
  if (state.src.charCodeAt(state.pos) !== 33) {
    return false;
  }
  if (state.src.charCodeAt(state.pos + 1) !== 91) {
    return false;
  }
  const labelStart = state.pos + 2;
  const labelEnd = state.md.helpers.parseLinkLabel(state, state.pos + 1, false);
  if (labelEnd < 0) {
    return false;
  }
  pos = labelEnd + 1;
  if (pos < max && state.src.charCodeAt(pos) === 40) {
    pos++;
    for (; pos < max; pos++) {
      code2 = state.src.charCodeAt(pos);
      if (!isSpace(code2) && code2 !== 10) {
        break;
      }
    }
    if (pos >= max) {
      return false;
    }
    start = pos;
    res = state.md.helpers.parseLinkDestination(state.src, pos, state.posMax);
    if (res.ok) {
      href = state.md.normalizeLink(res.str);
      if (state.md.validateLink(href)) {
        pos = res.pos;
      } else {
        href = "";
      }
    }
    start = pos;
    for (; pos < max; pos++) {
      code2 = state.src.charCodeAt(pos);
      if (!isSpace(code2) && code2 !== 10) {
        break;
      }
    }
    res = state.md.helpers.parseLinkTitle(state.src, pos, state.posMax);
    if (pos < max && start !== pos && res.ok) {
      title = res.str;
      pos = res.pos;
      for (; pos < max; pos++) {
        code2 = state.src.charCodeAt(pos);
        if (!isSpace(code2) && code2 !== 10) {
          break;
        }
      }
    } else {
      title = "";
    }
    if (pos >= max || state.src.charCodeAt(pos) !== 41) {
      state.pos = oldPos;
      return false;
    }
    pos++;
  } else {
    if (typeof state.env.references === "undefined") {
      return false;
    }
    if (pos < max && state.src.charCodeAt(pos) === 91) {
      start = pos + 1;
      pos = state.md.helpers.parseLinkLabel(state, pos);
      if (pos >= 0) {
        label = state.src.slice(start, pos++);
      } else {
        pos = labelEnd + 1;
      }
    } else {
      pos = labelEnd + 1;
    }
    if (!label) {
      label = state.src.slice(labelStart, labelEnd);
    }
    ref2 = state.env.references[normalizeReference(label)];
    if (!ref2) {
      state.pos = oldPos;
      return false;
    }
    href = ref2.href;
    title = ref2.title;
  }
  if (!silent) {
    content = state.src.slice(labelStart, labelEnd);
    const tokens = [];
    state.md.inline.parse(
      content,
      state.md,
      state.env,
      tokens
    );
    const token = state.push("image", "img", 0);
    const attrs = [["src", href], ["alt", ""]];
    token.attrs = attrs;
    token.children = tokens;
    token.content = content;
    if (title) {
      attrs.push(["title", title]);
    }
  }
  state.pos = pos;
  state.posMax = max;
  return true;
}
const EMAIL_RE = /^([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)$/;
const AUTOLINK_RE = /^([a-zA-Z][a-zA-Z0-9+.-]{1,31}):([^<>\x00-\x20]*)$/;
function autolink(state, silent) {
  let pos = state.pos;
  if (state.src.charCodeAt(pos) !== 60) {
    return false;
  }
  const start = state.pos;
  const max = state.posMax;
  for (; ; ) {
    if (++pos >= max)
      return false;
    const ch = state.src.charCodeAt(pos);
    if (ch === 60)
      return false;
    if (ch === 62)
      break;
  }
  const url2 = state.src.slice(start + 1, pos);
  if (AUTOLINK_RE.test(url2)) {
    const fullUrl = state.md.normalizeLink(url2);
    if (!state.md.validateLink(fullUrl)) {
      return false;
    }
    if (!silent) {
      const token_o = state.push("link_open", "a", 1);
      token_o.attrs = [["href", fullUrl]];
      token_o.markup = "autolink";
      token_o.info = "auto";
      const token_t = state.push("text", "", 0);
      token_t.content = state.md.normalizeLinkText(url2);
      const token_c = state.push("link_close", "a", -1);
      token_c.markup = "autolink";
      token_c.info = "auto";
    }
    state.pos += url2.length + 2;
    return true;
  }
  if (EMAIL_RE.test(url2)) {
    const fullUrl = state.md.normalizeLink("mailto:" + url2);
    if (!state.md.validateLink(fullUrl)) {
      return false;
    }
    if (!silent) {
      const token_o = state.push("link_open", "a", 1);
      token_o.attrs = [["href", fullUrl]];
      token_o.markup = "autolink";
      token_o.info = "auto";
      const token_t = state.push("text", "", 0);
      token_t.content = state.md.normalizeLinkText(url2);
      const token_c = state.push("link_close", "a", -1);
      token_c.markup = "autolink";
      token_c.info = "auto";
    }
    state.pos += url2.length + 2;
    return true;
  }
  return false;
}
function isLinkOpen(str) {
  return /^<a[>\s]/i.test(str);
}
function isLinkClose(str) {
  return /^<\/a\s*>/i.test(str);
}
function isLetter(ch) {
  const lc = ch | 32;
  return lc >= 97 && lc <= 122;
}
function html_inline(state, silent) {
  if (!state.md.options.html) {
    return false;
  }
  const max = state.posMax;
  const pos = state.pos;
  if (state.src.charCodeAt(pos) !== 60 || pos + 2 >= max) {
    return false;
  }
  const ch = state.src.charCodeAt(pos + 1);
  if (ch !== 33 && ch !== 63 && ch !== 47 && !isLetter(ch)) {
    return false;
  }
  const match2 = state.src.slice(pos).match(HTML_TAG_RE);
  if (!match2) {
    return false;
  }
  if (!silent) {
    const token = state.push("html_inline", "", 0);
    token.content = match2[0];
    if (isLinkOpen(token.content))
      state.linkLevel++;
    if (isLinkClose(token.content))
      state.linkLevel--;
  }
  state.pos += match2[0].length;
  return true;
}
const DIGITAL_RE = /^&#((?:x[a-f0-9]{1,6}|[0-9]{1,7}));/i;
const NAMED_RE = /^&([a-z][a-z0-9]{1,31});/i;
function entity(state, silent) {
  const pos = state.pos;
  const max = state.posMax;
  if (state.src.charCodeAt(pos) !== 38)
    return false;
  if (pos + 1 >= max)
    return false;
  const ch = state.src.charCodeAt(pos + 1);
  if (ch === 35) {
    const match2 = state.src.slice(pos).match(DIGITAL_RE);
    if (match2) {
      if (!silent) {
        const code2 = match2[1][0].toLowerCase() === "x" ? parseInt(match2[1].slice(1), 16) : parseInt(match2[1], 10);
        const token = state.push("text_special", "", 0);
        token.content = isValidEntityCode(code2) ? fromCodePoint(code2) : fromCodePoint(65533);
        token.markup = match2[0];
        token.info = "entity";
      }
      state.pos += match2[0].length;
      return true;
    }
  } else {
    const match2 = state.src.slice(pos).match(NAMED_RE);
    if (match2) {
      const decoded = decodeHTML(match2[0]);
      if (decoded !== match2[0]) {
        if (!silent) {
          const token = state.push("text_special", "", 0);
          token.content = decoded;
          token.markup = match2[0];
          token.info = "entity";
        }
        state.pos += match2[0].length;
        return true;
      }
    }
  }
  return false;
}
function processDelimiters(delimiters) {
  const openersBottom = {};
  const max = delimiters.length;
  if (!max)
    return;
  let headerIdx = 0;
  let lastTokenIdx = -2;
  const jumps = [];
  for (let closerIdx = 0; closerIdx < max; closerIdx++) {
    const closer = delimiters[closerIdx];
    jumps.push(0);
    if (delimiters[headerIdx].marker !== closer.marker || lastTokenIdx !== closer.token - 1) {
      headerIdx = closerIdx;
    }
    lastTokenIdx = closer.token;
    closer.length = closer.length || 0;
    if (!closer.close)
      continue;
    if (!openersBottom.hasOwnProperty(closer.marker)) {
      openersBottom[closer.marker] = [-1, -1, -1, -1, -1, -1];
    }
    const minOpenerIdx = openersBottom[closer.marker][(closer.open ? 3 : 0) + closer.length % 3];
    let openerIdx = headerIdx - jumps[headerIdx] - 1;
    let newMinOpenerIdx = openerIdx;
    for (; openerIdx > minOpenerIdx; openerIdx -= jumps[openerIdx] + 1) {
      const opener = delimiters[openerIdx];
      if (opener.marker !== closer.marker)
        continue;
      if (opener.open && opener.end < 0) {
        let isOddMatch = false;
        if (opener.close || closer.open) {
          if ((opener.length + closer.length) % 3 === 0) {
            if (opener.length % 3 !== 0 || closer.length % 3 !== 0) {
              isOddMatch = true;
            }
          }
        }
        if (!isOddMatch) {
          const lastJump = openerIdx > 0 && !delimiters[openerIdx - 1].open ? jumps[openerIdx - 1] + 1 : 0;
          jumps[closerIdx] = closerIdx - openerIdx + lastJump;
          jumps[openerIdx] = lastJump;
          closer.open = false;
          opener.end = closerIdx;
          opener.close = false;
          newMinOpenerIdx = -1;
          lastTokenIdx = -2;
          break;
        }
      }
    }
    if (newMinOpenerIdx !== -1) {
      openersBottom[closer.marker][(closer.open ? 3 : 0) + (closer.length || 0) % 3] = newMinOpenerIdx;
    }
  }
}
function link_pairs(state) {
  const tokens_meta = state.tokens_meta;
  const max = state.tokens_meta.length;
  processDelimiters(state.delimiters);
  for (let curr = 0; curr < max; curr++) {
    if (tokens_meta[curr] && tokens_meta[curr].delimiters) {
      processDelimiters(tokens_meta[curr].delimiters);
    }
  }
}
function fragments_join(state) {
  let curr, last;
  let level = 0;
  const tokens = state.tokens;
  const max = state.tokens.length;
  for (curr = last = 0; curr < max; curr++) {
    if (tokens[curr].nesting < 0)
      level--;
    tokens[curr].level = level;
    if (tokens[curr].nesting > 0)
      level++;
    if (tokens[curr].type === "text" && curr + 1 < max && tokens[curr + 1].type === "text") {
      tokens[curr + 1].content = tokens[curr].content + tokens[curr + 1].content;
    } else {
      if (curr !== last) {
        tokens[last] = tokens[curr];
      }
      last++;
    }
  }
  if (curr !== last) {
    tokens.length = last;
  }
}
const _rules = [
  ["text", text],
  ["linkify", linkify],
  ["newline", newline],
  ["escape", escape],
  ["backticks", backtick],
  ["strikethrough", r_strikethrough.tokenize],
  ["emphasis", r_emphasis.tokenize],
  ["link", link],
  ["image", image],
  ["autolink", autolink],
  ["html_inline", html_inline],
  ["entity", entity]
];
const _rules2 = [
  ["balance_pairs", link_pairs],
  ["strikethrough", r_strikethrough.postProcess],
  ["emphasis", r_emphasis.postProcess],
  // rules for pairs separate '**' into its own text tokens, which may be left unused,
  // rule below merges unused segments back with the rest of the text
  ["fragments_join", fragments_join]
];
function ParserInline() {
  this.ruler = new Ruler();
  for (let i = 0; i < _rules.length; i++) {
    this.ruler.push(_rules[i][0], _rules[i][1]);
  }
  this.ruler2 = new Ruler();
  for (let i = 0; i < _rules2.length; i++) {
    this.ruler2.push(_rules2[i][0], _rules2[i][1]);
  }
}
ParserInline.prototype.skipToken = function(state) {
  const pos = state.pos;
  const rules = this.ruler.getRules("");
  const len = rules.length;
  const maxNesting = state.md.options.maxNesting;
  const cache = state.cache;
  if (typeof cache[pos] !== "undefined") {
    state.pos = cache[pos];
    return;
  }
  let ok = false;
  if (state.level < maxNesting) {
    for (let i = 0; i < len; i++) {
      state.level++;
      ok = rules[i](state, true);
      state.level--;
      if (ok) {
        if (pos >= state.pos) {
          throw new Error("inline rule didn't increment state.pos");
        }
        break;
      }
    }
  } else {
    state.pos = state.posMax;
  }
  if (!ok) {
    state.pos++;
  }
  cache[pos] = state.pos;
};
ParserInline.prototype.tokenize = function(state) {
  const rules = this.ruler.getRules("");
  const len = rules.length;
  const end = state.posMax;
  const maxNesting = state.md.options.maxNesting;
  while (state.pos < end) {
    const prevPos = state.pos;
    let ok = false;
    if (state.level < maxNesting) {
      for (let i = 0; i < len; i++) {
        ok = rules[i](state, false);
        if (ok) {
          if (prevPos >= state.pos) {
            throw new Error("inline rule didn't increment state.pos");
          }
          break;
        }
      }
    }
    if (ok) {
      if (state.pos >= end) {
        break;
      }
      continue;
    }
    state.pending += state.src[state.pos++];
  }
  if (state.pending) {
    state.pushPending();
  }
};
ParserInline.prototype.parse = function(str, md, env, outTokens) {
  const state = new this.State(str, md, env, outTokens);
  this.tokenize(state);
  const rules = this.ruler2.getRules("");
  const len = rules.length;
  for (let i = 0; i < len; i++) {
    rules[i](state);
  }
};
ParserInline.prototype.State = StateInline;
function reFactory(opts) {
  const re = {};
  opts = opts || {};
  re.src_Any = Any.source;
  re.src_Cc = Cc.source;
  re.src_Z = Z.source;
  re.src_P = P.source;
  re.src_ZPCc = [re.src_Z, re.src_P, re.src_Cc].join("|");
  re.src_ZCc = [re.src_Z, re.src_Cc].join("|");
  const text_separators = "[><｜]";
  re.src_pseudo_letter = "(?:(?!" + text_separators + "|" + re.src_ZPCc + ")" + re.src_Any + ")";
  re.src_ip4 = "(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)";
  re.src_auth = "(?:(?:(?!" + re.src_ZCc + "|[@/\\[\\]()]).)+@)?";
  re.src_port = "(?::(?:6(?:[0-4]\\d{3}|5(?:[0-4]\\d{2}|5(?:[0-2]\\d|3[0-5])))|[1-5]?\\d{1,4}))?";
  re.src_host_terminator = "(?=$|" + text_separators + "|" + re.src_ZPCc + ")(?!" + (opts["---"] ? "-(?!--)|" : "-|") + "_|:\\d|\\.-|\\.(?!$|" + re.src_ZPCc + "))";
  re.src_path = "(?:[/?#](?:(?!" + re.src_ZCc + "|" + text_separators + `|[()[\\]{}.,"'?!\\-;]).|\\[(?:(?!` + re.src_ZCc + "|\\]).)*\\]|\\((?:(?!" + re.src_ZCc + "|[)]).)*\\)|\\{(?:(?!" + re.src_ZCc + '|[}]).)*\\}|\\"(?:(?!' + re.src_ZCc + `|["]).)+\\"|\\'(?:(?!` + re.src_ZCc + "|[']).)+\\'|\\'(?=" + re.src_pseudo_letter + "|[-])|\\.{2,}[a-zA-Z0-9%/&]|\\.(?!" + re.src_ZCc + "|[.]|$)|" + (opts["---"] ? "\\-(?!--(?:[^-]|$))(?:-*)|" : "\\-+|") + // allow `,,,` in paths
  ",(?!" + re.src_ZCc + "|$)|;(?!" + re.src_ZCc + "|$)|\\!+(?!" + re.src_ZCc + "|[!]|$)|\\?(?!" + re.src_ZCc + "|[?]|$))+|\\/)?";
  re.src_email_name = '[\\-;:&=\\+\\$,\\.a-zA-Z0-9_][\\-;:&=\\+\\$,\\"\\.a-zA-Z0-9_]*';
  re.src_xn = "xn--[a-z0-9\\-]{1,59}";
  re.src_domain_root = // Allow letters & digits (http://test1)
  "(?:" + re.src_xn + "|" + re.src_pseudo_letter + "{1,63})";
  re.src_domain = "(?:" + re.src_xn + "|(?:" + re.src_pseudo_letter + ")|(?:" + re.src_pseudo_letter + "(?:-|" + re.src_pseudo_letter + "){0,61}" + re.src_pseudo_letter + "))";
  re.src_host = "(?:(?:(?:(?:" + re.src_domain + ")\\.)*" + re.src_domain + "))";
  re.tpl_host_fuzzy = "(?:" + re.src_ip4 + "|(?:(?:(?:" + re.src_domain + ")\\.)+(?:%TLDS%)))";
  re.tpl_host_no_ip_fuzzy = "(?:(?:(?:" + re.src_domain + ")\\.)+(?:%TLDS%))";
  re.src_host_strict = re.src_host + re.src_host_terminator;
  re.tpl_host_fuzzy_strict = re.tpl_host_fuzzy + re.src_host_terminator;
  re.src_host_port_strict = re.src_host + re.src_port + re.src_host_terminator;
  re.tpl_host_port_fuzzy_strict = re.tpl_host_fuzzy + re.src_port + re.src_host_terminator;
  re.tpl_host_port_no_ip_fuzzy_strict = re.tpl_host_no_ip_fuzzy + re.src_port + re.src_host_terminator;
  re.tpl_host_fuzzy_test = "localhost|www\\.|\\.\\d{1,3}\\.|(?:\\.(?:%TLDS%)(?:" + re.src_ZPCc + "|>|$))";
  re.tpl_email_fuzzy = "(^|" + text_separators + '|"|\\(|' + re.src_ZCc + ")(" + re.src_email_name + "@" + re.tpl_host_fuzzy_strict + ")";
  re.tpl_link_fuzzy = // Fuzzy link can't be prepended with .:/\- and non punctuation.
  // but can start with > (markdown blockquote)
  "(^|(?![.:/\\-_@])(?:[$+<=>^`|｜]|" + re.src_ZPCc + "))((?![$+<=>^`|｜])" + re.tpl_host_port_fuzzy_strict + re.src_path + ")";
  re.tpl_link_no_ip_fuzzy = // Fuzzy link can't be prepended with .:/\- and non punctuation.
  // but can start with > (markdown blockquote)
  "(^|(?![.:/\\-_@])(?:[$+<=>^`|｜]|" + re.src_ZPCc + "))((?![$+<=>^`|｜])" + re.tpl_host_port_no_ip_fuzzy_strict + re.src_path + ")";
  return re;
}
function assign(obj) {
  const sources = Array.prototype.slice.call(arguments, 1);
  sources.forEach(function(source) {
    if (!source) {
      return;
    }
    Object.keys(source).forEach(function(key) {
      obj[key] = source[key];
    });
  });
  return obj;
}
function _class(obj) {
  return Object.prototype.toString.call(obj);
}
function isString(obj) {
  return _class(obj) === "[object String]";
}
function isObject(obj) {
  return _class(obj) === "[object Object]";
}
function isRegExp(obj) {
  return _class(obj) === "[object RegExp]";
}
function isFunction(obj) {
  return _class(obj) === "[object Function]";
}
function escapeRE(str) {
  return str.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
}
const defaultOptions = {
  fuzzyLink: true,
  fuzzyEmail: true,
  fuzzyIP: false
};
function isOptionsObj(obj) {
  return Object.keys(obj || {}).reduce(function(acc, k) {
    return acc || defaultOptions.hasOwnProperty(k);
  }, false);
}
const defaultSchemas = {
  "http:": {
    validate: function(text2, pos, self2) {
      const tail = text2.slice(pos);
      if (!self2.re.http) {
        self2.re.http = new RegExp(
          "^\\/\\/" + self2.re.src_auth + self2.re.src_host_port_strict + self2.re.src_path,
          "i"
        );
      }
      if (self2.re.http.test(tail)) {
        return tail.match(self2.re.http)[0].length;
      }
      return 0;
    }
  },
  "https:": "http:",
  "ftp:": "http:",
  "//": {
    validate: function(text2, pos, self2) {
      const tail = text2.slice(pos);
      if (!self2.re.no_http) {
        self2.re.no_http = new RegExp(
          "^" + self2.re.src_auth + // Don't allow single-level domains, because of false positives like '//test'
          // with code comments
          "(?:localhost|(?:(?:" + self2.re.src_domain + ")\\.)+" + self2.re.src_domain_root + ")" + self2.re.src_port + self2.re.src_host_terminator + self2.re.src_path,
          "i"
        );
      }
      if (self2.re.no_http.test(tail)) {
        if (pos >= 3 && text2[pos - 3] === ":") {
          return 0;
        }
        if (pos >= 3 && text2[pos - 3] === "/") {
          return 0;
        }
        return tail.match(self2.re.no_http)[0].length;
      }
      return 0;
    }
  },
  "mailto:": {
    validate: function(text2, pos, self2) {
      const tail = text2.slice(pos);
      if (!self2.re.mailto) {
        self2.re.mailto = new RegExp(
          "^" + self2.re.src_email_name + "@" + self2.re.src_host_strict,
          "i"
        );
      }
      if (self2.re.mailto.test(tail)) {
        return tail.match(self2.re.mailto)[0].length;
      }
      return 0;
    }
  }
};
const tlds_2ch_src_re = "a[cdefgilmnoqrstuwxz]|b[abdefghijmnorstvwyz]|c[acdfghiklmnoruvwxyz]|d[ejkmoz]|e[cegrstu]|f[ijkmor]|g[abdefghilmnpqrstuwy]|h[kmnrtu]|i[delmnoqrst]|j[emop]|k[eghimnprwyz]|l[abcikrstuvy]|m[acdeghklmnopqrstuvwxyz]|n[acefgilopruz]|om|p[aefghklmnrstwy]|qa|r[eosuw]|s[abcdeghijklmnortuvxyz]|t[cdfghjklmnortvwz]|u[agksyz]|v[aceginu]|w[fs]|y[et]|z[amw]";
const tlds_default = "biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф".split("|");
function resetScanCache(self2) {
  self2.__index__ = -1;
  self2.__text_cache__ = "";
}
function createValidator(re) {
  return function(text2, pos) {
    const tail = text2.slice(pos);
    if (re.test(tail)) {
      return tail.match(re)[0].length;
    }
    return 0;
  };
}
function createNormalizer() {
  return function(match2, self2) {
    self2.normalize(match2);
  };
}
function compile(self2) {
  const re = self2.re = reFactory(self2.__opts__);
  const tlds2 = self2.__tlds__.slice();
  self2.onCompile();
  if (!self2.__tlds_replaced__) {
    tlds2.push(tlds_2ch_src_re);
  }
  tlds2.push(re.src_xn);
  re.src_tlds = tlds2.join("|");
  function untpl(tpl) {
    return tpl.replace("%TLDS%", re.src_tlds);
  }
  re.email_fuzzy = RegExp(untpl(re.tpl_email_fuzzy), "i");
  re.link_fuzzy = RegExp(untpl(re.tpl_link_fuzzy), "i");
  re.link_no_ip_fuzzy = RegExp(untpl(re.tpl_link_no_ip_fuzzy), "i");
  re.host_fuzzy_test = RegExp(untpl(re.tpl_host_fuzzy_test), "i");
  const aliases = [];
  self2.__compiled__ = {};
  function schemaError(name, val) {
    throw new Error('(LinkifyIt) Invalid schema "' + name + '": ' + val);
  }
  Object.keys(self2.__schemas__).forEach(function(name) {
    const val = self2.__schemas__[name];
    if (val === null) {
      return;
    }
    const compiled = { validate: null, link: null };
    self2.__compiled__[name] = compiled;
    if (isObject(val)) {
      if (isRegExp(val.validate)) {
        compiled.validate = createValidator(val.validate);
      } else if (isFunction(val.validate)) {
        compiled.validate = val.validate;
      } else {
        schemaError(name, val);
      }
      if (isFunction(val.normalize)) {
        compiled.normalize = val.normalize;
      } else if (!val.normalize) {
        compiled.normalize = createNormalizer();
      } else {
        schemaError(name, val);
      }
      return;
    }
    if (isString(val)) {
      aliases.push(name);
      return;
    }
    schemaError(name, val);
  });
  aliases.forEach(function(alias) {
    if (!self2.__compiled__[self2.__schemas__[alias]]) {
      return;
    }
    self2.__compiled__[alias].validate = self2.__compiled__[self2.__schemas__[alias]].validate;
    self2.__compiled__[alias].normalize = self2.__compiled__[self2.__schemas__[alias]].normalize;
  });
  self2.__compiled__[""] = { validate: null, normalize: createNormalizer() };
  const slist = Object.keys(self2.__compiled__).filter(function(name) {
    return name.length > 0 && self2.__compiled__[name];
  }).map(escapeRE).join("|");
  self2.re.schema_test = RegExp("(^|(?!_)(?:[><｜]|" + re.src_ZPCc + "))(" + slist + ")", "i");
  self2.re.schema_search = RegExp("(^|(?!_)(?:[><｜]|" + re.src_ZPCc + "))(" + slist + ")", "ig");
  self2.re.schema_at_start = RegExp("^" + self2.re.schema_search.source, "i");
  self2.re.pretest = RegExp(
    "(" + self2.re.schema_test.source + ")|(" + self2.re.host_fuzzy_test.source + ")|@",
    "i"
  );
  resetScanCache(self2);
}
function Match(self2, shift) {
  const start = self2.__index__;
  const end = self2.__last_index__;
  const text2 = self2.__text_cache__.slice(start, end);
  this.schema = self2.__schema__.toLowerCase();
  this.index = start + shift;
  this.lastIndex = end + shift;
  this.raw = text2;
  this.text = text2;
  this.url = text2;
}
function createMatch(self2, shift) {
  const match2 = new Match(self2, shift);
  self2.__compiled__[match2.schema].normalize(match2, self2);
  return match2;
}
function LinkifyIt(schemas, options) {
  if (!(this instanceof LinkifyIt)) {
    return new LinkifyIt(schemas, options);
  }
  if (!options) {
    if (isOptionsObj(schemas)) {
      options = schemas;
      schemas = {};
    }
  }
  this.__opts__ = assign({}, defaultOptions, options);
  this.__index__ = -1;
  this.__last_index__ = -1;
  this.__schema__ = "";
  this.__text_cache__ = "";
  this.__schemas__ = assign({}, defaultSchemas, schemas);
  this.__compiled__ = {};
  this.__tlds__ = tlds_default;
  this.__tlds_replaced__ = false;
  this.re = {};
  compile(this);
}
LinkifyIt.prototype.add = function add2(schema, definition) {
  this.__schemas__[schema] = definition;
  compile(this);
  return this;
};
LinkifyIt.prototype.set = function set2(options) {
  this.__opts__ = assign(this.__opts__, options);
  return this;
};
LinkifyIt.prototype.test = function test(text2) {
  this.__text_cache__ = text2;
  this.__index__ = -1;
  if (!text2.length) {
    return false;
  }
  let m, ml, me, len, shift, next, re, tld_pos, at_pos;
  if (this.re.schema_test.test(text2)) {
    re = this.re.schema_search;
    re.lastIndex = 0;
    while ((m = re.exec(text2)) !== null) {
      len = this.testSchemaAt(text2, m[2], re.lastIndex);
      if (len) {
        this.__schema__ = m[2];
        this.__index__ = m.index + m[1].length;
        this.__last_index__ = m.index + m[0].length + len;
        break;
      }
    }
  }
  if (this.__opts__.fuzzyLink && this.__compiled__["http:"]) {
    tld_pos = text2.search(this.re.host_fuzzy_test);
    if (tld_pos >= 0) {
      if (this.__index__ < 0 || tld_pos < this.__index__) {
        if ((ml = text2.match(this.__opts__.fuzzyIP ? this.re.link_fuzzy : this.re.link_no_ip_fuzzy)) !== null) {
          shift = ml.index + ml[1].length;
          if (this.__index__ < 0 || shift < this.__index__) {
            this.__schema__ = "";
            this.__index__ = shift;
            this.__last_index__ = ml.index + ml[0].length;
          }
        }
      }
    }
  }
  if (this.__opts__.fuzzyEmail && this.__compiled__["mailto:"]) {
    at_pos = text2.indexOf("@");
    if (at_pos >= 0) {
      if ((me = text2.match(this.re.email_fuzzy)) !== null) {
        shift = me.index + me[1].length;
        next = me.index + me[0].length;
        if (this.__index__ < 0 || shift < this.__index__ || shift === this.__index__ && next > this.__last_index__) {
          this.__schema__ = "mailto:";
          this.__index__ = shift;
          this.__last_index__ = next;
        }
      }
    }
  }
  return this.__index__ >= 0;
};
LinkifyIt.prototype.pretest = function pretest(text2) {
  return this.re.pretest.test(text2);
};
LinkifyIt.prototype.testSchemaAt = function testSchemaAt(text2, schema, pos) {
  if (!this.__compiled__[schema.toLowerCase()]) {
    return 0;
  }
  return this.__compiled__[schema.toLowerCase()].validate(text2, pos, this);
};
LinkifyIt.prototype.match = function match(text2) {
  const result = [];
  let shift = 0;
  if (this.__index__ >= 0 && this.__text_cache__ === text2) {
    result.push(createMatch(this, shift));
    shift = this.__last_index__;
  }
  let tail = shift ? text2.slice(shift) : text2;
  while (this.test(tail)) {
    result.push(createMatch(this, shift));
    tail = tail.slice(this.__last_index__);
    shift += this.__last_index__;
  }
  if (result.length) {
    return result;
  }
  return null;
};
LinkifyIt.prototype.matchAtStart = function matchAtStart(text2) {
  this.__text_cache__ = text2;
  this.__index__ = -1;
  if (!text2.length)
    return null;
  const m = this.re.schema_at_start.exec(text2);
  if (!m)
    return null;
  const len = this.testSchemaAt(text2, m[2], m[0].length);
  if (!len)
    return null;
  this.__schema__ = m[2];
  this.__index__ = m.index + m[1].length;
  this.__last_index__ = m.index + m[0].length + len;
  return createMatch(this, 0);
};
LinkifyIt.prototype.tlds = function tlds(list2, keepOld) {
  list2 = Array.isArray(list2) ? list2 : [list2];
  if (!keepOld) {
    this.__tlds__ = list2.slice();
    this.__tlds_replaced__ = true;
    compile(this);
    return this;
  }
  this.__tlds__ = this.__tlds__.concat(list2).sort().filter(function(el, idx, arr) {
    return el !== arr[idx - 1];
  }).reverse();
  compile(this);
  return this;
};
LinkifyIt.prototype.normalize = function normalize2(match2) {
  if (!match2.schema) {
    match2.url = "http://" + match2.url;
  }
  if (match2.schema === "mailto:" && !/^mailto:/i.test(match2.url)) {
    match2.url = "mailto:" + match2.url;
  }
};
LinkifyIt.prototype.onCompile = function onCompile() {
};
const maxInt = 2147483647;
const base = 36;
const tMin = 1;
const tMax = 26;
const skew = 38;
const damp = 700;
const initialBias = 72;
const initialN = 128;
const delimiter = "-";
const regexPunycode = /^xn--/;
const regexNonASCII = /[^\0-\x7F]/;
const regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g;
const errors = {
  "overflow": "Overflow: input needs wider integers to process",
  "not-basic": "Illegal input >= 0x80 (not a basic code point)",
  "invalid-input": "Invalid input"
};
const baseMinusTMin = base - tMin;
const floor = Math.floor;
const stringFromCharCode = String.fromCharCode;
function error(type) {
  throw new RangeError(errors[type]);
}
function map(array, callback) {
  const result = [];
  let length = array.length;
  while (length--) {
    result[length] = callback(array[length]);
  }
  return result;
}
function mapDomain(domain, callback) {
  const parts = domain.split("@");
  let result = "";
  if (parts.length > 1) {
    result = parts[0] + "@";
    domain = parts[1];
  }
  domain = domain.replace(regexSeparators, ".");
  const labels = domain.split(".");
  const encoded = map(labels, callback).join(".");
  return result + encoded;
}
function ucs2decode(string) {
  const output = [];
  let counter = 0;
  const length = string.length;
  while (counter < length) {
    const value = string.charCodeAt(counter++);
    if (value >= 55296 && value <= 56319 && counter < length) {
      const extra = string.charCodeAt(counter++);
      if ((extra & 64512) == 56320) {
        output.push(((value & 1023) << 10) + (extra & 1023) + 65536);
      } else {
        output.push(value);
        counter--;
      }
    } else {
      output.push(value);
    }
  }
  return output;
}
const ucs2encode = (codePoints) => String.fromCodePoint(...codePoints);
const basicToDigit = function(codePoint) {
  if (codePoint >= 48 && codePoint < 58) {
    return 26 + (codePoint - 48);
  }
  if (codePoint >= 65 && codePoint < 91) {
    return codePoint - 65;
  }
  if (codePoint >= 97 && codePoint < 123) {
    return codePoint - 97;
  }
  return base;
};
const digitToBasic = function(digit, flag) {
  return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
};
const adapt = function(delta, numPoints, firstTime) {
  let k = 0;
  delta = firstTime ? floor(delta / damp) : delta >> 1;
  delta += floor(delta / numPoints);
  for (; delta > baseMinusTMin * tMax >> 1; k += base) {
    delta = floor(delta / baseMinusTMin);
  }
  return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
};
const decode = function(input) {
  const output = [];
  const inputLength = input.length;
  let i = 0;
  let n = initialN;
  let bias = initialBias;
  let basic = input.lastIndexOf(delimiter);
  if (basic < 0) {
    basic = 0;
  }
  for (let j = 0; j < basic; ++j) {
    if (input.charCodeAt(j) >= 128) {
      error("not-basic");
    }
    output.push(input.charCodeAt(j));
  }
  for (let index = basic > 0 ? basic + 1 : 0; index < inputLength; ) {
    const oldi = i;
    for (let w = 1, k = base; ; k += base) {
      if (index >= inputLength) {
        error("invalid-input");
      }
      const digit = basicToDigit(input.charCodeAt(index++));
      if (digit >= base) {
        error("invalid-input");
      }
      if (digit > floor((maxInt - i) / w)) {
        error("overflow");
      }
      i += digit * w;
      const t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
      if (digit < t) {
        break;
      }
      const baseMinusT = base - t;
      if (w > floor(maxInt / baseMinusT)) {
        error("overflow");
      }
      w *= baseMinusT;
    }
    const out = output.length + 1;
    bias = adapt(i - oldi, out, oldi == 0);
    if (floor(i / out) > maxInt - n) {
      error("overflow");
    }
    n += floor(i / out);
    i %= out;
    output.splice(i++, 0, n);
  }
  return String.fromCodePoint(...output);
};
const encode = function(input) {
  const output = [];
  input = ucs2decode(input);
  const inputLength = input.length;
  let n = initialN;
  let delta = 0;
  let bias = initialBias;
  for (const currentValue of input) {
    if (currentValue < 128) {
      output.push(stringFromCharCode(currentValue));
    }
  }
  const basicLength = output.length;
  let handledCPCount = basicLength;
  if (basicLength) {
    output.push(delimiter);
  }
  while (handledCPCount < inputLength) {
    let m = maxInt;
    for (const currentValue of input) {
      if (currentValue >= n && currentValue < m) {
        m = currentValue;
      }
    }
    const handledCPCountPlusOne = handledCPCount + 1;
    if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
      error("overflow");
    }
    delta += (m - n) * handledCPCountPlusOne;
    n = m;
    for (const currentValue of input) {
      if (currentValue < n && ++delta > maxInt) {
        error("overflow");
      }
      if (currentValue === n) {
        let q = delta;
        for (let k = base; ; k += base) {
          const t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
          if (q < t) {
            break;
          }
          const qMinusT = q - t;
          const baseMinusT = base - t;
          output.push(
            stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
          );
          q = floor(qMinusT / baseMinusT);
        }
        output.push(stringFromCharCode(digitToBasic(q, 0)));
        bias = adapt(delta, handledCPCountPlusOne, handledCPCount === basicLength);
        delta = 0;
        ++handledCPCount;
      }
    }
    ++delta;
    ++n;
  }
  return output.join("");
};
const toUnicode = function(input) {
  return mapDomain(input, function(string) {
    return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
  });
};
const toASCII = function(input) {
  return mapDomain(input, function(string) {
    return regexNonASCII.test(string) ? "xn--" + encode(string) : string;
  });
};
const punycode = {
  /**
   * A string representing the current Punycode.js version number.
   * @memberOf punycode
   * @type String
   */
  "version": "2.3.1",
  /**
   * An object of methods to convert from JavaScript's internal character
   * representation (UCS-2) to Unicode code points, and back.
   * @see <https://mathiasbynens.be/notes/javascript-encoding>
   * @memberOf punycode
   * @type Object
   */
  "ucs2": {
    "decode": ucs2decode,
    "encode": ucs2encode
  },
  "decode": decode,
  "encode": encode,
  "toASCII": toASCII,
  "toUnicode": toUnicode
};
const cfg_default = {
  options: {
    // Enable HTML tags in source
    html: false,
    // Use '/' to close single tags (<br />)
    xhtmlOut: false,
    // Convert '\n' in paragraphs into <br>
    breaks: false,
    // CSS language prefix for fenced blocks
    langPrefix: "language-",
    // autoconvert URL-like texts to links
    linkify: false,
    // Enable some language-neutral replacements + quotes beautification
    typographer: false,
    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Could be either a String or an Array.
    //
    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
    quotes: "“”‘’",
    /* “”‘’ */
    // Highlighter function. Should return escaped HTML,
    // or '' if the source string is not changed and should be escaped externaly.
    // If result starts with <pre... internal wrapper is skipped.
    //
    // function (/*str, lang*/) { return ''; }
    //
    highlight: null,
    // Internal protection, recursion limit
    maxNesting: 100
  },
  components: {
    core: {},
    block: {},
    inline: {}
  }
};
const cfg_zero = {
  options: {
    // Enable HTML tags in source
    html: false,
    // Use '/' to close single tags (<br />)
    xhtmlOut: false,
    // Convert '\n' in paragraphs into <br>
    breaks: false,
    // CSS language prefix for fenced blocks
    langPrefix: "language-",
    // autoconvert URL-like texts to links
    linkify: false,
    // Enable some language-neutral replacements + quotes beautification
    typographer: false,
    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Could be either a String or an Array.
    //
    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
    quotes: "“”‘’",
    /* “”‘’ */
    // Highlighter function. Should return escaped HTML,
    // or '' if the source string is not changed and should be escaped externaly.
    // If result starts with <pre... internal wrapper is skipped.
    //
    // function (/*str, lang*/) { return ''; }
    //
    highlight: null,
    // Internal protection, recursion limit
    maxNesting: 20
  },
  components: {
    core: {
      rules: [
        "normalize",
        "block",
        "inline",
        "text_join"
      ]
    },
    block: {
      rules: [
        "paragraph"
      ]
    },
    inline: {
      rules: [
        "text"
      ],
      rules2: [
        "balance_pairs",
        "fragments_join"
      ]
    }
  }
};
const cfg_commonmark = {
  options: {
    // Enable HTML tags in source
    html: true,
    // Use '/' to close single tags (<br />)
    xhtmlOut: true,
    // Convert '\n' in paragraphs into <br>
    breaks: false,
    // CSS language prefix for fenced blocks
    langPrefix: "language-",
    // autoconvert URL-like texts to links
    linkify: false,
    // Enable some language-neutral replacements + quotes beautification
    typographer: false,
    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Could be either a String or an Array.
    //
    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
    quotes: "“”‘’",
    /* “”‘’ */
    // Highlighter function. Should return escaped HTML,
    // or '' if the source string is not changed and should be escaped externaly.
    // If result starts with <pre... internal wrapper is skipped.
    //
    // function (/*str, lang*/) { return ''; }
    //
    highlight: null,
    // Internal protection, recursion limit
    maxNesting: 20
  },
  components: {
    core: {
      rules: [
        "normalize",
        "block",
        "inline",
        "text_join"
      ]
    },
    block: {
      rules: [
        "blockquote",
        "code",
        "fence",
        "heading",
        "hr",
        "html_block",
        "lheading",
        "list",
        "reference",
        "paragraph"
      ]
    },
    inline: {
      rules: [
        "autolink",
        "backticks",
        "emphasis",
        "entity",
        "escape",
        "html_inline",
        "image",
        "link",
        "newline",
        "text"
      ],
      rules2: [
        "balance_pairs",
        "emphasis",
        "fragments_join"
      ]
    }
  }
};
const config = {
  default: cfg_default,
  zero: cfg_zero,
  commonmark: cfg_commonmark
};
const BAD_PROTO_RE = /^(vbscript|javascript|file|data):/;
const GOOD_DATA_RE = /^data:image\/(gif|png|jpeg|webp);/;
function validateLink(url2) {
  const str = url2.trim().toLowerCase();
  return BAD_PROTO_RE.test(str) ? GOOD_DATA_RE.test(str) : true;
}
const RECODE_HOSTNAME_FOR = ["http:", "https:", "mailto:"];
function normalizeLink(url2) {
  const parsed = urlParse(url2, true);
  if (parsed.hostname) {
    if (!parsed.protocol || RECODE_HOSTNAME_FOR.indexOf(parsed.protocol) >= 0) {
      try {
        parsed.hostname = punycode.toASCII(parsed.hostname);
      } catch (er) {
      }
    }
  }
  return encode$1(format(parsed));
}
function normalizeLinkText(url2) {
  const parsed = urlParse(url2, true);
  if (parsed.hostname) {
    if (!parsed.protocol || RECODE_HOSTNAME_FOR.indexOf(parsed.protocol) >= 0) {
      try {
        parsed.hostname = punycode.toUnicode(parsed.hostname);
      } catch (er) {
      }
    }
  }
  return decode$1(format(parsed), decode$1.defaultChars + "%");
}
function MarkdownIt(presetName, options) {
  if (!(this instanceof MarkdownIt)) {
    return new MarkdownIt(presetName, options);
  }
  if (!options) {
    if (!isString$1(presetName)) {
      options = presetName || {};
      presetName = "default";
    }
  }
  this.inline = new ParserInline();
  this.block = new ParserBlock();
  this.core = new Core();
  this.renderer = new Renderer();
  this.linkify = new LinkifyIt();
  this.validateLink = validateLink;
  this.normalizeLink = normalizeLink;
  this.normalizeLinkText = normalizeLinkText;
  this.utils = utils;
  this.helpers = assign$1({}, helpers);
  this.options = {};
  this.configure(presetName);
  if (options) {
    this.set(options);
  }
}
MarkdownIt.prototype.set = function(options) {
  assign$1(this.options, options);
  return this;
};
MarkdownIt.prototype.configure = function(presets) {
  const self2 = this;
  if (isString$1(presets)) {
    const presetName = presets;
    presets = config[presetName];
    if (!presets) {
      throw new Error('Wrong `markdown-it` preset "' + presetName + '", check name');
    }
  }
  if (!presets) {
    throw new Error("Wrong `markdown-it` preset, can't be empty");
  }
  if (presets.options) {
    self2.set(presets.options);
  }
  if (presets.components) {
    Object.keys(presets.components).forEach(function(name) {
      if (presets.components[name].rules) {
        self2[name].ruler.enableOnly(presets.components[name].rules);
      }
      if (presets.components[name].rules2) {
        self2[name].ruler2.enableOnly(presets.components[name].rules2);
      }
    });
  }
  return this;
};
MarkdownIt.prototype.enable = function(list2, ignoreInvalid) {
  let result = [];
  if (!Array.isArray(list2)) {
    list2 = [list2];
  }
  ["core", "block", "inline"].forEach(function(chain) {
    result = result.concat(this[chain].ruler.enable(list2, true));
  }, this);
  result = result.concat(this.inline.ruler2.enable(list2, true));
  const missed = list2.filter(function(name) {
    return result.indexOf(name) < 0;
  });
  if (missed.length && !ignoreInvalid) {
    throw new Error("MarkdownIt. Failed to enable unknown rule(s): " + missed);
  }
  return this;
};
MarkdownIt.prototype.disable = function(list2, ignoreInvalid) {
  let result = [];
  if (!Array.isArray(list2)) {
    list2 = [list2];
  }
  ["core", "block", "inline"].forEach(function(chain) {
    result = result.concat(this[chain].ruler.disable(list2, true));
  }, this);
  result = result.concat(this.inline.ruler2.disable(list2, true));
  const missed = list2.filter(function(name) {
    return result.indexOf(name) < 0;
  });
  if (missed.length && !ignoreInvalid) {
    throw new Error("MarkdownIt. Failed to disable unknown rule(s): " + missed);
  }
  return this;
};
MarkdownIt.prototype.use = function(plugin) {
  const args = [this].concat(Array.prototype.slice.call(arguments, 1));
  plugin.apply(plugin, args);
  return this;
};
MarkdownIt.prototype.parse = function(src, env) {
  if (typeof src !== "string") {
    throw new Error("Input data should be a String");
  }
  const state = new this.core.State(src, this, env);
  this.core.process(state);
  return state.tokens;
};
MarkdownIt.prototype.render = function(src, env) {
  env = env || {};
  return this.renderer.render(this.parse(src, env), this.options, env);
};
MarkdownIt.prototype.parseInline = function(src, env) {
  const state = new this.core.State(src, this, env);
  state.inlineMode = true;
  this.core.process(state);
  return state.tokens;
};
MarkdownIt.prototype.renderInline = function(src, env) {
  env = env || {};
  return this.renderer.render(this.parseInline(src, env), this.options, env);
};
const _hoisted_1$3 = ["innerHTML"];
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "MarkdownIt",
  props: {
    content: {}
  },
  setup(__props) {
    const props = __props;
    const markdown = MarkdownIt();
    const markdownContent = markdown.render(props.content);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        innerHTML: unref(markdownContent),
        class: "text-white markdown"
      }, null, 8, _hoisted_1$3);
    };
  }
});
const MarkdownIt_vue_vue_type_style_index_0_lang = "";
const helpMD = "# Web Simple Player（暂定）\r\n\r\n## 1. 快捷键\r\n\r\n| 快捷键       | 功能                 |\r\n|-----------|--------------------|\r\n| 空格（Space） | 播放/暂停              |\r\n| M         | 显示或隐藏迷你播放面板        |\r\n| 右方向键      | 下一曲                |\r\n| 左方向键      | 上一曲                |\r\n| P         | 停止                 |\r\n| F         | 全屏 canvas          |\r\n| U         | 在控制台输出创建的 Drawable |\r\n\r\n## 2. 文件\r\n\r\n### 2.1 选择 osz 文件夹\r\n\r\n点击 Logo 之后，页面顶部会出现一个顶栏，点击顶栏中的文件夹图标，会弹出一个目录选择框，\r\n选择含有 osz 文件的文件夹，点击确定即可。\r\n\r\n### 2.2 拖动 osz 文件\r\n\r\n将 osz 文件拖动到页面中，将会自动解压、解析和播放，如果一次拖动多个 osz 文件，只会处理其中一个 osz 文件。\r\n\r\n### 2.3 自定义背景\r\n\r\n在默认情况下，播放器会使用 osu 默认的背景，如果想用自定义背景，可以按照以下步骤进行：\r\n\r\n1. 准备一些自己的背景图片（为获得最佳效果，其图片的比例尽量与自己的设备的比例相近），图片的格式必须浏览器可以识别\r\n2. 将这些图片放在一个文件夹中\r\n3. 点击 Logo，点击设置图标，出现设置面板\r\n4. 在 Background 下拉菜单中选择 `Custom` ，会弹出文件夹选择框\r\n5. 选择包含背景图片的文件夹，点击确定\r\n\r\n";
const _hoisted_1$2 = { class: "ma" };
const _hoisted_2$1 = /* @__PURE__ */ createBaseVNode("span", { class: "text-xl" }, "帮助", -1);
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "HelpPanel",
  setup(__props) {
    function close() {
      OSUPanelStack.pop();
    }
    const categories = generateCategory(helpMD);
    function generateCategory(mdContent) {
      const lines = mdContent.split("\n").filter((v) => v.startsWith("#"));
      return lines.map((v) => {
        const line = v.trimStart();
        let sharpCount = 0;
        for (const char of line) {
          if (char === "#") {
            sharpCount++;
          } else {
            break;
          }
        }
        return {
          title: line.substring(sharpCount).trim(),
          level: sharpCount
        };
      });
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(OSUPanel, {
        "panel-id": "help",
        "theme-color": unref(Color).Transparent
      }, {
        default: withCtx(() => [
          createVNode(Column, { class: "bg-amber-950 w-full h-fit" }, {
            default: withCtx(() => [
              createVNode(Row, {
                class: "w-full bg-amber-800 text-white py-2 px-4",
                gap: 8,
                "center-vertical": ""
              }, {
                default: withCtx(() => [
                  createBaseVNode("span", _hoisted_1$2, toDisplayString(unref(Icon).Help), 1),
                  _hoisted_2$1,
                  createBaseVNode("button", {
                    class: "ma ml-auto hover:bg-amber-600 transition active:bg-amber-500 rounded-md p-3",
                    onClick: _cache[0] || (_cache[0] = ($event) => close())
                  }, toDisplayString(unref(Icon).Close), 1)
                ]),
                _: 1
              }),
              createVNode(Row, null, {
                default: withCtx(() => [
                  createVNode(Column, { class: "bg-amber-900 w-72 p-4" }, {
                    default: withCtx(() => [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(unref(categories), (item) => {
                        return openBlock(), createElementBlock("div", {
                          class: "text-white py-1 px-1 cursor-pointer hover:bg-amber-800 transition active:bg-amber-700 rounded-md",
                          style: normalizeStyle({
                            "padding-left": `${item.level * 16}px`
                          })
                        }, toDisplayString(item.title), 5);
                      }), 256))
                    ]),
                    _: 1
                  }),
                  createVNode(_sfc_main$6, {
                    class: "p-8",
                    content: unref(helpMD)
                  }, null, 8, ["content"])
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["theme-color"]);
    };
  }
});
const _OSUDialog = class _OSUDialog2 {
  constructor(dialogId, component) {
    this.dialogId = dialogId;
    this.component = component;
    this.onDataReturned = new SingleEvent();
    this.onCloseRequested = new SingleEvent();
    this.isDialogShown = false;
    this.resolve = Promise.resolve();
    this.isCloseRequested = false;
    _OSUDialog2.dialogs.push(this);
  }
  static getDialog(dialogId) {
    const dialog = this.dialogs.find((d) => d.dialogId === dialogId);
    if (!dialog) {
      throw new Error(`Dialog with id ${dialogId} not found`);
    }
    return dialog;
  }
  show(dialogProps) {
    if (this.isDialogShown) {
      throw new Error("AlertDialog is already shown");
    }
    playSound(Sound.DialogPopIn);
    _OSUDialog2.dialogZIndex.value++;
    return new Promise((resolve2) => {
      this.isDialogShown = true;
      this.isCloseRequested = false;
      const container = document.createElement("div");
      const vNode = createVNode(this.component, dialogProps);
      vNode.appContext = null;
      render(vNode, container);
      document.body.appendChild(container);
      const dispose = this.onDataReturned.add((result) => {
        this.isDialogShown = false;
        this.resolve.then(() => dispose());
        render(null, container);
        _OSUDialog2.dialogZIndex.value--;
        container.remove();
        resolve2(result);
      });
    });
  }
  sendAndClose(data) {
    if (this.isCloseRequested) {
      return;
    }
    this.isCloseRequested = true;
    playSound(Sound.DialogPopOut);
    this.onCloseRequested.fire(data);
  }
};
_OSUDialog.dialogs = [];
_OSUDialog.dialogZIndex = ref(601);
let OSUDialog = _OSUDialog;
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "AlertDialog",
  props: {
    dialogId: {}
  },
  setup(__props) {
    const props = __props;
    const dialogOpacity = ref(0);
    const dialogScale = ref(0.6);
    const maskOpacity = ref(0);
    const dialogOpacityTo = useTransitionRef(dialogOpacity);
    const dialogScaleTo = useTransitionRef(dialogScale);
    const maskOpacityTo = useTransitionRef(maskOpacity);
    const zIndex = ref(600);
    const mask = ref(true);
    onMounted(() => {
      dialogScaleTo(1, 400, easeOutBack);
      maskOpacityTo(1, 400, easeOutQuint);
      dialogOpacityTo(1, 400, easeOutQuint);
      zIndex.value = OSUDialog.dialogZIndex.value;
    });
    function closeSelf(data) {
      dialogScaleTo(0.6, 800, easeOutQuint);
      maskOpacityTo(0, 800, easeOutQuint);
      dialogOpacityTo(0, 800, easeOutQuint);
      setTimeout(() => {
        mask.value = false;
        dialog.onDataReturned.fire(data);
      }, 800);
    }
    const dialog = OSUDialog.getDialog(props.dialogId);
    useSingleEvent(dialog.onCloseRequested, (data) => {
      closeSelf(data);
    });
    return (_ctx, _cache) => {
      return mask.value ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: "alert-dialog-box",
        style: normalizeStyle({ zIndex: zIndex.value })
      }, [
        createBaseVNode("div", {
          class: "alert-dialog-mask",
          style: normalizeStyle({ opacity: maskOpacity.value }),
          onClick: _cache[0] || (_cache[0] = () => unref(dialog).sendAndClose(void 0))
        }, null, 4),
        createBaseVNode("div", {
          class: "alert-dialog-content",
          style: normalizeStyle({
            transform: `scale(${dialogScale.value})`,
            opacity: dialogOpacity.value
          })
        }, [
          renderSlot(_ctx.$slots, "default", {}, void 0, true)
        ], 4)
      ], 4)) : createCommentVNode("", true);
    };
  }
});
const AlertDialog_vue_vue_type_style_index_0_scoped_d5d70adc_lang = "";
const AlertDialog = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-d5d70adc"]]);
const _sfc_main$3 = defineComponent({
  computed: {
    Icon() {
      return Icon;
    }
  },
  components: { Row, Column, AlertDialog },
  name: "TestDialog",
  setup(props, { emit: emit2 }) {
    const abort = () => {
      OSUDialogs.testDialog.sendAndClose();
    };
    const confirm = () => {
      OSUDialogs.testDialog.sendAndClose();
    };
    return {
      abort,
      confirm
    };
  }
});
const TestDialog_vue_vue_type_style_index_0_lang = "";
const _hoisted_1$1 = /* @__PURE__ */ createBaseVNode("div", {
  class: "rounded-full border-4 w-full h-full absolute scale-0",
  style: { "animation-duration": "500ms", "animation-timing-function": "var(--ease-out-back)", "animation-name": "scale-larger", "animation-fill-mode": "forwards" }
}, null, -1);
const _hoisted_2 = {
  class: "ma text-white absolute",
  style: { "font-size": "72px" }
};
const _hoisted_3 = /* @__PURE__ */ createBaseVNode("div", { class: "text-white text-center mt-4 text-3xl" }, " 提示 ", -1);
const _hoisted_4 = /* @__PURE__ */ createBaseVNode("p", { class: "text-white" }, "是否删除这个铺面？", -1);
const _hoisted_5 = /* @__PURE__ */ createBaseVNode("span", {
  class: "text-white font-bold absolute text-lg pointer-events-none",
  style: { "letter-spacing": "1px" }
}, " Yes ", -1);
const _hoisted_6 = /* @__PURE__ */ createBaseVNode("span", {
  class: "text-white font-bold absolute text-lg pointer-events-none",
  style: { "letter-spacing": "1px" }
}, " Abort ", -1);
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Row = resolveComponent("Row");
  const _component_Column = resolveComponent("Column");
  const _component_AlertDialog = resolveComponent("AlertDialog");
  return openBlock(), createBlock(_component_AlertDialog, { "dialog-id": "test" }, {
    default: withCtx(() => [
      createVNode(_component_Column, {
        style: { "background-color": "#302e38" },
        class: "py-8 rounded-[16px] w-[560px]",
        gap: 24,
        "center-horizontal": ""
      }, {
        default: withCtx(() => [
          createVNode(_component_Row, {
            class: "relative w-36 aspect-square",
            center: ""
          }, {
            default: withCtx(() => [
              _hoisted_1$1,
              createBaseVNode("div", _hoisted_2, toDisplayString(_ctx.Icon.Delete), 1)
            ]),
            _: 1
          }),
          createVNode(_component_Column, {
            class: "w-full px-8 mb-4",
            "center-horizontal": "",
            gap: 24
          }, {
            default: withCtx(() => [
              _hoisted_3,
              _hoisted_4
            ]),
            _: 1
          }),
          createVNode(_component_Column, { class: "w-full bg-black" }, {
            default: withCtx(() => [
              createVNode(_component_Row, {
                center: "",
                class: "w-full h-14 relative overflow-hidden"
              }, {
                default: withCtx(() => [
                  createBaseVNode("div", {
                    class: "bg-yellow-500 w-3/5 h-full -skew-x-12 absolute shadow-yellow-500 hover:scale-x-125",
                    style: { "transition": "transform 200ms var(--ease-out-quint)" },
                    onClick: _cache[0] || (_cache[0] = (...args) => _ctx.confirm && _ctx.confirm(...args))
                  }),
                  _hoisted_5
                ]),
                _: 1
              }),
              createVNode(_component_Row, {
                center: "",
                class: "w-full h-14 relative overflow-hidden"
              }, {
                default: withCtx(() => [
                  createBaseVNode("div", {
                    class: "bg-red-500 w-3/5 h-full -skew-x-12 absolute shadow-yellow-500 hover:scale-x-125",
                    style: { "transition": "transform 200ms var(--ease-out-quint)" },
                    onClick: _cache[1] || (_cache[1] = (...args) => _ctx.abort && _ctx.abort(...args))
                  }),
                  _hoisted_6
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ]),
        _: 1
      })
    ]),
    _: 1
  });
}
const TestDialog = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render]]);
class OSUDialogs {
}
OSUDialogs.testDialog = new OSUDialog("test", TestDialog);
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "TestPanel",
  setup(__props) {
    const showTest = () => {
      OSUDialogs.testDialog.show();
    };
    return (_ctx, _cache) => {
      const _directive_osu_button = resolveDirective("osu-button");
      return openBlock(), createBlock(OSUPanel, {
        "panel-id": "test",
        "theme-color": unref(Color).Transparent
      }, {
        default: withCtx(() => [
          createVNode(Column, {
            class: "bg-gray-800 w-full h-full",
            center: "",
            gap: 64
          }, {
            default: withCtx(() => [
              createVNode(Row, { gap: 64 }, {
                default: withCtx(() => [
                  withDirectives((openBlock(), createBlock(_sfc_main$o, {
                    color: unref(Color).fromRGB(59, 130, 246),
                    class: "px-4 py-2 text-white rounded-md",
                    onClick: showTest
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" 上一个 ")
                    ]),
                    _: 1
                  }, 8, ["color"])), [
                    [_directive_osu_button]
                  ]),
                  withDirectives((openBlock(), createBlock(_sfc_main$o, {
                    color: unref(Color).fromRGB(59, 130, 246),
                    class: "px-4 py-2 text-white rounded-md"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" 下一个 ")
                    ]),
                    _: 1
                  }, 8, ["color"])), [
                    [_directive_osu_button]
                  ])
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["theme-color"]);
    };
  }
});
const _hoisted_1 = { class: "panel-overlay-box" };
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "PanelOverlay",
  setup(__props) {
    const showMask = ref(false);
    const showState = reactive({
      beatmapList: false,
      beatmapDetails: false,
      help: false,
      test: false
    });
    useSingleEvent(OSUPanelStack.onAllPanelsPopped, () => {
      showMask.value = false;
    });
    useSingleEvent(OSUPanelStack.onPanelPushed, () => {
      showMask.value = true;
    });
    useSingleEvent(OSUPanelStack.onPanelPushed, ({ name }) => {
      if (name === "beatmapList") {
        showState.beatmapList = true;
      } else if (name === "beatmapDetails") {
        showState.beatmapDetails = true;
      } else if (name === "help") {
        showState.help = true;
      } else if (name === "test") {
        showState.test = true;
      }
    });
    useSingleEvent(OSUPanelStack.onPanelPopped, ({ name }) => {
      if (name === "beatmapList") {
        showState.beatmapList = false;
      } else if (name === "beatmapDetails") {
        showState.beatmapDetails = false;
      } else if (name === "help") {
        showState.help = false;
      } else if (name === "test") {
        showState.test = false;
      }
    });
    function popPanelStack() {
      OSUPanelStack.pop();
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createVNode(Transition$1, { name: "mask-box" }, {
          default: withCtx(() => [
            showMask.value ? (openBlock(), createBlock(Mask, {
              key: 0,
              class: "absolute",
              onClick: _cache[0] || (_cache[0] = ($event) => popPanelStack())
            })) : createCommentVNode("", true)
          ]),
          _: 1
        }),
        createVNode(Transition$1, { name: "osu-panel-box" }, {
          default: withCtx(() => [
            showState.beatmapList ? (openBlock(), createBlock(_sfc_main$8, { key: 0 })) : createCommentVNode("", true)
          ]),
          _: 1
        }),
        createVNode(Transition$1, { name: "osu-panel-box" }, {
          default: withCtx(() => [
            showState.beatmapDetails ? (openBlock(), createBlock(BeatmapDetailsPanel, { key: 0 })) : createCommentVNode("", true)
          ]),
          _: 1
        }),
        createVNode(Transition$1, { name: "osu-panel-box" }, {
          default: withCtx(() => [
            showState.help ? (openBlock(), createBlock(_sfc_main$5, { key: 0 })) : createCommentVNode("", true)
          ]),
          _: 1
        }),
        createVNode(Transition$1, { name: "osu-panel-box" }, {
          default: withCtx(() => [
            showState.test ? (openBlock(), createBlock(_sfc_main$2, { key: 0 })) : createCommentVNode("", true)
          ]),
          _: 1
        })
      ]);
    };
  }
});
const PanelOverlay_vue_vue_type_style_index_0_scoped_eee3e65d_lang = "";
const Overlay = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-eee3e65d"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "App",
  setup(__props) {
    const ui = reactive({
      list: false,
      bpmCalculator: false,
      showUI: false,
      screenSelector: false
    });
    const screenId = ref("main");
    useCollect(ScreenManager$1.currentId, (id2) => {
      screenId.value = id2;
      if (id2 === "main") {
        ui.showUI = false;
      }
    });
    provide$1("openList", () => {
      ui.list = true;
    });
    provide$1("openMiniPlayer", () => {
      VueUI.miniPlayer = true;
    });
    watch(() => VueUI.settings, (value) => {
      if (value) {
        playSound(Sound.OverlayBigPopIn);
      } else {
        playSound(Sound.OverlayBigPopOut);
      }
      onLeftSide.emit(value);
    });
    watch(() => VueUI.notification, (value) => {
      if (value) {
        playSound(Sound.OverlayBigPopIn);
      } else {
        playSound(Sound.OverlayBigPopOut);
      }
      onRightSide.emit(value);
    });
    watch(() => VueUI.miniPlayer, (value) => playSound(value ? Sound.NowPlayingPopIn : Sound.NowPlayingPopOut));
    useKeyboard("up", (evt) => {
      if (evt.code === "KeyO") {
        ui.showUI = true;
      }
      if (evt.code === "Escape") {
        ui.showUI = false;
      }
      if (evt.code === "KeyP") {
        OSUPlayer$1.stop();
        Toaster.show("停止");
      }
      if (evt.code === "KeyM") {
        VueUI.miniPlayer = !VueUI.miniPlayer;
      }
      if (ui.bpmCalculator) {
        return;
      }
      if (evt.code === "ArrowRight") {
        nextSong();
        Toaster.show("下一曲");
      } else if (evt.code === "ArrowLeft") {
        prevSong();
        Toaster.show("上一曲");
      } else if (evt.code === "Space") {
        play();
      }
      if (evt.code === "KeyU") {
        const drawables = DrawableRecorder.drawables;
        drawables.forEach((v) => console.log(v));
      }
    });
    onEnterMenu.collect((value) => {
      ui.showUI = value;
    });
    const hasSomeUIShow = computed(() => ui.list || VueUI.settings || VueUI.miniPlayer || VueUI.selectBeatmapDirectory || VueUI.notification || ui.screenSelector);
    watch(hasSomeUIShow, (value) => {
      if (value) {
        MouseEventFire.pause();
      } else {
        MouseEventFire.resume();
      }
    }, { immediate: true });
    function closeAll() {
      VueUI.settings = false;
      ui.list = false;
      VueUI.miniPlayer = false;
      VueUI.notification = false;
    }
    const stateText = ref("");
    collect(AudioPlayerV2.onEnd, () => {
      const isBpmCalculatorOpen = ui.bpmCalculator;
      if (isBpmCalculatorOpen) {
        return;
      }
    });
    collectLatest(AudioPlayerV2.playState, (stateCode) => {
      stateText.value = {
        [PlayerState.STATE_DOWNLOADING]: "正在下载",
        [PlayerState.STATE_DECODING]: "正在解码",
        [PlayerState.STATE_PLAYING]: "正在播放",
        [PlayerState.STATE_DECODE_DONE]: "准备就绪",
        [PlayerState.STATE_PAUSING]: "播放暂停"
      }[stateCode] ?? "";
    });
    onMounted(() => init());
    notifyMessage("Welcome!");
    async function init() {
    }
    function play() {
      scope(OSUPlayer$1, function() {
        if (this.isPlaying()) {
          this.pause();
          Toaster.show("暂停");
        } else {
          this.play();
          Toaster.show("播放");
        }
      });
    }
    function nextSong() {
      TempOSUPlayManager$1.next();
    }
    function prevSong() {
      TempOSUPlayManager$1.prev();
    }
    function handleDrop(e) {
      e.preventDefault();
      if (e.type === "dragenter")
        ;
      else if (e.type === "dragleave")
        ;
      else if (e.type === "drop") {
        handleFile(e);
      }
    }
    function handleFile(e) {
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (files.length > 1) {
        return;
      }
      notifyMessage("开始加载拖动的 osz 文件");
      loadOSZ(files.item(0));
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "fill-size flex justify-center relative overflow-hidden",
        onDrop: handleDrop,
        onDragenter: handleDrop,
        onDragleave: handleDrop,
        onDragover: handleDrop
      }, [
        createVNode(_sfc_main$g, { class: "absolute" }),
        createVNode(Transition$1, { name: "mask" }, {
          default: withCtx(() => [
            hasSomeUIShow.value ? (openBlock(), createElementBlock("div", {
              key: 0,
              class: "max-size mask absolute",
              onClick: _cache[0] || (_cache[0] = ($event) => closeAll())
            })) : createCommentVNode("", true)
          ]),
          _: 1
        }),
        createVNode(Transition$1, { name: "settings" }, {
          default: withCtx(() => [
            unref(VueUI).settings ? (openBlock(), createBlock(SettingsPanel, {
              key: 0,
              class: "absolute left-0"
            })) : createCommentVNode("", true)
          ]),
          _: 1
        }),
        createVNode(_sfc_main$b, {
          onSideClick: _cache[1] || (_cache[1] = ($event) => ui.screenSelector = true)
        }),
        createVNode(Transition$1, { name: "settings" }, {
          default: withCtx(() => [
            ui.screenSelector ? (openBlock(), createBlock(ScreenSelector, {
              key: 0,
              onClose: _cache[2] || (_cache[2] = ($event) => ui.screenSelector = false)
            })) : createCommentVNode("", true)
          ]),
          _: 1
        }),
        createVNode(Transition$1, { name: "player" }, {
          default: withCtx(() => [
            unref(VueUI).miniPlayer ? (openBlock(), createBlock(MiniPlayer, {
              key: 0,
              style: { "position": "absolute", "top": "var(--top-bar-height)", "right": "80px" }
            })) : createCommentVNode("", true)
          ]),
          _: 1
        }),
        createVNode(Transition$1, { name: "list" }, {
          default: withCtx(() => [
            unref(VueUI).notification ? (openBlock(), createBlock(Notification, {
              key: 0,
              class: "absolute right-0"
            })) : createCommentVNode("", true)
          ]),
          _: 1
        }),
        ui.bpmCalculator ? (openBlock(), createBlock(BpmCalculator, {
          key: 0,
          class: "absolute",
          onClose: _cache[3] || (_cache[3] = ($event) => ui.bpmCalculator = false)
        })) : createCommentVNode("", true),
        !unref(VueUI).notification ? (openBlock(), createBlock(FloatNotification, {
          key: 1,
          class: "absolute right-0"
        })) : createCommentVNode("", true),
        createVNode(Toast, {
          class: "absolute",
          style: { "position": "absolute" }
        }),
        createVNode(DevelopTip, { class: "absolute right-0 bottom-0" }),
        createVNode(Overlay)
      ], 32);
    };
  }
});
const App_vue_vue_type_style_index_0_scoped_ee106f5a_lang = "";
const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ee106f5a"]]);
const app = createApp(App);
const buttonHoverSound = () => playSound(Sound.ButtonHover);
const buttonSelectSound = () => playSound(Sound.ButtonSelect);
app.directive("osuButton", {
  mounted(el) {
    el.addEventListener("mouseenter", buttonHoverSound);
    el.addEventListener("click", buttonSelectSound);
  },
  unmounted(el) {
    el.removeEventListener("mouseenter", buttonHoverSound);
    el.removeEventListener("click", buttonSelectSound);
  }
});
const topBarButtonHoverSound = () => playSound(Sound.DefaultHover);
const topBarButtonSelectSound = () => playSound(Sound.DefaultSelect);
app.directive("osuTopBarBtn", {
  mounted(el) {
    el.addEventListener("mouseenter", topBarButtonHoverSound);
    el.addEventListener("click", topBarButtonSelectSound);
  },
  unmounted(el) {
    el.removeEventListener("mouseenter", topBarButtonHoverSound);
    el.removeEventListener("click", topBarButtonSelectSound);
  }
});
const defaultHoverSound = () => playSound(Sound.DefaultHover);
const defaultSelectSound = () => playSound(Sound.DefaultSelect);
app.directive("osu-default", {
  mounted(el) {
    el.addEventListener("mouseenter", defaultHoverSound);
    el.addEventListener("click", defaultSelectSound);
  },
  unmounted(el) {
    el.removeEventListener("mouseenter", defaultHoverSound);
    el.removeEventListener("click", defaultSelectSound);
  }
});
app.mount("#app");
