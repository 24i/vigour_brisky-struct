const onData = t => t.on && t.on.data || t.inherits && onData(t.inherits)
const { getFn, getStruct } = require('./get')

// think about the copying

const updateContext = () => {

}

const data = (t, val, stamp) => {
  const emitters = onData(t)
  if (emitters) {
    const fn = getFn(emitters)
    const struct = getStruct(emitters)
    if (fn) {
      let i = fn.length
      while (--i > -1) { fn[i](t, val, stamp) }
    } else {
      emitters.fn = []
    }
    if (struct) {
      let i = struct.length
      while (--i > -1) { data(struct[i], val, stamp) }
    } else {
      emitters.struct = []
    }
  }
  if (t.instances && t.parent) {
    updateContext()
  }
}

const generic = (t, type, val, stamp) => {
  // rewrite type (helper)
  if (type === 'data') {
    data(t, val, stamp)
  } else {
    // do generic emit
  }
}

exports.data = data
exports.generic = generic
