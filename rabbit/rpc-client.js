const amqp = require('amqplib')
const crypto = require('crypto')

const RABBIT_MQ_URL =  'amqp://rabbitmq'
const RPC_QUEUE = 'rpc_queue'

module.exports = async function(message) {
  const connection = await amqp.connect(RABBIT_MQ_URL)
  const channel = await connection.createChannel()
  
  const callbackQueue = await channel.assertQueue('', {exclusive: true})
  const correlationId = crypto.randomUUID()

  const responsePromise = new Promise((resolve) => {
    channel.consume(callbackQueue.queue, (msg) => {
      if (msg.properties.correlationId === correlationId) {
        resolve(msg.content.toString())
      }
    }, {noAck: true})
  })

  channel.sendToQueue(RPC_QUEUE, Buffer.from(message),{
    correlationId,
    replyTo: callbackQueue.queue
  })

  const response = await responsePromise;

  await channel.close()
  await connection.close()

  return response
}