const dotenv = require('dotenv').config()
module.exports={
    PORT:process.env.PORT,
    SALT_ROUNDS:process.env.SALT_ROUNDS,
    JWT_SECRET:process.env.JWT_SECRET,
    JWT_EXPIRES_IN:process.env.JWT_EXPIRES_IN
}