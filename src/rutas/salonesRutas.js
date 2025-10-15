import express from 'express';
import SalonesControlador from '../controladores/salonesControlador.js';

const controlador = new SalonesControlador();
const router = express.Router();

router.get('/', controlador.buscarTodos);
router.get('/:id', controlador.buscarPorId);
router.post('/', controlador.crear);
router.put('/:id', controlador.actualizar);
router.delete('/:id', controlador.eliminar);

export {router};