var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");

//mongoose.connect("mongodb+srv://Josue:$7L!fX2!sN56whf@cluster0.evygslu.mongodb.net/MPG");

const mongodbConnString = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@${process.env.CLUSTER_NAME}.evygslu.mongodb.net/${process.env.DB_NAME}`
mongoose.connect(mongodbConnString)


async function run() {
  try {
    // Conectando el cliente al servidor (opcional a partir de v4.7)
    await client.connect();
    // enviar ping para confirmar una conexion exitosa
    await client.db("admin").command({ ping: 1 });
    console.log("Hizo ping a su implementacion. ¡Te conectaste exitosamente a MongoDB!");
  } finally {
    // Asegura que el cliente se cerrará cuando termine/error
    await client.close();
  }
}
run().catch(console.dir);

//Lista de modelos
require("./models/usuario")
require("./models/producto")

//lista de archivos routes(rutas)
var indexRouter = require('./routes/index');
var usuariosRouter = require('./routes/usuarios');
var productosRouter = require('./routes/productos');

var app = express();
   
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//lista de url para cada archivo de rutas (routes)
app.use('/', indexRouter);
app.use('/usuarios', usuariosRouter);
app.use('/productos', productosRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
