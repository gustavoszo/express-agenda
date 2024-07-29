const Login = require('../models/LoginModel');

exports.index = (req, res) => {
    if (req.session.user) {
        req.flash('info', 'Você já entrou no sistema.')
        req.session.save(() => {
            res.redirect('/');
        })
        return;
    }
    res.render('login');
}

exports.register = async (req, res) => {
    try {
        const login = new Login(req.body);
        await login.emailExists();

        if (login.errors.length > 0) {
            // Armazena os erros na sessão usando req.flash
            req.flash('errors', login.errors);
        } else {
            await login.save();
            req.flash('success', 'Seu usuário foi criado com sucesso');
        }

        // Salva a sessão para capturar as mensagens de erro executa um callback
        req.session.save(function() {
            return res.redirect('/login');
        });

    } catch(e) {
        console.log(e);
        return res.render(404);
    }

}

exports.login = async (req, res) => {
    try {
        const login = new Login(req.body);
        await login.login();

        if (login.errors.length > 0) {
            // Armazena os erros na sessão usando req.flash
            req.flash('errors', login.errors);
            req.session.save(function() {
                return res.redirect('/login');
            });
            return
        }

        req.session.user = login.user;
        req.flash('success', 'Você entrou com sucesso!');

        req.session.save(function() {
            return res.redirect('/');
        });

    } catch(e) {
        console.log(e);
        return res.render(404);
    }
}

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/login');
}