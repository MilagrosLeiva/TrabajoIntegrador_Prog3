import { conexion } from "./conexion.js";

export default class Servicios {


    
    buscarTodos = async () => {
        const sql = 'SELECT * FROM servicios WHERE activo = 1';
        const [servicios] = await conexion.execute(sql);
        return servicios;
    }

    buscarPorId = async (id) => {
        const sql = 'SELECT * FROM servicios WHERE servicio_id = ? AND activo = 1';
        const [servicio] = await conexion.execute(sql, [id]);
        return servicio[0];
    }


    crear = async (datos) => {
        const sql = `
            INSERT INTO servicios (descripcion, importe, activo, creado, modificado)
            VALUES (?, ?, 1, NOW(), NOW())
        `;

        const [resultado] = await conexion.execute(sql, [
            datos.descripcion,
            datos.importe
        ]);

        return resultado;
    }


    actualizar = async (id, datos) => {
        const sql = `
            UPDATE servicios SET 
                descripcion = ?,  
                importe = ?,
                modificado = NOW()
            WHERE servicio_id = ? AND activo = 1
        `;

        const [resultado] = await conexion.execute(sql, [
            datos.descripcion,
            datos.importe,
            id
        ]);

        return resultado;
    }


    eliminar = async (id) => {
        const sql = 'UPDATE servicios SET activo = 0, modificado = NOW() WHERE servicio_id = ?';
        const [resultado] = await conexion.execute(sql, [id]);
        return resultado;
    }
}