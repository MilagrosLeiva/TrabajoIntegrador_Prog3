import Servicios from "../db/servicios.js";

export default class ServiciosServicio {

    constructor() {
        this.servicios = new Servicios();
    }

    buscarTodos = () => this.servicios.buscarTodos();
    buscarPorId = (id) => this.servicios.buscarPorId(id);
    crear = (datos) => this.servicios.crear(datos);
    actualizar = (id, datos) => this.servicios.actualizar(id, datos);
    eliminar = (id) => this.servicios.eliminar(id);
}