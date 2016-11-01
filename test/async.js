const test = require('tape')
const { create, set, struct } = require('../')
const stamp = require('brisky-stamp')

test('async', t => {
  const defer = (val, time = 5, err) =>
    new Promise((resolve, reject) =>
      setTimeout(() => err ? reject(err) : resolve(val), time)
    )

  const results = []

  const a = create(struct, {
    on: {
      data: {
        log: (t, val, stamp) => {
          results.push(val)
          console.log(stamp, val)
        }
      },
      error: {
        log: (t, val, stamp) => console.log('ERROR', val, stamp)
      }
    }
  })

  const s = stamp.create('click')

  const later = async sayWhat => {
    await defer(1, 100)
    return sayWhat
  }

  set(a, later('later-1'), s)
  set(a, defer('defer-1'), s)
  set(a, defer('defer-2'), s)

  set(a, function* (t, stamp) {
    for (var i = 0; i < 3; i++) {
      yield later('await-gen-' + i)
    }
  }, s)

  set(a, defer('defer-error', 0, new Error('haha')), s)

  set(a, function* logGenerator () {
    for (var i = 0; i < 3; i++) {
      yield defer('gen-' + i, 100)
    }
  }, s)

  set(a, defer('defer-3', 500), s)
  set(a, defer('defer-4'), s)

  set({
    xxx: true,
    y: true,
    x: true
  })

  stamp.close(s)
})
