import { conexion } from "../db/conexion.js";
import { createObjectCsvStringifier } from "csv-writer";

export default class ReportesServicio {
    async generarReporteReservas(res, next) {
        try {
        const [reservas] = await conexion.query(`
            SELECT 
            r.reserva_id,
            r.fecha_reserva,
            s.titulo AS salon,
            u.nombre_usuario AS cliente,
            t.hora_desde,
            t.hora_hasta,
            r.tematica,
            r.importe_total
            FROM reservas AS r
            JOIN salones AS s ON s.salon_id = r.salon_id
            JOIN usuarios AS u ON u.usuario_id = r.usuario_id
            JOIN turnos  AS t ON t.turno_id = r.turno_id
            WHERE r.activo = 1
            ORDER BY r.fecha_reserva DESC;
        `);

        if (!reservas.length) {
            return res.status(404).json({
            estado: false,
            mensaje: "No hay reservas registradas",
            });
        }

        const csvStringifier = createObjectCsvStringifier({
            header: [
            { id: "reserva_id", title: "ID" },
            { id: "fecha_reserva", title: "Fecha" },
            { id: "salon", title: "Salón" },
            { id: "cliente", title: "Cliente" },
            { id: "hora_desde", title: "Hora Desde" },
            { id: "hora_hasta", title: "Hora Hasta" },
            { id: "tematica", title: "Temática" },
            { id: "importe_total", title: "Importe Total" },
            ],
        });

        const csvContent =
            csvStringifier.getHeaderString() +
            csvStringifier.stringifyRecords(reservas);


        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=reporte_reservas.csv"
        );




        res.status(200).send(csvContent);
        } catch (error) {
        console.error(" Error al generar reporte:", error);
        res.status(500).json({
            estado: false,
            mensaje: "Error interno del servidor",
        });
        }
    }
    }