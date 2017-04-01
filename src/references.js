import { set, create } from './manipulate'
import { listener } from './struct/listener'
import { uid } from './uid'
import { get, getVal } from './get'
import getApi from './get/api'
import { root, path } from './traversal'

const resolveReferences = (t, instance, stamp) => {
  const listeners = t.emitters.data.struct
  const tRoot = root(t, true)
  var iRoot
  let i = listeners.length
  while (i--) {
    if (root(listeners[i], true) === tRoot) {
      if (!iRoot) iRoot = root(instance, true)
      if (iRoot !== tRoot) {
        const p = path(listeners[i], true)
        if (p[0] === tRoot.key) p.shift()
        let travel = iRoot
        if (p.length) {
          for (let i = 0, len = p.length; i < len; i++) {
            let key = p[i]
            if (!travel[key]) {
              const getf = get(travel, key, true)
              console.log('yo w00000000t????✨', key)
              console.log(getf, key, travel)
              travel = create(getf, void 0, stamp, travel, key)
            } else {
              travel = travel[key]
            }
          }
        }
        set(travel, instance, stamp)
      }
    }
  }
}

const removeReference = t => {
  if (t.val && typeof t.val === 'object' && t.val.inherits) {
    listener(t.val.emitters.data, null, uid(t))
  }
}

const reference = (t, val, stamp) => set(t, getApi(t, val.slice(1), {}, stamp))

const resolveFromValue = (t, val, stamp) => {
  if (val.instances && val._p && t._p) {
    const rootInstances = val.root(true).instances
    if (rootInstances && t.root(true) === val.root(true)) {
      for (let i = 0, len = rootInstances.length; i < len; i++) {
        const field = getApi(rootInstances[i], val.path(true), true)
        if (field !== val) {
          const instance = getApi(rootInstances[i], t.path(true))
          if (instance) {
            if (getVal(instance) === val) {
              instance.set(field, stamp)
            }
            instance._c = null
            instance._cLevel = null
            field._c = null
            field._cLevel = null
          }
        }
      }
    }
  }
}

export { resolveReferences, removeReference, reference, resolveFromValue }
