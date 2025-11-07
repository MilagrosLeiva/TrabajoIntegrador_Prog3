import express from "express";
import { validarCampos } from "../middlewares/validarCampos.js";
import { validarRegistro } from "../validaciones/registroValidaciones.js";
import RegistroControlador from "../controladores/registroControlador.js";

const router = express.Router();
const controlador = new RegistroControlador();

router.post("/", validarRegistro, validarCampos, controlador.registrar);

export { router };