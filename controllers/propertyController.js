import { validationResult } from 'express-validator'
import { Price, Category, Property } from '../models/index.js' //Modelos con las asociaciones
import { unlink } from 'node:fs/promises'


const adminPanel = async (req, res) => {

    // Query strings /my-properties?pagina=1&orden=DESC...
    const { pagina: paginaActual } = req.query
    // Validar mediante expresión regular para números
    const expression = /^[0-9]$/
    if (!expression.test(paginaActual)) {
        return res.redirect('/my-properties?pagina=1')
    }

    try {
        const { id } = req.user

        // Establecer paginador mediante el limit y offset
        const limit = 4
        const offset = ((paginaActual * limit) - limit)

        const properties = await Property.findAll({
            limit,
            offset,
            where: {
                user_id: id
            },
            include: [
                { model: Category, as: 'category' },
                { model: Price, as: 'price' } // JOIN DE DOS TABLAS
            ]
        })

        res.render('properties/admin-panel', { //Renderiza la pagina principal desde de autenticarse
            pagina: 'Mis propiedades',
            csrf: req.csrfToken(),
            properties
        })

    } catch (error) {
        console.log(error)
    }

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
    if (!validation.isEmpty()) {
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
    const { titulo: title, descripcion: description, habitaciones, estacionamientos, wc, calle, lat, lng, precio: price_id, categoria: category_id } = req.body
    const { id: user_id } = req.user
    try {
        const propertySaved = await Property.create({
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
        // Se redirecciona a la ruta de añadir imagen pasandole el id
        const { id } = propertySaved
        res.redirect(`/my-properties/add-image/${id}`)
    } catch (error) {
        console.log(error)
    }
}

const addImage = async (req, res) => {

    const { id } = req.params
    // Validar que la propiedad exista por id
    const property = await Property.findByPk(id)
    if (!property) {
        return res.redirect('/my-properties')
    }
    // Validar que la propiedad este publicada
    if (property.publicado) {
        return res.redirect('/my-properties')
    }
    // Validar que el usuario que va añadir una imagen es el usuario quien creo la propiedad
    if (req.user.id.toString() !== property.user_id.toString()) {
        return res.redirect('/my-properties')
    }

    res.render('properties/add-image', {
        pagina: `Agregar imagen: ${property.title}`,
        csrf: req.csrfToken(),
        property
    })
}

const storageImage = async (req, res, next) => {
    const { id } = req.params
    // Validar que la propiedad exista por id
    const property = await Property.findByPk(id)
    if (!property) {
        return res.redirect('/my-properties')
    }
    // Validar que la propiedad este publicada
    if (property.publicado) {
        return res.redirect('/my-properties')
    }
    // Validar que el usuario que va añadir una imagen es el usuario quien creo la propiedad
    if (req.user.id.toString() !== property.user_id.toString()) {
        return res.redirect('/my-properties')
    }

    try {
        // console.log(req.file) // Son los datos de la imagen provenientes del middleware con multer
        // Guardamos el nombre en la propiedad images 
        property.images = req.file.filename
        // Ponemos el campo publicado a true
        property.publicado = true
        // Lo guardamos en la base de datos
        await property.save()
        next()
    } catch (error) {
        console.log(error)
    }
}

const edit = async (req, res) => {
    const { id } = req.params
    // Validar que la propiedad exista por id
    const property = await Property.findByPk(id)
    if (!property) {
        return res.redirect('/my-properties')
    }
    // Validar que el usuario que va añadir una imagen es el usuario quien creo la propiedad
    if (req.user.id.toString() !== property.user_id.toString()) {
        return res.redirect('/my-properties')
    }
    // Obtiene los datos necesarios de la BD para poblar los select 
    const [categories, prices] = await Promise.all([
        Category.findAll(),
        Price.findAll()
    ])
    //Renderiza el formulario para editar propiedades
    res.render('properties/edit', {
        pagina: 'Editar la propiedad',
        csrf: req.csrfToken(),
        categories,
        prices,
        datos: property
    })
}

const changesSave = async (req, res) => {

    console.log(req.body)
    let validation = validationResult(req)
    // Resultados de la validación
    if (!validation.isEmpty()) {
        const [categories, prices] = await Promise.all([
            Category.findAll(),
            Price.findAll()
        ])
        //Renderiza el formulario para editar propiedades
        res.render('properties/edit', {
            pagina: 'Editar la propiedad',
            csrf: req.csrfToken(),
            categories,
            prices,
            errors: validation.array(),
            datos: req.body
        })
    }
    const { id } = req.params
    // Validar que la propiedad exista por id
    const property = await Property.findByPk(id)
    if (!property) {
        return res.redirect('/my-properties')
    }
    // Validar que el usuario que va añadir una imagen es el usuario quien creo la propiedad
    if (req.user.id.toString() !== property.user_id.toString()) {
        return res.redirect('/my-properties')
    }
    try {
        const { title, description, habitaciones, estacionamientos, wc, calle, lat, lng, precio: price_id, categoria: category_id } = req.body
        property.set({
            title,
            description,
            estacionamientos,
            wc,
            habitaciones,
            price_id,
            category_id,
            calle,
            lat,
            lng
        })
        await property.save()
        res.redirect('/my-properties')
    } catch (error) {
        console.log({ error })
    }
}

const deleteProperty = async (req, res) => {
    const { id } = req.params
    // Validar que la propiedad exista por id
    const property = await Property.findByPk(id)
    if (!property) {
        return res.redirect('/my-properties')
    }
    // Validar que el usuario que va añadir una imagen es el usuario quien creo la propiedad
    if (req.user.id.toString() !== property.user_id.toString()) {
        return res.redirect('/my-properties')
    }
    // Eliminar la imagen asociada dicha propiedad
    await unlink(`public/uploads/${property.images}`)
    // Eliminar propiedad de la BD
    await property.destroy()
    res.redirect('/my-properties')
}

const showProperty = async (req, res) => {
    const { id } = req.params

    const property = await Property.findByPk(id, {
        include: [
            { model: Category, as: 'category' },
            { model: Price, as: 'price' } // JOIN DE DOS TABLAS
        ]
    })
    if (!property) {
        res.redirect('/404')
    }

    res.render('properties/show', {
        property,
        pagina: property.title
    })
}

export {
    adminPanel,
    create,
    save,
    edit,
    deleteProperty,
    changesSave,
    addImage,
    storageImage,
    showProperty
}