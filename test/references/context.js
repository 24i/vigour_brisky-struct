const test = require('tape')
const { create: struct } = require('../../')

test('references - serialized', t => {
  const a = struct({
    hello: true,
    bye: [ '@', 'root', 'hello' ],
    greeting: {
      val: [ '@', 'dutch' ],
      dutch: 'goede morgen'
    },
    vocabulary: [ '@', 'parent', 'greeting' ]
  })
  t.equal(a.bye.val, a.hello, 'create reference to root')
  t.equal(a.greeting.val, a.greeting.dutch, 'create reference to self')
  t.equal(a.vocabulary.val, a.greeting, 'create reference to parent')
  const b = struct({
    bla: {
      on: {
        data: {
          x () {
            t.pass('fires listener when making a new reference')
            t.end()
          }
        }
      }
    }
  })
  b.set({ x: [ '@', 'parent', 'bla', 'newthing' ] })
})

test('references - origin', t => {
  const master = struct({
    deep: {
      real: {
        field: 'is a thing'
      }
    },
    pointers: {
      pointer1: ['@', 'root', 'deep']
    }
  })

  const branch = master.create({
    deep: {
      real: {
        field: 'override'
      }
    }
  })

  console.log(branch.get('pointers', 'pointer1').origin())

  t.end()
})
