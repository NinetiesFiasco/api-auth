const amqp = require('amqplib/callback_api')
const crypto = require('crypto')

module.exports = function(msg, callback) {
  amqp.connect('amqp://localhost', function(err0, connection) {
    if (err0) throw err0

    connection.createChannel(function(err1, channel) {
      if (err1) throw err1

      channel.assertQueue('', {exclusive: true}, function(err2, q) {
        if (err2) throw err2

        const correlationId = crypto.randomUUID()

        console.log(' [x] Requesting RPC')

        channel.consume(q.queue, function(msg) {
          if (msg.properties.correlationId === correlationId) {
            console.log(` [.] Got ${msg.content.toString()}`)
            callback(msg.content.toString())

            setTimeout(() => {
              connection.close()
            }, 500)
          }
        }, {noAck: true})

        channel.sendToQueue('rpc_queue', Buffer.from(msg), {
          correlationId,
          replyTo: q.queue 
        })
      })
    })
  })
}