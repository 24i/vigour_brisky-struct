const { get } = require('./get')
const { getKeys } = require('./keys')
const { path } = require('./traversal')
const getVal = t => t.val !== void 0 ? t.val : t.inherits && getVal(t.inherits)

const serialize = (t, fn) => {
  var result = {}
  var val = getVal(t)
  const keys = getKeys(t)
  if (val && typeof val === 'object' && val.inherits) {
    const p = path(val) // memoized paths later
    val = [ '@' ]
    let i = p.length
    while (i--) { val[i + 1] = p[i] }
  }
  if (keys) {
    for (let i = 0, len = keys.length; i < len; i++) {
      let key = keys[i]
      let keyResult = serialize(get(t, key), fn)
      if (keyResult !== void 0) { result[key] = keyResult }
    }
    if (val !== void 0) { result.val = val }
  } else if (val !== void 0) {
    result = val
  }
  return fn ? fn(t, result) : result
}

module.exports = serialize
