// Importar modelos
require('./models/usuario');
require('./models/materiaPrima');

const express = require('express');
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const https = require('https');

// Cargar variables de entorno desde el archivo .env
dotenv.config();

console.log('Puerto configurado:', process.env.PORT);

const app = express(); // Crear la aplicación Express

const mongodbConnString = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@${process.env.CLUSTER_NAME}.evygslu.mongodb.net/${process.env.DB_NAME}`;

// Conectar a MongoDB
mongoose.connect(mongodbConnString)
  .then(() => console.log('Conectado a MongoDB exitosamente'))
  .catch(err => console.error('Error al conectar a MongoDB', err));

// Configurar rutas
const indexRouter = require('./routes/index');
const usuariosRouter = require('./routes/usuarios');
const materiasPrimasRouter = require('./routes/materiasPrimas');
const customersRouter = require('./routes/customers');
const ordersRouter = require('./routes/orders');
const productsRouter = require('./routes/products');

// Configuración de vistas y otros middlewares
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
  "origin": "*",
  "methods": "GET,PUT,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}));


app.use('/', indexRouter);
app.use('/usuarios', usuariosRouter);
app.use('/materiasPrimas', materiasPrimasRouter);
app.use('/customers', customersRouter);
app.use('/orders', ordersRouter);
app.use('/products', productsRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// Crear y configurar el servidor HTTPS
const port = process.env.PORT || 3000; // Usar el puerto del archivo .env o un valor por defecto

https.createServer({
  cert: fs.readFileSync('server.crt'),
  key: fs.readFileSync('server.key')
}, app).listen(port, () => {
  console.log(`Servidor escuchando en https://localhost:${port}`);
});


module.exports = app;
