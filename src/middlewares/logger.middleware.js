import winston from "winston";
import config from "../config/config.js";


const customLevelsOptions = {

        levels : {

            fatal:0,
            error:1,
            warning:2,
            info:3,
            http:4,
            debug:5,



        },
        colors: {
            fatal: 'red',
            error:'orange',
            warning:'yellow',
            info:'blue',
            debug:'white',
        }

}

let CusLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console({ level: 'info', 

        }),
        new winston.transports.File({ filename: './errors.log', level: 'error',
        
        }),
    ],
});    

if (config.ENVIROMENT ==='development') {
    CusLogger = winston.createLogger({
        levels: customLevelsOptions.levels,
        transports: [
            new winston.transports.Console({level: 'debug'}),
            
        ]
    })
}





export const Logger = (req, res,next)=>{

    req.logger = CusLogger;
    req.logger.http(`${req.method} en ${req.url} - ${ new Date().toLocaleTimeString()}`)
    next();
}