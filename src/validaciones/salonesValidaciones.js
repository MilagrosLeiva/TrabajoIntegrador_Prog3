import { check } from "express-validator";

    export const validarSalon = [
    check("titulo")
        .notEmpty().withMessage("El titulo esobligatorio"),

    check("direccion")
        .notEmpty().withMessage("La direccion es obligatoria"),

    check("latitud")
        .optional({ nullable: true })
        .isDecimal({ decimal_digits: '1,8' }).withMessage("La latitud debe ser un número decimal con hasta 8 decimales"),

    check("longitud")
        .optional({ nullable: true })
        .isDecimal({ decimal_digits: '1,8' }).withMessage("La longitud debe ser un número decimal con hasta 8 decimales"),

    check("capacidad")
        .notEmpty().withMessage("La capacidad es obligatoria")
        .isInt({ min: 1 }).withMessage("La capacidad debe ser un numero entero mayor que 0"),

    check("importe")
        .notEmpty().withMessage("El importe es obligatorio")
        .isDecimal({ decimal_digits: '1,2' }).withMessage("El importe debe ser un número decimal válido,max dos decimales"),
    ];