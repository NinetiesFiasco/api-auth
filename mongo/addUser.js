const User = require('./scemeUser')

const addUser = async function() {
  const newUser = new User({
    username: 'JohnDoe',
    email: 'john@example.com',
  });

  try {
    await newUser.save() 
    return 'User saved to the database'
  } catch (err) {
    return `Issue with db: ${err}`
  }
}

module.exports = addUser