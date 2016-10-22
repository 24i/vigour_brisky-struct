const get = (t, key, noContext) => {
  if (key in t) {
    const result = t[key]
    if (!noContext && result && result.inherits) {
      if (t.context) {
        result.context = t.context
        result.contextPath = typeof t.contextPath === 'object'
          ? t.contextPath.concat([ key ])
          : [ t.contextPath, key ]
      } else if (result.context) {
        delete result.context
        delete result.contextPath
      }
    }
    return result
  } else if (t.inherits) {
    const result = get(t.inherits, key, true)
    if (!noContext && result && result.inherits) {
      result.context = t
      result.contextPath = key
    }
    return result
  }
}

const helper = (t, key, val, noContext) => {
  if (typeof key === 'object') {
    for (let i = 0, len = key.length; t && i < len; i++) {
      t = get(t, key[i], noContext)
    }
    return t
  } else {
    return get(t, key, noContext)
  }
}

exports.helper = helper
exports.get = get
