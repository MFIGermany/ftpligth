import sessions from 'cookie-session'

// creating 1 hour from milliseconds
const oneHour = 1000 * 60 * 60 * 1;

const Params = {
    keySecret: "MyKeySecrets",
    timeExp: oneHour
}

export const sessionMiddleware = ({ params = Params } = {}) => sessions({
  secret: params.keySecret,
  saveUninitialized:true,
  cookie: { maxAge: params.timeExp },
  resave: false
})