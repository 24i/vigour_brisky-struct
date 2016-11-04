const test = require('tape')
const { create, set, get, struct, compute, parent } = require('../../')

test('context - extend', t => {
  const instance = create(struct, {
    parent: {
      child: {
        grandChild: 'rebel'
      }
    }
  })

  const extended = create(instance, {
    parent: {
      child: {
        grandChild: {
          age: 17
        }
      }
    }
  })

  console.log()

  t.equals(compute(get(instance, ['parent', 'child', 'grandChild'])), 'rebel', 'instance has primitive')
  t.equals(compute(get(instance, ['parent', 'child', 'grandChild'])), 'rebel', 'extended has primitive')
  t.notOk(get(instance, ['parent', 'child', 'grandChild', 'age']), 'instance does not have age')
  t.equals(compute(get(extended, ['parent', 'child', 'grandChild', 'age'])), 17, 'age of extended grandChild is 17')
  const grandChild = get(instance, ['parent', 'child', 'grandChild'])
  set(grandChild, { name: 'Berk' })

  t.equals(compute(get(instance, ['parent', 'child', 'grandChild', 'name'])), 'Berk', 'instance has name')
  t.equals(compute(get(grandChild, 'name')), 'Berk', 'assigned sub-struct has name')
  t.equals(compute(get(extended, ['parent', 'child', 'grandChild', 'name'])), 'Berk', 'extended has name')

  t.equals(parent(get(extended, ['parent', 'child', 'grandChild'])), get(extended, ['parent', 'child']), 'extended child is parent of extended grandChild')

  t.end()
})

test('context - props', t => {
  const female = create(struct, {
    gender: 'female'
  })

  const male = create(struct, {
    gender: 'male'
  })

  const students = create(struct, {
    props: {
      default: female
    },
    types: { female, male },
    first: {
      name: 'Burcu'
    },
    second: {
      name: 'Mert',
      type: 'male'
    }
  })

  t.equals(compute(get(students, ['first', 'gender'])), 'female', 'gender of Burcu is female')
  t.equals(get(students, ['first', 'gender']).context, get(students, 'first'), 'gender is in context')
  t.equals(get(students, ['first', 'gender']).contextLevel, 1, 'contextLevel is 1')
  t.equals(parent(get(students, ['first', 'gender'])), get(students, 'first'), 'parent of gender for Burcu is first')

  t.equals(compute(get(students, ['second', 'gender'])), 'male', 'gender of Mert is male')
  t.equals(get(students, ['second', 'gender']).context, get(students, 'second'), 'gender is in context')
  t.equals(get(students, ['second', 'gender']).contextLevel, 1, 'contextLevel is 1')
  t.equals(parent(get(students, ['second', 'gender'])), get(students, 'second'), 'parent of gender for Mert is second')

  set(students, { third: { name: 'Lale', type: 'female' } })
  t.equals(compute(get(students, ['third', 'gender'])), 'female', 'gender of Lale is female')
  t.equals(get(students, ['third', 'gender']).context, get(students, 'third'), 'gender is in context')
  t.equals(get(students, ['third', 'gender']).contextLevel, 1, 'contextLevel is 1')
  t.equals(parent(get(students, ['third', 'gender'])), get(students, 'third'), 'parent of gender for Lale is third')

  t.end()
})
