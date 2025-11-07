import express from "express";
import AuthController from "../controladores/authController.js";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validarCampos.js";

const router = express.Router();
const authController = new AuthController();


/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Rutas relacionadas con el inicio de sesión y generación de tokens JWT
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - nombre_usuario
 *         - contrasenia
 *       description: Credenciales necesarias para iniciar sesión
 *       properties:
 *         nombre_usuario:
 *           type: string
 *           example: "mileiva"
 *         contrasenia:
 *           type: string
 *           format: password
 *           example: "123456"
 *
 *     LoginResponse:
 *       type: object
 *       description: Respuesta exitosa al iniciar sesión
 *       properties:
 *         estado:
 *           type: boolean
 *           example: true
 *         mensaje:
 *           type: string
 *           example: "Ingreso correcto"
 *         token:
 *           type: string
 *           description: Token JWT que debe incluirse en el encabezado Authorization
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *
 *     LoginError:
 *       type: object
 *       description: Respuesta cuando las credenciales son inválidas
 *       properties:
 *         estado:
 *           type: boolean
 *           example: false
 *         mensaje:
 *           type: string
 *           example: "Usuario o contraseña incorrectos"
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión en el sistema y obtener un token JWT
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       description: Credenciales del usuario
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Usuario o contraseña incorrectos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginError'
 *       500:
 *         description: Error interno del servidor
 */












    router.post(
    "/login",
    [
        check("nombre_usuario", "El nombre de usuario es requerido.").not().isEmpty(),
        check("contrasenia", "La contraseña es requerida.").not().isEmpty(),
        validarCampos,
    ],
    authController.login
    );

    export { router };