import { conexion } from "./conexion.js";

export default class UsuariosGestion {
    
    
    buscarTodos = async () => {
        const sql = 'SELECT usuario_id, nombre, apellido, nombre_usuario, tipo_usuario, celular, foto FROM usuarios WHERE activo = 1';
        const [usuarios] = await conexion.execute(sql);
        return usuarios;
    }


    buscarClientes = async () => {
        const sql = 'SELECT usuario_id, nombre, apellido, nombre_usuario, tipo_usuario, celular, foto FROM usuarios WHERE activo = 1 AND tipo_usuario = 3';
        const [usuarios] = await conexion.execute(sql);
        return usuarios;
    }



    buscarPorId = async (id) => {
    const sql = `
        SELECT 
        usuario_id,
        nombre,
        apellido,
        nombre_usuario,
        tipo_usuario,
        celular,
        foto,
        activo,
        creado,
        modificado
        FROM usuarios
        WHERE usuario_id = ? AND activo = 1
    `;
    const [usuario] = await conexion.execute(sql, [id]);
    return usuario[0];
    }







    crear = async (datos) => {
        const sql = `
            INSERT INTO usuarios (nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto, activo, creado, modificado)
            VALUES (?, ?, ?, MD5(?), ?, ?, ?, 1, NOW(), NOW())
        `;
        const [resultado] = await conexion.execute(sql, [
            datos.nombre,
            datos.apellido,
            datos.nombre_usuario,
            datos.contrasenia,
            datos.tipo_usuario,
            datos.celular || null,
            datos.foto || null
        ]);
        return resultado;
    }





    actualizar = async (id, datos) => {
        const sql = `
            UPDATE usuarios
            SET nombre = ?, apellido = ?, nombre_usuario = ?, tipo_usuario = ?, celular = ?, foto = ?, modificado = NOW()
            WHERE usuario_id = ? AND activo = 1
        `;
        const [resultado] = await conexion.execute(sql, [
            datos.nombre,
            datos.apellido,
            datos.nombre_usuario,
            datos.tipo_usuario,
            datos.celular || null,
            datos.foto || null,
            id
        ]);
        return resultado;
    }




    eliminar = async (id) => {
        const sql = 'UPDATE usuarios SET activo = 0, modificado = NOW() WHERE usuario_id = ?';
        const [resultado] = await conexion.execute(sql, [id]);
        return resultado;
    }


    actualizarPerfil = async (id, datos) => {
    const sql = `
        UPDATE usuarios
        SET 
            nombre = COALESCE(?, nombre),
            apellido = COALESCE(?, apellido),
            nombre_usuario = COALESCE(?, nombre_usuario),
            celular = COALESCE(?, celular),
            foto = COALESCE(?, foto),
            modificado = NOW()
        WHERE usuario_id = ? AND activo = 1
    `;

    const [resultado] = await conexion.execute(sql, [
        datos.nombre || null,
        datos.apellido || null,
        datos.nombre_usuario || null,
        datos.celular || null,
        datos.foto || null,
        id
    ]);

    return resultado;
};

}