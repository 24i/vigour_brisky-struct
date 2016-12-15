import test from 'tape'
import subsTest from './util'

test('subscription - basic - root', t => {
  const s = subsTest(
    t,
    { field: true },
    { val: true }
  )
  s(
    'initial subscription',
    [{ type: 'new' }]
  )
  s(
    'update root',
    [ { type: 'update' } ],
    'hello'
  )
  t.end()
})

test('subscription - basic - root - 1', t => {
  const s = subsTest(
    t,
    { field: true },
    { val: 'property' }
  )
  s(
    'initial subscription',
    [{ type: 'new' }]
  )
  s(
    'update root',
    [],
    'hello'
  )
  t.end()
})

test('subscription - basic', t => {
  const s = subsTest(
    t,
    { field: true },
    {
      field: { val: true },
      other: { yuzi: { val: true } }
    }
  )

  s(
    'initial subscription',
    [{ path: 'field', type: 'new' }]
  )

  s(
    'update nested field',
    [ { path: 'other/yuzi', type: 'new' } ],
    { other: { yuzi: true } }
  )

  s(
    'remove field',
    [ { path: 'other/yuzi', type: 'remove' } ],
    { other: { yuzi: null } }
  )

  s(
    'reset yuzi',
    [ { path: 'other/yuzi', type: 'new' } ],
    { other: { yuzi: true } }
  )

  s(
    'remove other, no nested removal',
    [ { path: 'other/yuzi', type: 'remove' } ],
    { other: null }
  )

  t.end()
})

test('subscription - basic - nested removal', t => {
  const s = subsTest(
    t,
    { field: true, other: { yuzi: true } },
    {
      field: { val: true },
      other: { yuzi: { val: true } }
    }
  )
  s(
    'initial subscription',
    [
      { path: 'field', type: 'new' },
      { path: 'other/yuzi', type: 'new' }
    ]
  )
  s(
    'remove and nested removal',
    [
      { path: 'other/yuzi', type: 'remove' }
    ],
    { other: null }
  )
  t.end()
})
