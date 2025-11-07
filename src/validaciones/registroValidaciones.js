import { check } from "express-validator";

export const validarRegistro = [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("apellido", "El apellido es obligatorio").not().isEmpty(),
    check("nombre_usuario", "El email es obligatorio").isEmail(),
    check("contrasenia", "La contraseña debe tener al menos 6 caracteres").isLength({ min: 6 }),
    ];