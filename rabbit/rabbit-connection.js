const amqp = require('amqplib')

const connectToRabbitMQ = async () => {
  return amqp.connect('amqp://localhost')
}

module.exports = connectToRabbitMQ 