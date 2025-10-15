# TrabajoIntegrador_Prog3
Api rest para la gestión de reservas de salones de cumpleaños.

# Estructura del archivo .env
PUERTO=3000

HOST=localhost

USER=usuario

DATABASE=nombre_bd

PASSWORD = constraseña

# Endpoints de salones 

GET http://localhost:3000/api/v1/salones         Lista los salones activos 

GET http://localhost:3000/api/v1/salones/:id     Obtiene un salon por id

POST http://localhost:3000/api/v1/salones        Crea un nuevo salon

PUT http://localhost:3000/api/v1/salones/:id     Actualiza un salon existente con el id que se pasa

DELETE http://localhost:3000/api/v1/salones/:id  Elimina un salon, soft delete. 

# Endpoints de servicios 
GET http://localhost:3000/api/v1/servicios         Lista los servicios activos 

GET http://localhost:3000/api/v1/servicios/:id     Obtiene un servicio por id

POST http://localhost:3000/api/v1/servicios        Crea un nuevo servicio

PUT http://localhost:3000/api/v1/servicios/:id     Actualiza un servicio existente con el id que se pasa

DELETE http://localhost:3000/api/v1/servicios/:id  Elimina un servicio, soft delete. 
