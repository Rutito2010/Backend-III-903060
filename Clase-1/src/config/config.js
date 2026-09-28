import dotenv from "dotenv"

dotenv.config()

const requiredEnv = ["MONGODB_URI", "JWT_SECRET"]

requiredEnv.forEach((envVar)=>{
    if(!process.env[envVar]){
        throw new Error(`Falta configurar la variable : ${env}`)
    }
})

export const config={
    port: process.env.PORT || 8080,
    mongoUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    nodeEnv: process.env.NODE_ENV || "development"
}