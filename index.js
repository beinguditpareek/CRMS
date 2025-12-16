const express = require('express')
const { ServerConfig } = require('./src/config')
// const redis = require('./src/config/redis')

const { Utility} = require('./src/utils/common')
const  AdminRoutes  = require('./src/routes')
const app = express()

app.use(express.json())
app.use('/',AdminRoutes)

  
Utility.redisFun()
// Utility.encryptedPassword('555555555')

app.listen(ServerConfig.PORT,()=>{
    console.log(`Server is running on port ${ServerConfig.PORT}`)
})

