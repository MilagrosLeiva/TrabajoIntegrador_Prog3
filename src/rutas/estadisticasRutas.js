import express from "express";
import passport from "passport";
import autorizarUsuarios from "../middlewares/autorizarUsuarios.js";
import EstadisticasServicio from "../servicios/estadisticasServicio.js";

    const router = express.Router();
    const servicio = new EstadisticasServicio();





    

/**
 * @swagger
 * tags:
 *   name: Estadísticas
 *   description: Endpoints para consultar estadísticas mensuales de reservas
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
 *     EstadisticaMensual:
 *       type: object
 *       description: Estadísticas mensuales obtenidas del procedimiento almacenado
 *       properties:
 *         mes:
 *           type: string
 *           description: Mes de la estadística en formato YYYY-MM
 *           example: "2025-10"
 *         total_reservas:
 *           type: integer
 *           description: Total de reservas registradas en el mes
 *           example: 15
 *         reservas_activas:
 *           type: integer
 *           description: Cantidad de reservas activas en el mes
 *           example: 12
 *         reservas_por_mes:
 *           type: integer
 *           description: Número total de reservas agrupadas por mes
 *           example: 15
 *         total_recaudado:
 *           type: number
 *           format: float
 *           description: Monto total recaudado en el mes
 *           example: 125000.50
 *
 *     EstadisticasResponse:
 *       type: object
 *       properties:
 *         estado:
 *           type: boolean
 *           example: true
 *         mensaje:
 *           type: string
 *           example: "Estadísticas generadas correctamente"
 *         datos:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/EstadisticaMensual'
 *
 *     EstadisticasError:
 *       type: object
 *       properties:
 *         estado:
 *           type: boolean
 *           example: false
 *         mensaje:
 *           type: string
 *           example: "Error al generar estadísticas"
 */

/**
 * @swagger
 * /estadisticas:
 *   get:
 *     summary: Obtener estadísticas mensuales de reservas (solo Admin)
 *     description: Devuelve la cantidad de reservas totales, activas y la recaudación agrupada por mes.
 *     tags: [Estadísticas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas generadas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EstadisticasResponse'
 *       401:
 *         description: No autorizado o token inválido
 *       500:
 *         description: Error interno al generar estadísticas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EstadisticasError'
 */


    router.use(passport.authenticate("jwt", { session: false }));

    router.get("/", autorizarUsuarios([1]), async (req, res) => {
    const resultado = await servicio.generar();
    const status = resultado.estado ? 200 : 500;
    res.status(status).json(resultado);
    });

    export { router };