import { track, trigger } from "./effect"

export function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) {
      const res = Reflect.get(target, key)
      // TODO依赖搜集
      track(target, key)
      return res
    },
    set(target, key, value) {
      const res = Reflect.set(target, key, value)
      // TODO 依赖触发
      trigger(target, key)
      return res
    }
  })
}