import { validationResult } from 'express-validator'
import { Price, Category, Property } from '../models/index.js' //Modelos con las asociaciones

const adminPanel = (req, res) => {
    res.render('properties/admin-panel', {
        pagina: 'Mis propiedades',
        header: true
    })
}

const create = async (req, res) => {

    const [categories, prices] = await Promise.all([
        Category.findAll(),
        Price.findAll()
    ])
    res.render('properties/create', {
        pagina: 'Crear una propiedad',
        header: true,
        csrf: req.csrfToken(),
        categories,
        prices,
        datos: {}
    })
}

const save = async (req, res) => {

    let validation = validationResult(req)

    if (!validation.isEmpty()){
        const [categories, prices] = await Promise.all([
            Category.findAll(),
            Price.findAll()
        ])
        return res.render('properties/create', {
            pagina: "Crear una propiedad",
            header: true,
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

    const { id } = propertySaved
    res.redirect(`/properties/add-image/:${id}`)

}



export {
    adminPanel,
    create, 
    save
}