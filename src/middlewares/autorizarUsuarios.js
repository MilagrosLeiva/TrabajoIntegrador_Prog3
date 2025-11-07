export default function autorizarUsuarios(perfilesAutorizados =[]) {

    return (req, res, next) => {
        const usuario = req.user;

        if (!usuario|| !perfilesAutorizados.includes(usuario.tipo_usuario))  {
            return res.status(403).json({
                estado:false,
                mensaje: "acceso denegado "
            });
        }
        next();

    };
}