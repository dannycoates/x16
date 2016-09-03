const Experiment = require('./experiment')
const Variants = require('./variants')

module.exports = function (clientUUID) {
  const variants = new Variants(clientUUID)
  return new Experiment(variants)
}
