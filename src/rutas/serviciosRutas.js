import express from 'express';
import passport from 'passport';
import ServiciosControlador from '../controladores/serviciosControlador.js';
import autorizarUsuarios from '../middlewares/autorizarUsuarios.js';
import { validarCampos } from '../middlewares/validarCampos.js';
import { cache, limpiarCache } from '../middlewares/cacheMiddleware.js';
import { validarServicio } from '../validaciones/serviciosValidaciones.js';

const controlador = new ServiciosControlador();
const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Servicios
 *   description: Operaciones relacionadas con la gestión de servicios adicionales
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
 *     ServicioResponse:
 *       type: object
 *       description: Estructura completa de un servicio (para respuestas)
 *       properties:
 *         servicio_id:
 *           type: integer
 *           example: 4
 *         descripcion:
 *           type: string
 *           example: "Servicio de animación infantil"
 *         importe:
 *           type: number
 *           format: float
 *           example: 12000.00
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
 *     ServicioCreate:
 *       type: object
 *       required:
 *         - descripcion
 *         - importe
 *       description: Datos requeridos para crear un nuevo servicio
 *       properties:
 *         descripcion:
 *           type: string
 *           example: "Servicio de catering"
 *         importe:
 *           type: number
 *           format: float
 *           example: 35000.00
 *
 *     ServicioUpdate:
 *       type: object
 *       description: Campos que pueden modificarse al actualizar un servicio
 *       properties:
 *         descripcion:
 *           type: string
 *           example: "Servicio de catering premium"
 *         importe:
 *           type: number
 *           format: float
 *           example: 42000.00
 */

/**
 * @swagger
 * /servicios:
 *   get:
 *     summary: Listar todos los servicios (con filtros opcionales)
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: importe_min
 *         schema:
 *           type: number
 *           format: float
 *           example: 10000
 *         description: Filtra servicios cuyo importe sea mayor o igual al valor indicado
 *       - in: query
 *         name: orden
 *         schema:
 *           type: string
 *           example: "servicio_id"
 *         description: Campo por el cual ordenar los resultados
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
 *         description: Número de página para la paginación
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Cantidad de resultados por página
 *     responses:
 *       200:
 *         description: Lista de servicios obtenida correctamente
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
 *                     $ref: '#/components/schemas/ServicioResponse'
 *       401:
 *         description: No autorizado o token inválido
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /servicios/{id}:
 *   get:
 *     summary: Obtener un servicio por su ID
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del servicio a buscar
 *         schema:
 *           type: integer
 *           example: 3
 *     responses:
 *       200:
 *         description: Servicio encontrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServicioResponse'
 *       404:
 *         description: Servicio no encontrado
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /servicios:
 *   post:
 *     summary: Crear un nuevo servicio (solo Admin o Empleado)
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ServicioCreate'
 *     responses:
 *       201:
 *         description: Servicio creado exitosamente
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
 *                   example: "Servicio creado exitosamente"
 *                 id:
 *                   type: integer
 *                   example: 8
 *       400:
 *         description: Error en los datos enviados
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error al crear servicio
 */

/**
 * @swagger
 * /servicios/{id}:
 *   put:
 *     summary: Actualizar un servicio existente (solo Admin o Empleado)
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del servicio a actualizar
 *         schema:
 *           type: integer
 *           example: 5
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ServicioUpdate'
 *     responses:
 *       200:
 *         description: Servicio actualizado correctamente
 *       404:
 *         description: Servicio no encontrado
 *       500:
 *         description: Error al actualizar servicio
 */

/**
 * @swagger
 * /servicios/{id}:
 *   delete:
 *     summary: Eliminar un servicio (solo Admin o Empleado)
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del servicio a eliminar
 *         schema:
 *           type: integer
 *           example: 6
 *     responses:
 *       200:
 *         description: Servicio eliminado correctamente
 *       404:
 *         description: Servicio no encontrado
 *       500:
 *         description: Error al eliminar servicio
 */










router.use(passport.authenticate('jwt', { session: false }));

router.get('/', autorizarUsuarios([1, 2, 3]), cache('30 minutes'), controlador.buscarTodos);
router.get('/:id', autorizarUsuarios([1, 2, 3]), cache('30 minutes'), controlador.buscarPorId);
router.post('/', autorizarUsuarios([1, 2]), validarServicio, validarCampos, limpiarCache, controlador.crear);
router.put('/:id', autorizarUsuarios([1, 2]), validarServicio, validarCampos, limpiarCache, controlador.actualizar);
router.delete('/:id', autorizarUsuarios([1, 2]), limpiarCache, controlador.eliminar);

export { router };