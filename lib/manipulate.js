import { data, override } from './emit'
import { listener } from './struct/listener'
import uid from './uid'
import instances from './instances'
import remove from './remove'

const create = (t, val, stamp, parent, key) => {
  var instance
  if (parent) {
    if (val && typeof val === 'object' && val.type) {
      t = getType(parent, val.type, t) || t
    }
    instance = new t.Constructor()
    instance._p = parent
    instance.inherits = t
    if (key !== void 0) {
      instance.key = key
      parent[key] = instance
    }
  } else {
    instance = new t.Constructor()
    instance.inherits = t
  }
  if (t.instances !== false) {
    if (!t.instances) {
      t.instances = [ instance ]
    } else {
      t.instances.push(instance)
    }
  }
  if (val !== void 0) {
    set(instance, val, stamp, true)
  }
  return instance
}

const stampObjects = (t, val, stamp, isNew) => {
  if (!stamp) { stamp = val.stamp }
  if (val.val === null) {
    return remove(t, stamp)
  } else {
    if (t.instances) {
      let changed
      for (let key in val) {
        if (key !== 'stamp') {
          if (
            key !== 'val'
              ? getProp(t, key)(t, val[key], key, stamp)
              : setVal(t, val.val, stamp, 1)
          ) {
            if (!changed) {
              changed = [ key ]
            } else {
              changed.push(key)
            }
          }
        }
      }
      if (changed) {
        if (stamp) { data(t, val, stamp, isNew) }
        instances(t, val, stamp, changed)
        return true
      } else if (stamp !== t.tStamp) {
        // may need to tighten security on this one
        override(t, val, stamp, isNew)
      }
    } else {
      let changed
      for (let key in val) {
        if (key !== 'stamp') {
          if (
            key !== 'val'
              ? getProp(t, key)(t, val[key], key, stamp)
              : setVal(t, val.val, stamp, 1)
          ) {
            changed = true
          }
        }
      }
      if (changed) {
        if (stamp) { data(t, val, stamp, isNew) }
        return true
      } else if (stamp !== t.tStamp) {
        // may need to tighten security on this one
        override(t, val, stamp, isNew)
      }
    }
  }
}

const objects = (t, val, stamp, isNew) => {
  if (val.stamp) {
    return stampObjects(t, val, stamp, isNew)
  } else if (t.instances) {
    let changed
    for (let key in val) {
      if (
        key !== 'val'
          ? getProp(t, key)(t, val[key], key, stamp)
          : setVal(t, val.val, stamp, 1)
      ) {
        if (!changed) {
          changed = [ key ]
        } else {
          changed.push(key)
        }
      }
    }
    if (changed) {
      if (stamp) { data(t, val, stamp, isNew) }
      instances(t, val, stamp, changed)
      return true
    }
  } else {
    let changed
    for (let key in val) {
      if (
        key !== 'val'
          ? getProp(t, key)(t, val[key], key, stamp)
          : setVal(t, val.val, stamp, 1)
      ) {
        changed = true
      }
    }
    if (changed) {
      if (stamp) { data(t, val, stamp, isNew) }
      return true
    }
  }
}

const set = (t, val, stamp, isNew) => {
  if (t.context) {
    return resolveContext(t, val, stamp)
  } else {
    const type = typeof val
    if (type === 'function') {
      if (isGeneratorFunction(val)) {
        generator(t, val, stamp)
      } else if (setVal(t, val, stamp)) {
        return isChanged(t, val, stamp, isNew)
      }
    } else if (type === 'object') {
      if (!val) {
        return remove(t, stamp)
      } else {
        if (val.inherits) {
          if (setVal(t, val, stamp, true)) {
            return isChanged(t, val, stamp, isNew)
          }
        } else if (val.then && typeof val.then === 'function') {
          promise(t, val, stamp)
        } else if (val.next && typeof val.next === 'function') {
          iterator(t, val, stamp)
        } else if (val[0] && val[0] === '@') {
          if (reference(t, val, stamp)) {
            return isChanged(t, val, stamp, isNew)
          }
        } else {
          return objects(t, val, stamp, isNew)
        }
      }
    } else if (setVal(t, val, stamp)) {
      return isChanged(t, val, stamp, isNew)
    }
  }
}

const isChanged = (t, val, stamp, isNew) => {
  if (stamp) { data(t, val, stamp, isNew) }
  if (t.instances) { instances(t, val, stamp, true) }
  return true
}

const getOnProp = t => t.props && t.props.on || getOnProp(t.inherits)

const onContext = (t, context) => {
  if (t.emitters) {
    if (context) {
      t.emitters.context = context
      t.emitters.contextLevel = 1
    }
  } else if (t.inherits) {
    onContext(t.inherits, context || t)
  }
}

const setVal = (t, val, stamp, ref) => {
  if (t.val !== val) {
    if (ref) {
      if (ref === 1) {
        if (typeof val === 'object') {
          if (!val.inherits) {
            if (val[0] && val[0] === '@') {
              return reference(t, val, stamp)
            } else {
              removeReference(t)
              if (val.then && typeof val.then === 'function') {
                promise(t, val, stamp)
                return
              } else if (val.next && typeof val.next === 'function') {
                iterator(t, val, stamp)
                return
              }
              t.val = val
              return true
            }
          }
        } else {
          removeReference(t)
          t.val = val
          return true
        }
      }
      removeReference(t)
      t.val = val
      if (val.emitters) {
        if (!val.emitters.data) {
          getOnProp(val)(val, { data: void 0 }, 'on')
        }
        listener(val.emitters.data, t, uid(t))
      } else {
        onContext(val)
        getOnProp(val)(val, { data: void 0 }, 'on')
        listener(val.emitters.data, t, uid(t))
      }
    } else {
      removeReference(t)
      t.val = val
    }
    return true
  }
}

const removeReference = t => {
  if (t.val && typeof t.val === 'object' && t.val.inherits) {
    listener(t.val.emitters.data, null, uid(t))
  }
}

const reference = (t, val, stamp) => set(t, getApi(t, val.slice(1), {}, stamp))

export { set, create }

// -- hack for recursive modules --
import { resolveContext } from './context'
import { getProp } from './property'
import { getType } from './struct/types'
import { promise, generator, isGeneratorFunction, iterator } from './async'
import getApi from './get/api'
