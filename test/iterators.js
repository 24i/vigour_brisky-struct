const test = require('tape')
const struct = require('../')

test('iterators', t => {
  const a = struct({ key: 1, a: 'a', b: 'b', c: 'c' })
  t.same(a.keys(), [ 'a', 'b', 'c' ], 'correct initial keys')
  const b = a.create({ key: 2, d: true, a: true })
  t.same(a.keys(), [ 'a', 'b', 'c' ], 'correct keys after creating an instance')

  console.log('go for it')
  a.set({ a: null, b: null })
  t.same(a.keys(), [ 'c' ], 'correct keys on "a" after remove')
  console.log(b._ks, b.keys())
  t.same(b.keys(), [ 'c', 'd' ], 'correct keys on "b" after remove')
  console.log(b.keys()) // only c and d
  b.get('c').set(null)
  t.same(b.keys(), [ 'd' ], 'correct keys on "b" after context remove')
  t.same(a.keys(), [ 'c' ], 'did not influence "a"')
  const c = b.create()
  c.get('d').set(null)
  t.same(c.keys(), [], 'correct keys on "c" after context remove')
  c.push('hello')
  t.same(c.keys().length, 1, 'push extra key')
  const d = struct({ a: 'a', b: 'b', c: 'c' })
  t.same(d.map(val => val), [ d.a, d.b, d.c ], 'map')
  t.same(d.filter(val => val.key === 'a'), [ d.a ], 'filter')
  t.equal(d.reduce((a, b) => a + b.compute(), ''), 'abc', 'reduce')
  const result = []
  d.forEach(val => {
    result.push(val)
  })
  t.same(d.map(val => val), [ d.a, d.b, d.c ], 'forEach')
  t.end()
})
