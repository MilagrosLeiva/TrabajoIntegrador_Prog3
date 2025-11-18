import express from "express";
import passport from "passport";
import UsuariosControlador from "../controladores/usuariosGestionControlador.js";
import autorizarUsuarios from "../middlewares/autorizarUsuarios.js";
import { validarCampos } from "../middlewares/validarCampos.js";
import { validarUsuario } from "../validaciones/usuariosValidaciones.js";
import { cache, limpiarCache } from "../middlewares/cacheMiddleware.js";
import { upload } from "../config/multer.js";




const controlador = new UsuariosControlador();
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Operaciones para la gestión de usuarios del sistema
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     UsuarioResponse:
 *       type: object
 *       description: Estructura completa de un usuario (para respuestas)
 *       properties:
 *         usuario_id:
 *           type: integer
 *           example: 10
 *         nombre:
 *           type: string
 *           example: "Milagros"
 *         apellido:
 *           type: string
 *           example: "Leiva"
 *         nombre_usuario:
 *           type: string
 *           example: "mileiva"
 *         tipo_usuario:
 *           type: integer
 *           description: 1 = Administrador, 2 = Empleado, 3 = Cliente
 *           example: 3
 *         celular:
 *           type: string
 *           nullable: true
 *           example: "3413489616"
 *         foto:
 *           type: string
 *           nullable: true
 *           example: "perfil1.png"
 *         activo:
 *           type: boolean
 *           readOnly: true
 *           example: true
 *         creado:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *           example: "2025-11-05T14:35:00Z"
 *         modificado:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *           example: "2025-11-06T10:22:00Z"
 *
 *     UsuarioCreate:
 *       type: object
 *       required:
 *         - nombre
 *         - apellido
 *         - nombre_usuario
 *         - contrasenia
 *         - tipo_usuario
 *       description: Datos requeridos para crear un nuevo usuario
 *       properties:
 *         nombre:
 *           type: string
 *           example: "Juan"
 *         apellido:
 *           type: string
 *           example: "Pérez"
 *         nombre_usuario:
 *           type: string
 *           example: "juanperez"
 *         contrasenia:
 *           type: string
 *           format: password
 *           example: "123456"
 *         tipo_usuario:
 *           type: integer
 *           description: 1 = Administrador, 2 = Empleado, 3 = Cliente
 *           example: 2
 *         celular:
 *           type: string
 *           nullable: true
 *           example: "3413000000"
 *         foto:
 *           type: string
 *           nullable: true
 *           example: "foto_perfil.png"
 *
 *     UsuarioUpdate:
 *       type: object
 *       description: Campos que pueden modificarse al actualizar un usuario
 *       properties:
 *         nombre:
 *           type: string
 *           example: "Juan"
 *         apellido:
 *           type: string
 *           example: "Pérez"
 *         nombre_usuario:
 *           type: string
 *           example: "juanperez"
 *         tipo_usuario:
 *           type: integer
 *           example: 2
 *         celular:
 *           type: string
 *           example: "3413555555"
 *         foto:
 *           type: string
 *           example: "perfil_actualizado.png"
 */

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Obtener todos los usuarios (solo Admin)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todos los usuarios activos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                 datos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UsuarioResponse'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /usuarios/clientes:
 *   get:
 *     summary: Obtener todos los usuarios clientes (Admin o Empleado)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios tipo cliente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 datos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UsuarioResponse'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Obtener un usuario por su ID (solo Admin)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del usuario a buscar
 *         schema:
 *           type: integer
 *           example: 12
 *     responses:
 *       200:
 *         description: Usuario encontrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsuarioResponse'
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Crear un nuevo usuario (solo Admin)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioCreate'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 mensaje:
 *                   type: string
 *                   example: "Usuario creado exitosamente"
 *                 id:
 *                   type: integer
 *                   example: 25
 *       400:
 *         description: Error en los datos enviados
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error al crear usuario
 */

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Actualizar un usuario existente (solo Admin)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del usuario a actualizar
 *         schema:
 *           type: integer
 *           example: 8
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioUpdate'
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al actualizar usuario
 */

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Eliminar un usuario (solo Admin)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del usuario a eliminar
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al eliminar usuario
 */
/**
 * @swagger
 * /usuarios/modificarPerfil:
 *   put:
 *     summary: Modificar el perfil del usuario autenticado
 *     description: >
 *       Permite que el usuario logueado actualice sus propios datos (nombre, apellido, nombre de usuario, celular y foto).
 *       Esta operación utiliza **multipart/form-data** para permitir el envío de una imagen.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Miriam"
 *               apellido:
 *                 type: string
 *                 example: "Gomez"
 *               nombre_usuario:
 *                 type: string
 *                 example: "mgomez@correo.com"
 *               celular:
 *                 type: string
 *                 example: "341748596"
 *               foto:
 *                 type: string
 *                 format: binary
 *                 description: Imagen de perfil (opcional)
 *     responses:
 *       200:
 *         description: Perfil actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 mensaje:
 *                   type: string
 *                   example: "Perfil actualizado correctamente"
 *       400:
 *         description: Error en los datos enviados
 *       401:
 *         description: Token inválido
 *       500:
 *         description: Error interno del servidor
 */





router.use(passport.authenticate("jwt", { session: false }));




router.get("/", autorizarUsuarios([1]), cache("30 minutes"), controlador.buscarTodos);
router.get("/clientes", autorizarUsuarios([1, 2]), cache("30 minutes"), controlador.buscarClientes);
router.put("/modificarPerfil", upload.single("foto"), controlador.modificarPerfil);
router.get("/:id", autorizarUsuarios([1]), controlador.buscarPorId);
router.post("/", autorizarUsuarios([1]), validarUsuario, validarCampos, limpiarCache, controlador.crear);
router.put("/:id", autorizarUsuarios([1]), validarUsuario, validarCampos, limpiarCache, controlador.actualizar);
router.delete("/:id", autorizarUsuarios([1]), limpiarCache, controlador.eliminar);

export { router };