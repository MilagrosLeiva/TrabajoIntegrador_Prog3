    import ReservasServicio from "../servicios/reservasServicio.js";

    export default class ReservasControlador {
    constructor() {
        this.reservasServicio = new ReservasServicio();
    }


    //RESERVAS PROPIAS DE UN CLIENTE



    buscarMisReservas = async (req, res) => {
        try {
        const usuario_id = req.user.usuario_id;
        const reservas = await this.reservasServicio.buscarPorCliente(usuario_id);

        res.status(200).json({
            estado: true,
            datos: reservas,
        });
        } catch (err) {
        console.error("Error al listar mis reservas:", err);
        res.status(500).json({
            estado: false,
            mensaje: "Error interno del servidor",
        });
        }
    };

    


    buscarTodos = async (req, res) => {
        try {
        const reservas = await this.reservasServicio.buscarTodos();

        res.status(200).json({
            estado: true,
            datos: reservas,
        });
        } catch (err) {
        console.error("Error al listar todas las reservas:", err);
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
        const usuario_id = req.user.usuario_id;
        const nombre_usuario = req.user.nombre_usuario; 
        const datosReserva = { ...req.body, usuario_id, nombre_usuario };
        const resultado = await this.reservasServicio.crear(datosReserva);



        if (!resultado.estado) {
            return res.status(resultado.status || 500).json({
            estado: false,
            mensaje: resultado.mensaje || "error interno del servidor",
            });
        }

        res.status(201).json({
            estado: true,
            mensaje: resultado.mensaje || "Reserva creada y notificada con exito ",
            datos: resultado.datos,
        });

        } catch (err) {
        console.error(" Error en POST /reservas:", err);
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
    }
