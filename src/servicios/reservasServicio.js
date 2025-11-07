import { conexion } from "../db/conexion.js";
import Reservas from "../db/reservas.js";
import ReservasServicios from "../db/reservas_servicios.js";
import NotificacionesService from "./notificacionesServicio.js";

export default class ReservasServicio {
    constructor() {
        this.reservas = new Reservas();
        this.reservasServicios = new ReservasServicios();
        this.notificaciones = new NotificacionesService();
    }

    buscarTodos = () => this.reservas.buscarTodos();
    buscarPorId = (id) => this.reservas.buscarPorId(id);
    buscarPorCliente = (usuario_id) => this.reservas.buscarPorCliente(usuario_id);


    async crear(reservaCompleta) {
        const connection = await conexion.getConnection();

        try {
            await connection.beginTransaction();

            const { fecha_reserva, salon_id, turno_id, usuario_id } = reservaCompleta;

            const ocupado = await this.reservas.verificarDisponibilidad(salon_id, turno_id, fecha_reserva);
            if (ocupado) {
                throw { status: 400, mensaje: "El salón ya está reservado para esa fecha y turno." };
            }
            if (Number(reservaCompleta.importe_total) < Number(reservaCompleta.importe_salon)) {
                throw { status: 400, mensaje: "El importe total no puede ser menor al del salón." };
            }

            const reserva_id = await this.reservas.crear(reservaCompleta, connection);
            if (reservaCompleta.servicios?.length) {
                await this.reservasServicios.crear(connection, reserva_id, reservaCompleta.servicios);
            }

            await connection.commit();


            const reserva = await this.reservas.buscarPorId(reserva_id);
            const [servicios] = await conexion.query(`
                SELECT 
                    s.servicio_id,
                    s.descripcion AS servicio,
                    rs.importe
                FROM reservas_servicios AS rs
                JOIN servicios AS s ON s.servicio_id = rs.servicio_id
                WHERE rs.reserva_id = ?;
            `, [reserva_id]);

            

            const [usuario] = await conexion.query(`
                SELECT nombre_usuario 
                FROM usuarios 
                WHERE usuario_id = ? AND activo = 1;
            `, [usuario_id]);

            const emailCliente = usuario.length ? usuario[0].nombre_usuario : null;

            const datosMail = {
                emailCliente,
                fecha: reserva.fecha_reserva,
                salon: reserva.salon,
                turno: `${reserva.hora_desde} - ${reserva.hora_hasta}`,
                tematica: reserva.tematica || "Sin temática",
                importe_total: reserva.importe_total,
                servicios: servicios.length
                    ? servicios.map(s => `${s.servicio} ($${s.importe})`).join(", ")
                    : "Ninguno"
            };

            if (emailCliente) {
                await this.notificaciones.enviarCorreo(datosMail);
            }

            return {
                estado: true,
                mensaje: "Reserva creada correctamente y notificada.",
                datos: { ...reserva, servicios }
            };

        } catch (error) {
            await connection.rollback();
            console.error(" Error en transacción de reserva:", error);
            throw {
                estado: false,
                mensaje: error.mensaje || "Error al crear la reserva",
                status: error.status || 500
            };
        } finally {
            connection.release();
        }
    }

    


    async actualizar(id, datos) {
        const connection = await conexion.getConnection();
        try {
            await connection.beginTransaction();

            const reservaExistente = await this.reservas.buscarPorId(id);
            if (!reservaExistente) throw { status: 404, mensaje: "La reserva no existe" };

            const result = await this.reservas.actualizar(id, datos, connection);
            if (result.affectedRows === 0) throw { status: 400, mensaje: "No se pudo actualizar" };

            await connection.commit();

            const reservaActualizada = await this.reservas.buscarPorId(id);
            return {
                estado: true,
                mensaje: "Reserva actualizada correctamente",
                datos: reservaActualizada
            };

        } catch (error) {
            await connection.rollback();
            console.error("error al actualizar reserva:", error);
            throw {
                estado: false,
                mensaje: error.mensaje || "Error al actualizar la reserva",
                status: error.status || 500
            };
        } finally {
            connection.release();
        }
    }



    async eliminar(id) {
        try {
            await this.reservas.eliminar(id);
            return { estado: true, mensaje: "Reserva eliminada correctamente" };
        } catch (error) {
            throw { estado: false, mensaje: "Error al eliminar la reserva", status: 500 };
        }
    }
}