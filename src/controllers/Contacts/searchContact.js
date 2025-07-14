const { Contacts } = require("../../db");
const { Op } = require("sequelize");

const searchContact = async (search) => {
  const contactsFiltered = await Contacts.findAll({
    where: {
      [Op.or]: [
        { name: { [Op.iLike]: `%${search}%` } },
        { userName: { [Op.iLike]: `%${search}%` } },
      ],
    },
  });

  if (!contactsFiltered.length)
    throw new Error("There are not contacts that match the search");

  return contactsFiltered;
};

module.exports = { searchContact };
