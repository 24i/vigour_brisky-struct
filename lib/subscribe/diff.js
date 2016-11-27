var property, any, root, parent, $switch

const diff = (t, subs, cb, tree, removed) => {
  var changed
  for (let key in subs) {
    if (key !== 'val' && key !== 'props' && key !== '_') { // key !== '$remove' this will become special
      if (parse(key, t, subs, cb, tree, removed)) {
        changed = true
      }
    }
  }
  return changed
}

const parse = (key, t, subs, cb, tree, removed) => {
  if (key === 'root') {
    return root(t, subs.root, cb, tree, removed)
  } else if (key === 'parent') {
    return parent(t, subs.parent, cb, tree, removed)
  } else if (key[0] === '$') {
    if (key === '$any') {
      return any(t, subs.$any, cb, tree, removed)
    } else if (key.indexOf('$switch') === 0) {
      return $switch(key, t, subs, cb, tree, removed)
    }
  } else {
    return property(key, t, subs[key], cb, tree, removed)
  }
}

exports.diff = diff
exports.parse = parse

property = require('./property').property
any = require('./any')
root = require('./root')
parent = require('./parent')
$switch = require('./switch')
