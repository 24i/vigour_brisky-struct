const { get, getFn } = require('./get')
const { removeKey, getKeys } = require('./keys')
const { data, onData } = require('./emit')
const { listener } = require('./struct/listener')
const uid = require('./uid')

const removeBody = (t, stamp) => {
  if (t._async) { delete t._async }
  if (t.val && typeof t.val === 'object' && t.val.inherits) {
    listener(t.val.emitters.data, null, uid(t))
  }
  if (t.inherits.instances) {
    const instances = t.inherits.instances
    let i = instances.length
    while (i--) { instances.splice(i, 1) }
  }

  // previous val is important here
  // t.val == void 0 && instances dont do shit
  t.val = null

  if (stamp) {
    data(t, null, stamp)
    if (t._ks) {
      const keys = t._ks
      for (let i = 0, len = keys.length; i < len; i++) {
        if (keys[i] in t) {
          removeBody(t[keys[i]], stamp)
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
  } else {
    if (t._ks) {
      const keys = t._ks
      for (let i = 0, len = keys.length; i < len; i++) {
        if (keys[i] in t) {
          removeBody(t[keys[i]], stamp)
        }
      }
    }
  }
}

const removeContext = (context, key, stamp) => {
  const t = get(context, key)
  if (t) {
    console.log('c:', t.key)
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
  }
}

const remove = (t, stamp) => {
  const parent = t._p
  const key = t.key
  removeBody(t, stamp)
  if (parent && key) {
    removeKey(parent, key)
    parent[key] = null
  }
}

module.exports = remove
