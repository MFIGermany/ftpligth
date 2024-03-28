import { sessionMiddleware } from './middlewares/session.js'
import { corsMiddleware } from './middlewares/cors.js'
import cookieParser from 'cookie-parser'
import express, { json } from 'express'
import { createFtpRouter } from './routes/ftp.js'
import path from 'node:path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

import dotenv from 'dotenv'
dotenv.config({ path: './.env' })

export const createApp = () => {
  const app = express()
  app.use(json())
  app.use(sessionMiddleware())
  app.use(cookieParser())
  app.use(corsMiddleware())
  app.disable('x-powered-by')

  app.use(express.static(path.join(__dirname, './static/public')))
  
  app.set('views', path.join(__dirname, './static/views'))
  app.set("view engine", "ejs")

  app.use(express.urlencoded({extended: false}))

  app.use('/ftp', createFtpRouter())

  const PORT = process.env.PORT ?? 3000

  app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`)
  })
}

createApp()
