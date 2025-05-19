const {Contacts} = require("../../db");
const {Op} = require('sequelize');

const searchContact = async(search) => {
    const contactsFiltered = await  Contacts.findAll({
        where: {name: { [Op.iLike]: `%${search}%`}}
    })
    
    if(!contactsFiltered.length) throw new Error('There are not contacts that match the search')
    
    return contactsFiltered
}

module.exports = {searchContact}


