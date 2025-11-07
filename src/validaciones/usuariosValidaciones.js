import { check } from "express-validator";

export const validarUsuario = [
    check("nombre")
        .notEmpty().withMessage("El nombre es obligatorio"),
    check("apellido")
        .notEmpty().withMessage("El apellido es obligatorio"),
    check("nombre_usuario")
        .notEmpty().withMessage("El nombre de usuario es obligatorio"),
    check("contrasenia")
        .notEmpty().withMessage("La contraseña es obligatoria!"),
    check("tipo_usuario")
        .notEmpty().withMessage("El tipo de usuario es obligatorio")
        .isInt({ min: 1, max: 3 }).withMessage("El tipo de usuario debe ser 1 = admin, 2=empleado, 3=cliente")
];