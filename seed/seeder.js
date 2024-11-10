import { exit } from 'node:process'
import categories from './categories.js'
import prices from './prices.js'
import Category from '../models/Category.js'
import Price from '../models/Price.js'
import db from '../config/db.js'

const importData = async () => {
    try {
        // Nos autenticamos
        await db.authenticate()
        // Creamos las columnas
        await db.sync()
        // Insertamos los datos; bulkCreate inserta varios datos a la vez
        //Doble procede sin ambos son dependintes, es decir que el segundo await necesita los datos del 1º
        // await Category.bulkCreate(categories)
        // await Price.bulkCreate(prices)
        // Se hace la inserción de forma paralela
        await Promise.all([
            Category.bulkCreate(categories),
            Price.bulkCreate(prices)
        ])
        console.log('Datos importados correctamente')
        // Finaliza sin error
        exit()
    } catch (error) {
        console.log(error)
        exit(1)
    }

}

const deleteData = async () => {
    try {
        // await Promise.all([
        //     Category.destroy({ where: {}, truncate: true }),
        //     Price.destroy({ where: {}, truncate: true })
        // ])
        await db.sync({force: true})
        console.log('Datos borrados correctamente')
        // Finaliza sin error
        exit()
    } catch (error) {
        console.log(error)
        exit(1)
    }
}   

// Genera la importación mediante un script que lo ejecuta
// ["node, ./seed/seeder.js, -i"]
if (process.argv[2] === '-i') {
    importData()
}
if (process.argv[2] === '-d') {
    deleteData()
}