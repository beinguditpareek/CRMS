const bcrypt = require('bcrypt')
const redis = require('../../config/redis')
const jwt = require('jsonwebtoken')
const { ServerConfig } = require('../../config')

const encryptedPassword = async(plainPassword)=>{
console.log(bcrypt.hashSync(plainPassword,Number(ServerConfig.SALT_ROUNDS)))
}


const redisFun = async () => {
  
  await redis.set("name", "Udit");

  
  const name = await redis.get("name");
  console.log("Name:", name);


  await redis.set("otp:1", "123456", "EX", 10);

  const otp = await redis.get("otp:1");
  console.log("OTP:", otp);
};

const comparePassword = async(plainPassword,encryptedPassword)=>{
    const match = await bcrypt.compare(plainPassword,encryptedPassword)
    if(match) return true
    else return false
}

const generateJwtToken =(values)=>{
    return jwt.sign(values,ServerConfig.JWT_SECRET,{expiresIn: ServerConfig.JWT_EXPIRES_IN})
}

module.exports={
    encryptedPassword,
    redisFun,
    comparePassword,
    generateJwtToken
}