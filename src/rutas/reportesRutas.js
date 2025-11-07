import express from "express";
import passport from "passport";
import autorizarUsuarios from "../middlewares/autorizarUsuarios.js";
import ReportesServicio from "../servicios/reportesServicio.js";

const router = express.Router();
const servicio = new ReportesServicio();






/**
 * @swagger
 * tags:
 *   name: Reportes
 *   description: Endpoints para generar reportes administrativos en formato CSV
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
 *     ReporteReservasCSV:
 *       type: string
 *       format: binary
 *       description: Archivo CSV con los datos de las reservas activas.
 *       example: |
 *         ID,Fecha,Salón,Cliente,Hora Desde,Hora Hasta,Temática,Importe Total
 *         1,2025-10-12,Salón Arcoíris,mileiva,10:00,14:00,Fiesta infantil,15000
 *         2,2025-10-20,Salón Encantado,jperez,15:00,19:00,Cumpleaños,18000
 *
 *     ReporteError:
 *       type: object
 *       description: Respuesta de error en caso de fallo o datos inexistentes.
 *       properties:
 *         estado:
 *           type: boolean
 *           example: false
 *         mensaje:
 *           type: string
 *           example: "No hay reservas registradas"
 */

/**
 * @swagger
 * /reportes/reservas:
 *   get:
 *     summary: Generar y descargar reporte CSV de reservas activas
 *     description: |
 *       Genera un **archivo CSV** con el listado completo de reservas activas.  
 *       Solo accesible por **administradores (tipo_usuario = 1)**.
 *       <br><br>
 *       **Columnas del archivo:**
 *       - ID  
 *       - Fecha de la reserva  
 *       - Salón  
 *       - Cliente  
 *       - Hora Desde  
 *       - Hora Hasta  
 *       - Temática  
 *       - Importe Total
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reporte generado correctamente y devuelto como archivo CSV
 *         content:
 *           text/csv:
 *             schema:
 *               $ref: '#/components/schemas/ReporteReservasCSV'
 *       404:
 *         description: No hay reservas registradas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReporteError'
 *       401:
 *         description: No autorizado o token inválido
 *       500:
 *         description: Error interno al generar el reporte
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReporteError'
 */




router.use(passport.authenticate("jwt", { session: false }));



    router.get("/reservas", autorizarUsuarios([1]), async (req, res) => {
    try {
    
        await servicio.generarReporteReservas(res);
    } catch (error) {
        console.error("Error al generar reporte:", error);
        res.status(500).json({
        estado: false,
        mensaje: "Error interno al generar el reporte",
        });
    }
    });

    export { router };