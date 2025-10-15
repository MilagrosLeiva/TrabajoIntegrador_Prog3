import express from 'express';
import ServiciosControlador from '../controladores/serviciosControlador.js';

const controlador = new ServiciosControlador();
const router = express.Router();

router.get('/', controlador.buscarTodos);
router.get('/:id', controlador.buscarPorId);
router.post('/', controlador.crear);
router.put('/:id', controlador.actualizar);
router.delete('/:id', controlador.eliminar);

export { router };