const test = require('tape')
const struct = require('../../')

test('subscription - parse', t => {
  const results = []
  const s = struct({
    a: true,
    b: true,
    c: true
  })
  s.subscribe({
    props: {
      any: { $any: true }
    },
    $transform: (t, subs) => {
      return subs.props.any
    },
    _: 'ha!'
  }, t => results.push(t.path()))
  t.same(results, [ [ 'a' ], [ 'b' ], [ 'c' ] ], 'parse')
  s.subscribe({ $any: true }, t => results.push(t.path()), true)
  t.same(results, [ [ 'a' ], [ 'b' ], [ 'c' ] ], 'does not parse when raw')
  t.end()
})
