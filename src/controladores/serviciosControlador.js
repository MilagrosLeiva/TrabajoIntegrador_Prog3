import ServiciosServicio from "../servicios/serviciosServicio.js";

export default class ServiciosControlador {

    constructor() {
        this.servicio = new ServiciosServicio();
    }


    buscarTodos = async (req, res) => {
        try {
            const servicios = await this.servicio.buscarTodos();

            res.status(200).json({
                estado: true,
                datos: servicios
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor'
            });
        }
    }



    buscarPorId = async (req, res) => {
        try {
            const servicio = await this.servicio.buscarPorId(req.params.id);

            if (!servicio) {
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Servicio no encontrado'
                });
            }

            res.status(200).json({
                estado: true,
                datos: servicio
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor'
            });
        }
    }




    crear = async (req, res) => {
        try {
            const { descripcion, importe } = req.body;


            if (!descripcion || !importe) {
                return res.status(400).json({
                    estado: false,
                    mensaje: 'Faltan campos necesarios'
                });
            }

            const resultado = await this.servicio.crear({ descripcion, importe });

            res.status(201).json({
                estado: true,
                mensaje: 'Servicio creado exitosamente',
                id: resultado.insertId
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error al crear servicio'
            });
        }
    }



    actualizar = async (req, res) => {
        try {
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({
                    estado: false,
                    mensaje: 'No se recibieron datos en el cuerpo de la solicitud'
                });
            }

            const servicio = await this.servicio.buscarPorId(req.params.id);
            if (!servicio) {
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Servicio no encontrado'
                });
            }

            const { descripcion, importe } = req.body;

            if (!descripcion || !importe) {
                return res.status(400).json({
                    estado: false,
                    mensaje: 'Faltan campos necesarios'
                });
            }

            await this.servicio.actualizar(req.params.id, { descripcion, importe });

            res.status(200).json({
                estado: true,
                mensaje: 'Servicio actualizado correctamente'
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno al actualizar el servicio'
            });
        }
    }



    
    eliminar = async (req, res) => {
        try {
            const servicio = await this.servicio.buscarPorId(req.params.id);

            if (!servicio) {
                return res.status(404).json({
                    estado: false,
                    mensaje: 'El servicio no se ha encontrado'
                });
            }

            await this.servicio.eliminar(req.params.id);

            res.status(200).json({
                estado: true,
                mensaje: 'Servicio eliminado correctamente'
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error al eliminar el servicio'
            });
        }
    }
}