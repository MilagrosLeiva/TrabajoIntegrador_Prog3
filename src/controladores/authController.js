import jwt from "jsonwebtoken";
import passport from "passport";

    export default class AuthController {
    login = async (req, res) => {
        passport.authenticate("local", { session: false }, (err, usuario, info) => {
        if (err || !usuario) {
            return res.status(400).json({
            estado: false,
            mensaje: "Usuario o contraseña incorrectos",
            });
        }


        
        req.login(usuario, { session: false }, (err) => {
            if (err) return res.status(500).json({ estado: false, mensaje: "Error interno" });

            const payload = {
            usuario_id: usuario.usuario_id,
            tipo_usuario: usuario.tipo_usuario,
            };

            const token = jwt.sign(payload, "mi_clave_secreta", { expiresIn: "1h" });

            return res.json({
            estado: true,
            mensaje: "Ingreso correcto",
            token,
            });
        });
        })(req, res);
    };
    }

    