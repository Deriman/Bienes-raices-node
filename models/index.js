// +++++ ASOCIACIONES ++++++

import Property from  './Property.js'
import Category from  './Category.js'
import User from  './User.js'
import Price from  './Price.js'

//Price.hasOne(Property)
Property.belongsTo(Price, { foreignKey: 'price_id'})
Property.belongsTo(Category, { foreignKey: 'category_id'})
Property.belongsTo(User, { foreignKey: 'user_id'})


export {
    Property,
    Price,
    User,
    Category
}