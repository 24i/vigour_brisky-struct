const test = require('tape')
const { create: struct } = require('../')

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

test('get - origin', t => {
  const a = struct({ c: true })
  const b = struct({ a: { b: a } })
  const c = struct(b)
  t.equal(c.get(['a', 'b', 'c']), a.c, 'references')
  t.end()
})

test('get - types', t => {
  const a = struct({
    types: {
      a: { x: true }
    }
  })
  t.equal(a.get(['types', 'a', 'x']), a.types.a.x, 'types')
  t.end()
})

test('get - context', t => {
  const a = struct({
    a: {
      b: {}
    }
  })
  const a2 = a.create({ key: 'A2' })
  a2.get(['a', 'b', 'c', 'd'], {})
  t.ok(a2.a.b.c.d !== void 0)

  t.end()
})
