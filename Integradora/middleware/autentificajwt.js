const jwt = require('jsonwebtoken');

function auntentifica(req,res,next){
    const jwtoken = req.header('Authorization');
    if(!jwtoken){
        return res.status(401).send('Acceso denegado. Necesitas un Token');
    }

    try{
        const payload = jwt.verify(jwtoken, 'c0ntr4s3n14');
        req.user = payload;
        next();
    }
    catch(e){
        res.status(401).send('Acceso denegado. Token no valido');
    }
}

module.exports = auntentifica