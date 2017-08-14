// @flow

const { curry } = require('ramda')

function uncurriedFold(
  cb: (accumulator: mixed, currentValue: mixed, currentKey?: mixed) => mixed,
  inputMap: Map<*, *>,
  initialValue?: mixed = undefined
): mixed {
  if (typeof cb !== 'function') throw new Error(
      `Expected 1st argument in call to filter to be a function but received ${typeof cb}`
    )

  if (!initialValue) {
    const mapArr = [ ...inputMap ]
    const [ [ , first ] ] = mapArr
    const vType = typeof first
    const isConsistentType = mapArr.every((v: any) => typeof v[1] === vType)
    if (!isConsistentType) throw new Error('all types in Map must be the same')
    switch (vType) {
      case 'number':
        initialValue = 0
        break

      case 'function':
        initialValue = () => {}
        break

      case 'object':
        initialValue = Array.isArray(first) ? (first === null ? null : []) : {}
        break

      case 'string':
        initialValue = ''
        break

      case 'boolean':
        initialValue = false
        break

      default:
        break
    }
  }

  let result = initialValue

  for (const [ k, v ] of inputMap) {
    result = cb(result, v, k)
  }

  return result
}

const fold = curry(uncurriedFold)

module.exports = fold
