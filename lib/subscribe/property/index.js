const { diff } = require('../diff')
const remove = require('./remove')
const { getOrigin } = require('../../get')
const composite = require('./composite')

const update = (key, t, subs, cb, tree) => {
  var branch = tree[key]
  var changed
  if (t) {
    const stamp = t.tStamp || 0 // needs to use stamp as well (if dstamp is gone)
    if (!branch) {
      branch = tree[key] = { _p: tree, _key: key, $t: t }
      branch.$ = stamp
      if (subs.val) { cb(t, 'new', subs, branch) }
      diff(t, subs, cb, branch)
      changed = true
    } else if (branch.$ !== stamp || branch.$t !== t) {
      // this can of also be a switch
      branch.$t = t
      branch.$ = stamp
      if (subs.val === true) { cb(t, 'update', subs, branch) }
      diff(t, subs, cb, branch)
      changed = true
    } else if (branch.$c) {
      if (composite(t, subs, cb, branch, tree)) {
        changed = true
      }
      if (changed && subs.val === true) { cb(t, 'update', subs, branch) }
    }
  } else if (branch) {
    remove(subs, cb, branch)
    changed = true
  }
  return changed
}

const property = (key, t, subs, cb, tree, removed) => {
  var changed
  if (removed) {
    const branch = tree[key]
    if (branch) {
      remove(subs, cb, branch)
      changed = true
    }
  } else {
    changed = update(
      key,
      getOrigin(t, key),
      subs,
      cb,
      tree
    )
  }
  return changed
}

module.exports = property
