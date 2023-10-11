import dotenv from 'dotenv'

dotenv.config();

export default {
        ENVIROMENT:process.env.ENVIROMENT,
        port: process.env.PORT,
        mongoUrl: process.env.MONGO_URL,
        sessionSecret: process.env.SESSION_SECRET,
        COOKIE_PARSER: process.env.COOKIE_PARSER,
        CLIENT_ID: process.env.CLIENT_ID,
        CLIENT_SECRET: process.env.CLIENT_SECRET,
        MAIL_SERVICE: process.env.MAIL_SERVICE,
        USER_MAIL_SERVICE:process.env.USER_MAIL_SERVICE,
        PASS_MAIL_SERVICE:process.env.PASS_MAIL_SERVICE
}