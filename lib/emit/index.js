import { getFn, getData } from '../get'
import { exec as context } from './context'
import subscription from './subscription'

const onGeneric = (t, key) => t.emitters && t.emitters[key] ||
  t.inherits && onGeneric(t.inherits, key)

const overrideSubscription = (t, override, stamp, isNew) => {
  t.stamp = override
  subscription(t, stamp)
  if (t._p && !isNew) {
    if (context(t, void 0, stamp, t._p, t.key, t, 1, 0)) {
      t.context = null
      t.contextLevel = null
    }
  }
}

const fn = (t, val, stamp, emitter) => {
  const listeners = getFn(emitter)
  if (listeners) {
    let i = listeners.length
    if (i && t._p) {
      if (context(t, val, stamp, t._p, t.key, t, 1, i, listeners)) {
        t.context = null
        t.contextLevel = null
      }
    }
    while (i--) { listeners[i](val, stamp, t) }
  } else {
    emitter.listeners = []
  }
}

const data = (t, val, stamp, override, isNew) => {
  // console.log(stamp[0])

  //  p.tStamp
  if (!t.stamp || t.stamp[0] !== stamp[0]) {
    t.stamp = override || stamp

    subscription(t, stamp)
    const own = t.emitters && t.emitters.data
    if (own) {
      const struct = own.struct
      fn(t, val, stamp, own)
      if (struct) {
        let i = struct.length
        while (i--) { updateStruct(struct[i], val, stamp, override) }
      }
    } else {
      const emitter = getData(t.inherits)
      if (emitter) {
        fn(t, val, stamp, emitter)
      } else {
        if (t._p && !isNew) {
          if (context(t, val, stamp, t._p, t.key, t, 1, 0)) {
            t.context = null
            t.contextLevel = null
          }
        }
      }
    }
  }
}

const updateStruct = (t, val, stamp, override) => {
  data(t, val, stamp, override)
  if (t.instances) {
    let i = t.instances.length
    while (i--) {
      if (t.instances[i].val === void 0) {
        updateStruct(t.instances[i], val, stamp, override)
      }
    }
  }
}

const generic = (t, type, val, stamp) => {
  if (type === 'data') {
    data(t, val, stamp)
  } else {
    const emitter = onGeneric(t, type)
    if (emitter) { fn(t, val, stamp, emitter) }
  }
}

export { data, generic, overrideSubscription }
