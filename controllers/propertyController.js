
const adminPanel = (req, res) => {
    res.render('properties/admin-panel', {
        pagina: 'Mis propiedades'
    })
}


export {
    adminPanel
}