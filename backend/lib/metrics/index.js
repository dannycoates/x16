/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const Experiment = require('./experiment')
const Variants = require('./variants')

module.exports = function (clientUUID) {
  const variants = new Variants(clientUUID)
  return new Experiment(variants)
}