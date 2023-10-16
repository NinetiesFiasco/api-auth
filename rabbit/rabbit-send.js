const amqp = require('amqplib/callback_api')

module.exports = function(queue, message) {
  amqp.connect('amqp://localhost', function(err0, connection) {
    if (err0) throw err0

    connection.createChannel(function(err1, channel) {
      if (err1) throw err1

      channel.assertQueue(queue, {durable: false})
      channel.sendToQueue(queue, Buffer.from(message))

      connection.close();
      console.log(` [x] Sent ${message}`)
      
    })
  })
}
