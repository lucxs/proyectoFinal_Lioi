import jwt from 'jsonwebtoken'
const privatekey = 'privatekey'


const generateToken =(user)=>{
    return jwt.sign({user},
         privatekey,
          {expiresIn: '1h'})
}



const authToken = (req, res, next)=>{

    const authHeader = req.cookies.token;

   if (!authHeader) {

    res.status(401).send({message: 'Token not found'});

   }

   const token = authHeader.split(' ')[1];

   jwt.verify(token,privatekey, (err, Credentials)=>{

    if (err) {
        res.status(401).send({message: 'Token not valid'});
        
    }

    req.user = Credentials.user;
    next()
   })
}


export {generateToken, authToken}