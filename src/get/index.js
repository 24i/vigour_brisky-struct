import { getRefVal } from '../references'

const get = (t, key, noContext) => {
  if (key in t) {
    const result = t[key]
    if (!noContext && result && result.inherits && key !== 'val') {
      if (t._c) {
        result._c = t._c
        result._cLevel = t._cLevel + 1
      } else if (result._c) {
        result._c = null
        result._cLevel = null
      }
    }
    return result
  } else if (t.inherits) {
    const result = get(t.inherits, key, true)
    if (!noContext && result && result.inherits && key !== 'val') {
      result._c = t
      result._cLevel = 1
    }
    return result
  }
}

const getOrigin = (t, key, noContext, context) => {
  if (t) {
    let result = get(t, key, noContext)
    if (result !== void 0 && result !== null) {
      return result
    } else if ((t = getRefVal(t, context)) && typeof t === 'object') {
      return t.inherits && getOrigin(t, key, noContext, context)
    }
  }
}

const getProps = t => t.props || getProps(t.inherits)

// if you removed it dont return...
const getData = t => t.emitters && t.emitters.data || t.inherits && getData(t.inherits)

// same here
const getFn = t => t.fn || t.inherits && getFn(t.inherits)

const getDefault = t => t.props && t.props.default.struct || getDefault(t.inherits)

const getVal = t => t.val !== void 0 ? t.val : t.inherits && getVal(t.inherits)

export { get, getDefault, getOrigin, getData, getFn, getVal, getProps }
