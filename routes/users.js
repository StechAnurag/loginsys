const router = require('express').Router();
const User = require('../models/users');
const bcrypt = require('bcryptjs');

router.get('/login', (req, res)=>{
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register', {errors : ''});
});

router.post('/register', async (req, res) => {
    const { name, email, password, password2 } = req.body;

    //Vadlidation
    let errors = [];
    // check required fields
    if(!name || !email || !password || !password2){
        errors.push({ msg : 'Please fill in all fields' });
    }
    
    // Check passwords match
    if(password !== password2){
        errors.push({ msg : 'passwords do not match' });
    }

    // check password length
    if(password.length < 6){
        errors.push({ msg : 'passwords should be atleast 6 characters' });
    }

    if(errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    }else{
        // validation pass

        try{
            const user = await User.findOne({ email });
            if(user){
                // user already exists
                errors.push('Email registered already');
                return res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            }
            // user does not exits - Create new user 
            const salt = await bcrypt.genSalt(10);
            const hashedPass = await bcrypt.hash(password, salt);

            const newUser =  new User({
                name,
                email,
                password : hashedPass
            });
            
            await newUser.save();
            res.redirect('/login'); 
        }catch(ex){
            console.log(ex);
            errors.push('Internal Server Error');
            res.render('register', {
                errors,
                name,
                email,
                password,
                password2
            });
        }
    }

});

module.exports = router;