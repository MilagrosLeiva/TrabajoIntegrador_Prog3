import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import UsuariosService from "../servicios/usuariosServicios.js";



    const estrategia = new LocalStrategy(
    {
        usernameField: "nombre_usuario",
        passwordField: "contrasenia",
    },
    async (nombre_usuario, contrasenia, done) => {
        try {
        const usuariosServicio = new UsuariosService();
        const usuario = await usuariosServicio.buscar(nombre_usuario, contrasenia);
        if (!usuario) {
            return done(null, false, { mensaje: "Usuario o contraseña incorrectos" });
        }
        return done(null, usuario, { mensaje: "Login correcto!" });
        } catch (exc) {
        done(exc);
        }
    }
    );



    const validacion = new JwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: "mi_clave_secreta", // 🔑 Fija, SIN dotenv
    },
    async (jwtPayload, done) => {
        try {
        const usuariosServicio = new UsuariosService();
        const usuario = await usuariosServicio.buscarPorId(jwtPayload.usuario_id);
        if (!usuario) {
            return done(null, false, { mensaje: "Token inválido" });
        }
        return done(null, usuario);
        } catch (exc) {
        done(exc, false);
        }
    }
    );

    export { estrategia, validacion };

