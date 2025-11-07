import { conexion } from "../db/conexion.js";
import md5 from "md5";

    export default class RegistroServicio {
    async registrarCliente(datos) {
        const { nombre, apellido, nombre_usuario, contrasenia } = datos;




        const [existe] = await conexion.query(
        "SELECT usuario_id FROM usuarios WHERE nombre_usuario = ?",
        [nombre_usuario]
        );

        if (existe.length > 0) {
        throw { status: 400, mensaje: "Ya existe un usuario con ese email." };
        }





        const [result] = await conexion.query(
        `INSERT INTO usuarios (nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, activo)
        VALUES (?, ?, ?, ?, 3, 1)`,
        [nombre, apellido, nombre_usuario, md5(contrasenia)]
        );

        return {
        usuario_id: result.insertId,
        nombre,
        apellido,
        nombre_usuario,
        };
    }
}