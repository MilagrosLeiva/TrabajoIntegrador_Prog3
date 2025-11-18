    import ReservasServicio from "../servicios/reservasServicio.js";
    import EstadisticasServicio from "../servicios/estadisticasServicio.js";
    
    const formatosPermitidos = ['pdf', 'csv'];


    export default class ReservasControlador {
    constructor() {
        this.reservasServicio = new ReservasServicio();
        this.estadisticasServicio = new EstadisticasServicio();
    }


    //RESERVAS segun rol
    listarSegunRol = async (req, res) => {
        try {
            const { tipo_usuario, usuario_id } = req.user;
            let reservas;

            if (tipo_usuario === 3) {
                reservas = await this.reservasServicio.buscarPorCliente(usuario_id);
            } else {
                
                reservas = await this.reservasServicio.buscarTodos();
            }

            res.status(200).json({
                estado: true,
                datos: reservas,
            });

        } catch (err) {
            console.error("Error al listar reservas:", err);
            res.status(500).json({
                estado: false,
                mensaje: "Error interno del servidor",
            });
        }
    };






    buscarPorId = async (req, res) => {
        try {
        const reserva = await this.reservasServicio.buscarPorId(req.params.id);

        if (!reserva) {
            return res.status(404).json({
            estado: false,
            mensaje: "Reserva no encontrada",
            });
        }

        res.status(200).json({
            estado: true,
            datos: reserva,
        });
        } catch (err) {
        console.error("Error al buscar reserva por ID:", err);
        res.status(500).json({
            estado: false,
            mensaje: "Error interno del servidor",
        });
        }
    };




    crear = async (req, res) => {
        try {
            const tipo = req.user.tipo_usuario;

            let usuario_id;

            if (tipo === 3) {
                usuario_id = req.user.usuario_id;
            } else if (tipo === 1) {
            
                usuario_id = req.body.usuario_id;
            }

            const datosReserva = {
                ...req.body,
                usuario_id
            };

            const resultado = await this.reservasServicio.crear(datosReserva);

            if (!resultado.estado) {
                return res.status(resultado.status || 500).json({
                    estado: false,
                    mensaje: resultado.mensaje || "error interno del servidor",
                });
            }

            res.status(201).json({
                estado: true,
                mensaje: resultado.mensaje || "Reserva creada y notificada con éxito",
                datos: resultado.datos,
            });

        } catch (err) {
            console.error("Error en POST /reservas:", err);
            res.status(err.status || 500).json({
                estado: false,
                mensaje: err.mensaje || "Error interno del servidor",
            });
        }
    };




    actualizar = async (req, res) => {
        try {
        const reservaExistente = await this.reservasServicio.buscarPorId(req.params.id);
        if (!reservaExistente) {
            return res.status(404).json({
            estado: false,
            mensaje: "Reserva no encontrada",
            });
        }

        const resultado = await this.reservasServicio.actualizar(req.params.id, req.body);

        res.status(200).json({
            estado: resultado.estado,
            mensaje: resultado.mensaje,
            datos: resultado.datos || null,
        });
        } catch (err) {
        console.error("Error al intentar actualizar reserva:", err);
        res.status(err.status || 500).json({
            estado: false,
            mensaje: err.mensaje || "Error interno del servidor",
        });
        }
    };

    


    eliminar = async (req, res) => {
        try {
        const reservaExistente = await this.reservasServicio.buscarPorId(req.params.id);
        if (!reservaExistente) {
            return res.status(404).json({
            estado: false,
            mensaje: "Reserva no encontrada",
            });
        }

        const resultado = await this.reservasServicio.eliminar(req.params.id);

        res.status(200).json({
            estado: resultado.estado,
            mensaje: resultado.mensaje,
        });
        } catch (err) {
        console.error("error al intentar eliminar reserva:", err);
        res.status(err.status || 500).json({
            estado: false,
            mensaje: err.mensaje || "Error interno del srvidor",
        });
        }
    };


    informe = async (req, res) => {
        try {
            const formato = req.query.formato;

            if (!formato || !formatosPermitidos.includes(formato)) {
                return res.status(400).json({
                    estado: false,
                    mensaje: "Formato inválido (usa ?formato=csv o ?formato=pdf)"
                });
            }

            const resultado = await this.reservasServicio.generarInforme(formato);

            res.set(resultado.headers);

            if (resultado.buffer) {

                return res.status(200).end(resultado.buffer);
            }

            if (resultado.path) {

                return res.download(resultado.path);
            }

        } catch (err) {
            console.log("Error generando informe:", err);
            res.status(500).json({
                estado: false,
                mensaje: "Error interno del servidor"
            });
        }
    };

    estadisticas = async (req, res) => {
        try {
            const resultado = await this.estadisticasServicio.obtenerEstadisticas();

            res.json(resultado);

        } catch (error) {
            console.error("Error obteniendo estadísticas:", error);
            res.status(500).json({
                estado: false,
                mensaje: "Error interno al obtener las estadísticas"
            });
        }
    };


    
    }
