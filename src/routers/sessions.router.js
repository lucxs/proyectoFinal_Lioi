import { Router } from 'express';
import passport from 'passport';
import { generateToken } from "../middlewares/jwt.middleware.js";

const sessionsRouter = Router();

sessionsRouter.get('/github',
passport.authenticate('github', {scope: ['user:email']}), 
async(req, res) => {});

sessionsRouter.get(
	'/githubcallback',
	passport.authenticate('github', { failureRedirect: '/login' }),
	(req, res) => {
		const user = req.user;
		const token=  generateToken(user);
		res.cookie("UserToken",token,{
			maxAge: 180000,
             httpOnly:true
		})
		res.redirect('/');
	}
);

sessionsRouter.get('/current',passport.authenticate('current',{session: false}),

(req,res)=>{

const user = req.user

})


export default sessionsRouter;