var User = require('../schemas/user.schema');
var bcrypt = require('bcrypt');
var salt = 10;

async function addUser(req, res) {
    try {
        console.log(req.body)
        if (!req.body.password || !req.body.fullName || !req.body.email) {
            return res.status(400).send({error:'Falta un campo obligatorio'})
        }
        req.body.password = await bcrypt.hash(req.body.password, salt);
    
    let newUser = new User(req.body);
    await newUser.save()
    res.send({usuarioNuevo : newUser})
} catch(error){
        res.status(404).send(error)
    }
}

async function getUsers(req, res) {
    const usuariosDB = await User.find()
    res.send({
        users: usuariosDB
    })
}
async function getUser(req, res) {
    //ID que recibicomo como un query param desde el endpoint
    const userId = req.query.user_id;
    //buscamos especificamente ese id en nuestra colleccion de users
    const user = await User.findById(userId);
    if (!user) return res.status(404).send('No se encuntro el usuario que busca')
    // const id = req.params.user_id
    return res.status(200).send({
        user: user
    });
}
async function deleteUser(req, res) {
    const UserIdDelete = req.query.user_id_delete;
    const userDelete = await User.findByIdAndDelete(UserIdDelete);
    if (!userDelete) return res.status(404).send('No se encuntro el usuario que desea borrar')

    return res.status(200).send(`El usuario ${userDelete.email} ha sido borrado correctamente`);
}

async function updateUser(req, res) {
    const id = req.params.upd_id;
    const userChangesToApply = req.body;
    const updatedUser = await User.findByIdAndUpdate(id, userChangesToApply, {
        new: true});
    if (!updatedUser) return res.status(404).send('No se encuntro el usuario que desea modificar');
    return res.status(200).send(updatedUser);

}

async function login(req, res){
    try{
        const email = req.body.email;
        const password = req.body.password;
        const userDB = await User.findOne({email});
        if(!userDB) return res.status(404).send({msg:'El usuario no existe en nuestra base de datos'});
        const isValidPassword = await bcrypt.compare(password, userDB.password);
        if(!isValidPassword) return res.status(401).send({msg: 'Alguno de los datos no es correcto'});
        console.log(userDB)
        userDB.password = undefined;
        console.log(userDB)
        return res.status(200).send({
            ok: true,
            msg:'Login correcto',
            user: userDB,
        })
    } catch(error){
        res.status(400).send(error)
    }
}

module.exports = {
    addUser,
    getUsers,
    getUser,
    deleteUser,
    updateUser,
    login
}