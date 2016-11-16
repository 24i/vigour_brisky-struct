const { get, getFn } = require('./get')
const { removeKey, getKeys } = require('./keys')
const { data, onData } = require('./emit')
const { listener } = require('./struct/listener')
const uid = require('./uid')

const remove = module.exports = (t, stamp, instance) => {
  if (t._async) { delete t._async }

  if (t.val && typeof t.val === 'object' && t.val.inherits) {
    listener(t.val.emitters.data, null, uid(t))
  }

  if (!instance && t.inherits.instances) {
    const instances = t.inherits.instances
    let i = instances.length
    while (i--) {
      if (instances[i] === t) { instances.splice(i, 1) }
    }
  }

  // previous val is important here
  // t.val == void 0 && instances dont do shit
  t.val = null

  const instances = t.instances
  if (instances) {
    let i = instances.length

    while (i--) {
      console.log('instance:', instances[i].key)
      remove(instances[i], stamp, true)
    }
    t.instances = null
  }

  if (stamp) {
    data(t, null, stamp) // no context?
    if (t._ks) {
      const keys = t._ks
      for (let i = 0, len = keys.length; i < len; i++) {
        if (keys[i] in t) {
          console.log('remove:', keys[i])
          remove(t[keys[i]], stamp)
          i--
          len--
        } else {
          removeContext(t, keys[i], stamp)
        }
      }
    } else {
      const keys = getKeys(t)
      if (keys) {
        for (let i = 0, len = keys.length; i < len; i++) {
          removeContext(t, keys[i], stamp)
        }
      }
    }
  } else if (t._ks) {
    const keys = t._ks
    for (let i = 0, len = keys.length; i < len; i++) {
      if (keys[i] in t) {
        console.log('remove:', keys[i])
        remove(t[keys[i]], stamp)
        i--
        len--
      }
    }
  }

  // need to cancel if from except in instances then need to check if it
  // can be optimized as well
  removeFromParent(t._p, t.key, stamp)
  // if (!from) { removeFromParent(t._p, t.key, stamp) }
}

const removeFromParent = (parent, key, stamp, instance) => {
  console.log('removeFromParent:', parent && parent.key, key)
  if (parent && key) {
    if (!instance || parent._ks) {
      removeKey(parent, key)
      if (instance) {
        if (key in parent) { delete parent[key] }
      } else {
        parent[key] = null
      }
    }
    if (stamp) { data(parent, null, stamp) }
    const instances = parent.instances
    if (instances) {
      let i = instances.length
      while (i--) {
        removeFromParent(instances[i], key, stamp, true)
      }
    }
  }
}

const removeContext = (context, key, stamp) => {
  const t = get(context, key)
  if (t) {
    const emitter = onData(t)
    if (emitter) {
      const listeners = getFn(emitter)
      if (listeners) {
        let i = listeners.length
        while (i--) { listeners[i](t, null, stamp) }
      }
    }
    const keys = getKeys(t)
    if (keys) {
      for (let i = 0, len = keys.length; i < len; i++) {
        removeContext(t, keys[i], stamp)
      }
    }
    t.context = null
    t.contextLevel = null
  }
}