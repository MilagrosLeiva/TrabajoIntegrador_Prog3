import { conexion } from "./conexion.js";

export default class Salones {
    
    buscarTodos = async () => {
        const sql = 'SELECT * FROM salones WHERE activo = 1';
        const [salones] = await conexion.execute(sql);
        return salones;
        }

    buscarPorId = async (id) => {
        const sql= 'SELECT * FROM salones WHERE salon_id = ? AND activo=1';
        const [salon]= await conexion.execute(sql,[id]);
        return salon[0];
    }
    

    crear = async (datos) => {
        const sql= `INSERT INTO salones (titulo, direccion, latitud, longitud, capacidad, importe, activo, creado, modificado)
        VALUES (?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`;

        const [resultado] = await conexion.execute(sql, [
            datos.titulo,
            datos.direccion,
            datos.latitud,
            datos.longitud,
            datos.capacidad,
            datos.importe
        ]);

        return resultado;
    }

    actualizar = async (id,datos) => {
        const sql= `UPDATE salones SET 

            titulo= ?,  
            direccion= ?,
            latitud= ?,
            longitud= ?,
            capacidad= ?,
            importe= ?,
            modificado= NOW()
            WHERE salon_id =? AND activo = 1 `;

        const [resultado] = await conexion.execute(sql, [

            datos.titulo,
            datos.direccion,
            datos.latitud,
            datos.longitud,
            datos.capacidad,
            datos.importe,
            id
        ]);
        return resultado;
        

    }


    eliminar = async (id) => {
        const sql = 'UPDATE salones SET activo = 0, modificado= NOW() WHERE salon_id = ?';
        const [resultado] = await conexion.execute(sql, [id]);
        return resultado;
        }




    }