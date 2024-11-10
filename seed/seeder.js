import { exit } from 'node:process'
import categories from './categories.js'
import Category from '../models/Category.js'
import db from '../config/db.js'

const importData = async () => {
    try {
        // Nos autenticamos
        await db.authenticate()
        // Creamos las columnas
        await db.sync()
        // Insertamos los datos; bulkCreate inserta varios datos a la vez
        await Category.bulkCreate(categories)
        console.log('Datos importados correctamente')
        // Finaliza sin error
        exit()
    } catch (error) {
        console.log(error)
        exit(1)
    }

}
// ["node, ./seed/seeder.js, -i"]
if (process.argv[2] === '-i') {
    importData()
}