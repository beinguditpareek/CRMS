const express = require('express')
const { ServerConfig } = require('./src/config')
const cors = require('cors')
// const redis = require('./src/config/redis')

const { Utility} = require('./src/utils/common')
const  AdminRoutes  = require('./src/routes')
const app = express()            
const cookieParser = require("cookie-parser");
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: "http://localhost:5173", // frontend port
  credentials: true
}));
app.use(cookieParser()); 
app.use("/uploads", express.static("uploads"));

app.use('/',AdminRoutes)

  
Utility.redisFun()
// Utility.encryptedPassword('admin2')

app.listen(ServerConfig.PORT,()=>{
    console.log(`Server is running on port ${ServerConfig.PORT}`)
})

