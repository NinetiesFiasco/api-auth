const amqp = require('amqplib/callback_api')
const crypto = require('crypto')

module.exports = async function(msg, callback) {
  const connection = await amqp.connect('amqp://localhost')
  console.log(`Connection: ${connection}`) 
  const channel = await connection.createChannel()
  
  const q = await channel.assertQueue('', {exclusive: true})
  const correlationId = crypto.randomUUID()

  console.log(' [x] Requesting RPC')

  channel.consume(q.queue, function(msg) {
    if (msg.properties.correlationId === correlationId) {
      console.log(` [.] Got ${msg.content.toString()}`)
      callback(msg.content.toString())

      setTimeout(() => {
        connection.close() 
        process.exit(0)
      }, 500)
    }
  }, {noAck: true})

  channel.sendToQueue('rpc_queue', Buffer.from(msg), {
    correlationId,
    replyTo: q.queue 
  })  
}