import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import express from 'express';
import handlebars from 'express-handlebars';
import { routerCarts } from './routes/cart.router.js';
import { routerProductos } from './routes/products.router.js';
import { routerVistaProductos } from './routes/productos.vista.router.js';
import { routerVistaRealTimeProducts } from './routes/realTimeProducts.vista.router.js';
import { routerUsers } from './routes/users.router.js';
import { __dirname } from './dirname.js';
import { Server } from 'socket.io';
import { connectMongo } from './utils/connections.js';
import { routerVistaProducts } from './routes/products.vista.router.js';
import { routerVistaCart } from './routes/cart.vista.router.js';
import { viewsRouter } from './routes/views.router.js';
import { loginRouter } from './routes/login.router.js';
import passport from 'passport';
import { iniPassport } from './config/passport.config.js';
import errorHandler from "./middlewares/error.js";
import compression from 'express-compression';

const app = express();
const port = 8080;

connectMongo();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://Salocin0:bQJ5b9byQb6PlLWM@coder.qmxekir.mongodb.net/?retryWrites=true&w=majority', ttl: 86400 * 7 }),
    secret: 'coder-secret',
    resave: true,
    saveUninitialized: true,
  })
);

app.use(compression({brotli:{enable:true,zlib:{}},}));

iniPassport();
app.use(passport.initialize());
app.use(passport.session());

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
app.use('/api/products', routerProductos);
app.use('/api/carts', routerCarts);
//app.use("/vista/products", routerVistaProductos);
app.use('/vista/realtimeproducts', routerVistaRealTimeProducts);
app.use('/vista/cart', routerVistaCart);
app.use('/api/users', routerUsers);
app.use('/vista/products', routerVistaProducts);
app.use('/', viewsRouter);
app.use('/api/sessions', loginRouter);
app.get('/api/sessions/github', passport.authenticate('github', { scope: ['user:email'] }));

app.get('/api/sessions/githubcallback', passport.authenticate('github', { failureRedirect: '/error-autentificacion' }), (req, res) => {
  req.session.firstName = req.user.firstName;
  req.session.email = req.user.email;
  res.clearCookie('userId');
  res.cookie('userId', req.user._id, { maxAge: 3600000 });
  res.redirect('/vista/products');
});
app.get('/error-autentificacion', (req, res) => {
  return res.status(400).render('error-page', { msg: 'error al loguear' });
});
app.get('*', (req, res) => {
  return res.status(404).json({
    status: 'Error',
    msg: 'page not found',
    data: {},
  });
});

const httpServer = app.listen(port, () => {
  console.log('Servidor escuchando en el puerto ' + port);
});

const socketServer = new Server(httpServer);

socketServer.on('connection', (socket) => {
  const pm = new ProductManager();
  socket.on('new-product-created', (newProduct) => {
    const productList = pm.getProducts();
    var repeatcode = false;
    productList.forEach((product) => {
      if (newProduct.code == product.code) {
        repeatcode = true;
      }
    });
    if (repeatcode) {
      socketServer.emit('repeat-code', repeatcode);
    } else {
      const productCreated = pm.addProduct(
        newProduct.title,
        newProduct.description,
        newProduct.price,
        newProduct.thumbnails,
        newProduct.code,
        newProduct.stock,
        newProduct.status,
        newProduct.category
      );
      if (productCreated) {
        const productList = pm.getProducts();
        socketServer.emit('products', productList);
      } else {
        socketServer.emit('products', productCreated);
      }
    }
  });
  socket.on('delete-product', async (idToDelete) => {
    pm.deleteProduct(idToDelete);
    socketServer.emit('delete-product-in-table', idToDelete);
  });

  app.use(errorHandler)
});
