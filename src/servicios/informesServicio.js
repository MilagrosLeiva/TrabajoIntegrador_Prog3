import { createObjectCsvWriter } from "csv-writer";
import puppeteer from "puppeteer";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class InformeServicio {

    async informeReservasCsv(datos) {
        try {
            const ruta = path.join(__dirname, "../utiles", "reservas.csv");

            const csvWriter = createObjectCsvWriter({
                path: ruta,
                header: [
                    { id: "fecha_reserva", title: "Fecha" },
                    { id: "titulo", title: "Salón" },
                    { id: "orden", title: "Turno" },
                    { id: "cliente", title: "Cliente" },
                    { id: "tematica", title: "Temática" },
                    { id: "importe_salon", title: "Importe Salón" },
                    { id: "importe_total", title: "Importe Total" }
                ]
            });

            await csvWriter.writeRecords(datos);
            return ruta;
        } catch (err) {
            console.error("Error CSV:", err);
            throw err;
        }
    }

    async informeReservasPdf(datos) {
        try {
            const plantilla = path.join(__dirname, "../utiles/informe.hbs");
            const html = fs.readFileSync(plantilla, "utf8");

            const template = handlebars.compile(html);
            const finalHtml = template({ reservas: datos });

            const browser = await puppeteer.launch({
                headless: true,
                args: ["--no-sandbox", "--disable-setuid-sandbox"]
            });

            const page = await browser.newPage();
            await page.setContent(finalHtml);

            const buffer = await page.pdf({
                format: "A4",
                printBackground: true
            });

            await browser.close();
            return buffer;

        } catch (err) {
            console.error("Error PDF:", err);
            throw err;
        }
    }
}