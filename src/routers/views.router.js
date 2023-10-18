import express from 'express'
import prodsController from '../controllers/products.controller.js';
import {middlewarePassportJWT, middlewarePassportJWTAdmin,middlewarePassportJWTUser, middlewareAccessToCart,middlewarePassportUser} from '../middlewares/auth.middleware.js'
import cartsController from '../controllers/carts.controller.js';
import userController from '../controllers/user.controller.js';
import MailingService from "../services/mail.service.js";

const mailingService = new MailingService();
const viewRouter =express();


//Paso la lista de productos a home.handlebars y el user actualmente loggeado
viewRouter.get('/',middlewarePassportUser, async(req, res)=>{
            
            let LimitProducts = req.query.limit;
            let pageProducts = req.query.page;
            let queryProducts = req.query.marca;
            let sortProducts = req.query.sort;
            let user = null
            // Calcula la URL completa del action del form en el foreach de home
            if (req.user.user) {
                user = {"name":req.user.user.first_name,
            "role":req.user.user.role,
             "cid":req.user.user.cart,
            }
            }

            //Aca realizo la comprobación del registro de loggins según la ultima conexión

            const logginCntrl = await userController.getloggingsControl()
            console.log("Este es el registro completo de loggins antiguos: ",logginCntrl);
            const fechaActual = new Date();
            // Filtra los elementos del array que sean menores a 2 dias
            const dosDiasEnMilisegundos = 2 * 24 * 60 * 60 * 1000;
            const filtered = logginCntrl.filter(item => (fechaActual.getTime() - item.date.getTime()) < dosDiasEnMilisegundos);
            
            console.log("Los filtrados de filtered son aquellos que tuvieron actividad en la ultima media hora: ", filtered, "-->", filtered.length);
            if (filtered.length > 0) {
                    const allUsers = await userController.getUsers()
                    const correosFiltrados = filtered.map(item => item.email);
                    const userFilter = allUsers.filter((user)=> !correosFiltrados.includes(user.email))
                    console.log("usuarios: ", allUsers);
                    console.log("userFilter que deben ser eliminados por inactividad: ", userFilter);
                    //Entonces, si hay usuarios pasados los dos dias de inactividad
                    if (userFilter.length > 0) {
                        
                    //Emails de usuario a eliminar
                    const emailsDroppingFilter = userFilter.map((usr)=>{
                        return {'email': usr.email}
                    })
                    console.log("Emails de usuario a eliminar:",emailsDroppingFilter );
                        
                    //Por cada email envio un email informando que sea eliminada la cuenta, elimino la cuenta: 
                    emailsDroppingFilter.forEach(email => {
                        
                        const mailOptions = {
                            from: 'Optics <lioilucas75@gmail.com>',
                            to: `${email.email}`,
                            subject:`Baja de usuario`,
                            html: `<h1>Lamentamos informarle que su usuario ha sido dado de baja por falta inactividad mayor a dos dias</h1>`    
                        };
                                userController.deleteUsers(emailsDroppingFilter)
                                 mailingService.sendMail(mailOptions)
                    });
                }else{
                    console.log("Todos los usuarios se mantienen activos");
                }

             }       
            ///--------------------------------------------------------------------///
             
    try {

    
            const prodsPaginate = await prodsController.prodsPaginated(LimitProducts, pageProducts, queryProducts, sortProducts )

           prodsPaginate.query = queryProducts;
           prodsPaginate.sort = sortProducts;

            req.logger.debug(prodsPaginate);

            //Filtros de seguridad
            if (pageProducts > prodsPaginate.totalPages || pageProducts < 1) {

                    let text = "El numero de pagina que intenta setear no existe"
                    return res.render('serverError', {text})
            
            }else if(pageProducts == ""){
                return res.render('home', {prodsPaginate, user, role})

            }else if(/^[A-Za-z]+$/.test(pageProducts) && !pageProducts == ""){
                let text = "Para el numero de pagina debe setear un numero"
                return res.render('serverError', {text})
            }else{

           return res.render('home', {prodsPaginate, user})
        }
        
    } catch (error) {

        req.logger.error("Algo salió mal =>", error);
        
    }

})


viewRouter.get('/adminDashboard',middlewarePassportJWTAdmin,async(req, res)=>{

    const user =  req.user.user

    //Si user es premium le paso el id a adminDashboard
    if (user.role ==="premium") {

       const userID = user._id

    res.render('adminDashboard',{userID});
        
    }else{
        res.render('adminDashboard');

    }
    


}) 

//Renderizo carts.handlebars
viewRouter.get('/carts/:cid',middlewareAccessToCart, async(req,res)=>{

        let cid = req.params.cid;
        let user = null
            if (req.user.user) {
                user = {"name":req.user.user.first_name,
            "role":req.user.user.role,
             "cid":req.user.user.cart,
            }
            }
    
try {

    const cartById = await cartsController.getCartOnviews(cid)

    req.logger.debug("desde view de cart: ",cartById);
    
    res.render('carts', {cartById, user});

    
} catch (error) {

    res.render(error)
    
}


})


//register

viewRouter.get('/register',(req,res)=>{

    
         res.render('register')
   

})

//Login

viewRouter.get('/login',(req,res)=>{

         res.render('login')
        
})

//Reset password

viewRouter.get('/resetPassword/:email',(req,res)=>{
    const email = req.params.email
    res.render('resetPassword',{email})

})

viewRouter.post('/resetPass/:email', async(req,res)=>{

try {

    const userEmail = req.params.email;
    const {validPassword, confirmPassword} = req.body

    const result = await userController.resetPassword(userEmail, validPassword, confirmPassword)
    console.log(result);
    if (!result.messageError) {
        res.status(200).send({'message':"Password modified"})
        
    }else{
        console.log("aca quiero renderizar el error------------>",result.messageError);
        res.send({"message":result.messageError})
    }
    
} catch (error) {
        console.log("el error es----->",error);
            
}

   


})


//current

viewRouter.get('/current',middlewarePassportJWT,async(req, res) => {
         const user = req.user;
         const userCart = user.user.cart
         req.logger.debug("el user: ",user.user);
            const allProducts =await prodsController.prodsPaginated()
            const ownProds =await allProducts.docs.filter((prod)=>prod.owner && prod.owner.toString() === user.user._id)
            req.logger.debug("Todos los prods: ",allProducts.docs);
            req.logger.debug("Mis productos",ownProds);
            if (ownProds.length > 0) {
                res.render('privateCurrent',{user, ownProds, userCart})
            }else{
                res.render('privateCurrent',{user, userCart})
            }          
});


//chat


viewRouter.get('/chat',middlewarePassportJWTUser, (req, res)=>{

        const user = req.user;
        res.render('chat',{user})

})

//ServerError

viewRouter.get('/serverError', (req,res)=>{

        res.render('serverError')

})

export default viewRouter;