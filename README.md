# TrabajoIntegrador_Prog3
🎉Api rest para la gestión de reservas de salones de cumpleaños.🎉

El proyecto utiliza:
- **Node.js + Express**
- **MySQL**
- **JWT + Passport**
- **Swagger**
- **Multer** (subida de imágenes)
- **Puppeteer (PDF)**
- **csv-writer (CSV)**


#⚙️ **Estructura del archivo .env**

PUERTO=3000
HOST=localhost
USER=
DATABASE=
PASSWORD=
JWT_SECRET=
EMAIL_USER=
EMAIL_PASS=





# 🏠**Endpoints de salones**

GET http://localhost:3000/api/v1/salones         Lista los salones activos 

GET http://localhost:3000/api/v1/salones/:id     Obtiene un salon por id

POST http://localhost:3000/api/v1/salones        Crea un nuevo salon

PUT http://localhost:3000/api/v1/salones/:id     Actualiza un salon existente con el id que se pasa

DELETE http://localhost:3000/api/v1/salones/:id  Elimina un salon, soft delete. 




# 🧰**Endpoints de servicios**
GET http://localhost:3000/api/v1/servicios         Lista los servicios activos 

GET http://localhost:3000/api/v1/servicios/:id     Obtiene un servicio por id

POST http://localhost:3000/api/v1/servicios        Crea un nuevo servicio

PUT http://localhost:3000/api/v1/servicios/:id     Actualiza un servicio existente con el id que se pasa

DELETE http://localhost:3000/api/v1/servicios/:id  Elimina un servicio, soft delete. 



# 📅**Endpoints de reservas**
GET http://localhost:3000/api/v1/reservas        Obtener reservas

GET http://localhost:3000/api/v1/reservas/:id     Obtiene una reserva por id

POST http://localhost:3000/api/v1/reservas        Crea una reserva

PUT http://localhost:3000/api/v1/reservas/:id     Actualiza una reserva

DELETE http://localhost:3000/api/v1/reservas/:id  Elimina una  reserva, soft delete. 

GET http://localhost:3000/api/v1/reservas/informe?formato=csv  Genera un informe en CSV

GET http://localhost:3000/api/v1/reservas/informe?formato=pdf   Genera un informe en PDF

GET http://localhost:3000/api/v1/reservas/estadisticas   Genera una estadistica de reservas mediante procedimiento almacenado


# 🗝️**Endpoint de autenticacion**
POST http://localhost:3000/api/v1/auth/login        Me permite loguearme y obtener un token 


# 🕒**Endpoints de turnos**

GET http://localhost:3000/api/v1/turnos         Lista los turnos 

GET http://localhost:3000/api/v1/turnos/:id     Obtiene un turno por id

POST http://localhost:3000/api/v1/turnos        Crea un nuevo turno

PUT http://localhost:3000/api/v1/turnos/:id     Actualiza un turno existente con el id que se pasa

DELETE http://localhost:3000/api/v1/turnos/:id  Elimina un turno, soft delete. 


# 🧍‍♀️🧍‍♂️**Endpoints de usuarios**

GET http://localhost:3000/api/v1/usuarios         Lista los usuarios 

GET http://localhost:3000/api/v1/usuarios/:id     Obtiene un usuario por id

POST http://localhost:3000/api/v1/usuarios        Crea un nuevo usuario

PUT http://localhost:3000/api/v1/usuarios/:id     Actualiza un usuario existente con el id que se pasa

DELETE http://localhost:3000/api/v1/usuarios/:id  Elimina un usuario, soft delete. 

GET http://localhost:3000/api/v1/usuarios/clientes         Lista los usuarios tipo cliente.

PUT http://localhost:3000/api/v1/usuarios/modificarPerfil      Permite que un usuario autenticado actualice los datos de su perfil


# 📚**DOCUMENTACION COMPLETA**

La documentación con Swagger está en :

http://localhost:3000/api/v1/api-docs 


## 🌐**Vistas HTML incluidas**

Además de los endpoints del backend, el proyecto incorpora una pequeña interfaz en HTML dentro de la carpeta `public/`:

- **login.html** → Inicia sesión y genera el token JWT.
- **modificarPerfil.html** → Permite al usuario autenticado modificar sus datos y subir una foto nueva.
- **estadisticas.html** → Dashboard con gráficos (Chart.js) que consume `/reservas/estadisticas`.
- **informe.html** → Muestra opciones para descargar el informe de reservas en **PDF** o **CSV**.

Estas vistas sirven para probar el sistema fácilmente sin tener que usar herramientas externas como Postman o Bruno.



📦 Procedimientos almacenados

El proyecto utiliza procedimientos almacenados en MySQL para mejorar el rendimiento en operaciones de reportes y cálculos agregados. A continuación se describen los dos que usa el sistema:

### 📊 1. estadisticas_reservas

Genera estadísticas mensuales sobre las reservas activas.

Devuelve:

📅 mes (YYYY-MM)

🔢 reservas_por_mes

💰 total_recaudado

Este procedimiento es utilizado por el endpoint:

GET /api/v1/reservas/estadisticas



### 📝 2. reporte_csv — Informe detallado de reservas

Genera un listado completo de reservas activas, utilizado para exportar CSV y PDF desde el backend.
Incluye datos del cliente, salón, turno, temática e importes.

Devuelve:

📅 fecha_reserva (DD/MM/YYYY)

🏠 título del salón

⏰ turno (orden)

👤 cliente con nombre + apellido + ID

🎈 temática

💵 importe_salon

💰 importe_total

Este procedimiento es utilizado por los endpoints:

GET /api/v1/reservas/informe?formato=csv
GET /api/v1/reservas/informe?formato=pdf