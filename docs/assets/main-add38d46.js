var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key2, value) => key2 in obj ? __defProp(obj, key2, { enumerable: true, configurable: true, writable: true, value }) : obj[key2] = value;
var __publicField = (obj, key2, value) => {
  __defNormalProp(obj, typeof key2 !== "symbol" ? key2 + "" : key2, value);
  return value;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var _isHovered, _isDragged;
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
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
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity)
      fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy)
      fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function makeMap(str, expectsLowerCase) {
  const map = /* @__PURE__ */ Object.create(null);
  const list = str.split(",");
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? (val) => !!map[val.toLowerCase()] : (val) => !!map[val];
}
const EMPTY_OBJ = {};
const EMPTY_ARR = [];
const NOOP = () => {
};
const NO = () => false;
const onRE = /^on[^a-z]/;
const isOn = (key2) => onRE.test(key2);
const isModelListener = (key2) => key2.startsWith("onUpdate:");
const extend$1 = Object.assign;
const remove = (arr, el) => {
  const i = arr.indexOf(el);
  if (i > -1) {
    arr.splice(i, 1);
  }
};
const hasOwnProperty$2 = Object.prototype.hasOwnProperty;
const hasOwn = (val, key2) => hasOwnProperty$2.call(val, key2);
const isArray$1 = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isDate$1 = (val) => toTypeString(val) === "[object Date]";
const isFunction$1 = (val) => typeof val === "function";
const isString$2 = (val) => typeof val === "string";
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
const isPlainObject$1 = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key2) => isString$2(key2) && key2 !== "NaN" && key2[0] !== "-" && "" + parseInt(key2, 10) === key2;
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
const def = (obj, key2, value) => {
  Object.defineProperty(obj, key2, {
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
  const n = isString$2(val) ? Number(val) : NaN;
  return isNaN(n) ? val : n;
};
let _globalThis;
const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
};
function normalizeStyle(value) {
  if (isArray$1(value)) {
    const res = {};
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const normalized = isString$2(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key2 in normalized) {
          res[key2] = normalized[key2];
        }
      }
    }
    return res;
  } else if (isString$2(value)) {
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
  if (isString$2(value)) {
    res = value;
  } else if (isArray$1(value)) {
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
  let aValidType = isDate$1(a);
  let bValidType = isDate$1(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? a.getTime() === b.getTime() : false;
  }
  aValidType = isSymbol(a);
  bValidType = isSymbol(b);
  if (aValidType || bValidType) {
    return a === b;
  }
  aValidType = isArray$1(a);
  bValidType = isArray$1(b);
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
    for (const key2 in a) {
      const aHasKey = a.hasOwnProperty(key2);
      const bHasKey = b.hasOwnProperty(key2);
      if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a[key2], b[key2])) {
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
  return isString$2(val) ? val : val == null ? "" : isArray$1(val) || isObject$1(val) && (val.toString === objectToString || !isFunction$1(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (val && val.__v_isRef) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key2, val2]) => {
        entries[`${key2} =>`] = val2;
        return entries;
      }, {})
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()]
    };
  } else if (isObject$1(val) && !isArray$1(val) && !isPlainObject$1(val)) {
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
function track(target, type, key2) {
  if (shouldTrack && activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key2);
    if (!dep) {
      depsMap.set(key2, dep = createDep());
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
function trigger(target, type, key2, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let deps = [];
  if (type === "clear") {
    deps = [...depsMap.values()];
  } else if (key2 === "length" && isArray$1(target)) {
    const newLength = Number(newValue);
    depsMap.forEach((dep, key22) => {
      if (key22 === "length" || key22 >= newLength) {
        deps.push(dep);
      }
    });
  } else {
    if (key2 !== void 0) {
      deps.push(depsMap.get(key2));
    }
    switch (type) {
      case "add":
        if (!isArray$1(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if (isIntegerKey(key2)) {
          deps.push(depsMap.get("length"));
        }
        break;
      case "delete":
        if (!isArray$1(target)) {
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
  const effects = isArray$1(dep) ? dep : [...dep];
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
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key2) => key2 !== "arguments" && key2 !== "caller").map((key2) => Symbol[key2]).filter(isSymbol)
);
const get$1 = /* @__PURE__ */ createGetter();
const shallowGet = /* @__PURE__ */ createGetter(false, true);
const readonlyGet = /* @__PURE__ */ createGetter(true);
const arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
function createArrayInstrumentations() {
  const instrumentations = {};
  ["includes", "indexOf", "lastIndexOf"].forEach((key2) => {
    instrumentations[key2] = function(...args) {
      const arr = toRaw(this);
      for (let i = 0, l = this.length; i < l; i++) {
        track(arr, "get", i + "");
      }
      const res = arr[key2](...args);
      if (res === -1 || res === false) {
        return arr[key2](...args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  ["push", "pop", "shift", "unshift", "splice"].forEach((key2) => {
    instrumentations[key2] = function(...args) {
      pauseTracking();
      const res = toRaw(this)[key2].apply(this, args);
      resetTracking();
      return res;
    };
  });
  return instrumentations;
}
function hasOwnProperty$1(key2) {
  const obj = toRaw(this);
  track(obj, "has", key2);
  return obj.hasOwnProperty(key2);
}
function createGetter(isReadonly2 = false, shallow = false) {
  return function get2(target, key2, receiver) {
    if (key2 === "__v_isReactive") {
      return !isReadonly2;
    } else if (key2 === "__v_isReadonly") {
      return isReadonly2;
    } else if (key2 === "__v_isShallow") {
      return shallow;
    } else if (key2 === "__v_raw" && receiver === (isReadonly2 ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target)) {
      return target;
    }
    const targetIsArray = isArray$1(target);
    if (!isReadonly2) {
      if (targetIsArray && hasOwn(arrayInstrumentations, key2)) {
        return Reflect.get(arrayInstrumentations, key2, receiver);
      }
      if (key2 === "hasOwnProperty") {
        return hasOwnProperty$1;
      }
    }
    const res = Reflect.get(target, key2, receiver);
    if (isSymbol(key2) ? builtInSymbols.has(key2) : isNonTrackableKeys(key2)) {
      return res;
    }
    if (!isReadonly2) {
      track(target, "get", key2);
    }
    if (shallow) {
      return res;
    }
    if (isRef(res)) {
      return targetIsArray && isIntegerKey(key2) ? res : res.value;
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
  return function set2(target, key2, value, receiver) {
    let oldValue = target[key2];
    if (isReadonly(oldValue) && isRef(oldValue) && !isRef(value)) {
      return false;
    }
    if (!shallow) {
      if (!isShallow(value) && !isReadonly(value)) {
        oldValue = toRaw(oldValue);
        value = toRaw(value);
      }
      if (!isArray$1(target) && isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      }
    }
    const hadKey = isArray$1(target) && isIntegerKey(key2) ? Number(key2) < target.length : hasOwn(target, key2);
    const result = Reflect.set(target, key2, value, receiver);
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add", key2, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target, "set", key2, value);
      }
    }
    return result;
  };
}
function deleteProperty(target, key2) {
  const hadKey = hasOwn(target, key2);
  target[key2];
  const result = Reflect.deleteProperty(target, key2);
  if (result && hadKey) {
    trigger(target, "delete", key2, void 0);
  }
  return result;
}
function has$1(target, key2) {
  const result = Reflect.has(target, key2);
  if (!isSymbol(key2) || !builtInSymbols.has(key2)) {
    track(target, "has", key2);
  }
  return result;
}
function ownKeys(target) {
  track(target, "iterate", isArray$1(target) ? "length" : ITERATE_KEY);
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
  set(target, key2) {
    return true;
  },
  deleteProperty(target, key2) {
    return true;
  }
};
const shallowReactiveHandlers = /* @__PURE__ */ extend$1(
  {},
  mutableHandlers,
  {
    get: shallowGet,
    set: shallowSet
  }
);
const toShallow = (value) => value;
const getProto = (v) => Reflect.getPrototypeOf(v);
function get(target, key2, isReadonly2 = false, isShallow2 = false) {
  target = target["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key2);
  if (!isReadonly2) {
    if (key2 !== rawKey) {
      track(rawTarget, "get", key2);
    }
    track(rawTarget, "get", rawKey);
  }
  const { has: has2 } = getProto(rawTarget);
  const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
  if (has2.call(rawTarget, key2)) {
    return wrap(target.get(key2));
  } else if (has2.call(rawTarget, rawKey)) {
    return wrap(target.get(rawKey));
  } else if (target !== rawTarget) {
    target.get(key2);
  }
}
function has(key2, isReadonly2 = false) {
  const target = this["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key2);
  if (!isReadonly2) {
    if (key2 !== rawKey) {
      track(rawTarget, "has", key2);
    }
    track(rawTarget, "has", rawKey);
  }
  return key2 === rawKey ? target.has(key2) : target.has(key2) || target.has(rawKey);
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
function set(key2, value) {
  value = toRaw(value);
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key2);
  if (!hadKey) {
    key2 = toRaw(key2);
    hadKey = has2.call(target, key2);
  }
  const oldValue = get2.call(target, key2);
  target.set(key2, value);
  if (!hadKey) {
    trigger(target, "add", key2, value);
  } else if (hasChanged(value, oldValue)) {
    trigger(target, "set", key2, value);
  }
  return this;
}
function deleteEntry(key2) {
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key2);
  if (!hadKey) {
    key2 = toRaw(key2);
    hadKey = has2.call(target, key2);
  }
  get2 ? get2.call(target, key2) : void 0;
  const result = target.delete(key2);
  if (hadKey) {
    trigger(target, "delete", key2, void 0);
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
  return function forEach2(callback, thisArg) {
    const observed = this;
    const target = observed["__v_raw"];
    const rawTarget = toRaw(target);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
    return target.forEach((value, key2) => {
      return callback.call(thisArg, wrap(value), wrap(key2), observed);
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
    get(key2) {
      return get(this, key2);
    },
    get size() {
      return size(this);
    },
    has,
    add,
    set,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
  };
  const shallowInstrumentations2 = {
    get(key2) {
      return get(this, key2, false, true);
    },
    get size() {
      return size(this);
    },
    has,
    add,
    set,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
  };
  const readonlyInstrumentations2 = {
    get(key2) {
      return get(this, key2, true);
    },
    get size() {
      return size(this, true);
    },
    has(key2) {
      return has.call(this, key2, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, false)
  };
  const shallowReadonlyInstrumentations2 = {
    get(key2) {
      return get(this, key2, true, true);
    },
    get size() {
      return size(this, true);
    },
    has(key2) {
      return has.call(this, key2, true);
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
  return (target, key2, receiver) => {
    if (key2 === "__v_isReactive") {
      return !isReadonly2;
    } else if (key2 === "__v_isReadonly") {
      return isReadonly2;
    } else if (key2 === "__v_raw") {
      return target;
    }
    return Reflect.get(
      hasOwn(instrumentations, key2) && key2 in target ? instrumentations : target,
      key2,
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
function unref(ref2) {
  return isRef(ref2) ? ref2.value : ref2;
}
const shallowUnwrapHandlers = {
  get: (target, key2, receiver) => unref(Reflect.get(target, key2, receiver)),
  set: (target, key2, value, receiver) => {
    const oldValue = target[key2];
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value;
      return true;
    } else {
      return Reflect.set(target, key2, value, receiver);
    }
  }
};
function proxyRefs(objectWithRefs) {
  return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
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
  if (!isArray$1(cb)) {
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
    const { number, trim: trim2 } = props[modifiersKey] || EMPTY_OBJ;
    if (trim2) {
      args = rawArgs.map((a) => isString$2(a) ? a.trim() : a);
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
        extend$1(normalized, normalizedFromExtend);
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
  if (isArray$1(raw)) {
    raw.forEach((key2) => normalized[key2] = null);
  } else {
    extend$1(normalized, raw);
  }
  if (isObject$1(comp)) {
    cache.set(comp, normalized);
  }
  return normalized;
}
function isEmitListener(options, key2) {
  if (!options || !isOn(key2)) {
    return false;
  }
  key2 = key2.slice(2).replace(/Once$/, "");
  return hasOwn(options, key2[0].toLowerCase() + key2.slice(1)) || hasOwn(options, hyphenate(key2)) || hasOwn(options, key2);
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
    render,
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
        render.call(
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
      const render2 = Component;
      if (false)
        ;
      result = normalizeVNode(
        render2.length > 1 ? render2(
          props,
          false ? {
            get attrs() {
              markAttrsAccessed();
              return attrs;
            },
            slots,
            emit: emit2
          } : { attrs, slots, emit: emit2 }
        ) : render2(
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
  for (const key2 in attrs) {
    if (key2 === "class" || key2 === "style" || isOn(key2)) {
      (res || (res = {}))[key2] = attrs[key2];
    }
  }
  return res;
};
const filterModelListeners = (attrs, props) => {
  const res = {};
  for (const key2 in attrs) {
    if (!isModelListener(key2) || !(key2.slice(9) in props)) {
      res[key2] = attrs[key2];
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
        const key2 = dynamicProps[i];
        if (nextProps[key2] !== prevProps[key2] && !isEmitListener(emits, key2)) {
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
    const key2 = nextKeys[i];
    if (nextProps[key2] !== prevProps[key2] && !isEmitListener(emitsOptions, key2)) {
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
    if (isArray$1(fn)) {
      suspense.effects.push(...fn);
    } else {
      suspense.effects.push(fn);
    }
  } else {
    queuePostFlushCb(fn);
  }
}
const INITIAL_WATCHER_VALUE = {};
function watch(source, cb, options) {
  return doWatch(source, cb, options);
}
function doWatch(source, cb, { immediate, deep, flush, onTrack, onTrigger } = EMPTY_OBJ) {
  var _a;
  const instance = getCurrentScope() === ((_a = currentInstance) == null ? void 0 : _a.scope) ? currentInstance : null;
  let getter;
  let forceTrigger = false;
  let isMultiSource = false;
  if (isRef(source)) {
    getter = () => source.value;
    forceTrigger = isShallow(source);
  } else if (isReactive(source)) {
    getter = () => source;
    deep = true;
  } else if (isArray$1(source)) {
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
  const getter = isString$2(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
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
  } else if (isArray$1(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], seen);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v) => {
      traverse(v, seen);
    });
  } else if (isPlainObject$1(value)) {
    for (const key2 in value) {
      traverse(value[key2], seen);
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
        const key2 = getTransitionKey();
        if (prevTransitionKey === void 0) {
          prevTransitionKey = key2;
        } else if (key2 !== prevTransitionKey) {
          prevTransitionKey = key2;
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
  const key2 = String(vnode.key);
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
    if (isArray$1(hook)) {
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
      const leavingVNode = leavingVNodesCache[key2];
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
      const key22 = String(vnode.key);
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
        if (leavingVNodesCache[key22] === vnode) {
          delete leavingVNodesCache[key22];
        }
      };
      leavingVNodesCache[key22] = vnode;
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
    const key2 = parentKey == null ? child.key : String(parentKey) + String(child.key != null ? child.key : i);
    if (child.type === Fragment) {
      if (child.patchFlag & 128)
        keyedFragmentCount++;
      ret = ret.concat(
        getTransitionRawChildren(child.children, keepComment, key2)
      );
    } else if (keepComment || child.type !== Comment) {
      ret.push(key2 != null ? cloneVNode(child, { key: key2 }) : child);
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
    /* @__PURE__ */ (() => extend$1({ name: options.name }, extraOptions, { setup: options }))()
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
const NULL_DYNAMIC_COMPONENT = Symbol.for("v-ndc");
function renderList(source, renderItem, cache, index) {
  let ret;
  const cached = cache && cache[index];
  if (isArray$1(source) || isString$2(source)) {
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
        const key2 = keys[i];
        ret[i] = renderItem(source[key2], key2, i, cached && cached[i]);
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
  /* @__PURE__ */ extend$1(/* @__PURE__ */ Object.create(null), {
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
const hasSetupBinding = (state, key2) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key2);
const PublicInstanceProxyHandlers = {
  get({ _: instance }, key2) {
    const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
    let normalizedProps;
    if (key2[0] !== "$") {
      const n = accessCache[key2];
      if (n !== void 0) {
        switch (n) {
          case 1:
            return setupState[key2];
          case 2:
            return data[key2];
          case 4:
            return ctx[key2];
          case 3:
            return props[key2];
        }
      } else if (hasSetupBinding(setupState, key2)) {
        accessCache[key2] = 1;
        return setupState[key2];
      } else if (data !== EMPTY_OBJ && hasOwn(data, key2)) {
        accessCache[key2] = 2;
        return data[key2];
      } else if (
        // only cache other properties when instance has declared (thus stable)
        // props
        (normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key2)
      ) {
        accessCache[key2] = 3;
        return props[key2];
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key2)) {
        accessCache[key2] = 4;
        return ctx[key2];
      } else if (shouldCacheAccess) {
        accessCache[key2] = 0;
      }
    }
    const publicGetter = publicPropertiesMap[key2];
    let cssModule, globalProperties;
    if (publicGetter) {
      if (key2 === "$attrs") {
        track(instance, "get", key2);
      }
      return publicGetter(instance);
    } else if (
      // css module (injected by vue-loader)
      (cssModule = type.__cssModules) && (cssModule = cssModule[key2])
    ) {
      return cssModule;
    } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key2)) {
      accessCache[key2] = 4;
      return ctx[key2];
    } else if (
      // global properties
      globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key2)
    ) {
      {
        return globalProperties[key2];
      }
    } else
      ;
  },
  set({ _: instance }, key2, value) {
    const { data, setupState, ctx } = instance;
    if (hasSetupBinding(setupState, key2)) {
      setupState[key2] = value;
      return true;
    } else if (data !== EMPTY_OBJ && hasOwn(data, key2)) {
      data[key2] = value;
      return true;
    } else if (hasOwn(instance.props, key2)) {
      return false;
    }
    if (key2[0] === "$" && key2.slice(1) in instance) {
      return false;
    } else {
      {
        ctx[key2] = value;
      }
    }
    return true;
  },
  has({
    _: { data, setupState, accessCache, ctx, appContext, propsOptions }
  }, key2) {
    let normalizedProps;
    return !!accessCache[key2] || data !== EMPTY_OBJ && hasOwn(data, key2) || hasSetupBinding(setupState, key2) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key2) || hasOwn(ctx, key2) || hasOwn(publicPropertiesMap, key2) || hasOwn(appContext.config.globalProperties, key2);
  },
  defineProperty(target, key2, descriptor) {
    if (descriptor.get != null) {
      target._.accessCache[key2] = 0;
    } else if (hasOwn(descriptor, "value")) {
      this.set(target, key2, descriptor.value, null);
    }
    return Reflect.defineProperty(target, key2, descriptor);
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
  return isArray$1(props) ? props.reduce(
    (normalized, p2) => (normalized[p2] = null, normalized),
    {}
  ) : props;
}
function mergeModels(a, b) {
  if (!a || !b)
    return a || b;
  if (isArray$1(a) && isArray$1(b))
    return a.concat(b);
  return extend$1({}, normalizePropsOrEmits(a), normalizePropsOrEmits(b));
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
    render,
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
    for (const key2 in methods) {
      const methodHandler = methods[key2];
      if (isFunction$1(methodHandler)) {
        {
          ctx[key2] = methodHandler.bind(publicThis);
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
    for (const key2 in computedOptions) {
      const opt = computedOptions[key2];
      const get2 = isFunction$1(opt) ? opt.bind(publicThis, publicThis) : isFunction$1(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
      const set2 = !isFunction$1(opt) && isFunction$1(opt.set) ? opt.set.bind(publicThis) : NOOP;
      const c = computed({
        get: get2,
        set: set2
      });
      Object.defineProperty(ctx, key2, {
        enumerable: true,
        configurable: true,
        get: () => c.value,
        set: (v) => c.value = v
      });
    }
  }
  if (watchOptions) {
    for (const key2 in watchOptions) {
      createWatcher(watchOptions[key2], ctx, publicThis, key2);
    }
  }
  if (provideOptions) {
    const provides = isFunction$1(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
    Reflect.ownKeys(provides).forEach((key2) => {
      provide$1(key2, provides[key2]);
    });
  }
  if (created) {
    callHook$1(created, instance, "c");
  }
  function registerLifecycleHook(register, hook) {
    if (isArray$1(hook)) {
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
  if (isArray$1(expose)) {
    if (expose.length) {
      const exposed = instance.exposed || (instance.exposed = {});
      expose.forEach((key2) => {
        Object.defineProperty(exposed, key2, {
          get: () => publicThis[key2],
          set: (val) => publicThis[key2] = val
        });
      });
    } else if (!instance.exposed) {
      instance.exposed = {};
    }
  }
  if (render && instance.render === NOOP) {
    instance.render = render;
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
  if (isArray$1(injectOptions)) {
    injectOptions = normalizeInject(injectOptions);
  }
  for (const key2 in injectOptions) {
    const opt = injectOptions[key2];
    let injected;
    if (isObject$1(opt)) {
      if ("default" in opt) {
        injected = inject$1(
          opt.from || key2,
          opt.default,
          true
          /* treat default function as factory */
        );
      } else {
        injected = inject$1(opt.from || key2);
      }
    } else {
      injected = inject$1(opt);
    }
    if (isRef(injected)) {
      Object.defineProperty(ctx, key2, {
        enumerable: true,
        configurable: true,
        get: () => injected.value,
        set: (v) => injected.value = v
      });
    } else {
      ctx[key2] = injected;
    }
  }
}
function callHook$1(hook, instance, type) {
  callWithAsyncErrorHandling(
    isArray$1(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy),
    instance,
    type
  );
}
function createWatcher(raw, ctx, publicThis, key2) {
  const getter = key2.includes(".") ? createPathGetter(publicThis, key2) : () => publicThis[key2];
  if (isString$2(raw)) {
    const handler = ctx[raw];
    if (isFunction$1(handler)) {
      watch(getter, handler);
    }
  } else if (isFunction$1(raw)) {
    watch(getter, raw.bind(publicThis));
  } else if (isObject$1(raw)) {
    if (isArray$1(raw)) {
      raw.forEach((r) => createWatcher(r, ctx, publicThis, key2));
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
  const base = instance.type;
  const { mixins, extends: extendsOptions } = base;
  const {
    mixins: globalMixins,
    optionsCache: cache,
    config: { optionMergeStrategies }
  } = instance.appContext;
  const cached = cache.get(base);
  let resolved;
  if (cached) {
    resolved = cached;
  } else if (!globalMixins.length && !mixins && !extendsOptions) {
    {
      resolved = base;
    }
  } else {
    resolved = {};
    if (globalMixins.length) {
      globalMixins.forEach(
        (m) => mergeOptions(resolved, m, optionMergeStrategies, true)
      );
    }
    mergeOptions(resolved, base, optionMergeStrategies);
  }
  if (isObject$1(base)) {
    cache.set(base, resolved);
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
  for (const key2 in from) {
    if (asMixin && key2 === "expose")
      ;
    else {
      const strat = internalOptionMergeStrats[key2] || strats && strats[key2];
      to[key2] = strat ? strat(to[key2], from[key2]) : from[key2];
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
    return extend$1(
      isFunction$1(to) ? to.call(this, this) : to,
      isFunction$1(from) ? from.call(this, this) : from
    );
  };
}
function mergeInject(to, from) {
  return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
  if (isArray$1(raw)) {
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
  return to ? extend$1(/* @__PURE__ */ Object.create(null), to, from) : from;
}
function mergeEmitsOrPropsOptions(to, from) {
  if (to) {
    if (isArray$1(to) && isArray$1(from)) {
      return [.../* @__PURE__ */ new Set([...to, ...from])];
    }
    return extend$1(
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
  const merged = extend$1(/* @__PURE__ */ Object.create(null), to);
  for (const key2 in from) {
    merged[key2] = mergeAsArray(to[key2], from[key2]);
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
function createAppAPI(render, hydrate) {
  return function createApp2(rootComponent, rootProps = null) {
    if (!isFunction$1(rootComponent)) {
      rootComponent = extend$1({}, rootComponent);
    }
    if (rootProps != null && !isObject$1(rootProps)) {
      rootProps = null;
    }
    const context = createAppContext();
    const installedPlugins = /* @__PURE__ */ new Set();
    let isMounted = false;
    const app = context.app = {
      _uid: uid$1++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      _context: context,
      _instance: null,
      version,
      get config() {
        return context.config;
      },
      set config(v) {
      },
      use(plugin, ...options) {
        if (installedPlugins.has(plugin))
          ;
        else if (plugin && isFunction$1(plugin.install)) {
          installedPlugins.add(plugin);
          plugin.install(app, ...options);
        } else if (isFunction$1(plugin)) {
          installedPlugins.add(plugin);
          plugin(app, ...options);
        } else
          ;
        return app;
      },
      mixin(mixin) {
        {
          if (!context.mixins.includes(mixin)) {
            context.mixins.push(mixin);
          }
        }
        return app;
      },
      component(name, component) {
        if (!component) {
          return context.components[name];
        }
        context.components[name] = component;
        return app;
      },
      directive(name, directive) {
        if (!directive) {
          return context.directives[name];
        }
        context.directives[name] = directive;
        return app;
      },
      mount(rootContainer, isHydrate, isSVG) {
        if (!isMounted) {
          const vnode = createVNode(
            rootComponent,
            rootProps
          );
          vnode.appContext = context;
          if (isHydrate && hydrate) {
            hydrate(vnode, rootContainer);
          } else {
            render(vnode, rootContainer, isSVG);
          }
          isMounted = true;
          app._container = rootContainer;
          rootContainer.__vue_app__ = app;
          return getExposeProxy(vnode.component) || vnode.component.proxy;
        }
      },
      unmount() {
        if (isMounted) {
          render(null, app._container);
          delete app._container.__vue_app__;
        }
      },
      provide(key2, value) {
        context.provides[key2] = value;
        return app;
      },
      runWithContext(fn) {
        currentApp = app;
        try {
          return fn();
        } finally {
          currentApp = null;
        }
      }
    };
    return app;
  };
}
let currentApp = null;
function provide$1(key2, value) {
  if (!currentInstance)
    ;
  else {
    let provides = currentInstance.provides;
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key2] = value;
  }
}
function inject$1(key2, defaultValue, treatDefaultAsFactory = false) {
  const instance = currentInstance || currentRenderingInstance;
  if (instance || currentApp) {
    const provides = instance ? instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : currentApp._context.provides;
    if (provides && key2 in provides) {
      return provides[key2];
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
  for (const key2 in instance.propsOptions[0]) {
    if (!(key2 in props)) {
      props[key2] = void 0;
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
        let key2 = propsToUpdate[i];
        if (isEmitListener(instance.emitsOptions, key2)) {
          continue;
        }
        const value = rawProps[key2];
        if (options) {
          if (hasOwn(attrs, key2)) {
            if (value !== attrs[key2]) {
              attrs[key2] = value;
              hasAttrsChanged = true;
            }
          } else {
            const camelizedKey = camelize(key2);
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
          if (value !== attrs[key2]) {
            attrs[key2] = value;
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
    for (const key2 in rawCurrentProps) {
      if (!rawProps || // for camelCase
      !hasOwn(rawProps, key2) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((kebabKey = hyphenate(key2)) === key2 || !hasOwn(rawProps, kebabKey))) {
        if (options) {
          if (rawPrevProps && // for camelCase
          (rawPrevProps[key2] !== void 0 || // for kebab-case
          rawPrevProps[kebabKey] !== void 0)) {
            props[key2] = resolvePropValue(
              options,
              rawCurrentProps,
              key2,
              void 0,
              instance,
              true
              /* isAbsent */
            );
          }
        } else {
          delete props[key2];
        }
      }
    }
    if (attrs !== rawCurrentProps) {
      for (const key2 in attrs) {
        if (!rawProps || !hasOwn(rawProps, key2) && true) {
          delete attrs[key2];
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
    for (let key2 in rawProps) {
      if (isReservedProp(key2)) {
        continue;
      }
      const value = rawProps[key2];
      let camelKey;
      if (options && hasOwn(options, camelKey = camelize(key2))) {
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          props[camelKey] = value;
        } else {
          (rawCastValues || (rawCastValues = {}))[camelKey] = value;
        }
      } else if (!isEmitListener(instance.emitsOptions, key2)) {
        if (!(key2 in attrs) || value !== attrs[key2]) {
          attrs[key2] = value;
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (needCastKeys) {
    const rawCurrentProps = toRaw(props);
    const castValues = rawCastValues || EMPTY_OBJ;
    for (let i = 0; i < needCastKeys.length; i++) {
      const key2 = needCastKeys[i];
      props[key2] = resolvePropValue(
        options,
        rawCurrentProps,
        key2,
        castValues[key2],
        instance,
        !hasOwn(castValues, key2)
      );
    }
  }
  return hasAttrsChanged;
}
function resolvePropValue(options, props, key2, value, instance, isAbsent) {
  const opt = options[key2];
  if (opt != null) {
    const hasDefault = hasOwn(opt, "default");
    if (hasDefault && value === void 0) {
      const defaultValue = opt.default;
      if (opt.type !== Function && !opt.skipFactory && isFunction$1(defaultValue)) {
        const { propsDefaults } = instance;
        if (key2 in propsDefaults) {
          value = propsDefaults[key2];
        } else {
          setCurrentInstance(instance);
          value = propsDefaults[key2] = defaultValue.call(
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
      ] && (value === "" || value === hyphenate(key2))) {
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
      extend$1(normalized, props);
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
  if (isArray$1(raw)) {
    for (let i = 0; i < raw.length; i++) {
      const normalizedKey = camelize(raw[i]);
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ;
      }
    }
  } else if (raw) {
    for (const key2 in raw) {
      const normalizedKey = camelize(key2);
      if (validatePropName(normalizedKey)) {
        const opt = raw[key2];
        const prop = normalized[normalizedKey] = isArray$1(opt) || isFunction$1(opt) ? { type: opt } : extend$1({}, opt);
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
function validatePropName(key2) {
  if (key2[0] !== "$") {
    return true;
  }
  return false;
}
function getType(ctor) {
  const match = ctor && ctor.toString().match(/^\s*(function|class) (\w+)/);
  return match ? match[2] : ctor === null ? "null" : "";
}
function isSameType(a, b) {
  return getType(a) === getType(b);
}
function getTypeIndex(type, expectedTypes) {
  if (isArray$1(expectedTypes)) {
    return expectedTypes.findIndex((t) => isSameType(t, type));
  } else if (isFunction$1(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1;
  }
  return -1;
}
const isInternalKey = (key2) => key2[0] === "_" || key2 === "$stable";
const normalizeSlotValue = (value) => isArray$1(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
const normalizeSlot = (key2, rawSlot, ctx) => {
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
  for (const key2 in rawSlots) {
    if (isInternalKey(key2))
      continue;
    const value = rawSlots[key2];
    if (isFunction$1(value)) {
      slots[key2] = normalizeSlot(key2, value, ctx);
    } else if (value != null) {
      const normalized = normalizeSlotValue(value);
      slots[key2] = () => normalized;
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
        extend$1(slots, children);
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
    for (const key2 in slots) {
      if (!isInternalKey(key2) && !(key2 in deletionComparisonTarget)) {
        delete slots[key2];
      }
    }
  }
};
function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
  if (isArray$1(rawRef)) {
    rawRef.forEach(
      (r, i) => setRef(
        r,
        oldRawRef && (isArray$1(oldRawRef) ? oldRawRef[i] : oldRawRef),
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
    if (isString$2(oldRef)) {
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
    const _isString = isString$2(ref2);
    const _isRef = isRef(ref2);
    if (_isString || _isRef) {
      const doSet = () => {
        if (rawRef.f) {
          const existing = _isString ? hasOwn(setupState, ref2) ? setupState[ref2] : refs[ref2] : ref2.value;
          if (isUnmount) {
            isArray$1(existing) && remove(existing, refValue);
          } else {
            if (!isArray$1(existing)) {
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
      for (const key2 in props) {
        if (key2 !== "value" && !isReservedProp(key2)) {
          hostPatchProp(
            el,
            key2,
            null,
            props[key2],
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
            const key2 = propsToUpdate[i];
            const prev = oldProps[key2];
            const next = newProps[key2];
            if (next !== prev || key2 === "value") {
              hostPatchProp(
                el,
                key2,
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
        for (const key2 in oldProps) {
          if (!isReservedProp(key2) && !(key2 in newProps)) {
            hostPatchProp(
              el,
              key2,
              oldProps[key2],
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
      for (const key2 in newProps) {
        if (isReservedProp(key2))
          continue;
        const next = newProps[key2];
        const prev = oldProps[key2];
        if (next !== prev && key2 !== "value") {
          hostPatchProp(
            el,
            key2,
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
  const render = (vnode, container, isSVG) => {
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
    render,
    hydrate,
    createApp: createAppAPI(render, hydrate)
  };
}
function toggleRecurse({ effect, update }, allowed) {
  effect.allowRecurse = update.allowRecurse = allowed;
}
function traverseStaticChildren(n1, n2, shallow = false) {
  const ch1 = n1.children;
  const ch2 = n2.children;
  if (isArray$1(ch1) && isArray$1(ch2)) {
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
const normalizeKey = ({ key: key2 }) => key2 != null ? key2 : null;
const normalizeRef = ({
  ref: ref2,
  ref_key,
  ref_for
}) => {
  if (typeof ref2 === "number") {
    ref2 = "" + ref2;
  }
  return ref2 != null ? isString$2(ref2) || isRef(ref2) || isFunction$1(ref2) ? { i: currentRenderingInstance, r: ref2, k: ref_key, f: !!ref_for } : ref2 : null;
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
    vnode.shapeFlag |= isString$2(children) ? 8 : 16;
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
    if (klass && !isString$2(klass)) {
      props.class = normalizeClass(klass);
    }
    if (isObject$1(style2)) {
      if (isProxy(style2) && !isArray$1(style2)) {
        style2 = extend$1({}, style2);
      }
      props.style = normalizeStyle(style2);
    }
  }
  const shapeFlag = isString$2(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject$1(type) ? 4 : isFunction$1(type) ? 2 : 0;
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
  return isProxy(props) || InternalObjectKey in props ? extend$1({}, props) : props;
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
      mergeRef && ref2 ? isArray$1(ref2) ? ref2.concat(normalizeRef(extraProps)) : [ref2, normalizeRef(extraProps)] : normalizeRef(extraProps)
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
  } else if (isArray$1(child)) {
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
  } else if (isArray$1(children)) {
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
    for (const key2 in toMerge) {
      if (key2 === "class") {
        if (ret.class !== toMerge.class) {
          ret.class = normalizeClass([ret.class, toMerge.class]);
        }
      } else if (key2 === "style") {
        ret.style = normalizeStyle([ret.style, toMerge.style]);
      } else if (isOn(key2)) {
        const existing = ret[key2];
        const incoming = toMerge[key2];
        if (incoming && existing !== incoming && !(isArray$1(existing) && existing.includes(incoming))) {
          ret[key2] = existing ? [].concat(existing, incoming) : incoming;
        }
      } else if (key2 !== "") {
        ret[key2] = toMerge[key2];
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
let compile;
function finishComponentSetup(instance, isSSR, skipOptions) {
  const Component = instance.type;
  if (!instance.render) {
    if (!isSSR && compile && !Component.render) {
      const template = Component.template || resolveMergedOptions(instance).template;
      if (template) {
        const { isCustomElement, compilerOptions } = instance.appContext.config;
        const { delimiters, compilerOptions: componentCompilerOptions } = Component;
        const finalCompilerOptions = extend$1(
          extend$1(
            {
              isCustomElement,
              delimiters
            },
            compilerOptions
          ),
          componentCompilerOptions
        );
        Component.render = compile(template, finalCompilerOptions);
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
      get(target, key2) {
        track(instance, "get", "$attrs");
        return target[key2];
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
      get(target, key2) {
        if (key2 in target) {
          return target[key2];
        } else if (key2 in publicPropertiesMap) {
          return publicPropertiesMap[key2](instance);
        }
      },
      has(target, key2) {
        return key2 in target || key2 in publicPropertiesMap;
      }
    }));
  }
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
    if (isObject$1(propsOrChildren) && !isArray$1(propsOrChildren)) {
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
  const isCssString = isString$2(next);
  if (next && !isCssString) {
    if (prev && !isString$2(prev)) {
      for (const key2 in prev) {
        if (next[key2] == null) {
          setStyle(style2, key2, "");
        }
      }
    }
    for (const key2 in next) {
      setStyle(style2, key2, next[key2]);
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
  if (isArray$1(val)) {
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
function patchAttr(el, key2, value, isSVG, instance) {
  if (isSVG && key2.startsWith("xlink:")) {
    if (value == null) {
      el.removeAttributeNS(xlinkNS, key2.slice(6, key2.length));
    } else {
      el.setAttributeNS(xlinkNS, key2, value);
    }
  } else {
    const isBoolean2 = isSpecialBooleanAttr(key2);
    if (value == null || isBoolean2 && !includeBooleanAttr(value)) {
      el.removeAttribute(key2);
    } else {
      el.setAttribute(key2, isBoolean2 ? "" : value);
    }
  }
}
function patchDOMProp(el, key2, value, prevChildren, parentComponent, parentSuspense, unmountChildren) {
  if (key2 === "innerHTML" || key2 === "textContent") {
    if (prevChildren) {
      unmountChildren(prevChildren, parentComponent, parentSuspense);
    }
    el[key2] = value == null ? "" : value;
    return;
  }
  const tag = el.tagName;
  if (key2 === "value" && tag !== "PROGRESS" && // custom elements may use _value internally
  !tag.includes("-")) {
    el._value = value;
    const oldValue = tag === "OPTION" ? el.getAttribute("value") : el.value;
    const newValue = value == null ? "" : value;
    if (oldValue !== newValue) {
      el.value = newValue;
    }
    if (value == null) {
      el.removeAttribute(key2);
    }
    return;
  }
  let needRemove = false;
  if (value === "" || value == null) {
    const type = typeof el[key2];
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
    el[key2] = value;
  } catch (e) {
  }
  needRemove && el.removeAttribute(key2);
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
  if (isArray$1(value)) {
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
const patchProp = (el, key2, prevValue, nextValue, isSVG = false, prevChildren, parentComponent, parentSuspense, unmountChildren) => {
  if (key2 === "class") {
    patchClass(el, nextValue, isSVG);
  } else if (key2 === "style") {
    patchStyle(el, prevValue, nextValue);
  } else if (isOn(key2)) {
    if (!isModelListener(key2)) {
      patchEvent(el, key2, prevValue, nextValue, parentComponent);
    }
  } else if (key2[0] === "." ? (key2 = key2.slice(1), true) : key2[0] === "^" ? (key2 = key2.slice(1), false) : shouldSetAsProp(el, key2, nextValue, isSVG)) {
    patchDOMProp(
      el,
      key2,
      nextValue,
      prevChildren,
      parentComponent,
      parentSuspense,
      unmountChildren
    );
  } else {
    if (key2 === "true-value") {
      el._trueValue = nextValue;
    } else if (key2 === "false-value") {
      el._falseValue = nextValue;
    }
    patchAttr(el, key2, nextValue, isSVG);
  }
};
function shouldSetAsProp(el, key2, value, isSVG) {
  if (isSVG) {
    if (key2 === "innerHTML" || key2 === "textContent") {
      return true;
    }
    if (key2 in el && nativeOnRE.test(key2) && isFunction$1(value)) {
      return true;
    }
    return false;
  }
  if (key2 === "spellcheck" || key2 === "draggable" || key2 === "translate") {
    return false;
  }
  if (key2 === "form") {
    return false;
  }
  if (key2 === "list" && el.tagName === "INPUT") {
    return false;
  }
  if (key2 === "type" && el.tagName === "TEXTAREA") {
    return false;
  }
  if (nativeOnRE.test(key2) && isString$2(value)) {
    return false;
  }
  return key2 in el;
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
Transition$1.props = /* @__PURE__ */ extend$1(
  {},
  BaseTransitionPropsValidators,
  DOMTransitionPropsValidators
);
const callHook = (hook, args = []) => {
  if (isArray$1(hook)) {
    hook.forEach((h2) => h2(...args));
  } else if (hook) {
    hook(...args);
  }
};
const hasExplicitCallback = (hook) => {
  return hook ? isArray$1(hook) ? hook.some((h2) => h2.length > 1) : hook.length > 1 : false;
};
function resolveTransitionProps(rawProps) {
  const baseProps = {};
  for (const key2 in rawProps) {
    if (!(key2 in DOMTransitionPropsValidators)) {
      baseProps[key2] = rawProps[key2];
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
  return extend$1(baseProps, {
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
  const getStyleProperties = (key2) => (styles[key2] || "").split(", ");
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
const getModelAssigner = (vnode) => {
  const fn = vnode.props["onUpdate:modelValue"] || false;
  return isArray$1(fn) ? (value) => invokeArrayFns(fn, value) : fn;
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
      const assign = el._assign;
      if (isArray$1(modelValue)) {
        const index = looseIndexOf(modelValue, elementValue);
        const found = index !== -1;
        if (checked && !found) {
          assign(modelValue.concat(elementValue));
        } else if (!checked && found) {
          const filtered = [...modelValue];
          filtered.splice(index, 1);
          assign(filtered);
        }
      } else if (isSet(modelValue)) {
        const cloned = new Set(modelValue);
        if (checked) {
          cloned.add(elementValue);
        } else {
          cloned.delete(elementValue);
        }
        assign(cloned);
      } else {
        assign(getCheckboxValue(el, checked));
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
  if (isArray$1(value)) {
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
  const key2 = checked ? "_trueValue" : "_falseValue";
  return key2 in el ? el[key2] : checked;
}
const vShow = {
  beforeMount(el, { value }, { transition }) {
    el._vod = el.style.display === "none" ? "" : el.style.display;
    if (transition && value) {
      transition.beforeEnter(el);
    } else {
      setDisplay(el, value);
    }
  },
  mounted(el, { value }, { transition }) {
    if (transition && value) {
      transition.enter(el);
    }
  },
  updated(el, { value, oldValue }, { transition }) {
    if (!value === !oldValue)
      return;
    if (transition) {
      if (value) {
        transition.beforeEnter(el);
        setDisplay(el, true);
        transition.enter(el);
      } else {
        transition.leave(el, () => {
          setDisplay(el, false);
        });
      }
    } else {
      setDisplay(el, value);
    }
  },
  beforeUnmount(el, { value }) {
    setDisplay(el, value);
  }
};
function setDisplay(el, value) {
  el.style.display = value ? el._vod : "none";
}
const rendererOptions = /* @__PURE__ */ extend$1({ patchProp }, nodeOps);
let renderer;
function ensureRenderer() {
  return renderer || (renderer = createRenderer(rendererOptions));
}
const createApp = (...args) => {
  const app = ensureRenderer().createApp(...args);
  const { mount } = app;
  app.mount = (containerOrSelector) => {
    const container = normalizeContainer(containerOrSelector);
    if (!container)
      return;
    const component = app._component;
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
  return app;
};
function normalizeContainer(container) {
  if (isString$2(container)) {
    const res = document.querySelector(container);
    return res;
  }
  return container;
}
const style = "";
const materialIcons = "";
const _sfc_main$j = /* @__PURE__ */ defineComponent({
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
  for (const [key2, val] of props) {
    target[key2] = val;
  }
  return target;
};
const Row = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["__scopeId", "data-v-98094a68"]]);
const _sfc_main$i = /* @__PURE__ */ defineComponent({
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
const Column = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["__scopeId", "data-v-5a6a4ea8"]]);
var Icon = /* @__PURE__ */ ((Icon2) => {
  Icon2["ThreeDRotation"] = "";
  Icon2["AcUnit"] = "";
  Icon2["AccessAlarm"] = "";
  Icon2["AccessAlarms"] = "";
  Icon2["AccessTime"] = "";
  Icon2["Accessibility"] = "";
  Icon2["Accessible"] = "";
  Icon2["AccountBalance"] = "";
  Icon2["AccountBalanceWallet"] = "";
  Icon2["AccountBox"] = "";
  Icon2["AccountCircle"] = "";
  Icon2["Adb"] = "";
  Icon2["Add"] = "";
  Icon2["AddAPhoto"] = "";
  Icon2["AddAlarm"] = "";
  Icon2["AddAlert"] = "";
  Icon2["AddBox"] = "";
  Icon2["AddCircle"] = "";
  Icon2["AddCircleOutline"] = "";
  Icon2["AddLocation"] = "";
  Icon2["AddShoppingCart"] = "";
  Icon2["AddToPhotos"] = "";
  Icon2["AddToQueue"] = "";
  Icon2["Adjust"] = "";
  Icon2["AirlineSeatFlat"] = "";
  Icon2["AirlineSeatFlatAngled"] = "";
  Icon2["AirlineSeatIndividualSuite"] = "";
  Icon2["AirlineSeatLegroomExtra"] = "";
  Icon2["AirlineSeatLegroomNormal"] = "";
  Icon2["AirlineSeatLegroomReduced"] = "";
  Icon2["AirlineSeatReclineExtra"] = "";
  Icon2["AirlineSeatReclineNormal"] = "";
  Icon2["AirplanemodeActive"] = "";
  Icon2["AirplanemodeInactive"] = "";
  Icon2["Airplay"] = "";
  Icon2["AirportShuttle"] = "";
  Icon2["Alarm"] = "";
  Icon2["AlarmAdd"] = "";
  Icon2["AlarmOff"] = "";
  Icon2["AlarmOn"] = "";
  Icon2["Album"] = "";
  Icon2["AllInclusive"] = "";
  Icon2["AllOut"] = "";
  Icon2["Android"] = "";
  Icon2["Announcement"] = "";
  Icon2["Apps"] = "";
  Icon2["Archive"] = "";
  Icon2["ArrowBack"] = "";
  Icon2["ArrowDownward"] = "";
  Icon2["ArrowDropDown"] = "";
  Icon2["ArrowDropDownCircle"] = "";
  Icon2["ArrowDropUp"] = "";
  Icon2["ArrowForward"] = "";
  Icon2["ArrowUpward"] = "";
  Icon2["ArtTrack"] = "";
  Icon2["AspectRatio"] = "";
  Icon2["Assessment"] = "";
  Icon2["Assignment"] = "";
  Icon2["AssignmentInd"] = "";
  Icon2["AssignmentLate"] = "";
  Icon2["AssignmentReturn"] = "";
  Icon2["AssignmentReturned"] = "";
  Icon2["AssignmentTurnedIn"] = "";
  Icon2["Assistant"] = "";
  Icon2["AssistantPhoto"] = "";
  Icon2["AttachFile"] = "";
  Icon2["AttachMoney"] = "";
  Icon2["Attachment"] = "";
  Icon2["Audiotrack"] = "";
  Icon2["Autorenew"] = "";
  Icon2["AvTimer"] = "";
  Icon2["Backspace"] = "";
  Icon2["Backup"] = "";
  Icon2["BatteryAlert"] = "";
  Icon2["BatteryChargingFull"] = "";
  Icon2["BatteryFull"] = "";
  Icon2["BatteryStd"] = "";
  Icon2["BatteryUnknown"] = "";
  Icon2["BeachAccess"] = "";
  Icon2["Beenhere"] = "";
  Icon2["Block"] = "";
  Icon2["Bluetooth"] = "";
  Icon2["BluetoothAudio"] = "";
  Icon2["BluetoothConnected"] = "";
  Icon2["BluetoothDisabled"] = "";
  Icon2["BluetoothSearching"] = "";
  Icon2["BlurCircular"] = "";
  Icon2["BlurLinear"] = "";
  Icon2["BlurOff"] = "";
  Icon2["BlurOn"] = "";
  Icon2["Book"] = "";
  Icon2["Bookmark"] = "";
  Icon2["BookmarkBorder"] = "";
  Icon2["BorderAll"] = "";
  Icon2["BorderBottom"] = "";
  Icon2["BorderClear"] = "";
  Icon2["BorderColor"] = "";
  Icon2["BorderHorizontal"] = "";
  Icon2["BorderInner"] = "";
  Icon2["BorderLeft"] = "";
  Icon2["BorderOuter"] = "";
  Icon2["BorderRight"] = "";
  Icon2["BorderStyle"] = "";
  Icon2["BorderTop"] = "";
  Icon2["BorderVertical"] = "";
  Icon2["BrandingWatermark"] = "";
  Icon2["Brightness1"] = "";
  Icon2["Brightness2"] = "";
  Icon2["Brightness3"] = "";
  Icon2["Brightness4"] = "";
  Icon2["Brightness5"] = "";
  Icon2["Brightness6"] = "";
  Icon2["Brightness7"] = "";
  Icon2["BrightnessAuto"] = "";
  Icon2["BrightnessHigh"] = "";
  Icon2["BrightnessLow"] = "";
  Icon2["BrightnessMedium"] = "";
  Icon2["BrokenImage"] = "";
  Icon2["Brush"] = "";
  Icon2["BubbleChart"] = "";
  Icon2["BugReport"] = "";
  Icon2["Build"] = "";
  Icon2["BurstMode"] = "";
  Icon2["Business"] = "";
  Icon2["BusinessCenter"] = "";
  Icon2["Cached"] = "";
  Icon2["Cake"] = "";
  Icon2["Call"] = "";
  Icon2["CallEnd"] = "";
  Icon2["CallMade"] = "";
  Icon2["CallMerge"] = "";
  Icon2["CallMissed"] = "";
  Icon2["CallMissedOutgoing"] = "";
  Icon2["CallReceived"] = "";
  Icon2["CallSplit"] = "";
  Icon2["CallToAction"] = "";
  Icon2["Camera"] = "";
  Icon2["CameraAlt"] = "";
  Icon2["CameraEnhance"] = "";
  Icon2["CameraFront"] = "";
  Icon2["CameraRear"] = "";
  Icon2["CameraRoll"] = "";
  Icon2["Cancel"] = "";
  Icon2["CardGiftcard"] = "";
  Icon2["CardMembership"] = "";
  Icon2["CardTravel"] = "";
  Icon2["Casino"] = "";
  Icon2["Cast"] = "";
  Icon2["CastConnected"] = "";
  Icon2["CenterFocusStrong"] = "";
  Icon2["CenterFocusWeak"] = "";
  Icon2["ChangeHistory"] = "";
  Icon2["Chat"] = "";
  Icon2["ChatBubble"] = "";
  Icon2["ChatBubbleOutline"] = "";
  Icon2["Check"] = "";
  Icon2["CheckBox"] = "";
  Icon2["CheckBoxOutlineBlank"] = "";
  Icon2["CheckCircle"] = "";
  Icon2["ChevronLeft"] = "";
  Icon2["ChevronRight"] = "";
  Icon2["ChildCare"] = "";
  Icon2["ChildFriendly"] = "";
  Icon2["ChromeReaderMode"] = "";
  Icon2["Class"] = "";
  Icon2["Clear"] = "";
  Icon2["ClearAll"] = "";
  Icon2["Close"] = "";
  Icon2["ClosedCaption"] = "";
  Icon2["Cloud"] = "";
  Icon2["CloudCircle"] = "";
  Icon2["CloudDone"] = "";
  Icon2["CloudDownload"] = "";
  Icon2["CloudOff"] = "";
  Icon2["CloudQueue"] = "";
  Icon2["CloudUpload"] = "";
  Icon2["Code"] = "";
  Icon2["Collections"] = "";
  Icon2["CollectionsBookmark"] = "";
  Icon2["ColorLens"] = "";
  Icon2["Colorize"] = "";
  Icon2["Comment"] = "";
  Icon2["Compare"] = "";
  Icon2["CompareArrows"] = "";
  Icon2["Computer"] = "";
  Icon2["ConfirmationNumber"] = "";
  Icon2["ContactMail"] = "";
  Icon2["ContactPhone"] = "";
  Icon2["Contacts"] = "";
  Icon2["ContentCopy"] = "";
  Icon2["ContentCut"] = "";
  Icon2["ContentPaste"] = "";
  Icon2["ControlPoint"] = "";
  Icon2["ControlPointDuplicate"] = "";
  Icon2["Copyright"] = "";
  Icon2["Create"] = "";
  Icon2["CreateNewFolder"] = "";
  Icon2["CreditCard"] = "";
  Icon2["Crop"] = "";
  Icon2["Crop169"] = "";
  Icon2["Crop32"] = "";
  Icon2["Crop54"] = "";
  Icon2["Crop75"] = "";
  Icon2["CropDin"] = "";
  Icon2["CropFree"] = "";
  Icon2["CropLandscape"] = "";
  Icon2["CropOriginal"] = "";
  Icon2["CropPortrait"] = "";
  Icon2["CropRotate"] = "";
  Icon2["CropSquare"] = "";
  Icon2["Dashboard"] = "";
  Icon2["DataUsage"] = "";
  Icon2["DateRange"] = "";
  Icon2["Dehaze"] = "";
  Icon2["Delete"] = "";
  Icon2["DeleteForever"] = "";
  Icon2["DeleteSweep"] = "";
  Icon2["Description"] = "";
  Icon2["DesktopMac"] = "";
  Icon2["DesktopWindows"] = "";
  Icon2["Details"] = "";
  Icon2["DeveloperBoard"] = "";
  Icon2["DeveloperMode"] = "";
  Icon2["DeviceHub"] = "";
  Icon2["Devices"] = "";
  Icon2["DevicesOther"] = "";
  Icon2["DialerSip"] = "";
  Icon2["Dialpad"] = "";
  Icon2["Directions"] = "";
  Icon2["DirectionsBike"] = "";
  Icon2["DirectionsBoat"] = "";
  Icon2["DirectionsBus"] = "";
  Icon2["DirectionsCar"] = "";
  Icon2["DirectionsRailway"] = "";
  Icon2["DirectionsRun"] = "";
  Icon2["DirectionsSubway"] = "";
  Icon2["DirectionsTransit"] = "";
  Icon2["DirectionsWalk"] = "";
  Icon2["DiscFull"] = "";
  Icon2["Dns"] = "";
  Icon2["DoNotDisturb"] = "";
  Icon2["DoNotDisturbAlt"] = "";
  Icon2["DoNotDisturbOff"] = "";
  Icon2["DoNotDisturbOn"] = "";
  Icon2["Dock"] = "";
  Icon2["Domain"] = "";
  Icon2["Done"] = "";
  Icon2["DoneAll"] = "";
  Icon2["DonutLarge"] = "";
  Icon2["DonutSmall"] = "";
  Icon2["Drafts"] = "";
  Icon2["DragHandle"] = "";
  Icon2["DriveEta"] = "";
  Icon2["Dvr"] = "";
  Icon2["Edit"] = "";
  Icon2["EditLocation"] = "";
  Icon2["Eject"] = "";
  Icon2["Email"] = "";
  Icon2["EnhancedEncryption"] = "";
  Icon2["Equalizer"] = "";
  Icon2["Error"] = "";
  Icon2["ErrorOutline"] = "";
  Icon2["EuroSymbol"] = "";
  Icon2["EvStation"] = "";
  Icon2["Event"] = "";
  Icon2["EventAvailable"] = "";
  Icon2["EventBusy"] = "";
  Icon2["EventNote"] = "";
  Icon2["EventSeat"] = "";
  Icon2["ExitToApp"] = "";
  Icon2["ExpandLess"] = "";
  Icon2["ExpandMore"] = "";
  Icon2["Explicit"] = "";
  Icon2["Explore"] = "";
  Icon2["Exposure"] = "";
  Icon2["ExposureNeg1"] = "";
  Icon2["ExposureNeg2"] = "";
  Icon2["ExposurePlus1"] = "";
  Icon2["ExposurePlus2"] = "";
  Icon2["ExposureZero"] = "";
  Icon2["Extension"] = "";
  Icon2["Face"] = "";
  Icon2["FastForward"] = "";
  Icon2["FastRewind"] = "";
  Icon2["Favorite"] = "";
  Icon2["FavoriteBorder"] = "";
  Icon2["FeaturedPlayList"] = "";
  Icon2["FeaturedVideo"] = "";
  Icon2["Feedback"] = "";
  Icon2["FiberDvr"] = "";
  Icon2["FiberManualRecord"] = "";
  Icon2["FiberNew"] = "";
  Icon2["FiberPin"] = "";
  Icon2["FiberSmartRecord"] = "";
  Icon2["FileDownload"] = "";
  Icon2["FileUpload"] = "";
  Icon2["Filter"] = "";
  Icon2["Filter1"] = "";
  Icon2["Filter2"] = "";
  Icon2["Filter3"] = "";
  Icon2["Filter4"] = "";
  Icon2["Filter5"] = "";
  Icon2["Filter6"] = "";
  Icon2["Filter7"] = "";
  Icon2["Filter8"] = "";
  Icon2["Filter9"] = "";
  Icon2["Filter9Plus"] = "";
  Icon2["FilterBAndW"] = "";
  Icon2["FilterCenterFocus"] = "";
  Icon2["FilterDrama"] = "";
  Icon2["FilterFrames"] = "";
  Icon2["FilterHdr"] = "";
  Icon2["FilterList"] = "";
  Icon2["FilterNone"] = "";
  Icon2["FilterTiltShift"] = "";
  Icon2["FilterVintage"] = "";
  Icon2["FindInPage"] = "";
  Icon2["FindReplace"] = "";
  Icon2["Fingerprint"] = "";
  Icon2["FirstPage"] = "";
  Icon2["FitnessCenter"] = "";
  Icon2["Flag"] = "";
  Icon2["Flare"] = "";
  Icon2["FlashAuto"] = "";
  Icon2["FlashOff"] = "";
  Icon2["FlashOn"] = "";
  Icon2["Flight"] = "";
  Icon2["FlightLand"] = "";
  Icon2["FlightTakeoff"] = "";
  Icon2["Flip"] = "";
  Icon2["FlipToBack"] = "";
  Icon2["FlipToFront"] = "";
  Icon2["Folder"] = "";
  Icon2["FolderOpen"] = "";
  Icon2["FolderShared"] = "";
  Icon2["FolderSpecial"] = "";
  Icon2["FontDownload"] = "";
  Icon2["FormatAlignCenter"] = "";
  Icon2["FormatAlignJustify"] = "";
  Icon2["FormatAlignLeft"] = "";
  Icon2["FormatAlignRight"] = "";
  Icon2["FormatBold"] = "";
  Icon2["FormatClear"] = "";
  Icon2["FormatColorFill"] = "";
  Icon2["FormatColorReset"] = "";
  Icon2["FormatColorText"] = "";
  Icon2["FormatIndentDecrease"] = "";
  Icon2["FormatIndentIncrease"] = "";
  Icon2["FormatItalic"] = "";
  Icon2["FormatLineSpacing"] = "";
  Icon2["FormatListBulleted"] = "";
  Icon2["FormatListNumbered"] = "";
  Icon2["FormatPaint"] = "";
  Icon2["FormatQuote"] = "";
  Icon2["FormatShapes"] = "";
  Icon2["FormatSize"] = "";
  Icon2["FormatStrikethrough"] = "";
  Icon2["FormatTextdirectionLToR"] = "";
  Icon2["FormatTextdirectionRToL"] = "";
  Icon2["FormatUnderlined"] = "";
  Icon2["Forum"] = "";
  Icon2["Forward"] = "";
  Icon2["Forward10"] = "";
  Icon2["Forward30"] = "";
  Icon2["Forward5"] = "";
  Icon2["FreeBreakfast"] = "";
  Icon2["Fullscreen"] = "";
  Icon2["FullscreenExit"] = "";
  Icon2["Functions"] = "";
  Icon2["GTranslate"] = "";
  Icon2["Gamepad"] = "";
  Icon2["Games"] = "";
  Icon2["Gavel"] = "";
  Icon2["Gesture"] = "";
  Icon2["GetApp"] = "";
  Icon2["Gif"] = "";
  Icon2["GolfCourse"] = "";
  Icon2["GpsFixed"] = "";
  Icon2["GpsNotFixed"] = "";
  Icon2["GpsOff"] = "";
  Icon2["Grade"] = "";
  Icon2["Gradient"] = "";
  Icon2["Grain"] = "";
  Icon2["GraphicEq"] = "";
  Icon2["GridOff"] = "";
  Icon2["GridOn"] = "";
  Icon2["Group"] = "";
  Icon2["GroupAdd"] = "";
  Icon2["GroupWork"] = "";
  Icon2["Hd"] = "";
  Icon2["HdrOff"] = "";
  Icon2["HdrOn"] = "";
  Icon2["HdrStrong"] = "";
  Icon2["HdrWeak"] = "";
  Icon2["Headset"] = "";
  Icon2["HeadsetMic"] = "";
  Icon2["Healing"] = "";
  Icon2["Hearing"] = "";
  Icon2["Help"] = "";
  Icon2["HelpOutline"] = "";
  Icon2["HighQuality"] = "";
  Icon2["Highlight"] = "";
  Icon2["HighlightOff"] = "";
  Icon2["History"] = "";
  Icon2["Home"] = "";
  Icon2["HotTub"] = "";
  Icon2["Hotel"] = "";
  Icon2["HourglassEmpty"] = "";
  Icon2["HourglassFull"] = "";
  Icon2["Http"] = "";
  Icon2["Https"] = "";
  Icon2["Image"] = "";
  Icon2["ImageAspectRatio"] = "";
  Icon2["ImportContacts"] = "";
  Icon2["ImportExport"] = "";
  Icon2["ImportantDevices"] = "";
  Icon2["Inbox"] = "";
  Icon2["IndeterminateCheckBox"] = "";
  Icon2["Info"] = "";
  Icon2["InfoOutline"] = "";
  Icon2["Input"] = "";
  Icon2["InsertChart"] = "";
  Icon2["InsertComment"] = "";
  Icon2["InsertDriveFile"] = "";
  Icon2["InsertEmoticon"] = "";
  Icon2["InsertInvitation"] = "";
  Icon2["InsertLink"] = "";
  Icon2["InsertPhoto"] = "";
  Icon2["InvertColors"] = "";
  Icon2["InvertColorsOff"] = "";
  Icon2["Iso"] = "";
  Icon2["Keyboard"] = "";
  Icon2["KeyboardArrowDown"] = "";
  Icon2["KeyboardArrowLeft"] = "";
  Icon2["KeyboardArrowRight"] = "";
  Icon2["KeyboardArrowUp"] = "";
  Icon2["KeyboardBackspace"] = "";
  Icon2["KeyboardCapslock"] = "";
  Icon2["KeyboardHide"] = "";
  Icon2["KeyboardReturn"] = "";
  Icon2["KeyboardTab"] = "";
  Icon2["KeyboardVoice"] = "";
  Icon2["Kitchen"] = "";
  Icon2["Label"] = "";
  Icon2["LabelOutline"] = "";
  Icon2["Landscape"] = "";
  Icon2["Language"] = "";
  Icon2["Laptop"] = "";
  Icon2["LaptopChromebook"] = "";
  Icon2["LaptopMac"] = "";
  Icon2["LaptopWindows"] = "";
  Icon2["LastPage"] = "";
  Icon2["Launch"] = "";
  Icon2["Layers"] = "";
  Icon2["LayersClear"] = "";
  Icon2["LeakAdd"] = "";
  Icon2["LeakRemove"] = "";
  Icon2["Lens"] = "";
  Icon2["LibraryAdd"] = "";
  Icon2["LibraryBooks"] = "";
  Icon2["LibraryMusic"] = "";
  Icon2["LightbulbOutline"] = "";
  Icon2["LineStyle"] = "";
  Icon2["LineWeight"] = "";
  Icon2["LinearScale"] = "";
  Icon2["Link"] = "";
  Icon2["LinkedCamera"] = "";
  Icon2["List"] = "";
  Icon2["LiveHelp"] = "";
  Icon2["LiveTv"] = "";
  Icon2["LocalActivity"] = "";
  Icon2["LocalAirport"] = "";
  Icon2["LocalAtm"] = "";
  Icon2["LocalBar"] = "";
  Icon2["LocalCafe"] = "";
  Icon2["LocalCarWash"] = "";
  Icon2["LocalConvenienceStore"] = "";
  Icon2["LocalDining"] = "";
  Icon2["LocalDrink"] = "";
  Icon2["LocalFlorist"] = "";
  Icon2["LocalGasStation"] = "";
  Icon2["LocalGroceryStore"] = "";
  Icon2["LocalHospital"] = "";
  Icon2["LocalHotel"] = "";
  Icon2["LocalLaundryService"] = "";
  Icon2["LocalLibrary"] = "";
  Icon2["LocalMall"] = "";
  Icon2["LocalMovies"] = "";
  Icon2["LocalOffer"] = "";
  Icon2["LocalParking"] = "";
  Icon2["LocalPharmacy"] = "";
  Icon2["LocalPhone"] = "";
  Icon2["LocalPizza"] = "";
  Icon2["LocalPlay"] = "";
  Icon2["LocalPostOffice"] = "";
  Icon2["LocalPrintshop"] = "";
  Icon2["LocalSee"] = "";
  Icon2["LocalShipping"] = "";
  Icon2["LocalTaxi"] = "";
  Icon2["LocationCity"] = "";
  Icon2["LocationDisabled"] = "";
  Icon2["LocationOff"] = "";
  Icon2["LocationOn"] = "";
  Icon2["LocationSearching"] = "";
  Icon2["Lock"] = "";
  Icon2["LockOpen"] = "";
  Icon2["LockOutline"] = "";
  Icon2["Looks"] = "";
  Icon2["Looks3"] = "";
  Icon2["Looks4"] = "";
  Icon2["Looks5"] = "";
  Icon2["Looks6"] = "";
  Icon2["LooksOne"] = "";
  Icon2["LooksTwo"] = "";
  Icon2["Loop"] = "";
  Icon2["Loupe"] = "";
  Icon2["LowPriority"] = "";
  Icon2["Loyalty"] = "";
  Icon2["Mail"] = "";
  Icon2["MailOutline"] = "";
  Icon2["Map"] = "";
  Icon2["Markunread"] = "";
  Icon2["MarkunreadMailbox"] = "";
  Icon2["Memory"] = "";
  Icon2["Menu"] = "";
  Icon2["MergeType"] = "";
  Icon2["Message"] = "";
  Icon2["Mic"] = "";
  Icon2["MicNone"] = "";
  Icon2["MicOff"] = "";
  Icon2["Mms"] = "";
  Icon2["ModeComment"] = "";
  Icon2["ModeEdit"] = "";
  Icon2["MonetizationOn"] = "";
  Icon2["MoneyOff"] = "";
  Icon2["MonochromePhotos"] = "";
  Icon2["Mood"] = "";
  Icon2["MoodBad"] = "";
  Icon2["More"] = "";
  Icon2["MoreHoriz"] = "";
  Icon2["MoreVert"] = "";
  Icon2["Motorcycle"] = "";
  Icon2["Mouse"] = "";
  Icon2["MoveToInbox"] = "";
  Icon2["Movie"] = "";
  Icon2["MovieCreation"] = "";
  Icon2["MovieFilter"] = "";
  Icon2["MultilineChart"] = "";
  Icon2["MusicNote"] = "";
  Icon2["MusicVideo"] = "";
  Icon2["MyLocation"] = "";
  Icon2["Nature"] = "";
  Icon2["NaturePeople"] = "";
  Icon2["NavigateBefore"] = "";
  Icon2["NavigateNext"] = "";
  Icon2["Navigation"] = "";
  Icon2["NearMe"] = "";
  Icon2["NetworkCell"] = "";
  Icon2["NetworkCheck"] = "";
  Icon2["NetworkLocked"] = "";
  Icon2["NetworkWifi"] = "";
  Icon2["NewReleases"] = "";
  Icon2["NextWeek"] = "";
  Icon2["Nfc"] = "";
  Icon2["NoEncryption"] = "";
  Icon2["NoSim"] = "";
  Icon2["NotInterested"] = "";
  Icon2["Note"] = "";
  Icon2["NoteAdd"] = "";
  Icon2["Notifications"] = "";
  Icon2["NotificationsActive"] = "";
  Icon2["NotificationsNone"] = "";
  Icon2["NotificationsOff"] = "";
  Icon2["NotificationsPaused"] = "";
  Icon2["OfflinePin"] = "";
  Icon2["OndemandVideo"] = "";
  Icon2["Opacity"] = "";
  Icon2["OpenInBrowser"] = "";
  Icon2["OpenInNew"] = "";
  Icon2["OpenWith"] = "";
  Icon2["Pages"] = "";
  Icon2["Pageview"] = "";
  Icon2["Palette"] = "";
  Icon2["PanTool"] = "";
  Icon2["Panorama"] = "";
  Icon2["PanoramaFishEye"] = "";
  Icon2["PanoramaHorizontal"] = "";
  Icon2["PanoramaVertical"] = "";
  Icon2["PanoramaWideAngle"] = "";
  Icon2["PartyMode"] = "";
  Icon2["Pause"] = "";
  Icon2["PauseCircleFilled"] = "";
  Icon2["PauseCircleOutline"] = "";
  Icon2["Payment"] = "";
  Icon2["People"] = "";
  Icon2["PeopleOutline"] = "";
  Icon2["PermCameraMic"] = "";
  Icon2["PermContactCalendar"] = "";
  Icon2["PermDataSetting"] = "";
  Icon2["PermDeviceInformation"] = "";
  Icon2["PermIdentity"] = "";
  Icon2["PermMedia"] = "";
  Icon2["PermPhoneMsg"] = "";
  Icon2["PermScanWifi"] = "";
  Icon2["Person"] = "";
  Icon2["PersonAdd"] = "";
  Icon2["PersonOutline"] = "";
  Icon2["PersonPin"] = "";
  Icon2["PersonPinCircle"] = "";
  Icon2["PersonalVideo"] = "";
  Icon2["Pets"] = "";
  Icon2["Phone"] = "";
  Icon2["PhoneAndroid"] = "";
  Icon2["PhoneBluetoothSpeaker"] = "";
  Icon2["PhoneForwarded"] = "";
  Icon2["PhoneInTalk"] = "";
  Icon2["PhoneIphone"] = "";
  Icon2["PhoneLocked"] = "";
  Icon2["PhoneMissed"] = "";
  Icon2["PhonePaused"] = "";
  Icon2["Phonelink"] = "";
  Icon2["PhonelinkErase"] = "";
  Icon2["PhonelinkLock"] = "";
  Icon2["PhonelinkOff"] = "";
  Icon2["PhonelinkRing"] = "";
  Icon2["PhonelinkSetup"] = "";
  Icon2["Photo"] = "";
  Icon2["PhotoAlbum"] = "";
  Icon2["PhotoCamera"] = "";
  Icon2["PhotoFilter"] = "";
  Icon2["PhotoLibrary"] = "";
  Icon2["PhotoSizeSelectActual"] = "";
  Icon2["PhotoSizeSelectLarge"] = "";
  Icon2["PhotoSizeSelectSmall"] = "";
  Icon2["PictureAsPdf"] = "";
  Icon2["PictureInPicture"] = "";
  Icon2["PictureInPictureAlt"] = "";
  Icon2["PieChart"] = "";
  Icon2["PieChartOutlined"] = "";
  Icon2["PinDrop"] = "";
  Icon2["Place"] = "";
  Icon2["PlayArrow"] = "";
  Icon2["PlayCircleFilled"] = "";
  Icon2["PlayCircleOutline"] = "";
  Icon2["PlayForWork"] = "";
  Icon2["PlaylistAdd"] = "";
  Icon2["PlaylistAddCheck"] = "";
  Icon2["PlaylistPlay"] = "";
  Icon2["PlusOne"] = "";
  Icon2["Poll"] = "";
  Icon2["Polymer"] = "";
  Icon2["Pool"] = "";
  Icon2["PortableWifiOff"] = "";
  Icon2["Portrait"] = "";
  Icon2["Power"] = "";
  Icon2["PowerInput"] = "";
  Icon2["PowerSettingsNew"] = "";
  Icon2["PregnantWoman"] = "";
  Icon2["PresentToAll"] = "";
  Icon2["Print"] = "";
  Icon2["PriorityHigh"] = "";
  Icon2["Public"] = "";
  Icon2["Publish"] = "";
  Icon2["QueryBuilder"] = "";
  Icon2["QuestionAnswer"] = "";
  Icon2["Queue"] = "";
  Icon2["QueueMusic"] = "";
  Icon2["QueuePlayNext"] = "";
  Icon2["Radio"] = "";
  Icon2["RadioButtonChecked"] = "";
  Icon2["RadioButtonUnchecked"] = "";
  Icon2["RateReview"] = "";
  Icon2["Receipt"] = "";
  Icon2["RecentActors"] = "";
  Icon2["RecordVoiceOver"] = "";
  Icon2["Redeem"] = "";
  Icon2["Redo"] = "";
  Icon2["Refresh"] = "";
  Icon2["Remove"] = "";
  Icon2["RemoveCircle"] = "";
  Icon2["RemoveCircleOutline"] = "";
  Icon2["RemoveFromQueue"] = "";
  Icon2["RemoveRedEye"] = "";
  Icon2["RemoveShoppingCart"] = "";
  Icon2["Reorder"] = "";
  Icon2["Repeat"] = "";
  Icon2["RepeatOne"] = "";
  Icon2["Replay"] = "";
  Icon2["Replay10"] = "";
  Icon2["Replay30"] = "";
  Icon2["Replay5"] = "";
  Icon2["Reply"] = "";
  Icon2["ReplyAll"] = "";
  Icon2["Report"] = "";
  Icon2["ReportProblem"] = "";
  Icon2["Restaurant"] = "";
  Icon2["RestaurantMenu"] = "";
  Icon2["Restore"] = "";
  Icon2["RestorePage"] = "";
  Icon2["RingVolume"] = "";
  Icon2["Room"] = "";
  Icon2["RoomService"] = "";
  Icon2["Rotate90DegreesCcw"] = "";
  Icon2["RotateLeft"] = "";
  Icon2["RotateRight"] = "";
  Icon2["RoundedCorner"] = "";
  Icon2["Router"] = "";
  Icon2["Rowing"] = "";
  Icon2["RssFeed"] = "";
  Icon2["RvHookup"] = "";
  Icon2["Satellite"] = "";
  Icon2["Save"] = "";
  Icon2["Scanner"] = "";
  Icon2["Schedule"] = "";
  Icon2["School"] = "";
  Icon2["ScreenLockLandscape"] = "";
  Icon2["ScreenLockPortrait"] = "";
  Icon2["ScreenLockRotation"] = "";
  Icon2["ScreenRotation"] = "";
  Icon2["ScreenShare"] = "";
  Icon2["SdCard"] = "";
  Icon2["SdStorage"] = "";
  Icon2["Search"] = "";
  Icon2["Security"] = "";
  Icon2["SelectAll"] = "";
  Icon2["Send"] = "";
  Icon2["SentimentDissatisfied"] = "";
  Icon2["SentimentNeutral"] = "";
  Icon2["SentimentSatisfied"] = "";
  Icon2["SentimentVeryDissatisfied"] = "";
  Icon2["SentimentVerySatisfied"] = "";
  Icon2["Settings"] = "";
  Icon2["SettingsApplications"] = "";
  Icon2["SettingsBackupRestore"] = "";
  Icon2["SettingsBluetooth"] = "";
  Icon2["SettingsBrightness"] = "";
  Icon2["SettingsCell"] = "";
  Icon2["SettingsEthernet"] = "";
  Icon2["SettingsInputAntenna"] = "";
  Icon2["SettingsInputComponent"] = "";
  Icon2["SettingsInputComposite"] = "";
  Icon2["SettingsInputHdmi"] = "";
  Icon2["SettingsInputSvideo"] = "";
  Icon2["SettingsOverscan"] = "";
  Icon2["SettingsPhone"] = "";
  Icon2["SettingsPower"] = "";
  Icon2["SettingsRemote"] = "";
  Icon2["SettingsSystemDaydream"] = "";
  Icon2["SettingsVoice"] = "";
  Icon2["Share"] = "";
  Icon2["Shop"] = "";
  Icon2["ShopTwo"] = "";
  Icon2["ShoppingBasket"] = "";
  Icon2["ShoppingCart"] = "";
  Icon2["ShortText"] = "";
  Icon2["ShowChart"] = "";
  Icon2["Shuffle"] = "";
  Icon2["SignalCellular4Bar"] = "";
  Icon2["SignalCellularConnectedNoInternet4Bar"] = "";
  Icon2["SignalCellularNoSim"] = "";
  Icon2["SignalCellularNull"] = "";
  Icon2["SignalCellularOff"] = "";
  Icon2["SignalWifi4Bar"] = "";
  Icon2["SignalWifi4BarLock"] = "";
  Icon2["SignalWifiOff"] = "";
  Icon2["SimCard"] = "";
  Icon2["SimCardAlert"] = "";
  Icon2["SkipNext"] = "";
  Icon2["SkipPrevious"] = "";
  Icon2["Slideshow"] = "";
  Icon2["SlowMotionVideo"] = "";
  Icon2["Smartphone"] = "";
  Icon2["SmokeFree"] = "";
  Icon2["SmokingRooms"] = "";
  Icon2["Sms"] = "";
  Icon2["SmsFailed"] = "";
  Icon2["Snooze"] = "";
  Icon2["Sort"] = "";
  Icon2["SortByAlpha"] = "";
  Icon2["Spa"] = "";
  Icon2["SpaceBar"] = "";
  Icon2["Speaker"] = "";
  Icon2["SpeakerGroup"] = "";
  Icon2["SpeakerNotes"] = "";
  Icon2["SpeakerNotesOff"] = "";
  Icon2["SpeakerPhone"] = "";
  Icon2["Spellcheck"] = "";
  Icon2["Star"] = "";
  Icon2["StarBorder"] = "";
  Icon2["StarHalf"] = "";
  Icon2["Stars"] = "";
  Icon2["StayCurrentLandscape"] = "";
  Icon2["StayCurrentPortrait"] = "";
  Icon2["StayPrimaryLandscape"] = "";
  Icon2["StayPrimaryPortrait"] = "";
  Icon2["Stop"] = "";
  Icon2["StopScreenShare"] = "";
  Icon2["Storage"] = "";
  Icon2["Store"] = "";
  Icon2["StoreMallDirectory"] = "";
  Icon2["Straighten"] = "";
  Icon2["Streetview"] = "";
  Icon2["StrikethroughS"] = "";
  Icon2["Style"] = "";
  Icon2["SubdirectoryArrowLeft"] = "";
  Icon2["SubdirectoryArrowRight"] = "";
  Icon2["Subject"] = "";
  Icon2["Subscriptions"] = "";
  Icon2["Subtitles"] = "";
  Icon2["Subway"] = "";
  Icon2["SupervisorAccount"] = "";
  Icon2["SurroundSound"] = "";
  Icon2["SwapCalls"] = "";
  Icon2["SwapHoriz"] = "";
  Icon2["SwapVert"] = "";
  Icon2["SwapVerticalCircle"] = "";
  Icon2["SwitchCamera"] = "";
  Icon2["SwitchVideo"] = "";
  Icon2["Sync"] = "";
  Icon2["SyncDisabled"] = "";
  Icon2["SyncProblem"] = "";
  Icon2["SystemUpdate"] = "";
  Icon2["SystemUpdateAlt"] = "";
  Icon2["Tab"] = "";
  Icon2["TabUnselected"] = "";
  Icon2["Tablet"] = "";
  Icon2["TabletAndroid"] = "";
  Icon2["TabletMac"] = "";
  Icon2["TagFaces"] = "";
  Icon2["TapAndPlay"] = "";
  Icon2["Terrain"] = "";
  Icon2["TextFields"] = "";
  Icon2["TextFormat"] = "";
  Icon2["Textsms"] = "";
  Icon2["Texture"] = "";
  Icon2["Theaters"] = "";
  Icon2["ThumbDown"] = "";
  Icon2["ThumbUp"] = "";
  Icon2["ThumbsUpDown"] = "";
  Icon2["TimeToLeave"] = "";
  Icon2["Timelapse"] = "";
  Icon2["Timeline"] = "";
  Icon2["Timer"] = "";
  Icon2["Timer10"] = "";
  Icon2["Timer3"] = "";
  Icon2["TimerOff"] = "";
  Icon2["Title"] = "";
  Icon2["Toc"] = "";
  Icon2["Today"] = "";
  Icon2["Toll"] = "";
  Icon2["Tonality"] = "";
  Icon2["TouchApp"] = "";
  Icon2["Toys"] = "";
  Icon2["TrackChanges"] = "";
  Icon2["Traffic"] = "";
  Icon2["Train"] = "";
  Icon2["Tram"] = "";
  Icon2["TransferWithinAStation"] = "";
  Icon2["Transform"] = "";
  Icon2["Translate"] = "";
  Icon2["TrendingDown"] = "";
  Icon2["TrendingFlat"] = "";
  Icon2["TrendingUp"] = "";
  Icon2["Tune"] = "";
  Icon2["TurnedIn"] = "";
  Icon2["TurnedInNot"] = "";
  Icon2["Tv"] = "";
  Icon2["Unarchive"] = "";
  Icon2["Undo"] = "";
  Icon2["UnfoldLess"] = "";
  Icon2["UnfoldMore"] = "";
  Icon2["Update"] = "";
  Icon2["Usb"] = "";
  Icon2["VerifiedUser"] = "";
  Icon2["VerticalAlignBottom"] = "";
  Icon2["VerticalAlignCenter"] = "";
  Icon2["VerticalAlignTop"] = "";
  Icon2["Vibration"] = "";
  Icon2["VideoCall"] = "";
  Icon2["VideoLabel"] = "";
  Icon2["VideoLibrary"] = "";
  Icon2["Videocam"] = "";
  Icon2["VideocamOff"] = "";
  Icon2["VideogameAsset"] = "";
  Icon2["ViewAgenda"] = "";
  Icon2["ViewArray"] = "";
  Icon2["ViewCarousel"] = "";
  Icon2["ViewColumn"] = "";
  Icon2["ViewComfy"] = "";
  Icon2["ViewCompact"] = "";
  Icon2["ViewDay"] = "";
  Icon2["ViewHeadline"] = "";
  Icon2["ViewList"] = "";
  Icon2["ViewModule"] = "";
  Icon2["ViewQuilt"] = "";
  Icon2["ViewStream"] = "";
  Icon2["ViewWeek"] = "";
  Icon2["Vignette"] = "";
  Icon2["Visibility"] = "";
  Icon2["VisibilityOff"] = "";
  Icon2["VoiceChat"] = "";
  Icon2["Voicemail"] = "";
  Icon2["VolumeDown"] = "";
  Icon2["VolumeMute"] = "";
  Icon2["VolumeOff"] = "";
  Icon2["VolumeUp"] = "";
  Icon2["VpnKey"] = "";
  Icon2["VpnLock"] = "";
  Icon2["Wallpaper"] = "";
  Icon2["Warning"] = "";
  Icon2["Watch"] = "";
  Icon2["WatchLater"] = "";
  Icon2["WbAuto"] = "";
  Icon2["WbCloudy"] = "";
  Icon2["WbIncandescent"] = "";
  Icon2["WbIridescent"] = "";
  Icon2["WbSunny"] = "";
  Icon2["Wc"] = "";
  Icon2["Web"] = "";
  Icon2["WebAsset"] = "";
  Icon2["Weekend"] = "";
  Icon2["Whatshot"] = "";
  Icon2["Widgets"] = "";
  Icon2["Wifi"] = "";
  Icon2["WifiLock"] = "";
  Icon2["WifiTethering"] = "";
  Icon2["Work"] = "";
  Icon2["WrapText"] = "";
  Icon2["YoutubeSearchedFor"] = "";
  Icon2["ZoomIn"] = "";
  Icon2["ZoomOut"] = "";
  Icon2["ZoomOutMap"] = "";
  return Icon2;
})(Icon || {});
class ArrayUtils {
  static sumOf(arr, start = 0, end = arr.length) {
    let sum = 0;
    for (let i = start; i < end; i++) {
      sum += arr[i];
    }
    return sum;
  }
  static averageOf(arr, start = 0, end = arr.length) {
    return ArrayUtils.sumOf(arr, start, end) / (end - start);
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
}
function degreeToRadian(degree) {
  return degree * (Math.PI / 180);
}
function currentMilliseconds() {
  return Date.now();
}
function useKeyboard(type, c) {
  const handler = (e) => {
    if (e.isTrusted) {
      c(e);
    }
  };
  onMounted(() => {
    if (type === "up")
      window.addEventListener("keyup", handler);
    else
      window.addEventListener("keydown", handler);
  });
  onUnmounted(() => {
    if (type === "up")
      window.removeEventListener("keyup", handler);
    else
      window.removeEventListener("keydown", handler);
  });
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
function isString$1(v) {
  return typeof v === "string";
}
const _sfc_main$h = /* @__PURE__ */ defineComponent({
  __name: "CheckBox",
  props: mergeModels({
    color: { default: "#33cb98" }
  }, {
    "modelValue": { type: Boolean, ...{ default: false } }
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const props = __props;
    const value = ref(false);
    const checkValue = useModel(__props, "modelValue");
    watch(value, (v) => checkValue.value = v);
    const checkBox = ref(null);
    const callback = () => {
      var _a;
      (_a = checkBox.value) == null ? void 0 : _a.style.setProperty("--checkbox-color", props.color);
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
const CheckBox_vue_vue_type_style_index_0_scoped_bf55eb02_lang = "";
const CheckBox = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["__scopeId", "data-v-bf55eb02"]]);
class TimePlayer {
  constructor() {
    __publicField(this, "previousTime", 0);
    __publicField(this, "startTime", 0);
    __publicField(this, "isPlaying", false);
    __publicField(this, "_current", ref(0));
    __publicField(this, "sp", 1);
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
    // @ts-ignore
    __publicField(this, "source", null);
    __publicField(this, "fftBuffer", new Uint8Array(0));
    __publicField(this, "emptyBuffer", new Uint8Array(0));
    __publicField(this, "isAvailable", false);
    this.analyse = analyse;
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
    __publicField(this, "_value");
    __publicField(this, "collectorList", []);
    __publicField(this, "jobQueue", []);
    __publicField(this, "flushIndex", 0);
    __publicField(this, "isFlushing", false);
    __publicField(this, "isFlushPending", false);
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
    __publicField(this, "_value", null);
    __publicField(this, "collectorList", []);
    __publicField(this, "jobQueue", []);
    __publicField(this, "flushIndex", 0);
    __publicField(this, "isFlushing", false);
    __publicField(this, "isFlushPending", false);
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
const PlayerState = {
  STATE_DOWNLOADING: 0,
  STATE_DECODING: 1,
  STATE_PLAYING: 2,
  STATE_DECODE_DONE: 3,
  STATE_PAUSING: 4
};
class AbstractPlayer {
}
class AudioPlayer extends AbstractPlayer {
  constructor() {
    super();
    __publicField(this, "audioContext");
    __publicField(this, "source", null);
    __publicField(this, "audioBuffer", null);
    __publicField(this, "isAvailable", false);
    __publicField(this, "time", new TimePlayer());
    __publicField(this, "_duration", 0);
    __publicField(this, "volume", ref(1));
    __publicField(this, "onEnd", createMutableSharedFlow());
    __publicField(this, "onSeeked", createMutableSharedFlow());
    __publicField(this, "playStateFlow", createMutableStateFlow(-1));
    __publicField(this, "_busyState", [PlayerState.STATE_DECODING]);
    //@ts-ignore
    __publicField(this, "needToPlay", false);
    __publicField(this, "seekTime", -1);
    __publicField(this, "playbackRate", 1);
    __publicField(this, "visualizer", null);
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
    return this._busyState.includes(this.playStateFlow.value);
  }
  async decode(arrayBuffer) {
    this.playStateFlow.value = PlayerState.STATE_DECODING;
    this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    this.playStateFlow.value = PlayerState.STATE_DECODE_DONE;
  }
  async play() {
    var _a, _b;
    if (this.isPlaying()) {
      return;
    }
    if (this.isBusy()) {
      this.needToPlay = true;
      return;
    }
    this.playStateFlow.value = PlayerState.STATE_PLAYING;
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
    (_a = this.visualizer) == null ? void 0 : _a.enable();
    (_b = this.visualizer) == null ? void 0 : _b.setSourceNode(source);
  }
  pause() {
    var _a;
    if (this.playStateFlow.value === PlayerState.STATE_PAUSING) {
      return;
    }
    if (this.isBusy()) {
      this.needToPlay = false;
      return;
    }
    this.playStateFlow.value = PlayerState.STATE_PAUSING;
    const source = this.source;
    if (source != null) {
      source.onended = null;
      source.stop();
      this.time.pause();
      source.disconnect();
      this.source = null;
    }
    (_a = this.visualizer) == null ? void 0 : _a.disable();
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
    this.volume.value = v;
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
    return this.playStateFlow.value === PlayerState.STATE_PLAYING;
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
const ease = cubicBezier(0.25, 0.1, 0.25, 1);
const easeIn = cubicBezier(0.25, 0.1, 0.25, 1);
const easeInQuad = cubicBezier(0.11, 0, 0.5, 0);
const easeInCubic = cubicBezier(0.32, 0, 0.67, 0);
const easeOut = cubicBezier(0, 0, 0.58, 1);
const easeOutCubic = cubicBezier(0.33, 1, 0.68, 1);
const easeOutQuint = cubicBezier(0.22, 1, 0.36, 1);
const easeOutBack = cubicBezier(0.34, 1.56, 0.64, 1);
const easeOutElastic = (x) => {
  const c4 = 2 * Math.PI / 3;
  return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
};
const easeInOut = cubicBezier(0.42, 0, 0.58, 1);
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
    // private bpm: number = 0
    __publicField(this, "gap", 0);
    __publicField(this, "offset", 0);
    __publicField(this, "timingList", []);
    __publicField(this, "beatCount", 0);
    __publicField(this, "beatFlag", false);
    __publicField(this, "prevBeat", -1);
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
  setTimingList(list) {
    this.timingList = [...list];
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
class Queue {
  constructor() {
    __publicField(this, "_head");
    __publicField(this, "_end");
    __publicField(this, "_size", 0);
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
    __publicField(this, "value");
    __publicField(this, "next");
    this.value = v;
  }
}
function isNumber$1(a) {
  return typeof a === "number";
}
class Animated {
  constructor(target) {
    __publicField(this, "target");
    __publicField(this, "hasAnimationRunning", false);
    __publicField(this, "animationQueue", new Queue());
    __publicField(this, "currentAnimate");
    __publicField(this, "onFinishCallback");
    if (!isRef(target)) {
      throw new Error("only ref");
    }
    if (!isNumber$1(target.value)) {
      throw new Error("only number");
    }
    this.target = target;
  }
  linearTo(targetValue, duration, delay = 0) {
    this.commit(targetValue, duration, delay, linear);
    return this;
  }
  easeInOutTo(targetValue, duration, delay = 0) {
    this.commit(targetValue, duration, delay, easeInOut);
    return this;
  }
  easeInTo(targetValue, duration, delay = 0) {
    this.commit(targetValue, duration, delay, easeIn);
    return this;
  }
  easeTo(targetValue, duration, delay = 0) {
    this.commit(targetValue, duration, delay, ease);
    return this;
  }
  easeOutTo(targetValue, duration, delay = 0) {
    this.commit(targetValue, duration, delay, easeOut);
    return this;
  }
  animateTo(targetValue, duration, timeFunction, delay = 0) {
    this.commit(targetValue, duration, delay, timeFunction);
    return this;
  }
  onFinish(callback) {
    this.onFinishCallback = callback;
  }
  cancelAll() {
    if (!this.animationQueue.isEmpty()) {
      this.animationQueue.foreach((e) => {
        e.cancel();
      });
      this.animationQueue.clear();
    } else if (this.currentAnimate) {
      this.currentAnimate.cancel();
      this.currentAnimate = void 0;
      this.hasAnimationRunning = false;
    }
  }
  commit(targetValue, duration, delay, timeFunction) {
    const animateItem = new AnimationItem(
      timeFunction,
      this.target,
      targetValue,
      duration,
      delay
    );
    animateItem.onFinish(() => {
      if (this.animationQueue.isEmpty()) {
        this.hasAnimationRunning = false;
        this.currentAnimate = void 0;
        if (this.onFinishCallback)
          this.onFinishCallback();
      } else {
        this.runNext();
      }
    });
    if (!this.hasAnimationRunning) {
      animateItem.run();
      this.hasAnimationRunning = true;
      this.currentAnimate = animateItem;
    } else {
      this.animationQueue.push(animateItem);
    }
  }
  runNext() {
    this.currentAnimate = this.animationQueue.front();
    this.animationQueue.pop();
    this.currentAnimate.run();
  }
}
class AnimationItem {
  constructor(timeFunction, target, destValue, duration, delay) {
    __publicField(this, "startTime", 0);
    __publicField(this, "target");
    __publicField(this, "initialValue", 0);
    __publicField(this, "destValue");
    __publicField(this, "timeFunction");
    __publicField(this, "animateDuration");
    __publicField(this, "valueDistance", 0);
    __publicField(this, "elapsed", 0);
    __publicField(this, "previousTimestamp", 0);
    __publicField(this, "delay", 0);
    __publicField(this, "onFinishCallback");
    __publicField(this, "cancelled", false);
    __publicField(this, "timerId", 0);
    this.timeFunction = timeFunction;
    this.target = target;
    this.destValue = destValue;
    this.animateDuration = duration;
    this.delay = delay;
  }
  run() {
    this.initialValue = this.target.value;
    this.valueDistance = this.destValue - this.initialValue;
    if (this.delay === 0) {
      requestAnimationFrame(this.updater.bind(this));
    } else {
      this.timerId = setTimeout(() => {
        requestAnimationFrame(this.updater.bind(this));
      }, this.delay);
    }
  }
  updater(timestamp) {
    if (this.startTime === 0) {
      this.startTime = timestamp;
    }
    this.elapsed = timestamp - this.startTime;
    if (this.previousTimestamp !== timestamp) {
      this.target.value = this.initialValue + this.timeFunction(this.elapsed / this.animateDuration) * this.valueDistance;
    }
    if (!this.cancelled) {
      if (this.elapsed < this.animateDuration) {
        this.previousTimestamp = timestamp;
        requestAnimationFrame(this.updater.bind(this));
      } else {
        this.target.value = this.destValue;
        if (this.onFinishCallback)
          this.onFinishCallback();
      }
    }
  }
  onFinish(callback) {
    this.onFinishCallback = callback;
  }
  cancel() {
    clearTimeout(this.timerId);
    this.cancelled = true;
  }
}
function simpleAnimate(target) {
  return new Animated(target);
}
class Toaster {
  static show(message) {
    this.toast.emit(message);
  }
}
// public static onToast: ((message: string) => void) | null = null
__publicField(Toaster, "toast", createMutableSharedFlow());
function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}
const { toString } = Object.prototype;
const { getPrototypeOf } = Object;
const kindOf = ((cache) => (thing) => {
  const str = toString.call(thing);
  return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(/* @__PURE__ */ Object.create(null));
const kindOfTest = (type) => {
  type = type.toLowerCase();
  return (thing) => kindOf(thing) === type;
};
const typeOfTest = (type) => (thing) => typeof thing === type;
const { isArray } = Array;
const isUndefined = typeOfTest("undefined");
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}
const isArrayBuffer = kindOfTest("ArrayBuffer");
function isArrayBufferView(val) {
  let result;
  if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
    result = ArrayBuffer.isView(val);
  } else {
    result = val && val.buffer && isArrayBuffer(val.buffer);
  }
  return result;
}
const isString = typeOfTest("string");
const isFunction = typeOfTest("function");
const isNumber = typeOfTest("number");
const isObject = (thing) => thing !== null && typeof thing === "object";
const isBoolean = (thing) => thing === true || thing === false;
const isPlainObject = (val) => {
  if (kindOf(val) !== "object") {
    return false;
  }
  const prototype2 = getPrototypeOf(val);
  return (prototype2 === null || prototype2 === Object.prototype || Object.getPrototypeOf(prototype2) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
};
const isDate = kindOfTest("Date");
const isFile = kindOfTest("File");
const isBlob = kindOfTest("Blob");
const isFileList = kindOfTest("FileList");
const isStream = (val) => isObject(val) && isFunction(val.pipe);
const isFormData = (thing) => {
  const pattern = "[object FormData]";
  return thing && (typeof FormData === "function" && thing instanceof FormData || toString.call(thing) === pattern || isFunction(thing.toString) && thing.toString() === pattern);
};
const isURLSearchParams = kindOfTest("URLSearchParams");
const trim = (str) => str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function forEach(obj, fn, { allOwnKeys = false } = {}) {
  if (obj === null || typeof obj === "undefined") {
    return;
  }
  let i;
  let l;
  if (typeof obj !== "object") {
    obj = [obj];
  }
  if (isArray(obj)) {
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len = keys.length;
    let key2;
    for (i = 0; i < len; i++) {
      key2 = keys[i];
      fn.call(null, obj[key2], key2, obj);
    }
  }
}
function findKey(obj, key2) {
  key2 = key2.toLowerCase();
  const keys = Object.keys(obj);
  let i = keys.length;
  let _key;
  while (i-- > 0) {
    _key = keys[i];
    if (key2 === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}
const _global = (() => {
  if (typeof globalThis !== "undefined")
    return globalThis;
  return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
})();
const isContextDefined = (context) => !isUndefined(context) && context !== _global;
function merge() {
  const { caseless } = isContextDefined(this) && this || {};
  const result = {};
  const assignValue = (val, key2) => {
    const targetKey = caseless && findKey(result, key2) || key2;
    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
      result[targetKey] = merge(result[targetKey], val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray(val)) {
      result[targetKey] = val.slice();
    } else {
      result[targetKey] = val;
    }
  };
  for (let i = 0, l = arguments.length; i < l; i++) {
    arguments[i] && forEach(arguments[i], assignValue);
  }
  return result;
}
const extend = (a, b, thisArg, { allOwnKeys } = {}) => {
  forEach(b, (val, key2) => {
    if (thisArg && isFunction(val)) {
      a[key2] = bind(val, thisArg);
    } else {
      a[key2] = val;
    }
  }, { allOwnKeys });
  return a;
};
const stripBOM = (content) => {
  if (content.charCodeAt(0) === 65279) {
    content = content.slice(1);
  }
  return content;
};
const inherits = (constructor, superConstructor, props, descriptors2) => {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors2);
  constructor.prototype.constructor = constructor;
  Object.defineProperty(constructor, "super", {
    value: superConstructor.prototype
  });
  props && Object.assign(constructor.prototype, props);
};
const toFlatObject = (sourceObj, destObj, filter2, propFilter) => {
  let props;
  let i;
  let prop;
  const merged = {};
  destObj = destObj || {};
  if (sourceObj == null)
    return destObj;
  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter2 !== false && getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter2 || filter2(sourceObj, destObj)) && sourceObj !== Object.prototype);
  return destObj;
};
const endsWith = (str, searchString, position) => {
  str = String(str);
  if (position === void 0 || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  const lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
};
const toArray = (thing) => {
  if (!thing)
    return null;
  if (isArray(thing))
    return thing;
  let i = thing.length;
  if (!isNumber(i))
    return null;
  const arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
};
const isTypedArray = ((TypedArray) => {
  return (thing) => {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
const forEachEntry = (obj, fn) => {
  const generator = obj && obj[Symbol.iterator];
  const iterator = generator.call(obj);
  let result;
  while ((result = iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
};
const matchAll = (regExp, str) => {
  let matches;
  const arr = [];
  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }
  return arr;
};
const isHTMLForm = kindOfTest("HTMLFormElement");
const toCamelCase = (str) => {
  return str.toLowerCase().replace(
    /[-_\s]([a-z\d])(\w*)/g,
    function replacer2(m, p1, p2) {
      return p1.toUpperCase() + p2;
    }
  );
};
const hasOwnProperty = (({ hasOwnProperty: hasOwnProperty2 }) => (obj, prop) => hasOwnProperty2.call(obj, prop))(Object.prototype);
const isRegExp = kindOfTest("RegExp");
const reduceDescriptors = (obj, reducer) => {
  const descriptors2 = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors = {};
  forEach(descriptors2, (descriptor, name) => {
    if (reducer(descriptor, name, obj) !== false) {
      reducedDescriptors[name] = descriptor;
    }
  });
  Object.defineProperties(obj, reducedDescriptors);
};
const freezeMethods = (obj) => {
  reduceDescriptors(obj, (descriptor, name) => {
    if (isFunction(obj) && ["arguments", "caller", "callee"].indexOf(name) !== -1) {
      return false;
    }
    const value = obj[name];
    if (!isFunction(value))
      return;
    descriptor.enumerable = false;
    if ("writable" in descriptor) {
      descriptor.writable = false;
      return;
    }
    if (!descriptor.set) {
      descriptor.set = () => {
        throw Error("Can not rewrite read-only method '" + name + "'");
      };
    }
  });
};
const toObjectSet = (arrayOrString, delimiter) => {
  const obj = {};
  const define = (arr) => {
    arr.forEach((value) => {
      obj[value] = true;
    });
  };
  isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));
  return obj;
};
const noop = () => {
};
const toFiniteNumber = (value, defaultValue) => {
  value = +value;
  return Number.isFinite(value) ? value : defaultValue;
};
const ALPHA = "abcdefghijklmnopqrstuvwxyz";
const DIGIT = "0123456789";
const ALPHABET = {
  DIGIT,
  ALPHA,
  ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT
};
const generateString = (size2 = 16, alphabet = ALPHABET.ALPHA_DIGIT) => {
  let str = "";
  const { length } = alphabet;
  while (size2--) {
    str += alphabet[Math.random() * length | 0];
  }
  return str;
};
function isSpecCompliantForm(thing) {
  return !!(thing && isFunction(thing.append) && thing[Symbol.toStringTag] === "FormData" && thing[Symbol.iterator]);
}
const toJSONObject = (obj) => {
  const stack = new Array(10);
  const visit = (source, i) => {
    if (isObject(source)) {
      if (stack.indexOf(source) >= 0) {
        return;
      }
      if (!("toJSON" in source)) {
        stack[i] = source;
        const target = isArray(source) ? [] : {};
        forEach(source, (value, key2) => {
          const reducedValue = visit(value, i + 1);
          !isUndefined(reducedValue) && (target[key2] = reducedValue);
        });
        stack[i] = void 0;
        return target;
      }
    }
    return source;
  };
  return visit(obj, 0);
};
const utils = {
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isPlainObject,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isRegExp,
  isFunction,
  isStream,
  isURLSearchParams,
  isTypedArray,
  isFileList,
  forEach,
  merge,
  extend,
  trim,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray,
  forEachEntry,
  matchAll,
  isHTMLForm,
  hasOwnProperty,
  hasOwnProp: hasOwnProperty,
  // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors,
  freezeMethods,
  toObjectSet,
  toCamelCase,
  noop,
  toFiniteNumber,
  findKey,
  global: _global,
  isContextDefined,
  ALPHABET,
  generateString,
  isSpecCompliantForm,
  toJSONObject
};
function AxiosError(message, code, config, request, response) {
  Error.call(this);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = new Error().stack;
  }
  this.message = message;
  this.name = "AxiosError";
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  response && (this.response = response);
}
utils.inherits(AxiosError, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: utils.toJSONObject(this.config),
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  }
});
const prototype$1 = AxiosError.prototype;
const descriptors = {};
[
  "ERR_BAD_OPTION_VALUE",
  "ERR_BAD_OPTION",
  "ECONNABORTED",
  "ETIMEDOUT",
  "ERR_NETWORK",
  "ERR_FR_TOO_MANY_REDIRECTS",
  "ERR_DEPRECATED",
  "ERR_BAD_RESPONSE",
  "ERR_BAD_REQUEST",
  "ERR_CANCELED",
  "ERR_NOT_SUPPORT",
  "ERR_INVALID_URL"
  // eslint-disable-next-line func-names
].forEach((code) => {
  descriptors[code] = { value: code };
});
Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(prototype$1, "isAxiosError", { value: true });
AxiosError.from = (error, code, config, request, response, customProps) => {
  const axiosError = Object.create(prototype$1);
  utils.toFlatObject(error, axiosError, function filter2(obj) {
    return obj !== Error.prototype;
  }, (prop) => {
    return prop !== "isAxiosError";
  });
  AxiosError.call(axiosError, error.message, code, config, request, response);
  axiosError.cause = error;
  axiosError.name = error.name;
  customProps && Object.assign(axiosError, customProps);
  return axiosError;
};
const httpAdapter = null;
function isVisitable(thing) {
  return utils.isPlainObject(thing) || utils.isArray(thing);
}
function removeBrackets(key2) {
  return utils.endsWith(key2, "[]") ? key2.slice(0, -2) : key2;
}
function renderKey(path, key2, dots) {
  if (!path)
    return key2;
  return path.concat(key2).map(function each(token, i) {
    token = removeBrackets(token);
    return !dots && i ? "[" + token + "]" : token;
  }).join(dots ? "." : "");
}
function isFlatArray(arr) {
  return utils.isArray(arr) && !arr.some(isVisitable);
}
const predicates = utils.toFlatObject(utils, {}, null, function filter(prop) {
  return /^is[A-Z]/.test(prop);
});
function toFormData(obj, formData, options) {
  if (!utils.isObject(obj)) {
    throw new TypeError("target must be an object");
  }
  formData = formData || new FormData();
  options = utils.toFlatObject(options, {
    metaTokens: true,
    dots: false,
    indexes: false
  }, false, function defined(option, source) {
    return !utils.isUndefined(source[option]);
  });
  const metaTokens = options.metaTokens;
  const visitor = options.visitor || defaultVisitor;
  const dots = options.dots;
  const indexes = options.indexes;
  const _Blob = options.Blob || typeof Blob !== "undefined" && Blob;
  const useBlob = _Blob && utils.isSpecCompliantForm(formData);
  if (!utils.isFunction(visitor)) {
    throw new TypeError("visitor must be a function");
  }
  function convertValue(value) {
    if (value === null)
      return "";
    if (utils.isDate(value)) {
      return value.toISOString();
    }
    if (!useBlob && utils.isBlob(value)) {
      throw new AxiosError("Blob is not supported. Use a Buffer instead.");
    }
    if (utils.isArrayBuffer(value) || utils.isTypedArray(value)) {
      return useBlob && typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
    }
    return value;
  }
  function defaultVisitor(value, key2, path) {
    let arr = value;
    if (value && !path && typeof value === "object") {
      if (utils.endsWith(key2, "{}")) {
        key2 = metaTokens ? key2 : key2.slice(0, -2);
        value = JSON.stringify(value);
      } else if (utils.isArray(value) && isFlatArray(value) || (utils.isFileList(value) || utils.endsWith(key2, "[]")) && (arr = utils.toArray(value))) {
        key2 = removeBrackets(key2);
        arr.forEach(function each(el, index) {
          !(utils.isUndefined(el) || el === null) && formData.append(
            // eslint-disable-next-line no-nested-ternary
            indexes === true ? renderKey([key2], index, dots) : indexes === null ? key2 : key2 + "[]",
            convertValue(el)
          );
        });
        return false;
      }
    }
    if (isVisitable(value)) {
      return true;
    }
    formData.append(renderKey(path, key2, dots), convertValue(value));
    return false;
  }
  const stack = [];
  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable
  });
  function build(value, path) {
    if (utils.isUndefined(value))
      return;
    if (stack.indexOf(value) !== -1) {
      throw Error("Circular reference detected in " + path.join("."));
    }
    stack.push(value);
    utils.forEach(value, function each(el, key2) {
      const result = !(utils.isUndefined(el) || el === null) && visitor.call(
        formData,
        el,
        utils.isString(key2) ? key2.trim() : key2,
        path,
        exposedHelpers
      );
      if (result === true) {
        build(el, path ? path.concat(key2) : [key2]);
      }
    });
    stack.pop();
  }
  if (!utils.isObject(obj)) {
    throw new TypeError("data must be an object");
  }
  build(obj);
  return formData;
}
function encode$1(str) {
  const charMap = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+",
    "%00": "\0"
  };
  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer2(match) {
    return charMap[match];
  });
}
function AxiosURLSearchParams(params, options) {
  this._pairs = [];
  params && toFormData(params, this, options);
}
const prototype = AxiosURLSearchParams.prototype;
prototype.append = function append(name, value) {
  this._pairs.push([name, value]);
};
prototype.toString = function toString2(encoder) {
  const _encode = encoder ? function(value) {
    return encoder.call(this, value, encode$1);
  } : encode$1;
  return this._pairs.map(function each(pair) {
    return _encode(pair[0]) + "=" + _encode(pair[1]);
  }, "").join("&");
};
function encode(val) {
  return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
}
function buildURL(url2, params, options) {
  if (!params) {
    return url2;
  }
  const _encode = options && options.encode || encode;
  const serializeFn = options && options.serialize;
  let serializedParams;
  if (serializeFn) {
    serializedParams = serializeFn(params, options);
  } else {
    serializedParams = utils.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams(params, options).toString(_encode);
  }
  if (serializedParams) {
    const hashmarkIndex = url2.indexOf("#");
    if (hashmarkIndex !== -1) {
      url2 = url2.slice(0, hashmarkIndex);
    }
    url2 += (url2.indexOf("?") === -1 ? "?" : "&") + serializedParams;
  }
  return url2;
}
class InterceptorManager {
  constructor() {
    this.handlers = [];
  }
  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  }
  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(id2) {
    if (this.handlers[id2]) {
      this.handlers[id2] = null;
    }
  }
  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }
  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(fn) {
    utils.forEach(this.handlers, function forEachHandler(h2) {
      if (h2 !== null) {
        fn(h2);
      }
    });
  }
}
const InterceptorManager$1 = InterceptorManager;
const transitionalDefaults = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
};
const URLSearchParams$1 = typeof URLSearchParams !== "undefined" ? URLSearchParams : AxiosURLSearchParams;
const FormData$1 = typeof FormData !== "undefined" ? FormData : null;
const Blob$1 = typeof Blob !== "undefined" ? Blob : null;
const isStandardBrowserEnv = (() => {
  let product;
  if (typeof navigator !== "undefined" && ((product = navigator.product) === "ReactNative" || product === "NativeScript" || product === "NS")) {
    return false;
  }
  return typeof window !== "undefined" && typeof document !== "undefined";
})();
const isStandardBrowserWebWorkerEnv = (() => {
  return typeof WorkerGlobalScope !== "undefined" && // eslint-disable-next-line no-undef
  self instanceof WorkerGlobalScope && typeof self.importScripts === "function";
})();
const platform = {
  isBrowser: true,
  classes: {
    URLSearchParams: URLSearchParams$1,
    FormData: FormData$1,
    Blob: Blob$1
  },
  isStandardBrowserEnv,
  isStandardBrowserWebWorkerEnv,
  protocols: ["http", "https", "file", "blob", "url", "data"]
};
function toURLEncodedForm(data, options) {
  return toFormData(data, new platform.classes.URLSearchParams(), Object.assign({
    visitor: function(value, key2, path, helpers) {
      if (platform.isNode && utils.isBuffer(value)) {
        this.append(key2, value.toString("base64"));
        return false;
      }
      return helpers.defaultVisitor.apply(this, arguments);
    }
  }, options));
}
function parsePropPath(name) {
  return utils.matchAll(/\w+|\[(\w*)]/g, name).map((match) => {
    return match[0] === "[]" ? "" : match[1] || match[0];
  });
}
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i;
  const len = keys.length;
  let key2;
  for (i = 0; i < len; i++) {
    key2 = keys[i];
    obj[key2] = arr[key2];
  }
  return obj;
}
function formDataToJSON(formData) {
  function buildPath(path, value, target, index) {
    let name = path[index++];
    const isNumericKey = Number.isFinite(+name);
    const isLast = index >= path.length;
    name = !name && utils.isArray(target) ? target.length : name;
    if (isLast) {
      if (utils.hasOwnProp(target, name)) {
        target[name] = [target[name], value];
      } else {
        target[name] = value;
      }
      return !isNumericKey;
    }
    if (!target[name] || !utils.isObject(target[name])) {
      target[name] = [];
    }
    const result = buildPath(path, value, target[name], index);
    if (result && utils.isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }
    return !isNumericKey;
  }
  if (utils.isFormData(formData) && utils.isFunction(formData.entries)) {
    const obj = {};
    utils.forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });
    return obj;
  }
  return null;
}
const DEFAULT_CONTENT_TYPE = {
  "Content-Type": void 0
};
function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== "SyntaxError") {
        throw e;
      }
    }
  }
  return (encoder || JSON.stringify)(rawValue);
}
const defaults = {
  transitional: transitionalDefaults,
  adapter: ["xhr", "http"],
  transformRequest: [function transformRequest(data, headers) {
    const contentType = headers.getContentType() || "";
    const hasJSONContentType = contentType.indexOf("application/json") > -1;
    const isObjectPayload = utils.isObject(data);
    if (isObjectPayload && utils.isHTMLForm(data)) {
      data = new FormData(data);
    }
    const isFormData2 = utils.isFormData(data);
    if (isFormData2) {
      if (!hasJSONContentType) {
        return data;
      }
      return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
    }
    if (utils.isArrayBuffer(data) || utils.isBuffer(data) || utils.isStream(data) || utils.isFile(data) || utils.isBlob(data)) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);
      return data.toString();
    }
    let isFileList2;
    if (isObjectPayload) {
      if (contentType.indexOf("application/x-www-form-urlencoded") > -1) {
        return toURLEncodedForm(data, this.formSerializer).toString();
      }
      if ((isFileList2 = utils.isFileList(data)) || contentType.indexOf("multipart/form-data") > -1) {
        const _FormData = this.env && this.env.FormData;
        return toFormData(
          isFileList2 ? { "files[]": data } : data,
          _FormData && new _FormData(),
          this.formSerializer
        );
      }
    }
    if (isObjectPayload || hasJSONContentType) {
      headers.setContentType("application/json", false);
      return stringifySafely(data);
    }
    return data;
  }],
  transformResponse: [function transformResponse(data) {
    const transitional2 = this.transitional || defaults.transitional;
    const forcedJSONParsing = transitional2 && transitional2.forcedJSONParsing;
    const JSONRequested = this.responseType === "json";
    if (data && utils.isString(data) && (forcedJSONParsing && !this.responseType || JSONRequested)) {
      const silentJSONParsing = transitional2 && transitional2.silentJSONParsing;
      const strictJSONParsing = !silentJSONParsing && JSONRequested;
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === "SyntaxError") {
            throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }
    return data;
  }],
  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  env: {
    FormData: platform.classes.FormData,
    Blob: platform.classes.Blob
  },
  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },
  headers: {
    common: {
      "Accept": "application/json, text/plain, */*"
    }
  }
};
utils.forEach(["delete", "get", "head"], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});
utils.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});
const defaults$1 = defaults;
const ignoreDuplicateOf = utils.toObjectSet([
  "age",
  "authorization",
  "content-length",
  "content-type",
  "etag",
  "expires",
  "from",
  "host",
  "if-modified-since",
  "if-unmodified-since",
  "last-modified",
  "location",
  "max-forwards",
  "proxy-authorization",
  "referer",
  "retry-after",
  "user-agent"
]);
const parseHeaders = (rawHeaders) => {
  const parsed = {};
  let key2;
  let val;
  let i;
  rawHeaders && rawHeaders.split("\n").forEach(function parser(line) {
    i = line.indexOf(":");
    key2 = line.substring(0, i).trim().toLowerCase();
    val = line.substring(i + 1).trim();
    if (!key2 || parsed[key2] && ignoreDuplicateOf[key2]) {
      return;
    }
    if (key2 === "set-cookie") {
      if (parsed[key2]) {
        parsed[key2].push(val);
      } else {
        parsed[key2] = [val];
      }
    } else {
      parsed[key2] = parsed[key2] ? parsed[key2] + ", " + val : val;
    }
  });
  return parsed;
};
const $internals = Symbol("internals");
function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}
function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }
  return utils.isArray(value) ? value.map(normalizeValue) : String(value);
}
function parseTokens(str) {
  const tokens = /* @__PURE__ */ Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;
  while (match = tokensRE.exec(str)) {
    tokens[match[1]] = match[2];
  }
  return tokens;
}
function isValidHeaderName(str) {
  return /^[-_a-zA-Z]+$/.test(str.trim());
}
function matchHeaderValue(context, value, header, filter2, isHeaderNameFilter) {
  if (utils.isFunction(filter2)) {
    return filter2.call(this, value, header);
  }
  if (isHeaderNameFilter) {
    value = header;
  }
  if (!utils.isString(value))
    return;
  if (utils.isString(filter2)) {
    return value.indexOf(filter2) !== -1;
  }
  if (utils.isRegExp(filter2)) {
    return filter2.test(value);
  }
}
function formatHeader(header) {
  return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
    return char.toUpperCase() + str;
  });
}
function buildAccessors(obj, header) {
  const accessorName = utils.toCamelCase(" " + header);
  ["get", "set", "has"].forEach((methodName) => {
    Object.defineProperty(obj, methodName + accessorName, {
      value: function(arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true
    });
  });
}
class AxiosHeaders {
  constructor(headers) {
    headers && this.set(headers);
  }
  set(header, valueOrRewrite, rewrite) {
    const self2 = this;
    function setHeader(_value, _header, _rewrite) {
      const lHeader = normalizeHeader(_header);
      if (!lHeader) {
        throw new Error("header name must be a non-empty string");
      }
      const key2 = utils.findKey(self2, lHeader);
      if (!key2 || self2[key2] === void 0 || _rewrite === true || _rewrite === void 0 && self2[key2] !== false) {
        self2[key2 || _header] = normalizeValue(_value);
      }
    }
    const setHeaders = (headers, _rewrite) => utils.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));
    if (utils.isPlainObject(header) || header instanceof this.constructor) {
      setHeaders(header, valueOrRewrite);
    } else if (utils.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
      setHeaders(parseHeaders(header), valueOrRewrite);
    } else {
      header != null && setHeader(valueOrRewrite, header, rewrite);
    }
    return this;
  }
  get(header, parser) {
    header = normalizeHeader(header);
    if (header) {
      const key2 = utils.findKey(this, header);
      if (key2) {
        const value = this[key2];
        if (!parser) {
          return value;
        }
        if (parser === true) {
          return parseTokens(value);
        }
        if (utils.isFunction(parser)) {
          return parser.call(this, value, key2);
        }
        if (utils.isRegExp(parser)) {
          return parser.exec(value);
        }
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(header, matcher) {
    header = normalizeHeader(header);
    if (header) {
      const key2 = utils.findKey(this, header);
      return !!(key2 && this[key2] !== void 0 && (!matcher || matchHeaderValue(this, this[key2], key2, matcher)));
    }
    return false;
  }
  delete(header, matcher) {
    const self2 = this;
    let deleted = false;
    function deleteHeader(_header) {
      _header = normalizeHeader(_header);
      if (_header) {
        const key2 = utils.findKey(self2, _header);
        if (key2 && (!matcher || matchHeaderValue(self2, self2[key2], key2, matcher))) {
          delete self2[key2];
          deleted = true;
        }
      }
    }
    if (utils.isArray(header)) {
      header.forEach(deleteHeader);
    } else {
      deleteHeader(header);
    }
    return deleted;
  }
  clear(matcher) {
    const keys = Object.keys(this);
    let i = keys.length;
    let deleted = false;
    while (i--) {
      const key2 = keys[i];
      if (!matcher || matchHeaderValue(this, this[key2], key2, matcher, true)) {
        delete this[key2];
        deleted = true;
      }
    }
    return deleted;
  }
  normalize(format) {
    const self2 = this;
    const headers = {};
    utils.forEach(this, (value, header) => {
      const key2 = utils.findKey(headers, header);
      if (key2) {
        self2[key2] = normalizeValue(value);
        delete self2[header];
        return;
      }
      const normalized = format ? formatHeader(header) : String(header).trim();
      if (normalized !== header) {
        delete self2[header];
      }
      self2[normalized] = normalizeValue(value);
      headers[normalized] = true;
    });
    return this;
  }
  concat(...targets) {
    return this.constructor.concat(this, ...targets);
  }
  toJSON(asStrings) {
    const obj = /* @__PURE__ */ Object.create(null);
    utils.forEach(this, (value, header) => {
      value != null && value !== false && (obj[header] = asStrings && utils.isArray(value) ? value.join(", ") : value);
    });
    return obj;
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON()).map(([header, value]) => header + ": " + value).join("\n");
  }
  get [Symbol.toStringTag]() {
    return "AxiosHeaders";
  }
  static from(thing) {
    return thing instanceof this ? thing : new this(thing);
  }
  static concat(first, ...targets) {
    const computed2 = new this(first);
    targets.forEach((target) => computed2.set(target));
    return computed2;
  }
  static accessor(header) {
    const internals = this[$internals] = this[$internals] = {
      accessors: {}
    };
    const accessors = internals.accessors;
    const prototype2 = this.prototype;
    function defineAccessor(_header) {
      const lHeader = normalizeHeader(_header);
      if (!accessors[lHeader]) {
        buildAccessors(prototype2, _header);
        accessors[lHeader] = true;
      }
    }
    utils.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
    return this;
  }
}
AxiosHeaders.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
utils.freezeMethods(AxiosHeaders.prototype);
utils.freezeMethods(AxiosHeaders);
const AxiosHeaders$1 = AxiosHeaders;
function transformData(fns, response) {
  const config = this || defaults$1;
  const context = response || config;
  const headers = AxiosHeaders$1.from(context.headers);
  let data = context.data;
  utils.forEach(fns, function transform(fn) {
    data = fn.call(config, data, headers.normalize(), response ? response.status : void 0);
  });
  headers.normalize();
  return data;
}
function isCancel(value) {
  return !!(value && value.__CANCEL__);
}
function CanceledError(message, config, request) {
  AxiosError.call(this, message == null ? "canceled" : message, AxiosError.ERR_CANCELED, config, request);
  this.name = "CanceledError";
}
utils.inherits(CanceledError, AxiosError, {
  __CANCEL__: true
});
function settle(resolve2, reject, response) {
  const validateStatus2 = response.config.validateStatus;
  if (!response.status || !validateStatus2 || validateStatus2(response.status)) {
    resolve2(response);
  } else {
    reject(new AxiosError(
      "Request failed with status code " + response.status,
      [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
}
const cookies = platform.isStandardBrowserEnv ? (
  // Standard browser envs support document.cookie
  function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        const cookie = [];
        cookie.push(name + "=" + encodeURIComponent(value));
        if (utils.isNumber(expires)) {
          cookie.push("expires=" + new Date(expires).toGMTString());
        }
        if (utils.isString(path)) {
          cookie.push("path=" + path);
        }
        if (utils.isString(domain)) {
          cookie.push("domain=" + domain);
        }
        if (secure === true) {
          cookie.push("secure");
        }
        document.cookie = cookie.join("; ");
      },
      read: function read(name) {
        const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
        return match ? decodeURIComponent(match[3]) : null;
      },
      remove: function remove2(name) {
        this.write(name, "", Date.now() - 864e5);
      }
    };
  }()
) : (
  // Non standard browser env (web workers, react-native) lack needed support.
  function nonStandardBrowserEnv() {
    return {
      write: function write() {
      },
      read: function read() {
        return null;
      },
      remove: function remove2() {
      }
    };
  }()
);
function isAbsoluteURL(url2) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url2);
}
function combineURLs(baseURL, relativeURL) {
  return relativeURL ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
}
function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}
const isURLSameOrigin = platform.isStandardBrowserEnv ? (
  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  function standardBrowserEnv2() {
    const msie = /(msie|trident)/i.test(navigator.userAgent);
    const urlParsingNode = document.createElement("a");
    let originURL;
    function resolveURL(url2) {
      let href = url2;
      if (msie) {
        urlParsingNode.setAttribute("href", href);
        href = urlParsingNode.href;
      }
      urlParsingNode.setAttribute("href", href);
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, "") : "",
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, "") : "",
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, "") : "",
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: urlParsingNode.pathname.charAt(0) === "/" ? urlParsingNode.pathname : "/" + urlParsingNode.pathname
      };
    }
    originURL = resolveURL(window.location.href);
    return function isURLSameOrigin2(requestURL) {
      const parsed = utils.isString(requestURL) ? resolveURL(requestURL) : requestURL;
      return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
    };
  }()
) : (
  // Non standard browser envs (web workers, react-native) lack needed support.
  function nonStandardBrowserEnv2() {
    return function isURLSameOrigin2() {
      return true;
    };
  }()
);
function parseProtocol(url2) {
  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url2);
  return match && match[1] || "";
}
function speedometer(samplesCount, min) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;
  min = min !== void 0 ? min : 1e3;
  return function push(chunkLength) {
    const now = Date.now();
    const startedAt = timestamps[tail];
    if (!firstSampleTS) {
      firstSampleTS = now;
    }
    bytes[head] = chunkLength;
    timestamps[head] = now;
    let i = tail;
    let bytesCount = 0;
    while (i !== head) {
      bytesCount += bytes[i++];
      i = i % samplesCount;
    }
    head = (head + 1) % samplesCount;
    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }
    if (now - firstSampleTS < min) {
      return;
    }
    const passed = startedAt && now - startedAt;
    return passed ? Math.round(bytesCount * 1e3 / passed) : void 0;
  };
}
function progressEventReducer(listener, isDownloadStream) {
  let bytesNotified = 0;
  const _speedometer = speedometer(50, 250);
  return (e) => {
    const loaded = e.loaded;
    const total = e.lengthComputable ? e.total : void 0;
    const progressBytes = loaded - bytesNotified;
    const rate = _speedometer(progressBytes);
    const inRange = loaded <= total;
    bytesNotified = loaded;
    const data = {
      loaded,
      total,
      progress: total ? loaded / total : void 0,
      bytes: progressBytes,
      rate: rate ? rate : void 0,
      estimated: rate && total && inRange ? (total - loaded) / rate : void 0,
      event: e
    };
    data[isDownloadStream ? "download" : "upload"] = true;
    listener(data);
  };
}
const isXHRAdapterSupported = typeof XMLHttpRequest !== "undefined";
const xhrAdapter = isXHRAdapterSupported && function(config) {
  return new Promise(function dispatchXhrRequest(resolve2, reject) {
    let requestData = config.data;
    const requestHeaders = AxiosHeaders$1.from(config.headers).normalize();
    const responseType = config.responseType;
    let onCanceled;
    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled);
      }
      if (config.signal) {
        config.signal.removeEventListener("abort", onCanceled);
      }
    }
    if (utils.isFormData(requestData) && (platform.isStandardBrowserEnv || platform.isStandardBrowserWebWorkerEnv)) {
      requestHeaders.setContentType(false);
    }
    let request = new XMLHttpRequest();
    if (config.auth) {
      const username = config.auth.username || "";
      const password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : "";
      requestHeaders.set("Authorization", "Basic " + btoa(username + ":" + password));
    }
    const fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);
    request.timeout = config.timeout;
    function onloadend() {
      if (!request) {
        return;
      }
      const responseHeaders = AxiosHeaders$1.from(
        "getAllResponseHeaders" in request && request.getAllResponseHeaders()
      );
      const responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      };
      settle(function _resolve(value) {
        resolve2(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);
      request = null;
    }
    if ("onloadend" in request) {
      request.onloadend = onloadend;
    } else {
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
          return;
        }
        setTimeout(onloadend);
      };
    }
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }
      reject(new AxiosError("Request aborted", AxiosError.ECONNABORTED, config, request));
      request = null;
    };
    request.onerror = function handleError2() {
      reject(new AxiosError("Network Error", AxiosError.ERR_NETWORK, config, request));
      request = null;
    };
    request.ontimeout = function handleTimeout() {
      let timeoutErrorMessage = config.timeout ? "timeout of " + config.timeout + "ms exceeded" : "timeout exceeded";
      const transitional2 = config.transitional || transitionalDefaults;
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(new AxiosError(
        timeoutErrorMessage,
        transitional2.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
        config,
        request
      ));
      request = null;
    };
    if (platform.isStandardBrowserEnv) {
      const xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName && cookies.read(config.xsrfCookieName);
      if (xsrfValue) {
        requestHeaders.set(config.xsrfHeaderName, xsrfValue);
      }
    }
    requestData === void 0 && requestHeaders.setContentType(null);
    if ("setRequestHeader" in request) {
      utils.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key2) {
        request.setRequestHeader(key2, val);
      });
    }
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }
    if (responseType && responseType !== "json") {
      request.responseType = config.responseType;
    }
    if (typeof config.onDownloadProgress === "function") {
      request.addEventListener("progress", progressEventReducer(config.onDownloadProgress, true));
    }
    if (typeof config.onUploadProgress === "function" && request.upload) {
      request.upload.addEventListener("progress", progressEventReducer(config.onUploadProgress));
    }
    if (config.cancelToken || config.signal) {
      onCanceled = (cancel) => {
        if (!request) {
          return;
        }
        reject(!cancel || cancel.type ? new CanceledError(null, config, request) : cancel);
        request.abort();
        request = null;
      };
      config.cancelToken && config.cancelToken.subscribe(onCanceled);
      if (config.signal) {
        config.signal.aborted ? onCanceled() : config.signal.addEventListener("abort", onCanceled);
      }
    }
    const protocol = parseProtocol(fullPath);
    if (protocol && platform.protocols.indexOf(protocol) === -1) {
      reject(new AxiosError("Unsupported protocol " + protocol + ":", AxiosError.ERR_BAD_REQUEST, config));
      return;
    }
    request.send(requestData || null);
  });
};
const knownAdapters = {
  http: httpAdapter,
  xhr: xhrAdapter
};
utils.forEach(knownAdapters, (fn, value) => {
  if (fn) {
    try {
      Object.defineProperty(fn, "name", { value });
    } catch (e) {
    }
    Object.defineProperty(fn, "adapterName", { value });
  }
});
const adapters = {
  getAdapter: (adapters2) => {
    adapters2 = utils.isArray(adapters2) ? adapters2 : [adapters2];
    const { length } = adapters2;
    let nameOrAdapter;
    let adapter;
    for (let i = 0; i < length; i++) {
      nameOrAdapter = adapters2[i];
      if (adapter = utils.isString(nameOrAdapter) ? knownAdapters[nameOrAdapter.toLowerCase()] : nameOrAdapter) {
        break;
      }
    }
    if (!adapter) {
      if (adapter === false) {
        throw new AxiosError(
          `Adapter ${nameOrAdapter} is not supported by the environment`,
          "ERR_NOT_SUPPORT"
        );
      }
      throw new Error(
        utils.hasOwnProp(knownAdapters, nameOrAdapter) ? `Adapter '${nameOrAdapter}' is not available in the build` : `Unknown adapter '${nameOrAdapter}'`
      );
    }
    if (!utils.isFunction(adapter)) {
      throw new TypeError("adapter is not a function");
    }
    return adapter;
  },
  adapters: knownAdapters
};
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
  if (config.signal && config.signal.aborted) {
    throw new CanceledError(null, config);
  }
}
function dispatchRequest(config) {
  throwIfCancellationRequested(config);
  config.headers = AxiosHeaders$1.from(config.headers);
  config.data = transformData.call(
    config,
    config.transformRequest
  );
  if (["post", "put", "patch"].indexOf(config.method) !== -1) {
    config.headers.setContentType("application/x-www-form-urlencoded", false);
  }
  const adapter = adapters.getAdapter(config.adapter || defaults$1.adapter);
  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);
    response.data = transformData.call(
      config,
      config.transformResponse,
      response
    );
    response.headers = AxiosHeaders$1.from(response.headers);
    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          config.transformResponse,
          reason.response
        );
        reason.response.headers = AxiosHeaders$1.from(reason.response.headers);
      }
    }
    return Promise.reject(reason);
  });
}
const headersToObject = (thing) => thing instanceof AxiosHeaders$1 ? thing.toJSON() : thing;
function mergeConfig(config1, config2) {
  config2 = config2 || {};
  const config = {};
  function getMergedValue(target, source, caseless) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge.call({ caseless }, target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }
  function mergeDeepProperties(a, b, caseless) {
    if (!utils.isUndefined(b)) {
      return getMergedValue(a, b, caseless);
    } else if (!utils.isUndefined(a)) {
      return getMergedValue(void 0, a, caseless);
    }
  }
  function valueFromConfig2(a, b) {
    if (!utils.isUndefined(b)) {
      return getMergedValue(void 0, b);
    }
  }
  function defaultToConfig2(a, b) {
    if (!utils.isUndefined(b)) {
      return getMergedValue(void 0, b);
    } else if (!utils.isUndefined(a)) {
      return getMergedValue(void 0, a);
    }
  }
  function mergeDirectKeys(a, b, prop) {
    if (prop in config2) {
      return getMergedValue(a, b);
    } else if (prop in config1) {
      return getMergedValue(void 0, a);
    }
  }
  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a, b) => mergeDeepProperties(headersToObject(a), headersToObject(b), true)
  };
  utils.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
    const merge2 = mergeMap[prop] || mergeDeepProperties;
    const configValue = merge2(config1[prop], config2[prop], prop);
    utils.isUndefined(configValue) && merge2 !== mergeDirectKeys || (config[prop] = configValue);
  });
  return config;
}
const VERSION = "1.3.4";
const validators$1 = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach((type, i) => {
  validators$1[type] = function validator2(thing) {
    return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
  };
});
const deprecatedWarnings = {};
validators$1.transitional = function transitional(validator2, version2, message) {
  function formatMessage(opt, desc) {
    return "[Axios v" + VERSION + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
  }
  return (value, opt, opts) => {
    if (validator2 === false) {
      throw new AxiosError(
        formatMessage(opt, " has been removed" + (version2 ? " in " + version2 : "")),
        AxiosError.ERR_DEPRECATED
      );
    }
    if (version2 && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      console.warn(
        formatMessage(
          opt,
          " has been deprecated since v" + version2 + " and will be removed in the near future"
        )
      );
    }
    return validator2 ? validator2(value, opt, opts) : true;
  };
};
function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== "object") {
    throw new AxiosError("options must be an object", AxiosError.ERR_BAD_OPTION_VALUE);
  }
  const keys = Object.keys(options);
  let i = keys.length;
  while (i-- > 0) {
    const opt = keys[i];
    const validator2 = schema[opt];
    if (validator2) {
      const value = options[opt];
      const result = value === void 0 || validator2(value, opt, options);
      if (result !== true) {
        throw new AxiosError("option " + opt + " must be " + result, AxiosError.ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new AxiosError("Unknown option " + opt, AxiosError.ERR_BAD_OPTION);
    }
  }
}
const validator = {
  assertOptions,
  validators: validators$1
};
const validators = validator.validators;
class Axios {
  constructor(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new InterceptorManager$1(),
      response: new InterceptorManager$1()
    };
  }
  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  request(configOrUrl, config) {
    if (typeof configOrUrl === "string") {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }
    config = mergeConfig(this.defaults, config);
    const { transitional: transitional2, paramsSerializer, headers } = config;
    if (transitional2 !== void 0) {
      validator.assertOptions(transitional2, {
        silentJSONParsing: validators.transitional(validators.boolean),
        forcedJSONParsing: validators.transitional(validators.boolean),
        clarifyTimeoutError: validators.transitional(validators.boolean)
      }, false);
    }
    if (paramsSerializer !== void 0) {
      validator.assertOptions(paramsSerializer, {
        encode: validators.function,
        serialize: validators.function
      }, true);
    }
    config.method = (config.method || this.defaults.method || "get").toLowerCase();
    let contextHeaders;
    contextHeaders = headers && utils.merge(
      headers.common,
      headers[config.method]
    );
    contextHeaders && utils.forEach(
      ["delete", "get", "head", "post", "put", "patch", "common"],
      (method) => {
        delete headers[method];
      }
    );
    config.headers = AxiosHeaders$1.concat(contextHeaders, headers);
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) {
        return;
      }
      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });
    const responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });
    let promise;
    let i = 0;
    let len;
    if (!synchronousRequestInterceptors) {
      const chain = [dispatchRequest.bind(this), void 0];
      chain.unshift.apply(chain, requestInterceptorChain);
      chain.push.apply(chain, responseInterceptorChain);
      len = chain.length;
      promise = Promise.resolve(config);
      while (i < len) {
        promise = promise.then(chain[i++], chain[i++]);
      }
      return promise;
    }
    len = requestInterceptorChain.length;
    let newConfig = config;
    i = 0;
    while (i < len) {
      const onFulfilled = requestInterceptorChain[i++];
      const onRejected = requestInterceptorChain[i++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected.call(this, error);
        break;
      }
    }
    try {
      promise = dispatchRequest.call(this, newConfig);
    } catch (error) {
      return Promise.reject(error);
    }
    i = 0;
    len = responseInterceptorChain.length;
    while (i < len) {
      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
    }
    return promise;
  }
  getUri(config) {
    config = mergeConfig(this.defaults, config);
    const fullPath = buildFullPath(config.baseURL, config.url);
    return buildURL(fullPath, config.params, config.paramsSerializer);
  }
}
utils.forEach(["delete", "get", "head", "options"], function forEachMethodNoData2(method) {
  Axios.prototype[method] = function(url2, config) {
    return this.request(mergeConfig(config || {}, {
      method,
      url: url2,
      data: (config || {}).data
    }));
  };
});
utils.forEach(["post", "put", "patch"], function forEachMethodWithData2(method) {
  function generateHTTPMethod(isForm) {
    return function httpMethod(url2, data, config) {
      return this.request(mergeConfig(config || {}, {
        method,
        headers: isForm ? {
          "Content-Type": "multipart/form-data"
        } : {},
        url: url2,
        data
      }));
    };
  }
  Axios.prototype[method] = generateHTTPMethod();
  Axios.prototype[method + "Form"] = generateHTTPMethod(true);
});
const Axios$1 = Axios;
class CancelToken {
  constructor(executor) {
    if (typeof executor !== "function") {
      throw new TypeError("executor must be a function.");
    }
    let resolvePromise;
    this.promise = new Promise(function promiseExecutor(resolve2) {
      resolvePromise = resolve2;
    });
    const token = this;
    this.promise.then((cancel) => {
      if (!token._listeners)
        return;
      let i = token._listeners.length;
      while (i-- > 0) {
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });
    this.promise.then = (onfulfilled) => {
      let _resolve;
      const promise = new Promise((resolve2) => {
        token.subscribe(resolve2);
        _resolve = resolve2;
      }).then(onfulfilled);
      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };
      return promise;
    };
    executor(function cancel(message, config, request) {
      if (token.reason) {
        return;
      }
      token.reason = new CanceledError(message, config, request);
      resolvePromise(token.reason);
    });
  }
  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }
  /**
   * Subscribe to the cancel signal
   */
  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }
    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }
  /**
   * Unsubscribe from the cancel signal
   */
  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }
  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let cancel;
    const token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  }
}
const CancelToken$1 = CancelToken;
function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
}
function isAxiosError(payload) {
  return utils.isObject(payload) && payload.isAxiosError === true;
}
const HttpStatusCode = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511
};
Object.entries(HttpStatusCode).forEach(([key2, value]) => {
  HttpStatusCode[value] = key2;
});
const HttpStatusCode$1 = HttpStatusCode;
function createInstance(defaultConfig) {
  const context = new Axios$1(defaultConfig);
  const instance = bind(Axios$1.prototype.request, context);
  utils.extend(instance, Axios$1.prototype, context, { allOwnKeys: true });
  utils.extend(instance, context, null, { allOwnKeys: true });
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };
  return instance;
}
const axios = createInstance(defaults$1);
axios.Axios = Axios$1;
axios.CanceledError = CanceledError;
axios.CancelToken = CancelToken$1;
axios.isCancel = isCancel;
axios.VERSION = VERSION;
axios.toFormData = toFormData;
axios.AxiosError = AxiosError;
axios.Cancel = axios.CanceledError;
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = spread;
axios.isAxiosError = isAxiosError;
axios.mergeConfig = mergeConfig;
axios.AxiosHeaders = AxiosHeaders$1;
axios.formToJSON = (thing) => formDataToJSON(utils.isHTMLForm(thing) ? new FormData(thing) : thing);
axios.HttpStatusCode = HttpStatusCode$1;
axios.default = axios;
const axios$1 = axios;
class MusicDao {
  async downloadMusic(id2) {
    AudioPlayerV2.playStateFlow.value = PlayerState.STATE_DOWNLOADING;
    const response = await fetch(url(`/music?id=${id2}`));
    return await response.arrayBuffer();
  }
  async getMusicList() {
    const response = await fetch(url("/musicList"));
    return (await response.json()).data;
  }
  async uploadTimingInfo(timingInfo) {
    const response = await axios$1.post(url(`uploadTiming`), timingInfo);
    if (!response.data || response.data.code != 0) {
      console.error("request error", response.data.code, response.data.message);
      return false;
    } else {
      console.log("upload timing info success! id=", timingInfo.id);
      return true;
    }
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
    __publicField(this, "defaultTiming", {
      version: "1.0",
      bpm: 60,
      offset: 0,
      id: -1,
      timingList: []
    });
    __publicField(this, "onTimingUpdate", createMutableSharedFlow());
    __publicField(this, "timingCache", /* @__PURE__ */ new Map());
    __publicField(this, "isInit", false);
  }
  async init() {
    const list = await MusicDao$1.getAllTimingList();
    console.log(list);
    if (!list)
      return;
    for (let i = 0; i < list.length; i++) {
      const timing = list[i];
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
    return {
      beatGap: 60 / timingInfo.bpm * 1e3,
      offset: timingInfo.offset,
      timingList: timingInfo.timingList.map((v) => {
        return { offset: v.timestamp, isKiai: v.isKiai };
      })
    };
  }
}
const TimingManager$1 = new TimingManager();
function newBullet() {
  return {
    general: {
      previewTime: 0,
      from: "default"
    },
    metadata: {
      title: "None",
      artist: "None",
      source: new ArrayBuffer(0),
      id: -1
    },
    timingPoints: {
      beatGap: 1e3,
      offset: 0,
      timingList: []
    },
    events: {},
    available: false
  };
}
class Interpolation {
  static dump(start, final, base, exponent) {
    const amount = 1 - Math.pow(base, exponent);
    return start + (final - start) * amount;
  }
  static valueAt(factor, start, end) {
    return start + factor * (end - start);
  }
}
var PlayMode = /* @__PURE__ */ ((PlayMode2) => {
  PlayMode2[PlayMode2["Repeat"] = 0] = "Repeat";
  PlayMode2[PlayMode2["Random"] = 1] = "Random";
  PlayMode2[PlayMode2["None"] = 2] = "None";
  return PlayMode2;
})(PlayMode || {});
function isUndef(v) {
  return typeof v === "undefined";
}
class VideoPlayer extends AbstractPlayer {
  constructor() {
    super();
    __publicField(this, "video", document.createElement("video"));
    __publicField(this, "isAvailable", false);
    this.video.muted = true;
  }
  currentTime() {
    if (this.isAvailable) {
      return int(this.video.currentTime * 1e3);
    }
    return 0;
  }
  duration() {
    if (this.isAvailable)
      return int(this.video.duration * 1e3);
    return 0;
  }
  pause() {
    this.video.pause();
  }
  async play() {
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
      this.video.currentTime = milliseconds / 1e3;
    });
  }
  async setSource(src) {
    this.isAvailable = false;
    const video = this.video;
    if (isString$1(src)) {
      video.src = src;
    } else if (src instanceof Blob) {
      video.src = URL.createObjectURL(src);
    } else {
      return;
    }
    video.load();
    await this.play();
    this.pause();
    this.isAvailable = true;
  }
  setVolume(v) {
    this.video.volume = v;
  }
  speed(rate) {
    this.video.playbackRate = rate;
  }
  stop() {
    this.video.pause();
    this.seek(0);
  }
  getVideoElement() {
    return this.video;
  }
}
const VideoPlayer$1 = new VideoPlayer();
class OSUPlayer {
  constructor() {
    __publicField(this, "title", createMutableStateFlow("None"));
    __publicField(this, "artist", createMutableStateFlow("None"));
    __publicField(this, "background", createMutableStateFlow({}));
    __publicField(this, "currentTime", createMutableStateFlow(0));
    __publicField(this, "duration", createMutableStateFlow(0));
    __publicField(this, "onChanged", createMutableSharedFlow());
    __publicField(this, "maniaNoteData", createMutableStateFlow(null));
    __publicField(this, "osuStdNotes", createMutableStateFlow(null));
    // public onTimingChanged = createMutableSharedFlow<Bullet>()
    __publicField(this, "isVideoAvailable", false);
  }
  async setSource(src) {
    console.log(src);
    this.isVideoAvailable = false;
    this.title.value = src.metadata.title;
    this.artist.value = src.metadata.artist;
    await AudioPlayerV2.setSource(src.metadata.source);
    this.duration.value = AudioPlayerV2.duration();
    const background = {};
    if (src.events.backgroundVideo) {
      try {
        await VideoPlayer$1.setSource(src.events.backgroundVideo);
        this.isVideoAvailable = true;
        background.video = VideoPlayer$1.getVideoElement();
      } catch (_) {
        console.log(_);
        this.isVideoAvailable = false;
        background.video = void 0;
      }
    }
    if (src.events.backgroundImage) {
      background.imageBlob = src.events.backgroundImage;
      background.image = await createImageBitmap(src.events.backgroundImage);
    }
    this.maniaNoteData.value = isUndef(src.noteData) ? null : src.noteData;
    this.osuStdNotes.value = isUndef(src.stdNotes) ? null : src.stdNotes;
    this.background.value = background;
    this.onChanged.emit(src);
  }
  async play() {
    if (this.isVideoAvailable) {
      await VideoPlayer$1.play();
    }
    await AudioPlayerV2.play();
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
}
const OSUPlayer$1 = new OSUPlayer();
const PLAYER = false;
class PlayManager {
  constructor() {
    __publicField(this, "_musicList", createMutableStateFlow([
      newBullet()
    ]));
    __publicField(this, "currentIndex", createMutableStateFlow(0));
    __publicField(this, "onSongChanged", createMutableSharedFlow());
    __publicField(this, "currentPlayMode", createMutableStateFlow(PlayMode.None));
    AudioPlayerV2.onEnd.collect(() => {
    });
    TimingManager$1.onTimingUpdate.collect((timing) => {
      const id2 = timing.id;
      const music = this.findMusic(id2);
      if (!music)
        return;
      music.timingPoints = {
        offset: timing.offset,
        beatGap: 60 / timing.bpm * 1e3,
        timingList: timing.timingList.map((v) => {
          return { offset: v.timestamp, isKiai: v.isKiai };
        })
      };
    });
  }
  async loadMusicList() {
    const list = await MusicDao$1.getMusicList();
    console.log(list);
    const musicList = [];
    for (let i = 0; i < list.length; i++) {
      const music = list[i];
      const timingInfo = await TimingManager$1.getTiming(music.id);
      if (timingInfo === null) {
        musicList.push(this.toBullet(music, TimingManager$1.defaultTiming));
      } else {
        musicList.push(this.toBullet(music, timingInfo));
      }
    }
    console.log(musicList);
    this._musicList.value = musicList;
  }
  // public setMusicList(musicList: Music[]): void {
  //     if (musicList.length) {
  //         this._musicList.value = musicList;
  //         this.playAt(0)
  //     } else {
  //         console.warn("PlayManager", "setMusicList", "list is empty");
  //     }
  // }
  getMusicList() {
    return this._musicList;
  }
  findMusic(id2) {
    return this._musicList.value.find((v) => v.metadata.id === id2);
  }
  async playAt(index) {
    const music = this._musicList.value[index];
    music.metadata.source = await MusicDao$1.downloadMusic(music.metadata.id);
    await OSUPlayer$1.setSource(music);
    await OSUPlayer$1.play();
    this.currentIndex.value = index;
  }
  next() {
    const playMode = this.currentPlayMode.value;
    const audioCount = this._musicList.value.length;
    let currentIndex = this.currentIndex.value;
    if (playMode === PlayMode.None) {
      currentIndex = (currentIndex + 1) % audioCount;
    } else if (playMode === PlayMode.Random) {
      currentIndex = int(
        Interpolation.valueAt(Math.random(), 0, audioCount - 1)
      );
    }
    this.playAt(currentIndex);
  }
  previous() {
    const playMode = this.currentPlayMode.value;
    const audioCount = this._musicList.value.length;
    let currentIndex = this.currentIndex.value;
    if (playMode === PlayMode.None) {
      if (currentIndex === 0) {
        currentIndex = audioCount - 1;
      } else {
        currentIndex--;
      }
    } else if (playMode === PlayMode.Random) {
      currentIndex = int(
        Interpolation.valueAt(Math.random(), 0, audioCount - 1)
      );
    }
    this.playAt(currentIndex);
  }
  get currentMusic() {
    return this._musicList.value[this.currentIndex.value];
  }
  setPlayMode(mode) {
    this.currentPlayMode.value = mode;
  }
  toBullet(music, info) {
    const bullet = newBullet();
    bullet.metadata.id = music.id;
    bullet.metadata.title = music.title;
    bullet.metadata.artist = music.artist;
    bullet.available = info.id >= 0;
    bullet.timingPoints.beatGap = 60 / info.bpm * 1e3;
    bullet.timingPoints.offset = info.offset;
    bullet.timingPoints.timingList = info.timingList.map((v) => {
      return { offset: v.timestamp, isKiai: v.isKiai };
    });
    return bullet;
  }
}
const PlayManager$1 = new PlayManager();
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
function useAnimationFrame(key2, callback) {
  let handle;
  const k = isRef(key2) ? key2 : ref(null);
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
const _hoisted_1$9 = { class: "relative" };
const _hoisted_2$6 = ["value"];
const _hoisted_3$3 = ["onClick"];
const _sfc_main$g = /* @__PURE__ */ defineComponent({
  __name: "ExpandMenu",
  props: {
    modelValue: {},
    items: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: emits }) {
    const props = __props;
    const selectedIndex = ref(0);
    const hidden = ref(true);
    watch(selectedIndex, (value) => {
      emits("update:modelValue", props.items[value]);
    }, { immediate: true });
    const select = (index) => {
      selectedIndex.value = index;
      hidden.value = true;
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$9, [
        createBaseVNode("input", {
          onFocus: _cache[0] || (_cache[0] = ($event) => hidden.value = false),
          autofocus: "",
          class: "expand-select text-center",
          readonly: "",
          value: _ctx.items[selectedIndex.value]
        }, null, 40, _hoisted_2$6),
        createBaseVNode("div", {
          class: "expand-item-list",
          style: normalizeStyle({
            display: hidden.value ? "none" : "block"
          })
        }, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.items, (item, index) => {
            return openBlock(), createElementBlock("div", {
              onClick: ($event) => select(index),
              class: normalizeClass({ "expand-item-selected": index === selectedIndex.value })
            }, toDisplayString(item), 11, _hoisted_3$3);
          }), 256))
        ], 4)
      ]);
    };
  }
});
const ExpandMenu_vue_vue_type_style_index_0_scoped_e33839d5_lang = "";
const ExpandMenu = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["__scopeId", "data-v-e33839d5"]]);
const _hoisted_1$8 = { class: "w-full text-center text-white text-sm" };
const _hoisted_2$5 = ["value"];
const _sfc_main$f = /* @__PURE__ */ defineComponent({
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
          createBaseVNode("span", _hoisted_1$8, toDisplayString(_ctx.label), 1),
          createBaseVNode("input", {
            class: "w-full bg-black text-white rounded text-center text-[22px] py-2",
            value: value.value
          }, null, 8, _hoisted_2$5),
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
const ValueAdjust_vue_vue_type_style_index_0_scoped_cc3e4111_lang = "";
const ValueAdjust = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["__scopeId", "data-v-cc3e4111"]]);
const _withScopeId$2 = (n) => (pushScopeId("data-v-100cb7a5"), n = n(), popScopeId(), n);
const _hoisted_1$7 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("button", { class: "text-white fill-height" }, "Timing", -1));
const _hoisted_2$4 = { class: "text-white fill-height flex-grow text-center" };
const _hoisted_3$2 = {
  class: "h-full flex flex-col justify-evenly px-1",
  style: { "background-color": "var(--bpm-color-3)" }
};
const _hoisted_4$1 = {
  class: "flex-grow text-white h-20",
  style: { "background-color": "var(--bpm-color-2)" }
};
const _hoisted_5$1 = {
  class: "text-white stack flex flex-row flex-grow h-full",
  style: { "background-color": "var(--bpm-color-3)" }
};
const _hoisted_6 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("div", {
  class: "flex-grow h-full w-96",
  style: { "background-color": "var(--bpm-color-4)" }
}, null, -1));
const _hoisted_7 = { class: "w-full h-full flex flex-col pb-2" };
const _hoisted_8 = { class: "w-96 px-4" };
const _hoisted_9 = { style: { "background-color": "#171c1a", "height": "240px", "width": "50%" } };
const _hoisted_10 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("span", { class: "text-white" }, "Kiai Mode", -1));
const _hoisted_11 = {
  class: "text-white select-none",
  style: { "font-size": "26px", "letter-spacing": "2px" }
};
const _hoisted_12 = { class: "select-none text-[--bpm-color-7]" };
const _hoisted_13 = { class: "flex-grow" };
const _hoisted_14 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("div", {
  class: "flex items-end flex-grow",
  style: { "flex-basis": "0" }
}, [
  /* @__PURE__ */ createBaseVNode("span", null, "Playback rate")
], -1));
const _hoisted_15 = ["onClick"];
const WINDOW = 12;
const _sfc_main$e = /* @__PURE__ */ defineComponent({
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
    const playState = useStateFlow(AudioPlayerV2.playStateFlow);
    const player = AudioPlayerV2;
    const wave = ref(null);
    let DRAW_COUNT = 12;
    let peeks = [];
    onMounted(() => {
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
      const currentTime2 = player.currentTime();
      const ctx = waveContext;
      const musicStartX = (halfVisibleTime - currentTime2) * unit;
      const start = int(currentTime2 - bound.width / 2 / unit);
      const end = int(currentTime2 + bound.width / 2 / unit);
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
    ref("00:00:000");
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
      const list = timing.list;
      for (let i = 0; i < list.length; i++) {
        const { timestamp, isKiai } = list[i];
        if (!isKiai) {
          continue;
        }
        const startPosition = timestamp / duration;
        let endPosition = -1;
        for (let j = i + 1; j < list.length; j++) {
          const endTiming = list[j];
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
    const tapTestScale = ref(1);
    const loadState = ref("正在初始化......");
    async function applyTiming() {
      const bpm = Math.floor(bpmInfo.bpm);
      const timingInfo = {
        bpm,
        id: currentMusic.metadata.id,
        version: "1.0",
        offset: bpmInfo.offset,
        timingList: []
      };
      const timingList = timing.list;
      for (const timingListElement of timingList) {
        timingInfo.timingList.push({
          isKiai: timingListElement.isKiai,
          timestamp: timingListElement.timestamp
        });
      }
      console.log(timingInfo);
      TimingManager$1.addTimingInfoToCache(timingInfo);
      Toaster.show("保存成功");
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
    useCollect(player.playStateFlow, (value) => {
      drawFlag.value = value === PlayerState.STATE_PLAYING;
    });
    watch(() => state.playbackRateIndex, (value) => {
      player.speed(playbackRate.value[value]);
    });
    const currentMusic = PlayManager$1.currentMusic;
    TimingManager$1.getTiming(currentMusic.metadata.id).then((res) => {
      res = res || TimingManager$1.defaultTiming;
      bpmInfo.bpm = res.bpm;
      bpmInfo.offset = res.offset;
      timing.list = res.timingList;
      beater.setBpm(res.bpm);
      beater.setOffset(res.offset);
      beater.setTimingList(res.timingList);
      if (player.isPlaying()) {
        drawFlag.value = true;
      }
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
      } else if (evt.code === "KeyG") {
        tapTestScale.value = 0.96;
        simpleAnimate(tapTestScale).easeOutTo(1, 20);
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
      const canvas = htmlRef.value;
      if (!canvas) {
        return {
          width: 0,
          height: 0
        };
      }
      const parent = canvas.parentElement;
      if (canvas.height !== parent.offsetHeight || canvas.width !== parent.offsetWidth) {
        canvas.height = parent.offsetHeight * pixelRatio;
        canvas.width = parent.offsetWidth * pixelRatio;
      }
      return {
        width: canvas.width,
        height: canvas.height
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
              _hoisted_1$7,
              createBaseVNode("span", _hoisted_2$4, toDisplayString(loadState.value), 1),
              createBaseVNode("button", {
                class: "text-white fill-height bpm-close",
                onClick: _cache[0] || (_cache[0] = ($event) => closeCalculator())
              }, "Close")
            ]),
            _: 1
          }),
          createVNode(Row, { class: "w-full" }, {
            default: withCtx(() => [
              createBaseVNode("div", _hoisted_3$2, [
                createBaseVNode("button", {
                  class: "ma text-white",
                  onClick: _cache[1] || (_cache[1] = ($event) => isRef(DRAW_COUNT) ? DRAW_COUNT.value++ : DRAW_COUNT++)
                }, toDisplayString(unref(Icon).ZoomOut), 1),
                createBaseVNode("button", {
                  class: "text-white ma",
                  onClick: _cache[2] || (_cache[2] = ($event) => isRef(DRAW_COUNT) ? DRAW_COUNT.value-- : DRAW_COUNT--)
                }, toDisplayString(unref(Icon).ZoomIn), 1)
              ]),
              createBaseVNode("div", _hoisted_4$1, [
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
              createBaseVNode("div", _hoisted_5$1, [
                _hoisted_6,
                createBaseVNode("div", _hoisted_7, [
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
                            createBaseVNode("span", _hoisted_8, toDisplayString(timeString(item.timestamp)), 1),
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
                          createBaseVNode("div", _hoisted_9, [
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
                      _hoisted_10,
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
                  createBaseVNode("span", _hoisted_11, toDisplayString(state.currentTime), 1),
                  createBaseVNode("span", _hoisted_12, toDisplayString(bpmInfo.bpm) + " BPM ", 1)
                ]),
                _: 1
              }),
              createBaseVNode("div", _hoisted_13, [
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
                      _hoisted_14,
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
                            }, toDisplayString(Math.round(item * 100)) + "% ", 13, _hoisted_15);
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
const BpmCalculator_vue_vue_type_style_index_0_scoped_100cb7a5_lang = "";
const BpmCalculator = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["__scopeId", "data-v-100cb7a5"]]);
const _withScopeId$1 = (n) => (pushScopeId("data-v-759081a9"), n = n(), popScopeId(), n);
const _hoisted_1$6 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ createBaseVNode("span", null, "开发中版本", -1));
const _sfc_main$d = /* @__PURE__ */ defineComponent({
  __name: "DevelopTip",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Row, { class: "develop-box" }, {
        default: withCtx(() => [
          _hoisted_1$6
        ]),
        _: 1
      });
    };
  }
});
const DevelopTip_vue_vue_type_style_index_0_scoped_759081a9_lang = "";
const DevelopTip = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["__scopeId", "data-v-759081a9"]]);
const _sfc_main$c = /* @__PURE__ */ defineComponent({
  __name: "ProgressBar",
  setup(__props) {
    const state = reactive({
      width: 0
    });
    const progressBar = ref(null);
    const duration = useStateFlow(OSUPlayer$1.duration);
    const current = useStateFlow(OSUPlayer$1.currentTime);
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
const ProgressBar_vue_vue_type_style_index_0_scoped_27cf0c27_lang = "";
const ProgressBar = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["__scopeId", "data-v-27cf0c27"]]);
const _hoisted_1$5 = { class: "mini-player-box" };
const _hoisted_2$3 = {
  style: { "position": "relative" },
  class: "fill-size"
};
const _hoisted_3$1 = ["src"];
const _hoisted_4 = { class: "player-title" };
const _hoisted_5 = { class: "player-artist" };
const _sfc_main$b = /* @__PURE__ */ defineComponent({
  __name: "MiniPlayer",
  setup(__props) {
    const artwork = ref("");
    const img = ref(null);
    const title = useStateFlow(OSUPlayer$1.title);
    const artist = useStateFlow(OSUPlayer$1.artist);
    const playState = useStateFlow(AudioPlayerV2.playStateFlow);
    useCollect(OSUPlayer$1.onChanged, (bullet) => {
      if (bullet.general.from === "default") {
        artwork.value = url("/artwork?id=" + bullet.metadata.id);
      }
    });
    onMounted(() => {
      console.log(OSUPlayer$1.background.value.imageBlob);
      if (img.value && OSUPlayer$1.background.value.imageBlob) {
        img.value.src = URL.createObjectURL(OSUPlayer$1.background.value.imageBlob);
      }
    });
    onUnmounted(() => {
    });
    const next = () => PlayManager$1.next();
    const previous = () => PlayManager$1.previous();
    const stop = () => {
      OSUPlayer$1.seek(0);
      OSUPlayer$1.pause();
    };
    const play = () => {
      if (OSUPlayer$1.isPlaying()) {
        OSUPlayer$1.pause();
      } else {
        OSUPlayer$1.play();
      }
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$5, [
        createBaseVNode("div", _hoisted_2$3, [
          createBaseVNode("img", {
            ref_key: "img",
            ref: img,
            src: artwork.value,
            alt: "",
            width: "500",
            height: "240",
            style: { "position": "absolute" }
          }, null, 8, _hoisted_3$1),
          createVNode(Column, {
            class: "fill-size",
            style: { "position": "absolute", "background-color": "#00000040" }
          }, {
            default: withCtx(() => [
              createVNode(Column, {
                class: "fill-width flex-grow",
                center: "",
                gap: 8
              }, {
                default: withCtx(() => [
                  createBaseVNode("span", _hoisted_4, toDisplayString(unref(title)), 1),
                  createBaseVNode("span", _hoisted_5, toDisplayString(unref(artist)), 1)
                ]),
                _: 1
              }),
              createVNode(Row, {
                class: "fill-width",
                style: { "background-color": "#00000080", "height": "64px" },
                center: ""
              }, {
                default: withCtx(() => [
                  unref(PLAYER) ? (openBlock(), createElementBlock("button", {
                    key: 0,
                    class: "control-btn ma",
                    onClick: _cache[0] || (_cache[0] = ($event) => previous())
                  }, toDisplayString(unref(Icon).SkipPrevious), 1)) : createCommentVNode("", true),
                  createBaseVNode("button", {
                    class: "control-btn ma",
                    onClick: _cache[1] || (_cache[1] = ($event) => play())
                  }, toDisplayString(unref(playState) ? unref(Icon).Pause : unref(Icon).PlayArrow), 1),
                  createBaseVNode("button", {
                    class: "control-btn ma",
                    onClick: _cache[2] || (_cache[2] = ($event) => stop())
                  }, toDisplayString(unref(Icon).Stop), 1),
                  unref(PLAYER) ? (openBlock(), createElementBlock("button", {
                    key: 1,
                    class: "control-btn ma",
                    onClick: _cache[3] || (_cache[3] = ($event) => next())
                  }, toDisplayString(unref(Icon).SkipNext), 1)) : createCommentVNode("", true)
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          createVNode(ProgressBar, { style: { "width": "100%", "position": "absolute", "bottom": "0" } })
        ])
      ]);
    };
  }
});
const MiniPlayer_vue_vue_type_style_index_0_scoped_c74edb75_lang = "";
const MiniPlayer = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["__scopeId", "data-v-c74edb75"]]);
const _hoisted_1$4 = { style: { "flex-grow": "1" } };
const _sfc_main$a = /* @__PURE__ */ defineComponent({
  __name: "Playlist",
  setup(__props) {
    function playAt(i) {
      PlayManager$1.playAt(i);
    }
    const list = shallowRef([]);
    useCollect(PlayManager$1.getMusicList(), (res) => {
      list.value = res;
    });
    const activeIndex = useStateFlow(PlayManager$1.currentIndex);
    const html = ref(null);
    onMounted(() => {
      const div = html.value;
      if (!div) {
        return;
      }
      const children = div.children;
      let scrollY = 0;
      for (let i = 0; i < Math.max(activeIndex.value - 3, 0); i++) {
        scrollY += children[i].clientHeight;
      }
      div.scrollTo(0, scrollY);
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "vertical-scroll no-scroller playlist",
        ref_key: "html",
        ref: html
      }, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(list.value, (item, index) => {
          return openBlock(), createBlock(Row, {
            gap: 8,
            onClick: ($event) => playAt(index),
            class: normalizeClass(`list-item ${unref(activeIndex) === index ? "select" : ""}`)
          }, {
            default: withCtx(() => [
              createBaseVNode("span", _hoisted_1$4, toDisplayString(item.metadata.title), 1)
            ]),
            _: 2
          }, 1032, ["onClick", "class"]);
        }), 256))
      ], 512);
    };
  }
});
const Playlist_vue_vue_type_style_index_0_scoped_9a0c8d37_lang = "";
const Playlist = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__scopeId", "data-v-9a0c8d37"]]);
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "UISettings",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Column, {
        class: "fill-size",
        style: { "padding": "16px", "color": "white" },
        gap: 16
      });
    };
  }
});
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
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
const _hoisted_1$3 = ["onClick"];
const _hoisted_2$2 = {
  style: { "flex-grow": "1", "background-color": "var(--settings-content-bg)" },
  class: "fill-height"
};
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "SettingsPanel",
  setup(__props) {
    const state = reactive({
      selectIndex: 0,
      selectors: [
        Icon.FormatPaint,
        Icon.MusicNote
      ]
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Row, {
        class: "fill-size",
        style: { "width": "420px" }
      }, {
        default: withCtx(() => [
          createVNode(Column, { class: "selector" }, {
            default: withCtx(() => [
              (openBlock(true), createElementBlock(Fragment, null, renderList(state.selectors, (item, index) => {
                return openBlock(), createElementBlock("button", {
                  class: normalizeClass(`ma selector-item ${state.selectIndex === index ? "selector-item-selected" : "light-gray-click"}`),
                  style: { "border-radius": "0" },
                  onClick: ($event) => state.selectIndex = index
                }, toDisplayString(item), 11, _hoisted_1$3);
              }), 256))
            ]),
            _: 1
          }),
          createBaseVNode("div", _hoisted_2$2, [
            state.selectIndex === 0 ? (openBlock(), createBlock(_sfc_main$9, { key: 0 })) : createCommentVNode("", true),
            state.selectIndex === 2 ? (openBlock(), createBlock(_sfc_main$8, { key: 1 })) : createCommentVNode("", true)
          ])
        ]),
        _: 1
      });
    };
  }
});
const SettingsPanel_vue_vue_type_style_index_0_scoped_ca6acdbd_lang = "";
const SettingsPanel = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-ca6acdbd"]]);
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "Toast",
  setup(__props) {
    const state = reactive({
      opacity: 0,
      message: ""
    });
    let timeoutId = void 0;
    Toaster.toast.collect((message) => {
      clearTimeout(timeoutId);
      state.opacity = 1;
      state.message = message;
      timeoutId = setTimeout(() => {
        state.opacity = 0;
        state.message = "";
      }, 3e3);
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "toast-box",
        style: normalizeStyle(`opacity: ${state.opacity};`)
      }, [
        createVNode(Row, { center: "" }, {
          default: withCtx(() => [
            createTextVNode(toDisplayString(state.message), 1)
          ]),
          _: 1
        })
      ], 4);
    };
  }
});
const Toast_vue_vue_type_style_index_0_scoped_6747120f_lang = "";
const Toast = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-6747120f"]]);
class ScreenManager {
  constructor() {
    __publicField(this, "screenMap", /* @__PURE__ */ new Map());
    __publicField(this, "currentScreen", null);
    __publicField(this, "currentId", createMutableStateFlow(""));
    __publicField(this, "renderer", null);
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
    var _a;
    (_a = this.currentScreen) == null ? void 0 : _a.dispose();
    this.screenMap.clear();
  }
}
const ScreenManager$1 = new ScreenManager();
const _withScopeId = (n) => (pushScopeId("data-v-7b0c3309"), n = n(), popScopeId(), n);
const _hoisted_1$2 = { class: "text-white" };
const _hoisted_2$1 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("div", { class: "top-bar-shadow" }, null, -1));
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "TopBar",
  props: {
    stateText: {}
  },
  emits: ["settingsClick", "bpmCalcClick", "hideUI", "beatmapListClick"],
  setup(__props) {
    const openPlaylist = inject$1("openList");
    const openMiniPlayer = inject$1("openMiniPlayer");
    const switchScreen = (id2) => ScreenManager$1.activeScreen(id2);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Column, { class: "fill-width" }, {
        default: withCtx(() => [
          createVNode(Row, { class: "top-bar fill-size" }, {
            default: withCtx(() => [
              createBaseVNode("button", {
                class: "ma top-bar-icon-btn",
                onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("settingsClick"))
              }, toDisplayString(unref(Icon).Settings), 1),
              createBaseVNode("button", {
                class: "ma top-bar-icon-btn",
                onClick: _cache[1] || (_cache[1] = ($event) => switchScreen("main"))
              }, toDisplayString(unref(Icon).ScreenLockLandscape), 1),
              createBaseVNode("button", {
                class: "ma top-bar-icon-btn",
                onClick: _cache[2] || (_cache[2] = ($event) => switchScreen("second"))
              }, toDisplayString(unref(Icon).ScreenLockLandscape), 1),
              createBaseVNode("button", {
                class: "ma top-bar-icon-btn",
                onClick: _cache[3] || (_cache[3] = ($event) => switchScreen("mania"))
              }, toDisplayString(unref(Icon).ScreenLockLandscape), 1),
              createVNode(Row, {
                style: { "flex-grow": "1" },
                center: ""
              }, {
                default: withCtx(() => [
                  createBaseVNode("span", _hoisted_1$2, toDisplayString(_ctx.stateText), 1)
                ]),
                _: 1
              }),
              createBaseVNode("button", {
                class: "ma top-bar-icon-btn",
                onClick: _cache[4] || (_cache[4] = ($event) => unref(openMiniPlayer)())
              }, toDisplayString(unref(Icon).MusicNote), 1),
              createBaseVNode("button", {
                class: "ma top-bar-icon-btn",
                onClick: _cache[5] || (_cache[5] = ($event) => _ctx.$emit("beatmapListClick"))
              }, toDisplayString(unref(Icon).FolderOpen), 1),
              createBaseVNode("button", {
                class: "ma top-bar-icon-btn",
                onClick: _cache[6] || (_cache[6] = ($event) => _ctx.$emit("hideUI"))
              }, toDisplayString(unref(Icon).Fullscreen), 1),
              unref(PLAYER) ? (openBlock(), createElementBlock("button", {
                key: 0,
                class: "ma top-bar-icon-btn",
                onClick: _cache[7] || (_cache[7] = ($event) => _ctx.$emit("bpmCalcClick"))
              }, toDisplayString(unref(Icon).RadioButtonUnchecked), 1)) : createCommentVNode("", true),
              unref(PLAYER) ? (openBlock(), createElementBlock("button", {
                key: 1,
                class: "ma top-bar-icon-btn",
                onClick: _cache[8] || (_cache[8] = ($event) => unref(openPlaylist)())
              }, toDisplayString(unref(Icon).List), 1)) : createCommentVNode("", true)
            ]),
            _: 1
          }),
          _hoisted_2$1
        ]),
        _: 1
      });
    };
  }
});
const TopBar_vue_vue_type_style_index_0_scoped_7b0c3309_lang = "";
const TopBar = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-7b0c3309"]]);
const backIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAABsElEQVRYw+2XMW7CQBBFAdEgDAWUUCJOkMStTwFXwJzABYgoBZzAnMIdSIhjADcAyQ1ISQfdSxF7hbC9XjvyRpGYdv7+2Zn5O7tbKj3tHxhlTBw89vgA+OzxcDAp/568w4ITSXZiQSc/eQuXG2l2w6WVh37ABVW7MMhGXmX5sMstNhY9DAx6WNhsH7JbUlWlr7G6W+hjY8TiDOyg7T+2oqa2+7VYcmVKXYquM+Uq8GuFLO6K42MqZWze5bFMAw8FdKcuQDrsxLqhDNjmLHbfzSSLrsjiTDsZ5oram5llbYpeuMmJhsKb5DqYEyHq+OIyF+VJVA4zZhJFhWWax7krHAP3SEIPSEKMAoYjlbgahgk2pfQATgKiKYoc7SFO4Nqk0n/ykpjDJnELeIFrnEr/Kmn0OEB5UdchcFlS+i/epEqyAtwh6gqPWF9CH2MP2H543KIBwvY0stBHAjRCqfxBgMJLpNpkM2+TVWUqDSGTqfpBk4SQHbQso2KSZ1SoD7uPXMNOeVy/5xzXGi6cwq9MDZd+4c8WDQ8vDU/Hwh+/Gp7vGj4gWr5QGj6BWr6xT9Ng32riAijeSkHUAAAAAElFTkSuQmCC";
const legacyLogo = "" + new URL("legacy_logo-a818788f.png", import.meta.url).href;
const logoImg = "" + new URL("logo-76d27be1.png", import.meta.url).href;
const rippleNew = "" + new URL("ripple_new-d127df79.png", import.meta.url).href;
const whiteRound = "" + new URL("white_round-9623cbb6.png", import.meta.url).href;
const star = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAV/SURBVHgB7d2Bdds2EAbg310gzgRlJqg9QZkJ6kxQZYK6E1SZoMkESSaIN7A7QbqB2AmUTnA5hNSzrIgKQYLQ8fB/7+HJ0fOLKQI84AgQAoiIiIiIiIiIiIiI/BKRlZYbUJm08u9DAZVHK/5KHtUo1E8o1+3ez+wGSqJXfCVPbbVcokClRoD64N+h8m9BZdCrfSPf24L861K/PjXIty7168OU0LMjg7/io0Bpg8D1gN9hSuhRd/VvB0SAolLCkiJAjTbd+xGmhB7J8dSvzwbkh1bojcSrQT5oZd5JPKaEHsiw1K9PBedKGASuMd4KtGwSN/g75D4ldB0BtPJW+lJhvFD5K9AyTbz6dzgYXCKtuFrSqeGU5y5ghXT+glMXcEja9C313bznFxcXX+CM1wiwRnou5we8RoBw9VdIK1z9L7xFAXcRQKanfn1CSuhurYDHLuAPzOd3kF2JU78iUkJvEWCF+c0ZYbJzMwicKfU7xtVg0FMEyDVAc7VkzFMEmCP16/NFI8BzOOAiAsyY+vW5FCcbS3jpAs6RnrkYDJrtAuRxOVaFx6s7vP588P4lhi33nkMYCDbd6678d+T9xuqgMVsDkHZlTSgVnlZoeO/Zkfc9OmwYRxsL2jFGlgYzugHsVeiuUvdfnx15n+I1eNow/t/7udn9jjaWBiNFNQCt9E/6coXzhl3q12h50PLn0AgS2wAqfQlLpCqQRY2WlzERISoL6P7jay13IGv+0XId2x1Ep4EhtGh5pT++A1nxTuukHjNwHH0fQP9YuB36BnRub7q6GGVyGtjdhXsPyi1c7WGw9wETJLkPoI0gZAYhQ6hAOTRaXmnl/4uJkt0IYoaQTYPIkf4pyeYCugN6qWVyq6Re4dxep6r8IOlkUDgwLSFNZIaQ3ke0V37SW8SzzAYyQ0gujPRXc8wPzDoZpOOC0BD+Bk0RRvpvMZPZZwO7hRMhTeTcQZxwtYeR/gNmlGU6mBlCtAYJR/qnZFkRtJchNKAfCSP9LJUfZFsSxomkQcKETrbKD7KuCdybSGKG8L3REzpTnGVRqH7INdgI9k2a0JnirItCOZGUZkJnirOvCi54IqlBogmdKUwsCy8wTWyQebDXx8SDIYVNJCWf0JnCzJNBhUwkzTKh4452CWvxZw0aTk/YrfhxlhRv8eT0d/wthenKt/50MGcQZ2a9AdRYvhqGmX08PJC8u37MxfRuImYjgLR3CCssX9hNpIJRlruAK/hRwyjLDaCGH7/CKMsN4Bf4UcMok4NAaXcf2cIXk983YDUC1PCnhkFsAPnUMMhqA/DU/++Y/ExWxwACn8yNA8xFAPH9rd3m7m1Y7AI83QA6xAYwwG/wy9xnMzcG0C4g5P9ep4HNTQyZigDdBJDnNQCX3Wc0w1oXkPPkfHsoQ8tr5H1otYYh1hrADfIIK49fhI0XuqdywpL0j8jD4z2ONCTN172f8nAqzQzz9hmOIccXWy1Pd/LnspWIxZnSrkjeyHwq0FN6Um5kHu+lnV2MPZ7QID/IPFYwwtIYoEZau502Xo+5/do9qbRCu6lFg7Q83+waR6+Kz5JGVLiPOL6U3cJn0CM9IZeSxicZEe4jjjNlt8BnHnZk+pc+byTjJJK045WNTFODWjL+YdAQ7tc4k+64tzLObJs/Lo6ejHuJF8J9hTOT8d3CPaglcVfRRgyGT4nvFrwteh1Hhvf/38K9GB88SVx3VqN0MmwfgHALt8JCyPBugfsG6Em4O3GCNku+SqTd32Bz4vNx19SeE7SIcD+U9HcLZY8D9ARcHTkpiwr3Q0l/t1ChVPJ0C5jNksP9UEe6hRVK1V0RrsL9UPLYLZS7Va5++Lclh8CuW1iDiIiIiIiIiIiIiIiIiIiIKKGvmG5znrTvqA4AAAAASUVORK5CYII=";
const bg1 = "" + new URL("menu-background-1-05e31a26.jpg", import.meta.url).href;
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
      return [bg1, bg2, bg3, bg4, bg5, bg6, bg7];
    }
  }
}
const BackgroundDao$1 = new BackgroundDao();
const MAX_CACHE_SIZE = 6;
class BackgroundLoader {
  constructor() {
    /**
     * 背景图片的 ImageBitmap 队列，存储已下载的图片
     */
    __publicField(this, "imageQueue", []);
    /**
     * 记录背景资源是否可用，当下载失败，则标记为 false，在下次下载时跳过
     */
    __publicField(this, "imageRecord", {});
    /**
     * ImageBitmap 回收队列，当队列超过 MAX_CACHE_SIZE 时，回收队首的 ImageBitmap
     */
    __publicField(this, "recycleQueue", []);
    __publicField(this, "backgroundNames", []);
    __publicField(this, "isInit", false);
    /**
     * 随机索引序列，实现随机图片展示，且不重复
     */
    __publicField(this, "backgroundSequence", []);
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
    const downloadCount = Math.min(backgroundList.length, MAX_CACHE_SIZE);
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
    const image = this.imageQueue.shift();
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
    }).then((image2) => {
      if (image2) {
        this.imageQueue.push(image2);
      }
    });
    this.recycleQueue.push(image);
    this.recycleImageIfNeed();
    return image;
  }
  // private async downloadImage(name: string) {
  //     const response = await fetch(url("/background?name=" + name));
  //     if (int(response.status / 100) != 2) {
  //         this.availableMap[name] = false;
  //         return;
  //     }
  //     const blob = await response.blob();
  //     const imageBitmap = await createImageBitmap(blob);
  //     this.cache.put(name, imageBitmap);
  //     this.availableMap[name] = true;
  // }
  recycleImageIfNeed() {
    if (this.recycleQueue.length >= MAX_CACHE_SIZE) {
      const image = this.recycleQueue.shift();
      image == null ? void 0 : image.close();
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
const _BeatDispatcher = class _BeatDispatcher {
  static register(beat) {
    this.IBeatList.push(beat);
  }
  static unregister(beat) {
    const index = this.IBeatList.indexOf(beat);
    if (ArrayUtils.inBound(_BeatDispatcher.IBeatList, index)) {
      _BeatDispatcher.IBeatList.splice(index, 1);
    }
  }
  static fireNewBeat(isKiai, newBeatTimestamp, gap) {
    const list = _BeatDispatcher.IBeatList;
    for (let i = 0; i < list.length; i++) {
      list[i].onNewBeat(isKiai, newBeatTimestamp, gap);
    }
  }
};
__publicField(_BeatDispatcher, "IBeatList", []);
let BeatDispatcher = _BeatDispatcher;
const BeatState = {
  currentBeat: 0,
  isKiai: false,
  beatIndex: 0,
  currentRMS: 0,
  isAvailable: false,
  nextBeatRMS: 0
};
class BeatBooster {
  constructor() {
    // private bpm: number
    __publicField(this, "timingList", []);
    __publicField(this, "beatCount", 0);
    __publicField(this, "gap", 60 / 60 * 1e3);
    __publicField(this, "offset", 0);
    __publicField(this, "prevBeat", -1);
    __publicField(this, "isAvailable", false);
    TimingManager$1.onTimingUpdate.collect((timingInfo) => {
      if (!timingInfo) {
        this.isAvailable = false;
        this.gap = 60 / 60 * 1e3;
        this.offset = 0;
        this.prevBeat = -1;
        this.timingList = [];
        return;
      }
      const bulletTimingPoints = TimingManager$1.toBulletTimingPoints(timingInfo);
      this.isAvailable = true;
      this.gap = bulletTimingPoints.beatGap;
      this.offset = timingInfo.offset;
      this.timingList = bulletTimingPoints.timingList;
      this.prevBeat = -1;
    });
    OSUPlayer$1.onChanged.collect((bullet) => {
      if (bullet.general.from === "default" && !bullet.available) {
        console.log("nononnn");
        this.isAvailable = false;
        this.gap = 1e3;
        this.offset = 0;
        this.timingList = [];
        this.prevBeat = -1;
      } else {
        this.isAvailable = true;
        this.gap = bullet.timingPoints.beatGap;
        this.offset = bullet.timingPoints.offset;
        this.timingList = bullet.timingPoints.timingList;
        this.prevBeat = -1;
      }
    });
  }
  updateBeat(timestamp, before = linear, after = linear) {
    if (timestamp < this.offset) {
      return 0;
    }
    timestamp -= this.offset;
    const gap = this.gap;
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
      BeatDispatcher.fireNewBeat(this.isKiai(nextBeatTime), nextBeatTime, this.gap);
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
    return this.offset + this.gap * (this.beatCount + 1);
  }
  isKiai(currentTime) {
    currentTime += 60;
    const timingList = this.timingList;
    if (timingList.length === 0) {
      return false;
    }
    let item = null;
    for (let i = 0; i < timingList.length; i++) {
      if (currentTime <= timingList[i].offset) {
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
  getGap() {
    return this.gap;
  }
  getOffset() {
    return this.offset;
  }
}
const BeatBooster$1 = new BeatBooster();
class ResourceCache {
  constructor(max) {
    __publicField(this, "map", /* @__PURE__ */ new Map());
    __publicField(this, "queue", new Queue());
    __publicField(this, "onRecycle", null);
    this.max = max;
  }
  put(key2, value) {
    var _a;
    if (this.queue.size() >= this.max) {
      const key22 = this.queue.end();
      const value2 = this.map.get(key22);
      this.map.delete(key22);
      this.queue.pop();
      if (value2) {
        (_a = this.onRecycle) == null ? void 0 : _a.call(this, key22, value2);
      }
    }
    const v = this.map.get(key2);
    this.map.set(key2, value);
    if (isUndef(v)) {
      this.queue.push(key2);
    }
  }
  get(key2) {
    return this.map.get(key2);
  }
  has(key2) {
    return this.get(key2) !== void 0;
  }
  get count() {
    return this.queue.size();
  }
}
class ImageLoader {
  static get(key2) {
    return this.cache.get(key2);
  }
  static async load(url2, alias) {
    const cache = this.cache;
    let image = cache.get(url2);
    if (image !== void 0) {
      return image;
    }
    image = new Image();
    image.src = url2;
    await image.decode();
    cache.put(alias, image);
    return image;
  }
}
__publicField(ImageLoader, "cache", new ResourceCache(16));
class Vector2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  isZero() {
    return this.x === 0 && this.y === 0;
  }
  static newZero() {
    return new Vector2(0, 0);
  }
  equals(v2) {
    return this.x === v2.x && this.y === v2.y;
  }
  add(vec2) {
    return new Vector2(vec2.x + this.x, vec2.y + this.y);
  }
  increment(v) {
    this.x += v.x;
    this.y += v.y;
  }
  minus(vec2) {
    return new Vector2(this.x - vec2.x, this.y - vec2.y);
  }
  copy() {
    return new Vector2(this.x, this.y);
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
}
function Vector(x = 0, y) {
  return new Vector2(x, y === void 0 ? x : y);
}
const MOUSE_LEFT_DOWN = 1;
const MOUSE_RIGHT_DOWN = 2;
const MOUSE_MOVE = 4;
const MOUSE_NONE = 0;
const MOUSE_KEY_LEFT = 1;
const MOUSE_KEY_RIGHT = 2;
const MOUSE_KEY_NONE = 0;
const _MouseState = class _MouseState {
  static receiveMouseDown(which, x, y) {
    _MouseState.which |= which;
    _MouseState.state |= which === MOUSE_KEY_LEFT ? MOUSE_LEFT_DOWN : MOUSE_RIGHT_DOWN;
    _MouseState.position.x = x;
    _MouseState.position.y = y;
    _MouseState.downPosition.x = x;
    _MouseState.downPosition.y = y;
    _MouseState.fireOnMousedown(which);
  }
  static receiveMouseUp(which, x, y) {
    _MouseState.which ^= which;
    _MouseState.state ^= which === MOUSE_KEY_LEFT ? MOUSE_LEFT_DOWN : MOUSE_RIGHT_DOWN;
    _MouseState.position.x = x;
    _MouseState.position.y = y;
    _MouseState.upPosition.x = x;
    _MouseState.upPosition.y = y;
    _MouseState.fireOnMouseUp(which);
    if (_MouseState.downPosition.equals(_MouseState.upPosition)) {
      _MouseState.fireOnClick(which);
    }
  }
  static receiveMouseMove(x, y) {
    _MouseState.state |= MOUSE_MOVE;
    _MouseState.position.x = x;
    _MouseState.position.y = y;
    _MouseState.fireOnMouseMove();
  }
  static isLeftDown() {
    return (_MouseState.state & MOUSE_LEFT_DOWN) === 1;
  }
  static isRightDown() {
    return (_MouseState.state >> 1 & MOUSE_RIGHT_DOWN) === 1;
  }
  static isLeftUp() {
    return (_MouseState.state & MOUSE_LEFT_DOWN) !== 1;
  }
  static isRightUp() {
    return (_MouseState.state >> 1 & MOUSE_RIGHT_DOWN) !== 1;
  }
  static isMove() {
    return (_MouseState.state >> 2 & MOUSE_MOVE) === 1;
  }
  static fireOnClick(which) {
    var _a;
    (_a = _MouseState.onClick) == null ? void 0 : _a.call(_MouseState, which);
  }
  static fireOnMousedown(which) {
    var _a;
    (_a = _MouseState.onMouseDown) == null ? void 0 : _a.call(_MouseState, which);
  }
  static fireOnMouseUp(which) {
    var _a;
    (_a = _MouseState.onMouseUp) == null ? void 0 : _a.call(_MouseState, which);
  }
  static fireOnMouseMove() {
    var _a;
    (_a = _MouseState.onMouseMove) == null ? void 0 : _a.call(_MouseState);
  }
  static hasKeyDown() {
    return (_MouseState.state & 3) !== 0;
  }
  static isLeftKey(which) {
    return (which & MOUSE_KEY_LEFT) != 0;
  }
  static isRightKey(which) {
    return (which & MOUSE_KEY_RIGHT) != 0;
  }
};
__publicField(_MouseState, "state", MOUSE_NONE);
__publicField(_MouseState, "downPosition", Vector2.newZero());
__publicField(_MouseState, "upPosition", Vector2.newZero());
__publicField(_MouseState, "position", Vector2.newZero());
__publicField(_MouseState, "which", MOUSE_KEY_NONE);
__publicField(_MouseState, "onClick", null);
__publicField(_MouseState, "onMouseDown", null);
__publicField(_MouseState, "onMouseMove", null);
__publicField(_MouseState, "onMouseUp", null);
let MouseState = _MouseState;
const Time = {
  elapsed: 0,
  currentTime: 0
};
const _Matrix3 = class _Matrix3 {
  constructor() {
    __publicField(this, "value", [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]);
  }
  static newIdentify() {
    const ma = new _Matrix3();
    ma.M11 = 1;
    ma.M22 = 1;
    ma.M33 = 1;
    return ma;
  }
  static newMatrix(value) {
    const ma = new _Matrix3();
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
/**
 * readonly, do not modify
 */
__publicField(_Matrix3, "identify", [
  1,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  1
]);
let Matrix3 = _Matrix3;
class TransformUtils {
  static rotate(radius) {
    const cos = Math.cos(radius), sin = Math.sin(radius);
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
  static applyScaleOrigin(vec2, scaleX, scaleY) {
    const matrix = TransformUtils.scale(scaleX, scaleY);
    TransformUtils.applyOrigin(vec2, matrix);
  }
  static applyTranslate(vec2, translateX, translateY) {
    const matrix = TransformUtils.translate(translateX, translateY);
    return TransformUtils.apply(vec2, matrix);
  }
  static applyTranslateOrigin(vec2, translateX, translateY) {
    const matrix = TransformUtils.translate(translateX, translateY);
    TransformUtils.applyOrigin(vec2, matrix);
  }
  static applyRotate(vec2, radian) {
    const matrix = TransformUtils.rotate(radian);
    return TransformUtils.apply(vec2, matrix);
  }
  static applyOrigin(vec2, matrix) {
    const x = vec2.x * matrix.M11 + vec2.y * matrix.M12 + matrix.M13;
    const y = vec2.x * matrix.M21 + vec2.y * matrix.M22 + matrix.M23;
    vec2.x = x;
    vec2.y = y;
  }
}
class Coordinate {
  constructor() {
    __publicField(this, "_width", 0);
    __publicField(this, "_height", 0);
    __publicField(this, "onWindowResize", null);
    __publicField(this, "orthographicProjectionMatrix4", new Float32Array([
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
    ]));
  }
  updateCoordinate(width, height) {
    var _a;
    console.log("window resize");
    this._width = width;
    this._height = height;
    this.orthographicProjectionMatrix4 = TransformUtils.orth(
      -width / 2,
      width / 2,
      -height / 2,
      height / 2,
      0,
      1
    );
    (_a = this.onWindowResize) == null ? void 0 : _a.call(this);
  }
  get width() {
    return this._width;
  }
  get height() {
    return this._height;
  }
  get centerX() {
    return this._width / 2;
  }
  get centerY() {
    return this._height / 2;
  }
  glXLength(worldOrScreen) {
    return worldOrScreen * (2 / this.width);
  }
  glYLength(worldOrScreen) {
    return worldOrScreen * (2 / this.height);
  }
}
const Coordinate$1 = new Coordinate();
class Transform {
  constructor() {
    __publicField(this, "translate", Vector());
    __publicField(this, "scale", Vector(1));
    __publicField(this, "skew", Vector());
    /** degree */
    __publicField(this, "rotate", 1);
    __publicField(this, "alpha", 1);
    __publicField(this, "transformMatrix", Matrix3.newIdentify());
  }
  extractToMatrix(matrix4) {
    matrix4[0] = this.scale.x;
    matrix4[5] = this.scale.y;
    matrix4[3] = this.translate.x;
    matrix4[7] = this.translate.y;
  }
  translateTo(v) {
    this.translate.set(v.x, v.y);
  }
  scaleTo(v) {
    this.scale.set(v.x, v.y);
  }
  alphaTo(alpha) {
    this.alpha = alpha;
  }
  translateBy(v) {
    this.translate.increment(v);
  }
  alphaBy(alpha) {
    this.alpha *= alpha;
  }
  scaleBy(v) {
    this.scale.x *= v.x;
    this.scale.y *= v.y;
  }
  skewBy(v) {
    this.skew.x += v.x;
    this.skew.y += v.y;
  }
  skewTo(v) {
    this.skew.x = v.x;
    this.skew.y = v.y;
  }
  rotateTo(n) {
    this.rotate = n;
  }
  rotateBy(n) {
    this.rotate += n;
  }
}
class Transition {
  constructor(startTime = 0, endTime = 0, timeFunction = linear, toValue = 0, fromValue = 0) {
    __publicField(this, "next", null);
    __publicField(this, "isEnd", false);
    __publicField(this, "isStarted", false);
    this.startTime = startTime;
    this.endTime = endTime;
    this.timeFunction = timeFunction;
    this.toValue = toValue;
    this.fromValue = fromValue;
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
    __publicField(this, "transition", null);
    __publicField(this, "current", null);
    __publicField(this, "isEnd", false);
    __publicField(this, "currentValue", 0);
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
class FadeTransition {
  constructor(drawable) {
    __publicField(this, "fadeTransitionGroup", null);
    __publicField(this, "fadeTimeOffset", 0);
    __publicField(this, "isEnd", false);
    this.drawable = drawable;
  }
  setStartTime(startTime) {
    this.fadeTimeOffset = startTime;
    this.isEnd = false;
  }
  fadeTo(target, duration = 0, ease2 = linear) {
    const transition = new Transition(
      this.fadeTimeOffset,
      this.fadeTimeOffset + duration,
      ease2,
      target,
      this.drawable.alpha
    );
    if (this.fadeTransitionGroup === null) {
      this.fadeTransitionGroup = new TransitionGroup();
    }
    this.fadeTransitionGroup.add(transition);
    this.fadeTimeOffset += duration;
    return this;
  }
  update(timestamp) {
    const fadeTransitionGroup = this.fadeTransitionGroup;
    if (fadeTransitionGroup !== null) {
      fadeTransitionGroup.update(timestamp);
      const fadeValue = fadeTransitionGroup.currentValue;
      this.isEnd = fadeTransitionGroup.isEnd;
      if (fadeTransitionGroup.isEnd) {
        this.fadeTransitionGroup = null;
      }
      if (fadeValue != null) {
        this.drawable.alpha = fadeValue;
      }
    }
  }
}
class TranslateTransition {
  constructor(drawable) {
    __publicField(this, "transXTransition", null);
    __publicField(this, "transYTransition", null);
    __publicField(this, "transOffsetTime", 0);
    __publicField(this, "isEnd", false);
    this.drawable = drawable;
  }
  setStartTime(startTime) {
    this.transOffsetTime = startTime;
    this.isEnd = false;
  }
  translateTo(target, duration = 0, ease2 = linear) {
    const translate = this.drawable.translate;
    const transitionX = new Transition(
      this.transOffsetTime,
      this.transOffsetTime + duration,
      ease2,
      target.x,
      translate.x
    );
    if (this.transXTransition === null) {
      this.transXTransition = new TransitionGroup();
    }
    this.transXTransition.add(transitionX);
    const transitionY = new Transition(
      this.transOffsetTime,
      this.transOffsetTime + duration,
      ease2,
      target.y,
      translate.y
    );
    if (this.transYTransition === null) {
      this.transYTransition = new TransitionGroup();
    }
    this.transYTransition.add(transitionY);
    this.transOffsetTime += duration;
    return this;
  }
  update(timestamp) {
    const x = this.updateX(timestamp);
    const y = this.updateY(timestamp);
    if (x !== null && y !== null) {
      this.drawable.translate = new Vector2(x, y);
    }
  }
  updateX(timestamp) {
    const transXTransition = this.transXTransition;
    if (transXTransition !== null) {
      transXTransition.update(timestamp);
      const transXValue = transXTransition.currentValue;
      this.isEnd = transXTransition.isEnd;
      if (transXTransition.isEnd) {
        this.transXTransition = null;
      }
      if (transXValue != null) {
        return transXValue;
      }
    }
    return null;
  }
  updateY(timestamp) {
    const transYTransition = this.transYTransition;
    if (transYTransition !== null) {
      transYTransition.update(timestamp);
      const transYValue = transYTransition.currentValue;
      this.isEnd = transYTransition.isEnd;
      if (transYTransition.isEnd) {
        this.transYTransition = null;
      }
      if (transYValue != null) {
        return transYValue;
      }
    }
    return null;
  }
}
class ObjectTransition {
  constructor(obj, propertyName) {
    __publicField(this, "transitionGroup", null);
    __publicField(this, "timeOffset", 0);
    __publicField(this, "isEnd", false);
    this.obj = obj;
    this.propertyName = propertyName;
    if (typeof obj[propertyName] !== "number") {
      throw new Error("An unsupported data type");
    }
  }
  setStartTime(startTime) {
    this.timeOffset = startTime;
    this.isEnd = false;
  }
  transitionTo(target, duration = 0, ease2 = linear) {
    const transition = new Transition(
      this.timeOffset,
      this.timeOffset + duration,
      ease2,
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
class Axis {
  static getXAxis(anchor) {
    return anchor & 7;
  }
  static getYAxis(anchor) {
    return anchor & 7 << 3;
  }
}
__publicField(Axis, "X_LEFT", 1);
__publicField(Axis, "X_CENTER", 1 << 1);
__publicField(Axis, "X_RIGHT", 1 << 2);
__publicField(Axis, "Y_TOP", 1 << 3);
__publicField(Axis, "Y_CENTER", 1 << 4);
__publicField(Axis, "Y_BOTTOM", 1 << 5);
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
class Vector2Transition {
  constructor(obj, property) {
    __publicField(this, "vecXTransition", null);
    __publicField(this, "vecYTransition", null);
    __publicField(this, "offsetTime", 0);
    __publicField(this, "isEnd", false);
    this.obj = obj;
    this.property = property;
  }
  setStartTime(startTime) {
    this.offsetTime = startTime;
    this.isEnd = false;
  }
  to(target, duration = 0, ease2 = linear) {
    const vector = this.obj[this.property];
    const vectorX = new Transition(
      this.offsetTime,
      this.offsetTime + duration,
      ease2,
      target.x,
      vector.x
    );
    if (this.vecXTransition === null) {
      this.vecXTransition = new TransitionGroup();
    }
    this.vecXTransition.add(vectorX);
    const vectorY = new Transition(
      this.offsetTime,
      this.offsetTime + duration,
      ease2,
      target.y,
      vector.y
    );
    if (this.vecYTransition === null) {
      this.vecYTransition = new TransitionGroup();
    }
    this.vecYTransition.add(vectorY);
    this.offsetTime += duration;
    return this;
  }
  update(timestamp) {
    const x = this.updateX(timestamp);
    const y = this.updateY(timestamp);
    if (x !== null && y !== null) {
      this.obj[this.property] = new Vector2(x, y);
    }
  }
  updateX(timestamp) {
    const vecXTransition = this.vecXTransition;
    if (vecXTransition !== null) {
      vecXTransition.update(timestamp);
      const vecXValue = vecXTransition.currentValue;
      this.isEnd = vecXTransition.isEnd;
      if (vecXTransition.isEnd) {
        this.vecXTransition = null;
      }
      if (vecXValue !== null) {
        return vecXValue;
      }
    }
    return null;
  }
  updateY(timestamp) {
    const vecYTransition = this.vecYTransition;
    if (vecYTransition !== null) {
      vecYTransition.update(timestamp);
      const vecYValue = vecYTransition.currentValue;
      this.isEnd = vecYTransition.isEnd;
      if (vecYTransition.isEnd) {
        this.vecYTransition = null;
      }
      if (vecYValue !== null) {
        return vecYValue;
      }
    }
    return null;
  }
}
class Drawable {
  constructor(gl, config) {
    /**
     * 通过 Anchor 调整后的变换
     */
    __publicField(this, "layoutTransform", new Transform());
    /**
     * 记录自身的变换
     */
    __publicField(this, "selfTransform", new Transform());
    /**
     * 最终计算出来的变换
     */
    __publicField(this, "appliedTransform", new Transform());
    __publicField(this, "size", new Vector2());
    __publicField(this, "position", new Vector2());
    __publicField(this, "anchor", Axis.X_CENTER | Axis.Y_CENTER);
    __publicField(this, "parent", null);
    __publicField(this, "isAvailable", false);
    __publicField(this, "matrixArray", new Float32Array([
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
    ]));
    __publicField(this, "scaleTransition", new Vector2Transition(this, "scale"));
    __publicField(this, "fadeTransition", new FadeTransition(this));
    __publicField(this, "translateTransition", new TranslateTransition(this));
    __publicField(this, "isVisible", true);
    __publicField(this, "isHovered", false);
    __publicField(this, "isDragged", false);
    this.gl = gl;
    this.config = config;
    this.isAvailable = true;
    this.updateBounding();
    provide(this.constructor.name, this);
  }
  get width() {
    return this.size.x;
  }
  get height() {
    return this.size.y;
  }
  setParent(parent) {
    this.parent = parent;
  }
  load() {
    this.updateBounding();
    this.onLoad();
  }
  onLoad() {
  }
  updateBounding() {
    let [width, height] = this.config.size;
    if (width === "fill-parent") {
      width = Coordinate$1.width;
    }
    if (height === "fill-parent") {
      height = Coordinate$1.height;
    }
    let x = 0, y = 0, left = -width / 2, top = height / 2;
    this.anchor = isUndef(this.config.anchor) ? Axis.X_CENTER | Axis.Y_CENTER : this.config.anchor;
    const xAxis = Axis.getXAxis(this.anchor);
    const yAxis = Axis.getYAxis(this.anchor);
    if (xAxis === Axis.X_LEFT) {
      x = -Coordinate$1.width / 2;
    } else if (xAxis === Axis.X_CENTER) {
      x = -width / 2;
    } else if (xAxis === Axis.X_RIGHT) {
      x = Coordinate$1.width / 2 - width;
    }
    if (yAxis === Axis.Y_TOP) {
      y = Coordinate$1.height / 2;
    } else if (yAxis === Axis.Y_CENTER) {
      y = height / 2;
    } else if (yAxis === Axis.Y_BOTTOM) {
      y = -Coordinate$1.height / 2 + height;
    }
    const origin = isUndef(this.config.origin) ? Axis.X_CENTER | Axis.Y_CENTER : this.config.origin;
    const isAxis = !Array.isArray(origin);
    if (isAxis) {
      const x2 = Axis.getXAxis(origin);
      const y2 = Axis.getYAxis(origin);
      if (x2 === Axis.X_LEFT) {
        left = 0;
      } else if (x2 === Axis.X_CENTER) {
        left = -width / 2;
      } else if (x2 === Axis.X_RIGHT) {
        left = width / 2;
      }
      if (y2 === Axis.Y_TOP) {
        top = 0;
      } else if (y2 === Axis.Y_CENTER) {
        top = height / 2;
      } else if (y2 === Axis.Y_BOTTOM) {
        top = -height / 2;
      }
    } else {
      left = origin[0];
      top = origin[1];
    }
    if (this.config.offset) {
      const [offsetX, offsetY] = this.config.offset;
      x += offsetX;
      y += offsetY;
    }
    const centerTranslate = new Vector2(x - left, y - top);
    this.position.set(left, top);
    this.size.set(width, height);
    this.layoutTransform.translateTo(centerTranslate);
  }
  /**
   * remove self from parent
   */
  remove() {
    var _a;
    (_a = this.parent) == null ? void 0 : _a.removeChild(this);
  }
  scaleBegin(atTime = Time.currentTime) {
    this.scaleTransition.setStartTime(atTime);
    return this.scaleTransition;
  }
  fadeBegin(atTime = Time.currentTime) {
    this.fadeTransition.setStartTime(atTime);
    return this.fadeTransition;
  }
  translateBegin(atTime = Time.currentTime) {
    this.translateTransition.setStartTime(atTime);
    return this.translateTransition;
  }
  set scale(v) {
    this.selfTransform.scaleTo(v);
  }
  get scale() {
    return this.selfTransform.scale.copy();
  }
  set translate(v) {
    this.selfTransform.translateTo(v);
  }
  get translate() {
    return this.selfTransform.translate.copy();
  }
  set alpha(v) {
    this.selfTransform.alphaTo(v);
  }
  get alpha() {
    return this.selfTransform.alpha;
  }
  updateTransform() {
    const layoutTransform = this.layoutTransform;
    const selfTransform = this.selfTransform;
    const appliedTransform = this.appliedTransform;
    const parentTransform = this.parent ? this.parent.appliedTransform : new Transform();
    appliedTransform.translateTo(parentTransform.translate);
    appliedTransform.translateBy(layoutTransform.translate);
    appliedTransform.translateBy(selfTransform.translate);
    appliedTransform.scaleTo(parentTransform.scale);
    appliedTransform.scaleBy(layoutTransform.scale);
    appliedTransform.scaleBy(selfTransform.scale);
    appliedTransform.alphaTo(parentTransform.alpha);
    appliedTransform.alphaBy(layoutTransform.alpha);
    appliedTransform.alphaBy(selfTransform.alpha);
    appliedTransform.extractToMatrix(this.matrixArray);
    this.onTransformApplied();
  }
  onTransformApplied() {
  }
  onUpdate() {
  }
  update() {
    if (!this.isVisible) {
      return;
    }
    if (this.isAvailable) {
      this.scaleTransition.update(Time.currentTime);
      this.fadeTransition.update(Time.currentTime);
      this.translateTransition.update(Time.currentTime);
    }
    if (this.isAvailable) {
      this.onUpdate();
    }
    if (this.isAvailable) {
      this.updateTransform();
    }
  }
  draw() {
    if (this.isAvailable && this.isVisible) {
      this.bind();
      this.onDraw();
      this.unbind();
    }
  }
  onWindowResize() {
    this.updateBounding();
  }
  dispose() {
    this.isAvailable = false;
    unprovide(this.constructor.name);
  }
  placeholder() {
  }
  /**
   * 检查 position 是否在 Drawable 区域内
   * @param position
   */
  isInBound(position) {
    let { x, y } = this.position;
    const { translate, scale } = this.appliedTransform;
    x *= scale.x;
    y *= scale.y;
    x += translate.x;
    y += translate.y;
    return position.x > x && position.x <= x + this.width * scale.x && position.y < y && position.y >= y - this.height * scale.y;
  }
  click(which, position) {
    if (this.isAvailable && this.isInBound(position)) {
      if ("onClick" in this && typeof this.onClick === "function")
        this.onClick(which);
    }
  }
  mouseDown(which, position) {
    if (this.isAvailable && this.isInBound(position)) {
      if ("onMouseDown" in this && typeof this.onMouseDown === "function") {
        this.onMouseDown(which);
      }
    }
  }
  mouseUp(which, position) {
    if (this.isAvailable && this.isInBound(position)) {
      if ("onMouseUp" in this && typeof this.onMouseUp === "function") {
        this.onMouseUp(which);
      }
    }
    this.dragLost(which, position);
  }
  mouseMove(position) {
    if (this.isAvailable && this.isInBound(position)) {
      if ("onMouseMove" in this && typeof this.onMouseMove === "function") {
        this.onMouseMove();
      }
      this.hover(position);
      if (MouseState.hasKeyDown()) {
        this.drag(MouseState.which, position);
      }
      return;
    }
    if (this.isDragged) {
      this.drag(MouseState.which, position);
    }
    this.hoverLost(position);
  }
  hover(position) {
    if ("onHover" in this && typeof this.onHover === "function" && !this.isHovered) {
      this.isHovered = true;
      this.onHover();
    }
  }
  hoverLost(position) {
    if (this.isAvailable && this.isHovered && !this.isInBound(position)) {
      if ("onHoverLost" in this && typeof this.onHoverLost === "function") {
        this.isHovered = false;
        this.onHoverLost();
      }
    }
  }
  drag(which, position) {
    if ("onDrag" in this && typeof this.onDrag === "function") {
      this.isDragged = true;
      this.onDrag(which);
    }
  }
  dragLost(which, position) {
    if (this.isAvailable && this.isDragged) {
      if ("onDragLost" in this && typeof this.onDragLost === "function") {
        this.isDragged = false;
        this.onDragLost();
      }
    }
  }
}
class Box extends Drawable {
  constructor() {
    super(...arguments);
    __publicField(this, "childrenList", []);
    __publicField(this, "posts", new Queue());
    __privateAdd(this, _isHovered, false);
    __privateAdd(this, _isDragged, false);
  }
  add(...children) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      child.setParent(this);
      this.childrenList.push(child);
    }
  }
  addFirst(...children) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      child.setParent(this);
      this.childrenList.unshift(child);
    }
  }
  removeChild(child) {
    const index = this.childrenList.indexOf(child);
    if (index >= 0) {
      console.log("child found, and can be removed, index", index);
      ArrayUtils.removeAt(this.childrenList, index);
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
  get lastChild() {
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
  post(call) {
    this.posts.push(call);
  }
  load() {
    super.onLoad();
    for (let i = 0; i < this.childrenList.length; i++) {
      this.childrenList[i].load();
    }
  }
  onWindowResize() {
    super.onWindowResize();
    for (let i = 0; i < this.childrenList.length; i++) {
      this.childrenList[i].onWindowResize();
    }
  }
  setParent(parent) {
    super.setParent(parent);
    for (let i = 0; i < this.childrenList.length; i++) {
      this.childrenList[i].setParent(this);
    }
  }
  update() {
    super.update();
    if (!this.isVisible) {
      return;
    }
    if (!this.posts.isEmpty()) {
      console.log("handle post");
      this.posts.foreach((e) => {
        e();
      });
      this.posts.clear();
    }
    this.updateChildren();
  }
  updateChildren() {
    for (let i = 0; i < this.childrenList.length; i++) {
      this.childrenList[i].update();
    }
  }
  bind() {
  }
  dispose() {
    super.dispose();
    for (let i = 0; i < this.childrenList.length; i++) {
      this.childrenList[i].dispose();
    }
  }
  draw() {
    if (!this.isVisible) {
      return;
    }
    for (let i = 0; i < this.childrenList.length; i++) {
      this.childrenList[i].draw();
    }
  }
  onDraw() {
  }
  unbind() {
  }
  click(which, position) {
    if (this.isAvailable && this.isInBound(position)) {
      if ("onClick" in this && typeof this.onClick === "function")
        this.onClick(which);
    }
    for (let i = this.childrenList.length - 1; i >= 0; i--) {
      this.childrenList[i].click(which, position);
    }
  }
  mouseDown(which, position) {
    if (this.isAvailable && this.isInBound(position)) {
      if ("onMouseDown" in this && typeof this.onMouseDown === "function") {
        this.onMouseDown(which);
      }
    }
    for (let i = this.childrenList.length - 1; i >= 0; i--) {
      this.childrenList[i].mouseDown(which, position);
    }
  }
  mouseUp(which, position) {
    if (this.isAvailable && this.isInBound(position)) {
      if ("onMouseUp" in this && typeof this.onMouseUp === "function") {
        this.onMouseUp(which);
      }
    }
    this.dragLost(which, position);
    for (let i = this.childrenList.length - 1; i >= 0; i--) {
      this.childrenList[i].mouseUp(which, position);
    }
  }
  mouseMove(position) {
    if (this.isAvailable && this.isInBound(position)) {
      if ("onMouseMove" in this && typeof this.onMouseMove === "function") {
        this.onMouseMove();
      }
      this.hover(position);
      if (MouseState.hasKeyDown()) {
        this.drag(MouseState.which, position);
      }
    } else {
      if (__privateGet(this, _isDragged)) {
        this.drag(MouseState.which, position);
      }
      this.hoverLost(position);
    }
    for (let i = this.childrenList.length - 1; i >= 0; i--) {
      this.childrenList[i].mouseMove(position);
    }
  }
  hover(position) {
    if ("onHover" in this && typeof this.onHover === "function" && !__privateGet(this, _isHovered)) {
      __privateSet(this, _isHovered, true);
      this.onHover();
    }
  }
  hoverLost(position) {
    if (this.isAvailable && __privateGet(this, _isHovered) && !this.isInBound(position)) {
      if ("onHoverLost" in this && typeof this.onHoverLost === "function") {
        __privateSet(this, _isHovered, false);
        this.onHoverLost();
      }
    }
  }
  drag(which, position) {
    if ("onDrag" in this && typeof this.onDrag === "function") {
      __privateSet(this, _isDragged, true);
      this.onDrag(which);
    }
  }
  dragLost(which, position) {
    if (this.isAvailable && __privateGet(this, _isDragged)) {
      if ("onDragLost" in this && typeof this.onDragLost === "function") {
        __privateSet(this, _isDragged, false);
        this.onDragLost();
      }
    }
  }
}
_isHovered = new WeakMap();
_isDragged = new WeakMap();
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
const _Texture = class _Texture {
  constructor(gl, image = null) {
    __publicField(this, "rendererId");
    __publicField(this, "imageWidth", 0);
    __publicField(this, "imageHeight", 0);
    this.gl = gl;
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
      _Texture.blankData
    );
    gl.bindTexture(gl.TEXTURE_2D, null);
    if (image !== null) {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      this.imageWidth = image.width;
      this.imageHeight = image.height;
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        image.width,
        image.height,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        image
      );
      gl.bindTexture(gl.TEXTURE_2D, null);
    }
  }
  texImage2D(image) {
    const gl = this.gl;
    this.imageWidth = image.width;
    this.imageHeight = image.height;
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      image.width,
      image.height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      image
    );
  }
  setTextureImage(image) {
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, this.rendererId);
    this.texImage2D(image);
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
      // video.width,
      // video.height,
      // 0,
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
__publicField(_Texture, "blankData", new Uint8Array([0, 0, 0, 0]));
__publicField(_Texture, "NULL", Symbol());
let Texture = _Texture;
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
    __publicField(this, "elements", []);
    __publicField(this, "stride", 0);
    this.gl = gl;
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
__publicField(VertexBufferLayout, "NULL", Symbol());
class VertexArray {
  constructor(gl) {
    __publicField(this, "rendererId");
    this.gl = gl;
    const va = gl.createVertexArray();
    if (!va) {
      throw new Error("create vertex array error");
    }
    this.rendererId = va;
  }
  addBuffer(vertexBuffer, layout) {
    this.bind();
    vertexBuffer.bind();
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
class VertexBuffer {
  constructor(gl, data = null, usage = gl.STATIC_DRAW) {
    __publicField(this, "rendererId");
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
const ATTR_POSITION = "a_position";
const ATTR_TEXCOORD = "a_tex_coord";
const ATTR_ALPHA = "a_alpha";
const UNI_ORTH = "u_orth";
const UNI_TRANSFORM = "u_transform";
const UNI_SAMPLER = "u_sampler";
const UNI_ALPHA = "u_alpha";
class Shader {
  constructor(gl, vertexShader2, fragmentShader2) {
    __publicField(this, "rendererId");
    __publicField(this, "uniformLocationCache", {});
    __publicField(this, "attributeLocationCache", {});
    this.gl = gl;
    this.rendererId = createShader(gl, vertexShader2, fragmentShader2);
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
__publicField(Shader, "NULL", Symbol());
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
class StaticTextureShader {
  constructor() {
    __publicField(this, "vertex", `
        attribute vec2 ${ATTR_POSITION};
        attribute vec2 ${ATTR_TEXCOORD};
    
        varying mediump vec2 v_tex_coord;
        uniform mat4 ${UNI_ORTH};
        uniform mat4 ${UNI_TRANSFORM};
        void main() {
            vec4 position = vec4(${ATTR_POSITION}, 0.0, 1.0) * ${UNI_TRANSFORM};
            gl_Position = position * ${UNI_ORTH};
            v_tex_coord = ${ATTR_TEXCOORD};
        }
    `);
    __publicField(this, "fragment", `
        varying mediump vec2 v_tex_coord;
        uniform mediump float ${UNI_ALPHA};
        uniform sampler2D ${UNI_SAMPLER};
    
        void main() {
            mediump vec4 texelColor = texture2D(${UNI_SAMPLER}, v_tex_coord);
            texelColor.a = texelColor.a * ${UNI_ALPHA};
            gl_FragColor = texelColor;
        }
    `);
    __publicField(this, "shader", null);
    __publicField(this, "layout", null);
  }
  getShader(gl) {
    if (this.shader === null) {
      const shader = new Shader(gl, this.vertex, this.fragment);
      const layout = new VertexBufferLayout(gl);
      shader.bind();
      layout.pushFloat(shader.getAttributeLocation(ATTR_POSITION), 2);
      layout.pushFloat(shader.getAttributeLocation(ATTR_TEXCOORD), 2);
      shader.unbind();
      this.shader = shader;
      this.layout = layout;
    }
    return this.shader;
  }
  getLayout() {
    return this.layout;
  }
  dispose() {
    var _a;
    (_a = this.shader) == null ? void 0 : _a.dispose();
    this.shader = null;
    this.layout = null;
  }
}
const StaticTextureShader$1 = new StaticTextureShader();
class Logo extends Drawable {
  constructor(gl, config) {
    super(gl, config);
    __publicField(this, "shader");
    __publicField(this, "buffer");
    __publicField(this, "texture");
    __publicField(this, "layout");
    __publicField(this, "vertexArray");
    __publicField(this, "textureUnit", 0);
    const vertexArray = new VertexArray(gl);
    vertexArray.bind();
    const buffer = new VertexBuffer(gl);
    const shader = StaticTextureShader$1.getShader(gl);
    const layout = new VertexBufferLayout(gl);
    const texture = new Texture(gl, ImageLoader.get("logo"));
    buffer.bind();
    shader.bind();
    layout.pushFloat(shader.getAttributeLocation(ATTR_POSITION), 2);
    layout.pushFloat(shader.getAttributeLocation(ATTR_TEXCOORD), 2);
    vertexArray.addBuffer(buffer, layout);
    vertexArray.unbind();
    buffer.unbind();
    shader.unbind();
    this.vertexArray = vertexArray;
    this.buffer = buffer;
    this.layout = layout;
    this.shader = shader;
    this.texture = texture;
  }
  createVertexArray() {
    const width = this.width;
    const height = this.height;
    const { x, y } = this.position;
    const topLeft = new Vector2(x, y);
    const bottomRight = new Vector2(x + width, y - height);
    const vertexData = [];
    Shape2D.quadVector2(
      topLeft,
      bottomRight,
      vertexData,
      0,
      4
    );
    Shape2D.quad(
      0,
      0,
      1,
      1,
      vertexData,
      2,
      4
    );
    console.log(vertexData);
    return new Float32Array(vertexData);
  }
  onLoad() {
    this.buffer.bind();
    this.buffer.setBufferData(this.createVertexArray());
    this.buffer.unbind();
  }
  onWindowResize() {
    super.onWindowResize();
    this.buffer.bind();
    this.buffer.setBufferData(this.createVertexArray());
    this.buffer.unbind();
  }
  unbind() {
    this.vertexArray.unbind();
    this.texture.unbind();
    this.shader.unbind();
  }
  bind() {
    this.texture.bind(this.textureUnit);
    this.vertexArray.bind();
    this.shader.bind();
  }
  onDraw() {
    const gl = this.gl;
    this.shader.setUniform1i(UNI_SAMPLER, this.textureUnit);
    this.shader.setUniformMatrix4fv(UNI_ORTH, Coordinate$1.orthographicProjectionMatrix4);
    this.shader.setUniformMatrix4fv(UNI_TRANSFORM, this.matrixArray);
    this.shader.setUniform1f(UNI_ALPHA, this.appliedTransform.alpha);
    this.vertexArray.addBuffer(this.buffer, this.layout);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  dispose() {
    this.texture.dispose();
    this.vertexArray.dispose();
    StaticTextureShader$1.dispose();
    this.buffer.dispose();
  }
}
class BeatDrawable extends Drawable {
  constructor(gl, config) {
    super(gl, config);
    BeatDispatcher.register(this);
  }
  dispose() {
    super.dispose();
    BeatDispatcher.unregister(this);
  }
}
class DynamicTextureShader {
  constructor() {
    __publicField(this, "vertex", `
        attribute vec2 ${ATTR_POSITION};
        attribute vec2 ${ATTR_TEXCOORD};
        attribute float ${ATTR_ALPHA};
    
        varying mediump vec2 v_tex_coord;
        varying mediump float v_alpha;
        uniform mat4 ${UNI_ORTH};
        uniform mat4 ${UNI_TRANSFORM};
        void main() {
            vec4 position = vec4(${ATTR_POSITION}, 0.0, 1.0) * ${UNI_TRANSFORM};
            gl_Position = position * ${UNI_ORTH};
            v_tex_coord = ${ATTR_TEXCOORD};
            v_alpha = ${ATTR_ALPHA};
        }
    `);
    __publicField(this, "fragment", `
        varying mediump float v_alpha;
        varying mediump vec2 v_tex_coord;
        uniform sampler2D ${UNI_SAMPLER};
    
        void main() {
            mediump vec4 texelColor = texture2D(${UNI_SAMPLER}, v_tex_coord);
            texelColor.a = texelColor.a * v_alpha;
            gl_FragColor = texelColor;
        }
    `);
    __publicField(this, "shader", null);
    __publicField(this, "layout", null);
  }
  getShader(gl) {
    if (this.shader === null) {
      const shader = new Shader(gl, this.vertex, this.fragment);
      const layout = new VertexBufferLayout(gl);
      shader.bind();
      layout.pushFloat(shader.getAttributeLocation(ATTR_POSITION), 2);
      layout.pushFloat(shader.getAttributeLocation(ATTR_TEXCOORD), 2);
      layout.pushFloat(shader.getAttributeLocation(ATTR_ALPHA), 1);
      shader.unbind();
      this.shader = shader;
      this.layout = layout;
    }
    return this.shader;
  }
  getLayout() {
    return this.layout;
  }
  dispose() {
    var _a;
    (_a = this.shader) == null ? void 0 : _a.dispose();
    this.shader = null;
    this.layout = null;
  }
}
const DynamicTextureShader$1 = new DynamicTextureShader();
class Ripples extends BeatDrawable {
  constructor(gl, config) {
    super(gl, config);
    __publicField(this, "vertexArray");
    __publicField(this, "buffer");
    __publicField(this, "texture");
    __publicField(this, "shader");
    __publicField(this, "layout");
    __publicField(this, "textureUnit", 1);
    __publicField(this, "ripples", []);
    __publicField(this, "vertexData", new Float32Array([]));
    __publicField(this, "vertexCount", 0);
    const vertexArray = new VertexArray(gl);
    vertexArray.bind();
    const buffer = new VertexBuffer(gl, null, gl.STREAM_DRAW);
    const layout = new VertexBufferLayout(gl);
    const shader = DynamicTextureShader$1.getShader(gl);
    const texture = new Texture(gl, ImageLoader.get("ripple"));
    buffer.bind();
    shader.bind();
    layout.pushFloat(shader.getAttributeLocation(ATTR_POSITION), 2);
    layout.pushFloat(shader.getAttributeLocation(ATTR_TEXCOORD), 2);
    layout.pushFloat(shader.getAttributeLocation(ATTR_ALPHA), 1);
    vertexArray.addBuffer(buffer, layout);
    vertexArray.unbind();
    buffer.unbind();
    shader.unbind();
    this.vertexArray = vertexArray;
    this.buffer = buffer;
    this.texture = texture;
    this.layout = layout;
    this.shader = shader;
  }
  onNewBeat(isKiai, newBeatTimestamp, gap) {
    if (!BeatBooster$1.isAvailable) {
      return;
    }
    let ripple;
    const ripples = this.ripples;
    if (ripples.length === 0) {
      ripple = new Ripple(this);
      ripples.unshift(ripple);
      ripple.start();
    } else {
      ripple = ripples[ripples.length - 1];
      if (ripple.isEnd()) {
        ripples.pop();
        ripples.unshift(ripple);
        ripple.reset();
      } else {
        ripple = new Ripple(this);
        ripples.unshift(ripple);
      }
    }
    ripple.start();
  }
  bind() {
    this.vertexArray.bind();
    this.buffer.bind();
    this.texture.bind(this.textureUnit);
    this.shader.bind();
  }
  onUpdate() {
    super.onUpdate();
    const data = [];
    const ripples = this.ripples;
    let currentOffset = 0;
    if (ripples.length === 0) {
      return;
    }
    for (let i = 0; i < ripples.length; i++) {
      const ripple = ripples[i];
      ripple.update();
      currentOffset += ripple.copyTo(data, currentOffset);
    }
    this.vertexData = new Float32Array(data);
    this.vertexCount = int(data.length / 5);
  }
  unbind() {
    this.vertexArray.unbind();
    this.buffer.unbind();
    this.texture.unbind();
    this.shader.unbind();
  }
  onDraw() {
    const gl = this.gl;
    const shader = this.shader;
    shader.setUniform1i(UNI_SAMPLER, this.textureUnit);
    shader.setUniformMatrix4fv(UNI_TRANSFORM, this.matrixArray);
    shader.setUniformMatrix4fv(UNI_ORTH, Coordinate$1.orthographicProjectionMatrix4);
    if (this.vertexCount === 0)
      return;
    this.buffer.setBufferData(this.vertexData);
    this.vertexArray.addBuffer(this.buffer, this.layout);
    gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);
  }
  dispose() {
    super.dispose();
    this.texture.dispose();
    this.vertexArray.dispose();
    DynamicTextureShader$1.dispose();
    this.buffer.dispose();
  }
}
class Ripple {
  constructor(parent) {
    __publicField(this, "maxThickWidth");
    __publicField(this, "innerRadius");
    __publicField(this, "currentThickWidth", 1);
    __publicField(this, "transition", new ObjectTransition(this, "currentThickWidth"));
    __publicField(this, "alpha", 0.15);
    __publicField(this, "alphaTransition", new ObjectTransition(this, "alpha"));
    this.innerRadius = parent.width / 2;
    this.maxThickWidth = this.innerRadius * 0.8;
    console.log(this.maxThickWidth);
    this.currentThickWidth = 0;
  }
  reset() {
    this.currentThickWidth = 0;
    this.alpha = 0.15;
  }
  start() {
    this.startTransition().transitionTo(this.maxThickWidth, 3e3, easeOutQuint);
    this.alphaBegin().transitionTo(0, 2800, easeOutQuint);
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
  copyTo(out, offset) {
    const value = this.innerRadius + this.currentThickWidth;
    Shape2D.quad(
      -value,
      value,
      value,
      -value,
      out,
      offset,
      5
    );
    Shape2D.quad(0, 0, 1, 1, out, offset + 2, 5);
    Shape2D.one(this.alpha, out, offset + 4, 5, 6);
    return 5 * 6;
  }
}
class IndexBuffer {
  constructor(gl, data = null, usage = gl.STATIC_DRAW) {
    __publicField(this, "rendererId");
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
const vertexShader$3 = `
    attribute vec2 a_vertexPosition;
    uniform mat4 u_orth;
    uniform mat4 u_transform;
    void main() {
        vec4 coord = vec4(a_vertexPosition, 0.0, 1.0) * u_transform;
        gl_Position = coord * u_orth;
    }
`;
const fragmentShader$3 = `
    uniform lowp float u_alpha;
    void main() {
        gl_FragColor = vec4(1.0, 1.0, 1.0, u_alpha);
    }
`;
class RoundVisualizer extends Drawable {
  constructor(gl, config) {
    super(gl, config);
    __publicField(this, "vertexArray");
    __publicField(this, "buffer");
    __publicField(this, "shader");
    __publicField(this, "layout");
    __publicField(this, "indexBuffer");
    __publicField(this, "vertexCount", 0);
    __publicField(this, "visualizer");
    __publicField(this, "vertexData", new Float32Array(0));
    __publicField(this, "simpleSpectrum", new Array(200));
    __publicField(this, "lastTime", 0);
    __publicField(this, "updateOffsetTime", 0);
    __publicField(this, "indexOffset", 0);
    __publicField(this, "indexChange", 5);
    __publicField(this, "targetSpectrum", new Array(200).fill(0));
    // TODO: 调整频谱
    __publicField(this, "spectrumShape", [
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
    ]);
    const vertexArray = new VertexArray(gl);
    vertexArray.bind();
    const shader = new Shader(gl, vertexShader$3, fragmentShader$3);
    const buffer = new VertexBuffer(gl, null, gl.STREAM_DRAW);
    const layout = new VertexBufferLayout(gl);
    const indexBuffer = new IndexBuffer(gl);
    const index = [
      0,
      1,
      2,
      1,
      2,
      3
    ];
    const indexArray = new Array(index.length * 200 * 5);
    for (let i = 0, j = 0; i < 200 * 5; i++, j += 6) {
      const increment = i << 2;
      indexArray[j] = index[0] + increment;
      indexArray[j + 1] = index[1] + increment;
      indexArray[j + 2] = index[2] + increment;
      indexArray[j + 3] = index[3] + increment;
      indexArray[j + 4] = index[4] + increment;
      indexArray[j + 5] = index[5] + increment;
    }
    indexBuffer.bind();
    indexBuffer.setIndexBuffer(new Uint32Array(indexArray));
    buffer.bind();
    shader.bind();
    const location = shader.getAttributeLocation("a_vertexPosition");
    layout.pushFloat(location, 2);
    vertexArray.addBuffer(buffer, layout);
    vertexArray.unbind();
    buffer.unbind();
    indexBuffer.unbind();
    shader.unbind();
    this.vertexArray = vertexArray;
    this.buffer = buffer;
    this.shader = shader;
    this.layout = layout;
    this.indexBuffer = indexBuffer;
    this.visualizer = AudioPlayerV2.getVisualizer();
  }
  onUpdate() {
    super.onUpdate();
    this.getSpectrum(Time.currentTime, BeatState.isKiai ? 1 : 0.5);
    this.updateVertex(this.targetSpectrum, 200);
  }
  updateVertex(spectrum, length = spectrum.length) {
    const centerX = 0, centerY = 0;
    if (this.vertexData.length !== length) {
      this.vertexData = new Float32Array(length * 8 * 5);
    }
    const array = this.vertexData;
    const innerRadius = 236;
    const lineWidth = innerRadius / 2 * Math.sin(
      degreeToRadian(360 / length)
    ) * 2;
    const half = lineWidth / 2;
    let k = 0;
    for (let j = 0; j < 5; j++) {
      for (let i = 0; i < length; i++) {
        const degree = i / 200 * 360 + j * 360 / 5;
        const radian = degreeToRadian(degree);
        const value = innerRadius + spectrum[i] * 160;
        const fromX = centerX;
        const fromY = centerY + innerRadius;
        const toX = centerX;
        const toY = centerY + value;
        let point1 = new Vector2(fromX - half, fromY);
        let point2 = new Vector2(fromX + half, fromY);
        let point3 = new Vector2(toX - half, toY);
        let point4 = new Vector2(toX + half, toY);
        const matrix3 = TransformUtils.rotate(radian);
        point1 = TransformUtils.apply(point1, matrix3);
        point2 = TransformUtils.apply(point2, matrix3);
        point3 = TransformUtils.apply(point3, matrix3);
        point4 = TransformUtils.apply(point4, matrix3);
        this.updateAt(array, k, point1);
        this.updateAt(array, k + 2, point2);
        this.updateAt(array, k + 4, point3);
        this.updateAt(array, k + 6, point4);
        k += 8;
      }
    }
    this.vertexCount = length * 6 * 5;
    this.buffer.bind();
    this.buffer.setBufferData(array);
    this.buffer.unbind();
  }
  updateAt(array, offset, point) {
    array[offset] = point.x;
    array[offset + 1] = point.y;
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
  bind() {
    this.shader.bind();
    this.vertexArray.bind();
  }
  unbind() {
    this.shader.unbind();
    this.vertexArray.unbind();
  }
  onDraw() {
    const gl = this.gl;
    this.shader.setUniform1f("u_alpha", BeatState.isKiai ? 0.14 + BeatState.currentBeat * 0.1 : 0.14);
    this.shader.setUniformMatrix4fv("u_transform", this.matrixArray);
    this.shader.setUniformMatrix4fv("u_orth", Coordinate$1.orthographicProjectionMatrix4);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_CONSTANT_ALPHA);
    this.vertexArray.addBuffer(this.buffer, this.layout);
    gl.drawElements(gl.TRIANGLES, this.vertexCount, gl.UNSIGNED_INT, 0);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }
  dispose() {
    this.vertexArray.dispose();
    this.buffer.dispose();
    this.shader.dispose();
    this.indexBuffer.dispose();
  }
}
class Color {
  constructor(r, g, b, a) {
    __publicField(this, "red", 0);
    __publicField(this, "green", 0);
    __publicField(this, "blue", 0);
    __publicField(this, "alpha", 0);
    this.red = r;
    this.blue = b;
    this.green = g;
    this.alpha = a;
  }
  static fromHex(hex, alphaInt = 255) {
    const red2 = hex >> 16 & 255;
    const green2 = hex >> 8 & 255;
    const blue = hex & 255;
    return new Color(red2 / 255, green2 / 255, blue / 255, alphaInt / 255);
  }
  copy() {
    return new Color(this.red, this.green, this.blue, this.alpha);
  }
}
const vertexShader$2 = `
    attribute vec2 a_position;
    attribute vec4 a_color;
    
    varying mediump vec4 v_color;
    
    uniform mat4 u_orth;
    uniform mat4 u_transform;
    void main() {
        vec4 position = vec4(a_position, 0.0, 1.0) * u_transform;
        gl_Position = position * u_orth;
        v_color = a_color;
    }
`;
const fragmentShader$2 = `
    varying mediump vec4 v_color;
    uniform mediump vec3 u_circle;
    uniform mediump float u_light;
    void main() {
//        gl_FragColor = v_color;
        lowp float dist = distance(u_circle.xy, gl_FragCoord.xy);
        if (dist < u_circle.z) {
            mediump vec4 color = vec4(0.0);
            color.rgb = min(v_color.rgb + u_light, 1.0);
            color.a = v_color.a;
            gl_FragColor = color;
//            gl_FragColor = v_color;
        } else {
//            gl_FragColor = vec4(0.0, 1.0, 0.0, 0.5);
            discard;
        }
    }
`;
class LogoTriangles extends Drawable {
  constructor(gl, config) {
    super(gl, config);
    __publicField(this, "vertexArray");
    __publicField(this, "vertexBuffer");
    __publicField(this, "layout");
    __publicField(this, "shader");
    __publicField(this, "vertexCount", 0);
    __publicField(this, "vertex");
    __publicField(this, "particles", []);
    __publicField(this, "startColor", Color.fromHex(16743863));
    __publicField(this, "endColor", Color.fromHex(14572437));
    __publicField(this, "MAX_SIZE", 300);
    __publicField(this, "MIN_SIZE", 20);
    __publicField(this, "light", 0);
    __publicField(this, "lightTransition", new ObjectTransition(this, "light"));
    __publicField(this, "velocityIncrement", 0);
    __publicField(this, "velocityTransition", new ObjectTransition(this, "velocityIncrement"));
    __publicField(this, "circleInfo", new Float32Array(3));
    __publicField(this, "isInitialed", false);
    const vertexArray = new VertexArray(gl);
    vertexArray.bind();
    const vertexBuffer = new VertexBuffer(gl, null, gl.STREAM_DRAW);
    const layout = new VertexBufferLayout(gl);
    const shader = new Shader(gl, vertexShader$2, fragmentShader$2);
    vertexBuffer.bind();
    shader.bind();
    layout.pushFloat(shader.getAttributeLocation("a_position"), 2);
    layout.pushFloat(shader.getAttributeLocation("a_color"), 4);
    this.vertexCount = 3 * 42;
    this.vertex = new Float32Array(this.vertexCount * 6);
    for (let i = 0; i < this.vertexCount / 3 - 2; i++) {
      const triangle = new TriangleParticle(this);
      this.particles.push(triangle);
    }
    vertexArray.unbind();
    vertexBuffer.unbind();
    shader.unbind();
    this.shader = shader;
    this.vertexBuffer = vertexBuffer;
    this.vertexArray = vertexArray;
    this.layout = layout;
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
    const width = this.width;
    const height = this.height;
    const { x, y } = this.position;
    const topLeft = new Vector2(x, y);
    const bottomRight = new Vector2(x + width, y - height);
    const vertex = this.vertex;
    Shape2D.quadVector2(topLeft, bottomRight, vertex, 0, 6);
    Shape2D.oneColor(this.startColor, vertex, 2, 6);
    this.updateParticles();
  }
  updateParticles() {
    for (let i = 0; i < this.particles.length; i++) {
      const triangle = this.particles[i];
      if (triangle.isFinish()) {
        triangle.size = Interpolation.valueAt(Math.random(), this.MIN_SIZE, this.MAX_SIZE);
        const { x, y } = this.position;
        triangle.position = new Vector2(
          Interpolation.valueAt(Math.random(), x, x + this.width),
          y - this.height - triangle.size
        );
        triangle.color = colorAt(Math.random(), this.startColor, this.endColor);
        triangle.updateVertex();
      } else {
        const size2 = triangle.size;
        triangle.position.y += 0.2 + size2 / 400 + this.velocityIncrement * (size2 / 400);
        triangle.updateVertex();
        triangle.copyTo(this.vertex, 36 + 18 * i, 6);
      }
    }
  }
  onLoad() {
    super.onLoad();
    this.initParticles();
  }
  initParticles() {
    if (this.isInitialed)
      return;
    this.isInitialed = true;
    for (let i = 0; i < this.particles.length; i++) {
      const triangle = this.particles[i];
      triangle.size = Interpolation.valueAt(Math.random(), this.MIN_SIZE, this.MAX_SIZE);
      const { x, y } = this.position;
      triangle.position = new Vector2(
        Interpolation.valueAt(Math.random(), x, x + this.width),
        Interpolation.valueAt(Math.random(), y, y - this.height)
      );
      triangle.color = colorAt(Math.random(), this.startColor, this.endColor);
      triangle.updateVertex();
    }
  }
  onTransformApplied() {
    super.onTransformApplied();
    const transform = this.appliedTransform;
    const scaledWidth = this.width * window.devicePixelRatio * transform.scale.x;
    const scaledHeight = this.height * window.devicePixelRatio * transform.scale.y;
    const circleMaxRadius = Math.min(scaledWidth, scaledHeight) / 2;
    const circleCenter = new Vector2(
      (Coordinate$1.width / 2 + transform.translate.x) * window.devicePixelRatio,
      (Coordinate$1.height / 2 + transform.translate.y) * window.devicePixelRatio
      // transform.translate.x,
      // transform.translate.y
      // 0, 0
    );
    this.circleInfo[0] = circleCenter.x;
    this.circleInfo[1] = circleCenter.y;
    this.circleInfo[2] = circleMaxRadius;
  }
  bind() {
    this.vertexArray.bind();
    this.vertexBuffer.bind();
    this.shader.bind();
  }
  onDraw() {
    const gl = this.gl;
    this.shader.setUniform1f("u_light", this.light);
    this.shader.setUniform3fv("u_circle", this.circleInfo);
    this.shader.setUniformMatrix4fv("u_transform", this.matrixArray);
    this.shader.setUniformMatrix4fv("u_orth", Coordinate$1.orthographicProjectionMatrix4);
    this.vertexBuffer.setBufferData(this.vertex);
    this.vertexArray.addBuffer(this.vertexBuffer, this.layout);
    gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);
  }
  unbind() {
    this.vertexArray.unbind();
    this.vertexBuffer.unbind();
    this.shader.unbind();
  }
  dispose() {
    super.dispose();
    this.shader.dispose();
    this.vertexArray.dispose();
    this.vertexBuffer.dispose();
  }
}
class TriangleParticle {
  constructor(parent) {
    __publicField(this, "top", Vector2.newZero());
    __publicField(this, "bottomLeft", Vector2.newZero());
    __publicField(this, "bottomRight", Vector2.newZero());
    __publicField(this, "position", Vector2.newZero());
    __publicField(this, "size", 0);
    __publicField(this, "color", Color.fromHex(16743863));
    __publicField(this, "cos30", Math.sqrt(3) / 2);
    __publicField(this, "sin30", 0.5);
    this.parent = parent;
  }
  isFinish() {
    const centerY = this.position.y - 0.5 * this.size;
    return centerY > this.parent.width / 2;
  }
  updateVertex() {
    const position = this.position;
    const size2 = this.size;
    this.top.set(
      position.x,
      position.y + size2
    );
    this.bottomLeft.set(
      position.x - size2 * this.cos30,
      position.y - size2 * this.sin30
    );
    this.bottomRight.set(
      position.x + size2 * this.cos30,
      position.y - size2 * this.sin30
    );
  }
  copyTo(out, offset, stride) {
    const top = this.top;
    const bottomLeft = this.bottomLeft;
    const bottomRight = this.bottomRight;
    Shape2D.triangle(top, bottomLeft, bottomRight, out, offset, stride);
    Shape2D.oneColor(this.color, out, offset + 2, stride);
  }
}
function colorAt(randomValue, startColor, endColor) {
  const r = startColor.red + (endColor.red - startColor.red) * randomValue;
  const g = startColor.green + (endColor.green - startColor.green) * randomValue;
  const b = startColor.blue + (endColor.blue - startColor.blue) * randomValue;
  return new Color(r, g, b, 1);
}
const GlobalState = {
  beatmapFileList: []
};
let beatmapDirectoryId = "beatmap";
const onEnterMenu = createMutableSharedFlow();
const onLeftSide = createMutableSharedFlow();
const onRightSide = createMutableSharedFlow();
class BeatLogo extends Box {
  constructor(gl, config) {
    super(gl, config);
    // @ts-ignore
    __publicField(this, "logo");
    __publicField(this, "triangles");
    const logo = new Logo(gl, {
      size: [520, 520]
    });
    const triangles = new LogoTriangles(gl, {
      size: [500, 500]
    });
    this.logo = logo;
    this.triangles = triangles;
    this.add(
      triangles,
      logo
    );
    BeatDispatcher.register(this);
  }
  onNewBeat(isKiai, newBeatTimestamp, gap) {
    if (!BeatState.isAvailable) {
      return;
    }
    const volume = BeatState.nextBeatRMS;
    const adjust = Math.min(volume + 0.4, 1);
    this.scaleBegin().to(new Vector2(1 - adjust * 0.03, 1 - adjust * 0.03), 60, easeOut).to(new Vector2(1, 1), gap * 2, easeOutQuint);
    this.triangles.velocityBegin().transitionTo(1 + adjust + (BeatState.isKiai ? 4 : 0), 60, easeOut).transitionTo(0, gap * 2, easeOutQuint);
    if (BeatState.isKiai) {
      this.triangles.lightBegin().transitionTo(0.2, 60, easeOut).transitionTo(0, gap * 2, easeOutQuint);
    }
  }
  dispose() {
    super.dispose();
    BeatDispatcher.unregister(this);
  }
}
class LogoBeatBox extends Box {
  constructor(gl, config) {
    super(gl, config);
    __publicField(this, "beatLogo");
    this.beatLogo = new BeatLogo(gl, config);
    this.add(
      this.beatLogo
    );
  }
  onUpdate() {
    if (AudioPlayerV2.isPlaying()) {
      if (BeatState.isAvailable) {
        const scale = this.scale;
        const a = Interpolation.dump(
          scale.x,
          1 - Math.min(BeatState.currentRMS - 0.4, 1) * 0.0635,
          0.9,
          Time.elapsed
        );
        scale.x = a;
        scale.y = a;
        this.scale = scale;
      } else {
        const a = 1 - BeatState.currentRMS * 0.08;
        this.scale = new Vector2(a, a);
      }
    }
  }
}
class LogoAmpBox extends Box {
  constructor(gl, config) {
    super(gl, config);
    __publicField(this, "visualizer");
    __publicField(this, "logoBeatBox");
    this.visualizer = new RoundVisualizer(gl, { size: ["fill-parent", "fill-parent"] });
    const ripple = new Ripples(gl, {
      size: [500, 500]
    });
    this.logoBeatBox = new LogoBeatBox(gl, config);
    this.add(
      this.visualizer,
      ripple,
      this.logoBeatBox
    );
  }
  onHover() {
    this.scaleBegin().to(new Vector2(1.1, 1.1), 500, easeOutElastic);
    return true;
  }
  onHoverLost() {
    this.scaleBegin().to(new Vector2(1, 1), 500, easeOutElastic);
    return true;
  }
}
class LogoBounceBox extends Box {
  constructor(gl, config) {
    super(gl, config);
    __publicField(this, "logoAmpBox");
    __publicField(this, "flag", false);
    __publicField(this, "startPosition", Vector2.newZero());
    this.logoAmpBox = new LogoAmpBox(gl, { size: config.size });
    this.add(this.logoAmpBox);
  }
  onDrag(which) {
    const position = MouseState.position;
    if (!this.flag) {
      this.flag = true;
      this.startPosition.x = MouseState.position.x;
      this.startPosition.y = MouseState.position.y;
    }
    this.translate = new Vector2(
      (position.x - this.startPosition.x) * 0.05,
      (position.y - this.startPosition.y) * 0.05
    );
    return true;
  }
  onDragLost(which) {
    this.flag = false;
    this.translateBegin().translateTo(new Vector2(0, 0), 600, easeOutElastic);
    return true;
  }
}
class BeatLogoBox extends Box {
  constructor(gl, config) {
    super(gl, config);
    __publicField(this, "logoBounceBox");
    __publicField(this, "flag", true);
    this.logoBounceBox = new LogoBounceBox(gl, { size: config.size });
    this.add(this.logoBounceBox);
  }
  onClick(which) {
    const menu = inject("Menu");
    const bg = inject("BackgroundBounce");
    if (this.flag) {
      this.translateBegin().translateTo(new Vector2(-240, 0), 400, easeInCubic);
      this.scaleBegin().to(new Vector2(0.5, 0.5), 400, easeInCubic);
      menu.show();
      bg.in();
    } else {
      this.translateBegin().translateTo(new Vector2(0, 0), 400, easeOutCubic);
      this.scaleBegin().to(new Vector2(1, 1), 400, easeOutCubic);
      menu.hide();
      bg.out();
    }
    const v = this.flag;
    onEnterMenu.emit(v);
    this.flag = !this.flag;
    return true;
  }
}
const vertexShader$1 = `
    attribute vec2 a_position;
    attribute vec4 a_color;
    
    varying mediump vec4 v_color;
    varying mediump float v_coord_x;
    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_coord_x = a_position.x;
        v_color = a_color;
    }
`;
const fragmentShader$1 = `
    varying mediump vec4 v_color;
    varying mediump float v_coord_x;
    uniform mediump vec2 u_which;
    
    void main() {
        mediump vec4 color = vec4(v_color);
        mediump float left = 1.0 - step(-0.4, v_coord_x);
        mediump float right = step(0.4, v_coord_x);       
        if (left > 0.99) {
            color.a = color.a * u_which.x;    
        }
        if (right > 0.99) {
            color.a = color.a * u_which.y;
        }
        
        gl_FragColor = color;
    }
`;
class Flashlight extends BeatDrawable {
  constructor(gl, config) {
    super(gl, config);
    __publicField(this, "vertexArray");
    __publicField(this, "shader");
    __publicField(this, "buffer");
    __publicField(this, "layout");
    __publicField(this, "leftLight", 0);
    __publicField(this, "rightLight", 0);
    __publicField(this, "leftTransition", new ObjectTransition(this, "leftLight"));
    __publicField(this, "rightTransition", new ObjectTransition(this, "rightLight"));
    __publicField(this, "color", Color.fromHex(37119));
    const vertexArray = new VertexArray(gl);
    vertexArray.bind();
    const vertexBuffer = new VertexBuffer(gl, this.createVertex());
    const layout = new VertexBufferLayout(gl);
    const shader = new Shader(gl, vertexShader$1, fragmentShader$1);
    vertexBuffer.bind();
    shader.bind();
    layout.pushFloat(shader.getAttributeLocation("a_position"), 2);
    layout.pushFloat(shader.getAttributeLocation("a_color"), 4);
    vertexArray.addBuffer(vertexBuffer, layout);
    vertexArray.unbind();
    vertexBuffer.unbind();
    shader.unbind();
    this.vertexArray = vertexArray;
    this.buffer = vertexBuffer;
    this.shader = shader;
    this.layout = layout;
  }
  leftLightBegin(atTime = Time.currentTime) {
    this.leftTransition.setStartTime(atTime);
    return this.leftTransition;
  }
  rightLightBegin(atTime = Time.currentTime) {
    this.rightTransition.setStartTime(atTime);
    return this.rightTransition;
  }
  createVertex() {
    const color = this.color;
    return new Float32Array([
      -1,
      1,
      color.red,
      color.green,
      color.blue,
      color.alpha,
      -1,
      -1,
      color.red,
      color.green,
      color.blue,
      color.alpha,
      -0.4,
      -1,
      0,
      0,
      0,
      0,
      -1,
      1,
      color.red,
      color.green,
      color.blue,
      color.alpha,
      -0.4,
      1,
      0,
      0,
      0,
      0,
      -0.4,
      -1,
      0,
      0,
      0,
      0,
      0.4,
      1,
      0,
      0,
      0,
      0,
      1,
      1,
      color.red,
      color.green,
      color.blue,
      color.alpha,
      1,
      -1,
      color.red,
      color.green,
      color.blue,
      color.alpha,
      1,
      -1,
      color.red,
      color.green,
      color.blue,
      color.alpha,
      0.4,
      -1,
      0,
      0,
      0,
      0,
      0.4,
      1,
      0,
      0,
      0,
      0
    ]);
  }
  onUpdate() {
    super.onUpdate();
    this.leftTransition.update(Time.currentTime);
    this.rightTransition.update(Time.currentTime);
  }
  bind() {
    this.vertexArray.bind();
    this.shader.bind();
  }
  onDraw() {
    const gl = this.gl;
    this.shader.setUniform2fv("u_which", new Float32Array([this.leftLight, this.rightLight]));
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_CONSTANT_ALPHA);
    this.vertexArray.addBuffer(this.buffer, this.layout);
    gl.drawArrays(gl.TRIANGLES, 0, 12);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }
  onNewBeat(isKiai, newBeatTimestamp, gap) {
    if (!this.isAvailable)
      return;
    if (!BeatState.isAvailable)
      return;
    const adjust = Math.min(BeatState.nextBeatRMS + 0.4, 1);
    let left = 0, right = 0;
    const lightTimeFunc = easeInQuad;
    const beatLength = gap;
    if (BeatState.isKiai) {
      if ((BeatState.beatIndex & 1) === 0) {
        left = 0.6 * adjust;
        this.leftLightBegin().transitionTo(left, 60).transitionTo(0, beatLength, lightTimeFunc);
      } else {
        right = 0.6 * adjust;
        this.rightLightBegin().transitionTo(right, 60).transitionTo(0, beatLength, lightTimeFunc);
      }
    } else {
      if ((BeatState.beatIndex & 3) === 0 && BeatState.beatIndex != 0) {
        left = 0.4 * adjust;
        right = 0.4 * adjust;
        this.leftLightBegin().transitionTo(left, 60).transitionTo(0, beatLength, lightTimeFunc);
        this.rightLightBegin().transitionTo(right, 60).transitionTo(0, beatLength, lightTimeFunc);
      }
    }
  }
  unbind() {
    this.vertexArray.unbind();
    this.shader.unbind();
  }
  dispose() {
    super.dispose();
    this.shader.dispose();
    this.vertexArray.dispose();
    this.buffer.dispose();
  }
}
class MovableBackground extends Drawable {
  constructor(gl, textureUnit) {
    super(gl, { size: ["fill-parent", "fill-parent"] });
    __publicField(this, "vertexArray");
    __publicField(this, "shader");
    __publicField(this, "buffer");
    __publicField(this, "layout");
    __publicField(this, "texture");
    __publicField(this, "imageDrawInfo", {
      drawHeight: 0,
      drawWidth: 0,
      needToChange: false,
      offsetLeft: 0,
      offsetTop: 0
    });
    __publicField(this, "image", null);
    __publicField(this, "needUpdateTexture", false);
    __publicField(this, "vertex", new Float32Array(4 * 6));
    __publicField(this, "onFinish", null);
    this.textureUnit = textureUnit;
    const vertexArray = new VertexArray(gl);
    vertexArray.bind();
    const buffer = new VertexBuffer(gl);
    const layout = new VertexBufferLayout(gl);
    const shader = StaticTextureShader$1.getShader(gl);
    const texture = new Texture(gl, null);
    buffer.bind();
    shader.bind();
    layout.pushFloat(shader.getAttributeLocation(ATTR_POSITION), 2);
    layout.pushFloat(shader.getAttributeLocation(ATTR_TEXCOORD), 2);
    vertexArray.addBuffer(buffer, layout);
    vertexArray.unbind();
    buffer.unbind();
    shader.unbind();
    this.vertexArray = vertexArray;
    this.buffer = buffer;
    this.layout = layout;
    this.texture = texture;
    this.shader = shader;
  }
  onUpdate() {
    var _a;
    super.onUpdate();
    if (this.fadeTransition.isEnd) {
      (_a = this.onFinish) == null ? void 0 : _a.call(this);
      this.onFinish = null;
    }
    const min = Math.min;
    const viewport = Coordinate$1;
    const { imageWidth, imageHeight } = this.texture;
    const imageDrawInfo = this.imageDrawInfo;
    if (imageDrawInfo.needToChange) {
      const rawWidth = this.width;
      const rawHeight = this.height;
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
      this.updateVertex();
    }
    const scale = 1.01;
    const translate = this.translate;
    const scaledWidth = imageWidth * scale;
    const scaledHeight = imageHeight * scale;
    const shortOnImage = min(scaledHeight, scaledWidth);
    const shortOnViewport = min(viewport.width, viewport.height);
    const factor = shortOnViewport / shortOnImage;
    const widthDiffer = scaledWidth - imageWidth;
    const heightDiffer = scaledHeight - imageHeight;
    const x = factor * widthDiffer / viewport.width * translate.x;
    const y = factor * heightDiffer / viewport.height * translate.y;
    this.scale = new Vector2(scale, scale);
    this.translate = new Vector2(x, y);
  }
  setBackgroundImage(image) {
    this.image = image;
    this.texture.setTextureImage(this.image);
    this.imageDrawInfo.needToChange = true;
    this.needUpdateTexture = true;
  }
  updateVertex() {
    const { x, y } = this.position;
    const width = this.width;
    const height = this.height;
    const topLeft = new Vector2(x, y);
    const bottomRight = new Vector2(x + width, y - height);
    const info = this.imageDrawInfo;
    const imageTopLeft = new Vector2(info.offsetLeft, info.offsetTop);
    const imageBottomRight = new Vector2(info.offsetLeft + info.drawWidth, info.offsetTop + info.drawHeight);
    const imageScale = TransformUtils.scale(1 / this.texture.imageWidth, 1 / this.texture.imageHeight);
    TransformUtils.applyOrigin(imageTopLeft, imageScale);
    TransformUtils.applyOrigin(imageBottomRight, imageScale);
    Shape2D.quad(
      topLeft.x,
      topLeft.y,
      bottomRight.x,
      bottomRight.y,
      this.vertex,
      0,
      4
    );
    Shape2D.quad(
      imageTopLeft.x,
      imageTopLeft.y,
      imageBottomRight.x,
      imageBottomRight.y,
      this.vertex,
      2,
      4
    );
  }
  fadeOut(onFinish) {
    this.fadeBegin().fadeTo(0, 220);
    this.onFinish = onFinish;
  }
  onWindowResize() {
    super.onWindowResize();
    this.imageDrawInfo.needToChange = true;
    this.updateVertex();
  }
  unbind() {
    this.vertexArray.unbind();
    this.texture.unbind();
    this.buffer.unbind();
    this.shader.unbind();
  }
  bind() {
    this.texture.bind(this.textureUnit);
    this.vertexArray.bind();
    this.buffer.bind();
    this.shader.bind();
  }
  onDraw() {
    if (this.needUpdateTexture && this.image) {
      console.log("background need change");
      this.needUpdateTexture = false;
    }
    this.buffer.setBufferData(this.vertex);
    const gl = this.gl;
    const shader = this.shader;
    shader.setUniform1i(UNI_SAMPLER, this.textureUnit);
    shader.setUniformMatrix4fv(UNI_TRANSFORM, this.matrixArray);
    shader.setUniform1f(UNI_ALPHA, this.alpha);
    shader.setUniformMatrix4fv(UNI_ORTH, Coordinate$1.orthographicProjectionMatrix4);
    this.vertexArray.addBuffer(this.buffer, this.layout);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  dispose() {
    super.dispose();
    this.texture.dispose();
    this.vertexArray.dispose();
    StaticTextureShader$1.dispose();
    this.buffer.dispose();
  }
}
class Background extends Box {
  constructor(gl, initImage) {
    super(gl, { size: ["fill-parent", "fill-parent"] });
    __publicField(this, "textureUnits", [2, 3]);
    __publicField(this, "textureUnitIndex", 0);
    __publicField(this, "isFading", false);
    const current = new MovableBackground(gl, this.nextTextureUnit());
    const next = new MovableBackground(gl, this.nextTextureUnit());
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
  updateBackground2(image) {
    if (this.isFading)
      return;
    this.isFading = true;
    this.backImage.setBackgroundImage(image);
    this.backImage.isVisible = true;
    this.backImage.alpha = 1;
    this.frontImage.fadeOut(() => {
      this.frontImage.isVisible = false;
      this.isFading = false;
      this.swap();
    });
  }
  set translate(v) {
    for (let i = 0; i < this.childrenList.length; i++) {
      this.childrenList[i].translate = v;
    }
  }
  get translate() {
    return Vector2.newZero();
  }
  draw() {
    if (this.isVisible) {
      this.backImage.draw();
      this.frontImage.draw();
    }
  }
  nextTextureUnit() {
    this.textureUnitIndex = (this.textureUnitIndex + 1) % this.textureUnits.length;
    return this.textureUnits[this.textureUnitIndex];
  }
}
class BackgroundBounce extends Box {
  constructor(gl, backgroundImage) {
    super(gl, {
      size: ["fill-parent", "fill-parent"]
    });
    __publicField(this, "background");
    this.add(this.background = new Background(gl, backgroundImage));
  }
  in() {
    const startTime = Time.currentTime + 300;
    this.scaleBegin(startTime).to(new Vector2(0.98, 0.98), 500, easeOutQuint);
    this.translateBegin(startTime).translateTo(new Vector2(0, -40), 500, easeOutQuint);
  }
  out() {
    this.scaleBegin().to(new Vector2(1, 1), 500, easeOutQuint);
    this.translateBegin().translateTo(Vector2.newZero(), 500, easeOutQuint);
  }
  updateBackground2(image) {
    this.background.updateBackground2(image);
  }
}
const coloredShaderSource = {
  vertex: `
        attribute vec2 a_position;
        attribute vec4 a_color;

        varying mediump vec4 v_color;
        uniform mat4 u_orth;
        uniform mat4 u_transform;
        void main() {
            vec4 position = vec4(a_position, 0.0, 1.0) * u_transform;
            gl_Position = position * u_orth;
            v_color = a_color;
        }
    `,
  fragment: `
        varying mediump vec4 v_color;
        uniform mediump float u_alpha;
        void main() {
            mediump vec4 color = vec4(v_color);
            color.a = color.a * u_alpha;
            gl_FragColor = color;
        }
    `
};
const textureShaderSource = {
  vertex: `
        attribute vec2 a_position;
        attribute vec2 a_tex_coord;
    
        varying mediump vec2 v_tex_coord;
        uniform mat4 u_orth;
        uniform mat4 u_transform;
        void main() {
            vec4 position = vec4(a_position, 0.0, 1.0) * u_transform;
            gl_Position = position * u_orth;
            v_tex_coord = a_tex_coord;
        }
    `,
  fragment: `
        varying mediump vec2 v_tex_coord;
        uniform mediump float u_alpha;
        uniform sampler2D u_sampler;
    
        void main() {
            mediump vec4 texelColor = texture2D(u_sampler, v_tex_coord);
            texelColor.a = texelColor.a * u_alpha;
            gl_FragColor = texelColor;
        }
    `
};
class ShaderManager {
  constructor() {
    __publicField(this, "gl", null);
  }
  init(gl) {
    this.gl = gl;
  }
  newColoredShader() {
    return new Shader(this.gl, coloredShaderSource.vertex, coloredShaderSource.fragment);
  }
  newTextureShader() {
    return new Shader(this.gl, textureShaderSource.vertex, textureShaderSource.fragment);
  }
}
const ShaderManager$1 = new ShaderManager();
class ColorDrawable extends Drawable {
  constructor(gl, config) {
    super(gl, config);
    __publicField(this, "shader");
    __publicField(this, "buffer");
    __publicField(this, "layout");
    __publicField(this, "vertexArray");
    __publicField(this, "needUpdateVertex", true);
    const vertexArray = new VertexArray(gl);
    vertexArray.bind();
    const buffer = new VertexBuffer(gl);
    const shader = ShaderManager$1.newColoredShader();
    const layout = new VertexBufferLayout(gl);
    buffer.bind();
    shader.bind();
    layout.pushFloat(shader.getAttributeLocation("a_position"), 2);
    layout.pushFloat(shader.getAttributeLocation("a_color"), 4);
    vertexArray.addBuffer(buffer, layout);
    vertexArray.unbind();
    buffer.unbind();
    shader.unbind();
    this.vertexArray = vertexArray;
    this.buffer = buffer;
    this.layout = layout;
    this.shader = shader;
  }
  createVertexArray() {
    const width = this.width;
    const height = this.height;
    const { x, y } = this.position;
    const vertexData = [];
    Shape2D.quad(
      x,
      y,
      x + width,
      y - height,
      vertexData,
      0,
      6
    );
    Shape2D.oneColor(this.config.color, vertexData, 2, 6);
    return new Float32Array(vertexData);
  }
  onWindowResize() {
    super.onWindowResize();
    this.needUpdateVertex = true;
  }
  unbind() {
    this.vertexArray.unbind();
    this.buffer.unbind();
    this.shader.unbind();
  }
  bind() {
    this.vertexArray.bind();
    this.buffer.bind();
    this.shader.bind();
  }
  onDraw() {
    const gl = this.gl;
    if (this.needUpdateVertex) {
      this.needUpdateVertex = false;
      this.buffer.setBufferData(this.createVertexArray());
    }
    const shader = this.shader;
    shader.setUniformMatrix4fv("u_transform", this.matrixArray);
    shader.setUniformMatrix4fv("u_orth", Coordinate$1.orthographicProjectionMatrix4);
    shader.setUniform1f("u_alpha", this.appliedTransform.alpha);
    this.vertexArray.addBuffer(this.buffer, this.layout);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  dispose() {
    this.vertexArray.dispose();
    this.shader.dispose();
    this.buffer.dispose();
  }
}
class Menu extends Box {
  constructor(gl) {
    super(gl, {
      size: ["fill-parent", "fill-parent"]
    });
    __publicField(this, "menuBackground");
    this.menuBackground = new ColorDrawable(gl, {
      size: ["fill-parent", 96],
      anchor: Axis.X_LEFT | Axis.Y_CENTER,
      color: Color.fromHex(3289650)
    });
    this.add(
      this.menuBackground
      // timingButton
    );
    this.alpha = 0;
    this.scale = new Vector2(1, 0);
    this.isVisible = false;
  }
  show() {
    this.isVisible = true;
    this.fadeBegin(Time.currentTime + 300).fadeTo(1, 220, easeInCubic);
    this.scaleBegin(Time.currentTime + 300).to(new Vector2(1, 1), 400, easeOutBack);
  }
  hide() {
    this.fadeBegin().fadeTo(0, 220, easeOutCubic);
    this.scaleBegin().to(new Vector2(1, 0), 220, easeOutCubic);
    setTimeout(() => {
      this.isVisible = false;
    }, 220);
  }
}
class StarParticle {
  constructor() {
    __publicField(this, "from", Vector(0));
    __publicField(this, "to", Vector(0));
    __publicField(this, "alpha", 0.5);
    __publicField(this, "translate", Vector(0));
    __publicField(this, "size", Vector(56));
    __publicField(this, "translateTransition", new Vector2Transition(this, "translate"));
    __publicField(this, "alphaTransition", new ObjectTransition(this, "alpha"));
  }
  setFromAndTo(from, to) {
    this.from = from;
    this.to = to;
    this.translate = from;
  }
  translateBegin(startTime = Time.currentTime) {
    this.translateTransition.setStartTime(startTime);
    return this.translateTransition;
  }
  alphaBegin(startTime = Time.currentTime) {
    this.alphaTransition.setStartTime(startTime);
    return this.alphaTransition;
  }
  reset() {
    this.alpha = 0.5;
    this.translate = this.from;
  }
  isEnd() {
    return this.alphaTransition.isEnd;
  }
  start() {
    this.translateBegin().to(this.to, 1500, easeOutBack);
    this.alphaBegin(Time.currentTime + 1e3).transitionTo(0, 500, easeOutQuint);
  }
  update() {
    this.alphaTransition.update(Time.currentTime);
    this.translateTransition.update(Time.currentTime);
  }
  copyTo(out, offset) {
    let currentOffset = offset;
    const size2 = this.size;
    const position = this.translate;
    Shape2D.quad(
      position.x - size2.x / 2,
      position.y + size2.y / 2,
      position.x + size2.x / 2,
      position.y - size2.y / 2,
      out,
      currentOffset,
      5
    );
    Shape2D.quad(
      0,
      0,
      1,
      1,
      out,
      currentOffset + 2,
      5
    );
    Shape2D.one(this.alpha, out, currentOffset + 4, 5, 6);
    return 5 * 6;
  }
}
class SmokeBooster {
  constructor() {
    __publicField(this, "leftPosition", Vector(0));
    __publicField(this, "rightPosition", Vector(0));
    __publicField(this, "leftStars", []);
    __publicField(this, "rightStars", []);
    __publicField(this, "degree", 90);
    __publicField(this, "degreeTransition", new ObjectTransition(this, "degree"));
    __publicField(this, "type");
    __publicField(this, "duration", 1500);
    __publicField(this, "startTime", -1);
    this.onWindowResize();
  }
  onWindowResize() {
    const width6 = Coordinate$1.width / 6;
    const bottom = -Coordinate$1.height / 2 - 100;
    this.leftPosition.set(
      -Coordinate$1.width / 2 + width6,
      bottom
    );
    this.rightPosition.set(
      Coordinate$1.width / 2 - width6,
      bottom
    );
  }
  degreeBegin(startTime = Time.currentTime) {
    this.degreeTransition.setStartTime(startTime);
    return this.degreeTransition;
  }
  fire(type) {
    this.type = type;
    if (type === 1) {
      this.fireVertically();
    } else if (type === 2) {
      this.fireRotateToInner();
    } else if (type === 3) {
      this.fireRotateToOuter();
    }
  }
  fireVertically() {
    this.degree = 90;
  }
  fireRotateToInner() {
    this.degree = 157.5;
    this.degreeBegin().transitionTo(22.5, 1500);
  }
  fireRotateToOuter() {
    this.degree = 22.5;
    this.degreeBegin().transitionTo(157.5, 1500);
  }
  update() {
    this.degreeTransition.update(Time.currentTime);
    const type = this.type;
    if (type) {
      for (let i = 0; i < 3; i++) {
        this.createOrReuse(this.leftStars, this.leftPosition);
        this.createOrReuse(this.rightStars, this.rightPosition);
      }
    }
    if (this.startTime < 0 && type) {
      this.startTime = Time.currentTime;
      console.time("s");
    }
    for (let i = 0; i < this.leftStars.length; i++) {
      this.leftStars[i].update();
    }
    for (let i = 0; i < this.rightStars.length; i++) {
      this.rightStars[i].update();
    }
    if (Time.currentTime - this.startTime >= this.duration && type) {
      this.startTime = -1;
      this.type = void 0;
      console.timeEnd("s");
    }
  }
  createOrReuse(stars, position) {
    let star2;
    const targetDistance = Interpolation.valueAt(Math.random(), 80, 150);
    let degree = Interpolation.valueAt(Math.random(), this.degree - 10, this.degree + 10);
    if (position === this.rightPosition)
      degree = 180 - degree;
    const startPosition = Vector(
      position.x + Interpolation.valueAt(Math.random(), -20, 20),
      position.y
    );
    if (stars.length === 0) {
      star2 = new StarParticle();
    } else {
      star2 = stars[0];
      if (star2.isEnd()) {
        stars.shift();
      } else {
        star2 = new StarParticle();
      }
    }
    star2.setFromAndTo(startPosition, Vector(
      targetDistance * Math.cos(degreeToRadian(degree)) + position.x,
      targetDistance * Math.sin(degreeToRadian(degree))
    ));
    star2.reset();
    star2.start();
    stars.push(star2);
  }
  copyTo(out, offset) {
    let currentOffset = offset;
    let stars = this.leftStars;
    for (let i = 0; i < stars.length; i++) {
      currentOffset += stars[i].copyTo(out, currentOffset);
    }
    stars = this.rightStars;
    for (let i = 0; i < stars.length; i++) {
      currentOffset += stars[i].copyTo(out, currentOffset);
    }
    return currentOffset - offset;
  }
}
class StarSmoke extends BeatDrawable {
  constructor(gl) {
    super(gl, {
      size: ["fill-parent", "fill-parent"]
    });
    __publicField(this, "vertexArray");
    __publicField(this, "buffer");
    __publicField(this, "texture");
    __publicField(this, "shader");
    __publicField(this, "layout");
    __publicField(this, "textureUnit", 1);
    __publicField(this, "booster", new SmokeBooster());
    __publicField(this, "lastKiai", false);
    __publicField(this, "vertexData", new Float32Array([]));
    __publicField(this, "vertexCount", 0);
    const vertexArray = new VertexArray(gl);
    vertexArray.bind();
    const buffer = new VertexBuffer(gl, null, gl.STREAM_DRAW);
    const layout = new VertexBufferLayout(gl);
    const shader = DynamicTextureShader$1.getShader(gl);
    const texture = new Texture(gl, ImageLoader.get("star"));
    buffer.bind();
    shader.bind();
    layout.pushFloat(shader.getAttributeLocation(ATTR_POSITION), 2);
    layout.pushFloat(shader.getAttributeLocation(ATTR_TEXCOORD), 2);
    layout.pushFloat(shader.getAttributeLocation(ATTR_ALPHA), 1);
    vertexArray.addBuffer(buffer, layout);
    vertexArray.unbind();
    buffer.unbind();
    shader.unbind();
    this.vertexArray = vertexArray;
    this.buffer = buffer;
    this.texture = texture;
    this.layout = layout;
    this.shader = shader;
  }
  onNewBeat(isKiai, newBeatTimestamp, gap) {
    if (!BeatBooster$1.isAvailable) {
      return;
    }
    if (BeatState.isKiai && !this.lastKiai) {
      this.booster.fire(clamp(
        Math.round(Interpolation.valueAt(Math.random(), 1, 3)),
        1,
        3
      ));
      this.lastKiai = true;
      console.log("fire", Time.currentTime);
    }
    this.lastKiai = BeatState.isKiai;
  }
  bind() {
    this.vertexArray.bind();
    this.buffer.bind();
    this.texture.bind(this.textureUnit);
    this.shader.bind();
  }
  onUpdate() {
    super.onUpdate();
    const data = [];
    this.booster.update();
    this.booster.copyTo(data, 0);
    this.vertexData = new Float32Array(data);
    this.vertexCount = int(data.length / 5);
  }
  unbind() {
    this.vertexArray.unbind();
    this.buffer.unbind();
    this.texture.unbind();
    this.shader.unbind();
  }
  onWindowResize() {
    super.onWindowResize();
    this.booster.onWindowResize();
  }
  onDraw() {
    const gl = this.gl;
    const shader = this.shader;
    shader.setUniform1i(UNI_SAMPLER, this.textureUnit);
    shader.setUniformMatrix4fv(UNI_TRANSFORM, this.matrixArray);
    shader.setUniformMatrix4fv(UNI_ORTH, Coordinate$1.orthographicProjectionMatrix4);
    if (this.vertexCount === 0)
      return;
    this.buffer.setBufferData(this.vertexData);
    this.vertexArray.addBuffer(this.buffer, this.layout);
    gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);
  }
  dispose() {
    super.dispose();
    this.texture.dispose();
    this.vertexArray.dispose();
    DynamicTextureShader$1.dispose();
    this.buffer.dispose();
  }
}
class MainScreen extends Box {
  constructor(gl) {
    super(gl, {
      size: ["fill-parent", "fill-parent"]
    });
    __publicField(this, "background");
    __publicField(this, "leftSideCollector", (value) => {
      const translate = value ? new Vector2(40, 0) : Vector2.newZero();
      this.translateBegin().translateTo(translate, 500, easeOutCubic);
    });
    __publicField(this, "rightSideCollector", (value) => {
      const translate = value ? new Vector2(-40, 0) : Vector2.newZero();
      this.translateBegin().translateTo(translate, 500, easeOutCubic);
    });
    __publicField(this, "collector", (bg) => {
      if (bg.image) {
        this.background.isVisible = true;
        this.background.updateBackground2(bg.image);
      } else {
        this.background.isVisible = true;
        this.background.updateBackground2(
          BackgroundLoader$1.getBackground()
        );
      }
    });
    const menu = new Menu(gl);
    const beatLogo = new BeatLogoBox(gl, { size: [520, 520] });
    const background = new BackgroundBounce(gl, OSUPlayer$1.background.value.image);
    this.background = background;
    const flashlight = new Flashlight(gl, { size: ["fill-parent", "fill-parent"] });
    const smoke = new StarSmoke(gl);
    OSUPlayer$1.background.collect(this.collector);
    this.add(
      background,
      menu,
      flashlight,
      beatLogo,
      smoke
    );
    onLeftSide.collect(this.leftSideCollector);
    onRightSide.collect(this.rightSideCollector);
  }
  onUpdate() {
    super.onUpdate();
    this.background.background.translate = MouseState.position.copy();
  }
  dispose() {
    super.dispose();
    OSUPlayer$1.background.removeCollect(this.collector);
    onLeftSide.removeCollect(this.leftSideCollector);
    onRightSide.removeCollect(this.rightSideCollector);
  }
}
class WebGLRenderer {
  constructor(gl) {
    __publicField(this, "drawables", []);
    __publicField(this, "disposables", []);
    __publicField(this, "gl");
    __publicField(this, "isViewportChanged", false);
    __publicField(this, "isEventReady", false);
    this.gl = gl;
    gl.viewport(0, 0, Coordinate$1.width * window.devicePixelRatio, Coordinate$1.height * window.devicePixelRatio);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    MouseState.onClick = this.onClick.bind(this);
    MouseState.onMouseMove = this.onMouseMove.bind(this);
    MouseState.onMouseDown = this.onMouseDown.bind(this);
    MouseState.onMouseUp = this.onMouseUp.bind(this);
    Coordinate$1.onWindowResize = () => {
      this.isViewportChanged = true;
    };
  }
  onClick(which) {
    if (!this.isEventReady)
      return;
    for (let i = 0; i < this.drawables.length; i++) {
      this.drawables[i].click(which, MouseState.position);
    }
  }
  onMouseDown(which) {
    if (!this.isEventReady)
      return;
    for (let i = 0; i < this.drawables.length; i++) {
      this.drawables[i].mouseDown(which, MouseState.position);
    }
  }
  onMouseMove() {
    if (!this.isEventReady)
      return;
    for (let i = 0; i < this.drawables.length; i++) {
      this.drawables[i].mouseMove(MouseState.position);
    }
  }
  onMouseUp(which) {
    if (!this.isEventReady)
      return;
    for (let i = 0; i < this.drawables.length; i++) {
      this.drawables[i].mouseUp(which, MouseState.position);
    }
  }
  addDrawable(drawable) {
    this.drawables.push(drawable);
    drawable.load();
    this.disposables.push(drawable);
  }
  removeDrawable(drawable) {
    const index = this.drawables.indexOf(drawable);
    const drawableToDispose = this.drawables[index];
    this.drawables.splice(index, 1);
    drawableToDispose.dispose();
  }
  render() {
    this.isEventReady = true;
    const gl = this.gl;
    if (this.isViewportChanged) {
      this.isViewportChanged = false;
      gl.viewport(0, 0, Coordinate$1.width * window.devicePixelRatio, Coordinate$1.height * window.devicePixelRatio);
      for (let i = 0; i < this.drawables.length; i++) {
        this.drawables[i].onWindowResize();
      }
    }
    gl.clear(gl.COLOR_BUFFER_BIT);
    for (let i = 0; i < this.drawables.length; i++) {
      const drawable = this.drawables[i];
      drawable.update();
      drawable.draw();
    }
  }
  dispose() {
    for (let i = 0; i < this.disposables.length; i++) {
      this.disposables[i].dispose();
    }
  }
}
class VideoBackground extends Drawable {
  constructor(gl, video) {
    super(gl, {
      size: ["fill-parent", "fill-parent"]
    });
    __publicField(this, "shader");
    __publicField(this, "buffer");
    __publicField(this, "texture");
    __publicField(this, "layout");
    __publicField(this, "vertexArray");
    __publicField(this, "textureUnit", 4);
    __publicField(this, "isVertexUpdate", true);
    this.video = video;
    this.textureUnit = 0;
    const vertexArray = new VertexArray(gl);
    vertexArray.bind();
    const buffer = new VertexBuffer(gl);
    const shader = StaticTextureShader$1.getShader(gl);
    const layout = new VertexBufferLayout(gl);
    const texture = new Texture(gl, video);
    buffer.bind();
    shader.bind();
    layout.pushFloat(shader.getAttributeLocation(ATTR_POSITION), 2);
    layout.pushFloat(shader.getAttributeLocation(ATTR_TEXCOORD), 2);
    vertexArray.addBuffer(buffer, layout);
    vertexArray.unbind();
    buffer.unbind();
    shader.unbind();
    this.vertexArray = vertexArray;
    this.buffer = buffer;
    this.layout = layout;
    this.shader = shader;
    this.texture = texture;
  }
  setVideo(video) {
    this.video = video;
  }
  createVertexArray() {
    const width = this.width;
    const height = this.height;
    const { x, y } = this.position;
    const topLeft = new Vector2(x, y);
    const bottomRight = new Vector2(x + width, y - height);
    const vertexData = [];
    Shape2D.quadVector2(
      topLeft,
      bottomRight,
      vertexData,
      0,
      4
    );
    Shape2D.quad(
      0,
      0,
      1,
      1,
      vertexData,
      2,
      4
    );
    return new Float32Array(vertexData);
  }
  onWindowResize() {
    super.onWindowResize();
    this.isVertexUpdate = true;
  }
  onUpdate() {
    if (this.video) {
      this.texture.setTextureVideo(this.video);
    }
  }
  unbind() {
    this.vertexArray.unbind();
    this.buffer.unbind();
    this.texture.unbind();
    this.shader.unbind();
  }
  bind() {
    this.texture.bind(this.textureUnit);
    this.vertexArray.bind();
    this.buffer.bind();
    this.shader.bind();
  }
  onDraw() {
    const gl = this.gl;
    if (this.isVertexUpdate) {
      this.buffer.setBufferData(this.createVertexArray());
      this.isVertexUpdate = false;
    }
    this.shader.setUniform1i(UNI_SAMPLER, this.textureUnit);
    this.shader.setUniformMatrix4fv(UNI_TRANSFORM, this.matrixArray);
    this.shader.setUniformMatrix4fv(UNI_ORTH, Coordinate$1.orthographicProjectionMatrix4);
    this.shader.setUniform1f(UNI_ALPHA, this.alpha);
    this.vertexArray.addBuffer(this.buffer, this.layout);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  dispose() {
    this.texture.dispose();
    this.vertexArray.dispose();
    StaticTextureShader$1.dispose();
    this.buffer.dispose();
  }
}
class BeatBox extends Box {
  constructor(gl, config) {
    super(gl, config);
    BeatDispatcher.register(this);
  }
  dispose() {
    super.dispose();
    BeatDispatcher.unregister(this);
  }
}
class ImageDrawable extends Drawable {
  constructor(gl, image, textureUnit = 0, config) {
    super(gl, config);
    __publicField(this, "shader");
    __publicField(this, "buffer");
    __publicField(this, "texture");
    __publicField(this, "layout");
    __publicField(this, "vertexArray");
    __publicField(this, "textureUnit", 0);
    __publicField(this, "isVertexUpdate", true);
    this.textureUnit = textureUnit;
    const vertexArray = new VertexArray(gl);
    vertexArray.bind();
    const buffer = new VertexBuffer(gl);
    const shader = StaticTextureShader$1.getShader(gl);
    const layout = new VertexBufferLayout(gl);
    const texture = new Texture(gl, image);
    buffer.bind();
    shader.bind();
    layout.pushFloat(shader.getAttributeLocation(ATTR_POSITION), 2);
    layout.pushFloat(shader.getAttributeLocation(ATTR_TEXCOORD), 2);
    vertexArray.addBuffer(buffer, layout);
    vertexArray.unbind();
    buffer.unbind();
    shader.unbind();
    this.vertexArray = vertexArray;
    this.buffer = buffer;
    this.layout = layout;
    this.shader = shader;
    this.texture = texture;
  }
  createVertexArray() {
    const width = this.width;
    const height = this.height;
    const { x, y } = this.position;
    const vertexData = [];
    Shape2D.quad(
      x,
      y,
      x + width,
      y - height,
      vertexData,
      0,
      4
    );
    Shape2D.quad(0, 0, 1, 1, vertexData, 2, 4);
    return new Float32Array(vertexData);
  }
  onWindowResize() {
    super.onWindowResize();
    this.isVertexUpdate = true;
  }
  unbind() {
    this.vertexArray.unbind();
    this.buffer.unbind();
    this.texture.unbind();
    this.shader.unbind();
  }
  bind() {
    this.texture.bind(this.textureUnit);
    this.vertexArray.bind();
    this.buffer.bind();
    this.shader.bind();
  }
  onDraw() {
    const gl = this.gl;
    if (this.isVertexUpdate) {
      this.buffer.setBufferData(this.createVertexArray());
      this.isVertexUpdate = false;
    }
    const shader = this.shader;
    shader.setUniform1i(UNI_SAMPLER, this.textureUnit);
    shader.setUniformMatrix4fv(UNI_TRANSFORM, this.matrixArray);
    shader.setUniformMatrix4fv(UNI_ORTH, Coordinate$1.orthographicProjectionMatrix4);
    shader.setUniform1f(UNI_ALPHA, this.appliedTransform.alpha);
    this.vertexArray.addBuffer(this.buffer, this.layout);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  dispose() {
    this.texture.dispose();
    this.vertexArray.dispose();
    StaticTextureShader$1.dispose();
    this.buffer.dispose();
  }
}
class FadeLogo extends BeatBox {
  constructor(gl, config) {
    super(gl, { size: ["fill-parent", "fill-parent"] });
    __publicField(this, "logo");
    this.logo = new ImageDrawable(gl, ImageLoader.get("logo"), 1, config);
    this.logo.alpha = 0.3;
    this.add(this.logo);
  }
  onNewBeat(isKiai, newBeatTimestamp, gap) {
    this.logo.fadeBegin().fadeTo(0.5, 60, easeOut).fadeTo(0.3, gap * 2, easeOutQuint);
  }
}
class SongPlayScreen extends Box {
  constructor(gl) {
    super(gl, {
      size: ["fill-parent", "fill-parent"]
    });
    __publicField(this, "background");
    __publicField(this, "videoBackground");
    __publicField(this, "collector", (bg) => {
      if (bg.video) {
        this.videoBackground.isVisible = true;
        this.videoBackground.setVideo(bg.video);
        this.background.isVisible = false;
      } else if (bg.image) {
        this.background.isVisible = true;
        this.videoBackground.isVisible = false;
        this.background.updateBackground2(bg.image);
      } else {
        this.background.isVisible = true;
        this.videoBackground.isVisible = false;
        this.background.updateBackground2(BackgroundLoader$1.getBackground());
      }
    });
    console.log("reload song play screen");
    this.background = new Background(gl, OSUPlayer$1.background.value.image);
    this.videoBackground = new VideoBackground(gl, null);
    OSUPlayer$1.background.collect(this.collector);
    const fadeLogo = new FadeLogo(gl, {
      size: [250, 250]
    });
    const logo = new LogoBounceBox(gl, {
      size: [520, 520],
      anchor: Axis.X_RIGHT | Axis.Y_BOTTOM,
      offset: [250 - 66, -250 + 24]
    });
    logo.scale = new Vector2(0.4, 0.4);
    logo.translate = new Vector2(0, -128);
    logo.translateBegin().translateTo(new Vector2(0, 0), 400, easeOutBack);
    this.add(
      this.background,
      this.videoBackground,
      fadeLogo,
      logo
    );
  }
  onUpdate() {
    super.onUpdate();
    this.background.translate = MouseState.position.copy();
  }
  dispose() {
    super.dispose();
    OSUPlayer$1.background.removeCollect(this.collector);
  }
}
const noteEffect = "" + new URL("soft-hitwhistle-244b7593.wav", import.meta.url).href;
class OSUParser {
  static parse(textContent) {
    const osuFile2 = {};
    const lines = textContent.split("\n").map((v) => v.trim());
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line === this.hitObject && osuFile2.General) {
        if (osuFile2.General.Mode === 3) {
          this.parseMania(lines, i + 1, osuFile2);
        } else if (osuFile2.General.Mode === 0) {
          this.parseStd(lines, i + 1, osuFile2);
        }
      } else if (line === this.general) {
        this.parseGeneral(lines, i + 1, osuFile2);
      } else if (line === this.metadata) {
        this.parseMetadata(lines, i + 1, osuFile2);
      } else if (line === this.timingPoints) {
        this.parseTimingPoints(lines, i + 1, osuFile2);
      } else if (line === this.events) {
        this.parseEvents(lines, i + 1, osuFile2);
      }
    }
    return osuFile2;
  }
  static parseEvents(lines, index, out) {
    let i = index;
    out.Events = {};
    while (lines[i].length > 0 && lines[i].charAt(0) !== "[") {
      const line = lines[i++];
      if (line.startsWith("Video")) {
        const firstIndex = line.indexOf('"');
        const lastIndex = line.lastIndexOf('"');
        if (firstIndex >= 0 && lastIndex > 0) {
          out.Events.videoBackground = line.substring(firstIndex + 1, lastIndex);
        }
      } else if (line.startsWith("0,0")) {
        const firstIndex = line.indexOf('"');
        const lastIndex = line.lastIndexOf('"');
        if (firstIndex >= 0 && lastIndex > 0) {
          out.Events.imageBackground = line.substring(firstIndex + 1, lastIndex);
        }
      }
    }
  }
  // track, none, startTime, none, none, endTime
  static parseMania(lines, index, out) {
    let i = index;
    const tracks = [];
    while (lines[i].length > 0 && lines[i].charAt(0) !== "[") {
      const line = lines[i++];
      const [track2, _1, startTime, _2, _3, endTime] = line.split(",");
      const trackNumber = parseInt(track2);
      const startTimeNumber = parseInt(startTime);
      const endTimeNumber = parseInt(endTime);
      let trackIndex = 0;
      if (trackNumber === 64)
        trackIndex = 0;
      else if (trackNumber === 192)
        trackIndex = 1;
      else if (trackNumber === 320)
        trackIndex = 2;
      else if (trackNumber === 448)
        trackIndex = 3;
      let list = tracks[trackIndex];
      if (!list) {
        list = [];
        tracks[trackIndex] = list;
      }
      list.push({
        noteIndex: 0,
        startTime: startTimeNumber,
        endTime: endTimeNumber
      });
    }
    for (let j = 0; j < tracks.length; j++) {
      for (let k = 0; k < tracks[j].length; k++) {
        tracks[j][k].noteIndex = k;
      }
    }
    out.NoteData = tracks;
  }
  static parseStd(lines, index, out) {
    let i = index;
    const stdNotes = [];
    while (lines[i].length > 0 && lines[i].charAt(0) !== "[") {
      const line = lines[i++];
      const [x, y, startTime, objectType] = line.split(",");
      const note = {
        x: parseInt(x),
        y: parseInt(y),
        type: parseInt(objectType),
        startTime: parseInt(startTime)
      };
      stdNotes.push(note);
    }
    out.HitObjects = {
      stdNotes
    };
    console.log(stdNotes);
  }
  static parseGeneral(lines, index, out) {
    let i = index;
    const general = {
      AudioFilename: "",
      PreviewTime: 0,
      Mode: 3
    };
    while (lines[i].length > 0 && lines[i].charAt(0) !== "[") {
      const [key2, value] = lines[i++].split(":").map((v) => v.trim());
      if (key2 === "AudioFilename") {
        general.AudioFilename = value;
      } else if (key2 === "PreviewTime") {
        general.PreviewTime = parseInt(value);
      } else if (key2 === "Mode") {
        general.Mode = parseInt(value);
      }
    }
    out.General = general;
  }
  static parseMetadata(lines, index, out) {
    let i = index;
    const metadata = { Title: "", TitleUnicode: "", Artist: "", ArtistUnicode: "", Version: "", BeatmapID: "-1" };
    while (lines[i].length > 0 && lines[i].charAt(0) !== "[") {
      const [key2, value] = lines[i++].split(":").map((v) => v.trim());
      if (key2 === "Title") {
        metadata.Title = value;
      } else if (key2 === "TitleUnicode") {
        metadata.TitleUnicode = value;
      } else if (key2 === "Artist") {
        metadata.Artist = value;
      } else if (key2 === "ArtistUnicode") {
        metadata.ArtistUnicode = value;
      } else if (key2 === "Version") {
        metadata.Version = value;
      }
    }
    out.Metadata = metadata;
  }
  static parseTimingPoints(lines, index, out) {
    let i = index;
    const timingPoints = {
      offset: 0,
      beatGap: 200,
      timingList: []
    };
    let lineIndex = 0;
    while (lines[i].length > 0 && lines[i].charAt(0) !== "[") {
      if (lineIndex === 0) {
        const [offset, beatGap] = lines[i++].split(",").map((v) => v.trim());
        const offsetNumber = parseInt(offset);
        const beatGapNumber = parseFloat(beatGap);
        timingPoints.beatGap = beatGapNumber;
        timingPoints.offset = offsetNumber;
      } else {
        const [offset, _0, _1, _2, _3, _4, _5, isKiai] = lines[i++].split(",").map((s) => {
          return parseInt(s.trim());
        });
        timingPoints.timingList.push({
          offset,
          isKiai: isKiai === 1
        });
      }
      lineIndex++;
    }
    out.TimingPoints = timingPoints;
  }
}
__publicField(OSUParser, "hitObject", "[HitObjects]");
__publicField(OSUParser, "general", "[General]");
__publicField(OSUParser, "metadata", "[Metadata]");
__publicField(OSUParser, "timingPoints", "[TimingPoints]");
__publicField(OSUParser, "events", "[Events]");
class Score {
}
__publicField(Score, "perfect", ref(0));
__publicField(Score, "good", ref(0));
__publicField(Score, "bad", ref(0));
__publicField(Score, "miss", ref(0));
const vertexShader = `
    attribute vec2 a_position;
    attribute vec4 a_color;
//    attribute vec2 a_tex_coord;
    
//    varying mediump vec2 v_tex_coord;
    varying mediump vec4 v_color;
    
//    uniform mat4 u_transform;
    uniform mat4 u_orth;
    
    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0) * u_orth;
//        v_tex_coord = a_tex_coord;
        v_color = a_color;
    }
`;
const fragmentShader = `
//    varying mediump vec2 v_tex_coord;
//    uniform sampler2D u_sampler;
    varying mediump vec4 v_color;
    void main() {
//        mediump vec4 texelColor = texture2D(u_sampler, v_tex_coord);
//        gl_FragColor = texelColor;
//         gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        gl_FragColor = v_color;
    }
`;
const yellow = Color.fromHex(16776960);
const green = Color.fromHex(65280);
const red = Color.fromHex(16711680);
const purple = Color.fromHex(16711935);
class ManiaPanel extends Drawable {
  constructor(gl, offsetLeft = 800, trackWidth = 120, trackGap = 12, noteData) {
    super(gl, {
      size: [trackWidth * 4 + trackGap * 5 + 20, "fill-parent"]
    });
    __publicField(this, "trackCount", 4);
    __publicField(this, "tracks", []);
    __publicField(this, "keys", ["KeyS", "KeyD", "KeyJ", "KeyK"]);
    __publicField(this, "keyState", [false, false, false, false]);
    __publicField(this, "judgementLinePosition", 80);
    // from top to bottom, percent
    __publicField(this, "vertexArray");
    __publicField(this, "vertexBuffer");
    __publicField(this, "shader");
    __publicField(this, "layout");
    __publicField(this, "songProgress", new SongProgress());
    __publicField(this, "onKeyDown", (e) => {
      const index = this.keys.indexOf(e.code);
      if (index < 0 || index >= this.tracks.length)
        return;
      if (!this.keyState[index]) {
        this.keyState[index] = true;
        this.tracks[index].hit();
      }
    });
    __publicField(this, "vertexData", new Float32Array());
    __publicField(this, "vertexArrayData", []);
    __publicField(this, "vertexCount", 0);
    this.offsetLeft = offsetLeft;
    this.trackWidth = trackWidth;
    this.trackGap = trackGap;
    window.addEventListener("keydown", this.onKeyDown, {
      passive: true
    });
    window.addEventListener("keyup", (e) => {
      const index = this.keys.indexOf(e.code);
      if (index < 0 || index >= this.tracks.length)
        return;
      this.tracks[index].hitUp();
      this.keyState[index] = false;
    });
    const vertexArray = new VertexArray(gl);
    vertexArray.bind();
    const vertexBuffer = new VertexBuffer(gl, null, gl.STREAM_DRAW);
    const layout = new VertexBufferLayout(gl);
    const shader = new Shader(gl, vertexShader, fragmentShader);
    vertexBuffer.bind();
    shader.bind();
    layout.pushFloat(shader.getAttributeLocation("a_position"), 2);
    layout.pushFloat(shader.getAttributeLocation("a_color"), 4);
    vertexArray.addBuffer(vertexBuffer, layout);
    vertexArray.unbind();
    vertexBuffer.unbind();
    shader.unbind();
    this.vertexBuffer = vertexBuffer;
    this.layout = layout;
    this.shader = shader;
    this.vertexArray = vertexArray;
    this.offsetLeft = this.position.x + 10 + this.trackGap;
    let currentOffsetLeft = this.offsetLeft;
    const colors = [yellow, green, red, purple];
    for (let i = 0; i < this.trackCount; i++) {
      const track2 = new ManiaTrack(
        noteData[i],
        this.judgementLinePosition,
        350,
        currentOffsetLeft,
        this.trackWidth,
        colors[i],
        this
      );
      currentOffsetLeft += this.trackWidth + this.trackGap;
      this.tracks.push(track2);
    }
  }
  bind() {
    this.vertexArray.bind();
    this.vertexBuffer.bind();
    this.shader.bind();
  }
  onUpdate() {
    super.onUpdate();
    for (let i = 0; i < this.tracks.length; i++) {
      this.tracks[i].update();
    }
    this.songProgress.update();
    this.vertexArrayData = [];
    let offset = 0;
    for (let i = 0; i < this.tracks.length; i++) {
      offset += this.tracks[i].copyTo(this.vertexArrayData, offset);
    }
    this.vertexData = new Float32Array(this.vertexArrayData);
    this.vertexCount = int(this.vertexArrayData.length / 6);
  }
  unbind() {
    this.vertexArray.unbind();
    this.vertexBuffer.unbind();
    this.shader.unbind();
  }
  onDraw() {
    const gl = this.gl;
    this.shader.setUniformMatrix4fv("u_orth", Coordinate$1.orthographicProjectionMatrix4);
    this.vertexBuffer.setBufferData(this.vertexData);
    this.vertexArray.addBuffer(this.vertexBuffer, this.layout);
    gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);
  }
  dispose() {
    super.dispose();
    window.removeEventListener("keydown", this.onKeyDown);
  }
}
const key = new Audio(noteEffect);
key.load();
class ManiaTrack {
  constructor(noteDataList, judgementLinePosition, movementDuration, offsetLeft, trackWidth, mainColor, panel) {
    __publicField(this, "noteList", []);
    __publicField(this, "isFinish", false);
    __publicField(this, "alpha", 0);
    __publicField(this, "fadeTransition", new ObjectTransition(this, "alpha"));
    this.judgementLinePosition = judgementLinePosition;
    this.movementDuration = movementDuration;
    this.offsetLeft = offsetLeft;
    this.trackWidth = trackWidth;
    this.mainColor = mainColor;
    this.panel = panel;
    for (let i = 0; i < noteDataList.length; i++) {
      const note = new Note(
        panel,
        this.trackWidth,
        12,
        this.offsetLeft,
        this.movementDuration,
        this.judgementLinePosition,
        this.mainColor,
        noteDataList[i],
        (isHold, isHoldEnd) => {
          if (isHold) {
            if (isHoldEnd) {
              this.fadeBegin().transitionTo(0, 200, ease);
            } else {
              this.fadeBegin().transitionTo(0.3, 60, easeOut);
            }
          } else {
            this.fadeBegin().transitionTo(0.3, 60, easeOut).transitionTo(0, 200, ease);
          }
        }
      );
      this.noteList.push(note);
    }
  }
  fadeBegin(time = Time.currentTime) {
    this.fadeTransition.setStartTime(time);
    return this.fadeTransition;
  }
  update() {
    if (this.isFinish) {
      return;
    }
    this.fadeTransition.update(Time.currentTime);
    const currentTime = AudioPlayerV2.currentTime();
    this.updateNoteQueue(currentTime);
  }
  updateNoteQueue(startTime) {
    const noteList = this.noteList;
    for (let i = 0; i < noteList.length; i++) {
      noteList[i].update();
    }
  }
  hit() {
    const noteList = this.noteList;
    this.alpha = 0.3;
    key.play();
    for (let i = 0; i < noteList.length; i++) {
      if (noteList[i].hit()) {
        return;
      }
    }
  }
  hitUp() {
    this.alpha = 0;
  }
  copyTo(out, offset) {
    const noteList = this.noteList;
    const currentTime = AudioPlayerV2.currentTime();
    const endTime = currentTime + this.movementDuration;
    const { red: red2, green: green2, blue } = this.mainColor;
    Shape2D.quad(
      this.offsetLeft,
      Coordinate$1.height / 2,
      this.offsetLeft + this.trackWidth,
      // this.panel.position.y - this.panel.height * (this.judgementLinePosition / 100),
      -this.panel.height / 2,
      out,
      offset,
      6
    );
    const brightness = 0.8;
    Shape2D.color(
      clamp(red2 - brightness, 0, 1),
      clamp(green2 - brightness, 0, 1),
      clamp(blue - brightness, 0, 1),
      1,
      clamp(red2 - brightness, 0, 1),
      clamp(green2 - brightness, 0, 1),
      clamp(blue - brightness, 0, 1),
      1,
      clamp(red2 - brightness, 0, 1),
      clamp(green2 - brightness, 0, 1),
      clamp(blue - brightness, 0, 1),
      1,
      clamp(red2 - brightness, 0, 1),
      clamp(green2 - brightness, 0, 1),
      clamp(blue - brightness, 0, 1),
      1,
      out,
      offset + 2,
      6
    );
    let currentOffset = offset + 36;
    Shape2D.quad(
      this.offsetLeft,
      Coordinate$1.height / 2 * 0.4,
      this.offsetLeft + this.trackWidth,
      this.panel.position.y - this.panel.height * (this.judgementLinePosition / 100),
      out,
      currentOffset,
      6
    );
    Shape2D.color(
      0,
      0,
      0,
      0,
      red2,
      green2,
      blue,
      this.alpha,
      0,
      0,
      0,
      0,
      red2,
      green2,
      blue,
      this.alpha,
      out,
      currentOffset + 2,
      6
    );
    currentOffset += 36;
    Shape2D.quad(
      this.offsetLeft,
      this.panel.position.y - this.judgementLinePosition / 100 * this.panel.height,
      this.offsetLeft + this.trackWidth,
      -this.panel.height / 2,
      out,
      currentOffset,
      6
    );
    const stageAlpha = Math.min(
      this.alpha,
      1
    );
    Shape2D.color(
      red2,
      green2,
      blue,
      stageAlpha,
      red2,
      green2,
      blue,
      stageAlpha,
      red2,
      green2,
      blue,
      stageAlpha,
      red2,
      green2,
      blue,
      stageAlpha,
      out,
      currentOffset + 2,
      6
    );
    currentOffset += 36;
    for (let i = 0; i < noteList.length; i++) {
      const data = noteList[i].noteData;
      if (data.startTime > endTime) {
        continue;
      }
      if (data.endTime > 0 && data.endTime < currentTime) {
        continue;
      }
      if (data.startTime < currentTime && data.endTime === 0) {
        continue;
      }
      currentOffset += noteList[i].copyTo(out, currentOffset, 6);
    }
    Shape2D.quad(
      this.offsetLeft,
      this.panel.position.y - this.judgementLinePosition / 100 * this.panel.height,
      this.offsetLeft + this.trackWidth,
      this.panel.position.y - this.judgementLinePosition / 100 * this.panel.height + 5,
      out,
      currentOffset,
      6
    );
    Shape2D.color(
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      out,
      currentOffset + 2,
      6
    );
    currentOffset += 36;
    return currentOffset;
  }
}
const _Note = class _Note {
  constructor(panel, noteWidth, noteHeight, offsetLeft, movementDuration, judgementLinePosition, color, noteData, onNoteReceive) {
    __publicField(this, "judgeResult", _Note.JUDGE_NONE);
    __publicField(this, "position", Vector2.newZero());
    __publicField(this, "topLeft", Vector2.newZero());
    __publicField(this, "bottomRight", Vector2.newZero());
    __publicField(this, "lastTrigger", [false, false]);
    __publicField(this, "color", Color.fromHex(65535));
    this.panel = panel;
    this.noteHeight = noteHeight;
    this.movementDuration = movementDuration;
    this.judgementLinePosition = judgementLinePosition;
    this.noteData = noteData;
    this.onNoteReceive = onNoteReceive;
    this.color = color;
    this.position.x = offsetLeft;
    this.position.y = panel.height / 2;
    const topLeft = this.topLeft;
    const bottomRight = this.bottomRight;
    topLeft.x = this.position.x;
    topLeft.y = this.position.y;
    bottomRight.x = this.position.x + noteWidth;
    bottomRight.y = this.position.y - noteHeight;
  }
  update() {
    const currentTime = AudioPlayerV2.currentTime();
    const endTime = currentTime + this.movementDuration;
    if (this.startTime > endTime) {
      return;
    }
    this.autoHit();
    this.updateVertex();
    if (this.judgeResult >= 0) {
      return;
    }
    const diffTime = this.startTime - currentTime;
    if (diffTime <= -120 && this.judgeResult === _Note.JUDGE_NONE) {
      this.judgeResult = _Note.JUDGE_MISS;
      Score.miss.value++;
    }
  }
  updateVertex() {
    const currentTime = AudioPlayerV2.currentTime();
    const noteArea = this.panel.height * (this.judgementLinePosition / 100);
    const endTime = currentTime + this.movementDuration;
    const noteStartTime = this.noteData.startTime;
    const noteEndTime = this.noteData.endTime;
    const startPercent = (noteStartTime - currentTime) / (endTime - currentTime);
    const endPercent = (noteEndTime - currentTime) / (endTime - currentTime);
    const noteHeight = this.noteHeight;
    const panelTop = this.panel.height / 2;
    let topY = panelTop, bottomY = -this.panel.height / 2;
    if (noteEndTime > 0) {
      if (noteEndTime > endTime) {
        topY = panelTop;
      } else if (endPercent < 0) {
        topY = panelTop - noteArea;
      } else {
        topY = panelTop - (1 - endPercent) * noteArea;
      }
      if (startPercent < 0) {
        bottomY = panelTop - noteArea;
      } else {
        bottomY = panelTop - (1 - startPercent) * noteArea;
      }
    } else {
      topY = panelTop - (1 - startPercent) * noteArea - noteHeight;
      bottomY = panelTop - (1 - startPercent) * noteArea;
    }
    this.position.y = bottomY;
    this.topLeft.y = topY;
    this.bottomRight.y = this.position.y;
  }
  // @ts-ignore
  triggerNoteReceive(isHold, isHoldEnd, check = true) {
    if (check && this.lastTrigger[0] === isHold && this.lastTrigger[1] === isHoldEnd) {
      return;
    }
    this.lastTrigger[0] = isHold;
    this.lastTrigger[1] = isHoldEnd;
    this.onNoteReceive(isHold, isHoldEnd);
  }
  hit() {
    if (this.judgeResult !== _Note.JUDGE_NONE) {
      return false;
    }
    const currentTime = AudioPlayerV2.currentTime();
    const endTime = currentTime + this.movementDuration;
    const data = this.noteData;
    if (data.startTime > endTime) {
      return false;
    }
    if (data.endTime > 0 && data.endTime < currentTime) {
      return false;
    }
    const diffTime = this.startTime - currentTime;
    const absDiffTime = Math.abs(diffTime);
    if (absDiffTime <= 60) {
      this.judgeResult = _Note.JUDGE_PERFECT;
      Score.perfect.value++;
    } else if (absDiffTime <= 80) {
      this.judgeResult = _Note.JUDGE_GOOD;
      Score.good.value++;
    } else if (absDiffTime <= 100) {
      this.judgeResult = _Note.JUDGE_BAD;
      Score.bad.value++;
    } else if (diffTime >= 120) {
      this.judgeResult = _Note.JUDGE_MISS;
      Score.miss.value++;
    } else {
      return false;
    }
    return true;
  }
  autoHit() {
    if (this.judgeResult !== _Note.JUDGE_NONE) {
      return false;
    }
    const currentTime = AudioPlayerV2.currentTime();
    const endTime = currentTime + this.movementDuration;
    const data = this.noteData;
    if (data.startTime > endTime) {
      return false;
    }
    if (data.endTime > 0 && data.endTime < currentTime) {
      return false;
    }
    const diffTime = this.startTime - currentTime;
    const absDiffTime = Math.abs(diffTime);
    if (absDiffTime <= 60 || diffTime < 0) {
      this.judgeResult = _Note.JUDGE_PERFECT;
      Score.perfect.value++;
      this.onNoteReceive(false, true);
    }
  }
  get startTime() {
    return this.noteData.startTime;
  }
  copyTo(out, offset, stride) {
    Shape2D.quadVector2(
      this.topLeft,
      this.bottomRight,
      out,
      offset,
      stride
    );
    Shape2D.oneColor(this.color, out, offset + 2, stride);
    return 36;
  }
};
__publicField(_Note, "JUDGE_NONE", -1);
__publicField(_Note, "JUDGE_MISS", 0);
__publicField(_Note, "JUDGE_BAD", 1);
__publicField(_Note, "JUDGE_GOOD", 2);
__publicField(_Note, "JUDGE_PERFECT", 3);
__publicField(_Note, "VERTEX_COUNT", 6);
let Note = _Note;
class SongProgress {
  constructor() {
    __publicField(this, "topLeft", Vector2.newZero());
    __publicField(this, "bottomRight", Vector2.newZero());
    __publicField(this, "color", Color.fromHex(16776960, 128));
    __publicField(this, "height", 10);
  }
  update() {
    const percent = AudioPlayerV2.currentTime() / AudioPlayerV2.duration();
    const height = Coordinate$1.glYLength(this.height);
    this.topLeft.set(-1, -1 + height);
    this.bottomRight.set(-1 + 2 * percent, -1);
  }
  copyTo(out, offset, stride) {
    Shape2D.quad(
      this.topLeft.x,
      this.topLeft.y,
      this.bottomRight.x,
      this.bottomRight.y,
      out,
      offset,
      stride
    );
    const r = this.color.red;
    const g = this.color.green;
    const b = this.color.blue;
    const a = this.color.alpha;
    Shape2D.color(
      r,
      g,
      b,
      a,
      r,
      g,
      b,
      a,
      r,
      g,
      b,
      a,
      r,
      g,
      b,
      a,
      out,
      offset + 2,
      stride
    );
    return 36;
  }
}
var text = `osu file format v14

[General]
AudioFilename: audio.ogg
AudioLeadIn: 0
PreviewTime: 164959
Countdown: 0
SampleSet: None
StackLeniency: 0.7
Mode: 3
LetterboxInBreaks: 0
SpecialStyle: 0
WidescreenStoryboard: 1

[Editor]
Bookmarks: 120516
DistanceSpacing: 0.8
BeatDivisor: 3
GridSize: 32
TimelineZoom: 1.800001

[Metadata]
Title:Idol
TitleUnicode:アイドル
Artist:YOASOBI
ArtistUnicode:YOASOBI
Creator:Akasha-
Version:CS' Hard
Source:【推しの子】
Tags:【Oshi no Ko】Oshi no Ko her fans Their idol's children 星野 愛久愛海 瑠美衣 Hoshino Akuamarin Aquamarine Aqua アクア Ruby Rubii ai アイ Aidoru My Star 幾田りら ikuta lilas ikura ayase jpop j-pop pop rap anime japanese opening op Kuo Kyoka Critical_Star Mirsaaa
BeatmapID:4147032
BeatmapSetID:1982752

[Difficulty]
HPDrainRate:7.5
CircleSize:4
OverallDifficulty:7.5
ApproachRate:5
SliderMultiplier:1.4
SliderTickRate:1

[Events]
//Background and Video events
Video,-135,"video.mp4"
0,0,"BG2.jpg",0,0
//Break Periods
//Storyboard Layer 0 (Background)
//Storyboard Layer 1 (Fail)
//Storyboard Layer 2 (Pass)
//Storyboard Layer 3 (Foreground)
//Storyboard Layer 4 (Overlay)
//Storyboard Sound Samples
Sample,40274,0,"Tom1.wav",40
Sample,78045,0,"Tom2.wav",40

[TimingPoints]
335,361.44578313253,4,2,1,40,1,0
55274,-100,4,2,1,40,0,1
59973,-100,4,2,1,40,0,0
60334,-100,4,2,1,40,0,1
60425,-100,4,2,1,40,0,0
60696,-100,4,2,1,40,0,1
60786,-100,4,2,1,40,0,0
61057,-100,4,2,1,40,0,1
66479,-100,4,2,1,40,0,0
66841,-100,4,2,1,40,0,1
78407,-100,4,2,1,40,0,0
101539,-100,4,2,1,40,0,1
106238,-100,4,2,1,40,0,0
106600,-100,4,2,1,40,0,1
106690,-100,4,2,1,40,0,0
106961,-100,4,2,1,40,0,1
107051,-100,4,2,1,40,0,0
107322,-100,4,2,1,40,0,1
112563,-100,4,2,1,40,0,0
113106,-100,4,2,1,40,0,1
123949,400,4,2,1,40,1,1
123949,-90.0900900900901,4,2,1,40,0,1
124749,400,4,2,1,40,1,0
124749,-90.0900900900901,4,2,1,40,0,0
150349,379.746835443038,4,2,1,40,1,0
150349,-95.2380952380952,4,2,1,40,0,0
164779,361.44578313253,4,2,1,40,1,0
165501,361.44578313253,4,2,1,40,1,0
171284,-100,4,2,1,40,0,1
176705,-100,4,2,1,40,0,0
177067,-100,4,2,1,40,0,1
188633,-100,4,2,1,40,0,0


[HitObjects]
64,192,335,128,2,696:0:0:0:0:
192,192,335,1,0,0:0:0:0:
448,192,335,1,0,0:0:0:0:
448,192,515,1,0,0:0:0:0:
320,192,696,1,0,0:0:0:0:
192,192,786,1,0,0:0:0:0:
448,192,877,1,0,0:0:0:0:
320,192,967,1,0,0:0:0:0:
64,192,1057,1,8,0:0:0:0:
192,192,1057,1,0,0:0:0:0:
320,192,1238,1,0,0:0:0:0:
448,192,1419,1,0,0:0:0:0:
192,192,1600,1,0,0:0:0:0:
320,192,1690,1,0,0:0:0:0:
64,192,1780,1,0,0:0:0:0:
320,192,1961,1,0,0:0:0:0:
64,192,2142,1,2,0:0:0:0:
192,192,2142,1,0,0:0:0:0:
448,192,2142,128,0,2503:0:0:0:0:
64,192,2322,1,0,0:0:0:0:
320,192,2503,1,8,0:0:0:0:
64,192,2684,1,2,0:0:0:0:
192,192,2684,128,0,3045:0:0:0:0:
448,192,2684,1,0,0:0:0:0:
448,192,2865,1,0,0:0:0:0:
64,192,3045,1,0,0:0:0:0:
64,192,3226,1,2,0:0:0:0:
320,192,3226,1,0,0:0:0:0:
448,192,3226,128,0,3588:0:0:0:0:
64,192,3407,1,0,0:0:0:0:
192,192,3588,1,0,0:0:0:0:
320,192,3678,1,0,0:0:0:0:
64,192,3768,1,0,0:0:0:0:
192,192,3859,1,0,0:0:0:0:
320,192,3949,1,8,0:0:0:0:
448,192,3949,1,0,0:0:0:0:
192,192,4130,1,0,0:0:0:0:
64,192,4310,1,0,0:0:0:0:
320,192,4491,1,0,0:0:0:0:
192,192,4581,1,0,0:0:0:0:
448,192,4672,1,0,0:0:0:0:
192,192,4853,1,0,0:0:0:0:
320,192,4943,1,0,0:0:0:0:
64,192,5033,128,2,5395:0:0:0:0:
448,192,5033,1,0,0:0:0:0:
448,192,5214,1,0,0:0:0:0:
192,192,5395,1,8,0:0:0:0:
64,192,5575,1,2,0:0:0:0:
320,192,5575,128,0,5937:0:0:0:0:
448,192,5575,1,0,0:0:0:0:
64,192,5756,1,0,0:0:0:0:
448,192,5937,1,0,0:0:0:0:
64,192,6118,128,2,6479:0:0:0:0:
192,192,6118,1,0,0:0:0:0:
320,192,6118,1,0,0:0:0:0:
320,192,6298,1,0,0:0:0:0:
448,192,6479,1,0,0:0:0:0:
320,192,6569,1,0,0:0:0:0:
64,192,6660,1,0,0:0:0:0:
192,192,6750,1,0,0:0:0:0:
320,192,6841,1,8,0:0:0:0:
448,192,6841,1,0,0:0:0:0:
64,192,7021,1,0,0:0:0:0:
448,192,7202,1,0,0:0:0:0:
320,192,7383,1,0,0:0:0:0:
192,192,7473,1,0,0:0:0:0:
64,192,7563,1,0,0:0:0:0:
320,192,7744,1,0,0:0:0:0:
64,192,7925,128,2,8286:0:0:0:0:
192,192,7925,1,0,0:0:0:0:
448,192,7925,1,0,0:0:0:0:
448,192,8106,1,0,0:0:0:0:
192,192,8286,1,8,0:0:0:0:
64,192,8467,1,2,0:0:0:0:
320,192,8467,128,0,8828:0:0:0:0:
448,192,8467,1,0,0:0:0:0:
64,192,8648,1,0,0:0:0:0:
448,192,8828,1,0,0:0:0:0:
192,192,9009,1,2,0:0:0:0:
320,192,9009,1,0,0:0:0:0:
448,192,9009,128,0,9371:0:0:0:0:
192,192,9190,1,0,0:0:0:0:
64,192,9371,1,0,0:0:0:0:
192,192,9461,1,0,0:0:0:0:
448,192,9551,1,0,0:0:0:0:
320,192,9642,1,0,0:0:0:0:
64,192,9732,1,8,0:0:0:0:
192,192,9732,1,0,0:0:0:0:
448,192,9913,1,0,0:0:0:0:
64,192,10094,1,0,0:0:0:0:
192,192,10274,1,0,0:0:0:0:
320,192,10365,1,0,0:0:0:0:
448,192,10455,1,0,0:0:0:0:
320,192,10636,1,0,0:0:0:0:
192,192,10726,1,0,0:0:0:0:
64,192,10816,1,2,0:0:0:0:
448,192,10816,128,0,11178:0:0:0:0:
64,192,10997,1,0,0:0:0:0:
320,192,11178,1,8,0:0:0:0:
64,192,11359,1,2,0:0:0:0:
192,192,11359,128,0,11720:0:0:0:0:
448,192,11359,1,0,0:0:0:0:
448,192,11539,1,0,0:0:0:0:
64,192,11720,1,0,0:0:0:0:
64,192,11901,1,2,0:0:0:0:
320,192,11901,128,8,12081:0:0:0:0:
448,192,11901,128,0,12443:0:0:0:0:
192,192,12262,128,0,12443:0:0:0:0:
64,192,12624,128,2,12985:0:0:0:0:
320,192,12624,128,8,12804:0:0:0:0:
448,192,12624,1,0,0:0:0:0:
448,192,12985,128,0,13166:0:0:0:0:
64,192,13166,1,2,0:0:0:0:
192,192,13166,128,4,13437:0:0:0:0:
320,192,13166,1,8,0:0:0:0:
192,192,13527,1,2,0:0:0:0:
320,192,13527,128,8,13798:0:0:0:0:
448,192,13527,1,0,0:0:0:0:
64,192,13889,1,2,0:0:0:0:
192,192,13889,1,8,0:0:0:0:
448,192,13889,1,0,0:0:0:0:
64,192,14069,128,2,14431:0:0:0:0:
320,192,14069,1,8,0:0:0:0:
448,192,14069,128,0,14431:0:0:0:0:
192,192,14431,1,0,0:0:0:0:
320,192,14431,1,0,0:0:0:0:
64,192,14792,128,2,14973:0:0:0:0:
320,192,14792,1,4,0:0:0:0:
448,192,14792,1,0,0:0:0:0:
192,192,15154,128,0,15334:0:0:0:0:
320,192,15515,128,0,15696:0:0:0:0:
448,192,15877,128,0,16057:0:0:0:0:
64,192,16238,128,2,16419:0:0:0:0:
320,192,16600,128,0,16780:0:0:0:0:
192,192,16961,128,0,17142:0:0:0:0:
448,192,17322,128,0,17684:0:0:0:0:
64,192,17684,1,2,0:0:0:0:
192,192,17684,1,4,0:0:0:0:
320,192,17865,1,0,0:0:0:0:
64,192,18045,1,2,0:0:0:0:
448,192,18045,1,8,0:0:0:0:
192,192,18226,1,0,0:0:0:0:
64,192,18407,1,2,0:0:0:0:
320,192,18407,1,0,0:0:0:0:
192,192,18768,1,2,0:0:0:0:
448,192,18768,1,8,0:0:0:0:
64,192,18949,1,0,0:0:0:0:
320,192,19130,1,2,0:0:0:0:
448,192,19130,1,0,0:0:0:0:
192,192,19310,1,0,0:0:0:0:
64,192,19491,1,2,0:0:0:0:
448,192,19491,1,8,0:0:0:0:
320,192,19672,1,0,0:0:0:0:
64,192,19853,1,2,0:0:0:0:
192,192,19853,1,0,0:0:0:0:
64,192,20214,1,2,0:0:0:0:
448,192,20214,1,8,0:0:0:0:
320,192,20395,1,0,0:0:0:0:
64,192,20575,1,2,0:0:0:0:
192,192,20575,1,0,0:0:0:0:
192,192,20756,1,0,0:0:0:0:
64,192,20937,1,2,0:0:0:0:
448,192,20937,1,8,0:0:0:0:
448,192,21118,1,0,0:0:0:0:
64,192,21298,1,2,0:0:0:0:
320,192,21298,1,0,0:0:0:0:
64,192,21479,1,0,0:0:0:0:
192,192,21660,1,2,0:0:0:0:
448,192,21660,1,8,0:0:0:0:
448,192,21841,1,0,0:0:0:0:
64,192,22021,1,2,0:0:0:0:
192,192,22021,1,0,0:0:0:0:
320,192,22202,1,0,0:0:0:0:
64,192,22383,1,2,0:0:0:0:
448,192,22383,1,8,0:0:0:0:
192,192,22563,1,0,0:0:0:0:
320,192,22744,1,2,0:0:0:0:
448,192,22744,1,0,0:0:0:0:
64,192,23106,1,2,0:0:0:0:
320,192,23106,1,8,0:0:0:0:
192,192,23286,1,0,0:0:0:0:
64,192,23467,1,2,0:0:0:0:
192,192,23467,1,0,0:0:0:0:
448,192,23467,1,0,0:0:0:0:
320,192,23648,1,0,0:0:0:0:
64,192,23828,1,2,0:0:0:0:
448,192,23828,1,8,0:0:0:0:
192,192,24009,1,0,0:0:0:0:
320,192,24190,1,2,0:0:0:0:
448,192,24190,1,0,0:0:0:0:
64,192,24551,1,2,0:0:0:0:
320,192,24551,1,8,0:0:0:0:
192,192,24732,1,0,0:0:0:0:
64,192,24913,1,2,0:0:0:0:
448,192,24913,1,0,0:0:0:0:
320,192,25094,1,0,0:0:0:0:
192,192,25274,1,2,0:0:0:0:
448,192,25274,1,8,0:0:0:0:
64,192,25455,1,0,0:0:0:0:
320,192,25636,1,2,0:0:0:0:
448,192,25636,1,0,0:0:0:0:
64,192,25997,1,2,0:0:0:0:
320,192,25997,1,8,0:0:0:0:
448,192,26178,1,0,0:0:0:0:
64,192,26359,1,2,0:0:0:0:
192,192,26359,1,0,0:0:0:0:
192,192,26539,1,0,0:0:0:0:
64,192,26720,1,2,0:0:0:0:
448,192,26720,1,8,0:0:0:0:
448,192,26901,1,0,0:0:0:0:
64,192,27081,1,2,0:0:0:0:
320,192,27081,1,0,0:0:0:0:
64,192,27262,1,0,0:0:0:0:
192,192,27443,1,2,0:0:0:0:
448,192,27443,1,8,0:0:0:0:
192,192,27624,1,0,0:0:0:0:
64,192,27804,1,2,0:0:0:0:
448,192,27804,1,0,0:0:0:0:
320,192,27985,1,0,0:0:0:0:
64,192,28166,1,2,0:0:0:0:
192,192,28166,1,8,0:0:0:0:
320,192,28347,1,0,0:0:0:0:
64,192,28527,1,2,0:0:0:0:
448,192,28527,1,0,0:0:0:0:
192,192,28708,1,0,0:0:0:0:
320,192,28889,1,2,0:0:0:0:
448,192,28889,128,8,29250:0:0:0:0:
64,192,29250,128,2,29431:0:0:0:0:
192,192,29250,128,4,29431:0:0:0:0:
192,192,29521,128,0,29702:0:0:0:0:
320,192,29521,128,0,29702:0:0:0:0:
320,192,29792,128,0,29973:0:0:0:0:
448,192,29792,128,0,29973:0:0:0:0:
64,192,29973,128,2,30154:0:0:0:0:
192,192,29973,1,0,0:0:0:0:
448,192,30154,128,0,30334:0:0:0:0:
192,192,30334,128,2,30515:0:0:0:0:
320,192,30334,1,8,0:0:0:0:
64,192,30515,128,0,30696:0:0:0:0:
320,192,30696,128,2,30877:0:0:0:0:
448,192,30696,128,0,30877:0:0:0:0:
192,192,30967,128,0,31148:0:0:0:0:
320,192,30967,128,0,31148:0:0:0:0:
64,192,31238,128,0,31419:0:0:0:0:
192,192,31238,128,0,31419:0:0:0:0:
448,192,31419,1,2,0:0:0:0:
320,192,31600,128,0,31780:0:0:0:0:
64,192,31780,128,2,31961:0:0:0:0:
448,192,31780,1,8,0:0:0:0:
192,192,31961,128,0,32142:0:0:0:0:
320,192,32142,1,2,0:0:0:0:
448,192,32142,128,0,32322:0:0:0:0:
64,192,32322,128,0,32684:0:0:0:0:
320,192,32503,128,2,32684:0:0:0:0:
448,192,32503,128,8,32684:0:0:0:0:
64,192,32865,128,2,33045:0:0:0:0:
192,192,32865,1,0,0:0:0:0:
448,192,33045,128,0,33407:0:0:0:0:
64,192,33226,128,2,33407:0:0:0:0:
192,192,33226,128,8,33407:0:0:0:0:
320,192,33588,128,2,33768:0:0:0:0:
448,192,33588,1,0,0:0:0:0:
64,192,33768,128,0,33949:0:0:0:0:
320,192,33949,128,2,34130:0:0:0:0:
448,192,33949,1,8,0:0:0:0:
64,192,34130,1,0,0:0:0:0:
64,192,34310,1,2,0:0:0:0:
448,192,34310,1,0,0:0:0:0:
448,192,34491,1,8,0:0:0:0:
320,192,34581,1,8,0:0:0:0:
64,192,34672,1,2,0:0:0:0:
192,192,34672,1,0,0:0:0:0:
192,192,34853,1,2,0:0:0:0:
64,192,35033,1,2,0:0:0:0:
320,192,35033,128,4,35214:0:0:0:0:
448,192,35033,128,0,35214:0:0:0:0:
192,192,35304,128,0,35485:0:0:0:0:
320,192,35304,128,0,35485:0:0:0:0:
64,192,35575,128,0,35756:0:0:0:30:Hat Open.wav
192,192,35575,128,0,35756:0:0:0:0:
320,192,35756,1,2,0:0:0:0:
448,192,35756,128,0,35937:0:0:0:0:
64,192,35937,128,0,36118:0:0:0:30:Hat Open.wav
192,192,36118,1,2,0:0:0:0:
320,192,36118,128,8,36298:0:0:0:0:
448,192,36298,128,0,36479:0:0:0:30:Hat Open.wav
64,192,36479,128,2,36660:0:0:0:0:
192,192,36479,128,0,36660:0:0:0:0:
192,192,36750,128,0,36931:0:0:0:0:
320,192,36750,128,0,36931:0:0:0:0:
320,192,37021,128,0,37202:0:0:0:30:Hat Open.wav
448,192,37021,128,0,37202:0:0:0:0:
64,192,37202,1,2,0:0:0:0:
320,192,37383,1,0,0:0:0:30:Hat Open.wav
192,192,37473,1,0,0:0:0:0:
64,192,37563,1,2,0:0:0:0:
448,192,37563,128,8,37744:0:0:0:0:
320,192,37744,128,0,37925:0:0:0:30:Hat Open.wav
64,192,37925,128,2,38106:0:0:0:0:
192,192,37925,1,0,0:0:0:0:
448,192,38106,128,0,38467:0:0:0:30:Hat Open.wav
64,192,38286,128,2,38467:0:0:0:0:
192,192,38286,128,8,38467:0:0:0:0:
320,192,38648,1,2,0:0:0:0:
448,192,38648,128,0,38828:0:0:0:0:
64,192,38828,128,0,39190:0:0:0:30:Hat Open.wav
320,192,39009,1,2,0:0:0:0:
448,192,39009,128,8,39190:0:0:0:0:
192,192,39190,128,0,39371:0:0:0:30:Hat Open.wav
64,192,39371,1,2,0:0:0:0:
448,192,39371,1,0,0:0:0:0:
320,192,39551,1,0,0:0:0:30:Hat Open.wav
192,192,39732,1,2,0:0:0:0:
448,192,39732,1,8,0:0:0:0:
64,192,39913,1,8,0:0:0:0:
192,192,40003,1,8,0:0:0:0:
320,192,40094,1,2,0:0:0:0:
448,192,40094,1,0,0:0:0:0:
64,192,40184,1,0,0:0:0:0:
320,192,40274,1,2,0:0:0:0:
192,192,40365,1,0,0:0:0:0:
64,192,40455,1,8,0:0:0:0:
448,192,40455,1,0,0:0:0:40:Tom2.wav
320,192,40636,1,0,0:0:0:0:
64,192,40816,1,2,0:0:0:0:
192,192,40816,1,4,0:0:0:0:
448,192,40816,128,0,41539:0:0:0:0:
64,192,41359,1,2,0:0:0:0:
64,192,41539,1,2,0:0:0:0:
64,192,41901,1,8,0:0:0:0:
192,192,41901,128,0,42081:0:0:0:0:
448,192,41901,1,0,0:0:0:0:
448,192,42081,1,2,0:0:0:0:
448,192,42443,1,2,0:0:0:0:
448,192,42804,1,2,0:0:0:0:
64,192,42985,1,2,0:0:0:0:
448,192,42985,1,0,0:0:0:0:
192,192,43347,1,8,0:0:0:0:
320,192,43347,128,0,43527:0:0:0:0:
64,192,43708,128,2,44431:0:0:0:0:
448,192,43708,1,0,0:0:0:0:
448,192,44250,1,2,0:0:0:0:
448,192,44431,1,2,0:0:0:0:
64,192,44792,1,8,0:0:0:0:
320,192,44792,128,0,44973:0:0:0:0:
448,192,44792,1,0,0:0:0:0:
192,192,45154,1,2,0:0:0:0:
448,192,45154,128,0,45334:0:0:0:0:
64,192,45515,128,2,45696:0:0:0:0:
320,192,45515,1,0,0:0:0:0:
448,192,45877,1,2,0:0:0:0:
192,192,45967,1,2,0:0:0:0:
320,192,46057,1,2,0:0:0:0:
64,192,46148,1,2,0:0:0:0:
192,192,46238,128,8,46419:0:0:0:0:
448,192,46238,1,0,0:0:0:0:
64,192,46600,1,2,0:0:0:0:
448,192,46600,1,0,0:0:0:0:
320,192,46780,1,0,0:0:0:30:Hat Open.wav
64,192,46961,128,8,47142:0:0:0:0:
192,192,46961,1,2,0:0:0:0:
320,192,47142,1,0,0:0:0:30:Hat Open.wav
64,192,47322,1,2,0:0:0:0:
448,192,47322,1,0,0:0:0:0:
192,192,47503,1,0,0:0:0:30:Hat Open.wav
64,192,47684,128,8,47865:0:0:0:0:
448,192,47684,1,2,0:0:0:0:
320,192,47865,1,0,0:0:0:30:Hat Open.wav
64,192,48045,1,2,0:0:0:0:
192,192,48045,1,0,0:0:0:0:
320,192,48226,1,0,0:0:0:30:Hat Open.wav
64,192,48407,1,8,0:0:0:0:
448,192,48407,128,2,48588:0:0:0:0:
192,192,48588,1,0,0:0:0:30:Hat Open.wav
320,192,48768,1,2,0:0:0:0:
448,192,48768,1,0,0:0:0:0:
192,192,48949,1,0,0:0:0:30:Hat Open.wav
64,192,49130,1,8,0:0:0:0:
448,192,49130,128,2,49310:0:0:0:0:
320,192,49310,1,0,0:0:0:30:Hat Open.wav
64,192,49491,1,2,0:0:0:0:
192,192,49491,1,4,0:0:0:0:
448,192,49491,1,0,0:0:0:0:
64,192,49853,128,2,50033:0:0:0:0:
320,192,49853,1,0,0:0:0:0:
64,192,50214,1,2,0:0:0:0:
448,192,50214,1,0,0:0:0:0:
64,192,50575,128,2,50756:0:0:0:0:
192,192,50575,1,0,0:0:0:0:
64,192,50937,1,2,0:0:0:0:
448,192,50937,1,0,0:0:0:0:
320,192,51298,1,2,0:0:0:0:
448,192,51298,128,0,51479:0:0:0:0:
64,192,51660,1,2,0:0:0:0:
448,192,51660,1,0,0:0:0:0:
192,192,52021,1,2,0:0:0:0:
448,192,52021,128,0,52202:0:0:0:0:
64,192,52383,1,8,0:0:0:0:
448,192,52383,1,2,0:0:0:0:
192,192,52563,1,0,0:0:0:0:
192,192,52744,1,0,0:0:0:0:
320,192,52925,1,8,0:0:0:0:
448,192,52925,1,2,0:0:0:0:
64,192,53106,1,8,0:0:0:0:
192,192,53106,1,2,0:0:0:0:
320,192,53286,1,10,0:0:0:0:
192,192,53377,1,0,0:0:0:40:Tom1.wav
448,192,53467,1,0,0:0:0:40:Tom2.wav
320,192,53557,1,0,0:0:0:40:Tom3.wav
64,192,53648,1,8,0:0:0:0:
192,192,53648,128,2,53919:0:0:0:0:
320,192,54009,128,8,54280:0:0:0:0:
448,192,54009,1,2,0:0:0:0:
64,192,54371,1,8,0:0:0:0:
192,192,54371,1,2,0:0:0:0:
64,192,54551,128,8,54913:0:0:0:0:
320,192,54551,1,2,0:0:0:0:
448,192,54551,128,0,54913:0:0:0:0:
64,192,55274,1,2,0:0:0:0:
448,192,55274,128,4,55455:0:0:0:0:
192,192,55455,1,0,0:0:0:0:
64,192,55636,128,8,55816:0:0:0:0:
320,192,55636,1,2,0:0:0:0:
448,192,55636,1,0,0:0:0:0:
192,192,55816,1,0,0:0:0:0:
64,192,55997,1,2,0:0:0:0:
320,192,55997,128,0,56178:0:0:0:0:
192,192,56178,1,0,0:0:0:0:
320,192,56359,1,2,0:0:0:0:
448,192,56359,128,8,56539:0:0:0:0:
64,192,56539,128,0,56720:0:0:0:0:
320,192,56720,1,2,0:0:0:0:
448,192,56720,1,0,0:0:0:0:
192,192,56901,128,0,57081:0:0:0:0:
64,192,57081,1,8,0:0:0:0:
448,192,57081,128,2,57262:0:0:0:0:
64,192,57262,128,0,57443:0:0:0:0:
320,192,57443,128,2,57624:0:0:0:0:
448,192,57443,1,0,0:0:0:0:
192,192,57624,1,0,0:0:0:0:
64,192,57804,1,2,0:0:0:0:
448,192,57804,1,8,0:0:0:0:
192,192,57985,1,0,0:0:0:0:
320,192,57985,1,0,0:0:0:0:
64,192,58166,128,2,58347:0:0:0:0:
448,192,58166,1,0,0:0:0:0:
320,192,58347,1,0,0:0:0:0:
64,192,58527,1,8,0:0:0:0:
192,192,58527,128,2,58708:0:0:0:0:
448,192,58708,1,0,0:0:0:0:
64,192,58889,1,2,0:0:0:0:
320,192,58889,128,0,59069:0:0:0:0:
192,192,59069,1,0,0:0:0:0:
64,192,59250,1,2,0:0:0:0:
448,192,59250,128,8,59431:0:0:0:0:
192,192,59431,128,0,59612:0:0:0:0:
64,192,59612,1,2,0:0:0:0:
448,192,59612,1,0,0:0:0:0:
320,192,59792,128,0,59883:0:0:0:0:
192,192,59973,128,8,60063:0:0:0:0:
448,192,59973,1,2,0:0:0:0:
64,192,60154,128,8,60244:0:0:0:0:
320,192,60334,1,2,0:0:0:0:
448,192,60334,128,0,60515:0:0:0:0:
192,192,60515,1,8,0:0:0:0:
320,192,60606,1,8,0:0:0:0:
64,192,60696,128,2,60877:0:0:0:0:
448,192,60696,1,0,0:0:0:0:
320,192,60877,1,8,0:0:0:0:
192,192,60967,1,8,0:0:0:0:
64,192,61057,1,2,0:0:0:0:
448,192,61057,128,4,61238:0:0:0:0:
192,192,61238,1,0,0:0:0:0:
64,192,61419,1,2,0:0:0:0:
320,192,61419,128,8,61600:0:0:0:0:
448,192,61600,1,0,0:0:0:0:
64,192,61780,128,2,61961:0:0:0:0:
192,192,61780,1,0,0:0:0:0:
448,192,61961,1,0,0:0:0:0:
64,192,62142,1,8,0:0:0:0:
320,192,62142,128,2,62322:0:0:0:0:
448,192,62322,128,0,62503:0:0:0:0:
64,192,62503,1,2,0:0:0:0:
192,192,62503,1,0,0:0:0:0:
320,192,62684,128,0,62865:0:0:0:0:
64,192,62865,128,2,63045:0:0:0:0:
192,192,62865,1,8,0:0:0:0:
448,192,63045,128,0,63226:0:0:0:0:
192,192,63226,128,2,63407:0:0:0:0:
320,192,63226,1,0,0:0:0:0:
64,192,63407,1,0,0:0:0:0:
320,192,63588,1,8,0:0:0:0:
448,192,63588,1,2,0:0:0:0:
192,192,63768,1,0,0:0:0:0:
320,192,63768,1,0,0:0:0:0:
64,192,63949,128,2,64130:0:0:0:0:
448,192,63949,1,0,0:0:0:0:
192,192,64130,1,0,0:0:0:0:
64,192,64310,1,2,0:0:0:0:
448,192,64310,128,8,64491:0:0:0:0:
320,192,64491,1,0,0:0:0:0:
192,192,64672,128,2,64853:0:0:0:0:
448,192,64672,1,0,0:0:0:0:
320,192,64853,1,0,0:0:0:0:
64,192,65033,128,8,65214:0:0:0:0:
192,192,65033,1,2,0:0:0:0:
448,192,65214,128,0,65395:0:0:0:0:
64,192,65395,1,2,0:0:0:0:
192,192,65395,1,0,0:0:0:0:
320,192,65575,128,0,65756:0:0:0:0:
64,192,65756,1,2,0:0:0:0:
448,192,65756,1,8,0:0:0:0:
192,192,65937,128,0,66118:0:0:0:0:
64,192,66118,128,2,66298:0:0:0:0:
448,192,66118,1,0,0:0:0:0:
320,192,66298,1,8,0:0:0:0:
192,192,66389,1,8,0:0:0:0:
64,192,66479,1,2,0:0:0:0:
448,192,66479,128,0,66660:0:0:0:0:
192,192,66660,1,8,0:0:0:0:
320,192,66750,1,8,0:0:0:0:
64,192,66841,1,2,0:0:0:0:
448,192,66841,1,4,0:0:0:0:
64,192,67202,1,2,0:0:0:0:
448,192,67202,1,8,0:0:0:0:
64,192,67563,1,2,0:0:0:0:
192,192,67563,1,0,0:0:0:0:
448,192,67834,1,0,0:0:0:0:
64,192,67925,1,8,0:0:0:0:
192,192,67925,1,2,0:0:0:0:
320,192,68106,1,0,0:0:0:0:
64,192,68286,1,2,0:0:0:0:
448,192,68286,1,0,0:0:0:0:
192,192,68467,1,0,0:0:0:0:
64,192,68648,1,2,0:0:0:0:
448,192,68648,1,8,0:0:0:0:
320,192,68828,1,0,0:0:0:0:
64,192,69009,1,2,0:0:0:0:
192,192,69009,1,0,0:0:0:0:
320,192,69190,1,0,0:0:0:0:
64,192,69371,1,8,0:0:0:0:
448,192,69371,1,2,0:0:0:0:
192,192,69551,1,0,0:0:0:0:
320,192,69732,1,2,0:0:0:0:
448,192,69732,1,0,0:0:0:0:
320,192,70094,1,2,0:0:0:0:
448,192,70094,1,8,0:0:0:0:
64,192,70455,1,2,0:0:0:0:
448,192,70455,1,0,0:0:0:0:
448,192,70726,1,0,0:0:0:0:
64,192,70816,1,8,0:0:0:0:
192,192,70816,1,2,0:0:0:0:
320,192,70997,1,0,0:0:0:0:
64,192,71178,1,2,0:0:0:0:
448,192,71178,1,0,0:0:0:0:
448,192,71359,128,0,71539:0:0:0:0:
192,192,71539,1,2,0:0:0:0:
320,192,71539,1,8,0:0:0:0:
320,192,71720,128,0,71901:0:0:0:0:
64,192,71901,1,2,0:0:0:0:
448,192,71901,1,0,0:0:0:0:
64,192,72081,128,0,72262:0:0:0:0:
192,192,72262,1,8,0:0:0:0:
320,192,72262,1,2,0:0:0:0:
192,192,72443,128,0,72624:0:0:0:0:
64,192,72624,1,2,0:0:0:0:
448,192,72624,1,0,0:0:0:0:
64,192,72985,1,2,0:0:0:0:
448,192,72985,1,8,0:0:0:0:
320,192,73347,1,2,0:0:0:0:
448,192,73347,1,0,0:0:0:0:
64,192,73618,1,0,0:0:0:0:
320,192,73708,1,8,0:0:0:0:
448,192,73708,1,2,0:0:0:0:
192,192,73889,1,0,0:0:0:0:
64,192,74069,1,2,0:0:0:0:
448,192,74069,1,0,0:0:0:0:
320,192,74250,1,0,0:0:0:0:
64,192,74431,1,2,0:0:0:0:
448,192,74431,1,8,0:0:0:0:
192,192,74612,1,0,0:0:0:0:
320,192,74792,1,2,0:0:0:0:
448,192,74792,1,0,0:0:0:0:
192,192,74973,1,0,0:0:0:0:
64,192,75154,1,8,0:0:0:0:
448,192,75154,1,2,0:0:0:0:
320,192,75334,1,0,0:0:0:0:
64,192,75515,1,2,0:0:0:0:
192,192,75515,1,0,0:0:0:0:
192,192,75696,1,0,0:0:0:0:
320,192,75877,1,2,0:0:0:0:
448,192,75877,1,8,0:0:0:0:
320,192,76057,1,0,0:0:0:0:
64,192,76238,1,2,0:0:0:0:
448,192,76238,1,0,0:0:0:0:
192,192,76419,1,0,0:0:0:0:
64,192,76509,1,0,0:0:0:0:
320,192,76600,1,8,0:0:0:0:
448,192,76600,1,2,0:0:0:0:
64,192,76780,128,2,77503:0:0:0:0:
192,192,76780,1,4,0:0:0:0:
448,192,76780,1,0,0:0:0:0:
448,192,77142,128,8,77503:0:0:0:0:
192,192,77503,1,8,0:0:0:0:
64,192,77684,1,2,0:0:0:0:
320,192,77684,1,0,0:0:0:0:
448,192,77684,128,0,78226:0:0:0:0:
64,192,78045,1,2,0:0:0:0:
64,192,78407,1,2,0:0:0:0:
192,192,78407,128,0,78768:0:0:0:0:
448,192,78407,1,0,0:0:0:0:
448,192,78768,128,0,78949:0:0:0:0:
64,192,79130,1,8,0:0:0:0:
448,192,79130,128,0,79310:0:0:0:0:
192,192,79491,128,0,79672:0:0:0:0:
320,192,79853,1,0,0:0:0:0:
192,192,80033,1,0,0:0:0:0:
320,192,80214,128,0,80395:0:0:0:0:
320,192,80575,128,8,80756:0:0:0:0:
320,192,80937,1,0,0:0:0:0:
64,192,81118,1,2,0:0:0:0:
192,192,81118,1,0,0:0:0:0:
64,192,81298,1,2,0:0:0:0:
448,192,81298,1,0,0:0:0:0:
448,192,81660,128,0,81841:0:0:0:0:
64,192,81841,128,0,82021:0:0:0:0:
320,192,82021,1,8,0:0:0:0:
448,192,82021,128,0,82202:0:0:0:0:
64,192,82202,128,0,82383:0:0:0:0:
448,192,82383,1,0,0:0:0:0:
320,192,82563,1,0,0:0:0:0:
192,192,82744,1,0,0:0:0:0:
320,192,82925,1,0,0:0:0:0:
192,192,83106,128,0,83286:0:0:0:0:
448,192,83467,1,8,0:0:0:0:
64,192,83648,1,0,0:0:0:0:
192,192,83828,128,0,84190:0:0:0:0:
64,192,84190,1,2,0:0:0:0:
320,192,84190,128,0,84551:0:0:0:0:
448,192,84190,1,0,0:0:0:0:
64,192,84551,1,0,0:0:0:0:
192,192,84732,1,0,0:0:0:0:
448,192,84913,1,8,0:0:0:0:
64,192,85094,1,0,0:0:0:0:
448,192,85274,128,0,85455:0:0:0:0:
192,192,85636,1,0,0:0:0:0:
320,192,85816,1,0,0:0:0:0:
192,192,85997,128,0,86178:0:0:0:0:
192,192,86359,128,8,86539:0:0:0:0:
192,192,86720,1,0,0:0:0:0:
320,192,86901,1,2,0:0:0:0:
448,192,86901,1,0,0:0:0:0:
64,192,87081,1,2,0:0:0:0:
448,192,87081,1,0,0:0:0:0:
64,192,87443,1,0,0:0:0:0:
192,192,87624,1,0,0:0:0:0:
448,192,87804,128,8,87985:0:0:0:0:
448,192,88166,1,0,0:0:0:0:
192,192,88347,1,0,0:0:0:0:
320,192,88437,1,0,0:0:0:0:
64,192,88527,1,0,0:0:0:0:
320,192,88708,1,0,0:0:0:0:
192,192,88798,1,0,0:0:0:0:
448,192,88889,1,0,0:0:0:0:
64,192,89069,1,0,0:0:0:0:
320,192,89250,1,2,0:0:0:0:
448,192,89250,1,0,0:0:0:0:
320,192,89371,128,0,89491:0:0:0:0:
64,192,89612,1,2,0:0:0:0:
192,192,89612,1,0,0:0:0:0:
192,192,89732,128,0,89853:0:0:0:0:
64,192,89973,1,2,0:0:0:0:
448,192,89973,128,0,90334:0:0:0:0:
192,192,90334,1,0,0:0:0:0:
64,192,90455,1,0,0:0:0:0:
448,192,90575,1,0,0:0:0:0:
320,192,90696,128,0,91057:0:0:0:0:
448,192,91057,1,0,0:0:0:0:
64,192,91178,1,0,0:0:0:0:
320,192,91298,1,0,0:0:0:0:
192,192,91419,1,0,0:0:0:0:
448,192,91660,1,0,0:0:0:0:
64,192,91780,128,2,92021:0:0:0:0:
192,192,91780,1,0,0:0:0:0:
320,192,92021,1,0,0:0:0:0:
448,192,92142,128,0,92503:0:0:0:0:
64,192,92322,128,2,92684:0:0:0:0:
192,192,92322,1,0,0:0:0:0:
320,192,92503,1,0,0:0:0:0:
192,192,92684,1,0,0:0:0:0:
320,192,92774,1,0,0:0:0:0:
64,192,92865,1,2,0:0:0:0:
448,192,92865,128,0,93226:0:0:0:0:
64,192,93226,1,0,0:0:0:0:
320,192,93347,1,0,0:0:0:0:
192,192,93467,1,0,0:0:0:0:
64,192,93588,1,0,0:0:0:0:
448,192,93708,1,0,0:0:0:0:
192,192,93828,1,0,0:0:0:0:
448,192,93949,128,0,94190:0:0:0:0:
64,192,94190,1,0,0:0:0:0:
320,192,94310,1,0,0:0:0:0:
192,192,94431,1,0,0:0:0:0:
64,192,94551,1,0,0:0:0:0:
320,192,94672,1,0,0:0:0:0:
448,192,94792,1,0,0:0:0:0:
192,192,94913,1,0,0:0:0:0:
64,192,95033,1,2,0:0:0:0:
320,192,95033,128,0,95214:0:0:0:0:
64,192,95395,1,2,0:0:0:0:
320,192,95395,128,0,95575:0:0:0:0:
448,192,95756,1,0,0:0:0:0:
192,192,95877,1,0,0:0:0:0:
320,192,95997,1,0,0:0:0:0:
64,192,96118,128,2,96479:0:0:0:0:
448,192,96479,1,0,0:0:0:0:
320,192,96600,1,0,0:0:0:0:
192,192,96720,1,0,0:0:0:0:
64,192,96841,1,2,0:0:0:0:
448,192,96961,1,0,0:0:0:0:
192,192,97081,1,0,0:0:0:0:
320,192,97202,128,0,97443:0:0:0:0:
64,192,97443,1,0,0:0:0:0:
192,192,97563,1,2,0:0:0:0:
320,192,97804,1,0,0:0:0:0:
64,192,97925,1,0,0:0:0:0:
448,192,98045,1,0,0:0:0:0:
64,192,98166,1,0,0:0:0:0:
192,192,98286,128,0,98648:0:0:0:0:
448,192,98648,128,2,98889:0:0:0:0:
64,192,98889,1,0,0:0:0:0:
192,192,99009,128,0,99130:0:0:0:0:
320,192,99130,128,0,99250:0:0:0:0:
448,192,99250,128,0,99371:0:0:0:0:
64,192,99371,128,2,99732:0:0:0:0:
192,192,99371,1,0,0:0:0:0:
448,192,99732,128,0,99853:0:0:0:0:
320,192,99853,128,0,99973:0:0:0:0:
192,192,99973,1,0,0:0:0:0:
64,192,100094,1,2,0:0:0:0:
448,192,100094,1,0,0:0:0:0:
192,192,100274,1,0,0:0:0:0:
448,192,100455,1,2,0:0:0:0:
320,192,100545,1,8,0:0:0:0:
64,192,100636,1,8,0:0:0:0:
192,192,100726,1,8,0:0:0:0:
320,192,100816,1,2,0:0:0:0:
448,192,100816,1,0,0:0:0:0:
64,192,100907,1,2,0:0:0:0:
320,192,100997,1,2,0:0:0:0:
448,192,100997,1,0,0:0:0:0:
192,192,101088,1,2,0:0:0:0:
64,192,101178,1,8,0:0:0:0:
448,192,101178,1,0,0:0:0:0:
320,192,101359,1,0,0:0:0:0:
64,192,101539,1,2,0:0:0:0:
192,192,101539,1,4,0:0:0:0:
320,192,101630,1,0,0:0:0:0:
448,192,101720,1,0,0:0:0:0:
192,192,101810,1,0,0:0:0:0:
64,192,101901,1,8,0:0:0:0:
448,192,101901,1,2,0:0:0:0:
320,192,101991,1,0,0:0:0:0:
192,192,102081,1,0,0:0:0:0:
64,192,102172,1,0,0:0:0:0:
320,192,102262,1,2,0:0:0:0:
448,192,102262,1,0,0:0:0:0:
64,192,102353,1,0,0:0:0:0:
192,192,102443,1,0,0:0:0:0:
320,192,102533,1,0,0:0:0:0:
64,192,102624,1,2,0:0:0:0:
448,192,102624,128,8,102804:0:0:0:0:
192,192,102804,128,0,102985:0:0:0:0:
320,192,102985,1,2,0:0:0:0:
448,192,102985,1,0,0:0:0:0:
64,192,103166,128,0,103347:0:0:0:0:
192,192,103347,1,8,0:0:0:0:
448,192,103347,128,2,103527:0:0:0:0:
320,192,103527,128,0,103708:0:0:0:0:
64,192,103708,128,2,103889:0:0:0:0:
448,192,103708,1,0,0:0:0:0:
320,192,103889,1,0,0:0:0:0:
64,192,104069,1,2,0:0:0:0:
192,192,104069,128,8,104250:0:0:0:0:
448,192,104250,128,0,104431:0:0:0:0:
64,192,104431,1,2,0:0:0:0:
320,192,104431,1,0,0:0:0:0:
192,192,104521,1,0,0:0:0:0:
448,192,104612,1,0,0:0:0:0:
320,192,104702,1,0,0:0:0:0:
64,192,104792,1,8,0:0:0:0:
192,192,104792,1,2,0:0:0:0:
320,192,104883,1,0,0:0:0:0:
448,192,104973,1,0,0:0:0:0:
192,192,105063,1,0,0:0:0:0:
64,192,105154,1,2,0:0:0:0:
448,192,105154,1,0,0:0:0:0:
320,192,105244,1,0,0:0:0:0:
192,192,105334,1,0,0:0:0:0:
320,192,105425,1,0,0:0:0:0:
64,192,105515,128,2,105696:0:0:0:0:
448,192,105515,1,8,0:0:0:0:
320,192,105696,128,0,105877:0:0:0:0:
192,192,105877,1,2,0:0:0:0:
448,192,105877,1,0,0:0:0:0:
448,192,106057,128,0,106148:0:0:0:0:
64,192,106238,128,8,106328:0:0:0:0:
192,192,106238,1,2,0:0:0:0:
320,192,106419,128,8,106509:0:0:0:0:
64,192,106600,1,2,0:0:0:0:
192,192,106600,1,0,0:0:0:0:
448,192,106600,128,0,106871:0:0:0:0:
192,192,106780,1,8,0:0:0:0:
64,192,106961,128,2,107232:0:0:0:0:
320,192,106961,1,0,0:0:0:0:
448,192,106961,1,0,0:0:0:0:
320,192,107142,1,8,0:0:0:0:
64,192,107322,1,2,0:0:0:0:
448,192,107322,1,4,0:0:0:0:
192,192,107413,1,0,0:0:0:0:
320,192,107503,1,0,0:0:0:0:
448,192,107594,1,0,0:0:0:0:
64,192,107684,1,2,0:0:0:0:
192,192,107684,1,8,0:0:0:0:
448,192,107774,1,0,0:0:0:0:
320,192,107865,1,0,0:0:0:0:
192,192,107955,1,0,0:0:0:0:
64,192,108045,1,2,0:0:0:0:
448,192,108045,1,0,0:0:0:0:
320,192,108136,1,0,0:0:0:0:
192,192,108226,1,0,0:0:0:0:
320,192,108316,1,0,0:0:0:0:
64,192,108407,128,8,108588:0:0:0:0:
448,192,108407,1,2,0:0:0:0:
320,192,108588,128,0,108768:0:0:0:0:
64,192,108768,1,2,0:0:0:0:
192,192,108768,1,0,0:0:0:0:
448,192,108949,128,0,109130:0:0:0:0:
64,192,109130,128,2,109310:0:0:0:0:
320,192,109130,1,8,0:0:0:0:
192,192,109310,128,0,109491:0:0:0:0:
64,192,109491,1,2,0:0:0:0:
448,192,109491,128,0,109672:0:0:0:0:
192,192,109672,1,0,0:0:0:0:
320,192,109853,128,8,110033:0:0:0:0:
448,192,109853,1,2,0:0:0:0:
64,192,110033,128,0,110214:0:0:0:0:
192,192,110214,1,2,0:0:0:0:
448,192,110214,1,0,0:0:0:0:
320,192,110304,1,0,0:0:0:0:
64,192,110395,1,0,0:0:0:0:
192,192,110485,1,0,0:0:0:0:
320,192,110575,1,2,0:0:0:0:
448,192,110575,1,8,0:0:0:0:
192,192,110666,1,0,0:0:0:0:
64,192,110756,1,0,0:0:0:0:
320,192,110847,1,0,0:0:0:0:
192,192,110937,1,2,0:0:0:0:
448,192,110937,128,0,111118:0:0:0:0:
64,192,111208,128,2,111389:0:0:0:0:
320,192,111208,1,0,0:0:0:0:
64,192,111479,1,4,0:0:0:0:
192,192,111479,1,2,0:0:0:0:
448,192,111479,128,0,111841:0:0:0:0:
64,192,111841,1,8,0:0:0:0:
192,192,112021,1,2,0:0:0:0:
448,192,112021,1,8,0:0:0:0:
320,192,112202,1,8,0:0:0:0:
64,192,112383,1,2,0:0:0:0:
192,192,112383,1,0,0:0:0:0:
320,192,112563,1,8,0:0:0:0:
64,192,112744,1,2,0:0:0:0:
448,192,112744,1,0,0:0:0:0:
192,192,112834,1,8,0:0:0:0:
320,192,112925,1,8,0:0:0:0:
192,192,113015,1,8,0:0:0:0:
64,192,113106,1,2,0:0:0:0:
320,192,113106,1,4,0:0:0:0:
448,192,113106,128,0,113377:0:0:0:0:
64,192,113467,1,2,0:0:0:0:
192,192,113467,128,8,113738:0:0:0:0:
448,192,113467,1,0,0:0:0:0:
64,192,113828,128,2,114100:0:0:0:0:
320,192,113828,1,0,0:0:0:0:
448,192,114009,1,0,0:0:0:0:
320,192,114100,1,0,0:0:0:0:
64,192,114190,1,8,0:0:0:0:
192,192,114190,1,2,0:0:0:0:
320,192,114371,128,0,114551:0:0:0:0:
64,192,114551,1,2,0:0:0:0:
448,192,114551,1,0,0:0:0:0:
192,192,114732,128,0,114822:0:0:0:0:
64,192,114913,1,2,0:0:0:0:
320,192,114913,128,8,115003:0:0:0:0:
448,192,115094,128,0,115184:0:0:0:0:
64,192,115274,128,2,115455:0:0:0:0:
192,192,115274,128,0,115455:0:0:0:0:
320,192,115455,128,0,115636:0:0:0:0:
448,192,115455,128,0,115636:0:0:0:0:
64,192,115636,128,8,115816:0:0:0:0:
192,192,115636,128,2,115816:0:0:0:0:
320,192,115816,128,0,115997:0:0:0:0:
448,192,115816,128,0,115997:0:0:0:0:
64,192,115997,128,2,116268:0:0:0:0:
192,192,115997,1,0,0:0:0:0:
320,192,116359,1,2,0:0:0:0:
448,192,116359,128,8,116630:0:0:0:0:
64,192,116720,1,2,0:0:0:0:
192,192,116720,128,0,116991:0:0:0:0:
448,192,116901,1,0,0:0:0:0:
320,192,116991,1,0,0:0:0:0:
64,192,117081,1,8,0:0:0:0:
192,192,117081,1,2,0:0:0:0:
320,192,117262,128,0,117443:0:0:0:0:
192,192,117443,1,2,0:0:0:0:
448,192,117443,1,0,0:0:0:0:
64,192,117624,128,0,117804:0:0:0:0:
320,192,117804,1,2,0:0:0:0:
448,192,117804,128,8,117985:0:0:0:0:
192,192,117985,128,0,118166:0:0:0:0:
64,192,118166,128,2,118347:0:0:0:0:
448,192,118166,1,0,0:0:0:0:
192,192,118347,128,0,118527:0:0:0:0:
320,192,118347,1,0,0:0:0:0:
64,192,118527,1,8,0:0:0:0:
448,192,118527,128,2,118708:0:0:0:0:
192,192,118708,1,0,0:0:0:0:
320,192,118708,128,0,118889:0:0:0:0:
64,192,118889,128,2,119160:0:0:0:0:
448,192,118889,1,0,0:0:0:0:
64,192,119250,1,2,0:0:0:0:
320,192,119250,128,8,119521:0:0:0:0:
448,192,119250,1,0,0:0:0:0:
192,192,119612,1,2,0:0:0:0:
448,192,119612,128,0,119883:0:0:0:0:
64,192,119792,1,0,0:0:0:0:
192,192,119883,1,0,0:0:0:0:
320,192,119973,1,8,0:0:0:0:
448,192,119973,1,2,0:0:0:0:
192,192,120154,128,0,120334:0:0:0:0:
64,192,120334,1,2,0:0:0:0:
448,192,120334,1,0,0:0:0:0:
320,192,120515,128,0,120606:0:0:0:0:
192,192,120696,128,2,120786:0:0:0:0:
448,192,120696,1,8,0:0:0:0:
64,192,120877,128,0,120967:0:0:0:0:
320,192,121057,128,2,121238:0:0:0:0:
448,192,121057,128,0,121238:0:0:0:0:
64,192,121238,128,0,121419:0:0:0:0:
192,192,121238,128,0,121419:0:0:0:0:
320,192,121419,128,8,121600:0:0:0:0:
448,192,121419,128,2,121600:0:0:0:0:
64,192,121600,128,0,121780:0:0:0:0:
192,192,121600,128,0,121780:0:0:0:0:
320,192,121780,1,2,0:0:0:0:
448,192,121780,128,0,122051:0:0:0:0:
64,192,122142,128,2,122413:0:0:0:0:
192,192,122142,1,8,0:0:0:0:
320,192,122503,128,2,122684:0:0:0:0:
448,192,122503,1,0,0:0:0:0:
192,192,122774,128,2,122955:0:0:0:0:
320,192,122774,1,0,0:0:0:0:
64,192,123045,1,2,0:0:0:0:
320,192,123045,1,4,0:0:0:0:
448,192,123045,128,0,123588:0:0:0:0:
192,192,123407,1,8,0:0:0:0:
64,192,123588,1,8,0:0:0:0:
320,192,123588,1,0,0:0:0:0:
192,192,123768,1,8,0:0:0:0:
64,192,123949,128,2,124349:0:0:0:0:
320,192,123949,1,0,0:0:0:0:
448,192,123949,1,0,0:0:0:0:
192,192,124349,1,2,0:0:0:0:
448,192,124349,1,0,0:0:0:0:
64,192,124749,1,4,0:0:0:0:
320,192,124749,1,2,0:0:0:0:
448,192,124749,1,0,0:0:0:0:
64,192,125149,1,0,0:0:0:20:soft-hitclap.wav
192,192,125349,1,0,0:0:0:0:
448,192,125549,1,8,0:0:0:0:
320,192,125749,1,0,0:0:0:0:
64,192,125949,1,0,0:0:0:20:soft-hitclap.wav
320,192,126149,1,0,0:0:0:0:
448,192,126349,1,0,0:0:0:20:soft-hitclap.wav
192,192,126549,1,0,0:0:0:0:
320,192,126649,1,0,0:0:0:0:
64,192,126749,1,0,0:0:0:20:soft-hitclap.wav
192,192,126949,1,0,0:0:0:0:
64,192,127149,1,2,0:0:0:0:
320,192,127149,1,8,0:0:0:0:
448,192,127149,128,0,127349:0:0:0:0:
192,192,127349,128,0,127549:0:0:0:0:
64,192,127549,128,2,127849:0:0:0:0:
320,192,127549,1,0,0:0:0:20:soft-hitclap.wav
448,192,127549,128,0,127849:0:0:0:0:
64,192,127949,1,2,0:0:0:0:
192,192,127949,1,0,0:0:0:20:soft-hitclap.wav
448,192,127949,1,0,0:0:0:0:
448,192,128349,1,0,0:0:0:20:soft-hitclap.wav
320,192,128549,1,0,0:0:0:0:
64,192,128749,1,8,0:0:0:0:
192,192,128949,1,0,0:0:0:0:
448,192,129149,1,0,0:0:0:20:soft-hitclap.wav
192,192,129349,1,0,0:0:0:0:
64,192,129549,1,0,0:0:0:20:soft-hitclap.wav
320,192,129749,1,0,0:0:0:0:
192,192,129949,1,0,0:0:0:20:soft-hitclap.wav
320,192,130149,1,0,0:0:0:0:
64,192,130349,128,2,130549:0:0:0:0:
192,192,130349,1,8,0:0:0:0:
448,192,130349,1,0,0:0:0:0:
320,192,130549,128,0,130749:0:0:0:0:
64,192,130749,128,2,131049:0:0:0:0:
192,192,130749,1,0,0:0:0:20:soft-hitclap.wav
448,192,130749,128,0,131049:0:0:0:0:
64,192,131149,1,2,0:0:0:0:
320,192,131149,1,4,0:0:0:0:
448,192,131149,1,0,0:0:0:0:
192,192,131349,1,0,0:0:0:0:
448,192,131549,1,0,0:0:0:20:soft-hitclap.wav
320,192,131749,1,0,0:0:0:0:
64,192,131949,1,8,0:0:0:0:
448,192,132349,1,0,0:0:0:20:soft-hitclap.wav
320,192,132549,1,0,0:0:0:0:
64,192,132749,1,0,0:0:0:20:soft-hitclap.wav
320,192,132949,1,0,0:0:0:0:
192,192,133149,1,0,0:0:0:20:soft-hitclap.wav
448,192,133349,1,0,0:0:0:0:
64,192,133549,128,2,133749:0:0:0:0:
192,192,133549,1,8,0:0:0:0:
320,192,133549,1,0,0:0:0:0:
448,192,133749,128,0,133949:0:0:0:0:
64,192,133949,128,2,134249:0:0:0:0:
192,192,133949,128,0,134249:0:0:0:20:soft-hitclap.wav
320,192,133949,1,0,0:0:0:0:
64,192,134349,1,2,0:0:0:0:
192,192,134349,1,0,0:0:0:20:soft-hitclap.wav
448,192,134349,1,0,0:0:0:0:
64,192,134749,1,0,0:0:0:20:soft-hitclap.wav
320,192,134949,1,0,0:0:0:0:
448,192,135149,1,8,0:0:0:0:
192,192,135349,1,0,0:0:0:0:
64,192,135549,1,0,0:0:0:20:soft-hitclap.wav
192,192,135749,1,0,0:0:0:0:
448,192,135949,1,0,0:0:0:20:soft-hitclap.wav
192,192,136149,1,0,0:0:0:0:
320,192,136349,1,0,0:0:0:20:soft-hitclap.wav
64,192,136549,1,0,0:0:0:0:
192,192,136749,1,2,0:0:0:0:
320,192,136749,1,8,0:0:0:0:
448,192,136749,128,0,136949:0:0:0:0:
64,192,136949,128,0,137149:0:0:0:0:
192,192,137149,1,2,0:0:0:0:
320,192,137149,128,0,137449:0:0:0:20:soft-hitclap.wav
448,192,137149,128,0,137449:0:0:0:0:
64,192,137549,1,2,0:0:0:0:
320,192,137549,1,4,0:0:0:0:
448,192,137549,1,0,0:0:0:0:
448,192,137949,1,0,0:0:0:20:soft-hitclap.wav
192,192,138082,1,0,0:0:0:20:soft-hitclap.wav
448,192,138215,1,0,0:0:0:20:soft-hitclap.wav
64,192,138349,128,8,138482:0:0:0:0:
320,192,138482,128,0,138615:0:0:0:0:
192,192,138615,128,0,138749:0:0:0:0:
448,192,138749,1,0,0:0:0:20:soft-hitclap.wav
64,192,138882,1,0,0:0:0:20:soft-hitclap.wav
448,192,139015,1,0,0:0:0:20:soft-hitclap.wav
192,192,139149,128,0,139282:0:0:0:20:soft-hitclap.wav
320,192,139282,128,0,139415:0:0:0:0:
64,192,139415,128,0,139549:0:0:0:0:
448,192,139549,1,0,0:0:0:20:soft-hitclap.wav
192,192,139682,1,0,0:0:0:20:soft-hitclap.wav
448,192,139815,1,0,0:0:0:20:soft-hitclap.wav
64,192,139949,1,2,0:0:0:0:
192,192,139949,1,8,0:0:0:0:
320,192,140082,1,0,0:0:0:0:
64,192,140215,1,0,0:0:0:0:
320,192,140349,1,2,0:0:0:0:
448,192,140349,1,0,0:0:0:20:soft-hitclap.wav
192,192,140482,1,0,0:0:0:20:soft-hitclap.wav
448,192,140615,1,0,0:0:0:20:soft-hitclap.wav
64,192,140749,1,2,0:0:0:0:
192,192,140749,1,0,0:0:0:20:soft-hitclap.wav
64,192,141149,1,0,0:0:0:20:soft-hitclap.wav
320,192,141282,1,0,0:0:0:20:soft-hitclap.wav
64,192,141415,1,0,0:0:0:20:soft-hitclap.wav
448,192,141549,128,8,141682:0:0:0:0:
192,192,141682,128,0,141815:0:0:0:0:
320,192,141815,128,0,141949:0:0:0:0:
64,192,141949,1,0,0:0:0:20:soft-hitclap.wav
448,192,142082,1,0,0:0:0:20:soft-hitclap.wav
64,192,142215,1,0,0:0:0:20:soft-hitclap.wav
320,192,142349,128,0,142482:0:0:0:20:soft-hitclap.wav
192,192,142482,128,0,142615:0:0:0:0:
448,192,142615,128,0,142749:0:0:0:0:
64,192,142749,1,0,0:0:0:20:soft-hitclap.wav
320,192,142882,1,0,0:0:0:20:soft-hitclap.wav
64,192,143015,1,0,0:0:0:20:soft-hitclap.wav
320,192,143149,1,2,0:0:0:0:
448,192,143149,1,8,0:0:0:0:
192,192,143282,1,0,0:0:0:0:
448,192,143415,1,0,0:0:0:0:
64,192,143549,1,2,0:0:0:0:
192,192,143549,1,0,0:0:0:20:soft-hitclap.wav
320,192,143682,1,0,0:0:0:20:soft-hitclap.wav
64,192,143815,1,0,0:0:0:20:soft-hitclap.wav
320,192,143949,1,2,0:0:0:0:
448,192,143949,1,4,0:0:0:0:
192,192,144349,1,0,0:0:0:20:soft-hitclap.wav
448,192,144482,1,0,0:0:0:20:soft-hitclap.wav
192,192,144615,1,0,0:0:0:20:soft-hitclap.wav
320,192,144749,128,8,144882:0:0:0:0:
64,192,144882,128,0,145015:0:0:0:0:
192,192,145015,128,0,145149:0:0:0:0:
448,192,145149,1,0,0:0:0:20:soft-hitclap.wav
64,192,145282,1,0,0:0:0:20:soft-hitclap.wav
448,192,145415,1,0,0:0:0:20:soft-hitclap.wav
192,192,145549,128,0,145682:0:0:0:20:soft-hitclap.wav
320,192,145682,128,0,145815:0:0:0:0:
64,192,145815,128,0,145949:0:0:0:0:
448,192,145949,1,0,0:0:0:20:soft-hitclap.wav
192,192,146082,1,0,0:0:0:20:soft-hitclap.wav
448,192,146215,1,0,0:0:0:20:soft-hitclap.wav
64,192,146349,1,2,0:0:0:0:
320,192,146349,1,8,0:0:0:0:
192,192,146482,1,0,0:0:0:0:
448,192,146615,1,0,0:0:0:0:
64,192,146749,1,2,0:0:0:0:
192,192,146749,1,0,0:0:0:20:soft-hitclap.wav
448,192,146882,1,0,0:0:0:20:soft-hitclap.wav
320,192,147015,1,0,0:0:0:20:soft-hitclap.wav
64,192,147149,1,2,0:0:0:0:
448,192,147149,1,0,0:0:0:20:soft-hitclap.wav
320,192,147549,1,0,0:0:0:20:soft-hitclap.wav
64,192,147682,1,0,0:0:0:20:soft-hitclap.wav
320,192,147815,1,0,0:0:0:20:soft-hitclap.wav
192,192,147949,128,8,148082:0:0:0:0:
448,192,148082,128,0,148215:0:0:0:0:
320,192,148215,128,0,148349:0:0:0:0:
64,192,148349,1,0,0:0:0:20:soft-hitclap.wav
448,192,148482,1,0,0:0:0:20:soft-hitclap.wav
64,192,148615,1,0,0:0:0:20:soft-hitclap.wav
320,192,148749,128,2,148882:0:0:0:0:
448,192,148749,1,0,0:0:0:20:soft-hitclap.wav
192,192,148882,128,0,149015:0:0:0:0:
448,192,149015,128,0,149149:0:0:0:0:
64,192,149149,128,2,149282:0:0:0:0:
192,192,149149,1,0,0:0:0:20:soft-hitclap.wav
320,192,149282,128,0,149415:0:0:0:20:soft-hitclap.wav
64,192,149415,128,0,149549:0:0:0:20:soft-hitclap.wav
192,192,149549,1,2,0:0:0:0:
320,192,149549,1,0,0:0:0:20:soft-hitclap.wav
448,192,149549,128,0,149949:0:0:0:0:
64,192,150349,128,2,150602:0:0:0:0:
448,192,150349,128,0,150475:0:0:0:0:
320,192,150475,128,0,150602:0:0:0:0:
192,192,150602,128,0,150728:0:0:0:0:
64,192,150728,128,2,150855:0:0:0:0:
448,192,150728,128,0,150981:0:0:0:0:
192,192,150855,128,0,150981:0:0:0:0:
320,192,150981,128,0,151108:0:0:0:0:
64,192,151108,128,2,151488:0:0:0:0:
448,192,151108,128,0,151488:0:0:0:0:
192,192,151488,1,0,0:0:0:0:
320,192,151678,1,0,0:0:0:0:
64,192,151867,128,0,151962:0:0:0:0:
448,192,151867,1,0,0:0:0:0:
192,192,152247,128,0,152342:0:0:0:0:
448,192,152437,128,0,152532:0:0:0:0:
320,192,152817,128,0,152912:0:0:0:0:
64,192,153197,128,0,153292:0:0:0:0:
320,192,153576,128,0,153671:0:0:0:0:
192,192,153766,128,0,153861:0:0:0:0:
448,192,153956,128,0,154051:0:0:0:0:
64,192,154146,128,0,154241:0:0:0:0:
448,192,154526,128,0,154621:0:0:0:0:
320,192,154716,128,0,154811:0:0:0:0:
64,192,154905,128,0,155000:0:0:0:0:
192,192,155285,128,0,155380:0:0:0:0:
64,192,155475,128,0,155570:0:0:0:0:
448,192,155665,128,0,155760:0:0:0:0:
320,192,156045,128,0,156140:0:0:0:0:
448,192,156235,128,0,156330:0:0:0:0:
192,192,156424,128,0,156519:0:0:0:0:
64,192,156614,128,0,156709:0:0:0:0:
320,192,156804,128,0,156899:0:0:0:0:
192,192,156994,128,0,157089:0:0:0:0:
448,192,157184,128,0,157279:0:0:0:0:
64,192,157564,128,0,157659:0:0:0:0:
192,192,157754,128,0,157849:0:0:0:0:
320,192,157943,128,0,158038:0:0:0:0:
192,192,158323,128,0,158418:0:0:0:0:
64,192,158513,128,0,158608:0:0:0:0:
448,192,158893,128,0,158988:0:0:0:0:
192,192,159273,128,0,159367:0:0:0:0:
448,192,159652,128,0,159747:0:0:0:0:
320,192,159842,128,0,159937:0:0:0:0:
192,192,160032,128,0,160127:0:0:0:0:
64,192,160222,128,0,160317:0:0:0:0:
320,192,160602,128,0,160697:0:0:0:0:
448,192,160792,128,0,160886:0:0:0:0:
64,192,160981,128,0,161076:0:0:0:0:
320,192,161361,128,0,161456:0:0:0:0:
64,192,161551,128,0,161646:0:0:0:0:
448,192,161741,128,0,161836:0:0:0:0:
320,192,162121,128,0,162216:0:0:0:0:
64,192,162311,128,0,162405:0:0:0:0:
448,192,162690,128,0,162785:0:0:0:0:
192,192,163070,128,0,163165:0:0:0:0:
64,192,163260,128,0,163355:0:0:0:0:
320,192,163830,128,0,164209:0:0:0:0:
448,192,164209,1,0,0:0:0:0:
320,192,164399,1,0,0:0:0:0:
192,192,164589,1,0,0:0:0:0:
64,192,164779,1,0,0:0:0:0:
192,192,164959,128,0,165050:0:0:0:0:
320,192,165140,128,0,165230:0:0:0:0:
448,192,165321,128,0,165411:0:0:0:0:
64,192,165501,1,2,0:0:0:0:
192,192,165501,1,0,0:0:0:40:Hat Open.wav
64,192,165862,1,2,0:0:0:0:
192,192,165862,1,0,0:0:0:0:
64,192,166223,1,2,0:0:0:0:
320,192,166223,1,0,0:0:0:0:
64,192,166585,1,2,0:0:0:0:
320,192,166585,1,0,0:0:0:0:
320,192,166946,1,2,0:0:0:0:
448,192,166946,1,0,0:0:0:0:
320,192,167308,1,2,0:0:0:0:
448,192,167308,1,0,0:0:0:0:
192,192,167669,1,2,0:0:0:0:
448,192,167669,1,0,0:0:0:0:
192,192,168031,1,2,0:0:0:0:
448,192,168031,1,0,0:0:0:0:
64,192,168392,1,2,0:0:0:0:
192,192,168392,1,0,0:0:0:0:
192,192,168754,1,2,0:0:0:0:
320,192,168754,1,0,0:0:0:0:
320,192,169115,1,2,0:0:0:0:
448,192,169115,1,0,0:0:0:0:
64,192,169476,1,2,0:0:0:0:
448,192,169476,1,0,0:0:0:0:
64,192,169657,1,4,0:0:0:0:
320,192,169657,128,2,170019:0:0:0:0:
448,192,169657,128,0,170019:0:0:0:0:
64,192,170019,1,2,0:0:0:0:
192,192,170019,1,0,0:0:0:0:
192,192,170199,1,2,0:0:0:0:
320,192,170199,1,0,0:0:0:0:
320,192,170380,1,0,0:0:0:0:
448,192,170380,1,0,0:0:0:0:
64,192,170561,1,8,0:0:0:0:
192,192,170561,128,2,170741:0:0:0:0:
448,192,170561,1,0,0:0:0:0:
64,192,170922,1,8,0:0:0:0:
320,192,170922,128,2,171103:0:0:0:0:
448,192,170922,1,0,0:0:0:0:
320,192,171284,1,2,0:0:0:0:
448,192,171284,1,4,0:0:0:0:
192,192,171374,1,0,0:0:0:0:
64,192,171464,1,0,0:0:0:0:
320,192,171555,1,0,0:0:0:0:
64,192,171645,1,8,0:0:0:0:
448,192,171645,1,2,0:0:0:0:
192,192,171735,1,0,0:0:0:0:
320,192,171826,1,0,0:0:0:0:
448,192,171916,1,0,0:0:0:0:
64,192,172007,1,2,0:0:0:0:
192,192,172007,1,0,0:0:0:0:
448,192,172097,1,0,0:0:0:0:
320,192,172187,1,0,0:0:0:0:
192,192,172278,1,0,0:0:0:0:
64,192,172368,128,2,172549:0:0:0:0:
448,192,172368,1,8,0:0:0:0:
320,192,172549,128,0,172729:0:0:0:0:
64,192,172729,1,2,0:0:0:0:
192,192,172729,1,0,0:0:0:0:
448,192,172910,128,0,173091:0:0:0:0:
64,192,173091,128,8,173272:0:0:0:0:
320,192,173091,1,2,0:0:0:0:
192,192,173272,128,0,173452:0:0:0:0:
64,192,173452,1,2,0:0:0:0:
448,192,173452,128,0,173633:0:0:0:0:
192,192,173633,1,0,0:0:0:0:
320,192,173814,128,2,173994:0:0:0:0:
448,192,173814,1,8,0:0:0:0:
64,192,173994,128,0,174175:0:0:0:0:
192,192,174175,1,2,0:0:0:0:
448,192,174175,1,0,0:0:0:0:
320,192,174266,1,0,0:0:0:0:
64,192,174356,1,0,0:0:0:0:
192,192,174446,1,0,0:0:0:0:
320,192,174537,1,8,0:0:0:0:
448,192,174537,1,2,0:0:0:0:
192,192,174627,1,0,0:0:0:0:
64,192,174717,1,0,0:0:0:0:
320,192,174808,1,0,0:0:0:0:
64,192,174898,1,2,0:0:0:0:
448,192,174898,1,0,0:0:0:0:
192,192,174988,1,0,0:0:0:0:
320,192,175079,1,0,0:0:0:0:
192,192,175169,1,0,0:0:0:0:
64,192,175260,1,2,0:0:0:0:
448,192,175260,128,8,175440:0:0:0:0:
192,192,175440,128,0,175621:0:0:0:0:
64,192,175621,1,2,0:0:0:0:
448,192,175621,1,0,0:0:0:0:
320,192,175802,128,0,175982:0:0:0:0:
64,192,175982,1,8,0:0:0:0:
448,192,175982,1,2,0:0:0:0:
192,192,176163,128,0,176344:0:0:0:0:
64,192,176344,1,2,0:0:0:0:
320,192,176344,1,0,0:0:0:0:
448,192,176344,128,0,176525:0:0:0:0:
320,192,176525,1,8,0:0:0:0:
192,192,176615,1,8,0:0:0:0:
64,192,176705,128,2,176886:0:0:0:0:
448,192,176705,1,8,0:0:0:0:
192,192,176886,1,8,0:0:0:0:
320,192,176976,1,8,0:0:0:0:
64,192,177067,1,2,0:0:0:0:
448,192,177067,1,4,0:0:0:0:
320,192,177157,1,0,0:0:0:0:
192,192,177247,1,0,0:0:0:0:
64,192,177338,1,0,0:0:0:0:
320,192,177428,1,2,0:0:0:0:
448,192,177428,1,8,0:0:0:0:
64,192,177609,128,0,177790:0:0:0:0:
320,192,177790,1,2,0:0:0:0:
448,192,177790,128,0,177970:0:0:0:0:
192,192,177970,128,0,178151:0:0:0:0:
64,192,178151,128,8,178332:0:0:0:0:
448,192,178151,1,2,0:0:0:0:
320,192,178332,128,0,178513:0:0:0:0:
64,192,178513,1,2,0:0:0:0:
448,192,178513,1,0,0:0:0:0:
192,192,178603,1,0,0:0:0:0:
320,192,178693,1,0,0:0:0:0:
448,192,178784,1,0,0:0:0:0:
64,192,178874,1,2,0:0:0:0:
192,192,178874,1,8,0:0:0:0:
448,192,179055,128,0,179235:0:0:0:0:
192,192,179235,128,2,179416:0:0:0:0:
320,192,179235,1,0,0:0:0:0:
64,192,179416,128,0,179597:0:0:0:0:
320,192,179597,128,8,179778:0:0:0:0:
448,192,179597,1,2,0:0:0:0:
192,192,179778,128,0,179958:0:0:0:0:
64,192,179958,1,2,0:0:0:0:
448,192,179958,128,0,180139:0:0:0:0:
320,192,180139,1,0,0:0:0:0:
64,192,180320,128,2,180501:0:0:0:0:
192,192,180320,1,8,0:0:0:0:
448,192,180320,1,0,0:0:0:0:
320,192,180501,1,0,0:0:0:0:
64,192,180681,1,2,0:0:0:0:
448,192,180681,128,0,180862:0:0:0:0:
192,192,180862,128,0,181043:0:0:0:0:
64,192,181043,128,8,181223:0:0:0:0:
448,192,181043,1,2,0:0:0:0:
320,192,181223,128,0,181404:0:0:0:0:
64,192,181404,1,2,0:0:0:0:
448,192,181404,128,0,181585:0:0:0:0:
320,192,181585,128,0,181766:0:0:0:0:
64,192,181766,128,2,181946:0:0:0:0:
448,192,181766,1,8,0:0:0:0:
192,192,181946,128,0,182127:0:0:0:0:
64,192,182127,1,2,0:0:0:0:
448,192,182127,128,0,182308:0:0:0:0:
320,192,182308,128,0,182488:0:0:0:0:
64,192,182488,128,8,182669:0:0:0:0:
448,192,182488,128,2,182669:0:0:0:0:
64,192,182850,1,2,0:0:0:0:
448,192,182850,1,0,0:0:0:0:
192,192,182940,1,0,0:0:0:0:
320,192,183031,1,0,0:0:0:0:
448,192,183121,1,0,0:0:0:0:
64,192,183211,1,2,0:0:0:0:
192,192,183211,1,8,0:0:0:0:
448,192,183392,128,0,183573:0:0:0:0:
64,192,183573,128,2,183754:0:0:0:0:
192,192,183573,1,0,0:0:0:0:
320,192,183754,128,0,183934:0:0:0:0:
64,192,183934,1,8,0:0:0:0:
448,192,183934,128,2,184115:0:0:0:0:
192,192,184115,128,0,184296:0:0:0:0:
64,192,184296,1,2,0:0:0:0:
448,192,184296,1,0,0:0:0:0:
320,192,184386,1,0,0:0:0:0:
192,192,184476,1,0,0:0:0:0:
64,192,184567,1,0,0:0:0:0:
320,192,184657,1,2,0:0:0:0:
448,192,184657,1,8,0:0:0:0:
64,192,184838,1,0,0:0:0:0:
192,192,184928,1,0,0:0:0:0:
320,192,185019,128,2,185199:0:0:0:0:
448,192,185019,1,0,0:0:0:0:
64,192,185199,128,0,185380:0:0:0:0:
192,192,185380,128,8,185561:0:0:0:0:
448,192,185380,1,2,0:0:0:0:
320,192,185561,128,0,185741:0:0:0:0:
192,192,185741,1,2,0:0:0:0:
448,192,185741,128,0,185922:0:0:0:0:
64,192,185922,128,0,186103:0:0:0:0:
192,192,186103,128,2,186284:0:0:0:0:
320,192,186103,1,8,0:0:0:0:
448,192,186284,128,0,186464:0:0:0:0:
64,192,186464,1,2,0:0:0:0:
320,192,186464,128,0,186645:0:0:0:0:
192,192,186645,128,0,186826:0:0:0:0:
64,192,186826,1,8,0:0:0:0:
448,192,186826,1,0,0:0:0:0:
320,192,187007,128,2,187368:0:0:0:0:
448,192,187007,1,0,0:0:0:0:
64,192,187368,1,8,0:0:0:0:
320,192,187549,1,2,0:0:0:0:
448,192,187549,128,8,187729:0:0:0:0:
192,192,187729,1,8,0:0:0:0:
320,192,187820,1,8,0:0:0:0:
64,192,187910,1,8,0:0:0:0:
448,192,187910,1,0,0:0:0:0:
320,192,188091,1,0,0:0:0:40:Tom1.wav
64,192,188272,128,2,188633:0:0:0:0:
192,192,188272,1,0,0:0:0:40:Tom2.wav
192,192,188633,1,2,0:0:0:0:
448,192,188633,1,0,0:0:0:0:
320,192,188814,1,0,0:0:0:0:
64,192,188994,1,2,0:0:0:0:
448,192,188994,1,0,0:0:0:0:
320,192,189175,1,0,0:0:0:0:
64,192,189356,1,2,0:0:0:0:
448,192,189356,1,0,0:0:0:0:
192,192,189537,1,0,0:0:0:0:
64,192,189717,1,2,0:0:0:0:
320,192,189717,1,0,0:0:0:0:
192,192,189898,1,0,0:0:0:0:
64,192,190079,1,2,0:0:0:0:
448,192,190079,1,0,0:0:0:0:
320,192,190260,1,0,0:0:0:0:
64,192,190440,1,2,0:0:0:0:
192,192,190440,1,0,0:0:0:0:
320,192,190621,1,0,0:0:0:0:
64,192,190802,1,2,0:0:0:0:
448,192,190802,1,0,0:0:0:0:
192,192,190982,1,0,0:0:0:0:
320,192,191163,1,2,0:0:0:0:
448,192,191163,1,0,0:0:0:0:
192,192,191344,1,0,0:0:0:0:
64,192,191525,1,2,0:0:0:0:
448,192,191525,1,0,0:0:0:0:
64,192,191886,1,2,0:0:0:0:
320,192,191886,1,0,0:0:0:0:
192,192,192067,1,0,0:0:0:0:
64,192,192247,1,2,0:0:0:0:
448,192,192247,1,0,0:0:0:0:
320,192,192428,1,0,0:0:0:0:
192,192,192609,1,2,0:0:0:0:
448,192,192609,1,0,0:0:0:0:
64,192,192790,1,8,0:0:0:0:
320,192,192790,128,0,193061:0:0:0:0:
192,192,193151,128,0,193422:0:0:0:0:
64,192,193513,128,0,193693:0:0:0:0:
320,192,193693,1,2,0:0:0:0:
448,192,193693,1,0,0:0:0:0:
64,192,193874,1,8,0:0:0:0:
192,192,193874,1,0,0:0:0:0:
320,192,193964,1,8,0:0:0:0:
64,192,194055,1,2,0:0:0:0:
448,192,194055,1,8,0:0:0:0:
192,192,194145,1,8,0:0:0:0:
320,192,194235,1,8,0:0:0:0:
192,192,194326,1,8,0:0:0:0:
64,192,194416,1,4,0:0:0:0:
448,192,194416,128,2,194597:0:0:0:0:
192,192,194597,128,0,194778:0:0:0:30:Hat Open.wav
320,192,194778,1,2,0:0:0:0:
448,192,194778,128,8,194958:0:0:0:0:
64,192,194958,128,0,195139:0:0:0:30:Hat Open.wav
320,192,195139,1,2,0:0:0:0:
448,192,195139,1,0,0:0:0:0:
64,192,195320,128,0,195501:0:0:0:30:Hat Open.wav
192,192,195501,1,8,0:0:0:0:
448,192,195501,1,2,0:0:0:0:
64,192,195681,128,0,195862:0:0:0:30:Hat Open.wav
192,192,195862,1,2,0:0:0:0:
320,192,195862,128,0,196043:0:0:0:0:
448,192,196043,128,0,196223:0:0:0:30:Hat Open.wav
64,192,196223,1,8,0:0:0:0:
192,192,196223,128,2,196404:0:0:0:0:
320,192,196404,128,0,196585:0:0:0:30:Hat Open.wav
64,192,196585,1,2,0:0:0:0:
192,192,196585,1,0,0:0:0:0:
448,192,196766,128,0,196946:0:0:0:30:Hat Open.wav
192,192,196946,128,2,197127:0:0:0:0:
320,192,196946,1,8,0:0:0:0:
448,192,197127,128,0,197308:0:0:0:30:Hat Open.wav
64,192,197308,128,2,197488:0:0:0:0:
192,192,197308,1,0,0:0:0:0:
320,192,197488,128,0,197669:0:0:0:30:Hat Open.wav
64,192,197669,128,2,197850:0:0:0:0:
192,192,197669,1,8,0:0:0:0:
448,192,197850,128,0,198031:0:0:0:30:Hat Open.wav
64,192,198031,1,2,0:0:0:0:
192,192,198031,1,0,0:0:0:0:
448,192,198211,128,0,198392:0:0:0:30:Hat Open.wav
64,192,198392,1,8,0:0:0:0:
320,192,198392,1,2,0:0:0:0:
448,192,198573,128,0,198754:0:0:0:30:Hat Open.wav
192,192,198754,128,2,198934:0:0:0:0:
320,192,198754,1,0,0:0:0:0:
64,192,198934,128,0,199115:0:0:0:30:Hat Open.wav
320,192,199115,128,8,199296:0:0:0:0:
448,192,199115,1,2,0:0:0:0:
192,192,199296,128,0,199476:0:0:0:30:Hat Open.wav
320,192,199476,1,2,0:0:0:0:
448,192,199476,1,0,0:0:0:0:
64,192,199657,128,0,199838:0:0:0:30:Hat Open.wav
192,192,199838,1,2,0:0:0:0:
448,192,199838,128,8,200019:0:0:0:0:
64,192,200199,128,2,200380:0:0:0:0:
448,192,200199,1,0,0:0:0:0:
320,192,200380,128,0,200561:0:0:0:30:Hat Open.wav
64,192,200561,128,2,200741:0:0:0:0:
192,192,200561,1,8,0:0:0:0:
448,192,200741,128,0,200922:0:0:0:30:Hat Open.wav
64,192,200922,1,2,0:0:0:0:
192,192,200922,1,0,0:0:0:0:
448,192,201103,128,0,201284:0:0:0:30:Hat Open.wav
64,192,201284,1,8,0:0:0:0:
320,192,201284,1,2,0:0:0:0:
448,192,201464,128,0,201645:0:0:0:30:Hat Open.wav
192,192,201645,128,2,201826:0:0:0:0:
320,192,201645,1,0,0:0:0:0:
64,192,201826,128,0,202007:0:0:0:30:Hat Open.wav
320,192,202007,128,8,202187:0:0:0:0:
448,192,202007,1,2,0:0:0:0:
192,192,202187,128,0,202368:0:0:0:30:Hat Open.wav
320,192,202368,1,2,0:0:0:0:
448,192,202368,1,0,0:0:0:0:
64,192,202549,128,0,202729:0:0:0:30:Hat Open.wav
192,192,202729,1,2,0:0:0:0:
320,192,202729,128,8,202910:0:0:0:0:
64,192,202910,128,0,203091:0:0:0:30:Hat Open.wav
320,192,203091,1,2,0:0:0:0:
448,192,203091,128,0,203272:0:0:0:0:
192,192,203272,128,0,203452:0:0:0:30:Hat Open.wav
320,192,203452,1,2,0:0:0:0:
448,192,203452,128,8,203633:0:0:0:0:
64,192,203633,128,0,203814:0:0:0:30:Hat Open.wav
320,192,203814,1,2,0:0:0:0:
448,192,203814,1,0,0:0:0:0:
64,192,203994,128,0,204175:0:0:0:30:Hat Open.wav
192,192,204175,1,8,0:0:0:0:
448,192,204175,1,2,0:0:0:0:
64,192,204356,128,0,204537:0:0:0:30:Hat Open.wav
192,192,204537,1,2,0:0:0:0:
320,192,204537,128,0,204717:0:0:0:0:
448,192,204717,128,0,204898:0:0:0:30:Hat Open.wav
64,192,204898,1,8,0:0:0:0:
192,192,204898,128,2,205079:0:0:0:0:
320,192,205079,128,0,205260:0:0:0:30:Hat Open.wav
64,192,205260,1,2,0:0:0:0:
192,192,205260,1,0,0:0:0:0:
448,192,205440,128,0,205621:0:0:0:30:Hat Open.wav
64,192,205621,128,2,205802:0:0:0:0:
320,192,205621,1,8,0:0:0:0:
192,192,205802,1,0,0:0:0:0:
64,192,205982,1,4,0:0:0:0:
448,192,205982,128,2,206163:0:0:0:0:
64,192,206344,1,2,0:0:0:0:
320,192,206344,128,0,206525:0:0:0:0:
192,192,206705,128,2,206886:0:0:0:0:
448,192,206705,1,0,0:0:0:0:
64,192,207067,128,2,207247:0:0:0:0:
448,192,207067,1,0,0:0:0:0:
64,192,207428,1,2,0:0:0:0:
192,192,207428,128,0,207609:0:0:0:0:
64,192,207790,1,2,0:0:0:0:
320,192,207790,128,0,207970:0:0:0:0:
320,192,208151,1,2,0:0:0:0:
448,192,208151,128,0,208332:0:0:0:0:
64,192,208513,128,2,208693:0:0:0:0:
320,192,208513,1,0,0:0:0:0:
64,192,208874,1,2,0:0:0:0:
448,192,208874,128,0,209055:0:0:0:0:
64,192,209235,1,2,0:0:0:0:
320,192,209235,128,0,209416:0:0:0:0:
192,192,209597,128,2,209778:0:0:0:0:
448,192,209597,1,0,0:0:0:0:
64,192,209958,128,2,210139:0:0:0:0:
448,192,209958,1,0,0:0:0:0:
320,192,210320,1,2,0:0:0:0:
448,192,210320,1,0,0:0:0:0:
64,192,210410,1,0,0:0:0:0:
192,192,210501,1,0,0:0:0:0:
320,192,210591,1,2,0:0:0:0:
448,192,210591,1,0,0:0:0:0:
192,192,210681,1,0,0:0:0:0:
64,192,210772,1,0,0:0:0:0:
320,192,210862,1,2,0:0:0:0:
448,192,210862,1,0,0:0:0:0:
`;
var osuFile = OSUParser.parse(text);
class ManiaScreen extends Box {
  constructor(gl) {
    super(gl, {
      size: ["fill-parent", "fill-parent"]
    });
    __publicField(this, "background");
    __publicField(this, "videoBackground");
    __publicField(this, "collector", (bg) => {
      if (bg.video) {
        this.videoBackground.isVisible = true;
        this.videoBackground.setVideo(bg.video);
        this.background.isVisible = false;
      } else if (bg.image) {
        this.background.isVisible = true;
        this.videoBackground.isVisible = false;
        this.background.updateBackground2(bg.image);
      } else {
        this.background.isVisible = true;
        this.videoBackground.isVisible = false;
        this.background.updateBackground2(BackgroundLoader$1.getBackground());
      }
    });
    this.background = new Background(gl, OSUPlayer$1.background.value.image);
    this.videoBackground = new VideoBackground(gl, null);
    OSUPlayer$1.background.collect(this.collector);
    const trackWidth = new Array(4).fill(80);
    const offsetLeft = 400;
    const trackGap = 8;
    let data;
    if (OSUPlayer$1.maniaNoteData.value !== null) {
      data = OSUPlayer$1.maniaNoteData.value;
    } else {
      data = osuFile.NoteData;
      Toaster.show("Mania Note is Empty, use default");
    }
    const mania = new ManiaPanel(
      gl,
      offsetLeft,
      trackWidth[0],
      trackGap,
      data
    );
    const mask = new ColorDrawable(gl, {
      size: ["fill-parent", "fill-parent"],
      color: Color.fromHex(0, 204)
    });
    this.add(
      this.background,
      this.videoBackground,
      mask,
      mania
    );
  }
  onUpdate() {
    super.onUpdate();
    this.background.translate = MouseState.position.copy();
  }
  dispose() {
    super.dispose();
    OSUPlayer$1.background.removeCollect(this.collector);
  }
}
const approachCircle = "" + new URL("approachcircle-0459bffe.png", import.meta.url).href;
const stdNoteCircle = "" + new URL("hitcircleoverlay-8d1effa1.png", import.meta.url).href;
const _hoisted_1$1 = {
  class: "fill-size",
  style: { "pointer-events": "none" }
};
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "Visualizer2",
  setup(__props) {
    const canvas = ref(null);
    let renderer2;
    const player = AudioPlayerV2;
    const audioData = {
      sampleRate: 0,
      leftChannel: new Float32Array(0),
      rightChannel: new Float32Array(0)
    };
    OSUPlayer$1.onChanged.collect(() => {
      const audioBuffer = player.getAudioBuffer();
      audioData.sampleRate = audioBuffer.sampleRate;
      if (audioBuffer.numberOfChannels < 2) {
        audioData.leftChannel = audioBuffer.getChannelData(0);
        audioData.rightChannel = audioData.leftChannel;
      } else {
        audioData.leftChannel = audioBuffer.getChannelData(0);
        audioData.rightChannel = audioBuffer.getChannelData(1);
      }
    });
    const mouseListener = {
      mousedown(e) {
        const x = e.x - window.innerWidth / 2;
        const y = window.innerHeight / 2 - e.y;
        let which = MOUSE_KEY_NONE;
        if (e.button === 0)
          which = MOUSE_KEY_LEFT;
        if (e.button === 2)
          which = MOUSE_KEY_RIGHT;
        if (which !== MOUSE_KEY_NONE)
          MouseState.receiveMouseDown(which, x, y);
      },
      mouseup(e) {
        const x = e.x - window.innerWidth / 2;
        const y = window.innerHeight / 2 - e.y;
        let which = MOUSE_KEY_NONE;
        if (e.button === 0)
          which = MOUSE_KEY_LEFT;
        if (e.button === 2)
          which = MOUSE_KEY_RIGHT;
        if (which !== MOUSE_KEY_NONE)
          MouseState.receiveMouseUp(which, x, y);
      },
      mousemove(e) {
        const x = e.x - window.innerWidth / 2;
        const y = window.innerHeight / 2 - e.y;
        MouseState.receiveMouseMove(x, y);
      }
    };
    onMounted(async () => {
      window.addEventListener("mousedown", mouseListener.mousedown);
      window.addEventListener("mouseup", mouseListener.mouseup);
      window.addEventListener("mousemove", mouseListener.mousemove);
      const c = canvas.value;
      if (!c)
        return;
      const webgl = c.getContext("webgl2", {
        alpha: false
      });
      if (!webgl) {
        return;
      }
      resizeCanvas();
      await ImageLoader.load(logoImg, "logo");
      await ImageLoader.load(rippleNew, "ripple");
      await ImageLoader.load(legacyLogo, "legacyLogo");
      await ImageLoader.load(backIcon, "backIcon");
      await ImageLoader.load(stdNoteCircle, "stdNoteCircle");
      await ImageLoader.load(approachCircle, "approachCircle");
      await ImageLoader.load(star, "star");
      await ImageLoader.load(whiteRound, "whiteRound");
      await BackgroundLoader$1.init();
      ShaderManager$1.init(webgl);
      renderer2 = new WebGLRenderer(webgl);
      window.onresize = () => {
        resizeCanvas();
      };
      ScreenManager$1.init(renderer2);
      ScreenManager$1.addScreen("main", () => {
        return new MainScreen(webgl);
      });
      ScreenManager$1.addScreen("second", () => {
        return new SongPlayScreen(webgl);
      });
      ScreenManager$1.addScreen("mania", () => {
        return new ManiaScreen(webgl);
      });
      ScreenManager$1.activeScreen("main");
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
      BeatState.isKiai = BeatBooster$1.isKiai(time);
      BeatState.beatIndex = BeatBooster$1.getCurrentBeatCount() + 1;
      BeatState.currentBeat = BeatBooster$1.updateBeat(time, easeOut, easeOutQuint);
      BeatState.isAvailable = BeatBooster$1.isAvailable;
      BeatState.currentRMS = player.isPlaying() ? calcRMS(
        audioData.sampleRate,
        audioData.leftChannel,
        audioData.rightChannel,
        time,
        BeatBooster$1.isAvailable ? 1024 : 2048
      ) : 0;
      BeatState.nextBeatRMS = player.isPlaying() ? calcRMS(
        audioData.sampleRate,
        audioData.leftChannel,
        audioData.rightChannel,
        (BeatBooster$1.getCurrentBeatCount() + 1) * BeatBooster$1.getGap() + BeatBooster$1.getOffset(),
        1024
      ) : 0;
      renderer2.render();
    }
    function resizeCanvas() {
      if (canvas.value) {
        canvas.value.height = canvas.value.clientHeight * window.devicePixelRatio;
        canvas.value.width = canvas.value.clientWidth * window.devicePixelRatio;
        console.log(canvas.value.clientWidth, canvas.value.clientHeight);
        Coordinate$1.updateCoordinate(
          canvas.value.clientWidth,
          canvas.value.clientHeight
        );
        console.log("canvas", canvas.value.width, canvas.value.height);
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$1, [
        createBaseVNode("canvas", {
          style: { "width": "100vw", "height": "100vh" },
          ref_key: "canvas",
          ref: canvas
        }, null, 512)
      ]);
    };
  }
});
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "VolumeAdjuster",
  setup(__props) {
    const canvas = ref(null);
    const player = AudioPlayerV2;
    let context;
    let isShow = false;
    let opacity = ref(0);
    onMounted(() => {
      if (canvas.value) {
        const ctx = canvas.value.getContext("2d");
        if (ctx) {
          context = ctx;
        }
      }
    });
    function resizeCanvas(canvas2) {
      if (canvas2) {
        canvas2.width = canvas2.parentElement.offsetWidth;
        canvas2.height = canvas2.parentElement.offsetHeight;
        return {
          width: canvas2.width,
          height: canvas2.height
        };
      }
      return {
        width: 0,
        height: 0
      };
    }
    function drawVolume(volume) {
      const ctx = context;
      const bound = resizeCanvas(canvas.value);
      ctx.beginPath();
      ctx.fillStyle = "#23131d";
      ctx.ellipse(
        bound.width / 2,
        bound.height / 2,
        100,
        100,
        degreeToRadian(0),
        0,
        360
      );
      ctx.fill();
      ctx.beginPath();
      ctx.strokeStyle = "#fad5ec";
      ctx.lineWidth = 2;
      const angle = Math.floor(volume * 270);
      ctx.arc(
        bound.width / 2,
        bound.height / 2,
        80,
        degreeToRadian(90),
        degreeToRadian(90 + angle)
      );
      ctx.stroke();
      ctx.beginPath();
      ctx.fillStyle = "#fad5ec";
      ctx.lineWidth = 2;
      ctx.font = "56px harmony";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        Math.floor(volume * 100).toString(),
        bound.width / 2,
        bound.height / 2
      );
      ctx.fill();
    }
    function changeVolume(ev) {
      if (!isShow) {
        simpleAnimate(opacity).easeInOutTo(1, 100);
      }
      isShow = true;
      if (ev.deltaY < 0) {
        player.setVolume(player.volume.value + 0.05);
      } else {
        player.setVolume(player.volume.value - 0.05);
      }
      drawVolume(player.volume.value);
    }
    function fadeOut() {
      if (isShow) {
        simpleAnimate(opacity).easeInOutTo(0, 100);
        isShow = false;
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        style: normalizeStyle(`width: 200px; height: 200px; opacity: ${unref(opacity)}`),
        onWheel: changeVolume,
        onMouseleave: _cache[0] || (_cache[0] = ($event) => fadeOut())
      }, [
        createBaseVNode("canvas", {
          ref_key: "canvas",
          ref: canvas
        }, null, 512)
      ], 36);
    };
  }
});
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
        var S = 0;
        t2 && (S |= 8), l || !_ && !g || (S |= 2048);
        var z = 0, C = 0;
        w && (z |= 16), "UNIX" === i2 ? (C = 798, z |= function(e3, t3) {
          var r3 = e3;
          return e3 || (r3 = t3 ? 16893 : 33204), (65535 & r3) << 16;
        }(h2.unixPermissions, w)) : (C = 20, z |= function(e3) {
          return 63 & (e3 || 0);
        }(h2.dosPermissions)), a = k.getUTCHours(), a <<= 6, a |= k.getUTCMinutes(), a <<= 5, a |= k.getUTCSeconds() / 2, o = k.getUTCFullYear() - 1980, o <<= 4, o |= k.getUTCMonth() + 1, o <<= 5, o |= k.getUTCDate(), _ && (v = A(1, 1) + A(B(f), 4) + c, b += "up" + A(v.length, 2) + v), g && (y = A(1, 1) + A(B(p2), 4) + m, b += "uc" + A(y.length, 2) + y);
        var E = "";
        return E += "\n\0", E += A(S, 2), E += u.magic, E += A(a, 2), E += A(o, 2), E += A(x.crc32, 4), E += A(x.compressedSize, 4), E += A(x.uncompressedSize, 4), E += A(f.length, 2), E += A(b.length, 2), { fileRecord: R.LOCAL_FILE_HEADER + E + f + b, dirRecord: R.CENTRAL_FILE_HEADER + A(C, 2) + E + A(p2.length, 2) + "\0\0\0\0" + A(z, 4) + A(n2, 4) + f + b + p2 };
      }
      var I = e("../utils"), i = e("../stream/GenericWorker"), O = e("../utf8"), B = e("../crc32"), R = e("../signature");
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
            return R.DATA_DESCRIPTOR + A(e3.crc32, 4) + A(e3.compressedSize, 4) + A(e3.uncompressedSize, 4);
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
          return R.CENTRAL_DIRECTORY_END + "\0\0\0\0" + A(e3, 2) + A(e3, 2) + A(t3, 4) + A(r3, 4) + A(s2.length, 2) + s2;
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
      var h2, c = e("../utils/common"), u = e("./trees"), d = e("./adler32"), p2 = e("./crc32"), n = e("./messages"), l = 0, f = 4, m = 0, _ = -2, g = -1, b = 4, i = 2, v = 8, y = 9, s = 286, a = 30, o = 19, w = 2 * s + 1, k = 15, x = 3, S = 258, z = S + x + 1, C = 42, E = 113, A = 1, I = 2, O = 3, B = 4;
      function R(e2, t2) {
        return e2.msg = n[t2], t2;
      }
      function T(e2) {
        return (e2 << 1) - (4 < e2 ? 9 : 0);
      }
      function D(e2) {
        for (var t2 = e2.length; 0 <= --t2; )
          e2[t2] = 0;
      }
      function F(e2) {
        var t2 = e2.state, r2 = t2.pending;
        r2 > e2.avail_out && (r2 = e2.avail_out), 0 !== r2 && (c.arraySet(e2.output, t2.pending_buf, t2.pending_out, r2, e2.next_out), e2.next_out += r2, t2.pending_out += r2, e2.total_out += r2, e2.avail_out -= r2, t2.pending -= r2, 0 === t2.pending && (t2.pending_out = 0));
      }
      function N(e2, t2) {
        u._tr_flush_block(e2, 0 <= e2.block_start ? e2.block_start : -1, e2.strstart - e2.block_start, t2), e2.block_start = e2.strstart, F(e2.strm);
      }
      function U(e2, t2) {
        e2.pending_buf[e2.pending++] = t2;
      }
      function P(e2, t2) {
        e2.pending_buf[e2.pending++] = t2 >>> 8 & 255, e2.pending_buf[e2.pending++] = 255 & t2;
      }
      function L(e2, t2) {
        var r2, n2, i2 = e2.max_chain_length, s2 = e2.strstart, a2 = e2.prev_length, o2 = e2.nice_match, h3 = e2.strstart > e2.w_size - z ? e2.strstart - (e2.w_size - z) : 0, u2 = e2.window, l2 = e2.w_mask, f2 = e2.prev, c2 = e2.strstart + S, d2 = u2[s2 + a2 - 1], p3 = u2[s2 + a2];
        e2.prev_length >= e2.good_match && (i2 >>= 2), o2 > e2.lookahead && (o2 = e2.lookahead);
        do {
          if (u2[(r2 = t2) + a2] === p3 && u2[r2 + a2 - 1] === d2 && u2[r2] === u2[s2] && u2[++r2] === u2[s2 + 1]) {
            s2 += 2, r2++;
            do {
            } while (u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && s2 < c2);
            if (n2 = S - (c2 - s2), s2 = c2 - S, a2 < n2) {
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
      function Z(e2, t2) {
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
      function M(e2, t2, r2, n2, i2) {
        this.good_length = e2, this.max_lazy = t2, this.nice_length = r2, this.max_chain = n2, this.func = i2;
      }
      function H() {
        this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = v, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new c.Buf16(2 * w), this.dyn_dtree = new c.Buf16(2 * (2 * a + 1)), this.bl_tree = new c.Buf16(2 * (2 * o + 1)), D(this.dyn_ltree), D(this.dyn_dtree), D(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new c.Buf16(k + 1), this.heap = new c.Buf16(2 * s + 1), D(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new c.Buf16(2 * s + 1), D(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
      }
      function G(e2) {
        var t2;
        return e2 && e2.state ? (e2.total_in = e2.total_out = 0, e2.data_type = i, (t2 = e2.state).pending = 0, t2.pending_out = 0, t2.wrap < 0 && (t2.wrap = -t2.wrap), t2.status = t2.wrap ? C : E, e2.adler = 2 === t2.wrap ? 0 : 1, t2.last_flush = l, u._tr_init(t2), m) : R(e2, _);
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
          return R(e2, _);
        8 === n2 && (n2 = 9);
        var o2 = new H();
        return (e2.state = o2).strm = e2, o2.wrap = a2, o2.gzhead = null, o2.w_bits = n2, o2.w_size = 1 << o2.w_bits, o2.w_mask = o2.w_size - 1, o2.hash_bits = i2 + 7, o2.hash_size = 1 << o2.hash_bits, o2.hash_mask = o2.hash_size - 1, o2.hash_shift = ~~((o2.hash_bits + x - 1) / x), o2.window = new c.Buf8(2 * o2.w_size), o2.head = new c.Buf16(o2.hash_size), o2.prev = new c.Buf16(o2.w_size), o2.lit_bufsize = 1 << i2 + 6, o2.pending_buf_size = 4 * o2.lit_bufsize, o2.pending_buf = new c.Buf8(o2.pending_buf_size), o2.d_buf = 1 * o2.lit_bufsize, o2.l_buf = 3 * o2.lit_bufsize, o2.level = t2, o2.strategy = s2, o2.method = r2, K(e2);
      }
      h2 = [new M(0, 0, 0, 0, function(e2, t2) {
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
      }), new M(4, 4, 8, 4, Z), new M(4, 5, 16, 8, Z), new M(4, 6, 32, 32, Z), new M(4, 4, 16, 16, W), new M(8, 16, 32, 32, W), new M(8, 16, 128, 128, W), new M(8, 32, 128, 256, W), new M(32, 128, 258, 1024, W), new M(32, 258, 258, 4096, W)], r.deflateInit = function(e2, t2) {
        return Y(e2, t2, v, 15, 8, 0);
      }, r.deflateInit2 = Y, r.deflateReset = K, r.deflateResetKeep = G, r.deflateSetHeader = function(e2, t2) {
        return e2 && e2.state ? 2 !== e2.state.wrap ? _ : (e2.state.gzhead = t2, m) : _;
      }, r.deflate = function(e2, t2) {
        var r2, n2, i2, s2;
        if (!e2 || !e2.state || 5 < t2 || t2 < 0)
          return e2 ? R(e2, _) : _;
        if (n2 = e2.state, !e2.output || !e2.input && 0 !== e2.avail_in || 666 === n2.status && t2 !== f)
          return R(e2, 0 === e2.avail_out ? -5 : _);
        if (n2.strm = e2, r2 = n2.last_flush, n2.last_flush = t2, n2.status === C)
          if (2 === n2.wrap)
            e2.adler = 0, U(n2, 31), U(n2, 139), U(n2, 8), n2.gzhead ? (U(n2, (n2.gzhead.text ? 1 : 0) + (n2.gzhead.hcrc ? 2 : 0) + (n2.gzhead.extra ? 4 : 0) + (n2.gzhead.name ? 8 : 0) + (n2.gzhead.comment ? 16 : 0)), U(n2, 255 & n2.gzhead.time), U(n2, n2.gzhead.time >> 8 & 255), U(n2, n2.gzhead.time >> 16 & 255), U(n2, n2.gzhead.time >> 24 & 255), U(n2, 9 === n2.level ? 2 : 2 <= n2.strategy || n2.level < 2 ? 4 : 0), U(n2, 255 & n2.gzhead.os), n2.gzhead.extra && n2.gzhead.extra.length && (U(n2, 255 & n2.gzhead.extra.length), U(n2, n2.gzhead.extra.length >> 8 & 255)), n2.gzhead.hcrc && (e2.adler = p2(e2.adler, n2.pending_buf, n2.pending, 0)), n2.gzindex = 0, n2.status = 69) : (U(n2, 0), U(n2, 0), U(n2, 0), U(n2, 0), U(n2, 0), U(n2, 9 === n2.level ? 2 : 2 <= n2.strategy || n2.level < 2 ? 4 : 0), U(n2, 3), n2.status = E);
          else {
            var a2 = v + (n2.w_bits - 8 << 4) << 8;
            a2 |= (2 <= n2.strategy || n2.level < 2 ? 0 : n2.level < 6 ? 1 : 6 === n2.level ? 2 : 3) << 6, 0 !== n2.strstart && (a2 |= 32), a2 += 31 - a2 % 31, n2.status = E, P(n2, a2), 0 !== n2.strstart && (P(n2, e2.adler >>> 16), P(n2, 65535 & e2.adler)), e2.adler = 1;
          }
        if (69 === n2.status)
          if (n2.gzhead.extra) {
            for (i2 = n2.pending; n2.gzindex < (65535 & n2.gzhead.extra.length) && (n2.pending !== n2.pending_buf_size || (n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p2(e2.adler, n2.pending_buf, n2.pending - i2, i2)), F(e2), i2 = n2.pending, n2.pending !== n2.pending_buf_size)); )
              U(n2, 255 & n2.gzhead.extra[n2.gzindex]), n2.gzindex++;
            n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p2(e2.adler, n2.pending_buf, n2.pending - i2, i2)), n2.gzindex === n2.gzhead.extra.length && (n2.gzindex = 0, n2.status = 73);
          } else
            n2.status = 73;
        if (73 === n2.status)
          if (n2.gzhead.name) {
            i2 = n2.pending;
            do {
              if (n2.pending === n2.pending_buf_size && (n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p2(e2.adler, n2.pending_buf, n2.pending - i2, i2)), F(e2), i2 = n2.pending, n2.pending === n2.pending_buf_size)) {
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
              if (n2.pending === n2.pending_buf_size && (n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p2(e2.adler, n2.pending_buf, n2.pending - i2, i2)), F(e2), i2 = n2.pending, n2.pending === n2.pending_buf_size)) {
                s2 = 1;
                break;
              }
              s2 = n2.gzindex < n2.gzhead.comment.length ? 255 & n2.gzhead.comment.charCodeAt(n2.gzindex++) : 0, U(n2, s2);
            } while (0 !== s2);
            n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p2(e2.adler, n2.pending_buf, n2.pending - i2, i2)), 0 === s2 && (n2.status = 103);
          } else
            n2.status = 103;
        if (103 === n2.status && (n2.gzhead.hcrc ? (n2.pending + 2 > n2.pending_buf_size && F(e2), n2.pending + 2 <= n2.pending_buf_size && (U(n2, 255 & e2.adler), U(n2, e2.adler >> 8 & 255), e2.adler = 0, n2.status = E)) : n2.status = E), 0 !== n2.pending) {
          if (F(e2), 0 === e2.avail_out)
            return n2.last_flush = -1, m;
        } else if (0 === e2.avail_in && T(t2) <= T(r2) && t2 !== f)
          return R(e2, -5);
        if (666 === n2.status && 0 !== e2.avail_in)
          return R(e2, -5);
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
              if (e3.lookahead <= S) {
                if (j(e3), e3.lookahead <= S && t3 === l)
                  return A;
                if (0 === e3.lookahead)
                  break;
              }
              if (e3.match_length = 0, e3.lookahead >= x && 0 < e3.strstart && (n3 = a3[i3 = e3.strstart - 1]) === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3]) {
                s3 = e3.strstart + S;
                do {
                } while (n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && i3 < s3);
                e3.match_length = S - (s3 - i3), e3.match_length > e3.lookahead && (e3.match_length = e3.lookahead);
              }
              if (e3.match_length >= x ? (r3 = u._tr_tally(e3, 1, e3.match_length - x), e3.lookahead -= e3.match_length, e3.strstart += e3.match_length, e3.match_length = 0) : (r3 = u._tr_tally(e3, 0, e3.window[e3.strstart]), e3.lookahead--, e3.strstart++), r3 && (N(e3, false), 0 === e3.strm.avail_out))
                return A;
            }
            return e3.insert = 0, t3 === f ? (N(e3, true), 0 === e3.strm.avail_out ? O : B) : e3.last_lit && (N(e3, false), 0 === e3.strm.avail_out) ? A : I;
          }(n2, t2) : h2[n2.level].func(n2, t2);
          if (o2 !== O && o2 !== B || (n2.status = 666), o2 === A || o2 === O)
            return 0 === e2.avail_out && (n2.last_flush = -1), m;
          if (o2 === I && (1 === t2 ? u._tr_align(n2) : 5 !== t2 && (u._tr_stored_block(n2, 0, 0, false), 3 === t2 && (D(n2.head), 0 === n2.lookahead && (n2.strstart = 0, n2.block_start = 0, n2.insert = 0))), F(e2), 0 === e2.avail_out))
            return n2.last_flush = -1, m;
        }
        return t2 !== f ? m : n2.wrap <= 0 ? 1 : (2 === n2.wrap ? (U(n2, 255 & e2.adler), U(n2, e2.adler >> 8 & 255), U(n2, e2.adler >> 16 & 255), U(n2, e2.adler >> 24 & 255), U(n2, 255 & e2.total_in), U(n2, e2.total_in >> 8 & 255), U(n2, e2.total_in >> 16 & 255), U(n2, e2.total_in >> 24 & 255)) : (P(n2, e2.adler >>> 16), P(n2, 65535 & e2.adler)), F(e2), 0 < n2.wrap && (n2.wrap = -n2.wrap), 0 !== n2.pending ? m : 1);
      }, r.deflateEnd = function(e2) {
        var t2;
        return e2 && e2.state ? (t2 = e2.state.status) !== C && 69 !== t2 && 73 !== t2 && 91 !== t2 && 103 !== t2 && t2 !== E && 666 !== t2 ? R(e2, _) : (e2.state = null, t2 === E ? R(e2, -3) : m) : _;
      }, r.deflateSetDictionary = function(e2, t2) {
        var r2, n2, i2, s2, a2, o2, h3, u2, l2 = t2.length;
        if (!e2 || !e2.state)
          return _;
        if (2 === (s2 = (r2 = e2.state).wrap) || 1 === s2 && r2.status !== C || r2.lookahead)
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
        var r2, n, i, s, a, o, h2, u, l, f, c, d, p2, m, _, g, b, v, y, w, k, x, S, z, C;
        r2 = e2.state, n = e2.next_in, z = e2.input, i = n + (e2.avail_in - 5), s = e2.next_out, C = e2.output, a = s - (t2 - e2.avail_out), o = s + (e2.avail_out - 257), h2 = r2.dmax, u = r2.wsize, l = r2.whave, f = r2.wnext, c = r2.window, d = r2.hold, p2 = r2.bits, m = r2.lencode, _ = r2.distcode, g = (1 << r2.lenbits) - 1, b = (1 << r2.distbits) - 1;
        e:
          do {
            p2 < 15 && (d += z[n++] << p2, p2 += 8, d += z[n++] << p2, p2 += 8), v = m[d & g];
            t:
              for (; ; ) {
                if (d >>>= y = v >>> 24, p2 -= y, 0 === (y = v >>> 16 & 255))
                  C[s++] = 65535 & v;
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
                        if (S = c, (x = 0) === f) {
                          if (x += u - y, y < w) {
                            for (w -= y; C[s++] = c[x++], --y; )
                              ;
                            x = s - k, S = C;
                          }
                        } else if (f < y) {
                          if (x += u + f - y, (y -= f) < w) {
                            for (w -= y; C[s++] = c[x++], --y; )
                              ;
                            if (x = 0, f < w) {
                              for (w -= y = f; C[s++] = c[x++], --y; )
                                ;
                              x = s - k, S = C;
                            }
                          }
                        } else if (x += f - y, y < w) {
                          for (w -= y; C[s++] = c[x++], --y; )
                            ;
                          x = s - k, S = C;
                        }
                        for (; 2 < w; )
                          C[s++] = S[x++], C[s++] = S[x++], C[s++] = S[x++], w -= 3;
                        w && (C[s++] = S[x++], 1 < w && (C[s++] = S[x++]));
                      } else {
                        for (x = s - k; C[s++] = C[x++], C[s++] = C[x++], C[s++] = C[x++], 2 < (w -= 3); )
                          ;
                        w && (C[s++] = C[x++], 1 < w && (C[s++] = C[x++]));
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
      var I = e("../utils/common"), O = e("./adler32"), B = e("./crc32"), R = e("./inffast"), T = e("./inftrees"), D = 1, F = 2, N = 0, U = -2, P = 1, n = 852, i = 592;
      function L(e2) {
        return (e2 >>> 24 & 255) + (e2 >>> 8 & 65280) + ((65280 & e2) << 8) + ((255 & e2) << 24);
      }
      function s() {
        this.mode = 0, this.last = false, this.wrap = 0, this.havedict = false, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new I.Buf16(320), this.work = new I.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
      }
      function a(e2) {
        var t2;
        return e2 && e2.state ? (t2 = e2.state, e2.total_in = e2.total_out = t2.total = 0, e2.msg = "", t2.wrap && (e2.adler = 1 & t2.wrap), t2.mode = P, t2.last = 0, t2.havedict = 0, t2.dmax = 32768, t2.head = null, t2.hold = 0, t2.bits = 0, t2.lencode = t2.lendyn = new I.Buf32(n), t2.distcode = t2.distdyn = new I.Buf32(i), t2.sane = 1, t2.back = -1, N) : U;
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
          T(F, e2.lens, 0, 32, f, 0, e2.work, { bits: 5 }), c = false;
        }
        e2.lencode = l, e2.lenbits = 9, e2.distcode = f, e2.distbits = 5;
      }
      function Z(e2, t2, r2, n2) {
        var i2, s2 = e2.state;
        return null === s2.window && (s2.wsize = 1 << s2.wbits, s2.wnext = 0, s2.whave = 0, s2.window = new I.Buf8(s2.wsize)), n2 >= s2.wsize ? (I.arraySet(s2.window, t2, r2 - s2.wsize, s2.wsize, 0), s2.wnext = 0, s2.whave = s2.wsize) : (n2 < (i2 = s2.wsize - s2.wnext) && (i2 = n2), I.arraySet(s2.window, t2, r2 - n2, i2, s2.wnext), (n2 -= i2) ? (I.arraySet(s2.window, t2, r2 - n2, n2, 0), s2.wnext = n2, s2.whave = s2.wsize) : (s2.wnext += i2, s2.wnext === s2.wsize && (s2.wnext = 0), s2.whave < s2.wsize && (s2.whave += i2))), 0;
      }
      r.inflateReset = o, r.inflateReset2 = h2, r.inflateResetKeep = a, r.inflateInit = function(e2) {
        return u(e2, 15);
      }, r.inflateInit2 = u, r.inflate = function(e2, t2) {
        var r2, n2, i2, s2, a2, o2, h3, u2, l2, f2, c2, d, p2, m, _, g, b, v, y, w, k, x, S, z, C = 0, E = new I.Buf8(4), A = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
        if (!e2 || !e2.state || !e2.output || !e2.input && 0 !== e2.avail_in)
          return U;
        12 === (r2 = e2.state).mode && (r2.mode = 13), a2 = e2.next_out, i2 = e2.output, h3 = e2.avail_out, s2 = e2.next_in, n2 = e2.input, o2 = e2.avail_in, u2 = r2.hold, l2 = r2.bits, f2 = o2, c2 = h3, x = N;
        e:
          for (; ; )
            switch (r2.mode) {
              case P:
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
                if (r2.lencode = r2.lendyn, r2.lenbits = 7, S = { bits: r2.lenbits }, x = T(0, r2.lens, 0, 19, r2.lencode, 0, r2.work, S), r2.lenbits = S.bits, x) {
                  e2.msg = "invalid code lengths set", r2.mode = 30;
                  break;
                }
                r2.have = 0, r2.mode = 19;
              case 19:
                for (; r2.have < r2.nlen + r2.ndist; ) {
                  for (; g = (C = r2.lencode[u2 & (1 << r2.lenbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l2); ) {
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
                if (r2.lenbits = 9, S = { bits: r2.lenbits }, x = T(D, r2.lens, 0, r2.nlen, r2.lencode, 0, r2.work, S), r2.lenbits = S.bits, x) {
                  e2.msg = "invalid literal/lengths set", r2.mode = 30;
                  break;
                }
                if (r2.distbits = 6, r2.distcode = r2.distdyn, S = { bits: r2.distbits }, x = T(F, r2.lens, r2.nlen, r2.ndist, r2.distcode, 0, r2.work, S), r2.distbits = S.bits, x) {
                  e2.msg = "invalid distances set", r2.mode = 30;
                  break;
                }
                if (r2.mode = 20, 6 === t2)
                  break e;
              case 20:
                r2.mode = 21;
              case 21:
                if (6 <= o2 && 258 <= h3) {
                  e2.next_out = a2, e2.avail_out = h3, e2.next_in = s2, e2.avail_in = o2, r2.hold = u2, r2.bits = l2, R(e2, c2), a2 = e2.next_out, i2 = e2.output, h3 = e2.avail_out, s2 = e2.next_in, n2 = e2.input, o2 = e2.avail_in, u2 = r2.hold, l2 = r2.bits, 12 === r2.mode && (r2.back = -1);
                  break;
                }
                for (r2.back = 0; g = (C = r2.lencode[u2 & (1 << r2.lenbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l2); ) {
                  if (0 === o2)
                    break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                if (g && 0 == (240 & g)) {
                  for (v = _, y = g, w = b; g = (C = r2.lencode[w + ((u2 & (1 << v + y) - 1) >> v)]) >>> 16 & 255, b = 65535 & C, !(v + (_ = C >>> 24) <= l2); ) {
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
                for (; g = (C = r2.distcode[u2 & (1 << r2.distbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l2); ) {
                  if (0 === o2)
                    break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                if (0 == (240 & g)) {
                  for (v = _, y = g, w = b; g = (C = r2.distcode[w + ((u2 & (1 << v + y) - 1) >> v)]) >>> 16 & 255, b = 65535 & C, !(v + (_ = C >>> 24) <= l2); ) {
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
        return e2.next_out = a2, e2.avail_out = h3, e2.next_in = s2, e2.avail_in = o2, r2.hold = u2, r2.bits = l2, (r2.wsize || c2 !== e2.avail_out && r2.mode < 30 && (r2.mode < 27 || 4 !== t2)) && Z(e2, e2.output, e2.next_out, c2 - e2.avail_out) ? (r2.mode = 31, -4) : (f2 -= e2.avail_in, c2 -= e2.avail_out, e2.total_in += f2, e2.total_out += c2, r2.total += c2, r2.wrap && c2 && (e2.adler = r2.check = r2.flags ? B(r2.check, i2, c2, e2.next_out - c2) : O(r2.check, i2, c2, e2.next_out - c2)), e2.data_type = r2.bits + (r2.last ? 64 : 0) + (12 === r2.mode ? 128 : 0) + (20 === r2.mode || 15 === r2.mode ? 256 : 0), (0 == f2 && 0 === c2 || 4 === t2) && x === N && (x = -5), x);
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
        return e2 && e2.state ? 0 !== (r2 = e2.state).wrap && 11 !== r2.mode ? U : 11 === r2.mode && O(1, t2, n2, 0) !== r2.check ? -3 : Z(e2, t2, n2, n2) ? (r2.mode = 31, -4) : (r2.havedict = 1, N) : U;
      }, r.inflateInfo = "pako inflate (from Nodeca project)";
    }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(e, t, r) {
      var D = e("../utils/common"), F = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], N = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], U = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], P = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
      t.exports = function(e2, t2, r2, n, i, s, a, o) {
        var h2, u, l, f, c, d, p2, m, _, g = o.bits, b = 0, v = 0, y = 0, w = 0, k = 0, x = 0, S = 0, z = 0, C = 0, E = 0, A = null, I = 0, O = new D.Buf16(16), B = new D.Buf16(16), R = null, T = 0;
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
        if (d = 0 === e2 ? (A = R = a, 19) : 1 === e2 ? (A = F, I -= 257, R = N, T -= 257, 256) : (A = U, R = P, -1), b = y, c = s, S = v = E = 0, l = -1, f = (C = 1 << (x = k)) - 1, 1 === e2 && 852 < C || 2 === e2 && 592 < C)
          return 1;
        for (; ; ) {
          for (p2 = b - S, _ = a[v] < d ? (m = 0, a[v]) : a[v] > d ? (m = R[T + a[v]], A[I + a[v]]) : (m = 96, 0), h2 = 1 << b - S, y = u = 1 << x; i[c + (E >> S) + (u -= h2)] = p2 << 24 | m << 16 | _ | 0, 0 !== u; )
            ;
          for (h2 = 1 << b - 1; E & h2; )
            h2 >>= 1;
          if (0 !== h2 ? (E &= h2 - 1, E += h2) : E = 0, v++, 0 == --O[b]) {
            if (b === w)
              break;
            b = t2[r2 + a[v]];
          }
          if (k < b && (E & f) !== l) {
            for (0 === S && (S = k), c += y, z = 1 << (x = b - S); x + S < w && !((z -= O[x + S]) <= 0); )
              x++, z <<= 1;
            if (C += 1 << x, 1 === e2 && 852 < C || 2 === e2 && 592 < C)
              return 1;
            i[l = E & f] = k << 24 | x << 16 | c - s | 0;
          }
        }
        return 0 !== E && (i[c + E] = b - S << 24 | 64 << 16 | 0), o.bits = k, 0;
      };
    }, { "../utils/common": 41 }], 51: [function(e, t, r) {
      t.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
    }, {}], 52: [function(e, t, r) {
      var i = e("../utils/common"), o = 0, h2 = 1;
      function n(e2) {
        for (var t2 = e2.length; 0 <= --t2; )
          e2[t2] = 0;
      }
      var s = 0, a = 29, u = 256, l = u + 1 + a, f = 30, c = 19, _ = 2 * l + 1, g = 15, d = 16, p2 = 7, m = 256, b = 16, v = 17, y = 18, w = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], k = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], x = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], S = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], z = new Array(2 * (l + 2));
      n(z);
      var C = new Array(2 * f);
      n(C);
      var E = new Array(512);
      n(E);
      var A = new Array(256);
      n(A);
      var I = new Array(a);
      n(I);
      var O, B, R, T = new Array(f);
      function D(e2, t2, r2, n2, i2) {
        this.static_tree = e2, this.extra_bits = t2, this.extra_base = r2, this.elems = n2, this.max_length = i2, this.has_stree = e2 && e2.length;
      }
      function F(e2, t2) {
        this.dyn_tree = e2, this.max_code = 0, this.stat_desc = t2;
      }
      function N(e2) {
        return e2 < 256 ? E[e2] : E[256 + (e2 >>> 7)];
      }
      function U(e2, t2) {
        e2.pending_buf[e2.pending++] = 255 & t2, e2.pending_buf[e2.pending++] = t2 >>> 8 & 255;
      }
      function P(e2, t2, r2) {
        e2.bi_valid > d - r2 ? (e2.bi_buf |= t2 << e2.bi_valid & 65535, U(e2, e2.bi_buf), e2.bi_buf = t2 >> d - e2.bi_valid, e2.bi_valid += r2 - d) : (e2.bi_buf |= t2 << e2.bi_valid & 65535, e2.bi_valid += r2);
      }
      function L(e2, t2, r2) {
        P(e2, r2[2 * t2], r2[2 * t2 + 1]);
      }
      function j(e2, t2) {
        for (var r2 = 0; r2 |= 1 & e2, e2 >>>= 1, r2 <<= 1, 0 < --t2; )
          ;
        return r2 >>> 1;
      }
      function Z(e2, t2, r2) {
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
      function M(e2) {
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
          for (; n2 = e2.pending_buf[e2.d_buf + 2 * o2] << 8 | e2.pending_buf[e2.d_buf + 2 * o2 + 1], i2 = e2.pending_buf[e2.l_buf + o2], o2++, 0 === n2 ? L(e2, i2, t2) : (L(e2, (s2 = A[i2]) + u + 1, t2), 0 !== (a2 = w[s2]) && P(e2, i2 -= I[s2], a2), L(e2, s2 = N(--n2), r2), 0 !== (a2 = k[s2]) && P(e2, n2 -= T[s2], a2)), o2 < e2.last_lit; )
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
        }(e2, t2), Z(s2, u2, e2.bl_count);
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
              0 !== i2 ? (i2 !== s2 && (L(e2, i2, e2.bl_tree), o2--), L(e2, b, e2.bl_tree), P(e2, o2 - 3, 2)) : o2 <= 10 ? (L(e2, v, e2.bl_tree), P(e2, o2 - 3, 3)) : (L(e2, y, e2.bl_tree), P(e2, o2 - 11, 7));
            s2 = i2, u2 = (o2 = 0) === a2 ? (h3 = 138, 3) : i2 === a2 ? (h3 = 6, 3) : (h3 = 7, 4);
          }
      }
      n(T);
      var q = false;
      function J(e2, t2, r2, n2) {
        P(e2, (s << 1) + (n2 ? 1 : 0), 3), function(e3, t3, r3, n3) {
          M(e3), n3 && (U(e3, r3), U(e3, ~r3)), i.arraySet(e3.pending_buf, e3.window, t3, r3, e3.pending), e3.pending += r3;
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
          for (Z(z, l + 1, s2), e3 = 0; e3 < f; e3++)
            C[2 * e3 + 1] = 5, C[2 * e3] = j(e3, 5);
          O = new D(z, w, u + 1, l, g), B = new D(C, k, 0, f, g), R = new D(new Array(0), x, 0, c, p2);
        }(), q = true), e2.l_desc = new F(e2.dyn_ltree, O), e2.d_desc = new F(e2.dyn_dtree, B), e2.bl_desc = new F(e2.bl_tree, R), e2.bi_buf = 0, e2.bi_valid = 0, W(e2);
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
          for (X(e3, e3.dyn_ltree, e3.l_desc.max_code), X(e3, e3.dyn_dtree, e3.d_desc.max_code), Y(e3, e3.bl_desc), t3 = c - 1; 3 <= t3 && 0 === e3.bl_tree[2 * S[t3] + 1]; t3--)
            ;
          return e3.opt_len += 3 * (t3 + 1) + 5 + 5 + 4, t3;
        }(e2), i2 = e2.opt_len + 3 + 7 >>> 3, (s2 = e2.static_len + 3 + 7 >>> 3) <= i2 && (i2 = s2)) : i2 = s2 = r2 + 5, r2 + 4 <= i2 && -1 !== t2 ? J(e2, t2, r2, n2) : 4 === e2.strategy || s2 === i2 ? (P(e2, 2 + (n2 ? 1 : 0), 3), K(e2, z, C)) : (P(e2, 4 + (n2 ? 1 : 0), 3), function(e3, t3, r3, n3) {
          var i3;
          for (P(e3, t3 - 257, 5), P(e3, r3 - 1, 5), P(e3, n3 - 4, 4), i3 = 0; i3 < n3; i3++)
            P(e3, e3.bl_tree[2 * S[i3] + 1], 3);
          V(e3, e3.dyn_ltree, t3 - 1), V(e3, e3.dyn_dtree, r3 - 1);
        }(e2, e2.l_desc.max_code + 1, e2.d_desc.max_code + 1, a2 + 1), K(e2, e2.dyn_ltree, e2.dyn_dtree)), W(e2), n2 && M(e2);
      }, r._tr_tally = function(e2, t2, r2) {
        return e2.pending_buf[e2.d_buf + 2 * e2.last_lit] = t2 >>> 8 & 255, e2.pending_buf[e2.d_buf + 2 * e2.last_lit + 1] = 255 & t2, e2.pending_buf[e2.l_buf + e2.last_lit] = 255 & r2, e2.last_lit++, 0 === t2 ? e2.dyn_ltree[2 * r2]++ : (e2.matches++, t2--, e2.dyn_ltree[2 * (A[r2] + u + 1)]++, e2.dyn_dtree[2 * N(t2)]++), e2.last_lit === e2.lit_bufsize - 1;
      }, r._tr_align = function(e2) {
        P(e2, 2, 3), L(e2, m, z), function(e3) {
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
class OSZ {
  constructor(oszFile) {
    __publicField(this, "audio", null);
    __publicField(this, "osuFile", null);
    __publicField(this, "osuFileList", null);
    __publicField(this, "backgroundImage", null);
    __publicField(this, "backgroundVideo", null);
    __publicField(this, "videoFormat", "");
    __publicField(this, "maniaNoteData", null);
    this.oszFile = oszFile;
  }
  async decompress() {
    const zip = await JSZip.loadAsync(this.oszFile);
    const filenames = Object.getOwnPropertyNames(zip.files);
    const osuFilenames = filenames.filter((filename) => filename.endsWith(".osu"));
    if (osuFilenames) {
      const list = [];
      for (let i = 0; i < osuFilenames.length; i++) {
        const name = osuFilenames[i];
        list.push(this.decompressOSUFile(zip, name));
      }
      const osuFileList = await Promise.all(list);
      this.osuFileList = osuFileList.filter((v) => v !== null);
    }
    const osuFilename = filenames.find((name) => name.endsWith(".osu"));
    if (!osuFilename)
      return;
    this.osuFile = await this.decompressOSUFile(zip, osuFilename);
  }
  async decompressOSUFile(zip, osuFilename) {
    var _a, _b, _c, _d;
    const osuFileContent = await ((_a = zip.file(osuFilename)) == null ? void 0 : _a.async("string"));
    if (!osuFileContent)
      return null;
    const osuFile2 = OSUParser.parse(osuFileContent);
    if (!this.backgroundImage || !this.backgroundVideo || !this.videoFormat || !this.audio) {
      if (osuFile2.General && osuFile2.General.AudioFilename) {
        const audio = await ((_b = zip.file(osuFile2.General.AudioFilename)) == null ? void 0 : _b.async("arraybuffer"));
        if (audio)
          this.audio = audio;
      }
      if (osuFile2.Events && osuFile2.Events.imageBackground) {
        const background = await ((_c = zip.file(osuFile2.Events.imageBackground)) == null ? void 0 : _c.async("blob"));
        if (background)
          this.backgroundImage = background;
      }
      if (osuFile2.Events && osuFile2.Events.videoBackground) {
        const path = osuFile2.Events.videoBackground;
        this.videoFormat = path.substring(path.lastIndexOf(".")).toLowerCase();
        const video = await ((_d = zip.file(osuFile2.Events.videoBackground)) == null ? void 0 : _d.async("blob"));
        if (video) {
          this.backgroundVideo = video;
        }
      }
    }
    if (!this.maniaNoteData && osuFile2.NoteData) {
      this.maniaNoteData = osuFile2.NoteData;
    }
    return osuFile2;
  }
  static async newOSZ(file) {
    const osz = new OSZ(file);
    await osz.decompress();
    return osz;
  }
}
function loadOSZ(file) {
  OSZ.newOSZ(file).then((osz) => {
    load(osz);
  });
}
async function load(osz) {
  var _a;
  const timingList = [];
  const osuFile2 = osz.osuFile;
  const osuTimingList = osuFile2.TimingPoints.timingList;
  let needAddNext = false;
  for (let i = 0; i < osuTimingList.length; i++) {
    const item = osuTimingList[i];
    if (item.isKiai) {
      needAddNext = true;
      timingList.push({
        isKiai: true,
        offset: item.offset
      });
      continue;
    }
    if (needAddNext) {
      needAddNext = false;
      timingList.push({
        isKiai: false,
        offset: item.offset
      });
    }
  }
  const bullet = newBullet();
  bullet.general.from = "osu";
  bullet.general.previewTime = osuFile2.General.PreviewTime;
  bullet.noteData = osuFile2.NoteData;
  bullet.stdNotes = (_a = osuFile2.HitObjects) == null ? void 0 : _a.stdNotes;
  const timing = {
    beatGap: osuFile2.TimingPoints.beatGap,
    offset: osuFile2.TimingPoints.offset,
    timingList
  };
  bullet.timingPoints = timing;
  bullet.metadata.title = osuFile2.Metadata.TitleUnicode;
  bullet.metadata.artist = osuFile2.Metadata.ArtistUnicode;
  bullet.metadata.source = osz.audio;
  if (osz.backgroundImage) {
    bullet.events.backgroundImage = osz.backgroundImage;
  }
  if (osz.backgroundVideo) {
    bullet.events.backgroundVideo = osz.backgroundVideo;
  }
  await OSUPlayer$1.setSource(bullet);
  await OSUPlayer$1.seek(bullet.general.previewTime);
  await OSUPlayer$1.play();
}
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "AlertDialog",
  props: {
    title: { default: "" }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Column, { class: "rounded-[8px] overflow-hidden" }, {
        default: withCtx(() => [
          createVNode(Row, { class: "w-full" }, {
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "title")
            ]),
            _: 3
          }),
          createVNode(Column, null, {
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "default")
            ]),
            _: 3
          })
        ]),
        _: 3
      });
    };
  }
});
const _hoisted_1 = { style: { "color": "#ffffff80" } };
const _hoisted_2 = { class: "text-white text-[16px]" };
const _hoisted_3 = { style: { "color": "#ffffff80", "font-size": "14px" } };
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "OSUBeatmapList",
  emits: ["close"],
  setup(__props) {
    const files = ref();
    show();
    async function show() {
      if (GlobalState.beatmapFileList.length) {
        console.log(GlobalState.beatmapFileList);
        files.value = GlobalState.beatmapFileList;
      } else {
        showBeatmapList();
      }
    }
    async function showBeatmapList() {
      const handle = await window.showDirectoryPicker({ id: beatmapDirectoryId });
      const list = [];
      for await (const fileHandle of handle.values()) {
        const file = await fileHandle.getFile();
        list.push(file);
      }
      GlobalState.beatmapFileList = list.sort((a, b) => {
        return b.lastModified - a.lastModified;
      });
      files.value = GlobalState.beatmapFileList;
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$2, { class: "osu-beatmap-list-box" }, {
        title: withCtx(() => [
          createVNode(Row, {
            class: "w-full h-12 px-4",
            "center-vertical": ""
          }, {
            default: withCtx(() => [
              createBaseVNode("button", {
                onClick: _cache[0] || (_cache[0] = ($event) => show()),
                class: "text-white p-4 ml-auto"
              }, "访问文件系统"),
              createBaseVNode("span", {
                class: "text-white",
                onClick: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("close"))
              }, "Close")
            ]),
            _: 1
          })
        ]),
        default: withCtx(() => [
          createVNode(Column, { class: "fill-width flex-grow osu-beatmap-list-content no-scroller" }, {
            default: withCtx(() => [
              (openBlock(true), createElementBlock(Fragment, null, renderList(files.value, (item, index) => {
                return openBlock(), createBlock(Row, {
                  class: "fill-width osu-beatmap-list-content-item",
                  onClick: ($event) => unref(loadOSZ)(item),
                  "center-vertical": "",
                  gap: 32
                }, {
                  default: withCtx(() => [
                    createBaseVNode("span", _hoisted_1, toDisplayString(index + 1), 1),
                    createVNode(Column, {
                      class: "fill-width",
                      gap: 8
                    }, {
                      default: withCtx(() => [
                        createBaseVNode("span", _hoisted_2, toDisplayString(item.name), 1),
                        createBaseVNode("span", _hoisted_3, toDisplayString((item.size / 1024 / 1024).toFixed(2)) + " MB", 1)
                      ]),
                      _: 2
                    }, 1024)
                  ]),
                  _: 2
                }, 1032, ["onClick"]);
              }), 256))
            ]),
            _: 1
          })
        ]),
        _: 1
      });
    };
  }
});
const OSUBeatmapList_vue_vue_type_style_index_0_scope_true_lang = "";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "App",
  setup(__props) {
    const ui = reactive({
      list: false,
      settings: false,
      bpmCalculator: false,
      showUI: false,
      miniPlayer: false,
      beatmapList: false
    });
    useCollect(ScreenManager$1.currentId, (id2) => {
      if (id2 === "main") {
        ui.showUI = false;
      }
    });
    provide$1("openList", () => {
      ui.list = true;
    });
    provide$1("openMiniPlayer", () => {
      ui.miniPlayer = true;
    });
    watch(() => ui.settings, (value) => onLeftSide.emit(value));
    watch(() => ui.list, (value) => onRightSide.emit(value));
    useKeyboard("up", (evt) => {
      console.log(evt.code);
      if (evt.code === "KeyO") {
        ui.showUI = true;
      }
      if (evt.code === "Escape") {
        ui.showUI = false;
      }
      if (ui.bpmCalculator) {
        return;
      }
      if (evt.code === "ArrowRight" && PLAYER) {
        nextSong();
        Toaster.show("下一曲");
      } else if (evt.code === "ArrowLeft" && PLAYER) {
        prevSong();
        Toaster.show("上一曲");
      } else if (evt.code === "Space") {
        play();
      }
    });
    onEnterMenu.collect((value) => {
      ui.showUI = value;
    });
    const hasSomeUIShow = computed(() => ui.list || ui.settings || ui.miniPlayer || ui.beatmapList);
    function hideUI() {
      ui.showUI = false;
      Toaster.show(`按“O“显示 `);
    }
    function closeAll() {
      ui.settings = false;
      ui.list = false;
      ui.miniPlayer = false;
      ui.beatmapList = false;
    }
    const stateText = ref("");
    const collector = () => PLAYER;
    watch(() => ui.bpmCalculator, (value) => {
      if (value)
        AudioPlayerV2.onEnd.removeCollect(collector);
      else
        AudioPlayerV2.onEnd.collect(collector);
    });
    AudioPlayerV2.onEnd.collect(collector);
    AudioPlayerV2.playStateFlow.collect((stateCode) => {
      stateText.value = {
        [PlayerState.STATE_DOWNLOADING]: "正在下载",
        [PlayerState.STATE_DECODING]: "正在解码",
        [PlayerState.STATE_PLAYING]: "正在播放",
        [PlayerState.STATE_DECODE_DONE]: "准备就绪",
        [PlayerState.STATE_PAUSING]: "播放暂停"
      }[stateCode];
    });
    onMounted(() => init());
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
      PlayManager$1.next();
    }
    function prevSong() {
      PlayManager$1.previous();
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
      loadOSZ(files.item(0));
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "fill-size",
        style: { "position": "relative", "overflow": "hidden" },
        onDrop: handleDrop,
        onDragenter: handleDrop,
        onDragleave: handleDrop,
        onDragover: handleDrop
      }, [
        createVNode(_sfc_main$4, { style: { "position": "absolute" } }),
        createVNode(Transition$1, { name: "top-bar" }, {
          default: withCtx(() => [
            withDirectives(createVNode(TopBar, {
              style: { "position": "absolute", "top": "0" },
              stateText: stateText.value,
              onSettingsClick: _cache[0] || (_cache[0] = ($event) => ui.settings = !ui.settings),
              onBpmCalcClick: _cache[1] || (_cache[1] = ($event) => ui.bpmCalculator = !ui.bpmCalculator),
              onBeatmapListClick: _cache[2] || (_cache[2] = ($event) => ui.beatmapList = !ui.beatmapList),
              onHideUI: _cache[3] || (_cache[3] = ($event) => hideUI())
            }, null, 8, ["stateText"]), [
              [vShow, ui.showUI]
            ])
          ]),
          _: 1
        }),
        createVNode(Transition$1, { name: "mask" }, {
          default: withCtx(() => [
            hasSomeUIShow.value ? (openBlock(), createElementBlock("div", {
              key: 0,
              style: { "position": "absolute" },
              class: "max-size mask",
              onClick: _cache[4] || (_cache[4] = ($event) => closeAll())
            })) : createCommentVNode("", true)
          ]),
          _: 1
        }),
        createVNode(_sfc_main$3, { style: { "position": "absolute", "right": "0", "bottom": "0" } }),
        createVNode(Transition$1, { name: "list" }, {
          default: withCtx(() => [
            ui.list ? (openBlock(), createBlock(Playlist, {
              key: 0,
              style: { "position": "absolute", "right": "0" }
            })) : createCommentVNode("", true)
          ]),
          _: 1
        }),
        createVNode(Transition$1, { name: "settings" }, {
          default: withCtx(() => [
            ui.settings ? (openBlock(), createBlock(SettingsPanel, {
              key: 0,
              style: { "position": "absolute", "left": "0" }
            })) : createCommentVNode("", true)
          ]),
          _: 1
        }),
        createVNode(Transition$1, { name: "player" }, {
          default: withCtx(() => [
            ui.miniPlayer ? (openBlock(), createBlock(MiniPlayer, {
              key: 0,
              style: { "position": "absolute", "top": "48px", "right": "80px" }
            })) : createCommentVNode("", true)
          ]),
          _: 1
        }),
        ui.bpmCalculator ? (openBlock(), createBlock(BpmCalculator, {
          key: 0,
          style: { "position": "absolute" },
          onClose: _cache[5] || (_cache[5] = ($event) => ui.bpmCalculator = false)
        })) : createCommentVNode("", true),
        ui.beatmapList ? (openBlock(), createBlock(_sfc_main$1, {
          key: 1,
          style: { "position": "absolute" }
        })) : createCommentVNode("", true),
        createVNode(Toast, { style: { "position": "absolute" } }),
        createVNode(DevelopTip, { style: { "position": "absolute", "right": "0", "bottom": "0" } })
      ], 32);
    };
  }
});
const App_vue_vue_type_style_index_0_scoped_ad715583_lang = "";
const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ad715583"]]);
createApp(App).mount("#app");
