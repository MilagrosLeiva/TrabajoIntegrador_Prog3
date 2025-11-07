import nodemailer from "nodemailer";
import fs from "fs";
import handlebars from "handlebars";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class NotificacionesService {
    constructor() {
        

        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS,
            },
        });
    }


    async enviarCorreo(datos) {
        try {
            const templatePath = path.join(__dirname, "../utiles/plantillaReservas.hbs");

            if (!fs.existsSync(templatePath)) {
                throw new Error(`No se encontró la plantilla: ${templatePath}`);
            }


            const source = fs.readFileSync(templatePath, "utf8");
            const template = handlebars.compile(source);
            const html = template(datos);
            const destinatarios = [datos.emailCliente, process.env.EMAIL_USER];




            
            const mailOptions = {
                from: `"Reservas de Salones🎉" <${process.env.EMAIL_USER}>`,
                to: datos.emailCliente,            
                bcc: process.env.EMAIL_USER,       
                subject: "Nueva reserva registrada",
                html,
                };


            await this.transporter.sendMail(mailOptions);
            console.log("Correo enviado a:", destinatarios.join(", "));

            return {
                estado: true,
                mensaje: "Correo enviado correctamente",
            };

        } catch (error) {
            console.error("Eror al enviar correo:", error);
            return {
                estado: false,
                mensaje: "Error al enviar correo de notificacion",
            };
        }
    }
}