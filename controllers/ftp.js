//import { validateFtp, validatePartialFtp } from '../schemas/ftp.js'
import { FtpModel } from '../models/ftp.js'
import fs from 'fs'

export class FtpController {
  static ftpClient

  constructor () {
    this.ftpClient = null
  }

  index = async (req, res) => {
    // Probando session
    if (!req.session.logged_in)
      res.render('login')
    else
      res.redirect('ftp/panel')
  }

  login = async (req, res) => {
    const data = req.body
    
    this.ftpClient = new FtpModel({ input: data });

    const result = await this.ftpClient.connect()
    
    if(result === true){
      req.session.logged_in = true
      req.session.user = data.username
      res.status(200).json({ result: 1, message: 'Conexión establecida con éxito' })
    }
    else{
      res.status(200).json({ result: 0, error: 'Credenciales incorrectas'})
    }
  }

  panel = async (req, res) => {
    if (!req.session.logged_in)
      res.redirect('/ftp')
    else{
      const data = {}
      data.arr_dirs = Array()
      // Obtener la URL base
      const baseUrl = `${req.protocol}://${req.get('host')}`
      data.baseUrl = baseUrl
      data.username = req.session.user

      let func = 'dir'
      let ftp_dir = '', new_dir = '', old_dir = '', old_file = '', new_file = '', select_file = ''
      if(req.body && Object.keys(req.body).length > 0){
        const input = req.body
        func = input.function
        if(input.new_dir)
          new_dir = input.new_dir
        if(input.ftp_dir)
          old_dir = input.ftp_dir
        if(input.old_file)
          old_file = input.old_file
        if(input.new_file)
          new_file = input.new_file        
        if(input.select_directory)
          ftp_dir = old_dir + '/' + input.select_directory
        else
          ftp_dir = old_dir
        if(input.select_file)
          select_file = ftp_dir + '/' + input.select_file
      }
      data.ftp_dir = ftp_dir

      switch (func){
        case 'dir':
        case 'cd':
        
        break
        case 'mkdir':
          let path_dir = ftp_dir + '/' + new_dir
          await this.ftpClient.createDirectory(path_dir)
        break
        case 'dropdir':
          await this.ftpClient.removeDirectory(ftp_dir)
          data.ftp_dir = old_dir
        break
        case 'drop':
          await this.ftpClient.removeFile(select_file)
        break
        case 'upd':
          let old_path = ftp_dir + '/' + old_file
			    let new_path = ftp_dir + '/' + new_file
          await this.ftpClient.rename(old_path, new_path)
        break
        case 'get':
          // console.log(select_file)
          await this.ftpClient.downloadFile(select_file, res)
        break
        case 'put':
          //console.log(req.files)
          for (let i = 0; i < req.files.length; i++) {
            let file = req.files[i]
            let remote_path = ftp_dir + '/' + file.originalname

            if (fs.existsSync(file.path)) {
              console.log(`El archivo ${file.originalname} existe`)
              await this.ftpClient.uploadFile(file.path, remote_path)
              // Eliminar del servidor
              await this.delete_file(file.path)
            }
            else {
              console.error(`El archivo ${file.originalname} no existe`)
            }
          }
        break
      }

      this.get_parts_dirs(data)
      await this.get_directories_files(data)

      res.render('panel', { data: data })
    }
  }

  delete_file = async (filePath) => {
    try {
        // Elimina el archivo del sistema de archivos local
        await fs.promises.unlink(filePath)
        console.log('Archivo eliminado exitosamente')
    } 
    catch (e) {
        console.error('Error al eliminar archivo:', e.message)
    }
  }

  get_parts_dirs = (data) => {
    let parts = data.ftp_dir.split('/')

    if(parts.length > 0){
      for (let i = parts.length; i >= 0; i--) {
        let tmp_cad = parts.slice(0, i).join('/')
        if (tmp_cad != '') 
          data.arr_dirs.push(tmp_cad)
      }

      // Elimino el ultimo elemento
      // y construyo la dir del subdir
      parts.pop()
      data.cdup = parts.join('/')
    }
    else{
      data.ftp_dir = '/'
      data.cdup = '/'
    }
  }

  get_directories_files = async (data) => {
    const list = await this.ftpClient.listFiles(data.ftp_dir)

    const [list_directories, list_files] = list.reduce((arr, el) => {
      if (el.type == 2) {
        // Agregar al primer arreglo
        arr[0].push(el.name)
      } else {
        // Agregar al segundo arreglo
        arr[1].push(el.name)
      }
      return arr;
    }, [[], []]);

    data.list_directories = list_directories
    data.list_files = list_files
  }

  logout = async (req, res) => {
    // Cerrar conexion FTP
    this.ftpClient.disconnect()
    // Cerrar session
    req.session = null
    // req.session.destroy()
    
    res.redirect('/ftp')
  }
}
