const express = require('express')
const axios = require('axios')
const {rpcClient} = require('./rabbit')

const app = express()
const port = 3501

app.get('/', (req, res) => {
  res.send('Hello World! Express 1')
})

app.get('/axios', async (req, res) => {
  const response = await axios.get('http://localhost:3500/express2/axios')
  res.send(`Let's work Express 1 + ${response.data} - worked!`)
})

app.get('/rabbit', async (req, res) => {
  const message = await rpcClient('Express 1 msg')
  res.send(message)
})

app.get('*', (req, res) => {
  res.send(req.url)
})

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`)
})