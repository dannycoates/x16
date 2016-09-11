/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const { Class } = require('sdk/core/heritage')
const seedrandom = require('seedrandom')

const Variants = Class({
  initialize: function (clientUUID) {
    this.clientUUID = clientUUID
  },
  makeTest: function (test) {
    let summedWeight = 0
    const variants = []
    test.variants.forEach(variant => {
      summedWeight += variant.weight
      for (let i = 0; i < variant.weight; i++) {
        variants.push(variant.value)
      }
    })
    const seed = `${test.name}_${this.clientUUID}`
    return variants[Math.floor(seedrandom(seed)() * summedWeight)]
  },
  parseTests: function (tests) {
    const results = {}
    Object.keys(tests).forEach(key => {
      results[key] = this.makeTest(tests[key])
    })
    return results
  }
})

module.exports = Variants
