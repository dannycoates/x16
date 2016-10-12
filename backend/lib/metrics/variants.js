/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

// @flow

import seedrandom from 'seedrandom'

export type Variant = {
  weight: number,
  value: any
}

export default class Variants {
  clientUUID: string

  constructor (clientUUID: string) {
    this.clientUUID = clientUUID
  }

  makeTest (test: {name: string, variants: Array<Variant>}) {
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
  }

  parseTests (tests: Object) {
    const results = {}
    Object.keys(tests).forEach(key => {
      results[key] = this.makeTest(tests[key])
    })
    return results
  }
}
