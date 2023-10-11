import  express  from "express";
import handlebars from 'express-handlebars'
import mongoose from 'mongoose'
import {Server} from 'socket.io'
import {prodsRouter} from "./routers/products.router.js"
import { cartsRouter } from "./routers/carts.router.js";
import viewRouter from './routers/views.router.js'
import prodsController from "./controllers/products.controller.js";
import msgController from "./controllers/messages.controller.js";
import cookieParser from "cookie-parser"
import session from "express-session"
import {usersRouter} from "./routers/users.router.js";
 import sessionsRouter from "./routers/sessions.router.js";
import inicializePassport from "./config/passport.config.js";
import passport from "passport";
import config from "./config/config.js";
import errorsManagerMiddleware from "./middlewares/errorsManager.middleware.js";
import { Logger } from "./middlewares/logger.middleware.js";
import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUi from "swagger-ui-express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(Logger)

//-----------------------------------------------------------------------------------------------------//


mongoose.connect(config.mongoUrl);

//swagger
const swaggerOptions = {
    definition:{
      openapi:'3.0.1',
      info:{
        title:'Proyect backend API',
        version:'1.0.0',
        description:'Adoptapet API Information for CoderHouse',
      }
    },
    apis:['./docs/**/*.yaml']
  }

  const spects = swaggerJsDoc(swaggerOptions);

const httpServer = app.listen(config.port, ()=> console.log("Escuchando puerto ",config.port))

const socketServer = new Server(httpServer);

//loggerTester con ENVIROMENT='production' y ENVIROMENT='development' en .env

app.use('/loggerTest', async(req,res)=>{


    await req.logger.debug("LoggerTesting...")

    let flag= false
    if (!flag) {
        let error = {test:"test"}
        await req.logger.error("Error sistema",error)
        await req.logger.fatal("fatalisima")
        res.status(500).send("error")
    }else{res.send("LoggerTesting...")}
    
})

//Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views','views/');
app.set('view engine','handlebars');
app.use(express.static('public'));


inicializePassport();
app.use(cookieParser(config.COOKIE_PARSER))
app.use(passport.initialize());


//session
app.use(
	session({
		secret: config.sessionSecret,
		resave: true,
		saveUninitialized: true,
	})
);


//Routes
app.use('/docs',swaggerUi.serve,swaggerUi.setup(spects))
app.use('/api/products', prodsRouter)
app.use(errorsManagerMiddleware);
app.use('/api/carts', cartsRouter)
app.use('/api/sessions', sessionsRouter)

//views
app.use('/', viewRouter);
app.use('/api/users', usersRouter)


//Socket
socketServer.on('connection', async (socket)=>{

    try {


                const allprods = await prodsController.getProds()


    // //Envio la lista de productos

           socket.emit('products', allprods);

    // Recibiendo caracterisiticas de producto nuevo

        socket.on('addingProds', async(data)=>{

            try {

              
                await prodsController.addProduct(data);

                console.log("Prod nuevo llegando a app:", data);
                
            } catch (error) {

                req.logger.error("Algo salió mal en el addingProds ==>", error);
                
                
            }

            
        })

                //Socket chat

                socket.on("message", async(data)=>{

                            try {

                                 await msgController.addMessages(data)

                                 const MSGS = await msgController.getMessages()

                                 return socketServer.emit("sendingMSGs", MSGS)
                                
                            } catch (error) {

                                console.log(error
                                    );
                                
                            }
                })

                

        
    } catch (error) {

        console.log("Algo salió mal en el socket connection =>", error);
        
    }





})












