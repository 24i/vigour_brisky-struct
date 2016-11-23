const test = require('tape')
// const subsTest = require('../util')
const struct = require('../../../')

test('subscription - $transform - basic', t => {
  const s = struct({
    collection: {
      a: {
        x: 'hello'
      },
      b: {
        c: 'bye',
        d: 'HA!'
      }
    },
    qeury: 'hello'
  })

  const tree = s.subscribe({
    collection: {
      $any: {
        // this has to work differently in the transform unforutately
        $transform: (t, subs, tree) => {
          // fucked that the qeury ends up in diffing this one...
          return { x: { val: true } } // if parse parse results of functions // bit of a waste but fuck it -- make faster later
        },
        $transform2: {
          val: (t, subs, tree) => {
            const q = t.get('root').qeury.compute()
            if (q === t.get([ 'c', 'compute' ])) {
              return { c: { val: true }, d: { val: true } }
            } else if (q === 'unicorn') {
              return { unicorn: { val: true } }
            }
          },
          c: { val: true },
          root: {
            qeury: { val: true }
          }
        }
      }
    }
  }, (t, type) => {
    console.log('FIRE:', t.path(), type)
  })

  console.log(tree.collection.$any.b.$c)

  console.log(' \nchange query (add)')
  s.qeury.set('bye')

  console.log(' \nchange query (remove)')
  s.qeury.set('blax')

  console.log(' \nchange driver from self -- collection.b.c')
  s.collection.b.c.set('blax')

  console.log(' \nnon driver change -- collection.b.d')
  s.collection.b.d.set('blax')
  // console.log(' \nhaha broken!')
  // s.collection.b.c.set('yo qeury')

  console.log(' \ndriver switch -- qeury === pony')
  s.qeury.set('unicorn')
  // console.log(' \nhaha broken!')
  // s.collection.b.c.set('yo qeury')

  console.log(' \nadd pony')
  s.collection.b.set({
    unicorn: '🦄'
  })

  console.log(' \ndriver switch -- qeury === blurf')
  s.qeury.set('blurf')

  t.end()
})
