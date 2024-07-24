// Importar modelos
require('./models/usuario');
require('./models/materiaPrima');
const express = require('express');
var createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const dotenv = require("dotenv");

// Cargar variables de entorno desde el archivo .env
dotenv.config();

const mongodbConnString = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@${process.env.CLUSTER_NAME}.evygslu.mongodb.net/${process.env.DB_NAME}`;

// Conectar a MongoDB
mongoose.connect(mongodbConnString)
  .then(() => console.log(`Conectado a MongoDB exitosamente en el puerto ${process.env.PORT}`))
  .catch(err => console.error("Error al conectar a MongoDB", err));

// Configurar rutas
const indexRouter = require('./routes/index');
const usuariosRouter = require('./routes/usuarios');
const materiasPrimasRouter = require('./routes/materiasPrimas');

const app = express();

// Configuración de vistas y otros middlewares
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/usuarios', usuariosRouter);
app.use('/materiasPrimas', materiasPrimasRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
