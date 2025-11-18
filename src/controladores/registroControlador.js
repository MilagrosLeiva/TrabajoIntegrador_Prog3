import RegistroServicio from "../servicios/registroServicio.js";

export default class RegistroControlador {
    constructor() {
        this.servicio = new RegistroServicio();
    }



    registrar = async (req, res) => {
        try {
        const nuevo = await this.servicio.registrar(req.body);

        res.status(201).json({
            estado: true,
            mensaje: "Usuario registrado con exito",
            datos: nuevo,
        });
        } catch (error) {
        res.status(error.status || 500).json({
            estado: false,
            mensaje: error.mensaje || "Error al intentar registrarse ",
        });
        }
    };
}