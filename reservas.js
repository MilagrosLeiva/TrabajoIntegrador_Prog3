    import express from 'express';
    import { router as salonesRutas } from './src/rutas/salonesRutas.js';
    import { router as serviciosRutas } from './src/rutas/serviciosRutas.js'; 

    const app = express();

    app.use(express.json());

    
    app.use('/api/v1/salones', salonesRutas);
    app.use('/api/v1/servicios', serviciosRutas);

    process.loadEnvFile();
    console.log(process.env.PUERTO)

    app.listen(process.env.PUERTO, () =>  {
        console.log(`SERVIDOR ARRIBA EN PUERTO ${process.env.PUERTO}`);


    })