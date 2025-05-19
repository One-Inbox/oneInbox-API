const {getAllContacts} = require("../../controllers/Contacts/getAllContacts")
const {searchContact} = require("../../controllers/Contacts/searchContact")

const getAllContactsHandler = async(req, res) => {
   const {name } = req.query;
   
   try {
      const search = name;
      const allContacts = search ? await searchContact(search): await getAllContacts()
      
      !allContacts.length ? res.status(400).send('Contacts not found') : res.status(200).json(allContacts)
   
   } catch (error) {
    res.status(500).json({error: error.message})
 }
}

module.exports = {getAllContactsHandler}

