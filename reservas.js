
import express from "express";
import passport from "passport";
import morgan from "morgan";
import fs from "fs";
import { estrategia, validacion } from "./src/config/passport.js";
import { router as v1SalonesRutas } from "./src/rutas/salonesRutas.js";
import { router as v1AuthRouter } from "./src/rutas/authRutas.js";
import { router as v1ServiciosRutas } from './src/rutas/serviciosRutas.js';
import { router as v1TurnosRutas } from './src/rutas/turnosRutas.js';
import { router as v1UsuariosRutas } from './src/rutas/usuariosRutas.js';
import { router as v1ReservasRutas } from "./src/rutas/reservasRutas.js";
import { router as registroRutas } from "./src/rutas/registroRutas.js";
import { swaggerDocs, swaggerUi } from "./swagger.js";
import cors from "cors";




const app = express();



app.use(cors());
app.use(express.json());
passport.use(estrategia);
passport.use(validacion);
app.use(passport.initialize());
app.use(express.static("public"));



// MORGAN LOGS




let log = fs.createWriteStream("./access.log", { flags: "a" });
app.use(morgan("combined"));
app.use(morgan("combined", { stream: log }));



// RUTAS!!!


app.use("/api/v1/auth", v1AuthRouter);
app.use("/api/v1/salones", v1SalonesRutas);
app.use('/api/v1/servicios', v1ServiciosRutas);
app.use('/api/v1/turnos', v1TurnosRutas);
app.use('/api/v1/usuarios', v1UsuariosRutas);
app.use("/api/v1/reservas", v1ReservasRutas);
app.use("/api/v1/registro", registroRutas);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));




export default app;