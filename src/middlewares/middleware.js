module.exports.myMiddleware = (req, res, next) => {
    res.locals.errors = req.flash('errors');
    res.locals.success = req.flash('success');
    res.locals.info = req.flash('info');
    res.locals.user = req.session.user;
    next();
}

module.exports.checkCsrfError = (err, req, res, next) => {
    if (err) {
        res.render('404');
        return
    }

    next();
}

module.exports.csrfMiddleware = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
}

module.exports.loginRequired = (req, res, next) => {
    if (!req.session.user) {
        req.flash('info', 'Por favor, realize o login');
        req.session.save(() => res.redirect('/login'));
        return
    }
    next();
}