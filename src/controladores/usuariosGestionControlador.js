import UsuariosServicio from "../servicios/usuariosGestionServicio.js";

export default class UsuariosControlador {
    constructor() {
        this.servicio = new UsuariosServicio();
    }


    
    buscarTodos = async (req, res) => {
        try {
            const usuarios = await this.servicio.buscarTodos();
            res.status(200).json({ estado: true, datos: usuarios });
        } catch (err) {
            console.error(err);
            res.status(500).json({ estado: false, mensaje: "Error interno del servidor" });
        }
    }




    buscarClientes = async (req, res) => {
        try {
            const clientes = await this.servicio.buscarClientes();
            res.status(200).json({ estado: true, datos: clientes });
        } catch (err) {
            console.error(err);
            res.status(500).json({ estado: false, mensaje: "Error interno del servidor" });
        }
    }







    buscarPorId = async (req, res) => {
        try {
            const usuario = await this.servicio.buscarPorId(req.params.id);
            if (!usuario) {
                return res.status(404).json({ estado: false, mensaje: "Usuario no encontrado" });
            }
            res.status(200).json({ estado: true, datos: usuario });
        } catch (err) {
            console.error(err);
            res.status(500).json({ estado: false, mensaje: "Error interno del servidor" });
        }
    }






    crear = async (req, res) => {
        try {
            const resultado = await this.servicio.crear(req.body);
            res.status(201).json({ estado: true, mensaje: "Usuario creado exitosamente", id: resultado.insertId });
        } catch (err) {
            console.error(err);
            res.status(500).json({ estado: false, mensaje: "Error al crear usuario" });
        }
    }





    actualizar = async (req, res) => {
        try {
            const usuario = await this.servicio.buscarPorId(req.params.id);
            if (!usuario) {
                return res.status(404).json({ estado: false, mensaje: "Usuario no encontrado" });
            }

            await this.servicio.actualizar(req.params.id, req.body);
            res.status(200).json({ estado: true, mensaje: "Usuario actualizado correctamente" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ estado: false, mensaje: "Error al actualizar usuario" });
        }
    }

    



    eliminar = async (req, res) => {
        try {
            const usuario = await this.servicio.buscarPorId(req.params.id);
            if (!usuario) {
                return res.status(404).json({ estado: false, mensaje: "Usuario no encontrado" });
            }

            await this.servicio.eliminar(req.params.id);
            res.status(200).json({ estado: true, mensaje: "Usuario eliminado correctamente" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ estado: false, mensaje: "Error al eliminar usuario" });
        }
    }
}