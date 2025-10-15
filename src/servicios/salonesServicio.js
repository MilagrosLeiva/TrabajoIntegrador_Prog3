import Salones from "../db/salones.js";

export default class SalonesServicio {

    constructor() {
        this.salones = new Salones();
    }

    buscarTodos = () => this.salones.buscarTodos();
    buscarPorId = (id) => this.salones.buscarPorId(id);
    crear = (datos) => this.salones.crear(datos);
    actualizar = (id,datos) => this.salones.actualizar(id,datos);
    eliminar = (id) => this.salones.eliminar(id);
}