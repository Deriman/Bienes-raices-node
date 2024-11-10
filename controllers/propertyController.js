
const adminPanel = (req, res) => {
    res.render('properties/admin-panel', {
        pagina: 'Mis propiedades',
        header: true
    })
}

const create = (req, res) => {
    res.render('properties/create', {
        pagina: 'Crear una propiedad',
        header: true
    })
}



export {
    adminPanel,
    create
}