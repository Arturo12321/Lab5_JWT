
const User = require('../models/User')
const jwt = require('jsonwebtoken')

const maxAge = 3 * 24 * 60 * 60
const createToken = (id) => {
    return jwt.sign({id}, 'secret', {
    expiresIn: maxAge})
}
module.exports.signup_get = (req, res) => {
    res.render('signup');   
}

const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { username: '',email: '', password: '' };
   
    if (err.message === 'incorrect username') {
        errors.username = 'That username is not registered';
      }
    if (err.message === 'incorrect email') {
      errors.email = 'That email is not registered';
    }
   
   
    if (err.message === 'incorrect password') {
      errors.password = 'That password is incorrect';
    }
   
    
    if (err.code === 11000) {
      errors.email = 'that email is already registered';
      return errors;
    }
   
   
    if (err.message.includes('user validation failed')) {
      
      Object.values(err.errors).forEach(({ properties }) => {
      
        errors[properties.path] = properties.message;
      });
    }
   
    return errors;
  }

module.exports.signup_post = async (req, res) => {
    const { username, email, password} = req.body;
    try {
       const user =  await User.create({
        username,email,password
       });
       const  token = createToken(user._id);

       res.cookie('jwt',token,{httpOnly: true, maxAge:maxAge});
       res.status(201).json({user:user._id})
    } catch (err) {
        console.error(err)
        const errors = handleError(err)
        res.status(400).json({errors})
    }
}



module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;
 
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  }
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
}
module.exports.login_get = (req, res) => {
    res.render('login')
}