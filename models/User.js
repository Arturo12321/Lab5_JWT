const mongoose = require('mongoose'); 
const {isEmail,isUsername} = require('validator');      
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true,"Please enter a username"],
            unique: true,
            validate:[isUsername, "Please enter a valid username"]
        },
        email: {
            type: String,
            required: [true,"Please enter a email address"],
            unique: true,
            lowercase: true,
            validate:[isEmail, "Please enter a valid email"]
        },
        password: {
            type: String,
            required: [true,"Please enter a password"],
            minlength: [6,"Minimun password length is 6 characters"],
        }
    }
);
userSchema.pre('save', async function(next) {

    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password,salt)
    next();
})

userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        return user;
      }
      throw Error('incorrect password');
    }
    throw Error('incorrect email');
  };
const User = mongoose.model('user', userSchema);    

module.exports = User;