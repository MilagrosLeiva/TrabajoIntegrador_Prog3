import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

    const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
        title: "API - Sistema de Reservas de Salones",
        version: "1.0.0",
        description:
            "Documentación de la API del proyecto final integrador.Contiene los endpoints principales del sistema.",
        },
        servers: [
        {
            url: "http://localhost:3000/api/v1",
            description: "Servidor local",
        },
        ],
    },
    apis: ["./src/rutas/*.js"], 
    };

    const swaggerDocs = swaggerJSDoc(swaggerOptions);

    export { swaggerDocs, swaggerUi };