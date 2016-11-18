const test = require('tape')
const subsTest = require('../util')

test('subscription - references', t => {
  const s = subsTest(
    t,
    {
      field: {
        a: true,
        b: true
      },
      other: {
        a: true,
        b: true
      },
      ref: {
        val: [ '@', 'parent', 'field' ],
        b: true
      }
    },
    {
      ref: {
        $remove: true,
        a: { val: true },
        b: { val: true }
      }
    },
    true
  )

  s(
    'initial subscription',
    [
      { path: 'ref/b', type: 'new' },
      { path: 'field/a', type: 'new' }
    ]
  )

  s(
    'switch reference',
    [
      { path: 'other/a', type: 'update' }
    ],
    { ref: [ '@', 'parent', 'other' ] }
  )

  console.log('go remove!')
  s(
    'remove reference',
    [
      { path: 'other/a', type: 'remove' }
    ],
    { other: null }
  )

  // console.log(st)

  t.end()
})

// test('subscription - reference - basic', t => {
//   const s = subsTest(
//     t,
//     {
//       a: 'a',
//       b: { ref: [ '@', 'root', 'a' ] }
//     },
//     { b: { ref: { val: true } } }
//   )

//   s(
//     'initial subscription',
//     [{ path: 'b/ref', type: 'new' }]
//   )

//   s(
//     'referenced field origin',
//     [{ path: 'b/ref', type: 'update' }],
//     { a: 'a-update' }
//   )

//   t.end()
// })

// test('subscription - reference - double', t => {
//   const s = subsTest(
//     t,
//     {
//       a: 'a',
//       c: 'c',
//       b: { ref: [ '@', 'root', 'a' ] }
//     },
//     { b: { ref: { val: true } } } // this will not fire ofc
//   )

//   s(
//     'initial subscription',
//     [{ path: 'b/ref', type: 'new' }]
//   )

//   s(
//     'referenced field origin',
//     [{ path: 'b/ref', type: 'update' }],
//     { a: 'a-update' }
//   )

//   s(
//     'change reference',
//     [{ path: 'b/ref', type: 'update' }], // no listener since val:1
//     { b: { ref: [ '@', 'root', 'c' ] } }
//   )

//   s(
//     'change to primitve',
//     [{ path: 'b/ref', type: 'update' }],  // no listener since val:1
//     { b: { ref: 'hello' } }
//   )

//   s(
//     'change to primitve again',
//     [{ path: 'b/ref', type: 'update' }],
//     { b: { ref: 'bye' } }
//   )

//   t.end()
// })

// test('subscription - reference - nested', t => {
//   const s = subsTest(
//     t,
//     {
//       a: { b: { c: 'its a.b.c!' } },
//       b: { b: { x: 'its b.b.x!' } },
//       c: { b: { c: 'its c.b.c!' } },
//       ref: [ '@', 'parent', 'a' ]
//     },
//     {
//       ref: {
//         $remove: true,
//         b: {
//           $remove: true,
//           c: { val: true, $remove: true }
//         }
//       }
//     }
//   )

//   s(
//     'initial subscription',
//     [
//       { path: 'a/b/c', type: 'new' }
//     ]
//   )

//   s(
//     'switch reference',
//     [
//       { path: 'c/b/c', type: 'update' }
//     ],
//     { ref: [ '@', 'parent', 'c' ] }
//   )

//   console.log('go go go')
//   s(
//     'switch reference to excluding fields',
//     [
//       { path: 'b/b/x', type: 'new' },
//       { path: 'c/b/c', type: 'remove' }
//     ],
//     { ref: [ '@', 'parent', 'b' ] }
//   )

//   // also i would expect this to fire for b and c: { val: true }
//   // s(
//   //   'remove reference',
//   //   [
//   //     { type: 'remove' } // maybe a path ? :X
//   //   ],
//   //   { ref: false }
//   // )
//   t.end()
// })
