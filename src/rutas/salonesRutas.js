import express from 'express';
import passport from 'passport';
import SalonesControlador from '../controladores/salonesControlador.js';
import autorizarUsuarios from '../middlewares/autorizarUsuarios.js';
import { validarCampos } from '../middlewares/validarCampos.js'; 
import { cache, limpiarCache } from '../middlewares/cacheMiddleware.js';
import { validarSalon } from '../validaciones/salonesValidaciones.js';


const controlador = new SalonesControlador();
const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Salones
 *   description: Operaciones relacionadas con la gestión de salones de eventos
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     SalonResponse:
 *       type: object
 *       description: Estructura completa de un salón (para respuestas)
 *       properties:
 *         salon_id:
 *           type: integer
 *           example: 5
 *         titulo:
 *           type: string
 *           example: "Salón Luna Azul"
 *         direccion:
 *           type: string
 *           example: "Av. del Sol 1234, Paraná"
 *         latitud:
 *           type: number
 *           format: float
 *           example: -31.7324
 *         longitud:
 *           type: number
 *           format: float
 *           example: -60.5129
 *         capacidad:
 *           type: integer
 *           example: 120
 *         importe:
 *           type: number
 *           format: float
 *           example: 75000.00
 *         activo:
 *           type: boolean
 *           readOnly: true
 *           example: true
 *         creado:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *           example: "2025-11-05T14:35:00Z"
 *         modificado:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *           example: "2025-11-06T10:22:00Z"
 *
 *     SalonCreate:
 *       type: object
 *       required:
 *         - titulo
 *         - direccion
 *         - capacidad
 *         - importe
 *       description: Datos requeridos para crear un salón
 *       properties:
 *         titulo:
 *           type: string
 *           example: "Salón Estrella Dorada"
 *         direccion:
 *           type: string
 *           example: "Calle 9 N° 210, San Benito"
 *         latitud:
 *           type: number
 *           format: float
 *           nullable: true
 *           example: -31.7324
 *         longitud:
 *           type: number
 *           format: float
 *           nullable: true
 *           example: -60.5129
 *         capacidad:
 *           type: integer
 *           example: 80
 *         importe:
 *           type: number
 *           format: float
 *           example: 50000.00
 *
 *     SalonUpdate:
 *       type: object
 *       description: Campos que pueden modificarse al actualizar un salón
 *       properties:
 *         titulo:
 *           type: string
 *           example: "Salón Estrella Dorada Premium"
 *         direccion:
 *           type: string
 *           example: "Calle 9 N° 210, San Benito"
 *         latitud:
 *           type: number
 *           format: float
 *           example: -31.7325
 *         longitud:
 *           type: number
 *           format: float
 *           example: -60.5130
 *         capacidad:
 *           type: integer
 *           example: 100
 *         importe:
 *           type: number
 *           format: float
 *           example: 62000.00
 */

/**
 * @swagger
 * /salones:
 *   get:
 *     summary: Listar todos los salones (con filtros opcionales)
 *     tags: [Salones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: capacidad_min
 *         schema:
 *           type: integer
 *         description: Filtra salones con capacidad mínima
 *       - in: query
 *         name: orden
 *         schema:
 *           type: string
 *           example: "salon_id"
 *         description: Campo por el cual ordenar
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           example: "ASC"
 *         description: Tipo de orden (ascendente o descendente)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Número de página para paginación
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Cantidad de resultados por página
 *     responses:
 *       200:
 *         description: Lista de salones obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 total:
 *                   type: integer
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SalonResponse'
 *       401:
 *         description: No autorizado o token inválido
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /salones/{id}:
 *   get:
 *     summary: Obtener un salón por su ID
 *     tags: [Salones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del salón a buscar
 *         schema:
 *           type: integer
 *           example: 3
 *     responses:
 *       200:
 *         description: Salón encontrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SalonResponse'
 *       404:
 *         description: Salón no encontrado
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /salones:
 *   post:
 *     summary: Crear un nuevo salón (solo Admin o Empleado)
 *     tags: [Salones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SalonCreate'
 *     responses:
 *       201:
 *         description: Salón creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 mensaje:
 *                   type: string
 *                   example: "Salón creado exitosamente"
 *                 id:
 *                   type: integer
 *                   example: 10
 *       400:
 *         description: Error en los datos enviados
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error al crear salón
 */

/**
 * @swagger
 * /salones/{id}:
 *   put:
 *     summary: Actualizar un salón existente (solo Admin o Empleado)
 *     tags: [Salones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del salón a actualizar
 *         schema:
 *           type: integer
 *           example: 5
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SalonUpdate'
 *     responses:
 *       200:
 *         description: Salón actualizado correctamente
 *       404:
 *         description: Salón no encontrado
 *       500:
 *         description: Error al actualizar salón
 */

/**
 * @swagger
 * /salones/{id}:
 *   delete:
 *     summary: Eliminar un salón (solo Admin o Empleado)
 *     tags: [Salones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del salón a eliminar
 *         schema:
 *           type: integer
 *           example: 7
 *     responses:
 *       200:
 *         description: Salón eliminado correctamente
 *       404:
 *         description: Salón no encontrado
 *       500:
 *         description: Error al eliminar salón
 */














router.use(passport.authenticate('jwt', {session: false}));


router.get('/',autorizarUsuarios([1, 2, 3]),cache('30 minutes'), controlador.buscarTodos);
router.get('/:id',autorizarUsuarios([1, 2, 3]), cache('30 minutes'), controlador.buscarPorId);
router.post('/',autorizarUsuarios([1, 2]),validarSalon,validarCampos,limpiarCache, controlador.crear);
router.put('/:id',autorizarUsuarios([1, 2]),validarSalon,validarCampos,limpiarCache, controlador.actualizar);
router.delete('/:id',autorizarUsuarios([1, 2]),limpiarCache, controlador.eliminar);

export {router};