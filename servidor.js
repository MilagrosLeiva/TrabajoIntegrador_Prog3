import app from './reservas.js';

process.loadEnvFile();

app.listen(process.env.PUERTO, () => {
    console.log(`El servidor ha sido iniciado en ${process.env.PUERTO}`);
})