const { get } = require('./get')
const { getDefinition } = require('./properties')
const { addKey, removeKey } = require('./keys')
var resolveContext, removeContextProperty, contextProperty

const create = (target, val, stamp) => {
  const instance = { inherits: target }
  if (target.instances !== false) {
    if (!target.instances) { target.instances = [] }
    target.instances.push(instance)
  }
  if (val !== void 0) { set(instance, val, stamp) }
  return instance
}

const set = (target, val, stamp) => {
  var changed
  if (target.context) {
    changed = resolveContext(target, val, stamp)
  } else {
    const type = typeof val
    if (type === 'object' && type !== 'function') {
      if (!val) {
        remove(target, stamp)
        changed = true
      } else {
        if (val.inherits) {
          changed = setVal(target, val)
        } else {
          for (let key in val) {
            if (key === 'val') {
              if (setVal(target, val.val)) { changed = true }
            } else if (property(target, key, val[key], stamp)) {
              changed = true
            }
          }
        }
      }
    } else if (val !== void 0) {
      changed = setVal(target, val)
    }
  }
  return changed
}

const setVal = (target, val) => {
  if (target.val !== val) {
    target.val = val
    return true
  }
}

const remove = (target, stamp) => {
  const parent = target.parent
  const key = target.key
  if (parent && key) {
    if (get(parent.inherits, key, true)) {
      removeContextProperty(parent, key)
    } else {
      removeKey(parent, key)
      delete parent[key]
    }
  }
  if (target.keys) {
    for (let i = 0; i < target.keys.length; i++) {
      // NESTED UPDATES
    }
  }
}

const property = (target, key, val, stamp) => {
  var changed
  const definition = getDefinition(target, key)
  if (definition) {
    changed = definition(target, val, key, stamp)
  } else {
    const result = get(target, key)
    if (result) {
      if (result.context) {
        changed = contextProperty(target, val, stamp, key, result)
      } else {
        changed = set(result, val, stamp)
      }
    } else {
      changed = true
      addKey(target, key)
      const result = create(get(target, 'child', true), val, stamp)
      result.key = key
      result.parent = target
      target[key] = result
    }
  }
  return changed
}

exports.set = set
exports.create = create
exports.property = property
const context = require('./context')
resolveContext = context.resolveContext
removeContextProperty = context.removeContextProperty
contextProperty = context.contextProperty
