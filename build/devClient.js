/* eslint-disable */
require('eventsource-polyfill')
// var hotClient = require('webpack-hot-middleware/client?noInfo=true&reload=true')
var hotClient = require('webpack-hot-middleware/client?noInfo=true')

hotClient.subscribe(function (event) {
//   if (event.action === 'reload') {
//     window.location.reload()
//   }
})
