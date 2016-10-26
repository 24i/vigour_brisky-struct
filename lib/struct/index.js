const { create } = require('../manipulate')
const { property } = require('../property')
const { types, type, getType } = require('./types')

const getProps = t => t.props || getProps(t.inherits)
const inject = require('./inject')

const props = {
  types,
  type,
  inject,
  instances: (t, val) => { t.instances = val },
  $transform: (t, val) => { t.$transform = val },
  props: (t, val, key, stamp) => {
    var props = t.props
    if (!props) {
      const previous = getProps(t)
      props = t.props = {}
      if (previous) {
        for (let key in previous) {
          props[key] = previous[key]
        }
      }
    }
    for (let key in val) {
      parse(t, val[key], key, stamp, props)
    }
  }
}

const simple = (t, val, key) => { t[key] = val }

const parse = (t, val, key, stamp, props) => {
  if (val === true) {
    props[key] = simple
  } else if (val === null) {
    if (props[key]) { delete props[key] }
  } else if (typeof val !== 'function') {
    // here you go want type here as well of course
    const child = val === 'self' ? t : create(props._struct, val, void 0, t)
    if (key === 'default') { props._struct = child }
    props[key] = (t, val, key, stamp) => property(t, val, key, stamp, child)
  } else {
    props[key] = val
  }
}

const struct = {}
props._struct = struct
struct.instances = false
struct.props = props
struct.types = { struct }

// this can be faster
// changing types is a thing as well of course
// but this can be done in the type property

// props.default = (t, val, key, stamp) => property(t, val, key, stamp, struct)

props.default = (t, val, key, stamp) => {
  if (val && typeof val === 'object' && val.type) {
    return property(t, val, key, stamp, getType(t, val.type))
  } else {
    return property(t, val, key, stamp, struct)
  }
}

parse(void 0, require('./on').on, 'on', void 0, props)

module.exports = struct
