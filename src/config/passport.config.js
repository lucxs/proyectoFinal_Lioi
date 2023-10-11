import passport from 'passport'
import GitHubStrategy from 'passport-github2';
import userController from '../controllers/user.controller.js';
import cartsController from '../controllers/carts.controller.js';
import { comparePassword, hashPassword } from '../utils/encript.util.js';
import local from 'passport-local';
import { Strategy, ExtractJwt } from 'passport-jwt';
import config from './config.js';

const LocalStrategy = local.Strategy;
const jwtStrategy = Strategy;
const jwtExtract = ExtractJwt;

const inicializePassport = ()=>{
//Local Strategy

passport.use(
'register',
new LocalStrategy(
    {usernameField: 'email', passReqToCallback: true},
  async(req, username, password, done) => {
    
      const dataUser = req.body;
    try {
            const user = await userController.getByEmail(username)

            if (user) {
                return done(null, false, {message: 'User already exists'})
            }

            const newCard = await cartsController.createCarts();
            
            const hashedPassword = hashPassword(password);
            const newUser = await userController.createUser({
                name: dataUser.firstName,
                lastname: dataUser.lastName,
                email: username,
                password: hashedPassword,
                cart: newCard._id,
                role: dataUser.role
            })

             return done(null, newUser)

    } catch (error) {
        
            done(error)

    }

    }))

    passport.use(
        'login', 
    new LocalStrategy(
        {usernameField: 'email'},
         async(username, password, done)=>{

        try {
                const user = await userController.getByEmail(username);

                if (!user) {
                    return done(null, false, {message: 'User not found'});
                    
                }

                if (!comparePassword(user, password)) {
                    return done(null, false, {message: 'Invalid data'});
                }

                return done(null, user)

        } catch (error) {
            done(error)
        }
    }
    
    ))


//Github strategy
    passport.use('github', new GitHubStrategy(
        {
            clientID: config.CLIENT_ID,
            clientSecret: config.CLIENT_SECRET,
            callbackURL: 'http://localhost:8080/api/sessions/githubcallback'

        }, //Aca entonces me estaria conectando a la applicacion que hemos creado en github
        async(accessToken, refreshToken, profile, done) =>{
                
                try {

                    req.logger.debug(profile); 
                let user = await userController.getByEmail(profile._json.email) //Aqui creo una variable user para traer de mongo el usuario cuyo email coincida con lo que me viene de profile
                if(!user){

                        let newUser = {
                                first_name: profile._json.name,
                                last_name: "",
                                email: profile._json.email,
                                password: ''
                        };

                        user = await userController.createUser(newUser)
                        done(null, user);
                }else{
                    done(null, user)
                }
                    
                } catch (error) {

                    done(null, error)
                    
                }
            
        }
    
    ))
    

    const cookieExtractor =(req) => {
        let token = null;
        if (req && req.cookies) {
            token = req.cookies['UserToken'];
        }
        return token;
    }

    passport.use(
		'current',
		new jwtStrategy(
			{
				jwtFromRequest: jwtExtract.fromExtractors([cookieExtractor]),
				secretOrKey: 'privatekey',
			},
			(payload, done) => {
				done(null, payload);
			}
		),
		async (payload, done) => {
			try {
				return done(null, payload);
			} catch (error) {
				done(error);
			}
		}
	);



passport.serializeUser((user, done)=>{
    done(null, user._id); 
})
passport.deserializeUser(async (id, done)=>{

        const user = await userController.getById(id)
if (user.role = "admin") {
    user.admin = true
}
else{
    user.admin = false;
}

        done(null, user)

})

}

export default inicializePassport