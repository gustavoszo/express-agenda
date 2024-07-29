const validator = require('validator');

export default class LoginValid {
    constructor(formclass) {
        this.form = document.querySelector(formclass);
        this.events();
    }

    events() {
        // A função arrow não permite alteração do this
        this.form.addEventListener('submit', e => {
            this.handleSubmit(e);
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        const valid = this.isValid(e);

        if (valid) {
            this.form.submit();
        }
    }

    isValid(e) {
        let valid = true;

        const el = e.target;
        console.log(el);

        // Remover as mensagens de erro no reenvio do Form
        for (let error of document.querySelectorAll('.error-text')) {
            error.remove();
        }

        const email = el.querySelector('input[name="email"]');
        const password = el.querySelector('input[name="password"]');
        email.classList.remove('is-invalid');
        password.classList.remove('is-invalid');

        if(!validator.isEmail(email.value)) {
            this.createError(email, 'Endereço de e-mail inválido');
            valid = false;
        } 

        if(password.value.length < 3 || password.value.length > 50) {
            this.createError(password, 'A senha deve ter entre 3 e 50 caracteres');
            valid = false;
        } 

        return valid;

    }

    createError(field, msg) {
        const div = document.createElement('div');
        div.innerHTML = msg;
        div.classList.add('error-text');
        field.insertAdjacentElement('afterend', div);
        field.classList.add('is-invalid');
    }

}
