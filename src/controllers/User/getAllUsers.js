const { User, Business,  MsgSent } = require('../../db');

const getAllUsers = async () => {
  const users = await User.findAll(
    { order: [
      ['name'],
  ],
include:[
    {
        model: Business,
        attributes: ['id', 'name']
    },
    {
        model: MsgSent,
        attributes: ['id', 'toData', 'message', 'timestamp', 'received'],
    }
]});
  if(!users)  throw new Error ('Users not found');
  return users;
};

module.exports = {getAllUsers};