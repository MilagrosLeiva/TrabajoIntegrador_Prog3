import { conexion } from "./conexion.js";

export default class Turnos {


    buscarTodos = async () => {
        const sql = 'SELECT * FROM turnos WHERE activo = 1 ORDER BY orden ASC';
        const [turnos] = await conexion.execute(sql);
        return turnos;
    }


    
    buscarPorId = async (id) => {
        const sql = 'SELECT * FROM turnos WHERE turno_id = ? AND activo = 1';
        const [turno] = await conexion.execute(sql, [id]);
        return turno[0];
    }




    crear = async (datos) => {
        const sql = `
            INSERT INTO turnos (orden, hora_desde, hora_hasta, activo, creado, modificado)
            VALUES (?, ?, ?, 1, NOW(), NOW())
        `;
        const [resultado] = await conexion.execute(sql, [
            datos.orden,
            datos.hora_desde,
            datos.hora_hasta
        ]);
        return resultado;
    }

    actualizar = async (id, datos) => {
        const sql = `
            UPDATE turnos
            SET orden = ?, hora_desde = ?, hora_hasta = ?, modificado = NOW()
            WHERE turno_id = ? AND activo = 1
        `;
        const [resultado] = await conexion.execute(sql, [
            datos.orden,
            datos.hora_desde,
            datos.hora_hasta,
            id
        ]);
        return resultado;
    }



    eliminar = async (id) => {
        const sql = 'UPDATE turnos SET activo = 0, modificado = NOW() WHERE turno_id = ?';
        const [resultado] = await conexion.execute(sql, [id]);
        return resultado;
    }
}