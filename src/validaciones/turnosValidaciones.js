import { check } from "express-validator";

export const validarTurno = [
    check("orden")
        .notEmpty().withMessage("El campo orden es obligatorio")
        .isInt({ min: 1 }).withMessage("El orden debe ser un número entero positivo"),

    check("hora_desde")
        .notEmpty().withMessage("La hora de inicio es obligatoria")
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage("El formato de hora debe ser HH:MM (24h)"),

    check("hora_hasta")
        .notEmpty().withMessage("La hora de fin es obligatoria")
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage("El formato de hora debe ser HH:MM (24h)")
];