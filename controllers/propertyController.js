import {Price} from '../models/index.js'

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
        categories,
        prices
    })
}



export {
    adminPanel,
    create
}