const Contato = require('../models/ContatoModel');

exports.index = (req, res) => {
    res.render('contato', { contato: null });
}   

exports.register = async (req, res) => {
    contato = new Contato(req.body);
    
    if (contato.errors.length > 0) {
        req.flash('errors', contato.errors);
        req.session.save(() => res.redirect('/contatos'));
        return
    }

    console.log('User logado: ' + req.session.user)
    contato.body.user = req.session.user._id;
    console.log('User dono do contato: ' + contato.user)
    await contato.save()
    req.flash('success', 'Contato criado com sucesso!');
    req.session.save(() => res.redirect('/contatos'));
}  


exports.edit = async (req, res) => {
    try {
        const contato = await Contato.findById(req.params.id);
        if (contato.user != req.session.user._id) return res.redirect('/contatos');
        
        if (! contato) return res.render('404');
        res.render('contato', { contato });
    } catch(e) {
        console.log(e);
        res.render('404');
    }
}   


exports.update = async (req, res) => {
    try {
        if (!req.params.id) return res.render('404');
        const contatoOwner = await Contato.findById(req.params.id);
        if(contatoOwner.user != req.session.user._id) return res.redirect('/contatos');

        contato = new Contato(req.body);
        
        if (contato.errors.length > 0) {
            req.flash('errors', contato.errors);
            req.session.save(() => res.redirect(`/contatos/${req.params.id}/edit`));
            return
        }
        
        await contato.update(req.params.id);
        req.flash('success', 'Contato atualizado com sucesso!');
        req.session.save(() => res.redirect('/contatos'));
    } catch(e) {
        console.log(e);
        res.render('404');
    }
}  

exports.all = async (req, res) => {
    try {
        const contatos = await Contato.all(req.session.user._id);
        res.render('contatos', {contatos})
    } catch(e) {
        console.log(e);
        res.render('404');
    }
}

exports.delete = async (req, res) => {
    try {
        if(!req.params.id) return res.redirect('/contatos');
        const contatoOwner = await Contato.findById(req.params.id);
        if(contatoOwner.user != req.session.user._id) return res.redirect('/contatos');

        const contato = await Contato.delete(req.params.id);
        if(!contato) {
            return res.render('404');
        }
        req.flash('success', 'Contato apagado com sucesso!');
        req.session.save(() => res.redirect('/contatos'));

    } catch(e) {
        console.log(e);
        res.render('404');
    }
}