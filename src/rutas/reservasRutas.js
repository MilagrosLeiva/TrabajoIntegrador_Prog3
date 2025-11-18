import express from "express";
import passport from "passport";
import ReservasControlador from "../controladores/reservasControlador.js";
import autorizarUsuarios from "../middlewares/autorizarUsuarios.js";
import { validarReserva } from "../validaciones/reservasValidaciones.js";
import { validarCampos } from "../middlewares/validarCampos.js";

const router = express.Router();
const controlador = new ReservasControlador();



/**
 * @swagger
 * tags:
 *   name: Reservas
 *   description: Operaciones relacionadas con la gestión de reservas de salones
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
 *     ReservaResponse:
 *       type: object
 *       description: Estructura de una reserva con todos sus datos (para respuestas)
 *       properties:
 *         reserva_id:
 *           type: integer
 *           example: 15
 *         fecha_reserva:
 *           type: string
 *           format: date
 *           example: "2025-12-15"
 *         salon_id:
 *           type: integer
 *           example: 3
 *         turno_id:
 *           type: integer
 *           example: 2
 *         foto_cumpleaniero:
 *           type: string
 *           nullable: true
 *           description: Cadena de texto simple (no archivo ni URL)
 *           example: "ninguno"
 *         tematica:
 *           type: string
 *           nullable: true
 *           example: "Frozen"
 *         importe_salon:
 *           type: number
 *           format: float
 *           example: 50000.00
 *         importe_total:
 *           type: number
 *           format: float
 *           example: 65000.00
 *         servicios:
 *           type: array
 *           description: Lista de servicios asociados a la reserva (solo lectura)
 *           items:
 *             type: object
 *             properties:
 *               servicio_id:
 *                 type: integer
 *                 example: 1
 *               servicio:
 *                 type: string
 *                 example: "Animación infantil"
 *               importe:
 *                 type: number
 *                 format: float
 *                 example: 12000.00
 *         usuario_id:
 *           type: integer
 *           readOnly: true
 *           description: ID del usuario que realizó la reserva (obtenido del token)
 *           example: 7
 *         creado:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *           description: Fecha de creación (generada automáticamente por la base de datos)
 *           example: "2025-11-05T14:35:00Z"
 *         modificado:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *           description: Última fecha de modificación (automática)
 *           example: "2025-11-06T10:22:00Z"
 *
 *     ReservaCreate:
 *       type: object
 *       required:
 *         - fecha_reserva
 *         - salon_id
 *         - turno_id
 *         - importe_salon
 *         - importe_total
 *       description: Datos requeridos para crear una nueva reserva
 *       properties:
 *         fecha_reserva:
 *           type: string
 *           format: date
 *           example: "2025-12-15"
 *         salon_id:
 *           type: integer
 *           example: 3
 *         turno_id:
 *           type: integer
 *           example: 2
 *         foto_cumpleaniero:
 *           type: string
 *           example: "ninguno"
 *         tematica:
 *           type: string
 *           example: "Toy Story"
 *         importe_salon:
 *           type: number
 *           format: float
 *           example: 50000.00
 *         importe_total:
 *           type: number
 *           format: float
 *           example: 65000.00
 *         servicios:
 *           type: array
 *           description: Lista opcional de servicios adicionales
 *           items:
 *             type: object
 *             properties:
 *               servicio_id:
 *                 type: integer
 *                 example: 1
 *               importe:
 *                 type: number
 *                 example: 12000.00
 *
 *     ReservaUpdate:
 *       type: object
 *       description: Campos permitidos para actualizar una reserva existente (sin servicios)
 *       properties:
 *         fecha_reserva:
 *           type: string
 *           format: date
 *           example: "2025-12-20"
 *         salon_id:
 *           type: integer
 *           example: 4
 *         turno_id:
 *           type: integer
 *           example: 1
 *         foto_cumpleaniero:
 *           type: string
 *           example: "ninguno"
 *         tematica:
 *           type: string
 *           example: "Cars"
 *         importe_salon:
 *           type: number
 *           format: float
 *           example: 52000.00
 *         importe_total:
 *           type: number
 *           format: float
 *           example: 67000.00
 */

/**
 * @swagger
 * /reservas:
 *   get:
 *     summary: Obtener reservas según el rol del usuario
 *     description: >
 *       - **Cliente (3)** → devuelve solo sus propias reservas.  
 *       - **Empleado (2) o Admin (1)** → devuelve todas las reservas activas.
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reservas filtrada según permisos del usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                 datos:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/ReservaResponse"
 *       401:
 *         description: Token inválido o ausente
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /reservas/{id}:
 *   get:
 *     summary: Obtener una reserva por su ID
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la reserva a buscar
 *         schema:
 *           type: integer
 *           example: 15
 *     responses:
 *       200:
 *         description: Reserva encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReservaResponse'
 *       404:
 *         description: Reserva no encontrada
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /reservas:
 *   post:
 *     summary: Crear una nueva reserva (Cliente o Admin)
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReservaCreate'
 *     responses:
 *       201:
 *         description: Reserva creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReservaResponse'
 *       400:
 *         description: Error en los datos de entrada
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /reservas/{id}:
 *   put:
 *     summary: Actualizar una reserva existente (solo Admin)
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la reserva a actualizar
 *         schema:
 *           type: integer
 *           example: 8
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReservaUpdate'
 *     responses:
 *       200:
 *         description: Reserva actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReservaResponse'
 *       404:
 *         description: Reserva no encontrada
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /reservas/{id}:
 *   delete:
 *     summary: Eliminar una reserva (solo Admin)
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la reserva a eliminar
 *         schema:
 *           type: integer
 *           example: 8
 *     responses:
 *       200:
 *         description: Reserva eliminada correctamente
 *       404:
 *         description: Reserva no encontrada
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /reservas/informe:
 *   get:
 *     summary: Generar informe de reservas en PDF o CSV
 *     description: >
 *       Genera un informe completo de reservas y lo devuelve en formato PDF o CSV.
 *       El formato debe enviarse mediante el query param `?formato=pdf` o `?formato=csv`.
 *       Solo los administradores pueden descargar informes.
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: formato
 *         required: true
 *         schema:
 *           type: string
 *           enum: [pdf, csv]
 *         description: Formato del informe a generar.
 *         example: pdf
 *     responses:
 *       200:
 *         description: Informe generado con éxito (archivo PDF o CSV)
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Formato inválido (usar ?formato=pdf o ?formato=csv)
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /reservas/estadisticas:
 *   get:
 *     summary: Obtener estadísticas mensuales de reservas
 *     description: >
 *       Devuelve un listado de meses con la cantidad de reservas activas y el total recaudado.
 *       *Solo accesible para Administradores*
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas generadas correctamente
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
 *                   example: "Estadísticas generadas correctamente"
 *                 datos:
 *                   type: array
 *                   description: Lista de estadísticas por mes
 *                   items:
 *                     type: object
 *                     properties:
 *                       mes:
 *                         type: string
 *                         example: "2025-12"
 *                       reservas_por_mes:
 *                         type: integer
 *                         example: 14
 *                       total_recaudado:
 *                         type: number
 *                         format: float
 *                         example: 65000.00
 *       401:
 *         description: No autorizado 
 *       500:
 *         description: Error interno del servidor
 */







router.use(passport.authenticate("jwt", { session: false }));





router.get("/", autorizarUsuarios([1, 2, 3]), controlador.listarSegunRol);
router.get("/informe", autorizarUsuarios([1]), controlador.informe);
router.get("/estadisticas", autorizarUsuarios([1]), controlador.estadisticas);
router.get("/:id", autorizarUsuarios([1, 2]), controlador.buscarPorId);
router.post("/", autorizarUsuarios([1, 3]), validarReserva, validarCampos, controlador.crear);
router.put('/:id', autorizarUsuarios([1]), validarReserva, validarCampos, controlador.actualizar);
router.delete("/:id", autorizarUsuarios([1]), controlador.eliminar);

export { router };