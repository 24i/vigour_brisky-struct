const ms = require('monotonic-timestamp')
const { create, set } = require('./manipulate')
const { compute, origin } = require('./compute')
const { parent, root, path } = require('./traversal')
const { getKeys } = require('./keys')
const once = require('./once')
const struct = require('./struct')
const getApi = require('./get/api')
const { generic } = require('./emit')

const chain = (c, t) => c === null || c && c !== true ? c : t

set(struct, {
  inject: [
    require('./functional')
    // require('./debug')
  ],
  define: {
    parent () { return parent(this) },
    root () { return root(this) },
    emit (type, val, stamp) {
      generic(this, type, val, stamp)
      return this
    },
    once (check, callback) {
      return once(this, check, callback)
    },
    path () {
      return path(this)
    },
    set (val, stamp) {
      return chain(set(this, val, stamp), this)
    },
    create (val, stamp) {
      return create(this, val, stamp)
    },
    get (key, val, stamp) {
      return getApi(this, key, val, stamp)
    },
    compute (val) {
      return compute(this, val)
    },
    origin () {
      return origin(this)
    },
    keys () {
      return getKeys(this)
    },
    push (val, stamp) {
      const key = ms()
      return chain(set(this, { [key]: val }, stamp), this)[key]
    }
  }
})

module.exports = (val, stamp) => create(struct, val, stamp)
