const { diff } = require('./diff')
const remove = require('./property/remove')
const { update } = require('./property')

const driver = (t, type) => {}

const driverChange = (key, tkey, t, subs, cb, tree, removed) => {
  const branch = tree[key]
  if (diff(t, subs, driver, branch, removed)) {
    return body(tkey, t, subs, cb, tree, removed, subs.val, false)
  }
}

const $switch = (key, t, subs, cb, tree, removed) => {
  var $switch = subs[key]
  if (!$switch) {
    let tkey = key.slice(0, -1) // this means from composite
    driverChange(key, tkey, t, subs[tkey], cb, tree, removed)
  } else {
    if ($switch.val) {
      let dKey = key + '*'
      let driverBranch = tree[dKey]
      if (driverBranch) {
        if (diff(t, $switch, driver, driverBranch, removed)) {
          return body(key, t, subs, cb, tree, removed, $switch.val, true)
        } else {
          const branch = tree[key]
          if (branch) { update(key, t, branch.$subs, cb, tree, removed) }
        }
      } else if (!driverBranch) {
        create(dKey, t, $switch, driver, tree)
        return body(key, t, subs, cb, tree, removed, $switch.val, true)
      }
    } else {
      return body(key, t, subs, cb, tree, removed, $switch, true)
    }
  }
}

const create = (key, t, subs, cb, tree) => {
  const branch = tree[key] = { _p: tree, _key: key, $subs: subs }
  return diff(t, subs, cb, branch)
}

const body = (key, t, subs, cb, tree, removed, $switch, diffit) => {
  var result
  if (!removed && t) { result = $switch(t, subs, tree, key) }
  var branch = tree[key]
  if (!result) {
    if (branch) {
      remove(branch.$subs, cb, branch)
      return true
    }
  } else {
    if (!branch) {
      update(key, t, result, cb, tree)
      tree[key].$subs = result
      return true
    } else if (isSwitched(branch.$subs, result)) {
      remove(branch.$subs, cb, branch)
      update(key, t, result, cb, tree)
      tree[key].$subs = result
      return true
    } else if (diffit) {
      return update(key, t, result, cb, tree, removed)
    }
  }
}

const isSwitched = (a, b) => {
  if (a === b) {
    return false // test
  } else {
    if (a._) {
      return a._ !== b._
    }
    for (let key in a) {
      if (a[key] !== b[key]) {
        if (typeof a[key] === 'function' && typeof b[key] === 'function') {
          if (a[key].toString() !== b[key].toString()) {
            return true
          }
        } else if (typeof a[key] !== 'object' || typeof b[key] !== 'object' || isSwitched(a[key], b[key])) {
          return true
        }
      }
    }
    for (let key in b) {
      if (key !== 'props' && !a[key]) { return true }
    }
  }
}

module.exports = $switch
