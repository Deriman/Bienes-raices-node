import { validationResult } from 'express-validator'
import { Price, Category } from '../models/index.js'

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
        prices
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
            errors: validation.array()
        })
    }

}



export {
    adminPanel,
    create, 
    save
}