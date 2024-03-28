import cors from 'cors'

const ACCEPTED_ORIGINS = [
  'http://localhost:3001',
  'https://ftpligth-dev-jkpt.3.us-1.fl0.io',
  '*'
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
  origin: (origin, callback) => {
    if (acceptedOrigins.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
})
