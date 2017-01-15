import { create, set } from '../manipulate'
import { getDefault, get } from '../get'
import { removeKey, addKey } from '../keys'
import { getProp } from '../property'
import { root } from '../traversal'
import { contextProperty } from '../context'

const inheritType = t => t.type || t.inherits && inheritType(t.inherits)

const extractListeners = (t, result) => {
  if (t.emitters && t.emitters.data) {
    if (!result) result = {}
    result.on = { data: {} }
    const data = result.on.data
    for (var key in t.emitters.data) {
      if (
        key !== 'inherits' &&
        key !== '_p' &&
        key !== 'key' &&
        key !== 'fn' &&
        key !== 'struct' &&
        t.emitters.data[key]
      ) {
        data[key] = t.emitters.data[key]
      }
    }
    return result
  }
}

const createSetObj = (t, top, instance) => {
  const result = {}
  const keys = t._ks
  if (t.type && !top) result.type = t.type.compute()
  extractListeners(t, result)
  if (keys) {
    for (let i = 0, len = keys.length; i < len; i++) {
      let key = keys[i]
      let field = t[key]
      if (field && (!instance || !instance.get(key))) {
        result[key] = createSetObj(field, false, instance && instance.get(key))
      }
    }
  }
  if (t.val !== void 0) result.val = t.val
  return result
}

const handleInstances = (t, a, stamp) => {
  const instances = t.instances
  t.instances = null
  const keys = t._ks
  if (keys) {
    for (let i = 0, len = keys.length; i < len; i++) {
      let key = keys[i]
      let tField = t[key]
      if (tField) {
        let aField = a[key]
        if (!aField) {
          set(tField, null, stamp)
          len--
          i--
        } else {
          handleInstances(tField, aField, stamp)
        }
      }
    }
  }
  if (instances) {
    a.instances = instances
    for (let i = 0, len = instances.length; i < len; i++) {
      let instance = instances[i]
      instance.inherits = a
      if ('_ks' in instance) {
        let newKeys = a.keys().concat()
        let keys = instance._ks || []
        instance._ks = newKeys
        for (let j = 0, len = newKeys.length; j < len; j++) {
          if (instance[newKeys[j]] === null && get(a, newKeys[j])) {
            removeKey(instance, newKeys[i])
          }
        }
        for (let j = 0, len = keys.length; j < len; j++) {
          if (instance[keys[j]]) newKeys.push(keys[j])
        }
        handleInstances(instance, instance, stamp)
      }
    }
  }
}

const merge = (t, type, stamp, reset) => {
  const result = getType(t._p, type, t) || getDefault(t._p)
  var instance
  if (t._ks || t.val !== void 0) {
    t.inherits = result
    const raw = !reset ? createSetObj(t, true) : void 0
    instance = create(result, raw, stamp, t._p, t.key)
    handleInstances(t, instance, stamp)
  } else {
    instance = create(result, extractListeners(t), stamp, t._p, t.key)
  }
  t._$p = t._p
  t._p = null
  set(t, null)
  return instance
}

const createType = (parent, val, t, stamp, key) => {
  const type = val.type
  const constructor = parent && getType(parent, type, t, stamp) || t
  const instance = new constructor.Constructor()
  instance.inherits = constructor
  if (constructor.instances !== false) {
    if (!constructor.instances) {
      constructor.instances = [ instance ]
    } else {
      constructor.instances.push(instance)
    }
  }
  if (key && t.key === key && !val.reset && (t._ks || t.val !== void 0)) {
    set(instance, createSetObj(t, true, instance), stamp)
  }
  return instance
}

const getType = (parent, type, t, stamp) => {
  if (typeof type === 'object') type = type.val
  var result = getTypeInternal(parent, type, t)
  if (!result) {
    parent = root(parent) // replace with fast traversal
    set(parent, { types: { [type]: {} } }, stamp)
    result = parent.types[type]
  }
  return result
}

const getTypeInternal = (parent, type, t) =>
  (!t || typeof type === 'string' || typeof type === 'number') &&
  (
    parent.types && get(parent.types, type) ||
    parent.inherits && getTypeInternal(parent.inherits, type) ||
    parent._p && getTypeInternal(parent._p, type)
  )

const type = (t, val, key, stamp, isNew, original) => {
  if (typeof val === 'object') {
    if (val.stamp && val.val) {
      stamp = val.stamp
      val = val.val
    }
    // else {
    //   // console.log(setting type with another struct (reference) is not supported yet', val)
    //   return
    // }
  }

  if (!isNew && t._p) {
    let type = t.type || inheritType(t)
    type = type && type.compute()
    if (type !== val) {
      t = merge(t, val, stamp, original.reset)
    }
  }

  if (t.type) {
    set(t.type, val, stamp)
  } else {
    t.type = create(getProp(t, key).struct, val, stamp, t, key)
  }
  return 2
}

const types = struct => {
  const types = (t, val, key, stamp) => {
    var changed
    if (!t.types) {
      const cntx = get(t, key)
      t.types = create(cntx || getProp(t, key).struct, void 0, stamp, t, key)
      if (!cntx) changed = 2
    }
    set(t.types, val, stamp)
    return changed
  }

  types.struct = create(struct, {
    instances: false,
    props: {
      default: (t, val, key, stamp, isNew) => {
        var changed
        const result = get(t, key)
        if (result) {
          if (result._c) {
            contextProperty(t, val, stamp, key, result)
          } else {
            set(result, val, stamp)
            changed = val === null
          }
        } else {
          addKey(t, key)
          if (val === 'self') {
            t[key] = t._p
          } else if (typeof val === 'object' && val.inherits) {
            t[key] = val
          } else {
            create(getDefault(t), val, stamp, t, key)
          }
          changed = true
        }
        return changed
      }
    }
  })
  types.struct.props.default.struct = type.struct = struct
  set(struct, { props: { type, types }, types: { struct } })
  struct.types._ks = void 0 // remove struct key
  struct.type = create(struct, 'struct')
}

export { types, createType, getType }
