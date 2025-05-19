const {deleteUser }= require('../../controllers/User/deleteUser');

const deleteUserHandler= async(req,res) =>{
    const{id} = req.params
    if(!id) throw new Error('Missing ID')
    try {
        await deleteUser(id)
        return res.status(200).send('The user has been deleted')
    } catch (error) {
        return res.status(500).json({error:error.message})
    }
};

module.exports = {deleteUserHandler};