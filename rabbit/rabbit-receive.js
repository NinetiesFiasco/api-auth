const amqp = require('amqplib/callback_api')

module.exports = function(queue, callback) {
  amqp.connect('amqp://localhost', function(err0, connection) {
    if (err0) throw err0

    connection.createChannel(function(err1, channel) {
      if (err1) throw err1

      channel.assertQueue(queue, {durable: false})

      console.log(` [x] Waiting for messages in ${queue}. To exit press CTRL+C`)

      channel.consume(queue, function(msg) {
        callback(msg)
      })
    })
  })
}