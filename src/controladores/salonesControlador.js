import SalonesServicio from "../servicios/salonesServicio.js";

export default class SalonesControlador {

    constructor() {
        this.servicio = new SalonesServicio();
    }
    

    buscarTodos = async (req, res) => {
        try {
            const salones = await this.servicio.buscarTodos();


            res.status(200).json({
                estado: true,
                datos: salones
                });
        } catch (err) {
            console.error(err)
            res.status(500).json({
                estado:false,
                mensaje:'Error interno del servidor'
            });
        }
    }

    buscarPorId = async (req, res) => {
        try {
            const salon = await this.servicio.buscarPorId(req.params.id);

            if(!salon) {
                return res.status(404).json({
                estado:false,
                mensaje:'Salon no encontrado'
                });
            }

            res.status(200).json({
                estado: true,
                datos: salon
                });

        } catch (err) {
            console.error(err)
            res.status(500).json({
                estado:false,
                mensaje:'Error interno del servidor'
            });
        }
    }

    crear = async (req,res) => {

        try {
            const { titulo, direccion, latitud, longitud, capacidad, importe } = req.body;

            if(!titulo || !direccion || !capacidad || !importe) {

                return res.status(400).json( {
                    estado:false,
                    mensaje:'Faltan campos necesarios'
                    });

            }

            const resultado = await this.servicio.crear({ titulo, direccion, latitud, longitud, capacidad, importe });

            res.status(201).json({
                estado: true,
                mensaje: 'Salon creado exitosamente', 
                id: resultado.insertId
            });

        }catch (err) {
            console.error(err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error al crear salon'
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

            const salon = await this.servicio.buscarPorId(req.params.id);
            if (!salon) {
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Salon no encontrado'
                });
            }

            const { titulo, direccion, latitud, longitud, capacidad, importe } = req.body;


            if (!titulo || !direccion || !capacidad || !importe) {
                return res.status(400).json({
                    estado: false,
                    mensaje: 'Faltan campos necesarios'
                });
            }

            await this.servicio.actualizar(req.params.id, { titulo, direccion, latitud, longitud, capacidad, importe });

            res.status(200).json({
                estado: true,
                mensaje: 'Salon actualizado correctamente'
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno al actualizar el salon'
            });
        }
    };


    eliminar = async (req,res) => {

        try {
            const salon = await this.servicio.buscarPorId(req.params.id);

            if (!salon) {
                return res.status(404).json({
                    estado: false,
                    mensaje: 'El salon no se ha encontrado '

                    });
            }

            await this.servicio.eliminar(req.params.id);

            res.status(200).json({
                estado: true,
                mensaje: 'Salon eliminado correctamente'
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error al eliminar el salon'
            });


        }
    }











}