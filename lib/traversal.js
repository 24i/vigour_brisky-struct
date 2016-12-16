// will combined lookup
const parent = t => {
  if (t.context) {
    if (t.contextLevel === 1) {
      return t.context
    } else {
      console.log('setting context :X')
      t._p.contextLevel = t.contextLevel - 1
      t._p.context = t.context
      return t._p
    }
  } else {
    return t._p
  }
}

const root = t => {
  var p = t
  while (p) {
    t = p
    p = parent(p)
  }
  return t
}

const path = (t, real) => {
  const result = []
  var parent = t
  while (parent) {
    if (parent.context && !real) {
      let i = parent.contextLevel
      let p = parent
      while (i--) {
        result.unshift(p.key)
        p = p._p
      }
      parent = parent.context
    } else if (parent.key) {
      result.unshift(parent.key)
      parent = parent._p
    } else {
      break
    }
  }
  return result
}

export { path, parent, root }
