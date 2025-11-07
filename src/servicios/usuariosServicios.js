import Usuarios from "../db/usuarios.js";

    export default class UsuariosService {
    constructor() {
        this.usuarios = new Usuarios();
    }

    buscar = (nombre_usuario, contrasenia) => this.usuarios.buscar(nombre_usuario, contrasenia);
    buscarPorId = (usuario_id) => this.usuarios.buscarPorId(usuario_id);
    }