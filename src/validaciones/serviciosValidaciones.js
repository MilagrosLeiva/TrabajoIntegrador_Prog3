import { check } from "express-validator";

export const validarServicio = [
    check("descripcion")
        .notEmpty().withMessage("La descripcion es obligatoria"),
    check("importe")
        .notEmpty().withMessage("El importe es obligatorio")
        .isDecimal({ decimal_digits: '1,2' }).withMessage("El importe debe ser un numero decimal valido,maximo 2 decimales"),
];