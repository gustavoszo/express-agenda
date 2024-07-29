const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;   

        // Deixar o objeto de req apenas com email e senha
        this.cleanData();
        this.validate();
    }

    async save() {
        if (this.errors.length > 0) return;
        const salt = bcryptjs.genSaltSync();
        this.body.password = bcryptjs.hashSync(this.body.password, salt);
        this.user = await LoginModel.create(this.body);
    }

    async login() {
        if (this.errors.length > 0) return
        this.user = await LoginModel.findOne( {email: this.body.email} );
        if (! this.user || ! bcryptjs.compareSync(this.body.password, this.user.password)) {
            this.user = null;
            this.errors.push('E-mail e/ou senha inválido(s)');
            return
        }
    }
    
    validate() {
        if (! validator.isEmail(this.body.email)) this.errors.push('Endereço de e-mail inválido');
        if (this.body.password.length < 3 || this.body.password.length > 50) this.errors.push('A senha deve ter entre 3 e 50 caracteres');
    }

    async emailExists() {
        const user = await LoginModel.findOne({ email: this.body.email });
        if(user) this.errors.push('Endereço de e-mail já cadastrado. Tente outro!');
    }

    cleanData() {
        for(let key in this.body) {
            if(typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }

        this.body = {
            email: this.body.email,
            password: this.body.password
        }
    }
}

module.exports = Login; 