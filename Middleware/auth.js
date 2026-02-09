const jwt = require('jsonwebtoken');
exports.auth = async(req, res, next)=>{
    try {
        const token = req.headers["token"];
        
        if(!token){
            return res.status(401).send('NO token')
        }
        const decoded = jwt.verify(token, "jwtSecret");
        console.log(decoded);
        req.user = decoded.USER;
        
        
        
        
        next();
    } catch (err) {
        console.log(err);
        res.status(401).send('Token is not valid');

    }

   
 

}