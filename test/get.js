const test = require('tape')
const struct = require('../')

test('get - defaults', t => {
  const a = struct()
  t.equal(a.get('x', false).val, false, 'string')
  t.equal(a.get([ 'a', 'b', 'c' ], 'hello').val, 'hello', 'array')
  t.equal(a.get([ 'a', 'b', 'd' ], 0).val, 0, 'array - falsy')
  t.end()
})

test('get - methods', t => {
  const a = struct({ a: { b: { c: true } } })
  t.equal(a.a.b.c.get('parent'), a.a.b, 'parent')
  t.end()
})
