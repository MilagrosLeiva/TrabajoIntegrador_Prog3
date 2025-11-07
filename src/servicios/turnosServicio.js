import Turnos from "../db/turnos.js";

export default class TurnosServicio {
    constructor() {
        this.turnos = new Turnos();
    }

    buscarTodos = () => this.turnos.buscarTodos();
    buscarPorId = (id) => this.turnos.buscarPorId(id);
    crear = (datos) => this.turnos.crear(datos);
    actualizar = (id, datos) => this.turnos.actualizar(id, datos);
    eliminar = (id) => this.turnos.eliminar(id);
}