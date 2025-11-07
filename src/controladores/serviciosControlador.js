import { conexion } from "../db/conexion.js";
import ServiciosServicio from "../servicios/serviciosServicio.js";

export default class ServiciosControlador {
    constructor() {
        this.servicio = new ServiciosServicio();
    }


    buscarTodos = async (req, res) => {
        try {
            const {
                importe_min,
                orden = "servicio_id",
                tipo = "ASC",
                page,
                limit
            } = req.query;


            if (!importe_min && !orden && !tipo && !page && !limit) {
                const servicios = await this.servicio.buscarTodos();
                return res.status(200).json({ estado: true, datos: servicios });
            }

            const offset = page && limit ? (page - 1) * limit : 0;

            let sql = `
                SELECT * FROM servicios
                WHERE activo = 1
            `;


            if (importe_min) {
                sql += ` AND importe >= ${importe_min}`;
            }


            sql += ` ORDER BY ${orden} ${tipo}`;


            if (limit) sql += ` LIMIT ${limit}`;
            if (offset) sql += ` OFFSET ${offset}`;

            const [rows] = await conexion.query(sql);

            res.status(200).json({
                estado: true,
                total: rows.length,
                data: rows,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ estado: false, mensaje: "Error interno del servidor" });
        }
    }






    buscarPorId = async (req, res) => {
        try {
            const servicio = await this.servicio.buscarPorId(req.params.id);
            if (!servicio) {
                return res.status(404).json({ estado: false, mensaje: "Servicio no encontrado" });
            }
            res.status(200).json({ estado: true, datos: servicio });
        } catch (err) {
            console.error(err);
            res.status(500).json({ estado: false, mensaje: "Error interno del servidor" });
        }
    }



    crear = async (req, res) => {
        try {
            const resultado = await this.servicio.crear(req.body);
            res.status(201).json({
                estado: true,
                mensaje: "Servicio creado exitosamente",
                id: resultado.insertId
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ estado: false, mensaje: "Error al crear servicio" });
        }
    }





    actualizar = async (req, res) => {
        try {
            const servicio = await this.servicio.buscarPorId(req.params.id);
            if (!servicio) {
                return res.status(404).json({ estado: false, mensaje: "Servicio no encontrado" });
            }

            await this.servicio.actualizar(req.params.id, req.body);
            res.status(200).json({ estado: true, mensaje: "Servicio actualizado correctamente" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ estado: false, mensaje: "Error al actualizar servicio" });
        }
    }

    
    eliminar = async (req, res) => {
        try {
            const servicio = await this.servicio.buscarPorId(req.params.id);
            if (!servicio) {
                return res.status(404).json({ estado: false, mensaje: "Servicio no encontrado" });
            }

            await this.servicio.eliminar(req.params.id);
            res.status(200).json({ estado: true, mensaje: "Servicio eliminado correctamente" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ estado: false, mensaje: "Error al eliminar servicio" });
        }
    }
}