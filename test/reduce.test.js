// @flow

const { expect } = require('chai')
const sinon = require('sinon')

const reduce = require('../lib/fold')

const { describe, it } = global
describe('fold()', () => {
  it('Should import fold as a function', () => {
    expect(reduce).to.be.an.instanceof(Function)
  })

  it('Should throw error if cb not a function', () => {
    expect(() => reduce('hello', new Map())).to.throw()
    expect(() => reduce(2, new Map())).to.throw()
    expect(() => reduce([ 1, 2, 3 ], new Map())).to.throw()
    expect(() => reduce({ foo: 1, bar: 2, baz: 'quix' }, new Map())).to.throw()
  })

  it('Should initialize result if initalValue', () => {
    const cb = sinon.spy()
    const result = reduce(cb, new Map(), 5)
    expect(result).to.equal(5)
  })

  it('Should call cb for each key/value pair', () => {
    const cb = sinon.spy()
    const myMap = new Map([ [ 'foo', 5 ], [ { bar: 5 }, 3 ], [ () => {}, 7 ] ])
    reduce(cb, myMap)
    expect(cb.callCount).to.equal(3)
  })

  it('Should return correct result when working with numbers', () => {
    const myMap = new Map([ [ 'foo', 5 ], [ 'bar', 3 ], [ 'baz', 10 ] ])
    const result = reduce((a, v) => (a += v), myMap, 5)
    expect(result).to.equal(23)
  })

  it('Should return correct result when working with an object', () => {
    const myMap = new Map([ [ 'foo', 5 ], [ 'bar', 3 ], [ 'baz', 10 ] ])
    const cb = (a, v, k) => {
      a[k] = v
      return a
    }
    const result = reduce(cb, myMap, {})
    expect(result).to.eql({ foo: 5, bar: 3, baz: 10 })
  })

  it('Should return function when partially applied', () => {
    expect(reduce(sinon.spy())).to.be.an.instanceof(Function)
    const myMap = new Map([ [ 'foo', 5 ], [ 'bar', 3 ], [ 'baz', 10 ] ])
    const result = reduce((a, v) => (a += v), myMap)
    expect(result).to.equal(18)
  })

  it('Should set initialValue to empty version of passed in datatype', () => {
    const myMap = new Map([ [ 'foo', 5 ], [ 'bar', 3 ], [ 'baz', 10 ] ])
    expect(reduce((a, v) => (a += v), myMap)).to.equal(18)
    const myMap2 = new Map([ [ 'foo', '5' ], [ 'bar', '3' ], [ 'baz', '10' ] ])
    expect(reduce((a, v) => (a += v), myMap2)).to.equal('5310')
  })
})