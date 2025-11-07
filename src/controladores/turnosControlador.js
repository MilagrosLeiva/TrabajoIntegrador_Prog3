import TurnosServicio from "../servicios/turnosServicio.js";

export default class TurnosControlador {
    constructor() {
        this.servicio = new TurnosServicio();
    }



    buscarTodos = async (req, res) => {
        try {
            const turnos = await this.servicio.buscarTodos();
            res.status(200).json({ estado: true, datos: turnos });
        } catch (err) {
            console.error(err);
            res.status(500).json({ estado: false, mensaje: "Error interno del servidor" });
        }
    }




    buscarPorId = async (req, res) => {
        try {
            const turno = await this.servicio.buscarPorId(req.params.id);
            if (!turno) {
                return res.status(404).json({ estado: false, mensaje: "Turno no encontrado" });
            }
            res.status(200).json({ estado: true, datos: turno });
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
                mensaje: "Turno creado exitosamente",
                id: resultado.insertId
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ estado: false, mensaje: "Error al crear turno" });
        }
    }

   


    actualizar = async (req, res) => {
        try {
            const turno = await this.servicio.buscarPorId(req.params.id);
            if (!turno) {
                return res.status(404).json({ estado: false, mensaje: "Turno no encontrado" });
            }

            await this.servicio.actualizar(req.params.id, req.body);
            res.status(200).json({ estado: true, mensaje: "Turno actualizado correctamente" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ estado: false, mensaje: "Error al actualizar turno" });
        }
    }


    
    eliminar = async (req, res) => {
        try {
            const turno = await this.servicio.buscarPorId(req.params.id);
            if (!turno) {
                return res.status(404).json({ estado: false, mensaje: "Turno no encontrado" });
            }

            await this.servicio.eliminar(req.params.id);
            res.status(200).json({ estado: true, mensaje: "Turno eliminado correctamente" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ estado: false, mensaje: "Error al eliminar turno" });
        }
    }
}