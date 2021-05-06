const auth = (req, res, next) => {
    if( req.session )
        return next();
    else
        res.sendStatus(403);
}

module.exports = auth;