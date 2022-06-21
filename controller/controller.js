const User = require('../model/model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const multer = require('multer')

async function userRegister(req, res) {
    const { firstname, lastname, username, password } = req.body;

    if (!firstname || !lastname || !username || !password) {
        return res.status(422).json({ error: "plz fill the field properly!" });
    }

    try {
       
        const userExist = await User.User.findOne({ username: username })

        if (userExist) {
            return res.status(422).json({ error: "username already exist" });
        }

        const user = new User({ firstname, lastname, username, password });

        await user.save();

        res.status(201).json({ message: "user registration succesfully " });

    } catch (error) {
        console.log(error);
    }
}

async function userLogin(req, res) {
    try {
        let token;
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Plz filled the data" })
        }
        const userLogin = await User.User.findOne({ username: username });

        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password)
        
            token = await userLogin.generateAuthToken();
            console.log(token);

            res.cookie("jwtoken", token , {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true
            })
           
            if (!isMatch) {
                res.status(400).json({ error: "Invalid credentials " });
            } else {
                res.json({ message: "user login successfully" })
            }

        } else {
            res.status(400).json({ error: "Invalid credentials " });
        }

    } catch (error) {
         console.log(error);
    }
}

async function fetchUserList(req,res) {
    let data = await User.find({})
    let filter =  await data.map(v => Object.assign({}, { username: v.username }))
    console.log(filter);
    return res.json(filter);
}

async function fetchUserDetails(req,res) {
    let data = await User.find({});
    let filter = await data.map(v => Object.assign({}, {username: v.username , firstname: v.firstname , lastname: v.lastname}))
    console.log(filter);
    return res.json(filter);
}

async function addProduct(req,res) {
    var storage = multer.diskStorage({
        destination: (req, file, callBack) => {
            callBack(null, './uploads/')    
        },
        filename: (req, file, callBack) => {
            callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
        }
    })
     
    var upload = multer({
        storage: storage
    });
    const {file} = req.body;
    console.log(file);
    res.status(500).send('ok');
}


module.exports = {
    userRegister,
    userLogin,
    fetchUserList,
    fetchUserDetails,
    addProduct
}