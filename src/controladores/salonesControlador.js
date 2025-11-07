import { conexion } from "../db/conexion.js";
import SalonesServicio from "../servicios/salonesServicio.js";

    export default class SalonesControlador {
    constructor() {
        this.servicio = new SalonesServicio();
    }



    buscarTodos = async (req, res) => {
    try {
        
        const { 
        capacidad_min,      // FILTRO
        orden = "salon_id", // ORDENAR
        tipo = "ASC",       // ASC O DESC
        page,               // PAG.ACTUAL
        limit               //CANTIDAD POR PAG.
        } = req.query;

        
        if (!capacidad_min && !orden && !tipo && !page && !limit) {
        const salones = await this.servicio.buscarTodos();
        return res.status(200).json({ estado: true, datos: salones });
        }

        const offset = page && limit ? (page - 1) * limit : 0;

        let sql = `
        SELECT * FROM salones
        WHERE activo = 1
        `;


        if (capacidad_min) {
        sql += ` AND capacidad >= ${capacidad_min}`;
        }



        sql += ` ORDER BY ${orden} ${tipo}`;


        if (limit) {
        sql += ` LIMIT ${limit}`;
        }
        if (offset) {
        sql += ` OFFSET ${offset}`;
        }



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
        const salon = await this.servicio.buscarPorId(req.params.id);
        if (!salon) {
            return res.status(404).json({ estado: false, mensaje: 'Salon no encontrado' });
        }
        res.status(200).json({ estado: true, datos: salon });
        } catch (err) {
        console.error(err);
        res.status(500).json({ estado: false, mensaje: 'Error interno del servidor' });
        }
    }




    crear = async (req, res) => {
        try {
        const resultado = await this.servicio.crear(req.body);
        res.status(201).json({
            estado: true,
            mensaje: 'Salón creado exitosamente',
            id: resultado.insertId
        });
        } catch (err) {
        console.error(err);
        res.status(500).json({ estado: false, mensaje: 'Error al crear salon' });
        }
    }





    actualizar = async (req, res) => {
        try {
        const salon = await this.servicio.buscarPorId(req.params.id);
        if (!salon) {
            return res.status(404).json({ estado: false, mensaje: 'Salon no encontrado' });
        }

        await this.servicio.actualizar(req.params.id, req.body);
        res.status(200).json({ estado: true, mensaje: 'Salon actualizado correctamente' });
        } catch (err) {
        console.error(err);
        res.status(500).json({ estado: false, mensaje: 'Error al actualizar salon' });
        }
    }




    eliminar = async (req, res) => {
        try {
        const salon = await this.servicio.buscarPorId(req.params.id);
        if (!salon) {
            return res.status(404).json({ estado: false, mensaje: 'Salon no encontrado' });
        }

        await this.servicio.eliminar(req.params.id);
        res.status(200).json({ estado: true, mensaje: 'Salon eliminado correctamente' });
        } catch (err) {
        console.error(err);
        res.status(500).json({ estado: false, mensaje: 'Error al eliminar salon' });
        }
    }
    }

