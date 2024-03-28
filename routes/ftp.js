import { FtpController } from '../controllers/ftp.js'
import { Router } from 'express'
import multer from 'multer'

export const createFtpRouter = () => {
  const ftpRouter = Router()

  // Configura Multer para manejar la carga de archivos
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Define el directorio donde se guardarán los archivos
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Utiliza el nombre original del archivo proporcionado por el cliente
        cb(null, file.originalname);
    }
  })

  const upload = multer({ storage: storage })

  const ftpController = new FtpController()

  // Aqui van las llamadas a los metodos
  ftpRouter.get('/', ftpController.index)
  ftpRouter.get('/panel', ftpController.panel)
  ftpRouter.post('/panel', ftpController.panel)
  ftpRouter.get('/logout', ftpController.logout)
  ftpRouter.post('/login', ftpController.login)
  ftpRouter.post('/upload', upload.any(), ftpController.panel)

  return ftpRouter
}
