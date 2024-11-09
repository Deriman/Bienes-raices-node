
const adminPanel = (req, res) => {
    res.render('properties/admin-panel', {
        pagina: 'Mis propiedades',
        header: true
    })
}


export {
    adminPanel
}