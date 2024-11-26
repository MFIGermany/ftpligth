# FTP Web Online - Gestor FTP en Node.js
Este proyecto es un servidor web que funciona como un **manejador FTP** online, similar a **FileZilla**. 
Permite subir, editar, eliminar y descargar archivos o directorios desde un servidor FTP mediante una interfaz web.

### Características
- Conectar y gestionar archivos en un servidor FTP.
- Subir, editar, eliminar y descargar ficheros o crear y eliminar directorios.
- Acceso remoto vía navegador a través de una interfaz web.

### Instalación

**Clona el repositorio:**
git clone <URL-del-repositorio>
cd <directorio-del-repositorio>
   
Instala nodejs y sus dependencias:
Este proyecto está basado en Node.js, por lo que debes tener nodejs y npm instalados

Asegúrate de tener configurado el puerto por el que va a correr el proyecto en el archivo .env

Ejecuta el servidor:
Una vez que hayas instalado las dependencias y configurado las variables de entorno, ejecuta el servidor con el siguiente comando:

npm run dev
El servidor se ejecutará en http://localhost:3002 de forma predeterminada, o el puerto que definas en el archivo .env
Coloca la direccion completa en el navegador: 
http://localhost:3002/ftp

Si no quiere o no puedes probarlo de manera local, puedes acceder a la URL:
https://ftpligth-production.up.railway.app/ftp

DATOS DE PRUEBA DE UN SERVIDOR FTP
----------------------------------
Servidor FTP: ftp.dlptest.com
Usuario: dlpuser
Contraseña: rNrKYTX9g7z3RgJRmxWuGHbeu
