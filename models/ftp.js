import ftp from 'basic-ftp'
import mimeTypes  from 'mime-types'

export class FtpModel {
  constructor ({ input }) {
    const {
      server,
      port,
      username,
      password
    } = input

    this.settings = {
      host: server,
      port: port,
      user: username,
      password: password,
      secure: false
    }

    this.client = new ftp.Client()
  }

  async connect() {
    try {
        await this.client.access(this.settings);
    } catch (e) {
      return {'message': e.message}
    }
    return true
  }

  async listFiles(directory = '/') {
    try {
        if(directory == '')
          directory = '/'
        return await this.client.list(directory)
    } catch (e) {
        console.error('Error al listar archivos:', e.message)
        return {'message': e.message}
    }
  }

  async rename(oldPath, newPath) {
    try {
        await this.client.rename(oldPath, newPath);
        console.log('Archivo/directorio renombrado exitosamente');
    } catch (e) {
        console.error('Error al renombrar archivo/directorio:', e.message);
        return {'message': e.message}
    }
  }

  async uploadFile(localFilePath, remoteDirectory = '/') {
      try {
          await this.client.uploadFrom(localFilePath, remoteDirectory)
          console.log('Archivo subido exitosamente')
      } catch (e) {
          console.log(e)
          console.error('Error al subir archivo:', e.message)
          return {'message': e.message}
      }
  }

  async downloadFile(remoteFilePath, res) {
    try {
        // Configurar los encabezados de la respuesta HTTP
        const mimeType = mimeTypes.lookup(remoteFilePath)
        res.setHeader('Content-type', mimeType)
        res.setHeader('Content-disposition', 'attachment; filename=' + remoteFilePath)

        // Descargar el archivo como un stream
        const stream = await this.client.downloadTo(res, remoteFilePath);
    } catch (e) {
        console.error('Error al descargar archivo:', e.message);
        return {'message': e.message};
    }
  }

  async createDirectory(directoryName) {
    try {
      await this.client.ensureDir(directoryName)
      console.log('Directorio creado exitosamente')
    } catch (e) {
      console.error('Error al crear directorio:', e.message)
      return {'message': e.message}
    }
    return true
  }

  async removeFile(filePath) {
    try {
        await this.client.remove(filePath);
        console.log('Archivo eliminado exitosamente');
    } catch (e) {
        console.error('Error al eliminar archivo:', e.message);
        return {'message': e.message}
    }
  }

  async removeDirectory(directoryPath) {
    try {
        await this.removeDirectoryRecursively(directoryPath);
        console.log('Directorio eliminado exitosamente');
    } catch (e) {
        console.error('Error al eliminar directorio:', e.message);
        return {'message': e.message}
    }
  }

  async removeDirectoryRecursively(directoryPath) {
      const list = await this.listFiles(directoryPath)
      for (const item of list) {
          const itemPath = directoryPath + '/' + item.name
          if (item.type === 'd') {
              // Si es un directorio, eliminar recursivamente
              await this.removeDirectoryRecursively(itemPath)
          } else {
              // Si es un archivo, eliminar
              await this.removeFile(itemPath)
          }
      }
      // Una vez que todos los archivos y subdirectorios han sido eliminados, 
      // eliminar el directorio actual
      await this.client.removeDir(directoryPath)
  }

  async disconnect() {
      try {
          this.client.close()
          console.log('Conexión cerrada exitosamente')
      } catch (e) {
          console.error('Error al cerrar conexión:', e.message)
          return {'message': e.message}
      }
  }
}
