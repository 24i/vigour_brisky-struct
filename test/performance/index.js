const perf = require('brisky-performance')
const struct = require('../../')
const Obs = require('vigour-observable')
const amount = 1e4

perf(() => {
  for (let i = 0; i < amount; i++) {
    struct({ on: { data: { log: () => {} } } })
  }
}, () => {
  for (let i = 0; i < amount; i++) {
    new Obs({ on: { data: { log: () => {} } } }) // eslint-disable-line
  }
}, 'create listeners')

perf(() => {
  const a = struct({ on: { data: { log: () => {} } } })
  for (let i = 0; i < amount * 100; i++) {
    a.set(i, i)
  }
}, () => {
  const a = new Obs({ on: { data: { log: () => {} } } })
  for (let i = 0; i < amount * 100; i++) {
    a.set(i)
  }
}, 'fire listeners')

perf(() => {
  const orig = struct({
    on: {
      data: {
        lol: () => {}
      }
    }
  })
  for (let i = 0; i < amount; i++) {
    let a = orig.create()
    struct(a)
  }
}, () => {
  const orig = new Obs({
    on: {
      data: {
        lol: () => {}
      }
    }
  })
  for (let i = 0; i < amount; i++) {
    let a = new orig.Constructor()
    new Obs(a) // eslint-disable-line
  }
}, 'create references')

perf(() => {
  const a = struct()
  struct({
    val: a,
    on: {
      data: {
        lol () {}
      }
    }
  })
  for (let i = 0; i < amount * 100; i++) {
    a.set(i, i)
  }
}, () => {
  const a = new Obs()
  new Obs({ // eslint-disable-line
    val: a,
    on: {
      data: {
        lol () {}
      }
    }
  })
  for (let i = 0; i < amount * 100; i++) {
    a.set(i)
  }
}, 'fire listeners over references')

perf(() => {
  for (let i = 0; i < amount; i++) {
    const a = struct({
      b: { c: { d: true } },
      on: {
        data: {
          lol () {}
        }
      }
    })
    a.set(null)
  }
}, () => {
  let a = new Obs()
  new Obs({ // eslint-disable-line
    val: a,
    on: {
      data: {
        lol () {}
      }
    }
  })
  for (let i = 0; i < amount * 100; i++) {
    a.set(i)
  }
}, 'remove')
