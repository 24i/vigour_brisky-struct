const perf = require('brisky-performance')
const struct = require('../../')
const base = require('brisky-base')
const Obs = require('vigour-observable')
const bstamp = require('brisky-stamp')
const amount = 1e5
const observ = require('observ')
console.log('PERF', amount / 1000, 'k')
var cnt = 0
var obscnt = 0
var observrCallCount = 0
var eeCount = 0

const { create } = require('../../')
const s = struct.struct

// perf(
//   function structitSingle () {
//     for (let i = 0; i < amount; i++) {
//       create(s, i)
//     }
//   },
//   function baseitSingle () {
//     for (let i = 0; i < amount; i++) {
//       base(i)
//     }
//   }
// )

// perf(
//   function instanceStruct () {
//     const a = struct.create(s, { x: true })
//     for (let i = 0; i < amount; i++) {
//       struct.create(a, { y: true })
//     }
//   },
//   function instanceBase () {
//     const a = base({ x: true })
//     for (let i = 0; i < amount; i++) {
//       new a.Constructor({ y: true }) // eslint-disable-line
//     }
//   }, 1, 1
// )

// perf(
//   function instanceStructProperties () {
//     const a = struct.create(s, {
//       x: true,
//       // instances: false,
//       props: {
//         bla (target, key, val, stamp) {

//         }
//       }
//     })
//     for (let i = 0; i < amount; i++) {
//       struct.create(a, {
//         y: true,
//         bla: true
//       })
//     }
//   },
//   function instanceBaseProperties () {
//     const a = base({
//       x: true,
//       // instances: false,
//       properties: {
//         bla (target, key, val, stamp) {

//         }
//       }
//     })
//     for (let i = 0; i < amount; i++) {
//       new a.Constructor({ // eslint-disable-line
//         y: true,
//         bla: true
//       })
//     }
//   }
// )

// perf(
//   function makeClassStruct () {
//     for (let i = 0; i < amount; i++) {
//       const a = struct.create(s, { x: true })
//       struct.create(a, { y: true })
//     }
//   },
//   function makeClassBase () {
//     for (let i = 0; i < amount; i++) {
//       const a = base({ x: true })
//       new a.Constructor({ y: true }) // eslint-disable-line
//     }
//   }
// )

// perf(
//   function instanceStructResolveContext () {
//     const a = struct.create(s, {
//       x: { y: { z: true } }
//     })
//     for (let i = 0; i < amount; i++) {
//       struct.create(a, { x: { y: { a: true } } })
//     }
//   },
//   function instanceBaseResolveContext () {
//     const a = base({
//       x: { y: { z: true } }
//     })
//     for (let i = 0; i < amount; i++) {
//       new a.Constructor({ // eslint-disable-line
//         x: { y: { a: true } }
//       })
//     }
//   }, 1
// )

// perf(
//   function instanceStructResolveContextFromEndPoint () {
//     const a = struct.create(s, {
//       x: { y: { z: true } }
//     })
//     for (let i = 0; i < amount; i++) {
//       const x = struct.create(a)
//       struct.set(struct.get(x, [ 'x', 'y', 'z' ]), 'hello')
//     }
//   },
//   function instanceBaseResolveContextFromEndPoint () {
//     const a = base({
//       x: { y: { z: true } }
//     })
//     for (let i = 0; i < amount; i++) {
//       const x = new a.Constructor()
//       x.x.y.z.set('hello')
//     }
//   }, 1, 1
// )

// perf(
//   function instanceStructResolveContextSingle () {
//     const a = struct.create(s, {
//       x: { y: { z: true } }
//     })
//     for (let i = 0; i < amount; i++) {
//       const x = struct.create(a)
//       struct.set(struct.get(x, 'x'), 'hello')
//     }
//   },
//   function instanceBaseResolveContextSingle () {
//     const a = base({
//       x: { y: { z: true } }
//     })
//     for (let i = 0; i < amount; i++) {
//       const x = new a.Constructor()
//       x.x.set('hello')
//     }
//   }, 1, 1
// )

// perf(
//   function simpleRemoveStruct () {
//     for (let i = 0; i < amount; i++) {
//       let x = struct.create(s, i)
//       // struct.set(x.x, null)
//       struct.set(x, null)
//     }
//   },
//   function simpleRemoveBase () {
//     for (let i = 0; i < amount; i++) {
//       let x = base(i)
//       x.remove()
//     }
//   }
// )

// perf(
//   function simpleRemoveFieldsStruct () {
//     for (let i = 0; i < amount; i++) {
//       let x = struct.create(s, { x: i })
//       // struct.set(x.x, null)
//       struct.set(x.x, null)
//     }
//   },
//   function simpleRemoveFieldsBase () {
//     for (let i = 0; i < amount; i++) {
//       let x = base({ x: i })
//       x.x.remove()
//     }
//   }, 1, 1
// )

// perf(
//   function simpleRemoveStructSet () {
//     for (let i = 0; i < amount; i++) {
//       let x = struct.create(s, { x: i })
//       struct.set(x, null)
//     }
//   },
//   function simpleRemoveBaseSet () {
//     for (let i = 0; i < amount; i++) {
//       let x = base({ x: i })
//       x.set(null)
//     }
//   }
// )

// perf(
//   function instanceStructResolveContextRemove () {
//     const a = struct.create(s, {
//       x: { y: { z: true } }
//     })
//     for (let i = 0; i < amount; i++) {
//       let x = struct.create(a, { x: { y: { z: null } } })
//     }
//   },
//   function instanceBaseResolveContextRemove () {
//     const a = base({
//       x: { y: { z: true } }
//     })
//     for (let i = 0; i < amount; i++) {
//       new a.Constructor({ // eslint-disable-line
//         x: { y: { a: null } }
//       })
//     }
//   }, 1, 1
// )

// perf(
//   function instanceStructResolveContextFromEndPointRenove () {
//     const a = struct.create(s, {
//       x: { y: { z: true } }
//     })
//     for (let i = 0; i < amount; i++) {
//       const x = struct.create(a)
//       struct.set(struct.get(x, [ 'x', 'y', 'z' ]), null)
//     }
//   },
//   function instanceBaseResolveContextFromEndPoint () {
//     const a = base({
//       x: { y: { z: true } }
//     })
//     for (let i = 0; i < amount; i++) {
//       const x = new a.Constructor()
//       x.x.y.z.set(null)
//     }
//   }, 1, 1
// )

// perf(
//   function computeStruct () {
//     let x = struct.create(s, { x: 100 })
//     let y = struct.create(s, {
//       val: x.x,
//       $transform: val => val * 3
//     })
//     let z = struct.create(s, { val: y })
//     for (let i = 0; i < amount; i++) {
//       struct.compute(z)
//     }
//   },
//   function computeObservable () {
//     const x = new Obs({ x: 100 })
//     const y = new Obs({
//       val: x.x,
//       $transform: val => val * 3
//     })
//     const z = new Obs({ y })
//     for (let i = 0; i < amount; i++) {
//       z.compute()
//     }
//   }, 1, 1
// )

// function listenersStruct () {
//   let x = struct.create(s, {
//     on: {
//       data: { a: t => { cnt++ } }
//     }
//   })
//   for (let i = 0; i < amount; i++) {
//     let s = bstamp.create()
//     struct.set(x, i, s)
//     bstamp.close(s)
//   }
// }

// const observr = observ(0)
// function emitObserv () {
//   observr(() => ++observrCallCount)
//   for (var i = 0; i < amount; i++) {
//     observr.set(i)
//   }
// }

// perf(
//   listenersStruct,
//   function listenerObs () {
//     const x = new Obs({
//       on: {
//         data: { a: t => { obscnt++ } }
//       }
//     })
//     for (let i = 0; i < amount; i++) {
//       x.set(i)
//     }
//   }
// )

// perf(
//   function createListenerStruct () {
//     for (let i = 0; i < amount; i++) {
//       struct.create(s, {
//         on: {
//           data: { a: t => {} }
//         }
//       })
//     }
//   },
//   function createListenerObs () {
//     for (let i = 0; i < amount; i++) {
//       new Obs({
//         on: {
//           data: { a: t => {} }
//         }
//       }, false)
//     }
//   }
// )

perf(
  function createListenerRefStruct () {
    const x = struct.create(s)
    for (let i = 0; i < amount; i++) {
      struct.create(s, x)
    }
  },
  function createRefObs () {
    // var x = new Obs()
    // for (let i = 0; i < amount; i++) {
    //   new Obs(x, false)
    // }
  }, 1, 25
)

// perf(
//   function createListenerRefStructNew () {
//     for (let i = 0; i < amount; i++) {
//       let x = struct.create(s)
//       // O
//       struct.create(s, x)
//     }
//   },
//   function createRefObsNew () {
//     for (let i = 0; i < amount; i++) {
//       let x = new Obs()
//       // O^2
//       new Obs(x, false)
//     }
//   }
// )

// perf(
//   function createListenerRefStructNewRemove () {
//     let x = struct.create(s)
//     for (let i = 0; i < amount; i++) {
//       let y = struct.create(s, x)
//       struct.set(y, null)
//     }
//   },
//   function createRefObsNewRemove () {
//     let x = new Obs()
//     for (let i = 0; i < amount; i++) {
//       let y = new Obs(x, false)
//       y.remove(false)
//     }
//   }
// )

// perf(
//   function createListenerRefStructNewRemoveDeep () {
//     let x = struct.create(s)
//     for (let i = 0; i < amount; i++) {
//       let y = struct.create(s, { x: x })
//       struct.set(y, null)
//     }
//   },
//   function createRefObsNewRemoveDeep () {
//     let x = new Obs()
//     for (let i = 0; i < amount; i++) {
//       let y = new Obs({ x: x }, false)
//       y.remove(false)
//     }
//   }
// )

// perf(
//   function createListenerRemoveDeep () {
//     for (let i = 0; i < amount; i++) {
//       var x = struct.create(s)
//       var y = struct.create(s, { x: x })
//       struct.set(x, null)
//     }
//     // prob need to clear the reference
//     // console.log(y.x.val) // maybe a good idea for extra speed
//   },
//   function createRefObsRemoveDeep () {
//     for (let i = 0; i < amount; i++) {
//       var x = new Obs()
//       var y = new Obs({ x: x }, false)
//       x.remove(false)
//     }
//     // console.log('obs:', y.x.val) // this a huge mem leak on removal of origina
//   }
// )

// const EventEmitter = require('events')
// function emitEE () {
//   const emitter = new EventEmitter()
//   emitter.on('data', () => { ++eeCount })
//   for (var i = 0; i < amount; i++) {
//     emitter.emit('data')
//   }
// }

// // perf(listenersStruct, emitObserv)
// // perf(listenersStruct, emitEE)

// const { emit } = require('../../')
// perf(function structEmitter () {
//   let x = struct.create(s, {
//     on: {
//       data: { a: t => { cnt++ } }
//     }
//   })
//   for (var i = 0; i < amount; i++) {
//     emit(x, 'data')
//   }
// }, emitEE)

// perf(
//   function listenersStructReference () {
//     let y = struct.create(s, {
//       on: {
//         data: { a: t => { cnt++ } }
//       }
//     })
//     let x = struct.create(s, {
//       on: {
//         data: { y: y } // uids are nessecary for this
//       }
//     })

//     for (let i = 0; i < amount; i++) {
//       let s = bstamp.create()
//       struct.set(x, i, s)
//       bstamp.close(s)
//     }
//   },
//   function listenerObsReference () {
//     const y = new Obs({
//       on: {
//         data: { a: t => { obscnt++ } }
//       }
//     })
//     const x = new Obs({
//       on: {
//         data: { a: y }
//       }
//     })
//     for (let i = 0; i < amount; i++) {
//       x.set(i)
//     }
//   }, 1
// )
