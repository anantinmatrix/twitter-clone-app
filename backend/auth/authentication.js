import jwt from 'jsonwebtoken'

const authentication = (req,res, next)=>{
    try{
        const {authorization} = req.headers;
        if(!authorization){
            return res.status(401).json({error: 'No token provided'})
        }
        const token = authorization.replace("Bearer ", "")
        const verification = jwt.verify(token, process.env.JWT_KEY)
        req.user = verification;
        next()
    }
    catch(err){
        res.status(401).json({error: 'Authentication error'})
    }
}

export default authentication;