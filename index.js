const express = require('express');

const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');

const mongoose = require('mongoose');

const {requireAuth, checkUser} = require('./middleware/authMiddleware');

const  app = express();

app.use(authRoutes)

app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json());

app.set('view engine', 'ejs');

const dbURI = "mongodb://localhost:27017/jwtauth";

mongoose.connect(dbURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
})
.then((result) => {
    app.listen(5000, () => {
        console.log("App os listening on port " + dbURI )
    })
})
.catch((err) => console.log(err))

app.get('*',(req, res) => {
});

app.get('/', (req, res) => {
    const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "secret", (err, decodedToken) => {
      if (err) {
        res.render('login')
      } else {
        res.render('dashboard')
      }
    });
  } else {
    res.render("login");
  }
})

app.get('/dasboard', requireAuth, (req, res) => res.render('dasboard'))

app.use(authRoutes);
