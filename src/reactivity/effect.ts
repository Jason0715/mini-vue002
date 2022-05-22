class ReactiveEffect {
  private _fn: any

  constructor(fn, public scheduler) {
    this._fn = fn
  }

  run() {
    activeEffect = this
    return this._fn()
  }
}

// 依赖收集
const targetMap = new Map()
export function track(target, key) {

  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }
  dep.add(activeEffect)
}

// 事件循环
export function trigger(target, key) {
  let depsMap = targetMap.get(target)
  let dep = depsMap.get(key)
  for (const effect of dep) {
    effect.run()
  }
}

let activeEffect
export function effect(fn, options?: any) {
  const _effct = new ReactiveEffect(fn, options.scheduler)

  _effct.run()
  return _effct.run.bind(_effct)
}