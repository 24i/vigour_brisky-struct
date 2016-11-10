const test = require('tape')
const struct = require('../')
const stamp = require('brisky-stamp')

test('async', t => {
  const defer = (val, time = 5, err) =>
    new Promise((resolve, reject) =>
      setTimeout(() => err ? reject(err) : resolve(val), time)
    )

  const results = []
  const errors = []

  const a = struct({
    on: {
      data: {
        log: (t, val, stamp) => {
          results.push(stamp)
        }
      },
      error: {
        log: (t, err, stamp) => errors.push(err.message)
      }
    }
  })

  const s = stamp.create('click')

  // before coveralls support async/await need a solution for this
  // const later = async val => {
  //   val = await defer(val, 10) + '!'
  //   return val
  // }

  a.set(defer('later-1'), s)

  a.set(defer('defer-1'), s)

  a.set(defer('defer-2'), s)

  a.set(function* (t, stamp) {
    for (var i = 0; i < 3; i++) {
      yield defer('await-gen-' + i)
    }
  }, s)

  a.set(defer('defer-error', 0, new Error('haha')), s)

  a.set(function* logGenerator () {
    for (var i = 0; i < 3; i++) {
      yield defer('gen-' + i, 10)
    }
  }, s)

  a.set(defer({ val: 'defer-3', bla: { bla: defer() } }, 25), s)

  a.set(defer('defer-4'), s)

  a.set(defer('defer-5'), s)

  a.set(a.once('gen-1').then(() => defer('defer-6', 25)), s)

  a.set({ val: defer('defer-7'), hello: true }, s)

  a.once('defer-7').then(() => {
    t.pass('defer-7 is set')
    const s = stamp.create('move')
    a.set(function* logGenerator () {
      for (var i = 0; i < 3; i++) {
        yield defer('gen-2-' + i, 100)
      }
    }, s)
    a.set(defer('defer-8', 1e3), s)
    a.set(defer('defer-9', 1e3), s)
    a.set(defer('defer-10', 1e3), s)
    a.set(defer('defer-11', 1e3), s)
    a.set({ async: null, val: defer('defer-12') }, s)
    a.once('defer-12', () => {
      t.same(errors, [ 'haha' ], 'fired correct errors')
      t.same(results, [
        'click-1',
        'click-2',
        'click-3',
        'click-4',
        'click-5',
        'click-6',
        'click-7',
        'click-8',
        'click-9',
        'click-10',
        'click-11',
        'click-12',
        'click-13',
        'click-14',
        'click-15',
        'move-17'
      ], 'fired correct results')
      t.end()
    })
    stamp.close(s)
  })

  // context tests

  stamp.close(s)
})
