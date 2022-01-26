const express = require('express');
const monk = require('monk');
const Joi = require('joi');
const routes = express.Router();

const db = monk('localhost/regi');
const users = db.get('users');


const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    userName: Joi.string().min(3).required(),
    password: Joi.string().min(7).required(),
});


routes.get('/', (req, res) => {
    res.json({
        message: 'Hello,World From Routes'
    });
});

routes.post('/register', async (req, res) => {
    const { name, email, userName, password } = req.body;

    try {
        const valdRes = await userSchema.validateAsync({
            name,
            email,
            userName,
            password
        });
        if (valdRes) {
            const userExist = await users.findOne({ email: email });
            if (userExist) {
                return res.status(422).json({
                    message: 'User that Email Already Exist'
                });
            }
            else {
                users.insert(valdRes);
                return res.status(201).json({
                    message: 'User Registered Successfully'
                });
            }
        } else {
            return res.status(422).json({
                message: 'Cannot Register the User'
            });
        }
    } catch (error) {
        res.status(422);
        res.json({
            message: 'Hey, Please Enter Valid Format!!!'
        });
        console.log(error);
    }
});

routes.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(422).json({
                message: 'Hey, Email and Password Are required!!!'
            });
        }
        const userLogin = await users.findOne({ email: email });
        if (userLogin) {
            const isMatch = await users.findOne({ password: password });
            if (!isMatch) {
                return res.status(422).json({
                    message: 'Hey, Email and Password Are Incorrect!!!'
                });
            }
            return res.status(201).json({
                message: 'User Logged In Successfully!!!'
            });
        }
    } catch (error) {
        return res.status(422).json({
            message: error
        });
    }

});


routes.get('/about', (req, res) => {
    res.json({
        message: 'Hello,From About Js'
    });
});

module.exports = routes;