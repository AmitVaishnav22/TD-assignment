import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:'16kb'}))
app.use(express.urlencoded({extended:true,limit:'16kb'}))
app.use(express.static("public"))
app.use(cookieParser()) 


import saveProgressRoutes from "./routes/saving.routes.js"
import getProgressRoutes from "./routes/tracking.routes.js"

app.use("/api/v1/", saveProgressRoutes)
app.use("/api/v1/", getProgressRoutes)

export {app}