import { validationResult } from 'express-validator'
import { Price, Category, Property } from '../models/index.js' //Modelos con las asociaciones

const adminPanel = (req, res) => {
    res.render('properties/admin-panel', { //Renderiza la pagina principal desde de autenticarse
        pagina: 'Mis propiedades',
    })
}

const create = async (req, res) => {
    // Obtiene los datos necesarios de la BD para poblar los select 
    const [categories, prices] = await Promise.all([
        Category.findAll(),
        Price.findAll()
    ])
    //Renderiza el formulario para crear propiedades
    res.render('properties/create', {
        pagina: 'Crear una propiedad',
        csrf: req.csrfToken(),
        categories,
        prices,
        datos: {}
    })
}

const save = async (req, res) => {

    let validation = validationResult(req)
    // Resultados de la validación
    if (!validation.isEmpty()){
        const [categories, prices] = await Promise.all([
            Category.findAll(),
            Price.findAll()
        ])
        return res.render('properties/create', {
            pagina: "Crear una propiedad",
            csrf: req.csrfToken(),
            categories,
            prices,
            errors: validation.array(),
            datos: req.body
        })
    }

    // Añadir la propiedad a BD
    const { titulo:title, descripcion:description, habitaciones, estacionamientos, wc, calle, lat, lng, precio:price_id, categoria:category_id } = req.body
    const { id: user_id }= req.user
    try {
        const propertySaved = Property.create({
            title,
            description,
            habitaciones,
            estacionamientos,
            wc, 
            calle, 
            lat,
            lng, 
            price_id,
            category_id,
            user_id,
            images: ''
        })
    } catch (error) {
        console.log(error)
    }
    // Se redirecciona a la ruta de añadir imagen pasandole el id
    const { id } = propertySaved
    res.redirect(`/my-properties/add-image/${id}`)
}

const addImage = async (req, res) => {

    res.render('properties/add-image', {
        pagina: 'Agregar imagen'
    })
}



export {
    adminPanel,
    create, 
    save, 
    addImage
}