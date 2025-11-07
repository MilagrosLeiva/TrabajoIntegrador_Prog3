import { check } from "express-validator";


    export const validarReserva = [
    check("fecha_reserva")
        .notEmpty().withMessage("La fecha de reserva es obligatoria")
        .isISO8601({ strict: true }).withMessage("La fecha debe tener formato válido (YYYY-MM-DD)"),

    check("salon_id")
        .notEmpty().withMessage("Debe indicar el salón")
        .isInt({ gt: 0 }).withMessage("El ID del salón debe ser entero positivo"),


    check("turno_id")
        .notEmpty().withMessage("Debe indicar el turno")
        .isInt({ gt: 0 }).withMessage("El ID del turno debe ser entero positivo"),

    check("importe_salon")
        .notEmpty().withMessage("El importe del salón es obligatorio")
        .isDecimal({ decimal_digits: "1,2" }).withMessage("El importe del salón debe ser decimal (máx 2 decimales)"),

    check("importe_total")
        .notEmpty().withMessage("El importe total es obligatorio")
        .isDecimal({ decimal_digits: "1,2" }).withMessage("El importe total debe ser decimal (máx 2 decimales)"),

    check("foto_cumpleaniero").optional({ nullable: true }).isString().withMessage("La foto debe ser texto"),
    check("tematica").optional({ nullable: true }).isString().withMessage("La temática debe ser texto"),

    check("servicios").optional().isArray().withMessage("Servicios debe ser un array"),
    check("servicios.*.servicio_id")
        .optional()
        .isInt({ gt: 0 }).withMessage("Cada servicio_id debe ser entero positivo"),
    check("servicios.*.importe")
        .optional()
        .isDecimal({ decimal_digits: "1,2" }).withMessage("Cada importe de servicio debe ser decimal (máx 2 decimales)")
    ];