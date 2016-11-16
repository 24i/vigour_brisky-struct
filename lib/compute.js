const get = t => t.val !== void 0 ? t.val : t.inherits && get(t.inherits)

const origin = t => t.val && typeof t.val === 'object' && t.val.inherits ? origin(t.val) : t

const compute = (t, val, passon) => {
  if (val === void 0) {
    val = t.val
    if (val === void 0) { val = get(t.inherits) }
    if (val) {
      const type = typeof val
      if (type === 'object') {
        if (val.inherits) { val = compute(val) }
      } else if (type === 'function') {
        val = val(val, passon || t)
      }
    }
  }
  return t.$transform ? t.$transform(val, passon || t) : val
}

exports.origin = origin
exports.compute = compute
