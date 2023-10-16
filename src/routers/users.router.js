import { Router } from "express";
import passport from "passport";
import { generateToken } from "../middlewares/jwt.middleware.js";
import userController from "../controllers/user.controller.js";
const usersRouter = Router();



//Register passport
usersRouter.post('/', passport.authenticate('register',{failureRedirect: '/serverError'} ),
 async(req,res)=>{
    //data para los registros de loggin, en este caso guardo el registro al ser registrado el usuario para no generar un bug
    const {email} = req.body;
     const date = new Date();
     const logRegis = {'email':email, 'date':date}
     await userController.loggingsControl(logRegis)
    res.redirect('/login')

})


//Login con passport

 usersRouter.post(
    '/auth',
 passport.authenticate('login', {failureRedirect: '/serverError'}),
 async (req, res) =>{

        if (!req.user) return res.status(400).send('No user found');
        const user = req.user;
        console.log(user);
        //data para los registros de loggin
        const date = new Date();
        const logRegis = {'email':user.email, 'date':date}
        await userController.loggingsControl(logRegis)

        //genero y guardo token en cookie
         const token=  generateToken(user);
         res.cookie("UserToken",token,{
             maxAge: 180000,
             httpOnly:true
         })
         
         res.redirect('/') 
        
       
    })
            //Enviar correo para reset de password
    usersRouter.post('/sendEmail/restorePass/:email',async(req,res)=>{
                try {
                    const email =  req.params.email
                    await userController.SendResetPassword(email)
                    res.status(200).redirect('/login')
                } catch (error) {
                    
                    res.status(500).redirect('/serverError')

                }
            
    })

    usersRouter.post('/premium/:uid', async(req, res)=>{
            try {
                const userId = req.params.uid
            console.log(userId);
            const user = await userController.getById(userId)
            console.log(user);
            if (user.role === "premium") {
                let role = "user"
                return await userController.updateUserRole(userId,role)
            }else if(user.role === "user"){
                let role = "premium"
                return await userController.updateUserRole(userId,role)
            }
            } catch (error) {
                    req.logger.error(error)
            }
            
    })

    usersRouter.get('/', async(req,res)=>{

                const allUsers = await userController.getUsers()

                res.status(200).send(allUsers)

    })

    usersRouter.delete('/',(req,res)=>{

            return userController.deleteUsers()
            
    })



usersRouter.get('/logout',(req, res)=>{

    res.clearCookie('UserToken')
    res.redirect('/login')

})
export {usersRouter}

