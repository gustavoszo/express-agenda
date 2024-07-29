const mongoose = require('mongoose');
const validator = require('validator');
const Login = require('./LoginModel');

const ContatoSchema = new mongoose.Schema({
    firstname: {type: String, required: true},
    lastname: {type: String, required: false, default: ''},
    email: {type: String, required: false, default: ''},
    phone: {type: String, required: false, default: ''},
    created_at: {type: Date, default: Date.now()},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'Login', required: true}, // Referência ao modelo Login
});

const ContatoModel = mongoose.model('Contato', ContatoSchema);

function Contato(body) {
    this.body = body;
    this.errors = [];
    this.contato = null;

    this.cleanData();
    this.validate();
}

Contato.findById = async function(id) {
    const contato = await ContatoModel.findById(id);
    return contato;
}

Contato.prototype.save = async function() {
    if (this.errors.length > 0) return
    this.contato = await ContatoModel.create(this.body);
}

Contato.prototype.update = async function(id) {
    if (this.errors.length > 0) return
    this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, {new: true});
}

// id do usuário logado
Contato.all = async function(id) {
    const contatos = await ContatoModel.find( {user:id} );
    return contatos;
}

Contato.delete = async function(id) {
    const contato = await ContatoModel.findByIdAndDelete(id);
    return contato;
}

Contato.prototype.validate = function() {
    if (this.body.email && ! validator.isEmail(this.body.email)) this.errors.push('Endereço de e-mail inválido');
    if (! this.body.firstname ) this.errors.push('Informe o nome do contato');
    if(! this.body.email && ! this.body.phone)  this.errors.push('Informe o email e/ou telefone do contato');
}

Contato.prototype.cleanData = function() {
    for(let key in this.body) {
        if(typeof this.body[key] !== 'string') {
            this.body[key] = '';
        }
    }

    this.body = {
        firstname: this.body.firstname,
        lastname: this.body.lastname,
        email: this.body.email,
        phone: this.body.phone,
    }
}

module.exports = Contato;