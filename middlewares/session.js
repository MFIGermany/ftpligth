import sessions from 'cookie-session'

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

const Params = {
    keySecret: "MyKeySecrets",
    timeExp: oneDay
}

export const sessionMiddleware = ({ params = Params } = {}) => sessions({
  secret: params.keySecret,
  saveUninitialized:true,
  cookie: { maxAge: params.timeExp },
  resave: false
})