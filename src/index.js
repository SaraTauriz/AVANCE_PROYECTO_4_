/* ARCHIVO PARA ARRANCAR LA APLICACIÓN 
*/
const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require ('express-session');
const MySQLStore = require('express-mysql-session');
const passport = require('passport');

const { database } = require('./keys');



// Intializations INICIALIZAR EXPRESS
const app = express();
require('./lib/passport');

// Settings- Configuraciones que necesita el servidor de express,  en que puerto se va a inicializar 


// Definimos si existe un puerto en el sistema tomalo caso contrario utiliza el 4000
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  helpers: require('./lib/handlebars')
}))
app.set('view engine', '.hbs');

/* Middlewares- funciones que se ejecutan cada vez que un usuario envia una petición o el cliente
 envia una petición al servidor 
 Usamos los middleware que hemos instalado como por ejemplo: Morgan (este empieza a mostrar por consola)
 las peticiones que van llegando 
*/

app.use(session({
  secret: 'faztmysqlnodesession',
  resave: false,
  saveUninitialized: false,
  store: new MySQLStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());




/* Global variables - sección dedicada a las variables locales, aqui se colocan las variables
que mi aplicación necesite
*/
app.use((req, res, next) => {
  app.locals.success = req.flash('success');
  app.locals.message = req.flash('message');
  app.locals.user = req.user;
  next();
});


/* Routes- Una sección donde Definimos las url de nuestro servidor que van a servir cuando un usuario visite esa url 
*/
app.use(require('./routes/index'));
app.use(require('./routes/authentication'));
app.use('/links', require('./routes/links'));


/* Public- creamos una sección de archivos publicos, es decir una carpeta donde vamos a colocar todo el codigo
que el navegador puede acceder
*/
app.use(express.static(path.join(__dirname, 'public')));


/* Starting- Finalmente una sección para iniciar el servidor 
Aqui utilizamos el puerto que definimos 
*/
app.listen(app.get('port'), () => {
  console.log('Server is in port', app.get('port'));
});

