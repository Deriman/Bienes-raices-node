import express  from "express";
import { addImage, adminPanel, changesSave, create, deleteProperty, edit, save, storageImage } from "../controllers/propertyController.js";
import routesProtected from "../middleware/routesProtected.js";
import upload from "../middleware/uploadImage.js";
import { body } from 'express-validator'

const router = express.Router()
// El navegador no soporta todos los verbod de http, solo post y get. Para ello se usa un Framework tipo Angular, React
// En cambio cuando la finalidad es una api si se diponen de los verbos http -> get, post, delete y put
router.get('/my-properties', routesProtected, adminPanel)
router.get('/my-properties/create', routesProtected, create)
router.post('/my-properties/create', 
    routesProtected,
    // Validaciones de los campos del formulario
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
router.get('/my-properties/add-image/:id', routesProtected, addImage)
router.post('/my-properties/add-image/:id',
    routesProtected,
    upload.single('image'), // una sola imagen
    // upload.array varias imagenes
    storageImage
)
router.get('/my-properties/edit/:id', routesProtected, edit)

router.post('/my-properties/edit/:id', 
    routesProtected,
    // Validaciones de los campos del formulario
    body('title').notEmpty().withMessage('El campo titulo no puede ir vacío.'),
    body('description')
        .notEmpty().withMessage('El campo descripcion no puede ir vacío.')
        .isLength({ max: 200}).withMessage('El campo descripcion es demasiado largo.'),
    body('categoria').isNumeric().withMessage('Selecciona una categoria para la propiedad.'),
    body('habitaciones').isNumeric().withMessage('Selecciona las habitaciones que tiene la propiedad.'),
    body('precio').isNumeric().withMessage('Selecciona un rango de precios para la propiedad'),
    body('estacionamientos').isNumeric().withMessage('Selecciona los estacionamientos que tiene la propiedad.'),
    body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa.'),
    changesSave
)

router.post('/my-properties/delete/:id', routesProtected, deleteProperty)

export default router