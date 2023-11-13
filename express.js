const express = require('express')
const axios = require('axios')
const {rpcClient} = require('./rabbit')
require('./mongo/connection')
const addUser = require('./mongo/addUser')
const send = require('./mail/send')

const app = express()
const PORT = process.env.PORT || 3501
const GATEWAY_URL = `http://gateway:${process.env.GATEWAY_URL}`

app.get('/', (req, res) => {
  console.log(req.headers)
  res.send(`Hello World! Express 1 ${process.env.NODE_ENV} Authenticated: ${req.headers['x-custom-isauthenticated']}`)
})

app.get('/mongo', async (req, res) => {
  const responsik = await addUser()
  res.send(responsik)
})

app.get('/mail', async (req, res) => {
  const message = await send()
  res.send(message)
})

app.get('/axios', async (req, res) => {
  const response = await axios.get(`${GATEWAY_URL}/express2/axios`)
  res.send(`Let's work Express 1 + ${response.data} - worked!`)
})

app.get('/rabbit', async (req, res) => {
  try {
    const message = await rpcClient('Express 1 msg')
    res.status(200).send(message)
  } catch (err) {
    res.status(500).send(err)
  }
})

app.get('*', (req, res) => {
  res.send(req.url)
})

app.listen(PORT, async () => {
  console.log(`Example app listening on port ${PORT} environment: ${process.env.NODE_ENV}`)
})