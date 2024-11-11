import express  from "express";
import { adminPanel, create, save } from "../controllers/propertyController.js";
import routesProtected from "../middleware/routesProtected.js";
import { body } from 'express-validator'

const router = express.Router()

router.get('/my-properties', routesProtected, adminPanel)
router.get('/my-properties/create', create)
router.post('/my-properties/create', 
    body('titulo').notEmpty().withMessage('El campo titulo no puede ir vacío.'),
    body('descripcion')
        .notEmpty().withMessage('El campo descripcion no puede ir vacío.')
        .isLength({ max: 200}).withMessage('El campo descripcion es demasiado largo.'),
    body('categoria').isNumeric().withMessage('Selecciona una categoria para la propiedad.'),
    body('habitaciones').isNumeric().withMessage('Selecciona las habitaciones que tiene la propiedad.'),
    body('precio').isNumeric().withMessage('Selecciona un rango de precios para la propiedad'),
    body('estacionamientos').isNumeric().withMessage('Selecciona los estacionamientos que tiene la propiedad.'),
    body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa.'),
    save
)

export default router