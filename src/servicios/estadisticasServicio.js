import { conexion } from "../db/conexion.js";

export default class EstadisticasServicio {
    async generar() {
        try {
        const [filas] = await conexion.query("CALL estadisticas_reservas();");
        const datos = filas[0];
        return {
            estado: true,
            mensaje: "Estadísticas generadas correctamente",
            datos
        };
        } catch (error) {
        console.error("Error al obtener estadísticas:", error);
        return {
            estado: false,
            mensaje: "Error al generar estadísticas"
        };
        }
    }
    }