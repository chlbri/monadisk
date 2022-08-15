
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./monadisk.cjs.production.min.js')
} else {
  module.exports = require('./monadisk.cjs.development.js')
}
