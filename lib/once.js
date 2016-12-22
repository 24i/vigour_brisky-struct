import { set } from './manipulate'
import { compute } from './compute'
import bs from 'brisky-stamp'
var uid = 0

export default (t, check, callback) => {
  var id = 'O' + ++uid
  if (!callback) {
    let promise
    if (check === void 0) {
      promise = new Promise(resolve => on(t, id, (t, val, stamp) => {
        resolve(t, val, stamp)
        return true
      }))
    } else {
      promise = new Promise(resolve => {
        if (!evaluate(resolve, check, t)) {
          on(t, id, (val, stamp, t) => evaluate(resolve, check, t, val, stamp, true))
        }
      })
    }
    return promise
  } else {
    if (check === void 0) {
      on(t, id, (val, stamp, t) => {
        callback(val, stamp, t)
        return true
      })
    } else {
      if (!evaluate(callback, check, t)) {
        on(t, id, (val, stamp, t) => evaluate(callback, check, t, val, stamp))
      }
    }
    return id
  }
}

const evaluate = (resolve, check, t, val, stamp, promise) => {
  if (typeof check === 'function'
      ? check(t, val, stamp)
      : compute(t) == check //eslint-disable-line
    ) {
    if (stamp && !promise) {
      bs.on(() => resolve(val, stamp, t))
    } else {
      resolve(val, stamp, t)
    }
    return true
  }
}

const on = (top, id, listener) => {
  const context = set(top, {
    on: {
      data: {
        [id]: (val, stamp, t) => {
          if (!t.context) {
            if (listener(val, stamp, t)) {
              set(t, { on: { data: { [id]: null } } })
            }
          }
        }
      }
    }
  })
  if (context && context.inherits) { top = context }
  return top
}
