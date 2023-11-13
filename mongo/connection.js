const mongoose = require('mongoose')

const MONGO_URL = process.env.MONGO_URL;
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  user: MONGO_USER,
  pass: MONGO_PASSWORD
})

const db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.on('open', () => {
  console.log('Connected to MongoDB')
})