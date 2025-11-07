import UsuariosGestion from "../db/usuariosGestion.js";

export default class UsuariosServicio {
    constructor() {
        this.usuarios = new UsuariosGestion();
    }

    buscarTodos = () => this.usuarios.buscarTodos();
    buscarClientes = () => this.usuarios.buscarClientes();
    buscarPorId = (id) => this.usuarios.buscarPorId(id);
    crear = (datos) => this.usuarios.crear(datos);
    actualizar = (id, datos) => this.usuarios.actualizar(id, datos);
    eliminar = (id) => this.usuarios.eliminar(id);
}