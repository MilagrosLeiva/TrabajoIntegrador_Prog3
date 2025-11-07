import { conexion } from "./conexion.js";

export default class Reservas {
    async buscarTodos() {
        const sql = `
        SELECT 
            r.reserva_id,
            r.fecha_reserva,
            s.titulo AS salon,
            t.hora_desde,
            t.hora_hasta,
            u.nombre_usuario AS cliente,
            r.foto_cumpleaniero,
            r.tematica,
            r.importe_salon,
            r.importe_total,
            r.creado,
            r.modificado
        FROM reservas AS r
        JOIN salones  AS s ON s.salon_id  = r.salon_id
        JOIN usuarios AS u ON u.usuario_id = r.usuario_id
        JOIN turnos   AS t ON t.turno_id   = r.turno_id
        WHERE r.activo = 1
        ORDER BY r.fecha_reserva DESC;
        `;
        const [result] = await conexion.query(sql);
        return result;
    }

    async buscarPorCliente(usuario_id) {
        const sql = `
        SELECT 
            r.reserva_id,
            r.fecha_reserva,
            s.titulo AS salon,
            t.hora_desde,
            t.hora_hasta,
            r.tematica,
            r.importe_total
        FROM reservas AS r
        JOIN salones AS s ON s.salon_id = r.salon_id
        JOIN turnos  AS t ON t.turno_id  = r.turno_id
        WHERE r.usuario_id = ? AND r.activo = 1
        ORDER BY r.fecha_reserva DESC;
        `;
        const [result] = await conexion.query(sql, [usuario_id]);
        return result;
    }




    async buscarPorId(reserva_id) {
        const sql = `
        SELECT 
            r.*,
            s.titulo AS salon,
            t.hora_desde,
            t.hora_hasta
        FROM reservas AS r
        JOIN salones AS s ON s.salon_id = r.salon_id
        JOIN turnos  AS t ON t.turno_id  = r.turno_id
        WHERE r.reserva_id = ? AND r.activo = 1;
        `;
        const [result] = await conexion.query(sql, [reserva_id]);
        return result[0];
    }




    async verificarDisponibilidad(salon_id, turno_id, fecha_reserva) {
        const sql = `
        SELECT COUNT(*) AS total
        FROM reservas
        WHERE salon_id = ?
            AND turno_id = ?
            AND fecha_reserva = ?
            AND activo = 1;
        `;
        const [result] = await conexion.query(sql, [salon_id, turno_id, fecha_reserva]);
        return result[0].total > 0;
    }




    async crear(reserva, connection) {
        const sql = `
        INSERT INTO reservas
        (fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total, activo, creado, modificado)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW());
        `;
        const [res] = await connection.execute(sql, [
        reserva.fecha_reserva,
        reserva.salon_id,
        reserva.usuario_id,
        reserva.turno_id,
        reserva.foto_cumpleaniero || null,
        reserva.tematica || null,
        reserva.importe_salon,
        reserva.importe_total
        ]);
        return res.insertId;
    }
    





        async actualizar(id, datos, connection) {
        const sql = `
            UPDATE reservas
            SET
                fecha_reserva = ?,
                salon_id = ?,
                turno_id = ?,
                foto_cumpleaniero = ?,
                tematica = ?,
                importe_salon = ?,
                importe_total = ?,
                modificado = NOW()
            WHERE reserva_id = ? AND activo = 1;
        `;
        const [result] = await connection.execute(sql, [
            datos.fecha_reserva,
            datos.salon_id,
            datos.turno_id,
            datos.foto_cumpleaniero || null,
            datos.tematica || null,
            datos.importe_salon,
            datos.importe_total,
            id
        ]);
        return result;
    }



    async eliminar(id) {
        const sql = `UPDATE reservas SET activo = 0, modificado = NOW() WHERE reserva_id = ?;`;
        const [res] = await conexion.query(sql, [id]);
        return res;
    }


    
    async datosParaNotificacion(reserva_id) {
        const sql = `
        SELECT 
            r.fecha_reserva AS fecha,
            s.titulo        AS salon,
            t.hora_desde,
            t.hora_hasta
        FROM reservas AS r
        JOIN salones AS s ON s.salon_id = r.salon_id
        JOIN turnos  AS t ON t.turno_id  = r.turno_id
        WHERE r.activo = 1 AND r.reserva_id = ?;
        `;
        const [res] = await conexion.query(sql, [reserva_id]);
        return res[0];
    }
    }