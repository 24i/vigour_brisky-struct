'use strict'
const { create, set, get, struct, compute } = require('../')
const bstamp = require('brisky-stamp')

const a = create(struct, {
  on: {
    data: {
      a: () => console.log('yes fire')
    }
  },
  bla: true
})

// 1 mil sets 60ms
console.log('go set!')
const s = bstamp.create()
set(a, 'bla', s)
bstamp.close(s)

// so only when new - need to handle change better
console.log(' \ndont fire parent')
const x = bstamp.create()
// maybe this is even nice behaveiour? -- meh no
set(a, { bla: 'bla' }, x)
bstamp.close(x)

const b = create(struct, {
  props: {
    default: {
      title: 'yo',
      props: { default: 'self' }
    }
  }
})

const c = create(b, {
  hello: {
    title: 'x'
  },
  yo: true
})

console.log(compute(get(c.hello, 'title')))
console.log(compute(get(c.yo, 'title')))
