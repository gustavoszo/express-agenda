require('dotenv').config();

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();  

const session = require('express-session');
// Um middleware para armazenar sessões em um banco de dados MongoDB. 
const MongoStore = require('connect-mongo');
// Mensagens temporarias que são salvas na sessão e removidas após serem exibidas
const flashMessage = require('connect-flash');

// Helmet é uma biblioteca para Express.js que agrega 12 middlewares simples, responsáveis por setar alguns headers nas respostas HTTP. 
// const helmet = require('helmet');
const csrf = require('csurf');

mongoose.connect(process.env.connection_string)
    .then(() => {
        app.emit('pronto');
    })
    .catch(e => console.log(e));


const sessionOpts = session({
    //Uma string usada para assinar a sessão, garantindo que a sessão é protegida contra ataques de falsificação de sessão. Deve ser mantida secreta.
    secret: 'askdnfdslkfna5445#$(df',
    // Define onde as sessões serão armazenadas. Aqui, as sessões são armazenadas no MongoDB utilizando connect-mongo e a conexão do mongoose.
    store: MongoStore.create({ mongoUrl: process.env.connection_string }),
    // resave: Se false, a sessão não será salva novamente no armazenamento se não tiver sido modificada durante a requisição. Isso ajuda a reduzir operações desnecessárias no banco de dados.
    resave: false,
    // Se false, a sessão não será salva no armazenamento a menos que seja modificada. Isso evita a criação de sessões vazias.
    saveUninitialized: false,
    cookie: {
        // Duração da sessão
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true  // O cookie só será acessível via HTTP(S), não disponível para JavaScript no navegador
    }
})

app.use(express.urlencoded({extended:true}));

app.use(express.static('./public'));

app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs')

//Apenas em produção
// app.use(helmet());
app.use(sessionOpts);
app.use(flashMessage());
app.use(csrf());

const routes = require('./routes');
const { myMiddleware, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware');

app.use(csrfMiddleware);
app.use(checkCsrfError);
app.use(myMiddleware);
app.use(routes);

app.on('pronto', () => {
    app.listen(3000, () => {
        console.log('Acesse em http://localhost:3000');
        console.log('O servidor está rodando na porta 3000');
    });
})