import express from "express";
import passport from "passport";
import TurnosControlador from "../controladores/turnosControlador.js";
import autorizarUsuarios from "../middlewares/autorizarUsuarios.js";
import { validarCampos } from "../middlewares/validarCampos.js";
import { validarTurno } from "../validaciones/turnosValidaciones.js";
import { cache, limpiarCache } from "../middlewares/cacheMiddleware.js";

const controlador = new TurnosControlador();
const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Turnos
 *   description: Operaciones relacionadas con la gestión de turnos de reserva
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
 *     TurnoResponse:
 *       type: object
 *       description: Estructura completa de un turno (para respuestas)
 *       properties:
 *         turno_id:
 *           type: integer
 *           example: 3
 *         orden:
 *           type: integer
 *           description: Orden numérico del turno en el día
 *           example: 1
 *         hora_desde:
 *           type: string
 *           description: Hora de inicio (formato HH:MM, 24h)
 *           example: "10:00"
 *         hora_hasta:
 *           type: string
 *           description: Hora de fin (formato HH:MM, 24h)
 *           example: "14:00"
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
 *     TurnoCreate:
 *       type: object
 *       required:
 *         - orden
 *         - hora_desde
 *         - hora_hasta
 *       description: Datos requeridos para crear un nuevo turno
 *       properties:
 *         orden:
 *           type: integer
 *           example: 1
 *         hora_desde:
 *           type: string
 *           description: Hora de inicio del turno (formato HH:MM, 24h)
 *           example: "10:00"
 *         hora_hasta:
 *           type: string
 *           description: Hora de fin del turno (formato HH:MM, 24h)
 *           example: "14:00"
 *
 *     TurnoUpdate:
 *       type: object
 *       description: Campos que pueden modificarse al actualizar un turno
 *       properties:
 *         orden:
 *           type: integer
 *           example: 2
 *         hora_desde:
 *           type: string
 *           example: "14:00"
 *         hora_hasta:
 *           type: string
 *           example: "18:00"
 */

/**
 * @swagger
 * /turnos:
 *   get:
 *     summary: Listar todos los turnos disponibles
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de turnos obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 datos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TurnoResponse'
 *       401:
 *         description: No autorizado o token inválido
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /turnos/{id}:
 *   get:
 *     summary: Obtener un turno por su ID
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del turno a buscar
 *         schema:
 *           type: integer
 *           example: 3
 *     responses:
 *       200:
 *         description: Turno encontrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TurnoResponse'
 *       404:
 *         description: Turno no encontrado
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /turnos:
 *   post:
 *     summary: Crear un nuevo turno (solo Admin o Empleado)
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TurnoCreate'
 *     responses:
 *       201:
 *         description: Turno creado exitosamente
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
 *                   example: "Turno creado exitosamente"
 *                 id:
 *                   type: integer
 *                   example: 10
 *       400:
 *         description: Error en los datos enviados
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error al crear turno
 */

/**
 * @swagger
 * /turnos/{id}:
 *   put:
 *     summary: Actualizar un turno existente (solo Admin o Empleado)
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del turno a actualizar
 *         schema:
 *           type: integer
 *           example: 5
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TurnoUpdate'
 *     responses:
 *       200:
 *         description: Turno actualizado correctamente
 *       404:
 *         description: Turno no encontrado
 *       500:
 *         description: Error al actualizar turno
 */

/**
 * @swagger
 * /turnos/{id}:
 *   delete:
 *     summary: Eliminar un turno (solo Admin o Empleado)
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del turno a eliminar
 *         schema:
 *           type: integer
 *           example: 7
 *     responses:
 *       200:
 *         description: Turno eliminado correctamente
 *       404:
 *         description: Turno no encontrado
 *       500:
 *         description: Error al eliminar turno
 */










router.use(passport.authenticate("jwt", { session: false }));
router.get("/", autorizarUsuarios([1, 2, 3]), cache("30 minutes"), controlador.buscarTodos);
router.get("/:id", autorizarUsuarios([1, 2, 3]), cache("30 minutes"), controlador.buscarPorId);
router.post("/", autorizarUsuarios([1, 2]), validarTurno, validarCampos, limpiarCache, controlador.crear);
router.put("/:id", autorizarUsuarios([1, 2]), validarTurno, validarCampos, limpiarCache, controlador.actualizar);
router.delete("/:id", autorizarUsuarios([1, 2]), limpiarCache, controlador.eliminar);

export { router };