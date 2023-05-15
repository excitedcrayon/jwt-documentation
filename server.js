const express = require('express');
const bcrypt = require('bcryptjs');
const bodyparser = require('body-parser');
const jsonwebtoken = require('jsonwebtoken');
const { User } = require('./models');
const { dbConnection } = require('./dbConnection');

const app = express();
const PORT = 3000 || process.env.PORT;
const SECRET_JWT_CODE = "jsCJxpibXWaWJuMengADOXuZJkDgzqVMctOfZByg";

// connect to database
dbConnection();

app.use(express.json());

app.listen(PORT, (error) => {
    if(error){
        console.log(`Error trying to start express server on PORT: ${PORT}`);
    }
    console.log(`Express server listening on PORT: ${PORT}`);
});

/**
 * Routes
 */
app.post('/user/register', (req, res) => {
    if( !req.body.email || !req.body.password ){
        res.json({
            success: false,
            error: "Please enter register details"
        });
    }

    // create user in database
    User.create({
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
    }).then((user) => {
        const token = jsonwebtoken.sign(
            {
                id: user._id,
                email: user.email
            },
            SECRET_JWT_CODE
        );
        res.json({
            success: true,
            token: token
        });
    }).catch((err) => { 
        res.json({
            success: false,
            error: err
        });
    });
});

app.post('/user/login', (req, res) => {
    if( !req.body.email || !req.body.password ){
        res.json({
            success: false,
            error: "Please enter login details"
        });
    }

    User.findOne({ email: req.body.email })
    .then((user) => {
        if(!user){
            res.json({
                success: false,
                error: "User does not exist"
            });
        }else{
            if(!bcrypt.compareSync(req.body.password, user.password)){
                res.json({
                    success: false,
                    error: "Invalid password"
                });
            }else{
                const token = jsonwebtoken.sign(
                    {
                        id: user._id,
                        email: user.email
                    },
                    SECRET_JWT_CODE 
                );
                res.json({
                    success: true,
                    token: token,
                    message: "Successfully logged in"
                });
            }
        }
    }).catch((err) => {
        res.json({
            success: false,
            error: err
        });
    });
});