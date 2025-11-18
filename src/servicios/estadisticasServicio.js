import Reservas from "../db/reservas.js";

export default class EstadisticasServicio {
    constructor() {
        this.reservas = new Reservas();
    }

    async obtenerEstadisticas() {
        const datos = await this.reservas.estadisticas();

        return {
            estado: true,
            mensaje: "Estadisticas generadas correctamente",
            datos
        };
    }
}