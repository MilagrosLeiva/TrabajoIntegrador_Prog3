import { conexion } from "./conexion.js";

export default class ReservasServicios {


    /**
     * @param {object} connection - Conexión activa ,transaccion principal
     * @param {number} reserva_id - ID reserva creada
     * @param {Array} servicios - Array de objetos { servicio_id, importe }
     */





    async crear(connection, reserva_id, servicios = []) {
        try {
        if (!servicios.length) return true;

        for (const servicio of servicios) {
            const sql = `
            INSERT INTO reservas_servicios 
            (reserva_id, servicio_id, importe, creado, modificado)
            VALUES (?, ?, ?, NOW(), NOW());
            `;
            await connection.execute(sql, [
            reserva_id,
            servicio.servicio_id,
            servicio.importe
            ]);
        }

        return true;
        } catch (error) {
        console.error("error al insertar servicios de la reserva:", error);
        throw new Error("Error al insertar los servicios de la reserva.");
        }
    }

    


    async crearSinTransaccion(reserva_id, servicios = []) {

        const connection = await conexion.getConnection();

        try {
        await connection.beginTransaction();

        for (const servicio of servicios) {
            const sql = `
            INSERT INTO reservas_servicios 
            (reserva_id, servicio_id, importe, creado, modificado)
            VALUES (?, ?, ?, NOW(), NOW());
            `;
            await connection.execute(sql, [
            reserva_id,
            servicio.servicio_id,
            servicio.importe
            ]);
        }

        await connection.commit();
        return true;

        } catch (error) {
        await connection.rollback();
        console.error("error en crearSinTransaccion:", error);
        throw new Error("Error al insertar servicios");

        } finally {


        connection.release();
        }
    }

    




    async listarPorReserva(reserva_id) {
        const sql = `
        SELECT 
            rs.reserva_servicio_id,
            rs.reserva_id,
            rs.servicio_id,
            s.descripcion AS servicio,
            rs.importe,
            rs.creado,
            rs.modificado
        FROM reservas_servicios AS rs
        JOIN servicios AS s ON s.servicio_id = rs.servicio_id
        WHERE rs.reserva_id = ?;
        `;
        const [rows] = await conexion.query(sql, [reserva_id]);
        return rows;
    }
    }