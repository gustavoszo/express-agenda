const express = require('express');
const route = express.Router();

const {loginRequired} = require('./src/middlewares/middleware');

const homeController = require('./src/controllers/mainController');
const loginController = require('./src/controllers/loginController');
const contatoController = require('./src/controllers/contatoController');

// Rotas da Home
route.get('/', homeController.index);

// Rotas de Login
route.get('/login', loginController.index);
route.post('/login/login', loginController.login);
route.post('/login/register', loginController.register);
route.post('/login/logout', loginController.logout);

// Rotas de contato
route.get('/contatos', loginRequired, contatoController.all);
route.get('/contatos/create', loginRequired, contatoController.index);
route.post('/contatos/register', loginRequired, contatoController.register);
route.get('/contatos/:id/edit', loginRequired, contatoController.edit);
route.post('/contatos/update/:id', loginRequired, contatoController.update);
route.post('/contatos/delete/:id', loginRequired, contatoController.delete);

module.exports = route;